/**
 * Etsii jokaiselle ravintolalle ehdokkaan ruokalistalinkiksi.
 *
 * EI julkaise mitaan. Tuottaa vain ehdokaslistan + katselmussivun, jotka
 * ihminen kuittaa. Syy: koeajossa 10.8.2026 automaatti tarjosi annoskuvaa
 * ruokalistaksi ja antoi pizzerialle naapuriravintolan a la carten.
 *
 * Aja: node scripts/discover-menu-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  scoreCandidate, countPriceTokens, classifyKind, sameHost, titleLooksLikeMenu, EVIDENCE_MIN,
} from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const TIMEOUT = 15000;
const CONCURRENCY = 5;
const SOCIAL = /facebook\.com|instagram\.com/i;

/** Kaikki 87 ravintolaa: 81 Mapsista + 6 kasin kuratoitua gemsia. */
function loadRestaurants() {
  const maps = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src/data/generated/restaurants-from-maps.json'), 'utf8'),
  );
  const list = (Array.isArray(maps) ? maps : Object.values(maps).flat())
    .map((r) => ({ slug: r.slug, name: r.name, city: r.city, site: r.website }));

  // Gemsit ovat TS-tiedostossa. Poimitaan kentat jarjestyksessa; tiedosto on
  // kasin yllapidetty ja jokaisella gemsilla on slug, name, city ja website.
  const src = fs.readFileSync(path.join(ROOT, 'src/data/restaurant-gems.ts'), 'utf8');
  const names = [...src.matchAll(/^\s{4}name: '([^']+)'/gm)].map((m) => m[1]);
  const cities = [...src.matchAll(/^\s{4}city: '([^']+)'/gm)].map((m) => m[1]);
  const sites = [...src.matchAll(/^\s{4}website: '([^']+)'/gm)].map((m) => m[1]);
  const slugs = [...src.matchAll(/^\s{4}slug: '([^']+)'/gm)].map((m) => m[1]);
  if (new Set([names.length, cities.length, sites.length, slugs.length]).size !== 1) {
    throw new Error(
      `restaurant-gems.ts jasennys epaonnistui: name=${names.length} city=${cities.length} website=${sites.length} slug=${slugs.length}. Korjaa poiminta ennen jatkoa.`,
    );
  }
  slugs.forEach((slug, i) => list.push({ slug, name: names[i], city: cities[i], site: sites[i] }));
  return list;
}

async function get(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'fi,en' },
      redirect: 'follow',
      signal: ctl.signal,
    });
    const ct = res.headers.get('content-type') ?? '';
    const body = res.ok && /text|html|pdf/i.test(ct) ? await res.text() : '';
    return { ok: res.ok, status: res.status, url: res.url, body, ct };
  } catch (e) {
    return { ok: false, status: e.name === 'AbortError' ? 'timeout' : 'error', url, body: '', ct: '' };
  } finally {
    clearTimeout(timer);
  }
}

const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ');

const titleOf = (html) => (html.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i)?.[1] ?? '')
  .replace(/\s+/g, ' ').trim();

/** Kaikki linkit joilla on ruokalistasignaali, parhaat ensin. */
function candidates(html, baseUrl) {
  const out = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]{0,200}?)<\/a>/gi)) {
    const href = m[1];
    if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const score = scoreCandidate(href, text);
    if (score <= 0) continue;
    try {
      out.push({ url: new URL(href, baseUrl).toString(), text, score });
    } catch { /* kelvoton href, ohitetaan */ }
  }
  const seen = new Set();
  return out.filter((c) => !seen.has(c.url) && seen.add(c.url)).sort((a, b) => b.score - a.score);
}

/** Navilinkit joiden takaa ruokalista voi loytya, kun etusivulla ei ollut mitaan. */
function navLinks(html, baseUrl) {
  const out = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = m[1];
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) continue;
    try {
      const u = new URL(href, baseUrl);
      if (!sameHost(u.toString(), baseUrl)) continue;
      if (classifyKind(u.toString()) === 'image') continue;
      out.push(u.toString());
    } catch { /* kelvoton href */ }
  }
  return [...new Set(out)].slice(0, 12);
}

/**
 * Kolme tasoa, ei kahta:
 *   strong — hinnat luettiin sivulta, EVIDENCE_MIN tai enemman
 *   titled — hintoja ei saatu luettua, mutta otsikko tai osoite sanoo ruokalista.
 *            Nain kayttaytyvat JS-renderoidyt sivut (nili.fi, kammi.fi) ja
 *            PDF-listat, joiden tavuvirta on pakattu. Vaativat ihmissilman.
 *   weak   — kumpikaan signaali ei osu
 */
async function evaluate(url, siteUrl, linkText) {
  const kind = classifyKind(url);
  if (kind === 'image') return { verdict: 'rejected', reason: 'kuvatiedosto' };
  if (!sameHost(url, siteUrl)) return { verdict: 'rejected', reason: `vieras domain (${url})` };
  const res = await get(url);
  if (!res.ok) return { verdict: 'rejected', reason: `ehdokas ${res.status}` };

  const title = titleOf(res.body);
  // PDF:n tavuvirrasta ei voi laskea hintoja, joten sita ei edes yriteta.
  const evidence = kind === 'pdf' ? null : countPriceTokens(strip(res.body));

  let verdict = 'weak';
  if (evidence !== null && evidence >= EVIDENCE_MIN) verdict = 'strong';
  else if (titleLooksLikeMenu(title) || titleLooksLikeMenu(res.url) || titleLooksLikeMenu(linkText)) verdict = 'titled';

  return { verdict, kind, title, evidence, url: res.url };
}

async function probe(r) {
  const base = { slug: r.slug, name: r.name, city: r.city, site: r.site ?? null };
  if (!r.site) return { ...base, verdict: 'nosite', reason: 'ei verkkosivua lainkaan' };
  if (SOCIAL.test(r.site)) return { ...base, verdict: 'nosite', reason: 'vain Facebook- tai Instagram-sivu' };

  const front = await get(r.site);
  if (!front.ok) return { ...base, verdict: 'unreachable', reason: `verkkosivu ${front.status}` };

  let cands = candidates(front.body, front.url);

  // Etusivulla ei signaalia -> katsotaan yksi navitaso syvemmalle.
  if (cands.length === 0) {
    for (const link of navLinks(front.body, front.url)) {
      const sub = await get(link);
      if (!sub.ok) continue;
      const deeper = candidates(sub.body, sub.url);
      if (deeper.length) { cands = deeper; break; }
      // Alasivu voi ITSE olla ruokalista ilman "ruokalista"-linkkia.
      if (countPriceTokens(strip(sub.body)) >= EVIDENCE_MIN
          && /ruokalist|menu|meny|carte|annokset/i.test(sub.url)) {
        cands = [{ url: sub.url, text: titleOf(sub.body), score: 6 }];
        break;
      }
    }
  }

  if (cands.length === 0) return { ...base, verdict: 'weak', reason: 'ei ehdokasta etusivulta eika navista' };

  // Kaydaan ehdokkaat lapi ja pidetaan paras loydos. Ei palata ensimmaisesta
  // heikosta, koska toinen ehdokas voi olla se oikea hinnoiteltu lista.
  let best = null;
  const better = { strong: 3, titled: 2, weak: 1, rejected: 0 };
  for (const c of cands.slice(0, 3)) {
    const ev = await evaluate(c.url, r.site, c.text);
    const cand = { ...base, ...ev, score: c.score, url: ev.url ?? c.url };
    if (!best || better[cand.verdict] > better[best.verdict]) best = cand;
    if (cand.verdict === 'strong') break;
  }
  return best ?? { ...base, verdict: 'rejected', url: cands[0].url, reason: 'kaikki ehdokkaat hylattiin' };
}

const restaurants = loadRestaurants();
console.log(`Ravintoloita: ${restaurants.length}`);
const results = [];
let i = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (i < restaurants.length) {
    const r = restaurants[i++];
    results.push(await probe(r));
    process.stdout.write('.');
  }
}));
process.stdout.write('\n');

/**
 * Merkitse ravintolat jotka jakavat verkkotunnuksen toisen kanssa.
 *
 * Tama on se kohta jossa automaatti erehtyy jarjestelmallisesti: hulluporo.fi
 * isannoi kolmea ravintolaa, harriniva.fi kahta, puistopaviljonki.fi kahta.
 * Koeajossa Wanha Hullu Poro sai Ammilan lounasbuffetin ja San Milano
 * Puistopaviljongin a la carten. Naita ei voi kuitata silmayksella, olipa
 * verdict mika tahansa.
 */
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./i, '').toLowerCase(); } catch { return null; } };
const hostCount = results.reduce((a, r) => {
  // Some-profiilit eivat ole ravintolan oma verkkotunnus, joten niiden
  // jakaminen ei kerro mitaan.
  const h = r.site && !SOCIAL.test(r.site) && hostOf(r.site);
  if (h) a[h] = (a[h] ?? 0) + 1;
  return a;
}, {});
results.forEach((r) => {
  const h = r.site && hostOf(r.site);
  if (h && hostCount[h] > 1) r.sharedDomain = h;
});

const rank = { strong: 0, titled: 1, weak: 2, rejected: 3, unreachable: 4, nosite: 5 };
results.sort((a, b) => (rank[a.verdict] - rank[b.verdict]) || (b.evidence ?? 0) - (a.evidence ?? 0));
fs.writeFileSync(path.join(HERE, '_menu-candidates.json'), JSON.stringify(results, null, 1));

const esc = (s) => String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
const rows = results.map((r) => `<tr class="${r.verdict}">
<td>${esc(r.verdict)}${r.sharedDomain ? '<br><b style="color:#b45309">JAETTU DOMAIN</b>' : ''}</td>
<td>${esc(r.name)}<br><small>${esc(r.city)} · ${esc(r.slug)}${r.sharedDomain ? ` · ${esc(r.sharedDomain)}` : ''}</small></td>
<td>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)}</a>` : esc(r.reason ?? '')}</td>
<td>${esc(r.title ?? '')}</td><td>${r.evidence ?? ''}</td>
<td>${r.site ? `<a href="${esc(r.site)}" target="_blank" rel="noopener">sivusto</a>` : ''}</td></tr>`).join('\n');

const counts = Object.entries(results.reduce((a, r) => ({ ...a, [r.verdict]: (a[r.verdict] ?? 0) + 1 }), {}))
  .map(([k, v]) => `${k}: ${v}`).join(' · ');

fs.writeFileSync(path.join(HERE, '_menu-review.html'), `<!doctype html><meta charset="utf-8">
<title>Ruokalistaehdokkaat — katselmus</title>
<style>body{font:14px/1.5 system-ui;margin:2rem;max-width:1200px}
table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;padding:.5rem;vertical-align:top}
.strong{background:#f0fdf4}.titled{background:#eff6ff}.weak{background:#fefce8}
.rejected{background:#fef2f2}.unreachable{background:#fee2e2}.nosite{background:#f8fafc;color:#666}
small{color:#666}</style>
<h1>Ruokalistaehdokkaat</h1><p><b>${results.length}</b> ravintolaa · ${counts}</p>
<p><b>Vihrea (strong)</b> = hinnat luettiin sivulta, ${EVIDENCE_MIN}+ kpl.
<b>Sininen (titled)</b> = hintoja ei saatu luettua (JS-sivu tai PDF), mutta otsikko sanoo ruokalista — avaa ja katso.
<b>Keltainen (weak)</b> = ei signaalia. <b>Punainen</b> = hylatty tai sivu ei vastaa.</p>
<table><tr><th>Tila</th><th>Ravintola</th><th>Ehdokas</th><th>Otsikko</th><th>Hintoja</th><th>Sivusto</th></tr>
${rows}</table>`);

console.log(counts);
console.log('-> scripts/_menu-candidates.json');
console.log('-> scripts/_menu-review.html');
