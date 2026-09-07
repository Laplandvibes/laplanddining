import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import { localePrefix } from '../i18n/config';
import PageBreadcrumb from '../components/PageBreadcrumb';
import { DINING, seasonal } from '../data/images';
import { DINING_CITIES, restaurantsForCity } from '../data/diningCities';

const ORIGIN = 'https://laplanddining.com';

/**
 * Kaupunkisivujen hakemisto: /cities.
 *
 * Tämä on kaupunkisivujen napa. Ilman sitä 14 sivua roikkuisi pelkkien
 * ristiinlinkkien varassa ja niiden löytyminen jäisi sitemapin varaan.
 * Kortin luku (`N restaurants`) lasketaan datasta, ei kirjoiteta käsin —
 * luku on lupaus siitä mitä sivulta löytyy.
 */
export default function Cities() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  const prefix = localePrefix(locale);

  const rows = DINING_CITIES.map((c) => {
    const list = restaurantsForCity(c.city);
    const ratings = list.map((r) => r.rating).filter((n): n is number => typeof n === 'number');
    return { city: c, count: list.length, best: ratings.length ? Math.max(...ratings) : null };
  });

  const total = rows.reduce((n, r) => n + r.count, 0);

  return (
    <>
      <title>{t('cities.title', { defaultValue: 'Where to Eat in Lapland, City by City | LaplandDining' })}</title>
      <meta
        name="description"
        content={t('cities.description', {
          defaultValue:
            'Restaurants in Rovaniemi, Levi, Ylläs, Saariselkä, Inari, Kemi and nine more towns across Finnish Lapland — grouped by destination, with Google ratings and menu links.',
        })}
      />
      <Hreflang path="/cities" />
      <meta name="robots" content="index, follow, max-image-preview:large" />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Cities', item: `${ORIGIN}/cities` },
          ],
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Lapland dining destinations',
          numberOfItems: DINING_CITIES.length,
          itemListElement: DINING_CITIES.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            url: `${ORIGIN}/city/${c.slug}`,
          })),
        })}
      </script>

      <section className="relative min-h-[46svh] flex items-center justify-center overflow-hidden [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        <img
          src={seasonal(DINING.restaurantsHeroWinter, DINING.heroSummer)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/75 via-night/65 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto px-5 py-20 text-center">
          <p className="inline-flex items-center gap-2 text-amber text-[11px] font-bold uppercase tracking-[0.25em] mb-4">
            <MapPin size={13} /> {t('cities.shared.kicker', { defaultValue: 'Where to eat' })}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wide text-white leading-[1.05]">
            {t('cities.h1', { defaultValue: 'Lapland, town by town' })}
          </h1>
          <p className="mt-4 text-lg text-cream/85 leading-relaxed max-w-2xl mx-auto">
            {t('cities.lead', {
              count: total,
              cities: DINING_CITIES.length,
              defaultValue: `${total} restaurants across ${DINING_CITIES.length} destinations, each on its own page.`,
            })}
          </p>
        </div>
      </section>

      <PageBreadcrumb />

      <section className="bg-night py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ city, count, best }) => (
              <Link
                key={city.slug}
                to={`${prefix}/city/${city.slug}`}
                className="group relative rounded-2xl overflow-hidden h-56 no-underline shadow-[0_15px_35px_-12px_rgba(0,0,0,0.55)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <img
                  src={city.photo ?? city.img}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h2 className="font-heading text-2xl tracking-wide text-white leading-tight">
                    {t(`cities.${city.slug}.name`, { defaultValue: city.name })}
                  </h2>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-cream/75 text-[13px] font-semibold">
                    <span>
                      {t('cities.shared.countLabel', {
                        count,
                        // taivutettu muoto, ks. CityPage.tsx `at`
                        at: t(`cities.${city.slug}.at`, { defaultValue: city.name }),
                        defaultValue: `${count} restaurants in ${city.name}`,
                      })}
                    </span>
                    {best !== null && (
                      <span className="inline-flex items-center gap-1">
                        <Star size={11} className="text-amber fill-amber" />
                        {best.toFixed(1)}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-center text-cream/60 text-sm leading-relaxed max-w-2xl mx-auto">
            {t('cities.moreLead', {
              defaultValue:
                'Smaller places — Muonio, Hetta, Salla and Posio — have too few tables for a page of their own. They are on the full list.',
            })}{' '}
            <Link to={`${prefix}/restaurants`} className="text-amber font-bold no-underline hover:underline">
              {t('cities.shared.allRestaurants', { defaultValue: 'All restaurants →' })}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
