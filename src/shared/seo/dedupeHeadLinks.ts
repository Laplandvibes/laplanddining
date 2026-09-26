/**
 * dedupeHeadLinks — poistaa <head>istä TARKAT kaksoiskappaleet: sama rel + hreflang + href.
 *
 * MIKSI (25.9.2026, mitattu 23 sivustolla 28:sta): esirenderöijä kirjoittaa kanonisen ja 13
 * hreflangia staattiseen HTML:ään, ja React 19 nostaa komponenttien <link>-tagit headiin
 * korvaamatta samanlaisia ⇒ renderöidyssä sivussa oli 26 hreflangia ja usein 2 kanonista.
 *
 * 🔴 Arvot olivat identtiset, joten tämä EI ollut hakukonevirhe: Google poistaa identtiset
 * kaksoiskappaleet itse. Oikea vika on eri asia — sama kieli kahteen ERI osoitteeseen
 * (laplandtransportin /kr/ → /kr/ko/, 17.9.2026). Siksi tämä poistaa vain kun href on sama:
 * eriävät jätetään headiin näkyviin, jotta mittari ja GSC näkevät ne.
 *
 * Kutsu sen komponentin useEffectissä, joka asettaa kanonisen ja hreflangit — efekti ajetaan
 * vasta kun React on kirjoittanut omat tagit, joten jäljelle jää uusin (ajonaikainen) kopio.
 * Palauttaa poistettujen määrän (testattavuus).
 */
export function dedupeHeadLinks(): number {
  if (typeof document === 'undefined') return 0;
  const seen = new Map<string, Element>();
  let removed = 0;
  for (const el of document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')) {
    const key = `${el.getAttribute('rel')}|${el.getAttribute('hreflang') ?? ''}|${el.getAttribute('href')}`;
    const prev = seen.get(key);
    if (prev) {
      prev.remove();
      removed++;
    }
    seen.set(key, el);
  }
  return removed;
}

export default dedupeHeadLinks;
