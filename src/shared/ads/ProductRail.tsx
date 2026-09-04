import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PartnerSnapshot } from './data/partnerTypes'

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
// ─── COPY RULES (these are the fix, not style preferences) ──────────────────
//   1. HEADLINE = ONE clause. Never "Slogan. Fact." Two sentences in a heading
//      always wrap to three ragged lines and read like generated filler.
//   2. SUB = ONE sentence, ~15 words. If it needs a second, it belongs on the
//      partner's own page.
//   3. Never a claim we cannot source. The old Ivalo card promised "yli 100
//      suomalaista ja pohjoismaista merkkiä"; the feed it advertises carries 36
//      brands, none identifiably Finnish. Sell what is actually in the rail.
//   4. text-balance on the heading and a max width on the paragraph, always —
//      without them the lines break where the viewport says, not where the
//      sentence does.
//
// ─── LAYOUT ────────────────────────────────────────────────────────────────
// ONE horizontally scrolled row at every width. Never a grid: the grid version
// of this component measured 1154 px tall for one advertiser, which is more
// than a phone screen and breaks the network rule that ads stay proportional to
// the body they sit in. This is ~460 px with the same eight products.
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
  /** Advertiser or category line above the heading. 2–4 words. */
  eyebrow: string
  /** ONE clause. See COPY RULES 1. */
  headline: string
  /** ONE sentence. See COPY RULES 2. */
  sub: string
  /** "from" / "alk." — empty renders no qualifier. */
  from: string
  /** ja/zh/ko put the marker AFTER the number (41 €〜 / 起 / 부터). */
  fromAfter?: boolean
  /** Text link in the header row, e.g. "Katso koko valikoima". */
  ctaAll: string
  /** Fine print: price date + anything the advertiser requires. {date} is
   *  substituted from the snapshot; never hardcode a date. */
  note: string
}

export interface RailPartner {
  /** Worker route key, e.g. 'suomikauppa' — also the analytics key. */
  key: string
  /** Landing page for the "see everything" link, per shop locale where the
   *  partner runs several; a single string when it runs one. */
  categoryUrl: string | Partial<Record<RailLang, string>>
  /** Locale whose products carry `localName` (the shop's own language), if the
   *  feed speaks a different language than the shop. */
  localNameLang?: RailLang
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
  const accent = dark ? partner.accentDark : partner.accent
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

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border ${
        dark ? 'border-white/10 bg-white/[0.04]' : 'border-black/10 bg-white'
      } ${className}`}
      aria-label={`${c.headline} — ${AD_LABEL[lang] ?? 'Ad'}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: partner.accent }}
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} aria-hidden="true" />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: accent }}
            >
              {c.eyebrow}
            </span>
          </div>
          <a
            href={allHref}
            target="_blank"
            rel="sponsored nofollow noopener"
            onClick={() => onCtaClick?.(partner.key, `product_rail:${sid}_all`, allHref)}
            className="group inline-flex items-center gap-1 text-xs font-semibold no-underline underline-offset-4 hover:underline"
            style={{ color: accent }}
          >
            {c.ctaAll}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>

        {/* text-balance + a max width: without both, a heading breaks where the
            viewport happens to end. COPY RULE 4. */}
        <h2
          className={`font-heading text-xl sm:text-2xl tracking-wide leading-tight mt-1.5 max-w-xl text-balance ${
            dark ? 'text-snow' : 'text-[#141413]'
          }`}
        >
          {c.headline}
        </h2>
        <p className={`mt-1.5 max-w-xl text-[13px] leading-snug text-pretty ${dark ? 'text-white/65' : 'text-black/65'}`}>
          {c.sub}
        </p>

        <ul className="mt-4 -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2">
          {snapshot.products.map((p) => {
            // The shop's own language for that one locale; the feed's title
            // everywhere else. Both come from the partner, neither is ours.
            const label =
              partner.localNameLang === lang && p.localName ? p.localName : p.name
            const placement = `${sid}_${p.sku}`
            const href = linkFor(p.url, placement)
            return (
              <li key={p.sku} className="w-[46vw] max-w-[10.5rem] shrink-0 snap-start sm:w-[10.5rem]">
                <a
                  href={href}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  onClick={() => onCtaClick?.(partner.key, `product_rail:${placement}`, href)}
                  className={`group flex h-full flex-col overflow-hidden rounded-xl border no-underline transition-all duration-200 hover:-translate-y-0.5 ${
                    dark
                      ? 'border-white/10 bg-white/[0.03] hover:border-white/25'
                      : 'border-black/[0.08] bg-white hover:shadow-lg'
                  }`}
                  style={{ borderColor: undefined }}
                >
                  <div className="aspect-square w-full overflow-hidden bg-white">
                    <img
                      src={p.image}
                      alt={label}
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={640}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-2.5">
                    <span
                      className={`line-clamp-2 text-[12px] font-semibold leading-snug ${
                        dark ? 'text-snow' : 'text-[#141413]'
                      }`}
                    >
                      {label}
                    </span>
                    <span className="mt-auto flex items-baseline gap-1">
                      {c.from && !c.fromAfter ? (
                        <span className={`text-[10px] ${dark ? 'text-white/50' : 'text-black/45'}`}>{c.from}</span>
                      ) : null}
                      <span className="text-[13px] font-bold" style={{ color: accent }}>
                        {fmtPrice(p.price)}
                      </span>
                      {c.from && c.fromAfter ? (
                        <span className={`text-[10px] ${dark ? 'text-white/50' : 'text-black/45'}`}>{c.from}</span>
                      ) : null}
                    </span>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>

        <p className={`mt-3 text-[11px] leading-snug ${dark ? 'text-white/45' : 'text-black/45'}`}>
          {c.note.replace('{date}', snapshot.fetchedAt)}
        </p>

        {disclosure ? <div className="mt-3">{disclosure}</div> : null}
      </div>

      <span
        className="absolute bottom-3.5 right-4 z-10 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{
          backgroundColor: dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)',
          color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',
        }}
      >
        {AD_LABEL[lang] ?? 'Ad'}
      </span>
    </section>
  )
}
