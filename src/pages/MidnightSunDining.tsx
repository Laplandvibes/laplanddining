
import { useTranslation } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import { Sun, Sunset, MapPin, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygSearchLink } from '../lib/gyg';
import { DINING } from '../data/images';
import PageBreadcrumb from '../components/PageBreadcrumb';
import WhereToNext from '../components/WhereToNext';

/**
 * Midnight Sun Dining — the 32-day window June 6 → July 7 when the sun
 * never sets above the Arctic Circle. The under-marketed half of LV's
 * year. Per lv_summer_marketing_gap.md: every site needs a visible
 * summer story.
 */

interface SummerCityI18n { name: string; angle: string; body: string }

// Image tops reuse EXISTING site images (no new generations) — one per city card.
const summerCitiesMeta = [
  { hotelsQuery: 'Rovaniemi, Finland', hotelsSid: 'midnight_sun_rovaniemi', image: DINING.rovaniemiCenter, alt: 'Restaurant terraces in central Rovaniemi' },
  { hotelsQuery: 'Levi, Finland', hotelsSid: 'midnight_sun_levi', image: DINING.kotaInside, alt: 'Kota dining around an open fire in Levi' },
  { hotelsQuery: 'Inari, Finland', hotelsSid: 'midnight_sun_inari', image: DINING.foodMoody, alt: 'Local dishes plated in Inari' },
  { hotelsQuery: 'Saariselkä, Finland', hotelsSid: 'midnight_sun_saariselka', image: DINING.saariselkaSummer, alt: 'Summer lodge terrace in Saariselkä' },
];

export default function MidnightSunDining() {
  const { t } = useTranslation('pages');
  const { to, locale } = useLocale();
  const summerCities = (t('midnightSunDining.summerCities', { returnObjects: true }) as SummerCityI18n[]) || [];
  const whyParagraphs = (t('midnightSunDining.whyParagraphs', { returnObjects: true }) as string[]) || [];

  return (
    <>
      <title>{t('midnightSunDining.title')}</title>
      <meta name="description" content={t('midnightSunDining.description')} />
      <Hreflang path="/midnight-sun-dining" />
      <meta name="robots" content="index, follow" />
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

      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <img
          src="/images/midnight-sun-hero.jpg"
          alt="Wooden lakeside terrace dinner during the Lapland midnight sun, candles lit and reindeer fur on the chairs"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/75 via-amber-900/40 to-night/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(8,10,22,0.5)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(253,224,71,0.15)_0%,transparent_55%)]" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-300/15 border border-yellow-300/30 backdrop-blur-sm mb-6">
            <Sun size={14} className="text-yellow-300" />
            <span className="text-yellow-200 text-xs font-semibold tracking-[0.25em] uppercase">
              {t('midnightSunDining.heroBadge')}
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide leading-tight mb-5 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {t('midnightSunDining.heroH1Line1')}<br />{t('midnightSunDining.heroH1Line2')}
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('midnightSunDining.heroLead')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#cities"
              className="inline-flex items-center gap-2 bg-yellow-300 hover:bg-yellow-200 text-night px-7 py-3.5 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/30 no-underline"
            >
              {t('midnightSunDining.heroCtaWhere')}
              <Sunset size={18} />
            </a>
            <AffiliateCTA
              partner="hotels-seasonal"
              sid="midnight_sun_hero_hotels"
              destination="Lapland, Finland"
              query={{ checkin: '2026-06-15', checkout: '2026-06-18' }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 hover:border-yellow-300/60 hover:bg-white/15 text-white px-7 py-3.5 rounded-full font-semibold text-base transition-all duration-300 no-underline"
            >
              {t('midnightSunDining.heroCtaStays')}
            </AffiliateCTA>
          </div>
        </div>
      </section>

      <PageBreadcrumb />

      {/* Why it matters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-3xl mx-auto">
          <p className="text-yellow-300/80 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            {t('midnightSunDining.whyKicker')}
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-6">
            {t('midnightSunDining.whyHeadline')}
          </h2>
          <div className="space-y-5 text-white/65 leading-relaxed">
            {whyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section id="cities" className="py-20 px-4 sm:px-6 lg:px-8 bg-night/95">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              {t('midnightSunDining.citiesHeadline')}
            </h2>
            <p className="text-white/80 text-base max-w-2xl mx-auto">
              {t('midnightSunDining.citiesLead')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summerCities.map((c, i) => {
              const meta = summerCitiesMeta[i];
              if (!meta) return null;
              return (
                <article
                  key={c.name}
                  className="group relative overflow-hidden bg-gradient-to-br from-amber/8 via-white/[0.03] to-transparent border border-amber/15 hover:border-yellow-300/40 rounded-2xl transition-all duration-300"
                >
                  <div className="relative h-36 sm:h-40 overflow-hidden">
                    <img
                      src={meta.image}
                      alt={meta.alt}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.12) 60%)' }}
                    />
                  </div>
                  <div className="p-6 sm:p-7">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin size={20} className="text-yellow-300 mt-1 shrink-0" />
                    <div>
                      <h3 className="font-heading text-2xl text-white tracking-wide leading-tight">
                        {c.name}
                      </h3>
                      <p className="text-yellow-300/80 text-xs font-semibold uppercase tracking-wider mt-1">
                        {c.angle}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-5">{c.body}</p>
                  <div className="flex flex-wrap gap-2">
                    <AffiliateCTA
                      partner="hotels-seasonal"
                      sid={meta.hotelsSid}
                      destination={meta.hotelsQuery}
                      query={{ checkin: '2026-06-15', checkout: '2026-06-18' }}
                      className="inline-flex items-center gap-1.5 bg-amber hover:bg-amber-warm text-night text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-200 no-underline shadow-md shadow-amber/20"
                    >
                      {t('midnightSunDining.stayInTemplate', { city: c.name })}
                    </AffiliateCTA>
                    <a
                      href={gygSearchLink(`${c.name} food tour summer`, `midnight_sun_${c.name.toLowerCase().replace(/[^a-z]/g, '')}`, locale)}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                      className="inline-flex items-center gap-1.5 bg-white/8 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200 no-underline"
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

      {/* Bottom CTA */}
      <section className="relative py-20 overflow-hidden">
        <img
          src={DINING.fineDining}
          alt="Lapland summer terrace dining"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-night/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(253,224,71,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 sm:px-6">
          <Flame size={32} className="text-yellow-300 mx-auto mb-4" />
          <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-4">
            {t('midnightSunDining.bottomHeadline')}
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            {t('midnightSunDining.bottomLead')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={to('/restaurants')}
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber-warm text-night px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
            >
              {t('midnightSunDining.bottomCtaBrowse')}
            </Link>
            <Link
              to={to('/local-food')}
              className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 no-underline"
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
