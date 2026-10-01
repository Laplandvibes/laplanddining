/**
 * laplanddining-new: appimainoksen aihe. Komponentti on jaettu — src/shared/appPromo/ on lv-opsin shared/appPromo/:n vendoroitu
 * kopio, jota ei muokata täällä (gate:apppromo-kopiot vertaa tavuilleen; muutos kanoniseen ja `node scripts/rollout_apppromo.mjs`).
 * Sivustokohtainen valinta kuuluu tähän tiedostoon. Aihe on kirjattu lv-opsin scripts/sivustot.json:iin (appiAihe).
 */
import { AppPromoHero as Hero, AppPromoNudge as Nudge } from '../shared/appPromo/AppPromo';

const FOCUS = 'eat';

export function AppPromoHero() {
  return <Hero focus={FOCUS} />;
}

export function AppPromoNudge() {
  return <Nudge focus={FOCUS} />;
}
