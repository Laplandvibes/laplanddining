import { PackageCheck } from 'lucide-react'
import type { RailPartner } from '../ProductRail'

// Suomikauppa.fi — Daisycon, 7 % / 30 pv.
//
// THE ANGLE, and it is theirs not ours: this is an EXPORT shop. Their own front
// page says "Ruisleipä ja muut voittamattomat suomalaiset tuotteet
// pikatoimituksina ulkomaille" (read 2026-09-04). That is the one thing they do
// that the other Finnish shops in this network do not, so it is the headline.
//
// 🔴 The feed is ENGLISH while the shop pages are FINNISH — they sell abroad.
// The sync reads each product's own og:title for the Finnish name, so `localName`
// is set and `localNameLang: 'fi'` makes the rail print it on /fi. Do not try to
// build the Finnish name from the URL slug: Shopify strips the umlauts and
// "värimagneettitaulu" comes back as "varimagneettitaulu".
const suomikauppa: RailPartner = {
  key: 'suomikauppa',
  categoryUrl: 'https://suomikauppa.fi/collections/all',
  localNameLang: 'fi',
  accent: '#0B5FA5',
  accentDark: '#7FB3DC',
  icon: PackageCheck,
  copy: {
    fi: {
      eyebrow: 'Suomikauppa.fi',
      headline: 'Suomalaista tavaraa postitettuna',
      sub: 'Fazer, Fiskars, Muumi ja Rento samasta tilauksesta, myös ulkomaille.',
      from: '',
      ctaAll: 'Katso koko valikoima',
      note: 'Hinnat tarkistettu {date}. Ajantasainen hinta näkyy Suomikaupan sivulla.',
    },
    en: {
      eyebrow: 'Suomikauppa.fi',
      headline: 'Finnish goods, posted abroad',
      sub: 'Fazer, Fiskars, Moomin and Rento in one order, shipped from Finland.',
      from: '',
      ctaAll: 'See the full range',
      note: 'Prices checked {date}. The current price is shown on Suomikauppa’s own page.',
    },
    sv: {
      eyebrow: 'Suomikauppa.fi',
      headline: 'Finska varor, skickade utomlands',
      sub: 'Fazer, Fiskars, Mumin och Rento i samma order, skickat från Finland.',
      from: '',
      ctaAll: 'Se hela sortimentet',
      note: 'Priserna kontrollerade {date}. Aktuellt pris visas på Suomikauppas egen sida.',
    },
    de: {
      eyebrow: 'Suomikauppa.fi',
      headline: 'Finnische Waren, ins Ausland verschickt',
      sub: 'Fazer, Fiskars, Mumins und Rento in einer Bestellung, versandt aus Finnland.',
      from: '',
      ctaAll: 'Ganzes Sortiment ansehen',
      note: 'Preise geprüft am {date}. Den aktuellen Preis zeigt die Seite von Suomikauppa.',
    },
    fr: {
      eyebrow: 'Suomikauppa.fi',
      headline: 'Des produits finlandais, expédiés',
      sub: 'Fazer, Fiskars, Moomin et Rento dans une seule commande, envoyée de Finlande.',
      from: '',
      ctaAll: 'Voir tout le catalogue',
      note: 'Prix vérifiés le {date}. Le prix actuel figure sur la page de Suomikauppa.',
    },
    it: {
      eyebrow: 'Suomikauppa.fi',
      headline: 'Prodotti finlandesi, spediti all’estero',
      sub: 'Fazer, Fiskars, Mumin e Rento in un solo ordine, spedito dalla Finlandia.',
      from: '',
      ctaAll: 'Vedi tutto il catalogo',
      note: 'Prezzi verificati il {date}. Il prezzo aggiornato è sulla pagina di Suomikauppa.',
    },
    es: {
      eyebrow: 'Suomikauppa.fi',
      headline: 'Productos finlandeses, enviados fuera',
      sub: 'Fazer, Fiskars, Mumin y Rento en un solo pedido, enviado desde Finlandia.',
      from: '',
      ctaAll: 'Ver todo el catálogo',
      note: 'Precios comprobados el {date}. El precio actual aparece en la página de Suomikauppa.',
    },
    'pt-BR': {
      eyebrow: 'Suomikauppa.fi',
      headline: 'Produtos finlandeses, enviados ao exterior',
      sub: 'Fazer, Fiskars, Moomin e Rento num só pedido, enviado da Finlândia.',
      from: '',
      ctaAll: 'Ver o catálogo completo',
      note: 'Preços verificados em {date}. O preço atual aparece na página da Suomikauppa.',
    },
    nl: {
      eyebrow: 'Suomikauppa.fi',
      headline: 'Finse spullen, naar het buitenland verstuurd',
      sub: 'Fazer, Fiskars, Moomin en Rento in één bestelling, verzonden uit Finland.',
      from: '',
      ctaAll: 'Bekijk het hele assortiment',
      note: 'Prijzen gecontroleerd op {date}. De actuele prijs staat op de pagina van Suomikauppa.',
    },
    ja: {
      eyebrow: 'Suomikauppa.fi',
      headline: 'フィンランドの品を海外へ発送',
      sub: 'ファッツェル、フィスカース、ムーミン、レントをひとつの注文でフィンランドから。',
      from: '',
      ctaAll: '品揃えをすべて見る',
      note: '価格は{date}時点のものです。最新の価格は Suomikauppa のページでご確認ください。',
    },
    'zh-CN': {
      eyebrow: 'Suomikauppa.fi',
      headline: '芬兰商品，寄往海外',
      sub: '法泽、Fiskars、姆明与 Rento 一单下齐，从芬兰直接寄出。',
      from: '',
      ctaAll: '查看全部商品',
      note: '价格核对于 {date}。最新价格以 Suomikauppa 页面为准。',
    },
    ko: {
      eyebrow: 'Suomikauppa.fi',
      headline: '핀란드 물건을 해외로 배송',
      sub: '파제르, 피스카스, 무민, 렌토를 한 번의 주문으로 핀란드에서 보냅니다.',
      from: '',
      ctaAll: '전체 상품 보기',
      note: '가격은 {date} 기준입니다. 최신 가격은 Suomikauppa 페이지에서 확인하세요.',
    },
  },
}

export default suomikauppa
