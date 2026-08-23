/**
 * Shared pre-hydration crawlable body for the LV prerenderers.
 *
 * WHY THIS IS ITS OWN MODULE
 * Three scripts prerender the network: the shared `_prerender_routes.mjs`, plus
 * permanently-forked copies in `laplandchristmas/` and `laplandgifts/scripts/`
 * (diverged by 132 and 1382 lines, no sync mechanism). Copying this feature into
 * each would repeat exactly the mistake that made those forks a problem. Every
 * caller imports this instead, so there is one implementation.
 *
 * WHAT IT SOLVES (measured 2026-08-12)
 * Non-JS crawlers never run the SPA bundle, so every route looked like an empty
 * shell. OpenSEO audits over 12 network sites all returned the same verdict —
 * missing-h1 100/100, no-outgoing-links 100/100, thin-content 100/100 — and
 * DataForSEO's backlink index holds ZERO of the network's 27 cross-links because
 * it never sees an <a href>. Googlebot renders JS and was always fine; this is
 * for backlink indexes, SEO tooling and most AI/LLM search crawlers.
 *
 * SAFETY
 * - Sites mount with createRoot() (never hydrateRoot), so React replaces #root's
 *   children on first render. No hydration mismatch is possible.
 * - The block mirrors what the page genuinely shows: the H1 repeats the <title>,
 *   the <p> repeats the meta description verbatim, and the links are the same
 *   ecosystem footer links every page renders — localized to the SAME locale.
 * - Fails open everywhere: any parse problem returns null and the caller skips
 *   injection, leaving output byte-identical to before.
 *
 * WHY THE TEXT IS NOT PAINTED TO HUMANS (changed 2026-08-23)
 * The block sits inside #root, so it is on screen until React's first commit —
 * measured on laplandvibes.com/fi that day: HTML responseEnd 110ms, entry chunk
 * done 390ms, domContentLoadedEventEnd 672ms warm; 1.8–2.2s cold. Until this
 * change it was painted AS TEXT for that whole window, on every route of 9/10
 * live domains sampled (7–24 kB of harvested title + description + link list;
 * gifts 24 kB at 201 routes). Vesa, 2026-08-23: "joka ikinen sivu näyttää
 * jonkun pelkän tekstin sinistä taustaa vasten … ihan kuin jotkut lakitekstit".
 * The earlier reasoning — that a blank shell for 1.8s is worse — was his call to
 * make and he made it the other way. Note this is the SECOND complaint about
 * this block's appearance; 2026-08-16's "h1-kirjaimet venyy" was patched
 * cosmetically (font-weight 400, below) instead of questioning the paint itself.
 *
 * So the block is now hidden from JS browsers and shown to everything else:
 *   - an inline script adds `lv-js` to <html> BEFORE the text is parsed, and
 *     `.lv-js #lv-prerender{display:none}` hides it — no paint, no flash;
 *   - a non-JS crawler never runs that script, the rule never matches, and it
 *     reads exactly the same text as before. The whole SEO purpose is intact.
 *     Googlebot runs JS and renders the real app, whose h1/links are the same
 *     content — this is progressive enhancement, not cloaking.
 * 🔴 `<noscript>` cannot do this job: crawlers do not count a noscript H1 (see
 * the laplandvisit note on injectCrawlableBody — trusting one took that site
 * from missing-h1 0/100 to 100/100).
 * 🔴 The hiding rule MUST stay class-scoped. An unconditional
 * `#lv-prerender{display:none}` hides it from the non-JS crawlers too, which
 * silently deletes the feature while leaving the bytes in place.
 *
 * In its place a branded splash (#LAPLAND<BRAND> wordmark) fades in only after
 * 350ms, so a fast mount shows nothing at all and a slow one shows the brand.
 * A 6s watchdog puts the text back if React never mounts, so a broken bundle
 * degrades to a readable, linked page instead of the blank screen that hid the
 * app's death for 17h on 2026-08-18.
 *
 * Gate: `node scripts/test_crawlable_body_splash.mjs` pins all of the above.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ── self-contained helpers (no dependency on any caller's internals) ─────────
function unescapeJs(s) {
  return s
    .replace(/\\n/g, ' ').replace(/\\t/g, ' ')
    .replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\`/g, '`')
    .replace(/\\\\/g, '\\')
    .replace(/\s+/g, ' ')
    .trim();
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Walk braces from the first `{` at/after openIdx; return the inner slice. */
function sliceBlock(src, openIdx) {
  let depth = 0, start = -1;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (c === '{') { if (depth === 0) start = i + 1; depth++; }
    else if (c === '}') { depth--; if (depth === 0) return src.slice(start, i); }
  }
  return null;
}

const HUB_URL = 'https://laplandvibes.com';

/**
 * Per-locale name for the hub, read out of EcosystemMenu.tsx.
 *
 * WHY THE HUB NEEDS ITS OWN READER
 * Footer.tsx's buildSiteGroups() lists the 27 SPOKES; laplandvibes.com is not in
 * it (measured on laplandnature 2026-08-13: the block emitted 26 links, none of
 * them to the hub). Rolled out network-wide that would have produced ~650
 * crawlable spoke-to-spoke links and ZERO pointing at the one domain this whole
 * exercise exists to fix — rank 0, 14 referring domains, all of them junk.
 *
 * EcosystemMenu.tsx already carries the hub's name in 12 locales, so no new
 * translation is invented here. Returns {} when unreadable; the caller then
 * falls back to the bare domain, which is correct in every language.
 */
function readHubLabels(cwd) {
  const fp = [
    resolve(cwd, 'src', 'shared', 'EcosystemMenu.tsx'),
    resolve(cwd, '..', 'src', 'shared', 'EcosystemMenu.tsx'),
    resolve(cwd, '..', 'shared', 'EcosystemMenu.tsx'),
  ].find((p) => existsSync(p));
  if (!fp) return {};

  let src;
  try { src = readFileSync(fp, 'utf-8'); } catch { return {}; }

  const labels = {};
  // fi + en live on the SITES row itself; the other 10 locales in NAME_I18N.
  const row = /\{\s*domain:\s*'laplandvibes\.com'[^}]*\}/.exec(src);
  if (row) {
    for (const lg of ['en', 'fi']) {
      const m = new RegExp(`\\b${lg}:\\s*'((?:\\\\.|[^'])*)'`).exec(row[0]);
      if (m) labels[lg] = unescapeJs(m[1]);
    }
  }
  const anchor = /const\s+NAME_I18N\b[^=]*=\s*\{/.exec(src);
  if (anchor) {
    const inner = sliceBlock(src, anchor.index + anchor[0].length - 1);
    try {
      const byLang = JSON.parse(`{${inner}}`)[new URL(HUB_URL).hostname];
      if (byLang) for (const [lg, name] of Object.entries(byLang)) labels[lg] = name;
    } catch { /* keep whatever the SITES row gave us */ }
  }
  return labels;
}

/**
 * Read the ecosystem link list + per-locale anchor labels out of the site's
 * vendored shared/Footer.tsx.
 *
 * Labels come from BUILT_IN_SITE_LABELS / EXT_SITE_LABELS (12 locales), NOT from
 * DEFAULT_DICT.siteLabels — that one is English-only, and using it shipped English
 * anchors on ~11 of every 12 prerendered files while the rendered footer showed the
 * localized string. That mismatch was worst exactly where the network performs
 * best: non-EN pages out-rank EN by a wide margin.
 */
export function readFooterNetwork(cwd) {
  const fp = [
    resolve(cwd, 'src', 'shared', 'Footer.tsx'),
    resolve(cwd, '..', 'src', 'shared', 'Footer.tsx'),
    resolve(cwd, '..', 'shared', 'Footer.tsx'),
  ].find((p) => existsSync(p));
  if (!fp) return null;

  let src;
  try { src = readFileSync(fp, 'utf-8'); } catch { return null; }

  const labelsByLang = {};
  for (const mapName of ['BUILT_IN_SITE_LABELS', 'EXT_SITE_LABELS']) {
    const anchor = new RegExp(`const\\s+${mapName}\\b[^=]*=\\s*\\{`).exec(src);
    if (!anchor) continue;
    const outer = sliceBlock(src, anchor.index + anchor[0].length - 1);
    if (!outer) continue;
    const langRe = /(?:'([^']+)'|"([^"]+)"|([A-Za-z][\w-]*))\s*:\s*\{/g;
    let lm;
    while ((lm = langRe.exec(outer)) !== null) {
      const lang = lm[1] || lm[2] || lm[3];
      const inner = sliceBlock(outer, lm.index + lm[0].length - 1);
      if (!inner) continue;
      labelsByLang[lang] = labelsByLang[lang] || {};
      // Values use both quote styles (nl uses "…aanbieders vergeleken" for an apostrophe).
      const kvRe = /(\w+)\s*:\s*(['"])((?:\\.|(?!\2).)*)\2/g;
      let kv;
      while ((kv = kvRe.exec(inner)) !== null) labelsByLang[lang][kv[1]] = unescapeJs(kv[3]);
      langRe.lastIndex = lm.index + lm[0].length + inner.length;
    }
  }
  if (!Object.keys(labelsByLang).length) return null;

  // The hub goes FIRST and is registered here rather than at the call site, so
  // both forked prerenderers (laplandchristmas/, laplandgifts/scripts/) pick it
  // up with no edit of their own — the same reason this module exists at all.
  // buildCrawlableBody's exact-origin filter drops it again when the hub itself
  // is the site being prerendered, so no page ever links to itself.
  const hubLabels = readHubLabels(cwd);
  for (const [lg, name] of Object.entries(hubLabels)) {
    labelsByLang[lg] = labelsByLang[lg] || {};
    labelsByLang[lg].__hub = name;
  }

  const spokes = [];
  const seen = new Set([HUB_URL]);
  const linkRe = /name:\s*s\.(\w+)\s*,\s*url:\s*'(https:\/\/[^']+)'/g;
  let m;
  while ((m = linkRe.exec(src)) !== null) {
    const url = m[2].replace(/\/+$/, '');
    if (seen.has(url)) continue;
    seen.add(url);
    spokes.push({ key: m[1], url });
  }
  // Guard on the SPOKES, not on the combined list: the hub is added
  // unconditionally, so counting it here would turn "the footer parsed to
  // nothing" into a one-link block instead of the intended fail-open null.
  return spokes.length ? { links: [{ key: '__hub', url: HUB_URL }, ...spokes], labelsByLang } : null;
}

/**
 * Build the injectable block, or null if `network` is falsy.
 * `siteOrigin` is compared EXACTLY — a startsWith test would wrongly drop a
 * domain that happens to be a prefix of this site's own.
 */
export function buildCrawlableBody(
  network,
  { title, description, lang, siteOrigin, siteName, internalLinks, selfUrl, paragraphs }
) {
  if (!network) return null;
  const dict = { ...(network.labelsByLang.en || {}), ...(network.labelsByLang[lang] || {}) };
  const origin = String(siteOrigin || '').replace(/\/+$/, '');
  const items = network.links
    .filter((l) => l.url !== origin)
    .map((l) => {
      const text = dict[l.key] || l.url.replace(/^https:\/\//, '');
      return `<li><a href="${l.url}/">${esc(text)}</a></li>`;
    })
    .join('');
  if (!items) return null;

  // The site's OWN pages, same locale. Without these the raw HTML has zero
  // INTERNAL links, so every page is an orphan to a non-JS crawler even though
  // it now has 27 outgoing ones — measured on all 8 sites 2026-08-13:
  // no-outgoing-links went 100 → 0 while orphan-page stayed at 99/100, because
  // every link in the block pointed at a different domain.
  // Optional: callers that pass nothing (the two forked prerenderers until they
  // are updated) get exactly the previous output.
  const seenInternal = new Set([String(selfUrl || '')]);
  const internalItems = (internalLinks || [])
    .filter((l) => l && l.url && l.text && !seenInternal.has(l.url) && seenInternal.add(l.url))
    .map(
      (l) =>
        `<li><a href="${l.url}">${esc(l.text)}</a></li>`
    )
    .join('');

  // Inline styles: Tailwind classes are purged from the shell, so classes would be
  // inert. var(--font-heading, inherit) picks up the site's own heading token where
  // it exists (network standard Bebas Neue) and quietly falls back otherwise.
  // Colours inherit, so this reads correctly on deep-night, cream (stays) and the
  // christmas palette without hardcoding any of them.
  // Route-localized page copy harvested by the caller from the SAME source the
  // page itself renders (locale JSON / copy.ts / meta-map FAQ). Same-locale only —
  // an EN paragraph on a /fi/ page would be wrong-language content, which the
  // network has already been bitten by (blog root 2026-08-18). Optional: callers
  // that pass nothing get the previous title+description+links output unchanged.
  const paras = Array.isArray(paragraphs)
    ? paragraphs.filter((t) => typeof t === 'string' && t.trim())
    : [];

  const wrap = 'max-width:52rem;margin:0 auto;padding:12vh 1.5rem 4rem;color:inherit';
  // 🔴 font-weight MUST stay 400. Bebas Neue ships a single 400 face on every site
  // in the network, so asking for 700 does not load a bolder file — the browser
  // synthesises the bold by smearing the condensed glyphs sideways. That is what
  // Vesa saw as "h1-kirjaimet venyy" before React mounts (2026-08-16). Any weight
  // above 400 here reintroduces it.
  const h1 = 'font-family:var(--font-heading,inherit);font-size:clamp(1.75rem,5vw,2.75rem);line-height:1.15;margin:0 0 1rem;font-weight:400;letter-spacing:.01em';
  const p = 'font-size:1.05rem;line-height:1.6;margin:0 0 3rem;opacity:.85';
  const pBody = 'font-size:.95rem;line-height:1.55;margin:0 0 .9rem;opacity:.8';
  const nav = 'font-size:.8rem;opacity:.55;line-height:1.9';
  const ul = 'list-style:none;padding:0;margin:.5rem 0 0;display:flex;flex-wrap:wrap;gap:.25rem 1.25rem';

  return (
    // Marker comments delimit everything this module owns, so stripCrawlableBody
    // can remove it in one match no matter how many elements it grows. The old
    // strip regex keyed on `<div id="root"><div id="lv-prerender"` and on the
    // block ending `</nav></div></div>`, which both stop being true here.
    PRE_OPEN +
    // Runs during parse, BEFORE the text below is parsed, so the text is never
    // painted in a JS browser. A non-JS crawler never gets the class, so the
    // rule in SPLASH_CSS never matches and it reads the text exactly as before.
    `<script>${BOOT_JS}</script>` +
    // One rule instead of the same 44-byte inline style on every anchor. The block
    // carries 27 network links + up to ~200 internal ones, so inline styling cost
    // ~3,2 kB per page on weddings (72 anchors) and would scale with route count —
    // gifts has 201 routes. Scoped to #lv-prerender so it cannot leak into the app,
    // and it is removed with the block when React mounts.
    `<style>${SPLASH_CSS}</style>` +
    `<div id="lv-prerender" style="${wrap}">` +
    `<h1 style="${h1}">${esc(title)}</h1>` +
    (description ? `<p style="${p}">${esc(description)}</p>` : '') +
    (paras.length
      ? `<div style="margin:0 0 3rem">${paras.map((t) => `<p style="${pBody}">${esc(t)}</p>`).join('')}</div>`
      : '') +
    (internalItems
      ? `<nav aria-label="${esc(siteName || 'LaplandVibes')} pages" style="${nav}">` +
        `<ul style="${ul}">${internalItems}</ul></nav>`
      : '') +
    `<nav aria-label="${esc(siteName || 'LaplandVibes')} network" style="${nav}">` +
    `<ul style="${ul}">${items}</ul></nav>` +
    `</div>` +
    // What a human actually sees while React loads. Sits after the text so the
    // h1 demotion in injectCrawlableBody keeps matching the block's own heading.
    `<div id="lv-splash" aria-hidden="true"><span style="${mark}">${wordmark(siteName)}</span></div>` +
    PRE_CLOSE
  );
}

const PRE_OPEN = '<!--LV-PRE-->';
const PRE_CLOSE = '<!--/LV-PRE-->';

// 6s, not 2s: a cold 3G mount is legitimately slow and re-showing the text on a
// page that is merely slow would put the flash straight back. This fires only
// when React never commits at all.
const BOOT_JS =
  "document.documentElement.classList.add('lv-js');" +
  "setTimeout(function(){var e=document.getElementById('lv-prerender');" +
  "if(e){e.style.display='block';" + // inline, so it beats the class rule below
  "var s=document.getElementById('lv-splash');if(s&&s.parentNode)s.parentNode.removeChild(s)}},6000)";

// 🔴 `.lv-js`-scoped, never bare — see the module header. The 350ms delay is the
// point of the splash: a warm mount lands at ~670ms but a cached one is faster
// still, and anything that mounts before the delay elapses shows NOTHING, which
// is better than a wordmark that blinks once per navigation.
const SPLASH_CSS =
  '.lv-js #lv-prerender{display:none}' +
  '#lv-splash{display:none}' +
  // 🔴 The delay lives in `from{opacity:0}` + `both`, NOT in a base `opacity:0`.
  // Both spellings look identical when the animation runs, but they fail in
  // opposite directions when it does not (animations suppressed by the UA, a
  // non-compositing/backgrounded renderer — observed in this repo's own preview
  // pane 2026-08-23): base-0 leaves a permanently BLANK screen, `both` with a
  // base of 1 just shows the wordmark immediately. Never make content depend on
  // an animation running in order to become visible.
  '.lv-js #lv-splash{display:flex;position:fixed;inset:0;align-items:center;' +
  'justify-content:center;animation:lvSplashIn .45s ease .35s both}' +
  '@keyframes lvSplashIn{from{opacity:0}to{opacity:1}}' +
  '@media (prefers-reduced-motion:reduce){.lv-js #lv-splash{animation-duration:.01ms}}' +
  '#lv-prerender a{color:inherit;text-decoration:none}';

// var(--font-logo) first: the network rule is that the wordmark is Bebas Neue on
// EVERY site including the font variants (carrental/hoteldeals), and those carry
// the token precisely for that. Standard sites have no --font-logo and fall
// through to --font-heading, which is already Bebas.
const mark =
  'font-family:var(--font-logo,var(--font-heading,inherit));font-weight:400;' +
  'font-size:clamp(1.75rem,6vw,3rem);letter-spacing:.06em;line-height:1';

/**
 * `#LAPLAND<BRAND>` in the network's colours.
 *
 * The middle word inherits instead of hardcoding --color-snow: laplandstays is
 * a cream site (#FAFAF8 body) where snow-on-cream is invisible, and christmas
 * runs a warm palette. Inheriting is what the text block already relies on.
 * The pink keeps a literal fallback because a variant site may not define the
 * token at all, and a wordmark with no accent still reads correctly.
 */
function wordmark(siteName) {
  const raw = String(siteName || 'LaplandVibes').trim();
  const pink = 'color:var(--color-vibe-pink,#EC4899)';
  const rest = /^lapland[\s_-]*(.+)$/i.exec(raw);
  return rest
    ? `<span style="${pink}">#</span><span>LAPLAND</span>` +
        `<span style="${pink}">${esc(rest[1].toUpperCase())}</span>`
    : `<span style="${pink}">#</span><span>${esc(raw.toUpperCase())}</span>`;
}

/**
 * Strip a previously injected block out of a shell string.
 *
 * REQUIRED for idempotency: the prerenderers read their shell from
 * dist/index.html, which they also OVERWRITE for the EN home route. Without this,
 * a second run (or a second prerenderer chained after the first, as on
 * laplandskiresorts) reads a shell that already contains the previous run's home
 * block, the "#root is empty" match fails, and every route silently inherits the
 * HOME page's h1/description/nav.
 */
export function stripCrawlableBody(html) {
  return (
    html
      // Current shape: everything this module owns sits between the markers.
      .replace(/<div id="root"><!--LV-PRE-->[\s\S]*?<!--\/LV-PRE--><\/div>/i, '<div id="root"></div>')
      // Pre-2026-08-23 shape. 🔴 KEEP: dist/ shells on disk still hold blocks in
      // the old form, and the prerenderers read the shell they overwrite. Drop
      // this and the first run after the splash change stacks a new block on top
      // of the old one instead of replacing it.
      .replace(
        /<div id="root"><div id="lv-prerender"[^>]*>[\s\S]*?<\/nav><\/div><\/div>/i,
        '<div id="root"></div>'
      )
  );
}

/**
 * Inject into an EMPTY #root only. Returns html unchanged when there is nothing to do.
 *
 * If the shell ALREADY ships a REAL <h1> outside #root, the block's own <h1> is
 * demoted to <h2> so the page does not end up with two.
 *
 * 🔴 `<noscript>` is stripped before that test, and that exclusion is the whole
 * point. laplandvisit's shell carries `<noscript>…<h1>LaplandVisit</h1>…`, which
 * a raw `grep -o '<h1'` counts but no crawler does. Demoting on account of it
 * left the page with NO heading a crawler can see: OpenSEO went from
 * missing-h1 0/100 to 100/100. Measured, not reasoned — the first version of
 * this guard shipped on the grep count and made the page worse than before the
 * feature existed.
 */
export function injectCrawlableBody(html, block) {
  if (!block) return html;
  const shellHasH1 = /<h1[\s>]/i.test(
    html
      .replace(/<div id="root">[\s\S]*?<\/div>/i, '')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
  );
  const b = shellHasH1
    ? block.replace(/<h1( style="[^"]*")?>/i, '<h2$1>').replace('</h1>', '</h2>')
    : block;
  return html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${b}</div>`);
}
