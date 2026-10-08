/**
 * LaplandDining image registry.
 *
 * Images are self-hosted under /public/images/drive/ (optimized WebP). Previously
 * hotlinked from Google Drive (lh3.googleusercontent.com) which throttled real
 * traffic and rendered blank/dark blocks on mobile. Localized 2026-06-09.
 */
export const DINING = {
  heroInterior: '/images/drive/heroInterior.webp',
  fineDining: '/images/drive/fineDining.webp',
  foodCloseup: '/images/commons/inari-fish-of-the-day-1920.webp',
  foodMoody: '/images/drive/foodMoody.webp',
  kotaInside: '/images/commons/enontekio-goahti-sonkamuotka-1920.webp', // 4.10.2026 aito: goahti Sonkamuotkassa (Ximonic)
  kotaFire: '/images/commons/utsjoki-kevo-goahti-1920.webp', // 4.10.2026 aito: kurkikota Kevon luonnonpuistossa (Xepheid)
  // Keskiyön aurinko -kuvat. Etusivun kesäosio käytti ennen kotaFirea, joka oli
  // sama kuva kuin sivun KOTA-kortissa (Vesa 2026-08-10: "sama kuva kahteen
  // kertaan?"). Nyt osio näyttää sen sivun kuvan jolle se linkittää.
  midnightSunCard: '/images/midnight-sun-hero-800.webp',
  midnightSunBand: '/images/own/ruka-terrace-july-1920.webp', // 4.10.2026 oma kuva: Rukan terassi 17.7.2026

  // Kaupunkikohtaiset bannerit (generoitu 2026-08-10, gpt-image-2).
  // Ennen tätä neljä kuvaa palveli 11:tä kaupunkia: Levi ja Kittilä näyttivät
  // saman kuvan peräkkäisissä osioissa (Vesa), foodMoody neljällä,
  // ingredientsAlt kahdella, snowVillage kolmella + sivun herolla talvella.
  kittilaDining: '/images/drive/kittilaDining.webp',
  sodankylaDining: '/images/drive/sodankylaDining.webp',
  hettaDining: '/images/commons/hetta-church-1920.webp',
  posioDining: '/images/commons/posio-korouoma-winter-1920.webp', // 8.10.2026: Korouoman kanjoni talvella (kallerna, PD)
  muonioDining: '/images/commons/muonio-church-1920.webp',
  luostoWinter: '/images/drive/luostoWinter.webp',
  sallaWinter: '/images/commons/salla-church-winter-1920.webp',
  restaurantsHeroWinter: '/images/drive/restaurantsHeroWinter.webp',
  ingredients: '/images/commons/suomussalmi-cloudberry-bilberries-1920.webp',
  ingredientsAlt: '/images/drive/ingredientsAlt.webp',
  exterior: '/images/drive/exterior.webp',
  exteriorAlt: '/images/drive/exteriorAlt.webp',
  // City banner images
  auroraRestaurant: '/images/drive/auroraRestaurant.webp',
  snowVillage: '/images/drive/snowVillage.webp',
  rovaniemiCenter: '/images/drive/rovaniemiCenter.webp',
  iceRestaurant: '/images/drive/iceRestaurant.webp',
  // Summer city-card images (Gamma GPT Image 2, #83) — replace winter ice/snow banners in June
  kemiSummer: '/images/drive/kemiSummer.webp',
  pyhaSummer: '/images/drive/pyhaSummer.webp',
  luostoSummer: '/images/drive/luostoSummer.webp',
  sallaSummer: '/images/drive/sallaSummer.webp',
  heroSummer: '/images/drive/heroSummer.webp',           // summer dining terrace — Restaurants page hero
  saariselkaSummer: '/images/drive/saariselkaSummer.webp', // Saariselkä summer lodge terrace
  // Restaurant-specific featured images (16:9)
  featKingCrab: '/images/drive/featKingCrab.webp',
  featNili: '/images/drive/featNili.webp',
  featKammi: '/images/commons/loimulohi-fire-1920.webp', // 4.10.2026 aito: loimulohi avotulella (Trogain). EI ravintola Kammin oma kuva: käytössä vain /food-history-luvussa 3
  featAanaar: '/images/drive/featAanaar.webp',
  featGustav: '/images/drive/featGustav.webp',
  featStarArctic: '/images/drive/featStarArctic.webp',
  featSnowRestaurant: '/images/drive/featSnowRestaurant.webp',
  // Page heroes
  heroFoodStory: '/images/drive/heroFoodStory.webp',
  heroLocalFood: '/images/drive/heroLocalFood.webp',
  // Local Food page — section bands (4.10.2026: aidot valokuvat, ks. photoCredits.ts)
  localFoodForest: '/images/commons/cloudberry-picking-bog-1920.webp', // Metsä — hillaa sangossa suolla (Kospo75)
  localFoodRiver: '/images/own/lapland-river-july-1920.webp', // Joki & järvi — oma kuva 21.7.2026
  localFoodReindeer: '/images/commons/enontekio-reindeer-autumn-1920.webp', // Poronhoito — porot ruskassa Käsivarressa, Enontekiö (BishkekRocks)
  localFoodLakes: '/images/commons/muonio-pallas-hanhijarvi-1920.webp', // Hiljaiset järvet — Hanhijärvi ja Pallas (Ximonic)
};

/**
 * Wikimedia Commons -valokuvat (4.10.2026, Vesa: verkoston tekoälykuvat aidoiksi).
 * Tiedostot: /images/commons/<nimi>-<leveys>.webp. Tekijä ja lisenssi: photoCredits.ts
 * (haetaan polusta, `creditFor`). Leveydet = mitä lähde riittää tekemään ilman suurennusta.
 *
 * srcset jokaiselle Commons-kuvalle KIRJAIMELLISINA merkkijonoina: buildin viimeinen askel
 * (version-images.mjs) lisää jokaiseen osoitteeseen ?v=<tiiviste> JS-nipussa, mikä ei
 * onnistuisi ajonaikana kootulle merkkijonolle.
 */
const COMMONS_SRCSET: Record<string, string> = {
  'rovaniemi-lordin-aukio-winter': '/images/commons/rovaniemi-lordin-aukio-winter-1280.webp 1280w, /images/commons/rovaniemi-lordin-aukio-winter-1920.webp 1920w, /images/commons/rovaniemi-lordin-aukio-winter-2560.webp 2560w',
  'rovaniemi-summer-beach': '/images/commons/rovaniemi-summer-beach-1280.webp 1280w, /images/commons/rovaniemi-summer-beach-1920.webp 1920w, /images/commons/rovaniemi-summer-beach-2560.webp 2560w',
  'inari-sajos-winter': '/images/commons/inari-sajos-winter-1280.webp 1280w, /images/commons/inari-sajos-winter-1920.webp 1920w',
  'inari-juutua-river-summer': '/images/commons/inari-juutua-river-summer-1280.webp 1280w, /images/commons/inari-juutua-river-summer-1920.webp 1920w, /images/commons/inari-juutua-river-summer-2560.webp 2560w',
  'rovaniemi-ounasvaara-midnight-sun-1953': '/images/commons/rovaniemi-ounasvaara-midnight-sun-1953-1280.webp 1280w, /images/commons/rovaniemi-ounasvaara-midnight-sun-1953-1920.webp 1920w, /images/commons/rovaniemi-ounasvaara-midnight-sun-1953-2560.webp 2560w',
  'inari-wilderness-hotel-restaurant': '/images/commons/inari-wilderness-hotel-restaurant-1280.webp 1280w, /images/commons/inari-wilderness-hotel-restaurant-1920.webp 1920w, /images/commons/inari-wilderness-hotel-restaurant-2560.webp 2560w',
  'saariselka-huippu-winter': '/images/commons/saariselka-huippu-winter-1280.webp 1280w, /images/commons/saariselka-huippu-winter-1920.webp 1920w',
  'kemi-lumilinna-entrance-winter': '/images/commons/kemi-lumilinna-entrance-winter-1280.webp 1280w, /images/commons/kemi-lumilinna-entrance-winter-1920.webp 1920w, /images/commons/kemi-lumilinna-entrance-winter-2560.webp 2560w',
  'kemi-lumikki-winter': '/images/commons/kemi-lumikki-winter-1280.webp 1280w, /images/commons/kemi-lumikki-winter-1920.webp 1920w, /images/commons/kemi-lumikki-winter-2560.webp 2560w',
  'kemi-meripuisto-pavilion-winter': '/images/commons/kemi-meripuisto-pavilion-winter-1280.webp 1280w, /images/commons/kemi-meripuisto-pavilion-winter-1920.webp 1920w, /images/commons/kemi-meripuisto-pavilion-winter-2560.webp 2560w',
  'kemi-meripuisto-pavilion-summer': '/images/commons/kemi-meripuisto-pavilion-summer-1280.webp 1280w, /images/commons/kemi-meripuisto-pavilion-summer-1920.webp 1920w, /images/commons/kemi-meripuisto-pavilion-summer-2560.webp 2560w',
  'sodankyla-old-church-winter': '/images/commons/sodankyla-old-church-winter-1280.webp 1280w, /images/commons/sodankyla-old-church-winter-1920.webp 1920w, /images/commons/sodankyla-old-church-winter-2560.webp 2560w',
  'sodankyla-old-church-summer': '/images/commons/sodankyla-old-church-summer-1280.webp 1280w, /images/commons/sodankyla-old-church-summer-1920.webp 1920w',
  'haparanda-stadshotell-winter': '/images/commons/haparanda-stadshotell-winter-1280.webp 1280w, /images/commons/haparanda-stadshotell-winter-1920.webp 1920w, /images/commons/haparanda-stadshotell-winter-2560.webp 2560w',
  'haparanda-stadshotell-summer': '/images/commons/haparanda-stadshotell-summer-1280.webp 1280w, /images/commons/haparanda-stadshotell-summer-1920.webp 1920w, /images/commons/haparanda-stadshotell-summer-2560.webp 2560w',
  'rovaniemi-pohjanhovi-cooks-1936': '/images/commons/rovaniemi-pohjanhovi-cooks-1936-1280.webp 1280w, /images/commons/rovaniemi-pohjanhovi-cooks-1936-1920.webp 1920w, /images/commons/rovaniemi-pohjanhovi-cooks-1936-2560.webp 2560w',
  'kuusamo-cloudberry': '/images/commons/kuusamo-cloudberry-1280.webp 1280w, /images/commons/kuusamo-cloudberry-1920.webp 1920w',
  'north-finland-cloudberry': '/images/commons/north-finland-cloudberry-1280.webp 1280w, /images/commons/north-finland-cloudberry-1920.webp 1920w, /images/commons/north-finland-cloudberry-2560.webp 2560w',
  'utsjoki-kevo-goahti': '/images/commons/utsjoki-kevo-goahti-1280.webp 1280w, /images/commons/utsjoki-kevo-goahti-1920.webp 1920w',
  'suomussalmi-cloudberry-bilberries': '/images/commons/suomussalmi-cloudberry-bilberries-1280.webp 1280w, /images/commons/suomussalmi-cloudberry-bilberries-1920.webp 1920w',
  'enontekio-goahti-sonkamuotka': '/images/commons/enontekio-goahti-sonkamuotka-1280.webp 1280w, /images/commons/enontekio-goahti-sonkamuotka-1920.webp 1920w',
  'kuusamo-kaylankoski-winter': '/images/commons/kuusamo-kaylankoski-winter-1280.webp 1280w, /images/commons/kuusamo-kaylankoski-winter-1920.webp 1920w',
  'sodankyla-reindeer-sled-1938': '/images/commons/sodankyla-reindeer-sled-1938-1280.webp 1280w, /images/commons/sodankyla-reindeer-sled-1938-1920.webp 1920w',
  'muonio-church': '/images/commons/muonio-church-1280.webp 1280w, /images/commons/muonio-church-1920.webp 1920w',
  'hetta-church': '/images/commons/hetta-church-1280.webp 1280w, /images/commons/hetta-church-1920.webp 1920w',
  'salla-church-winter': '/images/commons/salla-church-winter-1280.webp 1280w, /images/commons/salla-church-winter-1920.webp 1920w',
  'posio-korouoma-winter': '/images/commons/posio-korouoma-winter-1280.webp 1280w, /images/commons/posio-korouoma-winter-1920.webp 1920w',
  'cloudberry-picking-bog': '/images/commons/cloudberry-picking-bog-1280.webp 1280w, /images/commons/cloudberry-picking-bog-1920.webp 1920w',
  'muonio-pallas-hanhijarvi': '/images/commons/muonio-pallas-hanhijarvi-1280.webp 1280w, /images/commons/muonio-pallas-hanhijarvi-1920.webp 1920w',
  'loimulohi-fire': '/images/commons/loimulohi-fire-1280.webp 1280w, /images/commons/loimulohi-fire-1920.webp 1920w',
  'inari-fish-of-the-day': '/images/commons/inari-fish-of-the-day-1280.webp 1280w, /images/commons/inari-fish-of-the-day-1920.webp 1920w',
  'enontekio-reindeer-autumn': '/images/commons/enontekio-reindeer-autumn-1280.webp 1280w, /images/commons/enontekio-reindeer-autumn-1920.webp 1920w',
  // LV:n omat valokuvat (heinäkuun 2026 reissu), sama srcset-malli
};
const OWN_SRCSET: Record<string, string> = {
  'lapland-river-july': '/images/own/lapland-river-july-1280.webp 1280w, /images/own/lapland-river-july-1920.webp 1920w',
  'ruka-terrace-july': '/images/own/ruka-terrace-july-1280.webp 1280w, /images/own/ruka-terrace-july-1920.webp 1920w',
};
/** Oletustiedosto `src`:ksi: 1920 px tai suurin pienempi. */
const commons = (name: string): string => {
  const parts = (COMMONS_SRCSET[name] ?? OWN_SRCSET[name]).split(', ').map((x) => x.split(' ')[0]);
  return parts.find((u) => u.includes('-1920.webp')) ?? parts[parts.length - 1];
};

export const PHOTO = {
  rovaniemiWinter: commons('rovaniemi-lordin-aukio-winter'),
  rovaniemiSummer: commons('rovaniemi-summer-beach'),
  inariWinter: commons('inari-sajos-winter'),
  inariSummer: commons('inari-juutua-river-summer'),
  /** Arkistokuva: keskiyön aurinko Ounasvaaralta juhannuksena 1953 (Eero Sauri, CC BY 4.0). */
  midnightSunOunasvaara1953: commons('rovaniemi-ounasvaara-midnight-sun-1953'),
  inariRestaurantInterior: commons('inari-wilderness-hotel-restaurant'),
  saariselkaWinter: commons('saariselka-huippu-winter'),
  kemiWinter: commons('kemi-lumilinna-entrance-winter'),
  kemiLumikkiWinter: commons('kemi-lumikki-winter'),
  pavilionWinter: commons('kemi-meripuisto-pavilion-winter'),
  pavilionSummer: commons('kemi-meripuisto-pavilion-summer'),
  sodankylaWinter: commons('sodankyla-old-church-winter'),
  sodankylaSummer: commons('sodankyla-old-church-summer'),
  haparandaWinter: commons('haparanda-stadshotell-winter'),
  haparandaSummer: commons('haparanda-stadshotell-summer'),
  pohjanhoviCooks1936: commons('rovaniemi-pohjanhovi-cooks-1936'),
  cloudberryKuusamo: commons('kuusamo-cloudberry'),
  cloudberryNorth: commons('north-finland-cloudberry'),
  kaylankoskiWinter: commons('kuusamo-kaylankoski-winter'),
  reindeerSled1938: commons('sodankyla-reindeer-sled-1938'),
  /** Pexels 5395184 (Pexels License, ladattu 2020, paikaton — alt ei väitä paikkaa). */
  platedFish: '/images/stock/pexels-5395184-plated-fish-1280.webp',
};

/**
 * srcset Commons-kuvalle; muille kuville undefined (img ilman srcsetiä toimii kuten ennenkin).
 * 🔴 §6.6: hero ei ole yksi tiedosto — jokainen koko on pienennetty samasta Commonsin
 * alkuperäisestä ja todennetaan livenä (sha256 live == repo).
 */
export function photoSrcSet(src?: string): string | undefined {
  const m = src ? /^\/images\/(commons|own)\/(.+)-\d+\.webp(?:\?.*)?$/.exec(src) : null;
  return m ? (m[1] === 'own' ? OWN_SRCSET[m[2]] : COMMONS_SRCSET[m[2]]) : undefined;
}

// Automatic seasonal image switch — summer 1 May–30 Sep, winter 1 Oct–30 Apr.
// Mirrors the hub (laplandvibes) seasonal() so city cards flip winter↔summer by date, every year.
export const isSummerSeason = (): boolean => { const m = new Date().getMonth() + 1; return m >= 5 && m <= 9; };
export const seasonal = (winter: string, summer: string): string => (isSummerSeason() ? summer : winter);
