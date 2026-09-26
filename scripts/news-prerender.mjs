#!/usr/bin/env node
/**
 * news-prerender.mjs — uutisosion (src/news/) build-askel ja portti.
 * Alkuperä laplandflights.fi 18.9.2026; laplandnature 24.9., laplandstays 25.9.,
 * laplanddining 26.9.2026. Tiedosto ei tunne sivuston muita reittejä.
 *
 * 🔴 laplanddiningin ainoa ero: `--no-sitemap`. Tällä sivustolla sivukartta GENEROIDAAN
 * kokonaan `scripts/gen-sitemap.mjs`:llä suoraan routes.jsonista, joten tämä askel ajetaan
 * ENNEN sitä eikä kirjoita sivukarttaa itse — muuten samat /news-lohkot tulisivat kahdesti
 * (kerran täältä, kerran generaattorista) ja sivukartta olisi eri mieltä itsensä kanssa.
 *
 * 🔴 Yksi lisäys flightsin versioon (24.9.2026, CLAUDE.md §34): jos jutun meta.jsonissa on
 * `ogCard: { line }`, reitille kirjoitetaan jakoKORTTI (`/og/news-<slug>.jpg` + `ogCard`), jonka
 * scripts/og/gen_page_cards.mjs piirtää — sanamerkki ja rivi mukaan lukien. Ilman sitä kenttää
 * käytös on ennallaan: og-kuvaksi menee hero-valokuva sellaisenaan. Raaka valokuvarajaus ei ole
 * jakokuva, mutta vanhan sivuston reittejä ei muuteta tämän tiedoston kopioinnilla.
 *
 * Mitä tekee (järjestyksessä, buildissa generate-prerender-meta.mjs:n JÄLKEEN ja
 * _prerender_routes.mjs:n ENNEN):
 *   1. PORTTI — kaataa buildin (exit 1), jos
 *        - kielitiedosto puuttuu (12 kieltä per juttu + i18n),
 *        - rungon rakenne (lohkotyypit, upotusten id:t, linkkien kohteet) poikkeaa englannista,
 *        - käännöksessä on luku jota englanninkielisessä vastinlohkossa ei ole, tai englannin
 *          ≥10-luku (vuosi, päivä, määrä) puuttuu käännöksestä (numeroportti, 08-natiivikaannos),
 *        - hakutuloksen otsikko > 60 merkkiä tai metakuvaus ei ole 70–160 merkkiä,
 *        - välimerkit: fr ilman sitomatonta väliä ennen ; : ! ?, es ilman ¿/¡-paria, ja/zh
 *          puolileveä ?/! tai pilkku CJK-tekstissä,
 *        - hero-kuvaa ei ole public/-kansiossa tai lisenssikuitti puuttuu.
 *   2. scripts/routes.json — /news ja /news/<slug>: og-kuva ja ryömittävän rungon lähde.
 *   3. scripts/prerender-meta.json — otsikko + kuvaus joka kielelle (ei EN-varaotsikoita).
 *   4. sitemap.xml (dist/ + public/) — <url>-lohkot hreflang-vaihtoehtoineen, idempotentisti.
 *   5. node_modules/.cache/lv-news/ — ryömittävän rungon tekstit (ingressi + runko, EI otsikkoa,
 *      metakuvausta eikä alt-tekstiä, jotka esirenderöijä kirjoittaa jo muualle).
 *
 * Käyttö:  node scripts/news-prerender.mjs --site=https://laplandflights.fi --siteName=LaplandFlights
 *          --check  = pelkkä portti, ei kirjoita mitään
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = process.cwd();
const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  return m ? [m[1], m[2] ?? true] : [a, true];
}));
const SITE = String(args.site || '').replace(/\/+$/, '');
const SITE_NAME = String(args.siteName || '');
const CHECK = Boolean(args.check);
const NO_SITEMAP = Boolean(args['no-sitemap']);
const SECTION = '/news';
if (!SITE || !SITE_NAME) {
  console.error('[news] --site=https://… ja --siteName=… vaaditaan');
  process.exit(2);
}

const NEWS = resolve(ROOT, 'src/news');
const ART_DIR = join(NEWS, 'articles');
const I18N_DIR = join(NEWS, 'i18n');
const CACHE = resolve(ROOT, 'node_modules/.cache/lv-news');

// Sama järjestys ja prefiksit kuin src/i18n/useLang.ts ja _prerender_routes.mjs (+ --addLocales=sv).
const LOCALES = [
  { lang: 'en', prefix: '', hreflang: 'en' },
  { lang: 'fi', prefix: '/fi', hreflang: 'fi' },
  { lang: 'de', prefix: '/de', hreflang: 'de' },
  { lang: 'ja', prefix: '/ja', hreflang: 'ja' },
  { lang: 'es', prefix: '/es', hreflang: 'es' },
  { lang: 'pt-BR', prefix: '/br', hreflang: 'pt-BR' },
  // 🔴 Tama sivusto on zh-CN (yksinkertaistettu), ei Taiwanin perinteista kuten laplandstays:
  // hreflang-koodi on sama kuin sivuston muilla reiteilla (src/i18n/Hreflang.tsx + gen-sitemap.mjs).
  { lang: 'zh-CN', prefix: '/cn', hreflang: 'zh-CN' },
  { lang: 'ko', prefix: '/kr', hreflang: 'ko' },
  { lang: 'fr', prefix: '/fr', hreflang: 'fr' },
  { lang: 'it', prefix: '/it', hreflang: 'it' },
  { lang: 'nl', prefix: '/nl', hreflang: 'nl' },
  { lang: 'sv', prefix: '/sv', hreflang: 'sv' },
];
const LANGS = LOCALES.map((l) => l.lang);

const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const readJson = (p) => JSON.parse(readFileSync(p, 'utf-8'));
const len = (s) => [...String(s ?? '')].length;

// ── Numeroportti ────────────────────────────────────────────────────────────
// Kuukausien nimet → numero, jotta "20 December 2026" ja "20.12.2026" vertautuvat.
// Vain PITKÄT nimet (lyhyt "Mar", "set" osuisi sanoihin); en/de kirjainkoko ratkaisee
// ("May" kuukautena vs "may" verbinä). ja/zh/ko kirjoittavat kuukauden numerona.
const MONTH_RULES = {};
for (const lang of ['en', 'de', 'fr', 'it', 'es', 'pt-BR', 'nl', 'sv']) {
  const caseSensitive = lang === 'en' || lang === 'de';
  const rules = [];
  for (let m = 1; m <= 12; m++) {
    const d = new Date(Date.UTC(2026, m - 1, 15));
    const names = new Set([
      new Intl.DateTimeFormat(lang, { month: 'long', timeZone: 'UTC' }).format(d),
      new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(d).replace(/[\d.,\s]|de\s/g, '').trim(),
    ].filter(Boolean));
    for (const n of names) rules.push([n, m]);
  }
  rules.sort((a, b) => b[0].length - a[0].length);
  MONTH_RULES[lang] = rules.map(([n, m]) => [new RegExp(`(?<![\\p{L}])${n}(?![\\p{L}])`, caseSensitive ? 'gu' : 'giu'), m]);
}
// Suomi: taivutetut muodot ("tammikuun", "maaliskuuksi") ja katkaistu "helmi- ja maaliskuu".
const FI_STEMS = ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'];
MONTH_RULES.fi = [
  ...FI_STEMS.map((s, i) => [new RegExp(`(?<![\\p{L}])${s}\\p{L}*`, 'giu'), i + 1]),
  ...FI_STEMS.map((s, i) => [new RegExp(`(?<![\\p{L}])${s.replace(/kuu$/, '')}-(?=\\s)`, 'giu'), i + 1]),
];

function numbers(text, lang) {
  let t = String(text);
  for (const [re, m] of MONTH_RULES[lang] ?? []) t = t.replace(re, ` ${m} `);
  // Kausi "2026–27" = "2026–2027" (ei päivämääräväliä "2026–14.3." — piste perässä).
  t = t.replace(/(\d{2})(\d{2})\s*[–\-/〜~]\s*(\d{2})(?![\d.])/g, '$1$2–$1$3');
  // Tuhaterottimet: "8 000", "8,000", "8.000" = 8000 (kolme numeroa perässä, ei neljättä).
  let prev;
  do { prev = t; t = t.replace(/(\d)[ \u00a0\u202f.,](\d{3})(?!\d)/g, '$1$2'); } while (t !== prev);
  return (t.match(/\d+/g) || []).map((x) => Number(x));
}
const counts = (arr) => arr.reduce((m, n) => m.set(n, (m.get(n) || 0) + 1), new Map());

function blockStrings(b) {
  const out = [];
  for (const k of ['text', 'title', 'label']) if (typeof b[k] === 'string') out.push(b[k]);
  if (Array.isArray(b.items)) out.push(...b.items);
  return out;
}
const signature = (b) => `${b.t}${b.id ? `#${b.id}` : ''}${b.href ? `>${b.href}` : ''}${Array.isArray(b.items) ? `[${b.items.length}]` : ''}`;

// ── Välimerkit ──────────────────────────────────────────────────────────────
function punctuation(where, lang, s) {
  if (lang === 'fr') {
    if (/ [;:!?»]/.test(s)) err(where, `fr: tavallinen välilyönti ennen ; : ! ? tai » (pitää olla U+202F/U+00A0): "${s.slice(0, 60)}…"`);
    if (/« /.test(s)) err(where, 'fr: tavallinen välilyönti « jälkeen');
  }
  if (lang === 'es') {
    const q = (s.match(/\?/g) || []).length, iq = (s.match(/¿/g) || []).length;
    const e = (s.match(/!/g) || []).length, ie = (s.match(/¡/g) || []).length;
    if (q !== iq) err(where, `es: ? ja ¿ eivät ole pareina: "${s.slice(0, 60)}…"`);
    if (e !== ie) err(where, 'es: ! ja ¡ eivät ole pareina');
  }
  if (lang === 'ja' || lang === 'zh-CN') {
    if (/[\u3040-\u30ff\u4e00-\u9fff][?!,]/.test(s)) err(where, `${lang}: puolileveä ? ! tai , CJK-tekstissä: "${s.slice(0, 40)}…"`);
  }
}

// ── Lataus ja portti ────────────────────────────────────────────────────────
const ui = {};
for (const lang of LANGS) {
  const p = join(I18N_DIR, `${lang}.json`);
  if (!existsSync(p)) { err('i18n', `puuttuu ${lang}.json`); continue; }
  ui[lang] = readJson(p);
  const u = ui[lang];
  for (const k of ['section', 'nav']) if (!u[k]) err(`i18n/${lang}`, `kenttä ${k} puuttuu`);
  for (const k of ['seoTitle', 'description', 'h1', 'lead', 'aboutTitle', 'aboutText', 'allRoutes']) if (!u.index?.[k]) err(`i18n/${lang}`, `index.${k} puuttuu`);
  for (const k of ['home', 'readMore', 'published', 'updated', 'byline', 'sources', 'source', 'read', 'photo', 'latest', 'allNews', 'moreNews']) if (!u.ui?.[k]) err(`i18n/${lang}`, `ui.${k} puuttuu`);
  if (u.index) {
    if (len(u.index.seoTitle) > 60) err(`i18n/${lang}`, `index.seoTitle ${len(u.index.seoTitle)} > 60`);
    const d = len(u.index.description);
    if (d < 70 || d > 160) err(`i18n/${lang}`, `index.description ${d} merkkiä (pitää olla 70–160)`);
    for (const s of Object.values(u.index)) punctuation(`i18n/${lang}`, lang, s);
  }
}

const articles = [];
for (const slug of existsSync(ART_DIR) ? readdirSync(ART_DIR).sort() : []) {
  const dir = join(ART_DIR, slug);
  const metaPath = join(dir, 'meta.json');
  if (!existsSync(metaPath)) continue;
  const meta = readJson(metaPath);
  const where = `articles/${slug}`;
  if (meta.slug !== slug) err(where, `meta.slug "${meta.slug}" ≠ kansio`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) err(where, 'slug ei ole kebab-case');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date || '')) err(where, 'date ei ole YYYY-MM-DD');
  if (meta.updated && !/^\d{4}-\d{2}-\d{2}$/.test(meta.updated)) err(where, 'updated ei ole YYYY-MM-DD');
  for (const k of ['src', 'srcSmall']) {
    const f = meta.hero?.[k];
    if (!f || !existsSync(resolve(ROOT, 'public', f.replace(/^\//, '')))) err(where, `hero.${k} puuttuu public/-kansiosta: ${f}`);
  }
  for (const k of ['author', 'license', 'licenseUrl', 'sourceUrl', 'assetId', 'sourceName', 'retrieved']) if (!meta.hero?.credit?.[k]) err(where, `hero.credit.${k} puuttuu (lisenssikuitti)`);
  if (meta.ogCard && (!meta.ogCard.line || len(meta.ogCard.line) > 40)) err(where, `ogCard.line puuttuu tai yli 40 merkkiä (${len(meta.ogCard?.line ?? '')})`);
  if (!Array.isArray(meta.sources) || !meta.sources.length) err(where, 'lähteet puuttuvat');
  for (const s of meta.sources || []) if (!s.url || !s.publisher || !s.title || !(s.date || s.read)) err(where, `lähteestä puuttuu url/publisher/title/date|read: ${s.url}`);

  const texts = {};
  for (const lang of LANGS) {
    const p = join(dir, `${lang}.json`);
    if (!existsSync(p)) { err(where, `kielitiedosto puuttuu: ${lang}.json`); continue; }
    texts[lang] = readJson(p);
  }
  const en = texts.en;
  if (!en) continue;
  const enSig = (en.body || []).map(signature).join(' | ');
  const embedIds = new Set(Object.keys(meta.embeds || {}));
  for (const b of en.body || []) if (b.t === 'embed' && !embedIds.has(b.id)) err(where, `upotus "${b.id}" puuttuu meta.embeds:stä`);
  const enAll = new Set([
    ...['title', 'seoTitle', 'description', 'dek', 'heroAlt', 'heroCaption'].flatMap((k) => numbers(en[k] || '', 'en')),
    ...(en.body || []).flatMap((b) => blockStrings(b).flatMap((s) => numbers(s, 'en'))),
  ]);

  for (const lang of LANGS) {
    const t = texts[lang];
    if (!t) continue;
    const w = `${where}/${lang}`;
    for (const k of ['title', 'description', 'dek', 'heroAlt']) if (!t[k]) err(w, `kenttä ${k} puuttuu`);
    const seo = t.seoTitle || t.title || '';
    if (len(seo) > 60) err(w, `hakuotsikko ${len(seo)} > 60 merkkiä: "${seo}"`);
    const d = len(t.description);
    if (d < 70 || d > 160) err(w, `metakuvaus ${d} merkkiä (pitää olla 70–160)`);
    const sig = (t.body || []).map(signature).join(' | ');
    if (sig !== enSig) err(w, `rungon rakenne poikkeaa englannista:\n      en: ${enSig}\n      ${lang}: ${sig}`);

    // Otsikkotason kentät: ei lukua jota englanninkielisessä jutussa ei ole missään.
    for (const k of ['title', 'seoTitle', 'description', 'dek', 'heroAlt', 'heroCaption']) {
      if (!t[k]) continue;
      punctuation(`${w}.${k}`, lang, t[k]);
      if (lang === 'en') continue;
      for (const n of numbers(t[k], lang)) if (!enAll.has(n)) err(`${w}.${k}`, `luku ${n} ei esiinny englanninkielisessä jutussa: "${t[k]}"`);
    }
    // Runko lohkoittain: A) ei ylimääräisiä lukuja, B) englannin ≥10-luvut mukana.
    (t.body || []).forEach((b, i) => {
      const strs = blockStrings(b);
      strs.forEach((s) => punctuation(`${w}.body[${i}]`, lang, s));
      if (lang === 'en' || !en.body?.[i]) return;
      const mine = counts(strs.flatMap((s) => numbers(s, lang)));
      const theirs = counts(blockStrings(en.body[i]).flatMap((s) => numbers(s, 'en')));
      for (const [n, c] of mine) if (c > (theirs.get(n) || 0)) err(`${w}.body[${i}]`, `luku ${n} (${c}×) ei ole englannin vastinlohkossa (${theirs.get(n) || 0}×): "${strs.join(' ').slice(0, 90)}…"`);
      // ≥10-luvut (vuodet, päivät, määrät) myös yhtä MONTA kertaa: "17.9.2026" → "17.9." pudottaisi vuoden,
      // ja pelkkä läsnäolo ei huomaisi sitä kun sama vuosi esiintyy lohkossa toisaalla (negatiivitesti 18.9.).
      for (const [n, c] of theirs) if (n >= 10 && (mine.get(n) || 0) < c) err(`${w}.body[${i}]`, `englannin luku ${n} puuttuu (${mine.get(n) || 0}/${c}×): "${strs.join(' ').slice(0, 90)}…"`);
    });
  }
  articles.push({ slug, meta, texts });
}

if (errors.length) {
  console.error(`\n[news] PORTTI KAATUI — ${errors.length} virhettä:`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
}
articles.sort((a, b) => b.meta.date.localeCompare(a.meta.date) || a.slug.localeCompare(b.slug));
console.log(`[news] portti OK — ${articles.length} juttua × ${LANGS.length} kieltä, i18n ${Object.keys(ui).length}/${LANGS.length}`);
if (CHECK) process.exit(0);

// ── 5. Ryömittävän rungon tekstit ─────────────────────────────────────────────
rmSync(CACHE, { recursive: true, force: true });
for (const a of articles) {
  for (const lang of LANGS) {
    const t = a.texts[lang];
    const parts = [t.dek, ...(t.body || []).flatMap((b) => (b.t === 'embed' ? [b.title, b.text] : blockStrings(b).filter((s) => !s.startsWith('/')))).filter(Boolean)];
    const dir = join(CACHE, a.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${lang}.json`), JSON.stringify(parts, null, 1), 'utf-8');
  }
}
mkdirSync(join(CACHE, '_index'), { recursive: true });
for (const lang of LANGS) {
  const u = ui[lang];
  const cards = articles.flatMap((a) => [a.texts[lang].title, a.texts[lang].dek]);
  writeFileSync(join(CACHE, '_index', `${lang}.json`), JSON.stringify([u.index.lead, ...cards, u.index.aboutText], null, 1), 'utf-8');
}
const rel = (p) => p.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');

// ── 2. routes.json ────────────────────────────────────────────────────────────
const routesPath = resolve(ROOT, 'scripts/routes.json');
const routes = readJson(routesPath).filter((r) => r.path !== SECTION && !r.path.startsWith(`${SECTION}/`));
const newest = articles[0];
routes.push({
  path: SECTION,
  fallbackTitle: ui.en.index.seoTitle,
  fallbackDescription: ui.en.index.description,
  ...(newest ? (newest.meta.ogCard
    ? { ogImage: `/og/news.jpg`, ogCard: { hero: newest.meta.hero.src, line: newest.meta.ogCard.line } }
    : { ogImage: newest.meta.hero.src }) : {}),
  harvestRecord: { file: `${rel(join(CACHE, '_index'))}/{lang}.json`, key: 'news', mode: 'jsonFile' },
});
for (const a of articles) {
  routes.push({
    path: `${SECTION}/${a.slug}`,
    fallbackTitle: a.texts.en.seoTitle || a.texts.en.title,
    fallbackDescription: a.texts.en.description,
    ...(a.meta.ogCard
      ? { ogImage: `/og/news-${a.slug}.jpg`, ogCard: { hero: a.meta.hero.src, line: a.meta.ogCard.line } }
      : { ogImage: a.meta.hero.src }),
    harvestRecord: { file: `${rel(join(CACHE, a.slug))}/{lang}.json`, key: a.slug, mode: 'jsonFile' },
  });
}
writeFileSync(routesPath, JSON.stringify(routes, null, 2) + '\n', 'utf-8');

// ── 3. prerender-meta.json ────────────────────────────────────────────────────
// No brand suffix since 2026-09-22, same as src/lib/seo.ts.
const withSiteName = (title) => title;
const metaPath = resolve(ROOT, 'scripts/prerender-meta.json');
const metaMap = existsSync(metaPath) ? readJson(metaPath) : {};
for (const k of Object.keys(metaMap)) if (k === SECTION || k.startsWith(`${SECTION}/`)) delete metaMap[k];
metaMap[SECTION] = Object.fromEntries(LANGS.map((lang) => [lang, { title: withSiteName(ui[lang].index.seoTitle), description: ui[lang].index.description }]));
for (const a of articles) {
  metaMap[`${SECTION}/${a.slug}`] = Object.fromEntries(LANGS.map((lang) => {
    const t = a.texts[lang];
    return [lang, { title: withSiteName(t.seoTitle || t.title), description: t.description }];
  }));
}
const sorted = Object.fromEntries(Object.keys(metaMap).sort().map((k) => [k, metaMap[k]]));
writeFileSync(metaPath, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');

// ── 4. sitemap.xml ────────────────────────────────────────────────────────────
const href = (prefix, p) => `${SITE}${prefix}${p}`.replace(/\/?$/, '/');
function urlBlock(p, lastmod, changefreq, priority) {
  return LOCALES.map((L) => {
    const alts = LOCALES.flatMap((A) => (Array.isArray(A.hreflang) ? A.hreflang : [A.hreflang])
      .map((code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${href(A.prefix, p)}" />`)).join('\n');
    return `  <url>\n    <loc>${href(L.prefix, p)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${href('', p)}" />\n  </url>`;
  }).join('\n');
}
const blocks = [
  urlBlock(SECTION, newest ? (newest.meta.updated || newest.meta.date) : new Date().toISOString().slice(0, 10), 'weekly', '0.7'),
  ...articles.map((a) => urlBlock(`${SECTION}/${a.slug}`, a.meta.updated || a.meta.date, 'monthly', '0.6')),
].join('\n');
const newsLoc = new RegExp(`<loc>${SITE.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}(?:/[a-z]{2})?${SECTION}(?:/[^<]*)?</loc>`);
let sitemapCount = 0;
for (const file of NO_SITEMAP ? [] : [resolve(ROOT, 'public/sitemap.xml'), resolve(ROOT, 'dist/sitemap.xml')]) {
  if (!existsSync(file)) continue;
  let xml = readFileSync(file, 'utf-8');
  xml = xml.replace(/\s*<url>[\s\S]*?<\/url>/g, (m) => (newsLoc.test(m) ? '' : m));
  xml = xml.replace(/\n?<\/urlset>\s*$/, `\n${blocks}\n</urlset>\n`);
  writeFileSync(file, xml, 'utf-8');
  sitemapCount++;
}
console.log(`[news] reitit ${1 + articles.length} (× ${LANGS.length} kieltä) → routes.json + prerender-meta.json · sivukartta ${NO_SITEMAP ? 'gen-sitemap.mjs' : `${sitemapCount} tiedostoa`}`);
