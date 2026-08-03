/**
 * GetYourGuide deep-link helper for laplanddining.com — Workerin kautta
 * 2026-08-03 alkaen.
 *
 * Tämä tiedosto rakensi aiemmin raakoja getyourguide.com-URLeja perusteella
 * "Worker collapses every slug to GYG's homepage (2026-05-02)". Väite ei pidä
 * enää paikkaansa: se oli curl-bot-fallback-artefakti, ja Worker on 2026-08-02
 * lähtien hoitanut slugin, /s?q=-haun JA kielen polkuprefiksin (`language=`-
 * parametri → GYG:n `<kieli>-<maa>/`-etuliite, ainoa lokalisointi jota GYG
 * kunnioittaa — raaka ?language= on GYG:llä no-op). Suora linkitys menettäisi
 * D1-klikkilokin ja veisi partner_id:n bundleen; Worker injektoi partner_id:n
 * ja cmp=lv_<domain>_<sid>:n itse.
 *
 * 2026-05-03 (Vesa flag): GYG does NOT have category landing pages for
 * `cooking-classes` or `food-tours` slugs — stable category: `food-and-drink`.
 * Anything more specific must use search URLs which always render results.
 */

import type { Locale } from '../i18n/config';

const GO = 'https://go.laplandvibes.com/go/activities';

/**
 * Worker `?language=` codes (same table as shared/gyg/picks.ts). `en` is GYG's
 * default and needs no param; `de` needs a code here even though the old raw
 * links didn't send one — they used the getyourguide.de domain instead.
 */
export const GYG_WORKER_LANG: Record<Locale, string | undefined> = {
  en: undefined, fi: 'fi', de: 'de', ja: 'ja', es: 'es', 'pt-BR': 'pt-br',
  'zh-CN': 'zh', ko: 'ko', fr: 'fr', it: 'it', nl: 'nl', sv: 'sv',
};

function workerUrl(path: string, params: Record<string, string | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) p.set(k, v);
  return `${GO}${path ? `/${path}` : ''}?${p.toString()}`;
}

/**
 * Build a deep link to a specific GYG product (food tour, cooking class,
 * brewery tour with food, etc.).
 *
 * @param productPath  Full path component after `getyourguide.com/`.
 *                     Format: `{city-slug}-l{cityId}/{product-slug}-t{productId}`.
 * @param sid          Per-placement campaign tag, e.g. `dining_rovaniemi_food_tours`.
 * @param lang         Sivun kieli — Worker kääntää kielipolkuprefiksiksi.
 */
export function gygDeepLink(productPath: string, sid: string, lang: Locale = 'en'): string {
  const path = productPath.replace(/^\/+/, '').replace(/\/+$/, '');
  return workerUrl(path, { sid, language: GYG_WORKER_LANG[lang] });
}

/**
 * Build a deep link to a category-level GYG page. Only `food-and-drink` is a
 * verified-working slug for Lapland and Finnish cities (2026-05-03).
 */
export function gygCategoryLink(
  citySlug: string,
  category: 'food-and-drink',
  sid: string,
  lang: Locale = 'en',
): string {
  return workerUrl(`${citySlug}/${category}`, { sid, language: GYG_WORKER_LANG[lang] });
}

/**
 * Build a GetYourGuide search link (Worker rakentaa /s?q=-haun — ainoa URL
 * jossa GYG kunnioittaa q:ta). Always returns a results page.
 */
export function gygSearchLink(query: string, sid: string, lang: Locale = 'en'): string {
  return workerUrl('', { sid, language: GYG_WORKER_LANG[lang], q: query });
}
