import Hreflang from '../i18n/Hreflang';
import PageBreadcrumb from '../components/PageBreadcrumb';
import PartnersDirectory from '../../../shared/PartnersDirectory';
import { useLocale } from '../i18n/useLocale';
import { PARTNER_ARTICLES, AD_SLOTS } from '../data/partners';

/**
 * /kumppanit — kumppaniartikkelien pysyvä koontisivu (LV Media -malli v3).
 * Sponsoroidut jutut näkyvät sekä normaalissa virrassa että täällä yhdessä.
 * Piiloportaalilogiikka: sivu on indeksoitavissa (kumppaninäkyvyyttä myydään),
 * mutta hillitty tyhjänä.
 */
export default function Partners() {
  const { locale } = useLocale();
  return (
    <>
      <title>Kumppanimme · Lapland Dining</title>
      <meta
        name="description"
        content="Yritykset joiden kanssa teemme yhteistyötä — sponsoroidut jutut ja mainostajat, kaikki merkitty kumppaneiksi."
      />
      <Hreflang path="/kumppanit" />
      <meta name="robots" content="index, follow" />

      <PageBreadcrumb />

      <div className="bg-night">
        <PartnersDirectory
          items={PARTNER_ARTICLES}
          siteSlug={AD_SLOTS.siteSlug}
          locale={locale}
          surface="dark"
        />
      </div>
    </>
  );
}
