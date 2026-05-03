/**
 * LaplandDining image registry.
 *
 * All images are hosted on Google Drive (lh3.googleusercontent.com). The `-rw`
 * suffix asks Drive's CDN to transcode PNG/JPG → WebP on the fly: ~22% smaller
 * at w=1600, ~55% smaller at w=1200. Verified ecosystem-wide 2026-04-30.
 * See lv_drive_webp_rw_trick.md.
 */
const driveImg = (id: string, w = 1600) =>
  `https://lh3.googleusercontent.com/d/${id}=w${w}-rw`;

export const DINING = {
  heroInterior: driveImg('1p7HW7MOdgCXMtGRBu4rCHAUw8yrsqJHa'),
  fineDining: driveImg('1GbpqKdolAHM5X9uZjb01wYahIuerNEn1'),
  foodCloseup: driveImg('14UtGzLhuG_G209L7GwrlkF_-4TXN6bCh', 800),
  foodMoody: driveImg('1a5Niot9yqwdfV8TkQS5T6B49a1mI7Ppu', 800),
  kotaInside: driveImg('1gSVqhh-1kHs_CqPDMiGw9duHbSiBrr9l'),
  kotaFire: driveImg('1HU36180AmZukxByMRoDJsyaXM7VOp4rg', 800),
  ingredients: driveImg('1GrxCvJywO8CGLuy9SMh-exaxBn90UiaX', 800),
  ingredientsAlt: driveImg('1fcernJ22p498YS_hsL5Esn3PnodE_pSy', 800),
  exterior: driveImg('16vrw8ikETu3OV4ip3h9VJiZPSNLSROyC'),
  exteriorAlt: driveImg('1OGNik9xgwza369dt4vj1wXJLO7RJydC2', 800),
  // City banner images
  auroraRestaurant: driveImg('1TTHcB3fLeWd8I9KjE9taSDowlx9I4wa0'),
  snowVillage: driveImg('1fSRRrPhEQNNyIf1J9OU0zWI7fyo043ha'),
  rovaniemiCenter: driveImg('1OjgcY72TVOViQrD-jHyglEWzqXZKTVPo'),
  iceRestaurant: driveImg('1NhJ-hWbzMmRBjbcZwtu_6IRmFVGaodRk'),
  // Restaurant-specific featured images (16:9)
  featKingCrab: driveImg('1m1QSTYfLT1gMr97ez3ZplUHhcAt71ZJ_'),
  featNili: driveImg('1mc_01jQCQ7hJbStxkUtsoZcb1pdz_Sl3'),
  featKammi: driveImg('1xr4R0otuvZeanmkeM4khjg8BGpbEWkie'),
  featAanaar: driveImg('1NdW7-plcsGKiq1wV_fN2-wXMsf_eBCjK'),
  featGustav: driveImg('1wLZPpjp6P6Qej20VE3PpDDnOgCh-qKh6'),
  featStarArctic: driveImg('1PWojTdyDH6I9_XomAj0wWDRmwRYdRGIn'),
  featSnowRestaurant: driveImg('1G4qbCyJhcSj5Y5QE6Ear-Y0PFsqCjeU9'),
  // Page heroes
  heroFoodStory: driveImg('12JaYlv_GRvbFwyN95-n0lJdQMK7mCMWS'),
  heroLocalFood: driveImg('1fS_a6LtyfWGoUkr4UB6u74mAzIGK9-lb'),
};
