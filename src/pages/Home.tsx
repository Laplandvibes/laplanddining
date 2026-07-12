
import { useTranslation } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import { ChevronDown, MapPin, Star, UtensilsCrossed, Flame, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateCTA from '../components/AffiliateCTA';
import CityTopPicksGrid from '../components/CityTopPicksGrid';
import FAQ from '../components/FAQ';
import { gygCategoryLink, gygSearchLink } from '../lib/gyg';
import { DINING } from '../data/images';
import { getFeaturedRestaurants, restaurants, cities } from '../data/restaurants';
import HomeAdSlots from '../../../shared/HomeAdSlots';
import { AD_SLOTS } from '../data/partners';

interface CuisineCardI18n { title: string; desc: string }
interface FAQItemI18n { question: string; answer: string }

const cuisineCardsMeta = [
  { image: DINING.fineDining, icon: Star },
  { image: DINING.kotaFire, icon: Flame },
  { image: DINING.ingredients, icon: UtensilsCrossed },
];

export default function Home() {
  const { t } = useTranslation('pages');
  const { to, locale } = useLocale();
  const featured = getFeaturedRestaurants();
  void featured; // legacy helper still exported, currently unused on the home grid (CityTopPicksGrid replaces it)

  const cuisineCardsCopy = (t('home.cuisineCards', { returnObjects: true }) as CuisineCardI18n[]) || [];
  // FAQPage JSON-LD is generated from the same localized items the visible
  // <FAQ /> accordion renders, so schema and on-page content stay in lockstep
  // (Google structured-data guideline: FAQ markup must match visible content).
  const faqItems = (t('home.faq.items', { returnObjects: true }) as FAQItemI18n[]) || [];
  const tourLabels = (t('home.tourLinks', { returnObjects: true }) as string[]) || [];
  const tourLinks = [
    { label: tourLabels[0], href: gygSearchLink('lapland food tour', 'home_food_tours_lapland') },
    { label: tourLabels[1], href: gygSearchLink('lapland cooking class', 'home_cooking_lapland') },
    { label: tourLabels[2], href: gygCategoryLink('rovaniemi-l2653', 'food-and-drink', 'home_food_rovaniemi') },
    { label: tourLabels[3], href: gygCategoryLink('levi-sirkka-l150197', 'food-and-drink', 'home_food_levi') },
  ];

  return (
    <>
      <title>{t('home.title')}</title>
      <meta name="description" content={t('home.description')} />
      <Hreflang path="/" />
      <meta name="robots" content="index, follow" />
      {faqItems.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          })}
        </script>
      )}

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <img
          src={DINING.heroInterior}
          alt="Lapland restaurant interior"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.42) 50%, rgba(15,23,42,0.30) 100%)',
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide leading-tight mb-6 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {t('home.heroH1')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-10 font-body leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('home.heroLead')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={to('/restaurants')}
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber-warm text-night px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
            >
              {t('home.heroCtaExplore')}
              <ChevronDown size={20} />
            </Link>
            <AffiliateCTA
              partner="hotels"
              sid="hero_hotels_lapland"
              destination="Lapland, Finland"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 hover:border-vibe-pink/60 hover:bg-white/15 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 no-underline"
            >
              {t('home.heroCtaStay')}
            </AffiliateCTA>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-white/80" />
        </div>
      </section>

      {/* Pääkumppaninauha on nyt App-tasolla navin alla (SponsorStrip) —
          ei enää erillistä banneria tähän. */}

      {/* ── Midnight Sun Dining (kesä-sääntö, top-3-fold) ─────────── */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-night to-night" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(253,224,71,0.10)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(245,158,11,0.08)_0%,transparent_50%)]" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-2 relative aspect-[4/5] lg:aspect-auto lg:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-amber/15">
              <img
                src={DINING.kotaFire}
                alt="Midnight sun terrace dinner in Lapland"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-yellow-900/30" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-300/20 backdrop-blur-md border border-yellow-300/40">
                <Sun size={12} className="text-yellow-200" />
                <span className="text-yellow-100 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {t('home.midnightBadge')}
                </span>
              </div>
            </div>
            <div className="lg:col-span-3">
              <p className="text-yellow-300/90 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
                {t('home.midnightKicker')}
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-5 leading-tight">
                {t('home.midnightHeadline1')}<br />
                <span className="text-yellow-200">{t('home.midnightHeadline2')}</span>
              </h2>
              <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-7 max-w-xl">
                {t('home.midnightBody')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={to('/midnight-sun-dining')}
                  className="inline-flex items-center gap-2 bg-yellow-300 hover:bg-yellow-200 text-night px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 no-underline shadow-lg shadow-yellow-400/30"
                >
                  {t('home.midnightCtaGuide')}
                  <Sun size={16} />
                </Link>
                <AffiliateCTA
                  partner="hotels-seasonal"
                  sid="home_midnight_sun_hotels"
                  destination="Lapland, Finland"
                  query={{ checkin: '2026-06-15', checkout: '2026-06-18' }}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/25 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 no-underline"
                >
                  {t('home.midnightCtaStays')}
                </AffiliateCTA>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Kumppaniosio ylhäällä: kakkospääkumppani + 6 premium-
          kohdepaikkaa (LV Media) ──────────────────────────────────── */}
      <HomeAdSlots config={AD_SLOTS} locale={locale} className="bg-night" />

      {/* ── City Top Picks (18 cities, B2B-ready) ─────────────────── */}
      <CityTopPicksGrid />

      {/* ── Cuisine Highlights ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night/95 aurora-glow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              {t('home.cuisineHeadline')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('home.cuisineLead')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cuisineCardsMeta.map((card, i) => {
              const Icon = card.icon;
              const copy = cuisineCardsCopy[i];
              const title = copy?.title ?? '';
              const desc = copy?.desc ?? '';
              return (
                <div
                  key={title || i}
                  className="group relative rounded-2xl overflow-hidden h-96"
                >
                  <img
                    src={card.image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-6">
                    <div className="w-12 h-12 bg-amber/20 rounded-xl flex items-center justify-center mb-3">
                      <Icon size={24} className="text-amber" />
                    </div>
                    <h3 className="font-heading text-2xl text-white tracking-wide mb-2">
                      {title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── By Destination ───────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-night overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber/5 rounded-full blur-[120px] animate-[aurora-drift_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] animate-[aurora-drift_14s_ease-in-out_infinite_reverse]" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
            {t('home.destinationsHeadline')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
            {t('home.destinationsLead')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {cities.map((city, i) => (
              <Link
                key={city}
                to={to(`/restaurants#${city.toLowerCase().replace(/[^a-z]/g, '')}`)}
                className="group px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-amber/10 hover:border-amber/40 hover:text-amber hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)] hover:scale-105 transition-all duration-300 font-medium no-underline"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <MapPin size={14} className="inline mr-2 -mt-0.5 group-hover:text-amber transition-colors" />
                {city}
              </Link>
            ))}
          </div>

          {/* Stats — verified counts only, no manufactured "100%" */}
          <div className="mt-16 flex flex-wrap justify-center gap-12 text-center">
            <div>
              <p className="font-heading text-4xl text-amber tracking-wide">{restaurants.length}</p>
              <p className="text-white/75 text-sm mt-1">{t('home.statsVerified')}</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-amber tracking-wide">{cities.length}</p>
              <p className="text-white/75 text-sm mt-1">{t('home.statsDestinations')}</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-amber tracking-wide">2026</p>
              <p className="text-white/75 text-sm mt-1">{t('home.statsYear')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stay & Eat — Hotels.com booking band ─────────────────── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-night via-night-light to-night">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(236,72,153,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <p className="text-vibe-pink text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            {t('home.stayKicker')}
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-5">
            {t('home.stayHeadline')}
          </h2>
          <p className="text-white/80 text-base max-w-2xl mx-auto mb-9 leading-relaxed">
            {t('home.stayLead')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { city: 'Rovaniemi', sid: 'home_stay_rovaniemi' },
              { city: 'Levi', sid: 'home_stay_levi' },
              { city: 'Inari', sid: 'home_stay_inari' },
              { city: 'Saariselkä', sid: 'home_stay_saariselka' },
            ].map((c) => (
              <AffiliateCTA
                key={c.city}
                partner="hotels"
                sid={c.sid}
                destination={`${c.city}, Finland`}
                className="inline-flex items-center justify-center gap-1.5 bg-vibe-pink hover:bg-pink-600 text-white px-4 py-3 rounded-full font-bold text-sm transition-all duration-200 no-underline shadow-md shadow-vibe-pink/20 min-h-[44px]"
              >
                {c.city}
              </AffiliateCTA>
            ))}
          </div>
          <p className="text-white/55 text-xs mt-6">
            {t('home.stayAffiliateNote')}
            <Link to={to('/about')} className="underline hover:text-white/80 ml-1">{t('home.stayAffiliateLink')}</Link>.
          </p>
        </div>
      </section>

      {/* ── Food tours band (GYG) ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-arctic-cyan text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            {t('home.toursKicker')}
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-5">
            {t('home.toursHeadline')}
          </h2>
          <p className="text-white/80 text-base max-w-2xl mx-auto mb-9 leading-relaxed">
            {t('home.toursLead')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {tourLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center gap-2 bg-arctic-cyan/15 hover:bg-arctic-cyan/25 border border-arctic-cyan/40 text-arctic-cyan hover:text-white px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200 no-underline min-h-[44px]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (visible accordion backing the FAQPage JSON-LD) ──── */}
      <FAQ />
    </>
  );
}
