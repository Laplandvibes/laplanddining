
import { useTranslation } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import { Sun, Sunset, MapPin, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygSearchLink } from '../lib/gyg';
import { PHOTO, photoSrcSet } from '../data/images';
import PhotoCredit from '../components/PhotoCredit';
import { imageAlt } from '../data/imageAlts';
import PageBreadcrumb from '../components/PageBreadcrumb';
import WhereToNext from '../components/WhereToNext';
import { midsummerStay } from '../lib/midnightSun';

/**
 * Midnight Sun Dining — the 32-day window June 6 → July 7 when the sun
 * never sets above the Arctic Circle. The under-marketed half of LV's
 * year. Per lv_summer_marketing_gap.md: every site needs a visible
 * summer story.
 */

interface SummerCityI18n { name: string; angle: string; body: string }

// Kaupunkikorttien kuvat. 18.10.2026: Saariselän kortissa oli tekoälykuva "kesämajan terassista"
// (drive/saariselkaSummer), joka esitti keksittyä paikkaa ⇒ Kaunispään tunturimaisema (Commons).
// `focus` = object-position, kun kortti on 16:10 eikä kuvan aihe ole keskellä.
const summerCitiesMeta = [
  { hotelsQuery: 'Rovaniemi, Finland', hotelsSid: 'midnight_sun_rovaniemi', image: PHOTO.rovaniemiSummer, alt: 'The Ounaskoski beach on the Kemijoki river in central Rovaniemi in June', focus: 'center 55%' },
  // Oma valokuva Levin keskustasta 20.7.2026 (sama kuin kaupunkisivun hero).
  { hotelsQuery: 'Levi, Finland', hotelsSid: 'midnight_sun_levi', image: '/images/cities/levi.webp', alt: 'Levi village centre on a July evening', focus: 'center 40%' },
  { hotelsQuery: 'Inari, Finland', hotelsSid: 'midnight_sun_inari', image: PHOTO.inariSummer, alt: 'The Juutuanjoki river rapids in Inari in July', focus: 'center 50%' },
  { hotelsQuery: 'Saariselkä, Finland', hotelsSid: 'midnight_sun_saariselka', image: PHOTO.saariselkaKaunispaaSummer, alt: 'Fell landscape below Kaunispää in Saariselkä on a July day', focus: 'center 50%' },
];

export default function MidnightSunDining() {
  const { t } = useTranslation('pages');
  const { to, locale } = useLocale();
  const summerCities = (t('midnightSunDining.summerCities', { returnObjects: true }) as SummerCityI18n[]) || [];
  const whyParagraphs = (t('midnightSunDining.whyParagraphs', { returnObjects: true }) as string[]) || [];
  const stay = midsummerStay();

  return (
    <>
      <title>{t('midnightSunDining.title')}</title>
      <meta name="description" content={t('midnightSunDining.description')} />
      <Hreflang path="/midnight-sun-dining" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          mainEntityOfPage: 'https://laplanddining.com/midnight-sun-dining',
          headline: 'Midnight Sun Dining in Finnish Lapland',
          description:
            'Where to eat outdoors during the 32-day midnight sun window in Finnish Lapland: terraces, kota fires and lake-side tables that stay open while the sun loops above the horizon.',
          publisher: {
            '@type': 'Organization',
            name: 'LaplandDining',
            logo: { '@type': 'ImageObject', url: 'https://laplanddining.com/favicon.svg' },
          },
          datePublished: '2026-05-03',
          inLanguage: 'en',
        
          author: { "@type": "Organization", name: "LaplandDining", url: "https://laplanddining.com" },
          dateModified: "2026-05-16T00:00:00+02:00",
          image: "https://laplanddining.com/og/midnight-sun-dining-1200x630.jpg",
        })}
      </script>

      {/* Vesa 18.10.2026: *"toteutus tällä sivulla on todella poor. kuvatkaan ei näy juuri ollenkaan
          tietokoneella. sivun järjestys ja alku on aivan kamala. yhtäkkiä alhaalla sivua on kuin toinen
          hero osio?"*. Ennen: 100svh-hero, jossa vuoden 1953 arkistokuva neljän oranssin ja tumman
          kerroksen alla, sitten pitkä tekstiosio ja vasta sen jälkeen kaupungit; lopussa toinen
          valokuvakaista 85 % tummennuksella. Nyt: hero aidosta keskiyön auringosta (Inarijärvi 13.6.),
          teksti alareunan tummaa järveä vasten ilman peittokerroksia → heti kaupungit isoin kuvin →
          miksi-osio arkistokuvan rinnalla → loppukehotus paneelina ilman kuvaa. */}
      <section className="relative min-h-[92svh] sm:min-h-[80svh] flex items-end overflow-hidden">
        <img
          src={PHOTO.midnightSunInari}
          srcSet={photoSrcSet(PHOTO.midnightSunInari)}
          sizes="100vw"
          alt={imageAlt(PHOTO.midnightSunInari, locale)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <PhotoCredit src={PHOTO.midnightSunInari} locale={locale} />
        {/* Tummennus alaosaan tekstin taakse; aurinko jää kirkkaaksi yläosaan. heroteksti-portti 18.10.2026:
            kevyempi (0,15 kohdassa 62 %) jätti h1:n auringon hehkun päälle 375 ja 2000 px:llä (1,9–2,5:1). */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.82) 34%, rgba(15,23,42,0.55) 55%, rgba(15,23,42,0.12) 76%, rgba(15,23,42,0) 90%)' }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20 pt-40">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-night/70 border border-yellow-300/35 backdrop-blur-sm mb-5">
            <Sun size={14} className="text-yellow-300" />
            <span className="text-yellow-200 text-xs font-semibold tracking-[0.25em] uppercase">
              {t('midnightSunDining.heroBadge')}
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide leading-[0.95] mb-5 max-w-4xl drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {t('midnightSunDining.heroH1Line1')}<br />{t('midnightSunDining.heroH1Line2')}
          </h1>
          <p className="text-white/90 text-lg sm:text-xl max-w-2xl mb-8 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('midnightSunDining.heroLead')}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <a
              href="#cities"
              className="inline-flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-200 text-night px-7 py-3.5 rounded-full font-bold text-base transition-colors duration-300 shadow-lg shadow-yellow-400/30 no-underline"
            >
              {t('midnightSunDining.heroCtaWhere')}
              <Sunset size={18} />
            </a>
            <AffiliateCTA
              partner="hotels-seasonal"
              sid="midnight_sun_hero_hotels"
              destination="Lapland, Finland"
              query={stay}
              className="inline-flex items-center justify-center gap-2 bg-night/60 backdrop-blur-sm border border-white/30 hover:border-yellow-300/60 text-white px-7 py-3.5 rounded-full font-semibold text-base transition-colors duration-300 no-underline"
            >
              {t('midnightSunDining.heroCtaStays')}
            </AffiliateCTA>
          </div>
        </div>
      </section>

      <PageBreadcrumb />

      {/* Kaupungit ensin: lukija tuli etsimään, missä syödä. Kuvat 16:10, tummennus vain alareunaan. */}
      <section id="cities" className="scroll-mt-20 pt-14 pb-20 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-10">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              {t('midnightSunDining.citiesHeadline')}
            </h2>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              {t('midnightSunDining.citiesLead')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {summerCities.map((c, i) => {
              const meta = summerCitiesMeta[i];
              if (!meta) return null;
              return (
                <article
                  key={c.name}
                  className="group relative overflow-hidden flex flex-col bg-night-light/40 ring-1 ring-white/10 hover:ring-yellow-300/40 rounded-3xl transition-shadow duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={meta.image}
                      srcSet={photoSrcSet(meta.image)}
                      sizes="(min-width: 1152px) 560px, (min-width: 768px) 50vw, 100vw"
                      alt={imageAlt(meta.image, locale) || meta.alt}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ objectPosition: meta.focus }}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/60 to-transparent" />
                    <PhotoCredit src={meta.image} locale={locale} />
                  </div>
                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin size={20} className="text-yellow-300 mt-1 shrink-0" />
                      <div>
                        <h3 className="font-heading text-3xl text-white tracking-wide leading-tight">
                          {c.name}
                        </h3>
                        <p className="text-yellow-300 text-xs font-semibold uppercase tracking-wider mt-1">
                          {c.angle}
                        </p>
                      </div>
                    </div>
                    <p className="text-[15px] text-white/85 leading-relaxed mb-6">{c.body}</p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <AffiliateCTA
                        partner="hotels-seasonal"
                        sid={meta.hotelsSid}
                        destination={meta.hotelsQuery}
                        query={stay}
                        className="inline-flex items-center gap-1.5 bg-amber hover:bg-amber-warm text-night text-sm font-bold px-5 py-2.5 min-h-[44px] rounded-full transition-colors duration-200 no-underline shadow-md shadow-amber/20"
                      >
                        {t('midnightSunDining.stayInTemplate', { city: c.name })}
                      </AffiliateCTA>
                      <a
                        href={gygSearchLink(`${meta.hotelsQuery.split(',')[0]} food tour summer`, `midnight_sun_${meta.hotelsSid.replace('midnight_sun_', '')}`, locale)}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                        className="inline-flex items-center gap-1.5 bg-white/8 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold px-5 py-2.5 min-h-[44px] rounded-full transition-colors duration-200 no-underline"
                      >
                        {t('midnightSunDining.summerFoodTours')}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Miksi: teksti ja arkistokuva rinnakkain. Vuoden 1953 kuva oli ennen heron taustana
          neljän peittokerroksen alla; täällä se näkyy sellaisenaan ja kertoo, että Ounasvaaralla
          on katsottu keskiyön aurinkoa ennenkin. */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-night via-night-light/45 to-night">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-10 lg:gap-16 items-start">
          <div className="max-w-[62ch]">
            <p className="text-yellow-300 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              {t('midnightSunDining.whyKicker')}
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-6">
              {t('midnightSunDining.whyHeadline')}
            </h2>
            <div className="space-y-5 text-[17px] text-white/80 leading-[1.7]">
              {whyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <figure className="relative rounded-3xl overflow-hidden ring-1 ring-white/10 aspect-square lg:sticky lg:top-24">
            <img
              src={PHOTO.midnightSunOunasvaara1953}
              srcSet={photoSrcSet(PHOTO.midnightSunOunasvaara1953)}
              sizes="(min-width: 1024px) 400px, 100vw"
              alt={imageAlt(PHOTO.midnightSunOunasvaara1953, locale)}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <PhotoCredit src={PHOTO.midnightSunOunasvaara1953} locale={locale} />
          </figure>
        </div>
      </section>

      {/* Loppukehotus paneelina, ei toisena herona: ennen tässä oli koko leveyden valokuvakaista
          85 % tummennuksella, joka näytti uudelta sivun alulta. */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-4xl mx-auto rounded-3xl ring-1 ring-yellow-300/20 bg-gradient-to-br from-amber/[0.09] via-white/[0.03] to-transparent p-8 sm:p-12 text-center">
          <Flame size={28} className="text-yellow-300 mx-auto mb-4" />
          <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-4">
            {t('midnightSunDining.bottomHeadline')}
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto">
            {t('midnightSunDining.bottomLead')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={to('/restaurants')}
              className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-warm text-night px-8 py-4 rounded-full font-bold text-base transition-colors duration-300 shadow-lg shadow-amber/25 no-underline"
            >
              {t('midnightSunDining.bottomCtaBrowse')}
            </Link>
            <Link
              to={to('/local-food')}
              className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-base transition-colors duration-300 no-underline"
            >
              {t('midnightSunDining.bottomCtaArctic')}
            </Link>
          </div>
        </div>
      </section>

      <WhereToNext />
    </>
  );
}
