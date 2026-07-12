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

import type { Partner } from '../../../shared/PartnerSlot';
import type { HomeAdSlotsConfig } from '../../../shared/HomeAdSlots';
import { DEFAULT_PREMIUM_SPOTS } from '../../../shared/PremiumSpotGrid';

export const PARTNERS: {
  mainPartner: Partner | null;
  front: (Partner | null)[];
  listingTop: Partner | null;
  pages: Record<string, (Partner | null)[]>;
} = {
  // Pääkumppani: nauha joka sivulla (SponsorStrip) + vasen sivurraili
  mainPartner: null,

  // Etusivun kortit A (vasen) + B (oikea) — myydään erikseen
  front: [null, null],

  // Ravintolalistan kärki: 1 listing-korostuspaikka (ensimmäinen ennen ravintolakorttigridiä)
  listingTop: null,

  // Alasivukohtaiset mainospaikat, avain = reitti (esim. '/restaurants')
  pages: {},
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
import type { PartnerDirEntry } from '../../../shared/PartnersDirectory';
export const PARTNER_ARTICLES: PartnerDirEntry[] = [];
