#!/usr/bin/env node
/**
 * version-images.mjs — kuvan osoite muuttuu kun kuva muuttuu.
 *
 * Vesa 2026-09-09: *"korjaa"* — listan kohta *"paluukävijä näkee yhä
 * välimuistista vanhat kuvat"*.
 *
 * ── MIKSI TÄTÄ TARVITAAN ───────────────────────────────────────────────
 *
 * Cloudflare Pages tarjoilee staattiset kuvat oletuksena
 * `Cache-Control: public, max-age=14400, must-revalidate`. 🔴🔴 **`must-revalidate`
 * EI tarkoita "kysy joka kerta".** Se koskee vasta vanhentunutta vastausta —
 * neljän tunnin ikkunan sisällä selain tarjoilee kuvan omasta välimuististaan
 * kysymättä palvelimelta mitään. Tiedostonimi ei muutu kun kuva regeneroidaan
 * (`aurora-bars-neon.webp` on aina sama nimi), joten paluukävijä näkee vanhan
 * kuvan vaikka uusi on jo livenä.
 *
 * Tämä ei ole teoriaa: 9.9.2026 Vesa raportoi yökerhoheron "regressiona".
 * Palvelimella oleva tiedosto oli oikea (190 512 t) — hänen selaimensa näytti
 * edellisen. Puoli tuntia meni väärän vian etsimiseen.
 *
 * ── RATKAISU ───────────────────────────────────────────────────────────
 *
 * Jokainen kuvaviittaus saa `?v=<sisällön tiiviste>`. Kuvan muuttuessa tiiviste
 * muuttuu ⇒ **osoite on eri ⇒ selaimella ei ole sitä välimuistissa ⇒ se haetaan
 * heti**. Muuttumaton kuva pitää saman osoitteen ja siis välimuistiosumansa.
 *
 * 🔴 Tiiviste lasketaan **sisällöstä**, ei päiväyksestä eikä committihajautteesta.
 * Päiväys vaihtaisi osoitteen joka deployssa ja hukkaisi koko välimuistin;
 * committihajaute tekisi saman, koska kuvat eivät muutu joka commitissa.
 *
 * 🔴 Ajetaan **buildin viimeisenä askeleena `dist/`:iin**, ei lähdekoodiin.
 * Silloin se kattaa yhdellä säännöllä kaiken: prerenderöidyn HTML:n (301
 * tiedostoa), JS-nipun merkkijonot, `og:image`-metat, `srcset`:it ja
 * `_headers`-tiedoston preload-linkin. Lähteeseen kirjoitettuna jokainen uusi
 * viittaustapa olisi uusi aukko.
 *
 * 🔴🔴 **`_headers`-preload on pakko versioida samalla.** Se osoittaa
 * `</images/hero/aurora-bars-neon.webp>; rel=preload`. Jos sivu pyytää
 * `?v=abc123` ja preload pyytää version ilman tagia, ne ovat **kaksi eri
 * osoitetta**: selain lataa kuvan kahdesti ja preload menee hukkaan. Sama
 * koskee `apply_link_preload_headers.py`:n uudelleenajoa — se kirjoittaa
 * `public/_headers`, tämä skripti korjaa `dist/_headers`, joten järjestys
 * kestää.
 *
 * 🔴 **Viitatut mutta puuttuvat tiedostot jätetään koskematta.** Niitä on 20
 * (kumppanien vaaleat logot, joita tämä sivusto ei renderöi lainkaan — mitattu
 * livenä: yhtään pyyntöä ei lähde). Tiivistettä ei voi laskea tiedostosta jota
 * ei ole, ja tagin keksiminen tekisi rikkinäisestä osoitteesta uuden
 * rikkinäisen osoitteen.
 *
 * 🔴 `.br`-sivutiedostot pakataan uudelleen. Cloudflare Pages ei tarjoile niitä
 * (se pakkaa itse), mutta ne deployataan, ja vanhentunut kopio muokatusta
 * tiedostosta on ansa seuraavalle lukijalle.
 *
 * Käyttö: `node scripts/version-images.mjs` (build-ketjun viimeisenä).
 *         `--check` = älä kirjoita, kerro vain mitä tekisi.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';

const DIST = path.resolve(process.cwd(), 'dist');
const CHECK = process.argv.includes('--check');

if (!fs.existsSync(DIST)) {
  console.error('[version-images] dist/ puuttuu — aja buildin jälkeen.');
  process.exit(2);
}

/** Tiedostot joiden sisällöstä kuvaviittauksia etsitään. */
const REWRITABLE = new Set(['.html', '.js', '.json', '.xml', '.txt', '.css', '.webmanifest']);
const IMG_RE = /\/images\/[A-Za-z0-9_.\-/]+?\.(?:webp|avif|jpe?g|png|svg|gif)/g;

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

const files = walk(DIST);

// 1) Tiiviste jokaiselle levyllä olevalle kuvalle.
const hash = new Map();
for (const f of files) {
  const rel = '/' + path.relative(DIST, f).split(path.sep).join('/');
  if (!rel.startsWith('/images/')) continue;
  if (rel.endsWith('.br') || rel.endsWith('.gz')) continue;
  hash.set(rel, crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 8));
}

// 2) Uudelleenkirjoitus.
let touched = 0;
let hits = 0;
let already = 0;
const missing = new Set();
const changedForBrotli = [];

const targets = files.filter((f) => {
  const rel = '/' + path.relative(DIST, f).split(path.sep).join('/');
  if (rel.startsWith('/images/')) return false;
  if (f.endsWith('.br') || f.endsWith('.gz') || f.endsWith('.map')) return false;
  return REWRITABLE.has(path.extname(f)) || path.basename(f) === '_headers';
});

for (const f of targets) {
  const src = fs.readFileSync(f, 'utf8');
  let local = 0;
  // 🔴 Regexissä on vain non-capturing-ryhmä, joten callbackin argumentit ovat
  // (match, offset, string) — ei väliin tulevaa ryhmää. Väärä signatuuri kaatoi
  // ensimmäisen ajon koko HTML-dokumentti indeksinä.
  const out = src.replace(IMG_RE, (m, idx, whole) => {
    if (whole[idx + m.length] === '?') { already++; return m; } // jo versioitu
    const h = hash.get(m);
    if (!h) {
      missing.add(m);
      return m;
    }
    local++;
    return `${m}?v=${h}`;
  });
  if (local && out !== src) {
    hits += local;
    touched++;
    if (!CHECK) {
      fs.writeFileSync(f, out);
      if (fs.existsSync(f + '.br')) changedForBrotli.push(f);
    }
  }
}

// 3) .br-sivutiedostot ajan tasalle.
for (const f of changedForBrotli) {
  fs.writeFileSync(
    f + '.br',
    zlib.brotliCompressSync(fs.readFileSync(f), {
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
    }),
  );
}

console.log(
  `[version-images] ${CHECK ? 'TARKISTUS — ei kirjoitettu: ' : ''}` +
    `${hits} viittausta ${touched} tiedostossa (${already} oli jo) · ${hash.size} kuvaa · ` +
    `${changedForBrotli.length} .br paivitetty`,
);

if (missing.size) {
  console.log(`[version-images] ${missing.size} viittausta ilman tiedostoa (jatettiin ennalleen):`);
  for (const m of [...missing].slice(0, 5)) console.log('    ' + m);
  if (missing.size > 5) console.log(`    ... ja ${missing.size - 5} muuta`);
}

// 🔴 Nolla osumaa ei ole onnistuminen. Jos regex tai polku menee rikki, hiljainen
// nolla näyttäisi siltä että kaikki on jo versioitu — se on sama väärä vihreä
// joka kaatoi saumaportin ensimmäisen version 9.9.
//
// 🔴🔴 MUTTA nolla + "kaikki oli jo tagattu" on eri asia: skripti on idempotentti,
// ja toinen ajo samaan dist/:iin on onnistunut ei-operaatio. Ensimmäinen versio
// olisi kaatanut buildin siitä valeväitteellä "jokin on rikki".
if (hits === 0 && already === 0) {
  console.error('[version-images] 🔴 Yhtään viittausta ei versioitu — jokin on rikki.');
  process.exit(1);
}
