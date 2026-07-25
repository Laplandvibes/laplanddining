import { Fragment } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import { Leaf, Droplets, Mountain, Award, Fish, Bird } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygSearchLink } from '../lib/gyg';
import { DINING } from '../data/images';
import { restaurants } from '../data/restaurants';
import PageBreadcrumb from '../components/PageBreadcrumb';
import WhereToNext from '../components/WhereToNext';

interface SectionI18n { title: string; paragraphs: string[] }
interface IngredientI18n { name: string; fact: string; season: string }

const sectionIcons = [Award, Droplets, Leaf, Mountain];

// ── Ingredient card image tops ────────────────────────────────────────────────
// Real photos exist for 7 of the 8 ingredients (reindeer, char & salmon,
// cloudberry, bilberry, lingonberry, wild mushrooms, wild herbs), self-hosted
// responsive webp+avif under /images/local-food/. The last one (game birds)
// uses a warm amber/cream gradient placeholder with an icon until a real photo
// is shot (NOT a fake photo, NOT a mismatched stock image).
const LOCAL_FOOD_IMG = '/images/local-food';
const CARD_IMG_SIZES = '(min-width:1024px) 23vw, (min-width:640px) 46vw, 92vw';
type IngredientMedia = { photo: string } | { icon: typeof Fish };
const ingredientMedia: (IngredientMedia | null)[] = [
  { photo: 'poro' },          // 0 Reindeer
  { photo: 'nieria-lohi' },   // 1 Arctic Char & Salmon
  { photo: 'hilla' },         // 2 Cloudberry
  { photo: 'villimustikka' }, // 3 Wild Bilberry
  { photo: 'puolukka' },      // 4 Lingonberry
  { photo: 'villisienet' },   // 5 Wild Mushrooms
  { icon: Bird },             // 6 Game Birds — placeholder (no photo yet)
  { photo: 'villiyrtit' },    // 7 Wild Herbs
];

// ── "Missä maistat" / "Where to taste" cross-links ────────────────────────────
// Each ingredient links to restaurants ALREADY in the dining catalog whose real,
// verified tags (cuisine / dish highlights / editorial copy) match that
// ingredient. Links go to the matching restaurant's city section on /restaurants.
// Wild Mushrooms (index 5) has no restaurant tagged for mushrooms → no link.
const CROSS_LINK_IDS: string[][] = [
  ['ChIJvySHpvNLK0QRY-dnGYTVum4', 'manual-pyhatunturi-huttuhippu', 'ChIJi-G83CoShEQRRUEm0zRaos0'], // Reindeer: Nili, Huttuhippu, Rouhe
  ['manual-rovaniemi-all-about-salmon', 'ChIJd2up905N0kURTWJBTBizK7A', 'ChIJia3ekmY-1UURpiwLrRRqEa4'], // Char & Salmon: All About Salmon, Saamen Kammi, Kukkolaforsen
  ['manual-posio-korpihilla', 'ChIJvySHpvNLK0QRY-dnGYTVum4'], // Cloudberry: Korpihilla, Nili
  ['manual-posio-korpihilla', 'manual-rovaniemi-all-about-salmon'], // Bilberry: Korpihilla, All About Salmon
  ['manual-posio-korpihilla', 'manual-rovaniemi-all-about-salmon'], // Lingonberry: Korpihilla, All About Salmon
  [], // Wild Mushrooms: no tagged match
  ['manual-saariselka-laanilan-kievari', 'ChIJvySHpvNLK0QRY-dnGYTVum4'], // Game Birds: Laanilan Kievari, Nili
  ['manual-rovaniemi-all-about-salmon', 'manual-posio-korpihilla', 'manual-saariselka-laanilan-kievari'], // Wild Herbs: All About Salmon, Korpihilla, Laanilan Kievari
];

const restaurantById = new Map(restaurants.map((r) => [r.googlePlaceId, r]));
const citySlug = (city: string) => city.toLowerCase().replace(/[^a-z]/g, '');

// Cinematic Arctic-nature band per section — forest floor, a clear stream,
// a reindeer in the birch forest, a silent fell lake. One image, one theme.
const sectionImages: { src: string; alt: string }[] = [
  { src: DINING.localFoodForest,   alt: 'Lingonberries, bilberries and chanterelles on a Lapland forest floor at first light' },
  { src: DINING.localFoodRiver,    alt: 'A clear Arctic stream running over frosted stones through a Lapland forest' },
  { src: DINING.localFoodReindeer, alt: 'A reindeer standing in a misty birch forest in autumn ruska colours' },
  { src: DINING.localFoodLakes,    alt: 'A mirror-still Lapland lake at dawn reflecting distant fells and low mist' },
];

export default function LocalFood() {
  const { t } = useTranslation('pages');
  const { to } = useLocale();
  const sections = (t('localFood.sections', { returnObjects: true }) as SectionI18n[]) || [];
  const ingredients = (t('localFood.ingredients', { returnObjects: true }) as IngredientI18n[]) || [];

  return (
    <>
      <title>{t('localFood.title')}</title>
      <meta name="description" content={t('localFood.description')} />
      <Hreflang path="/local-food" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          mainEntityOfPage: 'https://laplanddining.com/local-food',
          headline: 'Local Food & Arctic Ingredients in Finnish Lapland',
          description:
            "Why Lapland produces some of the cleanest, most nutrient-dense food on Earth, and how Finnish food production sets the standard for purity.",
          publisher: {
            '@type': 'Organization',
            name: 'LaplandDining',
            logo: { '@type': 'ImageObject', url: 'https://laplanddining.com/favicon.svg' },
          },
          datePublished: '2026-05-03',
          inLanguage: 'en',
        
          author: { "@type": "Organization", name: "LaplandDining", url: "https://laplanddining.com" },
          dateModified: "2026-05-16T00:00:00+02:00",
          image: "https://laplanddining.com/og/local-food-1200x630.jpg",
        })}
      </script>

      {/* Hero */}
      <section className="relative min-h-[60svh] flex items-center justify-center overflow-hidden [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        <img
          src={DINING.heroLocalFood}
          alt="Local Arctic ingredients on plate"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/50 to-night" />
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {t('localFood.heroH1')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('localFood.heroLead')}
          </p>
        </div>
      </section>

      <PageBreadcrumb />

      {/* Finland's Clean Food */}
      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/75 text-lg sm:text-xl leading-relaxed mb-14 border-l-2 border-amber/60 pl-5 italic">
            {t('localFood.intro')}
          </p>
          <div className="space-y-16">

            {sections.map((section, i) => {
              const Icon = sectionIcons[i] ?? Award;
              const img = sectionImages[i];
              return (
                <div key={i}>
                  {img && (
                    <div className="group relative aspect-[16/9] rounded-2xl overflow-hidden mb-7 border border-white/10 shadow-xl shadow-black/40">
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center bg-amber/10 border border-amber/30">
                      <Icon size={18} className="text-amber" />
                    </span>
                    <h2 className="font-heading text-3xl text-white tracking-wide">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-4 text-white/80 leading-relaxed">
                    {section.paragraphs.map((p, j) => (
                      <p key={j}>
                        <Trans
                          ns="pages"
                          i18nKey={`localFood.sections.${i}.paragraphs.${j}`}
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
              );
            })}

          </div>
        </div>
      </section>

      {/* Ingredients grid */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              {t('localFood.ingredientsHeadline')}
            </h2>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">
              {t('localFood.ingredientsLead')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {ingredients.map((item, idx) => {
              const media = ingredientMedia[idx];
              const photo = media && 'photo' in media ? media.photo : null;
              const PlaceholderIcon = media && 'icon' in media ? media.icon : null;
              const matches = (CROSS_LINK_IDS[idx] ?? [])
                .map((id) => restaurantById.get(id))
                .filter((r): r is NonNullable<typeof r> => Boolean(r))
                .slice(0, 3);
              return (
                <div
                  key={item.name}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber/25 transition-all duration-300"
                >
                  {photo ? (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <picture>
                        <source
                          type="image/avif"
                          srcSet={`${LOCAL_FOOD_IMG}/${photo}-800.avif 800w, ${LOCAL_FOOD_IMG}/${photo}-1200.avif 1200w`}
                          sizes={CARD_IMG_SIZES}
                        />
                        <source
                          type="image/webp"
                          srcSet={`${LOCAL_FOOD_IMG}/${photo}-800.webp 800w, ${LOCAL_FOOD_IMG}/${photo}-1200.webp 1200w`}
                          sizes={CARD_IMG_SIZES}
                        />
                        <img
                          src={`${LOCAL_FOOD_IMG}/${photo}-800.webp`}
                          alt={t('localFood.imageAlt', { name: item.name })}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      </picture>
                      <div className="absolute inset-0 bg-gradient-to-t from-night/45 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-amber/25 via-amber-deep/20 to-warm-ink flex items-center justify-center">
                      {PlaceholderIcon && (
                        <PlaceholderIcon size={34} strokeWidth={1.5} className="relative z-10 text-amber/45" />
                      )}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(245,158,11,0.20),transparent_62%)]" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading text-lg text-amber tracking-wide mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-3">
                      {t('localFood.seasonLabel')}: {item.season}
                    </p>
                    <p className="text-sm text-white/75 leading-relaxed flex-1">{item.fact}</p>
                    {matches.length > 0 && (
                      <p className="mt-4 pt-4 border-t border-white/10 text-xs text-white/55 leading-relaxed">
                        <span className="text-amber/80 font-semibold uppercase tracking-wider">
                          {t('localFood.whereToTaste')}:{' '}
                        </span>
                        {matches.map((r, k) => (
                          <Fragment key={r.googlePlaceId}>
                            <Link
                              to={`${to('/restaurants')}#${citySlug(r.city)}`}
                              className="text-white/80 hover:text-amber underline decoration-white/20 hover:decoration-amber underline-offset-2 transition-colors"
                            >
                              {r.name}
                            </Link>
                            {k < matches.length - 1 ? <span className="text-white/35">, </span> : null}
                          </Fragment>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA + booking */}
      <section className="py-16 bg-night">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl text-white tracking-wide mb-4">
            {t('localFood.ctaHeadline')}
          </h2>
          <p className="text-white/75 mb-8 leading-relaxed max-w-2xl mx-auto">
            {t('localFood.ctaLead')}
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center mb-6">
            <Link
              to={to('/restaurants')}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-amber hover:bg-amber-warm text-night px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
            >
              {t('localFood.ctaBrowse')}
            </Link>
            <AffiliateCTA
              partner="hotels"
              sid="local_food_stay_lapland"
              destination="Lapland, Finland"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-vibe-pink hover:bg-pink-600 text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 no-underline shadow-lg shadow-vibe-pink/25"
            >
              {t('localFood.ctaStay')}
            </AffiliateCTA>
            <a
              href={gygSearchLink('lapland cooking class food tour', 'local_food_cooking_classes')}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-arctic-cyan/15 hover:bg-arctic-cyan/25 border border-arctic-cyan/40 text-arctic-cyan hover:text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 no-underline"
            >
              {t('localFood.ctaTours')}
            </a>
          </div>
        </div>
      </section>

      <WhereToNext />
    </>
  );
}
