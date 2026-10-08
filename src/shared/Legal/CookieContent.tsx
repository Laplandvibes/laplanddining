import { Link } from 'react-router-dom';
import { localePath } from './localePath';

/**
 * Shared LaplandVibes ecosystem Cookie Policy body.
 *
 * Renders ONLY the legal content. Each site wraps with its own Nav, Footer,
 * SEO/title meta. Cookie names like `laplandvibes_cookie_consent` are
 * site-specific, accepts a `siteId` prop (default 'laplandvibes') to render
 * the correct localStorage key per site.
 *
 * Updated 2026-05 with a `lang` prop (en / fi / de) so visitors on
 * `/fi/cookie-policy` and `/de/cookie-policy` see localised copy.
 */

type Lang = 'en' | 'fi' | 'de' | 'ja' | 'es' | 'pt-BR' | 'zh-CN' | 'ko' | 'fr' | 'it' | 'nl' | 'sv';

interface CookieContentProps {
  /** Site identifier for cookie-name placeholders. Default 'laplandvibes'. */
  siteId?: string;
  /** Brand name shown in prose, e.g. "LaplandStays". Default 'LaplandVibes'. */
  siteName?: string;
  /** Render language. */
  lang?: Lang;
  /**
   * Naytetaan istuntotallennuksen (Microsoft Clarity) evastelohko.
   * 🔴 Vain sivustoille joilla Clarity on OIKEASTI asennettuna. Oletus false,
   * jotta 27 muun sivuston seloste ei vaita nauhoittavansa mitaan.
   */
  sessionRecording?: boolean;
  /**
   * Naytetaan Travelpayouts-lentohaun osio ja taulukkorivit (evasteet, localStorage, sessionStorage).
   * Vain laplandflights.fi, jonka etusivun lentohaku latautuu vasta suostumuksesta. Oletus false.
   * Teksti on tiedoston lopussa haravointimerkin alla, koska muut sivustot eivat lataa hakua.
   */
  flightSearch?: boolean;
}

interface CookieCopy {
  kicker: string;
  h1: string;
  lastUpdated: string;
  whatAreTitle: string;
  whatAreBody: string;
  cookiesWeUseTitle: string;
  essentialBadge: string;
  essentialNote: string;
  essentialBody: string;
  essentialDur: string;
  analyticsBadge: string;
  analyticsNote: string;
  analyticsBody: string;
  analyticsDur: string;
  cjBadge: string;
  cjNote: string;
  cjBody: (siteName: string) => React.ReactNode;
  cjDur: string;
  gygBadge: string;
  gygNote: string;
  gygBody: (siteName: string) => string;
  gygDur: string;
  lsBadge: string;
  lsNote: string;
  lsIntro: string;
  lsConsentDesc: string;
  /** Kielivalinta (lv_locale_choice tai i18nextLng sivuston mukaan), ilman avaimen nimea. */
  lsLangDesc: string;
  lsPopupDesc: string;
  lsTail: string;
  tableTitle: string;
  tableCookie: string;
  tableType: string;
  tablePurpose: string;
  tableDuration: string;
  tableRows: { name: string; type: string; purpose: string; duration: string }[];
  managingTitle: string;
  managing1: string;
  managing2: string;
  /** Peruutusnapin teksti (GDPR 7 art. 3 kohta: peruminen yhta helppoa kuin antaminen). */
  withdrawButton: string;
  contactTitle: string;
  contactBody: (email: React.ReactNode) => React.ReactNode;
  backToHome: string;
  privacyLink: string;
  typeEssential: string;
  typeEssentialLs: string;
  typeAnalytics: string;
  typeAffiliateCj: string;
  typeAffiliateGyg: string;
}

const COPY: Record<Lang, CookieCopy> = {
  en: {
    kicker: 'Legal',
    h1: 'Cookie Policy',
    lastUpdated: 'Last updated: October 2026',
    whatAreTitle: 'What Are Cookies?',
    whatAreBody: 'Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and understand how you use the site. You can control cookies through your browser settings or via our consent banner.',
    cookiesWeUseTitle: 'Cookies We Use',
    essentialBadge: 'Essential',
    essentialNote: 'Always active, cannot be disabled',
    essentialBody: "This site does not need cookies to work. Your accept/decline choice is saved in your browser's localStorage, not in a cookie, so we don't ask you on every visit.",
    essentialDur: 'Duration: until you clear it or change your choice',
    analyticsBadge: 'Analytics',
    analyticsNote: 'Requires consent',
    analyticsBody: 'Google Analytics 4 cookies help us understand how visitors use the site: which pages are popular, how long people stay, what device they browse on, and where they come from (country and city level). We do not collect names, email addresses or other directly identifying information. Visitors are identified by a random ID stored in a cookie.',
    analyticsDur: 'Duration: 2 years',
    cjBadge: 'Affiliate',
    cjNote: 'Set by third parties when you click affiliate links',
    cjBody: (siteName) => <>When you click a booking or affiliate link on {siteName}, our affiliate networks may set a tracking cookie or add a tracking parameter to the link so the booking can be attributed to {siteName}: Adtraction (partners like Sembo and Lomarengas, via <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> and <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (partners like Suomikauppa and Nordicbuddies, via <span className="font-mono text-xs text-snow/80">jdt8.net</span> and <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (partners like EconomyBookings, via <span className="font-mono text-xs text-snow/80">tp.media</span> or <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) and Trip.com (partner parameters on <span className="font-mono text-xs text-snow/80">trip.com</span>). This is how we earn a small commission when you book, at no extra cost to you.</>,
    cjDur: 'Duration: 30 days – 3 years (varies by partner)',
    gygBadge: 'Affiliate (GYG)',
    gygNote: 'Requires consent',
    gygBody: (siteName) => `With your consent, this site loads GetYourGuide's partner script (GetYourGuide, Berlin, EU; partner ID VRMKD7N), which also displays the activity widgets. The script stores visitor_id on getyourguide.com (a third-party cookie, 400 days), session_id on this site's domain (until the end of the session), __cf_bm on widget.getyourguide.com (less than 1 day, set by GetYourGuide's content delivery network), partner_id in localStorage and gyg_visitor_id in sessionStorage. GetYourGuide uses them to count widget views and clicks and to attribute bookings to ${siteName}. Without your consent, activity links still work, and in that case getyourguide.com sets its own cookies only when you go there. Bookings are made on getyourguide.com under its own privacy policy.`,
    gygDur: 'Duration: session – 400 days',
    lsBadge: 'localStorage',
    lsNote: 'Stored in your browser, never sent to a server',
    lsIntro: "Small entries are stored in your browser's localStorage to make the site less annoying, for example:",
    lsConsentDesc: 'your accept/decline choice',
    lsLangDesc: 'Your language choice, so the site can open in the same language next time.',
    lsPopupDesc: 'a timestamp of when you last dismissed or successfully subscribed via the newsletter popup, so we do not re-show it for 7 days (or never, if you subscribed)',
    lsTail: "localStorage is technically not a cookie. We list it here for transparency. You can clear it via your browser's site-data settings.",
    tableTitle: 'Cookie Reference Table',
    tableCookie: 'Cookie',
    tableType: 'Type',
    tablePurpose: 'Purpose',
    tableDuration: 'Duration',
    tableRows: [],
    managingTitle: 'Managing Your Cookie Preferences',
    managing1: "You can change or withdraw your choice at any time with the button below. It deletes your saved choice, the entries partner scripts stored in your browser and the cookies set on this site's own domain, then reloads the page so the consent banner appears again. Cookies on other companies' domains, such as getyourguide.com, can be deleted in your browser settings. You can also block cookies entirely in your browser, though this may affect how the site works.",
    managing2: "Most browsers allow you to view, manage, and delete cookies. Check your browser's help section for instructions.",
    withdrawButton: 'Change cookie choice',
    contactTitle: 'Contact',
    contactBody: (email) => <>For questions about cookies or this policy, contact us at {email}.</>,
    backToHome: '← Back to home',
    privacyLink: 'Privacy Policy →',
    typeEssential: 'Essential',
    typeEssentialLs: 'Essential (localStorage)',
    typeAnalytics: 'Analytics',
    typeAffiliateCj: 'Affiliate (partners)',
    typeAffiliateGyg: 'Affiliate (GetYourGuide)',
  },
  fi: {
    kicker: 'Lakitiedot',
    h1: 'Evästekäytäntö',
    lastUpdated: 'Viimeksi päivitetty: lokakuu 2026',
    whatAreTitle: 'Mitä evästeet ovat?',
    whatAreBody: 'Evästeet ovat pieniä tekstitiedostoja, jotka tallentuvat laitteellesi vieraillessasi verkkosivustolla. Niiden avulla sivustot muistavat asetuksesi ja ymmärtävät, miten käytät sivustoa. Voit hallita evästeitä selaimesi asetuksista tai suostumusbannerimme kautta.',
    cookiesWeUseTitle: 'Käyttämämme evästeet',
    essentialBadge: 'Välttämätön',
    essentialNote: 'Aina aktiivinen, ei voi poistaa käytöstä',
    essentialBody: 'Sivusto ei tarvitse evästeitä toimiakseen. Valintasi (hyväksy tai hylkää) tallennetaan selaimesi localStorage-tallenteeseen eikä evästeeseen, joten emme kysy sitä joka vierailulla.',
    essentialDur: 'Kesto: kunnes tyhjennät sen tai muutat valintaasi',
    analyticsBadge: 'Analytiikka',
    analyticsNote: 'Vaatii suostumuksen',
    analyticsBody: 'Google Analytics 4 ‑evästeet auttavat meitä ymmärtämään, miten kävijät käyttävät sivustoa: mitkä sivut ovat suosittuja, kuinka kauan kävijät viipyvät, millä laitteella he selaavat ja mistä he tulevat (maa- ja kaupunkitaso). Emme kerää nimeä, sähköpostiosoitetta tai muuta suoraan tunnistavaa tietoa. Kävijä tunnistetaan evästeessä olevalla satunnaisella tunnisteella.',
    analyticsDur: 'Kesto: 2 vuotta',
    cjBadge: 'Kumppani',
    cjNote: 'Asetetaan kolmannen osapuolen toimesta, kun klikkaat kumppanilinkkiä',
    cjBody: (siteName) => <>Kun klikkaat varaus- tai kumppanilinkkiä sivustolla {siteName}, kumppaniverkostomme voivat asettaa seurantaevästeen tai lisätä linkkiin seurantaparametrin, jotta varaus kohdistuu sivustolle {siteName}: Adtraction (kumppanit kuten Sembo ja Lomarengas, domainien <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> ja <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span> kautta), Daisycon (kumppanit kuten Suomikauppa ja Nordicbuddies, domainien <span className="font-mono text-xs text-snow/80">jdt8.net</span> ja <span className="font-mono text-xs text-snow/80">glp8.net</span> kautta), Travelpayouts (kumppanit kuten EconomyBookings, domainien <span className="font-mono text-xs text-snow/80">tp.media</span> tai <span className="font-mono text-xs text-snow/80">travelpayouts.com</span> kautta) ja Trip.com (kumppanitunnisteet osoitteessa <span className="font-mono text-xs text-snow/80">trip.com</span>). Näin saamme pienen komission varauksestasi ilman lisäkustannuksia sinulle.</>,
    cjDur: 'Kesto: 30 päivää – 3 vuotta (vaihtelee kumppanin mukaan)',
    gygBadge: 'Kumppani (GYG)',
    gygNote: 'Vaatii suostumuksen',
    gygBody: (siteName) => `Kun annat suostumuksesi, sivusto lataa GetYourGuiden kumppaniskriptin (GetYourGuide, Berliini, EU; kumppanitunnus VRMKD7N), joka näyttää myös sivun aktiviteettiwidgetit. Skripti tallentaa evästeen visitor_id getyourguide.com-domainiin (kolmannen osapuolen eväste, 400 päivää), evästeen session_id tämän sivuston domainiin (istunnon loppuun), evästeen __cf_bm widget.getyourguide.com-domainiin (alle vuorokauden, GetYourGuiden sisällönjakeluverkon asettama) sekä merkinnän partner_id localStorageen ja merkinnän gyg_visitor_id sessionStorageen. GetYourGuide laskee niiden avulla widgettien näytöt ja klikkaukset ja kohdistaa varaukset sivustolle ${siteName}. Ilman suostumusta aktiviteettilinkit toimivat silti, ja tällöin getyourguide.com asettaa omat evästeensä vasta, kun siirryt sinne. Varaukset tehdään getyourguide.com-sivustolla sen oman tietosuojakäytännön mukaisesti.`,
    gygDur: 'Kesto: istunto – 400 päivää',
    lsBadge: 'localStorage',
    lsNote: 'Tallennetaan selaimeesi, ei lähetetä palvelimelle',
    lsIntro: 'Selaimesi localStorage-tallenteeseen kirjoitetaan pieniä merkintöjä, jotta sivusto olisi vähemmän ärsyttävä, esimerkiksi:',
    lsConsentDesc: 'suostumusvalintasi (hyväksytty tai hylätty)',
    lsLangDesc: 'Kielivalintasi, jotta sivusto voi avautua seuraavalla kerralla samalla kielellä.',
    lsPopupDesc: 'ajankohta, jolloin viimeksi suljit uutiskirjeen ponnahdusikkunan tai tilasit sen onnistuneesti, jotta emme näytä sitä uudelleen 7 päivään (tai koskaan, jos tilasit)',
    lsTail: 'localStorage ei teknisesti ole eväste. Listaamme sen tässä avoimuuden vuoksi. Voit tyhjentää sen selaimesi sivustotietojen asetuksista.',
    tableTitle: 'Evästetaulukko',
    tableCookie: 'Eväste',
    tableType: 'Tyyppi',
    tablePurpose: 'Tarkoitus',
    tableDuration: 'Kesto',
    tableRows: [],
    managingTitle: 'Evästeasetusten hallinta',
    managing1: 'Voit muuttaa tai perua valintasi milloin tahansa alla olevalla painikkeella. Se poistaa tallennetun valintasi, kumppaniskriptien selaimeesi tallentamat merkinnät ja tämän sivuston omaan domainiin asetetut evästeet ja lataa sivun uudelleen, jolloin suostumusbanneri näkyy taas. Muiden yritysten domaineihin (esimerkiksi getyourguide.com) asetetut evästeet voit poistaa selaimesi asetuksista. Voit myös estää evästeet kokonaan selaimessasi, mikä voi vaikuttaa sivuston toimintaan.',
    managing2: 'Useimmat selaimet mahdollistavat evästeiden katselun, hallinnan ja poistamisen. Tarkista selaimesi ohjeista lisätietoja.',
    withdrawButton: 'Muuta evästevalintaa',
    contactTitle: 'Yhteystiedot',
    contactBody: (email) => <>Evästeitä tai tätä käytäntöä koskevat kysymykset voit lähettää osoitteeseen {email}.</>,
    backToHome: '← Takaisin etusivulle',
    privacyLink: 'Tietosuojaseloste →',
    typeEssential: 'Välttämätön',
    typeEssentialLs: 'Välttämätön (localStorage)',
    typeAnalytics: 'Analytiikka',
    typeAffiliateCj: 'Kumppani (verkostot)',
    typeAffiliateGyg: 'Kumppani (GetYourGuide)',
  },
  de: {
    kicker: 'Rechtliches',
    h1: 'Cookie-Richtlinie',
    lastUpdated: 'Zuletzt aktualisiert: Oktober 2026',
    whatAreTitle: 'Was sind Cookies?',
    whatAreBody: 'Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Gerät gespeichert werden. Sie helfen Websites, Ihre Einstellungen zu merken und zu verstehen, wie Sie die Seite nutzen. Sie können Cookies über Ihre Browser-Einstellungen oder über unser Consent-Banner steuern.',
    cookiesWeUseTitle: 'Welche Cookies wir verwenden',
    essentialBadge: 'Essenziell',
    essentialNote: 'Immer aktiv, kann nicht deaktiviert werden',
    essentialBody: 'Die Website braucht keine Cookies, um zu funktionieren. Ihre Entscheidung (annehmen oder ablehnen) wird nicht in einem Cookie, sondern im localStorage Ihres Browsers gespeichert, damit wir Sie nicht bei jedem Besuch erneut fragen müssen.',
    essentialDur: 'Dauer: bis Sie den Eintrag löschen oder Ihre Auswahl ändern',
    analyticsBadge: 'Analyse',
    analyticsNote: 'Einwilligung erforderlich',
    analyticsBody: 'Cookies von Google Analytics 4 helfen uns zu verstehen, wie Besucher die Website nutzen: welche Seiten beliebt sind, wie lange Besucher bleiben, mit welchem Gerät sie surfen und woher sie kommen (Land- und Stadtebene). Wir erheben keine Namen, E-Mail-Adressen oder andere direkt identifizierende Daten. Besucher werden über eine zufällige Kennung in einem Cookie erkannt.',
    analyticsDur: 'Dauer: 2 Jahre',
    cjBadge: 'Partner',
    cjNote: 'Werden von Dritten gesetzt, wenn Sie auf Partnerlinks klicken',
    cjBody: (siteName) => <>Wenn Sie auf {siteName} einen Buchungs- oder Partnerlink anklicken, können unsere Partnernetzwerke ein Tracking-Cookie setzen oder dem Link einen Tracking-Parameter hinzufügen, damit die Buchung {siteName} zugeordnet werden kann: Adtraction (Partner wie Sembo und Lomarengas, über <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> und <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (Partner wie Suomikauppa und Nordicbuddies, über <span className="font-mono text-xs text-snow/80">jdt8.net</span> und <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (Partner wie EconomyBookings, über <span className="font-mono text-xs text-snow/80">tp.media</span> oder <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) und Trip.com (Partnerparameter auf <span className="font-mono text-xs text-snow/80">trip.com</span>). So erhalten wir eine kleine Provision, wenn Sie buchen, ohne Mehrkosten für Sie.</>,
    cjDur: 'Dauer: 30 Tage – 3 Jahre (je nach Partner)',
    gygBadge: 'Partner (GYG)',
    gygNote: 'Einwilligung erforderlich',
    gygBody: (siteName) => `Mit Ihrer Einwilligung lädt diese Website das Partnerskript von GetYourGuide (GetYourGuide, Berlin, EU; Partner-ID VRMKD7N), das auch die Aktivitäten-Widgets anzeigt. Das Skript speichert das Cookie visitor_id auf getyourguide.com (Drittanbieter-Cookie, 400 Tage), das Cookie session_id auf der Domain dieser Website (bis zum Ende der Sitzung), das Cookie __cf_bm auf widget.getyourguide.com (weniger als ein Tag, gesetzt vom Content-Delivery-Netzwerk von GetYourGuide) sowie partner_id im localStorage und gyg_visitor_id im sessionStorage. GetYourGuide zählt damit Aufrufe und Klicks der Widgets und ordnet Buchungen ${siteName} zu. Ohne Ihre Einwilligung funktionieren die Aktivitätslinks trotzdem, und getyourguide.com setzt in diesem Fall eigene Cookies erst, wenn Sie dorthin wechseln. Die Buchungen selbst erfolgen auf getyourguide.com gemäß deren Datenschutzrichtlinie.`,
    gygDur: 'Dauer: Sitzung – 400 Tage',
    lsBadge: 'localStorage',
    lsNote: 'Im Browser gespeichert, nie an einen Server gesendet',
    lsIntro: 'Im localStorage Ihres Browsers werden kleine Einträge gespeichert, damit die Website weniger störend ist, zum Beispiel:',
    lsConsentDesc: 'Ihre Entscheidung (angenommen oder abgelehnt)',
    lsLangDesc: 'Ihre Sprachwahl, damit die Website beim nächsten Mal in derselben Sprache angezeigt wird.',
    lsPopupDesc: 'Zeitstempel, wann Sie das Newsletter-Popup zuletzt geschlossen oder erfolgreich abonniert haben, damit es 7 Tage lang (bzw. nie nach Abonnement) nicht erneut erscheint',
    lsTail: 'localStorage ist technisch kein Cookie. Wir listen es hier aus Transparenzgründen. Sie können es über die Website-Daten-Einstellungen Ihres Browsers löschen.',
    tableTitle: 'Cookie-Übersichtstabelle',
    tableCookie: 'Cookie',
    tableType: 'Typ',
    tablePurpose: 'Zweck',
    tableDuration: 'Dauer',
    tableRows: [],
    managingTitle: 'Verwaltung Ihrer Cookie-Einstellungen',
    managing1: 'Sie können Ihre Auswahl jederzeit über die Schaltfläche unten ändern oder widerrufen. Diese löscht Ihre gespeicherte Auswahl, die von Partnerskripten in Ihrem Browser abgelegten Einträge und die Cookies auf der eigenen Domain dieser Website und lädt die Seite neu, sodass das Consent-Banner wieder erscheint. Cookies auf Domains anderer Unternehmen, etwa getyourguide.com, löschen Sie in Ihren Browser-Einstellungen. Sie können Cookies in Ihrem Browser auch vollständig blockieren, was die Funktion der Website einschränken kann.',
    managing2: 'Die meisten Browser erlauben das Einsehen, Verwalten und Löschen von Cookies. Hinweise dazu finden Sie in der Hilfe Ihres Browsers.',
    withdrawButton: 'Cookie-Auswahl ändern',
    contactTitle: 'Kontakt',
    contactBody: (email) => <>Bei Fragen zu Cookies oder dieser Richtlinie kontaktieren Sie uns unter {email}.</>,
    backToHome: '← Zurück zur Startseite',
    privacyLink: 'Datenschutzerklärung →',
    typeEssential: 'Essenziell',
    typeEssentialLs: 'Essenziell (localStorage)',
    typeAnalytics: 'Analyse',
    typeAffiliateCj: 'Partner (Netzwerke)',
    typeAffiliateGyg: 'Partner (GetYourGuide)',
  },
  ja: {
    kicker: '法的情報',
    h1: 'クッキーポリシー',
    lastUpdated: '最終更新：2026年10月',
    whatAreTitle: 'クッキーとは？',
    whatAreBody: 'クッキーとは、ウェブサイトを訪問した際にお客様のデバイスに保存される小さなテキストファイルです。ウェブサイトがお客様の設定を記憶し、サイトの使われ方を把握するのに役立ちます。クッキーはブラウザの設定または当サイトの同意バナーから管理できます。',
    cookiesWeUseTitle: '使用しているクッキー',
    essentialBadge: '必須',
    essentialNote: '常時有効、無効化できません',
    essentialBody: '本サイトの動作にクッキーは必要ありません。同意または拒否の選択は、クッキーではなくブラウザの localStorage に保存されるため、ご訪問のたびにお尋ねすることはありません。',
    essentialDur: '保存期間：削除するか選択を変更するまで',
    analyticsBadge: '解析',
    analyticsNote: '同意が必要',
    analyticsBody: 'Google Analytics 4 のクッキーは、サイトの使われ方を把握するのに役立ちます：どのページが人気か、滞在時間、利用デバイス、訪問元の国と都市など。氏名やメールアドレスなど直接個人を特定できる情報は取得せず、クッキーに保存されたランダムな識別子で訪問者を区別しています。',
    analyticsDur: '保存期間：2年',
    cjBadge: 'アフィリエイト',
    cjNote: 'アフィリエイトリンクをクリックすると第三者によって設定されます',
    cjBody: (siteName) => <>{siteName} で予約リンクやアフィリエイトリンクをクリックすると、提携ネットワークがトラッキングクッキーを設定するか、リンクに計測パラメータを付与し、予約を {siteName} に帰属させることがあります。対象：Adtraction（Sembo、Lomarengas などのパートナー。<span className="font-mono text-xs text-snow/80">do.sembo.fi</span> / <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span> 経由）、Daisycon（Suomikauppa、Nordicbuddies などのパートナー。<span className="font-mono text-xs text-snow/80">jdt8.net</span> / <span className="font-mono text-xs text-snow/80">glp8.net</span> 経由）、Travelpayouts（EconomyBookings など。<span className="font-mono text-xs text-snow/80">tp.media</span> / <span className="font-mono text-xs text-snow/80">travelpayouts.com</span> 経由）、Trip.com（<span className="font-mono text-xs text-snow/80">trip.com</span> 上のパートナーパラメータ）。ご予約の際に追加費用なしで当サイトが少額の手数料を受け取る仕組みです。</>,
    cjDur: '保存期間：30日〜3年（パートナーにより異なる）',
    gygBadge: 'アフィリエイト（GYG）',
    gygNote: '同意が必要',
    gygBody: (siteName) => `同意をいただいた場合に限り、本サイトは GetYourGuide のパートナースクリプト（GetYourGuide、ベルリン、EU、パートナーID VRMKD7N）を読み込みます。このスクリプトはアクティビティのウィジェットも表示します。スクリプトは、getyourguide.com に visitor_id（サードパーティクッキー、400日）、本サイトのドメインに session_id（セッション終了まで）、widget.getyourguide.com に __cf_bm（1日未満、GetYourGuide のコンテンツ配信ネットワークが設定）を保存し、さらに localStorage に partner_id、sessionStorage に gyg_visitor_id を保存します。GetYourGuide はこれらを使ってウィジェットの表示回数とクリック数を数え、予約を ${siteName} に帰属させます。同意がなくてもアクティビティへのリンクは機能し、その場合 getyourguide.com は、お客様が同サイトにアクセスしたときにのみ独自のクッキーを設定します。予約は getyourguide.com 上で同社のプライバシーポリシーに基づいて行われます。`,
    gygDur: '保存期間：セッション〜400日',
    lsBadge: 'localStorage',
    lsNote: 'ブラウザに保存され、サーバーには送信されません',
    lsIntro: 'サイトを快適にご利用いただくため、ブラウザの localStorage に小さなエントリを保存しています。例：',
    lsConsentDesc: 'お客様の同意または拒否の選択',
    lsLangDesc: '言語の選択（次回も同じ言語でサイトを表示するため）',
    lsPopupDesc: 'ニュースレターポップアップを最後に閉じた、または登録した日時。7日間は再表示しません（登録された場合は表示しません）',
    lsTail: 'localStorage は技術的にはクッキーではありませんが、透明性のためここで記載しています。ブラウザのサイトデータ設定から削除できます。',
    tableTitle: 'クッキー一覧表',
    tableCookie: 'クッキー',
    tableType: '種類',
    tablePurpose: '目的',
    tableDuration: '保存期間',
    tableRows: [],
    managingTitle: 'クッキー設定の管理',
    managing1: '下のボタンから、いつでも選択を変更または撤回できます。ボタンを押すと、保存された選択、パートナースクリプトがブラウザに保存したエントリ、本サイトのドメインに設定されたクッキーが削除され、ページが再読み込みされて同意バナーが再び表示されます。getyourguide.com など他社のドメインに設定されたクッキーは、ブラウザの設定から削除できます。ブラウザでクッキーを完全にブロックすることもできますが、サイトの機能に影響する場合があります。',
    managing2: 'ほとんどのブラウザでクッキーを表示・管理・削除できます。詳しい操作はブラウザのヘルプをご確認ください。',
    withdrawButton: 'クッキーの選択を変更',
    contactTitle: 'お問い合わせ',
    contactBody: (email) => <>クッキーまたは本ポリシーに関するご質問は {email} までお寄せください。</>,
    backToHome: '← ホームへ戻る',
    privacyLink: 'プライバシーポリシー →',
    typeEssential: '必須',
    typeEssentialLs: '必須（localStorage）',
    typeAnalytics: '解析',
    typeAffiliateCj: 'アフィリエイト（提携先）',
    typeAffiliateGyg: 'アフィリエイト（GetYourGuide）',
  },
  es: {
    kicker: 'Legal',
    h1: 'Política de Cookies',
    lastUpdated: 'Última actualización: octubre de 2026',
    whatAreTitle: '¿Qué son las cookies?',
    whatAreBody: 'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten que los sitios recuerden sus preferencias y entiendan cómo utiliza la página. Puede gestionar las cookies a través de la configuración de su navegador o de nuestro banner de consentimiento.',
    cookiesWeUseTitle: 'Cookies que utilizamos',
    essentialBadge: 'Esenciales',
    essentialNote: 'Siempre activas, no se pueden desactivar',
    essentialBody: 'El sitio no necesita cookies para funcionar. Su elección de aceptar o rechazar se guarda en el localStorage de su navegador, no en una cookie, para no preguntársela en cada visita.',
    essentialDur: 'Duración: hasta que la borre o cambie su elección',
    analyticsBadge: 'Analíticas',
    analyticsNote: 'Requieren consentimiento',
    analyticsBody: 'Las cookies de Google Analytics 4 nos ayudan a entender cómo se utiliza el sitio: qué páginas son populares, cuánto tiempo permanecen los usuarios, con qué dispositivo navegan y de dónde proceden (a nivel de país y ciudad). No recogemos nombres, direcciones de correo electrónico ni otros datos que identifiquen directamente a una persona: distinguimos a los visitantes mediante un identificador aleatorio guardado en una cookie.',
    analyticsDur: 'Duración: 2 años',
    cjBadge: 'Afiliados',
    cjNote: 'Las establecen terceros al hacer clic en enlaces de afiliados',
    cjBody: (siteName) => <>Cuando hace clic en un enlace de reserva o de afiliado en {siteName}, nuestras redes de afiliación pueden establecer una cookie de seguimiento o añadir un parámetro de seguimiento al enlace para atribuir la reserva a {siteName}: Adtraction (socios como Sembo y Lomarengas, a través de <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> y <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (socios como Suomikauppa y Nordicbuddies, a través de <span className="font-mono text-xs text-snow/80">jdt8.net</span> y <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (socios como EconomyBookings, vía <span className="font-mono text-xs text-snow/80">tp.media</span> o <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) y Trip.com (parámetros de socio en <span className="font-mono text-xs text-snow/80">trip.com</span>). Así ganamos una pequeña comisión cuando reserva, sin costo adicional para usted.</>,
    cjDur: 'Duración: 30 días – 3 años (según el socio)',
    gygBadge: 'Afiliados (GYG)',
    gygNote: 'Requieren consentimiento',
    gygBody: (siteName) => `Con su consentimiento, este sitio carga el script de afiliado de GetYourGuide (GetYourGuide, Berlín, UE; ID de afiliado VRMKD7N), que también muestra los widgets de actividades. El script guarda la cookie visitor_id en getyourguide.com (cookie de terceros, 400 días), la cookie session_id en el dominio de este sitio (hasta el final de la sesión), la cookie __cf_bm en widget.getyourguide.com (menos de 1 día, establecida por la red de distribución de contenidos de GetYourGuide), además de partner_id en el localStorage y gyg_visitor_id en el sessionStorage. GetYourGuide las utiliza para contar las visualizaciones y los clics de los widgets y atribuir las reservas a ${siteName}. Sin su consentimiento, los enlaces de actividades siguen funcionando y, en ese caso, getyourguide.com solo establece sus propias cookies cuando usted visita ese sitio. Las reservas se realizan en getyourguide.com conforme a la política de privacidad de GetYourGuide.`,
    gygDur: 'Duración: sesión – 400 días',
    lsBadge: 'localStorage',
    lsNote: 'Almacenado en su navegador, nunca enviado a un servidor',
    lsIntro: 'Se almacenan pequeñas entradas en el localStorage de su navegador para que el sitio sea menos molesto, por ejemplo:',
    lsConsentDesc: 'su elección de aceptar o rechazar',
    lsLangDesc: 'Su elección de idioma, para que el sitio pueda abrirse en el mismo idioma la próxima vez.',
    lsPopupDesc: 'una marca de tiempo de cuándo cerró por última vez el popup del boletín o se suscribió correctamente, para no mostrarlo de nuevo durante 7 días (o nunca, si se suscribió)',
    lsTail: 'Técnicamente, localStorage no es una cookie. La listamos aquí por transparencia. Puede borrarla desde la configuración de datos del sitio en su navegador.',
    tableTitle: 'Tabla de referencia de cookies',
    tableCookie: 'Cookie',
    tableType: 'Tipo',
    tablePurpose: 'Finalidad',
    tableDuration: 'Duración',
    tableRows: [],
    managingTitle: 'Gestionar sus preferencias de cookies',
    managing1: 'Puede cambiar o retirar su elección en cualquier momento con el botón de abajo. El botón borra la elección guardada, las entradas que los scripts de socios guardaron en su navegador y las cookies del propio dominio de este sitio, y después recarga la página para que vuelva a aparecer el banner de consentimiento. Las cookies de dominios de otras empresas, como getyourguide.com, se eliminan desde la configuración del navegador. También puede bloquear las cookies por completo en su navegador, aunque esto puede afectar al funcionamiento del sitio.',
    managing2: 'La mayoría de los navegadores permiten ver, gestionar y eliminar las cookies. Consulte la sección de ayuda de su navegador para más instrucciones.',
    withdrawButton: 'Cambiar la elección de cookies',
    contactTitle: 'Contacto',
    contactBody: (email) => <>Para cualquier consulta sobre las cookies o esta política, escríbanos a {email}.</>,
    backToHome: '← Volver al inicio',
    privacyLink: 'Política de Privacidad →',
    typeEssential: 'Esencial',
    typeEssentialLs: 'Esencial (localStorage)',
    typeAnalytics: 'Analítica',
    typeAffiliateCj: 'Afiliados (redes)',
    typeAffiliateGyg: 'Afiliado (GetYourGuide)',
  },
  'pt-BR': {
    kicker: 'Aspectos legais',
    h1: 'Política de Cookies',
    lastUpdated: 'Última atualização: outubro de 2026',
    whatAreTitle: 'O que são cookies?',
    whatAreBody: 'Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles ajudam os sites a lembrar suas preferências e a entender como você utiliza a página. Você pode controlar os cookies pelas configurações do navegador ou pelo nosso banner de consentimento.',
    cookiesWeUseTitle: 'Cookies que utilizamos',
    essentialBadge: 'Essenciais',
    essentialNote: 'Sempre ativos, não podem ser desativados',
    essentialBody: 'O site não precisa de cookies para funcionar. Sua escolha de aceitar ou recusar fica salva no localStorage do seu navegador, não em um cookie, para não perguntarmos em cada visita.',
    essentialDur: 'Duração: até você limpá-la ou mudar sua escolha',
    analyticsBadge: 'Analíticos',
    analyticsNote: 'Requerem consentimento',
    analyticsBody: 'Os cookies do Google Analytics 4 nos ajudam a entender como os visitantes utilizam o site: quais páginas são populares, quanto tempo as pessoas permanecem, em que dispositivo navegam e de onde vêm (a nível de país e cidade). Não coletamos nomes, endereços de e-mail nem outros dados que identifiquem diretamente uma pessoa: os visitantes são distinguidos por um identificador aleatório guardado em um cookie.',
    analyticsDur: 'Duração: 2 anos',
    cjBadge: 'Afiliados',
    cjNote: 'Definidos por terceiros quando você clica em links de afiliados',
    cjBody: (siteName) => <>Quando você clica em um link de reserva ou de afiliado no {siteName}, nossas redes de afiliados podem definir um cookie de rastreamento ou adicionar um parâmetro de rastreamento ao link para atribuir a reserva ao {siteName}: Adtraction (parceiros como Sembo e Lomarengas, via <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> e <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (parceiros como Suomikauppa e Nordicbuddies, via <span className="font-mono text-xs text-snow/80">jdt8.net</span> e <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (parceiros como EconomyBookings, via <span className="font-mono text-xs text-snow/80">tp.media</span> ou <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) e Trip.com (parâmetros de parceiro em <span className="font-mono text-xs text-snow/80">trip.com</span>). É assim que recebemos uma pequena comissão quando você reserva, sem custo adicional para você.</>,
    cjDur: 'Duração: 30 dias – 3 anos (varia por parceiro)',
    gygBadge: 'Afiliados (GYG)',
    gygNote: 'Requerem consentimento',
    gygBody: (siteName) => `Com o seu consentimento, este site carrega o script de parceiro do GetYourGuide (GetYourGuide, Berlim, UE; ID de parceiro VRMKD7N), que também exibe os widgets de atividades. O script salva o cookie visitor_id em getyourguide.com (cookie de terceiros, 400 dias), o cookie session_id no domínio deste site (até o fim da sessão), o cookie __cf_bm em widget.getyourguide.com (menos de 1 dia, definido pela rede de distribuição de conteúdo do GetYourGuide), além de partner_id no localStorage e gyg_visitor_id no sessionStorage. O GetYourGuide os usa para contar as exibições e os cliques dos widgets e atribuir as reservas ao ${siteName}. Sem o seu consentimento, os links de atividades continuam funcionando, e nesse caso o getyourguide.com só define os próprios cookies quando você acessa o site dele. As reservas são feitas no getyourguide.com, sob a política de privacidade dele.`,
    gygDur: 'Duração: sessão – 400 dias',
    lsBadge: 'localStorage',
    lsNote: 'Armazenado no seu navegador; nunca enviado a um servidor',
    lsIntro: 'Pequenas entradas são armazenadas no localStorage do seu navegador para que o site seja menos incômodo, por exemplo:',
    lsConsentDesc: 'sua escolha de aceitar ou recusar',
    lsLangDesc: 'Sua escolha de idioma, para que o site possa abrir no mesmo idioma da próxima vez.',
    lsPopupDesc: 'um carimbo de tempo de quando você fechou pela última vez o popup do boletim ou se inscreveu com sucesso, para que não o exibamos novamente por 7 dias (ou nunca, se você se inscreveu)',
    lsTail: 'Tecnicamente, o localStorage não é um cookie. Listamos aqui por transparência. Você pode limpá-lo nas configurações de dados de site do seu navegador.',
    tableTitle: 'Tabela de referência de cookies',
    tableCookie: 'Cookie',
    tableType: 'Tipo',
    tablePurpose: 'Finalidade',
    tableDuration: 'Duração',
    tableRows: [],
    managingTitle: 'Gerenciando suas preferências de cookies',
    managing1: 'Você pode alterar ou retirar sua escolha a qualquer momento com o botão abaixo. Ele apaga a escolha salva, as entradas que os scripts de parceiros salvaram no seu navegador e os cookies do próprio domínio deste site e recarrega a página, para que o banner de consentimento apareça de novo. Os cookies em domínios de outras empresas, como getyourguide.com, podem ser apagados nas configurações do navegador. Também é possível bloquear os cookies por completo no navegador, mas isso pode afetar o funcionamento do site.',
    managing2: 'A maioria dos navegadores permite visualizar, gerenciar e excluir cookies. Consulte a seção de ajuda do seu navegador para instruções.',
    withdrawButton: 'Alterar escolha de cookies',
    contactTitle: 'Contato',
    contactBody: (email) => <>Para dúvidas sobre cookies ou esta política, fale conosco em {email}.</>,
    backToHome: '← Voltar para a página inicial',
    privacyLink: 'Política de Privacidade →',
    typeEssential: 'Essencial',
    typeEssentialLs: 'Essencial (localStorage)',
    typeAnalytics: 'Analítico',
    typeAffiliateCj: 'Afiliados (redes)',
    typeAffiliateGyg: 'Afiliado (GetYourGuide)',
  },
  'zh-CN': {
    kicker: '法律信息',
    h1: 'Cookie 政策',
    lastUpdated: '最后更新：2026年10月',
    whatAreTitle: '什么是 Cookie？',
    whatAreBody: 'Cookie 是您访问网站时存储在您设备上的小型文本文件。它们帮助网站记住您的偏好，并了解您如何使用该网站。您可以通过浏览器设置或通过我们的同意横幅来管理 Cookie。',
    cookiesWeUseTitle: '我们使用的 Cookie',
    essentialBadge: '必要',
    essentialNote: '始终启用，不可关闭',
    essentialBody: '本网站无需 Cookie 即可运行。您的接受或拒绝选择保存在浏览器的 localStorage 中，而不是 Cookie 中，这样我们就无需在每次访问时再次询问。',
    essentialDur: '保留期限：直到您将其清除或更改选择',
    analyticsBadge: '分析',
    analyticsNote: '需要您的同意',
    analyticsBody: 'Google Analytics 4 的 Cookie 帮助我们了解访客如何使用网站：哪些页面受欢迎、停留时间、使用的设备，以及访客来自哪个国家和城市。我们不会收集姓名、电子邮箱等可直接识别身份的信息，只通过 Cookie 中的随机标识符区分访客。',
    analyticsDur: '保留期限：2年',
    cjBadge: '联盟',
    cjNote: '当您点击联盟链接时由第三方设置',
    cjBody: (siteName) => <>当您在 {siteName} 上点击预订或联盟链接时，我们的联盟网络可能会设置跟踪 Cookie 或在链接中加入跟踪参数，以便将预订归因于 {siteName}：Adtraction（合作伙伴如 Sembo、Lomarengas，经由 <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> 与 <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>）、Daisycon（合作伙伴如 Suomikauppa、Nordicbuddies，经由 <span className="font-mono text-xs text-snow/80">jdt8.net</span> 与 <span className="font-mono text-xs text-snow/80">glp8.net</span>）、Travelpayouts（如 EconomyBookings，经由 <span className="font-mono text-xs text-snow/80">tp.media</span> 或 <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>）以及 Trip.com（<span className="font-mono text-xs text-snow/80">trip.com</span> 上的合作参数）。您预订时我们因此获得少量佣金，您无需支付任何额外费用。</>,
    cjDur: '保留期限：30天至3年（视合作伙伴而定）',
    gygBadge: '联盟（GYG）',
    gygNote: '需要您的同意',
    gygBody: (siteName) => `只有在您同意后，本网站才会加载 GetYourGuide 的合作伙伴脚本（GetYourGuide，德国柏林，欧盟；合作伙伴 ID VRMKD7N），该脚本也负责显示活动小组件。脚本会在 getyourguide.com 上保存 visitor_id（第三方 Cookie，400天），在本网站域名上保存 session_id（至会话结束），在 widget.getyourguide.com 上保存 __cf_bm（不到1天，由 GetYourGuide 的内容分发网络设置），并在 localStorage 中保存 partner_id、在 sessionStorage 中保存 gyg_visitor_id。GetYourGuide 用它们统计小组件的展示和点击次数，并将预订归因于 ${siteName}。即使您不同意，活动链接仍可正常使用，此时 getyourguide.com 只有在您访问其网站时才会设置自己的 Cookie。预订在 getyourguide.com 上完成，适用其自身的隐私政策。`,
    gygDur: '保留期限：会话期间至400天',
    lsBadge: 'localStorage',
    lsNote: '存储在您的浏览器中，绝不会发送到服务器',
    lsIntro: '为了减少打扰，我们会在您浏览器的 localStorage 中存储一些小条目，例如：',
    lsConsentDesc: '您的接受/拒绝选择',
    lsLangDesc: '您的语言选择，以便下次以同一语言打开网站。',
    lsPopupDesc: '您上次关闭或成功订阅电子简报弹窗的时间戳，以便在7天内不再显示（若已订阅则永不显示）',
    lsTail: '严格来说 localStorage 并不是 Cookie。我们在此列出仅为了透明。您可以通过浏览器的网站数据设置将其清除。',
    tableTitle: 'Cookie 一览表',
    tableCookie: 'Cookie',
    tableType: '类型',
    tablePurpose: '用途',
    tableDuration: '保留期限',
    tableRows: [],
    managingTitle: '管理您的 Cookie 偏好',
    managing1: '您可以随时通过下方按钮更改或撤回您的选择。该按钮会删除已保存的选择、合作伙伴脚本存储在您浏览器中的条目以及本网站自身域名下的 Cookie，然后重新加载页面，同意横幅会再次出现。其他公司域名（例如 getyourguide.com）下的 Cookie 可在浏览器设置中删除。您也可以在浏览器中完全阻止 Cookie，但这可能会影响网站功能。',
    managing2: '大多数浏览器都允许查看、管理和删除 Cookie。请参阅您浏览器的帮助部分获取具体说明。',
    withdrawButton: '更改 Cookie 选择',
    contactTitle: '联系方式',
    contactBody: (email) => <>如对 Cookie 或本政策有任何问题，请通过 {email} 与我们联系。</>,
    backToHome: '← 返回首页',
    privacyLink: '隐私政策 →',
    typeEssential: '必要',
    typeEssentialLs: '必要（localStorage）',
    typeAnalytics: '分析',
    typeAffiliateCj: '联盟（合作网络）',
    typeAffiliateGyg: '联盟（GetYourGuide）',
  },
  ko: {
    kicker: '법적 고지',
    h1: '쿠키 정책',
    lastUpdated: '최종 업데이트: 2026년 10월',
    whatAreTitle: '쿠키란 무엇인가요?',
    whatAreBody: '쿠키는 귀하가 웹사이트를 방문할 때 기기에 저장되는 작은 텍스트 파일입니다. 웹사이트가 귀하의 설정을 기억하고 사이트 이용 방식을 이해하는 데 도움이 됩니다. 브라우저 설정이나 당사의 동의 배너를 통해 쿠키를 관리하실 수 있습니다.',
    cookiesWeUseTitle: '당사가 사용하는 쿠키',
    essentialBadge: '필수',
    essentialNote: '항상 활성, 비활성화할 수 없습니다',
    essentialBody: '본 사이트는 작동하는 데 쿠키가 필요하지 않습니다. 수락 또는 거부 선택은 쿠키가 아닌 브라우저의 localStorage에 저장되므로 방문하실 때마다 다시 묻지 않습니다.',
    essentialDur: '보관 기간: 삭제하시거나 선택을 변경하실 때까지',
    analyticsBadge: '분석',
    analyticsNote: '동의가 필요합니다',
    analyticsBody: 'Google Analytics 4 쿠키는 방문자가 사이트를 어떻게 이용하는지(어떤 페이지가 인기 있는지, 체류 시간, 사용 기기, 국가 및 도시 단위의 접속 출처)를 파악하는 데 도움이 됩니다. 이름이나 이메일 주소처럼 직접 신원을 알 수 있는 정보는 수집하지 않으며, 쿠키에 저장된 임의의 식별자로 방문자를 구분합니다.',
    analyticsDur: '보관 기간: 2년',
    cjBadge: '제휴',
    cjNote: '제휴 링크 클릭 시 제3자가 설정합니다',
    cjBody: (siteName) => <>{siteName}에서 예약 또는 제휴 링크를 클릭하시면 제휴 네트워크가 추적 쿠키를 설정하거나 링크에 추적 매개변수를 추가하여 예약을 {siteName}에 귀속시킬 수 있습니다: Adtraction(Sembo, Lomarengas 등의 파트너, <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> / <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span> 경유), Daisycon(Suomikauppa, Nordicbuddies 등의 파트너, <span className="font-mono text-xs text-snow/80">jdt8.net</span> / <span className="font-mono text-xs text-snow/80">glp8.net</span> 경유), Travelpayouts(EconomyBookings 등, <span className="font-mono text-xs text-snow/80">tp.media</span> / <span className="font-mono text-xs text-snow/80">travelpayouts.com</span> 경유), Trip.com(<span className="font-mono text-xs text-snow/80">trip.com</span>의 파트너 매개변수). 이를 통해 추가 비용 없이 당사가 소액의 수수료를 받습니다.</>,
    cjDur: '보관 기간: 30일~3년(파트너에 따라 다름)',
    gygBadge: '제휴(GYG)',
    gygNote: '동의가 필요합니다',
    gygBody: (siteName) => `동의하시는 경우에만 본 사이트는 GetYourGuide 파트너 스크립트(GetYourGuide, 독일 베를린, EU, 파트너 ID VRMKD7N)를 불러옵니다. 이 스크립트는 액티비티 위젯도 표시합니다. 스크립트는 getyourguide.com에 visitor_id(제3자 쿠키, 400일), 본 사이트 도메인에 session_id(세션 종료 시까지), widget.getyourguide.com에 __cf_bm(1일 미만, GetYourGuide의 콘텐츠 전송 네트워크가 설정)을 저장하고, localStorage에 partner_id, sessionStorage에 gyg_visitor_id를 저장합니다. GetYourGuide는 이 정보를 이용해 위젯의 노출 수와 클릭 수를 집계하고 예약을 ${siteName}에 귀속시킵니다. 동의하지 않으셔도 액티비티 링크는 정상적으로 작동하며, 이 경우 getyourguide.com은 귀하가 해당 사이트로 이동하실 때에만 자체 쿠키를 설정합니다. 예약은 getyourguide.com에서 해당 회사의 개인정보 처리방침에 따라 이루어집니다.`,
    gygDur: '보관 기간: 세션~400일',
    lsBadge: 'localStorage',
    lsNote: '브라우저에 저장되며 서버로 전송되지 않습니다',
    lsIntro: '사이트를 더 편리하게 이용하실 수 있도록 브라우저의 localStorage에 작은 항목을 저장합니다. 예를 들면 다음과 같습니다:',
    lsConsentDesc: '귀하의 수락/거부 선택',
    lsLangDesc: '귀하의 언어 선택(다음 방문 때 같은 언어로 사이트를 열기 위해 저장)',
    lsPopupDesc: '뉴스레터 팝업을 마지막으로 닫거나 성공적으로 구독한 시점의 타임스탬프. 7일 동안 다시 표시하지 않음(구독한 경우 영구히 표시되지 않음)',
    lsTail: 'localStorage는 기술적으로 쿠키가 아닙니다. 투명성을 위해 여기에 표시합니다. 브라우저의 사이트 데이터 설정에서 삭제하실 수 있습니다.',
    tableTitle: '쿠키 참조표',
    tableCookie: '쿠키',
    tableType: '유형',
    tablePurpose: '용도',
    tableDuration: '보관 기간',
    tableRows: [],
    managingTitle: '쿠키 설정 관리',
    managing1: '아래 버튼으로 언제든지 선택을 변경하거나 철회하실 수 있습니다. 버튼을 누르시면 저장된 선택, 파트너 스크립트가 브라우저에 저장한 항목, 본 사이트 자체 도메인에 설정된 쿠키가 삭제되고, 페이지가 새로 고침되어 동의 배너가 다시 표시됩니다. getyourguide.com 등 다른 회사 도메인의 쿠키는 브라우저 설정에서 삭제하실 수 있습니다. 브라우저에서 쿠키를 완전히 차단하실 수도 있지만 사이트 기능에 영향을 줄 수 있습니다.',
    managing2: '대부분의 브라우저에서 쿠키를 보고, 관리하고, 삭제할 수 있습니다. 구체적인 방법은 브라우저 도움말을 확인해 주십시오.',
    withdrawButton: '쿠키 선택 변경',
    contactTitle: '연락처',
    contactBody: (email) => <>쿠키 또는 본 정책에 관한 문의는 {email} 주소로 보내 주십시오.</>,
    backToHome: '← 홈으로 돌아가기',
    privacyLink: '개인정보 처리방침 →',
    typeEssential: '필수',
    typeEssentialLs: '필수(localStorage)',
    typeAnalytics: '분석',
    typeAffiliateCj: '제휴(네트워크)',
    typeAffiliateGyg: '제휴(GetYourGuide)',
  },
  fr: {
    kicker: 'Mentions légales',
    h1: 'Politique de Cookies',
    lastUpdated: 'Dernière mise à jour : octobre 2026',
    whatAreTitle: 'Que sont les cookies ?',
    whatAreBody: 'Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Ils aident les sites à mémoriser vos préférences et à comprendre comment vous utilisez le site. Vous pouvez gérer les cookies via les paramètres de votre navigateur ou via notre bandeau de consentement.',
    cookiesWeUseTitle: 'Les cookies que nous utilisons',
    essentialBadge: 'Essentiels',
    essentialNote: 'Toujours actifs, ne peuvent être désactivés',
    essentialBody: "Le site n'a pas besoin de cookies pour fonctionner. Votre choix d'accepter ou de refuser est enregistré dans le localStorage de votre navigateur, et non dans un cookie, afin de ne pas vous le redemander à chaque visite.",
    essentialDur: "Durée : jusqu'à ce que vous l'effaciez ou modifiiez votre choix",
    analyticsBadge: 'Analytique',
    analyticsNote: 'Nécessite le consentement',
    analyticsBody: 'Les cookies Google Analytics 4 nous aident à comprendre comment les visiteurs utilisent le site : quelles pages sont populaires, combien de temps les gens y restent, avec quel appareil ils naviguent et d’où ils viennent (niveau pays et ville). Nous ne collectons ni nom, ni adresse e-mail, ni aucune autre donnée identifiant directement une personne : les visiteurs sont distingués par un identifiant aléatoire stocké dans un cookie.',
    analyticsDur: 'Durée : 2 ans',
    cjBadge: 'Affiliation',
    cjNote: 'Posés par des tiers lorsque vous cliquez sur des liens d\'affiliation',
    cjBody: (siteName) => <>Lorsque vous cliquez sur un lien de réservation ou d'affiliation sur {siteName}, nos réseaux d'affiliation peuvent déposer un cookie de suivi ou ajouter un paramètre de suivi au lien afin d'attribuer la réservation à {siteName} : Adtraction (partenaires comme Sembo et Lomarengas, via <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> et <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (partenaires comme Suomikauppa et Nordicbuddies, via <span className="font-mono text-xs text-snow/80">jdt8.net</span> et <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (partenaires comme EconomyBookings, via <span className="font-mono text-xs text-snow/80">tp.media</span> ou <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) et Trip.com (paramètres partenaires sur <span className="font-mono text-xs text-snow/80">trip.com</span>). C'est ainsi que nous percevons une petite commission lorsque vous réservez, sans surcoût pour vous.</>,
    cjDur: 'Durée : 30 jours – 3 ans (selon le partenaire)',
    gygBadge: 'Affiliation (GYG)',
    gygNote: 'Nécessite le consentement',
    gygBody: (siteName) => `Avec votre consentement, ce site charge le script partenaire de GetYourGuide (GetYourGuide, Berlin, UE, ID partenaire VRMKD7N), qui affiche aussi les widgets d'activités. Le script dépose le cookie visitor_id sur getyourguide.com (cookie tiers, 400 jours), le cookie session_id sur le domaine de ce site (jusqu'à la fin de la session), le cookie __cf_bm sur widget.getyourguide.com (moins d'un jour, déposé par le réseau de diffusion de contenu de GetYourGuide), ainsi que partner_id dans le localStorage et gyg_visitor_id dans le sessionStorage. GetYourGuide s'en sert pour compter les affichages et les clics des widgets et attribuer les réservations à ${siteName}. Sans votre consentement, les liens d'activités continuent de fonctionner, et dans ce cas getyourguide.com ne dépose ses propres cookies que lorsque vous vous rendez sur son site. Les réservations sont effectuées sur getyourguide.com selon sa propre politique de confidentialité.`,
    gygDur: 'Durée : session – 400 jours',
    lsBadge: 'localStorage',
    lsNote: 'Stocké dans votre navigateur, jamais envoyé à un serveur',
    lsIntro: 'De petites entrées sont stockées dans le localStorage de votre navigateur pour rendre le site moins intrusif, par exemple :',
    lsConsentDesc: "votre choix d'accepter ou de refuser",
    lsLangDesc: "Votre choix de langue, pour que le site puisse s'ouvrir dans la même langue la prochaine fois.",
    lsPopupDesc: 'un horodatage du moment où vous avez fermé pour la dernière fois ou souscrit avec succès au popup de la newsletter, afin de ne pas le réafficher pendant 7 jours (ou jamais si vous vous êtes inscrit)',
    lsTail: 'Le localStorage n\'est techniquement pas un cookie. Nous le listons ici pour la transparence. Vous pouvez l\'effacer via les paramètres de données de site de votre navigateur.',
    tableTitle: 'Tableau de référence des cookies',
    tableCookie: 'Cookie',
    tableType: 'Type',
    tablePurpose: 'Finalité',
    tableDuration: 'Durée',
    tableRows: [],
    managingTitle: 'Gérer vos préférences de cookies',
    managing1: "Vous pouvez modifier ou retirer votre choix à tout moment avec le bouton ci-dessous. Il efface votre choix enregistré, les entrées que les scripts partenaires ont stockées dans votre navigateur et les cookies déposés sur le propre domaine de ce site, puis recharge la page pour que le bandeau de consentement réapparaisse. Les cookies déposés sur les domaines d'autres sociétés, comme getyourguide.com, se suppriment dans les paramètres de votre navigateur. Vous pouvez aussi bloquer entièrement les cookies dans votre navigateur, ce qui peut toutefois affecter le fonctionnement du site.",
    managing2: 'La plupart des navigateurs permettent de consulter, gérer et supprimer les cookies. Consultez la section d\'aide de votre navigateur pour les instructions.',
    withdrawButton: 'Modifier le choix des cookies',
    contactTitle: 'Contact',
    contactBody: (email) => <>Pour toute question sur les cookies ou cette politique, écrivez-nous à {email}.</>,
    backToHome: '← Retour à l\'accueil',
    privacyLink: 'Politique de Confidentialité →',
    typeEssential: 'Essentiel',
    typeEssentialLs: 'Essentiel (localStorage)',
    typeAnalytics: 'Analytique',
    typeAffiliateCj: 'Affiliation (réseaux)',
    typeAffiliateGyg: 'Affiliation (GetYourGuide)',
  },
  it: {
    kicker: 'Note legali',
    h1: 'Informativa sui Cookie',
    lastUpdated: 'Ultimo aggiornamento: ottobre 2026',
    whatAreTitle: 'Cosa sono i cookie?',
    whatAreBody: 'I cookie sono piccoli file di testo memorizzati sul Suo dispositivo quando visita un sito web. Aiutano i siti a ricordare le Sue preferenze e a comprendere come Lei utilizza la pagina. Può gestire i cookie tramite le impostazioni del browser o tramite il nostro banner di consenso.',
    cookiesWeUseTitle: 'Cookie che utilizziamo',
    essentialBadge: 'Essenziali',
    essentialNote: 'Sempre attivi, non possono essere disattivati',
    essentialBody: 'Il sito non ha bisogno di cookie per funzionare. La Sua scelta di accettare o rifiutare viene salvata nel localStorage del Suo browser, non in un cookie, così non Le chiediamo di nuovo a ogni visita.',
    essentialDur: 'Durata: finché non la cancella o non modifica la Sua scelta',
    analyticsBadge: 'Analitici',
    analyticsNote: 'Richiedono il consenso',
    analyticsBody: 'I cookie di Google Analytics 4 ci aiutano a comprendere come i visitatori utilizzano il sito: quali pagine sono popolari, quanto tempo si fermano, con quale dispositivo navigano e da dove provengono (a livello di paese e città). Non raccogliamo nomi, indirizzi e-mail né altri dati che identifichino direttamente una persona: i visitatori vengono distinti da un identificatore casuale salvato in un cookie.',
    analyticsDur: 'Durata: 2 anni',
    cjBadge: 'Affiliazione',
    cjNote: 'Impostati da terzi quando Lei clicca su link di affiliazione',
    cjBody: (siteName) => <>Quando Lei clicca su un link di prenotazione o affiliazione su {siteName}, le nostre reti di affiliazione possono impostare un cookie di tracciamento o aggiungere al link un parametro di tracciamento per attribuire la prenotazione a {siteName}: Adtraction (partner come Sembo e Lomarengas, tramite <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> e <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (partner come Suomikauppa e Nordicbuddies, tramite <span className="font-mono text-xs text-snow/80">jdt8.net</span> e <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (partner come EconomyBookings, tramite <span className="font-mono text-xs text-snow/80">tp.media</span> o <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) e Trip.com (parametri partner su <span className="font-mono text-xs text-snow/80">trip.com</span>). È così che riceviamo una piccola commissione quando Lei prenota, senza costi aggiuntivi per Lei.</>,
    cjDur: 'Durata: 30 giorni – 3 anni (varia in base al partner)',
    gygBadge: 'Affiliazione (GYG)',
    gygNote: 'Richiedono il consenso',
    gygBody: (siteName) => `Con il Suo consenso, questo sito carica lo script partner di GetYourGuide (GetYourGuide, Berlino, UE; ID partner VRMKD7N), che mostra anche i widget delle attività. Lo script salva il cookie visitor_id su getyourguide.com (cookie di terze parti, 400 giorni), il cookie session_id sul dominio di questo sito (fino alla fine della sessione), il cookie __cf_bm su widget.getyourguide.com (meno di 1 giorno, impostato dalla rete di distribuzione dei contenuti di GetYourGuide), oltre a partner_id nel localStorage e gyg_visitor_id nel sessionStorage. GetYourGuide li usa per contare le visualizzazioni e i clic dei widget e attribuire le prenotazioni a ${siteName}. Senza il Suo consenso i link alle attività funzionano comunque, e in tal caso getyourguide.com imposta i propri cookie solo quando Lei visita il suo sito. Le prenotazioni avvengono su getyourguide.com secondo la sua informativa sulla privacy.`,
    gygDur: 'Durata: sessione – 400 giorni',
    lsBadge: 'localStorage',
    lsNote: 'Memorizzato nel Suo browser, mai inviato a un server',
    lsIntro: 'Nel localStorage del Suo browser vengono memorizzate piccole voci per rendere il sito meno fastidioso, ad esempio:',
    lsConsentDesc: 'la Sua scelta di accettare o rifiutare',
    lsLangDesc: 'La Sua scelta della lingua, perché il sito possa aprirsi nella stessa lingua la prossima volta.',
    lsPopupDesc: 'un timestamp di quando ha chiuso per l\'ultima volta o si è iscritto con successo al popup della newsletter, in modo da non mostrarlo di nuovo per 7 giorni (o mai più se si è iscritto)',
    lsTail: 'Tecnicamente, localStorage non è un cookie. Lo elenchiamo qui per trasparenza. Può cancellarlo dalle impostazioni dati sito del Suo browser.',
    tableTitle: 'Tabella di riferimento dei cookie',
    tableCookie: 'Cookie',
    tableType: 'Tipo',
    tablePurpose: 'Finalità',
    tableDuration: 'Durata',
    tableRows: [],
    managingTitle: 'Gestione delle preferenze sui cookie',
    managing1: 'Può modificare o revocare la Sua scelta in qualsiasi momento con il pulsante qui sotto. Il pulsante cancella la scelta salvata, le voci che gli script dei partner hanno salvato nel Suo browser e i cookie impostati sul dominio di questo sito, poi ricarica la pagina, così il banner di consenso viene mostrato di nuovo. I cookie sui domini di altre aziende, come getyourguide.com, si eliminano dalle impostazioni del browser. Può anche bloccare completamente i cookie nel browser, ma ciò potrebbe influire sul funzionamento del sito.',
    managing2: 'La maggior parte dei browser consente di visualizzare, gestire ed eliminare i cookie. Consulti la sezione di aiuto del Suo browser per le istruzioni.',
    withdrawButton: 'Modifica la scelta sui cookie',
    contactTitle: 'Contatti',
    contactBody: (email) => <>Per domande sui cookie o sulla presente informativa, ci contatti a {email}.</>,
    backToHome: '← Torna alla home',
    privacyLink: 'Informativa sulla Privacy →',
    typeEssential: 'Essenziale',
    typeEssentialLs: 'Essenziale (localStorage)',
    typeAnalytics: 'Analitico',
    typeAffiliateCj: 'Affiliazione (reti)',
    typeAffiliateGyg: 'Affiliazione (GetYourGuide)',
  },
  nl: {
    kicker: 'Juridisch',
    h1: 'Cookiebeleid',
    lastUpdated: 'Laatst bijgewerkt: oktober 2026',
    whatAreTitle: 'Wat zijn cookies?',
    whatAreBody: 'Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u een website bezoekt. Ze helpen websites uw voorkeuren te onthouden en te begrijpen hoe u de site gebruikt. U kunt cookies beheren via uw browserinstellingen of via onze toestemmingsbanner.',
    cookiesWeUseTitle: 'Cookies die wij gebruiken',
    essentialBadge: 'Essentieel',
    essentialNote: 'Altijd actief, kunnen niet worden uitgeschakeld',
    essentialBody: 'De website heeft geen cookies nodig om te werken. Uw keuze om te accepteren of te weigeren wordt opgeslagen in de localStorage van uw browser, niet in een cookie, zodat wij u niet bij elk bezoek opnieuw hoeven te vragen.',
    essentialDur: 'Duur: totdat u deze wist of uw keuze wijzigt',
    analyticsBadge: 'Analyse',
    analyticsNote: 'Vereist toestemming',
    analyticsBody: 'Cookies van Google Analytics 4 helpen ons te begrijpen hoe bezoekers de site gebruiken: welke pagina’s populair zijn, hoe lang mensen blijven, met welk apparaat ze surfen en waar ze vandaan komen (land- en stadsniveau). We verzamelen geen namen, e-mailadressen of andere direct identificerende gegevens. Bezoekers worden onderscheiden via een willekeurige identificatiecode in een cookie.',
    analyticsDur: 'Duur: 2 jaar',
    cjBadge: 'Affiliate',
    cjNote: 'Geplaatst door derden wanneer u op affiliatelinks klikt',
    cjBody: (siteName) => <>Wanneer u op een boekings- of affiliatelink op {siteName} klikt, kunnen onze affiliatenetwerken een trackingcookie plaatsen of een trackingparameter aan de link toevoegen zodat de boeking aan {siteName} kan worden toegeschreven: Adtraction (partners zoals Sembo en Lomarengas, via <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> en <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (partners zoals Suomikauppa en Nordicbuddies, via <span className="font-mono text-xs text-snow/80">jdt8.net</span> en <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (partners zoals EconomyBookings, via <span className="font-mono text-xs text-snow/80">tp.media</span> of <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) en Trip.com (partnerparameters op <span className="font-mono text-xs text-snow/80">trip.com</span>). Zo verdienen wij een kleine commissie wanneer u boekt, zonder extra kosten voor u.</>,
    cjDur: 'Duur: 30 dagen – 3 jaar (verschilt per partner)',
    gygBadge: 'Affiliate (GYG)',
    gygNote: 'Vereist toestemming',
    gygBody: (siteName) => `Met uw toestemming laadt deze site het partnerscript van GetYourGuide (GetYourGuide, Berlijn, EU; partner-ID VRMKD7N), dat ook de activiteitenwidgets toont. Het script plaatst de cookie visitor_id op getyourguide.com (cookie van derden, 400 dagen), de cookie session_id op het domein van deze site (tot het einde van de sessie) en de cookie __cf_bm op widget.getyourguide.com (minder dan 1 dag, geplaatst door het contentdistributienetwerk van GetYourGuide), en bewaart partner_id in de localStorage en gyg_visitor_id in de sessionStorage. GetYourGuide gebruikt ze om weergaven van en klikken op de widgets te tellen en boekingen toe te wijzen aan ${siteName}. Zonder uw toestemming werken de activiteitenlinks gewoon, en in dat geval plaatst getyourguide.com zijn eigen cookies pas wanneer u naar die site gaat. De boekingen zelf vinden plaats op getyourguide.com onder het eigen privacybeleid van GetYourGuide.`,
    gygDur: 'Duur: sessie – 400 dagen',
    lsBadge: 'localStorage',
    lsNote: 'Opgeslagen in uw browser, nooit naar een server verzonden',
    lsIntro: 'Kleine vermeldingen worden opgeslagen in de localStorage van uw browser om de site minder vervelend te maken, bijvoorbeeld:',
    lsConsentDesc: 'uw keuze (accepteren of weigeren)',
    lsLangDesc: 'Uw taalkeuze, zodat de site de volgende keer in dezelfde taal kan openen.',
    lsPopupDesc: 'een tijdstempel van wanneer u de nieuwsbrief-popup voor het laatst sloot of zich succesvol abonneerde, zodat we deze niet opnieuw tonen gedurende 7 dagen (of nooit, als u zich heeft geabonneerd)',
    lsTail: 'Technisch gezien is localStorage geen cookie. Wij vermelden het hier voor de transparantie. U kunt het wissen via de site-data-instellingen van uw browser.',
    tableTitle: 'Cookie-referentietabel',
    tableCookie: 'Cookie',
    tableType: 'Type',
    tablePurpose: 'Doel',
    tableDuration: 'Duur',
    tableRows: [],
    managingTitle: 'Uw cookievoorkeuren beheren',
    managing1: 'U kunt uw keuze op elk moment wijzigen of intrekken met de knop hieronder. Die wist uw opgeslagen keuze, de vermeldingen die partnerscripts in uw browser hebben opgeslagen en de cookies op het eigen domein van deze site, en laadt de pagina opnieuw zodat de toestemmingsbanner weer verschijnt. Cookies op domeinen van andere bedrijven, zoals getyourguide.com, verwijdert u via uw browserinstellingen. U kunt cookies ook volledig blokkeren in uw browser, maar dat kan de werking van de site beïnvloeden.',
    managing2: 'De meeste browsers laten u cookies bekijken, beheren en verwijderen. Raadpleeg de help-sectie van uw browser voor instructies.',
    withdrawButton: 'Cookiekeuze wijzigen',
    contactTitle: 'Contact',
    contactBody: (email) => <>Voor vragen over cookies of dit beleid kunt u contact met ons opnemen via {email}.</>,
    backToHome: '← Terug naar home',
    privacyLink: 'Privacybeleid →',
    typeEssential: 'Essentieel',
    typeEssentialLs: 'Essentieel (localStorage)',
    typeAnalytics: 'Analyse',
    typeAffiliateCj: 'Affiliate (netwerken)',
    typeAffiliateGyg: 'Affiliate (GetYourGuide)',
  },
  sv: {
    kicker: 'Juridik',
    h1: 'Cookiepolicy',
    lastUpdated: 'Senast uppdaterad: oktober 2026',
    whatAreTitle: 'Vad är cookies?',
    whatAreBody: 'Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. De hjälper webbplatser att komma ihåg dina inställningar och förstå hur du använder sidan. Du kan hantera cookies via dina webbläsarinställningar eller via vår samtyckesbanner.',
    cookiesWeUseTitle: 'Cookies vi använder',
    essentialBadge: 'Nödvändig',
    essentialNote: 'Alltid aktiv, kan inte inaktiveras',
    essentialBody: 'Webbplatsen behöver inga cookies för att fungera. Ditt val att acceptera eller avböja sparas i webbläsarens localStorage, inte i en cookie, så att vi inte behöver fråga dig vid varje besök.',
    essentialDur: 'Varaktighet: tills du rensar posten eller ändrar ditt val',
    analyticsBadge: 'Statistik',
    analyticsNote: 'Kräver samtycke',
    analyticsBody: 'Cookies från Google Analytics 4 hjälper oss att förstå hur besökare använder webbplatsen: vilka sidor som är populära, hur länge besökare stannar, vilken enhet de surfar med och varifrån de kommer (land- och stadsnivå). Vi samlar inte in namn, e-postadresser eller andra direkt identifierande uppgifter. Besökare särskiljs med en slumpmässig identifierare som sparas i en cookie.',
    analyticsDur: 'Varaktighet: 2 år',
    cjBadge: 'Affiliate',
    cjNote: 'Placeras av tredje part när du klickar på affiliatelänkar',
    cjBody: (siteName) => <>När du klickar på en boknings- eller affiliatelänk på {siteName} kan våra affiliatenätverk placera en spårningscookie eller lägga till en spårningsparameter i länken så att bokningen kan kopplas till {siteName}: Adtraction (partner som Sembo och Lomarengas, via <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> och <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (partner som Suomikauppa och Nordicbuddies, via <span className="font-mono text-xs text-snow/80">jdt8.net</span> och <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (partner som EconomyBookings, via <span className="font-mono text-xs text-snow/80">tp.media</span> eller <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) och Trip.com (partnerparametrar på <span className="font-mono text-xs text-snow/80">trip.com</span>). Så tjänar vi en liten provision när du bokar, utan extra kostnad för dig.</>,
    cjDur: 'Varaktighet: 30 dagar – 3 år (varierar per partner)',
    gygBadge: 'Affiliate (GYG)',
    gygNote: 'Kräver samtycke',
    gygBody: (siteName) => `Med ditt samtycke laddar webbplatsen GetYourGuides partnerskript (GetYourGuide, Berlin, EU; partner-ID VRMKD7N), som också visar aktivitetswidgetarna. Skriptet sparar cookien visitor_id på getyourguide.com (tredjepartscookie, 400 dagar), cookien session_id på den här webbplatsens domän (tills sessionen tar slut) och cookien __cf_bm på widget.getyourguide.com (mindre än 1 dag, satt av GetYourGuides nätverk för innehållsleverans) samt partner_id i localStorage och gyg_visitor_id i sessionStorage. GetYourGuide använder dem för att räkna visningar av och klick på widgetarna och för att koppla bokningar till ${siteName}. Utan ditt samtycke fungerar aktivitetslänkarna ändå, och i så fall sätter getyourguide.com sina egna cookies först när du går till deras webbplats. Bokningarna görs på getyourguide.com enligt deras integritetspolicy.`,
    gygDur: 'Varaktighet: session – 400 dagar',
    lsBadge: 'localStorage',
    lsNote: 'Lagras i din webbläsare, skickas aldrig till en server',
    lsIntro: 'Små poster lagras i din webbläsares localStorage för att göra webbplatsen mindre irriterande, till exempel:',
    lsConsentDesc: 'ditt val att acceptera/avböja',
    lsLangDesc: 'Ditt språkval, så att webbplatsen kan öppnas på samma språk nästa gång.',
    lsPopupDesc: 'en tidsstämpel för när du senast stängde eller framgångsrikt prenumererade via nyhetsbrevets popup, så att vi inte visar den igen på 7 dagar (eller aldrig, om du prenumererade)',
    lsTail: 'localStorage är tekniskt sett ingen cookie. Vi listar den här av transparensskäl. Du kan rensa den via webbläsarens inställningar för webbplatsdata.',
    tableTitle: 'Cookiereferenstabell',
    tableCookie: 'Cookie',
    tableType: 'Typ',
    tablePurpose: 'Syfte',
    tableDuration: 'Varaktighet',
    tableRows: [],
    managingTitle: 'Hantera dina cookieinställningar',
    managing1: 'Du kan ändra eller återkalla ditt val när som helst med knappen nedan. Den raderar ditt sparade val, de poster som partnerskript har sparat i webbläsaren och de cookies som har satts på webbplatsens egen domän och laddar sedan om sidan, så att samtyckesbannern visas igen. Cookies på andra företags domäner, till exempel getyourguide.com, raderar du i webbläsarens inställningar. Du kan också blockera cookies helt i webbläsaren, även om det kan påverka hur webbplatsen fungerar.',
    managing2: 'De flesta webbläsare låter dig visa, hantera och radera cookies. Se din webbläsares hjälpavsnitt för instruktioner.',
    withdrawButton: 'Ändra cookieval',
    contactTitle: 'Kontakt',
    contactBody: (email) => <>Har du frågor om cookies eller denna policy, kontakta oss på {email}.</>,
    backToHome: '← Tillbaka till startsidan',
    privacyLink: 'Integritetspolicy →',
    typeEssential: 'Nödvändig',
    typeEssentialLs: 'Nödvändig (localStorage)',
    typeAnalytics: 'Statistik',
    typeAffiliateCj: 'Affiliate (nätverk)',
    typeAffiliateGyg: 'Affiliate (GetYourGuide)',
  },
};

/**
 * Suostumuksen peruminen tai muuttaminen evastesivun napista.
 *
 * Valinta on localStoragessa eika evasteessa, joten aiempi ohje ("tyhjenna sivuston evasteet") ei palauttanut banneria.
 * Poistetaan valinta, portitettujen palveluiden omat tallenteet (GetYourGuide, lentohaun Travelpayouts) ja sivuston
 * omaan domainiin asetetut seurantaevasteet (GA4, Clarity, GYG session_id, lentohaun tpwl_* ja Snowplow _sp_*),
 * suljetaan Google Consent Mode ja ladataan sivu uudelleen: kerran ladattua kolmannen osapuolen skriptia ei voi
 * pysayttaa, joten vain uusi lataus palauttaa sivun tilaan ilman niita, ja banneri nakyy taas.
 * Kolmansien osapuolten domainien evasteita (getyourguide.com, avsplow.com) selain ei anna poistaa taalta.
 * Malli: laplandgifts src/lib/consent.ts withdrawConsent().
 */
function withdrawConsent(siteId: string): void {
  for (const k of [`${siteId}_cookie_consent`, 'partner_id', 'snowplowOutQueue_sp', '__wlcc']) {
    try { window.localStorage.removeItem(k); } catch { /* estetty tallennus */ }
  }
  for (const k of ['gyg_visitor_id', '__wlft', '__wlrt']) {
    try { window.sessionStorage.removeItem(k); } catch { /* estetty tallennus */ }
  }
  const fixed = ['_ga', '_gid', '_clck', '_clsk', 'session_id', 'tpwl_locale', 'tpwl_currency'];
  const names = new Set(fixed);
  try {
    for (const part of document.cookie.split(';')) {
      const n = part.split('=')[0].trim();
      if (n.startsWith('_ga_') || n.startsWith('_sp_id.') || n.startsWith('_sp_ses.')) names.add(n);
    }
  } catch { /* evasteet estetty */ }
  const host = window.location.hostname;
  const domains = ['', `; domain=.${host}`];
  if (host.startsWith('www.')) domains.push(`; domain=.${host.slice(4)}`);
  for (const n of names) {
    for (const d of domains) {
      try { document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`; } catch { /* ohitetaan */ }
    }
  }
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  } catch { /* gtag ei ladattu */ }
  window.location.reload();
}

export default function CookieContent({
  siteId = 'laplandvibes',
  siteName = 'LaplandVibes',
  lang = 'en',
  sessionRecording = false,
  flightSearch = false,
}: CookieContentProps) {
  const t = COPY[lang] ?? COPY.en;
  const rec = SESSION_RECORDING[lang] ?? SESSION_RECORDING.en;
  const fl = FLIGHT_SEARCH[lang] ?? FLIGHT_SEARCH.en;
  const consentKey = `${siteId}_cookie_consent`;
  const popupKey = `${siteId}_newsletter_popup`;
  /* Label/description separator. ja + zh-CN take the fullwidth colon with no space; fr puts a no-break
     space before the colon, as every fr string in this file does ("Durée : 1 an"); ko uses the halfwidth one. */
  const cjk = lang === 'ja' || lang === 'zh-CN';
  const sep = cjk ? '：' : lang === 'fr' ? '\u00a0:' : ':';
  const gap = cjk ? '' : ' ';

  const purposeStrings: Record<Lang, { consent: string; popup: string; gaUser: string; gaSession: string; cj: string; gyg: string }> = {
    en: {
      consent: 'Stores your cookie consent preference (accepted/declined)',
      popup: 'Remembers whether you dismissed or subscribed to the newsletter popup, so we do not show it again',
      gaUser: 'Google Analytics: distinguishes unique users',
      gaSession: 'Google Analytics: maintains session state',
      cj: 'Adtraction, Daisycon, Travelpayouts and Trip.com: attribute referral commissions when you click affiliate links. Set by the network or by the partner on its own domain, e.g. do.sembo.fi, jdt8.net, economybookings.com or trip.com',
      gyg: 'GetYourGuide partner script (only after consent): counts widget views and clicks and attributes bookings to the site',
    },
    fi: {
      consent: 'Tallentaa evästeiden suostumusvalintasi (hyväksytty/hylätty)',
      popup: 'Muistaa, suljitko vai tilasitko uutiskirjeen ponnahdusikkunan, jotta emme näytä sitä uudelleen',
      gaUser: 'Google Analytics: erottaa yksittäiset käyttäjät',
      gaSession: 'Google Analytics: ylläpitää istuntotilaa',
      cj: 'Adtraction, Daisycon, Travelpayouts ja Trip.com: kohdistavat kumppanikomissiot, kun klikkaat kumppanilinkkiä. Verkosto tai kumppani asettaa evästeen omalle domainilleen (esimerkiksi do.sembo.fi, jdt8.net, economybookings.com tai trip.com)',
      gyg: 'GetYourGuiden kumppaniskripti (vain suostumuksella): laskee widgettien näytöt ja klikkaukset ja kohdistaa varaukset sivustolle',
    },
    de: {
      consent: 'Speichert Ihre Cookie-Einwilligungswahl (akzeptiert/abgelehnt)',
      popup: 'Merkt sich, ob Sie das Newsletter-Popup geschlossen oder abonniert haben, damit es nicht erneut erscheint',
      gaUser: 'Google Analytics: unterscheidet einzelne Nutzer',
      gaSession: 'Google Analytics: verwaltet den Sitzungsstatus',
      cj: 'Adtraction, Daisycon, Travelpayouts und Trip.com: ordnen Provisionen zu, wenn Sie auf Partnerlinks klicken. Vom Netzwerk oder vom Partner auf der eigenen Domain gesetzt, z. B. do.sembo.fi, jdt8.net, economybookings.com oder trip.com',
      gyg: 'Partnerskript von GetYourGuide (nur mit Einwilligung): zählt Aufrufe und Klicks der Widgets und ordnet Buchungen der Website zu',
    },
    ja: {
      consent: 'クッキー同意の選択（同意/拒否）を保存します',
      popup: 'ニュースレターポップアップを閉じたか登録したかを記憶し、再表示しないようにします',
      gaUser: 'Google Analytics：個別ユーザーを識別',
      gaSession: 'Google Analytics：セッション状態を管理',
      cj: 'Adtraction、Daisycon、Travelpayouts、Trip.com：アフィリエイトリンクをクリックした際に紹介料を帰属させます。ネットワークまたはパートナーが自社のドメインに設定します（例：do.sembo.fi、jdt8.net、economybookings.com、trip.com）',
      gyg: 'GetYourGuide のパートナースクリプト（同意後のみ）：ウィジェットの表示回数とクリック数を数え、予約をサイトに帰属させます',
    },
    es: {
      consent: 'Almacena su preferencia de consentimiento de cookies (aceptado/rechazado)',
      popup: 'Recuerda si cerró o se suscribió al popup del boletín para no mostrárselo de nuevo',
      gaUser: 'Google Analytics: distingue usuarios únicos',
      gaSession: 'Google Analytics: mantiene el estado de la sesión',
      cj: 'Adtraction, Daisycon, Travelpayouts y Trip.com: atribuyen las comisiones de afiliados cuando hace clic en enlaces de afiliados. Las establece la red o el socio en su propio dominio, por ejemplo do.sembo.fi, jdt8.net, economybookings.com o trip.com',
      gyg: 'Script de afiliado de GetYourGuide (solo con consentimiento): cuenta las visualizaciones y los clics de los widgets y atribuye las reservas al sitio',
    },
    'pt-BR': {
      consent: 'Armazena sua preferência de consentimento de cookies (aceito/recusado)',
      popup: 'Lembra se você fechou ou se inscreveu no popup do boletim, para não exibi-lo novamente',
      gaUser: 'Google Analytics: distingue usuários únicos',
      gaSession: 'Google Analytics: mantém o estado da sessão',
      cj: 'Adtraction, Daisycon, Travelpayouts e Trip.com: atribuem as comissões de afiliados quando você clica em links de afiliados. Definidos pela rede ou pelo parceiro no próprio domínio, por exemplo do.sembo.fi, jdt8.net, economybookings.com ou trip.com',
      gyg: 'Script de parceiro do GetYourGuide (só com consentimento): conta as exibições e os cliques dos widgets e atribui as reservas ao site',
    },
    'zh-CN': {
      consent: '保存您的 Cookie 同意偏好（已接受/已拒绝）',
      popup: '记住您是否关闭或订阅了电子简报弹窗，以避免重复显示',
      gaUser: 'Google Analytics：区分独立用户',
      gaSession: 'Google Analytics：维护会话状态',
      cj: 'Adtraction、Daisycon、Travelpayouts 与 Trip.com：当您点击联盟链接时归因佣金。由联盟网络或合作伙伴在其自有域名上设置，例如 do.sembo.fi、jdt8.net、economybookings.com 或 trip.com',
      gyg: 'GetYourGuide 合作伙伴脚本（仅在同意后）：统计小组件的展示和点击次数，并将预订归因于本网站',
    },
    ko: {
      consent: '귀하의 쿠키 동의 설정(수락/거부)을 저장',
      popup: '뉴스레터 팝업을 닫았거나 구독했는지 기억하여 다시 표시하지 않음',
      gaUser: 'Google Analytics: 고유 사용자 구분',
      gaSession: 'Google Analytics: 세션 상태 유지',
      cj: 'Adtraction, Daisycon, Travelpayouts, Trip.com: 제휴 링크 클릭 시 추천 수수료 귀속. 네트워크 또는 파트너가 자체 도메인에 설정(예: do.sembo.fi, jdt8.net, economybookings.com, trip.com)',
      gyg: 'GetYourGuide 파트너 스크립트(동의 후에만): 위젯 노출 수와 클릭 수 집계 및 예약의 사이트 귀속',
    },
    fr: {
      consent: 'Stocke votre préférence de consentement aux cookies (accepté/refusé)',
      popup: 'Mémorise si vous avez fermé ou souscrit au popup de la newsletter, afin de ne pas le réafficher',
      gaUser: 'Google Analytics : distingue les utilisateurs uniques',
      gaSession: 'Google Analytics : maintient l\'état de session',
      cj: 'Adtraction, Daisycon, Travelpayouts et Trip.com : attribuent les commissions d\'affiliation lorsque vous cliquez sur des liens d\'affiliation. Déposés par le réseau ou par le partenaire sur son propre domaine, par exemple do.sembo.fi, jdt8.net, economybookings.com ou trip.com',
      gyg: 'Script partenaire de GetYourGuide (uniquement avec consentement) : compte les affichages et les clics des widgets et attribue les réservations au site',
    },
    it: {
      consent: 'Memorizza la Sua preferenza di consenso ai cookie (accettato/rifiutato)',
      popup: 'Ricorda se Lei ha chiuso o si è iscritto al popup della newsletter, per non mostrarlo di nuovo',
      gaUser: 'Google Analytics: distingue gli utenti unici',
      gaSession: 'Google Analytics: mantiene lo stato della sessione',
      cj: 'Adtraction, Daisycon, Travelpayouts e Trip.com: attribuiscono le commissioni di affiliazione quando si clicca sui link di affiliazione. Impostati dalla rete o dal partner sul proprio dominio, ad esempio do.sembo.fi, jdt8.net, economybookings.com o trip.com',
      gyg: 'Script partner di GetYourGuide (solo con consenso): conta le visualizzazioni e i clic dei widget e attribuisce le prenotazioni al sito',
    },
    nl: {
      consent: 'Slaat uw cookie-toestemmingsvoorkeur op (geaccepteerd/geweigerd)',
      popup: 'Onthoudt of u de nieuwsbrief-popup heeft gesloten of zich heeft geabonneerd, om deze niet opnieuw te tonen',
      gaUser: 'Google Analytics: onderscheidt unieke gebruikers',
      gaSession: 'Google Analytics: houdt de sessiestatus bij',
      cj: 'Adtraction, Daisycon, Travelpayouts en Trip.com: wijzen affiliatecommissies toe wanneer u op affiliatelinks klikt. Geplaatst door het netwerk of door de partner op het eigen domein, bijvoorbeeld do.sembo.fi, jdt8.net, economybookings.com of trip.com',
      gyg: 'Partnerscript van GetYourGuide (alleen met toestemming): telt weergaven van en klikken op de widgets en wijst boekingen toe aan de site',
    },
    sv: {
      consent: 'Lagrar ditt val av cookiesamtycke (accepterat/avböjt)',
      popup: 'Kommer ihåg om du stängde eller prenumererade via nyhetsbrevets popup, så att vi inte visar den igen',
      gaUser: 'Google Analytics: särskiljer unika användare',
      gaSession: 'Google Analytics: upprätthåller sessionstillstånd',
      cj: 'Adtraction, Daisycon, Travelpayouts och Trip.com: attribuerar hänvisningsprovisioner när du klickar på affiliatelänkar. Placeras av nätverket eller av partnern på den egna domänen, till exempel do.sembo.fi, jdt8.net, economybookings.com eller trip.com',
      gyg: 'GetYourGuides partnerskript (endast med samtycke): räknar visningar av och klick på widgetarna och kopplar bokningar till webbplatsen',
    },
  };
  const p = purposeStrings[lang] ?? purposeStrings.en;

  const durStrings: Record<Lang, { oneYear: string; oneDay: string; cjDur: string; gygDur: string; popupDur: string; gaDur: string; untilCleared: string }> = {
    en: { oneYear: '1 year', oneDay: '1 day', cjDur: 'Varies (30 days – 3 years)', gygDur: 'Session–400 days', popupDur: '7 days (dismissed) / persistent (subscribed)', gaDur: '2 years', untilCleared: 'Until you clear it or change your choice' },
    fi: { oneYear: '1 vuosi', oneDay: '1 päivä', cjDur: 'Vaihtelee (30 päivää – 3 vuotta)', gygDur: 'Istunto–400 päivää', popupDur: '7 päivää (suljettu) / pysyvä (tilattu)', gaDur: '2 vuotta', untilCleared: 'Kunnes tyhjennät sen tai muutat valintaasi' },
    de: { oneYear: '1 Jahr', oneDay: '1 Tag', cjDur: 'Variabel (30 Tage – 3 Jahre)', gygDur: 'Sitzung–400 Tage', popupDur: '7 Tage (geschlossen) / dauerhaft (abonniert)', gaDur: '2 Jahre', untilCleared: 'Bis Sie den Eintrag löschen oder Ihre Auswahl ändern' },
    ja: { oneYear: '1年', oneDay: '1日', cjDur: '変動（30日〜3年）', gygDur: 'セッション〜400日', popupDur: '7日（閉じた場合）/永続（登録した場合）', gaDur: '2年', untilCleared: '削除するか選択を変更するまで' },
    es: { oneYear: '1 año', oneDay: '1 día', cjDur: 'Variable (30 días – 3 años)', gygDur: 'Sesión–400 días', popupDur: '7 días (cerrado) / persistente (suscrito)', gaDur: '2 años', untilCleared: 'Hasta que la borre o cambie su elección' },
    'pt-BR': { oneYear: '1 ano', oneDay: '1 dia', cjDur: 'Variável (30 dias – 3 anos)', gygDur: 'Sessão–400 dias', popupDur: '7 dias (fechado) / persistente (inscrito)', gaDur: '2 anos', untilCleared: 'Até você limpá-la ou mudar sua escolha' },
    'zh-CN': { oneYear: '1年', oneDay: '1天', cjDur: '不等（30天至3年）', gygDur: '会话期间至400天', popupDur: '7天（关闭后）/永久（订阅后）', gaDur: '2年', untilCleared: '直到您将其清除或更改选择' },
    ko: { oneYear: '1년', oneDay: '1일', cjDur: '변동(30일~3년)', gygDur: '세션~400일', popupDur: '7일(닫힘)/영구(구독)', gaDur: '2년', untilCleared: '삭제하시거나 선택을 변경하실 때까지' },
    fr: { oneYear: '1 an', oneDay: '1 jour', cjDur: 'Variable (30 jours – 3 ans)', gygDur: 'Session–400 jours', popupDur: '7 jours (fermé) / persistant (abonné)', gaDur: '2 ans', untilCleared: "Jusqu'à ce que vous l'effaciez ou modifiiez votre choix" },
    it: { oneYear: '1 anno', oneDay: '1 giorno', cjDur: 'Variabile (30 giorni – 3 anni)', gygDur: 'Sessione–400 giorni', popupDur: '7 giorni (chiuso) / persistente (iscritto)', gaDur: '2 anni', untilCleared: 'Finché non la cancella o non modifica la Sua scelta' },
    nl: { oneYear: '1 jaar', oneDay: '1 dag', cjDur: 'Variabel (30 dagen – 3 jaar)', gygDur: 'Sessie–400 dagen', popupDur: '7 dagen (gesloten) / blijvend (geabonneerd)', gaDur: '2 jaar', untilCleared: 'Totdat u deze wist of uw keuze wijzigt' },
    sv: { oneYear: '1 år', oneDay: '1 dag', cjDur: 'Varierar (30 dagar – 3 år)', gygDur: 'Session–400 dagar', popupDur: '7 dagar (stängd) / bestående (prenumererad)', gaDur: '2 år', untilCleared: 'Tills du rensar posten eller ändrar ditt val' },
  };
  const d = durStrings[lang] ?? durStrings.en;

  const cookieTable = [
    { name: consentKey, type: t.typeEssentialLs, purpose: p.consent, duration: d.untilCleared },
    { name: popupKey, type: t.typeEssentialLs, purpose: p.popup, duration: d.popupDur },
    { name: '_ga', type: t.typeAnalytics, purpose: p.gaUser, duration: d.gaDur },
    { name: '_ga_*', type: t.typeAnalytics, purpose: p.gaSession, duration: d.gaDur },
    ...(sessionRecording
      ? [
          { name: '_clck', type: t.typeAnalytics, purpose: rec.clarityUser, duration: d.oneYear },
          { name: '_clsk', type: t.typeAnalytics, purpose: rec.claritySession, duration: d.oneDay },
        ]
      : []),
    { name: 'at_gd, dci, btagClickId, Union, …', type: t.typeAffiliateCj, purpose: p.cj, duration: d.cjDur },
    { name: 'visitor_id, session_id, __cf_bm, partner_id, gyg_visitor_id', type: t.typeAffiliateGyg, purpose: p.gyg, duration: d.gygDur },
    ...(flightSearch
      ? [
          { name: 'tpwl_locale, tpwl_currency', type: fl.badge, purpose: fl.pPrefs, duration: fl.d365 },
          { name: '_sp_id.*', type: fl.badge, purpose: fl.pStats, duration: fl.d400 },
          { name: '_sp_ses.*', type: fl.badge, purpose: fl.pStats, duration: fl.dUnderDay },
          { name: 'nuid', type: fl.badge, purpose: fl.pNuid, duration: fl.d365 },
          { name: 'snowplowOutQueue_sp, __wlcc, __wlft, __wlrt', type: fl.badge, purpose: fl.pStorage, duration: fl.dStorage },
        ]
      : []),
  ];

  const email = <a href="mailto:info@laplandvibes.com" className="text-vibe-pink">info@laplandvibes.com</a>;

  return (
    <div className="min-h-screen bg-deep-night pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-vibe-pink text-sm font-semibold tracking-[0.2em] uppercase mb-4">{t.kicker}</p>
        <h1 className="font-heading font-semibold text-4xl sm:text-5xl md:text-6xl text-snow tracking-wide leading-tight mb-2 break-words">{t.h1}</h1>
        <p className="text-snow/70 text-sm mb-10">{t.lastUpdated}</p>

        <div className="space-y-8 text-snow/60 leading-relaxed">

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.whatAreTitle}</h2>
            <p>{t.whatAreBody}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.cookiesWeUseTitle}</h2>

            <div className="mt-4 space-y-4">
              {/* Essential */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(0,47,108,0.18)', border: '1px solid rgba(0,47,108,0.40)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">{t.essentialBadge}</span>
                  <span className="text-snow/80 font-medium text-sm">{t.essentialNote}</span>
                </div>
                <p className="text-sm">{t.essentialBody}</p>
                <p className="text-xs text-snow/70 mt-2 font-mono">{consentKey} · {t.essentialDur}</p>
              </div>

              {/* Analytics */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(0,47,108,0.12)', border: '1px solid rgba(0,47,108,0.30)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{t.analyticsBadge}</span>
                  <span className="text-snow/80 font-medium text-sm">{t.analyticsNote}</span>
                </div>
                <p className="text-sm">{t.analyticsBody}</p>
                <p className="text-xs text-snow/70 mt-2 font-mono">_ga, _ga_* · {t.analyticsDur}</p>
              </div>

              {/* Istuntotallennus — vain sivustoilla joilla Clarity on asennettuna */}
              {sessionRecording && (
                <div className="rounded-xl p-5" style={{ background: 'rgba(0,47,108,0.12)', border: '1px solid rgba(0,47,108,0.30)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{t.analyticsBadge}</span>
                    <span className="text-snow/80 font-medium text-sm">{t.analyticsNote}</span>
                  </div>
                  <p className="text-sm">{rec.recordingBody}</p>
                  <p className="text-xs text-snow/70 mt-2 font-mono">_clck · {rec.recordingDur}</p>
                  <p className="text-xs text-snow/70 mt-1 font-mono">_clsk · {rec.recordingSessionDur}</p>
                </div>
              )}

              {/* Affiliate, partner networks */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(0,47,108,0.12)', border: '1px solid rgba(0,47,108,0.30)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="shrink-0 whitespace-nowrap text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">{t.cjBadge}</span>
                  <span className="text-snow/80 font-medium text-sm">{t.cjNote}</span>
                </div>
                <p className="text-sm">{t.cjBody(siteName)}</p>
                <p className="text-xs text-snow/70 mt-2 font-mono">at_gd, dci, btagClickId, Union, … · {t.cjDur}</p>
              </div>

              {/* Affiliate, GetYourGuide */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(0,47,108,0.12)', border: '1px solid rgba(0,47,108,0.30)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="shrink-0 whitespace-nowrap text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">{t.gygBadge}</span>
                  <span className="text-snow/80 font-medium text-sm">{t.gygNote}</span>
                </div>
                <p className="text-sm">{t.gygBody(siteName)}</p>
                <p className="text-xs text-snow/70 mt-2 font-mono">visitor_id, session_id, __cf_bm, partner_id, gyg_visitor_id · {t.gygDur}</p>
              </div>

              {/* Lentohaku (Travelpayouts), vain laplandflights.fi */}
              {flightSearch && (
                <div className="rounded-xl p-5" style={{ background: 'rgba(0,47,108,0.12)', border: '1px solid rgba(0,47,108,0.30)' }}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{fl.badge}</span>
                    <span className="text-snow/80 font-medium text-sm">{t.analyticsNote}</span>
                  </div>
                  <p className="text-sm">{fl.body}</p>
                  <p className="text-xs text-snow/70 mt-2 font-mono">tpwl_locale, tpwl_currency, _sp_id.*, _sp_ses.*, nuid · {fl.dur}</p>
                </div>
              )}

              {/* localStorage */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(0,47,108,0.08)', border: '1px solid rgba(0,47,108,0.25)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">{t.lsBadge}</span>
                  <span className="text-snow/80 font-medium text-sm">{t.lsNote}</span>
                </div>
                <p className="text-sm">{t.lsIntro}</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li><span className="font-mono text-xs text-snow/80">{consentKey}</span>{sep}{gap}{t.lsConsentDesc}</li>
                  <li><span className="font-mono text-xs text-snow/80">{popupKey}</span>{sep}{gap}{t.lsPopupDesc}</li>
                  <li>{t.lsLangDesc}</li>
                </ul>
                <p className="text-xs text-snow/70 mt-3">{t.lsTail}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.tableTitle}</h2>
            {/* Alle sm: pinotut lohkot. Nelisarakkeinen taulukko oli 769 px
                343 px:n kääreessä (auditti 4.8., 147 osumaa 13 sivustolla):
                Tarkoitus+Kesto jäivät ruudun ulkopuolelle ja näkymättömiin
                rivittynyt sarake määräsi ~300 px:n rivikorkeudet. */}
            <div className="sm:hidden space-y-3">
              {cookieTable.map((row) => (
                <div key={row.name} className="rounded-lg border border-white/10 p-3">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <span className="font-mono text-xs text-snow/80 break-all">{row.name}</span>
                    <span className="text-xs text-snow/60 shrink-0">{row.type}</span>
                  </div>
                  <p className="text-sm text-snow/60 mt-1">{row.purpose}</p>
                  <p className="text-xs text-snow/70 mt-1">{t.tableDuration}{sep}{gap}{row.duration}</p>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <th className="text-left py-2 pr-4 text-snow/80 font-semibold">{t.tableCookie}</th>
                    <th className="text-left py-2 pr-4 text-snow/80 font-semibold">{t.tableType}</th>
                    <th className="text-left py-2 pr-4 text-snow/80 font-semibold">{t.tablePurpose}</th>
                    <th className="text-left py-2 text-snow/80 font-semibold">{t.tableDuration}</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTable.map((row) => (
                    <tr key={row.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <td className="py-2 pr-4 font-mono text-xs text-snow/70 align-top">{row.name}</td>
                      <td className="py-2 pr-4 text-snow/60 align-top whitespace-nowrap">{row.type}</td>
                      <td className="py-2 pr-4 text-snow/60 align-top">{row.purpose}</td>
                      <td className="py-2 text-snow/60 align-top">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.managingTitle}</h2>
            <p>{t.managing1}</p>
            <button
              type="button"
              onClick={() => withdrawConsent(siteId)}
              className="mt-4 inline-flex min-h-11 items-center rounded-full border border-vibe-pink/60 px-5 py-2.5 text-sm font-medium text-vibe-pink transition-colors hover:bg-vibe-pink/10 hover:text-pink-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibe-pink"
            >
              {t.withdrawButton}
            </button>
            <p className="mt-4">{t.managing2}</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-snow tracking-wide mb-3">{t.contactTitle}</h2>
            <p>{t.contactBody(email)}</p>
          </section>

        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to={localePath('/', lang)} className="text-vibe-pink hover:text-pink-300 no-underline font-medium">{t.backToHome}</Link>
          <Link to={localePath('/privacy', lang)} className="text-snow/75 hover:text-snow no-underline font-medium">{t.privacyLink}</Link>
        </div>
      </div>
    </div>
  );
}

/**
 * @harvest-stop — esirenderöinnin haravointi loppuu tähän.
 *
 * Kaikki tämän alapuolella oleva on ehdollista tekstiä: `sessionRecording` (Microsoft Clarity), jota näyttää vain
 * sivusto, joka oikeasti lataa Clarityn (hubi), ja `flightSearch` (Travelpayouts-lentohaku, vain laplandflights.fi).
 * Crawlable-body-haravoija lukee tiedostosta JOKAISEN
 * kielilohkon ja leikkaa tämän merkin kohdalta. Kun nämä tekstit olivat COPY-kielilohkoissa, ne
 * päätyivät myös muiden sivustojen staattiseen evästesivuun, vaikka sivusto ei käytä Claritya
 * (mitattu tuotannosta 5.10.2026: evästesivu 21 sivustolla, tietosuojasivu nightlife ja tours).
 * Ehdollinen teksti kuuluu tämän merkin alle, ei COPY:yn. Merkkijonoa ei saa mainita tiedostossa
 * aiemmin: haravoija leikkaa ENSIMMÄISESTÄ osumasta.
 */
interface SessionRecordingCookieCopy {
  /** Istuntotallennuslohkon kuvaus. */
  recordingBody: string;
  /** _clck: Clarityn käyttäjätunniste, 1 vuosi. */
  recordingDur: string;
  /** _clsk: kokoaa sivunäytöt yhdeksi istunnoksi, 1 päivä. */
  recordingSessionDur: string;
  /** Evästetaulukon _clck-rivin tarkoitus. */
  clarityUser: string;
  /** Evästetaulukon _clsk-rivin tarkoitus. */
  claritySession: string;
}

const SESSION_RECORDING: Record<Lang, SessionRecordingCookieCopy> = {
  en: {
    recordingBody: 'Microsoft Clarity records a replay of the visit (mouse movement, clicks and scrolling) and builds heatmaps from it, so we can see which parts of a page confuse people. We do not connect the recordings to your name or use them for advertising. Visits from the same browser are linked to each other by a random ID stored in a cookie. How Microsoft itself may use the data is explained in our Privacy Policy.',
    recordingDur: 'Duration: 1 year',
    recordingSessionDur: 'Duration: 1 day',
    clarityUser: 'Microsoft Clarity: links visits from the same browser',
    claritySession: 'Microsoft Clarity: joins page views into one session recording',
  },
  fi: {
    recordingBody: 'Microsoft Clarity tallentaa käynnistä toiston (hiiren liikkeet, klikkaukset ja vieritys) ja muodostaa niistä lämpökarttoja, jotta näemme, mitkä kohdat sivusta hämmentävät kävijää. Emme liitä tallenteita nimeesi emmekä käytä niitä mainontaan. Samasta selaimesta tehdyt käynnit yhdistetään toisiinsa evästeessä olevalla satunnaisella tunnisteella. Tietosuojaselosteessamme kerrotaan, miten Microsoft voi itse käyttää tietoja.',
    recordingDur: 'Kesto: 1 vuosi',
    recordingSessionDur: 'Kesto: 1 päivä',
    clarityUser: 'Microsoft Clarity: yhdistää samasta selaimesta tehdyt käynnit',
    claritySession: 'Microsoft Clarity: kokoaa sivunäytöt yhdeksi istuntotallenteeksi',
  },
  de: {
    recordingBody: 'Microsoft Clarity zeichnet den Verlauf des Besuchs auf (Mausbewegungen, Klicks und Scrollen) und erstellt daraus Heatmaps, damit wir erkennen, welche Stellen einer Seite verwirren. Wir ordnen die Aufzeichnungen nicht Ihrem Namen zu und nutzen sie nicht für Werbung. Besuche aus demselben Browser werden über eine zufällige Kennung in einem Cookie miteinander verknüpft. Wie Microsoft die Daten selbst nutzen darf, erklärt unsere Datenschutzerklärung.',
    recordingDur: 'Dauer: 1 Jahr',
    recordingSessionDur: 'Dauer: 1 Tag',
    clarityUser: 'Microsoft Clarity: verknüpft Besuche aus demselben Browser',
    claritySession: 'Microsoft Clarity: fasst Seitenaufrufe zu einer Sitzungsaufzeichnung zusammen',
  },
  ja: {
    recordingBody: 'Microsoft Clarity は、マウスの動き、クリック、スクロールを記録し、そこからヒートマップを作成します。これにより、ページのどの部分が分かりにくいかを把握できます。当方は記録をお客様の氏名と結び付けることはなく、広告にも使用しません。同じブラウザからの訪問は、クッキーに保存されたランダムな識別子で互いに関連付けられます。Microsoft 自身によるデータの利用については、プライバシーポリシーで説明しています。',
    recordingDur: '保存期間：1年',
    recordingSessionDur: '保存期間：1日',
    clarityUser: 'Microsoft Clarity：同じブラウザからの訪問を関連付け',
    claritySession: 'Microsoft Clarity：ページビューを一つのセッション記録に統合',
  },
  es: {
    recordingBody: 'Microsoft Clarity graba una reproducción de la visita (movimiento del ratón, clics y desplazamiento) y crea mapas de calor a partir de ella, para ver qué partes de una página confunden. No asociamos las grabaciones a su nombre ni las usamos con fines publicitarios. Las visitas desde el mismo navegador se vinculan entre sí mediante un identificador aleatorio guardado en una cookie. Nuestra Política de Privacidad explica cómo Microsoft puede usar los datos por cuenta propia.',
    recordingDur: 'Duración: 1 año',
    recordingSessionDur: 'Duración: 1 día',
    clarityUser: 'Microsoft Clarity: vincula las visitas desde el mismo navegador',
    claritySession: 'Microsoft Clarity: une las páginas vistas en una sola grabación de sesión',
  },
  'pt-BR': {
    recordingBody: 'O Microsoft Clarity grava uma reprodução da visita (movimento do mouse, cliques e rolagem) e cria mapas de calor a partir dela, para vermos quais partes da página confundem. Não associamos as gravações ao seu nome nem as usamos para publicidade. As visitas feitas no mesmo navegador são vinculadas entre si por um identificador aleatório guardado em um cookie. Nossa Política de Privacidade explica como a própria Microsoft pode usar os dados.',
    recordingDur: 'Duração: 1 ano',
    recordingSessionDur: 'Duração: 1 dia',
    clarityUser: 'Microsoft Clarity: vincula as visitas feitas no mesmo navegador',
    claritySession: 'Microsoft Clarity: reúne as visualizações de página em uma única gravação de sessão',
  },
  'zh-CN': {
    recordingBody: 'Microsoft Clarity 会记录访问过程中的鼠标移动、点击和滚动，并据此生成热图，帮助我们了解页面的哪些部分让人困惑。我们不会将记录与您的姓名关联，也不会将其用于广告。同一浏览器的多次访问会通过 Cookie 中的随机标识符相互关联。关于 Microsoft 自身可能如何使用这些数据，请参阅我们的隐私政策。',
    recordingDur: '保留期限：1年',
    recordingSessionDur: '保留期限：1天',
    clarityUser: 'Microsoft Clarity：关联同一浏览器的多次访问',
    claritySession: 'Microsoft Clarity：将多次页面浏览合并为一次会话记录',
  },
  ko: {
    recordingBody: 'Microsoft Clarity는 마우스 움직임, 클릭, 스크롤을 기록하고 이를 바탕으로 히트맵을 만듭니다. 이를 통해 페이지의 어느 부분이 혼란을 주는지 파악합니다. 당사는 기록을 귀하의 이름과 연결하지 않으며 광고에 사용하지 않습니다. 같은 브라우저에서 이루어진 방문은 쿠키에 저장된 임의의 식별자로 서로 연결됩니다. Microsoft가 자체적으로 데이터를 어떻게 사용할 수 있는지는 개인정보 처리방침에서 설명합니다.',
    recordingDur: '보관 기간: 1년',
    recordingSessionDur: '보관 기간: 1일',
    clarityUser: 'Microsoft Clarity: 같은 브라우저의 방문을 서로 연결',
    claritySession: 'Microsoft Clarity: 페이지뷰를 하나의 세션 기록으로 통합',
  },
  fr: {
    recordingBody: 'Microsoft Clarity enregistre une relecture de la visite (mouvements de souris, clics et défilement) et en tire des cartes de chaleur, afin de voir quelles parties d’une page prêtent à confusion. Nous ne rattachons pas les enregistrements à votre nom et ne les utilisons pas à des fins publicitaires. Les visites effectuées depuis le même navigateur sont reliées entre elles par un identifiant aléatoire stocké dans un cookie. Notre politique de confidentialité explique l’usage que Microsoft peut faire lui-même des données.',
    recordingDur: 'Durée : 1 an',
    recordingSessionDur: 'Durée : 1 jour',
    clarityUser: 'Microsoft Clarity : relie les visites effectuées depuis le même navigateur',
    claritySession: 'Microsoft Clarity : regroupe les pages vues en un seul enregistrement de session',
  },
  it: {
    recordingBody: 'Microsoft Clarity registra una riproduzione della visita (movimenti del mouse, clic e scorrimento) e ne ricava mappe di calore, così vediamo quali parti di una pagina creano confusione. Non associamo le registrazioni al Suo nome e non le usiamo per la pubblicità. Le visite effettuate dallo stesso browser vengono collegate tra loro da un identificatore casuale salvato in un cookie. La nostra informativa sulla privacy spiega come Microsoft può utilizzare i dati per conto proprio.',
    recordingDur: 'Durata: 1 anno',
    recordingSessionDur: 'Durata: 1 giorno',
    clarityUser: 'Microsoft Clarity: collega le visite effettuate dallo stesso browser',
    claritySession: 'Microsoft Clarity: riunisce le pagine visualizzate in una sola registrazione di sessione',
  },
  nl: {
    recordingBody: 'Microsoft Clarity legt een weergave van het bezoek vast (muisbewegingen, klikken en scrollen) en maakt daar heatmaps van, zodat we zien welke delen van een pagina verwarrend zijn. Wij verbinden de opnamen niet met uw naam en gebruiken ze niet voor advertenties. Bezoeken vanuit dezelfde browser worden via een willekeurige identificatiecode in een cookie aan elkaar gekoppeld. In ons privacybeleid leest u hoe Microsoft de gegevens zelf mag gebruiken.',
    recordingDur: 'Duur: 1 jaar',
    recordingSessionDur: 'Duur: 1 dag',
    clarityUser: 'Microsoft Clarity: koppelt bezoeken vanuit dezelfde browser',
    claritySession: 'Microsoft Clarity: voegt paginaweergaven samen tot één sessieopname',
  },
  sv: {
    recordingBody: 'Microsoft Clarity spelar in en återgivning av besöket (musrörelser, klick och scrollning) och bygger värmekartor av den, så att vi ser vilka delar av en sida som förvirrar. Vi knyter inte inspelningarna till ditt namn och använder dem inte för annonsering. Besök från samma webbläsare kopplas ihop med en slumpmässig identifierare som sparas i en cookie. I vår integritetspolicy kan du läsa hur Microsoft själv får använda uppgifterna.',
    recordingDur: 'Varaktighet: 1 år',
    recordingSessionDur: 'Varaktighet: 1 dag',
    clarityUser: 'Microsoft Clarity: kopplar ihop besök från samma webbläsare',
    claritySession: 'Microsoft Clarity: samlar sidvisningar i en enda sessionsinspelning',
  },
};

/**
 * Lentohaku (Travelpayouts), näytetään vain `flightSearch`-propilla (laplandflights.fi). Haravointimerkin alla,
 * koska muut sivustot eivät lataa hakua: COPYssa teksti päätyisi niiden staattiseen evästesivuun.
 * Mitattu renderöidystä livesivusta oikealla Chrome-UA:lla 8.10.2026 (consent-storage-live.cjs, tila accepted).
 */
interface FlightSearchCookieCopy {
  /** Kortin merkki ja taulukon tyyppisarake. */
  badge: string;
  body: string;
  /** Kortin alarivi: kestoväli. */
  dur: string;
  /** Taulukon tarkoitus: tpwl_locale, tpwl_currency. */
  pPrefs: string;
  /** Taulukon tarkoitus: _sp_id.*, _sp_ses.* (Snowplow). */
  pStats: string;
  /** Taulukon tarkoitus: nuid @ avsplow.com. */
  pNuid: string;
  /** Taulukon tarkoitus: snowplowOutQueue_sp, __wlcc (localStorage), __wlft, __wlrt (sessionStorage). */
  pStorage: string;
  d365: string;
  d400: string;
  dUnderDay: string;
  dStorage: string;
}

const FLIGHT_SEARCH: Record<Lang, FlightSearchCookieCopy> = {
  en: {
    badge: 'Flight search (Travelpayouts)',
    body: "The flight search on this site comes from Travelpayouts and loads only after you accept cookies. Your browser then connects to Travelpayouts' servers (tpwdg.com, apistp.com and avsplow.com), and the search results are flight offers from Aviasales and its partners. The search stores the cookies tpwl_locale and tpwl_currency (language and currency of the search, 365 days), _sp_id.* (400 days) and _sp_ses.* (less than 1 day) on this site's domain, and nuid on avsplow.com (a third-party cookie, 365 days). This site also writes your page language into tpwl_locale so the search opens in the same language. The _sp_ cookies and nuid are used for usage statistics of the search. In addition, snowplowOutQueue_sp and __wlcc are kept in localStorage, and __wlft and __wlrt in sessionStorage. Without your consent, the search form does not load, and a direct link to the Aviasales search works instead.",
    dur: 'Duration: less than 1 day – 400 days',
    pPrefs: 'Flight search: language and currency of the search',
    pStats: 'Flight search: usage statistics of the search',
    pNuid: 'Flight search: usage statistics of the search, set on avsplow.com (third party)',
    pStorage: "Flight search: queued usage statistics and the search's own working data",
    d365: '365 days',
    d400: '400 days',
    dUnderDay: 'Less than 1 day',
    dStorage: 'Until cleared (localStorage) / end of session (sessionStorage)',
  },
  fi: {
    badge: 'Lentohaku (Travelpayouts)',
    body: 'Sivuston lentohaku tulee Travelpayoutsilta, ja se latautuu vasta, kun hyväksyt evästeet. Selaimesi ottaa silloin yhteyden Travelpayoutsin palvelimiin (tpwdg.com, apistp.com ja avsplow.com), ja hakutulokset ovat Aviasalesin ja sen kumppaneiden lentotarjouksia. Haku tallentaa tämän sivuston domainiin evästeet tpwl_locale ja tpwl_currency (haun kieli ja valuutta, 365 päivää), _sp_id.* (400 päivää) ja _sp_ses.* (alle vuorokauden) sekä evästeen nuid avsplow.com-domainiin (kolmannen osapuolen eväste, 365 päivää). Sivusto kirjoittaa myös itse sivun kielen evästeeseen tpwl_locale, jotta haku avautuu samalla kielellä. Evästeitä _sp_ ja nuid käytetään haun käyttötilastointiin. Lisäksi localStorageen tallentuvat merkinnät snowplowOutQueue_sp ja __wlcc ja sessionStorageen merkinnät __wlft ja __wlrt. Ilman suostumusta hakulomake ei lataudu, ja sen sijaan toimii suora linkki Aviasalesin hakuun.',
    dur: 'Kesto: alle vuorokauden – 400 päivää',
    pPrefs: 'Lentohaku: haun kieli ja valuutta',
    pStats: 'Lentohaku: haun käyttötilastot',
    pNuid: 'Lentohaku: haun käyttötilastot, avsplow.com-domainissa (kolmas osapuoli)',
    pStorage: 'Lentohaku: lähetystä odottavat käyttötilastot ja haun omat työtiedot',
    d365: '365 päivää',
    d400: '400 päivää',
    dUnderDay: 'Alle vuorokauden',
    dStorage: 'Kunnes tyhjennetään (localStorage) / istunnon loppuun (sessionStorage)',
  },
  de: {
    badge: 'Flugsuche (Travelpayouts)',
    body: 'Die Flugsuche auf dieser Website stammt von Travelpayouts und wird erst geladen, wenn Sie Cookies akzeptieren. Ihr Browser verbindet sich dann mit Servern von Travelpayouts (tpwdg.com, apistp.com und avsplow.com), und die Suchergebnisse sind Flugangebote von Aviasales und dessen Partnern. Die Suche speichert auf der Domain dieser Website die Cookies tpwl_locale und tpwl_currency (Sprache und Währung der Suche, 365 Tage), _sp_id.* (400 Tage) und _sp_ses.* (weniger als ein Tag) sowie das Cookie nuid auf avsplow.com (Drittanbieter-Cookie, 365 Tage). Diese Website schreibt zudem selbst die Seitensprache in tpwl_locale, damit sich die Suche in derselben Sprache öffnet. Die Cookies _sp_ und nuid dienen der Nutzungsstatistik der Suche. Außerdem werden snowplowOutQueue_sp und __wlcc im localStorage sowie __wlft und __wlrt im sessionStorage abgelegt. Ohne Ihre Einwilligung wird das Suchformular nicht geladen; stattdessen funktioniert ein direkter Link zur Suche von Aviasales.',
    dur: 'Dauer: weniger als ein Tag – 400 Tage',
    pPrefs: 'Flugsuche: Sprache und Währung der Suche',
    pStats: 'Flugsuche: Nutzungsstatistik der Suche',
    pNuid: 'Flugsuche: Nutzungsstatistik der Suche, auf avsplow.com (Drittanbieter)',
    pStorage: 'Flugsuche: noch nicht gesendete Nutzungsstatistik und Arbeitsdaten der Suche',
    d365: '365 Tage',
    d400: '400 Tage',
    dUnderDay: 'Weniger als ein Tag',
    dStorage: 'Bis zum Löschen (localStorage) / bis zum Sitzungsende (sessionStorage)',
  },
  ja: {
    badge: 'フライト検索（Travelpayouts）',
    body: '本サイトのフライト検索は Travelpayouts が提供しており、クッキーに同意した後にのみ読み込まれます。読み込み時、ブラウザは Travelpayouts のサーバー（tpwdg.com、apistp.com、avsplow.com）に接続し、検索結果には Aviasales とそのパートナーの航空券が表示されます。検索機能は、本サイトのドメインにクッキー tpwl_locale と tpwl_currency（検索の言語と通貨、365日）、_sp_id.*（400日）、_sp_ses.*（1日未満）を保存し、avsplow.com に nuid（サードパーティクッキー、365日）を保存します。なお、検索が同じ言語で開くよう、本サイト自体もページの言語を tpwl_locale に書き込みます。_sp_ クッキーと nuid は検索の利用統計に使われます。さらに、localStorage に snowplowOutQueue_sp と __wlcc、sessionStorage に __wlft と __wlrt が保存されます。同意がない場合、検索フォームは読み込まれず、代わりに Aviasales の検索への直接リンクをご利用いただけます。',
    dur: '保存期間：1日未満〜400日',
    pPrefs: 'フライト検索：検索の言語と通貨',
    pStats: 'フライト検索：検索の利用統計',
    pNuid: 'フライト検索：検索の利用統計（avsplow.com、サードパーティ）',
    pStorage: 'フライト検索：送信待ちの利用統計と検索機能の作業データ',
    d365: '365日',
    d400: '400日',
    dUnderDay: '1日未満',
    dStorage: '削除するまで（localStorage）/セッション終了まで（sessionStorage）',
  },
  es: {
    badge: 'Buscador de vuelos (Travelpayouts)',
    body: 'El buscador de vuelos de este sitio es de Travelpayouts y solo se carga cuando usted acepta las cookies. Entonces su navegador se conecta a servidores de Travelpayouts (tpwdg.com, apistp.com y avsplow.com), y los resultados de búsqueda son ofertas de vuelos de Aviasales y sus socios. El buscador guarda en el dominio de este sitio las cookies tpwl_locale y tpwl_currency (idioma y moneda de la búsqueda, 365 días), _sp_id.* (400 días) y _sp_ses.* (menos de 1 día), y la cookie nuid en avsplow.com (cookie de terceros, 365 días). Este sitio también escribe el idioma de la página en tpwl_locale para que el buscador se abra en el mismo idioma. Las cookies _sp_ y nuid se usan para las estadísticas de uso del buscador. Además, snowplowOutQueue_sp y __wlcc se guardan en el localStorage, y __wlft y __wlrt en el sessionStorage. Sin su consentimiento, el formulario de búsqueda no se carga y, en su lugar, funciona un enlace directo al buscador de Aviasales.',
    dur: 'Duración: menos de 1 día – 400 días',
    pPrefs: 'Buscador de vuelos: idioma y moneda de la búsqueda',
    pStats: 'Buscador de vuelos: estadísticas de uso del buscador',
    pNuid: 'Buscador de vuelos: estadísticas de uso del buscador, cookie de terceros establecida en avsplow.com',
    pStorage: 'Buscador de vuelos: estadísticas de uso pendientes de envío y datos de funcionamiento del buscador',
    d365: '365 días',
    d400: '400 días',
    dUnderDay: 'Menos de 1 día',
    dStorage: 'Hasta que se borre (localStorage) / hasta el final de la sesión (sessionStorage)',
  },
  'pt-BR': {
    badge: 'Busca de voos (Travelpayouts)',
    body: 'A busca de voos deste site é da Travelpayouts e só carrega depois que você aceita os cookies. Então o seu navegador se conecta a servidores da Travelpayouts (tpwdg.com, apistp.com e avsplow.com), e os resultados são ofertas de voos da Aviasales e de seus parceiros. A busca salva no domínio deste site os cookies tpwl_locale e tpwl_currency (idioma e moeda da busca, 365 dias), _sp_id.* (400 dias) e _sp_ses.* (menos de 1 dia), e o cookie nuid em avsplow.com (cookie de terceiros, 365 dias). Este site também grava o idioma da página em tpwl_locale para que a busca abra no mesmo idioma. Os cookies _sp_ e nuid são usados para estatísticas de uso da busca. Além disso, snowplowOutQueue_sp e __wlcc ficam no localStorage, e __wlft e __wlrt no sessionStorage. Sem o seu consentimento, o formulário de busca não carrega e, no lugar dele, funciona um link direto para a busca da Aviasales.',
    dur: 'Duração: menos de 1 dia – 400 dias',
    pPrefs: 'Busca de voos: idioma e moeda da busca',
    pStats: 'Busca de voos: estatísticas de uso da busca',
    pNuid: 'Busca de voos: estatísticas de uso da busca, cookie de terceiros definido em avsplow.com',
    pStorage: 'Busca de voos: estatísticas de uso aguardando envio e dados de funcionamento da busca',
    d365: '365 dias',
    d400: '400 dias',
    dUnderDay: 'Menos de 1 dia',
    dStorage: 'Até ser limpo (localStorage) / até o fim da sessão (sessionStorage)',
  },
  'zh-CN': {
    badge: '机票搜索（Travelpayouts）',
    body: '本网站的机票搜索由 Travelpayouts 提供，只有在您接受 Cookie 后才会加载。加载后，您的浏览器会连接 Travelpayouts 的服务器（tpwdg.com、apistp.com 和 avsplow.com），搜索结果为 Aviasales 及其合作伙伴的机票报价。该搜索会在本网站域名上保存 Cookie tpwl_locale 和 tpwl_currency（搜索的语言和货币，365天）、_sp_id.*（400天）和 _sp_ses.*（不到1天），并在 avsplow.com 上保存 nuid（第三方 Cookie，365天）。为使搜索以同一语言打开，本网站也会将页面语言写入 tpwl_locale。_sp_ Cookie 和 nuid 用于搜索的使用统计。此外，snowplowOutQueue_sp 和 __wlcc 保存在 localStorage 中，__wlft 和 __wlrt 保存在 sessionStorage 中。如果您不同意，搜索表单不会加载，您可以改用直达 Aviasales 搜索的链接。',
    dur: '保留期限：不到1天至400天',
    pPrefs: '机票搜索：搜索的语言和货币',
    pStats: '机票搜索：搜索的使用统计',
    pNuid: '机票搜索：搜索的使用统计，设置在 avsplow.com 上（第三方）',
    pStorage: '机票搜索：待发送的使用统计和搜索组件的运行数据',
    d365: '365天',
    d400: '400天',
    dUnderDay: '不到1天',
    dStorage: '直到被清除（localStorage）/至会话结束（sessionStorage）',
  },
  ko: {
    badge: '항공권 검색(Travelpayouts)',
    body: '본 사이트의 항공권 검색은 Travelpayouts가 제공하며, 쿠키에 동의하신 후에만 불러옵니다. 이때 브라우저가 Travelpayouts 서버(tpwdg.com, apistp.com, avsplow.com)에 연결되며, 검색 결과는 Aviasales와 그 파트너의 항공권 상품입니다. 검색 기능은 본 사이트 도메인에 쿠키 tpwl_locale과 tpwl_currency(검색 언어와 통화, 365일), _sp_id.*(400일), _sp_ses.*(1일 미만)를 저장하고, avsplow.com에 nuid(제3자 쿠키, 365일)를 저장합니다. 검색이 같은 언어로 열리도록 본 사이트도 페이지 언어를 tpwl_locale에 기록합니다. _sp_ 쿠키와 nuid는 검색 이용 통계에 사용됩니다. 또한 localStorage에 snowplowOutQueue_sp와 __wlcc가, sessionStorage에 __wlft와 __wlrt가 저장됩니다. 동의하지 않으시면 검색 양식을 불러오지 않으며, 대신 Aviasales 검색으로 바로 가는 링크를 이용하실 수 있습니다.',
    dur: '보관 기간: 1일 미만~400일',
    pPrefs: '항공권 검색: 검색 언어와 통화',
    pStats: '항공권 검색: 검색 이용 통계',
    pNuid: '항공권 검색: 검색 이용 통계(avsplow.com, 제3자)',
    pStorage: '항공권 검색: 전송 대기 중인 이용 통계 및 검색 기능의 작업 데이터',
    d365: '365일',
    d400: '400일',
    dUnderDay: '1일 미만',
    dStorage: '삭제할 때까지(localStorage)/세션 종료 시까지(sessionStorage)',
  },
  fr: {
    badge: 'Recherche de vols (Travelpayouts)',
    body: "La recherche de vols de ce site est fournie par Travelpayouts et ne se charge qu'après votre acceptation des cookies. Votre navigateur se connecte alors aux serveurs de Travelpayouts (tpwdg.com, apistp.com et avsplow.com), et les résultats sont des offres de vols d'Aviasales et de ses partenaires. La recherche dépose sur le domaine de ce site les cookies tpwl_locale et tpwl_currency (langue et devise de la recherche, 365 jours), _sp_id.* (400 jours) et _sp_ses.* (moins d'un jour), ainsi que le cookie nuid sur avsplow.com (cookie tiers, 365 jours). Ce site écrit aussi lui-même la langue de la page dans tpwl_locale pour que la recherche s'ouvre dans la même langue. Les cookies _sp_ et nuid servent aux statistiques d'utilisation de la recherche. En outre, snowplowOutQueue_sp et __wlcc sont conservés dans le localStorage, et __wlft et __wlrt dans le sessionStorage. Sans votre consentement, le formulaire de recherche ne se charge pas, et un lien direct vers la recherche d'Aviasales fonctionne à la place.",
    dur: "Durée : moins d'un jour – 400 jours",
    pPrefs: 'Recherche de vols : langue et devise de la recherche',
    pStats: "Recherche de vols : statistiques d'utilisation de la recherche",
    pNuid: "Recherche de vols : statistiques d'utilisation de la recherche, cookie tiers déposé sur avsplow.com",
    pStorage: "Recherche de vols : statistiques d'utilisation en attente d'envoi et données de fonctionnement de la recherche",
    d365: '365 jours',
    d400: '400 jours',
    dUnderDay: "Moins d'un jour",
    dStorage: "Jusqu'à effacement (localStorage) / jusqu'à la fin de la session (sessionStorage)",
  },
  it: {
    badge: 'Ricerca voli (Travelpayouts)',
    body: 'La ricerca voli di questo sito è fornita da Travelpayouts e si carica solo dopo che Lei ha accettato i cookie. Il Suo browser si collega allora ai server di Travelpayouts (tpwdg.com, apistp.com e avsplow.com), e i risultati sono offerte di voli di Aviasales e dei suoi partner. La ricerca salva sul dominio di questo sito i cookie tpwl_locale e tpwl_currency (lingua e valuta della ricerca, 365 giorni), _sp_id.* (400 giorni) e _sp_ses.* (meno di 1 giorno), e il cookie nuid su avsplow.com (cookie di terze parti, 365 giorni). Questo sito scrive anche la lingua della pagina in tpwl_locale perché la ricerca si apra nella stessa lingua. I cookie _sp_ e nuid servono per le statistiche di utilizzo della ricerca. Inoltre, snowplowOutQueue_sp e __wlcc vengono conservati nel localStorage, e __wlft e __wlrt nel sessionStorage. Senza il Suo consenso il modulo di ricerca non si carica e al suo posto funziona un link diretto alla ricerca di Aviasales.',
    dur: 'Durata: meno di 1 giorno – 400 giorni',
    pPrefs: 'Ricerca voli: lingua e valuta della ricerca',
    pStats: 'Ricerca voli: statistiche di utilizzo della ricerca',
    pNuid: 'Ricerca voli: statistiche di utilizzo della ricerca, cookie di terze parti impostato su avsplow.com',
    pStorage: 'Ricerca voli: statistiche di utilizzo in attesa di invio e dati di funzionamento della ricerca',
    d365: '365 giorni',
    d400: '400 giorni',
    dUnderDay: 'Meno di 1 giorno',
    dStorage: 'Fino alla cancellazione (localStorage) / fino alla fine della sessione (sessionStorage)',
  },
  nl: {
    badge: 'Vluchtzoeker (Travelpayouts)',
    body: 'De vluchtzoeker op deze site komt van Travelpayouts en wordt pas geladen nadat u cookies heeft geaccepteerd. Uw browser maakt dan verbinding met servers van Travelpayouts (tpwdg.com, apistp.com en avsplow.com), en de zoekresultaten zijn vluchtaanbiedingen van Aviasales en zijn partners. De zoeker plaatst op het domein van deze site de cookies tpwl_locale en tpwl_currency (taal en valuta van de zoekopdracht, 365 dagen), _sp_id.* (400 dagen) en _sp_ses.* (minder dan 1 dag), en de cookie nuid op avsplow.com (cookie van derden, 365 dagen). Deze site schrijft ook zelf de paginataal in tpwl_locale, zodat de zoeker in dezelfde taal opent. De _sp_-cookies en nuid worden gebruikt voor gebruiksstatistieken van de zoeker. Daarnaast worden snowplowOutQueue_sp en __wlcc bewaard in de localStorage, en __wlft en __wlrt in de sessionStorage. Zonder uw toestemming wordt het zoekformulier niet geladen en werkt in plaats daarvan een directe link naar de zoekfunctie van Aviasales.',
    dur: 'Duur: minder dan 1 dag – 400 dagen',
    pPrefs: 'Vluchtzoeker: taal en valuta van de zoekopdracht',
    pStats: 'Vluchtzoeker: gebruiksstatistieken van de zoeker',
    pNuid: 'Vluchtzoeker: gebruiksstatistieken van de zoeker, op avsplow.com (derde partij)',
    pStorage: 'Vluchtzoeker: nog te verzenden gebruiksstatistieken en werkgegevens van de zoeker',
    d365: '365 dagen',
    d400: '400 dagen',
    dUnderDay: 'Minder dan 1 dag',
    dStorage: 'Tot u ze wist (localStorage) / tot het einde van de sessie (sessionStorage)',
  },
  sv: {
    badge: 'Flygsök (Travelpayouts)',
    body: 'Flygsökningen på den här webbplatsen kommer från Travelpayouts och laddas först när du accepterar cookies. Din webbläsare ansluter då till Travelpayouts servrar (tpwdg.com, apistp.com och avsplow.com), och sökresultaten är flygerbjudanden från Aviasales och dess partner. Sökfunktionen sparar cookierna tpwl_locale och tpwl_currency (sökningens språk och valuta, 365 dagar), _sp_id.* (400 dagar) och _sp_ses.* (mindre än 1 dag) på den här webbplatsens domän, och cookien nuid på avsplow.com (tredjepartscookie, 365 dagar). Webbplatsen skriver också själv sidans språk i tpwl_locale så att sökfunktionen öppnas på samma språk. Cookierna _sp_ och nuid används för användningsstatistik för sökfunktionen. Dessutom sparas snowplowOutQueue_sp och __wlcc i localStorage och __wlft och __wlrt i sessionStorage. Utan ditt samtycke laddas inte sökformuläret, och i stället fungerar en direktlänk till Aviasales sökning.',
    dur: 'Varaktighet: mindre än 1 dag – 400 dagar',
    pPrefs: 'Flygsök: sökningens språk och valuta',
    pStats: 'Flygsök: användningsstatistik för sökfunktionen',
    pNuid: 'Flygsök: användningsstatistik för sökfunktionen, på avsplow.com (tredje part)',
    pStorage: 'Flygsök: köad användningsstatistik och sökfunktionens egna arbetsdata',
    d365: '365 dagar',
    d400: '400 dagar',
    dUnderDay: 'Mindre än 1 dag',
    dStorage: 'Tills den rensas (localStorage) / tills sessionen slutar (sessionStorage)',
  },
};
