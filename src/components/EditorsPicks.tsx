import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../i18n/useLocale';
import { restaurants, cities, type Restaurant } from '../data/restaurants';
import { CityCard, type CardLabels } from './CityTopPicksGrid';

/**
 * Front-page editorial six. Hand-picked slugs, not a rating sort: a pure
 * numeric gate (rating + review count) surfaces a pizza-kebab bar and a Korean
 * grill ahead of the kota kitchens this site exists to showcase. Slugs rather
 * than array indexes so a Maps re-sync that renames or drops a venue degrades
 * to five cards instead of promoting a stranger.
 */
const PICK_SLUGS = [
  'rovaniemi-nili-restaurant',         // 4.5 · 3 027 — the Lappish classic
  'inari-restaurant-aanaar',           // 4.8 · 464 — Sámi fine dining
  'saariselka-fieno',                  // 4.8 · 529
  'kittila-saamen-kammi',              // 4.5 · 248 — kota dining
  'levi-grill-it-levi',                // 4.6 · 406
  'posio-lapland-restaurant-kotahovi', // 4.5 · 471
];

export default function EditorsPicks() {
  const { t } = useTranslation('pages');
  const { to, locale } = useLocale();
  const bySlug = new Map(restaurants.map((r) => [r.slug, r]));
  const picks = PICK_SLUGS.map((s) => bySlug.get(s)).filter((r): r is Restaurant => Boolean(r));
  if (picks.length === 0) return null;

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
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            {t('home.picksKicker')}
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-snow tracking-wide mb-4">
            {t('home.picksHeadline')}
          </h2>
          <p className="text-snow/65 text-base max-w-2xl mx-auto leading-relaxed">
            {t('home.picksLead')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {picks.map((r) => (
            <CityCard key={r.googlePlaceId} r={r} labels={labels} to={to} locale={locale} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to={to('/restaurants')}
            className="inline-flex items-center gap-2 bg-amber hover:bg-amber-warm text-night px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
          >
            {t('home.picksCtaAll', { count: restaurants.length, cities: cities.length })}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
