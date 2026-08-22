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
  s5Title: string;
  s5Body: (unsubscribeLink: React.ReactNode) => React.ReactNode;
  s6Title: string;
  s6Body: string;
  s7Title: string;
  s7Intro: string;
  s7Items: string[];
  s8Title: string;
  s8Body1: (siteName: string) => string;
  s8Body2: string;
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
    lastUpdated: 'Last updated: July 2026',
    s1Title: '1. Controller',
    s1Body: () => <>LaPeso Oy (business ID 3309136-7), Finland. Email: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Data We Collect',
    s2Body: 'We collect anonymous analytics data via Google Analytics 4. If you subscribe to our newsletter, we store your email address securely. We do not collect any other personally identifiable information unless you contact us directly.',
    s2aTitle: '2a. Legal Basis for Processing (GDPR Art. 6)',
    s2aIntro: 'We rely on the following legal bases for each processing activity:',
    s2aItems: [
      { strong: 'Consent (Art. 6(1)(a))', body: 'for analytics cookies (Google Analytics 4) and any non-essential cookies. You give consent via the cookie banner and can withdraw it at any time.' },
      { strong: 'Consent (Art. 6(1)(a))', body: 'for newsletter subscription. You give consent by submitting the signup form; you can withdraw at any time via the unsubscribe link.' },
      { strong: 'Legitimate interest (Art. 6(1)(f))', body: 'for essential cookies (storing your consent preference) and for fraud-prevention / security logs. Our interest is operating a functioning website; this is balanced against your reasonable expectations.' },
      { strong: 'Legitimate interest (Art. 6(1)(f))', body: 'for affiliate-link click attribution. Our interest is being paid the commission we have earned editorially; the data collected is minimal (referral source) and you can decline by not clicking affiliate links.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Our website uses cookies to improve your browsing experience and to collect anonymous analytics data. These include:',
    s3Items: [
      { strong: 'Essential cookies', body: 'Required for the website to function properly (consent preferences, session data).' },
      { strong: 'Analytics cookies', body: 'Used by Google Analytics 4 to understand how visitors interact with our site. Collected anonymously.' },
      { strong: 'Affiliate cookies', body: 'Placed when you click affiliate links (e.g. Adtraction, Daisycon or Travelpayouts tracking). These help us attribute referral commissions.' },
    ],
    s3Tail: (cookieLink) => <>Analytics cookies are only placed after you give consent via the cookie banner. See our {cookieLink} for full details.</>,
    s4Title: '4. Google Analytics',
    s4Body: 'We use Google Analytics 4 with Consent Mode v2. If you decline cookies, no analytics data is collected. If you accept, anonymous usage data (pages viewed, time on site, general location by country) is sent to Google. No personal data is included.',
    s5Title: '5. Newsletter',
    s5Body: (unsub) => <>If you subscribe to our newsletter, your email address is stored securely via Resend and Supabase. You can unsubscribe at any time using the link in every email or via our {unsub}.</>,
    s6Title: '6. Data Retention',
    s6Body: 'Analytics data is retained for 14 months in Google Analytics. Newsletter emails are retained until you unsubscribe.',
    s7Title: '7. Third Parties',
    s7Intro: 'We do not sell or share your personal data with third parties. However, the following third-party services process data as part of our operations:',
    s7Items: [
      'Google Analytics, anonymous usage analytics',
      'Adtraction, Daisycon, Travelpayouts and Trip.com, affiliate link tracking when you click booking or partner links',
      'Resend, newsletter email delivery',
      'Supabase, backend database services',
      'Cloudflare, hosting and CDN',
    ],
    s8Title: '8. Advertising',
    s8Body1: (siteName) => `This site displays sponsored content from third-party advertisers. Sponsored content is clearly labeled with a "Sponsored" marker. Clicking sponsored links may redirect you to external websites with their own privacy policies. ${siteName} is not responsible for the data practices of external advertisers.`,
    s8Body2: 'We participate in affiliate programmes through the Adtraction, Daisycon and Travelpayouts networks and in the Trip.com partner programme; partners include Sembo, Lomarengas, Trip.com and EconomyBookings. When you click an affiliate link and make a purchase or booking, we may receive a commission at no additional cost to you.',
    s8aTitle: '8a. International Data Transfers',
    s8aIntro: 'Several of the third-party services we use are based in or transfer data to countries outside the European Economic Area (EEA), most commonly the United States:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, USA): covered by the EU–US Data Privacy Framework (DPF).' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., USA): covered by the EU–US Data Privacy Framework and Standard Contractual Clauses (SCCs).' },
      { strong: 'Resend', body: '(Resend Inc., USA): covered by Standard Contractual Clauses.' },
      { strong: 'Supabase', body: '(Supabase Inc., USA, with EU region hosting available): covered by Standard Contractual Clauses.' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Sweden, EU; Daisycon B.V., the Netherlands, EU; Travelpayouts and Trip.com, international): transfers outside the EU/EEA are covered by Standard Contractual Clauses.' },
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
    lastUpdated: 'Viimeksi päivitetty: heinäkuu 2026',
    s1Title: '1. Rekisterinpitäjä',
    s1Body: () => <>LaPeso Oy (Y-tunnus 3309136-7), Suomi. Sähköposti: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Mitä tietoja keräämme',
    s2Body: 'Keräämme anonyymejä kävijäanalytiikkatietoja Google Analytics 4:n kautta. Jos tilaat uutiskirjeemme, tallennamme sähköpostiosoitteesi turvallisesti. Emme kerää muuta tunnistettavaa henkilötietoa, ellet ota meihin yhteyttä suoraan.',
    s2aTitle: '2a. Käsittelyn oikeusperuste (GDPR 6 artikla)',
    s2aIntro: 'Käsittelemme henkilötietoja seuraavilla oikeusperusteilla:',
    s2aItems: [
      { strong: 'Suostumus (6 art. 1 kohta a)', body: 'analytiikkaevästeitä (Google Analytics 4) ja muita ei-välttämättömiä evästeitä varten. Annat suostumuksen evästebannerista ja voit perua sen milloin tahansa.' },
      { strong: 'Suostumus (6 art. 1 kohta a)', body: 'uutiskirjeen tilaamista varten. Annat suostumuksen lähettämällä tilauslomakkeen ja voit perua sen milloin tahansa peruutuslinkin kautta.' },
      { strong: 'Oikeutettu etu (6 art. 1 kohta f)', body: 'välttämättömien evästeiden (suostumusvalintasi tallentaminen) ja petostentorjunnan / lokien osalta. Oikeutettu etumme on toimivan verkkosivuston ylläpito, ja se on tasapainotettu suhteessa kohtuullisiin odotuksiisi.' },
      { strong: 'Oikeutettu etu (6 art. 1 kohta f)', body: 'kumppanilinkkien klikkausten kohdentamiseen. Oikeutettu etumme on saada toimituksellisesti ansaitsemamme komissio; kerättävät tiedot ovat vähäisiä (lähde) ja voit halutessasi olla klikkaamatta kumppanilinkkejä.' },
    ],
    s3Title: '3. Evästeet',
    s3Intro: 'Sivustomme käyttää evästeitä parantaakseen selailukokemustasi ja kerätäkseen anonyymejä analytiikkatietoja. Käytämme seuraavia evästeitä:',
    s3Items: [
      { strong: 'Välttämättömät evästeet', body: 'tarvitaan sivuston toiminnan kannalta (suostumusvalinta, istuntotiedot).' },
      { strong: 'Analytiikkaevästeet', body: 'Google Analytics 4 käyttää näitä ymmärtääkseen, miten kävijät käyttävät sivustoa. Kerätään anonyymisti.' },
      { strong: 'Kumppanievästeet', body: 'asetetaan, kun klikkaat kumppanilinkkiä (esim. Adtraction-, Daisycon- tai Travelpayouts-seuranta). Näiden avulla varauspalvelut kohdistavat komission oikealle lähteelle.' },
    ],
    s3Tail: (cookieLink) => <>Analytiikkaevästeet asetetaan vasta sen jälkeen, kun olet antanut suostumuksesi evästebannerista. Katso täydelliset tiedot {cookieLink}.</>,
    s4Title: '4. Google Analytics',
    s4Body: 'Käytämme Google Analytics 4:ää Consent Mode v2 ‑tilassa. Jos hylkäät evästeet, analytiikkatietoa ei kerätä. Jos hyväksyt, anonyymejä käyttötietoja (katsotut sivut, kävijän viipymä, yleinen maantieteellinen sijainti maan tarkkuudella) lähetetään Googlelle. Henkilötietoja ei sisälly.',
    s5Title: '5. Uutiskirje',
    s5Body: (unsub) => <>Kun tilaat uutiskirjeemme, sähköpostiosoitteesi tallennetaan turvallisesti Resendin ja Supabasen kautta. Voit perua tilauksesi milloin tahansa jokaisesta viestistä löytyvällä linkillä tai {unsub}.</>,
    s6Title: '6. Tietojen säilytys',
    s6Body: 'Analytiikkatietoja säilytetään Google Analyticsissä 14 kuukautta. Uutiskirjeen sähköpostiosoitteet säilytetään, kunnes perut tilauksen.',
    s7Title: '7. Kolmannet osapuolet',
    s7Intro: 'Emme myy tai jaa henkilötietojasi kolmansille osapuolille. Seuraavat palveluntarjoajat kuitenkin käsittelevät tietoja toimintamme yhteydessä:',
    s7Items: [
      'Google Analytics, anonyymi käyttöanalytiikka',
      'Adtraction, Daisycon, Travelpayouts ja Trip.com, kumppanilinkkien klikkauksen seuranta varaus- ja kumppanilinkeille',
      'Resend, uutiskirjeiden lähetys',
      'Supabase, taustatietokantapalvelut',
      'Cloudflare, sivuston ylläpito ja CDN',
    ],
    s8Title: '8. Mainonta',
    s8Body1: (siteName) => `Sivustolla näytetään kolmansien osapuolten sponsoroitua sisältöä. Sponsoroitu sisältö on merkitty selkeästi "Sponsoroitu"-tunnisteella. Sponsoroidun linkin klikkaaminen voi ohjata sinut ulkoiselle sivustolle, jolla on oma tietosuojakäytäntönsä. ${siteName} ei vastaa ulkoisten mainostajien tietosuojakäytännöistä.`,
    s8Body2: 'Osallistumme kumppaniohjelmiin Adtraction-, Daisycon- ja Travelpayouts-verkostojen sekä Trip.comin kumppaniohjelman kautta; kumppaneitamme ovat mm. Sembo, Lomarengas, Trip.com ja EconomyBookings. Kun klikkaat kumppanilinkkiä ja teet ostoksen tai varauksen, voimme saada pienen komission ilman lisäkustannuksia sinulle.',
    s8aTitle: '8a. Kansainväliset tiedonsiirrot',
    s8aIntro: 'Useat käyttämämme palveluntarjoajat sijaitsevat ETA-alueen ulkopuolella tai siirtävät tietoja sen ulkopuolelle, useimmiten Yhdysvaltoihin:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, Yhdysvallat): kuuluu EU–US Data Privacy Framework (DPF) -järjestelyyn.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., Yhdysvallat): kuuluu EU–US Data Privacy Framework -järjestelyyn ja hyödyntää vakiosopimuslausekkeita (SCC).' },
      { strong: 'Resend', body: '(Resend Inc., Yhdysvallat): hyödyntää vakiosopimuslausekkeita (SCC).' },
      { strong: 'Supabase', body: '(Supabase Inc., Yhdysvallat, EU-alueen palvelinvaihtoehto saatavilla): hyödyntää vakiosopimuslausekkeita (SCC).' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Ruotsi, EU; Daisycon B.V., Alankomaat, EU; Travelpayouts ja Trip.com, kansainväliset): EU/ETA-alueen ulkopuoliset siirrot on katettu vakiosopimuslausekkein (SCC).' },
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
    lastUpdated: 'Zuletzt aktualisiert: Juli 2026',
    s1Title: '1. Verantwortlicher',
    s1Body: () => <>LaPeso Oy (Handelsregisternummer 3309136-7), Finnland. E-Mail: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Welche Daten wir erheben',
    s2Body: 'Wir erheben anonyme Analysedaten über Google Analytics 4. Wenn Sie unseren Newsletter abonnieren, speichern wir Ihre E-Mail-Adresse sicher. Weitere personenbezogene Daten erheben wir nicht, sofern Sie uns nicht direkt kontaktieren.',
    s2aTitle: '2a. Rechtsgrundlage der Verarbeitung (Art. 6 DSGVO)',
    s2aIntro: 'Wir stützen uns auf folgende Rechtsgrundlagen:',
    s2aItems: [
      { strong: 'Einwilligung (Art. 6 Abs. 1 lit. a)', body: 'für Analyse-Cookies (Google Analytics 4) und sonstige nicht erforderliche Cookies. Sie erteilen die Einwilligung über das Cookie-Banner und können sie jederzeit widerrufen.' },
      { strong: 'Einwilligung (Art. 6 Abs. 1 lit. a)', body: 'für das Newsletter-Abonnement. Sie erteilen die Einwilligung durch das Absenden des Anmeldeformulars und können sie jederzeit über den Abmeldelink widerrufen.' },
      { strong: 'Berechtigtes Interesse (Art. 6 Abs. 1 lit. f)', body: 'für essenzielle Cookies (Speicherung Ihrer Einwilligungswahl) sowie Betrugs- und Sicherheitsprotokolle. Unser Interesse ist der Betrieb einer funktionsfähigen Website und steht im Einklang mit Ihren berechtigten Erwartungen.' },
      { strong: 'Berechtigtes Interesse (Art. 6 Abs. 1 lit. f)', body: 'für die Zuordnung von Klicks auf Partnerlinks. Unser Interesse besteht darin, die redaktionell verdiente Provision zu erhalten; die erhobenen Daten sind minimal (Referrer) und Sie können auf das Anklicken der Partnerlinks verzichten.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Unsere Website verwendet Cookies, um Ihr Surferlebnis zu verbessern und anonyme Analysedaten zu erheben. Dazu zählen:',
    s3Items: [
      { strong: 'Essenzielle Cookies', body: 'für die Funktion der Website erforderlich (Einwilligungswahl, Sitzungsdaten).' },
      { strong: 'Analyse-Cookies', body: 'werden von Google Analytics 4 verwendet, um zu verstehen, wie Besucher die Website nutzen. Anonyme Erfassung.' },
      { strong: 'Partner-Cookies', body: 'werden gesetzt, wenn Sie auf Partnerlinks klicken (z. B. Adtraction, Daisycon- oder Travelpayouts-Tracking). So lassen sich Provisionen korrekt zuordnen.' },
    ],
    s3Tail: (cookieLink) => <>Analyse-Cookies werden erst nach Ihrer Einwilligung über das Cookie-Banner gesetzt. Vollständige Angaben siehe {cookieLink}.</>,
    s4Title: '4. Google Analytics',
    s4Body: 'Wir verwenden Google Analytics 4 mit Consent Mode v2. Wenn Sie Cookies ablehnen, werden keine Analysedaten erhoben. Bei Ihrer Zustimmung werden anonyme Nutzungsdaten (aufgerufene Seiten, Verweildauer, Land) an Google übermittelt. Personenbezogene Daten sind nicht enthalten.',
    s5Title: '5. Newsletter',
    s5Body: (unsub) => <>Wenn Sie unseren Newsletter abonnieren, wird Ihre E-Mail-Adresse über Resend und Supabase sicher gespeichert. Sie können sich jederzeit über den Link in jeder E-Mail abmelden oder über {unsub}.</>,
    s6Title: '6. Speicherdauer',
    s6Body: 'Analysedaten werden in Google Analytics 14 Monate gespeichert. Newsletter-E-Mail-Adressen werden bis zur Abmeldung gespeichert.',
    s7Title: '7. Dritte',
    s7Intro: 'Wir verkaufen oder geben Ihre personenbezogenen Daten nicht an Dritte weiter. Folgende Dienste verarbeiten im Rahmen unseres Betriebs Daten:',
    s7Items: [
      'Google Analytics, anonyme Nutzungsanalyse',
      'Adtraction, Daisycon, Travelpayouts und Trip.com, Tracking von Partnerlinks bei Klicks auf Buchungs- und Partnerlinks',
      'Resend, Newsletter-Versand',
      'Supabase, Backend- und Datenbankdienste',
      'Cloudflare, Hosting und CDN',
    ],
    s8Title: '8. Werbung',
    s8Body1: (siteName) => `Diese Website zeigt gesponserte Inhalte Dritter. Gesponserte Inhalte sind eindeutig mit „Gesponsert" gekennzeichnet. Beim Klicken auf gesponserte Links werden Sie ggf. auf externe Websites mit eigenen Datenschutzrichtlinien weitergeleitet. ${siteName} ist nicht für die Datenpraxis externer Werbetreibender verantwortlich.`,
    s8Body2: 'Wir nehmen über die Netzwerke Adtraction, Daisycon und Travelpayouts sowie am Partnerprogramm von Trip.com an Partnerprogrammen teil; zu unseren Partnern zählen Sembo, Lomarengas, Trip.com und EconomyBookings. Wenn Sie über einen Partnerlink eine Buchung oder einen Kauf tätigen, erhalten wir ggf. eine kleine Provision, für Sie ohne zusätzliche Kosten.',
    s8aTitle: '8a. Internationale Datenübermittlungen',
    s8aIntro: 'Einige der von uns genutzten Dienste haben ihren Sitz außerhalb des Europäischen Wirtschaftsraums (EWR) oder übermitteln Daten dorthin, meist in die USA:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, USA): abgedeckt durch das EU-US Data Privacy Framework (DPF).' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., USA): abgedeckt durch das EU-US Data Privacy Framework und Standardvertragsklauseln (SCC).' },
      { strong: 'Resend', body: '(Resend Inc., USA): abgedeckt durch Standardvertragsklauseln.' },
      { strong: 'Supabase', body: '(Supabase Inc., USA, EU-Region verfügbar): abgedeckt durch Standardvertragsklauseln.' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Schweden, EU; Daisycon B.V., die Niederlande, EU; Travelpayouts und Trip.com, international): Übermittlungen außerhalb der EU/des EWR sind durch Standardvertragsklauseln abgedeckt.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Deutschland): innerhalb des EWR.' },
    ],
    s8aTail: 'In jedem Fall ist die Übermittlung durch einen Angemessenheitsbeschluss, das EU-US Data Privacy Framework oder von der Europäischen Kommission genehmigte Standardvertragsklauseln abgesichert. Eine Kopie der relevanten Schutzmaßnahmen erhalten Sie auf Anfrage.',
    s9Title: '9. Ihre Rechte nach DSGVO',
    s9Intro: 'Da wir aus Finnland tätig sind und Besucher aus der Europäischen Union bedienen, gilt die DSGVO vollumfänglich. Sie haben folgende Rechte:',
    s9Items: [
      { strong: 'Auskunftsrecht (Art. 15)', body: 'Anforderung einer Kopie der über Sie gespeicherten personenbezogenen Daten.' },
      { strong: 'Recht auf Berichtigung (Art. 16)', body: 'Berichtigung unrichtiger oder unvollständiger Daten.' },
      { strong: 'Recht auf Löschung („Recht auf Vergessenwerden", Art. 17)', body: 'Löschung Ihrer Daten, sofern kein vorrangiger Grund zur Speicherung besteht.' },
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
    s12Body: 'Wir können diese Datenschutzerklärung gelegentlich aktualisieren. Das oben angegebene Datum „Zuletzt aktualisiert" zeigt die jüngste Überarbeitung. Wesentliche Änderungen werden mindestens 14 Tage auf der Startseite hervorgehoben.',
    backToHome: '← Zurück zur Startseite',
    cookiePolicy: 'Cookie-Richtlinie →',
  },
  ja: {
    h1: 'プライバシーポリシー',
    lastUpdated: '最終更新: 2026年7月',
    s1Title: '1. 管理者',
    s1Body: () => <>LaPeso Oy (ID 3309136-7), フィンランド。メール: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. 収集するデータ',
    s2Body: 'Google Analytics 4 を通じて匿名のアクセス解析データを収集しています。ニュースレターにご登録いただいた場合は、メールアドレスを安全に保管します。それ以外の個人を識別できる情報は、お客様から直接ご連絡をいただかない限り収集しません。',
    s2aTitle: '2a. 処理の法的根拠(GDPR 第6条)',
    s2aIntro: '各処理活動について、以下の法的根拠に基づいて処理しています:',
    s2aItems: [
      { strong: '同意(第6条1(a))', body: '解析クッキー(Google Analytics 4)および非必須クッキーについて。クッキーバナーで同意していただき、いつでも撤回できます。' },
      { strong: '同意(第6条1(a))', body: 'ニュースレターの登録について。登録フォームの送信で同意となり、配信停止リンクからいつでも撤回できます。' },
      { strong: '正当な利益(第6条1(f))', body: '必須クッキー(同意設定の保存)および不正防止・セキュリティログについて。当方の利益は機能するウェブサイトの運営であり、お客様の合理的な期待とバランスが取れています。' },
      { strong: '正当な利益(第6条1(f))', body: 'アフィリエイトリンクのクリック帰属について。当方の利益は編集上獲得した紹介料を受け取ることです。収集されるデータは最小限(参照元)で、アフィリエイトリンクをクリックしないことで回避できます。' },
    ],
    s3Title: '3. クッキー',
    s3Intro: 'ブラウジング体験の向上と匿名のアクセス解析のため、当サイトではクッキーを使用しています。以下が含まれます:',
    s3Items: [
      { strong: '必須クッキー', body: 'ウェブサイトの正常な動作に必要(同意設定、セッションデータ)。' },
      { strong: '解析クッキー', body: 'Google Analytics 4 がサイトの利用状況を把握するために使用。匿名で収集。' },
      { strong: 'アフィリエイトクッキー', body: 'アフィリエイトリンク(例: Adtraction / Daisycon / Travelpayouts のトラッキング)をクリックしたときに設定されます。紹介料の帰属に役立ちます。' },
    ],
    s3Tail: (cookieLink) => <>解析クッキーは、クッキーバナーで同意をいただいた後にのみ設定されます。詳細は{cookieLink}をご覧ください。</>,
    s4Title: '4. Google Analytics',
    s4Body: 'Consent Mode v2 を有効にした Google Analytics 4 を使用しています。クッキーを拒否された場合、解析データは収集されません。同意いただいた場合は、匿名の利用データ(閲覧ページ、滞在時間、国レベルの一般位置情報)が Google に送信されます。個人情報は含まれません。',
    s5Title: '5. ニュースレター',
    s5Body: (unsub) => <>ニュースレターにご登録いただくと、メールアドレスは Resend と Supabase を通じて安全に保管されます。配信停止は、各メール内のリンクまたは{unsub}からいつでも可能です。</>,
    s6Title: '6. データの保管期間',
    s6Body: '解析データは Google Analytics 内で14ヶ月間保管されます。ニュースレターのメールアドレスは、配信停止までの間保管されます。',
    s7Title: '7. 第三者',
    s7Intro: '個人情報を第三者に販売・共有することはありません。ただし、運営の一環として以下の第三者サービスがデータを処理しています:',
    s7Items: [
      'Google Analytics, 匿名の利用分析',
      'Adtraction、Daisycon、Travelpayouts、Trip.com, 予約・パートナーリンクのクリック追跡',
      'Resend, ニュースレターの配信',
      'Supabase, バックエンド・データベースサービス',
      'Cloudflare, ホスティングと CDN',
    ],
    s8Title: '8. 広告',
    s8Body1: (siteName) => `本サイトには第三者によるスポンサーコンテンツが表示されることがあります。スポンサーコンテンツは「PR」マークで明確に識別されます。スポンサーリンクをクリックすると、独自のプライバシーポリシーを持つ外部サイトに移動する場合があります。${siteName} は外部広告主のデータ取り扱いについて責任を負いません。`,
    s8Body2: 'Adtraction と Daisycon と Travelpayouts のネットワーク、および Trip.com のパートナープログラムを通じてアフィリエイトプログラムに参加しています(パートナー例: Sembo、Lomarengas、Trip.com、EconomyBookings)。アフィリエイトリンクからご予約・ご購入された場合、お客様には追加費用なしで当社が手数料を受け取ることがあります。',
    s8aTitle: '8a. 国際的なデータ移転',
    s8aIntro: '当方が利用している第三者サービスの一部は、欧州経済領域(EEA)外、特に米国を拠点としているか、データを移転しています:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, 米国)：EU–US Data Privacy Framework (DPF) の対象。' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., 米国)：EU–US Data Privacy Framework と標準契約条項(SCC)の対象。' },
      { strong: 'Resend', body: '(Resend Inc., 米国)：標準契約条項(SCC)の対象。' },
      { strong: 'Supabase', body: '(Supabase Inc., 米国、EU リージョン利用可能)：標準契約条項(SCC)の対象。' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB(スウェーデン、EU)、Daisycon B.V.(オランダ、EU)、Travelpayouts と Trip.com(国際)):EU/EEA 域外への移転は標準契約条項(SCC)の対象です。' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, ドイツ)：EEA 内。' },
    ],
    s8aTail: 'いずれの場合も、移転は欧州委員会の十分性決定、EU–US Data Privacy Framework、または欧州委員会承認の標準契約条項によって保護されています。関連する保護措置のコピーは、お問い合わせにより提供可能です。',
    s9Title: '9. GDPR に基づくお客様の権利',
    s9Intro: '当方はフィンランドを拠点に EU 居住者にサービスを提供しているため、GDPR が完全に適用されます。お客様には以下の権利があります:',
    s9Items: [
      { strong: 'アクセス権(第15条)', body: '当方が保持しているお客様の個人データのコピーを請求できます。' },
      { strong: '訂正権(第16条)', body: '不正確または不完全なデータの訂正を求めることができます。' },
      { strong: '削除権(忘れられる権利、第17条)', body: '保管する優先理由がない場合、データの削除を求めることができます。' },
      { strong: '処理制限権(第18条)', body: '問題が解決するまで処理を一時停止するよう求めることができます。' },
      { strong: 'データポータビリティ権(第20条)', body: '構造化された機械可読形式でデータを受け取れます。' },
      { strong: '異議権(第21条)', body: '正当な利益に基づく処理(ダイレクトマーケティングを含む)に異議を申し立てられます。' },
      { strong: '同意撤回権', body: 'いつでも、撤回時点から効力を持って撤回できます。' },
      { strong: '監督機関への苦情申立権(第77条)', body: 'フィンランドのデータ保護オンブズマン(Tietosuojavaltuutettu、tietosuoja.fi)、または EU 内のお客様の常居所地の監督機関に申立てられます。' },
    ],
    s9Tail: (email) => <>これらの権利を行使するには、{email} までご連絡ください。1ヶ月以内に対応いたします。</>,
    s10Title: '10. 自動化された意思決定',
    s10Body: 'GDPR 第22条の意味における、お客様に法的または同等に重要な影響を与える自動意思決定、プロファイリング、その他の処理は行っていません。',
    s11Title: '11. 子ども',
    s11Body: '本サイトおよびニュースレターは大人向けです。13歳未満の子ども(フィンランド法および GDPR でのデジタルサービス年齢基準)から意図的にデータを収集することはありません。子どもが個人情報を提供したと思われる場合は、お知らせください。削除いたします。',
    s12Title: '12. 本ポリシーの変更',
    s12Body: '本プライバシーポリシーは随時更新されることがあります。冒頭の「最終更新」日付が直近の改訂を反映しています。重要な変更については、ホームページで少なくとも14日間お知らせします。',
    backToHome: '← ホームへ戻る',
    cookiePolicy: 'クッキーポリシー →',
  },
  es: {
    h1: 'Política de Privacidad',
    lastUpdated: 'Última actualización: julio de 2026',
    s1Title: '1. Responsable del Tratamiento',
    s1Body: () => <>LaPeso Oy (ID 3309136-7), Finlandia. Correo electrónico: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Datos que recopilamos',
    s2Body: 'Recopilamos datos analíticos anónimos a través de Google Analytics 4. Si se suscribe a nuestro boletín, almacenamos su dirección de correo electrónico de forma segura. No recogemos ningún otro dato personal identificable salvo que usted nos contacte directamente.',
    s2aTitle: '2a. Base jurídica del tratamiento (Art. 6 RGPD)',
    s2aIntro: 'Nos basamos en las siguientes bases jurídicas para cada actividad de tratamiento:',
    s2aItems: [
      { strong: 'Consentimiento (Art. 6(1)(a))', body: 'para las cookies analíticas (Google Analytics 4) y demás cookies no esenciales. Usted otorga su consentimiento a través del banner de cookies y puede retirarlo en cualquier momento.' },
      { strong: 'Consentimiento (Art. 6(1)(a))', body: 'para la suscripción al boletín. Usted otorga su consentimiento al enviar el formulario de alta y puede retirarlo en cualquier momento mediante el enlace para darse de baja.' },
      { strong: 'Interés legítimo (Art. 6(1)(f))', body: 'para las cookies esenciales (almacenamiento de su preferencia de consentimiento) y los registros de prevención de fraude y seguridad. Nuestro interés es operar un sitio web funcional, equilibrado con sus expectativas razonables.' },
      { strong: 'Interés legítimo (Art. 6(1)(f))', body: 'para la atribución de clics en enlaces de afiliados. Nuestro interés es cobrar la comisión editorial que hemos ganado; los datos recogidos son mínimos (fuente de referencia) y usted puede optar por no hacer clic en los enlaces de afiliados.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación y recopilar datos analíticos anónimos. Estas incluyen:',
    s3Items: [
      { strong: 'Cookies esenciales', body: 'necesarias para el funcionamiento correcto del sitio (preferencias de consentimiento, datos de sesión).' },
      { strong: 'Cookies analíticas', body: 'utilizadas por Google Analytics 4 para entender cómo interactúan los visitantes con nuestro sitio. Se recogen de forma anónima.' },
      { strong: 'Cookies de afiliados', body: 'se establecen cuando hace clic en enlaces de afiliados (por ejemplo, seguimiento de Adtraction, Daisycon o Travelpayouts). Permiten atribuir las comisiones por referencia.' },
    ],
    s3Tail: (cookieLink) => <>Las cookies analíticas solo se establecen tras su consentimiento mediante el banner de cookies. Consulte nuestra {cookieLink} para más detalles.</>,
    s4Title: '4. Google Analytics',
    s4Body: 'Utilizamos Google Analytics 4 con Consent Mode v2. Si rechaza las cookies, no se recopila ningún dato analítico. Si acepta, se envían a Google datos de uso anónimos (páginas vistas, tiempo en el sitio, ubicación general por país). No se incluye ningún dato personal.',
    s5Title: '5. Boletín',
    s5Body: (unsub) => <>Si se suscribe a nuestro boletín, su dirección de correo electrónico se almacena de forma segura a través de Resend y Supabase. Puede darse de baja en cualquier momento mediante el enlace de cada correo o a través de nuestra {unsub}.</>,
    s6Title: '6. Conservación de los datos',
    s6Body: 'Los datos analíticos se conservan durante 14 meses en Google Analytics. Las direcciones de correo del boletín se conservan hasta que usted se da de baja.',
    s7Title: '7. Terceros',
    s7Intro: 'No vendemos ni compartimos sus datos personales con terceros. No obstante, los siguientes servicios externos procesan datos como parte de nuestras operaciones:',
    s7Items: [
      'Google Analytics, analítica de uso anónima',
      'Adtraction, Daisycon, Travelpayouts y Trip.com, seguimiento de clics en enlaces de reserva y de afiliados',
      'Resend, envío de boletines por correo electrónico',
      'Supabase, servicios de base de datos en el backend',
      'Cloudflare, alojamiento y CDN',
    ],
    s8Title: '8. Publicidad',
    s8Body1: (siteName) => `Este sitio muestra contenido patrocinado de terceros anunciantes. El contenido patrocinado está claramente identificado con la etiqueta "Patrocinado". Al hacer clic en enlaces patrocinados puede ser redirigido a sitios externos con sus propias políticas de privacidad. ${siteName} no es responsable de las prácticas de tratamiento de datos de los anunciantes externos.`,
    s8Body2: 'Participamos en programas de afiliación a través de las redes Adtraction, Daisycon y Travelpayouts y del programa de socios de Trip.com; entre nuestros socios están Sembo, Lomarengas, Trip.com y EconomyBookings. Cuando hace clic en un enlace de afiliado y realiza una compra o reserva, podemos recibir una comisión sin coste adicional para usted.',
    s8aTitle: '8a. Transferencias internacionales de datos',
    s8aIntro: 'Varios de los servicios externos que utilizamos tienen su sede o transfieren datos a países fuera del Espacio Económico Europeo (EEE), normalmente Estados Unidos:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, EE. UU.): amparado por el Marco de Privacidad de Datos UE–EE. UU. (DPF).' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., EE. UU.): amparado por el Marco de Privacidad de Datos UE–EE. UU. y por Cláusulas Contractuales Tipo (CCT).' },
      { strong: 'Resend', body: '(Resend Inc., EE. UU.): amparado por Cláusulas Contractuales Tipo.' },
      { strong: 'Supabase', body: '(Supabase Inc., EE. UU., con alojamiento disponible en región UE): amparado por Cláusulas Contractuales Tipo.' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Suecia, UE; Daisycon B.V., Países Bajos, UE; Travelpayouts y Trip.com, internacionales): las transferencias fuera de la UE/EEE están amparadas por Cláusulas Contractuales Tipo.' },
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
    lastUpdated: 'Última atualização: julho de 2026',
    s1Title: '1. Controlador',
    s1Body: () => <>LaPeso Oy (registro 3309136-7), Finlândia. E-mail: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Dados que coletamos',
    s2Body: 'Coletamos dados analíticos anônimos por meio do Google Analytics 4. Se você se inscrever em nosso boletim, armazenamos seu endereço de e-mail com segurança. Não coletamos nenhuma outra informação pessoal identificável, a menos que você entre em contato conosco diretamente.',
    s2aTitle: '2a. Base legal para o tratamento (Art. 6º do GDPR / LGPD)',
    s2aIntro: 'Apoiamo-nos nas seguintes bases legais para cada atividade de tratamento (GDPR europeu e LGPD brasileira):',
    s2aItems: [
      { strong: 'Consentimento (Art. 6(1)(a) GDPR / Art. 7º, I LGPD)', body: 'para cookies analíticos (Google Analytics 4) e demais cookies não essenciais. Você concede o consentimento pelo banner de cookies e pode retirá-lo a qualquer momento.' },
      { strong: 'Consentimento (Art. 6(1)(a) GDPR / Art. 7º, I LGPD)', body: 'para a inscrição no boletim. Você concede o consentimento ao enviar o formulário e pode retirá-lo a qualquer momento pelo link de cancelamento.' },
      { strong: 'Interesse legítimo (Art. 6(1)(f) GDPR / Art. 7º, IX LGPD)', body: 'para cookies essenciais (armazenamento da sua preferência de consentimento) e registros de prevenção a fraudes e segurança. Nosso interesse é manter um site funcional, equilibrado com suas expectativas razoáveis.' },
      { strong: 'Interesse legítimo (Art. 6(1)(f) GDPR / Art. 7º, IX LGPD)', body: 'para atribuição de cliques em links de afiliados. Nosso interesse é receber a comissão editorial conquistada; os dados coletados são mínimos (origem) e você pode optar por não clicar nos links de afiliados.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Nosso site usa cookies para melhorar sua experiência de navegação e coletar dados analíticos anônimos. Incluem:',
    s3Items: [
      { strong: 'Cookies essenciais', body: 'necessários para o funcionamento adequado do site (preferências de consentimento, dados de sessão).' },
      { strong: 'Cookies analíticos', body: 'usados pelo Google Analytics 4 para entender como os visitantes interagem com nosso site. Coletados de forma anônima.' },
      { strong: 'Cookies de afiliados', body: 'definidos quando você clica em links de afiliados (por exemplo, rastreamento da Adtraction, Daisycon ou da Travelpayouts). Ajudam a atribuir as comissões de indicação.' },
    ],
    s3Tail: (cookieLink) => <>Os cookies analíticos só são definidos após você consentir pelo banner. Veja nossa {cookieLink} para mais detalhes.</>,
    s4Title: '4. Google Analytics',
    s4Body: 'Usamos o Google Analytics 4 com Consent Mode v2. Se você recusar os cookies, nenhum dado analítico será coletado. Se aceitar, dados de uso anônimos (páginas visitadas, tempo no site, localização geral por país) são enviados ao Google. Nenhum dado pessoal é incluído.',
    s5Title: '5. Boletim',
    s5Body: (unsub) => <>Ao se inscrever no nosso boletim, seu endereço de e-mail é armazenado com segurança pela Resend e Supabase. Você pode cancelar a qualquer momento pelo link em cada e-mail ou pela nossa {unsub}.</>,
    s6Title: '6. Retenção de dados',
    s6Body: 'Os dados analíticos são retidos por 14 meses no Google Analytics. Os e-mails do boletim ficam armazenados até você cancelar a inscrição.',
    s7Title: '7. Terceiros',
    s7Intro: 'Não vendemos nem compartilhamos seus dados pessoais com terceiros. Contudo, os seguintes serviços externos processam dados como parte de nossas operações:',
    s7Items: [
      'Google Analytics, analítica de uso anônima',
      'Adtraction, Daisycon, Travelpayouts e Trip.com, rastreamento de cliques em links de reserva e afiliados',
      'Resend, envio de boletins por e-mail',
      'Supabase, serviços de banco de dados no backend',
      'Cloudflare, hospedagem e CDN',
    ],
    s8Title: '8. Publicidade',
    s8Body1: (siteName) => `Este site exibe conteúdo patrocinado de anunciantes terceiros. O conteúdo patrocinado é claramente identificado com a marcação "Patrocinado". Clicar em links patrocinados pode redirecioná-lo a sites externos com suas próprias políticas de privacidade. O ${siteName} não é responsável pelas práticas de dados de anunciantes externos.`,
    s8Body2: 'Participamos de programas de afiliados por meio das redes Adtraction, Daisycon e Travelpayouts e do programa de parceiros da Trip.com; entre os parceiros estão Sembo, Lomarengas, Trip.com e EconomyBookings. Quando você clica em um link de afiliado e faz uma compra ou reserva, podemos receber uma comissão sem custo adicional para você.',
    s8aTitle: '8a. Transferências internacionais de dados',
    s8aIntro: 'Vários dos serviços externos que utilizamos estão sediados ou transferem dados para países fora do Espaço Econômico Europeu (EEE), mais comumente os Estados Unidos:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, EUA): coberto pelo Quadro de Privacidade de Dados UE–EUA (DPF).' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., EUA): coberto pelo Quadro de Privacidade de Dados UE–EUA e pelas Cláusulas Contratuais Padrão (CCP).' },
      { strong: 'Resend', body: '(Resend Inc., EUA): coberto pelas Cláusulas Contratuais Padrão.' },
      { strong: 'Supabase', body: '(Supabase Inc., EUA, com hospedagem disponível na região UE): coberto pelas Cláusulas Contratuais Padrão.' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Suécia, UE; Daisycon B.V., Países Baixos, UE; Travelpayouts e Trip.com, internacionais): transferências para fora da UE/EEE são cobertas pelas Cláusulas Contratuais Padrão.' },
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
      { strong: 'Direito de retirar o consentimento (Art. 8º, §5º LGPD)', body: 'a qualquer momento, com efeito a partir da retirada.' },
      { strong: 'Direito de apresentar reclamação (Art. 77 GDPR / Art. 18, IV LGPD)', body: 'à Autoridade Finlandesa de Proteção de Dados (Tietosuojavaltuutettu) em tietosuoja.fi, à autoridade do seu país de residência habitual na UE, ou à ANPD no Brasil (anpd.gov.br).' },
    ],
    s9Tail: (email) => <>Para exercer qualquer um desses direitos, entre em contato em {email}. Responderemos no prazo de um mês.</>,
    s10Title: '10. Decisões automatizadas',
    s10Body: 'Não realizamos decisões automatizadas, criação de perfis nem qualquer outro tratamento que produza efeitos jurídicos ou de relevância similar sobre você, nos termos do Art. 22 do GDPR e do Art. 20 da LGPD.',
    s11Title: '11. Crianças',
    s11Body: 'Este site e nosso boletim são destinados a adultos. Não coletamos intencionalmente dados de crianças menores de 13 anos (idade mínima para serviços digitais segundo a lei finlandesa, o GDPR e a LGPD). Se você acredita que uma criança nos forneceu dados pessoais, entre em contato e os excluiremos.',
    s12Title: '12. Alterações nesta política',
    s12Body: 'Podemos atualizar esta Política de Privacidade periodicamente. A data de "Última atualização" no topo reflete a revisão mais recente. Mudanças relevantes serão sinalizadas na página inicial por pelo menos 14 dias.',
    backToHome: '← Voltar para a página inicial',
    cookiePolicy: 'Política de Cookies →',
  },
  'zh-CN': {
    h1: '隐私政策',
    lastUpdated: '最后更新:2026年7月',
    s1Title: '1. 数据控制者',
    s1Body: () => <>LaPeso Oy（企业代码 3309136-7），芬兰。电子邮件:<a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. 我们收集的数据',
    s2Body: '我们通过 Google Analytics 4 收集匿名的访问分析数据。如果您订阅了我们的电子简报,我们会安全地存储您的电子邮件地址。除非您直接与我们联系,否则我们不会收集任何其他可识别个人身份的信息。',
    s2aTitle: '2a. 处理的法律依据(通用数据保护条例第6条)',
    s2aIntro: '我们针对每一项处理活动依据以下法律依据进行处理:',
    s2aItems: [
      { strong: '同意(第6(1)(a)条)', body: '用于分析 cookie(Google Analytics 4)及其他非必要 cookie。您通过 cookie 横幅给予同意,并可随时撤回。' },
      { strong: '同意(第6(1)(a)条)', body: '用于电子简报订阅。您通过提交订阅表单给予同意,可随时通过取消订阅链接撤回。' },
      { strong: '合法利益(第6(1)(f)条)', body: '用于必要 cookie(存储您的同意偏好)以及防欺诈和安全日志。我们的利益是运营一个可正常使用的网站,并已与您的合理期望相平衡。' },
      { strong: '合法利益(第6(1)(f)条)', body: '用于联盟链接点击归因。我们的利益是获得编辑工作所应得的佣金;收集的数据极少(来源),您也可以选择不点击联盟链接。' },
    ],
    s3Title: '3. Cookie',
    s3Intro: '我们的网站使用 cookie 以提升您的浏览体验并收集匿名分析数据。这些包括:',
    s3Items: [
      { strong: '必要 cookie', body: '网站正常运行所必需(同意偏好、会话数据)。' },
      { strong: '分析 cookie', body: 'Google Analytics 4 用于了解访客如何与本网站互动。匿名收集。' },
      { strong: '联盟 cookie', body: '当您点击联盟链接(例如 Adtraction 或 Daisycon 或 Travelpayouts 追踪)时设置,用于归因推荐佣金。' },
    ],
    s3Tail: (cookieLink) => <>分析 cookie 仅在您通过 cookie 横幅同意后才会设置。详情请参阅我们的{cookieLink}。</>,
    s4Title: '4. Google Analytics',
    s4Body: '我们使用启用 Consent Mode v2 的 Google Analytics 4。如果您拒绝 cookie,我们将不会收集任何分析数据。如果您接受,匿名的使用数据(浏览页面、停留时间、按国家级别的大致位置)将发送至 Google。不包含个人数据。',
    s5Title: '5. 电子简报',
    s5Body: (unsub) => <>如果您订阅了我们的电子简报,您的电子邮件地址将通过 Resend 和 Supabase 安全存储。您可以随时通过每封邮件中的链接或通过我们的{unsub}取消订阅。</>,
    s6Title: '6. 数据保留',
    s6Body: '分析数据在 Google Analytics 中保留14个月。电子简报的电子邮件地址在您取消订阅前一直保留。',
    s7Title: '7. 第三方',
    s7Intro: '我们不会向第三方出售或共享您的个人数据。但作为运营的一部分,以下第三方服务会处理数据:',
    s7Items: [
      'Google Analytics, 匿名使用分析',
      'Adtraction、Daisycon、Travelpayouts 与 Trip.com, 点击预订与合作伙伴链接的追踪',
      'Resend, 电子简报邮件发送',
      'Supabase, 后端数据库服务',
      'Cloudflare, 托管与 CDN',
    ],
    s8Title: '8. 广告',
    s8Body1: (siteName) => `本网站会展示第三方广告主的赞助内容。赞助内容会清晰标注"赞助"标识。点击赞助链接可能将您重定向到拥有自身隐私政策的外部网站。${siteName} 不对外部广告主的数据处理做法负责。`,
    s8Body2: '我们通过 Adtraction 和 Daisycon 和 Travelpayouts 网络以及 Trip.com 合作伙伴计划参与联盟计划,合作伙伴包括 Sembo、Lomarengas、Trip.com 和 EconomyBookings。当您点击联盟链接并完成购买或预订时,我们可能获得佣金,而您无需承担任何额外费用。',
    s8aTitle: '8a. 跨境数据传输',
    s8aIntro: '我们使用的若干第三方服务的总部或数据传输目的地位于欧洲经济区(EEA)以外,最常见的是美国:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC,美国)：受 EU–US 数据隐私框架(DPF)保护。' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc.,美国)：受 EU–US 数据隐私框架及标准合同条款(SCC)保护。' },
      { strong: 'Resend', body: '(Resend Inc.,美国)：受标准合同条款(SCC)保护。' },
      { strong: 'Supabase', body: '(Supabase Inc.,美国,亦可使用欧盟区域托管)：受标准合同条款(SCC)保护。' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB,瑞典,欧盟; Daisycon B.V.,荷兰,欧盟;Travelpayouts 与 Trip.com,国际):欧盟/欧洲经济区以外的传输受标准合同条款(SCC)保护。' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH,德国)：位于欧洲经济区内。' },
    ],
    s8aTail: '在任何情形下,数据传输均通过欧盟委员会的充分性决定、EU–US 数据隐私框架或经欧盟委员会批准的标准合同条款进行保护。您可联系我们索取相应保护措施的副本。',
    s9Title: '9. 您在通用数据保护条例下的权利',
    s9Intro: '由于我们在芬兰运营并向欧盟访客提供服务,通用数据保护条例(GDPR)完全适用。您享有以下权利:',
    s9Items: [
      { strong: '访问权(第15条)', body: '请求获取我们持有的关于您个人数据的副本。' },
      { strong: '更正权(第16条)', body: '要求我们更正不准确或不完整的数据。' },
      { strong: '删除权 / "被遗忘权"(第17条)', body: '在不存在压倒性保留理由时,要求我们删除您的数据。' },
      { strong: '限制处理权(第18条)', body: '在问题正在解决期间,要求我们暂停处理。' },
      { strong: '数据可携带权(第20条)', body: '以结构化、机器可读的格式获取您的数据。' },
      { strong: '反对权(第21条)', body: '反对基于合法利益的处理,包括直接营销。' },
      { strong: '撤回同意权', body: '可随时撤回,自撤回时刻起生效。' },
      { strong: '投诉权(第77条)', body: '向芬兰数据保护专员公署(Tietosuojavaltuutettu,tietosuoja.fi)或您在欧盟惯常居住地的监管机构投诉。' },
    ],
    s9Tail: (email) => <>如需行使上述任何权利,请通过 {email} 与我们联系。我们将在一个月内回复。</>,
    s10Title: '10. 自动化决策',
    s10Body: '我们不会进行通用数据保护条例第22条所述的、对您产生法律或类似重大影响的自动化决策、用户画像或其他相关处理。',
    s11Title: '11. 未成年人',
    s11Body: '本网站及我们的电子简报面向成年人。我们不会有意收集13岁以下儿童的数据(芬兰法律及通用数据保护条例规定的数字服务年龄门槛)。如果您认为某位儿童向我们提供了个人数据,请联系我们,我们将予以删除。',
    s12Title: '12. 本政策的变更',
    s12Body: '我们可能会不时更新本隐私政策。顶部的"最后更新"日期反映最新修订。重大变更将在主页上至少醒目展示14天。',
    backToHome: '← 返回首页',
    cookiePolicy: 'Cookie 政策 →',
  },
  ko: {
    h1: '개인정보 처리방침',
    lastUpdated: '최종 업데이트: 2026년 7월',
    s1Title: '1. 관리자',
    s1Body: () => <>LaPeso Oy (ID 3309136-7), 핀란드. 이메일: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. 수집하는 데이터',
    s2Body: '당사는 Google Analytics 4를 통해 익명의 분석 데이터를 수집합니다. 뉴스레터를 구독하시면 귀하의 이메일 주소를 안전하게 보관합니다. 귀하가 당사에 직접 연락하시지 않는 한, 그 외의 식별 가능한 개인정보는 수집하지 않습니다.',
    s2aTitle: '2a. 처리의 법적 근거 (GDPR 제6조)',
    s2aIntro: '당사는 각 처리 활동에 대해 다음 법적 근거에 의존합니다:',
    s2aItems: [
      { strong: '동의 (제6조 제1항 (a))', body: '분석 쿠키(Google Analytics 4) 및 비필수 쿠키. 쿠키 배너를 통해 동의하시며 언제든지 철회하실 수 있습니다.' },
      { strong: '동의 (제6조 제1항 (a))', body: '뉴스레터 구독. 신청 양식 제출로 동의하시며 구독 해지 링크를 통해 언제든지 철회하실 수 있습니다.' },
      { strong: '정당한 이익 (제6조 제1항 (f))', body: '필수 쿠키(귀하의 동의 설정 저장) 및 사기 방지·보안 로그. 당사의 이익은 정상적으로 작동하는 웹사이트 운영이며, 귀하의 합리적 기대와 균형을 이룹니다.' },
      { strong: '정당한 이익 (제6조 제1항 (f))', body: '제휴 링크 클릭 귀속. 당사의 이익은 편집상 획득한 수수료 수령이며 수집되는 데이터는 최소한(추천 출처)이고 제휴 링크를 클릭하지 않으시면 회피하실 수 있습니다.' },
    ],
    s3Title: '3. 쿠키',
    s3Intro: '당사 웹사이트는 브라우징 경험 향상과 익명 분석 데이터 수집을 위해 쿠키를 사용합니다. 다음을 포함합니다:',
    s3Items: [
      { strong: '필수 쿠키', body: '웹사이트의 정상 작동에 필요(동의 설정, 세션 데이터).' },
      { strong: '분석 쿠키', body: 'Google Analytics 4가 방문자의 사이트 이용 방식을 이해하는 데 사용. 익명으로 수집됩니다.' },
      { strong: '제휴 쿠키', body: '제휴 링크 클릭 시 설정(예: Adtraction, Daisycon, Travelpayouts 추적). 추천 수수료 귀속에 사용됩니다.' },
    ],
    s3Tail: (cookieLink) => <>분석 쿠키는 쿠키 배너를 통한 동의 후에만 설정됩니다. 자세한 내용은 당사의 {cookieLink}을 참조하세요.</>,
    s4Title: '4. Google Analytics',
    s4Body: '당사는 Consent Mode v2가 적용된 Google Analytics 4를 사용합니다. 쿠키를 거부하시면 분석 데이터가 수집되지 않습니다. 수락하시면 익명의 사용 데이터(조회 페이지, 사이트 체류 시간, 국가 단위의 일반 위치)가 Google로 전송됩니다. 개인정보는 포함되지 않습니다.',
    s5Title: '5. 뉴스레터',
    s5Body: (unsub) => <>뉴스레터를 구독하시면 귀하의 이메일 주소는 Resend와 Supabase를 통해 안전하게 보관됩니다. 각 이메일의 링크 또는 당사의 {unsub}을 통해 언제든지 구독을 해지하실 수 있습니다.</>,
    s6Title: '6. 데이터 보관',
    s6Body: '분석 데이터는 Google Analytics에서 14개월간 보관됩니다. 뉴스레터 이메일은 구독 해지 시까지 보관됩니다.',
    s7Title: '7. 제3자',
    s7Intro: '당사는 귀하의 개인정보를 제3자에게 판매하거나 공유하지 않습니다. 다만, 운영의 일환으로 다음 제3자 서비스가 데이터를 처리합니다:',
    s7Items: [
      'Google Analytics, 익명 이용 분석',
      'Adtraction, Daisycon, Travelpayouts, Trip.com, 예약·파트너 링크 클릭 추적',
      'Resend, 뉴스레터 이메일 발송',
      'Supabase, 백엔드 데이터베이스 서비스',
      'Cloudflare, 호스팅 및 CDN',
    ],
    s8Title: '8. 광고',
    s8Body1: (siteName) => `본 사이트는 제3자 광고주의 후원 콘텐츠를 표시합니다. 후원 콘텐츠는 "후원" 표시로 명확히 식별됩니다. 후원 링크를 클릭하시면 자체 개인정보 처리방침을 가진 외부 사이트로 이동할 수 있습니다. ${siteName}은 외부 광고주의 데이터 처리 관행에 대해 책임지지 않습니다.`,
    s8Body2: '당사는 Adtraction 및 Daisycon 및 Travelpayouts 네트워크와 Trip.com 파트너 프로그램을 통해 제휴 프로그램에 참여합니다. 파트너로는 Sembo, Lomarengas, Trip.com, EconomyBookings 등이 있습니다. 제휴 링크를 통해 구매 또는 예약을 하시면 추가 비용 없이 당사가 수수료를 받을 수 있습니다.',
    s8aTitle: '8a. 국제 데이터 이전',
    s8aIntro: '당사가 이용하는 일부 제3자 서비스는 유럽경제지역(EEA) 외부, 주로 미국에 소재하거나 데이터를 이전합니다:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, 미국): EU–US 데이터 프라이버시 프레임워크(DPF) 적용.' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., 미국): EU–US 데이터 프라이버시 프레임워크 및 표준계약조항(SCC) 적용.' },
      { strong: 'Resend', body: '(Resend Inc., 미국): 표준계약조항(SCC) 적용.' },
      { strong: 'Supabase', body: '(Supabase Inc., 미국, EU 지역 호스팅 가능): 표준계약조항(SCC) 적용.' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, 스웨덴, EU; Daisycon B.V., 네덜란드, EU; Travelpayouts 및 Trip.com, 국제): EU/EEA 역외 이전에는 표준계약조항(SCC)이 적용됩니다.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, 독일): EEA 내.' },
    ],
    s8aTail: '각 경우에 이전은 적정성 결정, EU–US 데이터 프라이버시 프레임워크 또는 유럽위원회 승인 표준계약조항에 의해 보호됩니다. 해당 보호 조치의 사본은 당사에 문의하여 요청하실 수 있습니다.',
    s9Title: '9. GDPR 및 PIPA에 따른 귀하의 권리',
    s9Intro: '당사는 핀란드에서 운영하며 유럽연합 방문자에게 서비스를 제공하므로 GDPR이 전면 적용됩니다. 대한민국 거주자의 경우 개인정보 보호법(PIPA)에 따른 권리도 존중합니다. 귀하에게는 다음 권리가 있습니다:',
    s9Items: [
      { strong: '열람권 (제15조)', body: '당사가 보유한 귀하의 개인정보 사본을 요청하실 수 있습니다.' },
      { strong: '정정권 (제16조)', body: '부정확하거나 불완전한 데이터의 수정을 요청하실 수 있습니다.' },
      { strong: '삭제권 / "잊혀질 권리" (제17조)', body: '우선하는 보관 사유가 없는 경우 데이터 삭제를 요청하실 수 있습니다.' },
      { strong: '처리 제한권 (제18조)', body: '문제 해결 중에는 처리 일시 정지를 요청하실 수 있습니다.' },
      { strong: '데이터 이동권 (제20조)', body: '구조화된 기계 판독 가능 형식으로 데이터를 받으실 수 있습니다.' },
      { strong: '반대권 (제21조)', body: '직접 마케팅을 포함하여 정당한 이익에 근거한 처리에 반대하실 수 있습니다.' },
      { strong: '동의 철회권', body: '언제든지, 철회 시점부터 효력이 발생합니다.' },
      { strong: '감독기관에 대한 불만 제기권 (제77조)', body: '핀란드 개인정보 보호 옴부즈맨(Tietosuojavaltuutettu, tietosuoja.fi), EU 내 상시 거주지의 감독기관, 또는 대한민국의 경우 개인정보보호위원회(pipc.go.kr)에 제기하실 수 있습니다.' },
    ],
    s9Tail: (email) => <>이 권리를 행사하시려면 {email}로 연락하십시오. 한 달 이내에 답변드리겠습니다.</>,
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
    lastUpdated: 'Dernière mise à jour : juillet 2026',
    s1Title: '1. Responsable du traitement',
    s1Body: () => <>LaPeso Oy (n° 3309136-7), Finlande. Courriel : <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Données que nous collectons',
    s2Body: 'Nous collectons des données analytiques anonymes via Google Analytics 4. Si vous vous inscrivez à notre infolettre, nous stockons votre adresse e-mail en toute sécurité. Nous ne collectons aucune autre information personnelle identifiable, sauf si vous nous contactez directement.',
    s2aTitle: '2a. Base légale du traitement (Art. 6 RGPD)',
    s2aIntro: 'Nous nous appuyons sur les bases légales suivantes pour chaque activité de traitement :',
    s2aItems: [
      { strong: 'Consentement (Art. 6(1)(a))', body: 'pour les cookies analytiques (Google Analytics 4) et autres cookies non essentiels. Vous donnez votre consentement via le bandeau de cookies et pouvez le retirer à tout moment.' },
      { strong: 'Consentement (Art. 6(1)(a))', body: 'pour l\'abonnement à l\'infolettre. Vous donnez votre consentement en soumettant le formulaire et pouvez le retirer à tout moment via le lien de désinscription.' },
      { strong: 'Intérêt légitime (Art. 6(1)(f))', body: 'pour les cookies essentiels (stockage de votre préférence de consentement) et les journaux de prévention de la fraude/sécurité. Notre intérêt est l\'exploitation d\'un site web fonctionnel, équilibré avec vos attentes raisonnables.' },
      { strong: 'Intérêt légitime (Art. 6(1)(f))', body: 'pour l\'attribution des clics sur les liens d\'affiliation. Notre intérêt est de percevoir la commission éditoriale que nous avons gagnée ; les données collectées sont minimales (source de référence) et vous pouvez choisir de ne pas cliquer sur les liens d\'affiliation.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Notre site utilise des cookies pour améliorer votre expérience de navigation et collecter des données analytiques anonymes. Cela comprend :',
    s3Items: [
      { strong: 'Cookies essentiels', body: 'nécessaires au bon fonctionnement du site (préférences de consentement, données de session).' },
      { strong: 'Cookies analytiques', body: 'utilisés par Google Analytics 4 pour comprendre l\'usage du site par les visiteurs. Collectés de manière anonyme.' },
      { strong: 'Cookies d\'affiliation', body: 'déposés lorsque vous cliquez sur un lien d\'affiliation (par exemple suivi Adtraction, Daisycon ou Travelpayouts). Ils permettent d\'attribuer les commissions de référencement.' },
    ],
    s3Tail: (cookieLink) => <>Les cookies analytiques ne sont déposés qu\'après votre consentement via le bandeau. Voir notre {cookieLink} pour plus de détails.</>,
    s4Title: '4. Google Analytics',
    s4Body: 'Nous utilisons Google Analytics 4 avec le Consent Mode v2. Si vous refusez les cookies, aucune donnée analytique n\'est collectée. Si vous acceptez, des données d\'usage anonymes (pages vues, durée, localisation générale au niveau du pays) sont envoyées à Google. Aucune donnée personnelle n\'est incluse.',
    s5Title: '5. Infolettre',
    s5Body: (unsub) => <>Si vous vous inscrivez à notre infolettre, votre adresse e-mail est stockée en toute sécurité via Resend et Supabase. Vous pouvez vous désinscrire à tout moment via le lien dans chaque e-mail ou via notre {unsub}.</>,
    s6Title: '6. Conservation des données',
    s6Body: 'Les données analytiques sont conservées 14 mois dans Google Analytics. Les adresses e-mail de l\'infolettre sont conservées jusqu\'à votre désinscription.',
    s7Title: '7. Tiers',
    s7Intro: 'Nous ne vendons ni ne partageons vos données personnelles avec des tiers. Toutefois, les services tiers suivants traitent des données dans le cadre de notre activité :',
    s7Items: [
      'Google Analytics, analyse d\'usage anonyme',
      'Adtraction, Daisycon, Travelpayouts et Trip.com, suivi des clics sur les liens de réservation et d\'affiliation',
      'Resend, envoi de l\'infolettre par e-mail',
      'Supabase, services de base de données back-end',
      'Cloudflare, hébergement et CDN',
    ],
    s8Title: '8. Publicité',
    s8Body1: (siteName) => `Ce site affiche du contenu sponsorisé d'annonceurs tiers. Le contenu sponsorisé est clairement identifié par la mention « Sponsorisé ». Cliquer sur des liens sponsorisés peut vous rediriger vers des sites externes ayant leur propre politique de confidentialité. ${siteName} n'est pas responsable des pratiques en matière de données des annonceurs externes.`,
    s8Body2: 'Nous participons à des programmes d\'affiliation via les réseaux Adtraction, Daisycon et Travelpayouts ainsi qu\'au programme partenaire de Trip.com ; nos partenaires incluent Sembo, Lomarengas, Trip.com et EconomyBookings. Lorsque vous cliquez sur un lien d\'affiliation et effectuez un achat ou une réservation, nous pouvons percevoir une commission sans coût supplémentaire pour vous.',
    s8aTitle: '8a. Transferts internationaux de données',
    s8aIntro: 'Plusieurs services tiers que nous utilisons sont établis hors de l\'Espace économique européen (EEE) ou y transfèrent des données, le plus souvent vers les États-Unis :',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, USA): couvert par le cadre UE–US Data Privacy Framework (DPF).' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., USA): couvert par le cadre UE–US Data Privacy Framework et les clauses contractuelles types (CCT).' },
      { strong: 'Resend', body: '(Resend Inc., USA): couvert par les clauses contractuelles types.' },
      { strong: 'Supabase', body: '(Supabase Inc., USA, hébergement région UE disponible): couvert par les clauses contractuelles types.' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Suède, UE ; Daisycon B.V., Pays-Bas, UE ; Travelpayouts et Trip.com, internationaux) : les transferts hors UE/EEE sont couverts par les clauses contractuelles types.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Allemagne): au sein de l\'EEE.' },
    ],
    s8aTail: 'Dans chaque cas, le transfert est protégé par une décision d\'adéquation, le cadre UE–US Data Privacy Framework ou les clauses contractuelles types approuvées par la Commission européenne. Vous pouvez nous demander une copie des garanties applicables.',
    s9Title: '9. Vos droits au titre du RGPD',
    s9Intro: 'Comme nous opérons depuis la Finlande et servons des visiteurs de l\'Union européenne, le RGPD s\'applique pleinement. Vous disposez des droits suivants :',
    s9Items: [
      { strong: 'Droit d\'accès (Art. 15)', body: 'demander une copie des données personnelles que nous détenons à votre sujet.' },
      { strong: 'Droit de rectification (Art. 16)', body: 'demander la correction de données inexactes ou incomplètes.' },
      { strong: 'Droit à l\'effacement / « droit à l\'oubli » (Art. 17)', body: 'demander la suppression de vos données lorsqu\'aucune raison prépondérante ne justifie leur conservation.' },
      { strong: 'Droit à la limitation du traitement (Art. 18)', body: 'demander la suspension du traitement le temps qu\'une question soit résolue.' },
      { strong: 'Droit à la portabilité (Art. 20)', body: 'recevoir vos données dans un format structuré et lisible par machine.' },
      { strong: 'Droit d\'opposition (Art. 21)', body: 'vous opposer au traitement fondé sur l\'intérêt légitime, y compris le marketing direct.' },
      { strong: 'Droit de retirer le consentement', body: 'à tout moment, avec effet à compter du retrait.' },
      { strong: 'Droit de déposer une plainte (Art. 77)', body: 'auprès de la médiatrice finlandaise de la protection des données (Tietosuojavaltuutettu, tietosuoja.fi), de l\'autorité de contrôle de votre résidence habituelle dans l\'UE, ou de la CNIL en France (cnil.fr).' },
    ],
    s9Tail: (email) => <>Pour exercer l\'un de ces droits, contactez-nous à {email}. Nous répondrons dans un délai d\'un mois.</>,
    s10Title: '10. Décision automatisée',
    s10Body: 'Nous ne procédons à aucune décision automatisée, à aucun profilage ni à aucun autre traitement produisant des effets juridiques ou similaires importants à votre égard au sens de l\'article 22 du RGPD.',
    s11Title: '11. Enfants',
    s11Body: 'Ce site et notre infolettre s\'adressent à des adultes. Nous ne collectons pas sciemment de données auprès d\'enfants de moins de 13 ans (seuil d\'âge pour les services numériques selon le droit finlandais et le RGPD). Si vous pensez qu\'un enfant nous a transmis des données, contactez-nous, nous les supprimerons.',
    s12Title: '12. Modifications de la présente politique',
    s12Body: 'Nous pouvons mettre à jour la présente Politique de Confidentialité ponctuellement. La date « Dernière mise à jour » en haut reflète la révision la plus récente. Les modifications substantielles seront signalées en page d\'accueil pendant au moins 14 jours.',
    backToHome: '← Retour à l\'accueil',
    cookiePolicy: 'Politique de Cookies →',
  },
  it: {
    h1: 'Informativa sulla Privacy',
    lastUpdated: 'Ultimo aggiornamento: luglio 2026',
    s1Title: '1. Titolare del trattamento',
    s1Body: () => <>LaPeso Oy (ID 3309136-7), Finlandia. Email: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Dati che raccogliamo',
    s2Body: 'Raccogliamo dati analitici anonimi tramite Google Analytics 4. Se Lei si iscrive alla nostra newsletter, conserviamo il Suo indirizzo email in modo sicuro. Non raccogliamo altre informazioni personali identificabili, salvo Lei ci contatti direttamente.',
    s2aTitle: '2a. Base giuridica del trattamento (Art. 6 GDPR)',
    s2aIntro: 'Ci basiamo sulle seguenti basi giuridiche per ciascuna attività di trattamento:',
    s2aItems: [
      { strong: 'Consenso (Art. 6(1)(a))', body: 'per i cookie analitici (Google Analytics 4) e altri cookie non essenziali. Lei presta il consenso tramite il banner dei cookie e può ritirarlo in qualsiasi momento.' },
      { strong: 'Consenso (Art. 6(1)(a))', body: 'per l\'iscrizione alla newsletter. Lei presta il consenso inviando il modulo di iscrizione e può ritirarlo in qualsiasi momento tramite il link di disiscrizione.' },
      { strong: 'Legittimo interesse (Art. 6(1)(f))', body: 'per i cookie essenziali (memorizzazione della Sua preferenza di consenso) e i registri di prevenzione frodi/sicurezza. Il nostro interesse è l\'esercizio di un sito web funzionante, bilanciato con le Sue ragionevoli aspettative.' },
      { strong: 'Legittimo interesse (Art. 6(1)(f))', body: 'per l\'attribuzione dei clic sui link di affiliazione. Il nostro interesse è ricevere la commissione editoriale guadagnata; i dati raccolti sono minimi (fonte di riferimento) e Lei può scegliere di non cliccare sui link di affiliazione.' },
    ],
    s3Title: '3. Cookie',
    s3Intro: 'Il nostro sito utilizza cookie per migliorare la Sua esperienza di navigazione e raccogliere dati analitici anonimi. Tra questi:',
    s3Items: [
      { strong: 'Cookie essenziali', body: 'necessari al corretto funzionamento del sito (preferenze di consenso, dati di sessione).' },
      { strong: 'Cookie analitici', body: 'utilizzati da Google Analytics 4 per comprendere come i visitatori interagiscono con il sito. Raccolti in forma anonima.' },
      { strong: 'Cookie di affiliazione', body: 'impostati quando Lei clicca su link di affiliazione (ad esempio tracciamento Adtraction, Daisycon o Travelpayouts). Permettono di attribuire le commissioni di referral.' },
    ],
    s3Tail: (cookieLink) => <>I cookie analitici vengono impostati solo dopo il Suo consenso tramite il banner. Per dettagli completi, consulti la nostra {cookieLink}.</>,
    s4Title: '4. Google Analytics',
    s4Body: 'Utilizziamo Google Analytics 4 con Consent Mode v2. Se Lei rifiuta i cookie, nessun dato analitico viene raccolto. Se accetta, dati di utilizzo anonimi (pagine viste, tempo sul sito, posizione generale a livello di paese) vengono inviati a Google. Non sono inclusi dati personali.',
    s5Title: '5. Newsletter',
    s5Body: (unsub) => <>Se Lei si iscrive alla nostra newsletter, il Suo indirizzo email viene conservato in modo sicuro tramite Resend e Supabase. Può disiscriversi in qualsiasi momento tramite il link presente in ogni email o tramite la nostra {unsub}.</>,
    s6Title: '6. Conservazione dei dati',
    s6Body: 'I dati analitici sono conservati per 14 mesi in Google Analytics. Gli indirizzi email della newsletter sono conservati fino alla disiscrizione.',
    s7Title: '7. Terzi',
    s7Intro: 'Non vendiamo né condividiamo i Suoi dati personali con terzi. Tuttavia, i seguenti servizi di terze parti trattano dati nell\'ambito delle nostre operazioni:',
    s7Items: [
      'Google Analytics, analisi anonima dell\'utilizzo',
      'Adtraction, Daisycon, Travelpayouts e Trip.com, tracciamento dei clic su link di prenotazione e affiliazione',
      'Resend, invio della newsletter via email',
      'Supabase, servizi di database back-end',
      'Cloudflare, hosting e CDN',
    ],
    s8Title: '8. Pubblicità',
    s8Body1: (siteName) => `Questo sito mostra contenuti sponsorizzati da inserzionisti terzi. I contenuti sponsorizzati sono chiaramente identificati con l'etichetta "Sponsorizzato". Cliccare su link sponsorizzati può reindirizzare a siti esterni con proprie informative sulla privacy. ${siteName} non è responsabile delle pratiche sui dati degli inserzionisti esterni.`,
    s8Body2: 'Partecipiamo a programmi di affiliazione tramite le reti Adtraction, Daisycon e Travelpayouts e il programma partner di Trip.com; tra i nostri partner figurano Sembo, Lomarengas, Trip.com ed EconomyBookings. Quando Lei clicca su un link di affiliazione ed effettua un acquisto o una prenotazione, potremmo ricevere una commissione senza costi aggiuntivi per Lei.',
    s8aTitle: '8a. Trasferimenti internazionali di dati',
    s8aIntro: 'Diversi servizi terzi che utilizziamo hanno sede o trasferiscono dati fuori dallo Spazio Economico Europeo (SEE), per lo più negli Stati Uniti:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, USA): coperto dal EU–US Data Privacy Framework (DPF).' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., USA): coperto dal EU–US Data Privacy Framework e dalle clausole contrattuali tipo (SCC).' },
      { strong: 'Resend', body: '(Resend Inc., USA): coperto dalle clausole contrattuali tipo.' },
      { strong: 'Supabase', body: '(Supabase Inc., USA, con hosting in regione UE disponibile): coperto dalle clausole contrattuali tipo.' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Svezia, UE; Daisycon B.V., Paesi Bassi, UE; Travelpayouts e Trip.com, internazionali): i trasferimenti al di fuori di UE/SEE sono coperti dalle clausole contrattuali tipo.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Germania): all\'interno del SEE.' },
    ],
    s8aTail: 'In ogni caso, il trasferimento è protetto da una decisione di adeguatezza, dal EU–US Data Privacy Framework o da clausole contrattuali tipo approvate dalla Commissione europea. Può richiedere una copia delle garanzie applicabili contattandoci.',
    s9Title: '9. I Suoi diritti ai sensi del GDPR',
    s9Intro: 'Poiché operiamo dalla Finlandia e serviamo visitatori dell\'Unione europea, il GDPR si applica integralmente. Per gli utenti in Italia si applicano anche le disposizioni del Garante per la protezione dei dati personali. Lei ha i seguenti diritti:',
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
    lastUpdated: 'Laatst bijgewerkt: juli 2026',
    s1Title: '1. Verwerkingsverantwoordelijke',
    s1Body: () => <>LaPeso Oy (business ID 3309136-7), Finland. E-mail: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Welke gegevens wij verzamelen',
    s2Body: 'Wij verzamelen anonieme analysegegevens via Google Analytics 4. Als u zich abonneert op onze nieuwsbrief, slaan wij uw e-mailadres veilig op. Wij verzamelen geen andere identificeerbare persoonsgegevens, tenzij u rechtstreeks contact met ons opneemt.',
    s2aTitle: '2a. Rechtsgrondslag voor verwerking (Art. 6 AVG)',
    s2aIntro: 'Wij baseren ons op de volgende rechtsgrondslagen voor elke verwerkingsactiviteit:',
    s2aItems: [
      { strong: 'Toestemming (Art. 6(1)(a))', body: 'voor analyse-cookies (Google Analytics 4) en andere niet-essentiële cookies. U geeft toestemming via de cookiebanner en kunt deze op elk moment intrekken.' },
      { strong: 'Toestemming (Art. 6(1)(a))', body: 'voor het abonnement op de nieuwsbrief. U geeft toestemming door het inschrijfformulier in te dienen en kunt deze op elk moment intrekken via de afmeldlink.' },
      { strong: 'Gerechtvaardigd belang (Art. 6(1)(f))', body: 'voor essentiële cookies (opslag van uw toestemmingsvoorkeur) en fraudepreventie/beveiligingslogs. Ons belang is het exploiteren van een werkende website, in evenwicht met uw redelijke verwachtingen.' },
      { strong: 'Gerechtvaardigd belang (Art. 6(1)(f))', body: 'voor de toewijzing van klikken op affiliate links. Ons belang is het ontvangen van de redactioneel verdiende commissie; de verzamelde gegevens zijn minimaal (verwijzingsbron) en u kunt ervoor kiezen geen affiliate links aan te klikken.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Onze website gebruikt cookies om uw surfervaring te verbeteren en anonieme analysegegevens te verzamelen. Deze omvatten:',
    s3Items: [
      { strong: 'Essentiële cookies', body: 'vereist voor de juiste werking van de website (toestemmingsvoorkeuren, sessiegegevens).' },
      { strong: 'Analyse-cookies', body: 'gebruikt door Google Analytics 4 om te begrijpen hoe bezoekers onze site gebruiken. Anoniem verzameld.' },
      { strong: 'Affiliate cookies', body: 'geplaatst wanneer u op affiliate links klikt (bijv. Adtraction, Daisycon- of Travelpayouts-tracking). Deze helpen ons verwijzingscommissies toe te wijzen.' },
    ],
    s3Tail: (cookieLink) => <>Analyse-cookies worden pas geplaatst nadat u toestemming heeft gegeven via de cookiebanner. Zie ons {cookieLink} voor volledige details.</>,
    s4Title: '4. Google Analytics',
    s4Body: 'Wij gebruiken Google Analytics 4 met Consent Mode v2. Als u cookies weigert, worden geen analysegegevens verzameld. Als u accepteert, worden anonieme gebruiksgegevens (bekeken pagina\'s, tijd op de site, algemene locatie op landniveau) naar Google verzonden. Er worden geen persoonsgegevens opgenomen.',
    s5Title: '5. Nieuwsbrief',
    s5Body: (unsub) => <>Als u zich abonneert op onze nieuwsbrief, wordt uw e-mailadres veilig opgeslagen via Resend en Supabase. U kunt zich op elk moment afmelden via de link in elke e-mail of via onze {unsub}.</>,
    s6Title: '6. Bewaartermijn',
    s6Body: 'Analysegegevens worden 14 maanden bewaard in Google Analytics. Nieuwsbrief-e-mailadressen worden bewaard totdat u zich afmeldt.',
    s7Title: '7. Derden',
    s7Intro: 'Wij verkopen of delen uw persoonsgegevens niet met derden. De volgende externe diensten verwerken echter gegevens als onderdeel van onze activiteiten:',
    s7Items: [
      'Google Analytics, anonieme gebruiksanalyse',
      'Adtraction, Daisycon, Travelpayouts en Trip.com, tracking van klikken op boekings- en affiliate links',
      'Resend, verzending van de nieuwsbrief via e-mail',
      'Supabase, back-end databasediensten',
      'Cloudflare, hosting en CDN',
    ],
    s8Title: '8. Advertenties',
    s8Body1: (siteName) => `Deze site toont gesponsorde inhoud van externe adverteerders. Gesponsorde inhoud wordt duidelijk aangeduid met de markering "Gesponsord". Klikken op gesponsorde links kan u doorverwijzen naar externe websites met hun eigen privacybeleid. ${siteName} is niet verantwoordelijk voor de gegevenspraktijken van externe adverteerders.`,
    s8Body2: 'Wij nemen deel aan affiliateprogramma\'s via de netwerken Adtraction, Daisycon en Travelpayouts en via het partnerprogramma van Trip.com; tot onze partners behoren Sembo, Lomarengas, Trip.com en EconomyBookings. Wanneer u op een affiliate link klikt en een aankoop of boeking doet, kunnen wij een commissie ontvangen zonder extra kosten voor u.',
    s8aTitle: '8a. Internationale gegevensoverdrachten',
    s8aIntro: 'Verschillende externe diensten die wij gebruiken zijn gevestigd in of dragen gegevens over naar landen buiten de Europese Economische Ruimte (EER), meestal de Verenigde Staten:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, VS): gedekt door het EU–US Data Privacy Framework (DPF).' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., VS): gedekt door het EU–US Data Privacy Framework en de standaardcontractbepalingen (SCC).' },
      { strong: 'Resend', body: '(Resend Inc., VS): gedekt door de standaardcontractbepalingen.' },
      { strong: 'Supabase', body: '(Supabase Inc., VS, met EU-regio-hosting beschikbaar): gedekt door de standaardcontractbepalingen.' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Zweden, EU; Daisycon B.V., Nederland, EU; Travelpayouts en Trip.com, internationaal): doorgiften buiten de EU/EER worden gedekt door de standaardcontractbepalingen.' },
      { strong: 'GetYourGuide', body: '(GetYourGuide GmbH, Duitsland): binnen de EER.' },
    ],
    s8aTail: 'In elk geval wordt de overdracht beschermd door een adequaatheidsbesluit, het EU–US Data Privacy Framework of door de Europese Commissie goedgekeurde standaardcontractbepalingen. U kunt een kopie van de relevante waarborgen opvragen door contact met ons op te nemen.',
    s9Title: '9. Uw rechten onder de AVG',
    s9Intro: 'Omdat wij vanuit Finland opereren en bezoekers uit de Europese Unie bedienen, is de AVG (GDPR) volledig van toepassing. Voor gebruikers in Nederland is de Autoriteit Persoonsgegevens (AP) de toezichthouder. U heeft de volgende rechten:',
    s9Items: [
      { strong: 'Recht op inzage (Art. 15)', body: 'een kopie opvragen van de persoonsgegevens die wij over u bewaren.' },
      { strong: 'Recht op rectificatie (Art. 16)', body: 'ons vragen onjuiste of onvolledige gegevens te corrigeren.' },
      { strong: 'Recht op wissen / "recht om vergeten te worden" (Art. 17)', body: 'ons vragen uw gegevens te wissen wanneer er geen zwaarwegende reden is om deze te bewaren.' },
      { strong: 'Recht op beperking van de verwerking (Art. 18)', body: 'ons vragen de verwerking te pauzeren terwijl een kwestie wordt opgelost.' },
      { strong: 'Recht op gegevensoverdraagbaarheid (Art. 20)', body: 'uw gegevens ontvangen in een gestructureerd, machine-leesbaar formaat.' },
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
    lastUpdated: 'Senast uppdaterad: juli 2026',
    s1Title: '1. Personuppgiftsansvarig',
    s1Body: () => <>LaPeso Oy (business ID 3309136-7), Finland. E-post: <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a></>,
    s2Title: '2. Uppgifter vi samlar in',
    s2Body: 'Vi samlar in anonym analysdata via Google Analytics 4. Om du prenumererar på vårt nyhetsbrev lagrar vi din e-postadress säkert. Vi samlar inte in några andra personuppgifter som kan identifiera dig, om du inte kontaktar oss direkt.',
    s2aTitle: '2a. Rättslig grund för behandling (GDPR artikel 6)',
    s2aIntro: 'Vi grundar varje behandlingsaktivitet på följande rättsliga grunder:',
    s2aItems: [
      { strong: 'Samtycke (artikel 6.1 a)', body: 'för analyscookies (Google Analytics 4) och andra icke nödvändiga cookies. Du lämnar samtycke via cookiebannern och kan när som helst återkalla det.' },
      { strong: 'Samtycke (artikel 6.1 a)', body: 'för prenumeration på nyhetsbrevet. Du lämnar samtycke genom att skicka in anmälningsformuläret och kan när som helst återkalla det via avregistreringslänken.' },
      { strong: 'Berättigat intresse (artikel 6.1 f)', body: 'för nödvändiga cookies (lagring av ditt samtyckesval) samt bedrägeriförebyggande och säkerhetsloggar. Vårt intresse är att driva en fungerande webbplats, avvägt mot dina rimliga förväntningar.' },
      { strong: 'Berättigat intresse (artikel 6.1 f)', body: 'för attribution av klick på affiliatelänkar. Vårt intresse är att få den provision vi redaktionellt har tjänat in; uppgifterna som samlas in är minimala (hänvisningskälla) och du kan avstå genom att låta bli att klicka på affiliatelänkar.' },
    ],
    s3Title: '3. Cookies',
    s3Intro: 'Vår webbplats använder cookies för att förbättra din surfupplevelse och samla in anonym analysdata. Dessa omfattar:',
    s3Items: [
      { strong: 'Nödvändiga cookies', body: 'krävs för att webbplatsen ska fungera korrekt (samtyckesinställningar, sessionsdata).' },
      { strong: 'Statistik-/analyscookies', body: 'används av Google Analytics 4 för att förstå hur besökare interagerar med vår webbplats. Samlas in anonymt.' },
      { strong: 'Affiliatecookies', body: 'placeras när du klickar på affiliatelänkar (t.ex. Adtraction, Daisycon- eller Travelpayouts-spårning). De hjälper oss att attribuera hänvisningsprovisioner.' },
    ],
    s3Tail: (cookieLink) => <>Analyscookies placeras endast efter att du gett samtycke via cookiebannern. Se vår {cookieLink} för fullständig information.</>,
    s4Title: '4. Google Analytics',
    s4Body: 'Vi använder Google Analytics 4 med Consent Mode v2. Om du avböjer cookies samlas ingen analysdata in. Om du accepterar skickas anonym användningsdata (visade sidor, tid på webbplatsen, allmän plats per land) till Google. Inga personuppgifter ingår.',
    s5Title: '5. Nyhetsbrev',
    s5Body: (unsub) => <>Om du prenumererar på vårt nyhetsbrev lagras din e-postadress säkert via Resend och Supabase. Du kan avregistrera dig när som helst med länken i varje e-postmeddelande eller via vår {unsub}.</>,
    s6Title: '6. Lagringstid',
    s6Body: 'Analysdata sparas i 14 månader i Google Analytics. E-postadresser till nyhetsbrevet sparas tills du avregistrerar dig.',
    s7Title: '7. Tredje part',
    s7Intro: 'Vi säljer eller delar inte dina personuppgifter med tredje part. Följande tredjepartstjänster behandlar dock uppgifter som en del av vår verksamhet:',
    s7Items: [
      'Google Analytics, anonym användningsanalys',
      'Adtraction, Daisycon, Travelpayouts och Trip.com, spårning av affiliatelänkar när du klickar på boknings- eller partnerlänkar',
      'Resend, utskick av nyhetsbrev',
      'Supabase, databastjänster i backend',
      'Cloudflare, hosting och CDN',
    ],
    s8Title: '8. Annonsering',
    s8Body1: (siteName) => `Den här webbplatsen visar sponsrat innehåll från tredjepartsannonsörer. Sponsrat innehåll märks tydligt med etiketten "Sponsrad". Att klicka på sponsrade länkar kan omdirigera dig till externa webbplatser med egna integritetspolicyer. ${siteName} ansvarar inte för externa annonsörers hantering av uppgifter.`,
    s8Body2: 'Vi deltar i affiliateprogram via nätverken Adtraction, Daisycon och Travelpayouts samt i Trip.coms partnerprogram; bland våra partner finns Sembo, Lomarengas, Trip.com och EconomyBookings. När du klickar på en affiliatelänk och gör ett köp eller en bokning kan vi få en provision utan extra kostnad för dig.',
    s8aTitle: '8a. Internationella dataöverföringar',
    s8aIntro: 'Flera av de tredjepartstjänster vi använder har sitt säte i, eller överför uppgifter till, länder utanför Europeiska ekonomiska samarbetsområdet (EES), oftast USA:',
    s8aItems: [
      { strong: 'Google Analytics', body: '(Google LLC, USA): omfattas av EU–US Data Privacy Framework (DPF).' },
      { strong: 'Cloudflare', body: '(Cloudflare Inc., USA): omfattas av EU–US Data Privacy Framework och standardavtalsklausuler (SCC).' },
      { strong: 'Resend', body: '(Resend Inc., USA): omfattas av standardavtalsklausuler.' },
      { strong: 'Supabase', body: '(Supabase Inc., USA, med EU-regionshosting tillgänglig): omfattas av standardavtalsklausuler.' },
      { strong: 'Adtraction / Daisycon / Travelpayouts / Trip.com', body: '(Adtraction AB, Sverige, EU; Daisycon B.V., Nederländerna, EU; Travelpayouts och Trip.com, internationella): överföringar utanför EU/EES omfattas av standardavtalsklausuler.' },
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
      { strong: 'Rätt att lämna in klagomål (artikel 77)', body: 'till den finska dataskyddsombudsmannen (Tietosuojavaltuutettu) på tietosuoja.fi, eller till tillsynsmyndigheten där du stadigvarande bor inom EU.' },
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
  siteName = 'LaplandVibes',
  lang = 'en',
}: PrivacyContentProps = {}) {
  const t = COPY[lang] ?? COPY.en;
  /* Label/description separator. ja + zh-CN take the fullwidth colon with no space; ko uses the halfwidth one. */
  const cjk = lang === 'ja' || lang === 'zh-CN';
  const sep = cjk ? '：' : ':';
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

  return (
    <div className="min-h-screen bg-deep-night pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-snow tracking-wide leading-tight mb-2 break-words">{t.h1}</h1>
        <p className="text-snow/70 text-sm mb-10">{t.lastUpdated}</p>
        <div className="space-y-8 text-snow/60 leading-relaxed">

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s1Title}</h2>
            <p>{t.s1Body(siteName)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s2Title}</h2>
            <p>{t.s2Body}</p>
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
              {t.s3Items.map((it, i) => (
                <li key={i}><strong className="text-snow/80">{it.strong}{sep}</strong>{gap}{it.body}</li>
              ))}
            </ul>
            <p className="mt-3">{t.s3Tail(cookieLink)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s4Title}</h2>
            <p>{t.s4Body}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s5Title}</h2>
            <p>{t.s5Body(unsubLink)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s6Title}</h2>
            <p>{t.s6Body}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s7Title}</h2>
            <p>{t.s7Intro}</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              {t.s7Items.map((it, i) => <li key={i}>{it}</li>)}
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
              {t.s8aItems.map((it, i) => (
                <li key={i}><strong className="text-snow/80">{it.strong}</strong> {it.body}</li>
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
