/**
 * Uutisosion rekisteri: jutut löytyvät kansiosta, erillistä listaa ei ole.
 * Uusi juttu = uusi kansio articles/<slug>/ (meta.json + 12 kielitiedostoa).
 *
 * Kielitekstit ladataan laiskasti ja vain lukijan kieleltä: yksi juttu on
 * ~4–6 kt per kieli, joten 12 kieltä × N juttua ei kulje etusivun nipussa.
 * Lataus on välimuistissa (sama Promise joka renderöinnillä), jotta Reactin
 * `use()` voi odottaa sitä Suspense-rajan sisällä ilman latausvilkkua.
 */
import type { NewsLang, NewsMeta, NewsText, NewsUi } from './types';

const metaModules = import.meta.glob<NewsMeta>('./articles/*/meta.json', { eager: true, import: 'default' });
const textLoaders = import.meta.glob<NewsText>(['./articles/*/*.json', '!./articles/*/meta.json'], { import: 'default' });
const uiLoaders = import.meta.glob<NewsUi>('./i18n/*.json', { import: 'default' });

/** Uusin ensin (aikaan sidottu lista: tuleva/uusin ylimmäksi). */
export const ARTICLES: NewsMeta[] = Object.values(metaModules).sort(
  (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
);

export const ARTICLE_BY_SLUG: Record<string, NewsMeta> = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

const textCache = new Map<string, Promise<NewsText>>();
export function loadText(slug: string, lang: NewsLang): Promise<NewsText> {
  const key = `${slug}:${lang}`;
  let p = textCache.get(key);
  if (!p) {
    const own = textLoaders[`./articles/${slug}/${lang}.json`];
    const en = textLoaders[`./articles/${slug}/en.json`];
    // Portti (scripts/news-prerender.mjs) kaataa buildin jos kielitiedosto puuttuu,
    // joten varapolku on vain kehitystä varten — tuotannossa sitä ei käytetä.
    const loader = own ?? en;
    p = loader ? loader() : Promise.reject(new Error(`news: no text for ${key}`));
    textCache.set(key, p);
  }
  return p;
}

const allCache = new Map<string, Promise<Record<string, NewsText>>>();
export function loadAllTexts(lang: NewsLang): Promise<Record<string, NewsText>> {
  let p = allCache.get(lang);
  if (!p) {
    p = Promise.all(ARTICLES.map((a) => loadText(a.slug, lang).then((t) => [a.slug, t] as const)))
      .then((pairs) => Object.fromEntries(pairs));
    allCache.set(lang, p);
  }
  return p;
}

const uiCache = new Map<string, Promise<NewsUi>>();
export function loadUi(lang: NewsLang): Promise<NewsUi> {
  let p = uiCache.get(lang);
  if (!p) {
    const loader = uiLoaders[`./i18n/${lang}.json`] ?? uiLoaders['./i18n/en.json'];
    p = loader();
    uiCache.set(lang, p);
  }
  return p;
}
