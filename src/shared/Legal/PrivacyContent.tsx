import { Link } from 'react-router-dom';
import { localePath, hubUnsubscribeUrl } from './localePath';

/**
 * Shared LaplandVibes ecosystem Privacy Policy body.
 *
 * Renders ONLY the legal content (h1, sections, in-page nav links). Each site
 * wraps this with its own Nav, Footer, SEO/title meta tags.
 *
 * `siteName` defaults to LaplandVibes umbrella; spoke sites pass their own
 * (e.g. `siteName="LaplandStays"`) so the prose accurately names the publisher.
 *
 * `lang` chooses the rendered language. The same prose is embedded for
 * en / fi / de so the shared module remains self-contained, sites only need
 * to pass `lang={useLang()}` (or `useLocale().locale`) and the page renders in
 * the visitor's current locale instead of always-English.
 *
 * Updated 2026-05 to add FI + DE bodies. Prior history: 2026-04-25 GDPR Art. 6
 * / 13 / 22 / 77 expansion + EU-US DPF / SCC + Tietosuojavaltuutettu route.
 */

type Lang = 'en' | 'fi' | 'de' | 'ja' | 'es' | 'pt-BR' | 'zh-CN' | 'ko' | 'fr' | 'it' | 'nl' | 'sv';

interface PrivacyContentProps {
  siteName?: string;
  lang?: Lang;
  /** Site-specific "last updated" line (the site's own addenda move faster than the network body). */
  lastUpdated?: string;
  /**
   * Describe Microsoft Clarity (session recordings + heatmaps) in sections 2, 3, 4a, 6, 7 and 8a.
   * Only for sites that really load Clarity after cookie consent (the hub). Default false, so the
   * other sites' policies do not claim a recording tool they do not run. Same prop as CookieContent.
   */
  sessionRecording?: boolean;
  /**
   * `shop` = laplandstore.fi ja laplandgifts.com: lahjaoppaita, joiden kumppanit ovat suomalaisia kauppoja Adtractionin ja
   * Daisyconin kautta, ei matkavarauksia. Valitsee kohtien 3, 7, 8 ja 8a kumppanirivit (SHOP_PRIVACY / TRAVEL_PRIVACY
   * haravointimerkin alla tiedoston lopussa). Sama prop kuin TermsContentissa. Oletus (travel) on matkailusivustojen ennallaan oleva teksti.
   */
  variant?: 'travel' | 'shop';
  /**
   * Travelpayouts-lentohaku kohtiin 3 ja 7 (vain laplandflights.fi, jonka haku latautuu vasta suostumuksesta).
   * Sama prop kuin CookieContentissa. Oletus false. Teksti haravointimerkin alla (FLIGHT_SEARCH_PRIVACY).
   */
  flightSearch?: boolean;
}

const COPY: Record<Lang, {
  h1: string;
  lastUpdated: string;
  s1Title: string;
  s1Body: (siteName: string) => React.ReactNode;
  s2Title: string;
  s2Body: string;
  s2aTitle: string;
  s2aIntro: string;
  s2aItems: { strong: string; body: string }[];
  s3Title: string;
  s3Intro: string;
  s3Items: { strong: string; body: string }[];
  s3Tail: (cookieLink: React.ReactNode) => React.ReactNode;
  s4Title: string;
  s4Body: string;
  /** Umami Cloud: evästeetön kävijätilasto, joka sivustolla (lisätty 6.10.2026; klikkaukset ja työkalut samana päivänä, Vesan hyväksymä). */
  s4Umami: string;
  s5Title: string;
  s5Body: (unsubscribeLink: React.ReactNode) => React.ReactNode;
  s6Title: string;
  s6Body: string;
  s7Title: string;
  s7Intro: string;
  s7Items: string[];
  s8Title: string;
  s8Body1: (siteName: string) => string;
  s8aTitle: string;
  s8aIntro: string;
  s8aItems: { strong: string; body: string }[];
  s8aTail: string;
  s9Title: string;
  s9Intro: string;
  s9Items: { strong: string; body: string }[];
  s9Tail: (email: React.ReactNode) => React.ReactNode;
  s10Title: string;
  s10Body: string;
  s11Title: string;
  s11Body: string;
  s12Title: string;
  s12Body: string;
  backToHome: string;
  cookiePolicy: string;
}> = {
  en: {
    h1: 'Privacy Policy',
    lastUpdated: 'Last updated: October 2026',
    s1Title: '1. Controller',
    s1Body: () => <>LaPeso Oy (business ID 3309136-7), Finland. Email: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Data We Collect',
    s2Body: 'We collect pseudonymous analytics data via Google Analytics 4 and cookieless visitor statistics via Umami. If you subscribe to our newsletter, we store your email address securely. We do not collect any other personally identifiable information unless you contact us directly.',
    s2aTitle: '2a. Legal Basis for Processing (GDPR Art. 6)',
    s2aIntro: 'We rely on the following legal bases for each processing activity:',
    s2aItems: [
      { strong: 'Consent (Art. 6(1)(a))', body: 'for analytics cookies (Google Analytics 4), GetYourGuide\'s partner script and any other non-essential cookies. You give consent via the cookie banner and can withdraw it at any time.' },
      { strong: 'Consent (Art. 6(1)(a))', body: 'for newsletter subscription. You give consent by submitting the signup form; you can withdraw at any time via the unsubscribe link.' },
      { strong: 'Legitimate interest (Art. 6(1)(f))', body: 'for storing your consent choice in your browser\'s localStorage and for fraud-prevention / security logs. Our interest is operating a functioning website; this is balanced against your reasonable expectations.' },
      { strong: 'Legitimate interest (Art. 6(1)(f))', body: 'for affiliate-link click attribution. Our interest is being paid the commission we have earned editorially; the data collected is minimal (referral source) and you can decline by not clicking affiliate links.' },
      { strong: 'Legitimate interest (Art. 6(1)(f))', body: 'for cookieless visitor statistics with Umami (section 4). Our interest is knowing which pages and forms work; Umami stores nothing on your device and does not keep your IP address.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Our website uses cookies to improve your browsing experience and to collect pseudonymous analytics data. These include:',
    s3Items: [
      { strong: 'Essential storage', body: "required for the website to function properly (your consent choice, kept in your browser's localStorage, not in a cookie). The site itself places no cookies before you accept them." },
      { strong: 'Analytics cookies', body: 'used by Google Analytics 4 to understand how visitors interact with our site. Collected pseudonymously.' },
      { strong: 'GetYourGuide cookies', body: "placed by GetYourGuide's partner script, which loads only after you accept cookies. They count activity widget views and clicks and attribute bookings to the site." },
    ],
    s3Tail: (cookieLink) => <>Analytics and GetYourGuide cookies are only placed after you give consent via the cookie banner. Umami visitor statistics (section 4) use no cookies. See our {cookieLink} for full details.</>,
    s4Title: '4. Google Analytics and Umami',
    s4Body: 'We use Google Analytics 4 with Consent Mode v2. If you decline cookies, no analytics data is collected. If you accept, usage data (pages viewed, time on site, device type, and location at country and city level) is sent to Google. The data is pseudonymous: we do not send your name, email address or other directly identifying information, but the random cookie ID and your IP address are personal data under the GDPR.',
    s4Umami: 'We also use Umami Cloud to count page views, clicks on some of our links and buttons (for example to our sister sites or our app) and the steps of our forms and tools, for example when a newsletter form is shown, started or submitted. Umami uses no cookies and stores nothing on your device, so it runs whether or not you accept cookies. It records the page address and title, the site you came from, your browser, operating system, device type, screen size, language and approximate location (country, region and city). Your IP address is used only to work out that location and a pseudonymous visit identifier, and it is never stored. The identifier is a hash that changes at the start of every month. These events record only what was clicked or chosen and which step it was (for example the sister site you opened) and, if a form stops you, the name of the field (for example "email"), never what you typed.',
    s5Title: '5. Newsletter',
    s5Body: (unsub) => <>If you subscribe to our newsletter, your email address is stored securely via Resend and Supabase. You can unsubscribe at any time using the link in every email or via our {unsub}.</>,
    s6Title: '6. Data Retention',
    s6Body: 'Analytics data is retained for 14 months in Google Analytics and for up to 2 years in Umami. Newsletter emails are retained until you unsubscribe.',
    s7Title: '7. Third Parties',
    s7Intro: 'We do not sell your personal data. The following third-party services process data as part of our operations:',
    s7Items: [
      'Google Analytics: pseudonymous usage analytics',
      'Umami: cookieless visitor statistics and form step counts',
      'GetYourGuide: activity widgets and booking attribution, only after you accept cookies',
      'Resend: newsletter email delivery',
      'Supabase: backend database services',
      'Cloudflare: hosting and CDN',
    ],
    s8Title: '8. Advertising',
    s8Body1: (siteName) => `This site shows advertisements and paid partner placements from third parties. They are clearly marked, for example with an "Ad" or "Partner" label. Clicking them may take you to external websites with their own privacy policies. ${siteName} is not responsible for the data practices of external advertisers.`,
    s8aTitle: '8a. International Data Transfers',
    s8aIntro: 'Several of the third-party services we use are based in or transfer data to countries outside the European Economic Area (EEA), most commonly the United States:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, USA): covered by the EU–US Data Privacy Framework (DPF).' },
      { strong: 'Umami', body: '(Umami Software, Inc., USA; servers in the US and the EU): covered by Standard Contractual Clauses.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., USA): covered by the EU–US Data Privacy Framework and Standard Contractual Clauses (SCCs).' },
      { strong: 'Resend', body: '(Resend Inc., USA): covered by Standard Contractual Clauses.' },
      { strong: 'Supabase', body: '(Supabase Inc., USA, with EU region hosting available): covered by Standard Contractual Clauses.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Germany): within the EEA.' },
    ],
    s8aTail: 'In each case the transfer is protected by an adequacy decision, the EU–US Data Privacy Framework, or Standard Contractual Clauses approved by the European Commission. You can request a copy of the relevant safeguards by contacting us.',
    s9Title: '9. Your Rights Under GDPR',
    s9Intro: 'As we operate from Finland and serve visitors from the European Union, the GDPR applies in full. You have the following rights:',
    s9Items: [
      { strong: 'Right of access (Art. 15)', body: 'request a copy of the personal data we hold about you.' },
      { strong: 'Right to rectification (Art. 16)', body: 'ask us to correct inaccurate or incomplete data.' },
      { strong: 'Right to erasure / "right to be forgotten" (Art. 17)', body: 'ask us to delete your data when there is no overriding reason to keep it.' },
      { strong: 'Right to restriction of processing (Art. 18)', body: 'ask us to pause processing while a question is being resolved.' },
      { strong: 'Right to data portability (Art. 20)', body: 'receive your data in a structured, machine-readable format.' },
      { strong: 'Right to object (Art. 21)', body: 'object to processing based on legitimate interest, including for direct marketing.' },
      { strong: 'Right to withdraw consent', body: 'at any time, with effect from the moment of withdrawal.' },
      { strong: 'Right to lodge a complaint (Art. 77)', body: 'with the Finnish Data Protection Ombudsman (Tietosuojavaltuutettu) at tietosuoja.fi, or with the supervisory authority of your habitual residence within the EU.' },
    ],
    s9Tail: (email) => <>To exercise any of these rights, contact us at {email}. We will respond within one month.</>,
    s10Title: '10. Automated Decision-Making',
    s10Body: 'We do not perform automated decision-making, profiling, or any process that produces legal or similarly significant effects about you within the meaning of GDPR Article 22.',
    s11Title: '11. Children',
    s11Body: 'This site and our newsletter are intended for adults. We do not knowingly collect data from children under 13 (the digital-services age threshold under Finnish law and the GDPR). If you believe a child has provided us with personal data, contact us and we will delete it.',
    s12Title: '12. Changes to This Policy',
    s12Body: 'We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects the most recent revision. Material changes will be flagged on the homepage for at least 14 days.',
    backToHome: '← Back to home',
    cookiePolicy: 'Cookie Policy →',
  },
  fi: {
    h1: 'Tietosuojaseloste',
    lastUpdated: 'Viimeksi päivitetty: lokakuu 2026',
    s1Title: '1. Rekisterinpitäjä',
    s1Body: () => <>LaPeso Oy (Y-tunnus 3309136-7), Suomi. Sähköposti: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Mitä tietoja keräämme',
    s2Body: 'Keräämme pseudonyymejä kävijäanalytiikkatietoja Google Analytics 4:n kautta ja evästeettömiä kävijätilastoja Umamin kautta. Jos tilaat uutiskirjeemme, tallennamme sähköpostiosoitteesi turvallisesti. Emme kerää muuta tunnistettavaa henkilötietoa, ellet ota meihin yhteyttä suoraan.',
    s2aTitle: '2a. Käsittelyn oikeusperuste (GDPR 6 artikla)',
    s2aIntro: 'Käsittelemme henkilötietoja seuraavilla oikeusperusteilla:',
    s2aItems: [
      { strong: 'Suostumus (6 art. 1 kohta a)', body: 'analytiikkaevästeitä (Google Analytics 4), GetYourGuiden kumppaniskriptiä ja muita ei-välttämättömiä evästeitä varten. Annat suostumuksen evästebannerista ja voit perua sen milloin tahansa.' },
      { strong: 'Suostumus (6 art. 1 kohta a)', body: 'uutiskirjeen tilaamista varten. Annat suostumuksen lähettämällä tilauslomakkeen ja voit perua sen milloin tahansa peruutuslinkin kautta.' },
      { strong: 'Oikeutettu etu (6 art. 1 kohta f)', body: 'suostumusvalintasi tallentamisen selaimesi localStorage-tallenteeseen sekä petostentorjunnan / lokien osalta. Oikeutettu etumme on toimivan verkkosivuston ylläpito, ja se on tasapainotettu suhteessa kohtuullisiin odotuksiisi.' },
      { strong: 'Oikeutettu etu (6 art. 1 kohta f)', body: 'kumppanilinkkien klikkausten kohdentamiseen. Oikeutettu etumme on saada toimituksellisesti ansaitsemamme komissio; kerättävät tiedot ovat vähäisiä (viittaava sivusto) ja voit halutessasi olla klikkaamatta kumppanilinkkejä.' },
      { strong: 'Oikeutettu etu (6 art. 1 kohta f)', body: 'evästeettömiä kävijätilastoja varten (Umami, kohta 4). Oikeutettu etumme on tietää, mitkä sivut ja lomakkeet toimivat; Umami ei tallenna laitteellesi mitään eikä säilytä IP-osoitettasi.' },
    ],
    s3Title: '3. Evästeet',
    s3Intro: 'Sivustomme käyttää evästeitä parantaakseen selailukokemustasi ja kerätäkseen pseudonyymejä analytiikkatietoja. Käytämme seuraavia evästeitä:',
    s3Items: [
      { strong: 'Välttämätön tallennus', body: 'tarvitaan sivuston toiminnan kannalta (suostumusvalintasi, joka tallennetaan selaimesi localStorage-tallenteeseen eikä evästeeseen). Sivusto ei itse aseta evästeitä ennen kuin hyväksyt ne.' },
      { strong: 'Analytiikkaevästeet', body: 'Google Analytics 4 käyttää näitä ymmärtääkseen, miten kävijät käyttävät sivustoa. Kerätään pseudonyymisti.' },
      { strong: 'GetYourGuide-evästeet', body: 'GetYourGuiden kumppaniskripti asettaa ne vasta, kun olet hyväksynyt evästeet. Niiden avulla lasketaan aktiviteettiwidgettien näytöt ja klikkaukset ja kohdistetaan varaukset sivustolle.' },
    ],
    s3Tail: (cookieLink) => <>Analytiikka- ja GetYourGuide-evästeet asetetaan vasta sen jälkeen, kun olet antanut suostumuksesi evästebannerista. Umamin kävijätilastot (kohta 4) eivät käytä evästeitä. Katso täydelliset tiedot {cookieLink}.</>,
    s4Title: '4. Google Analytics ja Umami',
    s4Body: 'Käytämme Google Analytics 4:ää Consent Mode v2 ‑tilassa. Jos hylkäät evästeet, analytiikkatietoa ei kerätä. Jos hyväksyt, käyttötietoja (katsotut sivut, kävijän viipymä, laitetyyppi sekä sijainti maan ja kaupungin tarkkuudella) lähetetään Googlelle. Tiedot ovat pseudonyymejä: emme lähetä nimeä, sähköpostiosoitetta tai muuta suoraan tunnistavaa tietoa, mutta evästeen satunnainen tunniste ja IP-osoite ovat tietosuoja-asetuksen tarkoittamaa henkilötietoa.',
    s4Umami: 'Käytämme lisäksi Umami Cloud -palvelua sivujen katselukertojen, joidenkin linkkiemme ja painikkeidemme klikkausten (esimerkiksi sisarsivustoillemme tai sovellukseemme) sekä lomakkeidemme ja työkalujemme vaiheiden laskemiseen, esimerkiksi kun uutiskirjelomake näytetään, sen täyttäminen aloitetaan tai se lähetetään. Umami ei käytä evästeitä eikä tallenna laitteellesi mitään, joten se toimii riippumatta siitä, hyväksytkö evästeet. Se tallentaa sivun osoitteen ja otsikon, sivuston, jolta tulit, selaimen, käyttöjärjestelmän, laitetyypin, näytön koon, kielen ja likimääräisen sijainnin (maa, alue ja kaupunki). IP-osoitettasi käytetään vain tämän sijainnin ja pseudonyymin käyntitunnisteen laskemiseen, eikä sitä tallenneta koskaan. Tunniste on tiiviste, joka vaihtuu jokaisen kuukauden alussa. Näihin tapahtumiin tallentuu vain se, mitä klikattiin tai valittiin ja mikä vaihe oli kyseessä (esimerkiksi sisarsivusto, jolle siirryit), ja jos lomake pysäyttää sinut, kentän nimi (esimerkiksi "email"), ei koskaan kirjoittamaasi tekstiä.',
    s5Title: '5. Uutiskirje',
    s5Body: (unsub) => <>Kun tilaat uutiskirjeemme, sähköpostiosoitteesi tallennetaan turvallisesti Resendin ja Supabasen kautta. Voit perua tilauksesi milloin tahansa jokaisesta viestistä löytyvällä linkillä tai {unsub}.</>,
    s6Title: '6. Tietojen säilytys',
    s6Body: 'Analytiikkatietoja säilytetään Google Analyticsissä 14 kuukautta ja Umamissa enintään 2 vuotta. Uutiskirjeen sähköpostiosoitteet säilytetään, kunnes perut tilauksen.',
    s7Title: '7. Kolmannet osapuolet',
    s7Intro: 'Emme myy henkilötietojasi. Seuraavat palveluntarjoajat käsittelevät tietoja toimintamme yhteydessä:',
    s7Items: [
      'Google Analytics: pseudonyymi käyttöanalytiikka',
      'Umami: evästeettömät kävijätilastot ja lomakkeiden vaiheiden laskenta',
      'GetYourGuide: aktiviteettiwidgetit ja varausten kohdistus, vasta kun hyväksyt evästeet',
      'Resend: uutiskirjeiden lähetys',
      'Supabase: taustatietokantapalvelut',
      'Cloudflare: sivuston ylläpito ja CDN',
    ],
    s8Title: '8. Mainonta',
    s8Body1: (siteName) => `Sivustolla näytetään kolmansien osapuolten mainoksia ja maksettuja kumppanipaikkoja. Ne on merkitty selkeästi, esimerkiksi tunnisteella "Mainos" tai "Kumppani". Niiden klikkaaminen voi ohjata sinut ulkoiselle sivustolle, jolla on oma tietosuojakäytäntönsä. ${siteName} ei vastaa ulkoisten mainostajien tietosuojakäytännöistä.`,
    s8aTitle: '8a. Kansainväliset tiedonsiirrot',
    s8aIntro: 'Useat käyttämämme palveluntarjoajat sijaitsevat ETA-alueen ulkopuolella tai siirtävät tietoja sen ulkopuolelle, useimmiten Yhdysvaltoihin:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, Yhdysvallat): kuuluu EU–US Data Privacy Framework (DPF) -järjestelyyn.' },
      { strong: 'Umami', body: '(Umami Software, Inc., Yhdysvallat; palvelimet Yhdysvalloissa ja EU:ssa): hyödyntää vakiosopimuslausekkeita (SCC).' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., Yhdysvallat): kuuluu EU–US Data Privacy Framework -järjestelyyn ja hyödyntää vakiosopimuslausekkeita (SCC).' },
      { strong: 'Resend', body: '(Resend Inc., Yhdysvallat): hyödyntää vakiosopimuslausekkeita (SCC).' },
      { strong: 'Supabase', body: '(Supabase Inc., Yhdysvallat, EU-alueen palvelinvaihtoehto saatavilla): hyödyntää vakiosopimuslausekkeita (SCC).' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Saksa): ETA-alueen sisäpuolella.' },
    ],
    s8aTail: 'Jokaisessa tapauksessa siirto on suojattu joko komission riittävyyspäätöksellä, EU–US Data Privacy Framework -järjestelyllä tai Euroopan komission hyväksymillä vakiosopimuslausekkeilla. Voit pyytää meiltä kopion sovellettavista suojatoimista.',
    s9Title: '9. Oikeutesi GDPR:n nojalla',
    s9Intro: 'Koska toimimme Suomesta ja palvelemme EU-kävijöitä, GDPR pätee täysimääräisesti. Sinulla on seuraavat oikeudet:',
    s9Items: [
      { strong: 'Oikeus saada pääsy tietoihin (15 art.)', body: 'pyytää kopio meillä olevista henkilötiedoistasi.' },
      { strong: 'Oikeus tietojen oikaisuun (16 art.)', body: 'pyytää virheellisten tai puutteellisten tietojen korjaamista.' },
      { strong: 'Oikeus tulla unohdetuksi (17 art.)', body: 'pyytää tietojesi poistamista, kun säilyttämiselle ei ole pakottavaa syytä.' },
      { strong: 'Oikeus käsittelyn rajoittamiseen (18 art.)', body: 'pyytää käsittelyn keskeyttämistä, kunnes kysymys on ratkaistu.' },
      { strong: 'Oikeus tietojen siirtämiseen (20 art.)', body: 'saada tietosi koneellisesti luettavassa muodossa.' },
      { strong: 'Oikeus vastustaa käsittelyä (21 art.)', body: 'vastustaa käsittelyä, joka perustuu oikeutettuun etuun, mukaan lukien suoramarkkinointi.' },
      { strong: 'Oikeus peruuttaa suostumus', body: 'milloin tahansa, peruutushetkestä alkaen.' },
      { strong: 'Oikeus tehdä valitus valvontaviranomaiselle (77 art.)', body: 'Tietosuojavaltuutetun toimistoon osoitteessa tietosuoja.fi tai vakinaisen asuinmaasi valvontaviranomaiselle EU:ssa.' },
    ],
    s9Tail: (email) => <>Oikeuksien käyttämistä varten ota yhteyttä osoitteeseen {email}. Vastaamme kuukauden kuluessa.</>,
    s10Title: '10. Automatisoitu päätöksenteko',
    s10Body: 'Emme tee automatisoitua päätöksentekoa, profilointia tai muuta GDPR:n 22 artiklan tarkoittamaa käsittelyä, jolla olisi oikeudellisia tai muuten merkittäviä vaikutuksia sinuun.',
    s11Title: '11. Lapset',
    s11Body: 'Sivustomme ja uutiskirjeemme on suunnattu aikuisille. Emme tietoisesti kerää tietoa alle 13-vuotiailta lapsilta (Suomen lain ja GDPR:n mukainen digipalveluiden ikäraja). Jos epäilet, että lapsi on antanut meille henkilötietoja, ota yhteyttä ja poistamme ne.',
    s12Title: '12. Selosteen muutokset',
    s12Body: 'Voimme päivittää tätä tietosuojaselostetta aika ajoin. Yläosan "Viimeksi päivitetty" -päivämäärä kertoo viimeisimmän muutoksen. Olennaisista muutoksista ilmoitetaan etusivulla vähintään 14 päivän ajan.',
    backToHome: '← Takaisin etusivulle',
    cookiePolicy: 'Evästekäytäntö →',
  },
  de: {
    h1: 'Datenschutzerklärung',
    lastUpdated: 'Zuletzt aktualisiert: Oktober 2026',
    s1Title: '1. Verantwortlicher',
    s1Body: () => <>LaPeso Oy (Handelsregisternummer 3309136-7), Finnland. E-Mail: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Welche Daten wir erheben',
    s2Body: 'Wir erheben pseudonyme Analysedaten über Google Analytics 4 und cookielose Besucherstatistiken über Umami. Wenn Sie unseren Newsletter abonnieren, speichern wir Ihre E-Mail-Adresse sicher. Weitere personenbezogene Daten erheben wir nicht, sofern Sie uns nicht direkt kontaktieren.',
    s2aTitle: '2a. Rechtsgrundlage der Verarbeitung (Art. 6 DSGVO)',
    s2aIntro: 'Wir stützen uns auf folgende Rechtsgrundlagen:',
    s2aItems: [
      { strong: 'Einwilligung (Art. 6 Abs. 1 lit. a)', body: 'für Analyse-Cookies (Google Analytics 4), das Partnerskript von GetYourGuide und sonstige nicht erforderliche Cookies. Sie erteilen die Einwilligung über das Cookie-Banner und können sie jederzeit widerrufen.' },
      { strong: 'Einwilligung (Art. 6 Abs. 1 lit. a)', body: 'für das Newsletter-Abonnement. Sie erteilen die Einwilligung durch das Absenden des Anmeldeformulars und können sie jederzeit über den Abmeldelink widerrufen.' },
      { strong: 'Berechtigtes Interesse (Art. 6 Abs. 1 lit. f)', body: 'für die Speicherung Ihrer Einwilligungswahl im localStorage Ihres Browsers sowie für Betrugs- und Sicherheitsprotokolle. Unser Interesse ist der Betrieb einer funktionsfähigen Website; dieses Interesse wird gegen Ihre vernünftigen Erwartungen abgewogen.' },
      { strong: 'Berechtigtes Interesse (Art. 6 Abs. 1 lit. f)', body: 'für die Zuordnung von Klicks auf Partnerlinks. Unser Interesse besteht darin, die redaktionell verdiente Provision zu erhalten; die erhobenen Daten sind minimal (Referrer) und Sie können auf das Anklicken der Partnerlinks verzichten.' },
      { strong: 'Berechtigtes Interesse (Art. 6 Abs. 1 lit. f)', body: 'für cookielose Besucherstatistiken mit Umami (Abschnitt 4). Unser Interesse ist zu wissen, welche Seiten und Formulare funktionieren; Umami speichert nichts auf Ihrem Gerät und bewahrt Ihre IP-Adresse nicht auf.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Unsere Website verwendet Cookies, um Ihr Surferlebnis zu verbessern und pseudonyme Analysedaten zu erheben. Dazu zählen:',
    s3Items: [
      { strong: 'Essenzielle Speicherung', body: 'für die Funktion der Website erforderlich (Ihre Einwilligungswahl, die im localStorage Ihres Browsers gespeichert wird, nicht in einem Cookie). Die Website selbst setzt keine Cookies, bevor Sie sie akzeptieren.' },
      { strong: 'Analyse-Cookies', body: 'werden von Google Analytics 4 verwendet, um zu verstehen, wie Besucher die Website nutzen. Pseudonyme Erfassung.' },
      { strong: 'GetYourGuide-Cookies', body: 'werden vom Partnerskript von GetYourGuide gesetzt, das erst geladen wird, wenn Sie Cookies akzeptieren. Mit ihnen werden Aufrufe und Klicks der Aktivitäten-Widgets gezählt und Buchungen der Website zugeordnet.' },
    ],
    s3Tail: (cookieLink) => <>Analyse- und GetYourGuide-Cookies werden erst nach Ihrer Einwilligung über das Cookie-Banner gesetzt. Die Besucherstatistik von Umami (Abschnitt 4) verwendet keine Cookies. Vollständige Angaben finden Sie in {cookieLink}.</>,
    s4Title: '4. Google Analytics und Umami',
    s4Body: 'Wir verwenden Google Analytics 4 mit Consent Mode v2. Wenn Sie Cookies ablehnen, werden keine Analysedaten erhoben. Wenn Sie zustimmen, werden Nutzungsdaten (aufgerufene Seiten, Verweildauer, Gerätetyp und Standort auf Land- und Stadtebene) an Google gesendet. Die Daten sind pseudonym: Wir übermitteln weder Namen noch E-Mail-Adresse oder andere direkt identifizierende Angaben, aber die zufällige Cookie-Kennung und Ihre IP-Adresse sind personenbezogene Daten im Sinne der DSGVO.',
    s4Umami: 'Zusätzlich nutzen wir Umami Cloud, um Seitenaufrufe, Klicks auf einige unserer Links und Schaltflächen (zum Beispiel zu unseren Schwesterseiten oder unserer App) und die Schritte unserer Formulare und Tools zu zählen, etwa wenn ein Newsletter-Formular angezeigt, begonnen oder abgeschickt wird. Umami verwendet keine Cookies und speichert nichts auf Ihrem Gerät; es läuft daher unabhängig davon, ob Sie Cookies akzeptieren. Erfasst werden Adresse und Titel der Seite, die Website, von der Sie kommen, Ihr Browser, Betriebssystem, Gerätetyp, Bildschirmgröße, Sprache und ungefährer Standort (Land, Region und Stadt). Ihre IP-Adresse wird nur verwendet, um diesen Standort und eine pseudonyme Besuchskennung zu berechnen, und nie gespeichert. Die Kennung ist ein Hashwert, der sich zu Beginn jedes Monats ändert. Diese Ereignisse erfassen nur, was angeklickt oder ausgewählt wurde und um welchen Schritt es sich handelt (zum Beispiel die Schwesterseite, die Sie geöffnet haben), und, falls ein Formular Sie aufhält, den Namen des Feldes (zum Beispiel „email“), nie Ihre Eingaben.',
    s5Title: '5. Newsletter',
    s5Body: (unsub) => <>Wenn Sie unseren Newsletter abonnieren, wird Ihre E-Mail-Adresse über Resend und Supabase sicher gespeichert. Sie können sich jederzeit über den Link in jeder E-Mail oder auf {unsub} abmelden.</>,
    s6Title: '6. Speicherdauer',
    s6Body: 'Analysedaten werden in Google Analytics 14 Monate und in Umami höchstens 2 Jahre gespeichert. Newsletter-E-Mail-Adressen werden bis zur Abmeldung gespeichert.',
    s7Title: '7. Dritte',
    s7Intro: 'Wir verkaufen Ihre personenbezogenen Daten nicht. Folgende Dienste verarbeiten im Rahmen unseres Betriebs Daten:',
    s7Items: [
      'Google Analytics: pseudonyme Nutzungsanalyse',
      'Umami: cookielose Besucherstatistik und Zählung von Formularschritten',
      'GetYourGuide: Aktivitäten-Widgets und Zuordnung von Buchungen, erst wenn Sie Cookies akzeptieren',
      'Resend: Newsletter-Versand',
      'Supabase: Backend- und Datenbankdienste',
      'Cloudflare: Hosting und CDN',
    ],
    s8Title: '8. Werbung',
    s8Body1: (siteName) => `Diese Website zeigt Anzeigen und bezahlte Partnerplatzierungen Dritter. Diese sind eindeutig gekennzeichnet, etwa mit „Anzeige“ oder „Partner“. Wenn Sie darauf klicken, werden Sie ggf. auf externe Websites mit eigenen Datenschutzrichtlinien weitergeleitet. ${siteName} ist nicht für die Datenpraxis externer Werbetreibender verantwortlich.`,
    s8aTitle: '8a. Internationale Datenübermittlungen',
    s8aIntro: 'Einige der von uns genutzten Dienste haben ihren Sitz außerhalb des Europäischen Wirtschaftsraums (EWR) oder übermitteln Daten dorthin, meist in die USA:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, USA): abgedeckt durch das EU-US Data Privacy Framework (DPF).' },
      { strong: 'Umami', body: '(Umami Software, Inc., USA; Server in den USA und in der EU): abgedeckt durch Standardvertragsklauseln.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., USA): abgedeckt durch das EU-US Data Privacy Framework und Standardvertragsklauseln (SCC).' },
      { strong: 'Resend', body: '(Resend Inc., USA): abgedeckt durch Standardvertragsklauseln.' },
      { strong: 'Supabase', body: '(Supabase Inc., USA, EU-Region verfügbar): abgedeckt durch Standardvertragsklauseln.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Deutschland): innerhalb des EWR.' },
    ],
    s8aTail: 'In jedem Fall ist die Übermittlung durch einen Angemessenheitsbeschluss, das EU-US Data Privacy Framework oder von der Europäischen Kommission genehmigte Standardvertragsklauseln abgesichert. Eine Kopie der relevanten Schutzmaßnahmen erhalten Sie auf Anfrage.',
    s9Title: '9. Ihre Rechte nach DSGVO',
    s9Intro: 'Da wir aus Finnland tätig sind und Besucher aus der Europäischen Union bedienen, gilt die DSGVO vollumfänglich. Sie haben folgende Rechte:',
    s9Items: [
      { strong: 'Auskunftsrecht (Art. 15)', body: 'Anforderung einer Kopie der über Sie gespeicherten personenbezogenen Daten.' },
      { strong: 'Recht auf Berichtigung (Art. 16)', body: 'Berichtigung unrichtiger oder unvollständiger Daten.' },
      { strong: 'Recht auf Löschung („Recht auf Vergessenwerden“, Art. 17)', body: 'Löschung Ihrer Daten, sofern kein vorrangiger Grund zur Speicherung besteht.' },
      { strong: 'Recht auf Einschränkung der Verarbeitung (Art. 18)', body: 'Pausieren der Verarbeitung, solange eine Frage geprüft wird.' },
      { strong: 'Recht auf Datenübertragbarkeit (Art. 20)', body: 'Erhalt Ihrer Daten in einem strukturierten, maschinenlesbaren Format.' },
      { strong: 'Widerspruchsrecht (Art. 21)', body: 'Widerspruch gegen Verarbeitung auf Grundlage berechtigter Interessen, einschließlich Direktwerbung.' },
      { strong: 'Recht auf Widerruf der Einwilligung', body: 'jederzeit mit Wirkung ab Widerruf.' },
      { strong: 'Beschwerderecht (Art. 77)', body: 'bei der finnischen Datenschutzbehörde (Tietosuojavaltuutettu) unter tietosuoja.fi oder bei der Aufsichtsbehörde Ihres gewöhnlichen Aufenthaltsorts in der EU.' },
    ],
    s9Tail: (email) => <>Zur Ausübung dieser Rechte wenden Sie sich an {email}. Wir antworten innerhalb eines Monats.</>,
    s10Title: '10. Automatisierte Entscheidungsfindung',
    s10Body: 'Wir führen keine automatisierten Entscheidungen, kein Profiling und keine sonstige Verarbeitung im Sinne von Art. 22 DSGVO durch, die Sie rechtlich oder vergleichbar erheblich beeinträchtigt.',
    s11Title: '11. Kinder',
    s11Body: 'Diese Website und unser Newsletter richten sich an Erwachsene. Wir erheben wissentlich keine Daten von Kindern unter 13 Jahren (Altersgrenze für digitale Dienste nach finnischem Recht und DSGVO). Sollte ein Kind uns personenbezogene Daten überlassen haben, kontaktieren Sie uns, wir löschen sie.',
    s12Title: '12. Änderungen dieser Erklärung',
    s12Body: 'Wir können diese Datenschutzerklärung gelegentlich aktualisieren. Das oben angegebene Datum „Zuletzt aktualisiert“ zeigt die jüngste Überarbeitung. Wesentliche Änderungen werden mindestens 14 Tage auf der Startseite hervorgehoben.',
    backToHome: '← Zurück zur Startseite',
    cookiePolicy: 'Cookie-Richtlinie →',
  },
  ja: {
    h1: 'プライバシーポリシー',
    lastUpdated: '最終更新：2026年10月',
    s1Title: '1. 管理者',
    s1Body: () => <>LaPeso Oy（ID 3309136-7）、フィンランド。メール：<a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. 収集するデータ',
    s2Body: 'Google Analytics 4 を通じて仮名化されたアクセス解析データを、Umami を通じてクッキーを使用しない訪問者統計を収集しています。ニュースレターにご登録いただいた場合は、メールアドレスを安全に保管します。それ以外の個人を識別できる情報は、お客様から直接ご連絡をいただかない限り収集しません。',
    s2aTitle: '2a. 処理の法的根拠（GDPR 第6条）',
    s2aIntro: '各処理活動について、以下の法的根拠に基づいて処理しています：',
    s2aItems: [
      { strong: '同意（第6条第1項(a)）', body: '解析クッキー（Google Analytics 4）、GetYourGuide のパートナースクリプト、およびその他の非必須クッキーについて。クッキーバナーで同意していただき、いつでも撤回できます。' },
      { strong: '同意（第6条第1項(a)）', body: 'ニュースレターの登録について。登録フォームの送信で同意となり、配信停止リンクからいつでも撤回できます。' },
      { strong: '正当な利益（第6条第1項(f)）', body: 'ブラウザの localStorage への同意設定の保存、および不正防止・セキュリティログについて。当方の利益は機能するウェブサイトの運営であり、お客様の合理的な期待とバランスが取れています。' },
      { strong: '正当な利益（第6条第1項(f)）', body: 'アフィリエイトリンクのクリック帰属について。当方の利益は編集上獲得した紹介料を受け取ることです。収集されるデータは最小限（参照元）で、アフィリエイトリンクをクリックしないことで回避できます。' },
      { strong: '正当な利益（第6条第1項(f)）', body: 'Umami によるクッキーを使用しない訪問者統計について（第4項）。当方の利益は、どのページやフォームが機能しているかを知ることです。Umami はお客様の端末に何も保存せず、IP アドレスも保持しません。' },
    ],
    s3Title: '3. クッキー',
    s3Intro: 'ブラウジング体験の向上と仮名化されたアクセス解析のため、当サイトではクッキーを使用しています。以下が含まれます：',
    s3Items: [
      { strong: '必須の保存データ', body: 'ウェブサイトの正常な動作に必要（クッキーではなくブラウザの localStorage に保存される同意設定）。本サイト自体は、同意をいただくまでクッキーを設定しません。' },
      { strong: '解析クッキー', body: 'Google Analytics 4 がサイトの利用状況を把握するために使用。仮名化された形で収集。' },
      { strong: 'GetYourGuide のクッキー', body: 'GetYourGuide のパートナースクリプトが設定します。このスクリプトはクッキーに同意した後にのみ読み込まれます。アクティビティのウィジェットの表示回数とクリック数を数え、予約をサイトに帰属させます。' },
    ],
    s3Tail: (cookieLink) => <>解析クッキーと GetYourGuide のクッキーは、クッキーバナーで同意をいただいた後にのみ設定されます。Umami の訪問者統計（第4項）はクッキーを使用しません。詳細は{cookieLink}をご覧ください。</>,
    s4Title: '4. Google Analytics と Umami',
    s4Body: '当サイトでは Consent Mode v2 を有効にした Google Analytics 4 を使用しています。クッキーを拒否した場合、アナリティクスデータは収集されません。同意された場合、閲覧ページ、滞在時間、デバイスの種類、国および都市レベルの所在地といった利用データが Google に送信されます。これらは仮名化されたデータです：氏名やメールアドレスなど直接個人を特定できる情報は送信しませんが、クッキーのランダムな識別子と IP アドレスは GDPR 上の個人データに当たります。',
    s4Umami: 'また、Umami Cloud を使って、ページの閲覧数、一部のリンクやボタンのクリック（姉妹サイトやアプリへのリンクなど）、フォームやツールの各段階（ニュースレターのフォームが表示された、入力が始まった、送信された など）を数えています。Umami はクッキーを使用せず、お客様の端末に何も保存しないため、クッキーに同意されたかどうかにかかわらず動作します。記録されるのは、ページのアドレスとタイトル、参照元のサイト、ブラウザ、OS、端末の種類、画面サイズ、言語、おおよその所在地（国・地域・都市）です。IP アドレスはこの所在地と仮名化された訪問識別子を算出するためだけに使われ、保存されることはありません。識別子はハッシュ値で、毎月初めに変わります。これらのイベントに記録されるのは、何がクリック・選択されたか、どの段階か（例：開いた姉妹サイト）と、フォームで先に進めなかった場合の項目名（例：「email」）だけで、入力した内容が記録されることはありません。',
    s5Title: '5. ニュースレター',
    s5Body: (unsub) => <>ニュースレターにご登録いただくと、メールアドレスは Resend と Supabase を通じて安全に保管されます。配信停止は、各メール内のリンクまたは{unsub}からいつでも可能です。</>,
    s6Title: '6. データの保管期間',
    s6Body: '解析データは Google Analytics 内で14ヶ月間、Umami 内で最長2年間保管されます。ニュースレターのメールアドレスは、配信停止までの間保管されます。',
    s7Title: '7. 第三者',
    s7Intro: '個人情報を販売することはありません。運営の一環として、以下の第三者サービスがデータを処理しています：',
    s7Items: [
      'Google Analytics：仮名化された利用分析',
      'Umami：クッキーを使用しない訪問者統計とフォームの段階の集計',
      'GetYourGuide：アクティビティのウィジェットと予約の帰属（クッキーへの同意後のみ）',
      'Resend：ニュースレターの配信',
      'Supabase：バックエンド・データベースサービス',
      'Cloudflare：ホスティングと CDN',
    ],
    s8Title: '8. 広告',
    s8Body1: (siteName) => `本サイトには第三者の広告と有料のパートナー掲載が表示されます。これらには「広告」などのラベルを付けて明確に区別しています。クリックすると、独自のプライバシーポリシーを持つ外部サイトに移動する場合があります。${siteName} は外部広告主のデータ取り扱いについて責任を負いません。`,
    s8aTitle: '8a. 国際的なデータ移転',
    s8aIntro: '当方が利用している第三者サービスの一部は、欧州経済領域（EEA）外、特に米国を拠点としているか、データを移転しています：',
    s8aItems: [
      { strong: 'Google Analytics', body: '（Google LLC、米国）：EU–米国データプライバシーフレームワーク（DPF）の対象。' },
      { strong: 'Umami', body: '（Umami Software, Inc.、米国。サーバーは米国と EU）：標準契約条項（SCC）の対象。' },
      { strong: 'Cloudflare', body: '（Cloudflare Inc.、米国）：EU–米国データプライバシーフレームワークと標準契約条項（SCC）の対象。' },
      { strong: 'Resend', body: '（Resend Inc.、米国）：標準契約条項（SCC）の対象。' },
      { strong: 'Supabase', body: '（Supabase Inc.、米国、EU リージョン利用可能）：標準契約条項（SCC）の対象。' },
      { strong: 'GetYourGuide', body: '（GetYourGuide GmbH、ドイツ）：EEA 内。' },
    ],
    s8aTail: 'いずれの場合も、移転は欧州委員会の十分性決定、EU–米国データプライバシーフレームワーク、または欧州委員会承認の標準契約条項によって保護されています。関連する保護措置のコピーは、お問い合わせにより提供可能です。',
    s9Title: '9. GDPR に基づくお客様の権利',
    s9Intro: '当方はフィンランドを拠点に EU 居住者にサービスを提供しているため、GDPR が完全に適用されます。お客様には以下の権利があります：',
    s9Items: [
      { strong: 'アクセス権（第15条）', body: '当方が保持しているお客様の個人データのコピーを請求できます。' },
      { strong: '訂正権（第16条）', body: '不正確または不完全なデータの訂正を求めることができます。' },
      { strong: '削除権（忘れられる権利、第17条）', body: '保管する優先理由がない場合、データの削除を求めることができます。' },
      { strong: '処理制限権（第18条）', body: '問題が解決するまで処理を一時停止するよう求めることができます。' },
      { strong: 'データポータビリティ権（第20条）', body: '構造化された機械可読形式でデータを受け取れます。' },
      { strong: '異議権（第21条）', body: '正当な利益に基づく処理（ダイレクトマーケティングを含む）に異議を申し立てられます。' },
      { strong: '同意撤回権', body: 'いつでも、撤回時点から効力を持って撤回できます。' },
      { strong: '監督機関への苦情申立権（第77条）', body: 'フィンランドのデータ保護オンブズマン（Tietosuojavaltuutettu、tietosuoja.fi）、または EU 内のお客様の常居所地の監督機関に申立てられます。' },
    ],
    s9Tail: (email) => <>これらの権利を行使するには、{email} までご連絡ください。1ヶ月以内に対応いたします。</>,
    s10Title: '10. 自動化された意思決定',
    s10Body: 'GDPR 第22条の意味における、お客様に法的または同等に重要な影響を与える自動意思決定、プロファイリング、その他の処理は行っていません。',
    s11Title: '11. 子ども',
    s11Body: '本サイトおよびニュースレターは成人を対象としています。13歳未満の子ども（フィンランド法および GDPR でのデジタルサービス年齢基準）から意図的にデータを収集することはありません。子どもが個人情報を提供したと思われる場合は、お知らせください。削除いたします。',
    s12Title: '12. 本ポリシーの変更',
    s12Body: '本プライバシーポリシーは随時更新されることがあります。冒頭の「最終更新」日付が直近の改訂を反映しています。重要な変更については、ホームページで少なくとも14日間お知らせします。',
    backToHome: '← ホームへ戻る',
    cookiePolicy: 'クッキーポリシー →',
  },
  es: {
    h1: 'Política de Privacidad',
    lastUpdated: 'Última actualización: octubre de 2026',
    s1Title: '1. Responsable del Tratamiento',
    s1Body: () => <>LaPeso Oy (ID 3309136-7), Finlandia. Correo electrónico: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Datos que recopilamos',
    s2Body: 'Recopilamos datos analíticos seudonimizados a través de Google Analytics 4 y estadísticas de visitas sin cookies a través de Umami. Si se suscribe a nuestro boletín, almacenamos su dirección de correo electrónico de forma segura. No recogemos ningún otro dato personal identificable salvo que usted nos contacte directamente.',
    s2aTitle: '2a. Base jurídica del tratamiento (Art. 6 RGPD)',
    s2aIntro: 'Nos basamos en las siguientes bases jurídicas para cada actividad de tratamiento:',
    s2aItems: [
      { strong: 'Consentimiento (Art. 6(1)(a))', body: 'para las cookies analíticas (Google Analytics 4), el script de afiliado de GetYourGuide y demás cookies no esenciales. Usted otorga su consentimiento a través del banner de cookies y puede retirarlo en cualquier momento.' },
      { strong: 'Consentimiento (Art. 6(1)(a))', body: 'para la suscripción al boletín. Usted otorga su consentimiento al enviar el formulario de alta y puede retirarlo en cualquier momento mediante el enlace para darse de baja.' },
      { strong: 'Interés legítimo (Art. 6(1)(f))', body: 'para guardar su elección de consentimiento en el localStorage de su navegador y para los registros de prevención de fraude y seguridad. Nuestro interés es operar un sitio web funcional; este interés se pondera frente a sus expectativas razonables.' },
      { strong: 'Interés legítimo (Art. 6(1)(f))', body: 'para la atribución de clics en enlaces de afiliados. Nuestro interés es cobrar la comisión editorial que hemos ganado; los datos recogidos son mínimos (fuente de referencia) y usted puede optar por no hacer clic en los enlaces de afiliados.' },
      { strong: 'Interés legítimo (Art. 6(1)(f))', body: 'para las estadísticas de visitas sin cookies con Umami (apartado 4). Nuestro interés es saber qué páginas y formularios funcionan; Umami no guarda nada en su dispositivo ni conserva su dirección IP.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación y recopilar datos analíticos seudonimizados. Estas incluyen:',
    s3Items: [
      { strong: 'Almacenamiento esencial', body: 'necesario para el funcionamiento correcto del sitio (su elección de consentimiento, guardada en el localStorage de su navegador, no en una cookie). El propio sitio no establece ninguna cookie antes de que usted las acepte.' },
      { strong: 'Cookies analíticas', body: 'utilizadas por Google Analytics 4 para entender cómo interactúan los visitantes con nuestro sitio. Se recogen de forma seudonimizada.' },
      { strong: 'Cookies de GetYourGuide', body: 'las establece el script de afiliado de GetYourGuide, que solo se carga cuando usted acepta las cookies. Cuentan las visualizaciones y los clics de los widgets de actividades y atribuyen las reservas al sitio.' },
    ],
    s3Tail: (cookieLink) => <>Las cookies analíticas y las de GetYourGuide solo se establecen tras su consentimiento mediante el banner de cookies. Las estadísticas de visitas de Umami (apartado 4) no utilizan cookies. Consulte nuestra {cookieLink} para más detalles.</>,
    s4Title: '4. Google Analytics y Umami',
    s4Body: 'Utilizamos Google Analytics 4 con Consent Mode v2. Si rechaza las cookies, no se recoge ningún dato analítico. Si acepta, se envían a Google datos de uso (páginas vistas, tiempo en el sitio, tipo de dispositivo y ubicación a nivel de país y ciudad). Los datos son seudonimizados: no enviamos su nombre, dirección de correo electrónico ni otros datos que le identifiquen directamente, pero el identificador aleatorio de la cookie y su dirección IP son datos personales conforme al RGPD.',
    s4Umami: 'Además, utilizamos Umami Cloud para contar las visitas a páginas, los clics en algunos de nuestros enlaces y botones (por ejemplo, hacia nuestros sitios hermanos o nuestra app) y los pasos de nuestros formularios y herramientas, por ejemplo cuando se muestra, se empieza a rellenar o se envía un formulario del boletín. Umami no utiliza cookies ni guarda nada en su dispositivo, por lo que funciona tanto si acepta las cookies como si no. Registra la dirección y el título de la página, el sitio del que procede, su navegador, sistema operativo, tipo de dispositivo, tamaño de pantalla, idioma y ubicación aproximada (país, región y ciudad). Su dirección IP solo se utiliza para calcular esa ubicación y un identificador seudonimizado de la visita, y nunca se almacena. El identificador es un hash que cambia al comienzo de cada mes. Estos eventos registran solo en qué se hizo clic o qué se eligió y de qué paso se trata (por ejemplo, el sitio hermano que abrió) y, si un formulario le impide continuar, el nombre del campo (por ejemplo, «email»), nunca lo que usted ha escrito.',
    s5Title: '5. Boletín',
    s5Body: (unsub) => <>Si se suscribe a nuestro boletín, su dirección de correo electrónico se almacena de forma segura a través de Resend y Supabase. Puede darse de baja en cualquier momento mediante el enlace de cada correo o a través de nuestra {unsub}.</>,
    s6Title: '6. Conservación de los datos',
    s6Body: 'Los datos analíticos se conservan durante 14 meses en Google Analytics y hasta 2 años en Umami. Las direcciones de correo del boletín se conservan hasta que usted se da de baja.',
    s7Title: '7. Terceros',
    s7Intro: 'No vendemos sus datos personales. Los siguientes servicios externos procesan datos como parte de nuestras operaciones:',
    s7Items: [
      'Google Analytics: analítica de uso seudonimizada',
      'Umami: estadísticas de visitas sin cookies y recuento de los pasos de los formularios',
      'GetYourGuide: widgets de actividades y atribución de reservas, solo si usted acepta las cookies',
      'Resend: envío de boletines por correo electrónico',
      'Supabase: servicios de base de datos en el backend',
      'Cloudflare: alojamiento y CDN',
    ],
    s8Title: '8. Publicidad',
    s8Body1: (siteName) => `Este sitio muestra anuncios de terceros y espacios pagados de colaboradores. Están claramente identificados, por ejemplo con la etiqueta "Anuncio" o "Colaborador". Al hacer clic en ellos puede ser redirigido a sitios externos con sus propias políticas de privacidad. ${siteName} no es responsable de las prácticas de tratamiento de datos de los anunciantes externos.`,
    s8aTitle: '8a. Transferencias internacionales de datos',
    s8aIntro: 'Varios de los servicios externos que utilizamos tienen su sede o transfieren datos a países fuera del Espacio Económico Europeo (EEE), normalmente Estados Unidos:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, EE. UU.): amparado por el Marco de Privacidad de Datos UE–EE. UU. (DPF).' },
      { strong: 'Umami', body: '(Umami Software, Inc., EE. UU.; servidores en EE. UU. y en la UE): amparado por Cláusulas Contractuales Tipo.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., EE. UU.): amparado por el Marco de Privacidad de Datos UE–EE. UU. y por Cláusulas Contractuales Tipo (CCT).' },
      { strong: 'Resend', body: '(Resend Inc., EE. UU.): amparado por Cláusulas Contractuales Tipo.' },
      { strong: 'Supabase', body: '(Supabase Inc., EE. UU., con alojamiento disponible en región UE): amparado por Cláusulas Contractuales Tipo.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Alemania): dentro del EEE.' },
    ],
    s8aTail: 'En cada caso, la transferencia está protegida por una decisión de adecuación, el Marco de Privacidad de Datos UE–EE. UU. o Cláusulas Contractuales Tipo aprobadas por la Comisión Europea. Puede solicitar una copia de las garantías aplicables poniéndose en contacto con nosotros.',
    s9Title: '9. Sus derechos conforme al RGPD',
    s9Intro: 'Como operamos desde Finlandia y prestamos servicio a visitantes de la Unión Europea, el RGPD se aplica plenamente. Usted tiene los siguientes derechos:',
    s9Items: [
      { strong: 'Derecho de acceso (Art. 15)', body: 'solicitar una copia de los datos personales que tenemos sobre usted.' },
      { strong: 'Derecho de rectificación (Art. 16)', body: 'solicitar que corrijamos datos inexactos o incompletos.' },
      { strong: 'Derecho de supresión / "derecho al olvido" (Art. 17)', body: 'solicitar la eliminación de sus datos cuando no exista un motivo prevalente para conservarlos.' },
      { strong: 'Derecho a la limitación del tratamiento (Art. 18)', body: 'solicitar que paralicemos el tratamiento mientras se resuelve una cuestión.' },
      { strong: 'Derecho a la portabilidad de los datos (Art. 20)', body: 'recibir sus datos en un formato estructurado y legible por máquina.' },
      { strong: 'Derecho de oposición (Art. 21)', body: 'oponerse al tratamiento basado en el interés legítimo, incluido el marketing directo.' },
      { strong: 'Derecho a retirar el consentimiento', body: 'en cualquier momento, con efecto desde el momento de la retirada.' },
      { strong: 'Derecho a presentar una reclamación (Art. 77)', body: 'ante la Defensora de Protección de Datos de Finlandia (Tietosuojavaltuutettu) en tietosuoja.fi, o ante la autoridad de control de su residencia habitual en la UE.' },
    ],
    s9Tail: (email) => <>Para ejercer cualquiera de estos derechos, póngase en contacto con nosotros en {email}. Responderemos en el plazo de un mes.</>,
    s10Title: '10. Decisiones automatizadas',
    s10Body: 'No realizamos decisiones automatizadas, elaboración de perfiles ni ningún tratamiento que produzca efectos jurídicos o de relevancia similar sobre usted en el sentido del artículo 22 del RGPD.',
    s11Title: '11. Menores',
    s11Body: 'Este sitio y nuestro boletín están dirigidos a adultos. No recopilamos conscientemente datos de menores de 13 años (umbral de edad para servicios digitales conforme a la ley finlandesa y al RGPD). Si cree que un menor nos ha facilitado datos personales, póngase en contacto con nosotros y los eliminaremos.',
    s12Title: '12. Cambios en esta política',
    s12Body: 'Podemos actualizar esta Política de Privacidad ocasionalmente. La fecha de "Última actualización" en la parte superior refleja la revisión más reciente. Los cambios sustanciales se señalarán en la página de inicio durante al menos 14 días.',
    backToHome: '← Volver al inicio',
    cookiePolicy: 'Política de Cookies →',
  },
  'pt-BR': {
    h1: 'Política de Privacidade',
    lastUpdated: 'Última atualização: outubro de 2026',
    s1Title: '1. Controlador',
    s1Body: () => <>LaPeso Oy (registro 3309136-7), Finlândia. E-mail: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Dados que coletamos',
    s2Body: 'Coletamos dados analíticos pseudonimizados por meio do Google Analytics 4 e estatísticas de visitas sem cookies por meio do Umami. Se você se inscrever em nosso boletim, armazenamos seu endereço de e-mail com segurança. Não coletamos nenhuma outra informação pessoal identificável, a menos que você entre em contato conosco diretamente.',
    s2aTitle: '2a. Base legal para o tratamento (Art. 6º do GDPR / Art. 7º da LGPD)',
    s2aIntro: 'Apoiamo-nos nas seguintes bases legais para cada atividade de tratamento (GDPR europeu e LGPD brasileira):',
    s2aItems: [
      { strong: 'Consentimento (Art. 6(1)(a) GDPR / Art. 7º, I LGPD)', body: 'para cookies analíticos (Google Analytics 4), o script de parceiro do GetYourGuide e demais cookies não essenciais. Você concede o consentimento pelo banner de cookies e pode retirá-lo a qualquer momento.' },
      { strong: 'Consentimento (Art. 6(1)(a) GDPR / Art. 7º, I LGPD)', body: 'para a inscrição no boletim. Você concede o consentimento ao enviar o formulário e pode retirá-lo a qualquer momento pelo link de cancelamento.' },
      { strong: 'Interesse legítimo (Art. 6(1)(f) GDPR / Art. 7º, IX LGPD)', body: 'para salvar sua escolha de consentimento no localStorage do seu navegador e para registros de prevenção a fraudes e segurança. Nosso interesse é manter um site funcional; esse interesse é ponderado em relação às suas expectativas razoáveis.' },
      { strong: 'Interesse legítimo (Art. 6(1)(f) GDPR / Art. 7º, IX LGPD)', body: 'para atribuição de cliques em links de afiliados. Nosso interesse é receber a comissão editorial conquistada; os dados coletados são mínimos (origem) e você pode optar por não clicar nos links de afiliados.' },
      { strong: 'Interesse legítimo (Art. 6(1)(f) GDPR / Art. 7º, IX LGPD)', body: 'para as estatísticas de visitas sem cookies com o Umami (seção 4). Nosso interesse é saber quais páginas e formulários funcionam; o Umami não armazena nada no seu dispositivo nem guarda o seu endereço IP.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Nosso site usa cookies para melhorar sua experiência de navegação e coletar dados analíticos pseudonimizados. Incluem:',
    s3Items: [
      { strong: 'Armazenamento essencial', body: 'necessário para o funcionamento adequado do site (sua escolha de consentimento, salva no localStorage do seu navegador, não em um cookie). O próprio site não define nenhum cookie antes de você aceitá-los.' },
      { strong: 'Cookies analíticos', body: 'usados pelo Google Analytics 4 para entender como os visitantes interagem com nosso site. Coletados de forma pseudonimizada.' },
      { strong: 'Cookies do GetYourGuide', body: 'definidos pelo script de parceiro do GetYourGuide, que só carrega depois que você aceita os cookies. Contam as exibições e os cliques dos widgets de atividades e atribuem as reservas ao site.' },
    ],
    s3Tail: (cookieLink) => <>Os cookies analíticos e os do GetYourGuide só são definidos após você consentir pelo banner. As estatísticas de visitas do Umami (seção 4) não usam cookies. Veja nossa {cookieLink} para mais detalhes.</>,
    s4Title: '4. Google Analytics e Umami',
    s4Body: 'Usamos o Google Analytics 4 com o Consent Mode v2. Se você recusar os cookies, nenhum dado analítico é coletado. Se aceitar, dados de uso (páginas visitadas, tempo no site, tipo de dispositivo e localização a nível de país e cidade) são enviados ao Google. Os dados são pseudonimizados: não enviamos seu nome, endereço de e-mail nem outros dados que o identifiquem diretamente, mas o identificador aleatório do cookie e o seu endereço IP são dados pessoais segundo o GDPR.',
    s4Umami: 'Também usamos o Umami Cloud para contar as visualizações de página, os cliques em alguns dos nossos links e botões (por exemplo, para os nossos sites irmãos ou o nosso app) e as etapas dos nossos formulários e ferramentas, por exemplo quando um formulário do boletim é exibido, começa a ser preenchido ou é enviado. O Umami não usa cookies nem armazena nada no seu dispositivo, por isso funciona quer você aceite os cookies, quer não. Ele registra o endereço e o título da página, o site de onde você veio, seu navegador, sistema operacional, tipo de dispositivo, tamanho da tela, idioma e localização aproximada (país, região e cidade). Seu endereço IP é usado apenas para calcular essa localização e um identificador pseudonimizado da visita, e nunca é armazenado. O identificador é um hash que muda no início de cada mês. Esses eventos registram apenas o que foi clicado ou escolhido e a etapa (por exemplo, o site irmão que você abriu) e, se um formulário impedir você de continuar, o nome do campo (por exemplo, "email"), nunca o que você digitou.',
    s5Title: '5. Boletim',
    s5Body: (unsub) => <>Ao se inscrever no nosso boletim, seu endereço de e-mail é armazenado com segurança pela Resend e pela Supabase. Você pode cancelar a qualquer momento pelo link em cada e-mail ou pela nossa {unsub}.</>,
    s6Title: '6. Retenção de dados',
    s6Body: 'Os dados analíticos são retidos por 14 meses no Google Analytics e por até 2 anos no Umami. Os e-mails do boletim ficam armazenados até você cancelar a inscrição.',
    s7Title: '7. Terceiros',
    s7Intro: 'Não vendemos seus dados pessoais. Os seguintes serviços externos processam dados como parte de nossas operações:',
    s7Items: [
      'Google Analytics: analítica de uso pseudonimizada',
      'Umami: estatísticas de visitas sem cookies e contagem das etapas dos formulários',
      'GetYourGuide: widgets de atividades e atribuição de reservas, só depois que você aceita os cookies',
      'Resend: envio de boletins por e-mail',
      'Supabase: serviços de banco de dados no backend',
      'Cloudflare: hospedagem e CDN',
    ],
    s8Title: '8. Publicidade',
    s8Body1: (siteName) => `Este site exibe anúncios de terceiros e espaços pagos de parceiros. Eles são claramente identificados, por exemplo com a marcação "Anúncio", "Publicidade" ou "Parceiro". Clicar neles pode redirecioná-lo a sites externos com suas próprias políticas de privacidade. O ${siteName} não é responsável pelas práticas de dados de anunciantes externos.`,
    s8aTitle: '8a. Transferências internacionais de dados',
    s8aIntro: 'Vários dos serviços externos que utilizamos estão sediados ou transferem dados para países fora do Espaço Econômico Europeu (EEE), mais comumente os Estados Unidos:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, EUA): coberto pelo Quadro de Privacidade de Dados UE–EUA (DPF).' },
      { strong: 'Umami', body: '(Umami Software, Inc., EUA; servidores nos EUA e na UE): coberto pelas Cláusulas Contratuais Padrão.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., EUA): coberto pelo Quadro de Privacidade de Dados UE–EUA e pelas Cláusulas Contratuais Padrão (CCP).' },
      { strong: 'Resend', body: '(Resend Inc., EUA): coberto pelas Cláusulas Contratuais Padrão.' },
      { strong: 'Supabase', body: '(Supabase Inc., EUA, com hospedagem disponível na região UE): coberto pelas Cláusulas Contratuais Padrão.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Alemanha): dentro do EEE.' },
    ],
    s8aTail: 'Em cada caso, a transferência está protegida por uma decisão de adequação, pelo Quadro de Privacidade de Dados UE–EUA ou pelas Cláusulas Contratuais Padrão aprovadas pela Comissão Europeia. Você pode solicitar uma cópia das garantias aplicáveis entrando em contato conosco.',
    s9Title: '9. Seus direitos sob o GDPR e a LGPD',
    s9Intro: 'Como operamos a partir da Finlândia e atendemos visitantes da União Europeia, o GDPR se aplica integralmente. Para usuários no Brasil, a LGPD (Lei nº 13.709/2018) também é observada. Você tem os seguintes direitos:',
    s9Items: [
      { strong: 'Direito de acesso (Art. 15 GDPR / Art. 18, II LGPD)', body: 'solicitar uma cópia dos dados pessoais que mantemos sobre você.' },
      { strong: 'Direito de retificação (Art. 16 GDPR / Art. 18, III LGPD)', body: 'pedir a correção de dados imprecisos ou incompletos.' },
      { strong: 'Direito de eliminação / "direito ao esquecimento" (Art. 17 GDPR / Art. 18, VI LGPD)', body: 'pedir a exclusão dos seus dados quando não houver motivo prevalente para mantê-los.' },
      { strong: 'Direito à limitação do tratamento (Art. 18 GDPR)', body: 'solicitar a pausa do tratamento enquanto uma questão é resolvida.' },
      { strong: 'Direito à portabilidade dos dados (Art. 20 GDPR / Art. 18, V LGPD)', body: 'receber seus dados em formato estruturado e legível por máquina.' },
      { strong: 'Direito de oposição (Art. 21 GDPR)', body: 'opor-se ao tratamento baseado em interesse legítimo, inclusive marketing direto.' },
      { strong: 'Direito de retirar o consentimento (Art. 8º, § 5º LGPD)', body: 'a qualquer momento, com efeito a partir da retirada.' },
      { strong: 'Direito de apresentar reclamação (Art. 77 GDPR / Art. 18, § 1º LGPD)', body: 'à Autoridade Finlandesa de Proteção de Dados (Tietosuojavaltuutettu) em tietosuoja.fi, à autoridade do seu país de residência habitual na UE, ou à ANPD no Brasil (anpd.gov.br).' },
    ],
    s9Tail: (email) => <>Para exercer qualquer um desses direitos, entre em contato em {email}. Responderemos no prazo de um mês.</>,
    s10Title: '10. Decisões automatizadas',
    s10Body: 'Não realizamos decisões automatizadas, criação de perfis nem qualquer outro tratamento que produza efeitos jurídicos ou de relevância similar sobre você, nos termos do Art. 22 do GDPR e do Art. 20 da LGPD.',
    s11Title: '11. Crianças',
    s11Body: 'Este site e nosso boletim são destinados a adultos. Não coletamos intencionalmente dados de crianças menores de 13 anos (idade mínima para serviços digitais segundo a lei finlandesa e o GDPR). Se você acredita que uma criança nos forneceu dados pessoais, entre em contato e os excluiremos.',
    s12Title: '12. Alterações nesta política',
    s12Body: 'Podemos atualizar esta Política de Privacidade periodicamente. A data de "Última atualização" no topo reflete a revisão mais recente. Mudanças relevantes serão sinalizadas na página inicial por pelo menos 14 dias.',
    backToHome: '← Voltar para a página inicial',
    cookiePolicy: 'Política de Cookies →',
  },
  'zh-CN': {
    h1: '隐私政策',
    lastUpdated: '最后更新：2026年10月',
    s1Title: '1. 数据控制者',
    s1Body: () => <>LaPeso Oy（企业代码 3309136-7），芬兰。电子邮件：<a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. 我们收集的数据',
    s2Body: '我们通过 Google Analytics 4 收集假名化的访问分析数据，并通过 Umami 收集不使用 cookie 的访客统计。如果您订阅了我们的电子简报，我们会安全地存储您的电子邮件地址。除非您直接与我们联系，否则我们不会收集任何其他可识别个人身份的信息。',
    s2aTitle: '2a. 处理的法律依据（通用数据保护条例第6条）',
    s2aIntro: '我们针对每一项处理活动依据以下法律依据进行处理：',
    s2aItems: [
      { strong: '同意（第6(1)(a)条）', body: '用于分析 cookie（Google Analytics 4）、GetYourGuide 合作伙伴脚本及其他非必要 cookie。您通过 cookie 横幅给予同意，并可随时撤回。' },
      { strong: '同意（第6(1)(a)条）', body: '用于电子简报订阅。您通过提交订阅表单给予同意，可随时通过取消订阅链接撤回。' },
      { strong: '合法利益（第6(1)(f)条）', body: '用于将您的同意选择保存在浏览器的 localStorage 中，以及用于防欺诈和安全日志。我们的利益是运营一个可正常使用的网站，并已与您的合理期望相平衡。' },
      { strong: '合法利益（第6(1)(f)条）', body: '用于联盟链接点击归因。我们的利益是获得编辑工作所应得的佣金；收集的数据极少（来源），您也可以选择不点击联盟链接。' },
      { strong: '合法利益（第6(1)(f)条）', body: '用于通过 Umami 进行不使用 cookie 的访客统计（第4节）。我们的利益在于了解哪些页面和表单有效；Umami 不会在您的设备上存储任何内容，也不会保留您的 IP 地址。' },
    ],
    s3Title: '3. Cookie',
    s3Intro: '我们的网站使用 cookie 以提升您的浏览体验并收集假名化分析数据。这些包括：',
    s3Items: [
      { strong: '必要存储', body: '网站正常运行所必需（您的同意选择，保存在浏览器的 localStorage 中，而非 cookie 中）。在您接受之前，本网站自身不会设置任何 cookie。' },
      { strong: '分析 cookie', body: 'Google Analytics 4 用于了解访客如何与本网站互动。以假名化方式收集。' },
      { strong: 'GetYourGuide cookie', body: '由 GetYourGuide 合作伙伴脚本设置，该脚本只有在您接受 cookie 后才会加载。用于统计活动小组件的展示和点击次数，并将预订归因于本网站。' },
    ],
    s3Tail: (cookieLink) => <>分析 cookie 和 GetYourGuide cookie 仅在您通过 cookie 横幅同意后才会设置。Umami 的访客统计（第4节）不使用 cookie。详情请参阅我们的 {cookieLink}。</>,
    s4Title: '4. Google Analytics 与 Umami',
    s4Body: '我们使用启用了 Consent Mode v2 的 Google Analytics 4。如果您拒绝 Cookie，则不会收集任何分析数据。如果您同意，使用数据（浏览的页面、停留时间、设备类型，以及国家和城市级别的位置）会发送给 Google。这些数据是假名化的：我们不会发送您的姓名、电子邮箱等可直接识别身份的信息，但 Cookie 中的随机标识符和您的 IP 地址属于 GDPR 所称的个人数据。',
    s4Umami: '我们还使用 Umami Cloud 统计页面浏览量、部分链接和按钮的点击（例如前往我们的姊妹网站或应用的链接）以及表单和工具的各个步骤，例如电子简报表单何时显示、何时开始填写、何时提交。Umami 不使用 cookie，也不会在您的设备上存储任何内容，因此无论您是否接受 cookie，它都会运行。它记录页面地址和标题、您来自的网站、浏览器、操作系统、设备类型、屏幕尺寸、语言以及大致位置（国家、地区和城市）。您的 IP 地址仅用于计算该位置和一个假名化的访问标识符，绝不会被存储。该标识符是一个哈希值，每月初更换。这些事件只记录点击或选择了什么、是哪个步骤（例如您打开的姊妹网站），以及在表单让您无法继续时对应的字段名称（例如“email”），绝不记录您输入的内容。',
    s5Title: '5. 电子简报',
    s5Body: (unsub) => <>如果您订阅了我们的电子简报，您的电子邮件地址将通过 Resend 和 Supabase 安全存储。您可以随时通过每封邮件中的链接或通过我们的{unsub}取消订阅。</>,
    s6Title: '6. 数据保留',
    s6Body: '分析数据在 Google Analytics 中保留14个月，在 Umami 中最多保留2年。电子简报的电子邮件地址在您取消订阅前一直保留。',
    s7Title: '7. 第三方',
    s7Intro: '我们不会出售您的个人数据。作为运营的一部分，以下第三方服务会处理数据：',
    s7Items: [
      'Google Analytics：假名化使用分析',
      'Umami：不使用 cookie 的访客统计和表单步骤计数',
      'GetYourGuide：活动小组件与预订归因（仅在您接受 cookie 后）',
      'Resend：电子简报邮件发送',
      'Supabase：后端数据库服务',
      'Cloudflare：托管与 CDN',
    ],
    s8Title: '8. 广告',
    s8Body1: (siteName) => `本网站会展示第三方的广告和付费合作伙伴展示位。它们均有清晰标注，例如标有“广告”字样。点击后可能会将您重定向到拥有自身隐私政策的外部网站。${siteName} 不对外部广告主的数据处理做法负责。`,
    s8aTitle: '8a. 跨境数据传输',
    s8aIntro: '我们使用的若干第三方服务的总部或数据传输目的地位于欧洲经济区（EEA）以外，最常见的是美国：',
    s8aItems: [
      { strong: 'Google Analytics', body: '（Google LLC，美国）：受欧盟–美国数据隐私框架（DPF）保护。' },
      { strong: 'Umami', body: '（Umami Software, Inc.，美国；服务器位于美国和欧盟）：受标准合同条款（SCC）保护。' },
      { strong: 'Cloudflare', body: '（Cloudflare Inc.，美国）：受欧盟–美国数据隐私框架及标准合同条款（SCC）保护。' },
      { strong: 'Resend', body: '（Resend Inc.，美国）：受标准合同条款（SCC）保护。' },
      { strong: 'Supabase', body: '（Supabase Inc.，美国，亦可使用欧盟区域托管）：受标准合同条款（SCC）保护。' },
      { strong: 'GetYourGuide', body: '（GetYourGuide GmbH，德国）：位于欧洲经济区内。' },
    ],
    s8aTail: '在任何情形下，数据传输均通过欧盟委员会的充分性决定、欧盟–美国数据隐私框架或经欧盟委员会批准的标准合同条款进行保护。您可联系我们索取相应保护措施的副本。',
    s9Title: '9. 您在通用数据保护条例下的权利',
    s9Intro: '由于我们在芬兰运营并向欧盟访客提供服务，通用数据保护条例（GDPR）完全适用。您享有以下权利：',
    s9Items: [
      { strong: '访问权（第15条）', body: '请求获取我们持有的关于您个人数据的副本。' },
      { strong: '更正权（第16条）', body: '要求我们更正不准确或不完整的数据。' },
      { strong: '删除权/“被遗忘权”（第17条）', body: '在不存在压倒性保留理由时，要求我们删除您的数据。' },
      { strong: '限制处理权（第18条）', body: '在问题正在解决期间，要求我们暂停处理。' },
      { strong: '数据可携带权（第20条）', body: '以结构化、机器可读的格式获取您的数据。' },
      { strong: '反对权（第21条）', body: '反对基于合法利益的处理，包括直接营销。' },
      { strong: '撤回同意权', body: '可随时撤回，自撤回时刻起生效。' },
      { strong: '投诉权（第77条）', body: '向芬兰数据保护专员公署（Tietosuojavaltuutettu，tietosuoja.fi）或您在欧盟惯常居住地的监管机构投诉。' },
    ],
    s9Tail: (email) => <>如需行使上述任何权利，请通过 {email} 与我们联系。我们将在一个月内回复。</>,
    s10Title: '10. 自动化决策',
    s10Body: '我们不会进行 GDPR 第22条所述的、对您产生法律或类似重大影响的自动化决策、用户画像或其他相关处理。',
    s11Title: '11. 未成年人',
    s11Body: '本网站及我们的电子简报面向成年人。我们不会有意收集13岁以下儿童的数据（芬兰法律及通用数据保护条例规定的数字服务年龄门槛）。如果您认为某位儿童向我们提供了个人数据，请联系我们，我们将予以删除。',
    s12Title: '12. 本政策的变更',
    s12Body: '我们可能会不时更新本隐私政策。顶部的“最后更新”日期反映最新修订。重大变更将在主页上至少醒目展示14天。',
    backToHome: '← 返回首页',
    cookiePolicy: 'Cookie 政策 →',
  },
  ko: {
    h1: '개인정보 처리방침',
    lastUpdated: '최종 업데이트: 2026년 10월',
    s1Title: '1. 관리자',
    s1Body: () => <>LaPeso Oy(ID 3309136-7), 핀란드. 이메일: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. 수집하는 데이터',
    s2Body: '당사는 Google Analytics 4를 통해 가명 처리된 분석 데이터를, Umami를 통해 쿠키를 사용하지 않는 방문자 통계를 수집합니다. 뉴스레터를 구독하시면 귀하의 이메일 주소를 안전하게 보관합니다. 귀하가 당사에 직접 연락하시지 않는 한, 그 외의 식별 가능한 개인정보는 수집하지 않습니다.',
    s2aTitle: '2a. 처리의 법적 근거(GDPR 제6조)',
    s2aIntro: '당사는 각 처리 활동에 대해 다음 법적 근거에 의존합니다:',
    s2aItems: [
      { strong: '동의(제6조 제1항 (a))', body: '분석 쿠키(Google Analytics 4), GetYourGuide 파트너 스크립트 및 기타 비필수 쿠키. 쿠키 배너를 통해 동의하시며 언제든지 철회하실 수 있습니다.' },
      { strong: '동의(제6조 제1항 (a))', body: '뉴스레터 구독. 신청 양식 제출로 동의하시며 구독 해지 링크를 통해 언제든지 철회하실 수 있습니다.' },
      { strong: '정당한 이익(제6조 제1항 (f))', body: '브라우저의 localStorage에 귀하의 동의 선택 저장 및 사기 방지·보안 로그. 당사의 이익은 정상적으로 작동하는 웹사이트 운영이며, 귀하의 합리적 기대와 균형을 이룹니다.' },
      { strong: '정당한 이익(제6조 제1항 (f))', body: '제휴 링크 클릭 귀속. 당사의 이익은 콘텐츠를 통해 발생한 제휴 수수료를 받는 것이며 수집되는 데이터는 최소한(추천 출처)이고 제휴 링크를 클릭하지 않으시면 회피하실 수 있습니다.' },
      { strong: '정당한 이익(제6조 제1항 (f))', body: 'Umami를 이용한 쿠키 없는 방문자 통계(제4항). 당사의 이익은 어떤 페이지와 양식이 제대로 작동하는지 아는 것이며, Umami는 귀하의 기기에 아무것도 저장하지 않고 IP 주소도 보관하지 않습니다.' },
    ],
    s3Title: '3. 쿠키',
    s3Intro: '당사 웹사이트는 브라우징 경험 향상과 가명 처리된 분석 데이터 수집을 위해 쿠키를 사용합니다. 다음을 포함합니다:',
    s3Items: [
      { strong: '필수 저장 항목', body: '웹사이트의 정상 작동에 필요(쿠키가 아닌 브라우저의 localStorage에 저장되는 귀하의 동의 선택). 본 사이트는 귀하가 동의하시기 전에는 자체적으로 쿠키를 설정하지 않습니다.' },
      { strong: '분석 쿠키', body: 'Google Analytics 4가 방문자의 사이트 이용 방식을 이해하는 데 사용. 가명 처리되어 수집됩니다.' },
      { strong: 'GetYourGuide 쿠키', body: 'GetYourGuide 파트너 스크립트가 설정하며, 이 스크립트는 쿠키에 동의하신 후에만 불러옵니다. 액티비티 위젯의 노출 수와 클릭 수를 집계하고 예약을 사이트에 귀속시킵니다.' },
    ],
    s3Tail: (cookieLink) => <>분석 쿠키와 GetYourGuide 쿠키는 쿠키 배너를 통한 동의 후에만 설정됩니다. Umami 방문자 통계(제4항)는 쿠키를 사용하지 않습니다. 자세한 내용은 당사의 {cookieLink}을 참조하십시오.</>,
    s4Title: '4. Google Analytics 및 Umami',
    s4Body: '당사는 Consent Mode v2를 적용한 Google Analytics 4를 사용합니다. 쿠키를 거부하시면 분석 데이터는 수집되지 않습니다. 동의하시면 이용 데이터(조회한 페이지, 체류 시간, 기기 유형, 국가 및 도시 단위의 위치)가 Google로 전송됩니다. 이 데이터는 가명 처리된 정보입니다. 이름이나 이메일 주소처럼 직접 신원을 알 수 있는 정보는 전송하지 않지만, 쿠키의 임의 식별자와 IP 주소는 GDPR상 개인정보에 해당합니다.',
    s4Umami: '또한 당사는 Umami Cloud를 사용해 페이지 조회수, 일부 링크와 버튼의 클릭(예: 자매 사이트나 앱으로 연결되는 링크), 양식과 도구의 각 단계(예: 뉴스레터 양식이 표시되거나, 작성이 시작되거나, 제출된 경우)를 집계합니다. Umami는 쿠키를 사용하지 않고 귀하의 기기에 아무것도 저장하지 않으므로, 쿠키 동의 여부와 관계없이 작동합니다. 페이지 주소와 제목, 유입 사이트, 브라우저, 운영체제, 기기 유형, 화면 크기, 언어, 대략적인 위치(국가, 지역, 도시)를 기록합니다. IP 주소는 이 위치와 가명 처리된 방문 식별자를 계산하는 데에만 사용되며 저장되지 않습니다. 이 식별자는 매월 초에 바뀌는 해시값입니다. 이러한 이벤트에는 무엇을 클릭하거나 선택했는지와 어떤 단계인지(예: 열어 본 자매 사이트), 그리고 양식에서 더 진행할 수 없었을 경우 해당 항목 이름(예: "email")만 기록되며, 입력한 내용은 기록되지 않습니다.',
    s5Title: '5. 뉴스레터',
    s5Body: (unsub) => <>뉴스레터를 구독하시면 귀하의 이메일 주소는 Resend와 Supabase를 통해 안전하게 보관됩니다. 각 이메일의 링크 또는 당사의 {unsub}를 통해 언제든지 구독을 해지하실 수 있습니다.</>,
    s6Title: '6. 데이터 보관',
    s6Body: '분석 데이터는 Google Analytics에서 14개월간, Umami에서 최대 2년간 보관됩니다. 뉴스레터 이메일은 구독 해지 시까지 보관됩니다.',
    s7Title: '7. 제3자',
    s7Intro: '당사는 귀하의 개인정보를 판매하지 않습니다. 운영의 일환으로 다음 제3자 서비스가 데이터를 처리합니다:',
    s7Items: [
      'Google Analytics: 가명 처리된 이용 분석',
      'Umami: 쿠키를 사용하지 않는 방문자 통계 및 양식 단계 집계',
      'GetYourGuide: 액티비티 위젯 및 예약 귀속(쿠키 동의 후에만)',
      'Resend: 뉴스레터 이메일 발송',
      'Supabase: 백엔드 데이터베이스 서비스',
      'Cloudflare: 호스팅 및 CDN',
    ],
    s8Title: '8. 광고',
    s8Body1: (siteName) => `본 사이트는 제3자의 광고와 유료 파트너 게재를 표시합니다. 이는 "광고" 등의 라벨로 명확히 구분됩니다. 클릭하시면 자체 개인정보 처리방침을 가진 외부 사이트로 이동할 수 있습니다. ${siteName} 사이트는 외부 광고주의 데이터 처리 관행에 대해 책임지지 않습니다.`,
    s8aTitle: '8a. 국제 데이터 이전',
    s8aIntro: '당사가 이용하는 일부 제3자 서비스는 유럽경제지역(EEA) 외부, 주로 미국에 소재하거나 데이터를 이전합니다:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, 미국): EU–미국 데이터 프라이버시 프레임워크(DPF) 적용.' },
      { strong: 'Umami', body: '(Umami Software, Inc., 미국; 서버는 미국과 EU에 위치): 표준계약조항(SCC) 적용.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., 미국): EU–미국 데이터 프라이버시 프레임워크 및 표준계약조항(SCC) 적용.' },
      { strong: 'Resend', body: '(Resend Inc., 미국): 표준계약조항(SCC) 적용.' },
      { strong: 'Supabase', body: '(Supabase Inc., 미국, EU 지역 호스팅 가능): 표준계약조항(SCC) 적용.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, 독일): EEA 내.' },
    ],
    s8aTail: '각 경우에 이전은 적정성 결정, EU–미국 데이터 프라이버시 프레임워크 또는 유럽연합 집행위원회 승인 표준계약조항에 의해 보호됩니다. 해당 보호 조치의 사본은 당사에 문의하여 요청하실 수 있습니다.',
    s9Title: '9. GDPR에 따른 귀하의 권리',
    s9Intro: '당사는 핀란드에서 운영하며 유럽연합 방문자에게 서비스를 제공하므로 GDPR이 전면 적용됩니다. 귀하에게는 다음 권리가 있습니다:',
    s9Items: [
      { strong: '열람권(제15조)', body: '당사가 보유한 귀하의 개인정보 사본을 요청하실 수 있습니다.' },
      { strong: '정정권(제16조)', body: '부정확하거나 불완전한 데이터의 수정을 요청하실 수 있습니다.' },
      { strong: '삭제권 / "잊힐 권리"(제17조)', body: '우선하는 보관 사유가 없는 경우 데이터 삭제를 요청하실 수 있습니다.' },
      { strong: '처리 제한권(제18조)', body: '문제 해결 중에는 처리 일시 정지를 요청하실 수 있습니다.' },
      { strong: '데이터 이동권(제20조)', body: '구조화된 기계 판독 가능 형식으로 데이터를 받으실 수 있습니다.' },
      { strong: '반대권(제21조)', body: '직접 마케팅을 포함하여 정당한 이익에 근거한 처리에 반대하실 수 있습니다.' },
      { strong: '동의 철회권', body: '언제든지 철회하실 수 있으며, 철회 시점부터 효력이 발생합니다.' },
      { strong: '감독기관에 대한 불만 제기권(제77조)', body: '핀란드 개인정보 보호 옴부즈맨(Tietosuojavaltuutettu, tietosuoja.fi) 또는 EU 내 상시 거주지의 감독기관에 제기하실 수 있습니다.' },
    ],
    s9Tail: (email) => <>이 권리를 행사하시려면 {email} 주소로 연락하십시오. 한 달 이내에 답변드리겠습니다.</>,
    s10Title: '10. 자동화된 의사결정',
    s10Body: '당사는 GDPR 제22조의 의미에서 귀하에게 법적 또는 그에 준하는 중대한 영향을 미치는 자동화된 의사결정, 프로파일링 또는 기타 처리를 수행하지 않습니다.',
    s11Title: '11. 아동',
    s11Body: '본 사이트와 뉴스레터는 성인을 대상으로 합니다. 당사는 13세 미만 아동(핀란드 법률 및 GDPR의 디지털 서비스 연령 기준)으로부터 의도적으로 데이터를 수집하지 않습니다. 아동이 개인정보를 제공했다고 생각하시면 당사로 연락 주시면 삭제하겠습니다.',
    s12Title: '12. 본 정책의 변경',
    s12Body: '당사는 본 개인정보 처리방침을 수시로 업데이트할 수 있습니다. 상단의 "최종 업데이트" 날짜가 최신 개정을 반영합니다. 중대한 변경 사항은 홈페이지에 최소 14일간 표시됩니다.',
    backToHome: '← 홈으로 돌아가기',
    cookiePolicy: '쿠키 정책 →',
  },
  fr: {
    h1: 'Politique de Confidentialité',
    lastUpdated: 'Dernière mise à jour : octobre 2026',
    s1Title: '1. Responsable du traitement',
    s1Body: () => <>LaPeso Oy (n° 3309136-7), Finlande. Courriel : <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Données que nous collectons',
    s2Body: 'Nous collectons des données analytiques pseudonymes via Google Analytics 4 et des statistiques de visite sans cookies via Umami. Si vous vous inscrivez à notre newsletter, nous stockons votre adresse e-mail en toute sécurité. Nous ne collectons aucune autre information personnelle identifiable, sauf si vous nous contactez directement.',
    s2aTitle: '2a. Base légale du traitement (Art. 6 RGPD)',
    s2aIntro: 'Nous nous appuyons sur les bases légales suivantes pour chaque activité de traitement :',
    s2aItems: [
      { strong: 'Consentement (Art. 6(1)(a))', body: 'pour les cookies analytiques (Google Analytics 4), le script partenaire de GetYourGuide et autres cookies non essentiels. Vous donnez votre consentement via le bandeau de cookies et pouvez le retirer à tout moment.' },
      { strong: 'Consentement (Art. 6(1)(a))', body: 'pour l\'abonnement à la newsletter. Vous donnez votre consentement en soumettant le formulaire et pouvez le retirer à tout moment via le lien de désinscription.' },
      { strong: 'Intérêt légitime (Art. 6(1)(f))', body: 'pour l\'enregistrement de votre choix de consentement dans le localStorage de votre navigateur et pour les journaux de prévention de la fraude/sécurité. Notre intérêt est l\'exploitation d\'un site web fonctionnel ; cet intérêt est mis en balance avec vos attentes raisonnables.' },
      { strong: 'Intérêt légitime (Art. 6(1)(f))', body: 'pour l\'attribution des clics sur les liens d\'affiliation. Notre intérêt est de percevoir la commission éditoriale que nous avons gagnée ; les données collectées sont minimales (source de référence) et vous pouvez choisir de ne pas cliquer sur les liens d\'affiliation.' },
      { strong: 'Intérêt légitime (Art. 6(1)(f))', body: 'pour les statistiques de visite sans cookies avec Umami (section 4). Notre intérêt est de savoir quelles pages et quels formulaires fonctionnent ; Umami n\'enregistre rien sur votre appareil et ne conserve pas votre adresse IP.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Notre site utilise des cookies pour améliorer votre expérience de navigation et collecter des données analytiques pseudonymes. Cela comprend :',
    s3Items: [
      { strong: 'Stockage essentiel', body: 'nécessaire au bon fonctionnement du site (votre choix de consentement, enregistré dans le localStorage de votre navigateur et non dans un cookie). Le site lui-même ne dépose aucun cookie avant que vous les acceptiez.' },
      { strong: 'Cookies analytiques', body: 'utilisés par Google Analytics 4 pour comprendre l\'usage du site par les visiteurs. Collectés de manière pseudonyme.' },
      { strong: 'Cookies GetYourGuide', body: "déposés par le script partenaire de GetYourGuide, qui ne se charge qu'après votre acceptation des cookies. Ils comptent les affichages et les clics des widgets d'activités et attribuent les réservations au site." },
    ],
    s3Tail: (cookieLink) => <>Les cookies analytiques et les cookies GetYourGuide ne sont déposés qu'après votre consentement via le bandeau. Les statistiques de visite d'Umami (section 4) n'utilisent pas de cookies. Voir notre {cookieLink} pour plus de détails.</>,
    s4Title: '4. Google Analytics et Umami',
    s4Body: 'Nous utilisons Google Analytics 4 avec le Consent Mode v2. Si vous refusez les cookies, aucune donnée analytique n’est collectée. Si vous acceptez, des données d’usage (pages consultées, temps passé sur le site, type d’appareil et localisation au niveau du pays et de la ville) sont envoyées à Google. Ces données sont pseudonymes : nous n’envoyons ni nom, ni adresse e-mail, ni aucune autre donnée vous identifiant directement, mais l’identifiant aléatoire du cookie et votre adresse IP sont des données personnelles au sens du RGPD.',
    s4Umami: 'Nous utilisons aussi Umami Cloud pour compter les pages vues, les clics sur certains de nos liens et boutons (par exemple vers les autres sites de notre réseau ou notre application) et les étapes de nos formulaires et outils, par exemple lorsqu\'un formulaire de newsletter s\'affiche, est commencé ou est envoyé. Umami n\'utilise pas de cookies et n\'enregistre rien sur votre appareil ; il fonctionne donc que vous acceptiez les cookies ou non. Il enregistre l\'adresse et le titre de la page, le site d\'où vous venez, votre navigateur, votre système d\'exploitation, le type d\'appareil, la taille de l\'écran, la langue et la localisation approximative (pays, région et ville). Votre adresse IP sert uniquement à déterminer cette localisation et un identifiant de visite pseudonyme, et elle n\'est jamais conservée. L\'identifiant est un hachage qui change au début de chaque mois. Ces événements enregistrent seulement ce qui a été cliqué ou choisi et de quelle étape il s\'agit (par exemple le site du réseau que vous avez ouvert) et, si un formulaire vous bloque, le nom du champ (par exemple « email »), jamais ce que vous avez saisi.',
    s5Title: '5. Newsletter',
    s5Body: (unsub) => <>Si vous vous inscrivez à notre newsletter, votre adresse e-mail est stockée en toute sécurité via Resend et Supabase. Vous pouvez vous désinscrire à tout moment via le lien dans chaque e-mail ou via notre {unsub}.</>,
    s6Title: '6. Conservation des données',
    s6Body: 'Les données analytiques sont conservées 14 mois dans Google Analytics et jusqu\'à 2 ans dans Umami. Les adresses e-mail de la newsletter sont conservées jusqu\'à votre désinscription.',
    s7Title: '7. Tiers',
    s7Intro: 'Nous ne vendons pas vos données personnelles. Les services tiers suivants traitent des données dans le cadre de notre activité :',
    s7Items: [
      'Google Analytics : analyse d\'usage pseudonyme',
      'Umami : statistiques de visite sans cookies et comptage des étapes des formulaires',
      "GetYourGuide : widgets d'activités et attribution des réservations, uniquement après votre acceptation des cookies",
      'Resend : envoi de la newsletter par e-mail',
      'Supabase : services de base de données back-end',
      'Cloudflare : hébergement et CDN',
    ],
    s8Title: '8. Publicité',
    s8Body1: (siteName) => `Ce site affiche des publicités et des emplacements partenaires payants de tiers. Ils sont clairement identifiés, par exemple par la mention « Annonce », « Publicité » ou « Partenaire ». Cliquer dessus peut vous rediriger vers des sites externes ayant leur propre politique de confidentialité. ${siteName} n'est pas responsable des pratiques en matière de données des annonceurs externes.`,
    s8aTitle: '8a. Transferts internationaux de données',
    s8aIntro: 'Plusieurs services tiers que nous utilisons sont établis hors de l\'Espace économique européen (EEE) ou y transfèrent des données, le plus souvent vers les États-Unis :',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, États-Unis) : couvert par le cadre de protection des données UE–États-Unis (DPF).' },
      { strong: 'Umami', body: '(Umami Software, Inc., États-Unis ; serveurs aux États-Unis et dans l\'UE) : couvert par les clauses contractuelles types.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., États-Unis) : couvert par le cadre de protection des données UE–États-Unis et les clauses contractuelles types (CCT).' },
      { strong: 'Resend', body: '(Resend Inc., États-Unis) : couvert par les clauses contractuelles types.' },
      { strong: 'Supabase', body: '(Supabase Inc., États-Unis, hébergement région UE disponible) : couvert par les clauses contractuelles types.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Allemagne) : au sein de l\'EEE.' },
    ],
    s8aTail: 'Dans chaque cas, le transfert est protégé par une décision d\'adéquation, le cadre de protection des données UE–États-Unis ou les clauses contractuelles types approuvées par la Commission européenne. Vous pouvez nous demander une copie des garanties applicables.',
    s9Title: '9. Vos droits au titre du RGPD',
    s9Intro: 'Comme nous opérons depuis la Finlande et servons des visiteurs de l\'Union européenne, le RGPD s\'applique pleinement. Vous disposez des droits suivants :',
    s9Items: [
      { strong: 'Droit d\'accès (Art. 15)', body: 'demander une copie des données personnelles que nous détenons à votre sujet.' },
      { strong: 'Droit de rectification (Art. 16)', body: 'demander la correction de données inexactes ou incomplètes.' },
      { strong: 'Droit à l\'effacement / « droit à l\'oubli » (Art. 17)', body: 'demander la suppression de vos données lorsqu\'aucune raison prépondérante ne justifie leur conservation.' },
      { strong: 'Droit à la limitation du traitement (Art. 18)', body: 'demander la suspension du traitement le temps qu\'une question soit résolue.' },
      { strong: 'Droit à la portabilité (Art. 20)', body: 'recevoir vos données dans un format structuré et lisible par machine.' },
      { strong: 'Droit d\'opposition (Art. 21)', body: 'vous opposer au traitement fondé sur l\'intérêt légitime, y compris le marketing direct.' },
      { strong: 'Droit de retirer le consentement', body: 'à tout moment, avec effet à compter du retrait.' },
      { strong: 'Droit de déposer une plainte (Art. 77)', body: 'auprès de la médiatrice finlandaise de la protection des données (Tietosuojavaltuutettu, tietosuoja.fi), de l\'autorité de contrôle de votre résidence habituelle dans l\'UE, ou de la CNIL en France (cnil.fr).' },
    ],
    s9Tail: (email) => <>Pour exercer l'un de ces droits, contactez-nous à {email}. Nous répondrons dans un délai d'un mois.</>,
    s10Title: '10. Décision automatisée',
    s10Body: 'Nous ne procédons à aucune décision automatisée, à aucun profilage ni à aucun autre traitement produisant des effets juridiques ou similaires importants à votre égard au sens de l\'article 22 du RGPD.',
    s11Title: '11. Enfants',
    s11Body: 'Ce site et notre newsletter s\'adressent à des adultes. Nous ne collectons pas sciemment de données auprès d\'enfants de moins de 13 ans (seuil d\'âge pour les services numériques selon le droit finlandais et le RGPD). Si vous pensez qu\'un enfant nous a transmis des données, contactez-nous, nous les supprimerons.',
    s12Title: '12. Modifications de la présente politique',
    s12Body: 'Nous pouvons mettre à jour la présente Politique de Confidentialité ponctuellement. La date « Dernière mise à jour » en haut reflète la révision la plus récente. Les modifications substantielles seront signalées en page d\'accueil pendant au moins 14 jours.',
    backToHome: '← Retour à l\'accueil',
    cookiePolicy: 'Politique de Cookies →',
  },
  it: {
    h1: 'Informativa sulla Privacy',
    lastUpdated: 'Ultimo aggiornamento: ottobre 2026',
    s1Title: '1. Titolare del trattamento',
    s1Body: () => <>LaPeso Oy (ID 3309136-7), Finlandia. Email: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Dati che raccogliamo',
    s2Body: 'Raccogliamo dati analitici pseudonimi tramite Google Analytics 4 e statistiche di visita senza cookie tramite Umami. Se Lei si iscrive alla nostra newsletter, conserviamo il Suo indirizzo email in modo sicuro. Non raccogliamo altre informazioni personali identificabili, salvo Lei ci contatti direttamente.',
    s2aTitle: '2a. Base giuridica del trattamento (Art. 6 GDPR)',
    s2aIntro: 'Ci basiamo sulle seguenti basi giuridiche per ciascuna attività di trattamento:',
    s2aItems: [
      { strong: 'Consenso (Art. 6(1)(a))', body: 'per i cookie analitici (Google Analytics 4), lo script partner di GetYourGuide e altri cookie non essenziali. Lei presta il consenso tramite il banner dei cookie e può ritirarlo in qualsiasi momento.' },
      { strong: 'Consenso (Art. 6(1)(a))', body: 'per l\'iscrizione alla newsletter. Lei presta il consenso inviando il modulo di iscrizione e può ritirarlo in qualsiasi momento tramite il link di disiscrizione.' },
      { strong: 'Legittimo interesse (Art. 6(1)(f))', body: 'per la memorizzazione della Sua scelta di consenso nel localStorage del Suo browser e per i registri di prevenzione frodi/sicurezza. Il nostro interesse è l\'esercizio di un sito web funzionante; tale interesse è bilanciato con le Sue ragionevoli aspettative.' },
      { strong: 'Legittimo interesse (Art. 6(1)(f))', body: 'per l\'attribuzione dei clic sui link di affiliazione. Il nostro interesse è ricevere la commissione editoriale guadagnata; i dati raccolti sono minimi (fonte di riferimento) e Lei può scegliere di non cliccare sui link di affiliazione.' },
      { strong: 'Legittimo interesse (Art. 6(1)(f))', body: 'per le statistiche di visita senza cookie con Umami (sezione 4). Il nostro interesse è sapere quali pagine e moduli funzionano; Umami non salva nulla sul Suo dispositivo e non conserva il Suo indirizzo IP.' },
    ],
    s3Title: '3. Cookie',
    s3Intro: 'Il nostro sito utilizza cookie per migliorare la Sua esperienza di navigazione e raccogliere dati analitici pseudonimi. Tra questi:',
    s3Items: [
      { strong: 'Archiviazione essenziale', body: 'necessaria al corretto funzionamento del sito (la Sua scelta di consenso, salvata nel localStorage del Suo browser e non in un cookie). Il sito stesso non imposta alcun cookie prima che Lei li accetti.' },
      { strong: 'Cookie analitici', body: 'utilizzati da Google Analytics 4 per comprendere come i visitatori interagiscono con il sito. Raccolti in forma pseudonima.' },
      { strong: 'Cookie di GetYourGuide', body: 'impostati dallo script partner di GetYourGuide, che si carica solo dopo che Lei ha accettato i cookie. Contano le visualizzazioni e i clic dei widget delle attività e attribuiscono le prenotazioni al sito.' },
    ],
    s3Tail: (cookieLink) => <>I cookie analitici e quelli di GetYourGuide vengono impostati solo dopo il Suo consenso tramite il banner. Le statistiche di visita di Umami (sezione 4) non usano cookie. Per dettagli completi, consulti la nostra {cookieLink}.</>,
    s4Title: '4. Google Analytics e Umami',
    s4Body: 'Utilizziamo Google Analytics 4 con Consent Mode v2. Se Lei rifiuta i cookie, non viene raccolto alcun dato analitico. Se accetta, a Google vengono inviati dati di utilizzo (pagine visitate, tempo di permanenza, tipo di dispositivo e posizione a livello di paese e città). I dati sono pseudonimi: non inviamo il Suo nome, l’indirizzo e-mail né altri dati che La identifichino direttamente, ma l’identificatore casuale del cookie e il Suo indirizzo IP sono dati personali ai sensi del GDPR.',
    s4Umami: 'Utilizziamo inoltre Umami Cloud per contare le visualizzazioni di pagina, i clic su alcuni dei nostri link e pulsanti (ad esempio verso i nostri siti gemelli o la nostra app) e i passaggi dei nostri moduli e strumenti, ad esempio quando un modulo della newsletter viene mostrato, iniziato o inviato. Umami non usa cookie e non salva nulla sul Suo dispositivo, quindi funziona sia che Lei accetti i cookie sia che non li accetti. Registra indirizzo e titolo della pagina, il sito da cui proviene, il browser, il sistema operativo, il tipo di dispositivo, le dimensioni dello schermo, la lingua e la posizione approssimativa (paese, regione e città). Il Suo indirizzo IP viene usato solo per ricavare tale posizione e un identificativo pseudonimo della visita, e non viene mai memorizzato. L\'identificativo è un hash che cambia all\'inizio di ogni mese. Questi eventi registrano solo che cosa è stato cliccato o scelto e di quale passaggio si tratta (ad esempio il sito gemello che ha aperto) e, se un modulo La blocca, il nome del campo (ad esempio «email»), mai ciò che ha scritto.',
    s5Title: '5. Newsletter',
    s5Body: (unsub) => <>Se Lei si iscrive alla nostra newsletter, il Suo indirizzo email viene conservato in modo sicuro tramite Resend e Supabase. Può disiscriversi in qualsiasi momento tramite il link presente in ogni email o tramite la nostra {unsub}.</>,
    s6Title: '6. Conservazione dei dati',
    s6Body: 'I dati analitici sono conservati per 14 mesi in Google Analytics e fino a 2 anni in Umami. Gli indirizzi email della newsletter sono conservati fino alla disiscrizione.',
    s7Title: '7. Terzi',
    s7Intro: 'Non vendiamo i Suoi dati personali. I seguenti servizi di terze parti trattano dati nell’ambito delle nostre operazioni:',
    s7Items: [
      'Google Analytics: analisi pseudonima dell\'utilizzo',
      'Umami: statistiche di visita senza cookie e conteggio dei passaggi dei moduli',
      'GetYourGuide: widget delle attività e attribuzione delle prenotazioni, solo dopo che Lei ha accettato i cookie',
      'Resend: invio della newsletter via email',
      'Supabase: servizi di database back-end',
      'Cloudflare: hosting e CDN',
    ],
    s8Title: '8. Pubblicità',
    s8Body1: (siteName) => `Questo sito mostra annunci di terze parti e spazi a pagamento dei partner. Sono chiaramente contrassegnati, ad esempio con l'etichetta "Annuncio", "Pubblicità" o "Partner". Facendo clic su di essi, Lei può essere reindirizzato a siti esterni con proprie informative sulla privacy. ${siteName} non è responsabile delle pratiche sui dati degli inserzionisti esterni.`,
    s8aTitle: '8a. Trasferimenti internazionali di dati',
    s8aIntro: 'Diversi servizi terzi che utilizziamo hanno sede o trasferiscono dati fuori dallo Spazio Economico Europeo (SEE), per lo più negli Stati Uniti:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, USA): coperto dall\'EU–US Data Privacy Framework (DPF).' },
      { strong: 'Umami', body: '(Umami Software, Inc., USA; server negli USA e nell\'UE): coperto dalle clausole contrattuali tipo.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., USA): coperto dall\'EU–US Data Privacy Framework e dalle clausole contrattuali tipo (SCC).' },
      { strong: 'Resend', body: '(Resend Inc., USA): coperto dalle clausole contrattuali tipo.' },
      { strong: 'Supabase', body: '(Supabase Inc., USA, con hosting in regione UE disponibile): coperto dalle clausole contrattuali tipo.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Germania): all\'interno del SEE.' },
    ],
    s8aTail: 'In ogni caso, il trasferimento è protetto da una decisione di adeguatezza, dall\'EU–US Data Privacy Framework o da clausole contrattuali tipo approvate dalla Commissione europea. Può richiedere una copia delle garanzie applicabili contattandoci.',
    s9Title: '9. I Suoi diritti ai sensi del GDPR',
    s9Intro: 'Poiché operiamo dalla Finlandia e serviamo visitatori dell\'Unione europea, il GDPR si applica integralmente. Lei ha i seguenti diritti:',
    s9Items: [
      { strong: 'Diritto di accesso (Art. 15)', body: 'richiedere una copia dei dati personali che La riguardano.' },
      { strong: 'Diritto di rettifica (Art. 16)', body: 'chiedere la correzione di dati inesatti o incompleti.' },
      { strong: 'Diritto alla cancellazione / "diritto all\'oblio" (Art. 17)', body: 'chiedere la cancellazione dei Suoi dati quando non vi sia un motivo prevalente per conservarli.' },
      { strong: 'Diritto alla limitazione del trattamento (Art. 18)', body: 'chiedere la sospensione del trattamento in attesa di chiarimenti.' },
      { strong: 'Diritto alla portabilità (Art. 20)', body: 'ricevere i Suoi dati in un formato strutturato e leggibile da macchina.' },
      { strong: 'Diritto di opposizione (Art. 21)', body: 'opporsi al trattamento basato sul legittimo interesse, incluso il marketing diretto.' },
      { strong: 'Diritto di revocare il consenso', body: 'in qualsiasi momento, con effetto dal momento della revoca.' },
      { strong: 'Diritto di reclamo (Art. 77)', body: 'al Garante finlandese per la protezione dei dati (Tietosuojavaltuutettu, tietosuoja.fi), all\'autorità di controllo della Sua residenza abituale nell\'UE, oppure al Garante per la protezione dei dati personali in Italia (garanteprivacy.it).' },
    ],
    s9Tail: (email) => <>Per esercitare uno qualsiasi di questi diritti, ci contatti a {email}. Risponderemo entro un mese.</>,
    s10Title: '10. Decisioni automatizzate',
    s10Body: 'Non effettuiamo decisioni automatizzate, profilazione o altri trattamenti che producano effetti giuridici o similmente significativi nei Suoi confronti, ai sensi dell\'art. 22 GDPR.',
    s11Title: '11. Minori',
    s11Body: 'Questo sito e la nostra newsletter sono destinati a persone adulte. Non raccogliamo consapevolmente dati da minori di 13 anni (soglia di età per i servizi digitali secondo la legge finlandese e il GDPR). Se ritiene che un minore ci abbia fornito dati personali, ci contatti e provvederemo alla cancellazione.',
    s12Title: '12. Modifiche alla presente informativa',
    s12Body: 'Possiamo aggiornare la presente Informativa sulla Privacy periodicamente. La data di "Ultimo aggiornamento" in alto riflette la revisione più recente. Le modifiche sostanziali saranno segnalate nella home page per almeno 14 giorni.',
    backToHome: '← Torna alla home',
    cookiePolicy: 'Informativa sui Cookie →',
  },
  nl: {
    h1: 'Privacybeleid',
    lastUpdated: 'Laatst bijgewerkt: oktober 2026',
    s1Title: '1. Verwerkingsverantwoordelijke',
    s1Body: () => <>LaPeso Oy (ondernemingsnummer 3309136-7), Finland. E-mail: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Welke gegevens wij verzamelen',
    s2Body: 'Wij verzamelen gepseudonimiseerde analysegegevens via Google Analytics 4 en bezoekersstatistieken zonder cookies via Umami. Als u zich abonneert op onze nieuwsbrief, slaan wij uw e-mailadres veilig op. Wij verzamelen geen andere identificeerbare persoonsgegevens, tenzij u rechtstreeks contact met ons opneemt.',
    s2aTitle: '2a. Rechtsgrondslag voor verwerking (Art. 6 AVG)',
    s2aIntro: 'Wij baseren ons op de volgende rechtsgrondslagen voor elke verwerkingsactiviteit:',
    s2aItems: [
      { strong: 'Toestemming (Art. 6(1)(a))', body: 'voor analysecookies (Google Analytics 4), het partnerscript van GetYourGuide en andere niet-essentiële cookies. U geeft toestemming via de cookiebanner en kunt deze op elk moment intrekken.' },
      { strong: 'Toestemming (Art. 6(1)(a))', body: 'voor het abonnement op de nieuwsbrief. U geeft toestemming door het inschrijfformulier in te dienen en kunt deze op elk moment intrekken via de afmeldlink.' },
      { strong: 'Gerechtvaardigd belang (Art. 6(1)(f))', body: 'voor de opslag van uw toestemmingskeuze in de localStorage van uw browser en voor fraudepreventie/beveiligingslogs. Ons belang is het exploiteren van een werkende website; dit belang is afgewogen tegen uw redelijke verwachtingen.' },
      { strong: 'Gerechtvaardigd belang (Art. 6(1)(f))', body: 'voor de toewijzing van klikken op affiliatelinks. Ons belang is het ontvangen van de redactioneel verdiende commissie; de verzamelde gegevens zijn minimaal (verwijzingsbron) en u kunt ervoor kiezen geen affiliatelinks aan te klikken.' },
      { strong: 'Gerechtvaardigd belang (Art. 6(1)(f))', body: 'voor bezoekersstatistieken zonder cookies met Umami (sectie 4). Ons belang is weten welke pagina\'s en formulieren werken; Umami slaat niets op uw apparaat op en bewaart uw IP-adres niet.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Onze website gebruikt cookies om uw surfervaring te verbeteren en gepseudonimiseerde analysegegevens te verzamelen. Deze omvatten:',
    s3Items: [
      { strong: 'Essentiële opslag', body: 'vereist voor de juiste werking van de website (uw toestemmingskeuze, opgeslagen in de localStorage van uw browser en niet in een cookie). De site zelf plaatst geen cookies voordat u ze accepteert.' },
      { strong: 'Analysecookies', body: 'gebruikt door Google Analytics 4 om te begrijpen hoe bezoekers onze site gebruiken. Gepseudonimiseerd verzameld.' },
      { strong: 'GetYourGuide-cookies', body: 'geplaatst door het partnerscript van GetYourGuide, dat pas wordt geladen nadat u cookies heeft geaccepteerd. Ze tellen weergaven van en klikken op de activiteitenwidgets en wijzen boekingen toe aan de site.' },
    ],
    s3Tail: (cookieLink) => <>Analysecookies en GetYourGuide-cookies worden pas geplaatst nadat u toestemming heeft gegeven via de cookiebanner. De bezoekersstatistieken van Umami (sectie 4) gebruiken geen cookies. Zie ons {cookieLink} voor volledige details.</>,
    s4Title: '4. Google Analytics en Umami',
    s4Body: 'We gebruiken Google Analytics 4 met Consent Mode v2. Als u cookies weigert, worden er geen analysegegevens verzameld. Als u accepteert, worden gebruiksgegevens (bekeken pagina’s, tijd op de site, apparaattype en locatie op land- en stadsniveau) naar Google gestuurd. De gegevens zijn gepseudonimiseerd: we sturen geen naam, e-mailadres of andere direct identificerende gegevens, maar de willekeurige cookie-identificatie en uw IP-adres zijn persoonsgegevens volgens de AVG.',
    s4Umami: 'Daarnaast gebruiken wij Umami Cloud om paginaweergaven, klikken op sommige van onze links en knoppen (bijvoorbeeld naar onze zustersites of onze app) en de stappen van onze formulieren en hulpmiddelen te tellen, bijvoorbeeld wanneer een nieuwsbriefformulier wordt getoond, ingevuld of verzonden. Umami gebruikt geen cookies en slaat niets op uw apparaat op, dus het werkt ongeacht of u cookies accepteert. Het registreert het adres en de titel van de pagina, de site waar u vandaan komt, uw browser, besturingssysteem, apparaattype, schermformaat, taal en globale locatie (land, regio en stad). Uw IP-adres wordt alleen gebruikt om die locatie en een gepseudonimiseerde bezoek-ID te berekenen en wordt nooit opgeslagen. De ID is een hash die aan het begin van elke maand verandert. Deze gebeurtenissen registreren alleen waarop is geklikt of wat is gekozen en om welke stap het gaat (bijvoorbeeld de zustersite die u hebt geopend) en, als een formulier u tegenhoudt, de naam van het veld (bijvoorbeeld "email"), nooit wat u hebt ingevuld.',
    s5Title: '5. Nieuwsbrief',
    s5Body: (unsub) => <>Als u zich abonneert op onze nieuwsbrief, wordt uw e-mailadres veilig opgeslagen via Resend en Supabase. U kunt zich op elk moment afmelden via de link in elke e-mail of via onze {unsub}.</>,
    s6Title: '6. Bewaartermijn',
    s6Body: 'Analysegegevens worden 14 maanden bewaard in Google Analytics en maximaal 2 jaar in Umami. Nieuwsbrief-e-mailadressen worden bewaard totdat u zich afmeldt.',
    s7Title: '7. Derden',
    s7Intro: 'Wij verkopen uw persoonsgegevens niet. De volgende externe diensten verwerken gegevens als onderdeel van onze activiteiten:',
    s7Items: [
      'Google Analytics: gepseudonimiseerde gebruiksanalyse',
      'Umami: bezoekersstatistieken zonder cookies en telling van formulierstappen',
      'GetYourGuide: activiteitenwidgets en toewijzing van boekingen, pas nadat u cookies heeft geaccepteerd',
      'Resend: verzending van de nieuwsbrief via e-mail',
      'Supabase: back-end databasediensten',
      'Cloudflare: hosting en CDN',
    ],
    s8Title: '8. Advertenties',
    s8Body1: (siteName) => `Deze site toont advertenties en betaalde partnerplaatsingen van derden. Ze zijn duidelijk aangeduid, bijvoorbeeld met de markering "Advertentie" of "Partner". Als u erop klikt, kunt u worden doorverwezen naar externe websites met hun eigen privacybeleid. ${siteName} is niet verantwoordelijk voor de gegevenspraktijken van externe adverteerders.`,
    s8aTitle: '8a. Internationale gegevensoverdrachten',
    s8aIntro: 'Verschillende externe diensten die wij gebruiken zijn gevestigd in of dragen gegevens over naar landen buiten de Europese Economische Ruimte (EER), meestal de Verenigde Staten:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, VS): gedekt door het EU–US Data Privacy Framework (DPF).' },
      { strong: 'Umami', body: '(Umami Software, Inc., VS; servers in de VS en de EU): gedekt door de standaardcontractbepalingen.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., VS): gedekt door het EU–US Data Privacy Framework en de standaardcontractbepalingen (SCC).' },
      { strong: 'Resend', body: '(Resend Inc., VS): gedekt door de standaardcontractbepalingen.' },
      { strong: 'Supabase', body: '(Supabase Inc., VS, met EU-regio-hosting beschikbaar): gedekt door de standaardcontractbepalingen.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Duitsland): binnen de EER.' },
    ],
    s8aTail: 'In elk geval wordt de overdracht beschermd door een adequaatheidsbesluit, het EU–US Data Privacy Framework of door de Europese Commissie goedgekeurde standaardcontractbepalingen. U kunt een kopie van de relevante waarborgen opvragen door contact met ons op te nemen.',
    s9Title: '9. Uw rechten onder de AVG',
    s9Intro: 'Omdat wij vanuit Finland opereren en bezoekers uit de Europese Unie bedienen, is de AVG (GDPR) volledig van toepassing. U heeft de volgende rechten:',
    s9Items: [
      { strong: 'Recht op inzage (Art. 15)', body: 'een kopie opvragen van de persoonsgegevens die wij over u bewaren.' },
      { strong: 'Recht op rectificatie (Art. 16)', body: 'ons vragen onjuiste of onvolledige gegevens te corrigeren.' },
      { strong: 'Recht op wissen / "recht om vergeten te worden" (Art. 17)', body: 'ons vragen uw gegevens te wissen wanneer er geen zwaarwegende reden is om deze te bewaren.' },
      { strong: 'Recht op beperking van de verwerking (Art. 18)', body: 'ons vragen de verwerking te pauzeren terwijl een kwestie wordt opgelost.' },
      { strong: 'Recht op gegevensoverdraagbaarheid (Art. 20)', body: 'uw gegevens ontvangen in een gestructureerd, machineleesbaar formaat.' },
      { strong: 'Recht van bezwaar (Art. 21)', body: 'bezwaar maken tegen verwerking op basis van gerechtvaardigd belang, inclusief direct marketing.' },
      { strong: 'Recht om toestemming in te trekken', body: 'op elk moment, met ingang van het moment van intrekking.' },
      { strong: 'Recht om een klacht in te dienen (Art. 77)', body: 'bij de Finse Autoriteit Persoonsgegevens (Tietosuojavaltuutettu) op tietosuoja.fi, bij de toezichthouder van uw gebruikelijke verblijfplaats in de EU, of bij de Autoriteit Persoonsgegevens in Nederland (autoriteitpersoonsgegevens.nl).' },
    ],
    s9Tail: (email) => <>Om een van deze rechten uit te oefenen, neemt u contact met ons op via {email}. Wij reageren binnen één maand.</>,
    s10Title: '10. Geautomatiseerde besluitvorming',
    s10Body: 'Wij verrichten geen geautomatiseerde besluitvorming, profilering of enige andere verwerking die rechtsgevolgen of soortgelijk significante gevolgen voor u heeft in de zin van artikel 22 AVG.',
    s11Title: '11. Kinderen',
    s11Body: 'Deze site en onze nieuwsbrief zijn bedoeld voor volwassenen. Wij verzamelen niet bewust gegevens van kinderen jonger dan 13 jaar (leeftijdsgrens voor digitale diensten volgens de Finse wet en de AVG). Als u denkt dat een kind ons persoonsgegevens heeft verstrekt, neem dan contact met ons op en wij verwijderen deze.',
    s12Title: '12. Wijzigingen in dit beleid',
    s12Body: 'Wij kunnen dit privacybeleid van tijd tot tijd bijwerken. De datum "Laatst bijgewerkt" bovenaan weerspiegelt de meest recente herziening. Belangrijke wijzigingen worden ten minste 14 dagen op de homepage gemarkeerd.',
    backToHome: '← Terug naar home',
    cookiePolicy: 'Cookiebeleid →',
  },
  sv: {
    h1: 'Integritetspolicy',
    lastUpdated: 'Senast uppdaterad: oktober 2026',
    s1Title: '1. Personuppgiftsansvarig',
    s1Body: () => <>LaPeso Oy (FO-nummer 3309136-7), Finland. E-post: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Uppgifter vi samlar in',
    s2Body: 'Vi samlar in pseudonym analysdata via Google Analytics 4 och besöksstatistik utan cookies via Umami. Om du prenumererar på vårt nyhetsbrev lagrar vi din e-postadress säkert. Vi samlar inte in några andra personuppgifter som kan identifiera dig, om du inte kontaktar oss direkt.',
    s2aTitle: '2a. Rättslig grund för behandling (GDPR artikel 6)',
    s2aIntro: 'Vi grundar varje behandlingsaktivitet på följande rättsliga grunder:',
    s2aItems: [
      { strong: 'Samtycke (artikel 6.1 a)', body: 'för analyscookies (Google Analytics 4), GetYourGuides partnerskript och andra icke nödvändiga cookies. Du lämnar samtycke via cookiebannern och kan när som helst återkalla det.' },
      { strong: 'Samtycke (artikel 6.1 a)', body: 'för prenumeration på nyhetsbrevet. Du lämnar samtycke genom att skicka in anmälningsformuläret och kan när som helst återkalla det via avregistreringslänken.' },
      { strong: 'Berättigat intresse (artikel 6.1 f)', body: 'för lagring av ditt samtyckesval i webbläsarens localStorage samt för bedrägeriförebyggande och säkerhetsloggar. Vårt intresse är att driva en fungerande webbplats, avvägt mot dina rimliga förväntningar.' },
      { strong: 'Berättigat intresse (artikel 6.1 f)', body: 'för attribution av klick på affiliatelänkar. Vårt intresse är att få den provision vi redaktionellt har tjänat in; uppgifterna som samlas in är minimala (hänvisningskälla) och du kan avstå genom att låta bli att klicka på affiliatelänkar.' },
      { strong: 'Berättigat intresse (artikel 6.1 f)', body: 'för besöksstatistik utan cookies med Umami (avsnitt 4). Vårt intresse är att veta vilka sidor och formulär som fungerar; Umami sparar ingenting på din enhet och behåller inte din IP-adress.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Vår webbplats använder cookies för att förbättra din surfupplevelse och samla in pseudonym analysdata. Dessa omfattar:',
    s3Items: [
      { strong: 'Nödvändig lagring', body: 'krävs för att webbplatsen ska fungera korrekt (ditt samtyckesval, som sparas i webbläsarens localStorage och inte i en cookie). Webbplatsen själv placerar inga cookies innan du har accepterat dem.' },
      { strong: 'Statistik-/analyscookies', body: 'används av Google Analytics 4 för att förstå hur besökare interagerar med vår webbplats. Samlas in pseudonymt.' },
      { strong: 'GetYourGuide-cookies', body: 'placeras av GetYourGuides partnerskript, som laddas först när du accepterar cookies. De räknar visningar av och klick på aktivitetswidgetarna och kopplar bokningar till webbplatsen.' },
    ],
    s3Tail: (cookieLink) => <>Analyscookies och GetYourGuide-cookies placeras endast efter att du gett samtycke via cookiebannern. Umamis besöksstatistik (avsnitt 4) använder inga cookies. Se vår {cookieLink} för fullständig information.</>,
    s4Title: '4. Google Analytics och Umami',
    s4Body: 'Vi använder Google Analytics 4 med Consent Mode v2. Om du avböjer cookies samlas ingen analysdata in. Om du accepterar skickas användningsdata (besökta sidor, tid på webbplatsen, enhetstyp och plats på land- och stadsnivå) till Google. Uppgifterna är pseudonyma: vi skickar inte namn, e-postadress eller andra direkt identifierande uppgifter, men cookiens slumpmässiga identifierare och din IP-adress är personuppgifter enligt GDPR.',
    s4Umami: 'Vi använder också Umami Cloud för att räkna sidvisningar, klick på vissa av våra länkar och knappar (till exempel till våra systersajter eller vår app) och stegen i våra formulär och verktyg, till exempel när ett nyhetsbrevsformulär visas, påbörjas eller skickas. Umami använder inga cookies och sparar ingenting på din enhet, så det fungerar oavsett om du godkänner cookies eller inte. Det registrerar sidans adress och titel, webbplatsen du kom från, din webbläsare, ditt operativsystem, enhetstyp, skärmstorlek, språk och ungefärlig plats (land, region och stad). Din IP-adress används bara för att räkna fram platsen och en pseudonym besöksidentifierare och sparas aldrig. Identifieraren är en hash som byts i början av varje månad. Dessa händelser registrerar bara vad som klickades på eller valdes och vilket steg det gäller (till exempel systersajten du öppnade) och, om ett formulär stoppar dig, fältets namn (till exempel "email"), aldrig det du har skrivit.',
    s5Title: '5. Nyhetsbrev',
    s5Body: (unsub) => <>Om du prenumererar på vårt nyhetsbrev lagras din e-postadress säkert via Resend och Supabase. Du kan avregistrera dig när som helst med länken i varje e-postmeddelande eller via vår {unsub}.</>,
    s6Title: '6. Lagringstid',
    s6Body: 'Analysdata sparas i 14 månader i Google Analytics och i högst 2 år i Umami. E-postadresser till nyhetsbrevet sparas tills du avregistrerar dig.',
    s7Title: '7. Tredje part',
    s7Intro: 'Vi säljer inte dina personuppgifter. Följande tredjepartstjänster behandlar uppgifter som en del av vår verksamhet:',
    s7Items: [
      'Google Analytics: pseudonym användningsanalys',
      'Umami: besöksstatistik utan cookies och räkning av formulärsteg',
      'GetYourGuide: aktivitetswidgetar och koppling av bokningar, först när du accepterar cookies',
      'Resend: utskick av nyhetsbrev',
      'Supabase: databastjänster i backend',
      'Cloudflare: hosting och CDN',
    ],
    s8Title: '8. Annonsering',
    s8Body1: (siteName) => `Den här webbplatsen visar annonser och betalda partnerplaceringar från tredje part. De är tydligt märkta, till exempel med etiketten "Annons" eller "Partner". Om du klickar på dem kan du hamna på externa webbplatser med egna integritetspolicyer. ${siteName} ansvarar inte för externa annonsörers hantering av uppgifter.`,
    s8aTitle: '8a. Internationella dataöverföringar',
    s8aIntro: 'Flera av de tredjepartstjänster vi använder har sitt säte i, eller överför uppgifter till, länder utanför Europeiska ekonomiska samarbetsområdet (EES), oftast USA:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, USA): omfattas av EU–US Data Privacy Framework (DPF).' },
      { strong: 'Umami', body: '(Umami Software, Inc., USA; servrar i USA och EU): omfattas av standardavtalsklausuler.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., USA): omfattas av EU–US Data Privacy Framework och standardavtalsklausuler (SCC).' },
      { strong: 'Resend', body: '(Resend Inc., USA): omfattas av standardavtalsklausuler.' },
      { strong: 'Supabase', body: '(Supabase Inc., USA, med EU-regionshosting tillgänglig): omfattas av standardavtalsklausuler.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Tyskland): inom EES.' },
    ],
    s8aTail: 'I varje enskilt fall skyddas överföringen av ett beslut om adekvat skyddsnivå, EU–US Data Privacy Framework eller standardavtalsklausuler godkända av Europeiska kommissionen. Du kan begära en kopia av de relevanta skyddsåtgärderna genom att kontakta oss.',
    s9Title: '9. Dina rättigheter enligt GDPR',
    s9Intro: 'Eftersom vi verkar från Finland och betjänar besökare från Europeiska unionen gäller dataskyddsförordningen (GDPR) fullt ut. Du har följande rättigheter:',
    s9Items: [
      { strong: 'Rätt till tillgång (artikel 15)', body: 'begära en kopia av de personuppgifter vi har om dig.' },
      { strong: 'Rätt till rättelse (artikel 16)', body: 'be oss rätta felaktiga eller ofullständiga uppgifter.' },
      { strong: 'Rätt till radering / "rätten att bli bortglömd" (artikel 17)', body: 'be oss radera dina uppgifter när det inte finns något överordnat skäl att behålla dem.' },
      { strong: 'Rätt till begränsning av behandling (artikel 18)', body: 'be oss pausa behandlingen medan en fråga utreds.' },
      { strong: 'Rätt till dataportabilitet (artikel 20)', body: 'få dina uppgifter i ett strukturerat, maskinläsbart format.' },
      { strong: 'Rätt att invända (artikel 21)', body: 'invända mot behandling som grundas på berättigat intresse, inklusive direktmarknadsföring.' },
      { strong: 'Rätt att återkalla samtycke', body: 'när som helst, med verkan från och med återkallandet.' },
      { strong: 'Rätt att lämna in klagomål (artikel 77)', body: 'till dataombudsmannen i Finland (Tietosuojavaltuutettu) på tietosuoja.fi, eller till tillsynsmyndigheten där du stadigvarande bor inom EU.' },
    ],
    s9Tail: (email) => <>För att utöva någon av dessa rättigheter, kontakta oss på {email}. Vi svarar inom en månad.</>,
    s10Title: '10. Automatiserat beslutsfattande',
    s10Body: 'Vi utför inte automatiserat beslutsfattande, profilering eller någon annan behandling som ger rättsliga eller liknande betydande effekter för dig i den mening som avses i artikel 22 i GDPR.',
    s11Title: '11. Barn',
    s11Body: 'Den här webbplatsen och vårt nyhetsbrev riktar sig till vuxna. Vi samlar inte medvetet in uppgifter från barn under 13 år (åldersgränsen för digitala tjänster enligt finsk lag och GDPR). Om du tror att ett barn har lämnat personuppgifter till oss, kontakta oss så raderar vi dem.',
    s12Title: '12. Ändringar av denna policy',
    s12Body: 'Vi kan uppdatera denna integritetspolicy då och då. Datumet "Senast uppdaterad" högst upp återspeglar den senaste revideringen. Väsentliga ändringar flaggas på startsidan i minst 14 dagar.',
    backToHome: '← Tillbaka till startsidan',
    cookiePolicy: 'Cookiepolicy →',
  },
};

export default function PrivacyContent({
  lastUpdated: lastUpdatedOverride,
  siteName = 'LaplandVibes',
  lang = 'en',
  sessionRecording = false,
  variant = 'travel',
  flightSearch = false,
}: PrivacyContentProps = {}) {
  const base = COPY[lang] ?? COPY.en;
  const kumppanit = variant === 'shop' ? SHOP_PRIVACY : TRAVEL_PRIVACY;
  const k = kumppanit[lang] ?? kumppanit.en;
  /* Kumppanirivit ovat haravointimerkin alla tiedoston lopussa, koska ne riippuvat variantista: COPYssa ne päätyivät jokaisen sivuston
     staattiseen HTML:ään (storen tietosuojasivu nimesi matkailukumppanit, mitattu 6.10.2026). Ne palaavat tässä
     alkuperäisille paikoilleen, joten matkailusivuston valmis sivu on sama kuin ennen siirtoa. */
  const t = {
    ...base,
    s3Items: [...base.s3Items.slice(0, 2), k.s3Affiliate, ...base.s3Items.slice(2)],
    s7Items: [...base.s7Items.slice(0, 2), k.s7Affiliate, ...base.s7Items.slice(2)],
    s8Body2: k.s8Body2,
    s8aItems: [...base.s8aItems.slice(0, 5), k.s8aAffiliate, ...base.s8aItems.slice(5)],
  };
  const rec = SESSION_RECORDING[lang] ?? SESSION_RECORDING.en;
  /* Label/description separator. ja + zh-CN take the fullwidth colon with no space; fr puts a no-break
     space before the colon, as every fr string in this file does ("Durée : 1 an"); ko uses the halfwidth one. */
  const cjk = lang === 'ja' || lang === 'zh-CN';
  const sep = cjk ? '：' : lang === 'fr' ? '\u00a0:' : ':';
  const gap = cjk ? '' : ' ';
  const email = <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a>;
  const cookieLink = <Link to={localePath('/cookie-policy', lang)} className="text-vibe-pink">{
    lang === 'fi' ? 'evästekäytännöstämme'
    : lang === 'de' ? 'unserer Cookie-Richtlinie'
    : lang === 'ja' ? 'クッキーポリシー'
    : lang === 'es' ? 'Política de Cookies'
    : lang === 'pt-BR' ? 'Política de Cookies'
    : lang === 'zh-CN' ? 'Cookie 政策'
    : lang === 'ko' ? '쿠키 정책'
    : lang === 'fr' ? 'Politique de Cookies'
    : lang === 'it' ? 'Informativa sui Cookie'
    : lang === 'nl' ? 'Cookiebeleid'
    : lang === 'sv' ? 'cookiepolicy'
    : 'Cookie Policy'
  }</Link>;
  const unsubLink = <a href={hubUnsubscribeUrl(lang)} target="_blank" rel="noopener" className="text-vibe-pink">{
    lang === 'fi' ? 'peruutussivulta'
    : lang === 'de' ? 'unserer Abmeldeseite'
    : lang === 'ja' ? '配信停止ページ'
    : lang === 'es' ? 'página para darse de baja'
    : lang === 'pt-BR' ? 'página de cancelamento'
    : lang === 'zh-CN' ? '取消订阅页面'
    : lang === 'ko' ? '구독 해지 페이지'
    : lang === 'fr' ? 'page de désinscription'
    : lang === 'it' ? 'pagina di disiscrizione'
    : lang === 'nl' ? 'afmeldpagina'
    : lang === 'sv' ? 'avregistreringssida'
    : 'unsubscribe page'
  }</a>;
  // Microsoft redirects this address to the reader's own language version.
  const msLink = <a href="https://www.microsoft.com/privacy/privacystatement" target="_blank" rel="noopener" className="text-vibe-pink">{rec.msPrivacy}</a>;
  /* Lentohaku (vain flightSearch) kohdan 3 loppuun ja kohdassa 7 heti GetYourGuide-rivin jälkeen
     (GA, Umami, kumppaniverkostot, GetYourGuide, Travelpayouts-haku, Resend, …). */
  const fl = flightSearch ? (FLIGHT_SEARCH_PRIVACY[lang] ?? FLIGHT_SEARCH_PRIVACY.en) : null;
  const s3Items = fl ? [...t.s3Items, fl.s3Flight] : t.s3Items;
  const s7Base = fl ? [...t.s7Items.slice(0, 4), fl.s7Flight, ...t.s7Items.slice(4)] : t.s7Items;
  /* Clarity rows go right after Google Analytics, the other analytics service, in both lists. */
  const s7Items = sessionRecording ? [s7Base[0], rec.s7Item, ...s7Base.slice(1)] : s7Base;
  const s8aItems = sessionRecording ? [t.s8aItems[0], rec.s8aItem, ...t.s8aItems.slice(1)] : t.s8aItems;

  return (
    <div className="min-h-screen bg-deep-night pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-snow tracking-wide leading-tight mb-2 break-words">{t.h1}</h1>
        <p className="text-snow/70 text-sm mb-10">{lastUpdatedOverride ?? t.lastUpdated}</p>
        <div className="space-y-8 text-snow/60 leading-relaxed">

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s1Title}</h2>
            <p>{t.s1Body(siteName)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s2Title}</h2>
            <p>{t.s2Body}</p>
            {sessionRecording && <p className="mt-3">{rec.s2}</p>}
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s2aTitle}</h2>
            <p>{t.s2aIntro}</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              {t.s2aItems.map((it, i) => (
                <li key={i}><strong className="text-snow/80">{it.strong}{sep}</strong>{gap}{it.body}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s3Title}</h2>
            <p>{t.s3Intro}</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              {s3Items.map((it, i) => (
                // Item 1 is the analytics-cookie row in every language.
                <li key={i}><strong className="text-snow/80">{it.strong}{sep}</strong>{gap}{sessionRecording && i === 1 ? rec.s3Analytics : it.body}</li>
              ))}
            </ul>
            <p className="mt-3">{t.s3Tail(cookieLink)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s4Title}</h2>
            <p>{t.s4Body}</p>
            <p className="mt-3">{t.s4Umami}</p>
          </section>

          {sessionRecording && (
            <section>
              <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{rec.s4aTitle}</h2>
              <p>{rec.s4aBody1}</p>
              <p className="mt-3">{rec.s4aBody2(msLink)}</p>
            </section>
          )}

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s5Title}</h2>
            <p>{t.s5Body(unsubLink)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s6Title}</h2>
            <p>{t.s6Body}{sessionRecording && <>{gap}{rec.s6}</>}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s7Title}</h2>
            <p>{sessionRecording ? rec.s7Intro : t.s7Intro}</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              {s7Items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s8Title}</h2>
            <p>{t.s8Body1(siteName)}</p>
            <p className="mt-3">{t.s8Body2}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s8aTitle}</h2>
            <p>{t.s8aIntro}</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              {s8aItems.map((it, i) => (
                <li key={i}><strong className="text-snow/80">{it.strong}</strong>{gap}{it.body}</li>
              ))}
            </ul>
            <p className="mt-3">{t.s8aTail}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s9Title}</h2>
            <p>{t.s9Intro}</p>
            <ul className="list-disc pl-5 mt-3 space-y-1.5">
              {t.s9Items.map((it, i) => (
                <li key={i}><strong className="text-snow/80">{it.strong}{sep}</strong>{gap}{it.body}</li>
              ))}
            </ul>
            <p className="mt-3">{t.s9Tail(email)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s10Title}</h2>
            <p>{t.s10Body}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s11Title}</h2>
            <p>{t.s11Body}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s12Title}</h2>
            <p>{t.s12Body}</p>
          </section>

        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link to={localePath('/', lang)} className="text-vibe-pink hover:text-pink-300 no-underline font-medium">{t.backToHome}</Link>
          <Link to={localePath('/cookie-policy', lang)} className="text-snow/75 hover:text-snow no-underline font-medium">{t.cookiePolicy}</Link>
        </div>
      </div>
    </div>
  );
}

/**
 * @harvest-stop — esirenderöinnin haravointi loppuu tähän.
 *
 * Kaikki tämän alapuolella oleva on ehdollista tekstiä: `sessionRecording` (Microsoft Clarity), jota näyttää vain
 * sivusto, joka oikeasti lataa Clarityn (hubi), varianttikohtaiset kumppanirivit ja `flightSearch` (laplandflights.fi).
 * Crawlable-body-haravoija lukee tiedostosta JOKAISEN
 * kielilohkon ja leikkaa tämän merkin kohdalta. Kun nämä tekstit olivat COPY-kielilohkoissa, ne
 * päätyivät myös muiden sivustojen staattiseen tietosuojasivuun, vaikka sivusto ei käytä Claritya
 * (mitattu tuotannosta 5.10.2026: evästesivu 21 sivustolla, tietosuojasivu nightlife ja tours).
 * Ehdollinen teksti kuuluu tämän merkin alle, ei COPY:yn. Merkkijonoa ei saa mainita tiedostossa
 * aiemmin: haravoija leikkaa ENSIMMÄISESTÄ osumasta.
 */
/** Microsoft Clarity, rendered only when `sessionRecording` is on. */
interface SessionRecordingCopy {
  /** Extra paragraph after s2Body. */
  s2: string;
  /** Replaces the body of the analytics-cookie item (s3Items[1]). */
  s3Analytics: string;
  s4aTitle: string;
  s4aBody1: string;
  /** Microsoft's own role and uses, with a link to the Microsoft Privacy Statement (Clarity terms 4.4 b). */
  s4aBody2: (msLink: React.ReactNode) => React.ReactNode;
  /** Link text, in the grammatical form s4aBody2 needs. */
  msPrivacy: string;
  /** Appended to s6Body. */
  s6: string;
  /** Replaces s7Intro: Microsoft receives the data as an independent controller, so "we do not share" would be untrue. */
  s7Intro: string;
  /** Inserted after Google Analytics in s7Items. */
  s7Item: string;
  /** Inserted after Google Analytics in s8aItems. */
  s8aItem: { strong: string; body: string };
}

const SESSION_RECORDING: Record<Lang, SessionRecordingCopy> = {
  en: {
    s2: 'If you accept cookies, we also use Microsoft Clarity to collect clicks, scrolling and mouse movement for session recordings and heatmaps. Section 4a explains how it works.',
    s3Analytics: 'used by Google Analytics 4 and Microsoft Clarity to understand how visitors interact with our site. Collected pseudonymously.',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: 'If you accept cookies, Microsoft Clarity records clicks, scrolling and mouse movement on our pages. We view them as session recordings and heatmaps to see which parts of a page confuse people. Anything you type into a form field is masked in your browser and never sent to Microsoft. Clarity links visits from the same browser with a random ID stored in a cookie. The data contains no name or email address, but the ID makes it pseudonymous personal data under the GDPR. If you decline cookies, Clarity does not load at all.',
    s4aBody2: (ms) => <>We do not use Clarity data for advertising. When you accept cookies, our site gives Clarity consent for analytics only, not for advertising. However, Microsoft is an independent controller of this data: under the Clarity terms of use, it may also use the data for its own purposes, including product improvement and advertising (Microsoft Advertising). The {ms} explains how Microsoft handles personal data.</>,
    msPrivacy: 'Microsoft Privacy Statement',
    s6: 'Microsoft Clarity keeps session recordings for 30 days and heatmap and click data for 9 months. A recording that we save is kept for 9 months.',
    s7Intro: 'We do not sell your personal data. The following third-party services process data as part of our operations:',
    s7Item: 'Microsoft Clarity: session recordings and heatmaps (Microsoft is an independent controller, see section 4a)',
    s8aItem: { strong: 'Microsoft Clarity', body: '(Microsoft Ireland Operations Limited, Ireland, EU; Microsoft Corporation, USA): transfers from Microsoft Ireland to Microsoft Corporation are covered by Standard Contractual Clauses, and Microsoft Corporation is certified under the EU–US Data Privacy Framework.' },
  },
  fi: {
    s2: 'Jos hyväksyt evästeet, käytämme lisäksi Microsoft Clarity -palvelua, joka kokoaa klikkauksista, vierityksestä ja hiiren liikkeistä istuntotallenteita ja lämpökarttoja. Kohdassa 4a kerrotaan, miten se toimii.',
    s3Analytics: 'Google Analytics 4 ja Microsoft Clarity käyttävät näitä ymmärtääkseen, miten kävijät käyttävät sivustoa. Kerätään pseudonyymisti.',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: 'Jos hyväksyt evästeet, Microsoft Clarity tallentaa klikkaukset, vierityksen ja hiiren liikkeet sivuillamme. Katsomme niitä istuntotallenteina ja lämpökarttoina nähdäksemme, mitkä kohdat sivusta hämmentävät kävijöitä. Lomakekenttään kirjoittamasi teksti peitetään jo selaimessasi eikä sitä lähetetä Microsoftille. Clarity yhdistää samasta selaimesta tehdyt käynnit evästeeseen tallennetulla satunnaisella tunnisteella. Tiedoissa ei ole nimeäsi eikä sähköpostiosoitettasi, mutta tunnisteen vuoksi ne ovat tietosuoja-asetuksen tarkoittamia pseudonyymejä henkilötietoja. Jos hylkäät evästeet, Clarity ei lataudu lainkaan.',
    s4aBody2: (ms) => <>Emme käytä Clarityn tietoja mainontaan. Kun hyväksyt evästeet, sivustomme antaa Claritylle suostumuksen vain analytiikkaan, ei mainontaan. Microsoft on kuitenkin näiden tietojen itsenäinen rekisterinpitäjä: Clarityn käyttöehtojen mukaan se voi käyttää tietoja myös omiin tarkoituksiinsa, kuten tuotteidensa kehittämiseen ja mainontaan (Microsoft Advertising). {ms} näet, miten yhtiö käsittelee henkilötietoja.</>,
    msPrivacy: 'Microsoftin tietosuojaselosteesta',
    s6: 'Microsoft Clarity säilyttää istuntotallenteet 30 päivää sekä lämpökartta- ja klikkaustiedot 9 kuukautta. Tallenne, jonka otamme talteen, säilyy 9 kuukautta.',
    s7Intro: 'Emme myy henkilötietojasi. Seuraavat palveluntarjoajat käsittelevät tietoja toimintamme yhteydessä:',
    s7Item: 'Microsoft Clarity: istuntotallenteet ja lämpökartat (Microsoft on itsenäinen rekisterinpitäjä, ks. kohta 4a)',
    s8aItem: { strong: 'Microsoft Clarity', body: '(Microsoft Ireland Operations Limited, Irlanti, EU; Microsoft Corporation, Yhdysvallat): siirrot Microsoftin irlantilaisesta yhtiöstä Microsoft Corporationille on katettu vakiosopimuslausekkein (SCC) ja Microsoft Corporation kuuluu EU–US Data Privacy Framework -järjestelyyn.' },
  },
  de: {
    s2: 'Wenn Sie Cookies akzeptieren, nutzen wir außerdem Microsoft Clarity, um Klicks, Scrollen und Mausbewegungen für Sitzungsaufzeichnungen und Heatmaps zu erfassen. Wie das funktioniert, erklärt Abschnitt 4a.',
    s3Analytics: 'werden von Google Analytics 4 und Microsoft Clarity verwendet, um zu verstehen, wie Besucher die Website nutzen. Pseudonyme Erfassung.',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: 'Wenn Sie Cookies akzeptieren, erfasst Microsoft Clarity Klicks, Scrollen und Mausbewegungen auf unseren Seiten. Wir sehen sie uns in Form von Sitzungsaufzeichnungen und Heatmaps an, um zu erkennen, welche Stellen einer Seite verwirren. Was Sie in ein Formularfeld eingeben, wird bereits in Ihrem Browser maskiert und nie an Microsoft gesendet. Clarity verknüpft Besuche aus demselben Browser über eine zufällige Kennung in einem Cookie. Die Daten enthalten weder Ihren Namen noch Ihre E-Mail-Adresse, aber durch die Kennung sind sie pseudonyme personenbezogene Daten im Sinne der DSGVO. Wenn Sie Cookies ablehnen, wird Clarity gar nicht erst geladen.',
    s4aBody2: (ms) => <>Wir nutzen Clarity-Daten nicht für Werbung. Wenn Sie Cookies akzeptieren, übermittelt unsere Website an Clarity eine Einwilligung nur für Analysezwecke, nicht für Werbezwecke. Microsoft ist für diese Daten jedoch eigenständiger Verantwortlicher: Nach den Nutzungsbedingungen von Clarity darf Microsoft sie auch für eigene Zwecke verwenden, etwa zur Verbesserung seiner Produkte und für Werbung (Microsoft Advertising). Wie Microsoft personenbezogene Daten verarbeitet, erfahren Sie in der {ms}.</>,
    msPrivacy: 'Datenschutzerklärung von Microsoft',
    s6: 'Microsoft Clarity speichert Sitzungsaufzeichnungen 30 Tage lang sowie Heatmap- und Klickdaten 9 Monate lang. Sichern wir eine Aufzeichnung, bleibt sie 9 Monate erhalten.',
    s7Intro: 'Wir verkaufen Ihre personenbezogenen Daten nicht. Folgende Dienste verarbeiten im Rahmen unseres Betriebs Daten:',
    s7Item: 'Microsoft Clarity: Sitzungsaufzeichnungen und Heatmaps (Microsoft ist eigenständiger Verantwortlicher, siehe Abschnitt 4a)',
    s8aItem: { strong: 'Microsoft Clarity', body: '(Microsoft Ireland Operations Limited, Irland, EU; Microsoft Corporation, USA): Übermittlungen von der irischen Microsoft-Gesellschaft an die Microsoft Corporation sind durch Standardvertragsklauseln abgedeckt, und die Microsoft Corporation ist nach dem EU-US Data Privacy Framework zertifiziert.' },
  },
  ja: {
    s2: 'クッキーに同意された場合は、Microsoft Clarity も利用して、クリック、スクロール、マウスの動きをセッション記録とヒートマップのために収集します。仕組みについては「4a. Microsoft Clarity」で説明しています。',
    s3Analytics: 'Google Analytics 4 と Microsoft Clarity がサイトの利用状況を把握するために使用。仮名化された形で収集。',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: 'クッキーに同意された場合、Microsoft Clarity は当サイトのページ上でのクリック、スクロール、マウスの動きを記録します。当方はこれをセッション記録やヒートマップとして確認し、ページのどの部分が分かりにくいかを把握します。フォームの入力欄に入力された内容はブラウザ上でマスクされ、Microsoft に送信されることはありません。Clarity は、クッキーに保存されたランダムな識別子によって、同じブラウザからの訪問を関連付けます。データに氏名やメールアドレスは含まれませんが、この識別子により、GDPR 上の仮名化された個人データに当たります。クッキーを拒否された場合、Clarity は一切読み込まれません。',
    s4aBody2: (ms) => <>当方は Clarity のデータを広告に使用しません。クッキーに同意された場合も、当サイトが Clarity に伝える同意は分析目的に限られ、広告目的は含みません。ただし、Microsoft はこのデータについて独立した管理者であり、Clarity の利用規約に基づき、製品の改善や広告（Microsoft Advertising）など、自社の目的にもデータを使用することがあります。Microsoft による個人データの取り扱いについては、{ms}をご覧ください。</>,
    msPrivacy: 'Microsoft のプライバシーに関する声明',
    s6: 'Microsoft Clarity は、セッション記録を30日間、ヒートマップとクリックのデータを9ヶ月間保管します。当方が保存した記録は9ヶ月間保管されます。',
    s7Intro: '個人情報を販売することはありません。運営の一環として、以下の第三者サービスがデータを処理しています：',
    s7Item: 'Microsoft Clarity：セッション記録とヒートマップ（Microsoft は独立した管理者。「4a. Microsoft Clarity」を参照）',
    s8aItem: { strong: 'Microsoft Clarity', body: '（Microsoft Ireland Operations Limited（アイルランド、EU）、Microsoft Corporation（米国））：アイルランドの Microsoft 法人から Microsoft Corporation への移転は標準契約条項（SCC）の対象で、Microsoft Corporation は EU–米国データプライバシーフレームワークの認証を受けています。' },
  },
  es: {
    s2: 'Si acepta las cookies, también usamos Microsoft Clarity, que recopila clics, desplazamiento y movimientos del ratón para crear grabaciones de sesión y mapas de calor. La sección 4a explica cómo funciona.',
    s3Analytics: 'utilizadas por Google Analytics 4 y Microsoft Clarity para entender cómo interactúan los visitantes con nuestro sitio. Se recogen de forma seudonimizada.',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: 'Si acepta las cookies, Microsoft Clarity registra los clics, el desplazamiento y los movimientos del ratón en nuestras páginas. Los revisamos como grabaciones de sesión y mapas de calor para ver qué partes de una página confunden. Lo que usted escribe en un campo de formulario se enmascara en su navegador y nunca se envía a Microsoft. Clarity vincula las visitas desde el mismo navegador mediante un identificador aleatorio guardado en una cookie. Los datos no incluyen su nombre ni su dirección de correo electrónico, pero el identificador los convierte en datos personales seudonimizados conforme al RGPD. Si rechaza las cookies, Clarity no se carga en absoluto.',
    s4aBody2: (ms) => <>No usamos los datos de Clarity con fines publicitarios. Cuando usted acepta las cookies, nuestro sitio le comunica a Clarity un consentimiento solo para fines analíticos, no publicitarios. Sin embargo, Microsoft es responsable independiente del tratamiento de estos datos: según las condiciones de uso de Clarity, también puede usarlos para sus propios fines, como la mejora de sus productos y la publicidad (Microsoft Advertising). La {ms} explica cómo trata Microsoft los datos personales.</>,
    msPrivacy: 'Declaración de privacidad de Microsoft',
    s6: 'Microsoft Clarity conserva las grabaciones de sesión durante 30 días y los datos de mapas de calor y de clics durante 9 meses. Si guardamos una grabación, se conserva durante 9 meses.',
    s7Intro: 'No vendemos sus datos personales. Los siguientes servicios externos procesan datos como parte de nuestras operaciones:',
    s7Item: 'Microsoft Clarity: grabaciones de sesión y mapas de calor (Microsoft es responsable independiente del tratamiento; véase la sección 4a)',
    s8aItem: { strong: 'Microsoft Clarity', body: '(Microsoft Ireland Operations Limited, Irlanda, UE; Microsoft Corporation, EE. UU.): las transferencias de la empresa irlandesa de Microsoft a Microsoft Corporation están amparadas por Cláusulas Contractuales Tipo, y Microsoft Corporation está certificada en el Marco de Privacidad de Datos UE–EE. UU.' },
  },
  'pt-BR': {
    s2: 'Se você aceitar os cookies, também usamos o Microsoft Clarity, que coleta cliques, rolagem e movimentos do mouse para criar gravações de sessão e mapas de calor. A seção 4a explica como funciona.',
    s3Analytics: 'usados pelo Google Analytics 4 e pelo Microsoft Clarity para entender como os visitantes interagem com nosso site. Coletados de forma pseudonimizada.',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: 'Se você aceitar os cookies, o Microsoft Clarity registra cliques, rolagem e movimentos do mouse em nossas páginas. Analisamos esses dados como gravações de sessão e mapas de calor para ver quais partes de uma página confundem. O que você digita em um campo de formulário é mascarado no seu navegador e nunca é enviado à Microsoft. O Clarity vincula as visitas feitas no mesmo navegador por meio de um identificador aleatório guardado em um cookie. Os dados não incluem seu nome nem seu endereço de e-mail, mas o identificador faz deles dados pessoais pseudonimizados segundo o GDPR. Se você recusar os cookies, o Clarity nem chega a ser carregado.',
    s4aBody2: (ms) => <>Não usamos os dados do Clarity para publicidade. Quando você aceita os cookies, nosso site informa ao Clarity um consentimento apenas para fins analíticos, não publicitários. A Microsoft, porém, é controladora independente desses dados: de acordo com os termos de uso do Clarity, ela também pode usá-los para fins próprios, como a melhoria de seus produtos e a publicidade (Microsoft Advertising). A {ms} explica como a Microsoft trata dados pessoais.</>,
    msPrivacy: 'Política de Privacidade da Microsoft',
    s6: 'O Microsoft Clarity retém as gravações de sessão por 30 dias e os dados de mapas de calor e de cliques por 9 meses. Se salvarmos uma gravação, ela fica guardada por 9 meses.',
    s7Intro: 'Não vendemos seus dados pessoais. Os seguintes serviços externos processam dados como parte de nossas operações:',
    s7Item: 'Microsoft Clarity: gravações de sessão e mapas de calor (a Microsoft é controladora independente; veja a seção 4a)',
    s8aItem: { strong: 'Microsoft Clarity', body: '(Microsoft Ireland Operations Limited, Irlanda, UE; Microsoft Corporation, EUA): as transferências da empresa irlandesa da Microsoft para a Microsoft Corporation são cobertas pelas Cláusulas Contratuais Padrão, e a Microsoft Corporation é certificada no Quadro de Privacidade de Dados UE–EUA.' },
  },
  'zh-CN': {
    s2: '如果您同意使用 Cookie，我们还会使用 Microsoft Clarity 收集点击、滚动和鼠标移动数据，用于生成会话记录和热图。其工作方式详见“4a. Microsoft Clarity”。',
    s3Analytics: 'Google Analytics 4 和 Microsoft Clarity 用于了解访客如何与本网站互动。以假名化方式收集。',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: '如果您同意使用 Cookie，Microsoft Clarity 会记录您在我们页面上的点击、滚动和鼠标移动。我们以会话记录和热图的形式查看这些数据，以了解页面的哪些部分让人困惑。您在表单输入框中输入的内容会在您的浏览器中被遮蔽，绝不会发送给 Microsoft。Clarity 通过 Cookie 中存储的随机标识符，将同一浏览器的多次访问相互关联。这些数据不包含您的姓名或电子邮件地址，但由于该标识符的存在，它们属于 GDPR 所称的假名化个人数据。如果您拒绝 Cookie，Clarity 根本不会加载。',
    s4aBody2: (ms) => <>我们不会将 Clarity 数据用于广告。您同意使用 Cookie 时，本网站向 Clarity 传达的同意仅限于分析用途，不包括广告用途。不过，Microsoft 是这些数据的独立数据控制者：根据 Clarity 使用条款，Microsoft 也可将其用于自身目的，包括改进产品和广告（Microsoft Advertising）。有关 Microsoft 如何处理个人数据，请参阅 {ms}。</>,
    msPrivacy: 'Microsoft 隐私声明',
    s6: 'Microsoft Clarity 将会话记录保留30天，热图和点击数据保留9个月。我们保存的记录保留9个月。',
    s7Intro: '我们不会出售您的个人数据。作为运营的一部分，以下第三方服务会处理数据：',
    s7Item: 'Microsoft Clarity：会话记录和热图（Microsoft 为独立数据控制者，详见“4a. Microsoft Clarity”）',
    s8aItem: { strong: 'Microsoft Clarity', body: '（Microsoft Ireland Operations Limited，爱尔兰，欧盟；Microsoft Corporation，美国）：从 Microsoft 爱尔兰公司向 Microsoft Corporation 的传输受标准合同条款（SCC）保护，且 Microsoft Corporation 已通过欧盟–美国数据隐私框架认证。' },
  },
  ko: {
    s2: '쿠키에 동의하시면 당사는 Microsoft Clarity도 사용하여 클릭, 스크롤, 마우스 움직임을 수집하고 이를 세션 기록과 히트맵으로 만듭니다. 작동 방식은 4a항에서 설명합니다.',
    s3Analytics: 'Google Analytics 4와 Microsoft Clarity가 방문자의 사이트 이용 방식을 이해하는 데 사용. 가명 처리되어 수집됩니다.',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: '쿠키에 동의하시면 Microsoft Clarity가 당사 페이지에서의 클릭, 스크롤, 마우스 움직임을 기록합니다. 당사는 이를 세션 기록과 히트맵으로 확인하여 페이지의 어느 부분이 혼란을 주는지 파악합니다. 양식 입력란에 입력하신 내용은 브라우저에서 가려지며 Microsoft로 전송되지 않습니다. Clarity는 쿠키에 저장된 임의의 식별자로 같은 브라우저에서 이루어진 방문을 서로 연결합니다. 이 데이터에는 성명이나 이메일 주소가 포함되지 않지만, 이 식별자로 인해 GDPR상 가명 처리된 개인정보에 해당합니다. 쿠키를 거부하시면 Clarity는 아예 로드되지 않습니다.',
    s4aBody2: (ms) => <>당사는 Clarity 데이터를 광고에 사용하지 않습니다. 쿠키에 동의하시면 당사 사이트는 Clarity에 분석 목적의 동의만 전달하며 광고 목적의 동의는 전달하지 않습니다. 다만 Microsoft는 이 데이터의 독립적인 관리자로서, Clarity 이용약관에 따라 제품 개선 및 광고(Microsoft Advertising)를 포함한 자체 목적으로도 데이터를 사용할 수 있습니다. Microsoft의 개인정보 처리 방식은 {ms}에서 확인하실 수 있습니다.</>,
    msPrivacy: 'Microsoft 개인정보처리방침',
    s6: 'Microsoft Clarity는 세션 기록을 30일간, 히트맵과 클릭 데이터를 9개월간 보관합니다. 당사가 저장한 기록은 9개월간 보관됩니다.',
    s7Intro: '당사는 귀하의 개인정보를 판매하지 않습니다. 운영의 일환으로 다음 제3자 서비스가 데이터를 처리합니다:',
    s7Item: 'Microsoft Clarity: 세션 기록 및 히트맵(Microsoft는 독립적인 관리자, 4a항 참조)',
    s8aItem: { strong: 'Microsoft Clarity', body: '(Microsoft Ireland Operations Limited, 아일랜드, EU; Microsoft Corporation, 미국): 아일랜드 Microsoft 법인에서 Microsoft Corporation으로의 이전에는 표준계약조항(SCC)이 적용되며, Microsoft Corporation은 EU–미국 데이터 프라이버시 프레임워크 인증을 받았습니다.' },
  },
  fr: {
    s2: 'Si vous acceptez les cookies, nous utilisons aussi Microsoft Clarity, qui recueille les clics, le défilement et les mouvements de souris pour en tirer des enregistrements de session et des cartes de chaleur. La section 4a en explique le fonctionnement.',
    s3Analytics: 'utilisés par Google Analytics 4 et Microsoft Clarity pour comprendre l’usage du site par les visiteurs. Collectés de manière pseudonyme.',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: 'Si vous acceptez les cookies, Microsoft Clarity enregistre les clics, le défilement et les mouvements de souris sur nos pages. Nous les consultons sous forme d’enregistrements de session et de cartes de chaleur pour repérer les parties d’une page qui prêtent à confusion. Ce que vous saisissez dans un champ de formulaire est masqué dans votre navigateur et n’est jamais envoyé à Microsoft. Clarity relie les visites effectuées depuis le même navigateur grâce à un identifiant aléatoire stocké dans un cookie. Les données ne contiennent ni votre nom ni votre adresse e-mail, mais cet identifiant en fait des données personnelles pseudonymes au sens du RGPD. Si vous refusez les cookies, Clarity ne se charge pas du tout.',
    s4aBody2: (ms) => <>Nous n’utilisons pas les données de Clarity à des fins publicitaires. Lorsque vous acceptez les cookies, notre site ne transmet à Clarity qu’un consentement à des fins d’analyse, et non à des fins publicitaires. Microsoft est toutefois responsable du traitement indépendant pour ces données : selon les conditions d’utilisation de Clarity, Microsoft peut aussi les utiliser à ses propres fins, notamment l’amélioration de ses produits et la publicité (Microsoft Advertising). La {ms} explique comment Microsoft traite les données personnelles.</>,
    msPrivacy: 'Déclaration de confidentialité de Microsoft',
    s6: 'Microsoft Clarity conserve les enregistrements de session pendant 30 jours et les données de cartes de chaleur et de clics pendant 9 mois. Un enregistrement que nous sauvegardons est conservé 9 mois.',
    s7Intro: 'Nous ne vendons pas vos données personnelles. Les services tiers suivants traitent des données dans le cadre de notre activité :',
    s7Item: 'Microsoft Clarity : enregistrements de session et cartes de chaleur (Microsoft est responsable du traitement indépendant, voir la section 4a)',
    s8aItem: { strong: 'Microsoft Clarity', body: '(Microsoft Ireland Operations Limited, Irlande, UE ; Microsoft Corporation, États-Unis) : les transferts de la société irlandaise de Microsoft vers Microsoft Corporation sont couverts par les clauses contractuelles types, et Microsoft Corporation est certifiée au titre du cadre de protection des données UE–États-Unis.' },
  },
  it: {
    s2: 'Se Lei accetta i cookie, utilizziamo anche Microsoft Clarity, che raccoglie clic, scorrimento e movimenti del mouse per ricavarne registrazioni di sessione e mappe di calore. La sezione 4a ne spiega il funzionamento.',
    s3Analytics: 'utilizzati da Google Analytics 4 e Microsoft Clarity per comprendere come i visitatori interagiscono con il sito. Raccolti in forma pseudonima.',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: 'Se Lei accetta i cookie, Microsoft Clarity registra clic, scorrimento e movimenti del mouse sulle nostre pagine. Li consultiamo come registrazioni di sessione e mappe di calore per capire quali parti di una pagina creano confusione. Ciò che Lei digita nei campi dei moduli viene mascherato nel Suo browser e non viene mai inviato a Microsoft. Clarity collega le visite effettuate dallo stesso browser tramite un identificatore casuale salvato in un cookie. I dati non contengono il Suo nome né il Suo indirizzo e-mail, ma l’identificatore li rende dati personali pseudonimi ai sensi del GDPR. Se Lei rifiuta i cookie, Clarity non viene caricato affatto.',
    s4aBody2: (ms) => <>Non utilizziamo i dati di Clarity per la pubblicità. Quando Lei accetta i cookie, il nostro sito trasmette a Clarity un consenso solo per finalità di analisi, non pubblicitarie. Microsoft è tuttavia titolare autonomo del trattamento di questi dati: in base alle condizioni d’uso di Clarity, può utilizzarli anche per finalità proprie, tra cui il miglioramento dei suoi prodotti e la pubblicità (Microsoft Advertising). L’{ms} spiega come Microsoft tratta i dati personali.</>,
    msPrivacy: 'Informativa sulla privacy di Microsoft',
    s6: 'Microsoft Clarity conserva le registrazioni di sessione per 30 giorni e i dati delle mappe di calore e dei clic per 9 mesi. Una registrazione che salviamo viene conservata per 9 mesi.',
    s7Intro: 'Non vendiamo i Suoi dati personali. I seguenti servizi di terze parti trattano dati nell’ambito delle nostre operazioni:',
    s7Item: 'Microsoft Clarity: registrazioni di sessione e mappe di calore (Microsoft è titolare autonomo del trattamento, si veda la sezione 4a)',
    s8aItem: { strong: 'Microsoft Clarity', body: '(Microsoft Ireland Operations Limited, Irlanda, UE; Microsoft Corporation, USA): i trasferimenti dalla società irlandese di Microsoft a Microsoft Corporation sono coperti dalle clausole contrattuali tipo e Microsoft Corporation è certificata nell’ambito dell’EU–US Data Privacy Framework.' },
  },
  nl: {
    s2: 'Als u cookies accepteert, gebruiken wij ook Microsoft Clarity om klikken, scrollen en muisbewegingen vast te leggen voor sessieopnamen en heatmaps. In paragraaf 4a leest u hoe dat werkt.',
    s3Analytics: 'gebruikt door Google Analytics 4 en Microsoft Clarity om te begrijpen hoe bezoekers onze site gebruiken. Gepseudonimiseerd verzameld.',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: 'Als u cookies accepteert, legt Microsoft Clarity klikken, scrollen en muisbewegingen op onze pagina’s vast. Wij bekijken die als sessieopnamen en heatmaps om te zien welke delen van een pagina verwarrend zijn. Wat u in een formulierveld typt, wordt al in uw browser gemaskeerd en nooit naar Microsoft verzonden. Clarity koppelt bezoeken vanuit dezelfde browser aan elkaar via een willekeurige identificatiecode in een cookie. De gegevens bevatten geen naam of e-mailadres, maar door die code zijn het gepseudonimiseerde persoonsgegevens in de zin van de AVG. Als u cookies weigert, wordt Clarity helemaal niet geladen.',
    s4aBody2: (ms) => <>Wij gebruiken Clarity-gegevens niet voor advertenties. Als u cookies accepteert, geeft onze site Clarity alleen toestemming voor analyse, niet voor advertenties. Microsoft is echter zelfstandig verwerkingsverantwoordelijke voor deze gegevens: volgens de gebruiksvoorwaarden van Clarity mag Microsoft ze ook voor eigen doeleinden gebruiken, onder meer om zijn producten te verbeteren en voor advertenties (Microsoft Advertising). In de {ms} leest u hoe Microsoft met persoonsgegevens omgaat.</>,
    msPrivacy: 'privacyverklaring van Microsoft',
    s6: 'Microsoft Clarity bewaart sessieopnamen 30 dagen en heatmap- en klikgegevens 9 maanden. Een opname die wij opslaan, blijft 9 maanden bewaard.',
    s7Intro: 'Wij verkopen uw persoonsgegevens niet. De volgende externe diensten verwerken gegevens als onderdeel van onze activiteiten:',
    s7Item: 'Microsoft Clarity: sessieopnamen en heatmaps (Microsoft is zelfstandig verwerkingsverantwoordelijke, zie paragraaf 4a)',
    s8aItem: { strong: 'Microsoft Clarity', body: '(Microsoft Ireland Operations Limited, Ierland, EU; Microsoft Corporation, VS): doorgiften van de Ierse Microsoft-vennootschap aan Microsoft Corporation worden gedekt door de standaardcontractbepalingen, en Microsoft Corporation is gecertificeerd onder het EU–US Data Privacy Framework.' },
  },
  sv: {
    s2: 'Om du godkänner cookies använder vi också Microsoft Clarity, som samlar in klick, scrollning och musrörelser för sessionsinspelningar och värmekartor. I avsnitt 4a förklarar vi hur det fungerar.',
    s3Analytics: 'används av Google Analytics 4 och Microsoft Clarity för att förstå hur besökare interagerar med vår webbplats. Samlas in pseudonymt.',
    s4aTitle: '4a. Microsoft Clarity',
    s4aBody1: 'Om du godkänner cookies registrerar Microsoft Clarity klick, scrollning och musrörelser på våra sidor. Vi tittar på dem som sessionsinspelningar och värmekartor för att se vilka delar av en sida som förvirrar. Det du skriver i ett formulärfält maskeras redan i din webbläsare och skickas aldrig till Microsoft. Clarity kopplar ihop besök från samma webbläsare med en slumpmässig identifierare som sparas i en cookie. Uppgifterna innehåller inte ditt namn eller din e-postadress, men identifieraren gör dem till pseudonyma personuppgifter enligt GDPR. Om du avböjer cookies laddas Clarity inte alls.',
    s4aBody2: (ms) => <>Vi använder inte Clarity-data för annonsering. När du godkänner cookies ger vår webbplats Clarity samtycke endast för analys, inte för annonsering. Microsoft är dock självständigt personuppgiftsansvarig för dessa uppgifter: enligt Claritys användarvillkor får Microsoft även använda dem för egna ändamål, bland annat för att förbättra sina produkter och för annonsering (Microsoft Advertising). I {ms} kan du läsa hur Microsoft hanterar personuppgifter.</>,
    msPrivacy: 'Microsofts sekretesspolicy',
    s6: 'Microsoft Clarity sparar sessionsinspelningar i 30 dagar och data från värmekartor och klick i 9 månader. En inspelning som vi väljer att spara finns kvar i 9 månader.',
    s7Intro: 'Vi säljer inte dina personuppgifter. Följande tredjepartstjänster behandlar uppgifter som en del av vår verksamhet:',
    s7Item: 'Microsoft Clarity: sessionsinspelningar och värmekartor (Microsoft är självständigt personuppgiftsansvarig, se avsnitt 4a)',
    s8aItem: { strong: 'Microsoft Clarity', body: '(Microsoft Ireland Operations Limited, Irland, EU; Microsoft Corporation, USA): överföringar från Microsofts irländska bolag till Microsoft Corporation omfattas av standardavtalsklausuler, och Microsoft Corporation är certifierat enligt EU–US Data Privacy Framework.' },
  },
};

/**
 * Kumppanirivit kohtiin 3, 7, 8 ja 8a, varianttikohtaisesti (6.10.2026). Ne ovat @harvest-stop-merkin alla, koska
 * esirenderöinti haravoi kaiken merkin yläpuolisen jokaisen sivuston staattiseen HTML:ään. Hinta: myös matkailusivustojen
 * staattisesta tietosuojasivusta puuttuvat nämä neljä riviä; selaimessa piirtyvä sivu on ennallaan.
 */
interface PartnerPrivacyCopy {
  s3Affiliate: { strong: string; body: string };
  s7Affiliate: string;
  s8Body2: string;
  s8aAffiliate: { strong: string; body: string };
}
/** Matkailusivustot (oletus): siirretty sanasta sanaan COPYsta. */
const TRAVEL_PRIVACY: Record<Lang, PartnerPrivacyCopy> = {
  en: {
    s3Affiliate: { strong: 'Affiliate cookies', body: 'placed when you click affiliate links (e.g. Adtraction, Daisycon or Travelpayouts tracking). These help us attribute referral commissions.' },
    s7Affiliate: 'Adtraction, Daisycon, Travelpayouts and Trip.com: affiliate link tracking when you click booking or partner links',
    s8Body2: 'We participate in affiliate programmes through the Adtraction, Daisycon and Travelpayouts networks and in the Trip.com partner programme; partners include Sembo, Lomarengas, Trip.com and EconomyBookings. When you click an affiliate link and make a purchase or booking, we may receive a commission at no additional cost to you.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Sweden, EU; Daisycon B.V., the Netherlands, EU; Travelpayouts and Trip.com, international): transfers outside the EU/EEA are covered by Standard Contractual Clauses.' },
  },
  fi: {
    s3Affiliate: { strong: 'Kumppanievästeet', body: 'asetetaan, kun klikkaat kumppanilinkkiä (esim. Adtraction-, Daisycon- tai Travelpayouts-seuranta). Näiden avulla varauspalvelut kohdistavat komission oikealle lähteelle.' },
    s7Affiliate: 'Adtraction, Daisycon, Travelpayouts ja Trip.com: varaus- ja kumppanilinkkien klikkausten seuranta',
    s8Body2: 'Osallistumme kumppaniohjelmiin Adtraction-, Daisycon- ja Travelpayouts-verkostojen sekä Trip.comin kumppaniohjelman kautta; kumppaneitamme ovat mm. Sembo, Lomarengas, Trip.com ja EconomyBookings. Kun klikkaat kumppanilinkkiä ja teet ostoksen tai varauksen, voimme saada pienen komission ilman lisäkustannuksia sinulle.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Ruotsi, EU; Daisycon B.V., Alankomaat, EU; Travelpayouts ja Trip.com, kansainväliset): EU/ETA-alueen ulkopuoliset siirrot on katettu vakiosopimuslausekkein (SCC).' },
  },
  de: {
    s3Affiliate: { strong: 'Partner-Cookies', body: 'werden gesetzt, wenn Sie auf Partnerlinks klicken (z. B. Adtraction-, Daisycon- oder Travelpayouts-Tracking). So lassen sich Provisionen korrekt zuordnen.' },
    s7Affiliate: 'Adtraction, Daisycon, Travelpayouts und Trip.com: Tracking von Klicks auf Buchungs- und Partnerlinks',
    s8Body2: 'Wir nehmen über die Netzwerke Adtraction, Daisycon und Travelpayouts sowie am Partnerprogramm von Trip.com an Partnerprogrammen teil; zu unseren Partnern zählen Sembo, Lomarengas, Trip.com und EconomyBookings. Wenn Sie über einen Partnerlink eine Buchung oder einen Kauf tätigen, erhalten wir ggf. eine kleine Provision, für Sie ohne zusätzliche Kosten.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Schweden, EU; Daisycon B.V., die Niederlande, EU; Travelpayouts und Trip.com, international): Übermittlungen außerhalb der EU/des EWR sind durch Standardvertragsklauseln abgedeckt.' },
  },
  ja: {
    s3Affiliate: { strong: 'アフィリエイトクッキー', body: 'アフィリエイトリンク（例：Adtraction / Daisycon / Travelpayouts のトラッキング）をクリックしたときに設定されます。紹介料の帰属に役立ちます。' },
    s7Affiliate: 'Adtraction、Daisycon、Travelpayouts、Trip.com：予約・パートナーリンクのクリック追跡',
    s8Body2: 'Adtraction、Daisycon、Travelpayouts の各ネットワーク、および Trip.com のパートナープログラムを通じてアフィリエイトプログラムに参加しています（パートナー例：Sembo、Lomarengas、Trip.com、EconomyBookings）。アフィリエイトリンクからご予約・ご購入された場合、お客様には追加費用なしで当社が手数料を受け取ることがあります。',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '（Adtraction AB（スウェーデン、EU）、Daisycon B.V.（オランダ、EU）、Travelpayouts と Trip.com（国際））：EU/EEA 域外への移転は標準契約条項（SCC）の対象です。' },
  },
  es: {
    s3Affiliate: { strong: 'Cookies de afiliados', body: 'se establecen cuando hace clic en enlaces de afiliados (por ejemplo, seguimiento de Adtraction, Daisycon o Travelpayouts). Permiten atribuir las comisiones por referencia.' },
    s7Affiliate: 'Adtraction, Daisycon, Travelpayouts y Trip.com: seguimiento de clics en enlaces de reserva y de afiliados',
    s8Body2: 'Participamos en programas de afiliación a través de las redes Adtraction, Daisycon y Travelpayouts y del programa de socios de Trip.com; entre nuestros socios están Sembo, Lomarengas, Trip.com y EconomyBookings. Cuando hace clic en un enlace de afiliado y realiza una compra o reserva, podemos recibir una comisión sin costo adicional para usted.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Suecia, UE; Daisycon B.V., Países Bajos, UE; Travelpayouts y Trip.com, internacionales): las transferencias fuera de la UE/EEE están amparadas por Cláusulas Contractuales Tipo.' },
  },
  'pt-BR': {
    s3Affiliate: { strong: 'Cookies de afiliados', body: 'definidos quando você clica em links de afiliados (por exemplo, rastreamento da Adtraction, da Daisycon ou da Travelpayouts). Ajudam a atribuir as comissões de indicação.' },
    s7Affiliate: 'Adtraction, Daisycon, Travelpayouts e Trip.com: rastreamento de cliques em links de reserva e afiliados',
    s8Body2: 'Participamos de programas de afiliados por meio das redes Adtraction, Daisycon e Travelpayouts e do programa de parceiros da Trip.com; entre os parceiros estão Sembo, Lomarengas, Trip.com e EconomyBookings. Quando você clica em um link de afiliado e faz uma compra ou reserva, podemos receber uma comissão sem custo adicional para você.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Suécia, UE; Daisycon B.V., Países Baixos, UE; Travelpayouts e Trip.com, internacionais): transferências para fora da UE/EEE são cobertas pelas Cláusulas Contratuais Padrão.' },
  },
  'zh-CN': {
    s3Affiliate: { strong: '联盟 cookie', body: '当您点击联盟链接（例如 Adtraction、Daisycon 或 Travelpayouts 追踪）时设置，用于归因推荐佣金。' },
    s7Affiliate: 'Adtraction、Daisycon、Travelpayouts 与 Trip.com：点击预订与合作伙伴链接的追踪',
    s8Body2: '我们通过 Adtraction、Daisycon 和 Travelpayouts 网络以及 Trip.com 合作伙伴计划参与联盟计划，合作伙伴包括 Sembo、Lomarengas、Trip.com 和 EconomyBookings。当您点击联盟链接并完成购买或预订时，我们可能获得佣金，而您无需承担任何额外费用。',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '（Adtraction AB，瑞典，欧盟；Daisycon B.V.，荷兰，欧盟；Travelpayouts 与 Trip.com，国际）：欧盟/欧洲经济区以外的传输受标准合同条款（SCC）保护。' },
  },
  ko: {
    s3Affiliate: { strong: '제휴 쿠키', body: '제휴 링크 클릭 시 설정(예: Adtraction, Daisycon, Travelpayouts 추적). 추천 수수료 귀속에 사용됩니다.' },
    s7Affiliate: 'Adtraction, Daisycon, Travelpayouts, Trip.com: 예약·파트너 링크 클릭 추적',
    s8Body2: '당사는 Adtraction, Daisycon, Travelpayouts 네트워크와 Trip.com 파트너 프로그램을 통해 제휴 프로그램에 참여합니다. 파트너로는 Sembo, Lomarengas, Trip.com, EconomyBookings 등이 있습니다. 제휴 링크를 통해 구매 또는 예약을 하시면 귀하에게 추가 비용이 발생하지 않으며, 당사가 수수료를 받습니다.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, 스웨덴, EU; Daisycon B.V., 네덜란드, EU; Travelpayouts 및 Trip.com, 국제): EU/EEA 역외 이전에는 표준계약조항(SCC)이 적용됩니다.' },
  },
  fr: {
    s3Affiliate: { strong: 'Cookies d\'affiliation', body: 'déposés lorsque vous cliquez sur un lien d\'affiliation (par exemple suivi Adtraction, Daisycon ou Travelpayouts). Ils permettent d\'attribuer les commissions de référencement.' },
    s7Affiliate: 'Adtraction, Daisycon, Travelpayouts et Trip.com : suivi des clics sur les liens de réservation et d\'affiliation',
    s8Body2: 'Nous participons à des programmes d\'affiliation via les réseaux Adtraction, Daisycon et Travelpayouts ainsi qu\'au programme partenaire de Trip.com ; nos partenaires incluent Sembo, Lomarengas, Trip.com et EconomyBookings. Lorsque vous cliquez sur un lien d\'affiliation et effectuez un achat ou une réservation, nous pouvons percevoir une commission sans coût supplémentaire pour vous.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Suède, UE ; Daisycon B.V., Pays-Bas, UE ; Travelpayouts et Trip.com, internationaux) : les transferts hors UE/EEE sont couverts par les clauses contractuelles types.' },
  },
  it: {
    s3Affiliate: { strong: 'Cookie di affiliazione', body: 'impostati quando Lei clicca su link di affiliazione (ad esempio tracciamento Adtraction, Daisycon o Travelpayouts). Permettono di attribuire le commissioni di affiliazione.' },
    s7Affiliate: 'Adtraction, Daisycon, Travelpayouts e Trip.com: tracciamento dei clic su link di prenotazione e affiliazione',
    s8Body2: 'Partecipiamo a programmi di affiliazione tramite le reti Adtraction, Daisycon e Travelpayouts e il programma partner di Trip.com; tra i nostri partner figurano Sembo, Lomarengas, Trip.com ed EconomyBookings. Quando Lei clicca su un link di affiliazione ed effettua un acquisto o una prenotazione, potremmo ricevere una commissione senza costi aggiuntivi per Lei.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Svezia, UE; Daisycon B.V., Paesi Bassi, UE; Travelpayouts e Trip.com, internazionali): i trasferimenti al di fuori dell\'UE/SEE sono coperti dalle clausole contrattuali tipo.' },
  },
  nl: {
    s3Affiliate: { strong: 'Affiliatecookies', body: 'geplaatst wanneer u op affiliatelinks klikt (bijv. Adtraction-, Daisycon- of Travelpayouts-tracking). Deze helpen ons verwijzingscommissies toe te wijzen.' },
    s7Affiliate: 'Adtraction, Daisycon, Travelpayouts en Trip.com: tracking van klikken op boekings- en affiliatelinks',
    s8Body2: 'Wij nemen deel aan affiliateprogramma\'s via de netwerken Adtraction, Daisycon en Travelpayouts en via het partnerprogramma van Trip.com; tot onze partners behoren Sembo, Lomarengas, Trip.com en EconomyBookings. Wanneer u op een affiliatelink klikt en een aankoop of boeking doet, kunnen wij een commissie ontvangen zonder extra kosten voor u.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Zweden, EU; Daisycon B.V., Nederland, EU; Travelpayouts en Trip.com, internationaal): doorgiften buiten de EU/EER worden gedekt door de standaardcontractbepalingen.' },
  },
  sv: {
    s3Affiliate: { strong: 'Affiliatecookies', body: 'placeras när du klickar på affiliatelänkar (t.ex. Adtraction-, Daisycon- eller Travelpayouts-spårning). De hjälper oss att attribuera hänvisningsprovisioner.' },
    s7Affiliate: 'Adtraction, Daisycon, Travelpayouts och Trip.com: spårning av affiliatelänkar när du klickar på boknings- eller partnerlänkar',
    s8Body2: 'Vi deltar i affiliateprogram via nätverken Adtraction, Daisycon och Travelpayouts samt i Trip.coms partnerprogram; bland våra partner finns Sembo, Lomarengas, Trip.com och EconomyBookings. När du klickar på en affiliatelänk och gör ett köp eller en bokning kan vi få en provision utan extra kostnad för dig.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Sverige, EU; Daisycon B.V., Nederländerna, EU; Travelpayouts och Trip.com, internationella): överföringar utanför EU/EES omfattas av standardavtalsklausuler.' },
  },
};
/**
 * Kauppaversio (`variant="shop"`): laplandstore.fi ja laplandgifts.com. Kaupat linkittävät suomalaisiin kauppoihin Adtractionin
 * (Kulta-Center, Scandinavian Outdoor, Halti, Finlayson, Ivalo.com, Sukkamestarit) ja Daisyconin (Suomikauppa, Nordicbuddies)
 * kautta (redirect-workerin PARTNERS 6.10.2026); kumppanilista sama kuin TermsContentin kauppaversiossa. Vesan hyväksymä 6.10.2026.
 */
const SHOP_PRIVACY: Record<Lang, PartnerPrivacyCopy> = {
  en: {
    s3Affiliate: { strong: 'Affiliate cookies', body: 'placed when you click affiliate links (e.g. Adtraction or Daisycon tracking). These help us attribute referral commissions.' },
    s7Affiliate: 'Adtraction and Daisycon: affiliate link tracking when you click shop or partner links',
    s8Body2: 'We participate in affiliate programmes through the Adtraction and Daisycon networks; partners include Finnish shops and brands such as Suomikauppa, Nordicbuddies, Finlayson and Scandinavian Outdoor. We also link to shops that pay us nothing. When you click an affiliate link and make a purchase, we may receive a commission at no additional cost to you.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '(Adtraction AB, Sweden, EU; Daisycon B.V., the Netherlands, EU): within the EEA.' },
  },
  fi: {
    s3Affiliate: { strong: 'Kumppanievästeet', body: 'asetetaan, kun klikkaat kumppanilinkkiä (esim. Adtraction- tai Daisycon-seuranta). Näiden avulla kaupat kohdistavat komission oikealle lähteelle.' },
    s7Affiliate: 'Adtraction ja Daisycon: kauppa- ja kumppanilinkkien klikkausten seuranta',
    s8Body2: 'Osallistumme kumppaniohjelmiin Adtraction- ja Daisycon-verkostojen kautta; kumppaneitamme ovat muun muassa suomalaiset kaupat ja brändit Suomikauppa, Nordicbuddies, Finlayson ja Scandinavian Outdoor. Linkitämme myös kauppoihin, joista emme saa mitään. Kun klikkaat kumppanilinkkiä ja teet ostoksen, voimme saada pienen komission ilman lisäkustannuksia sinulle.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '(Adtraction AB, Ruotsi, EU; Daisycon B.V., Alankomaat, EU): ETA-alueen sisäpuolella.' },
  },
  de: {
    s3Affiliate: { strong: 'Partner-Cookies', body: 'werden gesetzt, wenn Sie auf Partnerlinks klicken (z. B. Adtraction- oder Daisycon-Tracking). So lassen sich Provisionen korrekt zuordnen.' },
    s7Affiliate: 'Adtraction und Daisycon: Tracking von Klicks auf Shop- und Partnerlinks',
    s8Body2: 'Wir nehmen über die Netzwerke Adtraction und Daisycon an Partnerprogrammen teil; zu unseren Partnern zählen finnische Shops und Marken wie Suomikauppa, Nordicbuddies, Finlayson und Scandinavian Outdoor. Wir verlinken auch Shops, die uns nichts zahlen. Wenn Sie über einen Partnerlink einen Kauf tätigen, erhalten wir ggf. eine kleine Provision, für Sie ohne zusätzliche Kosten.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '(Adtraction AB, Schweden, EU; Daisycon B.V., die Niederlande, EU): innerhalb des EWR.' },
  },
  ja: {
    s3Affiliate: { strong: 'アフィリエイトクッキー', body: 'アフィリエイトリンク（例：Adtraction / Daisycon のトラッキング）をクリックしたときに設定されます。紹介料の帰属に役立ちます。' },
    s7Affiliate: 'Adtraction、Daisycon：ショップ・パートナーリンクのクリック追跡',
    s8Body2: 'Adtraction と Daisycon の各ネットワークを通じてアフィリエイトプログラムに参加しています（パートナー例：Suomikauppa、Nordicbuddies、Finlayson、Scandinavian Outdoor などのフィンランドの店舗やブランド）。報酬の発生しない店舗にもリンクしています。アフィリエイトリンクからご購入された場合、お客様には追加費用なしで当社が手数料を受け取ることがあります。',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '（Adtraction AB（スウェーデン、EU）、Daisycon B.V.（オランダ、EU））：EEA 内。' },
  },
  es: {
    s3Affiliate: { strong: 'Cookies de afiliados', body: 'se establecen cuando hace clic en enlaces de afiliados (por ejemplo, seguimiento de Adtraction o Daisycon). Permiten atribuir las comisiones por referencia.' },
    s7Affiliate: 'Adtraction y Daisycon: seguimiento de clics en enlaces de tiendas y de afiliados',
    s8Body2: 'Participamos en programas de afiliación a través de las redes Adtraction y Daisycon; entre nuestros socios están tiendas y marcas finlandesas como Suomikauppa, Nordicbuddies, Finlayson y Scandinavian Outdoor. También enlazamos a tiendas que no nos pagan nada. Cuando hace clic en un enlace de afiliado y realiza una compra, podemos recibir una comisión sin costo adicional para usted.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '(Adtraction AB, Suecia, UE; Daisycon B.V., Países Bajos, UE): dentro del EEE.' },
  },
  'pt-BR': {
    s3Affiliate: { strong: 'Cookies de afiliados', body: 'definidos quando você clica em links de afiliados (por exemplo, rastreamento da Adtraction ou da Daisycon). Ajudam a atribuir as comissões de indicação.' },
    s7Affiliate: 'Adtraction e Daisycon: rastreamento de cliques em links de lojas e afiliados',
    s8Body2: 'Participamos de programas de afiliados por meio das redes Adtraction e Daisycon; entre os parceiros estão lojas e marcas finlandesas como Suomikauppa, Nordicbuddies, Finlayson e Scandinavian Outdoor. Também direcionamos a lojas que não nos pagam nada. Quando você clica em um link de afiliado e faz uma compra, podemos receber uma comissão sem custo adicional para você.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '(Adtraction AB, Suécia, UE; Daisycon B.V., Países Baixos, UE): dentro do EEE.' },
  },
  'zh-CN': {
    s3Affiliate: { strong: '联盟 cookie', body: '当您点击联盟链接（例如 Adtraction 或 Daisycon 追踪）时设置，用于归因推荐佣金。' },
    s7Affiliate: 'Adtraction 与 Daisycon：点击商店与合作伙伴链接的追踪',
    s8Body2: '我们通过 Adtraction 和 Daisycon 网络参与联盟计划，合作伙伴包括 Suomikauppa、Nordicbuddies、Finlayson、Scandinavian Outdoor 等芬兰商店和品牌。我们也会链接到不向我们付费的商店。当您点击联盟链接并完成购买时，我们可能获得佣金，而您无需承担任何额外费用。',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '（Adtraction AB，瑞典，欧盟；Daisycon B.V.，荷兰，欧盟）：位于欧洲经济区内。' },
  },
  ko: {
    s3Affiliate: { strong: '제휴 쿠키', body: '제휴 링크 클릭 시 설정(예: Adtraction, Daisycon 추적). 추천 수수료 귀속에 사용됩니다.' },
    s7Affiliate: 'Adtraction, Daisycon: 상점·파트너 링크 클릭 추적',
    s8Body2: '당사는 Adtraction과 Daisycon 네트워크를 통해 제휴 프로그램에 참여합니다. 파트너로는 Suomikauppa, Nordicbuddies, Finlayson, Scandinavian Outdoor 등 핀란드 상점과 브랜드가 있습니다. 당사에 아무런 대가를 지급하지 않는 상점으로도 연결합니다. 제휴 링크를 통해 구매를 하시면 귀하에게 추가 비용이 발생하지 않으며, 당사가 수수료를 받을 수 있습니다.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '(Adtraction AB, 스웨덴, EU; Daisycon B.V., 네덜란드, EU): EEA 내.' },
  },
  fr: {
    s3Affiliate: { strong: 'Cookies d\'affiliation', body: 'déposés lorsque vous cliquez sur un lien d\'affiliation (par exemple suivi Adtraction ou Daisycon). Ils permettent d\'attribuer les commissions de référencement.' },
    s7Affiliate: 'Adtraction et Daisycon : suivi des clics sur les liens de boutique et d\'affiliation',
    s8Body2: 'Nous participons à des programmes d\'affiliation via les réseaux Adtraction et Daisycon ; nos partenaires incluent des boutiques et marques finlandaises telles que Suomikauppa, Nordicbuddies, Finlayson et Scandinavian Outdoor. Nous renvoyons également vers des boutiques qui ne nous versent rien. Lorsque vous cliquez sur un lien d\'affiliation et effectuez un achat, nous pouvons percevoir une commission sans coût supplémentaire pour vous.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '(Adtraction AB, Suède, UE ; Daisycon B.V., Pays-Bas, UE) : au sein de l\'EEE.' },
  },
  it: {
    s3Affiliate: { strong: 'Cookie di affiliazione', body: 'impostati quando Lei clicca su link di affiliazione (ad esempio tracciamento Adtraction o Daisycon). Permettono di attribuire le commissioni di affiliazione.' },
    s7Affiliate: 'Adtraction e Daisycon: tracciamento dei clic su link di negozi e affiliazione',
    s8Body2: 'Partecipiamo a programmi di affiliazione tramite le reti Adtraction e Daisycon; tra i nostri partner figurano negozi e marchi finlandesi come Suomikauppa, Nordicbuddies, Finlayson e Scandinavian Outdoor. Rimandiamo anche a negozi che non ci corrispondono nulla. Quando Lei clicca su un link di affiliazione ed effettua un acquisto, potremmo ricevere una commissione senza costi aggiuntivi per Lei.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '(Adtraction AB, Svezia, UE; Daisycon B.V., Paesi Bassi, UE): all\'interno del SEE.' },
  },
  nl: {
    s3Affiliate: { strong: 'Affiliatecookies', body: 'geplaatst wanneer u op affiliatelinks klikt (bijv. Adtraction- of Daisycon-tracking). Deze helpen ons verwijzingscommissies toe te wijzen.' },
    s7Affiliate: 'Adtraction en Daisycon: tracking van klikken op winkel- en affiliatelinks',
    s8Body2: 'Wij nemen deel aan affiliateprogramma\'s via de netwerken Adtraction en Daisycon; tot onze partners behoren Finse winkels en merken zoals Suomikauppa, Nordicbuddies, Finlayson en Scandinavian Outdoor. Wij verwijzen ook naar winkels die ons niets betalen. Wanneer u op een affiliatelink klikt en een aankoop doet, kunnen wij een commissie ontvangen zonder extra kosten voor u.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '(Adtraction AB, Zweden, EU; Daisycon B.V., Nederland, EU): binnen de EER.' },
  },
  sv: {
    s3Affiliate: { strong: 'Affiliatecookies', body: 'placeras när du klickar på affiliatelänkar (t.ex. Adtraction- eller Daisycon-spårning). De hjälper oss att attribuera hänvisningsprovisioner.' },
    s7Affiliate: 'Adtraction och Daisycon: spårning av affiliatelänkar när du klickar på butiks- eller partnerlänkar',
    s8Body2: 'Vi deltar i affiliateprogram via nätverken Adtraction och Daisycon; bland våra partner finns finländska butiker och varumärken som Suomikauppa, Nordicbuddies, Finlayson och Scandinavian Outdoor. Vi länkar även till butiker som inte betalar oss något. När du klickar på en affiliatelänk och gör ett köp kan vi få en provision utan extra kostnad för dig.',
    s8aAffiliate: { strong: 'Adtraction / Daisycon', body: '(Adtraction AB, Sverige, EU; Daisycon B.V., Nederländerna, EU): inom EES.' },
  },
};

/**
 * Lentohaku (Travelpayouts), vain `flightSearch`-propilla (laplandflights.fi): rivi kohtaan 3 ja kohtaan 7.
 * Haravointimerkin alla samasta syystä kuin kumppanirivit: muut sivustot eivät lataa hakua.
 */
interface FlightSearchPrivacyCopy {
  s3Flight: { strong: string; body: string };
  s7Flight: string;
}

const FLIGHT_SEARCH_PRIVACY: Record<Lang, FlightSearchPrivacyCopy> = {
  en: {
    s3Flight: { strong: 'Flight search cookies', body: 'placed by the Travelpayouts flight search, which loads only after you accept cookies. Our Cookie Policy lists their names and durations.' },
    s7Flight: 'Travelpayouts: flight search, only after you accept cookies (results from Aviasales and its partners)',
  },
  fi: {
    s3Flight: { strong: 'Lentohaun evästeet', body: 'Travelpayoutsin lentohaku asettaa ne vasta, kun olet hyväksynyt evästeet. Evästekäytännössämme luetellaan niiden nimet ja kestot.' },
    s7Flight: 'Travelpayouts: lentohaku, vasta kun hyväksyt evästeet (tulokset Aviasalesilta ja sen kumppaneilta)',
  },
  de: {
    s3Flight: { strong: 'Cookies der Flugsuche', body: 'werden von der Flugsuche von Travelpayouts gesetzt, die erst geladen wird, wenn Sie Cookies akzeptieren. Namen und Speicherdauer stehen in unserer Cookie-Richtlinie.' },
    s7Flight: 'Travelpayouts: Flugsuche, erst wenn Sie Cookies akzeptieren (Ergebnisse von Aviasales und dessen Partnern)',
  },
  ja: {
    s3Flight: { strong: 'フライト検索のクッキー', body: 'Travelpayouts のフライト検索が設定します。この検索はクッキーに同意した後にのみ読み込まれます。名称と保存期間はクッキーポリシーに記載しています。' },
    s7Flight: 'Travelpayouts：フライト検索（クッキーへの同意後のみ、検索結果は Aviasales とそのパートナーが提供）',
  },
  es: {
    s3Flight: { strong: 'Cookies del buscador de vuelos', body: 'las establece el buscador de vuelos de Travelpayouts, que solo se carga cuando usted acepta las cookies. Nuestra Política de Cookies indica sus nombres y su duración.' },
    s7Flight: 'Travelpayouts: buscador de vuelos, solo si usted acepta las cookies (resultados de Aviasales y sus socios)',
  },
  'pt-BR': {
    s3Flight: { strong: 'Cookies da busca de voos', body: 'definidos pela busca de voos da Travelpayouts, que só carrega depois que você aceita os cookies. Nossa Política de Cookies lista os nomes e a duração deles.' },
    s7Flight: 'Travelpayouts: busca de voos, só depois que você aceita os cookies (resultados da Aviasales e de seus parceiros)',
  },
  'zh-CN': {
    s3Flight: { strong: '机票搜索 cookie', body: '由 Travelpayouts 机票搜索设置，该搜索只有在您接受 cookie 后才会加载。其名称和保留期限列于我们的 Cookie 政策中。' },
    s7Flight: 'Travelpayouts：机票搜索（仅在您接受 cookie 后；结果来自 Aviasales 及其合作伙伴）',
  },
  ko: {
    s3Flight: { strong: '항공권 검색 쿠키', body: 'Travelpayouts 항공권 검색이 설정하며, 이 검색은 쿠키에 동의하신 후에만 불러옵니다. 이름과 보관 기간은 쿠키 정책에 나와 있습니다.' },
    s7Flight: 'Travelpayouts: 항공권 검색(쿠키 동의 후에만, 검색 결과는 Aviasales와 그 파트너 제공)',
  },
  fr: {
    s3Flight: { strong: 'Cookies de la recherche de vols', body: "déposés par la recherche de vols de Travelpayouts, qui ne se charge qu'après votre acceptation des cookies. Notre politique de cookies indique leurs noms et leurs durées." },
    s7Flight: "Travelpayouts : recherche de vols, uniquement après votre acceptation des cookies (résultats d'Aviasales et de ses partenaires)",
  },
  it: {
    s3Flight: { strong: 'Cookie della ricerca voli', body: 'impostati dalla ricerca voli di Travelpayouts, che si carica solo dopo che Lei ha accettato i cookie. La nostra Informativa sui Cookie ne indica i nomi e la durata.' },
    s7Flight: 'Travelpayouts: ricerca voli, solo dopo che Lei ha accettato i cookie (risultati di Aviasales e dei suoi partner)',
  },
  nl: {
    s3Flight: { strong: 'Cookies van de vluchtzoeker', body: 'geplaatst door de vluchtzoeker van Travelpayouts, die pas wordt geladen nadat u cookies heeft geaccepteerd. Ons Cookiebeleid vermeldt hun namen en bewaartermijnen.' },
    s7Flight: 'Travelpayouts: vluchtzoeker, pas nadat u cookies heeft geaccepteerd (resultaten van Aviasales en zijn partners)',
  },
  sv: {
    s3Flight: { strong: 'Cookies för flygsökningen', body: 'placeras av Travelpayouts flygsök, som laddas först när du accepterar cookies. Namn och varaktighet finns i vår cookiepolicy.' },
    s7Flight: 'Travelpayouts: flygsök, först när du accepterar cookies (resultat från Aviasales och dess partner)',
  },
};
