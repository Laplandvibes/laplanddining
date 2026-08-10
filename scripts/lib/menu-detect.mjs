/**
 * Ruokalistalinkkien tunnistus. Jaettu discover-menu-links.mjs:n ja
 * check-menu-links.mjs:n kesken, jotta loyto ja kuukausivahti kayttavat
 * taysin samaa porttia.
 *
 * Miksi todisteportti on olemassa: 10.8.2026 koeajossa pelkalla
 * linkkitekstin pisteytyksella 43/70 osui, mutta joukossa oli annoskuvia
 * (hulluporo.fi/...-alacarte2.jpg) ja geneerisia menupalveluita
 * (ruokalistasivut.fi). HTTP 200 ei ole verifiointi.
 */

/** Montako hintamerkintaa sivulla pitaa olla, jotta se kelpaa ruokalistaksi. */
export const EVIDENCE_MIN = 3;

// Kotimaiset termit ennen yleista sanaa "menu", joka osuu myos
// navigaatio- ja evastevimpaimiin.
const WORDS = [
  [/ruokalist/i, 10],
  [/\bmeny\b|menyy/i, 9],
  [/speisekarte/i, 9],
  [/a-?la-?carte|à\s?la\s?carte/i, 8],
  [/annokset/i, 8],
  [/lounaslist|lunch-?menu/i, 7],
  [/\bmenu\b|\bmenut\b/i, 6],
  [/lounas\b/i, 5],
  [/\bfood\b|\bruoka\b/i, 3],
];

const NEG = /(nav|hamburger|cookie|mobile|toggle|skip)[-_ ]?menu|menu[-_ ]?(toggle|btn|button|icon)|\.js($|\?)/i;

/** 0 = ei ehdokas. Suurempi = vahvempi ruokalistasignaali. */
export function scoreCandidate(href, text) {
  const hay = `${href} ${text}`;
  if (NEG.test(hay)) return 0;
  if (/^#/.test(href.trim())) return 0;
  let s = 0;
  for (const [re, pts] of WORDS) if (re.test(hay)) s = Math.max(s, pts);
  if (!s) return 0;
  if (/\.pdf($|\?)/i.test(href)) s += 2;
  if (!/^https?:\/\//i.test(href)) s += 1; // oman sivuston polku on parempi kuin ulkolinkki
  return s;
}

// "24,50 €" | "€ 24,50" | "EUR 12.50" | "24.50€"
const PRICE = /(?:€|\bEUR\b)\s?\d{1,3}(?:[.,]\d{2})|\d{1,3}[.,]\d{2}\s?(?:€|\bEUR\b)/gi;

/** Hintamerkintojen maara. Pelkka "10 euroa" ei kelpaa, koska se osuu esitteisiin. */
export function countPriceTokens(text) {
  return (text.match(PRICE) ?? []).length;
}

export function classifyKind(url) {
  if (/\.pdf($|\?)/i.test(url)) return 'pdf';
  if (/\.(jpe?g|png|webp|gif|avif)($|\?)/i.test(url)) return 'image';
  return 'page';
}

const bare = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return '';
  }
};

export function sameHost(a, b) {
  const x = bare(a);
  return x !== '' && x === bare(b);
}
