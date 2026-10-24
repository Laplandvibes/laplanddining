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

/**
 * Nimilapun etuliite ("Kuva:", "Lähde:", "Lähteet:") lukijan kielen välimerkein (08-natiivikaannos sääntö 15):
 * ja/zh täysleveä kaksoispiste ilman väliä, fr sitova väli (U+00A0) ennen kaksoispistettä, muut "Sana: ".
 * Kielitiedostojen välimerkit tarkistaa news-prerender.mjs, mutta tämä kaksoispiste syntyy vasta koodissa.
 * laplandtransportin kopiosta (2.10.2026), tuotu tähän 24.10.2026 — kaikki yhdeksän uutismoduulin kopiota nyt samoin.
 */
export function labelPrefix(word: string, lang: NewsLang): string {
  if (lang === 'ja' || lang === 'zh-CN') return `${word}：`;
  if (lang === 'fr') return `${word}\u00a0: `;
  return `${word}: `;
}

/** Luettelo lukijan kielen erottimella: ja/zh 、 (samanlaisten luettelo), muut ", ". 08-natiivikaannos sääntö 19. */
export function joinList(items: string[], lang: NewsLang): string {
  return items.join(lang === 'ja' || lang === 'zh-CN' ? '、' : ', ');
}
