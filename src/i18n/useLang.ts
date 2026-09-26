/**
 * Kieliadapteri uutisosiolle (src/news/).
 *
 * MIKSI: uutisosio on kopioitu verkoston kanonisesta lähteestä (laplandflights.fi 18.9.2026
 * → laplandnature 24.9. → laplandstays 25.9. → tänne 26.9.2026) ja sen komponentit lukevat
 * kielen kahdella nimellä, `useLang()` ja `useLocalePath()`. Tällä sivustolla sama tieto tulee
 * `useLocale()`-hookista. Adapteri pitää kopioidut tiedostot (registry, types, NewsCard,
 * NewsArticle, LatestNews, Prose, format) **tavu tavulta samoina** kuin lähteessä, joten
 * seuraava kopiointi on `cp` eikä käsityötä — ja ero sivustojen välillä asuu yhdessä
 * tiedostossa, ei seitsemässä.
 *
 * 🔴 Ei omaa logiikkaa. Jos kielireititys muuttuu, se muuttuu `src/i18n/config.ts`:ssä.
 */
import { useLocale } from './useLocale';
import type { Locale } from './config';

export type Lang = Locale;

export function useLang(): Lang {
  return useLocale().locale;
}

export function useLocalePath(): (path: string) => string {
  return useLocale().to;
}
