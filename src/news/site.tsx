/**
 * Uutisosion SIVUSTOSOVITIN — laplanddining.com.
 *
 * Osio on kopioitu laplandstays.comista (26.9.2026), joka kopioi sen laplandnature.comista ja
 * se laplandflights.fi:stä (18.9.2026). Kaikki muu src/news/:ssä on tavu tavulta sama:
 * tietomalli, rekisteri, kortit, runko, portti. Vain tämä tiedosto + news.css tuntevat sivuston.
 *
 * Erot staysin versioon, kaikki sivuston omasta rakenteesta:
 *  1. Navi ja alatunniste tulevat App.tsx:stä ⇒ NewsChrome kääriytyy vain omaan juureensa.
 *     Navi on kiinteä (`Navbar` + App.tsx:n `pt-16`), joten osion yläpalkki ei varaa sille
 *     tilaa itse — toisin kuin staysilla, jossa uutisosio hoitaa padding-topin news.css:ssä.
 *  2. Tällä sivustolla EI ole erillistä <SEO>-komponenttia: sivut latovat `<title>`,
 *     `<meta>` ja `<Hreflang path>` suoraan JSX:ään ja React 19 nostaa ne headiin. Siksi
 *     useNewsHead palauttaa juuri sen, mitä muutkin sivut (Restaurants, FineDining, …) latovat.
 *  3. 🔴 og:image jätetään esirenderöijälle (`scripts/routes.json` → `ogImage`). Sivuston muut
 *     sivut eivät lado og:imagea JSX:stä, eikä sitä pidä tehdä täälläkään: React 19 ei korvaa
 *     samanlaista meta-tagia vaan lisää toisen, ja kahdesta og:imagesta jakaja lukee väärän
 *     (lv_permanent_rules §34.1).
 *  4. Murupolun BreadcrumbListiä EI latota tässä: esirenderöijä kirjoittaa sen jokaiselle
 *     reitille kanonisesta polusta (scripts/_prerender_routes.mjs), joten oma lohko tuottaisi
 *     sivulle kaksi BreadcrumbListiä (mitattu laplandnaturella 24.9.2026).
 *  5. Jutun alle ei tule mainosruudukkoa. Sivuston oma kumppaninauha (SponsorStrip) on
 *     App.tsx:ssä ja näkyy siis myös uutissivuilla — omaa mainospintaa ei lisätä.
 */
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Hreflang from '../i18n/Hreflang'
import { useLocalePath } from '../i18n/useLang'
import type { NewsBlock, NewsMeta } from './types'
import './news.css'

export const SITE = {
  name: 'LaplandDining',
  origin: 'https://laplanddining.com',
  /** Osion polku ilman kieliprefiksiä. Sama arvo scripts/news-prerender.mjs:ssä. */
  path: '/news',
} as const

/** Sivuston omat aihesivut jutun perään — sama linkkijoukko kuin alatunnisteen pilareissa. */
function MorePages({ current }: { current: string }) {
  const to = useLocalePath()
  const { t, i18n } = useTranslation('nav')
  const tx = (key: string, fallback: string): string =>
    i18n.exists(`nav:${key}`) ? (t(key) as string) : fallback
  const items = [
    { href: '/restaurants', label: tx('links.restaurants', 'Restaurants') },
    { href: '/cities', label: tx('links.cities', 'Towns') },
    { href: '/fine-dining', label: tx('links.fineDining', 'Fine Dining') },
    { href: '/local-food', label: tx('links.localFood', 'Local Food') },
    { href: '/food-history', label: tx('links.foodHistory', 'Food Story') },
    { href: '/midnight-sun-dining', label: tx('links.midnightSun', 'Midnight Sun') },
  ].filter((i) => !current.startsWith(i.href))
  return (
    <nav className="nw-morepages" aria-label={SITE.name}>
      <div className="nw-wrap">
        <ul>
          {items.map((i) => (
            <li key={i.href}><Link to={to(i.href)}>{i.label}</Link></li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export function NewsChrome({ current, children }: { current: string; children: ReactNode }) {
  return (
    <div className="nw">
      {children}
      <MorePages current={current} />
    </div>
  )
}

/**
 * Sivun otsikko, metat, kanoninen, hreflang ja JSON-LD — sivuston omalla tavalla (ks. kohdat 2–4).
 * `image` ja `breadcrumbs` otetaan vastaan, jotta tiedosto vastaa lähteen rajapintaa, mutta
 * niitä ei latota: og-kuva tulee esirenderöijältä ja murupolun JSON-LD samoin.
 */
export function useNewsHead(m: {
  title: string
  description: string
  path: string
  image?: string
  breadcrumbs: { name: string; path: string }[]
  jsonLd?: unknown[]
}): ReactNode {
  return (
    <>
      <title>{m.title}</title>
      <meta name="description" content={m.description} />
      <meta name="robots" content="index, follow" />
      <Hreflang path={m.path} />
      {(m.jsonLd ?? []).map((j, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(j)}</script>
      ))}
    </>
  )
}

/** Tällä sivustolla ei ole vielä jutun omia upotuksia. */
export function renderEmbed(_block: Extract<NewsBlock, { t: 'embed' }>, _meta: NewsMeta): ReactNode {
  return null
}

/** Tällä sivustolla ei ole jutun alle tulevaa mainosruudukkoa. */
export function NewsAds(_: { meta: NewsMeta }) {
  return null
}

export function NotFoundPage() {
  return (
    <div className="nw">
      <header className="nw-head">
        <div className="wrap">
          <h1 className="nw-h1">404</h1>
        </div>
      </header>
    </div>
  )
}
