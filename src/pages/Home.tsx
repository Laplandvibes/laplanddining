
import { useTranslation } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import { ChevronDown, MapPin, Star, UtensilsCrossed, Flame, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateCTA from '../components/AffiliateCTA';
import EditorsPicks from '../components/EditorsPicks';
import FAQ from '../components/FAQ';
import { DINING } from '../data/images';
import { restaurants, cities } from '../data/restaurants';
import HomeAdSlots from '../../../shared/HomeAdSlots';
import { AD_SLOTS } from '../data/partners';
import GygPicks from '../components/GygPicks';
import { AppPromoHero } from '../components/AppPromo';

interface CuisineCardI18n { title: string; desc: string }
interface FAQItemI18n { question: string; answer: string }

// Each experience card routes to the pillar page that goes deep on it.
const cuisineCardsMeta = [
  { image: DINING.fineDining, icon: Star, href: '/fine-dining' },
  { image: DINING.kotaFire, icon: Flame, href: '/food-history' },
  { image: DINING.ingredients, icon: UtensilsCrossed, href: '/local-food' },
];

export default function Home() {
  const { t } = useTranslation('pages');
  const { to, locale } = useLocale();

  const cuisineCardsCopy = (t('home.cuisineCards', { returnObjects: true }) as CuisineCardI18n[]) || [];
  // FAQPage JSON-LD is generated from the same localized items the visible
  // <FAQ /> accordion renders, so schema and on-page content stay in lockstep
  // (Google structured-data guideline: FAQ markup must match visible content).
  const faqItems = (t('home.faq.items', { returnObjects: true }) as FAQItemI18n[]) || [];

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
            <Link
              to={to('/fine-dining')}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 hover:border-amber/60 hover:bg-white/15 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 no-underline"
            >
              {t('home.heroCtaFine')}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-white/80" />
        </div>
      </section>




      {/* Pääkumppaninauha on nyt App-tasolla navin alla (SponsorStrip) —
          ei enää erillistä banneria tähän. */}

      {/* ── Toimituksen valinnat — ruokaa heti heron alle (v2.0, Vesa 3.8.:
          "koko etusivu on kaikkea muuta kuin ruokaa"). Ennen tätä ensimmäinen
          oikea ravintola tuli vastaan vasta ~2 700 px kohdalla, mainospaikkojen
          ja GYG-kategorianappien jälkeen. Nyt näytöllä 2 on kuusi käsin
          valittua ravintolaa. */}
      <EditorsPicks />

      {/* ── Cuisine Highlights — kolme pilarikorttia, jokainen linkittää
          omalle syventävälle sivulleen ─────────────────────────────── */}
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
                <Link
                  key={title || i}
                  to={to(card.href)}
                  className="group relative rounded-2xl overflow-hidden h-96 block no-underline"
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
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Midnight Sun Dining (kesä-sääntö) ─────────────────────── */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-night to-night" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(253,224,71,0.10)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(245,158,11,0.08)_0%,transparent_50%)]" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 lg:gap-12 items-center">
            <div className="md:col-span-2 relative aspect-[4/5] md:aspect-auto md:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-amber/15">
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
            <div className="md:col-span-3">
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

      {/* ── Kumppaniosio: kakkospääkumppani + premium-kohdepaikat (LV Media).
          v2.0: siirretty ruokasisällön (valinnat + pilarit + kesä) alle —
          myyty kortti näkyy yhä etusivulla, mutta tyhjä house-ad ei enää
          omista näyttöä 2–3 ennen ensimmäistäkään ravintolaa. */}
      <HomeAdSlots config={AD_SLOTS} locale={locale} className="bg-night" />

      {/* ── By Destination — kaupunki-indeksi (18 kohdetta) ────────── */}
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
          <div className="mt-16 grid grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
            {[
              { value: String(restaurants.length), label: t('home.statsVerified') },
              { value: String(cities.length), label: t('home.statsDestinations') },
              { value: '2026', label: t('home.statsYear') },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-night/85 backdrop-blur-md p-4 md:p-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              >
                <p className="font-heading text-4xl md:text-5xl text-amber tracking-wide">{s.value}</p>
                <p className="text-white/75 text-xs md:text-sm mt-1 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Varattavat GYG-tuotteet — myytyjen mainospaikkojen ALAPUOLELLA
          (mainosmalli-invariantti säilyy v2.0:ssa). Korvaa myös vanhan
          erillisen "Food tours" -bandin: kaksi GYG-osiota samalla sivulla
          oli tuplausta. */}
      <GygPicks />

      {/* ── Stay & Eat — hotel booking band (worker-routed partners) ── */}
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

      {/* App-nosto: pysyy etusivulla (verkoston 26/26-rollout), mutta v2.0:ssa
          ruokatarinan jälkeen ennen FAQ:ta — ei enää keskellä ravintolasisältöä.
          Sivu lyheni ~13,4 → ~8 näytölliseen, joten tämäkin syvyys skrollataan. */}
      <AppPromoHero />

      {/* ── FAQ (visible accordion backing the FAQPage JSON-LD) ──── */}
      <FAQ />

    </>  );
}
