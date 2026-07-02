import Breadcrumbs from '../../../shared/Breadcrumbs';
import { useLocale } from '../i18n/useLocale';
import { useTranslation } from 'react-i18next';

/**
 * Ecosystem breadcrumb, rendered BELOW the hero (mounted once per subpage right
 * after the hero <section>) so it reads as the first line of page content
 * instead of a bar wedged between the nav and the hero. Self-hides on home +
 * unmapped routes (shared/Breadcrumbs returns null there), so subpages can
 * mount it unconditionally.
 */
export default function PageBreadcrumb() {
  const { locale, to } = useLocale();
  const { t } = useTranslation('nav');
  const labelMap: Record<string, string> = {
    '/restaurants': t('links.restaurants'),
    '/fine-dining': t('links.fineDining'),
    '/midnight-sun-dining': t('links.midnightSun'),
    '/food-history': t('links.foodHistory'),
    '/local-food': t('links.localFood'),
    '/about': t('links.about'),
  };
  return (
    <Breadcrumbs
      lang={locale}
      to={to}
      labelMap={labelMap}
      className="bg-night text-snow border-b border-white/10"
      accentClassName="hover:text-amber hover:opacity-100"
    />
  );
}
