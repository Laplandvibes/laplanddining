import SharedNewsletterPopup from '../../../shared/NewsletterPopup';
import { trackNewsletterSignup } from '../lib/analytics';
import { useLocale } from '../i18n/useLocale'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const POPUP_COPY: Record<string, { headline: string; description: string }> = {
  en: { headline: 'Where Lapland actually eats out.', description: 'One restaurant pick per month — the new opening worth booking, the tasting menu that quietly took off, and the family pub still worth its salt.' },
  fi: { headline: 'Lapin ravintolat — mistä paikallinen oikeasti syö.', description: 'Yksi ravintolavinkki kuukaudessa: tuore avaus jonka takia kannattaa varata, tasting-menu joka on hiljaa noussut, sekä kyläpubi joka pitää tasonsa.' },
  de: { headline: 'Wo Lappland wirklich essen geht.', description: 'Eine Restaurant­empfehlung pro Monat — die neue Eröffnung, das Tasting Menü mit Aufstieg und der Dorfpub, der noch sein Niveau hält.' },
  ja: { headline: 'ラップランドが本当に通う店。', description: '月に一軒だけ厳選してお届け。予約する価値のある新店、静かに評判を集めるテイスティングメニュー、そして今も実力派の村の食堂。' },
  es: { headline: 'Dónde sale a comer la Laponia de verdad.', description: 'Una recomendación de restaurante al mes: la apertura que merece reserva, el menú degustación que despuntó sin alardes y la taberna de pueblo que sigue dando la talla.' },
  'pt-BR': { headline: 'Onde a Lapônia realmente come fora.', description: 'Uma indicação de restaurante por mês: a nova casa que vale a reserva, o menu-degustação que decolou sem alarde e o boteco de vila que segue mantendo o nível.' },
  'zh-CN': { headline: '拉普兰人真正光顾的餐厅。', description: '每月只推荐一家：值得预订的新店、悄然走红的品鉴菜单，以及依旧名副其实的乡间小馆。' },
  ko: { headline: '라플란드 사람들이 진짜 찾는 맛집.', description: '한 달에 단 한 곳만 골라 소개합니다. 예약할 가치가 있는 새 개업집, 조용히 입소문 난 테이스팅 메뉴, 그리고 여전히 제 몫을 하는 동네 식당.' },
  fr: { headline: 'Là où la Laponie sort vraiment manger.', description: 'Une adresse par mois : la nouvelle table qui mérite une réservation, le menu dégustation qui a percé sans bruit et le bistrot de village toujours à la hauteur.' },
  it: { headline: 'Dove la Lapponia va davvero a mangiare.', description: 'Un consiglio al mese: la nuova apertura che vale la prenotazione, il menu degustazione che è decollato in sordina e la trattoria di paese che tiene ancora il suo livello.' },
  nl: { headline: 'Waar Lapland echt uit eten gaat.', description: 'Eén restauranttip per maand: de nieuwe zaak die een reservering waard is, het tasting-menu dat stilletjes doorbrak en het dorpscafé dat zijn niveau nog steeds waarmaakt.' },
};

export default function NewsletterPopup() {
  const { locale } = useLocale();
  const copy = POPUP_COPY[locale as string] ?? POPUP_COPY.en;
  return (
    <SharedNewsletterPopup
      lang={locale as 'en' | 'fi' | 'de' | 'ja' | 'es' | 'pt-BR' | 'zh-CN' | 'ko' | 'fr' | 'it' | 'nl'}
      siteId="laplanddining"
      brandWord="DINING"
      headline={copy.headline}
      description={copy.description}
      supabaseUrl={SUPABASE_URL}
      supabaseAnonKey={SUPABASE_ANON_KEY}
      onSubscribed={(s) => trackNewsletterSignup(s)}
    />
  );
}
