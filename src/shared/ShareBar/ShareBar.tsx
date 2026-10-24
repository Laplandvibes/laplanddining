/**
 * Artikkelin jako koko verkostossa — shared/ShareBar/ (kanoninen lv-opsissa, sivustoilla vendoroitu
 * src/shared/ShareBar/). Vesa 24.10.2026, Visit Inari -juttu tietokoneella: "enhän mä voinut jakaa sitä
 * mitenkään!!!?? … kyllä yläosassakin voisi olla se jaa >> nappi" → "Tuo sama jakonappi ylös ja loppuun
 * kaikkien sivustojen artikkeli- ja uutissivuille 12 kielellä." Sääntö: muistin feedback_artikkelissa_jakonappi.
 *
 * Käyttö artikkelisivulla (kaksi paikkaa, molemmat pakollisia):
 *   <ShareButton lang={lang} title={title} excerpt={dek} />          otsikon / tekijärivin alle, omalle rivilleen
 *   <ShareBar lang={lang} title={title} tone="dark" />               jutun loppuun (vaalealla pohjalla tone="light")
 *
 * Puhelimella (kosketusnäyttö + navigator.share) nappi avaa laitteen oman jakovalikon. Tietokoneella se avaa
 * rivin suoria kohteita: Windowsin jakoikkuna ei tunne WhatsApp Webiä eikä Facebookia.
 * Ei riippuvuuksia sivuston i18n:ään eikä analytiikkaan: tekstit copy.ts, mittaus data-umami-event="share"
 * (+ share_open), verkko ja pinta (top/end) datassa — _jobs/06-mittaus.md: linkki-CTA attribuutilla.
 * Jaettava osoite = sivun oma kieliversio ilman kyselyä ja ankkuria.
 */
import { useState, type ReactElement } from 'react';
import { SHARE_COPY, shareLang } from './copy';

type Net = 'whatsapp' | 'facebook' | 'linkedin' | 'x' | 'email';
type Tone = 'dark' | 'light';
type IconProps = { className?: string };

const svg = (d: string) =>
  function Icon({ className = 'h-[18px] w-[18px]' }: IconProps) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
        <path d={d} />
      </svg>
    );
  };

const ICON: Record<Net | 'share' | 'link', (p: IconProps) => ReactElement> = {
  whatsapp: svg('M17.47 14.38c-.3-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.19-.24-.57-.48-.49-.66-.5-.17 0-.37-.02-.56-.02s-.5.07-.77.37c-.27.3-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3.01.15.2 2.06 3.14 4.99 4.4.7.3 1.24.48 1.66.62.7.22 1.33.19 1.83.12.56-.08 1.74-.71 1.98-1.4.24-.69.24-1.27.17-1.4-.07-.13-.27-.2-.57-.35Zm-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.86 9.86 0 1 1 8.37 4.63ZM20.52 3.45a11.83 11.83 0 0 0-18.6 14.27L0 24l6.43-1.69a11.82 11.82 0 0 0 5.65 1.44h.01a11.83 11.83 0 0 0 8.43-20.3Z'),
  facebook: svg('M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.19 2.24.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12Z'),
  linkedin: svg('M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z'),
  x: svg('M18.244 2H21.5l-7.51 8.59L23 22h-6.94l-5.43-7.1L4.4 22H1.13l8.04-9.2L1 2h7.1l4.91 6.49L18.24 2Zm-1.21 18h1.92L7.06 4H5.05l11.98 16Z'),
  email: svg('M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.3V17h16V7.3l-8 5.6-8-5.6ZM18.7 7H5.3L12 11.7 18.7 7Z'),
  share: svg('M18 16.1c-.8 0-1.5.3-2 .8l-7.1-4.1c.1-.3.1-.5.1-.8s0-.5-.1-.8l7-4.1c.5.5 1.3.8 2.1.8a3 3 0 1 0-3-3c0 .3 0 .5.1.8L8 9.8C7.5 9.3 6.8 9 6 9a3 3 0 1 0 0 6c.8 0 1.5-.3 2-.8l7.1 4.2c-.1.2-.1.5-.1.7a2.9 2.9 0 1 0 3-3Z'),
  link: svg('M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a1 1 0 1 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0ZM7.8 20a4.8 4.8 0 0 1-3.4-8.2l2.5-2.5a1 1 0 0 1 1.4 1.4l-2.5 2.5a2.8 2.8 0 0 0 4 4l2.5-2.5a1 1 0 0 1 1.4 1.4l-2.5 2.5A4.8 4.8 0 0 1 7.8 20Zm8.7-5.9a1 1 0 0 1-.7-1.7l2.5-2.5a2.8 2.8 0 0 0-4-4l-2.5 2.5a1 1 0 0 1-1.4-1.4l2.5-2.5a4.8 4.8 0 0 1 6.8 6.8l-2.5 2.5a1 1 0 0 1-.7.3Z'),
};

const NAME: Record<Exclude<Net, 'email'>, string> = { whatsapp: 'WhatsApp', facebook: 'Facebook', linkedin: 'LinkedIn', x: 'X' };

const pageUrl = () => (typeof window === 'undefined' ? '' : window.location.origin + window.location.pathname);

const href = (net: Net, url: string, title: string) => {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  switch (net) {
    case 'whatsapp': return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`;
    case 'facebook': return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case 'linkedin': return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    case 'x': return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
    case 'email': return `mailto:?subject=${t}&body=${encodeURIComponent(`${title}\n\n${url}`)}`;
  }
};

/** Vain kosketusnäytöllä: tietokoneen Chrome/Edge tukee navigator.sharea, mutta sen ikkuna ei tunne verkkopalveluita. */
const nativeShare = () =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function' &&
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const CHIP: Record<Tone, string> = {
  dark: 'border-white/15 bg-white/[0.05] text-white hover:border-[#EC4899] hover:text-[#F472B6]',
  light: 'border-[#0F172A]/15 bg-white text-[#0F172A] hover:border-[#DB2777] hover:text-[#BE185D]',
};
const BASE = 'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold no-underline transition-colors';

function Targets({ lang, title, surface, tone }: { lang?: string; title: string; surface: string; tone: Tone }) {
  const c = SHARE_COPY[shareLang(lang)];
  const [copied, setCopied] = useState(false);
  const url = pageUrl();
  const cls = `${BASE} ${CHIP[tone]}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch { /* leikepöytä estetty: osoite on yhä osoiterivillä */ }
  };
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0" role="list">
      {(['whatsapp', 'facebook', 'linkedin', 'x', 'email'] as const).map((net) => {
        const Icon = ICON[net];
        return (
          <li key={net} className="m-0 p-0">
            <a
              href={href(net, url, title)}
              target={net === 'email' ? undefined : '_blank'}
              rel={net === 'email' ? undefined : 'noopener'}
              className={cls}
              data-umami-event="share"
              data-umami-event-network={net}
              data-umami-event-surface={surface}
            >
              <Icon />
              {net === 'email' ? c.email : NAME[net]}
            </a>
          </li>
        );
      })}
      <li className="m-0 p-0">
        <button
          type="button"
          onClick={copy}
          className={cls}
          data-umami-event="share"
          data-umami-event-network="copy"
          data-umami-event-surface={surface}
        >
          <ICON.link />
          <span aria-live="polite">{copied ? c.copied : c.copy}</span>
        </button>
      </li>
    </ul>
  );
}

/** "Jaa ›" otsikon / tekijärivin alla. Puhelimella laitteen jakovalikko, tietokoneella kohteet napin alle. */
export function ShareButton({ lang, title, excerpt, tone = 'dark', className = '' }: {
  lang?: string; title: string; excerpt?: string; tone?: Tone; className?: string;
}) {
  const c = SHARE_COPY[shareLang(lang)];
  const [open, setOpen] = useState(false);
  const click = async () => {
    if (nativeShare()) {
      try { await navigator.share({ title, text: excerpt, url: pageUrl() }); } catch { /* peruttu */ }
      return;
    }
    setOpen((o) => !o);
  };
  return (
    <div className={className}>
      <button
        type="button"
        onClick={click}
        aria-expanded={open}
        className={`${BASE} ${CHIP[tone]}`}
        data-umami-event="share_open"
        data-umami-event-surface="top"
      >
        <ICON.share />
        {c.button}
        <span aria-hidden="true">›</span>
      </button>
      {open && (
        <div className="mt-3">
          <Targets lang={lang} title={title} surface="top" tone={tone} />
        </div>
      )}
    </div>
  );
}

/** Jutun loppu: otsikko + kohteet aina näkyvissä. headingClassName = sivuston oma otsikkofontti tarvittaessa. */
export default function ShareBar({ lang, title, tone = 'dark', className = '', headingClassName = 'font-heading text-2xl tracking-wide' }: {
  lang?: string; title: string; tone?: Tone; className?: string; headingClassName?: string;
}) {
  const c = SHARE_COPY[shareLang(lang)];
  return (
    <section
      className={`not-prose mt-12 border-t pt-8 ${tone === 'light' ? 'border-[#0F172A]/12' : 'border-white/12'} ${className}`}
    >
      <h2 className={`mb-4 ${tone === 'light' ? 'text-[#0F172A]' : 'text-white'} ${headingClassName}`}>{c.heading}</h2>
      <Targets lang={lang} title={title} surface="end" tone={tone} />
    </section>
  );
}
