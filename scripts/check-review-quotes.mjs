#!/usr/bin/env node
/**
 * Portti: ravintolakortissa näkyvä Google-arviositaatti ei saa olla kielteinen.
 *
 * MIKSI TÄMÄ ON OLEMASSA (Vesa 7.9.2026, Pyhätunturin kaupunkisivu):
 * *"eihän meillä nyt voi olla mitään negatiivista kommenttia ravintolan
 * mainoksessa?"* — Ravintola Popolon kortissa luki sanatarkasti
 * *"the quality of pizza does not equal the price"*.
 *
 * 🔴🔴 Sitaatti ei ole mielipide vaan MEIDÄN valintamme. `reviewQuote` tulee
 * Maps-synkasta automaattisesti, se on kortin näkyvin tekstirivi, eikä yhtäkään
 * 81:stä ollut luettu läpi. Sivusto esittää itsensä suosituslistana ja ottaa
 * provision varauksista — kielteinen sitaatti on silloin sekä vahinko
 * ravintolalle että katteeton lupaus lukijalle.
 *
 * 🔴 Tämä portti EI yritä arvioida sävyä koneellisesti. Se poimii tunnetut
 * kielteiset ilmaukset ja vaatii, että jokainen osuma on joko korjattu
 * (`curatedDescription` overrides-tiedostossa, joka ajaa sitaatin yli) tai
 * kuitattu tässä tiedostossa perusteluineen. Uusi sync ei voi tuoda kielteistä
 * sitaattia liveen kenenkään huomaamatta.
 *
 * 🔴 Heittomerkki on KAKSI merkkiä. Google palauttaa sekä ASCII-heittomerkin
 * että kaarevan U+2019:n. Ensimmäinen versio etsi vain ASCII:ta ja päästi läpi
 * Talonpöydän "wasn’t quite what I had expected" — portti olisi ollut vihreä
 * ja moite livenä. Merkkiluokka [’'] molempiin.
 *
 * Aja: node scripts/check-review-quotes.mjs
 *      node scripts/check-review-quotes.mjs --all   (listaa kaikki sitaatit)
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Kielteiset signaalit. Sanalista, ei tekoäly — jokainen osuma katsotaan
 * käsin. Väärä positiivinen maksaa yhden silmäyksen; väärä negatiivinen
 * julkaisee moitteen ravintolan omassa kortissa.
 */
const SIGNAALIT = [
  /\bdoes not\b/i, /\bdoesn[’']?t\b/i, /\bdidn[’']?t\b/i, /\bwasn[’']?t\b/i,
  /\bweren[’']?t\b/i, /\bisn[’']?t\b/i, /\bcouldn[’']?t\b/i, /\bwouldn[’']?t\b/i,
  /\bnot (quite|really|worth|good|great|impressed)\b/i,
  /\bdissatisf/i, /\bdisappoint/i, /\bcritique\b/i, /\bcomplain/i,
  /\bslow\b/i, /\boverpriced\b/i, /\btoo (expensive|salty|dry|cold|small)\b/i,
  /\blimited\b/i, /\brestricted\b/i, /\bmistake\b/i, /\bfake\b/i,
  /\bbland\b/i, /\bmediocre\b/i, /\bunfortunately\b/i,
  /\bno (side dishes|vegan|options|atmosphere)\b/i,
  /\bexcept\b/i, /\bhowever\b/i, /\bbut it[’']?s\b/i,
  /\balthough\b/i, /\bwhat I had expected\b/i,
];

/**
 * Kuitatut osumat: sitaatti sisältää signaalisanan mutta on kokonaisuutena
 * myönteinen. Avain = ravintolan nimi, arvo = peruste.
 *
 * 🔴 Lisää rivi tänne VAIN luettuasi sitaatin kokonaan. Jos joudut
 * selittelemään miksi se on ok, se ei ole ok.
 */
const KUITATUT = new Map([
  ['Pizzeria Ruka',
   '"not many times I am lucky to by chance pass a pizza restaurant and actually say wow" — kehu, kieltosana kuuluu rakenteeseen'],
  ['Pizzeria Posio',
   '"even though there were no vegan options... they made me a pizza without mozzarella, delicious" — kehu joustavuudesta'],
  ['Arctic River Resort',
   '"absolutely delighted" — ei kielteistä sisältöä; tarkistettu'],
  ['Amico Pizza & Kebab restaurant',
   '"colleague didn’t want a pizza or wrap so the staff made a chickpea curry" — kehu joustavuudesta, kieltosana koskee asiakasta ei ravintolaa'],
]);

const maps = JSON.parse(
  readFileSync(resolve(ROOT, 'src/data/generated/restaurants-from-maps.json'), 'utf8'),
);
const ovSrc = readFileSync(resolve(ROOT, 'src/data/restaurant-overrides.ts'), 'utf8');

/**
 * `curatedDescription` ajaa sitaatin yli kortissa (ks. composeCardBody), joten
 * ravintola jolla on curated EI näytä sitaattia lainkaan — silloin kielteinen
 * `reviewQuote` on vaaraton. Poimitaan ne place-id:t joilla curated on.
 */
/**
 * 🔴 Lohkorajat, ei "seuraavat 4000 merkkiä". Ensimmäinen versio etsi
 * `'<id>': {` ja sen jälkeen non-greedy `curatedDescription:` — mikä matchasi
 * yli lohkon rajan seuraavan merkinnän kenttään ja väitti neljää korjattua
 * ravintolaa yhä korjaamattomiksi. Pilkotaan lähde merkintöihin ensin.
 */
const curated = new Set();
{
  const osat = ovSrc.split(/\n  '(?=[A-Za-z0-9_-]{20,}':)/);
  for (const osa of osat) {
    const id = osa.match(/^([A-Za-z0-9_-]{20,})':/);
    if (id && /curatedDescription:/.test(osa)) curated.add(id[1]);
  }
}
const closed = new Set();
for (const m of ovSrc.matchAll(/'([A-Za-z0-9_\-]{20,})':\s*\{[^}]*?permanentlyClosed:\s*true/g)) {
  closed.add(m[1]);
}

if (process.argv.includes('--all')) {
  maps.forEach((r, i) => {
    const suoja = curated.has(r.googlePlaceId) ? ' [curated]' : '';
    console.log(`${String(i + 1).padStart(2)}. ${r.name}${suoja}\n    ${r.reviewQuote}`);
  });
  process.exit(0);
}

const osumat = [];
for (const r of maps) {
  if (closed.has(r.googlePlaceId)) continue;
  if (curated.has(r.googlePlaceId)) continue; // curated ajaa sitaatin yli
  if (!r.reviewQuote) continue;
  if (KUITATUT.has(r.name)) continue;
  const hit = SIGNAALIT.find((re) => re.test(r.reviewQuote));
  if (hit) osumat.push({ name: r.name, quote: r.reviewQuote, hit: String(hit) });
}

if (osumat.length === 0) {
  const n = maps.filter((r) => !closed.has(r.googlePlaceId)).length;
  console.log(`✅ review-quotes: ${n} sitaattia, ei kielteisiä signaaleja ` +
    `(${curated.size} korvattu curated-kuvauksella, ${KUITATUT.size} kuitattu käsin)`);
  process.exit(0);
}

console.error(`❌ review-quotes: ${osumat.length} sitaattia sisältää kielteisen signaalin\n`);
for (const o of osumat) {
  console.error(`   ${o.name}\n      "${o.quote}"\n      osuma: ${o.hit}\n`);
}
console.error(
  '   Korjaa YKSI näistä tavoista:\n' +
  '     1) kirjoita curatedDescription restaurant-overrides.ts:ään (ajaa sitaatin yli), TAI\n' +
  '     2) jos sitaatti on kokonaisuutena myönteinen, lisää nimi KUITATUT-listaan perusteluineen.\n' +
  '   ÄLÄ muokkaa generoitua JSONia — seuraava sync pyyhkii sen.\n',
);
process.exit(1);
