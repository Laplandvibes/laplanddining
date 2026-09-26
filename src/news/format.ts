import type { NewsLang } from './types';

/**
 * Päivämäärän esitysmuoto lukijan kielellä. Englanti brittimuodossa ("18 September
 * 2026"): sivuston en-markkina on Britannia (OpenSEO 2826), ja jutun oma teksti
 * kirjoittaa päivät samassa järjestyksessä — en-US antaisi "September 18, 2026".
 */
const DATE_LOCALE: Record<NewsLang, string> = {
  en: 'en-GB', fi: 'fi-FI', de: 'de-DE', ja: 'ja-JP', es: 'es-ES', 'pt-BR': 'pt-BR',
  'zh-CN': 'zh-CN', ko: 'ko-KR', fr: 'fr-FR', it: 'it-IT', nl: 'nl-NL', sv: 'sv-SE',
};

export function formatDate(iso: string, lang: NewsLang): string {
  const [y, m, d] = iso.split('-').map(Number);
  try {
    return new Intl.DateTimeFormat(DATE_LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(Date.UTC(y, m - 1, d)));
  } catch {
    return iso;
  }
}
