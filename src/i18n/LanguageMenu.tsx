import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import { localeFlag } from './flags';

/**
 * KANONINEN KIELIVALITSIN — koko LV-verkosto (28 sivustoa).
 *
 * Vesa 2026-09-10: *"voitko vaihtaa kaikkialle kielivalitsemeen lipun kuva, ja
 * varmistaa että alavetovalikko on firm ja nuolet ja muut optimoitu? toisi
 * mielestäni enemmän kansainvälisen fiiliksen kun valikon aukaisisi."*
 *
 * Neljä mitattua asiaa, jotka tämä korjaa — älä palauta mitään niistä:
 *
 * 1. 🔴 EI NATIIVIA <select>:iä. Vanha toteutus näytti pudotusvalikon vain
 *    `lg`/`xl`-leveydellä ja natiivin selectin sen alla. `<option>` ei voi
 *    näyttää kuvaa missään selaimessa, joten lippu olisi jäänyt kokonaan pois
 *    mobiilista — eli juuri sieltä missä liikenne on. Sama komponentti kaikilla
 *    leveyksillä. Sivutuotteena katosi myös 1024–1279 px:n epäjatkuvuus (18
 *    sivustoa käytti `xl:`, 6 käytti `lg:`) ja laplandactivitiesin tuplavalitsin
 *    (`hidden lg:flex` + `xl:hidden` renderöivät molemmat 1024–1279 px:ssä).
 *
 * 2. 🔴 PANEELI ON LÄPINÄKYMÄTÖN. Mitattu 10.9.2026: paneelin tausta oli
 *    `bg-deep-night/95`, `/90`, `/85` — ja laplandvisitillä `/55`. Sen läpi
 *    näkyy hero, ja valikko lukee keskeneräisenä ("ei ole firm"). Tässä tausta
 *    on kiinteä hex ilman alfaa; `backdrop-blur` on tehoste, ei tausta, eikä se
 *    piirry lainkaan jos selain ei tue sitä.
 *
 * 3. 🔴 YKSI NUOLI, JA SE ON MEIDÄN. Natiivin selectin OS-nuoli oli jo kerran
 *    korjattu koko verkostoon (`appearance-none` + oma ChevronDown, 2026-07-12).
 *    Kun select poistuu, ongelma poistuu juurineen: jäljelle jää yksi chevron,
 *    joka kääntyy 180° auki. Riveillä ei ole nuolia — valittu rivi merkitään
 *    check-ikonilla, koska rivi ei vie pois vaan valitsee.
 *
 * 4. 🔴 LIPPU ON SVG, EI EMOJI. Windows Chromella ei ole lippufonttia: 🇫🇮
 *    piirtyy kirjaimina "FI" (mitattu appilla 2026-09-01). Liput tulevat
 *    `flags.ts`:stä data-URI:na — ei HTTP-pyyntöä, ei 404:ää, ei välimuistin
 *    versio-ongelmaa.
 *
 * Rivikorkeus 44 px mobiilissa / 40 px sm+ noudattaa laplandgiftsin jo
 * hyväksyttyä linjaa (Vesa 2026-07-03). Kaikki 12 riviä ovat samanlevyisiä ja
 * -korkuisia — se on mitattavissa `getBoundingClientRect()`:llä, ja portti
 * `scripts/audit_language_switcher.mjs` mittaa sen.
 *
 * iOS-huomio: 16 px:n sääntö koski `<select>`-kenttää (Safari zoomaa siihen
 * alle 16 px:n tekstillä). `<button>` ei zoomaa, joten koodi saa olla 12 px.
 */

export interface LanguageOption {
  /** i18n-koodi, esim. 'fi', 'pt-BR'. */
  code: string;
  /** Lyhyt merkintä liipaisimessa, esim. 'FI', 'BR'. */
  label: string;
  /** Kielen oma nimi listassa, esim. 'Suomi', 'Português'. */
  native: string;
  /** Kohdeosoite. Jos puuttuu, rivi on <button> ja kutsuu onSelect. */
  href?: string;
  /** hreflang-attribuutti; oletus = code. */
  hrefLang?: string;
}

interface Props {
  /** Nykyinen kieli. */
  locale: string;
  /** Kaikki kielet siinä järjestyksessä kuin ne näytetään. */
  items: LanguageOption[];
  /** Navin pohjan sävy. Vaalealla navilla 'light'. */
  tone?: 'dark' | 'light';
  /** 'pill' = reunustettu nappi (navi), 'inline' = paljas teksti (footer). */
  variant?: 'pill' | 'inline';
  /** Saavutettava nimi, käännettynä. */
  label?: string;
  /** Paneelin reunustus suhteessa liipaisimeen. */
  align?: 'right' | 'left';
  /** Kutsutaan valinnan jälkeen (esim. i18n.changeLanguage sivustoilla joilla ei ole URL-prefiksiä). */
  onSelect?: (code: string) => void;
  className?: string;
}

const STORAGE_KEY = 'lv_locale_choice';
const ANIM_STYLE_ID = 'lv-lang-menu-anim';

/** Lipun kuva. alt="" — lippu on koriste, kielen nimi on viereisessä tekstissä. */
export function Flag({ code, className = 'w-5 h-[14px]' }: { code: string; className?: string }) {
  const src = localeFlag(code);
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={20}
      height={14}
      loading="eager"
      decoding="async"
      className={`${className} shrink-0 rounded-[2px] object-cover ring-1 ring-black/20`}
    />
  );
}

export default function LanguageMenu({
  locale,
  items,
  tone = 'dark',
  variant = 'pill',
  label = 'Change language',
  align = 'right',
  onSelect,
  className = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const dark = tone === 'dark';
  const current = items.find((i) => i.code === locale) ?? items[0];

  const close = useCallback((focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  // Avautumisanimaatio ilman kirjastoa. Framer Motion on verkostossa kielletty.
  //
  // 🔴 ANIMOI VAIN LIIKETTÄ, EI LÄPINÄKYVYYTTÄ. Selain pysäyttää sekä
  // CSS-transitiot, CSS-animaatiot että requestAnimationFramen kun välilehti ei
  // ole näkyvissä. Mitattu 10.9.2026: kumpikin ensin kokeiltu toteutus jätti
  // paneelin `opacity: 0`:aan piilotetussa selainpaneelissa — valikko oli
  // DOMissa mutta näkymätön. Kun animoitava ominaisuus on pelkkä `transform`,
  // pysähtynyt animaatio näyttää valikon 4 pikseliä ylempänä ja 2 % pienempänä
  // — huomaamattoman väärin sen sijaan että se olisi kokonaan poissa. Vika
  // kaatuu oikeaan suuntaan, ja se on koko valinnan syy.
  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(ANIM_STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = ANIM_STYLE_ID;
    el.textContent =
      '@keyframes lvLangMenuIn{from{transform:translateY(-4px) scale(.98)}to{transform:none}}';
    document.head.appendChild(el);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
    };
  }, [open]);

  // Näppäimistö: nuolet liikuttavat, Enter valitsee, Esc sulkee ja palauttaa
  // fokuksen liipaisimeen. Vanhassa toteutuksessa oli vain Esc.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setCursor(Math.max(0, items.findIndex((i) => i.code === locale)));
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (c + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (c - 1 + items.length) % items.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCursor(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setCursor(items.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      const el = listRef.current?.querySelectorAll<HTMLElement>('[data-lang-option]')[cursor];
      if (el) {
        e.preventDefault();
        el.click();
      }
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open || cursor < 0) return;
    listRef.current
      ?.querySelectorAll<HTMLElement>('[data-lang-option]')
      [cursor]?.scrollIntoView({ block: 'nearest' });
  }, [open, cursor]);

  const pick = (code: string) => {
    try {
      window.localStorage?.setItem(STORAGE_KEY, code);
    } catch {
      /* private mode */
    }
    onSelect?.(code);
    setOpen(false);
  };

  const trigger =
    variant === 'pill'
      ? `inline-flex h-11 sm:h-9 items-center gap-2 rounded-full border pl-2 pr-2.5 sm:pr-3 transition-colors duration-200 ${
          dark
            ? 'border-white/30 bg-white/5 text-snow hover:border-vibe-pink hover:bg-white/10'
            : 'border-black/15 bg-black/[0.04] text-deep-night hover:border-vibe-pink hover:bg-black/[0.07]'
        }`
      : `inline-flex h-11 sm:h-9 items-center gap-2 rounded-md px-1.5 transition-colors duration-200 ${
          dark ? 'text-snow/85 hover:text-snow' : 'text-deep-night/85 hover:text-deep-night'
        }`;

  return (
    <div className={`relative ${className}`} ref={wrapRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setCursor(Math.max(0, items.findIndex((i) => i.code === locale)));
          setOpen((o) => !o);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${current?.native ?? locale}`}
        className={trigger}
      >
        <Flag code={locale} className="w-[22px] h-4" />
        {/* Koodi piiloon alle 400 px:n: lippu yksin on kapeampi kuin vanha
            select, joten navi ei ylivuoda 360 px:ssä. Kieli on silti luettavissa
            ruudunlukijalle aria-labelista. */}
        <span className="hidden min-[400px]:inline text-[12px] font-semibold uppercase tracking-[0.14em] leading-none">
          {current?.label ?? locale.toUpperCase()}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`w-3.5 h-3.5 shrink-0 opacity-70 transition-transform duration-200 motion-reduce:transition-none ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={label}
          className={[
            'absolute z-50 mt-2 w-60 max-w-[calc(100vw-1.5rem)] overflow-y-auto overscroll-contain p-1.5',
            'rounded-xl border shadow-2xl',
            // 12 kieltä mahtuu kerralla näkyviin sekä työpöydällä (12 × 40 px +
            // reunat = 492 px) että puhelimessa (12 × 44 px = 540 px, 78vh =
            // 633 px 812 px:n ruudulla). Ilman tätä listaan tuli vierityspalkki,
            // joka söi rivin leveydestä 14 px ja teki valikosta hötkyisen.
            'max-h-[min(78vh,34rem)]',
            'origin-top animate-[lvLangMenuIn_150ms_ease-out] motion-reduce:animate-none',
            align === 'right' ? 'right-0' : 'left-0',
            // Kiinteä hex, ei alfaa — tämä on se "firm".
            dark
              ? 'bg-[#0F172A] border-white/12 shadow-black/60'
              : 'bg-white border-black/10 shadow-black/25',
          ].join(' ')}
        >
          {items.map((item, i) => {
            const active = item.code === locale;
            const focused = i === cursor;
            const inner = (
              <>
                <Flag code={item.code} className="w-6 h-[17px]" />
                <span className="flex-1 truncate text-left text-sm">{item.native}</span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.14em] tabular-nums ${
                    dark ? 'text-snow/40' : 'text-deep-night/40'
                  }`}
                >
                  {item.label}
                </span>
                {active ? (
                  <Check className="w-4 h-4 shrink-0 text-vibe-pink" aria-hidden="true" />
                ) : (
                  <span className="w-4 shrink-0" aria-hidden="true" />
                )}
              </>
            );
            // Jokainen rivi on tarkalleen saman korkuinen ja levyinen — ei
            // poikkeuksia pitkille nimille (Nederlands, Português, 简体中文).
            const rowCls = [
              'flex w-full items-center gap-3 rounded-lg px-2.5 h-11 sm:h-10 transition-colors duration-150 motion-reduce:transition-none',
              active
                ? 'bg-vibe-pink/12 font-semibold ' + (dark ? 'text-snow' : 'text-deep-night')
                : dark
                  ? 'text-snow/85 hover:bg-white/[0.07] hover:text-snow'
                  : 'text-deep-night/85 hover:bg-black/[0.05] hover:text-deep-night',
              focused ? (dark ? 'bg-white/[0.09]' : 'bg-black/[0.06]') : '',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-vibe-pink',
            ].join(' ');

            return (
              <li key={item.code} role="option" aria-selected={active}>
                {item.href ? (
                  <Link
                    data-lang-option
                    to={item.href}
                    hrefLang={item.hrefLang ?? item.code}
                    aria-current={active ? 'true' : undefined}
                    onClick={() => pick(item.code)}
                    onMouseEnter={() => setCursor(i)}
                    className={rowCls}
                  >
                    {inner}
                  </Link>
                ) : (
                  <button
                    data-lang-option
                    type="button"
                    onClick={() => pick(item.code)}
                    onMouseEnter={() => setCursor(i)}
                    className={rowCls}
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
