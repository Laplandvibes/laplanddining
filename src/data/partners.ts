/**
 * partners.ts — laplanddining-new
 *
 * Kumppanipaikkojen data-tiedosto. Tyhjä taulukko = ei renderöidy mitään DOM:iin.
 * Sijoitukset:
 *   front[0]  — 1 featured-kortti etusivun sisältöalueella
 *   listingTop — kärkipaikkakorostus ravintolalistan alkuun (listing-varianti)
 *
 * Myyty kumppani lisätään tähän + deploy. Paikkojen määrä = lv_placements-seedin slotit.
 */

import type { Partner } from '../shared/PartnerSlot';
import type { HomeAdSlotsConfig } from '../shared/HomeAdSlots';
import { DEFAULT_PREMIUM_SPOTS } from '../shared/PremiumSpotGrid';

/**
 * Visit Inari (Inari + Ivalon Kultahippu), maksullinen kumppani 890 € alv 0, 1.11.2026–31.10.2027.
 * Yksi kolmesta paikasta: lukija etsii ravintolaa Inarista. Näkyy /restaurants-sivun Inari-osion
 * kärjessä ja Inarin kaupunkisivulla /city/inari (CityFeaturedSlot).
 *
 * 🟢 HYVÄKSYTTY JA JULKAISTU 23.10.2026: Petri Saastamoinen hyväksyi tekstin ja kuvan sellaisenaan
 * ("En näihin keksi lisättävää tai muokattavaa", Gmail 1a168160afde3918). Worker-reitti `visitinari`
 * live 23.10. (UTM utm_campaign=visit-inari-2026). Muilla kielillä Visit Inarin omat englanninkieliset
 * nimet (Holiday Village Inari, Crow Creek Cabins, Hotel Kultahippu); i18n 9 kielelle natiivilukijan jälkeen.
 * Kuva: oma valokuva Ravintola Auroran salista 12.10.2026 klo 19.11 (20261012_191137, otettu
 * heti Restaurant Aurora -kyltin jälkeen), ei sama tiedosto kuin artikkelissa.
 */
const visitInariDining: Partner = {
  name: 'Visit Inari',
  tagline: 'Ravintola Aurora Inarin keskustassa',
  taglineEn: 'Restaurant Aurora in the centre of Inari',
  taglineSv: 'Restaurant Aurora mitt i Enare',
  description: 'Ravintola Aurora on Hotelli Inarin yhteydessä Inarintie 40:ssä, ja sen ikkunoista näkee Inarijärvelle Juutuanvuonon suuntaan. Ivalossa saman perheyrityksen Hotelli Ravintola Kultahippu kattaa lounaaksi noutopöydän.',
  descriptionEn: 'Restaurant Aurora is part of Hotel Inari at Inarintie 40, and its windows look out over Lake Inari towards Juutuanvuono bay. In Ivalo, Hotel Kultahippu, run by the same family business, serves a buffet lunch.',
  descriptionSv: 'Restaurant Aurora hör till Hotel Inari på Inarintie 40, och från fönstren ser man ut över Enare träsk mot Juutuanvuono. I Ivalo serverar Hotel Kultahippu, som drivs av samma familjeföretag, lunchbuffé.',
  url: 'https://go.laplandvibes.com/go/visitinari?sid=dining_city_inari&dest=https%3A%2F%2Fvisitinari.fi%2Frestaurant-aurora%2F',
  urlFi: 'https://go.laplandvibes.com/go/visitinari?sid=dining_city_inari&dest=https%3A%2F%2Fvisitinari.fi%2Ffi%2Fravintola-aurora%2F',
  imageSrc: '/images/partners/visitinari-ravintola-aurora.webp',
  logoSrc: '/images/partners/visitinari.svg',
  logoAlt: 'Visit Inari',
  ctaLabel: 'Katso Ravintola Aurora',
  ctaLabelEn: 'See Restaurant Aurora',
  ctaLabelSv: 'Se Restaurant Aurora',
  articleUrl: 'https://laplandvibes.com/fi/blog/visit-inari/',
  articleUrlEn: 'https://laplandvibes.com/blog/visit-inari/',
  articleUrlSv: 'https://laplandvibes.com/sv/blog/visit-inari/',
  articleLabel: 'Lue juttu',
  articleLabelEn: 'Read the article',
  articleLabelSv: 'Läs artikeln',
  i18n: {
    de: {
      tagline: 'Restaurant Aurora im Zentrum von Inari',
      description: 'Das Restaurant Aurora gehört zum Hotel Inari in der Inarintie 40, und aus seinen Fenstern blickt man über den Inarisee in Richtung der Bucht Juutuanvuono. In Ivalo serviert das Hotel Kultahippu desselben Familienbetriebs mittags ein Buffet.',
      cta: 'Restaurant Aurora ansehen',
      articleLabel: 'Artikel lesen',
      articleUrl: 'https://laplandvibes.com/de/blog/visit-inari/',
    },
    fr: {
      tagline: 'Le Restaurant Aurora au centre d\'Inari',
      description: 'Le Restaurant Aurora fait partie de l\'Hotel Inari, à l\'adresse Inarintie 40, et ses fenêtres donnent sur le lac Inari, en direction de la baie de Juutuanvuono. À Ivalo, l\'Hotel Kultahippu, de la même entreprise familiale, sert un buffet le midi.',
      cta: 'Voir le Restaurant Aurora',
      articleLabel: 'Lire l\'article',
      articleUrl: 'https://laplandvibes.com/fr/blog/visit-inari/',
    },
    it: {
      tagline: 'Il Restaurant Aurora nel centro di Inari',
      description: 'Il Restaurant Aurora fa parte dell\'Hotel Inari, in Inarintie 40, e dalle sue finestre si vede il lago Inari in direzione della baia di Juutuanvuono. A Ivalo, l\'Hotel Kultahippu, della stessa impresa familiare, allestisce a pranzo un buffet.',
      cta: 'Vedi il Restaurant Aurora',
      articleLabel: 'Leggi l\'articolo',
      articleUrl: 'https://laplandvibes.com/it/blog/visit-inari/',
    },
    es: {
      tagline: 'El Restaurant Aurora en el centro de Inari',
      description: 'El Restaurant Aurora forma parte del Hotel Inari, en Inarintie 40, y desde sus ventanas se ve el lago Inari en dirección a la bahía de Juutuanvuono. En Ivalo, el Hotel Kultahippu, de la misma empresa familiar, sirve un bufé en el almuerzo.',
      cta: 'Ver el Restaurant Aurora',
      articleLabel: 'Leer el artículo',
      articleUrl: 'https://laplandvibes.com/es/blog/visit-inari/',
    },
    pt: {
      tagline: 'Restaurant Aurora no centro de Inari',
      description: 'O Restaurant Aurora funciona junto ao Hotel Inari, na Inarintie 40, e suas janelas dão para o lago Inari, na direção da baía de Juutuanvuono. Em Ivalo, o Hotel Kultahippu, da mesma empresa familiar, serve bufê no almoço.',
      cta: 'Ver o Restaurant Aurora',
      articleLabel: 'Leia o artigo',
      articleUrl: 'https://laplandvibes.com/br/blog/visit-inari/',
    },
    nl: {
      tagline: 'Restaurant Aurora in het centrum van Inari',
      description: 'Restaurant Aurora hoort bij Hotel Inari aan de Inarintie 40, en vanuit de ramen kijkt u uit over het Inarimeer, richting de baai Juutuanvuono. In Ivalo zet Hotel Kultahippu, van hetzelfde familiebedrijf, voor de lunch een buffet klaar.',
      cta: 'Bekijk Restaurant Aurora',
      articleLabel: 'Lees het artikel',
      articleUrl: 'https://laplandvibes.com/nl/blog/visit-inari/',
    },
    ja: {
      tagline: 'イナリ中心部の Restaurant Aurora',
      description: 'Restaurant Aurora は Inarintie 40 の Hotel Inari に併設されていて、窓からはユートゥア湾の方角にイナリ湖を見渡せます。イヴァロでは、同じ家族経営の会社が営むホテル兼レストラン Hotel Kultahippu が、ランチにビュッフェを用意しています。',
      cta: 'Restaurant Aurora を見る',
      articleLabel: '記事を読む',
      articleUrl: 'https://laplandvibes.com/ja/blog/visit-inari/',
    },
    ko: {
      tagline: '이나리 중심부의 Restaurant Aurora',
      description: 'Restaurant Aurora는 Inarintie 40의 Hotel Inari에 딸려 있으며, 창으로 유투아 만 쪽 이나리 호수가 내다보입니다. 이발로에서는 같은 가족 기업이 운영하는 호텔 겸 레스토랑 Hotel Kultahippu가 점심 뷔페를 차립니다.',
      cta: 'Restaurant Aurora 보기',
      articleLabel: '기사 읽기',
      articleUrl: 'https://laplandvibes.com/kr/blog/visit-inari/',
    },
    zh: {
      tagline: '伊纳里中心的 Restaurant Aurora',
      description: 'Restaurant Aurora 附设于 Inarintie 40 的 Hotel Inari，从窗口可以朝尤图阿湾方向望见伊纳里湖。在伊瓦洛，同一家家族企业经营的酒店兼餐厅 Hotel Kultahippu 午餐供应自助餐。',
      cta: '查看 Restaurant Aurora',
      articleLabel: '阅读文章',
      articleUrl: 'https://laplandvibes.com/cn/blog/visit-inari/',
    },
  },
};

export const PARTNERS: {
  mainPartner: Partner | null;
  front: (Partner | null)[];
  listingTop: Partner | null;
  pages: Record<string, (Partner | null)[]>;
  cityFeatured: Record<string, Partner | null>;
} = {
  // Pääkumppani: nauha joka sivulla (SponsorStrip) + vasen sivurraili
  mainPartner: null,

  // Etusivun kortit A (vasen) + B (oikea) — myydään erikseen
  front: [null, null],

  // Ravintolalistan kärki: 1 listing-korostuspaikka (ensimmäinen ennen ravintolakorttigridiä)
  listingTop: null,

  // Alasivukohtaiset mainospaikat, avain = reitti (esim. '/restaurants')
  pages: {},

  // Kaupunkikohtainen "Esittelykumppani" -paikka /restaurants-sivulla, avain = kaupunki
  // (esim. 'Rovaniemi'). Iso, myytävä mainospinta kaupungin ravintolaosion kärjessä
  // (KKV: merkitty mainokseksi). Tyhjä/null = kanoninen vaalea house-ad
  // ("Varaa mainospaikka →"). Toimituksellinen kärkivalinta EI koskaan mene tähän
  // maksuttomana — pysyy house-adina kunnes kaupunki myydään. Ei automaattinostoa.
  cityFeatured: { Inari: visitInariDining },
};

/**
 * LV Media -mainosinventaario (malli v3, Vesa 2026-07-12):
 *   mainPartner — pääkumppani: nauha navin alla joka sivulla (SponsorStrip) +
 *                 hubin vasen sivurraili kaupanpäällisenä
 *   cards[0]/[1] — etusivun kortit A (vasen) / B (oikea), myydään ERIKSEEN;
 *                  mobiilissa molemmat aina näkyvissä + ykköspaikka vuorottelee
 *   spots       — premium-listanosto ravintolalistan kärkeen (Restaurants-sivu)
 * Tyhjät paikat → house-ad "Haluatko mainoksesi tähän?" → /media/site/laplanddining.
 * Myyty kumppani → täytä oikea kenttä Partner-objektilla + kirjaa
 * kumppaniartikkeli PARTNER_ARTICLES-hakemistoon (/kumppanit).
 */
export const AD_SLOTS: HomeAdSlotsConfig = {
  siteSlug: 'laplanddining',
  mainPartner: PARTNERS.mainPartner,
  cards: PARTNERS.front,
  spots: DEFAULT_PREMIUM_SPOTS,
};

/** /kumppanit-koontisivun artikkelit (maksaneet kumppanit). Tyhjä = ei vielä. */
import type { PartnerDirEntry } from '../shared/PartnersDirectory';
export const PARTNER_ARTICLES: PartnerDirEntry[] = [];
