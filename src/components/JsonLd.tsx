// Rakenteinen data (JSON-LD) yhdestä paikasta: sisäiset osoitteet samaan muotoon kuin kanoninen, hreflang ja
// sivukartta, eli sivun OMA kieliversio ja loppukauttaviiva.
//
// Miksi (12.–13.11.2026): sivujen schema-oliot kirjoittivat englannin kauttaviivattomat osoitteet
// (`https://laplanddining.com/restaurants`, joka ohjautuu 308) joka kielellä. Laplandchristmasissa (sama vika) 33 %
// Googlebotin sivupyynnöistä meni kauttaviivattomiin osoitteisiin. Mittari: lv-ops `scripts/audit_jsonld_osoitteet.mjs`.
//
// - polullinen osoite → sivun kieliversio + kauttaviiva (`/fi/restaurants/`)
// - juuri → `https://laplanddining.com/`
// - tiedostot (.svg, .jpg), ankkurit ja ulkoiset osoitteet (ravintoloiden omat sivut) jäävät ennalleen
// - sivun oma BreadcrumbList ei tulostu: esirenderöijä kirjoittaa jokaiselle sivulle murupolun sivun kielellä ja
//   oikeilla osoitteilla, kun taas sivujen omat oliot sanoivat "Home" ja englannin osoitteen joka kielellä
//   (sama ratkaisu kuin laplandcarrental 25.9. ja laplandwellness 12.11.2026)
import { useLocale } from '../i18n/useLocale';
import { localisedPath, type Locale } from '../i18n/config';

const ORIGIN = 'https://laplanddining.com';
const INTERNAL_URL = /^https:\/\/laplanddining\.com((?:\/[A-Za-z0-9_-]+)*)\/?$/;

function localizeUrls(node: unknown, locale: Locale, key = ''): unknown {
  if (typeof node === 'string') {
    const m = INTERNAL_URL.exec(node);
    if (!m) return node;
    const path = m[1] || '/';
    if (path === '/' && key !== 'item') return `${ORIGIN}/`;
    return `${ORIGIN}${localisedPath(path, locale)}`.replace(/\/?$/, '/');
  }
  if (Array.isArray(node)) return node.map((n) => localizeUrls(n, locale, key));
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) out[k] = localizeUrls(v, locale, k);
    return out;
  }
  return node;
}

export default function JsonLd({ data }: { data: unknown }) {
  const { locale } = useLocale();
  if (data && typeof data === 'object' && (data as { '@type'?: unknown })['@type'] === 'BreadcrumbList') return null;
  return <script type="application/ld+json">{JSON.stringify(localizeUrls(data, locale))}</script>;
}
