import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PartnerSnapshot } from './data/partnerTypes'
import partnerBrand from './data/partnerBrand'

// ─────────────────────────────────────────────────────────────────────────────
// ProductRail — the reusable version of the Kalevala carousel, for any partner
// with a product feed. Vesa 2026-09-04: "eikö tähänkin karuselli, samoin kuin
// kalevala. onnistuu varmasti myös daisycon puolella." It does; the feed dialect
// is the sync script's problem (scripts/sync_partner_feeds.mjs), and by the time
// the snapshot reaches here every partner looks the same.
//
// WHY A RAIL AND NOT A BRAND CARD. A card shows a logo and a claim; a rail shows
// the goods, the price and a link to the exact item. The two ads this replaced
// were the ones Vesa called "paska mainos" and "liian tekoälymäinen" — and the
// reason was structural, not decorative: their headlines were two sentences
// (a slogan plus a fact), which cannot be typeset. See COPY RULES below.
//
// ─── BRAND (Vesa 2026-09-05) ───────────────────────────────────────────────
// "kaikki mainokset lähtökohtaisesti pitää olla heidän brändivärien mukaiset."
// Measured against the 18 shops: 14 of them have a black or grey logotype and
// no house colour at all. So the brand carrier here is the LOGO (the network's
// own file for the advertiser, never AI, never stock), and the accent is
// measured from that logo by scripts/partner_logos.mjs: a saturated logo colour
// becomes the accent (Jollyroom pink, Suomikauppa blue); a monochrome logo
// keeps the rail in ink, exactly like the shop's own site. Nothing is invented.
// The `accent` fields on RailPartner are only the fallback for a key that has
// no measured brand yet.
//
// Why this is safe: colour and logo identify the advertiser, which is what an
// affiliate placement is for. Two things stay off-limits regardless: the
// partner's logo is never altered (only trimmed and scaled), and the accent is
// never used for text that fails AA — text colours are darkened/lightened to
// 4.5:1 in partner_logos.mjs, and price/CTA fall back to ink when the brand
// has none.
//
// ─── FEEL (Vesa 2026-09-05) ────────────────────────────────────────────────
// "vähän ilmaa, enemmän pyöreyttä, flow-meininkiä, vähän kuin ne kelluisi,
// varjostusta raameihin." 28 px radius on the frame, 20 px on the cards,
// layered shadows that read as elevation instead of a border, 24–32 px of
// padding, and a hover that lifts the card 3 px on a strong ease-out. Motion is
// transform + opacity only, 200 ms, and gated behind hover-capable pointers and
// prefers-reduced-motion (emil-design-eng: CSS-first, ease-out, under 300 ms).
//
// ─── COPY RULES (these are the fix, not style preferences) ──────────────────
//   1. HEADLINE = ONE clause. Never "Slogan. Fact." Two sentences in a heading
//      always wrap to three ragged lines and read like generated filler.
//   2. SUB = ONE sentence, ~15 words. If it needs a second, it belongs on the
//      partner's own page. Brands named in the sub are brands, not categories
//      ("sauna" is not a brand — Vesa 5.9.), and only ones the rail shows.
//   3. Never a claim we cannot source. Sell what is actually in the rail.
//   4. text-balance on the heading and a max width on the paragraph, always.
//
// ─── LAYOUT ────────────────────────────────────────────────────────────────
// ONE horizontally scrolled row at every width. Never a grid: the grid version
// measured 1154 px tall for one advertiser. This is ~480 px with eight products.
//
// ─── CONTRACT (same as AdUnit / KalevalaRail) ──────────────────────────────
//   • No import from any site's i18n, analytics or lib.
//   • Every link goes through the redirect Worker — raw partner URLs in source
//     are forbidden network-wide, and the Worker is what tags the click.
//   • target="_blank" rel="sponsored nofollow noopener" — NO noreferrer.
//   • Affiliate clicks are NOT sent to Umami; Worker-D1 is the single truth.
// ─────────────────────────────────────────────────────────────────────────────

export type RailLang =
  | 'en' | 'fi' | 'de' | 'ja' | 'es' | 'pt-BR' | 'zh-CN' | 'ko' | 'fr' | 'it' | 'nl' | 'sv'

export interface RailCopy {
  /** Advertiser or category line above the heading. 2–4 words. Rendered as
   *  text only when the partner has no logo file. */
  eyebrow: string
  /** ONE clause. See COPY RULES 1. */
  headline: string
  /** ONE sentence. See COPY RULES 2. */
  sub: string
  /** "from" / "alk." — empty renders no qualifier. */
  from: string
  /** ja/zh/ko put the marker AFTER the number (41 €〜 / 起 / 부터). */
  fromAfter?: boolean
  /** Pill in the header row, e.g. "Katso koko valikoima". */
  ctaAll: string
  /** Fine print: price date + anything the advertiser requires. {date} is
   *  substituted from the snapshot; never hardcode a date. */
  note: string
}

export interface RailPartner {
  /** Worker route key, e.g. 'suomikauppa' — also the analytics key and the
   *  lookup key for the measured brand (logo + accent). */
  key: string
  /** Landing page for the "see everything" link, per shop locale where the
   *  partner runs several; a single string when it runs one. */
  categoryUrl: string | Partial<Record<RailLang, string>>
  /** Locale whose products carry `localName` (the shop's own language), if the
   *  feed speaks a different language than the shop. */
  localNameLang?: RailLang
  /** Fallback accents for a partner without a measured brand. */
  accent: string
  accentDark: string
  icon: LucideIcon
  copy: Partial<Record<RailLang, RailCopy>>
}

const AD_LABEL: Record<RailLang, string> = {
  en: 'Ad', fi: 'Mainos', de: 'Anzeige', ja: '広告', es: 'Anuncio',
  'pt-BR': 'Publicidade', 'zh-CN': '广告', ko: '광고', fr: 'Publicité',
  it: 'Pubblicità', nl: 'Advertentie', sv: 'Annons',
}

const INK = '#141413'
const SNOW = '#F9FAFB'
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

/** WCAG relative luminance → pick ink or snow for text on a filled pill. */
function textOn(hex: string): string {
  const f = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
  const L = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  return (L + 0.05) / 0.05 >= 4.5 ? INK : SNOW
}

export interface ProductRailProps {
  partner: RailPartner
  snapshot: PartnerSnapshot
  lang: RailLang
  /** snake_case placement, no domain — the Worker injects the site. Each
   *  product appends its SKU so clicks are attributable per item. */
  sid: string
  variant?: 'light' | 'dark'
  disclosure?: React.ReactNode
  onCtaClick?: (key: string, sid: string, url: string) => void
  className?: string
}

export default function ProductRail({
  partner, snapshot, lang, sid, variant = 'light', disclosure, onCtaClick, className = '',
}: ProductRailProps) {
  const c = partner.copy[lang] ?? partner.copy.en
  // A partner with no copy for this locale renders NOTHING rather than falling
  // back to a language the reader does not have — the same rule AdUnit follows.
  if (!c) return null

  const dark = variant === 'dark'
  const brand = partnerBrand[partner.key]
  // Measured brand wins. null accent = monochrome logo ⇒ ink, never a guess.
  const accent = brand
    ? (dark ? brand.accentDark : brand.accent) ?? (dark ? SNOW : INK)
    : (dark ? partner.accentDark : partner.accent)
  const halo = brand ? (brand.accent ?? (dark ? SNOW : INK)) : partner.accent
  const pillText = textOn(accent)
  const Icon = partner.icon

  const categoryUrl =
    typeof partner.categoryUrl === 'string'
      ? partner.categoryUrl
      : partner.categoryUrl[lang] ?? partner.categoryUrl.en ?? Object.values(partner.categoryUrl)[0]!

  const linkFor = (dest: string, placement: string) =>
    `https://go.laplandvibes.com/go/${partner.key}?sid=${encodeURIComponent(placement)}` +
    `&dest=${encodeURIComponent(dest)}`

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat(lang === 'pt-BR' ? 'pt-BR' : lang, {
      style: 'currency', currency: 'EUR', maximumFractionDigits: n % 1 === 0 ? 0 : 2,
    }).format(n)

  const allHref = linkFor(categoryUrl, `${sid}_all`)
  const ink = dark ? 'text-snow' : 'text-[#141413]'
  const muted = dark ? 'text-white/60' : 'text-black/55'
  const faint = dark ? 'text-white/40' : 'text-black/40'

  return (
    <section
      className={`relative isolate overflow-hidden rounded-[28px] ${
        dark
          ? 'bg-white/[0.045] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_28px_56px_-28px_rgba(0,0,0,0.65)]'
          : 'bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_28px_56px_-30px_rgba(15,23,42,0.28)]'
      } ${className}`}
      aria-label={`${c.headline} — ${AD_LABEL[lang] ?? 'Ad'}`}
    >
      {/* Brand halo: the one place the accent is allowed to be soft. Ink for a
          monochrome brand reads as a warm shadow, not a colour. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: halo, opacity: dark ? 0.16 : 0.09 }}
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          {brand?.logo ? (
            // The advertiser's own mark, untouched apart from trim + scale. On a
            // dark surface a black logotype needs a plate, like any real ad slot.
            <span
              className={`inline-flex h-11 items-center rounded-xl px-3 ${
                // Tumma logo tummalla pohjalla saa valkoisen laatan; vaalea logo
                // vaalealla pohjalla tumman (Nordicbuddies). Muuten ei laattaa.
                dark && brand.logoTone !== 'light'
                  ? 'bg-white shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)]'
                  : !dark && brand.logoTone === 'light'
                    ? 'bg-[#141413] shadow-[0_6px_16px_-8px_rgba(15,23,42,0.5)]'
                    : ''
              }`}
            >
              <img
                src={brand.logo}
                alt={c.eyebrow}
                width={brand.logoW}
                height={brand.logoH}
                loading="eager"
                decoding="async"
                className="h-7 w-auto max-w-[9.5rem] object-contain"
              />
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
                {c.eyebrow}
              </span>
            </span>
          )}
          <a
            href={allHref}
            target="_blank"
            rel="sponsored nofollow noopener"
            onClick={() => onCtaClick?.(partner.key, `product_rail:${sid}_all`, allHref)}
            className="group/cta hidden min-h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold no-underline sm:inline-flex shadow-[0_8px_20px_-12px_rgba(15,23,42,0.45)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_14px_28px_-14px_rgba(15,23,42,0.5)] active:scale-[0.97] motion-reduce:transition-none"
            style={{ backgroundColor: accent, color: pillText, transitionTimingFunction: EASE }}
          >
            {c.ctaAll}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </a>
        </div>

        {/* text-balance + a max width: without both, a heading breaks where the
            viewport happens to end. COPY RULE 4. */}
        <h2 className={`mt-5 max-w-xl font-heading text-2xl leading-none tracking-wide text-balance sm:text-[1.9rem] ${ink}`}>
          {c.headline}
        </h2>
        <p className={`mt-2 max-w-xl text-[14px] leading-snug text-pretty ${muted}`}>
          {c.sub}
        </p>

        <ul className="-mx-2 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-4 pt-1 [scrollbar-width:thin]">
          {snapshot.products.map((p) => {
            // The shop's own language for that one locale; the feed's title
            // everywhere else. Both come from the partner, neither is ours.
            const label =
              partner.localNameLang === lang && p.localName ? p.localName : p.name
            const placement = `${sid}_${p.sku}`
            const href = linkFor(p.url, placement)
            return (
              <li key={p.sku} className="w-[48vw] max-w-[11rem] shrink-0 snap-start sm:w-[11rem]">
                <a
                  href={href}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  onClick={() => onCtaClick?.(partner.key, `product_rail:${placement}`, href)}
                  className={`group flex h-full flex-col overflow-hidden rounded-[20px] no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                    dark
                      ? 'bg-white shadow-[0_10px_24px_-14px_rgba(0,0,0,0.7)] hover:shadow-[0_22px_40px_-18px_rgba(0,0,0,0.75)]'
                      : 'bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05),0_12px_28px_-16px_rgba(15,23,42,0.28)] hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_24px_40px_-18px_rgba(15,23,42,0.34)]'
                  }`}
                  style={{ transitionTimingFunction: EASE }}
                >
                  <div className="aspect-square w-full overflow-hidden bg-white p-3">
                    <img
                      src={p.image}
                      alt={label}
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={640}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none"
                      style={{ transitionTimingFunction: EASE }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 px-3.5 pb-3.5 pt-1">
                    <span className="line-clamp-2 text-[12.5px] font-semibold leading-snug text-[#141413]">
                      {label}
                    </span>
                    <span className="mt-auto flex items-baseline gap-1">
                      {c.from && !c.fromAfter ? (
                        <span className="text-[10.5px] text-black/45">{c.from}</span>
                      ) : null}
                      <span className="text-[14px] font-bold" style={{ color: brand?.accent ?? (brand ? INK : partner.accent) }}>
                        {fmtPrice(p.price)}
                      </span>
                      {c.from && c.fromAfter ? (
                        <span className="text-[10.5px] text-black/45">{c.from}</span>
                      ) : null}
                    </span>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>

        {/* Kapealla ruudulla otsikkorivi ei mahdu: logo + pilleri kiertyivät
            niin että pilleri jäi yksin otsikon yläpuolelle. Siksi CTA on
            mobiilissa listan alla täysleveänä, sm:stä ylöspäin otsikkorivillä. */}
        <a
          href={allHref}
          target="_blank"
          rel="sponsored nofollow noopener"
          onClick={() => onCtaClick?.(partner.key, `product_rail:${sid}_all`, allHref)}
          className="mb-4 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full px-4 text-[14px] font-semibold no-underline shadow-[0_8px_20px_-12px_rgba(15,23,42,0.45)] transition-transform duration-200 active:scale-[0.97] motion-reduce:transition-none sm:hidden"
          style={{ backgroundColor: accent, color: pillText, transitionTimingFunction: EASE }}
        >
          {c.ctaAll}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <p className={`max-w-xl text-[11px] leading-snug ${faint}`}>
            {c.note.replace('{date}', snapshot.fetchedAt)}
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
              dark ? 'bg-white/10 text-white/60' : 'bg-black/[0.05] text-black/50'
            }`}
          >
            {AD_LABEL[lang] ?? 'Ad'}
          </span>
        </div>

        {disclosure ? <div className="mt-3">{disclosure}</div> : null}
      </div>
    </section>
  )
}
