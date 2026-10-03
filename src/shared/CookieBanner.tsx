import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/*
  Pole on LEFT, flag flies RIGHT.
  Grid: 5fr | 3fr | 10fr
    col 1 (5fr):  hoist, narrow white, near pole, empty
    col 2 (3fr):  blue cross (vertical stripe)
    col 3 (10fr): fly side, wide white, holds all content

  Mobile:  pole left:15px (6px wide) → right edge 21px; banner left:27px → gap 6px
  Desktop: pole left:45px (5px wide) → right edge 50px; banner left:56px → gap 6px
  Pole height = bannerBottom + bannerHeight (finial at banner top edge)
*/

/**
 * Optional dictionary of UI strings for the cookie banner. Pass `dict` to
 * localise the four user-visible strings (label, body, decline, accept). If
 * omitted, English defaults are used (backwards-compatible).
 *
 * Common usage: pick the right entry from `COOKIE_BANNER_LOCALES` based on
 * the current URL locale, e.g. `<CookieBanner dict={COOKIE_BANNER_LOCALES[lang]} />`.
 */
export interface CookieBannerDict {
  label?: string;       // "Cookies" eyebrow
  body?: string;        // "We use cookies to improve your experience."
  policyLink?: string;  // "Cookie Policy"
  decline?: string;     // "Decline"
  accept?: string;      // "Accept"
  ariaLabel?: string;   // dialog aria-label, e.g. "Cookie consent"
}

/**
 * Built-in 12-language translations matching the LaplandVibes ecosystem
 * (en, fi, de, ja, es, pt-BR, zh-CN, ko, fr, it, nl, sv). Use these as either
 * `dict` directly, or as the source for per-site overrides.
 *
 * Legally important: this banner is the FIRST consent prompt a non-English
 * visitor sees. Showing English copy on /kr /fr /it /nl /sv is a GDPR + ePrivacy
 * problem (consent must be given in a language the user understands).
 */
export const COOKIE_BANNER_LOCALES: Record<string, Required<CookieBannerDict>> = {
  en:      { label: 'Cookies',  body: 'We use cookies to improve your experience.',         policyLink: 'Cookie Policy', decline: 'Decline',  accept: 'Accept',    ariaLabel: 'Cookie consent' },
  fi:      { label: 'Evästeet', body: 'Käytämme evästeitä parantaaksemme käyttökokemustasi.', policyLink: 'Evästekäytäntö', decline: 'Hylkää',   accept: 'Hyväksy',   ariaLabel: 'Evästeiden hyväksyntä' },
  de:      { label: 'Cookies',  body: 'Wir verwenden Cookies, um Ihr Erlebnis zu verbessern.', policyLink: 'Cookie-Richtlinie', decline: 'Ablehnen', accept: 'Akzeptieren', ariaLabel: 'Cookie-Einwilligung' },
  ja:      { label: 'クッキー', body: '体験を向上させるためにクッキーを使用しています。',           policyLink: 'クッキーポリシー', decline: '拒否',     accept: '同意する',  ariaLabel: 'クッキーの同意' },
  es:      { label: 'Cookies',  body: 'Utilizamos cookies para mejorar su experiencia.',     policyLink: 'Política de Cookies', decline: 'Rechazar', accept: 'Aceptar',   ariaLabel: 'Consentimiento de cookies' },
  'pt-BR': { label: 'Cookies',  body: 'Usamos cookies para melhorar sua experiência.',        policyLink: 'Política de Cookies', decline: 'Recusar',  accept: 'Aceitar',   ariaLabel: 'Consentimento de cookies' },
  'zh-CN': { label: 'Cookie',   body: '我们使用 Cookie 来改善您的体验。',                       policyLink: 'Cookie 政策',  decline: '拒绝',     accept: '接受',      ariaLabel: 'Cookie 同意' },
  ko:      { label: '쿠키',     body: '더 나은 경험을 위해 쿠키를 사용합니다.',                  policyLink: '쿠키 정책',    decline: '거부',     accept: '동의',      ariaLabel: '쿠키 동의' },
  fr:      { label: 'Cookies',  body: 'Nous utilisons des cookies pour améliorer votre expérience.', policyLink: 'Politique des cookies', decline: 'Refuser',  accept: 'Accepter',  ariaLabel: 'Consentement aux cookies' },
  it:      { label: 'Cookie',   body: 'Utilizziamo i cookie per migliorare la Sua esperienza.', policyLink: 'Informativa sui Cookie', decline: 'Rifiuta',  accept: 'Accetta',   ariaLabel: 'Consenso ai cookie' },
  nl:      { label: 'Cookies',  body: 'We gebruiken cookies om uw ervaring te verbeteren.',   policyLink: 'Cookiebeleid', decline: 'Weigeren', accept: 'Accepteren', ariaLabel: 'Cookietoestemming' },
  sv:      { label: 'Cookies',  body: 'Vi använder cookies för att förbättra din upplevelse.', policyLink: 'Cookiepolicy', decline: 'Avvisa',   accept: 'Acceptera', ariaLabel: 'Samtycke till cookies' },
};

const DEFAULT_DICT: Required<CookieBannerDict> = COOKIE_BANNER_LOCALES.en;

/*
  Desktop flag position. The masthead flag used to stand in one place (left,
  220px up), and on a first visit it covered the hero heading, lead or main
  button on 22 of 28 front pages at 1440x900-1920x1080 (measured 2026-10-03).
  When it appears it now looks for a spot with no text or control under it:
  first the designed spot, then the same height on the right, then 24px from
  the bottom on either side, then the left and right edges at other heights
  (nearest to the designed height first), then along the bottom edge. Pages
  where the designed spot was already clear look exactly as before. If no spot
  is clear, the one that covers the least wins (headings, links, buttons and
  fixed widgets weigh more). The flag never rises over the top bar.
  The geometry must match the desktop CSS below: card 330px wide at 18:11,
  pole 9px left of the card and standing on the bottom edge.
*/
type FlagSpot = { left: number; bottom: number };
const FLAG_W = 330;
const FLAG_H = (FLAG_W * 11) / 18;
const FLAG_MQ = '(min-width: 1024px) and (min-height: 900px)';
const FLAG_BLOCKERS = 'h1,h2,h3,p,a,button,input,select,textarea,label,li,figcaption';
const FLAG_HEAVY = /^(H1|H2|A|BUTTON|INPUT|SELECT)$/;

function pickFlagSpot(): FlagSpot | null {
  if (typeof window === 'undefined' || !window.matchMedia(FLAG_MQ).matches) return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const shown = (el: Element) =>
    (el as Element & { checkVisibility?: (o: object) => boolean })
      .checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) !== false;
  const inView = (r: DOMRect) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < vh;
  const obstacles: [DOMRect, number][] = [];
  const root = document.querySelector('main') ?? document.body;
  root.querySelectorAll(FLAG_BLOCKERS).forEach((el) => {
    if (el.closest('.lv-banner, .lv-sheet')) return;
    const r = el.getBoundingClientRect();
    if (!inView(r)) return;
    if (!el.textContent?.trim() && !/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(el.tagName)) return;
    if (!shown(el)) return;
    obstacles.push([r, FLAG_HEAVY.test(el.tagName) ? 3 : 1]);
  });
  // Fixed and sticky boxes anywhere on the page: side-rail ads, chat and toast widgets.
  // A full-width one at the top is the site's top bar: the flag stays below it.
  let topBar = 64;
  document.body.querySelectorAll('*').forEach((el) => {
    if (el.closest('.lv-banner, .lv-pole, .lv-sheet')) return;
    const pos = getComputedStyle(el).position;
    if (pos !== 'fixed' && pos !== 'sticky') return;
    const r = el.getBoundingClientRect();
    if (!inView(r) || r.width * r.height > vw * vh * 0.5 || !el.textContent?.trim() || !shown(el)) return;
    if (r.top <= 0 && r.width > vw * 0.8) topBar = Math.max(topBar, r.bottom);
    obstacles.push([r, 3]);
  });
  document.querySelectorAll('header').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < 10 && r.height < 200) topBar = Math.max(topBar, r.bottom);
  });
  const left = 49;
  const right = vw - 49 - FLAG_W;
  const highest = vh - FLAG_H - topBar - 16;
  const spots: [number, number][] = [[left, 220], [right, 220], [left, 24], [right, 24]];
  const heights: number[] = [];
  for (let b = 48; b <= highest; b += 24) heights.push(b);
  heights.sort((a, c) => Math.abs(a - 220) - Math.abs(c - 220) || a - c);
  for (const b of heights) spots.push([left, b], [right, b]);
  for (let x = left + 40; x < right; x += 40) spots.push([x, 24]);
  let best = spots[0];
  let bestScore = Infinity;
  for (const spot of spots) {
    const [x, b] = spot;
    const y = vh - b - FLAG_H;
    let score = 0;
    for (const [r, weight] of obstacles) {
      const w = Math.min(x + FLAG_W + 8, r.right) - Math.max(x - 17, r.left);
      const h = Math.min(y + FLAG_H + 8, r.bottom) - Math.max(y - 8, r.top);
      if (w > 4 && h > 4) score += weight;
    }
    if (score === 0) return { left: x, bottom: b };
    if (score < bestScore) {
      best = spot;
      bestScore = score;
    }
  }
  return { left: best[0], bottom: best[1] };
}

interface CookieBannerProps {
  consentKey?: string;
  /**
   * Optional locale code (en | fi | de | ja | es | pt-BR | zh-CN | ko | fr | it | nl | sv).
   * When provided, the banner auto-picks copy from the built-in
   * `COOKIE_BANNER_LOCALES` table. Overridden by an explicit `dict`.
   */
  lang?: string;
  /** Explicit translation dictionary. Wins over `lang`. */
  dict?: CookieBannerDict;
  /**
   * Optional locale-prefixed cookie-policy path, e.g. `/kr/cookie-policy`.
   * Defaults to `/cookie-policy`. Pass this when the site uses locale URL
   * prefixes so the consent link doesn't dump the visitor back to English.
   */
  policyHref?: string;
}

export default function CookieBanner({
  consentKey = 'laplandvibes_cookie_consent',
  lang,
  dict,
  policyHref,
}: CookieBannerProps) {
  // Keep the policy link in the visitor's locale: derive the URL prefix from the
  // first path segment (fi/de/ja/es/br/cn/kr/fr/it/nl/sv) unless an explicit
  // policyHref is passed. A bare /cookie-policy would dump a /fr visitor to EN.
  const { pathname } = useLocation();
  const _seg = pathname.split('/')[1] || '';
  const _href = policyHref ?? (/^(fi|de|ja|es|br|cn|kr|fr|it|nl|sv)$/.test(_seg) ? `/${_seg}/cookie-policy` : '/cookie-policy');
  const D: Required<CookieBannerDict> = {
    ...DEFAULT_DICT,
    ...(lang && COOKIE_BANNER_LOCALES[lang] ? COOKIE_BANNER_LOCALES[lang] : {}),
    ...(dict ?? {}),
  };
  const [visible, setVisible]       = useState(false);
  const [dismissing, setDismissing] = useState(false);

  // Place the desktop flag before it is painted, again on a route change and on resize.
  const [spot, setSpot] = useState<FlagSpot | null>(null);
  useLayoutEffect(() => {
    if (!visible) return;
    setSpot(pickFlagSpot());
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSpot(pickFlagSpot()), 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [visible, pathname]);

  useEffect(() => {
    if (!localStorage.getItem(consentKey)) {
      const t = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(t);
    }
  }, [consentKey]);

  const dismiss = (value: 'accepted' | 'declined') => {
    setDismissing(true);
    setTimeout(() => {
      localStorage.setItem(consentKey, value);
      setVisible(false);
      setDismissing(false);
    }, 850);
  };

  const accept = () => {
    dismiss('accepted');
    (window as any).gtag?.('consent', 'update', { analytics_storage: 'granted' });
  };
  const decline = () => dismiss('declined');

  if (!visible) return null;

  return (
    <>
      {/* ══ PHONE LAYOUT ══
          🔴 Why phones get their own arrangement instead of a smaller flag.
          The flag is locked to 18:11 and the consent copy lives in the middle
          stripe, which is 3/11 of the height — so the card's height is decided by
          how many lines the LONGEST locale needs, and 330px is the narrowest width
          where French still lands in 3 lines at the 12px legibility floor. That
          makes the card ~202px tall on a 375px screen. Measured on a first visit,
          a 202px card docked at the bottom of a 667px phone still lands squarely on
          the hero booking buttons: laplandstays "Hotellit ja mökit" 97% covered,
          activities "Varaa aktiviteetti" invisible. There is no offset that fixes
          that — the card is simply taller than the gap beneath the CTAs.
          So on phones the copy moves OUT of the stripe and gets the full bar width,
          which drops the whole thing to ~110px and clears the CTA band outright.
          The flag, the pole, the finial, the rise animation and every string stay.
          Desktop (>= 1024px) is untouched: there the masthead card has room and
          reads the way it was designed to. A portrait tablet (768x1024) counts as a
          phone here, because 1024px of height is not enough for the masthead. */}
      <div
        className="lv-sheet fixed inset-x-0 bottom-0 z-[9999] border-t border-[#002F6C]/50 bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.45)]"
        style={{
          animation: dismissing
            ? 'cookieSheetLower 0.6s ease-in forwards'
            : 'cookieSheetRise 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        role="dialog"
        aria-label={D.ariaLabel}
        aria-modal="true"
      >
        <div className="flex items-stretch gap-3 px-4 py-3">
          {/* The flag, still on its pole — same 18:11 Nordic cross, just small
              enough to be an emblem rather than the container. */}
          <div className="shrink-0 flex items-stretch gap-1.5" aria-hidden="true">
            <div className="relative w-[3px] rounded-full" style={{ background: 'linear-gradient(to bottom, #94a3b8 0%, #64748b 50%, #475569 100%)' }}>
              <div
                className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full"
                style={{ background: 'radial-gradient(circle at 35% 35%, #e2e8f0, #64748b)', boxShadow: '0 1px 3px rgba(0,0,0,0.45)' }}
              />
            </div>
            <div
              className="w-[54px] h-[33px] grid overflow-hidden rounded-sm border border-[#002F6C]/40 self-start"
              style={{ gridTemplateColumns: '5fr 3fr 10fr', gridTemplateRows: '4fr 3fr 4fr', animation: 'cookieFlagFlutter 3.5s ease-in-out 1s infinite', transformOrigin: 'left center' }}
            >
              <div className="bg-white" /><div className="bg-[#002F6C]" /><div className="bg-white" />
              <div className="bg-[#002F6C]" /><div className="bg-[#002F6C]" /><div className="bg-[#002F6C]" />
              <div className="bg-white" /><div className="bg-[#002F6C]" /><div className="bg-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="lv-body text-[#0b1220] leading-[1.35]">
              {D.body}{' '}
              <Link to={_href} className="lv-policy text-[#002F6C] underline font-semibold">
                {D.policyLink}
              </Link>
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={decline}
                className="lv-btn flex-1 text-[#002F6C] font-semibold border border-[#002F6C]/35 rounded-sm hover:bg-[#002F6C]/10 transition-colors cursor-pointer"
              >
                {D.decline}
              </button>
              <button
                onClick={accept}
                className="lv-btn flex-1 bg-[#002F6C] text-white font-bold rounded-sm hover:bg-[#001a4a] transition-colors cursor-pointer"
              >
                {D.accept}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ DESKTOP LAYOUT — the masthead flag, unchanged ══ */}
      {/* ── Flagpole, LEFT side ── */}
      <div
        className="lv-pole fixed bottom-0 z-[9997] pointer-events-none"
        style={spot ? { left: spot.left - 9, right: 'auto', height: Math.round(spot.bottom + FLAG_H + 8) } : undefined}
      >
        {/* Ball finial */}
        <div
          className="lv-finial absolute rounded-full"
          style={{
            left: '50%', transform: 'translateX(-50%)',
            background: 'radial-gradient(circle at 35% 35%, #e2e8f0, #64748b)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.45)',
          }}
        />
        {/* Shaft */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, #94a3b8 0%, #64748b 50%, #475569 100%)' }}
        />
      </div>

      {/* ── Outer div: rise / lower (translateY) ── */}
      <div
        className="lv-banner fixed z-[9999]"
        style={{
          ...(spot ? { left: spot.left, right: 'auto', bottom: spot.bottom } : {}),
          animation: dismissing
            ? 'cookieFlagLower 0.8s ease-in forwards'
            : 'cookieFlagRise 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        }}
        role="dialog"
        aria-label={D.ariaLabel}
        aria-modal="true"
      >
        {/* ── Inner div: flutter (skewY, pivot at hoist/LEFT side) ── */}
        <div style={{ transformOrigin: 'left center', animation: 'cookieFlagFlutter 3.5s ease-in-out 1.6s infinite' }}>

          {/* Rope container */}
          <div className="lv-card" style={{ position: 'relative' }}>

            {/* Top rope, banner top-left corner → pole */}
            <div
              className="lv-rope"
              style={{
                position: 'absolute', top: 6, left: -9,
                transformOrigin: 'left center',
                transform: 'rotate(2deg)',
              }}
            />
            {/* Bottom rope, banner bottom-left corner → pole */}
            <div
              className="lv-rope"
              style={{
                position: 'absolute', bottom: 6, left: -9,
                transformOrigin: 'left center',
                transform: 'rotate(-2deg)',
              }}
            />

            {/*
              Nordic cross, hoist on LEFT (near pole)
              Columns: 5fr | 3fr | 10fr
              Rows:     4fr | 3fr | 4fr
            */}
            <div
              className="overflow-hidden rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.6)] border border-[#002F6C]/40 h-full grid"
              style={{ gridTemplateColumns: '5fr 3fr 10fr', gridTemplateRows: '4fr 3fr 4fr' }}
            >
              {/* Row 1 */}
              <div className="bg-white" />               {/* hoist, empty */}
              <div className="bg-[#002F6C]" />
              <div className="bg-white flex items-center px-2 md:px-3">
                <p className="lv-label text-[#002F6C] font-extrabold tracking-[0.22em] uppercase">{D.label}</p>
              </div>

              {/* Row 2, horizontal stripe */}
              <div className="bg-[#002F6C]" />
              <div className="bg-[#002F6C]" />
              <div className="bg-[#002F6C] flex items-center px-2 md:px-3">
                <p className="lv-body text-white leading-[1.35]">
                  {D.body}{' '}
                  <Link to={_href} className="lv-policy underline opacity-80 hover:opacity-100 transition-opacity">
                    {D.policyLink}
                  </Link>
                </p>
              </div>

              {/* Row 3 */}
              <div className="bg-white" />               {/* hoist, empty */}
              <div className="bg-[#002F6C]" />
              <div className="bg-white flex items-center justify-start gap-2 px-2 md:px-3">
                <button
                  onClick={decline}
                  className="lv-btn text-[#002F6C] font-semibold border border-[#002F6C]/35 rounded-sm hover:bg-[#002F6C]/10 transition-colors cursor-pointer"
                >
                  {D.decline}
                </button>
                <button
                  onClick={accept}
                  className="lv-btn bg-[#002F6C] text-white font-bold rounded-sm hover:bg-[#001a4a] transition-colors cursor-pointer"
                >
                  {D.accept}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Mobile ── (fixed pixel bottoms so mobile browser chrome resize does not displace the flag)
           Card width 330px: the flag keeps the Finnish 18:11 ratio and the copy sits in the
           middle stripe (3/11 of the height), so the width sets how many 12px lines fit.
           330px is the narrowest width at which the longest locale (fr) fits in 3 lines. */
        /* On phones the banner sits 14px from the bottom edge. The card is ~200px tall at
           375px (18:11 ratio, 330px width floor), so every pixel of offset comes out of the
           visible hero, and a raised card covers the hero's booking buttons. */
        /* The masthead flag is gated on height as well as width: on a short window the
           hero's booking buttons sit near the bottom, where a docked ~200px card lands.
           No offset works at every height, so windows under 900px tall get the compact bar. */
        .lv-pole   { width: 3px; left: 12px; height: 240px; display: none; }
        .lv-banner { display: none; }
        .lv-sheet  { display: block; }
        .lv-finial { top: -4px; width: 8px; height: 8px; }
        .lv-banner { left: 20px; bottom: 14px; }
        .lv-card   { width: min(330px, calc(100vw - 42px)); aspect-ratio: 18/11; }
        .lv-rope   { width: 7px; height: 1.5px; background: #334155; border-radius: 1px; }
        .lv-label  { font-size: 12px; letter-spacing: 0.1em; }
        .lv-body   { font-size: 12px; }
        /* 44x44 minimum touch target (WCAG 2.5.5). */
        .lv-btn    { font-size: 12px; padding: 0 10px; min-height: 44px; min-width: 44px;
                     display: inline-flex; align-items: center; justify-content: center; }
        /* Inline consent-policy link: vertical padding grows the hit rect to 44px
           without touching the line box, so the stripe copy keeps its layout.
           15px, not 14px: an inline box's rect is the font's own height (~14.4px
           at 12px), not the 1.35 line box, so 14px gives a 43px target. */
        .lv-policy { padding-top: 15px; padding-bottom: 15px; }

        /* ── Desktop ── */
        /* 1024px, not 768px: a portrait tablet (768x1024) is wide enough for a 768px
           breakpoint but too short for the masthead flag at bottom:220px, which would
           cover the hero CTA strip. Touch-sized viewports get the docked bar. */
        @media (min-width: 1024px) and (min-height: 900px) {
          .lv-pole   { width: 4px; left: 40px; height: 430px; display: block; }
          .lv-finial { top: -5px; width: 10px; height: 10px; }
          .lv-banner { left: 49px; bottom: 220px; display: block; }
          .lv-sheet  { display: none; }
          .lv-card   { width: 330px; }
          .lv-rope   { width: 9px; height: 2px; }
          .lv-label  { font-size: 10.5px; letter-spacing: 0.16em; }
          .lv-body   { font-size: 11.5px; }
          /* min-*: 0 resets the mobile 44px touch floor so the desktop pill keeps
             its original ~28px height. Do not drop these two resets. */
          .lv-btn    { font-size: 11.5px; padding: 6px 13px; min-height: 0; min-width: 0; }
          .lv-policy { padding-top: 0; padding-bottom: 0; }
        }

        /* The phone bar slides its own height, not a viewport height: it is docked
           to the bottom edge, so a 100vh travel would start it a full screen below
           and waste most of the animation off-camera. */
        @keyframes cookieSheetRise {
          from { transform: translateY(110%); }
          to   { transform: translateY(0); }
        }
        @keyframes cookieSheetLower {
          from { transform: translateY(0); }
          to   { transform: translateY(110%); }
        }
        @keyframes cookieFlagRise {
          from { transform: translateY(100vh); }
          to   { transform: translateY(0); }
        }
        @keyframes cookieFlagLower {
          from { transform: translateY(0); }
          to   { transform: translateY(100vh); }
        }
        @keyframes cookieFlagFlutter {
          0%, 100% { transform: skewY(0deg); }
          20%      { transform: skewY(-1.3deg); }
          55%      { transform: skewY(0.7deg); }
          80%      { transform: skewY(-0.5deg); }
        }
      `}</style>
    </>
  );
}
