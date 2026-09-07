import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Star, Info } from 'lucide-react';
import Hreflang from '../i18n/Hreflang';
import { useLocale } from '../i18n/useLocale';
import { localePrefix } from '../i18n/config';
import RestaurantCard, { type CardI18n } from '../components/RestaurantCard';
import AffiliateCTA from '../components/AffiliateCTA';
import PageBreadcrumb from '../components/PageBreadcrumb';
import NotFound from './NotFound';
import { cuisineLabel, type Locale } from '../data/restaurants';
import {
  DINING_CITIES, cityBySlug, restaurantsForCity,
} from '../data/diningCities';

const ORIGIN = 'https://laplanddining.com';

/**
 * Yhden kaupungin ravintolasivu.
 *
 * MIKSI (GSC 7.9.2026): sivustolla oli 10 reittiä eikä yhtään kaupunkisivua.
 * Koko näkyvyys kasautui `/restaurants/`-listalle, joka keräsi 2 158 näyttöä
 * keskisijainnilla 51,7 ja kahdella klikillä — Google luki sen 80 ravintolan
 * nimilistana ja tarjosi sitä koko Suomen ravintolanimihakuihin. Aikomus
 * ("ravintolat Rovaniemellä") tarvitsee oman sivun, ei ankkurilinkin listaan.
 *
 * 🔴 Sivu ei keksi mitään. Otsikko, luvut ja kortit tulevat samasta datasta
 * jonka `scripts/check-city-tags.mjs` on todentanut koordinaateista; teksti
 * kertoo vain sen minkä data näyttää. Jos kaupungille ei ole käännöstä,
 * i18next putoaa englantiin — sivu ei koskaan jää tyhjäksi.
 */
export default function CityPage() {
  const { t, i18n } = useTranslation('pages');
  const { locale } = useLocale();
  const { slug } = useParams<{ slug: string }>();

  const city = cityBySlug(slug);
  // Tuntematon slug saa verkoston 404:n, ei tyhjää runkoa. Tämä on myös se
  // portti joka estää /city/mikä-tahansa -roskaa indeksoitumasta.
  if (!city) return <NotFound />;

  const list = restaurantsForCity(city.city);
  const path = `/city/${city.slug}`;
  const prefix = localePrefix(locale);

  const tx = (key: string, fallback: string): string =>
    i18n.exists(`pages:${key}`) ? (t(key) as string) : fallback;

  const cityKey = `cities.${city.slug}`;
  const name = tx(`${cityKey}.name`, city.name);
  /**
   * Paikannimen muoto "kaupungissa X" -lauseissa. Suomessa nimi TAIPUU
   * (Kuusamo -> Kuusamossa, Ylläs -> Ylläksellä), eikä sitä voi tuottaa
   * paikkamerkillä: `{{city}}` antoi "6 ravintolaa paikkakunnalla Kuusamo".
   * Muissa kielissä prepositio hoitaa taivutuksen ja `at` = nimi.
   */
  const at = tx(`${cityKey}.at`, name);
  const tagline = tx(`${cityKey}.tagline`, '');
  const intro = tx(`${cityKey}.intro`, '');
  const knowRaw = t(`${cityKey}.know`, { returnObjects: true });
  const know: string[] = Array.isArray(knowRaw) ? (knowRaw as string[]) : [];

  const ratings = list.map((r) => r.rating).filter((n): n is number => typeof n === 'number');
  const best = ratings.length ? Math.max(...ratings) : null;

  const cardI18n: CardI18n = {
    websiteLabel: t('restaurants.websiteLabel'),
    menuLabel: t('restaurants.menuLabel'),
    menuLabelPdf: t('restaurants.menuLabelPdf'),
    mapsLabel: t('restaurants.mapsLabel'),
    googleReview: t('restaurants.googleReview'),
    editorsPickLabel: t('restaurants.editorsPick'),
  };

  const countLabel = t('cities.shared.countLabel', {
    count: list.length,
    at,
    defaultValue: `${list.length} restaurants in ${at}`,
  });

  const others = DINING_CITIES.filter((c) => c.slug !== city.slug);

  return (
    <>
      <title>{tx(`${cityKey}.title`, `Restaurants in ${name} | LaplandDining`)}</title>
      <meta
        name="description"
        content={tx(
          `${cityKey}.description`,
          `Where to eat in ${name}: ${list.length} restaurants with Google ratings, review quotes and links to their own menus.`,
        )}
      />
      <Hreflang path={path} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="og:title" content={tx(`${cityKey}.title`, `Restaurants in ${name} | LaplandDining`)} />
      <meta property="og:url" content={`${ORIGIN}${prefix}${path}/`} />
      <meta property="og:image" content={`${ORIGIN}${city.img}`} />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Restaurants', item: `${ORIGIN}/restaurants` },
            { '@type': 'ListItem', position: 3, name: city.name, item: `${ORIGIN}${path}` },
          ],
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Restaurants in ${city.name}`,
          numberOfItems: list.length,
          itemListElement: list.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Restaurant',
              name: r.name,
              servesCuisine: cuisineLabel(r) ?? 'Lappish',
              ...(r.priceRange ? { priceRange: r.priceRange } : {}),
              ...(r.website ? { url: r.website } : {}),
              ...(r.menuUrl ? { hasMenu: r.menuUrl } : {}),
              ...(r.rating
                ? {
                    aggregateRating: {
                      '@type': 'AggregateRating',
                      ratingValue: r.rating,
                      reviewCount: r.reviewCount,
                    },
                  }
                : {}),
              address: {
                '@type': 'PostalAddress',
                streetAddress: r.address,
                addressLocality: r.city,
                addressCountry: r.country === 'Finland' ? 'FI' : 'SE',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: r.location.latitude,
                longitude: r.location.longitude,
              },
              ...(r.googleMapsUrl ? { hasMap: r.googleMapsUrl } : {}),
            },
          })),
        })}
      </script>

      {/* Hero — sama svh-mitta ja md+-pakoluukku kuin muilla sivuilla, jotta
          otsikko ei jää kiinteän navin alle matalilla ruuduilla. */}
      <section className="relative min-h-[46svh] flex items-center justify-center overflow-hidden [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        <img
          src={city.photo ?? city.img}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/75 via-night/65 to-night" />
        {/* Kuvateksti vain omalle valokuvalle. Se nimeaa TARKAN paikan eika
            kaupunkisivun otsikkoa: Kuusamon sivu kattaa myos Rukan 22 km:n
            paassa (Vesa 7.9.: "riistaravintola on rukalla, ei kuusamossa"). */}
        {city.photo && city.photoCredit && (
          <p className="absolute bottom-3 right-4 z-10 text-[11px] text-white/65 tracking-wide">
            Kuva: LaplandVibes · {city.photoCredit}
          </p>
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-5 py-20 text-center">
          <p className="inline-flex items-center gap-2 text-amber text-[11px] font-bold uppercase tracking-[0.25em] mb-4">
            <MapPin size={13} /> {t('cities.shared.kicker', { defaultValue: 'Where to eat' })}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wide text-white leading-[1.05]">
            {tx(`${cityKey}.h1`, `Restaurants in ${name}`)}
          </h1>
          {tagline && (
            <p className="mt-4 text-lg sm:text-xl text-cream/85 leading-relaxed max-w-2xl mx-auto">
              {tagline}
            </p>
          )}
          <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-cream/70 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-semibold">
              {countLabel}
            </span>
            {best !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-semibold">
                <Star size={12} className="text-amber fill-amber" />
                {t('cities.shared.bestRated', {
                  rating: best.toFixed(1),
                  defaultValue: `Top rated ${best.toFixed(1)}`,
                })}
              </span>
            )}
          </p>
        </div>
      </section>

      <PageBreadcrumb />

      {/* Intro + "mitä on hyvä tietää" */}
      {(intro || know.length > 0) && (
        <section className="bg-night py-14 sm:py-16">
          <div className="max-w-3xl mx-auto px-5">
            {intro && (
              <p className="text-cream/85 text-[17px] leading-relaxed">{intro}</p>
            )}
            {know.length > 0 && (
              <ul className="mt-8 space-y-3">
                {know.map((item) => (
                  <li key={item} className="flex gap-3 text-cream/75 text-[15px] leading-relaxed">
                    <Info size={16} className="text-amber/70 shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Ravintolat */}
      <section className="bg-night pb-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="font-heading text-3xl sm:text-4xl tracking-wide text-white mb-8">
            {countLabel}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => (
              <RestaurantCard
                key={r.slug}
                r={r}
                i18n={cardI18n}
                locale={locale as Locale}
                editorsPick={r.topPick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Majoitus samassa kaupungissa — syvin parametri jonka pinta tietää. */}
      <section className="bg-night pb-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl tracking-wide text-white mb-3">
            {t('cities.shared.stayHeadline', {
              at,
              defaultValue: `Staying in ${at}?`,
            })}
          </h2>
          <p className="text-cream/70 text-[15px] leading-relaxed mb-6">
            {t('cities.shared.stayLead', {
              defaultValue: 'Book a room within walking distance of the tables above.',
            })}
          </p>
          <AffiliateCTA
            partner="hotels"
            sid={`city_${city.slug}_stay`}
            destination={city.city}
            className="inline-flex items-center justify-center rounded-full bg-amber px-7 py-3.5 text-warm-ink font-bold tracking-wide hover:bg-amber/90 transition-colors no-underline"
          >
            {t('cities.shared.stayCta', {
              at,
              defaultValue: `Find stays in ${at}`,
            })}
          </AffiliateCTA>
        </div>
      </section>

      {/* Muut kaupungit — sisäinen linkitys, joka tekee kaupunkisivuista
          verkoston eikä 14 saarta. */}
      <section className="bg-night pb-20">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="font-heading text-2xl sm:text-3xl tracking-wide text-white mb-6">
            {t('cities.shared.otherCities', { defaultValue: 'Eat somewhere else in Lapland' })}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {others.map((c) => (
              <Link
                key={c.slug}
                to={`${prefix}/city/${c.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-cream/80 text-sm font-semibold hover:border-amber/50 hover:text-amber transition-colors no-underline"
              >
                <MapPin size={12} className="opacity-60" />
                {tx(`cities.${c.slug}.name`, c.name)}
              </Link>
            ))}
            <Link
              to={`${prefix}/restaurants`}
              className="inline-flex items-center rounded-full bg-amber/15 border border-amber/40 px-4 py-2 text-amber text-sm font-bold hover:bg-amber/25 transition-colors no-underline"
            >
              {t('cities.shared.allRestaurants', { defaultValue: 'All restaurants →' })}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
