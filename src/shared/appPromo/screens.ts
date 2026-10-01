/**
 * Appimainoksen aiheet ja näkymät — shared/appPromo/. Kanoninen lv-opsissa; sivustoilla vendoroitu kopio
 * src/shared/appPromo/screens.ts (gate:apppromo-kopiot vertaa tavuilleen).
 *
 * AIHE (focus) = mitä tämän sivuston lukija käyttäisi appia varten (CLAUDE.md "Mainos rakennetaan sivun aiheesta käsin").
 * Sivusto valitsee aiheensa omassa src/components/AppPromo.tsx -kääreessään; mikä aihe millekin sivustolle kuuluu, on
 * kirjattu lv-opsin scripts/sivustot.json -rekisteriin (kenttä appiAihe), ja portti vertaa kääreen aihetta siihen.
 *
 * NÄKYMÄ (screen) = appin oikea näkymä: ?tab=-syvälinkki + kuvakaappaus /images/app-promo/<näkymä>-<kieli>.webp, joka
 * kaapataan tuotannon appista lukijan kielellä (lv-ops scripts/app_promo_shots.mjs, NAKYMAT). Hyödyn otsake on appin oma
 * välilehden nimi, jotta lukija tunnistaa sen appissa.
 *
 * 🔴 Rivimuoto on tarkoituksellinen: lv-opsin työkalut (rollout_apppromo.mjs, audit_apppromo_kopiot.mjs) lukevat
 * FOCUS_SCREENS-taulun tästä tiedostosta säännöllisellä lausekkeella — yksi aihe per rivi, näkymät heittomerkeissä.
 */
export type Screen =
  | 'now' | 'near' | 'weather' | 'sos' | 'routes' | 'ski' | 'taxi' | 'carhelp' | 'outdoors' | 'activities' | 'events' | 'aurora';

export type Focus =
  | 'general' | 'snowmobile' | 'ski' | 'stay' | 'move' | 'outdoors' | 'do' | 'eat' | 'aurora' | 'emergency';

/** Appin ?tab= jokaiselle näkymälle (tyhjä = etusivu). */
export const SCREEN_TAB: Record<Screen, string> = {
  now: '',
  near: 'near',
  weather: 'weather',
  sos: 'sos',
  routes: 'routes',
  ski: 'outdoors&mode=ski',
  taxi: 'taxi',
  carhelp: 'carhelp',
  outdoors: 'outdoors',
  activities: 'activities',
  events: 'events',
  aurora: '',
};

/**
 * Kolmen näkymän aiheet: puhelimessa ensimmäinen näkymä isona ja kolme hyötyä sen vieressä, tabletista ylöspäin kaikki
 * kolme näkymää rinnakkain (Vesa 1.10.2026). Yhden näkymän aiheet (aurora, emergency = laplandvisitin sää- ja
 * hätäsivujen yksiköt) näyttävät yhden näkymän joka leveydellä ja hyödyt tekstinä.
 */
export const FOCUS_SCREENS: Record<Focus, readonly Screen[]> = {
  general: ['now', 'near', 'sos'],
  snowmobile: ['routes', 'weather', 'sos'],
  ski: ['ski', 'weather', 'near'],
  stay: ['near', 'taxi', 'weather'],
  move: ['carhelp', 'weather', 'taxi'],
  outdoors: ['outdoors', 'weather', 'sos'],
  do: ['activities', 'events', 'weather'],
  eat: ['near', 'events', 'taxi'],
  aurora: ['aurora'],
  emergency: ['sos'],
};

/**
 * Kuvien sisällön tiiviste (8 heksaa git-blobien sha1:stä, scripts/lib/apppromo_kopiot.mjs kuvienTiiviste). Kaappausskripti
 * päivittää tämän rivin; gate:apppromo-kopiot tarkistaa että se vastaa shots/-kansiota. Uusi kaappaus samalla tiedostonimellä
 * ⇒ uusi ?v= ⇒ CDN ja selain hakevat uuden kuvan (version-images.mjs versioi vain kirjaimelliset polut, ei tätä).
 */
export const SHOTS_V = '6aa1e051';

/** Kuvan polku sivustolla. Kieli = sivun lokaali (fi, de, pt-BR, zh-CN …). */
export const shotSrc = (screen: Screen, lang: string): string => `/images/app-promo/${screen}-${lang}.webp?v=${SHOTS_V}`;
