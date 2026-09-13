#!/usr/bin/env node
/**
 * sitemap_lastmod.mjs — <lastmod> = päivä jolloin sivun NÄKYVÄ sisältö viimeksi muuttui
 * ==========================================================================================
 *
 * MIKSI (13.9.2026): 29 sivuston sitemapit mitattiin. 9 generaattoria kirjoitti
 * `today` jokaiselle URLille joka buildissa (hub 863/863, gifts 2830/2830 …) ja
 * 8 staattista sitemapia kantoi päivää 2026-06-10 kaikilla URLeilla kesäkuusta asti.
 * Google dokumentoi jättävänsä lastmodin huomiotta, jos se on "consistently
 * unrealistic" — ja kun se jää huomiotta, päivitetyt sivut eivät saa uutta
 * ryömintää muita nopeammin. Vesa 13.9.: "siellä ei ole varmastikaan pyydetty
 * indeksointia uusien sivujen päivittämisen myötä." Nappia ei voi painaa
 * rajapinnasta; sitemapin lastmod on Googlen oma reitti.
 *
 * MITEN: ajetaan buildin VIIMEISENÄ askeleena (prerenderin jälkeen).
 *   1. Lukee dist/sitemap.xml:n <loc>-listan.
 *   2. Jokaiselle URLille etsii prerenderöidyn dist/<polku>/index.html:n, poimii
 *      näkyvän tekstin (ilman <head>, <script>, <style>, <header>, <nav>, <footer>,
 *      <noscript>, tagit ja whitespace normalisoitu) ja laskee sha1:n.
 *   3. Vertaa scripts/sitemap-state.json:iin ({ url: { h, d } }). Sama hash ⇒
 *      vanha päivä säilyy. Uusi tai muuttunut ⇒ päivä = tänään (UTC).
 *   4. Kirjoittaa dist/sitemap.xml:n uusilla lastmodeilla ja päivittää state-tiedoston.
 *
 * 🔴 scripts/sitemap-state.json ON COMMITOITAVA. CI buildaa puhtaasta klonista eikä
 *    committaa mitään: jos tila ei ole gitissä, muuttuneen sivun päivä hyppää joka
 *    CI-buildissa "tähän päivään" kunnes joku buildaa paikallisesti ja committaa.
 *    deploy-safe.sh:n puhtaan työpuun portti pysäyttää pushin, jos build muutti
 *    state-tiedostoa eikä sitä ole committoitu — se on tarkoitus.
 *
 * Ensimmäinen ajo (ei tilaa): kaikki URLit saavat tämän päivän. Se on kertaluonteinen
 * "ryömi kaikki" -signaali ja sama kuin mitä 9 sivustoa lähetti joka päivä.
 *
 * Kytkentä package.json:iin: `... && node scripts/version-images.mjs && node scripts/sitemap-lastmod.mjs`
 * Lippu `--check` = älä kirjoita mitään, tulosta vain yhteenveto (portti).
 * Ympäristö `SITEMAP_LASTMOD_DATE=YYYY-MM-DD` = pakota "tänään" (testeihin).
 *
 * Kanoninen lähde: shared/scripts/sitemap_lastmod.mjs — vendoroitu per sivusto
 * scripts/sitemap-lastmod.mjs:ksi (sama sopimus kuin _prerender_routes.mjs).
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const CHECK = process.argv.includes('--check');
const DIST = resolve(ROOT, 'dist');
const SITEMAP = resolve(DIST, 'sitemap.xml');
const STATE = resolve(ROOT, 'scripts/sitemap-state.json');
const TODAY = process.env.SITEMAP_LASTMOD_DATE || new Date().toISOString().slice(0, 10);

if (!existsSync(SITEMAP)) {
  console.error(`sitemap-lastmod: ${SITEMAP} puuttuu — aja prerender ensin.`);
  process.exit(1);
}

const xml = readFileSync(SITEMAP, 'utf8');
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : {};

/** Näkyvä teksti prerenderöidystä HTML:stä. Kääreet (header/nav/footer) ja
 *  koodi pois, jotta layout- tai skriptimuutos ei näytä sisältömuutokselta. */
function visibleText(html) {
  let s = html.replace(/<head[\s\S]*?<\/head>/gi, '');
  for (const tag of ['script', 'style', 'noscript', 'template', 'header', 'nav', 'footer', 'svg']) {
    s = s.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, 'gi'), '');
  }
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return s.replace(/\s+/g, ' ').trim();
}

function distFileFor(loc) {
  let path;
  try { path = decodeURIComponent(new URL(loc).pathname); } catch { return null; }
  const candidates = [
    resolve(DIST, `.${path.endsWith('/') ? path : path + '/'}index.html`),
    resolve(DIST, `.${path.replace(/\/$/, '')}.html`),
    resolve(DIST, `.${path.replace(/\/$/, '')}/index.html`),
  ];
  return candidates.find((c) => existsSync(c)) || null;
}

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const next = {};
let kept = 0, bumped = 0, added = 0, missing = 0;
const bumpedList = [];

for (const loc of locs) {
  const file = distFileFor(loc);
  let h;
  if (file) {
    h = createHash('sha1').update(visibleText(readFileSync(file, 'utf8'))).digest('hex').slice(0, 16);
  } else {
    // Ei prerenderöityä tiedostoa (esim. SPA-reitti) — hash URL:sta, jotta päivä pysyy vakaana.
    h = 'nofile:' + createHash('sha1').update(loc).digest('hex').slice(0, 8);
    missing++;
  }
  const prev = state[loc];
  if (prev && prev.h === h && /^\d{4}-\d{2}-\d{2}$/.test(prev.d || '')) {
    next[loc] = { h, d: prev.d };
    kept++;
  } else {
    next[loc] = { h, d: TODAY };
    if (prev) { bumped++; bumpedList.push(loc); } else { added++; }
  }
}

// Kirjoita lastmod jokaiseen <url>-lohkoon (lisää jos puuttuu).
const out = xml.replace(/<url>([\s\S]*?)<\/url>/g, (block, inner) => {
  const m = inner.match(/<loc>([^<]+)<\/loc>/);
  if (!m) return block;
  const d = next[m[1].trim()]?.d || TODAY;
  if (/<lastmod>[^<]*<\/lastmod>/.test(inner)) {
    inner = inner.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${d}</lastmod>`);
  } else {
    inner = inner.replace(/(<loc>[^<]+<\/loc>)/, `$1\n    <lastmod>${d}</lastmod>`);
  }
  return `<url>${inner}</url>`;
});

const summary = `sitemap-lastmod: ${locs.length} URLia · säilyi ${kept} · muuttui ${bumped} · uusia ${added}` +
  (missing ? ` · ilman dist-tiedostoa ${missing}` : '') + (CHECK ? ' (--check, ei kirjoitettu)' : '');
console.log(summary);
if (bumpedList.length) console.log('  muuttuneet: ' + bumpedList.slice(0, 20).join(', ') + (bumpedList.length > 20 ? ` … (+${bumpedList.length - 20})` : ''));

if (!CHECK) {
  writeFileSync(SITEMAP, out);
  const ordered = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
  writeFileSync(STATE, JSON.stringify(ordered, null, 0).replace(/},"/g, '},\n"') + '\n');
}
