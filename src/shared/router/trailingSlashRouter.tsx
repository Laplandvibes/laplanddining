/**
 * react-router-dom, jonka Link ja NavLink päättävät sisäisen polun kauttaviivaan.
 * ==============================================================================
 *
 * MIKSI (18.9.2026): Cloudflare Pages tarjoilee prerenderöidyn sivun hakemistona
 * (`/jobs/index.html`) ja vastaa kauttaviivattomaan osoitteeseen 308-ohjauksella
 * (`/jobs` → `/jobs/`). Staattinen HTML oli oikein, mutta sivut renderöidään
 * selaimessa uudelleen (createRoot), ja silloin jokainen `<Link to="/jobs">`
 * kirjoitti hrefin ilman kauttaviivaa. Google lukee renderöidyn DOMin, seuraa
 * linkin, saa 308:n ja kirjaa osoitteen GSC:n "Uudelleenohjauksen sisältävä sivu"
 * -luokkaan. Mitattu 28/28 sivustolla, 92 % kauttaviivattomista sisäisistä
 * linkeistä tuli Link-komponentista; luokassa oli ~9 900 osoitetta ja se kasvoi.
 *
 * MITEN: vite-liitännäinen `trailingSlashLinks` (samassa kansiossa) ohjaa sovelluksen
 * `react-router-dom`-tuonnit tähän tiedostoon. Kaikki muu tulee alkuperäisestä
 * paketista sellaisenaan; vain Link ja NavLink korvataan. Näin korjaus kattaa myös
 * linkit joita ei ole vielä kirjoitettu, eikä yhteenkään komponenttiin tarvitse koskea.
 *
 * Mitä EI muuteta: suhteelliset polut, ulkoiset osoitteet, pelkät #-ankkurit ja
 * tiedostopolut (`/sitemap.xml`, `/og.jpg`). Kysely ja ankkuri säilyvät:
 * `/post-a-job?tier=free` → `/post-a-job/?tier=free`.
 *
 * 🔴 Sama polku on nyt sama sekä sisään tultaessa että sivulta toiselle siirryttäessä.
 * Ennen tätä sisääntulosivun `location.pathname` oli `/jobs/` (palvelimen ohjaus) ja
 * sovelluksen sisäisen siirtymän jälkeen `/jobs`. Koodi joka vertaa polkua tarkasti
 * (`pathname === '/jobs'`) oli siis jo valmiiksi rikki jokaiselle hakukoneesta tulijalle.
 * Normalisoi loppukauttaviiva vertailun molemmista päistä.
 */
import { forwardRef } from 'react';
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  type LinkProps,
  type NavLinkProps,
  type To,
} from 'react-router-dom';

export * from 'react-router-dom';

const FILE_EXTENSION = /\.[a-z0-9]{2,5}$/i;

function slashPath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (path.endsWith('/') || FILE_EXTENSION.test(path)) return path;
  return `${path}/`;
}

/** `/x?y#z` → `/x/?y#z`; kaikki muu ennallaan. */
export function withTrailingSlash(to: To): To {
  if (typeof to === 'string') {
    const cut = to.search(/[?#]/);
    return cut < 0 ? slashPath(to) : slashPath(to.slice(0, cut)) + to.slice(cut);
  }
  return to.pathname ? { ...to, pathname: slashPath(to.pathname) } : to;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...rest }, ref) {
  return <RouterLink ref={ref} to={withTrailingSlash(to)} {...rest} />;
});

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink({ to, ...rest }, ref) {
  return <RouterNavLink ref={ref} to={withTrailingSlash(to)} {...rest} />;
});
