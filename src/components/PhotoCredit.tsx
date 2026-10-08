import { creditFor, type PhotoCreditEntry } from '../data/photoCredits';
import { creditPrefix } from '../data/photoCredit';
import { PHOTO_BY, PHOTOS_BY, type Locale } from '../data/restaurants';

/**
 * "rajattu" lukijan kielellä: CC BY 4.0 §3(a)(1)(B) vaatii kertomaan muokkauksesta
 * (`modified` photoCredits.ts:ssä). Sana samaa sarjaa kuin verkoston muut krediitit.
 */
const CROPPED: Record<Locale, string> = {
  en: 'cropped', fi: 'rajattu', de: 'zugeschnitten', ja: 'トリミング', es: 'recortada', 'pt-BR': 'recortada',
  'zh-CN': '已裁剪', ko: '잘라냄', fr: 'recadrée', it: 'ritagliata', nl: 'bijgesneden', sv: 'beskuren',
};

/** Sulkeet: ja ja zh täysleveinä verkoston kanonin mukaan, muissa välilyönti eteen. */
const PARENS: Partial<Record<Locale, [string, string]>> = { ja: ['（', '）'], 'zh-CN': ['（', '）'] };

function CreditLinks({ c, linkClass, locale }: { c: PhotoCreditEntry; linkClass: string; locale: Locale }) {
  return (
    <>
      {c.author},{' '}
      <a href={c.licenseUrl} target="_blank" rel="license noopener" className={`lv-tap whitespace-nowrap ${linkClass}`}>
        {c.license}
      </a>
      ,{' '}
      <a href={c.sourceUrl} target="_blank" rel="noopener" className={`lv-tap whitespace-nowrap ${linkClass}`}>
        Wikimedia Commons
      </a>
      {c.modified && <>, {CROPPED[locale]}</>}
    </>
  );
}

/**
 * Avoimen lisenssin kuvan tekijä ja lisenssi kuvan päälle, oikeaan alakulmaan
 * (Vesa 23.9.2026: "kuvatiedot pitää olla aina oikea alalaita"). Vain kuville, joilla
 * on rivi `photoCredits.ts`:ssä; muille ei piirry mitään.
 *
 * Käytä vain kun kuva EI ole linkin sisällä (hero, kaupunkikaista). Linkkikorteissa
 * merkintä tulee ruudukon alle (`CreditRow`), koska linkkiä ei saa sisäkkäistää.
 *
 * Kontrasti: valkoinen musta/60-pohjalla on puhtaan valkoisen kuvan päälläkin yli
 * 4,5:1, koska pohja on kiinteä eikä kuvan varassa. `rel` sisältää `noopener` mutta
 * EI `noreferrer` (verkoston sääntö). Pienet linkit saavat `lv-tap`-osuma-alueen.
 */
export default function PhotoCredit({ src, locale, className = '' }: { src?: string; locale: Locale; className?: string }) {
  const c = creditFor(src);
  if (!c) return null;
  return (
    <p className={`absolute bottom-0 right-0 z-10 max-w-full rounded-tl bg-black/60 px-1.5 py-[2px] text-[10px] leading-tight text-white ${className}`}>
      {creditPrefix(PHOTO_BY[locale], locale)}
      <CreditLinks c={c} locale={locale} linkClass="underline decoration-white/50 underline-offset-2 hover:decoration-white" />
    </p>
  );
}

/**
 * Linkkikorttien ruudukon kuvien lähteet yhtenä rivinä ruudukon alla, korttien
 * järjestyksessä (Vesa 26.9.2026, sama malli kuin GridPhotoCredits):
 * "Kuvat: Rovaniemi (Floppyjb, CC BY-SA 4.0, Wikimedia Commons) · …".
 * Rivissä ovat vain kortit, joiden kuvalla on avoimen lisenssin tekijätieto.
 */
export function CreditRow({ items, locale, className = '' }: { items: { label: string; src?: string }[]; locale: Locale; className?: string }) {
  const rows = items.flatMap((it) => {
    const c = creditFor(it.src);
    return c ? [{ label: it.label, c }] : [];
  });
  if (rows.length === 0) return null;
  const [open, close] = PARENS[locale] ?? [' (', ')'];
  return (
    <p data-lv-kuvalahteet="" className={`text-center text-base leading-snug text-cream/75 ${className}`}>
      {creditPrefix(PHOTOS_BY[locale], locale)}
      {rows.map((r, i) => (
        <span key={r.label + i}>
          {i > 0 && <>&nbsp;· </>}
          {r.label}
          {open}
          <CreditLinks c={r.c} locale={locale} linkClass="underline decoration-cream/40 underline-offset-2 hover:text-cream" />
          {close}
        </span>
      ))}
    </p>
  );
}
