#!/usr/bin/env node
/**
 * Portti: korttikuvan on istuttava kehykseensä.
 *
 * MIKSI (Vesa 7.9.2026): *"pitäisihän nämä aina katsoa että kuvat aidosti
 * istuu kehyksiin"* — Laanilan Kievarin kortissa oli ravintolan **logo**
 * (500×500 PNG Wixistä), ja kortin kehys on 800×449. `object-cover` venytti
 * neliön 16:9:ään, jolloin logon teksti leikkautui molemmilta reunoilta ja
 * kortti näytti rikkinäiseltä.
 *
 * 🔴 Vika ei ollut CSS:ssä vaan LÄHTEESSÄ. `_fetch-partner-images.mjs` hakee
 * kumppanin `og:image`-kuvan, ja monella ravintolalla se on logo eikä valokuva.
 * Kukaan ei katsonut mitä putki toi.
 *
 * Raja: yli 30 % poikkeama kehyksen suhteesta = kaatuu. Se päästää läpi 4:3-
 * ja 3:2-valokuvat (joista object-cover leikkaa siedettävästi) mutta nappaa
 * neliölogot ja pystykuvat, jotka ovat aina väärä lähde.
 *
 * Aja: node scripts/check-image-fit.mjs
 *      node scripts/check-image-fit.mjs --all   (kaikki mitat)
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = resolve(ROOT, 'public/images/restaurants');

/** Kortin kuvakehys: h-44/h-48 täydellä leveydellä ≈ 800×449. */
const KEHYS = 800 / 449;
const RAJA = 0.30;

/**
 * Poikkeamat, jotka on katsottu ja hyväksytty. Avain = slug, arvo = peruste.
 * 🔴 Lisää rivi VAIN jos kuva on aito valokuva jonka rajautuminen on ok.
 * Logo ei koskaan kuulu tänne — logo ei ole korttikuva.
 */
const KUITATUT = new Map([
  ['yllas-yllaksen-evaskori-joiku-pub',
   'Aito valokuva Joikun terassista (halkopino, aurinkotuolit) 800×671 eli 4:3. ' +
   'object-cover leikkaa ylä- ja alareunaa siedettävästi — kuva ei ole logo.'],
]);

/** Lukee webp:n leveyden ja korkeuden ilman kirjastoa (VP8/VP8L/VP8X). */
function webpKoko(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const tag = buf.toString('ascii', 12, 16);
  if (tag === 'VP8 ') {
    return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
  }
  if (tag === 'VP8L') {
    const b = buf.readUInt32LE(21);
    return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
  }
  if (tag === 'VP8X') {
    const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
    const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
    return { w, h };
  }
  return null;
}

const reg = JSON.parse(
  readFileSync(resolve(ROOT, 'src/data/generated/restaurant-images.json'), 'utf8'),
);

/**
 * Lopettaneet suodatetaan ennen renderöintiä, joten niiden kuvasuhde ei koskaan
 * päädy ruudulle. Ravintola Tunturikettu on juuri tällainen: aito annoskuva,
 * mutta pystysuuntainen (525×700) — ja suljettu, eli näkymätön.
 */
const ovSrc = readFileSync(resolve(ROOT, 'src/data/restaurant-overrides.ts'), 'utf8');
const closedSlugs = new Set();
{
  const maps = JSON.parse(readFileSync(resolve(ROOT, 'src/data/generated/restaurants-from-maps.json'), 'utf8'));
  const closedIds = new Set();
  for (const m of ovSrc.matchAll(/'([A-Za-z0-9_\-]{20,})':\s*\{[^}]*?permanentlyClosed:\s*true/g)) closedIds.add(m[1]);
  for (const r of maps) if (closedIds.has(r.googlePlaceId)) closedSlugs.add(r.slug);
}

const all = process.argv.includes('--all');
const ongelmat = [];
let mitattu = 0;

for (const [slug, meta] of Object.entries(reg)) {
  if (closedSlugs.has(slug)) continue;
  const f = resolve(DIR, `${slug}.webp`);
  if (!existsSync(f)) { ongelmat.push({ slug, syy: 'tiedosto puuttuu' }); continue; }
  const koko = webpKoko(readFileSync(f));
  if (!koko) { ongelmat.push({ slug, syy: 'webp-otsaketta ei voitu lukea' }); continue; }
  mitattu++;
  const suhde = koko.w / koko.h;
  const poikkeama = Math.abs(suhde - KEHYS) / KEHYS;
  if (all) {
    console.log(`  ${slug.padEnd(44)} ${koko.w}x${koko.h}  ${suhde.toFixed(2)}  ${(poikkeama * 100).toFixed(0)}%`);
  }
  if (poikkeama > RAJA && !KUITATUT.has(slug)) {
    ongelmat.push({
      slug, syy: `${koko.w}×${koko.h} (suhde ${suhde.toFixed(2)}, kehys ${KEHYS.toFixed(2)}, poikkeama ${(poikkeama * 100).toFixed(0)} %)`,
      kind: meta.kind, credit: meta.credit,
    });
  }
}

if (all) process.exit(0);

if (ongelmat.length === 0) {
  console.log(`✅ image-fit: ${mitattu} korttikuvaa, kaikki istuvat kehykseen (raja ${RAJA * 100} %)`);
  process.exit(0);
}

console.error(`❌ image-fit: ${ongelmat.length} kuvaa ei istu kortin kehykseen\n`);
for (const o of ongelmat) {
  console.error(`   ${o.slug}\n      ${o.syy}${o.credit ? `  · lähde: ${o.credit}` : ''}`);
}
console.error(
  '\n   Neliö tai pystykuva on lähes aina LOGO eikä valokuva — kumppanin og:image.\n' +
  '   Korjaa: hae ravintolan sivulta oikea valokuva, TAI poista rivi\n' +
  '   restaurant-images.jsonista jolloin kortti näyttää siistin paikanpitäjän.\n' +
  '   Logoa ei venytetä korttiin.\n',
);
process.exit(1);
