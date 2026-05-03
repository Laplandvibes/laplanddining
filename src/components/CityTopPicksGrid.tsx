import { Link } from 'react-router-dom';
import { Star, MapPin, Award, Quote } from 'lucide-react';
import AffiliateCTA from './AffiliateCTA';
import { getTopPicksByCity, partnershipBadge, composeCardBody, cuisineLabel, type Restaurant } from '../data/restaurants';

/**
 * 18 Lapland cities × 1 top-pick restaurant each. Sourced from Google Places
 * (rating × log10 reviews) and editorially adjustable via restaurant-overrides.ts.
 *
 * Each card is a B2B-ready slot: tier `editorial` (free, default) → `verified`
 * → `premium` → `gold` (paid, surfaces a star badge + Book Now CTA). Future
 * partnership upgrades only need an entry in restaurant-overrides.ts.
 */

function tierClass(tier: Restaurant['partnership']) {
  switch (tier) {
    case 'gold':
      return 'border-amber/60 ring-2 ring-amber/30 shadow-[0_0_30px_-10px_rgba(245,158,11,0.4)]';
    case 'premium':
      return 'border-amber/40 hover:border-amber/60';
    case 'verified':
      return 'border-arctic-cyan/30 hover:border-arctic-cyan/60';
    default:
      return 'border-white/10 hover:border-amber/30';
  }
}

function priceDots(p: Restaurant['priceRange']) {
  if (!p) return null;
  return (
    <span className="text-amber/70 text-xs font-bold tracking-wider">{p}</span>
  );
}

function CityCard({ r }: { r: Restaurant }) {
  const body = composeCardBody(r);
  const cuisine = cuisineLabel(r);
  const badge = partnershipBadge(r.partnership);
  const cityHash = r.city.toLowerCase().replace(/[^a-z]/g, '');

  return (
    <article
      className={`group relative bg-white/[0.03] rounded-2xl overflow-hidden border ${tierClass(r.partnership)} transition-all duration-300 flex flex-col`}
    >
      <Link to={`/restaurants#${cityHash}`} className="relative h-44 sm:h-48 overflow-hidden shrink-0 no-underline">
        {r.photo ? (
          <img
            src={r.photo}
            alt={`${r.name} in ${r.city}`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber/20 via-night to-night/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />

        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-night/70 backdrop-blur-sm border border-white/15">
          <MapPin size={11} className="text-amber" />
          <span className="text-white text-[10px] font-bold uppercase tracking-wider">{r.city}</span>
        </div>

        {r.rating && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber/95 text-night text-[11px] font-bold">
            <Star size={10} className="fill-night" />
            {r.rating.toFixed(1)}
          </div>
        )}

        {badge && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber/95 text-night text-[10px] font-bold uppercase tracking-wider">
            <Award size={10} />
            {badge}
          </div>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-heading text-lg sm:text-xl tracking-wide text-white leading-tight">
            {r.name}
          </h3>
          {priceDots(r.priceRange)}
        </div>

        {cuisine && (
          <p className="text-[11px] text-amber/70 font-medium uppercase tracking-wider mb-2">
            {cuisine}
          </p>
        )}

        {body && (
          body.isQuote ? (
            <blockquote className="relative pl-5 mb-3 text-[13px] text-white/60 leading-relaxed italic line-clamp-3 flex-1">
              <Quote size={11} className="absolute left-0 top-1 text-amber/40 -scale-x-100" />
              {body.text}
            </blockquote>
          ) : (
            <p className="text-[13px] text-white/55 leading-relaxed mb-3 line-clamp-3 flex-1">{body.text}</p>
          )
        )}

        {r.reviewCount && (
          <p className="text-[10px] text-white/30 mb-3 tracking-wider uppercase">
            {r.reviewCount.toLocaleString('en')} reviews{body?.isQuote ? ' · quote from Google' : ''}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          {r.website && (
            <a
              href={r.website}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex items-center gap-1 text-amber hover:text-white text-xs font-semibold transition-colors no-underline"
            >
              Website →
            </a>
          )}
          <a
            href={r.googleMapsUrl}
            target="_blank"
            rel="nofollow noopener"
            className="inline-flex items-center gap-1 text-arctic-cyan hover:text-white text-xs font-semibold transition-colors no-underline"
          >
            Maps →
          </a>
          <AffiliateCTA
            partner="hotels"
            sid={`top_picks_stay_${r.city.toLowerCase().replace(/[^a-z]/g, '_')}`}
            destination={`${r.city}, ${r.country}`}
            className="ml-auto inline-flex items-center gap-1 bg-vibe-pink/15 hover:bg-vibe-pink/25 border border-vibe-pink/40 text-vibe-pink hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-full transition-all no-underline"
          >
            Stay nearby
          </AffiliateCTA>
        </div>
      </div>
    </article>
  );
}

export default function CityTopPicksGrid() {
  const picks = getTopPicksByCity();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            One pick per city · {picks.length} destinations
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
            Lapland's best table — by city
          </h2>
          <p className="text-white/55 text-base max-w-2xl mx-auto leading-relaxed">
            For every Lapland destination we travel to, we pick the one restaurant
            that locals send first-time visitors to. Ratings & reviews from Google,
            written-up by the LaplandVibes editorial team, and paired with a
            walking-distance hotel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {picks.map((r) => (
            <CityCard key={r.googlePlaceId} r={r} />
          ))}
        </div>

        <p className="text-center text-white/35 text-xs mt-10">
          Data refreshed {picks[0]?.lastVerified || '—'} from Google Places.{' '}
          <Link to="/about" className="underline hover:text-white/60">How we choose</Link>.
        </p>
      </div>
    </section>
  );
}
