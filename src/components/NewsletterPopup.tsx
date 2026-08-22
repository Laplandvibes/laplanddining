import SharedNewsletterPopup from '../shared/NewsletterPopup';
import { trackNewsletterSignup } from '../lib/analytics';
import { useLocale } from '../i18n/useLocale'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

// Founder popup (2026-08-09): the old site-specific copy promised a monthly
// restaurant pick the consumer newsletter has never kept (0 sends). Do not
// re-add per-site copy overrides here — the shared founder default is the
// network standard on every tourism site.
export default function NewsletterPopup() {
  const { locale } = useLocale();
  return (
    <SharedNewsletterPopup
      lang={locale as 'en' | 'fi' | 'de' | 'ja' | 'es' | 'pt-BR' | 'zh-CN' | 'ko' | 'fr' | 'it' | 'nl' | 'sv'}
      siteId="laplanddining"
      brandWord="DINING"
      supabaseUrl={SUPABASE_URL}
      supabaseAnonKey={SUPABASE_ANON_KEY}
      onSubscribed={(s) => trackNewsletterSignup(s)}
    />
  );
}
