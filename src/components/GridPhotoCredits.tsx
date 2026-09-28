import { creditPrefix } from '../data/photoCredit';
import { PHOTOS_BY, photoSource, type Restaurant, type Locale } from '../data/restaurants';

/** Sulkeet: ja ja zh täysleveinä verkoston kanonin mukaan, muissa välilyönti eteen. */
const PARENS: Partial<Record<Locale, [string, string]>> = { ja: ['（', '）'], 'zh-CN': ['（', '）'] };

/**
 * Korttiruudukon kuvien lähteet yhtenä hillittynä rivinä ruudukon alla, korttien
 * järjestyksessä: "Kuvat: Grill it! Levi (raflaamo.fi) · Kotahovi (laplandrestaurant.fi)".
 *
 * Vesa 26.9.2026: korttiruudukossa lähde- ja tekijämerkintä ei kuulu kuvan päälle,
 * vaan yhdeksi riviksi ruudukon alle (malli laplandwork-com/src/components/ExploreGrid.tsx,
 * 336aa9b). Rivissä ovat vain kortit, joiden kuvalla on lähde: kumppanin oma kuva tai
 * LV:n oma valokuva. Kuvituskuvan merkintä on kortissa kuvan alla (IllustrationNote),
 * koska se kertoo juuri siitä kortista.
 *
 * `list` = täsmälleen ne kortit, jotka ruudukko piirtää, samassa järjestyksessä. Sivulla
 * /restaurants se on kaupungin näkyvät kortit, joten "Näytä kaikki" laajentaa myös rivin.
 *
 * Välimerkit kielen omat: kaksoispiste `creditPrefix` (ja/zh "：", fr sitova väli), ja
 * erotin " · " sitovalla välillä edelliseen, jotta piste ei aloita riviä.
 *
 * 🔴 Koko 16 px ja muste /75, ei laplandworkin mallin 12 px /70: rivi on yli 80 merkin
 * lähderivi, ja §33 (Vesa 20.9.2026) tekee siitä leipätekstiä: vähintään 16 px ja muste
 * ≥ /75. Portti `kuvateksti` laski 12 px:n rivin korjauspaikaksi (dining 8 -> 10, räikkä
 * kaatuu), ja sama portti laskee myös workin mallirivin. Hillitty = paikka ja väri, ei koko.
 * Kontrasti: cream/75 on night-taustalla 9,7:1 ja night-light-taustalla 8,3:1.
 *
 * `data-lv-kuvalahteet`: mittarit löytävät rivin tällä attribuutilla.
 */
export default function GridPhotoCredits({ list, locale, className = '' }: { list: Restaurant[]; locale: Locale; className?: string }) {
  const items = list.flatMap((r) => {
    const source = photoSource(r);
    return source ? [{ slug: r.slug, name: r.name, source }] : [];
  });
  if (items.length === 0) return null;
  const [open, close] = PARENS[locale] ?? [' (', ')'];
  return (
    <p data-lv-kuvalahteet="" className={`text-center text-base leading-snug text-cream/75 ${className}`}>
      {creditPrefix(PHOTOS_BY[locale], locale)}
      {items.map((it, i) => (
        <span key={it.slug}>
          {i > 0 && <>&nbsp;· </>}
          {it.name}
          <span className="whitespace-nowrap">{open}{it.source}{close}</span>
        </span>
      ))}
    </p>
  );
}
