/**
 * Shared LaplandVibes ecosystem Terms of Use body.
 *
 * Renders ONLY the legal content. Each site wraps with its own Nav, Footer,
 * SEO/title meta. Updated 2026-05 to embed en / fi / de bodies behind a
 * single `lang` prop so visitors on /fi/* and /de/* see localised terms.
 *
 * `siteName` + `siteUrl` default to LaplandVibes umbrella values; spoke sites
 * pass their own (e.g. `siteName="LaplandStays"` / `siteUrl="laplandstays.com"`)
 * so the prose accurately names the publisher the visitor is reading.
 */
import { hubUnsubscribeUrl, localePath } from './localePath';

type Lang = 'en' | 'fi' | 'de' | 'ja' | 'es' | 'pt-BR' | 'zh-CN' | 'ko' | 'fr' | 'it' | 'nl' | 'sv';

interface TermsContentProps {
  siteName?: string;
  siteUrl?: string;
  lang?: Lang;
  /**
   * `travel` (default) is the network wording: search tools, bookings,
   * operators. `shop` swaps the six sections that are factually wrong for a
   * site that sells nothing and books nothing (see SHOP_OVERRIDES below).
   * Omitting the prop leaves every existing site byte for byte unchanged.
   */
  variant?: 'travel' | 'shop' | 'jobs';
  /** Site-specific first paragraph, when the site is not a travel or shop site (laplandwork: a job board). */
  intro?: React.ReactNode;
  /** Site-specific "last updated" line; the shared date is the network's, not the site's. */
  lastUpdated?: string;
}

interface TermsCopy {
  kicker: string;
  h1: string;
  lastUpdated: string;
  s1Title: string;
  s1P1: (siteName: string, siteUrl: string) => React.ReactNode;
  s1P2: string;
  s2Title: string;
  s2Body: string;
  s3Title: string;
  s3P1: (siteName: string) => string;
  s3P2: string;
  s4Title: string;
  s4Body: (siteName: string) => React.ReactNode;
  s5Title: string;
  s5P1: (siteName: string) => React.ReactNode;
  s5P2: (siteName: string) => React.ReactNode;
  s6Title: string;
  s6Body: (unsub: React.ReactNode, privacy: React.ReactNode) => React.ReactNode;
  s7Title: string;
  s7Body: (siteName: string) => string;
  s8Title: string;
  s8Body: (siteName: string) => string;
  s9Title: string;
  s9Body: string;
  s10Title: string;
  s10Body: string;
  s11Title: string;
  s11Body: string;
  s12Title: string;
  s12Intro: string;
  s12Items: string[];
  s12Tail: (siteName: string) => string;
  s13Title: string;
  s13Body: (email: React.ReactNode) => React.ReactNode;
}

const COPY: Record<Lang, TermsCopy> = {
  en: {
    kicker: 'Legal',
    h1: 'Terms of Use',
    lastUpdated: 'Last updated: May 2026 · Operated by LaPeso Oy',
    s1Title: '1. About This Site',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) is a Finnish Lapland travel information hub operated by{' '}
        <strong className="text-snow/90">LaPeso Oy</strong>, registered in Finland. We provide editorial travel guides,
        destination information, and links to third-party booking services.
      </>
    ),
    s1P2: 'By accessing or using this website, you agree to these terms. If you do not agree, please stop using the site.',
    s2Title: '2. Information Accuracy',
    s2Body: 'Travel information, including prices, opening hours, weather conditions, and availability, changes frequently. We aim to keep content accurate and up to date, but we cannot guarantee that all information is current at the time of your visit. Always verify critical details directly with service providers before making bookings.',
    s3Title: '3. Affiliate Links & Partnerships',
    s3P1: (siteName) => `Some links on ${siteName} are affiliate links. When you click these links and make a booking or purchase, we may receive a small commission at no additional cost to you. Affiliate relationships do not influence our editorial recommendations. We only link to services we believe provide genuine value.`,
    s3P2: 'Affiliate partners include but are not limited to: Sembo, Trip.com, EconomyBookings, GetYourGuide, and other travel service providers via affiliate networks such as Adtraction and Travelpayouts. Each booking is subject to the terms and conditions of the respective service provider.',
    s4Title: '4. Sponsored Content',
    s4Body: (siteName) => (
      <>
        This site displays sponsored advertisements from third-party businesses. Sponsored content is clearly marked
        with a <strong className="text-snow/90">"Sponsored"</strong> label wherever it appears. {siteName} is not
        responsible for the products, services, or claims made by advertisers. Clicking sponsored links will take you
        to external websites governed by their own terms and privacy policies.
      </>
    ),
    s5Title: '5. Third-Party Services & We Are Not a Merchant',
    s5P1: (siteName) => (
      <>
        The hotel search, flight search, car rental, and activity booking tools on this site redirect to
        third-party platforms (Sembo, Trip.com, EconomyBookings, GetYourGuide and others).{' '}
        <strong className="text-snow/90">{siteName} is not a travel agency, retailer, or merchant.</strong>{' '}
        We do not sell, resell, or process bookings; we publish editorial guides and direct readers to the
        operators that actually deliver the service.
      </>
    ),
    s5P2: (siteName) => (
      <>
        Any contract for travel services, accommodation, flights, car rental, tours, is concluded directly
        between you and the relevant third-party provider, on their terms and under their privacy policy.
        Their cancellation rules, refund policies, and consumer-protection rights apply, not ours. The Finnish
        consumer right of withdrawal under <em>kuluttajansuojalaki 6 luku</em> is exercised against the
        merchant; {siteName} has no role in that process.
      </>
    ),
    s6Title: '6. Newsletter',
    s6Body: (unsub, privacy) => (
      <>
        If you subscribe to our newsletter, you agree to receive periodic emails about Finnish Lapland travel.
        You can unsubscribe at any time using the link in any email or by visiting {unsub}. We do not share your
        email address with third parties. See our {privacy} for details.
      </>
    ),
    s7Title: '7. Intellectual Property',
    s7Body: (siteName) => `All original content on ${siteName}, including text, graphics, and design, is owned by LaPeso Oy or licensed for use. You may not reproduce, distribute, or create derivative works without written permission. Fair use for non-commercial personal reference is permitted with attribution.`,
    s8Title: '8. Limitation of Liability',
    s8Body: (siteName) => `${siteName} and LaPeso Oy are not liable for any loss, injury, or damage arising from reliance on information on this site, from use of linked third-party services, or from travel decisions made based on our content. Travel to Arctic regions involves inherent risks; always obtain appropriate travel insurance and follow local safety guidelines.`,
    s9Title: '9. Governing Law',
    s9Body: 'These terms are governed by the laws of Finland. Any disputes shall be resolved in the courts of Finland.',
    s10Title: '10. Changes to These Terms',
    s10Body: 'We may update these terms from time to time. Changes are effective upon posting. Continued use of the site after updates constitutes acceptance of the revised terms.',
    s11Title: '11. Severability',
    s11Body: 'If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions remain in full force and effect. The invalid provision shall be replaced, to the extent permitted by law, with a valid provision that most closely matches the original commercial intent.',
    s12Title: '12. Digital Services Act (DSA) Contact Point',
    s12Intro: 'Under the EU Digital Services Act (Regulation (EU) 2022/2065), our designated contact point for authorities and recipients of the service is:',
    s12Items: [
      'Email: info@laplandvibes.com',
      'Operator: LaPeso Oy, Finland',
      'Communication languages: English, Finnish',
    ],
    s12Tail: (siteName) => `${siteName} is an editorial publisher; we do not host user-generated content as a primary service. Reports of illegal content, copyright infringement, or other DSA-relevant matters may be sent to the address above and will be handled within statutory timeframes.`,
    s13Title: '13. Contact',
    s13Body: (email) => <>For legal inquiries, contact us at {email}</>,
  },
  fi: {
    kicker: 'Lakitiedot',
    h1: 'Käyttöehdot',
    lastUpdated: 'Viimeksi päivitetty: toukokuu 2026 · Ylläpitäjä LaPeso Oy',
    s1Title: '1. Tietoa sivustosta',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) on Suomen Lapin matkailutietopalvelu, jonka ylläpidosta vastaa{' '}
        <strong className="text-snow/90">LaPeso Oy</strong>, Suomeen rekisteröity yhtiö. Tarjoamme toimituksellisia matkaoppaita,
        kohdetietoa ja linkkejä kolmannen osapuolen varauspalveluihin.
      </>
    ),
    s1P2: 'Käyttämällä tätä sivustoa hyväksyt nämä käyttöehdot. Jos et hyväksy niitä, lopeta sivuston käyttö.',
    s2Title: '2. Tietojen ajantasaisuus',
    s2Body: 'Matkailutiedot, kuten hinnat, aukioloajat, sääolosuhteet ja saatavuus, muuttuvat usein. Pyrimme pitämään sisällön ajantasaisena ja tarkkana, mutta emme voi taata, että kaikki tiedot ovat ajantasaisia vierailuhetkelläsi. Tarkista kriittiset yksityiskohdat aina suoraan palveluntarjoajalta ennen varauksen tekemistä.',
    s3Title: '3. Kumppanilinkit ja yhteistyökumppanit',
    s3P1: (siteName) => `Osa ${siteName}-sivuston linkeistä on kumppanilinkkejä. Kun klikkaat näitä linkkejä ja teet varauksen tai ostoksen, saatamme saada pienen komission ilman lisäkustannuksia sinulle. Kumppanuussuhteet eivät vaikuta toimituksellisiin suosituksiimme. Linkitämme vain palveluihin, joiden uskomme tuottavan aitoa arvoa.`,
    s3P2: 'Kumppaneitamme ovat esimerkiksi Sembo, Trip.com, EconomyBookings, GetYourGuide ja muut matkailupalvelujen tarjoajat kumppaniverkostojen (mm. Adtraction ja Travelpayouts) kautta. Jokainen varaus on kunkin palveluntarjoajan omien ehtojen alainen.',
    s4Title: '4. Sponsoroitu sisältö',
    s4Body: (siteName) => (
      <>
        Sivustolla näytetään kolmansien osapuolten sponsoroituja mainoksia. Sponsoroitu sisältö on merkitty selkeästi{' '}
        <strong className="text-snow/90">"Sponsoroitu"</strong>-tunnisteella kaikkialla, missä se esiintyy. {siteName} ei vastaa
        mainostajien tuotteista, palveluista tai väitteistä. Sponsoroitujen linkkien klikkaaminen ohjaa sinut ulkoisille sivustoille,
        joilla on omat käyttöehtonsa ja tietosuojakäytäntönsä.
      </>
    ),
    s5Title: '5. Kolmannen osapuolen palvelut, emme ole myyjä',
    s5P1: (siteName) => (
      <>
        Sivuston hotellihaut, lentohaut, autovuokraus- ja aktiviteettivarausvälineet ohjaavat kolmannen osapuolen alustoille
        (Sembo, Trip.com, EconomyBookings, GetYourGuide ja muut).{' '}
        <strong className="text-snow/90">{siteName} ei ole matkatoimisto, jälleenmyyjä eikä elinkeinonharjoittaja varauspalveluna.</strong>{' '}
        Emme myy, jälleenmyy emmekä käsittele varauksia; julkaisemme toimituksellisia oppaita ja ohjaamme lukijat varsinaisen palvelun tuottavalle toimijalle.
      </>
    ),
    s5P2: (siteName) => (
      <>
        Sopimus matkailupalvelusta, majoituksesta, lennoista, autovuokrauksesta, retkistä, solmitaan suoraan sinun ja kyseisen
        kolmannen osapuolen palveluntarjoajan välillä, heidän ehtojensa ja tietosuojakäytäntönsä mukaisesti. Heidän peruutus-, hyvitys-
        ja kuluttajansuojasääntönsä pätevät, eivät meidän. Suomen <em>kuluttajansuojalain 6 luvun</em> mukainen peruuttamisoikeus
        kohdistuu elinkeinonharjoittajaan; {siteName} ei ole osapuolena kyseisessä prosessissa.
      </>
    ),
    s6Title: '6. Uutiskirje',
    s6Body: (unsub, privacy) => (
      <>
        Tilaamalla uutiskirjeemme hyväksyt säännöllisten sähköpostien vastaanottamisen Suomen Lapin matkailusta.
        Voit perua tilauksen milloin tahansa jokaisesta viestistä löytyvällä linkillä tai osoitteessa {unsub}. Emme jaa sähköpostiosoitettasi kolmansille osapuolille.
        Katso {privacy} lisätietoja varten.
      </>
    ),
    s7Title: '7. Tekijänoikeudet',
    s7Body: (siteName) => `Kaikki ${siteName}-sivuston alkuperäissisältö, teksti, kuvitus ja muotoilu, kuuluu LaPeso Oy:lle tai on käytössä lisenssillä. Sisältöä ei saa jäljentää, jakaa tai muokata ilman kirjallista lupaa. Ei-kaupallinen henkilökohtainen käyttö lähteen mainiten on sallittu.`,
    s8Title: '8. Vastuunrajoitus',
    s8Body: (siteName) => `${siteName} ja LaPeso Oy eivät vastaa menetyksistä, vahingoista tai haitoista, jotka aiheutuvat sivuston tietoihin luottamisesta, linkitettyjen kolmansien osapuolten palveluiden käytöstä tai sisällön perusteella tehdyistä matkapäätöksistä. Arktisille alueille matkustaminen sisältää aina riskejä; hanki kattava matkavakuutus ja noudata paikallisia turvallisuusohjeita.`,
    s9Title: '9. Sovellettava laki',
    s9Body: 'Näihin käyttöehtoihin sovelletaan Suomen lakia. Mahdolliset riidat ratkaistaan Suomen tuomioistuimissa.',
    s10Title: '10. Käyttöehtojen muutokset',
    s10Body: 'Voimme päivittää näitä käyttöehtoja aika ajoin. Muutokset astuvat voimaan, kun ne on julkaistu. Jatkamalla sivuston käyttöä päivitysten jälkeen hyväksyt päivitetyt ehdot.',
    s11Title: '11. Erotettavuus',
    s11Body: 'Jos toimivaltainen tuomioistuin toteaa jonkin näiden käyttöehtojen kohdan pätemättömäksi, lainvastaiseksi tai täytäntöönpanokelvottomaksi, muut kohdat pysyvät täysimääräisesti voimassa. Pätemätön kohta korvataan, lain sallimissa rajoissa, pätevällä määräyksellä, joka vastaa mahdollisimman tarkasti alkuperäistä kaupallista tarkoitusta.',
    s12Title: '12. Digipalvelusäädöksen (DSA) yhteyspiste',
    s12Intro: 'EU:n digipalvelusäädöksen (asetus (EU) 2022/2065) mukainen yhteyspisteemme viranomaisille ja palvelun vastaanottajille on:',
    s12Items: [
      'Sähköposti: info@laplandvibes.com',
      'Ylläpitäjä: LaPeso Oy, Suomi',
      'Viestintäkielet: suomi, englanti',
    ],
    s12Tail: (siteName) => `${siteName} on toimituksellinen julkaisija; emme isännöi käyttäjien tuottamaa sisältöä ydinpalveluna. Ilmoitukset laittomasta sisällöstä, tekijänoikeusloukkauksista tai muista DSA:n piiriin kuuluvista asioista voi lähettää yllä olevaan osoitteeseen, ja ne käsitellään lakisääteisten aikarajojen mukaisesti.`,
    s13Title: '13. Yhteystiedot',
    s13Body: (email) => <>Oikeudellisia tiedusteluja varten ota yhteyttä osoitteeseen {email}</>,
  },
  de: {
    kicker: 'Rechtliches',
    h1: 'Nutzungsbedingungen',
    lastUpdated: 'Zuletzt aktualisiert: Mai 2026 · Betrieben von LaPeso Oy',
    s1Title: '1. Über diese Website',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) ist ein Reiseportal für Finnisch-Lappland, betrieben von{' '}
        <strong className="text-snow/90">LaPeso Oy</strong>, eingetragen in Finnland. Wir veröffentlichen redaktionelle Reiseführer,
        Zielinformationen und Links zu Buchungsdiensten Dritter.
      </>
    ),
    s1P2: 'Mit dem Zugriff auf bzw. der Nutzung dieser Website erklären Sie sich mit diesen Bedingungen einverstanden. Sind Sie damit nicht einverstanden, stellen Sie die Nutzung bitte ein.',
    s2Title: '2. Richtigkeit der Informationen',
    s2Body: 'Reiseinformationen, einschließlich Preise, Öffnungszeiten, Wetterbedingungen und Verfügbarkeit, ändern sich häufig. Wir bemühen uns um aktuelle und genaue Inhalte, können jedoch nicht garantieren, dass alle Angaben zum Zeitpunkt Ihres Besuchs aktuell sind. Bitte prüfen Sie wesentliche Details vor jeder Buchung direkt beim Anbieter.',
    s3Title: '3. Partnerlinks und Kooperationen',
    s3P1: (siteName) => `Einige Links auf ${siteName} sind Partnerlinks. Wenn Sie über diese Links eine Buchung oder einen Kauf tätigen, erhalten wir ggf. eine kleine Provision, für Sie ohne zusätzliche Kosten. Partnerschaften beeinflussen unsere redaktionellen Empfehlungen nicht. Wir verlinken ausschließlich Dienste, die wir für sinnvoll halten.`,
    s3P2: 'Zu unseren Partnern gehören u. a. Sembo, Trip.com, EconomyBookings, GetYourGuide sowie weitere Reisedienstleister über Partnernetzwerke wie Adtraction und Travelpayouts. Jede Buchung unterliegt den Bedingungen des jeweiligen Anbieters.',
    s4Title: '4. Gesponserte Inhalte',
    s4Body: (siteName) => (
      <>
        Diese Website zeigt gesponserte Anzeigen Dritter. Gesponserte Inhalte sind durch das Label{' '}
        <strong className="text-snow/90">„Gesponsert“</strong> eindeutig gekennzeichnet. {siteName} ist nicht verantwortlich für die
        Produkte, Dienste oder Aussagen der Werbetreibenden. Beim Klicken auf gesponserte Links gelangen Sie auf externe Websites mit
        eigenen Bedingungen und Datenschutzrichtlinien.
      </>
    ),
    s5Title: '5. Dienste Dritter, wir sind kein Händler',
    s5P1: (siteName) => (
      <>
        Hotelsuche, Flugsuche, Mietwagen- und Aktivitätsbuchungstools auf dieser Website leiten an externe Plattformen weiter
        (Sembo, Trip.com, EconomyBookings, GetYourGuide u. a.).{' '}
        <strong className="text-snow/90">{siteName} ist weder Reisebüro noch Wiederverkäufer oder Händler.</strong>{' '}
        Wir verkaufen, vermitteln und verarbeiten keine Buchungen; wir veröffentlichen redaktionelle Inhalte und verweisen Leser an die tatsächlich leistenden Anbieter.
      </>
    ),
    s5P2: (siteName) => (
      <>
        Verträge über Reiseleistungen, Unterkunft, Flüge, Mietwagen, Touren, kommen direkt zwischen Ihnen und dem jeweiligen Drittanbieter
        nach dessen Bedingungen und Datenschutzrichtlinie zustande. Es gelten dessen Stornierungs-, Rückerstattungs- und Verbraucherrechtsregeln, nicht unsere.
        Das finnische Widerrufsrecht nach <em>kuluttajansuojalaki 6 luku</em> richtet sich gegen den Händler; {siteName} ist hieran nicht beteiligt.
      </>
    ),
    s6Title: '6. Newsletter',
    s6Body: (unsub, privacy) => (
      <>
        Wenn Sie unseren Newsletter abonnieren, willigen Sie ein, regelmäßig E-Mails zu Reisen nach Finnisch-Lappland zu erhalten.
        Sie können sich jederzeit über den Link in jeder E-Mail oder unter {unsub} abmelden. Wir geben Ihre E-Mail-Adresse nicht an Dritte weiter.
        Einzelheiten finden Sie in unserer {privacy}.
      </>
    ),
    s7Title: '7. Geistiges Eigentum',
    s7Body: (siteName) => `Alle originalen Inhalte auf ${siteName}, Text, Grafiken, Design, gehören LaPeso Oy oder werden lizenziert genutzt. Vervielfältigung, Verbreitung oder Bearbeitung sind nur mit schriftlicher Genehmigung gestattet. Eine nicht-kommerzielle persönliche Nutzung mit Quellenangabe ist erlaubt.`,
    s8Title: '8. Haftungsbeschränkung',
    s8Body: (siteName) => `${siteName} und LaPeso Oy haften nicht für Verluste, Verletzungen oder Schäden, die aus dem Vertrauen auf Informationen dieser Website, der Nutzung verlinkter Dienste Dritter oder Reiseentscheidungen auf Basis unserer Inhalte entstehen. Reisen in arktische Regionen sind mit inhärenten Risiken verbunden; schließen Sie eine geeignete Reiseversicherung ab und befolgen Sie örtliche Sicherheitsvorgaben.`,
    s9Title: '9. Anwendbares Recht',
    s9Body: 'Es gilt finnisches Recht. Streitigkeiten werden vor den Gerichten Finnlands entschieden.',
    s10Title: '10. Änderungen dieser Bedingungen',
    s10Body: 'Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Änderungen werden mit ihrer Veröffentlichung wirksam. Die fortgesetzte Nutzung der Website nach Aktualisierungen gilt als Zustimmung zu den geänderten Bedingungen.',
    s11Title: '11. Salvatorische Klausel',
    s11Body: 'Sollte eine Bestimmung dieser Bedingungen von einem zuständigen Gericht als ungültig, rechtswidrig oder nicht durchsetzbar erklärt werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Die ungültige Bestimmung ist, soweit gesetzlich zulässig, durch eine gültige Regelung zu ersetzen, die der ursprünglichen wirtschaftlichen Absicht am nächsten kommt.',
    s12Title: '12. Kontaktstelle gemäß Digital Services Act (DSA)',
    s12Intro: 'Gemäß der EU-Verordnung (EU) 2022/2065 (Digital Services Act) ist unsere Kontaktstelle für Behörden und Nutzer:',
    s12Items: [
      'E-Mail: info@laplandvibes.com',
      'Betreiber: LaPeso Oy, Finnland',
      'Kommunikationssprachen: Englisch, Finnisch',
    ],
    s12Tail: (siteName) => `${siteName} ist ein redaktioneller Verlag; nutzergenerierte Inhalte sind nicht Kernbestandteil unseres Angebots. Meldungen zu rechtswidrigen Inhalten, Urheberrechtsverletzungen oder sonstigen DSA-relevanten Vorgängen senden Sie bitte an die oben genannte Adresse; sie werden innerhalb der gesetzlichen Fristen bearbeitet.`,
    s13Title: '13. Kontakt',
    s13Body: (email) => <>Für rechtliche Anfragen kontaktieren Sie uns unter {email}</>,
  },
  ja: {
    kicker: '法的情報',
    h1: '利用規約',
    lastUpdated: '最終更新：2026年5月 · 運営：LaPeso Oy',
    s1Title: '1. 本サイトについて',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName}(<strong className="text-snow/90">{siteUrl}</strong>)は、フィンランドに登記された{' '}
        <strong className="text-snow/90">LaPeso Oy</strong> が運営するフィンランド・ラップランドの旅行情報サイトです。編集された旅行ガイド、目的地情報、および第三者の予約サービスへのリンクを提供しています。
      </>
    ),
    s1P2: '本ウェブサイトをご利用いただくには、本規約に同意していただく必要があります。同意いただけない場合は、ご利用をお控えください。',
    s2Title: '2. 情報の正確性',
    s2Body: '旅行情報（料金、営業時間、天候、空き状況など）は頻繁に変動します。私たちは最新かつ正確な情報を心がけていますが、ご訪問時にすべての情報が最新であることを保証することはできません。ご予約前には、重要な情報は必ずサービス提供者に直接ご確認ください。',
    s3Title: '3. アフィリエイトリンクとパートナーシップ',
    s3P1: (siteName) => `${siteName} のリンクの一部はアフィリエイトリンクです。これらのリンクからご予約・ご購入された場合、お客様には追加費用なく、当サイトが少額の紹介料を受け取ることがあります。アフィリエイト関係は編集上の推奨に影響しません。本当に価値があると判断したサービスのみご紹介しています。`,
    s3P2: 'パートナーには Sembo、Trip.com、EconomyBookings、GetYourGuide、および アフィリエイトネットワーク（Adtraction、Travelpayouts など）経由のその他の旅行サービス提供者が含まれます（これらに限りません）。各ご予約はそれぞれのサービス提供者の規約・条件に従います。',
    s4Title: '4. スポンサーコンテンツ',
    s4Body: (siteName) => (
      <>
        本サイトには第三者によるスポンサー広告が表示されることがあります。スポンサーコンテンツは表示箇所に必ず{' '}
        <strong className="text-snow/90">「PR」</strong>のラベルで明示されます。{siteName} は広告主の製品・サービス・主張については責任を負いません。スポンサーリンクをクリックすると、独自の規約とプライバシーポリシーを持つ外部サイトに移動します。
      </>
    ),
    s5Title: '5. 第三者サービス：当サイトは販売業者ではありません',
    s5P1: (siteName) => (
      <>
        本サイトのホテル検索、航空券検索、レンタカー、アクティビティ予約の各ツールは、第三者のプラットフォーム（Sembo、Trip.com、EconomyBookings、GetYourGuide ほか）へリダイレクトされます。{' '}
        <strong className="text-snow/90">{siteName} は旅行代理店、小売業者、販売業者ではありません。</strong>{' '}
        当サイトは予約の販売、再販、処理を行っておりません。編集ガイドを公開し、実際にサービスを提供する事業者へ読者を案内しているだけです。
      </>
    ),
    s5P2: (siteName) => (
      <>
        旅行サービス（宿泊、航空券、レンタカー、ツアー）の契約は、お客様と当該の第三者提供者との間で、その規約とプライバシーポリシーに基づいて直接成立します。キャンセル、返金、消費者保護のルールはその事業者のものが適用され、当サイトのものではありません。フィンランドの <em>kuluttajansuojalaki 6 luku</em> による消費者撤回権は販売業者に対して行使するものであり、{siteName} はそのプロセスに関与しません。
      </>
    ),
    s6Title: '6. ニュースレター',
    s6Body: (unsub, privacy) => (
      <>
        ニュースレターにご登録いただくと、フィンランド・ラップランドの旅行情報に関する定期的なメールを受信することに同意したことになります。各メール内のリンク、または {unsub} から、いつでも配信停止が可能です。メールアドレスを第三者と共有することはありません。詳細は{privacy}をご覧ください。
      </>
    ),
    s7Title: '7. 知的財産',
    s7Body: (siteName) => `${siteName} のオリジナルコンテンツ（テキスト、画像、デザイン）はすべて LaPeso Oy が所有するか、ライセンスを受けて使用しています。書面による許可なしに複製、配布、二次創作することはできません。出典明記の上、非商用個人参照目的のフェアユースは認められます。`,
    s8Title: '8. 免責',
    s8Body: (siteName) => `${siteName} および LaPeso Oy は、本サイトの情報への信頼、リンクされた第三者サービスの利用、または当サイトのコンテンツに基づく旅行決定から生じる損失、傷害、損害について一切の責任を負いません。北極圏地域への旅行には本質的なリスクが伴います。必ず適切な旅行保険に加入し、現地の安全ガイドラインに従ってください。`,
    s9Title: '9. 準拠法',
    s9Body: '本規約はフィンランド法に準拠します。紛争はフィンランドの裁判所で解決されるものとします。',
    s10Title: '10. 本規約の変更',
    s10Body: '本規約は随時更新されることがあります。変更は掲載をもって有効となります。更新後の継続利用は、改訂された規約への同意とみなされます。',
    s11Title: '11. 分離可能性',
    s11Body: '本規約のいずれかの条項が管轄裁判所により無効、違法、または執行不能と判断された場合でも、残りの条項は引き続き完全に有効です。無効とされた条項は、法律で認められる範囲内で、当初の商業的意図に最も近い有効な条項に置き換えられます。',
    s12Title: '12. デジタルサービス法(DSA)連絡窓口',
    s12Intro: 'EU デジタルサービス法（規則 (EU) 2022/2065）に基づく、当局およびサービス利用者向けの指定連絡窓口は以下のとおりです：',
    s12Items: [
      'メール：info@laplandvibes.com',
      '運営者：LaPeso Oy、フィンランド',
      'コミュニケーション言語：英語、フィンランド語',
    ],
    s12Tail: (siteName) => `${siteName} は編集出版者であり、ユーザー生成コンテンツを主要サービスとしてはホストしていません。違法コンテンツ、著作権侵害、その他 DSA 関連の通報は、上記のアドレスにお送りいただけば、法定の期間内に対応いたします。`,
    s13Title: '13. お問い合わせ',
    s13Body: (email) => <>法的なお問い合わせは {email} までご連絡ください。</>,
  },
  es: {
    kicker: 'Legal',
    h1: 'Términos de Uso',
    lastUpdated: 'Última actualización: mayo de 2026 · Operado por LaPeso Oy',
    s1Title: '1. Sobre este sitio',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) es un portal de información turística sobre la Laponia finlandesa, operado por{' '}
        <strong className="text-snow/90">LaPeso Oy</strong>, registrada en Finlandia. Publicamos guías editoriales de viaje,
        información sobre destinos y enlaces a servicios de reserva de terceros.
      </>
    ),
    s1P2: 'Al acceder o utilizar este sitio web, usted acepta estos términos. Si no está de acuerdo, deje de utilizar el sitio.',
    s2Title: '2. Exactitud de la información',
    s2Body: 'La información turística, incluidos precios, horarios, condiciones meteorológicas y disponibilidad, cambia con frecuencia. Procuramos mantener el contenido preciso y actualizado, pero no podemos garantizar que toda la información esté vigente en el momento de su visita. Verifique siempre los detalles críticos directamente con el proveedor antes de reservar.',
    s3Title: '3. Enlaces de afiliados y colaboraciones',
    s3P1: (siteName) => `Algunos enlaces de ${siteName} son enlaces de afiliados. Cuando hace clic en estos enlaces y realiza una reserva o compra, podemos recibir una pequeña comisión sin costo adicional para usted. Las relaciones de afiliación no influyen en nuestras recomendaciones editoriales. Solo enlazamos a servicios que consideramos que aportan valor real.`,
    s3P2: 'Entre nuestros socios afiliados se incluyen, sin limitarse a: Sembo, Trip.com, EconomyBookings, GetYourGuide y otros proveedores de servicios turísticos a través de redes de afiliación como Adtraction y Travelpayouts. Cada reserva está sujeta a los términos y condiciones del proveedor correspondiente.',
    s4Title: '4. Contenido patrocinado',
    s4Body: (siteName) => (
      <>
        Este sitio muestra anuncios patrocinados de empresas terceras. El contenido patrocinado está claramente identificado
        con la etiqueta <strong className="text-snow/90">"Patrocinado"</strong> allí donde aparece. {siteName} no es
        responsable de los productos, servicios o afirmaciones de los anunciantes. Al hacer clic en enlaces patrocinados
        será dirigido a sitios externos sujetos a sus propios términos y políticas de privacidad.
      </>
    ),
    s5Title: '5. Servicios de terceros, no somos comerciantes',
    s5P1: (siteName) => (
      <>
        Las herramientas de búsqueda de hoteles, vuelos, alquiler de coches y reserva de actividades de este sitio redirigen
        a plataformas de terceros (Sembo, Trip.com, EconomyBookings, GetYourGuide y otras).{' '}
        <strong className="text-snow/90">{siteName} no es una agencia de viajes, minorista ni comerciante.</strong>{' '}
        No vendemos, revendemos ni procesamos reservas; publicamos guías editoriales y dirigimos a los lectores a los
        operadores que efectivamente prestan el servicio.
      </>
    ),
    s5P2: (siteName) => (
      <>
        Todo contrato de servicios de viaje, alojamiento, vuelos, alquiler de coches, tours, se celebra directamente
        entre usted y el proveedor externo correspondiente, según sus términos y su política de privacidad.
        Se aplican sus reglas de cancelación, reembolso y derechos del consumidor, no las nuestras. El derecho de
        desistimiento finlandés conforme al <em>kuluttajansuojalaki 6 luku</em> se ejerce frente al comerciante;
        {siteName} no interviene en ese proceso.
      </>
    ),
    s6Title: '6. Boletín',
    s6Body: (unsub, privacy) => (
      <>
        Al suscribirse a nuestro boletín, acepta recibir correos electrónicos periódicos sobre la Laponia finlandesa.
        Puede darse de baja en cualquier momento mediante el enlace en cualquier correo o visitando {unsub}. No compartimos
        su dirección de correo con terceros. Consulte nuestra {privacy} para más detalles.
      </>
    ),
    s7Title: '7. Propiedad intelectual',
    s7Body: (siteName) => `Todo el contenido original de ${siteName}, incluidos textos, gráficos y diseño, es propiedad de LaPeso Oy o se utiliza bajo licencia. No puede reproducirse, distribuirse ni crear obras derivadas sin autorización por escrito. Se permite un uso justo para referencia personal no comercial con cita de la fuente.`,
    s8Title: '8. Limitación de responsabilidad',
    s8Body: (siteName) => `${siteName} y LaPeso Oy no se hacen responsables de pérdidas, lesiones o daños derivados de la confianza en la información de este sitio, del uso de servicios de terceros enlazados, o de decisiones de viaje tomadas a partir de nuestro contenido. Viajar a regiones árticas implica riesgos inherentes; contrate un seguro de viaje adecuado y siga las indicaciones de seguridad locales.`,
    s9Title: '9. Ley aplicable',
    s9Body: 'Estos términos se rigen por la ley finlandesa. Cualquier disputa se resolverá ante los tribunales de Finlandia.',
    s10Title: '10. Cambios en estos términos',
    s10Body: 'Podemos actualizar estos términos ocasionalmente. Los cambios entran en vigor al publicarse. El uso continuado del sitio tras las actualizaciones implica la aceptación de los términos revisados.',
    s11Title: '11. Divisibilidad',
    s11Body: 'Si un tribunal competente declara inválida, ilegal o inaplicable alguna disposición de estos Términos, el resto de las disposiciones seguirán vigentes en su totalidad. La disposición inválida se sustituirá, en la medida que permita la ley, por otra válida que se ajuste lo más posible al propósito comercial original.',
    s12Title: '12. Punto de contacto a efectos de la Ley de Servicios Digitales (DSA)',
    s12Intro: 'Conforme al Reglamento (UE) 2022/2065 (DSA), nuestro punto de contacto designado para autoridades y destinatarios del servicio es:',
    s12Items: [
      'Correo electrónico: info@laplandvibes.com',
      'Operador: LaPeso Oy, Finlandia',
      'Idiomas de comunicación: inglés, finlandés',
    ],
    s12Tail: (siteName) => `${siteName} es un editor editorial; no alojamos contenido generado por usuarios como servicio principal. Las notificaciones sobre contenido ilegal, infracción de derechos de autor u otras cuestiones relevantes para la DSA pueden enviarse a la dirección anterior y se tramitarán dentro de los plazos legales.`,
    s13Title: '13. Contacto',
    s13Body: (email) => <>Para consultas legales, contáctenos en {email}</>,
  },
  'pt-BR': {
    kicker: 'Aspectos legais',
    h1: 'Termos de Uso',
    lastUpdated: 'Última atualização: maio de 2026 · Operado pela LaPeso Oy',
    s1Title: '1. Sobre este site',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) é um portal de informações turísticas sobre a Lapônia finlandesa, operado pela{' '}
        <strong className="text-snow/90">LaPeso Oy</strong>, registrada na Finlândia. Publicamos guias editoriais de viagem,
        informações sobre destinos e links para serviços de reserva de terceiros.
      </>
    ),
    s1P2: 'Ao acessar ou usar este site, você concorda com estes termos. Se não concordar, interrompa o uso do site.',
    s2Title: '2. Precisão das informações',
    s2Body: 'As informações de viagem, incluindo preços, horários, condições climáticas e disponibilidade, mudam com frequência. Buscamos manter o conteúdo atualizado e preciso, mas não podemos garantir que todas as informações estejam vigentes no momento da sua visita. Sempre confirme os detalhes críticos diretamente com os fornecedores antes de reservar.',
    s3Title: '3. Links de afiliados e parcerias',
    s3P1: (siteName) => `Alguns links em ${siteName} são links de afiliados. Quando você clica nesses links e faz uma reserva ou compra, podemos receber uma pequena comissão, sem custo adicional para você. As relações de afiliação não influenciam nossas recomendações editoriais. Só indicamos serviços que acreditamos oferecer valor genuíno.`,
    s3P2: 'Entre os parceiros afiliados estão, sem se limitar a: Sembo, Trip.com, EconomyBookings, GetYourGuide e outros fornecedores de serviços de viagem por meio de redes de afiliados como Adtraction e Travelpayouts. Cada reserva está sujeita aos termos e condições do respectivo fornecedor.',
    s4Title: '4. Conteúdo patrocinado',
    s4Body: (siteName) => (
      <>
        Este site exibe anúncios patrocinados de empresas terceiras. O conteúdo patrocinado é claramente identificado
        com o rótulo <strong className="text-snow/90">"Patrocinado"</strong> onde quer que apareça. O {siteName} não
        se responsabiliza pelos produtos, serviços ou alegações dos anunciantes. Clicar em links patrocinados levará
        você a sites externos regidos por seus próprios termos e políticas de privacidade.
      </>
    ),
    s5Title: '5. Serviços de terceiros, não somos comerciantes',
    s5P1: (siteName) => (
      <>
        As ferramentas de busca de hotéis, voos, aluguel de carros e reserva de atividades neste site redirecionam para
        plataformas de terceiros (Sembo, Trip.com, EconomyBookings, GetYourGuide e outras).{' '}
        <strong className="text-snow/90">O {siteName} não é uma agência de viagens, varejista nem comerciante.</strong>{' '}
        Não vendemos, revendemos nem processamos reservas; publicamos guias editoriais e direcionamos os leitores
        aos operadores que efetivamente prestam o serviço.
      </>
    ),
    s5P2: (siteName) => (
      <>
        Qualquer contrato relativo a serviços de viagem, hospedagem, voos, aluguel de carros, passeios, é celebrado
        diretamente entre você e o respectivo fornecedor terceiro, sob os termos e a política de privacidade dele.
        São aplicáveis as regras de cancelamento, reembolso e defesa do consumidor desse fornecedor, e não as nossas.
        O direito de arrependimento finlandês previsto no <em>kuluttajansuojalaki 6 luku</em> é exercido contra o
        comerciante; o {siteName} não participa desse processo.
      </>
    ),
    s6Title: '6. Boletim',
    s6Body: (unsub, privacy) => (
      <>
        Ao se inscrever em nosso boletim, você concorda em receber periodicamente e-mails sobre a Lapônia finlandesa.
        Você pode cancelar a inscrição a qualquer momento pelo link em qualquer e-mail ou em {unsub}. Não compartilhamos
        seu endereço de e-mail com terceiros. Veja nossa {privacy} para mais detalhes.
      </>
    ),
    s7Title: '7. Propriedade intelectual',
    s7Body: (siteName) => `Todo o conteúdo original em ${siteName}, incluindo textos, imagens e design, pertence à LaPeso Oy ou é usado mediante licença. Você não pode reproduzir, distribuir ou criar obras derivadas sem autorização por escrito. O uso justo para fins de referência pessoal não comercial é permitido com a devida atribuição.`,
    s8Title: '8. Limitação de responsabilidade',
    s8Body: (siteName) => `O ${siteName} e a LaPeso Oy não se responsabilizam por perdas, lesões ou danos decorrentes da confiança nas informações deste site, do uso de serviços de terceiros vinculados ou de decisões de viagem tomadas com base em nosso conteúdo. Viajar a regiões árticas envolve riscos inerentes; contrate sempre um seguro de viagem adequado e siga as orientações locais de segurança.`,
    s9Title: '9. Legislação aplicável',
    s9Body: 'Estes termos são regidos pelas leis da Finlândia. Quaisquer disputas serão resolvidas nos tribunais da Finlândia.',
    s10Title: '10. Alterações nestes termos',
    s10Body: 'Podemos atualizar estes termos de tempos em tempos. As alterações entram em vigor após a publicação. O uso continuado do site após as atualizações constitui aceitação dos termos revisados.',
    s11Title: '11. Independência das cláusulas',
    s11Body: 'Se qualquer disposição destes Termos for considerada inválida, ilegal ou inexequível por um tribunal competente, as demais disposições permanecerão em pleno vigor. A disposição inválida será substituída, na medida permitida por lei, por outra válida que mais se aproxime da intenção comercial original.',
    s12Title: '12. Ponto de contato para a Lei de Serviços Digitais (DSA)',
    s12Intro: 'Conforme o Regulamento (UE) 2022/2065 (DSA), nosso ponto de contato designado para autoridades e destinatários do serviço é:',
    s12Items: [
      'E-mail: info@laplandvibes.com',
      'Operador: LaPeso Oy, Finlândia',
      'Idiomas de comunicação: inglês, finlandês',
    ],
    s12Tail: (siteName) => `O ${siteName} é um editor editorial; não hospedamos conteúdo gerado por usuários como serviço principal. Notificações sobre conteúdo ilegal, violações de direitos autorais ou outras questões relevantes à DSA podem ser enviadas para o endereço acima e serão tratadas dentro dos prazos legais.`,
    s13Title: '13. Contato',
    s13Body: (email) => <>Para questões jurídicas, entre em contato em {email}</>,
  },
  'zh-CN': {
    kicker: '法律信息',
    h1: '服务条款',
    lastUpdated: '最后更新：2026年5月 · 运营方：LaPeso Oy',
    s1Title: '1. 关于本网站',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName}（<strong className="text-snow/90">{siteUrl}</strong>）是一个芬兰拉普兰旅游信息中心，由在芬兰注册的{' '}
        <strong className="text-snow/90">LaPeso Oy</strong> 运营。我们提供编辑型旅游指南、目的地信息以及指向第三方预订服务的链接。
      </>
    ),
    s1P2: '访问或使用本网站，即表示您同意本条款。如果您不同意，请停止使用本网站。',
    s2Title: '2. 信息准确性',
    s2Body: '旅行信息（包括价格、营业时间、天气状况和可订情况）经常发生变化。我们努力保持内容准确并保持更新，但无法保证您访问时所有信息都是最新的。在预订前，请始终直接向相关服务提供方核实关键信息。',
    s3Title: '3. 联盟链接与合作',
    s3P1: (siteName) => `${siteName} 上的某些链接是联盟链接。当您点击这些链接并完成预订或购买时，我们可能会获得一笔少量佣金，而您无需承担额外费用。联盟合作不会影响我们的编辑推荐。我们只链接我们认为真正具有价值的服务。`,
    s3P2: '联盟合作伙伴包括但不限于：Sembo、Trip.com、EconomyBookings、GetYourGuide，以及通过 Adtraction、Travelpayouts 等联盟网络接入的其他旅游服务提供方。每一笔预订均受相应服务提供方的条款与条件约束。',
    s4Title: '4. 赞助内容',
    s4Body: (siteName) => (
      <>
        本网站会展示来自第三方企业的赞助广告。赞助内容会清晰地标注 <strong className="text-snow/90">"赞助"</strong> 字样。
        {siteName} 不对广告主的产品、服务或主张负责。点击赞助链接将带您前往拥有自身条款与隐私政策的外部网站。
      </>
    ),
    s5Title: '5. 第三方服务：我们不是销售方',
    s5P1: (siteName) => (
      <>
        本网站上的酒店搜索、机票搜索、租车与活动预订工具会将您重定向至第三方平台（Sembo、Trip.com、EconomyBookings、GetYourGuide 等）。{' '}
        <strong className="text-snow/90">{siteName} 既不是旅行社，也不是零售商或销售商。</strong>{' '}
        我们不销售、不转售也不处理预订；我们发布编辑指南，并将读者引导至真正提供服务的运营商。
      </>
    ),
    s5P2: (siteName) => (
      <>
        任何旅游服务合同（住宿、机票、租车、行程等）均由您与相应的第三方提供方直接签订，适用其条款与隐私政策。
        适用的是其取消、退款及消费者保护规则，而非我们的规则。芬兰《消费者保护法》第6章
        (<em>kuluttajansuojalaki 6 luku</em>)规定的撤回权由您向商家主张；{siteName} 不参与该过程。
      </>
    ),
    s6Title: '6. 电子简报',
    s6Body: (unsub, privacy) => (
      <>
        如果您订阅了我们的电子简报，即表示您同意接收关于芬兰拉普兰旅游的定期电子邮件。
        您可以随时通过任何邮件中的链接，或通过 {unsub} 取消订阅。我们不会与第三方分享您的邮箱地址。
        详情请参阅我们的{privacy}。
      </>
    ),
    s7Title: '7. 知识产权',
    s7Body: (siteName) => `${siteName} 上的所有原创内容（包括文字、图形和设计）归 LaPeso Oy 所有或获许可使用。未经书面许可，不得复制、传播或创作衍生作品。在注明出处的前提下，允许出于非商业个人参考目的的合理使用。`,
    s8Title: '8. 责任限制',
    s8Body: (siteName) => `${siteName} 与 LaPeso Oy 不对因依赖本网站信息、使用所链接的第三方服务或基于我们内容作出的旅行决策而产生的任何损失、伤害或损害承担责任。前往北极地区旅行存在固有风险；请务必购买适当的旅游保险并遵守当地安全指引。`,
    s9Title: '9. 适用法律',
    s9Body: '本条款受芬兰法律管辖。任何争议应由芬兰法院解决。',
    s10Title: '10. 本条款的变更',
    s10Body: '我们可能会不时更新本条款。变更自发布之日起生效。更新后继续使用本网站即视为接受修订后的条款。',
    s11Title: '11. 可分性',
    s11Body: '如果有管辖权的法院判定本条款中的任何条款无效、违法或不可执行，其余条款仍然完全有效。无效条款将在法律允许的范围内被替换为最接近原商业意图的有效条款。',
    s12Title: '12. 《数字服务法》（DSA）联络点',
    s12Intro: '根据欧盟《数字服务法》（法规 (EU) 2022/2065），我们指定的面向监管机构与服务用户的联络点为：',
    s12Items: [
      '电子邮件：info@laplandvibes.com',
      '运营者：LaPeso Oy，芬兰',
      '沟通语言：英语、芬兰语',
    ],
    s12Tail: (siteName) => `${siteName} 为编辑型出版机构；我们并不将用户生成内容作为主要服务进行托管。关于违法内容、版权侵权或其他与 DSA 相关事项的通知，可发送至上述地址，我们将在法定时限内处理。`,
    s13Title: '13. 联系方式',
    s13Body: (email) => <>如有法律事务咨询，请通过 {email} 与我们联系</>,
  },
  ko: {
    kicker: '법적 고지',
    h1: '이용약관',
    lastUpdated: '최종 업데이트: 2026년 5월 · LaPeso Oy 운영',
    s1Title: '1. 본 사이트 소개',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName}(<strong className="text-snow/90">{siteUrl}</strong>)은 핀란드에 등록된{' '}
        <strong className="text-snow/90">LaPeso Oy</strong>가 운영하는 핀란드 라플란드 여행 정보 허브입니다.
        편집형 여행 가이드, 목적지 정보 및 제3자 예약 서비스 링크를 제공합니다.
      </>
    ),
    s1P2: '본 웹사이트에 접속하거나 이용하시는 것은 본 약관에 동의하시는 것입니다. 동의하지 않으시면 사이트 이용을 중단해 주십시오.',
    s2Title: '2. 정보의 정확성',
    s2Body: '여행 정보(가격, 영업시간, 기상 조건, 이용 가능 여부 등)는 자주 변경됩니다. 콘텐츠를 정확하고 최신으로 유지하고자 노력하지만, 귀하의 방문 시점에 모든 정보가 최신임을 보장할 수는 없습니다. 예약 전에는 반드시 해당 서비스 제공자에게 중요한 세부 사항을 직접 확인하시기 바랍니다.',
    s3Title: '3. 제휴 링크 및 파트너십',
    s3P1: (siteName) => `${siteName}의 일부 링크는 제휴 링크입니다. 이러한 링크를 클릭하시고 예약 또는 구매를 하시면 귀하께 추가 비용 없이 당사가 소액의 수수료를 받을 수 있습니다. 제휴 관계는 당사의 편집 추천에 영향을 미치지 않습니다. 당사는 진정한 가치를 제공한다고 믿는 서비스에만 링크합니다.`,
    s3P2: '제휴 파트너에는 Sembo, Trip.com, EconomyBookings, GetYourGuide 및 Adtraction, Travelpayouts 등 제휴 네트워크를 통한 기타 여행 서비스 제공자가 포함됩니다. 각 예약은 해당 서비스 제공자의 약관 및 조건에 따릅니다.',
    s4Title: '4. 후원 콘텐츠',
    s4Body: (siteName) => (
      <>
        본 사이트는 제3자 사업자의 후원 광고를 표시합니다. 후원 콘텐츠는 표시되는 모든 곳에서{' '}
        <strong className="text-snow/90">"후원"</strong> 라벨로 명확하게 식별됩니다. {siteName}은 광고주의 제품,
        서비스 또는 주장에 대해 책임지지 않습니다. 후원 링크를 클릭하시면 자체 약관 및 개인정보 처리방침을 가진
        외부 웹사이트로 이동합니다.
      </>
    ),
    s5Title: '5. 제3자 서비스, 당사는 판매자가 아닙니다',
    s5P1: (siteName) => (
      <>
        본 사이트의 호텔 검색, 항공편 검색, 렌터카, 액티비티 예약 도구는 제3자 플랫폼(Sembo, Trip.com,
        EconomyBookings, GetYourGuide 등)으로 리디렉션됩니다.{' '}
        <strong className="text-snow/90">{siteName}은 여행사, 소매업자 또는 판매자가 아닙니다.</strong>{' '}
        예약을 판매, 재판매 또는 처리하지 않습니다. 당사는 편집 가이드를 발행하고 실제 서비스를 제공하는
        운영자에게 독자를 안내합니다.
      </>
    ),
    s5P2: (siteName) => (
      <>
        여행 서비스(숙박, 항공, 렌터카, 투어 등)에 대한 모든 계약은 귀하와 해당 제3자 제공자 간에 직접 체결되며,
        해당 제공자의 약관 및 개인정보 처리방침이 적용됩니다. 해당 제공자의 취소 규정, 환불 정책, 소비자 보호 권리가
        적용됩니다. 핀란드 소비자 보호법 제6장(<em>kuluttajansuojalaki 6 luku</em>)에 따른 철회권은 판매자에 대해
        행사되며, {siteName}은 그 과정에 참여하지 않습니다.
      </>
    ),
    s6Title: '6. 뉴스레터',
    s6Body: (unsub, privacy) => (
      <>
        뉴스레터를 구독하시면 핀란드 라플란드 여행에 관한 주기적인 이메일을 수신하시는 데 동의하시는 것입니다.
        각 이메일의 링크 또는 {unsub} 방문을 통해 언제든지 구독을 해지하실 수 있습니다. 당사는 귀하의 이메일
        주소를 제3자와 공유하지 않습니다. 자세한 내용은 당사의 {privacy}을 참조하십시오.
      </>
    ),
    s7Title: '7. 지적재산권',
    s7Body: (siteName) => `${siteName}의 모든 원본 콘텐츠(텍스트, 그래픽, 디자인 포함)는 LaPeso Oy의 소유이거나 사용 라이선스를 받은 것입니다. 서면 허가 없이 복제, 배포 또는 2차 저작물을 만들 수 없습니다. 비상업적 개인 참조를 위한 공정 이용은 출처 표시와 함께 허용됩니다.`,
    s8Title: '8. 책임의 제한',
    s8Body: (siteName) => `${siteName} 및 LaPeso Oy는 본 사이트의 정보에 대한 의존, 링크된 제3자 서비스의 이용, 당사 콘텐츠에 근거한 여행 결정으로 인해 발생한 어떠한 손실, 부상 또는 손해에 대해서도 책임지지 않습니다. 북극 지역 여행에는 본질적인 위험이 따릅니다. 항상 적절한 여행자 보험에 가입하시고 현지 안전 지침을 준수하십시오.`,
    s9Title: '9. 준거법',
    s9Body: '본 약관은 핀란드 법률에 의해 규율됩니다. 모든 분쟁은 핀란드 법원에서 해결됩니다.',
    s10Title: '10. 본 약관의 변경',
    s10Body: '당사는 본 약관을 수시로 업데이트할 수 있습니다. 변경 사항은 게시 시점에 효력을 발생합니다. 업데이트 후 사이트의 지속적인 이용은 개정된 약관에 대한 동의로 간주됩니다.',
    s11Title: '11. 분리 가능성',
    s11Body: '관할 법원이 본 약관의 어떤 조항이 무효, 위법 또는 집행 불가능하다고 판단하더라도 나머지 조항은 완전한 효력을 유지합니다. 무효 조항은 법률이 허용하는 범위에서 원래의 상업적 의도에 가장 가까운 유효한 조항으로 대체됩니다.',
    s12Title: '12. 디지털 서비스법(DSA) 연락처',
    s12Intro: 'EU 디지털 서비스법(규정 (EU) 2022/2065)에 따라 당국 및 서비스 수신자를 위한 당사의 지정 연락처는 다음과 같습니다:',
    s12Items: [
      '이메일: info@laplandvibes.com',
      '운영자: LaPeso Oy, 핀란드',
      '소통 언어: 영어, 핀란드어',
    ],
    s12Tail: (siteName) => `${siteName}은 편집형 발행자입니다. 사용자 생성 콘텐츠를 주요 서비스로 호스팅하지 않습니다. 불법 콘텐츠, 저작권 침해 또는 기타 DSA 관련 사항에 대한 신고는 위 주소로 보내실 수 있으며, 법정 기한 내에 처리됩니다.`,
    s13Title: '13. 연락처',
    s13Body: (email) => <>법률 관련 문의는 {email}로 연락 주십시오</>,
  },
  fr: {
    kicker: 'Mentions légales',
    h1: 'Conditions d\'Utilisation',
    lastUpdated: 'Dernière mise à jour : mai 2026 · Exploité par LaPeso Oy',
    s1Title: '1. À propos de ce site',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) est un portail d\'information sur le voyage
        en Laponie finlandaise exploité par <strong className="text-snow/90">LaPeso Oy</strong>, immatriculé en Finlande.
        Nous proposons des guides de voyage éditoriaux, des informations sur les destinations et des liens vers
        des services de réservation tiers.
      </>
    ),
    s1P2: 'En accédant à ce site ou en l\'utilisant, vous acceptez ces conditions. Si vous n\'acceptez pas, veuillez cesser d\'utiliser le site.',
    s2Title: '2. Exactitude des informations',
    s2Body: 'Les informations de voyage, prix, horaires d\'ouverture, conditions météorologiques, disponibilité, changent fréquemment. Nous nous efforçons de tenir le contenu à jour, mais nous ne pouvons garantir que toutes les informations sont actuelles au moment de votre visite. Vérifiez toujours les détails critiques directement auprès des prestataires avant de réserver.',
    s3Title: '3. Liens d\'affiliation et partenariats',
    s3P1: (siteName) => `Certains liens sur ${siteName} sont des liens d'affiliation. Lorsque vous cliquez sur ces liens et effectuez une réservation ou un achat, nous pouvons percevoir une petite commission sans coût supplémentaire pour vous. Les relations d'affiliation n'influencent pas nos recommandations éditoriales. Nous ne créons des liens que vers des services dont nous estimons qu'ils apportent une réelle valeur.`,
    s3P2: 'Les partenaires d\'affiliation incluent notamment : Sembo, Trip.com, EconomyBookings, GetYourGuide et d\'autres prestataires de services de voyage via des réseaux d\'affiliation tels qu\'Adtraction et Travelpayouts. Chaque réservation est soumise aux conditions générales du prestataire concerné.',
    s4Title: '4. Contenu sponsorisé',
    s4Body: (siteName) => (
      <>
        Ce site affiche des publicités sponsorisées d\'entreprises tierces. Le contenu sponsorisé est clairement
        identifié par la mention <strong className="text-snow/90">« Sponsorisé »</strong> partout où il apparaît.
        {siteName} n\'est pas responsable des produits, services ou allégations des annonceurs. Cliquer sur un
        lien sponsorisé vous amènera sur des sites externes régis par leurs propres conditions et politiques de confidentialité.
      </>
    ),
    s5Title: '5. Services tiers : nous ne sommes pas un commerçant',
    s5P1: (siteName) => (
      <>
        Les outils de recherche d\'hôtels, de vols, de location de voitures et de réservation d\'activités sur ce
        site redirigent vers des plateformes tierces (Sembo, Trip.com, EconomyBookings, GetYourGuide et autres).{' '}
        <strong className="text-snow/90">{siteName} n\'est ni une agence de voyages, ni un détaillant, ni un commerçant.</strong>{' '}
        Nous ne vendons, ne revendons ni ne traitons de réservations ; nous publions des guides éditoriaux et
        orientons les lecteurs vers les opérateurs qui assurent effectivement le service.
      </>
    ),
    s5P2: (siteName) => (
      <>
        Tout contrat portant sur des services de voyage, hébergement, vols, location de voiture, excursions, 
        est conclu directement entre vous et le prestataire tiers concerné, selon ses conditions et sa politique
        de confidentialité. Ses règles d\'annulation, de remboursement et ses droits de protection des
        consommateurs s\'appliquent, pas les nôtres. Le droit de rétractation finlandais prévu par{' '}
        <em>kuluttajansuojalaki 6 luku</em> s\'exerce à l\'encontre du commerçant ; {siteName} n\'intervient pas dans ce processus.
      </>
    ),
    s6Title: '6. Newsletter',
    s6Body: (unsub, privacy) => (
      <>
        Si vous vous inscrivez à notre newsletter, vous acceptez de recevoir périodiquement des e-mails sur le
        voyage en Laponie finlandaise. Vous pouvez vous désinscrire à tout moment via le lien dans tout e-mail
        ou en visitant {unsub}. Nous ne partageons pas votre adresse e-mail avec des tiers. Voir notre {privacy} pour plus de détails.
      </>
    ),
    s7Title: '7. Propriété intellectuelle',
    s7Body: (siteName) => `Tout le contenu original sur ${siteName}, y compris les textes, graphismes et design, est la propriété de LaPeso Oy ou est utilisé sous licence. Vous ne pouvez ni reproduire, ni distribuer, ni créer d'œuvres dérivées sans autorisation écrite. L'usage loyal pour une référence personnelle non commerciale est autorisé avec attribution.`,
    s8Title: '8. Limitation de responsabilité',
    s8Body: (siteName) => `${siteName} et LaPeso Oy ne sont pas responsables des pertes, blessures ou dommages résultant de la confiance accordée aux informations de ce site, de l'utilisation de services tiers liés ou de décisions de voyage prises sur la base de notre contenu. Les voyages dans les régions arctiques comportent des risques inhérents ; souscrivez toujours une assurance voyage adaptée et suivez les consignes de sécurité locales.`,
    s9Title: '9. Loi applicable',
    s9Body: 'Les présentes conditions sont régies par les lois de la Finlande. Tout litige sera tranché par les tribunaux finlandais.',
    s10Title: '10. Modifications de ces conditions',
    s10Body: 'Nous pouvons mettre à jour ces conditions de temps à autre. Les modifications prennent effet dès leur publication. L\'utilisation continue du site après les mises à jour vaut acceptation des conditions révisées.',
    s11Title: '11. Divisibilité',
    s11Body: 'Si une disposition des présentes Conditions est jugée invalide, illégale ou inapplicable par un tribunal compétent, les autres dispositions demeurent pleinement en vigueur. La disposition invalide sera remplacée, dans la mesure permise par la loi, par une disposition valide se rapprochant au plus près de l\'intention commerciale d\'origine.',
    s12Title: '12. Point de contact Digital Services Act (DSA)',
    s12Intro: 'En vertu du règlement européen sur les services numériques (Règlement (UE) 2022/2065), notre point de contact désigné pour les autorités et les destinataires du service est :',
    s12Items: [
      'E-mail : info@laplandvibes.com',
      'Exploitant : LaPeso Oy, Finlande',
      'Langues de communication : anglais, finnois',
    ],
    s12Tail: (siteName) => `${siteName} est un éditeur éditorial ; nous n'hébergeons pas de contenu généré par les utilisateurs en tant que service principal. Les signalements de contenus illicites, d'atteinte aux droits d'auteur ou d'autres questions relevant du DSA peuvent être envoyés à l'adresse ci-dessus et seront traités dans les délais légaux.`,
    s13Title: '13. Contact',
    s13Body: (email) => <>Pour toute question juridique, contactez-nous à {email}</>,
  },
  it: {
    kicker: 'Note legali',
    h1: 'Termini di Utilizzo',
    lastUpdated: 'Ultimo aggiornamento: maggio 2026 · Gestito da LaPeso Oy',
    s1Title: '1. Informazioni su questo sito',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) è un portale di informazioni di viaggio sulla
        Lapponia finlandese gestito da <strong className="text-snow/90">LaPeso Oy</strong>, registrata in Finlandia.
        Forniamo guide di viaggio editoriali, informazioni sulle destinazioni e link a servizi di prenotazione di terzi.
      </>
    ),
    s1P2: 'Accedendo o utilizzando il presente sito web, Lei accetta i presenti termini. Se non accetta, La preghiamo di interrompere l\'uso del sito.',
    s2Title: '2. Accuratezza delle informazioni',
    s2Body: 'Le informazioni di viaggio, inclusi prezzi, orari di apertura, condizioni meteo e disponibilità, cambiano di frequente. Ci impegniamo a mantenere il contenuto accurato e aggiornato, ma non possiamo garantire che tutte le informazioni siano attuali al momento della Sua visita. Verifichi sempre i dettagli critici direttamente con i fornitori di servizi prima di prenotare.',
    s3Title: '3. Link di affiliazione e partnership',
    s3P1: (siteName) => `Alcuni link su ${siteName} sono link di affiliazione. Quando Lei clicca su questi link ed effettua una prenotazione o un acquisto, potremmo ricevere una piccola commissione senza costi aggiuntivi. I rapporti di affiliazione non influenzano le nostre raccomandazioni editoriali. Inseriamo link solo verso servizi che riteniamo offrano un valore reale.`,
    s3P2: 'I partner di affiliazione includono, a titolo esemplificativo: Sembo, Trip.com, EconomyBookings, GetYourGuide e altri fornitori di servizi di viaggio tramite network di affiliazione come Adtraction e Travelpayouts. Ogni prenotazione è soggetta ai termini e alle condizioni del rispettivo fornitore.',
    s4Title: '4. Contenuti sponsorizzati',
    s4Body: (siteName) => (
      <>
        Questo sito mostra annunci sponsorizzati di aziende terze. I contenuti sponsorizzati sono chiaramente
        contrassegnati con l\'etichetta <strong className="text-snow/90">"Sponsorizzato"</strong> ovunque appaiano.
        {siteName} non è responsabile dei prodotti, servizi o affermazioni degli inserzionisti. Cliccando sui
        link sponsorizzati verrà reindirizzato a siti esterni regolati da propri termini e politiche sulla privacy.
      </>
    ),
    s5Title: '5. Servizi di terzi, non siamo un commerciante',
    s5P1: (siteName) => (
      <>
        Gli strumenti di ricerca hotel, voli, autonoleggio e prenotazione attività su questo sito reindirizzano
        a piattaforme di terzi (Sembo, Trip.com, EconomyBookings, GetYourGuide e altre).{' '}
        <strong className="text-snow/90">{siteName} non è un\'agenzia di viaggi, un rivenditore né un commerciante.</strong>{' '}
        Non vendiamo, rivendiamo né processiamo prenotazioni; pubblichiamo guide editoriali e indirizziamo i
        lettori agli operatori che effettivamente erogano il servizio.
      </>
    ),
    s5P2: (siteName) => (
      <>
        Qualsiasi contratto per servizi di viaggio, alloggio, voli, autonoleggio, tour, è concluso direttamente
        tra Lei e il relativo fornitore terzo, secondo i suoi termini e la sua informativa sulla privacy.
        Si applicano le sue regole di cancellazione, rimborso e tutela del consumatore, non le nostre. Il diritto
        di recesso finlandese previsto dal <em>kuluttajansuojalaki 6 luku</em> si esercita nei confronti del
        commerciante; {siteName} non interviene in tale processo.
      </>
    ),
    s6Title: '6. Newsletter',
    s6Body: (unsub, privacy) => (
      <>
        Iscrivendosi alla nostra newsletter, Lei accetta di ricevere periodicamente email sui viaggi in Lapponia
        finlandese. Può disiscriversi in qualsiasi momento tramite il link presente in ogni email o visitando {unsub}.
        Non condividiamo il Suo indirizzo email con terzi. Per dettagli, consulti la nostra {privacy}.
      </>
    ),
    s7Title: '7. Proprietà intellettuale',
    s7Body: (siteName) => `Tutti i contenuti originali su ${siteName}, inclusi testi, grafica e design, sono di proprietà di LaPeso Oy o utilizzati su licenza. Non è consentito riprodurre, distribuire o creare opere derivate senza autorizzazione scritta. L'uso corretto per riferimento personale non commerciale è consentito con citazione della fonte.`,
    s8Title: '8. Limitazione di responsabilità',
    s8Body: (siteName) => `${siteName} e LaPeso Oy non sono responsabili di alcuna perdita, lesione o danno derivante dall'affidamento alle informazioni di questo sito, dall'uso di servizi di terzi collegati o da decisioni di viaggio prese sulla base dei nostri contenuti. I viaggi in regioni artiche comportano rischi intrinseci; sottoscriva sempre un'assicurazione di viaggio adeguata e segua le indicazioni di sicurezza locali.`,
    s9Title: '9. Legge applicabile',
    s9Body: 'I presenti termini sono regolati dalla legge finlandese. Eventuali controversie saranno risolte presso i tribunali finlandesi.',
    s10Title: '10. Modifiche ai presenti termini',
    s10Body: 'Possiamo aggiornare i presenti termini periodicamente. Le modifiche hanno effetto dal momento della pubblicazione. L\'uso continuato del sito dopo gli aggiornamenti costituisce accettazione dei termini rivisti.',
    s11Title: '11. Separabilità',
    s11Body: 'Qualora un\'autorità giurisdizionale competente dichiarasse non valida, illegittima o inapplicabile una qualsiasi disposizione dei presenti Termini, le restanti disposizioni rimarranno pienamente efficaci. La disposizione non valida sarà sostituita, nei limiti consentiti dalla legge, con una disposizione valida che rispecchi quanto più possibile l\'originaria intenzione commerciale.',
    s12Title: '12. Punto di contatto Digital Services Act (DSA)',
    s12Intro: 'Ai sensi del Regolamento sui servizi digitali (Regolamento (UE) 2022/2065), il nostro punto di contatto designato per autorità e destinatari del servizio è:',
    s12Items: [
      'Email: info@laplandvibes.com',
      'Gestore: LaPeso Oy, Finlandia',
      'Lingue di comunicazione: inglese, finlandese',
    ],
    s12Tail: (siteName) => `${siteName} è un editore editoriale; non ospitiamo contenuti generati dagli utenti come servizio principale. Segnalazioni di contenuti illeciti, violazioni del diritto d'autore o altre questioni rilevanti ai sensi del DSA possono essere inviate all'indirizzo indicato e saranno trattate entro i tempi previsti dalla legge.`,
    s13Title: '13. Contatti',
    s13Body: (email) => <>Per richieste legali, ci contatti a {email}</>,
  },
  nl: {
    kicker: 'Juridisch',
    h1: 'Gebruiksvoorwaarden',
    lastUpdated: 'Laatst bijgewerkt: mei 2026 · Beheerd door LaPeso Oy',
    s1Title: '1. Over deze site',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) is een Fins Lapland-reisinformatieportaal dat
        wordt beheerd door <strong className="text-snow/90">LaPeso Oy</strong>, geregistreerd in Finland. Wij bieden
        redactionele reisgidsen, bestemmingsinformatie en links naar boekingsdiensten van derden.
      </>
    ),
    s1P2: 'Door deze website te bezoeken of te gebruiken, gaat u akkoord met deze voorwaarden. Als u niet akkoord gaat, dient u het gebruik van de site te staken.',
    s2Title: '2. Juistheid van informatie',
    s2Body: 'Reisinformatie, waaronder prijzen, openingstijden, weersomstandigheden en beschikbaarheid, verandert regelmatig. Wij streven ernaar de inhoud accuraat en actueel te houden, maar kunnen niet garanderen dat alle informatie actueel is op het moment van uw bezoek. Verifieer kritieke details altijd rechtstreeks bij dienstverleners voordat u boekt.',
    s3Title: '3. Affiliate links en partnerschappen',
    s3P1: (siteName) => `Sommige links op ${siteName} zijn affiliate links. Wanneer u op deze links klikt en een boeking of aankoop doet, kunnen wij een kleine commissie ontvangen zonder extra kosten voor u. Affiliate-relaties beïnvloeden onze redactionele aanbevelingen niet. Wij linken alleen naar diensten waarvan wij denken dat zij echte waarde bieden.`,
    s3P2: 'Affiliate-partners omvatten onder meer: Sembo, Trip.com, EconomyBookings, GetYourGuide en andere aanbieders van reisdiensten via affiliatenetwerken zoals Adtraction en Travelpayouts. Elke boeking is onderworpen aan de algemene voorwaarden van de betreffende dienstverlener.',
    s4Title: '4. Gesponsorde inhoud',
    s4Body: (siteName) => (
      <>
        Deze site toont gesponsorde advertenties van externe bedrijven. Gesponsorde inhoud wordt overal duidelijk
        aangeduid met het label <strong className="text-snow/90">"Gesponsord"</strong>. {siteName} is niet
        verantwoordelijk voor de producten, diensten of beweringen van adverteerders. Klikken op gesponsorde links
        brengt u naar externe websites die zijn onderworpen aan hun eigen voorwaarden en privacybeleid.
      </>
    ),
    s5Title: '5. Diensten van derden, wij zijn geen handelaar',
    s5P1: (siteName) => (
      <>
        De hotelzoekmachine, vluchtzoekmachine, autoverhuur- en activiteitenboekingstools op deze site verwijzen
        door naar externe platforms (Sembo, Trip.com, EconomyBookings, GetYourGuide en andere).{' '}
        <strong className="text-snow/90">{siteName} is geen reisbureau, detailhandelaar of handelaar.</strong>{' '}
        Wij verkopen, herverkopen of verwerken geen boekingen; wij publiceren redactionele gidsen en verwijzen
        lezers naar de operators die de dienst daadwerkelijk leveren.
      </>
    ),
    s5P2: (siteName) => (
      <>
        Elk contract voor reisdiensten, accommodatie, vluchten, autoverhuur, tours, wordt rechtstreeks gesloten
        tussen u en de betreffende externe aanbieder, op diens voorwaarden en onder diens privacybeleid. Hun
        annulerings-, terugbetalings- en consumentenbeschermingsregels zijn van toepassing, niet de onze. Het
        Finse herroepingsrecht onder <em>kuluttajansuojalaki 6 luku</em> wordt uitgeoefend jegens de handelaar;
        {siteName} speelt daarin geen rol.
      </>
    ),
    s6Title: '6. Nieuwsbrief',
    s6Body: (unsub, privacy) => (
      <>
        Als u zich abonneert op onze nieuwsbrief, gaat u ermee akkoord periodieke e-mails over reizen naar Fins
        Lapland te ontvangen. U kunt zich op elk moment afmelden via de link in elke e-mail of door {unsub} te
        bezoeken. Wij delen uw e-mailadres niet met derden. Zie ons {privacy} voor details.
      </>
    ),
    s7Title: '7. Intellectueel eigendom',
    s7Body: (siteName) => `Alle originele inhoud op ${siteName}, inclusief tekst, afbeeldingen en design, is eigendom van LaPeso Oy of wordt in licentie gebruikt. U mag deze niet reproduceren, verspreiden of er afgeleide werken van maken zonder schriftelijke toestemming. Redelijk gebruik voor niet-commerciële persoonlijke referentie is toegestaan met bronvermelding.`,
    s8Title: '8. Beperking van aansprakelijkheid',
    s8Body: (siteName) => `${siteName} en LaPeso Oy zijn niet aansprakelijk voor enig verlies, letsel of schade voortvloeiend uit het vertrouwen op informatie op deze site, uit het gebruik van gelinkte externe diensten of uit reisbeslissingen op basis van onze inhoud. Reizen naar het Arctische gebied brengt inherente risico's met zich mee; sluit altijd een passende reisverzekering af en volg lokale veiligheidsrichtlijnen.`,
    s9Title: '9. Toepasselijk recht',
    s9Body: 'Deze voorwaarden vallen onder Fins recht. Eventuele geschillen worden voorgelegd aan de Finse rechtbanken.',
    s10Title: '10. Wijzigingen van deze voorwaarden',
    s10Body: 'Wij kunnen deze voorwaarden van tijd tot tijd bijwerken. Wijzigingen worden van kracht na publicatie. Voortgezet gebruik van de site na de updates houdt aanvaarding van de herziene voorwaarden in.',
    s11Title: '11. Scheidbaarheid',
    s11Body: 'Indien een bepaling van deze Voorwaarden door een bevoegde rechtbank ongeldig, onwettig of niet-afdwingbaar wordt geacht, blijven de overige bepalingen volledig van kracht. De ongeldige bepaling wordt, voor zover wettelijk toegestaan, vervangen door een geldige bepaling die de oorspronkelijke commerciële bedoeling het dichtst benadert.',
    s12Title: '12. Contactpunt Digital Services Act (DSA)',
    s12Intro: 'Onder de EU Digital Services Act (Verordening (EU) 2022/2065) is ons aangewezen contactpunt voor autoriteiten en afnemers van de dienst:',
    s12Items: [
      'E-mail: info@laplandvibes.com',
      'Beheerder: LaPeso Oy, Finland',
      'Communicatietalen: Engels, Fins',
    ],
    s12Tail: (siteName) => `${siteName} is een redactionele uitgever; wij hosten geen door gebruikers gegenereerde inhoud als primaire dienst. Meldingen van illegale inhoud, auteursrechtinbreuk of andere DSA-relevante zaken kunnen worden verzonden naar het bovenstaande adres en zullen binnen de wettelijke termijnen worden behandeld.`,
    s13Title: '13. Contact',
    s13Body: (email) => <>Voor juridische vragen kunt u contact opnemen via {email}</>,
  },
  sv: {
    kicker: 'Juridik',
    h1: 'Användarvillkor',
    lastUpdated: 'Senast uppdaterad: maj 2026 · Drivs av LaPeso Oy',
    s1Title: '1. Om denna webbplats',
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) är en reseinformationsportal för finska Lappland som drivs av{' '}
        <strong className="text-snow/90">LaPeso Oy</strong>, registrerat i Finland. Vi tillhandahåller redaktionella reseguider,
        destinationsinformation och länkar till bokningstjänster hos tredje part.
      </>
    ),
    s1P2: 'Genom att öppna eller använda denna webbplats godkänner du dessa villkor. Om du inte godkänner dem, vänligen sluta använda webbplatsen.',
    s2Title: '2. Informationens korrekthet',
    s2Body: 'Reseinformation, inklusive priser, öppettider, väderförhållanden och tillgänglighet, ändras ofta. Vi strävar efter att hålla innehållet korrekt och uppdaterat, men kan inte garantera att all information är aktuell vid tidpunkten för ditt besök. Kontrollera alltid viktiga uppgifter direkt hos tjänsteleverantören innan du bokar.',
    s3Title: '3. Affiliatelänkar och samarbeten',
    s3P1: (siteName) => `Vissa länkar på ${siteName} är affiliatelänkar. När du klickar på dessa länkar och gör en bokning eller ett köp kan vi få en liten provision utan extra kostnad för dig. Affiliaterelationer påverkar inte våra redaktionella rekommendationer. Vi länkar endast till tjänster vi tror ger genuint värde.`,
    s3P2: 'Affiliatepartner omfattar men är inte begränsade till: Sembo, Trip.com, EconomyBookings, GetYourGuide och andra resetjänsteleverantörer via affiliatenätverk som Adtraction och Travelpayouts. Varje bokning omfattas av respektive tjänsteleverantörs egna villkor.',
    s4Title: '4. Sponsrat innehåll',
    s4Body: (siteName) => (
      <>
        Den här webbplatsen visar sponsrade annonser från tredjepartsföretag. Sponsrat innehåll är tydligt märkt
        med etiketten <strong className="text-snow/90">"Sponsrad"</strong> överallt där det förekommer. {siteName} ansvarar
        inte för produkter, tjänster eller påståenden från annonsörer. Att klicka på sponsrade länkar tar dig
        till externa webbplatser som styrs av sina egna villkor och integritetspolicyer.
      </>
    ),
    s5Title: '5. Tjänster från tredje part, vi är ingen återförsäljare',
    s5P1: (siteName) => (
      <>
        Verktygen för hotellsökning, flygsökning, hyrbil och aktivitetsbokning på den här webbplatsen omdirigerar till
        tredjepartsplattformar (Sembo, Trip.com, EconomyBookings, GetYourGuide med flera).{' '}
        <strong className="text-snow/90">{siteName} är varken resebyrå, återförsäljare eller handlare.</strong>{' '}
        Vi säljer, återförsäljer eller behandlar inga bokningar; vi publicerar redaktionella guider och hänvisar läsarna
        till de aktörer som faktiskt levererar tjänsten.
      </>
    ),
    s5P2: (siteName) => (
      <>
        Alla avtal om resetjänster, boende, flyg, hyrbil, turer, ingås direkt mellan dig och den relevanta
        tredjepartsleverantören, enligt dennes villkor och integritetspolicy. Deras regler för avbokning,
        återbetalning och konsumentskydd gäller, inte våra. Den finska konsumentens ångerrätt enligt{' '}
        <em>kuluttajansuojalaki 6 luku</em> (konsumentskyddslagen kapitel 6) utövas gentemot handlaren; {siteName} har ingen roll i den processen.
      </>
    ),
    s6Title: '6. Nyhetsbrev',
    s6Body: (unsub, privacy) => (
      <>
        Om du prenumererar på vårt nyhetsbrev godkänner du att få regelbundna e-postmeddelanden om resor i finska
        Lappland. Du kan avregistrera dig när som helst med länken i valfritt e-postmeddelande eller genom att besöka {unsub}. Vi delar inte din
        e-postadress med tredje part. Se vår {privacy} för detaljer.
      </>
    ),
    s7Title: '7. Immateriella rättigheter',
    s7Body: (siteName) => `Allt originalinnehåll på ${siteName}, inklusive text, grafik och design, ägs av LaPeso Oy eller används under licens. Du får inte återge, distribuera eller skapa bearbetningar utan skriftligt tillstånd. Skälig användning för icke-kommersiell personlig referens är tillåten med källhänvisning.`,
    s8Title: '8. Ansvarsbegränsning',
    s8Body: (siteName) => `${siteName} och LaPeso Oy ansvarar inte för förlust, skada eller men som uppstår genom att förlita sig på information på den här webbplatsen, från användning av länkade tredjepartstjänster eller från resebeslut som fattas utifrån vårt innehåll. Resor till arktiska regioner innebär inneboende risker; skaffa alltid en lämplig reseförsäkring och följ lokala säkerhetsanvisningar.`,
    s9Title: '9. Tillämplig lag',
    s9Body: 'Dessa villkor regleras av finsk lag. Eventuella tvister ska avgöras i finsk domstol.',
    s10Title: '10. Ändringar av dessa villkor',
    s10Body: 'Vi kan uppdatera dessa villkor då och då. Ändringar träder i kraft när de publiceras. Fortsatt användning av webbplatsen efter uppdateringar innebär att du godkänner de reviderade villkoren.',
    s11Title: '11. Ogiltighet av enskilda villkor',
    s11Body: 'Om någon bestämmelse i dessa villkor av en behörig domstol anses ogiltig, olaglig eller inte verkställbar, förblir de återstående bestämmelserna i full kraft och verkan. Den ogiltiga bestämmelsen ska, i den utsträckning lagen tillåter, ersättas med en giltig bestämmelse som ligger så nära den ursprungliga kommersiella avsikten som möjligt.',
    s12Title: '12. Kontaktpunkt enligt förordningen om digitala tjänster (DSA)',
    s12Intro: 'Enligt EU:s förordning om digitala tjänster (förordning (EU) 2022/2065) är vår utsedda kontaktpunkt för myndigheter och mottagare av tjänsten:',
    s12Items: [
      'E-post: info@laplandvibes.com',
      'Operatör: LaPeso Oy, Finland',
      'Kommunikationsspråk: engelska, finska',
    ],
    s12Tail: (siteName) => `${siteName} är en redaktionell utgivare; vi hostar inte användargenererat innehåll som en primär tjänst. Anmälningar om olagligt innehåll, upphovsrättsintrång eller andra frågor som rör DSA kan skickas till adressen ovan och behandlas inom lagstadgade tidsramar.`,
    s13Title: '13. Kontakt',
    s13Body: (email) => <>Vid juridiska frågor, kontakta oss på {email}</>,
  },
};

/**
 * @harvest-stop — esirenderöinnin haravointi loppuu tähän.
 *
 * Kaikki tämän alapuolella oleva on opt-in-varianttitekstiä (`variant="shop"`), jota
 * käyttää vain kaksi sivustoa. Crawlable-body-haravoija lukee koko tiedoston ja poimii
 * JOKAISEN per-kieli-lohkon, joten ilman tätä katkoa matkailusivuston lakisivulle päätyi
 * verkkokaupan ehdot 12 kielellä (mitattu 31.8.2026: 23 sivustoa, 276 sivua).
 */
/**
 * Shop-variant overrides (`variant="shop"`).
 *
 * 🔴 Why this exists instead of an edit to COPY: this file is shared by the
 * whole network and travel sites are the majority, so the travel wording must
 * stay exactly as it is. Sites opt in; passing nothing keeps the previous
 * behaviour byte for byte.
 *
 * The 2026-08-13 compliance audit found the travel text materially false on
 * laplandgifts.com and laplandstore.fi: §5 described hotel, flight and car
 * rental search tools that neither shop has, §3 named Sembo, Trip.com and
 * EconomyBookings none of which is a shop partner, §1 called the site a
 * travel information hub, §2 warned about weather conditions, and §8 told
 * gift buyers to take out travel insurance. §5 also framed "we are not a
 * merchant" purely around travel services, so it never covered the things a
 * shop visitor actually needs: delivery, returns, warranty, VAT and customs.
 *
 * Only the six wrong keys are overridden. Everything else (newsletter, IP,
 * governing law, DSA contact point) is correct for a shop as written.
 */
const SHOP_OVERRIDES: Record<Lang, Partial<TermsCopy>> = {
  en: {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) is a curated Finnish Lapland gift
        guide operated by <strong className="text-snow/90">LaPeso Oy</strong>, registered in Finland. We
        publish editorial product guides and link to the shops that actually sell and ship the items.
      </>
    ),
    s2Body: 'Product details, including prices, sizes, materials, ingredients and availability, change frequently and are read from the seller\'s own pages on the date shown. We aim to keep them accurate, but we cannot guarantee they are current when you visit. Always check the price, the delivery terms and any ingredient or allergen information on the seller\'s own page before you order.',
    s3P2: 'Affiliate partners include but are not limited to Finnish shops and brands such as Suomikauppa, Nordicbuddies, Finlayson and Scandinavian Outdoor, reached through affiliate networks such as Adtraction and Daisycon. We also link to shops that pay us nothing. Every order is subject to the terms and conditions of the shop that sells it.',
    s5P1: (siteName) => (
      <>
        Every product on this site is sold and shipped by a third-party shop, and the buttons take you to
        that shop’s own website. <strong className="text-snow/90">{siteName} is not a retailer, merchant
        or reseller.</strong> We hold no stock, we run no checkout, and we never take your payment or your
        delivery address.
      </>
    ),
    s5P2: () => (
      <>
        The purchase contract is concluded directly between you and that shop, on their terms and under
        their privacy policy. Delivery times, shipping costs, any VAT or customs charges on orders leaving
        the EU, returns, refunds and warranty are theirs, not ours. A statutory right of withdrawal in
        distance selling, in Finland under <em>kuluttajansuojalaki 6 luku</em>, is exercised against the
        shop that sold the item.
      </>
    ),
    s8Body: (siteName) => `${siteName} and LaPeso Oy are not liable for any loss or damage arising from reliance on the product information on this site, from use of the shops we link to, or from a purchase made through them. Any claim about a product, its delivery or its condition is made against the shop that sold it. For foodstuffs and food supplements, always read the ingredient, allergen and dosage information on the packaging and on the seller's own page.`,
  },
  fi: {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) on kuratoitu lahjaopas Suomen
        Lappiin, ja sitä ylläpitää suomalainen <strong className="text-snow/90">LaPeso Oy</strong>.
        Julkaisemme toimituksellisia tuoteoppaita ja linkitämme kauppoihin, jotka myyvät ja toimittavat
        tuotteet.
      </>
    ),
    s2Body: 'Tuotetiedot, kuten hinnat, koot, materiaalit, ainesosat ja saatavuus, muuttuvat usein. Ne on luettu myyjän omilta sivuilta merkittynä päivänä. Pyrimme pitämään ne oikeina, emmekä voi taata, että ne ovat ajan tasalla juuri sinun käynnilläsi. Tarkista hinta, toimitusehdot sekä ainesosa- ja allergeenitiedot myyjän omalta sivulta ennen tilaamista.',
    s3P2: 'Kumppaneihin kuuluvat muun muassa suomalaiset kaupat ja brändit, kuten Suomikauppa, Nordicbuddies, Finlayson ja Scandinavian Outdoor, joihin linkitämme kumppaniverkostojen kuten Adtractionin ja Daisyconin kautta. Linkitämme myös kauppoihin, joista emme saa mitään. Jokaiseen tilaukseen sovelletaan sen kaupan ehtoja, joka tuotteen myy.',
    s5P1: (siteName) => (
      <>
        Jokaisen tämän sivuston tuotteen myy ja toimittaa ulkopuolinen kauppa, ja painikkeet vievät sinut
        kyseisen kaupan omille sivuille. <strong className="text-snow/90">{siteName} ei ole vähittäiskauppa,
        myyjä eikä jälleenmyyjä.</strong> Meillä ei ole varastoa eikä kassaa, emmekä ota vastaan maksuasi
        tai toimitusosoitettasi.
      </>
    ),
    s5P2: () => (
      <>
        Kauppasopimus syntyy suoraan sinun ja kyseisen kaupan välille, sen ehdoilla ja sen
        tietosuojakäytännön mukaisesti. Toimitusajat, toimituskulut, EU:n ulkopuolelle menevien tilausten
        arvonlisävero ja tullimaksut, palautukset, hyvitykset ja takuu ovat kaupan vastuulla, eivät
        meidän. Etämyynnin peruuttamisoikeutta, Suomessa <em>kuluttajansuojalain 6 luvun</em> mukaan,
        käytetään sitä kauppaa kohtaan, joka tuotteen myi.
      </>
    ),
    s8Body: (siteName) => `${siteName} ja LaPeso Oy eivät vastaa vahingosta, joka aiheutuu tämän sivuston tuotetietoihin luottamisesta, linkitettyjen kauppojen käytöstä tai niiden kautta tehdystä ostoksesta. Tuotetta, sen toimitusta tai kuntoa koskeva vaatimus esitetään sille kaupalle, joka tuotteen myi. Elintarvikkeissa ja ravintolisissä lue aina ainesosa-, allergeeni- ja annostustiedot pakkauksesta ja myyjän omalta sivulta.`,
  },
  de: {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) ist ein kuratierter Geschenkeführer
        für Finnisch-Lappland, betrieben von der in Finnland eingetragenen{' '}
        <strong className="text-snow/90">LaPeso Oy</strong>. Wir veröffentlichen redaktionelle
        Produktratgeber und verlinken auf die Shops, die die Artikel tatsächlich verkaufen und versenden.
      </>
    ),
    s2Body: 'Produktangaben wie Preise, Größen, Materialien, Zutaten und Verfügbarkeit ändern sich häufig. Sie werden am angegebenen Tag von den Seiten des jeweiligen Verkäufers übernommen. Wir bemühen uns, sie korrekt zu halten, können aber nicht garantieren, dass sie zum Zeitpunkt Ihres Besuchs aktuell sind. Prüfen Sie Preis, Lieferbedingungen sowie Zutaten- und Allergenangaben stets auf der Seite des Verkäufers, bevor Sie bestellen.',
    s3P2: 'Zu den Partnern zählen unter anderem finnische Shops und Marken wie Suomikauppa, Nordicbuddies, Finlayson und Scandinavian Outdoor, die wir über Partnernetzwerke wie Adtraction und Daisycon verlinken. Wir verlinken auch Shops, die uns nichts zahlen. Für jede Bestellung gelten die Bedingungen des Shops, der den Artikel verkauft.',
    s5P1: (siteName) => (
      <>
        Jedes Produkt auf dieser Website wird von einem fremden Shop verkauft und versendet; die Buttons
        führen Sie auf dessen eigene Website. <strong className="text-snow/90">{siteName} ist kein
        Einzelhändler, Verkäufer oder Wiederverkäufer.</strong> Wir führen kein Lager, betreiben keine
        Kasse und nehmen weder Ihre Zahlung noch Ihre Lieferadresse entgegen.
      </>
    ),
    s5P2: () => (
      <>
        Der Kaufvertrag kommt unmittelbar zwischen Ihnen und diesem Shop zustande, zu dessen Bedingungen
        und Datenschutzerklärung. Lieferzeiten, Versandkosten, Umsatzsteuer und Zollgebühren bei
        Bestellungen außerhalb der EU, Rückgaben, Erstattungen und Gewährleistung liegen bei dem Shop,
        nicht bei uns. Ein gesetzliches Widerrufsrecht im Fernabsatz, in Finnland nach{' '}
        <em>kuluttajansuojalaki 6 luku</em>, wird gegenüber dem verkaufenden Shop ausgeübt.
      </>
    ),
    s8Body: (siteName) => `${siteName} und LaPeso Oy haften nicht für Verluste oder Schäden, die aus dem Vertrauen auf die Produktangaben dieser Website, aus der Nutzung der verlinkten Shops oder aus einem darüber getätigten Kauf entstehen. Ansprüche wegen eines Produkts, seiner Lieferung oder seines Zustands richten sich gegen den Shop, der es verkauft hat. Lesen Sie bei Lebensmitteln und Nahrungsergänzungsmitteln stets die Zutaten-, Allergen- und Dosierungsangaben auf der Verpackung und auf der Seite des Verkäufers.`,
  },
  ja: {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName}（<strong className="text-snow/90">{siteUrl}</strong>）は、フィンランド法人{' '}
        <strong className="text-snow/90">LaPeso Oy</strong> が運営する、フィンランド・ラップランドのギフト
        ガイドです。編集記事として商品ガイドを掲載し、実際に販売・発送を行う店舗へリンクしています。
      </>
    ),
    s2Body: '価格、サイズ、素材、原材料、在庫状況などの商品情報は頻繁に変わります。これらは表示された日付時点で販売店のページから取得したものです。正確さの維持に努めていますが、お客様のご覧の時点で最新である保証はいたしかねます。ご注文の前に、価格、配送条件、原材料やアレルゲンの表示を必ず販売店のページでご確認ください。',
    s3P2: '提携先には、Suomikauppa、Nordicbuddies、Finlayson、Scandinavian Outdoor などのフィンランドの店舗やブランドが含まれ、Adtraction や Daisycon といったアフィリエイトネットワークを通じてリンクしています。報酬の発生しない店舗にもリンクしています。ご注文には、その商品を販売する店舗の規約が適用されます。',
    s5P1: (siteName) => (
      <>
        当サイトのすべての商品は第三者の店舗が販売・発送しており、ボタンを押すとその店舗のサイトへ移動します。
        <strong className="text-snow/90">{siteName} は小売業者でも販売者でも再販業者でもありません。</strong>
        在庫も決済機能も持たず、お客様のお支払いやお届け先を受け取ることもありません。
      </>
    ),
    s5P2: () => (
      <>
        売買契約は、お客様とその店舗との間で直接成立し、店舗の規約およびプライバシーポリシーが適用されます。
        配送日数、送料、EU域外への注文にかかる付加価値税や関税、返品、返金、保証はいずれも当該店舗の責任であり、
        当サイトの責任ではありません。通信販売における法定の解除権（フィンランドでは{' '}
        <em>kuluttajansuojalaki 6 luku</em>）は、その商品を販売した店舗に対して行使します。
      </>
    ),
    s8Body: (siteName) => `${siteName} および LaPeso Oy は、当サイトの商品情報に依拠したこと、リンク先店舗を利用したこと、またはそこで購入したことにより生じた損失または損害について責任を負いません。商品、その配送または状態に関する請求は、販売した店舗に対して行ってください。食品および健康補助食品については、原材料、アレルゲン、摂取量の表示を必ずパッケージと販売店のページでご確認ください。`,
  },
  es: {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) es una guía de regalos de la
        Laponia finlandesa gestionada por <strong className="text-snow/90">LaPeso Oy</strong>, sociedad
        registrada en Finlandia. Publicamos guías de producto editoriales y enlazamos a las tiendas que
        realmente venden y envían los artículos.
      </>
    ),
    s2Body: 'Los datos de producto, como precios, tallas, materiales, ingredientes y disponibilidad, cambian con frecuencia y se toman de las páginas del propio vendedor en la fecha indicada. Procuramos mantenerlos exactos, pero no podemos garantizar que estén actualizados en el momento de su visita. Compruebe siempre el precio, las condiciones de envío y la información de ingredientes y alérgenos en la página del vendedor antes de pedir.',
    s3P2: 'Entre los socios se incluyen, sin limitarse a ellos, tiendas y marcas finlandesas como Suomikauppa, Nordicbuddies, Finlayson y Scandinavian Outdoor, a las que enlazamos mediante redes de afiliación como Adtraction y Daisycon. También enlazamos a tiendas que no nos pagan nada. Cada pedido se rige por las condiciones de la tienda que vende el artículo.',
    s5P1: (siteName) => (
      <>
        Todos los productos de este sitio los vende y envía una tienda externa, y los botones le llevan a
        su propia web. <strong className="text-snow/90">{siteName} no es un comercio minorista, un
        vendedor ni un revendedor.</strong> No tenemos stock ni pasarela de pago, y nunca recibimos su
        pago ni su dirección de entrega.
      </>
    ),
    s5P2: () => (
      <>
        El contrato de compra se celebra directamente entre usted y esa tienda, conforme a sus condiciones y
        a su política de privacidad. Los plazos de entrega, los gastos de envío, el IVA y los aranceles
        de los pedidos fuera de la UE, las devoluciones, los reembolsos y la garantía son responsabilidad
        suya, no nuestra. El derecho legal de desistimiento en la venta a distancia, en Finlandia según{' '}
        <em>kuluttajansuojalaki 6 luku</em>, se ejerce frente a la tienda que vendió el artículo.
      </>
    ),
    s8Body: (siteName) => `${siteName} y LaPeso Oy no se responsabilizan de pérdidas o daños derivados de confiar en la información de producto de este sitio, del uso de las tiendas enlazadas o de una compra realizada a través de ellas. Cualquier reclamación sobre un producto, su entrega o su estado se dirige a la tienda que lo vendió. En alimentos y complementos alimenticios, lee siempre la información de ingredientes, alérgenos y dosis en el envase y en la página del vendedor.`,
  },
  'pt-BR': {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) é um guia de presentes da Lapônia
        finlandesa operado pela <strong className="text-snow/90">LaPeso Oy</strong>, registrada na
        Finlândia. Publicamos guias editoriais de produtos e direcionamos às lojas que de fato vendem e
        enviam os itens.
      </>
    ),
    s2Body: 'As informações de produto, como preços, tamanhos, materiais, ingredientes e disponibilidade, mudam com frequência e são obtidas nas páginas do próprio vendedor na data indicada. Procuramos mantê-las corretas, mas não podemos garantir que estejam atualizadas no momento da sua visita. Confira sempre o preço, as condições de entrega e as informações de ingredientes e alérgenos na página do vendedor antes de comprar.',
    s3P2: 'Entre os parceiros estão, entre outros, lojas e marcas finlandesas como Suomikauppa, Nordicbuddies, Finlayson e Scandinavian Outdoor, às quais direcionamos por meio de redes de afiliados como Adtraction e Daisycon. Também direcionamos a lojas que não nos pagam nada. Cada pedido está sujeito às condições da loja que vende o item.',
    s5P1: (siteName) => (
      <>
        Todo produto deste site é vendido e enviado por uma loja de terceiros, e os botões levam você ao
        site dessa loja. <strong className="text-snow/90">{siteName} não é varejista, vendedora nem
        revendedora.</strong> Não temos estoque nem checkout, e nunca recebemos seu pagamento ou seu
        endereço de entrega.
      </>
    ),
    s5P2: () => (
      <>
        O contrato de compra é celebrado diretamente entre você e essa loja, sob as condições e a política
        de privacidade dela. Prazos de entrega, frete, impostos e taxas alfandegárias em pedidos para fora
        da UE, devoluções, reembolsos e garantia são responsabilidade da loja, não nossa. O direito legal
        de arrependimento na venda a distância, na Finlândia conforme{' '}
        <em>kuluttajansuojalaki 6 luku</em>, é exercido contra a loja que vendeu o item.
      </>
    ),
    s8Body: (siteName) => `${siteName} e a LaPeso Oy não se responsabilizam por perdas ou danos decorrentes da confiança nas informações de produto deste site, do uso das lojas indicadas ou de uma compra feita por meio delas. Qualquer reclamação sobre um produto, sua entrega ou seu estado deve ser dirigida à loja que o vendeu. Em alimentos e suplementos alimentares, leia sempre as informações de ingredientes, alérgenos e dosagem na embalagem e na página do vendedor.`,
  },
  'zh-CN': {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName}（<strong className="text-snow/90">{siteUrl}</strong>）是由在芬兰注册的{' '}
        <strong className="text-snow/90">LaPeso Oy</strong> 运营的芬兰拉普兰礼品指南。我们发布编辑撰写的
        商品指南，并链接到真正销售和发货的商店。
      </>
    ),
    s2Body: '价格、尺寸、材质、成分和库存等商品信息经常变动，这些信息是在标注日期从卖家自己的页面读取的。我们力求准确，但无法保证您访问时信息仍然是最新的。下单前请务必在卖家自己的页面上核对价格、配送条款以及成分和过敏原信息。',
    s3P2: '合作伙伴包括但不限于 Suomikauppa、Nordicbuddies、Finlayson、Scandinavian Outdoor 等芬兰商店和品牌，我们通过 Adtraction、Daisycon 等联盟网络链接到它们。我们也会链接到不向我们付费的商店。每笔订单均适用销售该商品的商店的条款。',
    s5P1: (siteName) => (
      <>
        本站所有商品均由第三方商店销售和发货，点击按钮将前往该商店自己的网站。
        <strong className="text-snow/90">{siteName} 不是零售商、卖家或经销商。</strong>
        我们没有库存，也没有结账系统，从不接收您的付款或收货地址。
      </>
    ),
    s5P2: () => (
      <>
        买卖合同直接在您与该商店之间成立，适用该商店的条款和隐私政策。配送时间、运费、寄往欧盟以外订单的
        增值税和关税、退货、退款以及保修均由该商店负责，而非本站。远程销售中的法定撤销权（在芬兰依据{' '}
        <em>kuluttajansuojalaki 6 luku</em>）应向销售该商品的商店行使。
      </>
    ),
    s8Body: (siteName) => `${siteName} 与 LaPeso Oy 对因信赖本站商品信息、使用所链接的商店或通过其完成购买而产生的任何损失或损害不承担责任。有关商品、其配送或状况的任何主张，应向销售该商品的商店提出。对于食品和膳食补充剂，请务必阅读包装及卖家页面上的成分、过敏原和用量信息。`,
  },
  ko: {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName}(<strong className="text-snow/90">{siteUrl}</strong>)은 핀란드에 등록된{' '}
        <strong className="text-snow/90">LaPeso Oy</strong>가 운영하는 핀란드 라플란드 선물 가이드입니다.
        저희는 편집 기준으로 만든 상품 가이드를 게시하고, 실제로 판매하고 배송하는 상점으로 연결합니다.
      </>
    ),
    s2Body: '가격, 크기, 소재, 성분, 재고 등 상품 정보는 자주 바뀌며, 표시된 날짜에 판매자의 페이지에서 읽어온 것입니다. 정확하게 유지하려고 노력하지만 방문 시점에 최신이라고 보장할 수는 없습니다. 주문하기 전에 가격, 배송 조건, 성분과 알레르기 유발 물질 정보를 판매자의 페이지에서 반드시 확인하십시오.',
    s3P2: '제휴 파트너에는 Suomikauppa, Nordicbuddies, Finlayson, Scandinavian Outdoor 등 핀란드 상점과 브랜드가 포함되며, Adtraction과 Daisycon 같은 제휴 네트워크를 통해 연결합니다. 당사에 아무런 대가를 지급하지 않는 상점으로도 연결합니다. 모든 주문에는 해당 상품을 판매하는 상점의 약관이 적용됩니다.',
    s5P1: (siteName) => (
      <>
        이 사이트의 모든 상품은 제3자 상점이 판매하고 배송하며, 버튼을 누르면 그 상점의 웹사이트로
        이동합니다. <strong className="text-snow/90">{siteName}은 소매업자나 판매자, 재판매자가
        아닙니다.</strong> 재고도 결제 시스템도 없으며, 고객의 결제 정보나 배송지를 받지 않습니다.
      </>
    ),
    s5P2: () => (
      <>
        매매 계약은 고객과 해당 상점 사이에 직접 성립하며, 그 상점의 약관과 개인정보 처리방침이
        적용됩니다. 배송 기간, 배송비, EU 밖으로 나가는 주문의 부가가치세와 관세, 반품, 환불, 보증은
        모두 그 상점의 책임이며 저희 책임이 아닙니다. 통신판매에서의 법정 청약철회권은, 핀란드에서는{' '}
        <em>kuluttajansuojalaki 6 luku</em>에 따라, 상품을 판매한 상점을 상대로 행사합니다.
      </>
    ),
    s8Body: (siteName) => `${siteName}과 LaPeso Oy는 이 사이트의 상품 정보를 신뢰한 결과, 연결된 상점을 이용한 결과, 또는 이를 통한 구매로 인해 발생한 손실이나 손해에 대해 책임지지 않습니다. 상품이나 배송, 상태에 관한 청구는 해당 상품을 판매한 상점에 제기합니다. 식품과 건강기능식품은 포장과 판매자 페이지에서 성분, 알레르기 유발 물질, 섭취량 정보를 반드시 확인하십시오.`,
  },
  fr: {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) est un guide de cadeaux de la
        Laponie finlandaise exploité par <strong className="text-snow/90">LaPeso Oy</strong>, société
        immatriculée en Finlande. Nous publions des guides de produits éditoriaux et renvoyons vers les
        boutiques qui vendent et expédient réellement les articles.
      </>
    ),
    s2Body: 'Les informations produit, notamment les prix, les tailles, les matières, les ingrédients et la disponibilité, changent fréquemment et sont relevées sur les pages du vendeur à la date indiquée. Nous nous efforçons de les tenir exactes, mais nous ne pouvons garantir qu\'elles sont à jour au moment de votre visite. Vérifiez toujours le prix, les conditions de livraison ainsi que les informations sur les ingrédients et les allergènes sur la page du vendeur avant de commander.',
    s3P2: 'Les partenaires incluent notamment des boutiques et marques finlandaises telles que Suomikauppa, Nordicbuddies, Finlayson et Scandinavian Outdoor, vers lesquelles nous renvoyons via des réseaux d\'affiliation tels qu\'Adtraction et Daisycon. Nous renvoyons également vers des boutiques qui ne nous versent rien. Chaque commande est soumise aux conditions de la boutique qui vend l\'article.',
    s5P1: (siteName) => (
      <>
        Chaque produit de ce site est vendu et expédié par une boutique tierce, et les boutons vous
        conduisent vers son propre site. <strong className="text-snow/90">{siteName} n’est ni un
        détaillant, ni un vendeur, ni un revendeur.</strong> Nous ne détenons aucun stock, n’exploitons
        aucune caisse et ne recevons jamais votre paiement ni votre adresse de livraison.
      </>
    ),
    s5P2: () => (
      <>
        Le contrat de vente est conclu directement entre vous et cette boutique, selon ses conditions et
        sa politique de confidentialité. Les délais de livraison, les frais de port, la TVA et les droits
        de douane sur les commandes hors UE, les retours, les remboursements et la garantie relèvent de
        la boutique, et non de nous. Le droit légal de rétractation en vente à distance, en Finlande au
        titre de <em>kuluttajansuojalaki 6 luku</em>, s’exerce auprès de la boutique qui a vendu
        l’article.
      </>
    ),
    s8Body: (siteName) => `${siteName} et LaPeso Oy ne sont pas responsables des pertes ou dommages résultant de la confiance accordée aux informations produit de ce site, de l'utilisation des boutiques vers lesquelles nous renvoyons ou d'un achat effectué par leur intermédiaire. Toute réclamation portant sur un produit, sa livraison ou son état s'adresse à la boutique qui l'a vendu. Pour les denrées alimentaires et les compléments alimentaires, lisez toujours les informations sur les ingrédients, les allergènes et le dosage figurant sur l'emballage et sur la page du vendeur.`,
  },
  it: {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) è una guida ai regali della
        Lapponia finlandese gestita da <strong className="text-snow/90">LaPeso Oy</strong>, società
        registrata in Finlandia. Pubblichiamo guide ai prodotti redazionali e rimandiamo ai negozi che
        vendono e spediscono effettivamente gli articoli.
      </>
    ),
    s2Body: 'Le informazioni sui prodotti, come prezzi, taglie, materiali, ingredienti e disponibilità, cambiano di frequente e sono rilevate dalle pagine del venditore alla data indicata. Ci impegniamo a mantenerle corrette, ma non possiamo garantire che siano aggiornate al momento della Sua visita. Verifichi sempre il prezzo, le condizioni di consegna e le informazioni su ingredienti e allergeni sulla pagina del venditore prima di ordinare.',
    s3P2: 'Tra i partner rientrano, a titolo esemplificativo, negozi e marchi finlandesi come Suomikauppa, Nordicbuddies, Finlayson e Scandinavian Outdoor, ai quali rimandiamo tramite network di affiliazione come Adtraction e Daisycon. Rimandiamo anche a negozi che non ci corrispondono nulla. Ogni ordine è soggetto alle condizioni del negozio che vende l\'articolo.',
    s5P1: (siteName) => (
      <>
        Ogni prodotto di questo sito è venduto e spedito da un negozio terzo, e i pulsanti La portano al
        sito di quel negozio. <strong className="text-snow/90">{siteName} non è un rivenditore, un
        venditore né un intermediario commerciale.</strong> Non deteniamo magazzino, non gestiamo alcuna
        cassa e non riceviamo mai il Suo pagamento né il Suo indirizzo di consegna.
      </>
    ),
    s5P2: () => (
      <>
        Il contratto di acquisto si conclude direttamente tra Lei e quel negozio, alle sue condizioni e
        secondo la sua informativa sulla privacy. Tempi di consegna, spese di spedizione, IVA e dazi
        doganali sugli ordini diretti fuori dall’UE, resi, rimborsi e garanzia competono al negozio,
        non a noi. Il diritto legale di recesso nelle vendite a distanza, in Finlandia ai sensi della{' '}
        <em>kuluttajansuojalaki 6 luku</em>, si esercita nei confronti del negozio che ha venduto
        l’articolo.
      </>
    ),
    s8Body: (siteName) => `${siteName} e LaPeso Oy non sono responsabili di perdite o danni derivanti dall'affidamento alle informazioni sui prodotti di questo sito, dall'uso dei negozi collegati o da un acquisto effettuato tramite essi. Ogni reclamo relativo a un prodotto, alla sua consegna o alle sue condizioni va rivolto al negozio che lo ha venduto. Per alimenti e integratori alimentari, legga sempre le informazioni su ingredienti, allergeni e dosaggio riportate sulla confezione e sulla pagina del venditore.`,
  },
  nl: {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) is een samengestelde cadeaugids
        voor Fins Lapland, beheerd door <strong className="text-snow/90">LaPeso Oy</strong>, gevestigd in
        Finland. Wij publiceren redactionele productgidsen en verwijzen naar de winkels die de artikelen
        daadwerkelijk verkopen en verzenden.
      </>
    ),
    s2Body: 'Productgegevens zoals prijzen, maten, materialen, ingrediënten en beschikbaarheid veranderen regelmatig en zijn op de vermelde datum overgenomen van de pagina\'s van de verkoper zelf. Wij streven ernaar ze correct te houden, maar kunnen niet garanderen dat ze actueel zijn op het moment van uw bezoek. Controleer vóór het bestellen altijd de prijs, de leveringsvoorwaarden en de informatie over ingrediënten en allergenen op de pagina van de verkoper.',
    s3P2: 'Tot de partners behoren onder meer Finse winkels en merken zoals Suomikauppa, Nordicbuddies, Finlayson en Scandinavian Outdoor, waarnaar wij verwijzen via affiliatenetwerken zoals Adtraction en Daisycon. Wij verwijzen ook naar winkels die ons niets betalen. Op elke bestelling zijn de voorwaarden van toepassing van de winkel die het artikel verkoopt.',
    s5P1: (siteName) => (
      <>
        Elk product op deze site wordt verkocht en verzonden door een externe winkel, en de knoppen
        brengen u naar de website van die winkel. <strong className="text-snow/90">{siteName} is geen
        detailhandelaar, verkoper of wederverkoper.</strong> Wij houden geen voorraad aan, hebben geen
        kassa en ontvangen nooit uw betaling of uw afleveradres.
      </>
    ),
    s5P2: () => (
      <>
        De koopovereenkomst komt rechtstreeks tot stand tussen u en die winkel, onder hun voorwaarden en
        hun privacybeleid. Levertijden, verzendkosten, btw en douanerechten bij bestellingen buiten de EU,
        retouren, terugbetalingen en garantie liggen bij die winkel, niet bij ons. Een wettelijk
        herroepingsrecht bij verkoop op afstand, in Finland op grond van{' '}
        <em>kuluttajansuojalaki 6 luku</em>, wordt uitgeoefend jegens de winkel die het artikel heeft
        verkocht.
      </>
    ),
    s8Body: (siteName) => `${siteName} en LaPeso Oy zijn niet aansprakelijk voor verlies of schade voortvloeiend uit het vertrouwen op de productinformatie op deze site, uit het gebruik van de winkels waarnaar wij verwijzen of uit een aankoop die daar is gedaan. Een claim over een product, de levering of de staat ervan wordt ingediend bij de winkel die het heeft verkocht. Lees bij levensmiddelen en voedingssupplementen altijd de informatie over ingrediënten, allergenen en dosering op de verpakking en op de pagina van de verkoper.`,
  },
  sv: {
    s1P1: (siteName, siteUrl) => (
      <>
        {siteName} (<strong className="text-snow/90">{siteUrl}</strong>) är en kurerad presentguide för
        finska Lappland som drivs av <strong className="text-snow/90">LaPeso Oy</strong>, registrerat i
        Finland. Vi publicerar redaktionella produktguider och länkar till de butiker som faktiskt säljer
        och skickar varorna.
      </>
    ),
    s2Body: 'Produktuppgifter som priser, storlekar, material, ingredienser och lagerstatus ändras ofta och är hämtade från säljarens egna sidor det datum som anges. Vi strävar efter att hålla dem korrekta, men kan inte garantera att de är aktuella när du besöker sidan. Kontrollera alltid pris, leveransvillkor samt ingrediens- och allergeninformation på säljarens egen sida innan du beställer.',
    s3P2: 'Bland partnerna finns bland annat finländska butiker och varumärken som Suomikauppa, Nordicbuddies, Finlayson och Scandinavian Outdoor, dit vi länkar via affiliatenätverk som Adtraction och Daisycon. Vi länkar även till butiker som inte betalar oss något. Varje beställning omfattas av villkoren hos den butik som säljer varan.',
    s5P1: (siteName) => (
      <>
        Varje produkt på den här webbplatsen säljs och skickas av en fristående butik, och knapparna tar
        dig till butikens egen webbplats. <strong className="text-snow/90">{siteName} är inte
        detaljhandlare, säljare eller återförsäljare.</strong> Vi har inget lager och ingen kassa, och vi
        tar aldrig emot din betalning eller din leveransadress.
      </>
    ),
    s5P2: () => (
      <>
        Köpeavtalet ingås direkt mellan dig och den butiken, på deras villkor och enligt deras
        integritetspolicy. Leveranstider, fraktkostnader, moms och tullavgifter för beställningar utanför
        EU, returer, återbetalningar och garanti ligger hos butiken, inte hos oss. En lagstadgad ångerrätt
        vid distansförsäljning, i Finland enligt <em>kuluttajansuojalaki 6 luku</em>, utövas mot den butik
        som sålde varan.
      </>
    ),
    s8Body: (siteName) => `${siteName} och LaPeso Oy ansvarar inte för förlust eller skada som uppstår genom att förlita sig på produktinformationen på den här webbplatsen, genom användning av de butiker vi länkar till eller genom ett köp som gjorts via dem. Anspråk som gäller en vara, dess leverans eller dess skick riktas mot den butik som sålde den. För livsmedel och kosttillskott, läs alltid informationen om ingredienser, allergener och dosering på förpackningen och på säljarens egen sida.`,
  },
};

/**
 * Jobs-variant overrides (`variant="jobs"`, laplandwork 5.9.2026). A job board sells no
 * bookings and reviews no hotels: sections 2, 3, 4, 5 and 8 say what the site actually does.
 * Opt-in like the shop variant; every other site stays byte for byte unchanged.
 */
const JOBS_OVERRIDES: Record<Lang, Partial<TermsCopy>> = {
  en: {
    s2Title: "2. Listings and profiles",
    s2Body: "Job listings are written by employers or collected from public sources, and candidate profiles are written by the job seekers themselves. We check listings before publication and remove content that breaks the law or these terms, but we do not verify every statement. Confirm the details with the employer or the candidate before you act on them.",
    s3Title: "3. External links and partners",
    s3P1: (siteName) => `${siteName} links to employers' own sites, to Työmarkkinatori, EURES and other services we do not control, and applications are often completed there. We are not responsible for the content, availability or terms of those sites.`,
    s3P2: "Some links on the guide pages (moving, working conditions, transport) are affiliate links and are marked as such; a job listing or a candidate profile never is. A commission never changes what we recommend.",
    s4Title: "4. Paid services",
    s4Body: (siteName) => `Employers can buy listing tiers and packs of contact reveals. Prices, what each purchase includes, refunds and the moderation timetable are set out in the addendum below (A1–A5 and A10). Job seekers never pay ${siteName} anything.`,
    s5Title: "5. Not an employment agency, not a party",
    s5P1: (siteName) => `${siteName} is a self-service board. We do not select, rank or recommend candidates, we do not take recruitment assignments, and we are not a party to any application, contract or employment relationship.`,
    s5P2: () => `The employer is responsible for its hiring process and for the lawfulness of its listing; the job seeker for the accuracy of their profile. Salary, contract, permits and housing are agreed between them directly, under Finnish labour law.`,
    s8Body: (siteName) => `${siteName} and LaPeso Oy are not liable for loss or damage arising from a listing, a profile, an application or a hiring decision, from reliance on information on this site, or from the actions of employers, candidates or third-party sites. For paid services our liability is limited as set out in A8 of the addendum.`,
  },
  fi: {
    s2Title: "2. Ilmoitukset ja profiilit",
    s2Body: "Työpaikkailmoitukset kirjoittavat työnantajat tai ne on koottu julkisista lähteistä, ja hakijaprofiilit kirjoittavat työnhakijat itse. Tarkistamme ilmoitukset ennen julkaisua ja poistamme lakia tai näitä ehtoja rikkovan sisällön, mutta emme tarkista jokaista väitettä. Varmista tiedot työnantajalta tai hakijalta ennen kuin toimit niiden perusteella.",
    s3Title: "3. Ulkoiset linkit ja kumppanit",
    s3P1: (siteName) => `${siteName} linkittää työnantajien omille sivuille, Työmarkkinatoriin, EURESiin ja muihin palveluihin, joita emme hallitse, ja hakemus tehdään usein siellä. Emme vastaa näiden sivustojen sisällöstä, saatavuudesta tai ehdoista.`,
    s3P2: "Osa opassivujen (muutto, työehdot, liikkuminen) linkeistä on kumppanilinkkejä, ja ne on merkitty; työpaikkailmoitus tai hakijaprofiili ei koskaan ole. Komissio ei vaikuta siihen, mitä suosittelemme.",
    s4Title: "4. Maksulliset palvelut",
    s4Body: (siteName) => `Työnantajat voivat ostaa ilmoitustasoja ja yhteystietojen avauspaketteja. Hinnat, ostoksen sisältö, palautukset ja moderoinnin aikataulu on kirjattu alla olevaan lisäosaan (A1–A5 ja A10). Työnhakija ei maksa ${siteName}-palvelulle koskaan mitään.`,
    s5Title: "5. Emme ole työnvälittäjä emmekä osapuoli",
    s5P1: (siteName) => `${siteName} on itsepalvelutaulu. Emme valitse, järjestä tai suosittele hakijoita, emme ota rekrytointitoimeksiantoja emmekä ole osapuoli hakemuksessa, sopimuksessa tai työsuhteessa.`,
    s5P2: () => `Työnantaja vastaa rekrytointiprosessistaan ja ilmoituksensa lainmukaisuudesta, työnhakija profiilinsa oikeellisuudesta. Palkasta, sopimuksesta, luvista ja asumisesta sovitaan suoraan heidän välillään Suomen työlainsäädännön mukaisesti.`,
    s8Body: (siteName) => `${siteName} ja LaPeso Oy eivät vastaa menetyksestä tai vahingosta, joka aiheutuu ilmoituksesta, profiilista, hakemuksesta tai rekrytointipäätöksestä, sivuston tietoihin luottamisesta taikka työnantajien, hakijoiden tai kolmansien osapuolten sivustojen toiminnasta. Maksullisten palvelujen osalta vastuumme on rajattu lisäosan kohdan A8 mukaisesti.`,
  },
  de: {
    s2Title: "2. Anzeigen und Profile",
    s2Body: "Stellenanzeigen werden von Arbeitgebern verfasst oder aus öffentlichen Quellen gesammelt, Kandidatenprofile von den Arbeitsuchenden selbst. Wir prüfen Anzeigen vor der Veröffentlichung und entfernen Inhalte, die gegen das Gesetz oder diese Bedingungen verstoßen, überprüfen aber nicht jede Angabe. Bestätigen Sie die Details beim Arbeitgeber oder Kandidaten, bevor Sie darauf vertrauen.",
    s3Title: "3. Externe Links und Partner",
    s3P1: (siteName) => `${siteName} verlinkt auf eigene Seiten der Arbeitgeber, auf Työmarkkinatori, EURES und andere Dienste, die wir nicht kontrollieren; Bewerbungen werden oft dort abgeschlossen. Für Inhalt, Verfügbarkeit oder Bedingungen dieser Seiten sind wir nicht verantwortlich.`,
    s3P2: "Einige Links auf den Ratgeberseiten (Umzug, Arbeitsbedingungen, Verkehr) sind Affiliate-Links und als solche gekennzeichnet; eine Stellenanzeige oder ein Kandidatenprofil nie. Eine Provision ändert nie, was wir empfehlen.",
    s4Title: "4. Kostenpflichtige Leistungen",
    s4Body: (siteName) => `Arbeitgeber können Anzeigenstufen und Pakete mit Kontaktfreischaltungen kaufen. Preise, Leistungsumfang, Erstattungen und der Moderationszeitplan stehen im Zusatz unten (A1–A5 und A10). Arbeitsuchende zahlen ${siteName} nie etwas.`,
    s5Title: "5. Keine Arbeitsvermittlung, keine Vertragspartei",
    s5P1: (siteName) => `${siteName} ist ein Selbstbedienungs-Board. Wir wählen keine Kandidaten aus, bewerten oder empfehlen sie nicht, übernehmen keine Rekrutierungsaufträge und sind keine Partei einer Bewerbung, eines Vertrags oder eines Arbeitsverhältnisses.`,
    s5P2: () => `Der Arbeitgeber ist für sein Einstellungsverfahren und die Rechtmäßigkeit seiner Anzeige verantwortlich, der Arbeitsuchende für die Richtigkeit seines Profils. Gehalt, Vertrag, Genehmigungen und Unterkunft werden direkt zwischen ihnen nach finnischem Arbeitsrecht vereinbart.`,
    s8Body: (siteName) => `${siteName} und LaPeso Oy haften nicht für Verluste oder Schäden aus einer Anzeige, einem Profil, einer Bewerbung oder einer Einstellungsentscheidung, aus dem Vertrauen auf Informationen dieser Website oder aus dem Handeln von Arbeitgebern, Kandidaten oder Drittseiten. Für kostenpflichtige Leistungen ist unsere Haftung gemäß A8 des Zusatzes begrenzt.`,
  },
  ja: {
    s2Title: "2. 求人と候補者プロフィール",
    s2Body: "求人は雇用主が作成するか公的情報源から集めたもので、候補者プロフィールは求職者自身が作成します。求人は掲載前に確認し、法律や本規約に反する内容は削除しますが、すべての記載を検証するものではありません。行動する前に、雇用主または候補者に詳細を確認してください。",
    s3Title: "3. 外部リンクとパートナー",
    s3P1: (siteName) => `${siteName} は雇用主のサイト、Työmarkkinatori、EURES など当社が管理しないサービスへリンクしており、応募はそこで完結することが多くあります。これらのサイトの内容、可用性、条件について当社は責任を負いません。`,
    s3P2: "ガイドページ（移住、労働条件、交通）の一部のリンクはアフィリエイトリンクであり、その旨を表示しています。求人や候補者プロフィールがアフィリエイトになることはありません。手数料が当社の推奨を変えることはありません。",
    s4Title: "4. 有料サービス",
    s4Body: (siteName) => `雇用主は掲載プランと連絡先開示パックを購入できます。料金、内容、返金、審査の時間は下記の付則（A1〜A5 および A10）に定めます。求職者が ${siteName} に支払うことはありません。`,
    s5Title: "5. 職業紹介事業者でも当事者でもありません",
    s5P1: (siteName) => `${siteName} はセルフサービスの掲示板です。候補者の選定、順位付け、推薦は行わず、採用委託も受けず、応募、契約、雇用関係の当事者にもなりません。`,
    s5P2: () => `雇用主は自社の採用プロセスと求人の適法性に、求職者はプロフィールの正確性に責任を負います。給与、契約、許可、住居はフィンランド労働法に基づき両者間で直接取り決めます。`,
    s8Body: (siteName) => `${siteName} および LaPeso Oy は、求人、プロフィール、応募、採用判断、本サイトの情報への依拠、または雇用主・候補者・第三者サイトの行為から生じる損失や損害について責任を負いません。有料サービスについての責任は付則 A8 のとおり制限されます。`,
  },
  es: {
    s2Title: "2. Ofertas y perfiles",
    s2Body: "Las ofertas de empleo las redactan los empleadores o se recopilan de fuentes públicas, y los perfiles los escriben los propios candidatos. Revisamos las ofertas antes de publicarlas y retiramos el contenido que infrinja la ley o estos términos, pero no verificamos cada afirmación. Confirme los detalles con el empleador o el candidato antes de actuar.",
    s3Title: "3. Enlaces externos y socios",
    s3P1: (siteName) => `${siteName} enlaza a los sitios de los empleadores, a Työmarkkinatori, EURES y otros servicios que no controlamos, y la solicitud suele completarse allí. No respondemos del contenido, la disponibilidad ni las condiciones de esos sitios.`,
    s3P2: "Algunos enlaces de las guías (mudanza, condiciones laborales, transporte) son enlaces de afiliación y están marcados; una oferta de empleo o un perfil de candidato nunca lo es. Una comisión nunca cambia lo que recomendamos.",
    s4Title: "4. Servicios de pago",
    s4Body: (siteName) => `Los empleadores pueden comprar niveles de publicación y packs de desbloqueo de contactos. Los precios, el contenido de cada compra, los reembolsos y los plazos de moderación figuran en el anexo (A1–A5 y A10). Los candidatos nunca pagan nada a ${siteName}.`,
    s5Title: "5. Ni agencia de colocación ni parte",
    s5P1: (siteName) => `${siteName} es un tablón de autoservicio. No seleccionamos, clasificamos ni recomendamos candidatos, no aceptamos encargos de selección y no somos parte de ninguna solicitud, contrato ni relación laboral.`,
    s5P2: () => `El empleador responde de su proceso de contratación y de la legalidad de su oferta; el candidato, de la exactitud de su perfil. Salario, contrato, permisos y alojamiento se acuerdan directamente entre ellos conforme al derecho laboral finlandés.`,
    s8Body: (siteName) => `${siteName} y LaPeso Oy no responden de pérdidas o daños derivados de una oferta, un perfil, una solicitud o una decisión de contratación, de la confianza en la información de este sitio ni de las acciones de empleadores, candidatos o sitios de terceros. Para los servicios de pago, nuestra responsabilidad se limita según el punto A8 del anexo.`,
  },
  'pt-BR': {
    s2Title: "2. Vagas e perfis",
    s2Body: "As vagas são escritas pelos empregadores ou reunidas de fontes públicas, e os perfis são escritos pelos próprios candidatos. Revisamos as vagas antes da publicação e removemos conteúdo que viole a lei ou estes termos, mas não verificamos cada afirmação. Confirme os detalhes com o empregador ou o candidato antes de agir.",
    s3Title: "3. Links externos e parceiros",
    s3P1: (siteName) => `O ${siteName} tem links para os sites dos empregadores, para o Työmarkkinatori, o EURES e outros serviços que não controlamos, e a candidatura costuma ser concluída neles. Não nos responsabilizamos pelo conteúdo, pela disponibilidade nem pelas condições desses sites.`,
    s3P2: "Alguns links das páginas de guia (mudança, condições de trabalho, transporte) são links de afiliado e estão identificados; uma vaga ou um perfil de candidato nunca é. Uma comissão nunca muda o que recomendamos.",
    s4Title: "4. Serviços pagos",
    s4Body: (siteName) => `Empregadores podem comprar níveis de anúncio e pacotes de liberação de contatos. Preços, conteúdo de cada compra, reembolsos e prazos de moderação estão no adendo abaixo (A1–A5 e A10). Candidatos nunca pagam nada ao ${siteName}.`,
    s5Title: "5. Nem agência de recrutamento nem parte",
    s5P1: (siteName) => `O ${siteName} é um quadro de autoatendimento. Não selecionamos, classificamos nem recomendamos candidatos, não aceitamos mandatos de recrutamento e não somos parte de nenhuma candidatura, contrato ou relação de trabalho.`,
    s5P2: () => `O empregador responde pelo seu processo seletivo e pela legalidade da vaga; o candidato, pela exatidão do seu perfil. Salário, contrato, autorizações e moradia são acordados diretamente entre eles, conforme a legislação trabalhista finlandesa.`,
    s8Body: (siteName) => `O ${siteName} e a LaPeso Oy não respondem por perdas ou danos decorrentes de uma vaga, um perfil, uma candidatura ou uma decisão de contratação, da confiança em informações deste site ou das ações de empregadores, candidatos ou sites de terceiros. Para serviços pagos, nossa responsabilidade é limitada conforme o item A8 do adendo.`,
  },
  'zh-CN': {
    s2Title: "2. 招聘信息与档案",
    s2Body: "招聘信息由雇主撰写或从公开来源汇集，候选人档案由求职者本人撰写。我们在发布前审核招聘信息并删除违法或违反本条款的内容，但不核实每一项陈述。采取行动前，请向雇主或候选人确认详情。",
    s3Title: "3. 外部链接与合作伙伴",
    s3P1: (siteName) => `${siteName} 链接至雇主自有网站、Työmarkkinatori、EURES 及其他我们无法控制的服务，申请通常在那里完成。我们对这些网站的内容、可用性或条款不承担责任。`,
    s3P2: "指南页面（移居、劳动条件、交通）上的部分链接为联盟链接并已标明；招聘信息或候选人档案绝不会是联盟链接。佣金不会改变我们的推荐。",
    s4Title: "4. 付费服务",
    s4Body: (siteName) => `雇主可购买发布档次和联系方式解锁套餐。价格、每项购买包含的内容、退款和审核时限见下方附则（A1–A5 和 A10）。求职者无需向 ${siteName} 支付任何费用。`,
    s5Title: "5. 非职业介绍机构，非任何一方",
    s5P1: (siteName) => `${siteName} 是自助式平台。我们不筛选、排名或推荐候选人，不承接招聘委托，也不是任何申请、合同或雇佣关系的一方。`,
    s5P2: () => `雇主对其招聘流程和招聘信息的合法性负责，求职者对其档案的准确性负责。薪资、合同、许可和住宿由双方依据芬兰劳动法直接商定。`,
    s8Body: (siteName) => `${siteName} 和 LaPeso Oy 不对因招聘信息、档案、申请或录用决定、依赖本网站信息、或雇主、候选人及第三方网站的行为而产生的损失或损害承担责任。对于付费服务，我们的责任按附则 A8 限制。`,
  },
  ko: {
    s2Title: "2. 공고와 프로필",
    s2Body: "채용 공고는 고용주가 작성하거나 공개 출처에서 수집하며, 후보자 프로필은 구직자 본인이 작성합니다. 공고는 게시 전에 검토하고 법이나 본 약관에 어긋나는 내용은 삭제하지만, 모든 기재 사항을 검증하지는 않습니다. 행동하기 전에 고용주나 후보자에게 세부 사항을 확인하십시오.",
    s3Title: "3. 외부 링크와 파트너",
    s3P1: (siteName) => `${siteName}는 고용주 자체 사이트, Työmarkkinatori, EURES 등 당사가 통제하지 않는 서비스로 연결되며, 지원은 대개 그곳에서 완료됩니다. 해당 사이트의 내용, 이용 가능성, 조건에 대해 당사는 책임지지 않습니다.`,
    s3P2: "가이드 페이지(이주, 근로 조건, 교통)의 일부 링크는 제휴 링크이며 표시되어 있습니다. 채용 공고나 후보자 프로필은 결코 제휴 링크가 아닙니다. 수수료가 당사의 추천을 바꾸지 않습니다.",
    s4Title: "4. 유료 서비스",
    s4Body: (siteName) => `고용주는 공고 등급과 연락처 열람 패키지를 구매할 수 있습니다. 가격, 구매 내용, 환불, 검수 일정은 아래 부칙(A1–A5, A10)에 정해져 있습니다. 구직자는 ${siteName}에 어떤 비용도 지불하지 않습니다.`,
    s5Title: "5. 직업소개 기관도, 당사자도 아닙니다",
    s5P1: (siteName) => `${siteName}는 셀프서비스 게시판입니다. 후보자를 선별, 순위 지정, 추천하지 않고, 채용 위탁을 받지 않으며, 지원·계약·고용 관계의 당사자가 아닙니다.`,
    s5P2: () => `고용주는 자신의 채용 절차와 공고의 적법성에, 구직자는 프로필의 정확성에 책임이 있습니다. 급여, 계약, 허가, 주거는 핀란드 노동법에 따라 양측이 직접 합의합니다.`,
    s8Body: (siteName) => `${siteName}와 LaPeso Oy는 공고, 프로필, 지원, 채용 결정, 본 사이트 정보에 대한 신뢰, 또는 고용주·후보자·제3자 사이트의 행위로 인한 손실이나 손해에 대해 책임지지 않습니다. 유료 서비스에 대한 책임은 부칙 A8에 따라 제한됩니다.`,
  },
  fr: {
    s2Title: "2. Annonces et profils",
    s2Body: "Les offres d'emploi sont rédigées par les employeurs ou collectées auprès de sources publiques, et les profils par les candidats eux-mêmes. Nous vérifions les annonces avant publication et retirons tout contenu contraire à la loi ou aux présentes conditions, sans vérifier chaque affirmation. Confirmez les détails auprès de l'employeur ou du candidat avant d'agir.",
    s3Title: "3. Liens externes et partenaires",
    s3P1: (siteName) => `${siteName} renvoie vers les sites des employeurs, vers Työmarkkinatori, EURES et d'autres services que nous ne contrôlons pas, où la candidature est souvent finalisée. Nous ne répondons ni du contenu, ni de la disponibilité, ni des conditions de ces sites.`,
    s3P2: "Certains liens des pages guides (installation, conditions de travail, transports) sont des liens d'affiliation et sont signalés comme tels ; une offre d'emploi ou un profil de candidat ne l'est jamais. Une commission ne change jamais ce que nous recommandons.",
    s4Title: "4. Services payants",
    s4Body: (siteName) => `Les employeurs peuvent acheter des niveaux d'annonce et des packs de déblocage de coordonnées. Les prix, le contenu de chaque achat, les remboursements et les délais de modération figurent dans l'annexe ci-dessous (A1–A5 et A10). Les candidats ne paient jamais rien à ${siteName}.`,
    s5Title: "5. Ni agence de placement, ni partie",
    s5P1: (siteName) => `${siteName} est un tableau en libre-service. Nous ne sélectionnons, ne classons ni ne recommandons de candidats, nous n'acceptons aucun mandat de recrutement et nous ne sommes partie à aucune candidature, contrat ou relation de travail.`,
    s5P2: () => `L'employeur répond de son processus de recrutement et de la licéité de son annonce ; le candidat, de l'exactitude de son profil. Salaire, contrat, permis et logement se conviennent directement entre eux, selon le droit du travail finlandais.`,
    s8Body: (siteName) => `${siteName} et LaPeso Oy ne répondent pas des pertes ou dommages résultant d'une annonce, d'un profil, d'une candidature ou d'une décision d'embauche, de la confiance accordée aux informations de ce site, ni des actes des employeurs, des candidats ou des sites tiers. Pour les services payants, notre responsabilité est limitée conformément au point A8 de l'annexe.`,
  },
  it: {
    s2Title: "2. Annunci e profili",
    s2Body: "Gli annunci di lavoro sono scritti dai datori di lavoro o raccolti da fonti pubbliche, i profili dai candidati stessi. Controlliamo gli annunci prima della pubblicazione e rimuoviamo i contenuti contrari alla legge o a queste condizioni, ma non verifichiamo ogni affermazione. Confermi i dettagli con il datore di lavoro o il candidato prima di agire.",
    s3Title: "3. Link esterni e partner",
    s3P1: (siteName) => `${siteName} rimanda ai siti dei datori di lavoro, a Työmarkkinatori, EURES e ad altri servizi che non controlliamo, dove spesso si completa la candidatura. Non rispondiamo del contenuto, della disponibilità o delle condizioni di tali siti.`,
    s3P2: "Alcuni link delle pagine guida (trasferimento, condizioni di lavoro, trasporti) sono link di affiliazione e sono segnalati; un annuncio di lavoro o un profilo di candidato non lo è mai. Una commissione non cambia mai ciò che consigliamo.",
    s4Title: "4. Servizi a pagamento",
    s4Body: (siteName) => `I datori di lavoro possono acquistare livelli di annuncio e pacchetti di sblocco dei recapiti. Prezzi, contenuto di ogni acquisto, rimborsi e tempi di moderazione sono indicati nell'appendice sottostante (A1–A5 e A10). I candidati non pagano mai nulla a ${siteName}.`,
    s5Title: "5. Né agenzia per il lavoro né parte",
    s5P1: (siteName) => `${siteName} è una bacheca self-service. Non selezioniamo, classifichiamo o raccomandiamo candidati, non accettiamo incarichi di ricerca del personale e non siamo parte di alcuna candidatura, contratto o rapporto di lavoro.`,
    s5P2: () => `Il datore di lavoro risponde del proprio processo di selezione e della liceità dell'annuncio; il candidato dell'esattezza del proprio profilo. Retribuzione, contratto, permessi e alloggio si concordano direttamente tra loro secondo il diritto del lavoro finlandese.`,
    s8Body: (siteName) => `${siteName} e LaPeso Oy non rispondono di perdite o danni derivanti da un annuncio, un profilo, una candidatura o una decisione di assunzione, dall'affidamento sulle informazioni di questo sito o dalle azioni di datori di lavoro, candidati o siti terzi. Per i servizi a pagamento la nostra responsabilità è limitata secondo il punto A8 dell'appendice.`,
  },
  nl: {
    s2Title: "2. Vacatures en profielen",
    s2Body: "Vacatures worden door werkgevers geschreven of uit openbare bronnen verzameld, profielen door de werkzoekenden zelf. Wij controleren vacatures vóór publicatie en verwijderen inhoud die in strijd is met de wet of deze voorwaarden, maar wij verifiëren niet elke bewering. Bevestig de details bij de werkgever of de kandidaat voordat u ernaar handelt.",
    s3Title: "3. Externe links en partners",
    s3P1: (siteName) => `${siteName} linkt naar de eigen sites van werkgevers, naar Työmarkkinatori, EURES en andere diensten die wij niet beheren, en de sollicitatie wordt vaak daar afgerond. Wij zijn niet verantwoordelijk voor de inhoud, beschikbaarheid of voorwaarden van die sites.`,
    s3P2: "Sommige links op de gidspagina's (verhuizen, arbeidsvoorwaarden, vervoer) zijn affiliatelinks en zijn als zodanig gemarkeerd; een vacature of een kandidaatprofiel nooit. Een commissie verandert nooit wat wij aanbevelen.",
    s4Title: "4. Betaalde diensten",
    s4Body: (siteName) => `Werkgevers kunnen vacatureniveaus en pakketten met vrijgaven van contactgegevens kopen. Prijzen, wat elke aankoop omvat, terugbetalingen en de beoordelingstermijn staan in het addendum hieronder (A1–A5 en A10). Werkzoekenden betalen ${siteName} nooit iets.`,
    s5Title: "5. Geen uitzendbureau, geen partij",
    s5P1: (siteName) => `${siteName} is een selfservice-prikbord. Wij selecteren, rangschikken of bevelen geen kandidaten aan, wij nemen geen wervingsopdrachten aan en wij zijn geen partij bij een sollicitatie, contract of arbeidsrelatie.`,
    s5P2: () => `De werkgever is verantwoordelijk voor zijn wervingsproces en de rechtmatigheid van zijn vacature; de werkzoekende voor de juistheid van zijn profiel. Salaris, contract, vergunningen en huisvesting worden rechtstreeks tussen hen afgesproken, volgens het Finse arbeidsrecht.`,
    s8Body: (siteName) => `${siteName} en LaPeso Oy zijn niet aansprakelijk voor verlies of schade door een vacature, een profiel, een sollicitatie of een aanstellingsbeslissing, door vertrouwen op informatie op deze site, of door het handelen van werkgevers, kandidaten of sites van derden. Voor betaalde diensten is onze aansprakelijkheid beperkt zoals bepaald in A8 van het addendum.`,
  },
  sv: {
    s2Title: "2. Annonser och profiler",
    s2Body: "Jobbannonser skrivs av arbetsgivare eller samlas in från offentliga källor, och kandidatprofiler skrivs av de arbetssökande själva. Vi granskar annonser före publicering och tar bort innehåll som bryter mot lagen eller dessa villkor, men vi verifierar inte varje uppgift. Bekräfta detaljerna med arbetsgivaren eller kandidaten innan du agerar.",
    s3Title: "3. Externa länkar och partner",
    s3P1: (siteName) => `${siteName} länkar till arbetsgivarnas egna webbplatser, till Työmarkkinatori, EURES och andra tjänster som vi inte kontrollerar, och ansökan görs ofta där. Vi ansvarar inte för innehållet, tillgängligheten eller villkoren på de webbplatserna.`,
    s3P2: "Vissa länkar på guidesidorna (flytt, arbetsvillkor, transport) är affiliatelänkar och är markerade; en jobbannons eller en kandidatprofil är det aldrig. En provision ändrar aldrig vad vi rekommenderar.",
    s4Title: "4. Betaltjänster",
    s4Body: (siteName) => `Arbetsgivare kan köpa annonsnivåer och paket med upplåsningar av kontaktuppgifter. Priser, vad varje köp omfattar, återbetalningar och granskningstider anges i tillägget nedan (A1–A5 och A10). Arbetssökande betalar aldrig något till ${siteName}.`,
    s5Title: "5. Ingen arbetsförmedling, ingen part",
    s5P1: (siteName) => `${siteName} är en självbetjäningstavla. Vi väljer inte ut, rangordnar eller rekommenderar kandidater, vi tar inga rekryteringsuppdrag och vi är inte part i någon ansökan, något avtal eller något anställningsförhållande.`,
    s5P2: () => `Arbetsgivaren ansvarar för sin rekryteringsprocess och för annonsens lagenlighet, den arbetssökande för att profilen är korrekt. Lön, avtal, tillstånd och boende avtalas direkt mellan dem enligt finsk arbetsrätt.`,
    s8Body: (siteName) => `${siteName} och LaPeso Oy ansvarar inte för förlust eller skada som uppstår genom en annons, en profil, en ansökan eller ett anställningsbeslut, genom förlitan på information på den här webbplatsen eller genom arbetsgivares, kandidaters eller tredje parts webbplatsers agerande. För betaltjänster är vårt ansvar begränsat enligt A8 i tillägget.`,
  },
};

export default function TermsContent({
  intro,
  lastUpdated: lastUpdatedOverride,
  siteName = 'LaplandVibes',
  siteUrl = 'laplandvibes.com',
  lang = 'en',
  variant = 'travel',
}: TermsContentProps = {}) {
  const base = COPY[lang] ?? COPY.en;
  const t =
    variant === 'shop'
      ? { ...base, ...(SHOP_OVERRIDES[lang] ?? SHOP_OVERRIDES.en) }
      : variant === 'jobs'
      ? { ...base, ...(JOBS_OVERRIDES[lang] ?? JOBS_OVERRIDES.en) }
      : base;
  const email = <a href="mailto:info@laplandvibes.com" className="text-vibe-pink hover:text-pink-300 underline">info@laplandvibes.com</a>;
  // Paljas polku "/unsubscribe" oli sekä linkkiteksti että kohde: teksti luki
  // lauseessa katkelmana ("osoitteessa /unsubscribe") ja kohde osui spokeilla
  // SPA-fallbackiin eli sivuston omaan 404:ään. Nyt lokalisoitu label ja hubin
  // kanoninen peruutussivu (auditti 4.8., mitattu renderöidystä DOMista 7.8.).
  const unsub = (
    <a href={hubUnsubscribeUrl(lang)} target="_blank" rel="noopener" className="text-vibe-pink hover:text-pink-300 underline">{
      lang === 'fi' ? 'peruutussivullamme'
      : lang === 'de' ? 'unserer Abmeldeseite'
      : lang === 'ja' ? '配信停止ページ'
      : lang === 'es' ? 'nuestra página para darse de baja'
      : lang === 'pt-BR' ? 'nossa página de cancelamento'
      : lang === 'zh-CN' ? '取消订阅页面'
      : lang === 'ko' ? '구독 해지 페이지'
      : lang === 'fr' ? 'notre page de désinscription'
      : lang === 'it' ? 'la nostra pagina di disiscrizione'
      : lang === 'nl' ? 'onze afmeldpagina'
      : lang === 'sv' ? 'vår avregistreringssida'
      : 'our unsubscribe page'
    }</a>
  );
  const privacy = (
    <a href={localePath('/privacy', lang)} className="text-vibe-pink hover:text-pink-300 underline">
      {lang === 'fi' ? 'tietosuojaselosteemme'
      : lang === 'de' ? 'Datenschutzerklärung'
      : lang === 'ja' ? 'プライバシーポリシー'
      : lang === 'es' ? 'Política de Privacidad'
      : lang === 'pt-BR' ? 'Política de Privacidade'
      : lang === 'zh-CN' ? '隐私政策'
      : lang === 'ko' ? '개인정보 처리방침'
      : lang === 'fr' ? 'Politique de Confidentialité'
      : lang === 'it' ? 'Informativa sulla Privacy'
      : lang === 'nl' ? 'Privacybeleid'
      : lang === 'sv' ? 'integritetspolicy'
      : 'Privacy Policy'}
    </a>
  );

  return (
    <main className="pt-16 bg-deep-night min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-20 sm:py-28">
        <p className="text-vibe-pink text-sm font-semibold tracking-[0.2em] uppercase mb-4">{t.kicker}</p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl text-snow tracking-wide leading-tight mb-6">{t.h1}</h1>
        <p className="text-snow/75 text-sm mb-12">{lastUpdatedOverride ?? t.lastUpdated}</p>

        <div className="space-y-10 text-snow/70 leading-relaxed">

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s1Title}</h2>
            <p>{intro ?? t.s1P1(siteName, siteUrl)}</p>
            <p className="mt-3">{t.s1P2}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s2Title}</h2>
            <p>{t.s2Body}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s3Title}</h2>
            <p>{t.s3P1(siteName)}</p>
            <p className="mt-3">{t.s3P2}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s4Title}</h2>
            <p>{t.s4Body(siteName)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s5Title}</h2>
            <p>{t.s5P1(siteName)}</p>
            <p className="mt-3">{t.s5P2(siteName)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s6Title}</h2>
            <p>{t.s6Body(unsub, privacy)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s7Title}</h2>
            <p>{t.s7Body(siteName)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s8Title}</h2>
            <p>{t.s8Body(siteName)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s9Title}</h2>
            <p>{t.s9Body}</p>
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
            <p>{t.s12Intro}</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              {t.s12Items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
            <p className="mt-3">{t.s12Tail(siteName)}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.s13Title}</h2>
            <p>{t.s13Body(email)}</p>
          </section>

        </div>
      </div>
    </main>
  );
}
