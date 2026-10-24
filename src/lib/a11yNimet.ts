import type { Locale } from '../data/restaurants';

/**
 * Ruudunlukijan nimet lukijan kielellä (portti gate:a11y-nimet, 24.10.2026).
 * Ennen näitä arviolinkin nimi "1,048 Google reviews: X", kuvan alt "X in Rovaniemi"
 * ja logolinkin "LaplandDining home" luettiin englanniksi kaikilla 12 kielellä.
 * Ravintolan ja kaupungin nimet pysyvät sellaisinaan: ne ovat nimiä.
 */

const NUM_TAG: Record<Locale, string> = {
  en: 'en', fi: 'fi', sv: 'sv', de: 'de', es: 'es', fr: 'fr', it: 'it', nl: 'nl',
  'pt-BR': 'pt-BR', ja: 'ja', ko: 'ko', 'zh-CN': 'zh-CN',
};

/** Arviopillerin linkin nimi: ravintola + arvioiden määrä Googlessa. */
export function reviewsAria(count: number | undefined, name: string, locale: Locale): string {
  const n = count != null ? count.toLocaleString(NUM_TAG[locale] ?? 'en') : '';
  switch (locale) {
    case 'fi': return `${name}: ${n} arvostelua Googlessa`;
    case 'sv': return `${name}: ${n} recensioner på Google`;
    case 'de': return `${name}: ${n} Google-Bewertungen`;
    case 'es': return `${name}: ${n} reseñas en Google`;
    case 'fr': return `${name} : ${n} avis Google`;
    case 'it': return `${name}: ${n} recensioni su Google`;
    case 'nl': return `${name}: ${n} Google-reviews`;
    case 'pt-BR': return `${name}: ${n} avaliações no Google`;
    case 'ja': return `${name}：Googleのクチコミ${n}件`;
    case 'ko': return `${name}: Google 리뷰 ${n}개`;
    case 'zh-CN': return `${name}：Google 评价 ${n} 条`;
    default: return `${n} Google reviews: ${name}`;
  }
}

/** Ravintolakuvan alt: "Nili Restaurant in Rovaniemi" lukijan kielellä. */
export function placeAlt(name: string, city: string, locale: Locale): string {
  switch (locale) {
    case 'fi': return `${name}, ${city}`;
    case 'sv': return `${name} i ${city}`;
    case 'de': return `${name} in ${city}`;
    case 'es': return `${name} en ${city}`;
    case 'fr': return `${name} à ${city}`;
    case 'it': return `${name} a ${city}`;
    case 'nl': return `${name} in ${city}`;
    case 'pt-BR': return `${name} em ${city}`;
    case 'ja': return `${name}（${city}）`;
    case 'ko': return `${city}의 ${name}`;
    case 'zh-CN': return `${city}的${name}`;
    default: return `${name} in ${city}`;
  }
}

/** Logolinkin nimi, verkoston yhteinen sanasto. */
const HOME: Record<Locale, string> = {
  en: 'LaplandDining home', fi: 'LaplandDining, etusivu', sv: 'LaplandDining, startsida',
  de: 'LaplandDining, Startseite', es: 'LaplandDining, página de inicio', fr: 'LaplandDining, page d’accueil',
  it: 'LaplandDining, pagina iniziale', nl: 'LaplandDining, startpagina', 'pt-BR': 'LaplandDining, página inicial',
  ja: 'LaplandDining ホーム', ko: 'LaplandDining 홈', 'zh-CN': 'LaplandDining 首页',
};
export const homeAria = (locale: Locale): string => HOME[locale] ?? HOME.en;

/** "Public domain" lukijan kielellä; CC-lisenssien nimet ovat nimiä ja pysyvät. */
const PUBLIC_DOMAIN: Record<Locale, string> = {
  en: 'Public domain', fi: 'Tekijänoikeuksista vapaa', sv: 'Allmän egendom', de: 'Gemeinfrei',
  es: 'Dominio público', fr: 'Domaine public', it: 'Pubblico dominio', nl: 'Publiek domein',
  'pt-BR': 'Domínio público', ja: 'パブリックドメイン', ko: '퍼블릭 도메인', 'zh-CN': '公有领域',
};
export function licenseLabel(license: string, locale: Locale): string {
  return /^public domain$/i.test(license.trim()) ? (PUBLIC_DOMAIN[locale] ?? license) : license;
}
