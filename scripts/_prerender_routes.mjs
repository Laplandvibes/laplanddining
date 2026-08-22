/**
 * Universal per-route prerender for LV SPA sites.
 *
 * Goal: fix "Discovered but not indexed" — Googlebot fetches the shell, sees
 * identical <title>/canonical for every route, and dedupes them. By writing a
 * per-route static HTML file with route-specific <title>, <meta description>,
 * <link rel="canonical">, hreflang, og:* etc. baked in, every URL ships unique
 * SEO at first byte. React still hydrates as before — we keep <div id="root">
 * empty.
 *
 * Inputs (per site, passed via CLI args):
 *   --site=https://laplandhoteldeals.com    canonical origin (no trailing /)
 *   --siteName="LaplandHotelDeals"          for og:site_name
 *   --twitter="@laplandvibes"               twitter site handle
 *   --defaultOg="/og-default.jpg"           OG image path (or absolute URL)
 *   --routes=routes.json                    JSON file listing routes (see below)
 *   --locales=en,fi,de                      (optional) override locale list,
 *                                           comma-separated — for single-locale
 *                                           or 3-locale sites (ski, default 11)
 *   --source=auto|meta|per-lang|nested|json|page-inline
 *                                           (optional) force a specific reader.
 *                                           Default "auto" tries readers in
 *                                           preference order.
 *   --meta=scripts/prerender-meta.json      (optional) pre-generated meta map:
 *                                           { "<path>": { "<lang>": { "title", "description" } } }
 *                                           Tried FIRST in auto order. Lang codes match
 *                                           the `lang` field below (en, fi, …, pt-BR, zh-CN).
 *                                           Lets a site supply per-route × per-locale meta
 *                                           computed by its own generator (e.g. transport's
 *                                           scripts/generate-prerender-meta.mjs). Missing
 *                                           file/route/lang falls through to other readers.
 *
 * routes.json schema:
 *   [
 *     { "path": "/hotels",          "copyKey": "hotels" },
 *     // ↑ for per-lang copy.{lang}.ts AND nested COPY = { en: {…} } AND ski/visit:
 *     //   copyKey resolves to `pages.{copyKey}.metaTitle` etc.
 *
 *     { "path": "/safari-companies","jsonKey": "safariCompanies" },
 *     // ↑ for JSON locales (husky): reads
 *     //   src/locales/{lang}/pages.json → {jsonKey}.title / .description
 *     //   You can also use "jsonKey": "common.foo.bar" → reads common.json
 *
 *     { "path": "/destinations/levi", "pageFile": "src/pages/Levi.tsx" },
 *     // ↑ for per-page inline pattern (stays): regex-extracts
 *     //   seoTitle/seoDescription from each `const <lang>: ...` block in the file.
 *
 *     { "path": "/about", "copyFile": "src/pages/About.copy.{lang}.ts" },
 *     // ↑ for per-page per-lang copy files (stays): reads
 *     //   src/pages/About.copy.{lang}.ts → seo.title / seo.description
 *     //   {lang} placeholder is replaced with copy file lang ident (e.g. ptBR, zhCN).
 *
 *     { "path": "/privacy",          "copyKey": null,
 *       "fallbackTitle": "Privacy | LaplandHoteldeals" }
 *     // ↑ no per-route copy — use fallbackTitle (and optional fallbackDescription)
 *   ]
 *
 * Idempotent. Safe to re-run after vite build.
 *
 * Run from the site's root directory:
 *   node ../_prerender_routes.mjs \
 *     --site=https://laplandhoteldeals.com \
 *     --siteName=LaplandHotelDeals \
 *     --twitter=@laplandvibes \
 *     --defaultOg=/og-default.jpg \
 *     --routes=scripts/routes.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import {
  readFooterNetwork,
  buildCrawlableBody,
  stripCrawlableBody,
  injectCrawlableBody,
} from './_prerender_crawlable_body.mjs';

const CWD = process.cwd();
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
  })
);

const SITE = (args.site || '').replace(/\/$/, '');
if (!SITE) {
  console.error('[prerender] --site=https://example.com required');
  process.exit(1);
}
const SITE_NAME = args.siteName || 'LaplandVibes';
const TWITTER = args.twitter || '@laplandvibes';
const DEFAULT_OG = args.defaultOg || '/og-default.jpg';
const ROUTES_FILE = resolve(CWD, args.routes || 'scripts/routes.json');
const FORCE_SOURCE = args.source || 'auto';

// Optional pre-generated meta map (--meta). Absent/invalid → empty map, which
// makes the 'meta' reader a no-op and preserves behavior for all other sites.
let META_MAP = {};
if (args.meta && typeof args.meta === 'string') {
  const metaFile = resolve(CWD, args.meta);
  if (existsSync(metaFile)) {
    try {
      META_MAP = JSON.parse(readFileSync(metaFile, 'utf-8'));
    } catch (e) {
      console.warn(`[prerender] WARN: could not parse --meta file ${metaFile}: ${e.message}`);
    }
  } else {
    console.warn(`[prerender] WARN: --meta file missing at ${metaFile} — falling back to other readers`);
  }
}

const DIST = resolve(CWD, 'dist');
const LOCALES = resolve(CWD, 'src', 'locales');

if (!existsSync(resolve(DIST, 'index.html'))) {
  console.error(`[prerender] dist/index.html missing in ${CWD} — run vite build first`);
  process.exit(1);
}
if (!existsSync(ROUTES_FILE)) {
  console.error(`[prerender] routes manifest missing at ${ROUTES_FILE}`);
  process.exit(1);
}

// The shell is read from dist/index.html — which this script also OVERWRITES for
// the EN home route. Without the strip below, a second run (or a second
// prerenderer chained after this one, as on laplandskiresorts) reads a shell that
// already contains the previous run's home-page block, the "#root is empty" regex
// stops matching, and every route silently inherits the HOME page's h1/description/nav.
// Stripping makes the script genuinely idempotent, as its docs claim.
const SHELL = stripCrawlableBody(readFileSync(resolve(DIST, 'index.html'), 'utf-8'));

// Extract the runtime LV-LOCALE-TITLE map (`var T = {…}`) baked into the shell by
// scripts/inject_locale_titles.mjs — it holds the localized HOME/site title per
// locale. Reused as a static per-locale <title>/og:title for the HOME route on
// sites whose routes.json has only an English fallbackTitle (otherwise /fi /de
// /ja … would ship an English static title — bad for social shares + crawl).
let SHELL_TITLE_MAP = null;
try {
  const tm = SHELL.match(/var\s+T\s*=\s*(\{[\s\S]*?\})\s*;/);
  if (tm) SHELL_TITLE_MAP = JSON.parse(tm[1]);
} catch { SHELL_TITLE_MAP = null; }
// loc.lang → short code used as a key in the shell T map.
const SHELL_TITLE_KEY = { en: 'en', fi: 'fi', de: 'de', ja: 'ja', es: 'es', 'pt-BR': 'pt-br', 'zh-CN': 'zh-cn', ko: 'kr', fr: 'fr', it: 'it', nl: 'nl', sv: 'sv' };
const routes = JSON.parse(readFileSync(ROUTES_FILE, 'utf-8'));

// Locale config — keep in sync with src/components/SEO.tsx PATH_PREFIX/BCP47/OG_LOCALE
// `file` is the per-lang `copy.{file}.ts` filename (legacy reader);
// `ident` is the identifier used inside a monolithic copy.ts (e.g. `const ptBR: ...`);
// `jsonDir` is the per-lang JSON folder under src/locales/{jsonDir}/.
const FULL_LOCALE_LIST = [
  { lang: 'en',    prefix: '',    bcp47: 'en-US', og: 'en_US', file: 'copy.en.ts',   ident: 'en',   jsonDir: 'en'    },
  { lang: 'fi',    prefix: '/fi', bcp47: 'fi-FI', og: 'fi_FI', file: 'copy.fi.ts',   ident: 'fi',   jsonDir: 'fi'    },
  { lang: 'de',    prefix: '/de', bcp47: 'de-DE', og: 'de_DE', file: 'copy.de.ts',   ident: 'de',   jsonDir: 'de'    },
  { lang: 'ja',    prefix: '/ja', bcp47: 'ja-JP', og: 'ja_JP', file: 'copy.ja.ts',   ident: 'ja',   jsonDir: 'ja'    },
  { lang: 'es',    prefix: '/es', bcp47: 'es-ES', og: 'es_ES', file: 'copy.es.ts',   ident: 'es',   jsonDir: 'es'    },
  { lang: 'pt-BR', prefix: '/br', bcp47: 'pt-BR', og: 'pt_BR', file: 'copy.ptBR.ts', ident: 'ptBR', jsonDir: 'pt-BR' },
  { lang: 'zh-CN', prefix: '/cn', bcp47: 'zh-CN', og: 'zh_CN', file: 'copy.zhCN.ts', ident: 'zhCN', jsonDir: 'zh-CN' },
  { lang: 'ko',    prefix: '/kr', bcp47: 'ko-KR', og: 'ko_KR', file: 'copy.ko.ts',   ident: 'ko',   jsonDir: 'ko'    },
  { lang: 'fr',    prefix: '/fr', bcp47: 'fr-FR', og: 'fr_FR', file: 'copy.fr.ts',   ident: 'fr',   jsonDir: 'fr'    },
  { lang: 'it',    prefix: '/it', bcp47: 'it-IT', og: 'it_IT', file: 'copy.it.ts',   ident: 'it',   jsonDir: 'it'    },
  { lang: 'nl',    prefix: '/nl', bcp47: 'nl-NL', og: 'nl_NL', file: 'copy.nl.ts',   ident: 'nl',   jsonDir: 'nl'    },
];

// Opt-in extra locales (e.g. --addLocales=sv). Kept OUT of FULL_LOCALE_LIST so
// sites without translated copy never emit EN-fallback pages at /sv URLs.
const EXTRA_LOCALES = {
  sv: { lang: 'sv', prefix: '/sv', bcp47: 'sv-SE', og: 'sv_SE', file: 'copy.sv.ts', ident: 'sv', jsonDir: 'sv' },
};
if (args.addLocales) {
  for (const key of args.addLocales.split(',').map((s) => s.trim())) {
    if (EXTRA_LOCALES[key] && !FULL_LOCALE_LIST.some((l) => l.lang === key)) {
      FULL_LOCALE_LIST.push(EXTRA_LOCALES[key]);
    }
  }
}

const LOCALE_FILTER = args.locales
  ? new Set(args.locales.split(',').map((s) => s.trim()))
  : null;
const LOCALE_LIST = LOCALE_FILTER
  ? FULL_LOCALE_LIST.filter((l) => LOCALE_FILTER.has(l.lang))
  : FULL_LOCALE_LIST;

// ---------- shared helpers ----------
function unescapeJsString(s) {
  return s
    .replace(/\\n/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\`/g, '`')
    .replace(/\\\\/g, '\\')
    .replace(/\s+/g, ' ')
    .trim();
}

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Walk braces from the first `{` after openIdx, return inner slice. */
function sliceBlock(src, openIdx) {
  let depth = 0, start = -1, end = -1;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (c === '{') { if (depth === 0) start = i + 1; depth++; }
    else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (start < 0 || end < 0) return null;
  return src.slice(start, end);
}

/** Find ALL `<key>: { … }` blocks in src, return list of inner slices. */
function findKeyBlocks(src, key) {
  const re = new RegExp(`(?:["']${key.replace(/[-/]/g, '\\$&')}["']|\\b${key}\\b)\\s*:\\s*\\{`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const inner = sliceBlock(src, m.index + m[0].length - 1);
    if (inner != null) out.push(inner);
  }
  return out;
}

/** Match `<key>: { … }` blocks recursively respecting strings + braces. Returns FIRST. */
function findKeyBlock(src, key) {
  const blocks = findKeyBlocks(src, key);
  return blocks[0] || null;
}

/** Find the first block matching key that ALSO contains a title-like field. */
function findKeyBlockWithMeta(src, key) {
  const blocks = findKeyBlocks(src, key);
  for (const b of blocks) {
    if (
      /seoTitle\s*:/.test(b) ||
      /metaTitle\s*:/.test(b) ||
      /["']title["']\s*:/.test(b) ||
      /(?:^|[\s,{])title\s*:/.test(b) ||
      /heroH1\s*:/.test(b)
    ) {
      return b;
    }
  }
  return blocks[0] || null;
}

function pickTD(block) {
  if (!block) return null;
  const tMatch =
    block.match(/seoTitle\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s) ||
    block.match(/metaTitle\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s) ||
    block.match(/["']title["']\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s) ||
    // unquoted `title:` (TS shorthand JSON, stays *.copy.{lang}.ts).
    block.match(/(?:^|[\s,{])title\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s) ||
    // visit-style fallback: use heroH1 as title when no seo/meta is present.
    block.match(/heroH1\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s);
  const dMatch =
    block.match(/seoDescription\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s) ||
    block.match(/seoDesc\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s) ||
    block.match(/metaDescription\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s) ||
    block.match(/["']description["']\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s) ||
    block.match(/(?:^|[\s,{])description\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s) ||
    block.match(/heroLead\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/s);
  if (!tMatch && !dMatch) return null;
  // tMatch may have 2 or 3 captures depending on the regex - find the title group.
  const t = tMatch ? (tMatch[2] ?? tMatch[1]) : null;
  const d = dMatch ? (dMatch[2] ?? dMatch[1]) : null;
  return {
    title: t ? unescapeJsString(t) : null,
    description: d ? unescapeJsString(d) : null,
  };
}

// ---------- READER 1: per-lang copy.{lang}.ts (original) ----------
const perLangSources = {};
for (const loc of LOCALE_LIST) {
  const fp = resolve(LOCALES, loc.file);
  let src = existsSync(fp) ? readFileSync(fp, 'utf-8') : '';
  // 🔴 Some sites keep the locale file as a thin re-export and the real text in
  // an overrides file beside it: laplandnature's copy.sv.ts is 232 bytes,
  // `deepMerge(en, SV_OVERRIDES)`, while overrides.sv.ts holds 80+ kB of
  // Swedish. Readers that looked only at the stub harvested nothing for eight
  // of twelve locales. Both files are the SAME locale, so appending cannot leak
  // another language in, and duplicate strings are dropped by harvestKeep.
  const ovr = resolve(LOCALES, loc.file.replace(/^copy\./, 'overrides.'));
  if (ovr !== fp && existsSync(ovr)) src += '\n' + readFileSync(ovr, 'utf-8');
  if (src) perLangSources[loc.lang] = src;
}

function readPerLangCopy(loc, copyKey) {
  if (!copyKey) return null;
  const src = perLangSources[loc.lang];
  if (!src) return null;
  let block = findKeyBlockWithMeta(src, copyKey);
  return pickTD(block);
}

// ---------- READER 2: monolithic copy.ts (nested per-lang blocks) ----------
const COPY_TS_PATH = resolve(LOCALES, 'copy.ts');
const monolithicSrc = existsSync(COPY_TS_PATH) ? readFileSync(COPY_TS_PATH, 'utf-8') : null;

/** For monolithic copy.ts:
 *  - First try `const <ident>: ...` top-level blocks (ski, visit).
 *  - Then try nested `<ident>: {` blocks (older sites).
 *  Return the inner slice for the language's block, or null.
 */
function getLangBlockInMonolithic(loc) {
  if (!monolithicSrc) return null;
  // Top-level: `const ptBR: SectionCopy = {`
  const reConst = new RegExp(`\\bconst\\s+${loc.ident}\\b\\s*(?::[^=]+)?=\\s*\\{`, 'g');
  const m1 = reConst.exec(monolithicSrc);
  if (m1) {
    const inner = sliceBlock(monolithicSrc, m1.index + m1[0].length - 1);
    if (inner) return inner;
  }
  // Nested: `'pt-BR': {` or `ptBR: {`
  const candidates = [loc.lang, loc.ident];
  for (const k of candidates) {
    const inner = findKeyBlock(monolithicSrc, k);
    if (inner) return inner;
  }
  return null;
}

function readMonolithicCopy(loc, copyKey) {
  if (!copyKey || !monolithicSrc) return null;
  const langBlock = getLangBlockInMonolithic(loc);
  if (!langBlock) return null;
  const parts = copyKey.split('.');
  let cursor = langBlock;
  for (const part of parts) {
    const found = findKeyBlockWithMeta(cursor, part);
    if (!found) {
      cursor = null;
      break;
    }
    cursor = found;
  }
  if (cursor) {
    const td = pickTD(cursor);
    if (td) return td;
  }
  // Fallback: search the final key directly inside the language block.
  const directBlock = findKeyBlockWithMeta(langBlock, parts[parts.length - 1]);
  return pickTD(directBlock);
}

// ---------- READER 3: JSON locales (husky pattern) ----------
function readJsonLocale(loc, jsonKey) {
  if (!jsonKey) return null;
  const dir = resolve(LOCALES, loc.jsonDir);
  if (!existsSync(dir)) return null;
  // Parse "file.path.to.key" — first segment is the JSON filename
  // (without .json), the rest is a nested key path. If no dot, default to
  // pages.json for back-compat.
  const parts = jsonKey.split('.');
  let file, keyPath;
  if (parts.length === 1) {
    file = 'pages';
    keyPath = parts;
  } else {
    file = parts[0];
    keyPath = parts.slice(1);
  }
  const fp = resolve(dir, `${file}.json`);
  if (!existsSync(fp)) {
    // Try the inverse: maybe the first segment is a key in pages.json.
    const altFp = resolve(dir, 'pages.json');
    if (!existsSync(altFp)) return null;
    try {
      const data = JSON.parse(readFileSync(altFp, 'utf-8'));
      let cursor = data;
      for (const p of parts) cursor = cursor?.[p];
      if (cursor && (cursor.title || cursor.description)) {
        return { title: cursor.title || null, description: cursor.description || null };
      }
    } catch { /* ignore */ }
    return null;
  }
  try {
    const data = JSON.parse(readFileSync(fp, 'utf-8'));
    let cursor = data;
    for (const p of keyPath) cursor = cursor?.[p];
    if (cursor && (cursor.title || cursor.description)) {
      return { title: cursor.title || null, description: cursor.description || null };
    }
  } catch { /* ignore */ }
  return null;
}

// ---------- READER 4: per-page inline COPY (stays city pages) ----------
const inlinePageCache = new Map();
function readPageInline(loc, pageFile) {
  if (!pageFile) return null;
  const fp = resolve(CWD, pageFile);
  if (!existsSync(fp)) return null;
  let src;
  if (inlinePageCache.has(fp)) src = inlinePageCache.get(fp);
  else {
    src = readFileSync(fp, 'utf-8');
    inlinePageCache.set(fp, src);
  }
  // Locate `const <ident>: ...` block for the locale.
  const reConst = new RegExp(`\\bconst\\s+${loc.ident}\\b\\s*(?::[^=]+)?=\\s*\\{`, 'g');
  const m = reConst.exec(src);
  if (!m) return null;
  const inner = sliceBlock(src, m.index + m[0].length - 1);
  if (!inner) return null;
  return pickTD(inner);
}

// ---------- READER 5: per-page per-lang copy file (stays About/Home/etc.) ----------
function readPerPageCopyFile(loc, copyFileTpl) {
  if (!copyFileTpl) return null;
  // copyFileTpl is like "src/pages/About.copy.{lang}.ts" — replace {lang}.
  const filename = copyFileTpl.replace('{lang}', loc.ident);
  const fp = resolve(CWD, filename);
  if (!existsSync(fp)) return null;
  const src = readFileSync(fp, 'utf-8');
  // Find `"seo": { ... }` or `seo: { ... }` block.
  const seoBlock = findKeyBlockWithMeta(src, 'seo');
  return pickTD(seoBlock);
}

// ---------- READER 0: pre-generated meta map (--meta, e.g. transport) ----------
function readMetaMap(loc, route) {
  const entry = META_MAP[route.path];
  const m = entry && entry[loc.lang];
  if (!m || (!m.title && !m.description)) return null;
  return { title: m.title || null, description: m.description || null };
}

/**
 * Optional FAQ for a route/locale from the --meta map. Returns an array of
 * { q, a } or null. Only sites whose meta generator emits a `faq` array (e.g.
 * laplandnature) produce this; every other site's map has no `faq` key, so this
 * is a no-op for them and the prerendered output is byte-identical to before.
 */
function readFaqFromMeta(loc, route) {
  const entry = META_MAP[route.path];
  const m = entry && entry[loc.lang];
  const faq = m && Array.isArray(m.faq) ? m.faq : null;
  if (!faq || !faq.length) return null;
  const items = faq.filter((it) => it && typeof it.q === 'string' && typeof it.a === 'string');
  return items.length ? items : null;
}

// ---------- meta resolver: try all configured sources in preference order ----------
function resolveRouteMeta(loc, route) {
  const order = FORCE_SOURCE === 'auto'
    ? ['meta', 'copyFile', 'per-lang', 'nested', 'json', 'page-inline']
    : [FORCE_SOURCE];

  for (const src of order) {
    let meta = null;
    if (src === 'meta') {
      meta = readMetaMap(loc, route);
    } else if (src === 'copyFile' && route.copyFile) {
      meta = readPerPageCopyFile(loc, route.copyFile);
    } else if (src === 'per-lang' && route.copyKey) {
      meta = readPerLangCopy(loc, route.copyKey);
    } else if (src === 'nested' && route.copyKey) {
      meta = readMonolithicCopy(loc, route.copyKey);
    } else if (src === 'json' && route.jsonKey) {
      meta = readJsonLocale(loc, route.jsonKey);
    } else if (src === 'page-inline' && route.pageFile) {
      meta = readPageInline(loc, route.pageFile);
    }
    if (meta && (meta.title || meta.description)) return meta;
  }
  return null;
}

/**
 * Resolve {title, description} for ONE route × locale, plus whether the title
 * came from a locale-specific source.
 *
 * Extracted from the render loop so the --crawlableBody pre-pass can build its
 * internal anchor texts from the SAME cascade the page itself uses. A second
 * copy of this logic would drift, and drifting copies of prerender logic are
 * exactly what this codebase has already paid for (the two forked prerenderers).
 *
 * Safe to call twice for the same route/locale: every reader returns a FRESH
 * object literal, so nothing here mutates shared state between passes.
 */
function resolveLocaleMeta(route, loc, enMeta) {
  let meta = resolveRouteMeta(loc, route);
  let localizedTitle = !!(meta && meta.title);
  // Per-locale fallbacks BEFORE English: (1) explicit routes.json
  // fallbackTitleByLang/fallbackDescriptionByLang; (2) for the HOME route, the
  // localized title from the shell's LV-LOCALE-TITLE map. Keeps a native
  // <title>/og:title at first byte for every locale instead of English.
  if (!meta || !meta.title) {
    const tByLang = route.fallbackTitleByLang && route.fallbackTitleByLang[loc.lang];
    const dByLang = route.fallbackDescriptionByLang && route.fallbackDescriptionByLang[loc.lang];
    if (tByLang) {
      meta = { title: tByLang, description: dByLang || (meta && meta.description) || null };
      localizedTitle = true;
    } else if (route.path === '/' && SHELL_TITLE_MAP) {
      const st = SHELL_TITLE_MAP[SHELL_TITLE_KEY[loc.lang]];
      if (st) { meta = { title: st, description: (meta && meta.description) || null }; localizedTitle = true; }
    }
  }
  if (!meta || !meta.title) {
    meta = { title: enMeta.title, description: meta?.description || enMeta.description };
  }
  if (!meta.description) {
    const dByLang = route.fallbackDescriptionByLang && route.fallbackDescriptionByLang[loc.lang];
    meta.description = dByLang || enMeta.description;
  }
  // If the title doesn't already include site name, append it. Detect
  // pre-existing site name via case-insensitive substring of SITE_NAME or
  // a clear " | " / " — " separator with a brand-shaped word on the right.
  if (
    route.appendSiteName &&
    meta.title &&
    !meta.title.toLowerCase().includes(SITE_NAME.toLowerCase()) &&
    !/\s[|—]\s/.test(meta.title)
  ) {
    meta.title = `${meta.title} | ${SITE_NAME}`;
  }
  return { meta, localizedTitle };
}

/** URL a route×locale actually resolves to — same construction the page's own canonical uses. */
function routeUrl(route, loc) {
  const cleanPath = route.path === '/' ? '' : route.path;
  const cLoc = route.canonicalLocale
    ? (LOCALE_LIST.find((l) => l.lang === route.canonicalLocale) || loc)
    : loc;
  return `${SITE}${cLoc.prefix}${cleanPath}`.replace(/\/?$/, '/');
}

// ---------- crawlable-body text harvest (--crawlableBody) ----------
// Collect the route's OWN localized copy strings — the same text React renders
// after hydration — so the pre-hydration block carries real page content, not
// only title+description+anchors. Measured 2026-08-21 over all 9,491 network
// pages: the block alone lands at 80–245 words ⇒ ~3,100 pages under the
// ~250-word thin-content line, while the four sites whose prerender already
// carries body text (hub/gifts/transport/weddings) sit at 0 thin pages.
//
// SAME-LOCALE ONLY: a non-EN route whose copy source lacks that language gets
// NOTHING here rather than English text — EN paragraphs on a /fi/ URL is
// wrong-language content the network has already paid for (blog root 18.8.).
// Fail-open everywhere: any parse problem yields fewer paragraphs, never a
// broken build. Routes may opt into extra source blocks via routes.json
// "harvestKeys": ["hero", "intro"] when their own copy block is meta-only.
const HARVEST_SKIP_KEY_RE = /(aria|alt$|alt[A-Z]|cta|button|label|placeholder|img|image|icon|logo|photo|src|href|url|link|badge|eyebrow|kicker|watching|scroll|consent|cookie[A-Z]|menu|^nav$|nav[A-Z]|search|lang|switch|toggle|price|amount|date|meta[A-Z]|seo)/i;

function harvestKeep(value, meta, seen) {
  if (typeof value !== 'string') return null;
  const v = value.replace(/\s+/g, ' ').trim();
  if (!v || seen.has(v)) return null;
  if (v.includes('{') || v.includes('}')) return null; // runtime placeholders would render raw
  if (/^(https?:)?\//.test(v) || /^[\w.+-]+@[\w.-]+$/.test(v)) return null; // paths, URLs, emails
  if (/^[\d\s€$£%+.,;:–—-]+$/.test(v)) return null; // bare numbers/prices
  const cjk = (v.match(/[぀-ヿ㐀-䶿一-鿿가-힯]/g) || []).length;
  const minLen = cjk > v.length * 0.3 ? 18 : 40;
  if (v.length < minLen) return null;
  if (meta && (v === meta.title || v === meta.description)) return null; // already in the block
  seen.add(v);
  return v;
}

function harvestFromObject(node, out, meta, seen, budget) {
  if (!node || budget.words <= 0) return;
  if (Array.isArray(node)) {
    for (const it of node) {
      if (budget.words <= 0) return;
      if (typeof it === 'string') {
        const kept = harvestKeep(it, meta, seen);
        if (kept) { out.push(kept); budget.words -= kept.split(/\s+/).length; }
      } else harvestFromObject(it, out, meta, seen, budget);
    }
    return;
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (budget.words <= 0) return;
      if (HARVEST_SKIP_KEY_RE.test(k)) continue;
      if (typeof v === 'string') {
        const kept = harvestKeep(v, meta, seen);
        if (kept) { out.push(kept); budget.words -= kept.split(/\s+/).length; }
      } else harvestFromObject(v, out, meta, seen, budget);
    }
  }
}

function harvestFromTsBlock(block, out, meta, seen, budget) {
  if (!block || budget.words <= 0) return;
  // 🔴 The key may be QUOTED. Half the network's copy files are auto-generated
  // JSON-style (`"metaTitle": "…"`, laplandkids' header says so in line 1), and
  // a bare `(\w+)\s*:` never matches those — the closing quote sits between the
  // key and the colon. Measured 2026-08-22 on laplandkids: the 47 000-character
  // `pages.destinations` block yielded ZERO strings while the same content in
  // an unquoted file yielded thousands of words. The build looked healthy
  // ("harvest: 48 pages with body copy"), just with most routes silently empty.
  const kvRe = /["']?(\w+)["']?\s*:\s*(['"`])((?:\\.|(?!\2).)*)\2/g;
  let m;
  while ((m = kvRe.exec(block)) !== null && budget.words > 0) {
    if (HARVEST_SKIP_KEY_RE.test(m[1])) continue;
    const kept = harvestKeep(unescapeJsString(m[3]), meta, seen);
    if (kept) { out.push(kept); budget.words -= kept.split(/\s+/).length; }
  }
  // 🔴 The kv regex above needs a `key:` in front of every string, so a BARE
  // STRING ARRAY yields nothing at all. laplandluxuryvillas keeps every villa
  // and destination paragraph in `copy: ['…','…']` and `signature: [...]`, so
  // its records harvested the one-line tagline and stopped — 8 villa routes ×
  // 5 locales sat on the shell word count (own crawl 2026-08-23).
  // Objects INSIDE an array were never the problem: the kv scan is linear and
  // does not care about nesting, so `[{ title: '…' }]` already matched. Only
  // key-less strings were invisible.
  const arrRe = /["']?(\w+)["']?\s*:\s*\[/g;
  let am;
  while ((am = arrRe.exec(block)) !== null && budget.words > 0) {
    if (HARVEST_SKIP_KEY_RE.test(am[1])) continue;
    const chunk = sliceArray(block, arrRe.lastIndex - 1);
    if (!chunk) continue;
    // `(?<![:\w])` keeps this off the values the kv pass already took.
    const strRe = /(?<![:\w])(['"`])((?:\\.|(?!\1).)*)\1/g;
    let sm;
    while ((sm = strRe.exec(chunk)) !== null && budget.words > 0) {
      const kept = harvestKeep(unescapeJsString(sm[2]), meta, seen);
      if (kept) { out.push(kept); budget.words -= kept.split(/\s+/).length; }
    }
  }
}

/** Slice the balanced [ … ] starting at openIdx. Same fail-open contract as
 *  sliceBlock: an imbalance yields null and the caller harvests nothing. */
function sliceArray(src, openIdx) {
  let depth = 0, start = -1;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (c === '[') { if (depth === 0) start = i + 1; depth++; }
    else if (c === ']') { depth--; if (depth === 0) return start < 0 ? null : src.slice(start, i); }
  }
  return null;
}

/** JSON-locale subtree for a jsonKey — same file/keyPath logic as readJsonLocale. */
const harvestJsonCache = new Map();
function readJsonSubtree(loc, jsonKey) {
  const dir = resolve(LOCALES, loc.jsonDir);
  if (!existsSync(dir)) return null;
  const parts = jsonKey.split('.');
  const tryPaths = parts.length === 1
    ? [['pages', parts]]
    : [[parts[0], parts.slice(1)], ['pages', parts]];
  for (const [file, keyPath] of tryPaths) {
    const fp = resolve(dir, `${file}.json`);
    if (!existsSync(fp)) continue;
    try {
      let data = harvestJsonCache.get(fp);
      if (!data) { data = JSON.parse(readFileSync(fp, 'utf-8')); harvestJsonCache.set(fp, data); }
      let cursor = data;
      for (const p of keyPath) cursor = cursor?.[p];
      if (cursor) return cursor;
    } catch { /* fail open */ }
  }
  return null;
}

function harvestRouteText(loc, route, meta) {
  const out = [];
  const seen = new Set();
  const budget = { words: 700 };
  try {
    // Curated FAQ first (same locale ONLY — the JSON-LD EN fallback is fine for
    // structured data, but visible EN text on a non-EN URL is not).
    const faq = readFaqFromMeta(loc, route);
    if (faq) {
      for (const it of faq) {
        if (budget.words <= 0) break;
        const kept = harvestKeep(`${it.q} ${it.a}`, meta, seen);
        if (kept) { out.push(kept); budget.words -= kept.split(/\s+/).length; }
      }
    }

    // Extra whole-file sources (routes.json "harvestFiles") — e.g. the shared
    // Legal components, whose 12-language COPY map carries the full page text
    // that React renders on /privacy, /terms and /cookie-policy. Two shapes are
    // recognized: `const <ident> = {…}` per-lang blocks (stays pages) and a
    // nested `<lang>: {…}` key inside one big map (shared Legal COPY).
    // [LV-HARVEST-RECORD 2026-08-22] Detail pages whose copy lives in a
    // per-language DATA file keyed by slug — laplandnightlife's
    // `src/data/cities.{lang}.ts` is `Record<slug, {blurb, intro, …}>` in 11
    // languages, one record per /city/<slug> page. harvestFiles cannot be used
    // for these: it would harvest the WHOLE file, so all 14 city pages would
    // print all 14 cities' text — duplicate content, worse than a thin page.
    //
    //   { "path": "/city/oulu",
    //     "harvestRecord": { "file": "src/data/cities.{lang}.ts", "key": "oulu" } }
    //
    // An ARRAY is accepted too, when one page's copy is split over several
    // per-language data files:
    //
    //   { "path": "/destinations/levi",
    //     "harvestRecord": [ { "file": "src/locales/data.gen.{lang}.ts", "key": "levi" },
    //                        { "file": "src/data/guides.{lang}.ts",      "key": "levi" } ] }
    //
    // {lang} is substituted with the locale's copy-file ident (ptBR, zhCN) and,
    // if that file does not exist, with the plain lang tag (pt-BR, zh-CN) —
    // both spellings occur in the network. Missing file or missing record ⇒
    // nothing harvested for that locale, never English in its place.
    // A route may name SEVERAL records: laplandactivities' destination pages
    // take their localized name/why/access from `src/locales/data.gen.{lang}.ts`
    // AND their season/planning copy from `src/data/guides.{lang}.ts`. A single
    // record would force one of the two to stay out of the crawlable body while
    // the page itself renders both. Object form still works unchanged.
    const recs = Array.isArray(route.harvestRecord)
      ? route.harvestRecord
      : (route.harvestRecord ? [route.harvestRecord] : []);
    for (const rec of recs) {
    if (rec && rec.file && rec.key && budget.words > 0) {
      // English is the base language on every LV site, so it often has no
      // per-language overlay file at all. `baseFile` names the English source
      // and is consulted ONLY for the en locale, so English text can never land
      // on a localized URL.
      const candidates = loc.lang === 'en' && rec.baseFile
        ? [rec.baseFile, rec.file.replace('{lang}', loc.ident)]
        : [
          rec.file.replace('{lang}', loc.ident),
          rec.file.replace('{lang}', loc.lang),
        ];
      const fp = candidates.map((c) => resolve(CWD, c)).find((p) => existsSync(p));
      if (fp) {
        let src = inlinePageCache.get(fp);
        if (!src) { src = readFileSync(fp, 'utf-8'); inlinePageCache.set(fp, src); }
        // The record may be a keyed entry (`oulu: { … }`) or a top-level const
        // (`const levi: DestinationFacts = { … }`) — both shapes exist.
        let b = findKeyBlock(src, rec.key);
        if (!b) {
          const cm = new RegExp(`\\bconst\\s+${rec.key.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b[^=]*=\\s*\\{`).exec(src);
          if (cm) b = sliceBlock(src, cm.index + cm[0].length - 1);
        }
        // Third shape: an ARRAY of records identified by a field
        // (`{ slug: 'levi', … }`) rather than an object map — this is how the
        // English base data is written on most sites. Walk back from the field
        // to that record's own opening brace and slice only it; harvesting the
        // whole file would print every record on every page.
        if (!b) {
          const idField = rec.by || 'slug';
          const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, (c) => '\\' + c);
          const idRe = new RegExp('["\']?' + esc(idField) + '["\']?\\s*:\\s*([\'"])' + esc(rec.key) + '\\1');
          const im = idRe.exec(src);
          if (im) {
            let depth = 0, open = -1;
            for (let i = im.index; i >= 0; i--) {
              const c = src[i];
              if (c === '}') depth++;
              else if (c === '{') { if (depth === 0) { open = i; break; } depth--; }
            }
            if (open >= 0) b = sliceBlock(src, open);
          }
        }
        if (b) {
          if (rec.mode === 'localeMap') {
            // The record is ONE object whose fields are per-language maps
            // (`title: { en: '…', fi: '…', ja: '…' }`), not a per-language file.
            // Harvesting the block wholesale would print all twelve languages on
            // every page, so take only this locale's values. Both `fi:` and
            // `'pt-BR':` spellings occur.
            const tag = loc.lang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(`['"]?${tag}['"]?\\s*:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`, 'g');
            let mm;
            while ((mm = re.exec(b)) !== null && budget.words > 0) {
              const kept = harvestKeep(unescapeJsString(mm[2]), meta, seen);
              if (kept) { out.push(kept); budget.words -= kept.split(/\s+/).length; }
            }
          } else {
            harvestFromTsBlock(b, out, meta, seen, budget);
          }
        }
      }
    }
    }

    if (Array.isArray(route.harvestFiles)) {
      for (const rel of route.harvestFiles) {
        if (budget.words <= 0) break;
        // A {lang} placeholder means the FILE is one language (laplandstore's
        // Hero.copy.fi.ts and friends). There is no per-language block to find
        // inside it, so harvest the whole file — it is this locale's text and
        // no other's. Paths without {lang} keep the block-scoped behaviour.
        const perLangFile = rel.includes('{lang}');
        const fp = perLangFile
          ? [rel.replace('{lang}', loc.ident), rel.replace('{lang}', loc.lang)]
            .map((c) => resolve(CWD, c)).find((p) => existsSync(p))
          : resolve(CWD, rel);
        if (!fp || !existsSync(fp)) continue;
        let src = inlinePageCache.get(fp);
        if (!src) { src = readFileSync(fp, 'utf-8'); inlinePageCache.set(fp, src); }
        if (perLangFile) { harvestFromTsBlock(src, out, meta, seen, budget); continue; }
        const reConst = new RegExp(`\\bconst\\s+${loc.ident}\\b\\s*(?::[^=]+)?=\\s*\\{`, 'g');
        const m = reConst.exec(src);
        if (m) { harvestFromTsBlock(sliceBlock(src, m.index + m[0].length - 1), out, meta, seen, budget); continue; }
        // Every per-language block in the file, not just the first: a page
        // file often holds several Record<Lang, …> maps (hero, seo, body), and
        // findKeyBlock returned whichever came first in source order.
        let took = false;
        for (const k of [loc.lang, loc.ident]) {
          for (const b of findKeyBlocks(src, k)) {
            if (budget.words <= 0) break;
            harvestFromTsBlock(b, out, meta, seen, budget);
            took = true;
          }
          if (took) break;
        }
      }
    }

    const keys = [
      ...(route.copyKey ? [route.copyKey] : []),
      ...(route.jsonKey ? [route.jsonKey] : []),
      ...(Array.isArray(route.harvestKeys) ? route.harvestKeys : []),
      // The home route also harvests the conventional home-hero blocks — on
      // every LV site `hero`/`intro` hold the text the home page itself paints.
      // Absent keys are simply skipped, so sites without them are unaffected.
      ...(route.path === '/' ? ['hero', 'intro'] : []),
    ];

    if (route.copyFile) {
      const fp = resolve(CWD, route.copyFile.replace('{lang}', loc.ident));
      if (existsSync(fp)) harvestFromTsBlock(readFileSync(fp, 'utf-8'), out, meta, seen, budget);
    }
    if (route.pageFile && budget.words > 0) {
      const fp = resolve(CWD, route.pageFile);
      if (existsSync(fp)) {
        const src = inlinePageCache.get(fp) || readFileSync(fp, 'utf-8');
        inlinePageCache.set(fp, src);
        const reConst = new RegExp(`\\bconst\\s+${loc.ident}\\b\\s*(?::[^=]+)?=\\s*\\{`, 'g');
        const m = reConst.exec(src);
        if (m) harvestFromTsBlock(sliceBlock(src, m.index + m[0].length - 1), out, meta, seen, budget);
      }
    }
    for (const key of keys) {
      if (budget.words <= 0) break;
      // per-lang copy.{lang}.ts. A DOTTED key ("pages.home") has to be walked
      // segment by segment: findKeyBlocks builds a regex from the key, and in
      // that regex `.` matches any character, so "pages.home" silently matched
      // nothing at all. Measured on carrental 21.8. — 7 wired routes harvested
      // 0 words while the copy sat right there under `pages:`.
      const src = perLangSources[loc.lang];
      if (src) {
        let blocks;
        if (key.includes('.')) {
          let cursor = src;
          for (const part of key.split('.')) {
            const found = findKeyBlocks(cursor, part);
            cursor = found.length ? found[0] : null;
            if (!cursor) break;
          }
          blocks = cursor ? [cursor] : [];
        } else {
          blocks = findKeyBlocks(src, key);
        }
        for (const b of blocks) {
          harvestFromTsBlock(b, out, meta, seen, budget);
          if (budget.words <= 0) break;
        }
      }
      // monolithic copy.ts
      if (budget.words > 0 && monolithicSrc) {
        const langBlock = getLangBlockInMonolithic(loc);
        if (langBlock) {
          let cursor = langBlock;
          for (const part of key.split('.')) cursor = cursor ? findKeyBlock(cursor, part) : null;
          harvestFromTsBlock(cursor || findKeyBlock(langBlock, key.split('.').pop()), out, meta, seen, budget);
        }
      }
      // JSON locales
      if (budget.words > 0) harvestFromObject(readJsonSubtree(loc, key), out, meta, seen, budget);
    }
  } catch { /* fail open — fewer paragraphs, never a broken build */ }
  return out.slice(0, 40);
}

// ---------- crawlable pre-hydration block (--crawlableBody) ----------
// Implementation lives in the shared module so the two forked prerenderers
// (laplandchristmas/, laplandgifts/scripts/) use the SAME code instead of a
// third un-synced copy — the forks diverging silently is exactly what made
// this a network-wide problem in the first place. See that file for the full
// rationale, the measurements behind it, and the safety argument.
const NETWORK = args.crawlableBody ? readFooterNetwork(CWD) : null;
if (args.crawlableBody && !NETWORK) {
  console.warn("[prerender] WARN: --crawlableBody set but shared/Footer.tsx links/labels could not be read — skipping body injection");
}

// ---------- HTML shell injection (same as before) ----------
/** Replace a tag pattern but skip occurrences inside HTML comments. */
function replaceOutsideComments(html, pattern, replacement) {
  const COMMENT = /<!--[\s\S]*?-->/g;
  // Find all comment ranges.
  const skipRanges = [];
  let cm;
  while ((cm = COMMENT.exec(html)) !== null) {
    skipRanges.push([cm.index, cm.index + cm[0].length]);
  }
  // Find pattern matches not inside any comment.
  const re = new RegExp(pattern.source, pattern.flags);
  let result = '';
  let last = 0;
  let m;
  while ((m = re.exec(html)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    const inside = skipRanges.some(([s, e]) => start >= s && end <= e);
    if (inside) continue;
    result += html.slice(last, start) + replacement;
    last = end;
    if (!pattern.flags.includes('g')) break;
  }
  result += html.slice(last);
  return last === 0 ? html : result;
}

function hasTagOutsideComments(html, pattern) {
  const COMMENT = /<!--[\s\S]*?-->/g;
  const stripped = html.replace(COMMENT, '');
  return pattern.test(stripped);
}

/**
 * Titles over 60 chars get truncated in SERPs, and network-wide 2026-08-21 the
 * biggest single generator of >60 titles is a "| SiteName" suffix on an already
 * full title (weddings 169 pages, skiresorts 139, carrental 91). Google shows
 * the site name separately (og:site_name / schema), so dropping the suffix
 * loses nothing. Only the site's OWN brand suffix is dropped — an informative
 * tail is content and stays, even over 60.
 */
// The brand string in a title does not always equal --siteName. lapland.blog
// passes `--siteName=LaplandBlog` while every title ends `· Lapland.blog`, so a
// regex built from the flag alone matched nothing and left 74 titles over the
// limit (measured 21.8.). Try the flag AND the site's own hostname.
const SITE_HOST = (() => { try { return new URL(SITE).hostname.replace(/^www\./, ''); } catch { return ''; } })();
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const BRAND_ALTS = [SITE_NAME, SITE_HOST, SITE_HOST.replace(/\.[a-z]+$/, '')]
  .filter((b) => b && b.length >= 4)
  .map(reEsc)
  .join('|');
const SITE_NAME_SUFFIX_RE = new RegExp(
  `\\s*[|\\u2014\\u2013\\u00B7•-]\\s*(?:${BRAND_ALTS})(?:\\.(?:com|fi|online|blog))?\\s*$`,
  'i'
);
function shortenTitle(t) {
  if (!t || t.length <= 60) return t;
  const short = String(t).replace(SITE_NAME_SUFFIX_RE, '').trim();
  return short.length >= 25 && short.length < t.length ? short : t;
}

function injectShell({ shell, bcp47, og, canonical, title, description, hreflangs, ogImage, faq, lang, internalLinks, paragraphs }) {
  let html = shell;
  title = shortenTitle(title);

  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${bcp47}"`);

  if (/<title>[^<]*<\/title>/i.test(html)) {
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${htmlEscape(title)}</title>`);
  } else {
    html = html.replace(/<\/head>/i, `    <title>${htmlEscape(title)}</title>\n  </head>`);
  }

  if (hasTagOutsideComments(html, /<meta\s+name="description"[^>]*>/i)) {
    html = replaceOutsideComments(
      html,
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" content="${htmlEscape(description || '')}" />`
    );
  } else {
    html = html.replace(
      /<\/head>/i,
      `    <meta name="description" content="${htmlEscape(description || '')}" />\n  </head>`
    );
  }

  // Kill JS canonical injector + prior canonical/hreflang.
  html = html.replace(
    /<script>[^<]*?window\.location\.pathname[\s\S]*?<\/script>/i,
    ''
  );
  html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '');
  html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>\s*/gi, '');

  const altLinks = hreflangs
    .map((h) => `    <link rel="alternate" hreflang="${h.hreflang}" href="${h.url}" />`)
    .join('\n');

  // x-default = this page's own EN URL (same path, '' prefix, trailing slash) —
  // NOT the site root. Falls back to site root only if no EN alternate exists
  // (e.g. --locales filter without en).
  const xDefaultUrl =
    (hreflangs.find((h) => h.hreflang === 'en') || hreflangs[0] || { url: `${SITE}/` }).url;
  const canonicalBlock = `    <link rel="canonical" href="${canonical}" />\n${altLinks}\n    <link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`;
  html = html.replace(/<\/head>/i, `${canonicalBlock}\n  </head>`);

  // Server-rendered BreadcrumbList JSON-LD (rich-result eligible), derived from the
  // canonical path. Skips the home page. Locale URL-prefix is treated as the locale root.
  try {
    const LOC_PREFIXES = new Set(['fi', 'de', 'ja', 'es', 'br', 'cn', 'kr', 'fr', 'it', 'nl']);
    const u = new URL(canonical);
    const segs = u.pathname.split('/').filter(Boolean);
    const hasLoc = segs.length > 0 && LOC_PREFIXES.has(segs[0]);
    const localeRoot = hasLoc ? `${SITE}/${segs[0]}` : SITE;
    const pathSegs = hasLoc ? segs.slice(1) : segs;
    if (pathSegs.length > 0) {
      const items = [{ name: SITE_NAME, url: `${localeRoot}/` }];
      let acc = localeRoot;
      pathSegs.forEach((seg, i) => {
        acc += `/${seg}`;
        const last = i === pathSegs.length - 1;
        const name = last
          ? title.replace(/\s*[|—–]\s.*$/, '').trim()
          : seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        items.push({ name, url: acc });
      });
      const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: it.name,
          item: it.url,
        })),
      };
      const bcScript = `    <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`;
      html = html.replace(/<\/head>/i, `${bcScript}\n  </head>`);
    }
  } catch { /* never block the build on breadcrumb derivation */ }

  // Server-rendered FAQPage JSON-LD (rich-result eligible). Only emitted when the
  // --meta map carried a `faq` array for this route/locale (opt-in per site).
  try {
    if (Array.isArray(faq) && faq.length) {
      const faqPage = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: bcp47,
        mainEntity: faq.map((it) => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
      };
      const faqScript = `    <script type="application/ld+json">${JSON.stringify(faqPage)}</script>`;
      html = html.replace(/<\/head>/i, `${faqScript}\n  </head>`);
    }
  } catch { /* never block the build on FAQ derivation */ }

  function setMeta(attr, key, value) {
    const re = new RegExp(
      `<meta\\s+${attr}="${key.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}"[^>]*>`,
      'i'
    );
    const tag = `<meta ${attr}="${key}" content="${htmlEscape(value)}" />`;
    if (hasTagOutsideComments(html, re)) html = replaceOutsideComments(html, re, tag);
    else html = html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
  }

  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description || '');
  setMeta('property', 'og:url', canonical);
  setMeta('property', 'og:locale', og);
  setMeta('property', 'og:image', /^https?:/.test(ogImage) ? ogImage : `${SITE}${ogImage}`);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description || '');
  setMeta('name', 'twitter:site', TWITTER);
  setMeta('name', 'twitter:image', /^https?:/.test(ogImage) ? ogImage : `${SITE}${ogImage}`);

  // Pre-hydration crawlable body. Only touches an EMPTY #root, so a site that
  // already ships server-rendered markup is left alone; combined with the strip
  // applied when SHELL is read, re-running the script is genuinely idempotent.
  html = injectCrawlableBody(
    html,
    buildCrawlableBody(NETWORK, {
      title,
      description,
      lang,
      siteOrigin: SITE,
      siteName: SITE_NAME,
      internalLinks,
      selfUrl: canonical,
      paragraphs,
    })
  );

  return html;
}

function fallbackMeta(routePath, route) {
  const slug = routePath.replace(/^\//, '').replace(/-/g, ' ').replace(/\//g, ' · ').trim();
  const human = slug
    .split(' ')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ');
  return {
    title: route.fallbackTitle || `${human || 'Home'} | ${SITE_NAME}`,
    description: route.fallbackDescription || `${SITE_NAME}: ${human || 'home'}.`,
  };
}

// ---------- write loop ----------
let written = 0;
let lastOut = null;
const summary = [];
const debugNoMeta = [];
const harvestStats = { with: 0, without: 0, words: 0 };

// Pre-pass: the site's own pages per locale, for the crawlable block's internal
// nav. Built BEFORE rendering because every page links to every sibling, so the
// full list has to exist before the first file is written. Uses the same meta
// cascade and the same URL construction as the render pass below.
const INTERNAL_BY_LANG = {};
if (args.crawlableBody) {
  const enLocPre = LOCALE_LIST.find((l) => l.lang === 'en') || LOCALE_LIST[0];
  for (const route of routes) {
    const enMetaPre = resolveRouteMeta(enLocPre, route) || fallbackMeta(route.path, route);
    const localesPre = Array.isArray(route.locales)
      ? LOCALE_LIST.filter((l) => route.locales.includes(l.lang))
      : LOCALE_LIST;
    for (const loc of localesPre) {
      const { meta } = resolveLocaleMeta(route, loc, enMetaPre);
      // Anchor text is the page's own localized title minus the " | SiteName"
      // tail — the brand repeated 20× in one list is noise, not information.
      const text = String(meta.title || '').split(/\s[|—]\s/)[0].trim();
      if (!text) continue;
      (INTERNAL_BY_LANG[loc.lang] = INTERNAL_BY_LANG[loc.lang] || []).push({
        url: routeUrl(route, loc),
        text,
      });
    }
  }
  const counts = Object.entries(INTERNAL_BY_LANG).map(([l, a]) => `${l}:${a.length}`);
  console.log(`[prerender] crawlable internal links per locale — ${counts.join(' ')}`);
}

for (const route of routes) {
  const routePath = route.path;
  // Route-level OG image; a locale-specific `ogImageByLang` entry (routes.json)
  // wins inside the locale loop — needed by shared routes whose locales carry
  // different page-unique heroes (e.g. /northern-lights/where-to-see: nl + pt-BR).
  const routeOgImage = route.ogImage || DEFAULT_OG;

  // EN fallback (always populated): try EN meta first, else derive from path.
  const enLoc = LOCALE_LIST.find((l) => l.lang === 'en') || LOCALE_LIST[0];
  const enMeta = resolveRouteMeta(enLoc, route) || fallbackMeta(routePath, route);

  // Optional per-route locale restriction: a route with "locales": ["fi"] in
  // routes.json is generated ONLY for those locales (e.g. a Finnish-market-only
  // page) — prevents ghost /de/… /ja/… variants that have no matching React route.
  const routeLocales = Array.isArray(route.locales)
    ? LOCALE_LIST.filter((l) => route.locales.includes(l.lang))
    : LOCALE_LIST;

  for (const loc of routeLocales) {
    const resolved = resolveLocaleMeta(route, loc, enMeta);
    const meta = resolved.meta;
    // Tracks whether THIS locale got a locale-specific title from any source
    // (copy readers, fallbackTitleByLang, shell title map) — routes that end up
    // on the EN fallback are the only ones worth reporting in the debug log.
    const localizedTitle = resolved.localizedTitle;

    // Per-locale hero/OG override (see routeOgImage note above).
    const ogImage = (route.ogImageByLang && route.ogImageByLang[loc.lang]) || routeOgImage;

    const cleanPath = routePath === '/' ? '' : routePath;
    // Canonical/hreflang MUST use the trailing-slash form, because the prerendered
    // file lives at /path/index.html and Cloudflare Pages serves it at /path/ (200),
    // 308-redirecting the no-slash form. A canonical pointing at the redirecting
    // no-slash URL makes Google pick its own canonical ("Duplicate, Google chose
    // a different canonical than the user"). Trailing slash = the real 200 URL.

    // Opt-in per-route consolidation: a route flagged "canonicalLocale":"en" (or
    // any lang) renders the SAME single-language content on every locale URL —
    // e.g. an English-only blog article that isn't translated. Every locale
    // variant then canonicalises to that ONE locale and advertises NO per-locale
    // hreflang, so Google folds them into the single real version instead of
    // flagging "Duplicate, Google chose a different canonical than the user".
    // Routes without the field keep the default per-locale self-canonical.
    const canonicalLoc = route.canonicalLocale
      ? (LOCALE_LIST.find((l) => l.lang === route.canonicalLocale) || loc)
      : loc;
    const canonical = `${SITE}${canonicalLoc.prefix}${cleanPath}`.replace(/\/?$/, '/');

    const hreflangs = route.canonicalLocale
      ? [{ hreflang: canonicalLoc.lang === 'en' ? 'en' : canonicalLoc.lang, url: canonical }]
      : routeLocales.map((l) => ({
          hreflang: l.lang === 'en' ? 'en' : l.lang,
          url: `${SITE}${l.prefix}${cleanPath}`.replace(/\/?$/, '/'),
        }));

    const outPath =
      loc.prefix === '' && cleanPath === ''
        ? resolve(DIST, 'index.html')
        : resolve(
            DIST,
            `${loc.prefix.slice(1) || ''}${cleanPath}`.replace(/^\//, ''),
            'index.html'
          );

    // FAQ for this route/locale (opt-in via --meta map). Falls back to EN faq so
    // every locale ships a FAQPage even before per-locale translations land.
    const faq = readFaqFromMeta(loc, route) || readFaqFromMeta(enLoc, route);

    // Localized page copy for the crawlable block (same-locale only, fail-open).
    const paragraphs = args.crawlableBody ? harvestRouteText(loc, route, meta) : null;
    if (paragraphs && paragraphs.length) harvestStats.with++; else harvestStats.without++;
    harvestStats.words += (paragraphs || []).reduce((a, t) => a + t.split(/\s+/).length, 0);

    const html = injectShell({
      shell: SHELL,
      bcp47: loc.bcp47,
      lang: loc.lang,
      og: loc.og,
      canonical,
      title: meta.title,
      description: meta.description,
      hreflangs,
      ogImage,
      faq,
      internalLinks: INTERNAL_BY_LANG[loc.lang],
      paragraphs,
    });

    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf-8');
    lastOut = outPath;
    written++;
    if (summary.length < 6) {
      summary.push(`  ${loc.lang.padEnd(5)} ${routePath.padEnd(34)} → ${outPath.replace(DIST + '\\', '').replace(DIST + '/', '')}`);
    }
    // Report ONLY non-EN locales that truly shipped an EN(-derived) title.
    // A per-locale fallback (fallbackTitleByLang / shell title map) is a real
    // localized source — logging it as "no-meta" caused false-alarm fix tasks
    // (lapland-blog home 2026-07-07, where ja/es were already localized).
    if (loc.lang !== 'en' && !localizedTitle && debugNoMeta.length < 5) {
      debugNoMeta.push(`    no-meta: ${loc.lang} ${routePath}`);
    }
  }
}

console.log(`[prerender] wrote ${written} files for ${routes.length} routes × ${LOCALE_LIST.length} locales`);
if (args.crawlableBody) {
  const avg = harvestStats.with ? Math.round(harvestStats.words / harvestStats.with) : 0;
  console.log(`[prerender] harvest: ${harvestStats.with} pages with body copy (avg ${avg} words), ${harvestStats.without} without`);
}
console.log(`[prerender] sample:`);
summary.forEach((l) => console.log(l));
if (debugNoMeta.length) {
  console.log(`[prerender] some routes fell back to EN (first ${debugNoMeta.length}):`);
  debugNoMeta.forEach((l) => console.log(l));
}

// ---------- 404 page (--emit404) ----------
// 🔴 MITATTU 2026-08-16: every LV site ships `/*  /index.html  200` in
// public/_redirects, so Cloudflare Pages answers **200 OK** for paths that do not
// exist (verified on vibes, tours, nature, blog, kids — all five returned 200 for
// /tata-sivua-ei-ole-olemassa-12345/). shared/NotFound.tsx then sets robots=noindex
// client-side. The noindex is correct — it IS a 404 page — but it arrives after the
// status line already told Google "this URL exists". Googlebot renders the JS, sees
// the noindex, and files the URL under "Excluded by noindex tag"… then re-crawls it
// forever, because a 200 means the page is real.
//
// That is the mechanism behind the ~19 sites that each got a "Noindex-tagin
// poissulkema" notification inside two hours on 2026-07-27/28, and behind the ~49
// "Osa korjauksista epäonnistui" mails: clicking "Validate fix" cannot succeed while
// the server keeps insisting the dead page is fine.
//
// 🔴🔴 THE FIX HAS TWO HALVES AND BOTH MUST SHIP TOGETHER:
//   1. this file — dist/404.html, which Cloudflare Pages serves with a real 404
//      status for any request matching no static asset, AND
//   2. removing `/*  /index.html  200` from public/_redirects, because a catch-all
//      outranks the 404 handler and would keep the 200 alive.
// Shipping only (1) changes nothing. Shipping only (2) turns dead paths into
// Cloudflare's generic error page instead of a branded one.
//
// 🔴 SAFE ONLY WHEN EVERY ROUTE IS PRERENDERED. This works because the prerender
// writes a real index.html per route × locale, so the catch-all was never serving a
// real page — only dead paths. VERIFY PER SITE before removing the catch-all:
//     find dist -name index.html | wc -l   ==   grep -c '<loc>' dist/sitemap.xml
// A site with dynamic or client-side-only routes (a :slug page, a search view) will
// have fewer files than routes, and removing the catch-all would 404 real pages.
// Opt-in by design: sites that do not pass --emit404 are untouched.
if (args.emit404) {
  let html = SHELL;

  // Overwrite the existing robots tag instead of appending a second one. Two
  // contradictory robots metas is the exact bug shared/NotFound.tsx carried until
  // 2026-08-13 — Google resolves them to the strictest so it happened to work, but
  // by luck, and only after JS ran. Don't rebuild that.
  const ROBOTS_RE = /<meta[^>]+name=["']robots["'][^>]*>/i;
  html = ROBOTS_RE.test(html)
    ? html.replace(ROBOTS_RE, '<meta name="robots" content="noindex, follow">')
    : html.replace(/<\/head>/i, '  <meta name="robots" content="noindex, follow">\n  </head>');

  // A 404 must not claim a canonical or advertise hreflang alternates: the shell's
  // self-canonical points at the home page, which would tell Google this dead URL
  // is the preferred version of the site root.
  html = html.replace(/\s*<link[^>]+rel=["']canonical["'][^>]*>/gi, '');
  html = html.replace(/\s*<link[^>]+rel=["']alternate["'][^>]+hreflang=[^>]*>/gi, '');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>404 — ${SITE_NAME}</title>`);

  const out404 = resolve(DIST, '404.html');
  writeFileSync(out404, html, 'utf-8');

  // Assert the artefact, not the intent — same reasoning as the crawlable-body gate
  // below. A 404 page that still carries a canonical is worse than no 404 page.
  const probe404 = readFileSync(out404, 'utf-8');
  const bad404 = [];
  if (/rel=["']canonical["']/i.test(probe404)) bad404.push('canonical still present');
  if (!/name=["']robots["'][^>]*noindex/i.test(probe404)) bad404.push('robots noindex missing');
  if ((probe404.match(/name=["']robots["']/gi) || []).length !== 1) bad404.push('robots meta count != 1');
  if (!/<script[^>]+src=/i.test(probe404)) bad404.push('no script tag — shell lost its hashed assets');
  if (bad404.length) {
    console.error(`\n[prerender] 404 GATE FAILED on ${out404}:`);
    for (const p of bad404) console.error(`  - ${p}`);
    console.error('Refusing to exit 0 — a 404 page with an index directive or a canonical is worse than none.\n');
    process.exit(1);
  }
  console.log('[prerender] wrote dist/404.html — 404 gate OK (noindex, no canonical)');
}

// ---------- smoke gate (--crawlableBody) ----------
// The crawlable block is deliberately fail-open: a missing module or an
// unparseable shared Footer only warns, so a standalone checkout can still
// build. That also means the feature can switch itself off in production
// without anything going red — build-all.sh reads exit 0 as success and the
// warning scrolls past. The network has been bitten by exactly this shape
// before (wrangler pin, 2026-08-11: every build green, the failure visible
// only in the deploy log).
//
// So assert the finished artefact, not the intent: read back a file we just
// wrote and fail the build if the block is gone. Uses the LAST path written,
// so it cannot pass against a stale dist.
if (args.crawlableBody && NETWORK && lastOut) {
  const probe = readFileSync(lastOut, 'utf-8');
  const problems = [];
  if (!probe.includes('id="lv-prerender"')) problems.push('crawlable body block missing');
  if (!/<div id="root"><(?:div|style)/.test(probe)) problems.push('block is not inside #root');

  if (problems.length) {
    console.error(`
[prerender] SMOKE GATE FAILED on ${lastOut}:`);
    for (const p of problems) console.error(`  - ${p}`);
    console.error('Refusing to exit 0 — a green build here would ship pages with no crawlable content.\n');
    process.exit(1);
  }
  console.log('[prerender] smoke gate OK — crawlable block present inside #root');
}
