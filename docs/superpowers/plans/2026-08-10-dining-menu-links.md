# Ruokalistalinkit — toteutussuunnitelma

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Jokainen laplanddining.comin 87 ravintolakortista saa linkin ravintolan omaan ruokalistaan, tai kirjatun syyn miksi linkkiä ei ole.

**Architecture:** Skripti kaivaa ehdokkaat ravintoloiden verkkosivuilta ja pudottaa roskan todisteportilla (hintamerkinnät sivulla, ei pelkkä HTTP 200). Ihminen kuittaa jäljelle jäävät. Kuitatut linkit elävät committoidussa `restaurant-menus.json`-rekisterissä, jonka `restaurants.ts` sulauttaa ravintoladataan samalla tavalla kuin kuvarekisterin. Yksi jaettu `MenuLink`-komponentti renderöi napin neljällä korttipinnalla.

**Tech Stack:** Node 20+ (ESM, sisäänrakennettu `node --test`), React 19, React Router 7, Tailwind v4, TypeScript 5.9, Vite 8, i18next.

## Global Constraints

- **Speksi:** `docs/superpowers/specs/2026-08-10-dining-menu-links-design.md`. Ristiriidassa speksi voittaa.
- **Repo:** `C:\Users\pesol\projects\laplandvibes\laplanddining-new` — **oma git-repo**, branch `canonical-sweep-2026-05-03`. EI monorepon `laplandvibes`-puuta.
- **Työpuussa on jo 6 muutosta** (5 poistoa + `src/components/AppPromo.tsx`) jotka **eivät kuulu tähän työhön**. Stagea aina vain omat tiedostot polulla, älä koskaan `git add -A` / `git add .`.
- **Ei pushia** ilman erillistä lupaa. Jaetun repon commitit vuotavat origiin toisen session pushatessa.
- **87 ravintolaa** = 81 `restaurants-from-maps.json` + 6 `restaurant-gems.ts`. Rekisterin avain on `slug`, ei `googlePlaceId`.
- **Ei testiframeworkia repossa.** Puhtaan logiikan testit ajetaan Nodella sisäänrakennetulla `node --test`illä, ei uusia riippuvuuksia. React-komponenteille verifiointi = `tsc -b` + build + live-DOM.
- **Brändi:** amber `#F59E0B` on tämän sivuston lämmin aksentti. Älä sweeppaa pinkiksi. Fontit Bebas Neue + DM Sans.
- **Ulkolinkeissä** `target="_blank" rel="nofollow noopener"` ja `withReferral(url, 'dining_menu')`. Nämä eivät ole affiliate-linkkejä, joten **ei** `sponsored`-arvoa eikä reititystä Workerin kautta.
- **Lokaalit (12):** `en fi de ja es pt-BR zh-CN ko fr it nl sv`. Ei em-viivoja uusissa teksteissä.
- **Nuoli `→` tulee JSX:stä**, ei lokaalimerkkijonosta (nykyinen konventio: `{i18n.websiteLabel} →`).

---

### Task 1: Todisteportti ja pisteytys omaksi testattavaksi kirjastoksi

Löytöskripti ja kuukausivahti tarvitsevat molemmat saman logiikan. Se eristetään heti, koska se on ainoa osa jossa on oikeaa päättelyä ja siksi ainoa osa joka ansaitsee testit.

**Files:**
- Create: `scripts/lib/menu-detect.mjs`
- Test: `scripts/lib/menu-detect.test.mjs`

**Interfaces:**
- Consumes: ei mitään aiemmista tehtävistä
- Produces:
  - `scoreCandidate(href: string, text: string): number` — 0 = ei ehdokas, muuten 3-13
  - `countPriceTokens(text: string): number` — hintamerkintöjen määrä sivun tekstissä
  - `classifyKind(url: string): 'page' | 'pdf' | 'image'`
  - `sameHost(a: string, b: string): boolean` — vertaa hostnamea ilman `www.`-etuliitettä
  - `EVIDENCE_MIN: number` — vakio 3

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/menu-detect.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  scoreCandidate, countPriceTokens, classifyKind, sameHost, EVIDENCE_MIN,
} from './menu-detect.mjs';

test('kotimainen termi voittaa yleisen sanan menu', () => {
  assert.ok(scoreCandidate('/ruokalista', 'Ruokalista') > scoreCandidate('/menu', 'Menu'));
});

test('a la carte ja speisekarte tunnistetaan', () => {
  assert.ok(scoreCandidate('/a-la-carte/', 'A la carte') > 0);
  assert.ok(scoreCandidate('/speisekarte', 'Speisekarte') > 0);
});

test('navigaatiovimpain ei ole ruokalista', () => {
  assert.equal(scoreCandidate('#', 'Menu'), 0);
  assert.equal(scoreCandidate('/x', 'nav-menu toggle'), 0);
  assert.equal(scoreCandidate('/js/mobile-menu.js', ''), 0);
});

test('taysin osumaton linkki saa nollan', () => {
  assert.equal(scoreCandidate('/yhteystiedot', 'Yhteystiedot'), 0);
});

test('hintamerkinnat lasketaan suomalaisesta ja kansainvalisesta muodosta', () => {
  assert.equal(countPriceTokens('Poronkaristys 24,50 € ja lohta 29,00 € seka kahvi 4,50 €'), 3);
  assert.equal(countPriceTokens('Menu EUR 12.50 / EUR 18.00'), 2);
  assert.equal(countPriceTokens('Tervetuloa! Avoinna 11-21. Hinnat alkaen 10 euroa.'), 0);
});

test('EVIDENCE_MIN on kolme', () => {
  assert.equal(EVIDENCE_MIN, 3);
});

test('tiedostotyyppi luokitellaan paatteesta', () => {
  assert.equal(classifyKind('https://x.fi/menu.pdf'), 'pdf');
  assert.equal(classifyKind('https://x.fi/menu.PDF?v=2'), 'pdf');
  assert.equal(classifyKind('https://x.fi/wp-content/ammila-alacarte2.jpg'), 'image');
  assert.equal(classifyKind('https://x.fi/ruokalista'), 'page');
});

test('sameHost sivuuttaa www-etuliitteen', () => {
  assert.ok(sameHost('http://www.nili.fi/', 'https://nili.fi/ruokalista'));
  assert.ok(!sameHost('https://ravintolamori.fi/', 'https://www.ruokalistasivut.fi/'));
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test "scripts/lib/*.test.mjs"
```

Expected: FAIL, `Cannot find module` tai `ERR_MODULE_NOT_FOUND` for `./menu-detect.mjs`.

Huom: glob on lainattava ja tiedostokuvio annettava. Node 24 ei hyvaksy pelkkaa
hakemistoa (`node --test scripts/lib/` yrittaa suorittaa hakemiston moduulina ja
kaatuu `MODULE_NOT_FOUND`-virheeseen, mika nayttaa testin epaonnistumiselta).

- [ ] **Step 3: Write minimal implementation**

Create `scripts/lib/menu-detect.mjs`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Lisaa `package.json`:n `scripts`-lohkoon, jotta portti on yhden sanan komento:

```json
    "test": "node --test \"scripts/lib/*.test.mjs\"",
```

```bash
npm test
```

Expected: PASS, `pass 8` ja `fail 0`.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/menu-detect.mjs scripts/lib/menu-detect.test.mjs package.json
git commit -m "feat: ruokalistan tunnistusportti omaksi testatuksi kirjastoksi"
```

---

### Task 2: Löytöskripti — etusivu, yksi navitaso, katselmussivu

Koeajossa 23 sivustolla ei löytynyt etusivulta mitään, koska ruokalista on alasivulla. Tämä tehtävä lisää yhden tason syvyyttä ja tuottaa katselmussivun jonka ihminen käy läpi.

**Files:**
- Create: `scripts/discover-menu-links.mjs`
- Read: `src/data/generated/restaurants-from-maps.json`, `src/data/restaurant-gems.ts`
- Write (työtuotos, committoidaan): `scripts/_menu-candidates.json`, `scripts/_menu-review.html`

**Interfaces:**
- Consumes: `scoreCandidate`, `countPriceTokens`, `classifyKind`, `sameHost`, `EVIDENCE_MIN` Task 1:stä
- Produces: `scripts/_menu-candidates.json`, muoto:
  ```json
  [{ "slug": "rovaniemi-nili-restaurant", "name": "Nili Restaurant", "city": "Rovaniemi",
     "site": "http://www.nili.fi/", "url": "https://www.nili.fi/ruokalista",
     "kind": "page", "title": "Ruokalista – Nili", "evidence": 14, "score": 11,
     "verdict": "strong" }]
  ```
  `verdict` on `"strong" | "weak" | "rejected" | "nosite" | "unreachable"`.

- [ ] **Step 1: Kirjoita skripti**

Create `scripts/discover-menu-links.mjs`:

```js
/**
 * Etsii jokaiselle ravintolalle ehdokkaan ruokalistalinkiksi.
 *
 * EI julkaise mitaan. Tuottaa vain ehdokaslistan + katselmussivun, jotka
 * ihminen kuittaa (Task 3). Syy: koeajossa automaatti tarjosi annoskuvaa
 * ruokalistaksi ja antoi pizzerialle naapuriravintolan a la carten.
 *
 * Aja: node scripts/discover-menu-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  scoreCandidate, countPriceTokens, classifyKind, sameHost, EVIDENCE_MIN,
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
  // kasin yllapidetty ja jokaisella gemsilla on slug, name ja website.
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

async function evaluate(url, siteUrl) {
  const kind = classifyKind(url);
  if (kind === 'image') return { verdict: 'rejected', reason: 'kuvatiedosto' };
  if (!sameHost(url, siteUrl)) return { verdict: 'rejected', reason: `vieras domain (${url})` };
  const res = await get(url);
  if (!res.ok) return { verdict: 'rejected', reason: `ehdokas ${res.status}` };
  const text = kind === 'pdf' ? res.body : strip(res.body);
  const evidence = countPriceTokens(text);
  return {
    verdict: evidence >= EVIDENCE_MIN ? 'strong' : 'weak',
    kind,
    title: titleOf(res.body),
    evidence,
    url: res.url,
  };
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

  for (const c of cands.slice(0, 3)) {
    const ev = await evaluate(c.url, r.site);
    if (ev.verdict === 'strong') return { ...base, ...ev, score: c.score };
    if (ev.verdict === 'weak') return { ...base, ...ev, score: c.score, url: ev.url ?? c.url };
  }
  return { ...base, verdict: 'rejected', url: cands[0].url, reason: 'kaikki ehdokkaat hylattiin' };
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

const rank = { strong: 0, weak: 1, rejected: 2, unreachable: 3, nosite: 4 };
results.sort((a, b) => (rank[a.verdict] - rank[b.verdict]) || (b.evidence ?? 0) - (a.evidence ?? 0));
fs.writeFileSync(path.join(HERE, '_menu-candidates.json'), JSON.stringify(results, null, 1));

const esc = (s) => String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
const rows = results.map((r) => `<tr class="${r.verdict}">
<td>${esc(r.verdict)}</td><td>${esc(r.name)}<br><small>${esc(r.city)} · ${esc(r.slug)}</small></td>
<td>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)}</a>` : esc(r.reason ?? '')}</td>
<td>${esc(r.title ?? '')}</td><td>${r.evidence ?? ''}</td>
<td>${r.site ? `<a href="${esc(r.site)}" target="_blank" rel="noopener">sivusto</a>` : ''}</td></tr>`).join('\n');

const counts = Object.entries(results.reduce((a, r) => ({ ...a, [r.verdict]: (a[r.verdict] ?? 0) + 1 }), {}))
  .map(([k, v]) => `${k}: ${v}`).join(' · ');

fs.writeFileSync(path.join(HERE, '_menu-review.html'), `<!doctype html><meta charset="utf-8">
<title>Ruokalistaehdokkaat — katselmus</title>
<style>body{font:14px/1.5 system-ui;margin:2rem;max-width:1200px}
table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;padding:.5rem;vertical-align:top}
.strong{background:#f0fdf4}.weak{background:#fefce8}.rejected{background:#fef2f2}
.unreachable{background:#fee2e2}.nosite{background:#f8fafc;color:#666}
small{color:#666}</style>
<h1>Ruokalistaehdokkaat</h1><p><b>${results.length}</b> ravintolaa · ${counts}</p>
<p>Vihrea = todisteportti lapaisty (${EVIDENCE_MIN}+ hintamerkintaa). Keltainen = katso itse. Punainen = hylatty.</p>
<table><tr><th>Tila</th><th>Ravintola</th><th>Ehdokas</th><th>Otsikko</th><th>Hintoja</th><th>Sivusto</th></tr>
${rows}</table>`);

console.log(counts);
console.log('-> scripts/_menu-candidates.json');
console.log('-> scripts/_menu-review.html');
```

- [ ] **Step 2: Aja skripti**

```bash
node scripts/discover-menu-links.mjs
```

Expected: tulostaa `Ravintoloita: 87`, sitten 87 pistettä ja lopuksi rivit `strong: N · weak: N · ...`. Ei poikkeuksia. Molemmat tiedostot syntyvät.

- [ ] **Step 3: Tarkista että kattavuus on täysi**

```bash
node -e "const r=require('./scripts/_menu-candidates.json'); const s=new Set(r.map(x=>x.slug)); console.log('rivit',r.length,'uniikit slugit',s.size); if(r.length!==87||s.size!==87) process.exit(1);"
```

Expected: `rivit 87 uniikit slugit 87`, exit 0. Jos ei, `loadRestaurants` ei poimi gemsejä oikein — korjaa ennen jatkoa.

- [ ] **Step 4: Silmäile katselmussivu**

Avaa `scripts/_menu-review.html` selaimessa. Tarkista pistokokeena kolme vihreää riviä: onko linkin takana oikeasti ruokalista, ja onko se **oikean** ravintolan ruokalista. Jos vihreiden joukossa on annoskuva tai väärän ravintolan menu, todisteportti vuotaa — palaa Task 1:een ja lisää testi joka kiinni ottaa sen.

- [ ] **Step 5: Commit**

```bash
git add scripts/discover-menu-links.mjs scripts/_menu-candidates.json scripts/_menu-review.html
git commit -m "feat: ruokalistalinkkien loytoskripti + katselmussivu (87 ravintolaa)"
```

---

### Task 3: Kuittauskierros ja koneellisesti tarkistettu rekisteri

Tässä syntyy se tiedosto jonka sivusto lukee. Mikään ei päädy tänne ilman että ihminen on katsonut sen.

**Files:**
- Create: `src/data/generated/restaurant-menus.json`
- Create: `scripts/verify-menu-registry.mjs`
- Read: `scripts/_menu-candidates.json`

**Interfaces:**
- Consumes: `scripts/_menu-candidates.json` Task 2:sta
- Produces: `src/data/generated/restaurant-menus.json`, avaimena `slug`:
  ```json
  { "rovaniemi-nili-restaurant": { "url": "...", "kind": "page", "title": "...", "evidence": 14, "checkedAt": "2026-08-10" },
    "sodankyla-tori-kioski-mikkola-ky": { "status": "none", "reason": "...", "checkedAt": "2026-08-10" } }
  ```

- [ ] **Step 1: Kirjoita tarkistin ensin**

Create `scripts/verify-menu-registry.mjs`:

```js
/**
 * Portti rekisterille. Ajetaan ennen committia ja CI:n sijasta kasin.
 * Vaatii etta jokainen ravintola on kirjattu ja etta yksikaan julkaistu
 * linkki ei ole ilmiselvaa roskaa.
 *
 * Aja: node scripts/verify-menu-registry.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyKind } from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/restaurant-menus.json'), 'utf8'));
const cands = JSON.parse(fs.readFileSync(path.join(HERE, '_menu-candidates.json'), 'utf8'));
const slugs = cands.map((c) => c.slug);

const errors = [];
const seenUrls = new Map();

for (const slug of slugs) {
  const e = reg[slug];
  if (!e) { errors.push(`puuttuu kokonaan: ${slug}`); continue; }
  if (!e.checkedAt || !/^\d{4}-\d{2}-\d{2}$/.test(e.checkedAt)) {
    errors.push(`${slug}: checkedAt puuttuu tai on vaarassa muodossa`);
  }
  if (e.status === 'none') {
    if (!e.reason) errors.push(`${slug}: status none ilman syyta`);
    continue;
  }
  if (!e.url) { errors.push(`${slug}: ei urlia eika status: none`); continue; }
  if (!/^https:\/\//i.test(e.url)) errors.push(`${slug}: url ei ole https`);
  if (classifyKind(e.url) === 'image') errors.push(`${slug}: url on kuvatiedosto (${e.url})`);
  if (e.kind !== classifyKind(e.url)) errors.push(`${slug}: kind=${e.kind} ei vastaa urlia ${e.url}`);
  if (!e.title) errors.push(`${slug}: title puuttuu`);
  if (typeof e.evidence !== 'number') errors.push(`${slug}: evidence puuttuu`);
  if (seenUrls.has(e.url)) errors.push(`${slug}: sama url kuin ${seenUrls.get(e.url)} (${e.url})`);
  seenUrls.set(e.url, slug);
}

for (const key of Object.keys(reg)) {
  if (!slugs.includes(key)) errors.push(`tuntematon slug rekisterissa: ${key}`);
}

const withUrl = Object.values(reg).filter((e) => e.url).length;
const none = Object.values(reg).filter((e) => e.status === 'none').length;
console.log(`Rekisterissa ${Object.keys(reg).length} / ${slugs.length} ravintolaa`);
console.log(`  ruokalistalinkki: ${withUrl}`);
console.log(`  ei linkkia (syy kirjattu): ${none}`);

if (errors.length) {
  console.error(`\n${errors.length} virhetta:`);
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log('\nOK — kaikki ravintolat kirjattu ja linkit muodollisesti kunnossa.');
```

- [ ] **Step 2: Aja tarkistin tyhjää vasten, varmista että se kaatuu**

```bash
echo "{}" > src/data/generated/restaurant-menus.json && node scripts/verify-menu-registry.mjs
```

Expected: FAIL, exit 1, `87 virhetta` ja rivejä `puuttuu kokonaan: ...`. Tämä todistaa että portti oikeasti tarkistaa kattavuuden.

- [ ] **Step 3: Kuittaa ehdokkaat rekisteriin**

Käy `scripts/_menu-review.html` läpi ja rakenna `src/data/generated/restaurant-menus.json`. Säännöt:

- `verdict: "strong"` → kuittaa linkki sellaisenaan **kun olet avannut sen ja nähnyt ruokalistan**. Kopioi `url`, `kind`, `title`, `evidence`.
- `verdict: "weak"` → avaa sivusto ja etsi ruokalista käsin. Jos löytyy, kirjaa se ja aseta `evidence` sille arvolle jonka näet (0 on sallittu, jos kyseessä on esimerkiksi kuvamuotoinen listaus jonka olet itse todennut oikeaksi — kirjaa silloin `"note"`-kenttään miksi).
- `verdict: "rejected"` → etsi oikea linkki käsin tai merkitse `status: "none"` syineen.
- `verdict: "nosite"` → `status: "none"`, syy `"vain Facebook- tai Instagram-sivu"` tai `"ei verkkosivua lainkaan"`.
- `verdict: "unreachable"` → nämä 4 hoidetaan Task 7:ssä. Merkitse toistaiseksi `status: "none"`, syy `"verkkosivu ei vastaa, korjataan erikseen"`.
- **Kaksi ravintolaa samassa talossa** (Pizzeria San Milano ja Kemin Puistopaviljonki, molemmat `puistopaviljonki.fi`) vaativat aina käsin katsomisen. Puistopaviljongin oma à la carte on oikea sen omalla kortilla; San Milanolle etsitään pizzerian oma lista tai `status: "none"`.

`checkedAt` on tämän päivän päivä muodossa `YYYY-MM-DD` kaikilla riveillä.

- [ ] **Step 4: Aja tarkistin, vaadi vihreä**

```bash
node scripts/verify-menu-registry.mjs
```

Expected: PASS, exit 0, `Rekisterissa 87 / 87 ravintolaa` ja `OK — kaikki ravintolat kirjattu`.

- [ ] **Step 5: Commit**

```bash
git add src/data/generated/restaurant-menus.json scripts/verify-menu-registry.mjs
git commit -m "feat: kuitattu ruokalistarekisteri 87 ravintolalle + kattavuusportti"
```

---

### Task 4: Rekisteri kiinni ravintoladataan

**Files:**
- Modify: `src/data/restaurants.ts` (tyyppi, importti, molemmat merge-kohdat)

**Interfaces:**
- Consumes: `src/data/generated/restaurant-menus.json` Task 3:sta
- Produces: `Restaurant.menuUrl?: string` ja `Restaurant.menuKind?: 'page' | 'pdf'` — Task 5 ja Task 6 lukevat näitä

- [ ] **Step 1: Lisää tyyppi ja importti**

`src/data/restaurants.ts`, importtien perään (rivin 3 jälkeen, `restaurant-overrides`-importin viereen):

```ts
import restaurantMenus from './generated/restaurant-menus.json';
```

Ja `imageRegistry`-määrittelyn viereen (rivi 7):

```ts
type MenuEntry = { url?: string; kind?: string; title?: string; evidence?: number; status?: string; reason?: string; checkedAt: string };
const menuRegistry = restaurantMenus as Record<string, MenuEntry>;

/**
 * Ruokalistalinkki rekisterista. Vain `page` ja `pdf` kelpaavat; `status: none`
 * -rivit palauttavat undefinedin, jolloin korttiin ei tule nappia lainkaan.
 */
function menuFor(slug: string): { menuUrl?: string; menuKind?: 'page' | 'pdf' } {
  const m = menuRegistry[slug];
  if (!m?.url || (m.kind !== 'page' && m.kind !== 'pdf')) return {};
  return { menuUrl: m.url, menuKind: m.kind };
}
```

- [ ] **Step 2: Lisää kentät Restaurant-rajapintaan**

`src/data/restaurants.ts`, `photoCredit`-kentän jälkeen (rivi 80):

```ts
  /** Ravintolan oma ruokalista. Lahde: generated/restaurant-menus.json, kuitattu kasin. */
  menuUrl?: string;
  menuKind?: 'page' | 'pdf';
```

- [ ] **Step 3: Sulauta molempiin joukkoihin**

`merged`-mappäyksessä, `photoCredit`-rivin jälkeen (rivi 138):

```ts
    ...menuFor(m.slug),
```

`gemsWithImages`-mappäyksessä, `photoCredit`-rivin jälkeen (rivi 168):

```ts
    ...menuFor(g.slug),
```

- [ ] **Step 4: Tarkista tyypit ja kattavuus**

```bash
npx tsc -b
```

Expected: exit 0, ei tulostetta.

```bash
node --input-type=module -e "
import('./src/data/generated/restaurant-menus.json', { with: { type: 'json' } }).then(m => {
  const reg = m.default;
  const withUrl = Object.values(reg).filter(e => e.url).length;
  console.log('linkillisia ravintoloita:', withUrl, '/', Object.keys(reg).length);
});"
```

Expected: tulostaa linkillisten määrän. Kirjaa luku ylös — Task 5:n live-tarkistus vertaa siihen.

- [ ] **Step 5: Commit**

```bash
git add src/data/restaurants.ts
git commit -m "feat: ruokalistarekisteri sulautuu ravintoladataan (menuUrl + menuKind)"
```

---

### Task 5: MenuLink-komponentti neljälle korttipinnalle + 12 kieltä

Yksi komponentti, koska neljä kopiota ajautuu erilleen. Sama virhe tehtiin AppPromon kanssa 28 sivustolla.

**Files:**
- Create: `src/components/MenuLink.tsx`
- Modify: `src/pages/Restaurants.tsx` (korttien linkkirivi ~rivi 200, `cardI18n` ~rivi 255, `CardI18n`-tyyppi)
- Modify: `src/pages/FineDining.tsx` (linkkirivi ~rivi 216)
- Modify: `src/components/CityTopPicksGrid.tsx` (`CardLabels` ~rivi 23, linkkirivi ~rivi 130)
- Modify: `src/components/EditorsPicks.tsx` (`labels` ~rivi 31)
- Modify: `src/locales/{en,fi,de,ja,es,pt-BR,zh-CN,ko,fr,it,nl,sv}/pages.json`

**Interfaces:**
- Consumes: `Restaurant.menuUrl`, `Restaurant.menuKind` Task 4:stä; `withReferral` `src/lib/outbound.ts`:stä
- Produces: `<MenuLink restaurant={r} label={string} labelPdf={string} campaign={string} />`

- [ ] **Step 1: Luo komponentti**

Create `src/components/MenuLink.tsx`:

```tsx
import type { Restaurant } from '../data/restaurants';
import { withReferral } from '../lib/outbound';

interface Props {
  restaurant: Restaurant;
  /** Lokalisoitu "Ruokalista". Nuoli tulee tasta komponentista, ei kaannoksesta. */
  label: string;
  /** Lokalisoitu "Ruokalista (PDF)". PDF kaytettaytyy mobiilissa eri tavalla. */
  labelPdf: string;
  /** utm_campaign, esim. 'dining_menu_restaurants'. */
  campaign: string;
}

/**
 * Linkki ravintolan omaan ruokalistaan. Ei renderoi mitaan jos linkkia ei ole,
 * jottei korttiin jaa kuollutta nappia.
 *
 * Nama eivat ole affiliate-linkkeja: ei rel="sponsored" eika reititysta
 * go.laplandvibes.com-Workerin kautta.
 */
export default function MenuLink({ restaurant, label, labelPdf, campaign }: Props) {
  if (!restaurant.menuUrl) return null;
  return (
    <a
      href={withReferral(restaurant.menuUrl, campaign)}
      target="_blank"
      rel="nofollow noopener"
      className="inline-flex items-center gap-1 text-amber-deep hover:text-spice text-xs font-bold uppercase tracking-wider transition-colors no-underline"
    >
      {restaurant.menuKind === 'pdf' ? labelPdf : label} →
    </a>
  );
}
```

- [ ] **Step 2: Lisää käännösavaimet 12 kieleen**

Jokaiseen `src/locales/<lang>/pages.json`-tiedostoon, `restaurants`-lohkoon `websiteLabel`-avaimen viereen:

| kieli | `restaurants.menuLabel` | `restaurants.menuLabelPdf` |
|---|---|---|
| en | `Menu` | `Menu (PDF)` |
| fi | `Ruokalista` | `Ruokalista (PDF)` |
| de | `Speisekarte` | `Speisekarte (PDF)` |
| ja | `メニュー` | `メニュー（PDF）` |
| es | `Carta` | `Carta (PDF)` |
| pt-BR | `Cardápio` | `Cardápio (PDF)` |
| zh-CN | `菜单` | `菜单（PDF）` |
| ko | `메뉴` | `메뉴 (PDF)` |
| fr | `Carte` | `Carte (PDF)` |
| it | `Menù` | `Menù (PDF)` |
| nl | `Menukaart` | `Menukaart (PDF)` |
| sv | `Meny` | `Meny (PDF)` |

Esimerkki `src/locales/fi/pages.json`:

```json
    "websiteLabel": "Nettisivut",
    "menuLabel": "Ruokalista",
    "menuLabelPdf": "Ruokalista (PDF)",
    "mapsLabel": "Avaa kartalla",
```

- [ ] **Step 3: Kytke Restaurants.tsx**

Importti tiedoston alkuun:

```tsx
import MenuLink from '../components/MenuLink';
```

`CardI18n`-tyyppiin kaksi kenttää:

```tsx
  menuLabel: string;
  menuLabelPdf: string;
```

`cardI18n`-objektiin (`websiteLabel`-rivin jälkeen, ~rivi 256):

```tsx
    menuLabel: t('restaurants.menuLabel'),
    menuLabelPdf: t('restaurants.menuLabelPdf'),
```

Linkkirivin **ensimmäiseksi** alkioksi, ennen `{r.website && (` -lohkoa (~rivi 200):

```tsx
          <MenuLink
            restaurant={r}
            label={i18n.menuLabel}
            labelPdf={i18n.menuLabelPdf}
            campaign="dining_menu_restaurants"
          />
```

- [ ] **Step 4: Kytke CityTopPicksGrid.tsx**

Importti + `CardLabels`-rajapintaan:

```tsx
  menuLabel: string;
  menuLabelPdf: string;
```

Linkkirivin ensimmäiseksi alkioksi (~rivi 130, ennen `{r.website && (`):

```tsx
          <MenuLink
            restaurant={r}
            label={labels.menuLabel}
            labelPdf={labels.menuLabelPdf}
            campaign="dining_menu_toppicks"
          />
```

- [ ] **Step 5: Kytke EditorsPicks.tsx ja FineDining.tsx**

`EditorsPicks.tsx` käyttää samaa `CardLabels`-tyyppiä, joten sen `labels`-objektiin (~rivi 32):

```tsx
    menuLabel: t('restaurants.menuLabel'),
    menuLabelPdf: t('restaurants.menuLabelPdf'),
```

`FineDining.tsx`: importti, ja linkkirivin ensimmäiseksi alkioksi (~rivi 217, ennen `{r.website && (`):

```tsx
                      <MenuLink
                        restaurant={r}
                        label={t('restaurants.menuLabel')}
                        labelPdf={t('restaurants.menuLabelPdf')}
                        campaign="dining_menu_finedining"
                      />
```

- [ ] **Step 6: Tarkista käännösten kattavuus koneellisesti**

```bash
node -e "
const langs=['en','fi','de','ja','es','pt-BR','zh-CN','ko','fr','it','nl','sv'];
let bad=0;
for(const l of langs){
  const p=require('./src/locales/'+l+'/pages.json');
  for(const k of ['menuLabel','menuLabelPdf']){
    if(!p.restaurants?.[k]){console.error('PUUTTUU',l,k);bad++;}
  }
}
console.log(bad?'PUUTTEITA: '+bad:'kaikki 12 kielta OK');
process.exit(bad?1:0);"
```

Expected: `kaikki 12 kielta OK`, exit 0.

- [ ] **Step 7: Buildaa**

```bash
npm run build
```

Expected: exit 0. `tsc -b` läpi, vite build läpi, prerender läpi.

- [ ] **Step 8: Tarkista napit oikeasta DOMista, EI staattisesta HTML:stä**

🔴 **Tämän sivuston prerender kirjoittaa vain metan.** `dist/restaurants/index.html`
on 13 kt ja sen `<div id="root">` on tyhjä: ei ravintoloita, ei kortteja, ei
ItemList-skeemaa. Kaikki sisältö renderöityy selaimessa. Staattisen HTML:n
greppaaminen antaa 0 osumaa vaikka kaikki toimisi.

Todiste kaksiosaisena. Ensin että koodi ja data ovat mukana bundlessa:

```bash
node -e "
const fs=require('fs');
let h={Ruokalista:0,hasMenu:0,dining_menu:0,Speisekarte:0};
for(const f of fs.readdirSync('dist/assets').filter(f=>f.endsWith('.js'))){
  const s=fs.readFileSync('dist/assets/'+f,'utf8');
  for(const k of Object.keys(h)) h[k]+=s.split(k).length-1;}
console.log(h);"
```

Expected: jokainen nollaa suurempi.

Sitten oikeasta DOMista dev-palvelimella (`preview_start` nimellä `laplanddining`,
portti 5198), sivulla `/fi/restaurants`:

```js
const menu=[...document.querySelectorAll('a')].filter(a=>/Ruokalista/i.test(a.textContent));
const ld=[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent));
({ nappeja: menu.length,
   pdf: menu.filter(a=>/PDF/.test(a.textContent)).length,
   hasMenu: ld.find(j=>j['@type']==='ItemList').itemListElement.filter(x=>x.item.hasMenu).length })
```

Expected: `hasMenu` = rekisterin linkkimäärä tasan (42), nappeja > 0, `rel` on
`nofollow noopener` ilman `noreferrer`, href sisältää `utm_campaign=dining_menu_*`.

🔴 **Mittaa vasta kun selainpaneelilla on koko.** Mitoittamattomassa paneelissa
`document.documentElement.clientWidth` on 0, jolloin jokainen elementti näyttää
vuotavan vaakasuunnassa. Aja `resize_window` 1280×800 ja 375×812 ennen mittausta.

- [ ] **Step 9: Commit**

```bash
git add src/components/MenuLink.tsx src/pages/Restaurants.tsx src/pages/FineDining.tsx src/components/CityTopPicksGrid.tsx src/components/EditorsPicks.tsx src/locales
git commit -m "feat: ruokalistanappi neljalle korttipinnalle, 12 kielta"
```

---

### Task 6: hasMenu Restaurant-JSON-LD:hen

**Files:**
- Modify: `src/pages/Restaurants.tsx` (ItemList-JSON-LD ~rivi 284-299)

**Interfaces:**
- Consumes: `Restaurant.menuUrl` Task 4:stä
- Produces: ei mitään myöhemmille tehtäville

- [ ] **Step 1: Lisää kenttä**

`src/pages/Restaurants.tsx`, ItemList-lohkossa `...(r.website ? { url: r.website } : {}),` -rivin jälkeen:

```tsx
              ...(r.menuUrl ? { hasMenu: r.menuUrl } : {}),
```

- [ ] **Step 2: Tarkista skeema DOMista**

Sama huomio kuin Task 5 Step 8:ssa: ItemList ei ole staattisessa HTML:ssä, se
renderöityy selaimessa. Tarkista dev-palvelimen DOMista, että jokainen
`hasMenu`-arvo vastaa rekisteriä ja että kaikki JSON-LD-lohkot parsiutuvat:

```js
const ld=[...document.querySelectorAll('script[type="application/ld+json"]')];
const parsed=ld.map(s=>{try{return JSON.parse(s.textContent)}catch{return null}});
({ lohkoja: ld.length, rikki: parsed.filter(x=>!x).length,
   hasMenu: parsed.find(j=>j&&j['@type']==='ItemList').itemListElement.filter(x=>x.item.hasMenu).length })
```

Expected: `rikki: 0` ja `hasMenu` = 42.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Restaurants.tsx
git commit -m "feat: hasMenu Restaurant-skeemaan /restaurants-sivulla"
```

---

### Task 7: Neljä rikkinäistä verkkosivulinkkiä

Nämä ovat livenä juuri nyt ja johtavat 404-sivulle. Löytyivät koeajossa sivutuotteena.

**Files:**
- Modify: `src/data/restaurant-overrides.ts` (`Override`-tyyppi rivi 26-36, uudet rivit)

**Interfaces:**
- Consumes: ei mitään
- Produces: ei mitään myöhemmille tehtäville

Korjattavat (slug | nykyinen rikkinäinen osoite):

| slug | nykyinen | tila |
|---|---|---|
| `sodankyla-tori-kioski-mikkola-ky` | `http://www.torikioski.fi/hinnasto/eng` | 404 |
| `pyhatunturi-restaurant-camp-kitchen-bar-pyhatunturi` | `https://campkitchen.fi/pyha/` | 404 |
| `luosto-luoston-hovi-ravintola` | `https://luosto.fi/yritys/ravintola-luostonhovi` | 404 |
| `hetta-niestapaikka` | `http://niestapaikka.onverkossa.fi/` | ei vastaa |

- [ ] **Step 1: Salli `website` override-tasolla**

`src/data/restaurant-overrides.ts`, `Override`-tyyppiin:

```ts
type Override = Partial<Pick<Restaurant,
  | 'topPick'
  | 'partnership'
  | 'curatedDescription'
  | 'highlights'
  | 'cuisine'
  | 'type'
  | 'menuHighlights'
  | 'dietary'
  | 'reservationPolicy'
  | 'website'
>>;
```

- [ ] **Step 2: Etsi oikeat osoitteet**

Jokaiselle neljälle: hae domainin juuri (`https://torikioski.fi/`, `https://campkitchen.fi/`, `https://luosto.fi/`) ja katso vastaako se. Jos vastaa ja sivulta löytyy kyseinen ravintola, käytä sitä. Jos koko domain on kuollut, poista kenttä.

Tarkista jokainen ehdokas **oikealla portilla**, ei pelkällä statuskoodilla:

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' 'https://torikioski.fi/' -H 'User-Agent: Mozilla/5.0'
curl -s 'https://torikioski.fi/' -H 'User-Agent: Mozilla/5.0' | grep -io '<title>[^<]*' | head -1
```

Expected: 200 **ja** otsikko joka vastaa ravintolaa. Pelkkä 200 ei riitä: parkkeerattu domain palauttaa myös 200.

- [ ] **Step 3: Kirjaa korjaukset**

`restaurantOverrides`-objektiin, avaimena **`googlePlaceId`** (tämä tiedosto on Place ID -avainnettu, toisin kuin menurekisteri). Hae ID:t:

```bash
node -e "
const d=require('./src/data/generated/restaurants-from-maps.json');
const a=Array.isArray(d)?d:Object.values(d).flat();
['sodankyla-tori-kioski-mikkola-ky','pyhatunturi-restaurant-camp-kitchen-bar-pyhatunturi','luosto-luoston-hovi-ravintola','hetta-niestapaikka']
  .forEach(s=>{const r=a.find(x=>x.slug===s); console.log(r.googlePlaceId, '|', r.name);});"
```

Toimiva osoite:

```ts
  // Tori-Kioski Mikkola — Sodankyla. Maps-osoite /hinnasto/eng oli 404 10.8.2026.
  'ChIJ...': { website: 'https://torikioski.fi/' },
```

Kuollut domain — kenttä pois, jolloin kortti näyttää vain karttalinkin:

```ts
  // Niestapaikka — Hetta. onverkossa.fi-alidomain ei vastannut 10.8.2026.
  'ChIJ...': { website: undefined },
```

- [ ] **Step 4: Varmista että yksikään verkkosivulinkki ei ole rikki**

```bash
node --input-type=module -e "
import fs from 'node:fs';
const maps=JSON.parse(fs.readFileSync('./src/data/generated/restaurants-from-maps.json','utf8'));
const list=(Array.isArray(maps)?maps:Object.values(maps).flat());
const src=fs.readFileSync('./src/data/restaurant-overrides.ts','utf8');
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0';
let bad=0;
for(const r of list){
  if(!r.website||/facebook|instagram/i.test(r.website)) continue;
  if(src.includes(r.googlePlaceId)&&/website: undefined/.test(src.split(r.googlePlaceId)[1].slice(0,200))) continue;
  try{
    const res=await fetch(r.website,{headers:{'User-Agent':UA},redirect:'follow',signal:AbortSignal.timeout(15000)});
    if(!res.ok){console.error('RIKKI',res.status,r.slug,r.website);bad++;}
  }catch(e){console.error('RIKKI',e.name,r.slug,r.website);bad++;}
}
console.log(bad?bad+' rikkinaista jaljella':'kaikki verkkosivulinkit vastaavat');
process.exit(bad?1:0);"
```

Expected: `kaikki verkkosivulinkit vastaavat`, exit 0. Huom: skripti lukee generoitua dataa, joten overrideen kirjattu korjaus ei näy siinä — jos korjattu ravintola raportoituu yhä rikkinäiseksi, tarkista käsin että override on oikealla Place ID:llä.

- [ ] **Step 5: Buildaa ja commitoi**

```bash
npx tsc -b && git add src/data/restaurant-overrides.ts && git commit -m "fix: 4 rikkinaista verkkosivulinkkia (3x 404 + 1 timeout)"
```

---

### Task 8: Kuukausivahti

URL on pysyvä mutta ei ikuinen. Tämä ajetaan kuukausittain samaan aikaan Maps-syncin kanssa.

**Files:**
- Create: `scripts/check-menu-links.mjs`

**Interfaces:**
- Consumes: `menu-detect.mjs` Task 1:stä, `restaurant-menus.json` Task 3:sta
- Produces: exit 1 jos yksikin linkki on lakannut olemasta ruokalista

- [ ] **Step 1: Kirjoita vahti**

Create `scripts/check-menu-links.mjs`:

```js
/**
 * Kuukausivahti julkaistuille ruokalistalinkeille. Ajaa saman todisteportin
 * kuin loytoskripti ja raportoi mitkä linkit ovat lakanneet olemasta
 * ruokalistoja (404, uudelleenohjaus etusivulle, kausi-PDF poistettu).
 *
 * Aja: node scripts/check-menu-links.mjs
 * Kadenssi: kuukausittain, samaan aikaan sync-restaurants.mjs:n kanssa.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countPriceTokens, classifyKind, EVIDENCE_MIN } from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/restaurant-menus.json'), 'utf8'));

const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');

const entries = Object.entries(reg).filter(([, e]) => e.url);
const rot = [];
let i = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  while (i < entries.length) {
    const [slug, e] = entries[i++];
    try {
      const res = await fetch(e.url, {
        headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) { rot.push(`${slug}: HTTP ${res.status} — ${e.url}`); continue; }
      const body = await res.text();
      const ev = countPriceTokens(classifyKind(e.url) === 'pdf' ? body : strip(body));
      if (ev < EVIDENCE_MIN) {
        rot.push(`${slug}: ei enaa ruokalista (${ev} hintaa, oli ${e.evidence}) — ${res.url}`);
      }
    } catch (err) {
      rot.push(`${slug}: ${err.name} — ${e.url}`);
    }
    process.stdout.write('.');
  }
}));
process.stdout.write('\n');

console.log(`Tarkistettu ${entries.length} ruokalistalinkkia.`);
if (rot.length) {
  console.error(`\n${rot.length} vaatii huomiota:`);
  rot.forEach((r) => console.error('  ' + r));
  process.exit(1);
}
console.log('Kaikki linkit ovat yha ruokalistoja.');
```

- [ ] **Step 2: Aja vahti**

```bash
node scripts/check-menu-links.mjs
```

Expected: exit 0, `Kaikki linkit ovat yha ruokalistoja.` Juuri kuitatun rekisterin pitää olla puhdas. Jos ei ole, joko kuittauksessa meni linkki läpi jota ei tarkistettu, tai todisteportti on liian tiukka jollekin sivulle — korjaa rekisteri, älä löysää porttia.

- [ ] **Step 3: Commit**

```bash
git add scripts/check-menu-links.mjs
git commit -m "feat: kuukausivahti ruokalistalinkeille"
```

---

### Task 9: Deploy, live-verifiointi ja end-of-task-rituaali

**Files:**
- Modify: muistitiedosto `_projects/laplandvibes/_episodic/per-site/laplanddining.md`
- Modify: `C:\Users\pesol\projects\command-center\command-center-sites\laplanddining.html`
- Modify: `C:\Users\pesol\projects\command-center\command-center.html` (SITES-rivin `st:`-kenttä)

- [ ] **Step 1: Aja koko portisto vielä kerran**

```bash
npm test && node scripts/verify-menu-registry.mjs && node scripts/check-menu-links.mjs && npm run build
```

Expected: kaikki neljä exit 0.

- [ ] **Step 2: Deploy**

```bash
npx wrangler pages deploy dist --project-name=laplanddining
```

Expected: deploy-URL muodossa `https://<hash>.laplanddining.pages.dev`.

- [ ] **Step 3: Verifioi deploy-URLista ennen apexia**

Tarkista **deploy-URLista**, ei apexista. Apex valehtelee selainvälimuistin takia — tämä nimenomainen ansa osui 3.8. tällä sivustolla.

🔴 **curl + grep EI kelpaa tälle sivustolle**: palvelin lähettää tyhjän
`#root`-kuoren, joten `grep Ruokalista` antaa 0 vaikka kaikki toimisi. curlilla
tarkistetaan vain että oikea JS-nippu tarjoillaan:

```bash
curl -s 'https://<hash>.laplanddining.pages.dev/restaurants' -H 'User-Agent: Mozilla/5.0' | grep -o 'assets/index-[A-Za-z0-9_-]*\.js' | head -1
```

Expected: sama chunk-nimi kuin `dist/assets/`-hakemistossa. Sisällön todiste
tulee selaimesta seuraavassa vaiheessa.

- [ ] **Step 4: Tarkista apex ja mobiili silmillä**

Avaa selainpaneelissa `https://laplanddining.com/restaurants` välimuistinohituksella (`?v=<hash>`). Tarkista:
- ruokalistanappi näkyy ja on amber-värinen, ei pinkki
- nappi on ennen `Nettisivut`-linkkiä
- PDF-listoissa lukee `Ruokalista (PDF)`
- ravintoloilla joilla ei ole listaa **ei ole** tyhjää nappia
- klikkaa kolme nappia: aukeaa oikean ravintolan ruokalista

Sitten `resize_window` 375 px ja tarkista ettei linkkirivi aiheuta vaakavuotoa.

- [ ] **Step 5: Päivitä muisti ja Command Center**

Lisää `_projects/laplandvibes/_episodic/per-site/laplanddining.md` -tiedoston alkuun merkintä: mitä tehtiin, montako linkkiä (`N/87`), montako `status: none` ja miksi, 4 korjattua verkkosivulinkkiä, commit-tunnukset, deploy-hash, kuukausivahdin ajokomento.

Päivitä `command-center-sites/laplanddining.html`: päivämäärät, changelog-merkintä alkuun, avoimiin asioihin ne ravintolat joilta ruokalista puuttuu (= liidilista kuvakampanjan rinnalle).

- [ ] **Step 6: Raportoi Vesalle**

Kerro: live-URL, `▸ STATUS`-sivun URL, montako ravintolaa sai linkin ja montako jäi ilman **syineen**, ja se 10 ravintolan Facebook-liidilista.

---

## Self-review

**Speksin kattavuus:** datataso → Task 3-4; löytöskripti + todisteportti → Task 1-2; kuittauskierros → Task 3; UI 4 pinnalle + i18n → Task 5; `hasMenu` → Task 6; 4 rikkinäistä → Task 7; kuukausivahti → Task 8; "määritelmä valmiille" 7 kohtaa → Task 9. Ei aukkoja.

**Tyyppien yhtenäisyys:** `menuUrl`/`menuKind` määritellään Task 4:ssä ja kulutetaan Task 5-6:ssa samoilla nimillä. `scoreCandidate`/`countPriceTokens`/`classifyKind`/`sameHost`/`EVIDENCE_MIN` määritellään Task 1:ssä ja kulutetaan Task 2 ja 8:ssa samoilla allekirjoituksilla. Rekisterin avain on `slug` kaikkialla; `restaurant-overrides.ts` on `googlePlaceId`-avainnettu ja se on kirjattu Task 7 Step 3:een erikseen.

**Tunnettu epävarmuus:** Task 3:n kuittauskierroksen työmäärä riippuu siitä montako `strong`-verdiktiä Task 2 tuottaa. Koeajossa 36/70 oli puhtaita ilman navitasoa; navitason kanssa luvun pitäisi nousta, mutta sitä ei ole mitattu. Jos `weak`-rivejä on yli 30, kuittaus on oma istuntonsa eikä mahdu saman työn sisään.
