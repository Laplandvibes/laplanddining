import { DINING, seasonal } from './images';
import { restaurants } from './restaurants';

/**
 * Kaupunkisivujen rekisteri.
 *
 * MIKSI NÄMÄ SIVUT OVAT OLEMASSA (mitattu GSC:stä 7.9.2026). Sivustolla oli
 * kymmenen reittiä eikä yhtään kaupunkisivua, ja koko hakunäkyvyys kasautui
 * yhdelle `/restaurants/`-listalle: 2 158 näyttöä, 2 klikkiä, keskisijainti
 * 51,7. Google matchasi sitä 81 ravintolan nimilistana koko Suomen
 * ravintolahakuihin ("alastaron pizzeria", "aarla lapua"), ei Lapin
 * aihehakuihin. Sisarsivusto laplandnightlife.com, jolla on 14 kaupunkisivua,
 * rankkasi samaan aikaan sijoilla 8–12 ja keräsi ~19 klikkiä viikossa.
 *
 * 🔴 `city` ON SOPIMUS `Restaurant.city`:n kanssa — merkkijonon on täsmättävä
 * täsmälleen, myös ä/ö. Sivu väittää otsikossaan "ravintolat kaupungissa X"
 * 12 kielellä, joten väärä arvo ei ole lajitteluvirhe vaan julkaistu väite.
 * Portti `scripts/check-city-tags.mjs` mittaa jokaisen ravintolan
 * koordinaateista, että se on siinä kaupungissa jonka nimissä se esiintyy.
 *
 * 🔴 Kittilällä EI ole omaa sivua, vaikka `Restaurant.city` tunsi sen 7.9.2026
 * asti. Kaikki neljä "Kittilän" ravintolaa mitattiin Levin keskustaan 0,0–1,7
 * km:n päähän ja Kittilän kirkonkylästä 16–17 km:n päähän. Levi on Kittilän
 * kunnassa, joten Maps ei valehdellut — mutta kaupunkisivu ei ole kunta.
 * Ne kuuluvat Levin sivulle; ks. restaurant-overrides.ts.
 *
 * 🔴 Alaraja on NELJÄ ravintolaa. Muonio (3), Hetta (3), Salla (2) ja Posio (1)
 * ovat tarkoituksella ilman omaa sivua: kolmen kortin sivu 12 kielellä on
 * ohutta sisältöä, joka syö crawl-budjettia eikä vastaa kenenkään hakuun.
 * Ne näkyvät edelleen `/restaurants/`-listalla. Jos kaupunki kasvaa neljään,
 * lisää se tähän — ÄLÄ laske alarajaa.
 */
export interface DiningCity {
  /** URL-pala: /city/{slug}. ASCII-taivutettu kaupungin nimestä. */
  slug: string;
  /** TÄSMÄLLEEN sama merkkijono kuin `Restaurant.city`. */
  city: string;
  /** Näyttönimi otsikossa (EN-perusta; lokalisoidaan pages.json:issa). */
  name: string;
  /** Kortin ja sivun kuva. */
  img: string;
  /**
   * LV:n oma valokuva paikan päältä. Kun tämä on asetettu, se AJAA `img`:n yli
   * herossa ja kortissa — CLAUDE.md: "Own footage outranks stock."
   *
   * 🔴 `photoCredit` kertoo TARKAN paikan, ei kaupunkisivun nimeä. Kuusamon
   * sivu kattaa sekä Rukan että kirkonkylän 22 km:n päässä, ja Vesa 7.9.:
   * *"riistaravintola on rukalla, ei kuusamossa, ettei sekoitu"*. Kuva kertoo
   * itse missä se on otettu; sivun otsikko ei kelpaa kuvatekstiksi.
   */
  photo?: string;
  photoCredit?: string;
  /** Sitemapin prioriteetti: iso keskus 0.8, pieni kylä 0.6. */
  priority: number;
}

export const DINING_CITIES: DiningCity[] = [
  { slug: 'rovaniemi',   city: 'Rovaniemi',   name: 'Rovaniemi',   img: DINING.rovaniemiCenter, priority: 0.8 },
  { slug: 'levi',        city: 'Levi',        name: 'Levi',        img: DINING.kotaInside,      photo: '/images/cities/levi.webp', photoCredit: 'Levi, heinäkuu 2026', priority: 0.8 },
  { slug: 'yllas',       city: 'Ylläs',       name: 'Ylläs',       img: DINING.ingredientsAlt,  photo: '/images/cities/yllas.webp', photoCredit: 'Ylläs, heinäkuu 2026', priority: 0.8 },
  { slug: 'saariselka',  city: 'Saariselkä',  name: 'Saariselkä',  img: seasonal(DINING.auroraRestaurant, DINING.saariselkaSummer), priority: 0.8 },
  { slug: 'inari',       city: 'Inari',       name: 'Inari',       img: DINING.foodMoody,       priority: 0.7 },
  { slug: 'kemi',        city: 'Kemi',        name: 'Kemi',        img: seasonal(DINING.iceRestaurant, DINING.kemiSummer), priority: 0.7 },
  { slug: 'tornio',      city: 'Tornio',      name: 'Tornio',      img: DINING.ingredients,     photo: '/images/cities/tornio.webp', photoCredit: 'Tornio, heinäkuu 2026', priority: 0.7 },
  { slug: 'haparanda',   city: 'Haparanda',   name: 'Haparanda',   img: DINING.fineDining,      priority: 0.6 },
  { slug: 'sodankyla',   city: 'Sodankylä',   name: 'Sodankylä',   img: DINING.sodankylaDining, priority: 0.6 },
  { slug: 'pyhatunturi', city: 'Pyhätunturi', name: 'Pyhätunturi', img: seasonal(DINING.snowVillage, DINING.pyhaSummer), photo: '/images/cities/pyhatunturi.webp', photoCredit: 'Pyhätunturi, heinäkuu 2026', priority: 0.6 },
  { slug: 'luosto',      city: 'Luosto',      name: 'Luosto',      img: seasonal(DINING.luostoWinter, DINING.luostoSummer), priority: 0.6 },
  { slug: 'kuusamo',     city: 'Kuusamo',     name: 'Kuusamo',     img: DINING.exterior,        photo: '/images/cities/kuusamo.webp', photoCredit: 'Ruka, heinäkuu 2026', priority: 0.7 },
  { slug: 'kemijarvi',   city: 'Kemijärvi',   name: 'Kemijärvi',   img: DINING.exteriorAlt,     photo: '/images/cities/kemijarvi.webp', photoCredit: 'Kemijärvi, heinäkuu 2026', priority: 0.6 },
];

/** Alaraja omalle kaupunkisivulle. Ks. tiedoston yläkommentti. */
export const MIN_RESTAURANTS_FOR_CITY_PAGE = 4;

const BY_SLUG = new Map(DINING_CITIES.map((c) => [c.slug, c]));
const BY_CITY = new Map(DINING_CITIES.map((c) => [c.city, c]));

export function cityBySlug(slug: string | undefined): DiningCity | undefined {
  return slug ? BY_SLUG.get(slug) : undefined;
}

/** Kaupunkisivun slug kaupungin nimelle — `/restaurants/`-listan ristiinlinkitykseen. */
export function slugForCity(city: string): string | undefined {
  return BY_CITY.get(city)?.slug;
}

export function restaurantsForCity(city: string) {
  return restaurants.filter((r) => r.city === city);
}

/**
 * Todellinen ravintolamäärä per kaupunkisivu. Laskettu datasta eikä
 * kovakoodattu: luku näkyy kortissa ja otsikossa, joten sen on oltava sama
 * kuin sivulla oikeasti näkyvien korttien määrä.
 */
export function cityCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of DINING_CITIES) out[c.slug] = restaurantsForCity(c.city).length;
  return out;
}
