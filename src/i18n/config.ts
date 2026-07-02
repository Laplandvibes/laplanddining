import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Static EN imports — kept synchronous so the page always has SOMETHING to
// render even before the user's chosen locale chunk arrives. This means EN is
// the only locale baked into the main bundle; every other locale lives in its
// own chunk fetched on demand.
import enCommon from '../locales/en/common.json';
import enNav from '../locales/en/nav.json';
import enPages from '../locales/en/pages.json';

export const SUPPORTED_LOCALES = ['en', 'fi', 'de', 'ja', 'es', 'pt-BR', 'zh-CN', 'ko', 'fr', 'it', 'nl'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_PATH_PREFIX: Record<Locale, string> = {
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
};

export function localePrefix(locale: Locale): string {
  const seg = LOCALE_PATH_PREFIX[locale];
  return seg ? `/${seg}` : '';
}

const PREFIX_TO_LOCALE: Record<string, Locale> = {
  fi: 'fi',
  de: 'de',
  ja: 'ja',
  es: 'es',
  br: 'pt-BR',
  cn: 'zh-CN',
  kr: 'ko',
  fr: 'fr',
  it: 'it',
  nl: 'nl',
};

export function localeFromSegment(seg: string | undefined): Locale {
  if (!seg) return DEFAULT_LOCALE;
  return PREFIX_TO_LOCALE[seg] ?? DEFAULT_LOCALE;
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  fi: 'FI',
  de: 'DE',
  ja: 'JA',
  es: 'ES',
  'pt-BR': 'BR',
  'zh-CN': 'CN',
  ko: 'KR',
  fr: 'FR',
  it: 'IT',
  nl: 'NL',
};

export const LOCALE_NATIVE: Record<Locale, string> = {
  en: 'English',
  fi: 'Suomi',
  de: 'Deutsch',
  ja: '日本語',
  es: 'Español',
  'pt-BR': 'Português',
  'zh-CN': '简体中文',
  ko: '한국어',
  fr: 'Français',
  it: 'Italiano',
  nl: 'Nederlands',
};

export const LOCALE_BCP47: Record<Locale, string> = {
  en: 'en-US',
  fi: 'fi-FI',
  de: 'de-DE',
  ja: 'ja-JP',
  es: 'es-ES',
  'pt-BR': 'pt-BR',
  'zh-CN': 'zh-CN',
  ko: 'ko-KR',
  fr: 'fr-FR',
  it: 'it-IT',
  nl: 'nl-NL',
};

export const NS = ['common', 'nav', 'pages'] as const;
type Namespace = (typeof NS)[number];

/**
 * Dynamic loader for one (locale, namespace) JSON file. Vite's static analysis
 * of `import('../locales/${lang}/${ns}.json')` emits a separate chunk per
 * matched file, so a /kr visitor only downloads the 3 KO JSON files, not the
 * 33 we used to ship in the main bundle.
 *
 * EN is intentionally NOT loaded here — it's eager-imported above as a
 * baked-in fallback, so the app can render before any async load completes.
 */
async function loadNamespace(lang: string, ns: string): Promise<Record<string, unknown>> {
  const mod = await import(`../locales/${lang}/${ns}.json`);
  return mod.default ?? mod;
}

// Static EN resources — baked into the main bundle as the fallback.
const enResources = {
  en: { common: enCommon, nav: enNav, pages: enPages },
};

// Detect language from URL pathname (`/fi/...` → fi, `/br/...` → pt-BR, etc.).
function detectFromPath(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const seg = window.location.pathname.split('/').filter(Boolean)[0];
  return localeFromSegment(seg);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: enResources,
    lng: detectFromPath(),
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LOCALES as unknown as string[],
    ns: NS as unknown as string[],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: { order: ['path', 'navigator'], lookupFromPathIndex: 0 },
    react: { useSuspense: false },
    partialBundledLanguages: true,
  });

const inFlight = new Map<string, Promise<void>>();

/**
 * Load all namespaces for a locale and register them with i18next. Cached so
 * a repeat call (e.g. language switch back) is a no-op.
 */
export async function ensureLocaleLoaded(locale: Locale): Promise<void> {
  if (locale === 'en') return;
  const existing = inFlight.get(locale);
  if (existing) return existing;

  const task = (async () => {
    const loads = (NS as readonly Namespace[]).map(async (ns) => {
      if (i18n.hasResourceBundle(locale, ns)) return;
      try {
        const bundle = await loadNamespace(locale, ns);
        i18n.addResourceBundle(locale, ns, bundle, true, true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[i18n] Failed to load ${locale}/${ns}`, err);
      }
    });
    await Promise.all(loads);
  })();

  inFlight.set(locale, task);
  return task;
}

// Wrap changeLanguage so the bundle is loaded before the language switch.
const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = (async (lng?: string, ...rest: unknown[]) => {
  if (lng && (SUPPORTED_LOCALES as readonly string[]).includes(lng)) {
    await ensureLocaleLoaded(lng as Locale);
  }
  // @ts-expect-error — preserve original variadic signature
  return originalChangeLanguage(lng, ...rest);
}) as typeof i18n.changeLanguage;

export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(fi|de|ja|es|br|cn|kr|fr|it|nl)(?=\/|$)/, '') || '/';
}

export function localisedPath(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  if (locale === 'en') return base;
  const prefix = localePrefix(locale);
  return base === '/' ? prefix : `${prefix}${base}`;
}

export default i18n;
