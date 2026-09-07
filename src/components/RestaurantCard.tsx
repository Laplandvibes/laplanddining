import { UtensilsCrossed, Star, Award, Quote } from 'lucide-react';
import PhotoCaption from './PhotoCaption';
import MenuLink from './MenuLink';
import { withReferral } from '../lib/outbound';
import {
  composeCardBody, cuisineLabel, googleReviewsUrl,
  type Restaurant, type Locale,
} from '../data/restaurants';

/**
 * Ravintolakortti. Yksi lahde kahdelle pinnalle: /restaurants/ ja
 * /city/{slug}/.
 *
 * Irrotettu Restaurants.tsx:sta 7.9.2026 kaupunkisivuja rakennettaessa.
 * Kortti oli 116 rivia keskella 612-rivista sivua; kopiointi olisi
 * tarkoittanut kahta erkanevaa korttia, ja LV:n saanto on jaettu komponentti,
 * ei duplikaatti. Sisalto on siirretty SELLAISENAAN -- jos muutat tata,
 * muutat molempia sivuja.
 */

export interface CardI18n {
  websiteLabel: string;
  menuLabel: string;
  menuLabelPdf: string;
  mapsLabel: string;
  googleReview: string;
  editorsPickLabel: string;
}

export default function RestaurantCard({ r, i18n, locale, editorsPick }: { r: Restaurant; i18n: CardI18n; locale: Locale; editorsPick?: boolean }) {
  const body = composeCardBody(r, locale);
  const cuisine = cuisineLabel(r, locale);

  return (
    /* Ilme yhtenaistetty Fine Diningin mallisivun mukaan 7.9.2026 (Vesa
       hyvaksyi): kolmikerroksinen varjo + ohut reunus, isompi pyoristys.
       Jamakkyys syntyy TERAVASTA lahivarjosta — yksi pehmea varjo lukee
       sumeana. Tama komponentti kattaa /restaurants ja /city/{slug}. */
    <article className={`group relative rounded-3xl overflow-hidden bg-cream ring-1 ring-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.45),0_14px_28px_-10px_rgba(0,0,0,0.6),0_40px_72px_-32px_rgba(0,0,0,0.7)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_20px_38px_-12px_rgba(0,0,0,0.68),0_56px_96px_-36px_rgba(0,0,0,0.78)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-full${editorsPick ? ' !ring-amber/45' : ''}`}>
      <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
        {r.photo ? (
          <img
            src={r.photo}
            alt={r.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a1c14] via-warm-ink to-[#3d2a1d] flex flex-col items-center justify-center gap-2">
            <UtensilsCrossed className="w-9 h-9 text-amber/55" strokeWidth={1.5} />
            {cuisine && (
              <span className="text-amber/60 text-[10px] font-bold uppercase tracking-[0.2em] px-5 text-center leading-snug">{cuisine}</span>
            )}
          </div>
        )}
        <PhotoCaption r={r} locale={locale} />
        {/* Arviopilleri on LINKKI Googlen arvosteluihin, ei koriste. Pilleri
            on 28 px korkea, ja se ei saa kasvaa: kortin ilme lukittiin Fine
            Diningin mallisivulla 7.9.2026. Kosketusalue tehdaan siksi
            LAAJENTAMALLA ankkuria lapinakyvalla paddingilla -- pilleri siirtyy
            sisempaan span-elementtiin ja <a> saa p-2.5:n ymparilleen => 48 px.
            Sijainti sailyy pikselilleen: top-0.5 (2 px) + p-2.5 (10 px) = 12 px
            eli entinen top-3.

            🔴 rounded-full ULOMMALLA ankkurilla ei ole turha vaikka ankkuri on
            lapinakyva: se muotoilee fokusrenkaan JA pitaa elementin nakyvana
            portille scripts/mobile_wrap_audit.mjs, joka tunnistaa kontrollit
            mm. luokkajonosta (rounded|btn|button|pill|chip). Ilman sita portti
            ohittaisi ankkurin kokonaan eika mittaisi sita -- varoitus katoaisi
            vaarasta syysta, eli portti sammuisi itse itsensa ohi. */}
        {r.rating && (
          <a
            href={googleReviewsUrl(r.googlePlaceId)}
            target="_blank"
            rel="nofollow noopener"
            aria-label={`${r.reviewCount?.toLocaleString('en') ?? ''} Google reviews: ${r.name}`}
            className="group/rating absolute top-0.5 right-0.5 inline-flex p-2.5 rounded-full no-underline"
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cream text-warm-ink text-xs font-bold shadow-md transition-colors group-hover/rating:bg-amber">
              <Star size={10} className="text-amber fill-amber" />
              <span>{r.rating.toFixed(1)}</span>
              {r.reviewCount && (
                <span className="text-warm-muted font-semibold ml-0.5">· {r.reviewCount.toLocaleString('en')}</span>
              )}
            </span>
          </a>
        )}
        {(editorsPick || r.priceRange) && (
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {editorsPick && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warm-ink text-cream text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-md">
                <Award size={10} className="text-amber" /> {i18n.editorsPickLabel}
              </span>
            )}
            {r.priceRange && (
              <span className="inline-flex items-center px-2.5 py-1.5 rounded-full bg-amber text-warm-ink text-[11px] font-bold tracking-wide shadow-md">
                {r.priceRange}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        <h3 className="font-heading text-xl tracking-wide text-warm-ink leading-tight mb-1">
          {r.name}
        </h3>
        {cuisine && (
          <p className="text-[11px] text-amber-deep font-semibold uppercase tracking-[0.18em] mb-2.5">
            {cuisine}
          </p>
        )}

        {body && (
          body.isQuote ? (
            <div className="mb-3 flex-1">
              <blockquote className="relative pl-5 text-[14px] text-warm-text leading-relaxed italic line-clamp-4">
                <Quote size={11} className="absolute left-0 top-1.5 text-amber-deep -scale-x-100" />
                {body.text}
              </blockquote>
              <a
                href={googleReviewsUrl(r.googlePlaceId)}
                target="_blank"
                rel="nofollow noopener"
                className="inline-block mt-1.5 ml-5 text-[10px] text-warm-muted hover:text-spice tracking-[0.15em] uppercase font-bold no-underline"
              >
                {i18n.googleReview}
              </a>
            </div>
          ) : (
            <p className="text-[14px] text-warm-text leading-relaxed mb-3 line-clamp-5 flex-1">{body.text}</p>
          )
        )}

        <div className="flex flex-wrap items-center gap-4 mt-auto pt-3 border-t border-warm-ink/10">
          <MenuLink
            restaurant={r}
            label={i18n.menuLabel}
            labelPdf={i18n.menuLabelPdf}
            campaign="dining_menu_restaurants"
          />
          {r.website && (
            <a
              href={withReferral(r.website, 'dining_restaurants')}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center gap-1 text-amber-deep hover:text-spice text-xs font-bold uppercase tracking-wider transition-colors no-underline"
            >
              {i18n.websiteLabel} →
            </a>
          )}
          <a
            href={r.googleMapsUrl}
            target="_blank"
            rel="nofollow noopener"
            className="inline-flex items-center gap-1 text-warm-muted hover:text-warm-ink text-xs font-bold uppercase tracking-wider transition-colors no-underline"
          >
            {i18n.mapsLabel} →
          </a>
        </div>
      </div>
    </article>
  );
}
