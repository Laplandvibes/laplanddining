#!/usr/bin/env node
/**
 * Portti: ravintolan `city` vs. sen omat koordinaatit.
 *
 * MIKSI TÄMÄ ON OLEMASSA (2026-09-07). Kaupunkisivu väittää otsikossaan
 * "ravintolat kaupungissa X" 12 kielellä. Silloin `city` ei ole enää
 * lajitteluavain vaan julkaistu väite, ja väärä rivi on katteeton lupaus —
 * ei kosmeettinen vika.
 *
 * Mitattu tuolloin: 6 riviä 81:stä oli väärässä kaupungissa. Kahdella syy oli
 * ymmärrettävä (Maps merkitsee KUNNAN: Saariselkä kuuluu Inariin, Luosto
 * Sodankylään), neljällä arvo oli suoraan väärin — Lapland Restaurant Kotahovi
 * ja Sky Kitchen & View oli merkitty Posiolle, 114 km päähän omasta
 * osoitteestaan Rovaniemellä.
 *
 * 🔴 Osoitemerkkijonon vertaaminen ei riitä. "Sivulantie 5 E, Äkäslompolo"
 * ei sisällä sanaa Ylläs, vaikka se on Ylläksellä, ja "Kekäle | Kittilä" ei
 * sisällä katua lainkaan. Vain koordinaatti kertoo totuuden.
 *
 * Korjaus kuuluu AINA `restaurant-overrides.ts`:ään (`city`-kenttä), ei
 * generoituun JSONiin — seuraava `sync-restaurants.mjs` pyyhkisi sen.
 *
 * Aja: node scripts/check-city-tags.mjs
 * Exit 1 = jokin rivi on lähempänä toista taajamaa kuin omaansa.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Taajamien keskipisteet. Ylläs = Äkäslompolo (67,6069 / 24,166) koko
 * verkostossa — Ylläsjärvi on 7 km etelässä (CLAUDE.md).
 */
const TOWNS = {
  Rovaniemi:     [66.5039, 25.7294],
  Levi:          [67.8047, 24.8022],
  Kittilä:       [67.6549, 24.9106],
  Inari:         [68.9055, 27.0286],
  Saariselkä:    [68.4200, 27.4200],
  Kemi:          [65.7364, 24.5637],
  Ylläs:         [67.6069, 24.1660],
  Tornio:        [65.8481, 24.1447],
  Haparanda:     [65.8356, 24.1394],
  Sodankylä:     [67.4184, 26.5903],
  Pyhätunturi:   [67.0167, 27.2333],
  Luosto:        [67.1408, 26.9539],
  Muonio:        [67.9576, 23.6789],
  Hetta:         [68.3839, 23.6247],
  Kuusamo:       [65.9640, 29.1889],
  Kemijärvi:     [66.7133, 27.4297],
  Salla:         [66.8333, 28.6667],
  Posio:         [66.1114, 28.1731],
};

/**
 * Sallittu etäisyys omaan taajamaan. Hiihtokeskukset ovat laajoja ja
 * rinneravintola voi olla aidosti 12 km kylän keskustasta, joten raja on
 * väljä — se on tarkoitettu nappaamaan 50–115 km:n virheet, ei hienosäätöön.
 */
const MAX_KM = 25;

/**
 * Kaukana omasta taajamastaan MUTTA oikein merkitty. Nämä eivät ole
 * poikkeuksia säännöstä vaan Lapin maantiedettä: Inarin kunta on 17 300 km²
 * (Suomen suurin) ja sen ravintolat ovat kymmenien kilometrien päässä Inarin
 * kylästä — silti aidosti Inarissa. Ivalolle ei ole omaa kaupunkisivua, joten
 * kunta on oikea ja rehellinen otsikko; kortti näyttää aina todellisen osoitteen.
 *
 * 🔴 Lisää rivi tänne VAIN kun olet tarkistanut, että kunta on oikea. Jos
 * paikka on toisessa kunnassa, korjaus kuuluu overrides-tiedostoon.
 */
const FAR_BUT_CORRECT = new Map([
  ['ChIJTV_WZOkVzUURy3OSF3ioobg', 'Muotkan Ruoktu — Karigasniementie 2281, erämaassa Inarin kunnassa (39 km kylästä)'],
  ['ChIJVbzueiMVzUURTogYoKLrYL4', 'Arctic River Resort — Näverniemi, Ivalon seutu, Inarin kunta'],
  ['ChIJE05DRegVzUURplmndPiVrAs', 'Kultahippu — Petsamontie 28, Ivalo, Inarin kunta'],
  ['gem:Korpihilla', 'Korpihilla — Holtinojantie 5, Tolvan kylä, Posion kunta (26,8 km kirkonkylästä); Posiolla ei ole kaupunkisivua'],
]);

const R = 6371;
const rad = (x) => (x * Math.PI) / 180;
function distKm([la1, lo1], [la2, lo2]) {
  const dLa = rad(la2 - la1);
  const dLo = rad(lo2 - lo1);
  const h =
    Math.sin(dLa / 2) ** 2 +
    Math.cos(rad(la1)) * Math.cos(rad(la2)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const maps = JSON.parse(
  readFileSync(resolve(ROOT, 'src/data/generated/restaurants-from-maps.json'), 'utf8'),
);

/**
 * Käsin kuratoidut gems ovat `restaurants`-taulukossa maps-rivien rinnalla ja
 * renderöityvät samoille kaupunkisivuille — joten niitä on mitattava samalla
 * mitalla. Ne EIVÄT ole generoidussa JSONissa, joten pelkkä maps-tarkistus
 * jättäisi 6 ravintolaa portin ulkopuolelle. Niillä on aidot koordinaatit,
 * joten sama etäisyysmittaus toimii sellaisenaan.
 *
 * Regex riittää: tiedosto on käsin ylläpidetty ja rivit ovat vakiomuotoisia.
 */
const gemsSrc = readFileSync(resolve(ROOT, 'src/data/restaurant-gems.ts'), 'utf8');
const gems = [];
for (const m of gemsSrc.matchAll(
  /name:\s*'([^']+)',\s*\n\s*city:\s*'([^']+)'[\s\S]{0,900}?location:\s*\{\s*latitude:\s*(-?[\d.]+),\s*longitude:\s*(-?[\d.]+)\s*\}/g,
)) {
  gems.push({
    name: m[1],
    city: m[2],
    googlePlaceId: `gem:${m[1]}`,
    location: { latitude: Number(m[3]), longitude: Number(m[4]) },
  });
}
if (gems.length === 0) {
  console.error('❌ city-tags: restaurant-gems.ts:sta ei irronnut yhtään riviä — regex on vanhentunut, portti olisi valheellisen vihreä');
  process.exit(1);
}

/**
 * Toimitukselliset kaupunkikorjaukset luetaan overrides-lähteestä samalla
 * tavalla kuin sovellus ne soveltaa. Regex riittää: rivit ovat muotoa
 * `'<placeId>': { city: 'X' },` ja tiedosto on käsin ylläpidetty.
 */
const overridesSrc = readFileSync(resolve(ROOT, 'src/data/restaurant-overrides.ts'), 'utf8');
/**
 * 🔴 Lohkorajat, ei `[^}]*?`. Kun merkintaan lisattiin curatedDescription
 * (sisakkainen objekti), `[^}]*?` ei enaa paassyt sen yli city-kenttaan ja
 * portti julisti Kekaleen korjauksen kadonneeksi vaikka se oli tiedostossa.
 * Pilkotaan lahde merkintoihin ja luetaan kustakin oma city.
 */
const cityOverrides = new Map();
{
  const osat = overridesSrc.split(/\n {2}'(?=[A-Za-z0-9_-]{20,}':)/);
  for (const osa of osat) {
    const id = osa.match(/^([A-Za-z0-9_-]{20,})':/);
    const city = osa.match(/city:\s*'([^']+)'/);
    if (id && city) cityOverrides.set(id[1], city[1]);
  }
}

/**
 * Lopettaneita ei tarkasteta: ne suodatetaan pois ennen renderöintiä, joten
 * niiden kaupunki ei koskaan päädy sivulle. Ravintola Tunturikettu on juuri
 * tällainen — Maps sanoo Muonio, koordinaatti sanoo Ylläs, eikä kumpikaan
 * näy kenellekään.
 */
const closed = new Set();
for (const m of overridesSrc.matchAll(/'([A-Za-z0-9_\-]{20,})':\s*\{[^}]*?permanentlyClosed:\s*true/g)) {
  closed.add(m[1]);
}

const problems = [];
const unknownTowns = new Set();

for (const r of [...maps, ...gems]) {
  if (closed.has(r.googlePlaceId)) continue;
  const city = cityOverrides.get(r.googlePlaceId) ?? r.city;
  const town = TOWNS[city];
  if (!town) { unknownTowns.add(city); continue; }
  if (!r.location) continue;

  const here = [r.location.latitude, r.location.longitude];
  const own = distKm(here, town);
  if (FAR_BUT_CORRECT.has(r.googlePlaceId)) continue;

  const nearest = Object.entries(TOWNS)
    .map(([t, c]) => [t, distKm(here, c)])
    .sort((a, b) => a[1] - b[1])[0];

  // Ehto 1: kohtuullinen etäisyys omaan taajamaan.
  if (own > MAX_KM) { problems.push({ name: r.name, city, own, nearest }); continue; }

  /**
   * Ehto 2 (lisätty 7.9.2026): jos ravintola on OLENNAISESTI lähempänä toista
   * taajamaa jolla on oma kaupunkisivu, merkintä on väärä vaikka etäisyys
   * mahtuisi rajaan.
   *
   * 🔴 Pelkkä MAX_KM ei riitä. Neljä "Kittilään" merkittyä ravintolaa oli
   * 16–17 km Kittilän kirkonkylästä mutta 0,0–1,7 km Levin keskustasta — eli
   * rajan sisällä, silti kaikki Levillä. "Ravintolat Kittilässä" olisi ollut
   * neljän Levin ravintolan lista väärän otsikon alla, ja se olisi kilpaillut
   * Levin oman sivun kanssa samoista kohteista. Kittilä yhdistettiin Leviin.
   */
  const RATIO = 3;
  if (nearest[0] !== city && own > nearest[1] * RATIO && own - nearest[1] > 5) {
    problems.push({ name: r.name, city, own, nearest, closer: true });
  }
}

for (const t of unknownTowns) {
  problems.push({ unknown: t });
}

if (problems.length === 0) {
  console.log(`✅ city-tags: ${maps.length - closed.size + gems.length} avointa ravintolaa (${gems.length} kuratoitua), kaikki ≤ ${MAX_KM} km omasta taajamastaan` +
    (cityOverrides.size ? ` (${cityOverrides.size} toimituksellista korjausta)` : ''));
  process.exit(0);
}

console.error('❌ city-tags: kaupunkimerkintä ei vastaa koordinaatteja\n');
for (const p of problems) {
  if (p.unknown) {
    console.error(`   TUNTEMATON TAAJAMA  "${p.unknown}" — lisää se TOWNS-tauluun tai korjaa rivin city`);
    continue;
  }
  console.error(
    `   ${p.name}${p.closer ? '  [etäisyysrajan sisällä, mutta selvästi lähempänä toista kaupunkia]' : ''}\n` +
    `      merkitty: ${p.city} (${p.own.toFixed(1)} km)  →  lähin: ${p.nearest[0]} (${p.nearest[1].toFixed(1)} km)`,
  );
}
console.error(
  '\n   Korjaa restaurant-overrides.ts:ssä:  \'<googlePlaceId>\': { city: \'<Oikea>\' },\n' +
  '   ÄLÄ generoituun JSONiin — seuraava sync pyyhkii sen.\n',
);
process.exit(1);
