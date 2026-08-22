
import { useTranslation } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';import TermsContent from '../shared/Legal/TermsContent';
import { useLocale } from '../i18n/useLocale';

export default function Terms() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  return (
    <>
      <title>{t('terms.title')}</title>
      <meta name="description" content={t('terms.description')} />
      <Hreflang path="/terms" />
      <meta name="robots" content="index, follow" />
      <TermsContent siteName="LaplandDining" siteUrl="laplanddining.com" lang={locale} />
    </>
  );
}
