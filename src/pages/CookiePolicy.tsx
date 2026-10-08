
import { useTranslation } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';import CookieContent from '../shared/Legal/CookieContent';
import { useLocale } from '../i18n/useLocale';

export default function CookiePolicy() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  return (
    <>
      <title>{t('cookie.title')}</title>
      <meta name="description" content={t('cookie.description')} />
      <Hreflang path="/cookie-policy" />
      <CookieContent siteId="laplanddining" siteName="LaplandDining" lang={locale} />
    </>
  );
}
