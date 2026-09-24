import { photoCaption, type Restaurant, type Locale } from '../data/restaurants';

/**
 * Kuvakaistan alareunan merkintä.
 *
 * AI-kuvituskuva merkitään AINA ("Kuvituskuva"), jotta kortti ei väitä esittävänsä
 * juuri tätä ravintolaa. Kumppanin oma kuva merkitään lähteellä ("Kuva: nili.fi"),
 * ja LV:n itse paikan päällä ottama aito valokuva (kind "photo") lähteellä
 * "Kuva: LaplandVibes" — se ESITTÄÄ juuri tätä ravintolaa, joten Kuvituskuva-
 * merkintä olisi väärin (Vesa 30.8.2026: oma aito valokuva voittaa AI:n).
 * Vesan ohje 2026-08-09: merkintä pienellä kuvan alareunaan.
 *
 * 🔴 Käytä tätä JOKAISELLA pinnalla joka renderöi `r.photo` — kortti ilman merkintää
 * on juuri se ongelma jonka tämä ratkaisee. Nykyiset pinnat: CityTopPicksGrid,
 * Restaurants, FineDining.
 *
 * Vaatii että vanhempi on `relative`.
 *
 * Muste on täysi cream, koska merkintä voi osua kuvan vaaleimpaan kohtaan: puhtaan
 * valkoisen kuvan päällä pohja `bg-warm-ink/70` piirtyy harmaana (≈ #605A58), ja
 * cream on sitä vasten 6,3:1, kun 75 % cream jää 4,4:1:een (raja 9 px:n tekstille
 * 4,5:1). Merkintä pysyy huomaamattomana koon ja paikan ansiosta.
 */
export default function PhotoCaption({ r, locale }: { r: Restaurant; locale: Locale }) {
  const caption = photoCaption(r, locale);
  if (!caption) return null;
  return (
    <span className="absolute bottom-0 right-0 z-10 px-2 py-[3px] rounded-tl-md bg-warm-ink/70 backdrop-blur-[2px] text-cream text-[9px] leading-none tracking-wide pointer-events-none">
      {caption}
    </span>
  );
}
