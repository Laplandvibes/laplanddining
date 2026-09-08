
import { Fragment } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import { Flame, Snowflake, TreePine, Fish, UtensilsCrossed, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DINING } from '../data/images';
import PageBreadcrumb from '../components/PageBreadcrumb';
import WhereToNext from '../components/WhereToNext';

interface SectionFigure { value: string; label: string }
interface SectionI18n {
  title: string;
  paragraphs: string[];
  /** Nosto: luvun avausvirke näyttötypografiassa (luvut 3–6). */
  quote?: string;
  /** Luvut: leipätekstistä irrotetut numerot (luvut 1–2). */
  figures?: SectionFigure[];
  /** Lukulistan otsikko ("Poronhoito lukuina") — antaa luvuille aiheen. */
  figuresLabel?: string;
}

/**
 * Luvun kiinteät osat: kuva ja tunnusikoni. Teksti tulee i18n:stä.
 *
 * Vesa 7.9.2026: *"en tykkää tästä kun listauksena on asioita näin. en usko
 * että tänä päivänä moni jaksa lukea."* Sivu oli kuusi identtistä lohkoa, joissa
 * kussakin 3–4 kappaletta leipätekstiä peräkkäin — mitattuna 7 159 px eli
 * kahdeksan ruudullista samaa kuviota. GSC 3 kk: 494 näyttöä, 4 klikkiä.
 *
 * 🔴 Korjaus on rakenne, ei sanat. Jokainen luku alkaa nyt kuvakaistalla,
 * jatkuu otsikolla joka KERTOO väitteen (ei lupaa kertoa) ja avaa asian
 * nostolla tai luvuilla ENNEN leipätekstiä. Nostot on leikattu leipätekstistä
 * (`_migrate-foodhistory-structure.mjs`), ei kopioitu — muuten sama virke
 * lukisi kahdesti ja sivu pitenisi juuri siitä syystä josta Vesa valitti.
 *
 * 🔴 Kuvat lukuihin 2 ja 5 lisättiin, jotta jokainen luku aukeaa kuvalla eikä
 * rytmi katkea. Molemmat katsottiin ennen valintaa: localFoodReindeer = poro
 * ruskametsässä (luku porosta), foodCloseup = riista-annos marjakastikkeella
 * (luku selviytymisestä taiteeksi). Ei ravintolakohtaisia kuvia, koska kuvan
 * kohdalla sivu ei väitä mitään yksittäisestä ravintolasta.
 *
 * 🔴 Luku 3 kävi kaksi kierrosta. Alun perin siinä oli `kotaFire`, joka on
 * lähes sama kuva kuin luvun 6 `kotaInside` (seurue syömässä nuotion ympärillä
 * kodassa) — sama vika kuin etusivulla 10.8., Vesa: *"sama kuva kahteen
 * kertaan?"* Vaihdoin sen jokikuvaan, mutta se oli Paikallisen ruoan oma kuva
 * samassa lukujärjestyksessä, eli kaksi peräkkäistä alasivua olisi näyttänyt
 * samat kuvat samoissa kohdissa. Nyt siinä on `featKammi`: lohta puulaudalla
 * avotulen vieressä — täsmälleen se mitä luvun oma teksti sanoo (*"Liekitettyä
 * lohta puulaudalla avotulen vieressä"*).
 *
 * 🔴 Jäljelle jää yksi tietoinen päällekkäisyys: `localFoodReindeer` on sekä
 * täällä (luku 2) että Paikallisessa ruoassa (poronhoito-osio). Se on ainoa
 * porokuva jonka omistamme, ja molemmat luvut kertovat porosta. Erottelu vaatii
 * uuden kuvan, ei kuvien kierrättämistä väärään aiheeseen.
 *
 * 🔴 localFoodReindeer on 16:9, muut viisi 2,36:1. Kaista on työpöydällä 21:9,
 * joten sille annetaan objectPosition, ettei sarvien kärki leikkaudu.
 */
const CHAPTERS: { icon: typeof Snowflake; img: { src: string; alt: string; focus?: string } }[] = [
  {
    icon: Snowflake,
    img: { src: DINING.snowVillage, alt: 'Snow-covered village restaurant in the Lapland winter' },
  },
  {
    icon: Flame,
    img: {
      src: DINING.localFoodReindeer,
      alt: 'A reindeer standing in a misty birch forest in autumn ruska colours',
      focus: '50% 42%',
    },
  },
  {
    icon: Fish,
    img: {
      src: DINING.featKammi,
      alt: 'Salmon grilled on a wooden board beside the open fire inside a Sámi kota',
    },
  },
  {
    icon: TreePine,
    img: {
      src: DINING.ingredients,
      alt: 'Wild berries, mushrooms and herbs foraged from the Lapland forest floor',
    },
  },
  {
    icon: UtensilsCrossed,
    img: { src: DINING.foodCloseup, alt: 'Plated Lapland game with berry sauce and chanterelles' },
  },
  {
    icon: Flame,
    img: { src: DINING.kotaInside, alt: 'Guests sharing a meal around the fire inside a traditional kota' },
  },
];

/** Kolmikerroksinen varjo — sama resepti kuin mallisivun (FineDining) korteissa. */
const CARD_SHADOW =
  'shadow-[0_1px_2px_rgba(0,0,0,0.5),0_16px_32px_-12px_rgba(0,0,0,0.65),0_48px_88px_-36px_rgba(0,0,0,0.75)]';

export default function FoodHistory() {
  const { t } = useTranslation('pages');
  const { to } = useLocale();
  const sections = (t('foodHistory.sections', { returnObjects: true }) as SectionI18n[]) || [];

  return (
    <>
      <title>{t('foodHistory.title')}</title>
      <meta name="description" content={t('foodHistory.description')} />
      <Hreflang path="/food-history" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          mainEntityOfPage: 'https://laplanddining.com/food-history',
          headline: "A Story Told Through Food: Lapland's Culinary Heritage",
          description:
            "How thousands of years of Arctic survival shaped one of the world's most distinctive food cultures.",
          image: 'https://laplanddining.com/images/drive/heroFoodStory.webp',
          publisher: {
            '@type': 'Organization',
            name: 'LaplandDining',
            logo: { '@type': 'ImageObject', url: 'https://laplanddining.com/favicon.svg' },
          },
          datePublished: '2026-05-03',
          inLanguage: 'en',

          author: { "@type": "Organization", name: "LaplandDining", url: "https://laplanddining.com" },
          dateModified: "2026-05-16T00:00:00+02:00",
        })}
      </script>

      {/* Hero */}
      <section className="relative min-h-[60svh] flex items-center justify-center overflow-hidden [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        <img
          src={DINING.heroFoodStory}
          alt="Traditional Lapland kota cooking"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/50 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {t('foodHistory.heroH1')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('foodHistory.heroLead')}
          </p>
        </div>
      </section>

      <PageBreadcrumb />

      {/* Lukuhakemisto. Kuusi otsikkoa kertovat koko tarinan yhdellä ruudulla —
          se on vastaus lukijalle joka ei jaksa lukea kaikkea. Rivimalli
          (hiusviiva, Bebas-numero, otsikko, nuoli) on verkoston DirectoryList,
          ei ikonilaatikkoruudukko. */}
      <section className="bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12">
          <p className="font-heading text-amber tracking-[0.28em] text-xs sm:text-sm uppercase mb-5">
            {t('foodHistory.chaptersLabel')}
          </p>
          <ol className="border-t border-white/10">
            {sections.map((section, i) => (
              <li key={i}>
                <a
                  href={`#chapter-${i + 1}`}
                  className="group flex items-center gap-4 sm:gap-6 py-4 border-b border-white/10 no-underline"
                >
                  <span className="font-heading text-amber/70 text-xl sm:text-2xl tracking-wide w-7 shrink-0 group-hover:text-amber transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* text-balance myös hakemistossa: ilman sitä pitkän otsikon
                      viimeiselle riville jäi yksi orpo sana (mobile_wrap_audit). */}
                  <span className="font-heading text-white text-xl sm:text-2xl tracking-wide leading-tight text-balance group-hover:text-amber transition-colors">
                    {section.title}
                  </span>
                  <ArrowRight
                    size={16}
                    className="ml-auto shrink-0 text-white/25 group-hover:text-amber group-hover:translate-x-1 transition-all duration-300"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Luvut. Tausta ei ole litteä musta: pystygradientti + hillitty lämmin
          hehku, sama pohja kuin mallisivulla. */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-b from-night via-night-light/55 to-night">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(60%_45%_at_50%_0%,rgba(245,158,11,0.10),transparent_70%)]"
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="max-w-3xl mx-auto text-white/75 text-lg sm:text-xl leading-relaxed border-l-2 border-amber/60 pl-5 italic">
            {t('foodHistory.intro')}
          </p>

          <div className="mt-14 sm:mt-18 space-y-20 sm:space-y-24 lg:space-y-28">
            {sections.map((section, i) => {
              const { icon: Icon, img } = CHAPTERS[i] ?? CHAPTERS[0];
              const figures = section.figures;
              const quote = section.quote;
              return (
                <article key={i} id={`chapter-${i + 1}`} className="scroll-mt-24">
                  <figure
                    className={`group relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden ring-1 ring-white/10 mb-8 sm:mb-10 ${CARD_SHADOW}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      style={img.focus ? { objectPosition: img.focus } : undefined}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/55 via-transparent to-transparent" />
                  </figure>

                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                      {/* Ei tracking-[0.2em]: Bebas on jo kondensoitu, ja 0,2em
                          revitsi "02":n kahdeksi erilliseksi numeroksi ("0 2"). */}
                      <span className="font-heading text-amber text-2xl leading-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-r from-amber/45 to-transparent" />
                      <Icon size={16} className="text-amber/70 shrink-0" aria-hidden="true" />
                    </div>

                    <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide leading-[1.05] text-balance mb-7">
                      {section.title}
                    </h2>

                    {/* Nosto tai luvut — aina otsikon alla, ennen leipätekstiä.
                        🔴 Luvut EIVÄT ole korttiruudukko. Ensimmäinen versio oli
                        kuusi laattaa 3×2-ruudukossa kermakortilla, ja Vesa 7.9.:
                        *"nyt numeroita vaan leijailee, todella ai näköistä"*.
                        Hän on oikeassa: kuusi samanarvoista lukua laatikossa on
                        KPI-mittaristo, ei artikkeli. Nyt ne ovat almanakkalista
                        — luku oikealle tasattuna omaan sarakkeeseensa, selite
                        perässä, hiusviiva rivien välissä. Lista istuu palstaan
                        eikä kellu sen päällä, ja lukujärjestys (luku ensin,
                        selite perässä) pitää selitteen kieliopillisesti oikein
                        kaikilla 12 kielellä — "5 600 poronhoitajaa",
                        "5,600 人のトナカイ放牧者". */}
                    {figures && figures.length > 0 ? (
                      <>
                        {section.figuresLabel && (
                          <p className="font-heading text-amber tracking-[0.28em] text-xs sm:text-sm uppercase mb-4">
                            {section.figuresLabel}
                          </p>
                        )}
                        <dl className="grid grid-cols-[auto_1fr] border-t border-white/12">
                        {figures.map((f, j) => (
                          <Fragment key={j}>
                            {/* 🔴 EI `self-center` dd:lle. Se estää solua venymästä
                                rivin korkeuteen, jolloin sen alaviiva jää 4 px
                                ylemmäs kuin arvon (mitattu: dd bottom 2178,7 vs
                                dt 2182,7) ja hiusviiva pomppaa sarakkeiden
                                rajalla. Vesa 8.9.: "nuo m viivat pomppii".
                                Molemmat solut venyvät (oletus `stretch`), ja
                                teksti keskitetään pystysuunnassa flexillä. */}
                            <dt className="flex items-center justify-end font-heading text-amber text-2xl sm:text-3xl leading-none pr-5 sm:pr-8 py-3.5 border-b border-white/12">
                              {f.value}
                            </dt>
                            <dd className="flex items-center text-white/70 text-sm sm:text-base leading-snug py-3.5 border-b border-white/12">
                              {f.label}
                            </dd>
                          </Fragment>
                        ))}
                        </dl>
                      </>
                    ) : quote ? (
                      <blockquote
                        className={`relative rounded-3xl bg-cream ring-1 ring-white/10 pl-14 pr-7 py-7 sm:pl-16 sm:pr-10 sm:py-8 ${CARD_SHADOW}`}
                      >
                        <Quote
                          size={26}
                          className="absolute left-6 top-7 sm:left-7 sm:top-8 text-amber-deep/60 -scale-x-100"
                          aria-hidden="true"
                        />
                        <p className="text-warm-ink text-2xl sm:text-3xl font-medium leading-[1.25] text-balance">
                          {quote}
                        </p>
                      </blockquote>
                    ) : null}

                    <div className="mt-8 space-y-5 text-white/80 leading-relaxed">
                      {section.paragraphs.map((p, j) => (
                        <p key={j} className={j === 0 ? 'text-lg leading-relaxed text-white/85' : undefined}>
                          <Trans
                            ns="pages"
                            i18nKey={`foodHistory.sections.${i}.paragraphs.${j}`}
                            components={{
                              em: <em />,
                              strong: <strong className="text-white/80" />,
                            }}
                            defaults={p}
                          />
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="text-center pt-16 sm:pt-20">
            <Link
              to={to('/restaurants')}
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber-warm text-night px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
            >
              {t('foodHistory.ctaExplore')}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <WhereToNext />
    </>
  );
}
