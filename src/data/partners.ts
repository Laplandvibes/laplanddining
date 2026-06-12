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

export const PARTNERS: {
  front: (Partner | null)[];
  listingTop: Partner | null;
  pages: Record<string, (Partner | null)[]>;
} = {
  // Etusivu: 1 featured-korttipaikka
  front: [null],

  // Ravintolalistan kärki: 1 listing-korostuspaikka (ensimmäinen ennen ravintolakorttigridiä)
  listingTop: null,

  // Alasivukohtaiset paikat (ei seedissä dining-pilotille — varaus tuleville)
  pages: {},
};
