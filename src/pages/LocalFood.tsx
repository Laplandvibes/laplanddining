
import { useTranslation, Trans } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import { Leaf, Droplets, Mountain, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygSearchLink } from '../lib/gyg';
import { DINING } from '../data/images';
import PageBreadcrumb from '../components/PageBreadcrumb';
import WhereToNext from '../components/WhereToNext';

interface SectionI18n { title: string; paragraphs: string[] }
interface IngredientI18n { name: string; fact: string; season: string }

const sectionIcons = [Award, Droplets, Leaf, Mountain];

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
            "Why Lapland produces some of the cleanest, most nutrient-dense food on Earth — and how Finnish food production sets the standard for purity.",
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
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
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
              return (
                <div key={i}>
                  <div className="flex items-center gap-3 mb-6">
                    <Icon size={24} className="text-amber" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ingredients.map((item) => (
              <div
                key={item.name}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-amber/20 transition-all duration-300"
              >
                <h3 className="font-heading text-lg text-amber tracking-wide mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-3">
                  {t('localFood.seasonLabel')}: {item.season}
                </p>
                <p className="text-sm text-white/75 leading-relaxed">{item.fact}</p>
              </div>
            ))}
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
