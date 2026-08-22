import { Link, useLocation } from 'react-router-dom'

/**
 * Canonical ecosystem breadcrumb ("murupolku"). One shared component, injected
 * ONCE per site at App level, it reads the current route, strips the locale
 * prefix, and renders a 2-level VISIBLE trail (Home › Page). Hidden on the home
 * route. The BreadcrumbList JSON-LD is NOT emitted here, the shared prerenderer
 * (_prerender_routes.mjs) already injects a server-rendered one into <head> for
 * every non-home page, which is the SEO-preferred (static-HTML) source.
 *
 * Palette-agnostic: the trail text uses the INHERITED text colour (currentColor)
 * with opacity for hierarchy, so each site only passes a `className` that sets
 * the colour to match its own bg (deep-night sites → `text-snow`, cream/light
 * variants → `text-deep-night`). Per-site personality is welcome; the markup
 * and a11y stay identical across the network.
 */

export type BcLang = 'en' | 'fi' | 'de' | 'ja' | 'es' | 'pt-BR' | 'zh-CN' | 'ko' | 'fr' | 'it' | 'nl' | 'sv'

// Localized "Home", so individual sites don't each redefine it.
const HOME_LABEL: Record<BcLang, string> = {
  en: 'Home', fi: 'Etusivu', de: 'Startseite', ja: 'ホーム', es: 'Inicio',
  'pt-BR': 'Início', 'zh-CN': '首页', ko: '홈', fr: 'Accueil', it: 'Home', nl: 'Home', sv: 'Hem',
}

// Localized aria-label for the <nav> landmark.
const NAV_ARIA: Record<BcLang, string> = {
  en: 'Breadcrumb', fi: 'Murupolku', de: 'Brotkrümelnavigation', ja: 'パンくずリスト',
  es: 'Ruta de navegación', 'pt-BR': 'Trilha de navegação', 'zh-CN': '面包屑导航',
  ko: '탐색 경로', fr: "Fil d'Ariane", it: 'Percorso di navigazione', nl: 'Kruimelpad', sv: 'Brödsmulor',
}

// Same locale segments every LV site routes on (en is unprefixed).
const PREFIX_RE = /^\/(fi|de|ja|es|br|cn|kr|fr|it|nl|sv)(?=\/|$)/

export interface BreadcrumbsProps {
  /** Active UI language. */
  lang: BcLang
  /** Locale-path helper (from each site's useLocalePath) so links carry /fi, /de … */
  to: (path: string) => string
  /**
   * Logical path (no locale prefix, leading slash) → localized page label.
   * e.g. { '/hiking-trails': c.nav.hiking, '/wildlife': c.nav.wildlife }.
   * Routes not present here (e.g. 404) render no breadcrumb.
   * Use this for App-level injection (one shell maps every subpage). When a page
   * already knows its own localized title, pass `currentLabel` instead.
   */
  labelMap?: Record<string, string>
  /**
   * Explicit localized label for the current page, overrides `labelMap`. Handy
   * when injecting inside a shared PageHero/Layout that already receives the
   * page title, so no per-route map is needed.
   */
  currentLabel?: string
  /** Container colour/typography classes; default suits a light background. */
  className?: string
  /** Extra hover treatment for links, e.g. "hover:text-vibe-pink hover:opacity-100". */
  accentClassName?: string
  /**
   * Inner-list layout classes (max-width / horizontal padding) so the trail can
   * line up with a page whose content container isn't the default `max-w-7xl
   * px-4 sm:px-6` (e.g. the blog uses `max-w-6xl px-6 md:px-12 lg:px-20`).
   * Only the width/padding part is overridable; the flex/typography stays fixed.
   */
  containerClassName?: string
}

export default function Breadcrumbs({
  lang,
  to,
  labelMap,
  currentLabel,
  className = 'text-deep-night',
  accentClassName = 'hover:opacity-100 hover:underline',
  containerClassName = 'max-w-7xl mx-auto px-4 sm:px-6',
}: BreadcrumbsProps) {
  const { pathname } = useLocation()

  // Locale prefix → logical path (leading slash, no trailing slash except root).
  let logical = pathname.replace(PREFIX_RE, '')
  if (logical === '') logical = '/'
  if (logical.length > 1) logical = logical.replace(/\/$/, '')

  if (logical === '/') return null // home: no breadcrumb
  const label = currentLabel ?? labelMap?.[logical]
  if (!label) return null // unmapped (e.g. NotFound): skip rather than show an ugly slug

  // NOTE: the shared prerenderer (_prerender_routes.mjs) already injects a
  // server-rendered BreadcrumbList JSON-LD into <head> for every non-home page,
  // which is the SEO-preferred (static-HTML) source. This component therefore
  // renders the VISIBLE trail only, emitting schema here would duplicate it.
  const crumbs = [
    { name: HOME_LABEL[lang], href: to('/'), current: false },
    { name: label, href: to(logical), current: true },
  ]

  return (
    <nav aria-label={NAV_ARIA[lang]} className={`w-full ${className}`}>
      <ol className={`${containerClassName} py-3 flex items-center flex-wrap gap-x-2 gap-y-1 text-sm font-body`}>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-x-2 min-w-0">
            {i > 0 && <span aria-hidden="true" className="opacity-40 select-none">›</span>}
            {c.current ? (
              <span aria-current="page" className="font-semibold truncate">{c.name}</span>
            ) : (
              <Link to={c.href} className={`opacity-70 transition-all ${accentClassName}`}>{c.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
