
import { useTranslation, Trans } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import { Flame, Snowflake, TreePine, Fish } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DINING } from '../data/images';
import PageBreadcrumb from '../components/PageBreadcrumb';
import WhereToNext from '../components/WhereToNext';

interface SectionI18n { title: string; paragraphs: string[] }

const sectionIcons = [Snowflake, Flame, Fish, TreePine, Flame, Snowflake];

export default function FoodHistory() {
  const { t } = useTranslation('pages');
  const { to } = useLocale();
  const sections = (t('foodHistory.sections', { returnObjects: true }) as SectionI18n[]) || [];

  return (
    <>
      <title>{t('foodHistory.title')}</title>
      <meta name="description" content={t('foodHistory.description')} />
      <Hreflang path="/food-history" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          mainEntityOfPage: 'https://laplanddining.com/food-history',
          headline: "A Story Told Through Food — Lapland's Culinary Heritage",
          description:
            "How thousands of years of Arctic survival shaped one of the world's most distinctive food cultures.",
          image: 'https://laplanddining.com/images/drive/heroFoodStory.webp',
          publisher: {
            '@type': 'Organization',
            name: 'LaplandDining',
            logo: { '@type': 'ImageObject', url: 'https://laplanddining.com/favicon.svg' },
          },
          datePublished: '2026-05-03',
          inLanguage: 'en',
        
          author: { "@type": "Organization", name: "LaplandDining", url: "https://laplanddining.com" },
          dateModified: "2026-05-16T00:00:00+02:00",
        })}
      </script>

      {/* Hero */}
      <section className="relative min-h-[60svh] flex items-center justify-center overflow-hidden [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        <img
          src={DINING.heroFoodStory}
          alt="Traditional Lapland kota cooking"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/50 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {t('foodHistory.heroH1')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('foodHistory.heroLead')}
          </p>
        </div>
      </section>

      <PageBreadcrumb />

      {/* Content */}
      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/75 text-lg sm:text-xl leading-relaxed mb-14 border-l-2 border-amber/60 pl-5 italic">
            {t('foodHistory.intro')}
          </p>
          <div className="space-y-16">

            {sections.map((section, i) => {
              const Icon = sectionIcons[i] ?? Snowflake;
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
                          i18nKey={`foodHistory.sections.${i}.paragraphs.${j}`}
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

            <div className="text-center pt-8">
              <Link
                to={to('/restaurants')}
                className="inline-flex items-center gap-2 bg-amber hover:bg-amber-warm text-night px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
              >
                {t('foodHistory.ctaExplore')}
              </Link>
            </div>

          </div>
        </div>
      </section>

      <WhereToNext />
    </>
  );
}
