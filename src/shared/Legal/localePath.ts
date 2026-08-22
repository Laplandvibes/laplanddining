/**
 * Locale-aware internal-path builder for the shared LaplandVibes Legal
 * components.
 *
 * Mirrors each site's `LOCALE_PATH_PREFIX` / `localisedPath`
 * (`src/i18n/config.ts`) so internal <Link> targets inside `shared/` carry the
 * active locale prefix. Without this, clicking "Privacy Policy" from
 * `/fi/cookie-policy` jumps to the English `/privacy` instead of `/fi/privacy`.
 *
 * Kept self-contained (no import from any single site's config) because
 * `shared/` is consumed by 21+ sites via relative import and cannot reach into
 * one site's `useLocale()` / config.
 */

export type LegalLang =
  | 'en'
  | 'fi'
  | 'de'
  | 'ja'
  | 'es'
  | 'pt-BR'
  | 'zh-CN'
  | 'ko'
  | 'fr'
  | 'it'
  | 'nl'
  | 'sv';

// locale -> URL segment, identical to each site's LOCALE_PATH_PREFIX
// (note pt-BR -> br, zh-CN -> cn, ko -> kr).
const LOCALE_SEGMENT: Record<LegalLang, string> = {
  en: '',
  fi: 'fi',
  de: 'de',
  ja: 'ja',
  es: 'es',
  'pt-BR': 'br',
  'zh-CN': 'cn',
  ko: 'kr',
  fr: 'fr',
  it: 'it',
  nl: 'nl',
  sv: 'sv',
};

/**
 * Uutiskirjeen peruutussivun ABSOLUUTTINEN osoite.
 *
 * 🔴 Peruutussivu on olemassa VAIN hubilla (laplandvibes.com/<locale>/unsubscribe/),
 * koska uutiskirjelista on yksi koko verkostolle. Spoke-sivustoilla suhteellinen
 * `/unsubscribe` osuu SPA-fallbackiin: HTTP 200 mutta renderöity sivu on sivuston
 * oma 404 ("Eksyksissä Lapissa"), joten naiivi statustarkistus ei paljasta sitä.
 * Mitattu renderöidystä DOMista 2026-08-07 (auditti 4.8., löydös oli laplandbarsilla).
 */
export function hubUnsubscribeUrl(lang: LegalLang = 'en'): string {
  return `https://laplandvibes.com${localePath('/unsubscribe', lang)}`;
}

export function localePath(path: string, lang: LegalLang = 'en'): string {
  const seg = LOCALE_SEGMENT[lang] ?? '';
  const base = seg ? (path === '/' ? `/${seg}` : `/${seg}${path}`) : path;
  // Trailing slash to match the canonical URL, the sitemap and the hreflang set,
  // which have always carried it. Without it Cloudflare Pages answers a 308 and
  // Googlebot crawls two URLs per page: laplandluxuryvillas' Search Console
  // counted 328 pages in the "page with redirect" bucket on 2026-08-02, its
  // single largest not-indexed reason and pure crawl waste. Prerender writes
  // `<route>/index.html`, so the slashed form is the natural one on every site.
  return base.endsWith('/') || base.includes('#') || base.includes('?') ? base : `${base}/`;
}
