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
  front: (Partner | null)[];
  listingTop: Partner | null;
  pages: Record<string, (Partner | null)[]>;
} = {
  // Etusivu: 2 pääsponsoripaikkaa (HomeAdSlots TASO 1 — tyhjä paikka
  // renderöi house-adin "Haluatko mainoksesi tähän?" → LV Media -portaali)
  front: [null, null],

  // Ravintolalistan kärki: 1 listing-korostuspaikka (ensimmäinen ennen ravintolakorttigridiä)
  listingTop: null,

  // Alasivukohtaiset paikat (ei seedissä dining-pilotille — varaus tuleville)
  pages: {},
};

/**
 * Etusivun standardi mainospaikkaosio (HomeAdSlots):
 *   TASO 1 = 2 pääsponsoria (sponsors viittaa PARTNERS.frontiin → vanha
 *   myyntiprosessi "täytä PARTNERS.front" toimii ennallaan)
 *   TASO 2 = 6 kohdekohtaista premium-paikkaa (Rovaniemi, Levi, Ylläs,
 *   Saariselkä, Kittilä, Inari). Myyty paikka → korvaa oikean kohteen
 *   partner-arvo Partner-objektilla.
 * Tyhjät paikat renderöivät "Haluatko mainoksesi tähän?" -house-adin
 * joka linkittää LV Media -portaaliin (/media/site/laplanddining).
 */
export const AD_SLOTS: HomeAdSlotsConfig = {
  siteSlug: 'laplanddining',
  sponsors: PARTNERS.front,
  spots: DEFAULT_PREMIUM_SPOTS,
};
