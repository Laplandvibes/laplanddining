/**
 * Ajastettu linkkivahti: ajaa molemmat vahdit ja päättää, tarvitaanko viesti.
 *
 * Windows-tehtävä "LV Dining Linkkivahti" ajaa tämän päivittäin omasta
 * kloonistaan (C:\Users\pesol\scripts\lv-dining-linkkivahti\ajo.sh). Tämä
 * skripti ei lähetä mitään: se kirjoittaa viestin tiedostoon, ja kääre lähettää
 * sen (send_report_to_vesa.py) ja kuittaa lähetyksen vasta onnistuttuaan.
 *
 *   node scripts/linkkivahti-ajo.mjs --tila <kansio>            ajo
 *   node scripts/linkkivahti-ajo.mjs --tila <kansio> --kuittaa  viesti lähti: kirjaa ilmoitetuksi
 *   … --kuiva                tila luetaan mutta ei kirjoiteta, viesti tulostetaan
 *   … --tanaan YYYY-MM-DD    päivä käsin (kokeisiin; vahdit itse käyttävät oikeaa päivää)
 *
 * Paluukoodit: 0 = ajo ok, ei viestiä · 10 = ajo ok, viesti odottaa tilakansiossa
 * (viesti.txt, otsikko.txt, odottaa.json) · 2 = vahti kaatui tai ei tuottanut
 * tulosta · 3 = tämän koneen verkko ei toimi tai ajo on epäluotettava (ei
 * kirjata tilaan, ei viestiä).
 *
 * Säännöt (milloin ilmoitetaan, millä sanoilla): scripts/lib/linkkivahti-raportti.mjs.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { todayIso } from './lib/link-watch.mjs';
import {
  ennakot, ajoEpaluotettava, tyhjaTila, paivitaTila, ilmoituksenSyy, kuittaa, nimikartta, viesti, selitys,
} from './lib/linkkivahti-raportti.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const arg = (nimi) => {
  const i = process.argv.indexOf(nimi);
  return i > -1 ? process.argv[i + 1] : null;
};
const TILA_DIR = arg('--tila');
const KUIVA = process.argv.includes('--kuiva');
const TANAAN = arg('--tanaan') ?? todayIso();
if (!TILA_DIR) {
  console.error('kaytto: node scripts/linkkivahti-ajo.mjs --tila <kansio> [--kuittaa] [--kuiva] [--tanaan YYYY-MM-DD]');
  process.exit(2);
}
fs.mkdirSync(TILA_DIR, { recursive: true });
const TILA = path.join(TILA_DIR, 'tila.json');
const ODOTTAA = path.join(TILA_DIR, 'odottaa.json');
const VIESTI = path.join(TILA_DIR, 'viesti.txt');
const OTSIKKO = path.join(TILA_DIR, 'otsikko.txt');

const lueJson = (f, oletus) => {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return oletus; }
};
/** Kirjoitus väliaikaistiedoston kautta: täysi levy ei saa jättää tyhjää tilatiedostoa (4.11.2026). */
const kirjoita = (f, sisalto) => {
  const tmp = `${f}.tmp`;
  fs.writeFileSync(tmp, sisalto);
  fs.renameSync(tmp, f);
};
const poista = (...tiedostot) => tiedostot.forEach((f) => fs.rmSync(f, { force: true }));

// ── --kuittaa: kääre kutsuu tämän, kun viesti on oikeasti lähtenyt ───────────────────────────────
if (process.argv.includes('--kuittaa')) {
  const odottaa = lueJson(ODOTTAA, null);
  if (!odottaa) {
    console.log('Ei kuitattavaa (odottaa.json puuttuu).');
    process.exit(0);
  }
  const tila = kuittaa(lueJson(TILA, tyhjaTila()), odottaa.avaimet, odottaa.paiva);
  kirjoita(TILA, JSON.stringify(tila, null, 1));
  poista(ODOTTAA, VIESTI, OTSIKKO);
  console.log(`Kuitattu: ${odottaa.avaimet.length} löydöstä ilmoitettu ${odottaa.paiva}.`);
  process.exit(0);
}

console.log(`Linkkivahti ${TANAAN}${KUIVA ? ' (kuiva: tilaa ei kirjoiteta)' : ''}`);

// ── 1. Toimiiko tämän koneen verkko? Oma sivusto on vertailukohta. ────────────────────────────
try {
  const r = await fetch('https://laplanddining.com/', { signal: AbortSignal.timeout(20000) });
  await r.body?.cancel();
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
} catch (err) {
  console.error(`Oma sivusto ei vastaa tältä koneelta (${err.cause?.code ?? err.message}): verkko ei toimi, ajoa ei kirjata.`);
  process.exit(3);
}

// ── 2. Molemmat vahdit, tulos koneluettavana ─────────────────────────────────────────────────
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'linkkivahti-'));
const tulokset = {};
for (const [nimi, skripti] of [['ruokalistat', 'check-menu-links.mjs'], ['verkkosivut', 'check-website-links.mjs']]) {
  const out = path.join(tmp, `${nimi}.json`);
  const r = spawnSync(process.execPath, [path.join(HERE, skripti), '--json', out], { cwd: ROOT, encoding: 'utf8', timeout: 15 * 60 * 1000 });
  const tulos = lueJson(out, null);
  if (!tulos || !Array.isArray(tulos.loydokset)) {
    console.error(`Vahti ${skripti} ei tuottanut tulosta (rc ${r.status}${r.error ? `, ${r.error.code}` : ''}).`);
    console.error(`${r.stdout ?? ''}${r.stderr ?? ''}`.trim().split('\n').slice(-12).join('\n'));
    fs.rmSync(tmp, { recursive: true, force: true });
    process.exit(2);
  }
  tulokset[nimi] = tulos;
  console.log(`${nimi}: ${tulos.tarkistettu} osoitetta, ${tulos.loydokset.length} löydöstä, ${tulos.estetytOk.length} bottiestoa selaintarkistuksella`);
}
fs.rmSync(tmp, { recursive: true, force: true });

const tarkistettu = { ruokalistat: tulokset.ruokalistat.tarkistettu, verkkosivut: tulokset.verkkosivut.tarkistettu };
const mitatut = Object.entries(tulokset).flatMap(([vahti, t]) => t.loydokset.map((l) => ({ vahti, ...l })));

if (ajoEpaluotettava({ loydokset: mitatut, tarkistettu: tarkistettu.ruokalistat + tarkistettu.verkkosivut })) {
  const n = mitatut.filter((l) => l.laji === 'kuollut').length;
  console.error(`${n} osoitetta ei vastaa: vika on todennäköisemmin tämän koneen verkossa kuin ravintoloissa. Ajoa ei kirjata.`);
  process.exit(3);
}

// ── 3. Ennakot: voimassaolo päättyy, selaintarkistus vanhenee ───────────────────────────────
const rekisteri = lueJson(path.join(ROOT, 'src/data/generated/restaurant-menus.json'), {});
const estetyt = Object.entries(tulokset).flatMap(([vahti, t]) => t.estetytOk.map((b) => ({ vahti, ...b })));
const loydokset = [...mitatut, ...ennakot({ rekisteri, estetyt, tanaan: TANAAN })];

// ── 4. Tila ja päätös ────────────────────────────────────────────────────────────────────────
const { tila, vahvistetut, odottavat } = paivitaTila(lueJson(TILA, tyhjaTila()), loydokset, TANAAN);
const syy = ilmoituksenSyy({ vahvistetut, tila, tanaan: TANAAN });

const maps = lueJson(path.join(ROOT, 'src/data/generated/restaurants-from-maps.json'), []);
const nimet = nimikartta(
  Array.isArray(maps) ? maps : Object.values(maps).flat(),
  fs.readFileSync(path.join(ROOT, 'src/data/restaurant-gems.ts'), 'utf8'),
);
const nimi = (l) => nimet.get(l.slug)?.nimi ?? l.slug;

for (const l of vahvistetut) console.log(`  vahvistettu${l.ilmoitettu ? ` (ilmoitettu ${l.ilmoitettu})` : ' (UUSI)'}: ${nimi(l)}: ${selitys(l)} ${l.url}`);
for (const l of odottavat) console.log(`  nähty ensimmäisen kerran, ilmoitetaan jos toistuu huomenna: ${nimi(l)}: ${selitys(l)} ${l.url}`);
if (!loydokset.length) console.log('  ei löydöksiä');

if (!KUIVA) kirjoita(TILA, JSON.stringify({ ...tila, viimeisinAjo: { paiva: TANAAN, tarkistettu, vahvistettuja: vahvistetut.length, odottavia: odottavat.length } }, null, 1));

if (!syy) {
  if (!KUIVA) poista(ODOTTAA, VIESTI, OTSIKKO);
  console.log(vahvistetut.length ? 'Ei viestiä: avoimista on jo ilmoitettu alle viikko sitten.' : 'Ei viestiä: mikään ei vaadi huomiota.');
  process.exit(0);
}

const v = viesti({ vahvistetut, syy, tanaan: TANAAN, nimet, tarkistettu });
if (KUIVA) {
  console.log(`\n--- viesti (${syy}), ei kirjoitettu ---\nOtsikko: ${v.otsikko}\n\n${v.teksti}`);
  process.exit(10);
}
kirjoita(VIESTI, v.teksti);
kirjoita(OTSIKKO, v.otsikko);
kirjoita(ODOTTAA, JSON.stringify({ paiva: TANAAN, syy, avaimet: vahvistetut.map((l) => l.avain) }, null, 1));
console.log(`Viesti odottaa lähetystä (${syy}): ${v.otsikko}`);
process.exit(10);
