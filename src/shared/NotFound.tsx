import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// NotFound — the SHARED 404 content for the whole LV network (Vesa 2026-07-12:
// "jokaisella sivustolla brändin mukainen 404, negatiivisesta positiivinen,
// ohjaa aina takaisin päänäkymiin").
//
// Design contract:
//   • Positive framing: never a dead end — the page always offers routes onward
//     (home CTA + the site's main sections). No blame, no error jargon.
//   • Brand: big Bebas "404" kicker, deep-night default, vibe-pink CTA. Light
//     variant + accent override for design-variant sites (christmas, hoteldeals,
//     stays, carrental).
//   • Self-contained ×12 languages (incl. sv) — sites not yet routing a locale
//     simply never render it.
//   • Shared code takes NO dependency on any site's i18n/router internals:
//     pass `lang` in, pass ready-made localized `links` in. Links use plain
//     <a href> so the component works with any router (full page load on a 404
//     is fine — it IS a fresh entry point).
//   • Sets document.title + a robots noindex meta on mount (removed on unmount)
//     so wrappers don't need Helmet/SEO plumbing.
//
// Usage (per-site thin wrapper, e.g. src/pages/NotFound.tsx):
//   import SharedNotFound from '../../../shared/NotFound'
//   const lang = useLang(); const to = useLocalePath(); const nav = COPY[lang].nav
//   <SharedNotFound lang={lang} siteName="LaplandBars" homeHref={to('/')}
//     links={[{ href: to('/bars'), label: nav.bars }]} />
// ─────────────────────────────────────────────────────────────────────────────

type NfLang =
  | 'en' | 'fi' | 'de' | 'ja' | 'es' | 'pt-BR' | 'zh-CN' | 'ko' | 'fr' | 'it' | 'nl' | 'sv'

interface NfCopy {
  h1: string
  body: string
  home: string
}

const COPY: Record<NfLang, NfCopy> = {
  en: {
    h1: 'Lost in Lapland',
    body: "This page doesn't exist, but the North is full of pages that do. Every route below leads somewhere worth going.",
    home: 'Back to the front page',
  },
  fi: {
    h1: 'Eksyksissä Lapissa',
    body: 'Tätä sivua ei ole, mutta pohjoinen on täynnä sivuja, jotka ovat. Jokainen reitti alta vie johonkin, minne kannattaa mennä.',
    home: 'Takaisin etusivulle',
  },
  de: {
    h1: 'Verirrt in Lappland',
    body: 'Diese Seite gibt es nicht, aber der Norden ist voller Seiten, die es gibt. Jeder Weg unten führt an einen lohnenden Ort.',
    home: 'Zurück zur Startseite',
  },
  ja: {
    h1: 'ラップランドで迷子に',
    body: 'このページは存在しません。でも北の大地には、実在するページがたくさんあります。下のどのルートも、行く価値のある場所へつながっています。',
    home: 'トップページへ戻る',
  },
  es: {
    h1: 'Perdido en Laponia',
    body: 'Esta página no existe, pero el norte está lleno de páginas que sí. Cada ruta de abajo lleva a un lugar que merece la pena.',
    home: 'Volver a la página principal',
  },
  'pt-BR': {
    h1: 'Perdido na Lapônia',
    body: 'Esta página não existe, mas o norte está cheio de páginas que existem. Cada caminho abaixo leva a um lugar que vale a visita.',
    home: 'Voltar à página inicial',
  },
  'zh-CN': {
    h1: '在拉普兰迷路了',
    body: '这个页面不存在，但北方有很多真实存在的页面。下面每条路线都通向值得一去的地方。',
    home: '返回首页',
  },
  ko: {
    h1: '라플란드에서 길을 잃으셨나요',
    body: '이 페이지는 존재하지 않지만, 북쪽에는 실제로 있는 페이지가 가득합니다. 아래의 모든 길은 가 볼 만한 곳으로 이어집니다.',
    home: '홈으로 돌아가기',
  },
  fr: {
    h1: 'Perdu·e en Laponie',
    body: "Cette page n'existe pas, mais le Nord regorge de pages qui existent. Chaque chemin ci-dessous mène quelque part qui en vaut la peine.",
    home: "Retour à l'accueil",
  },
  it: {
    h1: 'Persi in Lapponia',
    body: 'Questa pagina non esiste, ma il Nord è pieno di pagine che esistono. Ogni percorso qui sotto porta in un posto che vale la pena.',
    home: 'Torna alla home',
  },
  nl: {
    h1: 'Verdwaald in Lapland',
    body: "Deze pagina bestaat niet, maar het noorden zit vol pagina's die wél bestaan. Elke route hieronder leidt ergens heen dat de moeite waard is.",
    home: 'Terug naar de startpagina',
  },
  sv: {
    h1: 'Vilse i Lappland',
    body: 'Den här sidan finns inte, men Lappland är fullt av sidor som gör det. Varje väg nedan leder någonstans som är värd besöket.',
    home: 'Tillbaka till startsidan',
  },
}

/** Accept both canonical codes ('pt-BR') and URL segments ('br', 'cn', 'kr'). */
function normalize(lang?: string): NfLang {
  const l = (lang || 'en').toLowerCase()
  if (l.startsWith('pt') || l === 'br') return 'pt-BR'
  if (l.startsWith('zh') || l === 'cn') return 'zh-CN'
  if (l === 'kr' || l.startsWith('ko')) return 'ko'
  return (Object.keys(COPY) as NfLang[]).find((k) => k.toLowerCase() === l) ?? 'en'
}

export interface NotFoundLink {
  href: string
  label: string
}

export interface NotFoundProps {
  /** Active UI language — canonical code or URL segment. Defaults to 'en'. */
  lang?: string
  /** Brand word for the tab title, e.g. 'LaplandBars' → "404: LaplandBars". */
  siteName: string
  /** Locale-prefixed front-page path, e.g. to('/'). Defaults to '/'. */
  homeHref?: string
  /** Localized main-section links ("ohjaa aina takaisin päänäkymiin"). */
  links?: NotFoundLink[]
  /** 'dark' = deep-night sites (default) · 'light' = cream/paper design variants. */
  variant?: 'dark' | 'light'
  /** CTA/accent colour override for design-variant sites (default vibe-pink). */
  accentHex?: string
  className?: string
  /**
   * Does this component own the page's <main> landmark?
   *
   * Default true, because ~10 network sites have no layout-level <main> at all
   * and this is their only landmark on the 404 route. Sites whose app layout
   * already renders a <main> must pass false, otherwise the 404 page ships two
   * nested landmarks: invalid HTML, and a screen reader announces two "main"
   * regions. Measured from the rendered DOM 2026-08-13 -- 12 sites were in that
   * state. Raw HTML has zero <main> elements, so this is invisible to grep.
   */
  landmark?: boolean
}

export default function NotFound({
  lang,
  siteName,
  homeHref = '/',
  links = [],
  variant = 'dark',
  accentHex = '#EC4899',
  className = '',
  landmark = true,
}: NotFoundProps) {
  const c = COPY[normalize(lang)]
  const dark = variant === 'dark'

  // Tab title + robots noindex, without depending on the site's head library.
  //
  // 2026-08-13: index.html ships a static <meta name="robots" content="index,
  // follow, …"> on 19 of 27 sites, and the SPA fallback serves that shell with
  // HTTP 200 for EVERY unknown path — so a nonexistent URL arrives advertising
  // itself as indexable. Appending a second robots meta left two contradictory
  // tags in the head; Google resolves that in favour of the most restrictive
  // one, so noindex did win, but only after JS ran. Rewrite the existing tag in
  // place instead of adding a rival, and restore its previous value on unmount
  // so a client-side route change back to a real page keeps its own directives.
  useEffect(() => {
    const prevTitle = document.title
    document.title = `404: ${siteName}`

    const existing = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const prevContent = existing ? existing.getAttribute('content') : null
    const meta = existing ?? document.createElement('meta')
    if (!existing) {
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', 'noindex')

    return () => {
      document.title = prevTitle
      if (!existing) {
        meta.remove()
      } else if (prevContent === null) {
        existing.removeAttribute('content')
      } else {
        existing.setAttribute('content', prevContent)
      }
    }
  }, [siteName])

  const Root = landmark ? 'main' : 'div'

  return (
    <Root
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 ${
        dark ? 'text-snow' : 'text-slate-900'
      } ${className}`}
    >
      <div className="max-w-xl text-center py-24">
        <p
          className="font-heading text-[7rem] sm:text-[9rem] leading-none tracking-wide select-none"
          style={{ color: accentHex, opacity: 0.3, textShadow: `0 0 60px ${accentHex}66` }}
          aria-hidden="true"
        >
          404
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-wide mb-4">{c.h1}</h1>
        <p className={`${dark ? 'text-snow/70' : 'text-slate-600'} mb-8 leading-relaxed`}>{c.body}</p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
          <a
            href={homeHref}
            className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-full transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentHex }}
          >
            {c.home} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-full border transition-colors ${
                dark
                  ? 'border-white/20 text-snow hover:border-white/60'
                  : 'border-slate-300 text-slate-800 hover:border-slate-500'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </Root>
  )
}
