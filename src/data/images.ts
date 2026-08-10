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
  foodCloseup: '/images/drive/foodCloseup.webp',
  foodMoody: '/images/drive/foodMoody.webp',
  kotaInside: '/images/drive/kotaInside.webp',
  kotaFire: '/images/drive/kotaFire.webp',
  // Keskiyön aurinko -kuvat. Etusivun kesäosio käytti ennen kotaFirea, joka oli
  // sama kuva kuin sivun KOTA-kortissa (Vesa 2026-08-10: "sama kuva kahteen
  // kertaan?"). Nyt osio näyttää sen sivun kuvan jolle se linkittää.
  midnightSunCard: '/images/midnight-sun-hero-800.webp',
  midnightSunBand: '/images/drive/midnightSunBand.webp',

  // Kaupunkikohtaiset bannerit (generoitu 2026-08-10, gpt-image-2).
  // Ennen tätä neljä kuvaa palveli 11:tä kaupunkia: Levi ja Kittilä näyttivät
  // saman kuvan peräkkäisissä osioissa (Vesa), foodMoody neljällä,
  // ingredientsAlt kahdella, snowVillage kolmella + sivun herolla talvella.
  kittilaDining: '/images/drive/kittilaDining.webp',
  sodankylaDining: '/images/drive/sodankylaDining.webp',
  hettaDining: '/images/drive/hettaDining.webp',
  posioDining: '/images/drive/posioDining.webp',
  muonioDining: '/images/drive/muonioDining.webp',
  luostoWinter: '/images/drive/luostoWinter.webp',
  sallaWinter: '/images/drive/sallaWinter.webp',
  restaurantsHeroWinter: '/images/drive/restaurantsHeroWinter.webp',
  ingredients: '/images/drive/ingredients.webp',
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
  featKammi: '/images/drive/featKammi.webp',
  featAanaar: '/images/drive/featAanaar.webp',
  featGustav: '/images/drive/featGustav.webp',
  featStarArctic: '/images/drive/featStarArctic.webp',
  featSnowRestaurant: '/images/drive/featSnowRestaurant.webp',
  // Page heroes
  heroFoodStory: '/images/drive/heroFoodStory.webp',
  heroLocalFood: '/images/drive/heroLocalFood.webp',
  // Local Food page — Arctic-nature section bands (AI-generated, unique to this site)
  localFoodForest: '/images/drive/localFoodForest.webp',     // Metsä — ruska forest floor, lingonberries, chanterelles
  localFoodRiver: '/images/drive/localFoodRiver.webp',       // Joki & järvi — clear Arctic stream over frosted stones
  localFoodReindeer: '/images/drive/localFoodReindeer.webp', // Poronhoito — reindeer in misty birch forest
  localFoodLakes: '/images/drive/localFoodLakes.webp',       // Hiljaiset järvet — mirror-still fell lake at dawn
};

// Automatic seasonal image switch — summer 1 May–30 Sep, winter 1 Oct–30 Apr.
// Mirrors the hub (laplandvibes) seasonal() so city cards flip winter↔summer by date, every year.
export const isSummerSeason = (): boolean => { const m = new Date().getMonth() + 1; return m >= 5 && m <= 9; };
export const seasonal = (winter: string, summer: string): string => (isSummerSeason() ? summer : winter);
