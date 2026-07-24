import { Link } from 'react-router-dom';
import { Star, MapPin, Award, Quote, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../i18n/useLocale';
import AffiliateCTA from './AffiliateCTA';
import { getTopPicksByCity, partnershipBadgeLocalized, composeCardBody, cuisineLabel, googleReviewsUrl, type Restaurant, type Locale } from '../data/restaurants';

function tierClass(tier: Restaurant['partnership']) {
  switch (tier) {
    case 'gold':
      return 'ring-2 ring-amber/70 shadow-[0_30px_60px_-20px_rgba(245,158,11,0.45)]';
    case 'premium':
      return 'ring-1 ring-amber/50 shadow-[0_20px_40px_-15px_rgba(245,158,11,0.25)]';
    case 'verified':
      return 'ring-1 ring-amber/25';
    default:
      return '';
  }
}

interface CardLabels {
  websiteLabel: string;
  mapsLabel: string;
  stayNearby: string;
  seeMore: (city: string) => string;
  reviewsCta: (count: string) => string;
}

function CityCard({ r, labels, to, locale }: { r: Restaurant; labels: CardLabels; to: (path: string) => string; locale: Locale }) {
  const body = composeCardBody(r, locale);
  const cuisine = cuisineLabel(r, locale);
  const badge = partnershipBadgeLocalized(r.partnership, locale);
  const cityHash = r.city.toLowerCase().replace(/[^a-z]/g, '');

  return (
    <article
      className={`group relative bg-cream rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-[0_15px_40px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_55px_-15px_rgba(0,0,0,0.75)] hover:-translate-y-0.5 ${tierClass(r.partnership)}`}
    >
      <div className="relative h-48 sm:h-52 overflow-hidden shrink-0">
        <Link
          to={to(`/restaurants#${cityHash}`)}
          className="absolute inset-0 no-underline"
          aria-label={labels.seeMore(r.city)}
        >
          {r.photo ? (
            <img
              src={r.photo}
              alt={`${r.name} in ${r.city}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a1c14] via-warm-ink to-[#3d2a1d] flex flex-col items-center justify-center gap-2">
              <UtensilsCrossed className="w-10 h-10 text-amber/55" strokeWidth={1.5} />
              {cuisine && (
                <span className="text-amber/60 text-[10px] font-bold uppercase tracking-[0.2em] px-5 text-center leading-snug">{cuisine}</span>
              )}
            </div>
          )}
        </Link>

        <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-ink/85 backdrop-blur-sm pointer-events-none">
          <MapPin size={11} className="text-amber" />
          <span className="text-cream text-[10px] font-bold uppercase tracking-[0.15em]">{r.city}</span>
        </div>
        {r.rating && (
          <a
            href={googleReviewsUrl(r.googlePlaceId)}
            target="_blank"
            rel="nofollow noopener"
            className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber text-warm-ink text-xs font-bold shadow-md hover:bg-amber-warm transition-colors no-underline"
          >
            <Star size={10} className="fill-warm-ink" />
            <span>{r.rating.toFixed(1)}</span>
            {r.reviewCount && (
              <span className="font-semibold opacity-75">·&nbsp;{r.reviewCount.toLocaleString('en')}</span>
            )}
          </a>
        )}
        {badge && (
          <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber text-warm-ink text-[10px] font-bold uppercase tracking-wider shadow-md pointer-events-none">
            <Award size={10} />
            {badge}
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-heading text-xl sm:text-2xl tracking-wide text-warm-ink leading-tight">
            {r.name}
          </h3>
          {r.priceRange && (
            <span className="font-heading text-amber-deep text-sm tracking-widest shrink-0 mt-1">{r.priceRange}</span>
          )}
        </div>

        {cuisine && (
          <p className="text-[11px] text-amber-deep font-semibold uppercase tracking-[0.18em] mb-3">
            {cuisine}
          </p>
        )}

        {body && (
          body.isQuote ? (
            <div className="mb-4 flex-1">
              <blockquote className="relative pl-5 text-[14px] text-warm-text leading-relaxed italic line-clamp-4">
                <Quote size={11} className="absolute left-0 top-1.5 text-amber-deep -scale-x-100" />
                {body.text}
              </blockquote>
              <a
                href={googleReviewsUrl(r.googlePlaceId)}
                target="_blank"
                rel="nofollow noopener"
                className="inline-block mt-2 text-[10px] text-warm-muted hover:text-spice tracking-[0.15em] uppercase font-bold no-underline"
              >
                {labels.reviewsCta(r.reviewCount?.toLocaleString('en') ?? '')}
              </a>
            </div>
          ) : (
            <p className="text-[14px] text-warm-text leading-relaxed mb-4 line-clamp-5 flex-1">{body.text}</p>
          )
        )}

        <div className="flex flex-wrap items-center gap-3 mt-auto pt-3 border-t border-warm-ink/10">
          {r.website && (
            <a
              href={r.website}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex items-center gap-1 text-amber-deep hover:text-spice text-xs font-bold uppercase tracking-wider transition-colors no-underline"
            >
              {labels.websiteLabel} →
            </a>
          )}
          <a
            href={r.googleMapsUrl}
            target="_blank"
            rel="nofollow noopener"
            className="inline-flex items-center gap-1 text-warm-muted hover:text-warm-ink text-xs font-bold uppercase tracking-wider transition-colors no-underline"
          >
            {labels.mapsLabel} →
          </a>
          <AffiliateCTA
            partner="hotels"
            sid={`top_picks_stay_${r.city.toLowerCase().replace(/[^a-z]/g, '_')}`}
            destination={`${r.city}, ${r.country}`}
            className="ml-auto inline-flex items-center gap-1 bg-vibe-pink hover:bg-pink-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all no-underline shadow-sm shadow-vibe-pink/30"
          >
            {labels.stayNearby}
          </AffiliateCTA>
        </div>
      </div>
    </article>
  );
}

export default function CityTopPicksGrid() {
  const { t } = useTranslation('pages');
  const { to, locale } = useLocale();
  const picks = getTopPicksByCity();

  const labels: CardLabels = {
    websiteLabel: t('restaurants.websiteLabel'),
    mapsLabel: t('restaurants.mapsLabel'),
    stayNearby: t('common.stayNearby'),
    seeMore: (city: string) => t('common.seeMoreInCity', { city }),
    reviewsCta: (count: string) => t('restaurants.readReviews', { count }),
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-night overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(245,158,11,0.05)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            {t('common.cityTopPicksKicker', { count: picks.length })}
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-snow tracking-wide mb-4">
            {t('common.cityTopPicksHeadline')}
          </h2>
          <p className="text-snow/65 text-base max-w-2xl mx-auto leading-relaxed">
            {t('common.cityTopPicksLead')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {picks.map((r) => (
            <CityCard key={r.googlePlaceId} r={r} labels={labels} to={to} locale={locale} />
          ))}
        </div>

        <p className="text-center text-snow/75 text-xs mt-12 tracking-wider">
          {t('common.dataRefreshed', { date: picks[0]?.lastVerified || '—' })}{' '}
          <Link to={to('/about')} className="underline hover:text-snow/70">{t('common.howWeChoose')}</Link>.
        </p>
      </div>
    </section>
  );
}
