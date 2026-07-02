
import { useTranslation } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';import PrivacyContent from '../../../shared/Legal/PrivacyContent';
import { useLocale } from '../i18n/useLocale';

export default function PrivacyPolicy() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  return (
    <>
      <title>{t('privacy.title')}</title>
      <meta name="description" content={t('privacy.description')} />
      <Hreflang path="/privacy" />
      <meta name="robots" content="index, follow" />
      <PrivacyContent siteName="LaplandDining" lang={locale} />
    </>
  );
}
