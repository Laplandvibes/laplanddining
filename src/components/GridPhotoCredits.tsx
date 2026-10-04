import { creditPrefix } from '../data/photoCredit';
import { PHOTOS_BY, photoSource, type CommonsCredit, type Restaurant, type Locale } from '../data/restaurants';

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
 *
 * 4.10.2026: Wikimedia Commons -kuva (kind 'commons') saa rivissä tekijän, lisenssin ja
 * linkit tiedostosivulle ja lisenssiin: "Umpitunneli (Estormiz, CC0 1.0, Wikimedia Commons)".
 * CC BY ja CC BY-SA vaativat tekijän ja lisenssilinkin näkyviin; CC0 ei vaadi, mutta
 * merkintä on sama, jotta lukija näkee mistä jokainen kuva tulee. Rivi on ruudukon
 * ulkopuolella, joten linkit eivät ole kortin linkin sisällä.
 */
export default function GridPhotoCredits({ list, locale, className = '' }: { list: Restaurant[]; locale: Locale; className?: string }) {
  const items = list.flatMap((r): { slug: string; name: string; source?: string; commons?: CommonsCredit }[] => {
    const source = photoSource(r);
    if (source) return [{ slug: r.slug, name: r.name, source }];
    if (r.photoKind === 'commons' && r.photoCommons) return [{ slug: r.slug, name: r.name, commons: r.photoCommons }];
    return [];
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
          {it.commons ? (
            <>
              {open}{it.commons.author},{' '}
              <a href={it.commons.licenseUrl} target="_blank" rel="license noopener" className="lv-tap whitespace-nowrap underline decoration-cream/40 underline-offset-2 hover:text-cream">
                {it.commons.license}
              </a>
              ,{' '}
              <a href={it.commons.sourceUrl} target="_blank" rel="noopener" className="lv-tap whitespace-nowrap underline decoration-cream/40 underline-offset-2 hover:text-cream">
                Wikimedia Commons
              </a>
              {close}
            </>
          ) : (
            <span className="whitespace-nowrap">{open}{it.source}{close}</span>
          )}
        </span>
      ))}
    </p>
  );
}
