// 2026-05-21: hreflang × 11 + og:locale + html lang.
import { useEffect } from 'react';
import { useLocale } from './useLocale';
import { SUPPORTED_LOCALES, LOCALE_BCP47, localePrefix } from './config';
import type { Locale } from './config';

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US', fi: 'fi_FI', de: 'de_DE', ja: 'ja_JP', es: 'es_ES',
  'pt-BR': 'pt_BR', 'zh-CN': 'zh_CN', ko: 'ko_KR', fr: 'fr_FR', it: 'it_IT', nl: 'nl_NL',
};

export default function Hreflang({
  path,
  origin = 'https://laplanddining.com',
}: {
  path: string;
  origin?: string;
}) {
  const { locale } = useLocale();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const suffix = cleanPath === '/' ? '' : cleanPath;
  // Trailing-slash form matches the prerendered static HTML (Cloudflare Pages
  // serves /path/index.html at /path/ with 200; the no-slash form 308-redirects).
  const urlFor = (loc: Locale) => {
    const prefix = localePrefix(loc);
    return `${origin}${prefix}${suffix}`.replace(/\/?$/, '/');
  };
  const enUrl = urlFor('en');
  const canonical = urlFor(locale);

  useEffect(() => {
    document.documentElement.lang = LOCALE_BCP47[locale];
  }, [locale]);

  return (
    <>
      <link rel="canonical" href={canonical} />
      {/* Short hreflang codes (en, fi, pt-BR, …) — must match the prerenderer
          (_prerender_routes.mjs) and sitemap.xml exactly. */}
      {SUPPORTED_LOCALES.map((loc) => (
        <link key={loc} rel="alternate" hrefLang={loc} href={urlFor(loc)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      <meta property="og:locale" content={OG_LOCALE[locale]} />
      {SUPPORTED_LOCALES.filter((l) => l !== locale).map((l) => (
        <meta key={l} property="og:locale:alternate" content={OG_LOCALE[l]} />
      ))}
    </>
  );
}
