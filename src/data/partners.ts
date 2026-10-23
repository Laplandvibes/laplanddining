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
 * 🔴 ESIKATSELU 23.10.2026, EI JULKAISTU: Petri näkee mainoksen ennen kuin se menee näkyviin
 * (luvattu 19.10.). Ennen mergeä: Petrin hyväksyntä, Worker-reitti `visitinari` + deploy,
 * articleUrl vasta kun /blog/visit-inari on julkaistu.
 * Kuva: oma valokuva Ravintola Auroran salista 12.10.2026 klo 19.11 (20261012_191137, otettu
 * heti Restaurant Aurora -kyltin jälkeen), ei sama tiedosto kuin artikkelissa.
 */
const visitInariDining: Partner = {
  name: 'Visit Inari',
  tagline: 'Ravintola Aurora Inarin keskustassa',
  taglineEn: 'Restaurant Aurora in the centre of Inari',
  taglineSv: 'Restaurang Aurora mitt i Enare',
  description: 'Ravintola Aurora on Hotelli Inarin yhteydessä Inarintie 40:ssä, ja sen ikkunoista näkee Inarijärvelle Juutuanvuonon suuntaan. Ivalossa saman perheyrityksen Hotelli Ravintola Kultahippu kattaa lounaaksi noutopöydän.',
  descriptionEn: 'Restaurant Aurora is part of Hotel Inari at Inarintie 40, and its windows look out over Lake Inari towards Juutuanvuono bay. In Ivalo, the same family business runs Hotel Restaurant Kultahippu, with a lunch buffet.',
  descriptionSv: 'Restaurang Aurora hör till Hotel Inari på Inarintie 40, och från fönstren ser man ut över Enaresjön mot Juutuanvuono. I Ivalo driver samma familjeföretag Hotell Restaurang Kultahippu med lunchbuffé.',
  url: 'https://go.laplandvibes.com/go/visitinari?sid=dining_city_inari&dest=https%3A%2F%2Fvisitinari.fi%2Frestaurant-aurora%2F',
  urlFi: 'https://go.laplandvibes.com/go/visitinari?sid=dining_city_inari&dest=https%3A%2F%2Fvisitinari.fi%2Ffi%2Fravintola-aurora%2F',
  imageSrc: '/images/partners/visitinari-ravintola-aurora.webp',
  logoSrc: '/images/partners/visitinari.svg',
  logoAlt: 'Visit Inari',
  ctaLabel: 'Katso Ravintola Aurora',
  ctaLabelEn: 'See Restaurant Aurora',
  ctaLabelSv: 'Se Restaurang Aurora',
  articleUrl: 'https://laplandvibes.com/fi/blog/visit-inari/',
  articleUrlEn: 'https://laplandvibes.com/blog/visit-inari/',
  articleUrlSv: 'https://laplandvibes.com/sv/blog/visit-inari/',
  articleLabel: 'Lue juttu',
  articleLabelEn: 'Read the article',
  articleLabelSv: 'Läs artikeln',
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
