import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Locale } from './config';
import { localisedPath, stripLocale, localeFromSegment, LOCALE_BCP47 } from './config';

export function useLocale() {
  const location = useLocation();
  const { i18n } = useTranslation();

  const seg = location.pathname.split('/').filter(Boolean)[0];
  const locale: Locale = localeFromSegment(seg);

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = LOCALE_BCP47[locale];
    }
  }, [locale, i18n]);

  return {
    locale,
    pathWithoutLocale: stripLocale(location.pathname),
    to: (path: string, target: Locale = locale) => localisedPath(path, target),
  };
}
