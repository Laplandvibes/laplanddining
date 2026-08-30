/**
 * adSlotsCopy — 12 kielen tekstit mainospaikkojen house-adeille ja osioille.
 *
 * Käytetään shared/PartnerSlot.tsx (house-ad) + shared/PremiumSpotGrid.tsx +
 * shared/HomeAdSlots.tsx -komponenteissa. Tekstit ovat komponentin sisällä
 * (ei per-sivu i18n-tiedostoissa), jotta rollout ~27 sivustolle ei vaadi
 * 12 × 27 lokaalitiedoston muokkausta ja kaikki kielet pysyvät synkassa
 * (feedback_translate_all_languages).
 *
 * Lokaalinormalisointi: hub käyttää koodeja en/fi/de/ja/es/pt-BR/zh-CN/ko/fr/it/nl/sv,
 * osa sivustoista lyhyitä URL-prefiksejä (br/cn/kr) — normalizeAdLocale kattaa molemmat.
 *
 * 🔴 PYSYVÄ PÄÄTÖS (Vesa 2026-07-26) — ÄLÄ "korjaa" badge-eroa:
 * `badge` sanoo ja/ko/zh -kielillä 広告 / 광고 / 广告 ("mainos") mutta yhdeksällä
 * muulla kielellä Partner / Kumppani / Partenaire… ("kumppani"). Tämä EI ole
 * käännösvirhe vaan tietoinen linja: kumppani siellä missä kyse on
 * kumppanuudesta, mainos siellä missä CJK-markkinoiden käytäntö niin vaatii.
 * Taustalla 2026-07-12 Kumppani-badge-päätös (KSL, ks. shared/PartnersDirectory.tsx)
 * ja 12 `partnersDirLead`-virkettä jotka päättyvät "kaikki merkitty kumppaneiksi".
 * Nostettu esiin mainoscopyn oikoluvussa 26.7. ja päätetty jättää ennalleen.
 * Jos tätä joskus muutetaan, se on kaikki-tai-ei-mitään: joko ja/ko/zh →
 * パートナー/파트너/合作伙伴, TAI badge → "mainos" kaikilla 12 JA 12 lead-virkettä
 * uusiksi. Yksittäisen kielen vaihtaminen rikkoo linjan kummallakin tavalla.
 */

export type AdLocale =
  | 'en' | 'fi' | 'de' | 'fr' | 'it' | 'es' | 'pt' | 'nl' | 'sv' | 'ja' | 'ko' | 'zh';

export function normalizeAdLocale(locale?: string): AdLocale {
  const l = (locale || 'en').toLowerCase();
  if (l.startsWith('fi')) return 'fi';
  if (l.startsWith('de')) return 'de';
  if (l.startsWith('fr')) return 'fr';
  if (l.startsWith('it')) return 'it';
  if (l.startsWith('es')) return 'es';
  if (l.startsWith('pt') || l === 'br') return 'pt';
  if (l.startsWith('nl')) return 'nl';
  if (l.startsWith('sv')) return 'sv';
  if (l.startsWith('ja')) return 'ja';
  if (l.startsWith('ko') || l === 'kr') return 'ko';
  if (l.startsWith('zh') || l === 'cn') return 'zh';
  return 'en';
}

/**
 * Mainospaikat (LV Media -myyntitila) näytetään VAIN suomeksi, englanniksi ja
 * ruotsiksi.
 *
 * Vesa 2026-07-13: mainostilaa ostavat paikalliset ja kansainväliset yritykset
 * asioivat suomeksi/englanniksi/ruotsiksi (ruotsi = ekosysteemin 12. kieli) —
 * pääkumppaninauha, kortit, premium-paikat ja "Haluatko mainoksesi tähän?"
 * -house-adit muilla kielillä ovat kohdeyleisölle turhia ja roskaavat
 * kansainvälistä sisältöä. Yksi totuuslähde: koskee SponsorStrip / HomeAdSlots /
 * MainPartnerBanner / PremiumSpotGrid / SubpageAd (LV Median oma inventaari).
 * EI koske affiliate-AdUniteja (aidot käännetyt matkailutarjoukset kaikille kielille).
 */
const AD_ENABLED_LOCALES: ReadonlySet<AdLocale> = new Set(['en', 'fi', 'sv']);

export function adLocaleEnabled(locale?: string): boolean {
  return AD_ENABLED_LOCALES.has(normalizeAdLocale(locale));
}

export type AdSlotsCopy = {
  /** Kuluttajansuojalain edellyttämä maksetun paikan badge */
  badge: string;
  /** Osion eyebrow-otsikko (legacy, ei enää käytössä HomeAdSlotsissa) */
  partners: string;
  /** Ryhmä 1: pääkumppanipaikkojen otsikko */
  mainPartners: string;
  /** Ykköspääkumppanin label (heron alla oleva banneri) */
  mainPartnerOne: string;
  /** Kakkospääkumppanin label (kumppaniosion kortti, edullisempi paikka) */
  mainPartnerTwo: string;
  /** Ryhmä 2: premium-paikkojen otsikko */
  premiumSpots: string;
  /** Paikkamäärän teksti ryhmäotsikon perään, esim. "2 paikkaa" */
  slotCount: (n: number) => string;
  /** House-ad: pieni yläkulmalabel */
  slotOpen: string;
  /** /kumppanit-koontisivun otsikko */
  partnersDirTitle: string;
  /** /kumppanit-koontisivun johdanto */
  partnersDirLead: string;
  /** /kumppanit tyhjänä: otsikko (positiivinen, ei paljasta tyhjyyttä) */
  partnersDirEmptyTitle: string;
  /** /kumppanit tyhjänä: leipäteksti (kutsu, ei "ei vielä") */
  partnersDirEmpty: string;
  /** Alasivun oma mainospaikka -house-adin alaotsikko */
  subpageOpen: string;
  /** House-ad: pääotsikko */
  wantYourAd: string;
  /** House-ad (pääsponsori): alaotsikko */
  sponsorSub: string;
  /** House-ad (etusivun kortti A/B): alaotsikko */
  cardSub: string;
  /** House-ad (premium-gridi): alaotsikko / tyhjän paikan teksti */
  premiumOpen: string;
  /** House-ad: CTA */
  bookCta: string;
  /** Premium-gridin tyhjän solun lyhyt CTA */
  bookShort: string;
};

export const AD_SLOTS_COPY: Record<AdLocale, AdSlotsCopy> = {
  en: {
    badge: 'Partner',
    partners: 'Partners',
    mainPartners: 'Main partners',
    mainPartnerOne: 'Main partner',
    mainPartnerTwo: 'Second main partner',
    premiumSpots: 'Premium spots',
    slotCount: (n) => n === 1 ? '1 slot' : `${n} slots`,
    slotOpen: 'Ad spot available',
    partnersDirTitle: 'Our partners',
    partnersDirLead: 'The companies we work with across the LaplandVibes network: sponsored features and advertisers, all marked as partners.',
    partnersDirEmptyTitle: 'Partner with us',
    partnersDirEmpty: 'Get your business in front of travellers planning their Lapland trip: sponsored features and a featured spot across the network.',
    subpageOpen: 'Your ad on this page, all season',
    wantYourAd: 'Want your ad here?',
    sponsorSub: 'Become a main partner: the most visible placement on this site.',
    cardSub: 'A front-page ad spot: put your business in front of Lapland travellers.',
    premiumOpen: 'Ad spot available',
    bookCta: 'Book this spot →',
    bookShort: 'Book →',
  },
  fi: {
    badge: 'Kumppani',
    partners: 'Kumppanit',
    mainPartners: 'Pääkumppanit',
    mainPartnerOne: 'Pääkumppani',
    mainPartnerTwo: 'Kakkospääkumppani',
    premiumSpots: 'Premium-paikat',
    slotCount: (n) => n === 1 ? '1 paikka' : `${n} paikkaa`,
    slotOpen: 'Mainospaikka vapaana',
    partnersDirTitle: 'Kumppanimme',
    partnersDirLead: 'Yritykset, joiden kanssa teemme yhteistyötä LaplandVibes-verkostossa: sponsoroidut jutut ja mainostajat, kaikki merkitty kumppaneiksi.',
    partnersDirEmptyTitle: 'Ryhdy kumppaniksi',
    partnersDirEmpty: 'Näy matkailijoille, jotka suunnittelevat Lapin-reissuaan: sponsoroidut jutut ja nostettu paikka verkostossa.',
    subpageOpen: 'Mainoksesi tällä sivulla koko sesongin',
    wantYourAd: 'Haluatko mainoksesi tähän?',
    sponsorSub: 'Ryhdy sivuston pääkumppaniksi: näkyvin paikka etusivulla.',
    cardSub: 'Etusivun mainospaikka: nosta yrityksesi Lapin-matkailijoiden eteen.',
    premiumOpen: 'Mainospaikka vapaana',
    bookCta: 'Varaa mainospaikka →',
    bookShort: 'Varaa →',
  },
  de: {
    badge: 'Partner',
    partners: 'Partner',
    mainPartners: 'Hauptpartner',
    mainPartnerOne: 'Hauptpartner',
    mainPartnerTwo: 'Zweiter Hauptpartner',
    premiumSpots: 'Premium-Plätze',
    slotCount: (n) => n === 1 ? '1 Platz' : `${n} Plätze`,
    slotOpen: 'Werbeplatz frei',
    partnersDirTitle: 'Unsere Partner',
    partnersDirLead: 'Die Unternehmen, mit denen wir im LaplandVibes-Netzwerk zusammenarbeiten: gesponserte Beiträge und Werbepartner, alle als Partner gekennzeichnet.',
    partnersDirEmptyTitle: 'Partner werden',
    partnersDirEmpty: 'Zeigen Sie Ihr Unternehmen Reisenden, die ihre Lappland-Reise planen: gesponserte Beiträge und ein hervorgehobener Platz im Netzwerk.',
    subpageOpen: 'Ihre Anzeige auf dieser Seite, die ganze Saison',
    wantYourAd: 'Möchten Sie hier werben?',
    sponsorSub: 'Werden Sie Hauptpartner: der sichtbarste Platz dieser Website.',
    cardSub: 'Ein Werbeplatz auf der Startseite: Zeigen Sie Ihr Unternehmen den Lappland-Reisenden.',
    premiumOpen: 'Werbeplatz frei',
    bookCta: 'Platz buchen →',
    bookShort: 'Buchen →',
  },
  fr: {
    badge: 'Partenaire',
    partners: 'Partenaires',
    mainPartners: 'Partenaires principaux',
    mainPartnerOne: 'Partenaire principal',
    mainPartnerTwo: 'Deuxième partenaire principal',
    premiumSpots: 'Emplacements premium',
    slotCount: (n) => n === 1 ? '1 emplacement' : `${n} emplacements`,
    slotOpen: 'Emplacement disponible',
    partnersDirTitle: 'Nos partenaires',
    partnersDirLead: 'Les entreprises avec lesquelles nous collaborons sur le réseau LaplandVibes: articles sponsorisés et annonceurs, tous signalés comme partenaires.',
    partnersDirEmptyTitle: 'Devenez partenaire',
    partnersDirEmpty: 'Montrez votre entreprise aux voyageurs qui préparent leur séjour en Laponie: articles sponsorisés et emplacement mis en avant sur le réseau.',
    subpageOpen: 'Votre publicité sur cette page, toute la saison',
    wantYourAd: 'Votre publicité ici ?',
    sponsorSub: 'Devenez partenaire principal: l’emplacement le plus visible du site.',
    cardSub: 'Un emplacement en page d’accueil: placez votre entreprise devant les voyageurs en Laponie.',
    premiumOpen: 'Emplacement disponible',
    bookCta: 'Réserver cet emplacement →',
    bookShort: 'Réserver →',
  },
  it: {
    badge: 'Partner',
    partners: 'Partner',
    mainPartners: 'Partner principali',
    mainPartnerOne: 'Partner principale',
    mainPartnerTwo: 'Secondo partner principale',
    premiumSpots: 'Spazi premium',
    slotCount: (n) => n === 1 ? '1 spazio' : `${n} spazi`,
    slotOpen: 'Spazio pubblicitario libero',
    partnersDirTitle: 'I nostri partner',
    partnersDirLead: 'Le aziende con cui collaboriamo nella rete LaplandVibes: contenuti sponsorizzati e inserzionisti, tutti indicati come partner.',
    partnersDirEmptyTitle: 'Diventa partner',
    partnersDirEmpty: 'Mostri la Sua azienda ai viaggiatori che pianificano il loro viaggio in Lapponia: contenuti sponsorizzati e uno spazio in evidenza nella rete.',
    subpageOpen: 'Il Suo annuncio su questa pagina, tutta la stagione',
    wantYourAd: 'Vuole il Suo annuncio qui?',
    sponsorSub: 'Diventa partner principale: lo spazio più visibile del sito.',
    cardSub: 'Uno spazio in home page: metta la Sua azienda davanti ai viaggiatori in Lapponia.',
    premiumOpen: 'Spazio pubblicitario libero',
    bookCta: 'Prenota questo spazio →',
    bookShort: 'Prenota →',
  },
  es: {
    badge: 'Colaborador',
    partners: 'Colaboradores',
    mainPartners: 'Colaboradores principales',
    mainPartnerOne: 'Colaborador principal',
    mainPartnerTwo: 'Segundo colaborador principal',
    premiumSpots: 'Espacios premium',
    slotCount: (n) => n === 1 ? '1 espacio' : `${n} espacios`,
    slotOpen: 'Espacio publicitario libre',
    partnersDirTitle: 'Nuestros colaboradores',
    partnersDirLead: 'Las empresas con las que trabajamos en la red LaplandVibes: contenidos patrocinados y anunciantes, todos marcados como colaboradores.',
    partnersDirEmptyTitle: 'Colabora con nosotros',
    partnersDirEmpty: 'Muestra tu empresa a los viajeros que planean su viaje a Laponia: contenidos patrocinados y un espacio destacado en la red.',
    subpageOpen: 'Tu anuncio en esta página, toda la temporada',
    wantYourAd: '¿Quieres tu anuncio aquí?',
    sponsorSub: 'Conviértete en colaborador principal: el espacio más visible del sitio.',
    cardSub: 'Un espacio en la portada: pon tu empresa ante los viajeros de Laponia.',
    premiumOpen: 'Espacio publicitario libre',
    bookCta: 'Reservar este espacio →',
    bookShort: 'Reservar →',
  },
  pt: {
    badge: 'Parceiro',
    partners: 'Parceiros',
    mainPartners: 'Parceiros principais',
    mainPartnerOne: 'Parceiro principal',
    mainPartnerTwo: 'Segundo parceiro principal',
    premiumSpots: 'Espaços premium',
    slotCount: (n) => n === 1 ? '1 espaço' : `${n} espaços`,
    slotOpen: 'Espaço publicitário livre',
    partnersDirTitle: 'Nossos parceiros',
    partnersDirLead: 'As empresas com as quais trabalhamos na rede LaplandVibes: conteúdos patrocinados e anunciantes, todos marcados como parceiros.',
    partnersDirEmptyTitle: 'Seja nosso parceiro',
    partnersDirEmpty: 'Mostre a sua empresa aos viajantes que planejam a viagem à Lapônia: conteúdos patrocinados e um espaço em destaque na rede.',
    subpageOpen: 'Seu anúncio nesta página, a temporada toda',
    wantYourAd: 'Quer o seu anúncio aqui?',
    sponsorSub: 'Torne-se parceiro principal: o espaço mais visível do site.',
    cardSub: 'Um espaço na página inicial: coloque a sua empresa diante dos viajantes da Lapônia.',
    premiumOpen: 'Espaço publicitário livre',
    bookCta: 'Reservar este espaço →',
    bookShort: 'Reservar →',
  },
  nl: {
    badge: 'Partner',
    partners: 'Partners',
    mainPartners: 'Hoofdpartners',
    mainPartnerOne: 'Hoofdpartner',
    mainPartnerTwo: 'Tweede hoofdpartner',
    premiumSpots: 'Premium-plekken',
    slotCount: (n) => n === 1 ? '1 plek' : `${n} plekken`,
    slotOpen: 'Advertentieplek beschikbaar',
    partnersDirTitle: 'Onze partners',
    partnersDirLead: 'De bedrijven waarmee we samenwerken in het LaplandVibes-netwerk: gesponsorde artikelen en adverteerders, allemaal als partner gemarkeerd.',
    partnersDirEmptyTitle: 'Word partner',
    partnersDirEmpty: 'Laat uw bedrijf zien aan reizigers die hun Lapland-reis plannen: gesponsorde artikelen en een uitgelichte plek in het netwerk.',
    subpageOpen: 'Uw advertentie op deze pagina, het hele seizoen',
    wantYourAd: 'Uw advertentie hier?',
    sponsorSub: 'Word hoofdpartner: de meest zichtbare plek op deze site.',
    cardSub: 'Een advertentieplek op de homepage: laat uw bedrijf zien aan Lapland-reizigers.',
    premiumOpen: 'Advertentieplek beschikbaar',
    bookCta: 'Reserveer deze plek →',
    bookShort: 'Reserveer →',
  },
  sv: {
    badge: 'Partner',
    partners: 'Partner',
    mainPartners: 'Huvudpartner',
    mainPartnerOne: 'Huvudpartner',
    mainPartnerTwo: 'Andra huvudpartner',
    premiumSpots: 'Premiumplatser',
    slotCount: (n) => n === 1 ? '1 plats' : `${n} platser`,
    slotOpen: 'Annonsplats ledig',
    partnersDirTitle: 'Våra partner',
    partnersDirLead: 'Företagen vi samarbetar med i LaplandVibes-nätverket: sponsrat innehåll och annonsörer, alla märkta som partner.',
    partnersDirEmptyTitle: 'Bli partner',
    partnersDirEmpty: 'Visa ditt företag för resenärer som planerar sin Lapplandsresa: sponsrat innehåll och en framlyft plats i nätverket.',
    subpageOpen: 'Din annons på denna sida, hela säsongen',
    wantYourAd: 'Vill du synas här?',
    sponsorSub: 'Bli huvudpartner: den mest synliga platsen på den här sidan.',
    cardSub: 'En annonsplats på förstasidan: visa ditt företag för Lapplands resenärer.',
    premiumOpen: 'Annonsplats ledig',
    bookCta: 'Boka denna plats →',
    bookShort: 'Boka →',
  },
  ja: {
    badge: '広告',
    partners: 'パートナー',
    mainPartners: 'メインパートナー',
    mainPartnerOne: 'メインパートナー',
    mainPartnerTwo: 'セカンドパートナー',
    premiumSpots: 'プレミアム枠',
    slotCount: (n) => `${n}枠`,
    slotOpen: '広告枠 募集中',
    partnersDirTitle: 'パートナー企業',
    partnersDirLead: 'LaplandVibes ネットワークで協業する企業：スポンサード記事と広告主、すべてパートナーとして表示されます。',
    partnersDirEmptyTitle: 'パートナーになる',
    partnersDirEmpty: 'ラップランド旅行を計画する旅行者にあなたのビジネスを：スポンサード記事とネットワーク内の注目枠。',
    subpageOpen: 'このページにあなたの広告を、シーズンを通して',
    wantYourAd: 'ここに広告を掲載しませんか？',
    sponsorSub: 'メインパートナーに：サイトで最も目立つ広告枠です。',
    cardSub: 'トップページの広告枠：ラップランドの旅行者にあなたのビジネスを。',
    premiumOpen: '広告枠 募集中',
    bookCta: 'この枠を予約 →',
    bookShort: '予約 →',
  },
  ko: {
    badge: '광고',
    partners: '파트너',
    mainPartners: '메인 파트너',
    mainPartnerOne: '메인 파트너',
    mainPartnerTwo: '세컨드 메인 파트너',
    premiumSpots: '프리미엄 자리',
    slotCount: (n) => `${n}자리`,
    slotOpen: '광고 자리 모집 중',
    partnersDirTitle: '파트너 기업',
    partnersDirLead: 'LaplandVibes 네트워크에서 협업하는 기업: 스폰서 콘텐츠와 광고주, 모두 파트너로 표시됩니다.',
    partnersDirEmptyTitle: '파트너 되기',
    partnersDirEmpty: '라플란드 여행을 계획하는 여행자에게 귀사를 노출하세요. 스폰서 콘텐츠와 네트워크 내 추천 자리.',
    subpageOpen: '이 페이지에 광고를, 시즌 내내',
    wantYourAd: '이곳에 광고를 게재해 보세요',
    sponsorSub: '메인 파트너가 되어 사이트에서 가장 눈에 띄는 자리를 차지하세요.',
    cardSub: '첫 페이지 광고 자리: 라플란드 여행자에게 귀사를 노출하세요.',
    premiumOpen: '광고 자리 모집 중',
    bookCta: '이 자리 예약하기 →',
    bookShort: '예약 →',
  },
  zh: {
    badge: '广告',
    partners: '合作伙伴',
    mainPartners: '主要合作伙伴',
    mainPartnerOne: '主要合作伙伴',
    mainPartnerTwo: '第二主要合作伙伴',
    premiumSpots: '高级广告位',
    slotCount: (n) => `${n} 个广告位`,
    slotOpen: '广告位招商中',
    partnersDirTitle: '我们的合作伙伴',
    partnersDirLead: '在 LaplandVibes 网络中与我们合作的企业：赞助内容和广告主，均标注为合作伙伴。',
    partnersDirEmptyTitle: '成为合作伙伴',
    partnersDirEmpty: '让您的企业出现在规划拉普兰之旅的旅行者面前：赞助内容和网络中的推荐位。',
    subpageOpen: '您的广告将全季展示在本页',
    wantYourAd: '想在这里展示您的广告吗？',
    sponsorSub: '成为主要合作伙伴：本站最显眼的广告位。',
    cardSub: '首页广告位：让您的企业出现在拉普兰旅行者面前。',
    premiumOpen: '广告位招商中',
    bookCta: '预订此广告位 →',
    bookShort: '预订 →',
  },
};

export function adSlotsCopy(locale?: string): AdSlotsCopy {
  return AD_SLOTS_COPY[normalizeAdLocale(locale)];
}

/**
 * LV Media -portaalin per-sivu-URL (piiloportaali, noindex).
 * Portaalissa on vain fi/en-reitit → fi saa /fi-prefiksin, kaikki muut → en.
 */
export function mediaSiteUrl(siteSlug: string, locale?: string): string {
  const fi = normalizeAdLocale(locale) === 'fi';
  return `https://laplandvibes.com${fi ? '/fi' : ''}/media/site/${siteSlug}`;
}

/** GA4-event tyhjän paikan CTA-klikille. gtag puuttuu → ei kaadu. */
export function fireAdvertiseHereClick(siteSlug: string, slotId: string): void {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.('event', 'advertise_here_click', {
      lv_site: siteSlug,
      lv_slot: slotId,
    });
  } catch {
    /* analytics ei saa estää navigointia */
  }
}
