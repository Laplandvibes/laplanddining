import type { Locale } from '../i18n/config';

/**
 * Oman valokuvan kuvateksti lukijan kielellä: "Kuva: LaplandVibes · Levi, heinäkuu 2026",
 * "写真：LaplandVibes · レヴィ、2026年7月", "Photo : LaplandVibes · Ruka, juillet 2026".
 *
 * Jokainen osa tulee kielestä: sana (`PHOTO_BY`, restaurants.ts), paikka (kaupunkisivun
 * oma `cities.<slug>.name` tai `OTHER_PHOTO_PLACES`) ja kuukausi (Intl). Kaupunkisivujen
 * herossa rivi oli kirjoitettu JSX:ään suomeksi ja näkyi suomeksi kaikilla 12 kielellä.
 * Kielipuhtausportti lukee esirenderöityä HTML:ää, eikä tämä rivi ole siellä: se piirtyy
 * vasta selaimessa. Siksi rakenne pakottaa kielen, ja `scripts/lib/photo-credit.test.mjs`
 * vahtii jokaisen kielen tuloksen.
 *
 * Moduulissa ei ole ajonaikaisia importteja, jotta Node voi testata sen suoraan.
 */

/**
 * Kaksoispiste kielen omin välimerkein: ja/zh täysleveä "：" ilman väliä (ja- ja
 * cn-kielipassi), ranskassa sitova väli ennen kaksoispistettä (rivi ei katkea
 * "Photo"- ja ":"-merkkien väliin), muissa "Kuva: ".
 */
export function creditPrefix(word: string, locale: Locale): string {
  if (locale === 'ja' || locale === 'zh-CN') return `${word}：`;
  if (locale === 'fr') return `${word}\u00A0: `;
  return `${word}: `;
}

/**
 * Kuvauskuukausi 'YYYY-MM' kuukautena ja vuotena lukijan kielellä: "heinäkuu 2026",
 * "July 2026", "julio de 2026", "2026年7月", "2026년 7월".
 *
 * 🔴 Päivä rakennetaan ja muotoillaan UTC:ssä. `new Date('2026-07')` on UTC-keskiyö
 * 1.7., jonka Amerikan aikavyöhykkeellä oleva lukija näkee kesäkuuna.
 * Virheellinen arvo palauttaa tyhjän, jolloin kuvateksti jää ilman kuukautta
 * eikä sivu kaadu (Intl heittää RangeErrorin NaN-päivästä).
 */
export function monthYear(month: string, locale: Locale): string {
  const m = /^(\d{4})-(\d{2})$/.exec(month);
  if (!m) return '';
  const monthIndex = Number(m[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return '';
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(Date.UTC(Number(m[1]), monthIndex, 15));
}

/** Paikan ja kuukauden väli: japanissa "、", kiinassa "，", muissa ", ". */
const PLACE_MONTH_SEP: Partial<Record<Locale, string>> = { ja: '、', 'zh-CN': '，' };

/**
 * Koko kuvateksti. `word` = `PHOTO_BY[locale]`, `place` = paikan nimi jo lukijan
 * kielellä, `month` = 'YYYY-MM'.
 */
export function ownPhotoCredit(word: string, place: string, month: string, locale: Locale): string {
  const when = monthYear(month, locale);
  const where = when ? `${place}${PLACE_MONTH_SEP[locale] ?? ', '}${when}` : place;
  return `${creditPrefix(word, locale)}LaplandVibes · ${where}`;
}

/**
 * Kuvauspaikat, joilla ei ole omaa kaupunkisivua. Kaupunkisivun paikan nimi luetaan
 * sen omasta käännöksestä (`cities.<slug>.name`), jotta kuvateksti ja sivun otsikko
 * käyttävät samaa muotoa. Muodot verkoston kanonista: japani katakanana, kiina ja
 * korea omalla kirjoitusjärjestelmällään (GLOSSARY-TIER3.md, kielipassit).
 */
export const OTHER_PHOTO_PLACES: Record<string, Record<Locale, string>> = {
  ruka: {
    en: 'Ruka', fi: 'Ruka', de: 'Ruka', ja: 'ルカ', es: 'Ruka', 'pt-BR': 'Ruka',
    'zh-CN': '鲁卡', ko: '루카', fr: 'Ruka', it: 'Ruka', nl: 'Ruka', sv: 'Ruka',
  },
};
