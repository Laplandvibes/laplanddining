
import { useTranslation } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import PhotoCaption from '../components/PhotoCaption';
import { Star, MapPin, ExternalLink, Award, Quote, UtensilsCrossed } from 'lucide-react';
import AffiliateCTA from '../components/AffiliateCTA';
import { DINING } from '../data/images';
import { restaurants, partnershipBadgeLocalized, composeCardBody, cuisineLabel, googleReviewsUrl, localizedStr } from '../data/restaurants';
import { withReferral } from '../lib/outbound';
import PageBreadcrumb from '../components/PageBreadcrumb';
import WhereToNext from '../components/WhereToNext';

/**
 * Fine Dining = the top-pick restaurant for each city, sorted by Google rating.
 */
export default function FineDining() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  const fineDining = restaurants
    .filter((r) => r.topPick)
    .filter((r) => (r.priceRange === '€€€' || r.priceRange === '€€€€') || (r.rating ?? 0) >= 4.5)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  // Real numbers only: list length, distinct cities, mean Google rating of the
  // rated venues on this page (no manufactured stats).
  const fineDiningCities = new Set(fineDining.map((r) => r.city)).size;
  const ratedVenues = fineDining.filter((r) => typeof r.rating === 'number');
  const avgRating = ratedVenues.length
    ? (ratedVenues.reduce((sum, r) => sum + (r.rating ?? 0), 0) / ratedVenues.length).toFixed(1)
    : null;

  return (
    <>
      <title>{t('fineDining.title')}</title>
      <meta
        name="description"
        content={t('fineDining.metaDescriptionTemplate', { count: fineDining.length })}
      />
      <Hreflang path="/fine-dining" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          mainEntityOfPage: 'https://laplanddining.com/fine-dining',
          headline: 'Fine Dining in Finnish Lapland',
          description:
            'Top-rated tasting menus across Finnish Lapland: Sámi heritage meets modern Nordic gastronomy.',
          publisher: {
            '@type': 'Organization',
            name: 'LaplandDining',
            logo: { '@type': 'ImageObject', url: 'https://laplanddining.com/favicon.svg' },
          },
          datePublished: '2026-05-03',
          inLanguage: 'en',
        
          author: { "@type": "Organization", name: "LaplandDining", url: "https://laplanddining.com" },
          dateModified: "2026-05-16T00:00:00+02:00",
          image: "https://laplanddining.com/og/fine-dining-1200x630.jpg",
        })}
      </script>

      {/* Hero */}
      <section className="relative min-h-[60svh] flex items-center justify-center px-4 sm:px-6 pb-24 md:pb-28 [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        <img
          src={DINING.fineDining}
          alt="Fine dining in Lapland"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/50 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-amber/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star size={32} className="text-amber" />
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-4 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {t('fineDining.heroH1')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('fineDining.heroLeadTemplate', { count: restaurants.length })}
          </p>
        </div>
      </section>

      {/* Stat tiles — overlap the hero bottom (skiresorts recipe), real data only */}
      <div className="relative z-10 -mt-14 md:-mt-16 px-4 sm:px-6">
        <div className={`max-w-3xl mx-auto grid grid-cols-2 ${avgRating ? 'md:grid-cols-3' : ''} gap-3 md:gap-4`}>
          <div className="rounded-2xl border border-white/10 bg-night/85 backdrop-blur-md p-4 md:p-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <p className="font-heading text-4xl md:text-5xl text-amber tracking-wide">{fineDining.length}</p>
            <p className="text-white/75 text-xs md:text-sm mt-1 leading-snug">{t('home.statsVerified')}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-night/85 backdrop-blur-md p-4 md:p-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <p className="font-heading text-4xl md:text-5xl text-amber tracking-wide">{fineDiningCities}</p>
            <p className="text-white/75 text-xs md:text-sm mt-1 leading-snug">{t('home.statsDestinations')}</p>
          </div>
          {avgRating && (
            <div className="col-span-2 md:col-span-1 rounded-2xl border border-white/10 bg-night/85 backdrop-blur-md p-4 md:p-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              <p className="font-heading text-4xl md:text-5xl text-amber tracking-wide inline-flex items-center gap-2">
                <Star size={22} className="text-amber fill-amber" aria-hidden="true" />
                {avgRating}
              </p>
              <p className="text-white/75 text-xs md:text-sm mt-1 leading-snug">{t('fineDining.statsAvgRating')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-10">
        <PageBreadcrumb />
      </div>

      {/* Fine dining grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fineDining.map((r) => {
              const body = composeCardBody(r, locale);
              const cuisine = cuisineLabel(r, locale);
              const badge = partnershipBadgeLocalized(r.partnership, locale);
              return (
                <article
                  key={r.googlePlaceId}
                  className="group bg-cream rounded-2xl overflow-hidden shadow-[0_25px_55px_-20px_rgba(0,0,0,0.65)] hover:shadow-[0_35px_70px_-20px_rgba(0,0,0,0.8)] hover:-translate-y-0.5 transition-all duration-500"
                >
                  <div className="relative h-60 overflow-hidden">
                    {r.photo ? (
                      <img
                        src={r.photo}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2a1c14] via-warm-ink to-[#3d2a1d] flex flex-col items-center justify-center gap-2.5">
                        <UtensilsCrossed className="w-10 h-10 text-amber/55" strokeWidth={1.5} />
                        {cuisine && (
                          <span className="text-amber/60 text-[11px] font-bold uppercase tracking-[0.22em] px-6 text-center leading-snug">{cuisine}</span>
                        )}
                      </div>
                    )}
                    <PhotoCaption r={r} locale={locale} />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-ink/85 backdrop-blur-sm">
                      <MapPin size={11} className="text-amber" />
                      <span className="text-cream text-[10px] font-bold uppercase tracking-[0.15em]">{r.city}</span>
                    </div>
                    {r.rating && (
                      <a
                        href={googleReviewsUrl(r.googlePlaceId)}
                        target="_blank"
                        rel="nofollow noopener"
                        className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream text-warm-ink text-xs font-bold shadow-md hover:bg-amber transition-colors no-underline"
                        aria-label={`${r.reviewCount?.toLocaleString('en') ?? ''} Google reviews: ${r.name}`}
                      >
                        <Star size={11} className="text-amber fill-amber" />
                        <span>{r.rating.toFixed(1)}</span>
                        {r.reviewCount && (
                          <span className="text-warm-muted font-semibold ml-0.5">· {r.reviewCount.toLocaleString('en')}</span>
                        )}
                      </a>
                    )}
                    {badge && (
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber text-warm-ink text-[10px] font-bold uppercase tracking-wider shadow-md">
                        <Award size={10} /> {badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading text-2xl tracking-wide text-warm-ink leading-tight mb-1">{r.name}</h3>
                    {(cuisine || r.priceRange) && (
                      <p className="text-xs text-amber-deep font-semibold uppercase tracking-[0.18em] mb-3">
                        {cuisine}
                        {cuisine && r.priceRange && <span className="text-warm-muted mx-2">·</span>}
                        {r.priceRange && <span className="font-heading tracking-widest">{r.priceRange}</span>}
                      </p>
                    )}
                    {body && (
                      body.isQuote ? (
                        <div className="mb-4">
                          <blockquote className="relative pl-6 text-sm text-warm-text leading-relaxed italic">
                            <Quote size={14} className="absolute left-0 top-1 text-amber-deep -scale-x-100" />
                            {body.text}
                          </blockquote>
                          <a
                            href={googleReviewsUrl(r.googlePlaceId)}
                            target="_blank"
                            rel="nofollow noopener"
                            className="inline-block mt-2 ml-6 text-[10px] text-warm-muted hover:text-spice tracking-[0.15em] uppercase font-bold no-underline"
                          >
                            {t('fineDining.readAllReviews', { count: r.reviewCount?.toLocaleString('en') ?? '' })}
                          </a>
                        </div>
                      ) : (
                        <p className="text-sm text-warm-text leading-relaxed mb-4">{body.text}</p>
                      )
                    )}
                    {r.highlights && r.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {r.highlights.map((h, i) => {
                          const label = localizedStr(h, locale);
                          return label ? (
                            <span
                              key={i}
                              className="text-[11px] bg-cream-warm text-amber-deep border border-amber/30 px-2.5 py-1 rounded-full font-semibold"
                            >
                              {label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-warm-ink/10">
                      {r.website && (
                        <a
                          href={withReferral(r.website, 'dining_finedining')}
                          target="_blank"
                          rel="nofollow noopener"
                          className="inline-flex items-center gap-1 text-amber-deep hover:text-spice text-xs font-bold uppercase tracking-wider transition-colors no-underline"
                        >
                          {t('fineDining.websiteLabel')} <ExternalLink size={12} />
                        </a>
                      )}
                      <a
                        href={r.googleMapsUrl}
                        target="_blank"
                        rel="nofollow noopener"
                        className="inline-flex items-center gap-1 text-warm-muted hover:text-warm-ink text-xs font-bold uppercase tracking-wider transition-colors no-underline"
                      >
                        {t('fineDining.mapsLabel')} <ExternalLink size={12} />
                      </a>
                      <AffiliateCTA
                        partner="hotels"
                        sid={`fine_dining_stay_${r.city.toLowerCase().replace(/[^a-z]/g, '_')}`}
                        destination={`${r.city === 'Ylläs' ? 'Äkäslompolo' : r.city}, ${r.country}`}
                        className="ml-auto inline-flex items-center gap-1 bg-vibe-pink hover:bg-pink-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all no-underline shadow-sm shadow-vibe-pink/30"
                      >
                        {t('fineDining.stayInTemplate', { city: r.city })}
                      </AffiliateCTA>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <WhereToNext />
    </>
  );
}
