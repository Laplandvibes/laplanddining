import { useTranslation } from 'react-i18next';
import LanguageMenu, { type LanguageOption } from './LanguageMenu';
import { useLocale } from './useLocale';
import { LOCALE_BCP47, LOCALE_LABELS, LOCALE_NATIVE, SUPPORTED_LOCALES } from './config';

interface Props {
  className?: string;
  /** 'pill' (tumma navi) tai 'inline' (paljas teksti). */
  variant?: 'pill' | 'inline';
  /** Navin pohjan sävy. */
  tone?: 'dark' | 'light';
}

/**
 * Sivustokohtainen kytkentä kanoniseen `LanguageMenu`-komponenttiin: tämä
 * tiedosto tietää TÄMÄN sivuston reitityksen ja kielilistan, LanguageMenu ei
 * tiedä sivustosta mitään. Ulkoasu, näppäimistö, liput ja mobiili ovat
 * LanguageMenussa, joka on tavu tavulta sama kaikilla 28 sivustolla
 * (`node scripts/rollout_language_menu.mjs --check`).
 */
export default function LanguageSwitcher({ className = '', variant = 'pill', tone = 'dark' }: Props) {
  const { locale, to, pathWithoutLocale } = useLocale();
  const { t } = useTranslation('common');

  const items: LanguageOption[] = SUPPORTED_LOCALES.map((code) => ({
    code,
    label: LOCALE_LABELS[code],
    native: LOCALE_NATIVE[code],
    href: to(pathWithoutLocale, code),
    hrefLang: LOCALE_BCP47[code],
  }));

  return (
    <LanguageMenu
      locale={locale}
      items={items}
      variant={variant}
      tone={tone}
      label={t('lang.switchTo')}
      className={className}
    />
  );
}
