#!/usr/bin/env node
/**
 * Portti: kaupunkisivun metakuvauksessa luvattu ravintolamäärä vs. datan
 * todellinen määrä — kaikilla 12 kielellä.
 *
 * MIKSI (7.9.2026): kirjoitin kaupunkisivujen tekstit generoidusta
 * Maps-JSONista ja sanoin Rovaniemestä "seitsemän ravintolaa". Sivu renderöi
 * kahdeksan, koska `restaurants` on maps + käsin kuratoidut gems. Luku oli
 * väärin ennen kuin se ehti liveen, ja se olisi ollut väärin 12 kielellä.
 *
 * Metakuvaus on hakutuloksen lupaus. Jos siinä lukee "Eight restaurants" ja
 * sivulla on yhdeksän korttia, lupaus on rikki — eikä sitä huomaa kukaan,
 * koska teksti on käännetty yhdentoista kielen tiedostoihin.
 *
 * 🔴 Leipätekstissä EI saa olla lukusanoja lainkaan. Ne vanhenevat hiljaa
 * jokaisen sync-ajon jälkeen. Kortin luku tulee datasta (`countLabel`), ja
 * vain `description` saa luvatun luvun — koska tämä portti vahtii sitä.
 *
 * Aja: node scripts/check-city-copy.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---- todellinen määrä per kaupunki (sama logiikka kuin data/restaurants.ts) ----
const maps = JSON.parse(
  readFileSync(resolve(ROOT, 'src/data/generated/restaurants-from-maps.json'), 'utf8'),
);
const ovSrc = readFileSync(resolve(ROOT, 'src/data/restaurant-overrides.ts'), 'utf8');
const gemSrc = readFileSync(resolve(ROOT, 'src/data/restaurant-gems.ts'), 'utf8');

const cityOverride = new Map();
for (const m of ovSrc.matchAll(/'([A-Za-z0-9_\-]{20,})':\s*\{[^}]*?city:\s*'([^']+)'/g)) {
  cityOverride.set(m[1], m[2]);
}
const closed = new Set();
for (const m of ovSrc.matchAll(/'([A-Za-z0-9_\-]{20,})':\s*\{[^}]*?permanentlyClosed:\s*true/g)) {
  closed.add(m[1]);
}

const counts = {};
for (const r of maps) {
  if (closed.has(r.googlePlaceId)) continue;
  const city = cityOverride.get(r.googlePlaceId) ?? r.city;
  counts[city] = (counts[city] || 0) + 1;
}
for (const m of gemSrc.matchAll(/city:\s*'([^']+)'/g)) {
  counts[m[1]] = (counts[m[1]] || 0) + 1;
}

// slug -> city, luettuna rekisteristä (ei toista listaa ylläpidettäväksi)
const regSrc = readFileSync(resolve(ROOT, 'src/data/diningCities.ts'), 'utf8');
const SLUG_TO_CITY = new Map();
for (const m of regSrc.matchAll(/\{\s*slug:\s*'([a-z]+)',\s*city:\s*'([^']+)'/g)) {
  SLUG_TO_CITY.set(m[1], m[2]);
}
if (SLUG_TO_CITY.size === 0) {
  console.error('❌ city-copy: diningCities.ts:sta ei irronnut yhtään kaupunkia — portti olisi valheellisen vihreä');
  process.exit(1);
}

/**
 * Lukusanat jokaisella tuetulla kielellä 1–12. Metakuvaus kirjoitetaan
 * sanana ("Eight restaurants"), ei numerona, joten portin on osattava lukea
 * sana. Numeromuoto tarkistetaan myös.
 */
const WORDS = {
  en: ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'],
  fi: ['yksi','kaksi','kolme','neljä','viisi','kuusi','seitsemän','kahdeksan','yhdeksän','kymmenen','yksitoista','kaksitoista'],
  de: ['ein','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf'],
  es: ['uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce'],
  fr: ['un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze'],
  it: ['uno','due','tre','quattro','cinque','sei','sette','otto','nove','dieci','undici','dodici'],
  nl: ['een','twee','drie','vier','vijf','zes','zeven','acht','negen','tien','elf','twaalf'],
  sv: ['en','två','tre','fyra','fem','sex','sju','åtta','nio','tio','elva','tolv'],
  'pt-BR': ['um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze'],
  // ja / ko / zh-CN kirjoittavat luvun numerona tai kanjilla; numerotarkistus riittää.
};

const problems = [];
const locales = readdirSync(resolve(ROOT, 'src/locales'), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

for (const loc of locales) {
  let pages;
  try {
    pages = JSON.parse(readFileSync(resolve(ROOT, `src/locales/${loc}/pages.json`), 'utf8'));
  } catch { continue; }
  const cities = pages.cities;
  if (!cities) continue; // kieli odottaa vielä käännöstä — EN-fallback hoitaa

  for (const [slug, city] of SLUG_TO_CITY) {
    const entry = cities[slug];
    if (!entry || !entry.description) continue;
    const want = counts[city];
    const desc = entry.description;

    /**
     * 🔴 Vain kuvauksen ENSIMMÄINEN sana luetaan lukumääräksi.
     *
     * Ensimmäinen versio etsi minkä tahansa luvun mistä tahansa kohtaa, ja
     * hylkäsi seitsemän kelvollista kuvausta: "15 km upriver", "22 km apart",
     * "three of them on the same street", "one at the summit". Kaikki noista
     * ovat oikein — ne eivät vain ole se luku joka lupaa sivun sisällön.
     *
     * Sopimus on siis: kuvaus ALKAA lukumäärällä ("Eight restaurants in…"),
     * ja loppu tekstistä saa sisältää lukuja vapaasti.
     */
    const firstWord = desc.trim().split(/[\s,.:;—–-]+/)[0] ?? '';
    let found = null;
    if (/^\d{1,2}$/.test(firstWord)) {
      found = Number(firstWord);
    } else {
      const words = WORDS[loc];
      if (words) {
        const i = words.findIndex((w) => w.toLowerCase() === firstWord.toLowerCase());
        if (i >= 0) found = i + 1;
      }
    }
    if (found === null) continue; // ei aloittavaa lukua = ei luvattu määrää
    if (found !== want) {
      problems.push({ loc, slug, city, said: found, actual: want, desc: desc.slice(0, 90) });
    }
  }
}

if (problems.length === 0) {
  console.log(`✅ city-copy: metakuvausten ravintolamäärät täsmäävät dataan (${SLUG_TO_CITY.size} kaupunkia × ${locales.length} kieltä)`);
  process.exit(0);
}

console.error('❌ city-copy: metakuvaus lupaa eri määrän kuin sivulla on\n');
for (const p of problems) {
  console.error(`   ${p.loc}/${p.slug}: kuvaus sanoo ${p.said}, dataa on ${p.actual}  (${p.city})`);
  console.error(`      "${p.desc}…"`);
}
console.error('\n   Korjaa src/locales/<kieli>/pages.json → cities.<slug>.description\n');
process.exit(1);
