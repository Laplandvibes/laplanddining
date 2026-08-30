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
 */
export default function PhotoCaption({ r, locale }: { r: Restaurant; locale: Locale }) {
  const caption = photoCaption(r, locale);
  if (!caption) return null;
  return (
    <span className="absolute bottom-0 right-0 z-10 px-2 py-[3px] rounded-tl-md bg-warm-ink/70 backdrop-blur-[2px] text-cream/75 text-[9px] leading-none tracking-wide pointer-events-none">
      {caption}
    </span>
  );
}
