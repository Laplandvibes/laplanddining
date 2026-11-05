import { creditPrefix } from '../data/photoCredit';
import { licenseLabel } from '../lib/a11yNimet';
import { PHOTOS_BY, photoSource, type CommonsCredit, type Restaurant, type Locale } from '../data/restaurants';

/** Sulkeet: ja ja zh täysleveinä verkoston kanonin mukaan, muissa välilyönti eteen. */
const PARENS: Partial<Record<Locale, [string, string]>> = { ja: ['（', '）'], 'zh-CN': ['（', '）'] };

/** Taitetun listan otsikko alle 1024 px (sama kuin hubin GridPhotoCredits 5.11.2026). */
const FOLD_LABEL: Record<Locale, string> = {
  en: 'Photo credits and licences', fi: 'Kuvien tekijät ja lisenssit', sv: 'Fotografer och licenser',
  de: 'Bildnachweise und Lizenzen', es: 'Créditos y licencias de las fotos', fr: 'Crédits et licences des photos',
  it: 'Crediti e licenze delle foto', nl: 'Fotografen en licenties', ja: '写真のクレジットとライセンス',
  ko: '사진 출처 및 라이선스', 'zh-CN': '图片作者与许可', 'pt-BR': 'Créditos e licenças das fotos',
};

/** Tätä useampi merkintä taittuu alle 1024 px. */
const FOLD_OVER = 3;

/**
 * Korttiruudukon kuvien lähteet hillittynä listana ruudukon alla, korttien järjestyksessä:
 * "Kuvat: Grill it! Levi (raflaamo.fi)  Kotahovi (laplandrestaurant.fi)".
 *
 * Vesa 26.9.2026: korttiruudukossa lähde- ja tekijämerkintä ei kuulu kuvan päälle,
 * vaan ruudukon alle (malli laplandwork-com/src/components/ExploreGrid.tsx, 336aa9b).
 * Listassa ovat vain kortit, joiden kuvalla on lähde: kumppanin oma kuva tai LV:n oma
 * valokuva. Kuvituskuvan merkintä on kortissa kuvan alla (IllustrationNote), koska se
 * kertoo juuri siitä kortista.
 *
 * `list` = täsmälleen ne kortit, jotka ruudukko piirtää, samassa järjestyksessä. Sivulla
 * /restaurants se on kaupungin näkyvät kortit, joten "Näytä kaikki" laajentaa myös listan.
 *
 * 🔴 5.11.2026 (Vesa hubista tabletilla ja puhelimella: "rivitykset ja tekstit pomppii aivan
 * kamalasti"; sama rakenne täällä). Rivi oli yksi juokseva kappale, joten rivi katkesi kesken
 * merkinnän. Nyt jokainen merkintä on oma flex-alkionsa (rivi vaihtuu vain merkintöjen välissä),
 * ravintolan nimi on kirkkaampi, jotta merkinnän alku erottuu ilman " · "-erotinta, ja yli 3
 * merkinnän lista taittuu alle 1024 px yhdeksi riviksi "Kuvien tekijät ja lisenssit (N)", joka
 * avaa saman listan samalle paikalle (CC BY 4.0 §3(a)(2): "any reasonable manner"). Alle 1024 px
 * vasen tasaus, 1024+ keskitetty (Vesa 18.10.2026). Molemmat kopiot ovat HTML:ssä (ei JS:ää);
 * display:none pitää piilossa olevan pois saavutettavuuspuusta.
 *
 * 🔴 Koko 16 px ja muste /75, ei laplandworkin mallin 12 px /70: rivi on yli 80 merkin
 * lähderivi, ja §33 (Vesa 20.9.2026) tekee siitä leipätekstiä: vähintään 16 px ja muste
 * ≥ /75. Portti `kuvateksti` laski 12 px:n rivin korjauspaikaksi (dining 8 -> 10, räikkä
 * kaatuu), ja sama portti laskee myös workin mallirivin. Hillitty = paikka ja väri, ei koko.
 * Kontrasti: cream/75 on night-taustalla 9,7:1 ja night-light-taustalla 8,3:1.
 *
 * `data-lv-kuvalahteet`: mittarit löytävät rivin tällä attribuutilla.
 *
 * 4.10.2026: Wikimedia Commons -kuva (kind 'commons') saa tekijän, lisenssin ja linkit
 * tiedostosivulle ja lisenssiin: "Umpitunneli (Estormiz, CC0 1.0, Wikimedia Commons)".
 * CC BY ja CC BY-SA vaativat tekijän ja lisenssilinkin näkyviin; CC0 ei vaadi, mutta
 * merkintä on sama, jotta lukija näkee mistä jokainen kuva tulee. Lista on ruudukon
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
  const link = 'lv-tap underline decoration-cream/40 underline-offset-2 hover:text-cream';
  const fold = items.length > FOLD_OVER;

  const entries = (centerLg: boolean, prefix: boolean) => (
    <ul className={`m-0 flex list-none flex-wrap gap-x-5 gap-y-1.5 p-0 justify-start ${centerLg ? 'lg:justify-center' : ''}`}>
      {items.map((it, i) => (
        <li key={it.slug} className="min-w-0 max-w-full">
          {prefix && i === 0 && creditPrefix(PHOTOS_BY[locale], locale)}
          <span translate="no" className="text-cream">{it.name}</span>
          {it.commons ? (
            <>
              {open}{it.commons.author},{' '}
              <a href={it.commons.licenseUrl} target="_blank" rel="license noopener" className={`${link} whitespace-nowrap`}>
                {licenseLabel(it.commons.license, locale)}
              </a>
              ,{' '}
              <a href={it.commons.sourceUrl} target="_blank" rel="noopener" className={`${link} whitespace-nowrap`}>
                Wikimedia Commons
              </a>
              {close}
            </>
          ) : (
            <span className="whitespace-nowrap">{open}{it.source}{close}</span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div data-lv-kuvalahteet="" className={`text-left text-base leading-snug text-cream/75 ${className}`}>
      {fold && (
        <details className="group lg:hidden">
          <summary className={`inline-flex cursor-pointer list-none items-center gap-1.5 ${link} [&::-webkit-details-marker]:hidden`}>
            {FOLD_LABEL[locale] ?? FOLD_LABEL.en} ({items.length})
            <span aria-hidden="true" className="inline-block transition-transform duration-200 group-open:rotate-180">▾</span>
          </summary>
          <div className="mt-2">{entries(false, false)}</div>
        </details>
      )}
      <div className={fold ? 'hidden lg:block' : ''}>{entries(true, true)}</div>
    </div>
  );
}
