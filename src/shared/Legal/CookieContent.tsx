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
    lastUpdated: 'Last updated: September 2026',
    whatAreTitle: 'What Are Cookies?',
    whatAreBody: 'Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and understand how you use the site. You can control cookies through your browser settings or via our consent banner.',
    cookiesWeUseTitle: 'Cookies We Use',
    essentialBadge: 'Essential',
    essentialNote: 'Always active, cannot be disabled',
    essentialBody: "These cookies are required for the website to function. They store your consent preference so we don't ask you every visit.",
    essentialDur: 'Duration: 1 year',
    analyticsBadge: 'Analytics',
    analyticsNote: 'Requires consent',
    analyticsBody: 'Google Analytics 4 cookies help us understand how visitors use the site: which pages are popular, how long people stay, what device they browse on, and where they come from (country and city level). We do not collect names, email addresses or other directly identifying information. Visitors are identified by a random ID stored in a cookie.',
    analyticsDur: 'Duration: 14 months',
    cjBadge: 'Affiliate',
    cjNote: 'Set by third parties when you click affiliate links',
    cjBody: (siteName) => <>When you click a booking or affiliate link on {siteName}, our affiliate networks may set a tracking cookie or add a tracking parameter to the link so the booking can be attributed to {siteName}: Adtraction (partners like Sembo and Lomarengas, via <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> and <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (partners like Suomikauppa and Nordicbuddies, via <span className="font-mono text-xs text-snow/80">jdt8.net</span> and <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (partners like EconomyBookings, via <span className="font-mono text-xs text-snow/80">tp.media</span> or <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) and Trip.com (partner parameters on <span className="font-mono text-xs text-snow/80">trip.com</span>). This is how we earn a small commission when you book, at no extra cost to you.</>,
    cjDur: 'Duration: 30 days – 3 years (varies by partner)',
    gygBadge: 'Affiliate (GYG)',
    gygNote: 'Set by GetYourGuide widgets and clicks',
    gygBody: (siteName) => `When you interact with a GetYourGuide widget on this site or click an activity link, GetYourGuide (Berlin, EU) may set cookies to track widget interactions and attribute any subsequent booking to ${siteName} (partner ID VRMKD7N). The bookings themselves are made on getyourguide.com under their privacy policy.`,
    gygDur: 'Duration: session – 30 days',
    lsBadge: 'localStorage',
    lsNote: 'Stored in your browser, never sent to a server',
    lsIntro: "Two small entries are stored in your browser's localStorage to make the site less annoying:",
    lsConsentDesc: 'your accept/decline choice (mirror of the consent cookie above)',
    lsPopupDesc: 'a timestamp of when you last dismissed or successfully subscribed via the newsletter popup, so we do not re-show it for 7 days (or never, if you subscribed)',
    lsTail: "localStorage is technically not a cookie. We list it here for transparency. You can clear it via your browser's site-data settings.",
    tableTitle: 'Cookie Reference Table',
    tableCookie: 'Cookie',
    tableType: 'Type',
    tablePurpose: 'Purpose',
    tableDuration: 'Duration',
    tableRows: [],
    managingTitle: 'Managing Your Cookie Preferences',
    managing1: "You can change your consent at any time by clearing your browser's cookies for this site, which will re-show the consent banner on your next visit. You can also disable cookies entirely in your browser settings, though this may affect site functionality.",
    managing2: "Most browsers allow you to view, manage, and delete cookies. Check your browser's help section for instructions.",
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
    lastUpdated: 'Viimeksi päivitetty: syyskuu 2026',
    whatAreTitle: 'Mitä evästeet ovat?',
    whatAreBody: 'Evästeet ovat pieniä tekstitiedostoja, jotka tallentuvat laitteellesi vieraillessasi verkkosivustolla. Niiden avulla sivustot muistavat asetuksesi ja ymmärtävät, miten käytät sivustoa. Voit hallita evästeitä selaimesi asetuksista tai suostumusbannerimme kautta.',
    cookiesWeUseTitle: 'Käyttämämme evästeet',
    essentialBadge: 'Välttämätön',
    essentialNote: 'Aina aktiivinen, ei voi poistaa käytöstä',
    essentialBody: 'Nämä evästeet ovat välttämättömiä sivuston toiminnalle. Niihin tallennetaan suostumusvalintasi, joten emme kysy sitä joka vierailulla.',
    essentialDur: 'Kesto: 1 vuosi',
    analyticsBadge: 'Analytiikka',
    analyticsNote: 'Vaatii suostumuksen',
    analyticsBody: 'Google Analytics 4 ‑evästeet auttavat meitä ymmärtämään, miten kävijät käyttävät sivustoa: mitkä sivut ovat suosittuja, kuinka kauan kävijät viipyvät, millä laitteella he selaavat ja mistä he tulevat (maa- ja kaupunkitaso). Emme kerää nimeä, sähköpostiosoitetta tai muuta suoraan tunnistavaa tietoa. Kävijä tunnistetaan evästeessä olevalla satunnaisella tunnisteella.',
    analyticsDur: 'Kesto: 14 kuukautta',
    cjBadge: 'Kumppani',
    cjNote: 'Asetetaan kolmannen osapuolen toimesta, kun klikkaat kumppanilinkkiä',
    cjBody: (siteName) => <>Kun klikkaat varaus- tai kumppanilinkkiä sivustolla {siteName}, kumppaniverkostomme voivat asettaa seurantaevästeen tai lisätä linkkiin seurantaparametrin, jotta varaus kohdistuu sivustolle {siteName}: Adtraction (kumppanit kuten Sembo ja Lomarengas, domainien <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> ja <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span> kautta), Daisycon (kumppanit kuten Suomikauppa ja Nordicbuddies, domainien <span className="font-mono text-xs text-snow/80">jdt8.net</span> ja <span className="font-mono text-xs text-snow/80">glp8.net</span> kautta), Travelpayouts (kumppanit kuten EconomyBookings, domainien <span className="font-mono text-xs text-snow/80">tp.media</span> tai <span className="font-mono text-xs text-snow/80">travelpayouts.com</span> kautta) ja Trip.com (kumppanitunnisteet osoitteessa <span className="font-mono text-xs text-snow/80">trip.com</span>). Näin saamme pienen komission varauksestasi ilman lisäkustannuksia sinulle.</>,
    cjDur: 'Kesto: 30 päivää – 3 vuotta (vaihtelee kumppanin mukaan)',
    gygBadge: 'Kumppani (GYG)',
    gygNote: 'Asetetaan GetYourGuiden widgeteistä ja klikkauksista',
    gygBody: (siteName) => `Kun käytät sivuston GetYourGuide-widgettiä tai klikkaat aktiviteettilinkkiä, GetYourGuide (Berliini, EU) voi asettaa evästeitä seuratakseen widgetin tapahtumia ja kohdistaakseen mahdollisen varauksen sivustolle ${siteName} (kumppanitunnus VRMKD7N). Varaukset tehdään getyourguide.com-sivustolla heidän tietosuojakäytäntönsä alaisina.`,
    gygDur: 'Kesto: istunto – 30 päivää',
    lsBadge: 'localStorage',
    lsNote: 'Tallennetaan selaimeesi, ei lähetetä palvelimelle',
    lsIntro: 'Selaimesi localStorage-tallenteeseen kirjoitetaan kaksi pientä merkintää, jotta sivusto olisi vähemmän ärsyttävä:',
    lsConsentDesc: 'suostumusvalintasi (peili yllä olevasta suostumusevästeestä)',
    lsPopupDesc: 'ajankohta, jolloin viimeksi suljit uutiskirjeen ponnahdusikkunan tai tilasit sen onnistuneesti, jotta emme näytä sitä uudelleen 7 päivään (tai koskaan, jos tilasit)',
    lsTail: 'localStorage ei teknisesti ole eväste. Listaamme sen tässä avoimuuden vuoksi. Voit tyhjentää sen selaimesi sivustotietojen asetuksista.',
    tableTitle: 'Evästetaulukko',
    tableCookie: 'Eväste',
    tableType: 'Tyyppi',
    tablePurpose: 'Tarkoitus',
    tableDuration: 'Kesto',
    tableRows: [],
    managingTitle: 'Evästeasetusten hallinta',
    managing1: 'Voit muuttaa suostumustasi milloin tahansa tyhjentämällä selaimesi tämän sivuston evästeet, jolloin suostumusbanneri näytetään uudelleen seuraavalla vierailulla. Voit myös estää evästeet kokonaan selaimesi asetuksista, mikä voi vaikuttaa sivuston toimintaan.',
    managing2: 'Useimmat selaimet mahdollistavat evästeiden katselun, hallinnan ja poistamisen. Tarkista selaimesi ohjeista lisätietoja.',
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
    lastUpdated: 'Zuletzt aktualisiert: September 2026',
    whatAreTitle: 'Was sind Cookies?',
    whatAreBody: 'Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Gerät gespeichert werden. Sie helfen Websites, Ihre Einstellungen zu merken und zu verstehen, wie Sie die Seite nutzen. Sie können Cookies über Ihre Browser-Einstellungen oder über unser Consent-Banner steuern.',
    cookiesWeUseTitle: 'Welche Cookies wir verwenden',
    essentialBadge: 'Essenziell',
    essentialNote: 'Immer aktiv, kann nicht deaktiviert werden',
    essentialBody: 'Diese Cookies sind für den Betrieb der Website erforderlich. Sie speichern Ihre Einwilligung, damit wir Sie nicht bei jedem Besuch erneut fragen.',
    essentialDur: 'Dauer: 1 Jahr',
    analyticsBadge: 'Analyse',
    analyticsNote: 'Einwilligung erforderlich',
    analyticsBody: 'Cookies von Google Analytics 4 helfen uns zu verstehen, wie Besucher die Website nutzen: welche Seiten beliebt sind, wie lange Besucher bleiben, mit welchem Gerät sie surfen und woher sie kommen (Land- und Stadtebene). Wir erheben keine Namen, E-Mail-Adressen oder andere direkt identifizierende Daten. Besucher werden über eine zufällige Kennung in einem Cookie erkannt.',
    analyticsDur: 'Dauer: 14 Monate',
    cjBadge: 'Partner',
    cjNote: 'Werden von Dritten gesetzt, wenn Sie auf Partnerlinks klicken',
    cjBody: (siteName) => <>Wenn Sie auf {siteName} einen Buchungs- oder Partnerlink anklicken, können unsere Partnernetzwerke ein Tracking-Cookie setzen oder dem Link einen Tracking-Parameter hinzufügen, damit die Buchung {siteName} zugeordnet werden kann: Adtraction (Partner wie Sembo und Lomarengas, über <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> und <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (Partner wie Suomikauppa und Nordicbuddies, über <span className="font-mono text-xs text-snow/80">jdt8.net</span> und <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (Partner wie EconomyBookings, über <span className="font-mono text-xs text-snow/80">tp.media</span> oder <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) und Trip.com (Partnerparameter auf <span className="font-mono text-xs text-snow/80">trip.com</span>). So erhalten wir eine kleine Provision, wenn Sie buchen, ohne Mehrkosten für Sie.</>,
    cjDur: 'Dauer: 30 Tage – 3 Jahre (je nach Partner)',
    gygBadge: 'Partner (GYG)',
    gygNote: 'Gesetzt durch GetYourGuide-Widgets und Klicks',
    gygBody: (siteName) => `Wenn Sie ein GetYourGuide-Widget auf dieser Seite nutzen oder einen Aktivitätslink anklicken, kann GetYourGuide (Berlin, EU) Cookies setzen, um Widget-Interaktionen zu erfassen und Folgebuchungen ${siteName} zuzuordnen (Partner-ID VRMKD7N). Die Buchungen selbst erfolgen auf getyourguide.com gemäß deren Datenschutzrichtlinie.`,
    gygDur: 'Dauer: Sitzung – 30 Tage',
    lsBadge: 'localStorage',
    lsNote: 'Im Browser gespeichert, nie an einen Server gesendet',
    lsIntro: 'Im localStorage Ihres Browsers werden zwei kleine Einträge gespeichert, damit die Website weniger störend ist:',
    lsConsentDesc: 'Ihre Annahme/Ablehnung (Spiegelung des obigen Einwilligungs-Cookies)',
    lsPopupDesc: 'Zeitstempel, wann Sie das Newsletter-Popup zuletzt geschlossen oder erfolgreich abonniert haben, damit es 7 Tage lang (bzw. nie nach Abonnement) nicht erneut erscheint',
    lsTail: 'localStorage ist technisch kein Cookie. Wir listen es hier aus Transparenzgründen. Sie können es über die Website-Daten-Einstellungen Ihres Browsers löschen.',
    tableTitle: 'Cookie-Übersichtstabelle',
    tableCookie: 'Cookie',
    tableType: 'Typ',
    tablePurpose: 'Zweck',
    tableDuration: 'Dauer',
    tableRows: [],
    managingTitle: 'Verwaltung Ihrer Cookie-Einstellungen',
    managing1: 'Sie können Ihre Einwilligung jederzeit ändern, indem Sie die Cookies dieser Website in Ihrem Browser löschen, beim nächsten Besuch erscheint dann erneut das Consent-Banner. Sie können Cookies in Ihren Browser-Einstellungen auch vollständig deaktivieren, was die Funktionalität der Seite einschränken kann.',
    managing2: 'Die meisten Browser erlauben das Einsehen, Verwalten und Löschen von Cookies. Hinweise dazu finden Sie in der Hilfe Ihres Browsers.',
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
    lastUpdated: '最終更新：2026年9月',
    whatAreTitle: 'クッキーとは？',
    whatAreBody: 'クッキーとは、ウェブサイトを訪問した際にお客様のデバイスに保存される小さなテキストファイルです。ウェブサイトがお客様の設定を記憶し、サイトの使われ方を把握するのに役立ちます。クッキーはブラウザの設定または当サイトの同意バナーから管理できます。',
    cookiesWeUseTitle: '使用しているクッキー',
    essentialBadge: '必須',
    essentialNote: '常時有効、無効化できません',
    essentialBody: 'これらのクッキーはウェブサイトの動作に必要です。ご訪問のたびに確認しないように、同意設定を保存します。',
    essentialDur: '保存期間：1年',
    analyticsBadge: '解析',
    analyticsNote: '同意が必要',
    analyticsBody: 'Google Analytics 4 のクッキーは、サイトの使われ方を把握するのに役立ちます：どのページが人気か、滞在時間、利用デバイス、訪問元の国と都市など。氏名やメールアドレスなど直接個人を特定できる情報は取得せず、クッキーに保存されたランダムな識別子で訪問者を区別しています。',
    analyticsDur: '保存期間：14ヶ月',
    cjBadge: 'アフィリエイト',
    cjNote: 'アフィリエイトリンクをクリックすると第三者によって設定されます',
    cjBody: (siteName) => <>{siteName} で予約リンクやアフィリエイトリンクをクリックすると、提携ネットワークがトラッキングクッキーを設定するか、リンクに計測パラメータを付与し、予約を {siteName} に帰属させることがあります。対象：Adtraction（Sembo、Lomarengas などのパートナー。<span className="font-mono text-xs text-snow/80">do.sembo.fi</span> / <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span> 経由）、Daisycon（Suomikauppa、Nordicbuddies などのパートナー。<span className="font-mono text-xs text-snow/80">jdt8.net</span> / <span className="font-mono text-xs text-snow/80">glp8.net</span> 経由）、Travelpayouts（EconomyBookings など。<span className="font-mono text-xs text-snow/80">tp.media</span> / <span className="font-mono text-xs text-snow/80">travelpayouts.com</span> 経由）、Trip.com（<span className="font-mono text-xs text-snow/80">trip.com</span> 上のパートナーパラメータ）。ご予約の際に追加費用なしで当サイトが少額の手数料を受け取る仕組みです。</>,
    cjDur: '保存期間：30日〜3年（パートナーにより異なる）',
    gygBadge: 'アフィリエイト（GYG）',
    gygNote: 'GetYourGuide のウィジェットとクリックによって設定されます',
    gygBody: (siteName) => `本サイトの GetYourGuide ウィジェットを利用、またはアクティビティリンクをクリックすると、GetYourGuide（ベルリン、EU）がウィジェットの操作を追跡し、その後の予約を ${siteName}（パートナーID VRMKD7N）に帰属させるためのクッキーを設定することがあります。予約自体は getyourguide.com 上で同社のプライバシーポリシーに基づいて行われます。`,
    gygDur: '保存期間：セッション 〜 30日',
    lsBadge: 'localStorage',
    lsNote: 'ブラウザに保存され、サーバーには送信されません',
    lsIntro: 'サイト体験を快適にするため、ブラウザの localStorage に2つの小さなエントリを保存しています：',
    lsConsentDesc: '同意/拒否のお客様の選択（上記の同意クッキーのミラー）',
    lsPopupDesc: 'ニュースレターポップアップを最後に閉じた、または登録した日時。7日間は再表示しません（登録された場合は表示しません）',
    lsTail: 'localStorage は技術的にはクッキーではありませんが、透明性のためここで記載しています。ブラウザのサイトデータ設定から削除できます。',
    tableTitle: 'クッキー一覧表',
    tableCookie: 'クッキー',
    tableType: '種類',
    tablePurpose: '目的',
    tableDuration: '保存期間',
    tableRows: [],
    managingTitle: 'クッキー設定の管理',
    managing1: 'このサイトのクッキーをブラウザから削除することで、いつでも同意を変更できます。次回ご訪問時に同意バナーが再表示されます。ブラウザの設定でクッキーを完全に無効化することも可能ですが、サイトの機能に影響することがあります。',
    managing2: 'ほとんどのブラウザでクッキーを表示・管理・削除できます。詳しい操作はブラウザのヘルプをご確認ください。',
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
    lastUpdated: 'Última actualización: septiembre de 2026',
    whatAreTitle: '¿Qué son las cookies?',
    whatAreBody: 'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten que los sitios recuerden sus preferencias y entiendan cómo utiliza la página. Puede gestionar las cookies a través de la configuración de su navegador o de nuestro banner de consentimiento.',
    cookiesWeUseTitle: 'Cookies que utilizamos',
    essentialBadge: 'Esenciales',
    essentialNote: 'Siempre activas, no se pueden desactivar',
    essentialBody: 'Estas cookies son necesarias para el funcionamiento del sitio. Almacenan su preferencia de consentimiento para no preguntársela en cada visita.',
    essentialDur: 'Duración: 1 año',
    analyticsBadge: 'Analíticas',
    analyticsNote: 'Requieren consentimiento',
    analyticsBody: 'Las cookies de Google Analytics 4 nos ayudan a entender cómo se utiliza el sitio: qué páginas son populares, cuánto tiempo permanecen los usuarios, con qué dispositivo navegan y de dónde proceden (a nivel de país y ciudad). No recogemos nombres, direcciones de correo electrónico ni otros datos que identifiquen directamente a una persona: distinguimos a los visitantes mediante un identificador aleatorio guardado en una cookie.',
    analyticsDur: 'Duración: 14 meses',
    cjBadge: 'Afiliados',
    cjNote: 'Las establecen terceros al hacer clic en enlaces de afiliados',
    cjBody: (siteName) => <>Cuando hace clic en un enlace de reserva o de afiliado en {siteName}, nuestras redes de afiliación pueden establecer una cookie de seguimiento o añadir un parámetro de seguimiento al enlace para atribuir la reserva a {siteName}: Adtraction (socios como Sembo y Lomarengas, a través de <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> y <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (socios como Suomikauppa y Nordicbuddies, a través de <span className="font-mono text-xs text-snow/80">jdt8.net</span> y <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (socios como EconomyBookings, vía <span className="font-mono text-xs text-snow/80">tp.media</span> o <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) y Trip.com (parámetros de socio en <span className="font-mono text-xs text-snow/80">trip.com</span>). Así ganamos una pequeña comisión cuando reserva, sin costo adicional para usted.</>,
    cjDur: 'Duración: 30 días – 3 años (según el socio)',
    gygBadge: 'Afiliados (GYG)',
    gygNote: 'Establecidas por widgets y clics de GetYourGuide',
    gygBody: (siteName) => `Cuando interactúa con un widget de GetYourGuide en este sitio o hace clic en un enlace de actividades, GetYourGuide (Berlín, UE) puede establecer cookies para registrar las interacciones del widget y atribuir cualquier reserva posterior a ${siteName} (ID de afiliado VRMKD7N). Las reservas se realizan en getyourguide.com bajo su propia política de privacidad.`,
    gygDur: 'Duración: sesión – 30 días',
    lsBadge: 'localStorage',
    lsNote: 'Almacenado en su navegador, nunca enviado a un servidor',
    lsIntro: 'Se almacenan dos pequeñas entradas en el localStorage de su navegador para que el sitio sea menos molesto:',
    lsConsentDesc: 'su elección de aceptar o rechazar (reflejo de la cookie de consentimiento anterior)',
    lsPopupDesc: 'una marca de tiempo de cuándo cerró por última vez el popup del boletín o se suscribió correctamente, para no mostrarlo de nuevo durante 7 días (o nunca, si se suscribió)',
    lsTail: 'Técnicamente, localStorage no es una cookie. La listamos aquí por transparencia. Puede borrarla desde la configuración de datos del sitio en su navegador.',
    tableTitle: 'Tabla de referencia de cookies',
    tableCookie: 'Cookie',
    tableType: 'Tipo',
    tablePurpose: 'Finalidad',
    tableDuration: 'Duración',
    tableRows: [],
    managingTitle: 'Gestionar sus preferencias de cookies',
    managing1: 'Puede modificar su consentimiento en cualquier momento eliminando las cookies de este sitio en su navegador, lo que hará que el banner de consentimiento aparezca de nuevo en su próxima visita. También puede desactivar las cookies por completo en la configuración del navegador, aunque esto puede afectar a la funcionalidad del sitio.',
    managing2: 'La mayoría de los navegadores permiten ver, gestionar y eliminar las cookies. Consulte la sección de ayuda de su navegador para más instrucciones.',
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
    lastUpdated: 'Última atualização: setembro de 2026',
    whatAreTitle: 'O que são cookies?',
    whatAreBody: 'Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles ajudam os sites a lembrar suas preferências e a entender como você utiliza a página. Você pode controlar os cookies pelas configurações do navegador ou pelo nosso banner de consentimento.',
    cookiesWeUseTitle: 'Cookies que utilizamos',
    essentialBadge: 'Essenciais',
    essentialNote: 'Sempre ativos, não podem ser desativados',
    essentialBody: 'Estes cookies são necessários para o funcionamento do site. Eles armazenam sua preferência de consentimento para não perguntarmos em cada visita.',
    essentialDur: 'Duração: 1 ano',
    analyticsBadge: 'Analíticos',
    analyticsNote: 'Requerem consentimento',
    analyticsBody: 'Os cookies do Google Analytics 4 nos ajudam a entender como os visitantes utilizam o site: quais páginas são populares, quanto tempo as pessoas permanecem, em que dispositivo navegam e de onde vêm (a nível de país e cidade). Não coletamos nomes, endereços de e-mail nem outros dados que identifiquem diretamente uma pessoa: os visitantes são distinguidos por um identificador aleatório guardado em um cookie.',
    analyticsDur: 'Duração: 14 meses',
    cjBadge: 'Afiliados',
    cjNote: 'Definidos por terceiros quando você clica em links de afiliados',
    cjBody: (siteName) => <>Quando você clica em um link de reserva ou de afiliado no {siteName}, nossas redes de afiliados podem definir um cookie de rastreamento ou adicionar um parâmetro de rastreamento ao link para atribuir a reserva ao {siteName}: Adtraction (parceiros como Sembo e Lomarengas, via <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> e <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (parceiros como Suomikauppa e Nordicbuddies, via <span className="font-mono text-xs text-snow/80">jdt8.net</span> e <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (parceiros como EconomyBookings, via <span className="font-mono text-xs text-snow/80">tp.media</span> ou <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) e Trip.com (parâmetros de parceiro em <span className="font-mono text-xs text-snow/80">trip.com</span>). É assim que recebemos uma pequena comissão quando você reserva, sem custo adicional para você.</>,
    cjDur: 'Duração: 30 dias – 3 anos (varia por parceiro)',
    gygBadge: 'Afiliados (GYG)',
    gygNote: 'Definidos pelos widgets e cliques do GetYourGuide',
    gygBody: (siteName) => `Quando você interage com um widget do GetYourGuide neste site ou clica em um link de atividade, o GetYourGuide (Berlim, UE) pode definir cookies para registrar as interações com o widget e atribuir qualquer reserva subsequente ao ${siteName} (ID de parceiro VRMKD7N). As reservas em si são feitas no getyourguide.com, sob a política de privacidade deles.`,
    gygDur: 'Duração: sessão – 30 dias',
    lsBadge: 'localStorage',
    lsNote: 'Armazenado no seu navegador; nunca enviado a um servidor',
    lsIntro: 'Duas pequenas entradas são armazenadas no localStorage do seu navegador para que o site seja menos incômodo:',
    lsConsentDesc: 'sua escolha de aceitar/recusar (espelho do cookie de consentimento acima)',
    lsPopupDesc: 'um carimbo de tempo de quando você fechou pela última vez o popup do boletim ou se inscreveu com sucesso, para que não o exibamos novamente por 7 dias (ou nunca, se você se inscreveu)',
    lsTail: 'Tecnicamente, o localStorage não é um cookie. Listamos aqui por transparência. Você pode limpá-lo nas configurações de dados de site do seu navegador.',
    tableTitle: 'Tabela de referência de cookies',
    tableCookie: 'Cookie',
    tableType: 'Tipo',
    tablePurpose: 'Finalidade',
    tableDuration: 'Duração',
    tableRows: [],
    managingTitle: 'Gerenciando suas preferências de cookies',
    managing1: 'Você pode alterar seu consentimento a qualquer momento limpando os cookies deste site no seu navegador, o que fará o banner de consentimento aparecer novamente na próxima visita. Também é possível desativar os cookies por completo nas configurações do navegador, mas isso pode afetar o funcionamento do site.',
    managing2: 'A maioria dos navegadores permite visualizar, gerenciar e excluir cookies. Consulte a seção de ajuda do seu navegador para instruções.',
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
    lastUpdated: '最后更新：2026年9月',
    whatAreTitle: '什么是 Cookie？',
    whatAreBody: 'Cookie 是您访问网站时存储在您设备上的小型文本文件。它们帮助网站记住您的偏好，并了解您如何使用该网站。您可以通过浏览器设置或通过我们的同意横幅来管理 Cookie。',
    cookiesWeUseTitle: '我们使用的 Cookie',
    essentialBadge: '必要',
    essentialNote: '始终启用，不可关闭',
    essentialBody: '这些 Cookie 是网站正常运行所必需的。它们存储您的同意偏好，这样我们就无需在每次访问时再次询问。',
    essentialDur: '保留期限：1年',
    analyticsBadge: '分析',
    analyticsNote: '需要您的同意',
    analyticsBody: 'Google Analytics 4 的 Cookie 帮助我们了解访客如何使用网站：哪些页面受欢迎、停留时间、使用的设备，以及访客来自哪个国家和城市。我们不会收集姓名、电子邮箱等可直接识别身份的信息，只通过 Cookie 中的随机标识符区分访客。',
    analyticsDur: '保留期限：14个月',
    cjBadge: '联盟',
    cjNote: '当您点击联盟链接时由第三方设置',
    cjBody: (siteName) => <>当您在 {siteName} 上点击预订或联盟链接时，我们的联盟网络可能会设置跟踪 Cookie 或在链接中加入跟踪参数，以便将预订归因于 {siteName}：Adtraction（合作伙伴如 Sembo、Lomarengas，经由 <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> 与 <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>）、Daisycon（合作伙伴如 Suomikauppa、Nordicbuddies，经由 <span className="font-mono text-xs text-snow/80">jdt8.net</span> 与 <span className="font-mono text-xs text-snow/80">glp8.net</span>）、Travelpayouts（如 EconomyBookings，经由 <span className="font-mono text-xs text-snow/80">tp.media</span> 或 <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>）以及 Trip.com（<span className="font-mono text-xs text-snow/80">trip.com</span> 上的合作参数）。您预订时我们因此获得少量佣金，您无需支付任何额外费用。</>,
    cjDur: '保留期限：30天至3年（视合作伙伴而定）',
    gygBadge: '联盟（GYG）',
    gygNote: '由 GetYourGuide 的小组件和点击设置',
    gygBody: (siteName) => `当您在本网站使用 GetYourGuide 小组件或点击活动链接时，GetYourGuide（德国柏林，欧盟）可能会设置 Cookie，以追踪小组件的交互并将后续预订归因于 ${siteName}（合作伙伴 ID VRMKD7N）。预订本身在 getyourguide.com 上完成，适用其自身的隐私政策。`,
    gygDur: '保留期限：会话至30天',
    lsBadge: 'localStorage',
    lsNote: '存储在您的浏览器中，绝不会发送到服务器',
    lsIntro: '为了减少打扰，我们在您浏览器的 localStorage 中存储了两个小条目：',
    lsConsentDesc: '您的接受/拒绝选择（上述同意 Cookie 的镜像）',
    lsPopupDesc: '您上次关闭或成功订阅电子简报弹窗的时间戳，以便在7天内不再显示（若已订阅则永不显示）',
    lsTail: '严格来说 localStorage 并不是 Cookie。我们在此列出仅为了透明。您可以通过浏览器的网站数据设置将其清除。',
    tableTitle: 'Cookie 一览表',
    tableCookie: 'Cookie',
    tableType: '类型',
    tablePurpose: '用途',
    tableDuration: '保留期限',
    tableRows: [],
    managingTitle: '管理您的 Cookie 偏好',
    managing1: '您可以随时通过在浏览器中清除本网站的 Cookie 来更改您的同意，这样下次访问时同意横幅会再次出现。您也可以在浏览器设置中完全禁用 Cookie，但这可能会影响网站功能。',
    managing2: '大多数浏览器都允许查看、管理和删除 Cookie。请参阅您浏览器的帮助部分获取具体说明。',
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
    lastUpdated: '최종 업데이트: 2026년 9월',
    whatAreTitle: '쿠키란 무엇인가요?',
    whatAreBody: '쿠키는 귀하가 웹사이트를 방문할 때 기기에 저장되는 작은 텍스트 파일입니다. 웹사이트가 귀하의 설정을 기억하고 사이트 이용 방식을 이해하는 데 도움이 됩니다. 브라우저 설정이나 당사의 동의 배너를 통해 쿠키를 관리하실 수 있습니다.',
    cookiesWeUseTitle: '당사가 사용하는 쿠키',
    essentialBadge: '필수',
    essentialNote: '항상 활성, 비활성화할 수 없습니다',
    essentialBody: '이 쿠키는 웹사이트 작동에 필요합니다. 동의 설정을 저장하여 방문할 때마다 묻지 않도록 합니다.',
    essentialDur: '보관 기간: 1년',
    analyticsBadge: '분석',
    analyticsNote: '동의가 필요합니다',
    analyticsBody: 'Google Analytics 4 쿠키는 방문자가 사이트를 어떻게 이용하는지(어떤 페이지가 인기 있는지, 체류 시간, 사용 기기, 국가 및 도시 단위의 접속 출처)를 파악하는 데 도움이 됩니다. 이름이나 이메일 주소처럼 직접 신원을 알 수 있는 정보는 수집하지 않으며, 쿠키에 저장된 임의의 식별자로 방문자를 구분합니다.',
    analyticsDur: '보관 기간: 14개월',
    cjBadge: '제휴',
    cjNote: '제휴 링크 클릭 시 제3자가 설정합니다',
    cjBody: (siteName) => <>{siteName}에서 예약 또는 제휴 링크를 클릭하시면 제휴 네트워크가 추적 쿠키를 설정하거나 링크에 추적 매개변수를 추가하여 예약을 {siteName}에 귀속시킬 수 있습니다: Adtraction(Sembo, Lomarengas 등의 파트너, <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> / <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span> 경유), Daisycon(Suomikauppa, Nordicbuddies 등의 파트너, <span className="font-mono text-xs text-snow/80">jdt8.net</span> / <span className="font-mono text-xs text-snow/80">glp8.net</span> 경유), Travelpayouts(EconomyBookings 등, <span className="font-mono text-xs text-snow/80">tp.media</span> / <span className="font-mono text-xs text-snow/80">travelpayouts.com</span> 경유), Trip.com(<span className="font-mono text-xs text-snow/80">trip.com</span>의 파트너 매개변수). 이를 통해 추가 비용 없이 당사가 소액의 수수료를 받습니다.</>,
    cjDur: '보관 기간: 30일~3년(파트너에 따라 다름)',
    gygBadge: '제휴(GYG)',
    gygNote: 'GetYourGuide 위젯 및 클릭에 의해 설정됩니다',
    gygBody: (siteName) => `본 사이트의 GetYourGuide 위젯을 이용하시거나 액티비티 링크를 클릭하시면 GetYourGuide(독일 베를린, EU)가 위젯 상호작용을 추적하고 이후 예약을 ${siteName}(파트너 ID VRMKD7N)에 귀속시키기 위해 쿠키를 설정할 수 있습니다. 예약 자체는 getyourguide.com에서 해당 회사의 개인정보 처리방침에 따라 이루어집니다.`,
    gygDur: '보관 기간: 세션 ~ 30일',
    lsBadge: 'localStorage',
    lsNote: '브라우저에 저장되며 서버로 전송되지 않습니다',
    lsIntro: '사이트 이용 경험을 덜 번거롭게 하기 위해 브라우저의 localStorage에 두 개의 작은 항목이 저장됩니다:',
    lsConsentDesc: '귀하의 수락/거부 선택(위 동의 쿠키의 미러)',
    lsPopupDesc: '뉴스레터 팝업을 마지막으로 닫거나 성공적으로 구독한 시점의 타임스탬프. 7일 동안 다시 표시하지 않음(구독한 경우 영구히 표시되지 않음)',
    lsTail: 'localStorage는 기술적으로 쿠키가 아닙니다. 투명성을 위해 여기에 표시합니다. 브라우저의 사이트 데이터 설정에서 삭제하실 수 있습니다.',
    tableTitle: '쿠키 참조표',
    tableCookie: '쿠키',
    tableType: '유형',
    tablePurpose: '용도',
    tableDuration: '보관 기간',
    tableRows: [],
    managingTitle: '쿠키 설정 관리',
    managing1: '브라우저에서 본 사이트의 쿠키를 삭제하시면 언제든지 동의를 변경하실 수 있으며, 다음 방문 시 동의 배너가 다시 표시됩니다. 브라우저 설정에서 쿠키를 완전히 비활성화하실 수도 있지만 사이트 기능에 영향을 줄 수 있습니다.',
    managing2: '대부분의 브라우저에서 쿠키를 보고, 관리하고, 삭제할 수 있습니다. 구체적인 방법은 브라우저 도움말을 확인해 주십시오.',
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
    lastUpdated: 'Dernière mise à jour : septembre 2026',
    whatAreTitle: 'Que sont les cookies ?',
    whatAreBody: 'Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Ils aident les sites à mémoriser vos préférences et à comprendre comment vous utilisez le site. Vous pouvez gérer les cookies via les paramètres de votre navigateur ou via notre bandeau de consentement.',
    cookiesWeUseTitle: 'Les cookies que nous utilisons',
    essentialBadge: 'Essentiels',
    essentialNote: 'Toujours actifs, ne peuvent être désactivés',
    essentialBody: 'Ces cookies sont nécessaires au fonctionnement du site. Ils stockent votre préférence de consentement pour ne pas vous la redemander à chaque visite.',
    essentialDur: 'Durée : 1 an',
    analyticsBadge: 'Analytique',
    analyticsNote: 'Nécessite le consentement',
    analyticsBody: 'Les cookies Google Analytics 4 nous aident à comprendre comment les visiteurs utilisent le site : quelles pages sont populaires, combien de temps les gens y restent, avec quel appareil ils naviguent et d’où ils viennent (niveau pays et ville). Nous ne collectons ni nom, ni adresse e-mail, ni aucune autre donnée identifiant directement une personne : les visiteurs sont distingués par un identifiant aléatoire stocké dans un cookie.',
    analyticsDur: 'Durée : 14 mois',
    cjBadge: 'Affiliation',
    cjNote: 'Posés par des tiers lorsque vous cliquez sur des liens d\'affiliation',
    cjBody: (siteName) => <>Lorsque vous cliquez sur un lien de réservation ou d'affiliation sur {siteName}, nos réseaux d'affiliation peuvent déposer un cookie de suivi ou ajouter un paramètre de suivi au lien afin d'attribuer la réservation à {siteName} : Adtraction (partenaires comme Sembo et Lomarengas, via <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> et <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (partenaires comme Suomikauppa et Nordicbuddies, via <span className="font-mono text-xs text-snow/80">jdt8.net</span> et <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (partenaires comme EconomyBookings, via <span className="font-mono text-xs text-snow/80">tp.media</span> ou <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) et Trip.com (paramètres partenaires sur <span className="font-mono text-xs text-snow/80">trip.com</span>). C'est ainsi que nous percevons une petite commission lorsque vous réservez, sans surcoût pour vous.</>,
    cjDur: 'Durée : 30 jours – 3 ans (selon le partenaire)',
    gygBadge: 'Affiliation (GYG)',
    gygNote: 'Posés par les widgets et clics GetYourGuide',
    gygBody: (siteName) => `Lorsque vous interagissez avec un widget GetYourGuide sur ce site ou cliquez sur un lien d'activité, GetYourGuide (Berlin, UE) peut déposer des cookies pour suivre les interactions avec le widget et attribuer toute réservation ultérieure à ${siteName} (ID partenaire VRMKD7N). Les réservations elles-mêmes sont effectuées sur getyourguide.com selon leur propre politique de confidentialité.`,
    gygDur: 'Durée : session – 30 jours',
    lsBadge: 'localStorage',
    lsNote: 'Stocké dans votre navigateur, jamais envoyé à un serveur',
    lsIntro: 'Deux petites entrées sont stockées dans le localStorage de votre navigateur pour rendre le site moins intrusif :',
    lsConsentDesc: 'votre choix accepter/refuser (miroir du cookie de consentement ci-dessus)',
    lsPopupDesc: 'un horodatage du moment où vous avez fermé pour la dernière fois ou souscrit avec succès au popup de la newsletter, afin de ne pas le réafficher pendant 7 jours (ou jamais si vous vous êtes inscrit)',
    lsTail: 'Le localStorage n\'est techniquement pas un cookie. Nous le listons ici pour la transparence. Vous pouvez l\'effacer via les paramètres de données de site de votre navigateur.',
    tableTitle: 'Tableau de référence des cookies',
    tableCookie: 'Cookie',
    tableType: 'Type',
    tablePurpose: 'Finalité',
    tableDuration: 'Durée',
    tableRows: [],
    managingTitle: 'Gérer vos préférences de cookies',
    managing1: 'Vous pouvez modifier votre consentement à tout moment en effaçant les cookies de ce site dans votre navigateur, ce qui réaffichera le bandeau de consentement à votre prochaine visite. Vous pouvez aussi désactiver entièrement les cookies dans les paramètres de votre navigateur, ce qui peut toutefois affecter la fonctionnalité du site.',
    managing2: 'La plupart des navigateurs permettent de consulter, gérer et supprimer les cookies. Consultez la section d\'aide de votre navigateur pour les instructions.',
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
    lastUpdated: 'Ultimo aggiornamento: settembre 2026',
    whatAreTitle: 'Cosa sono i cookie?',
    whatAreBody: 'I cookie sono piccoli file di testo memorizzati sul Suo dispositivo quando visita un sito web. Aiutano i siti a ricordare le Sue preferenze e a comprendere come Lei utilizza la pagina. Può gestire i cookie tramite le impostazioni del browser o tramite il nostro banner di consenso.',
    cookiesWeUseTitle: 'Cookie che utilizziamo',
    essentialBadge: 'Essenziali',
    essentialNote: 'Sempre attivi, non possono essere disattivati',
    essentialBody: 'Questi cookie sono necessari per il funzionamento del sito. Memorizzano la Sua preferenza di consenso così non glielo chiediamo a ogni visita.',
    essentialDur: 'Durata: 1 anno',
    analyticsBadge: 'Analitici',
    analyticsNote: 'Richiedono il consenso',
    analyticsBody: 'I cookie di Google Analytics 4 ci aiutano a comprendere come i visitatori utilizzano il sito: quali pagine sono popolari, quanto tempo si fermano, con quale dispositivo navigano e da dove provengono (a livello di paese e città). Non raccogliamo nomi, indirizzi e-mail né altri dati che identifichino direttamente una persona: i visitatori vengono distinti da un identificatore casuale salvato in un cookie.',
    analyticsDur: 'Durata: 14 mesi',
    cjBadge: 'Affiliazione',
    cjNote: 'Impostati da terzi quando Lei clicca su link di affiliazione',
    cjBody: (siteName) => <>Quando Lei clicca su un link di prenotazione o affiliazione su {siteName}, le nostre reti di affiliazione possono impostare un cookie di tracciamento o aggiungere al link un parametro di tracciamento per attribuire la prenotazione a {siteName}: Adtraction (partner come Sembo e Lomarengas, tramite <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> e <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (partner come Suomikauppa e Nordicbuddies, tramite <span className="font-mono text-xs text-snow/80">jdt8.net</span> e <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (partner come EconomyBookings, tramite <span className="font-mono text-xs text-snow/80">tp.media</span> o <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) e Trip.com (parametri partner su <span className="font-mono text-xs text-snow/80">trip.com</span>). È così che riceviamo una piccola commissione quando Lei prenota, senza costi aggiuntivi per Lei.</>,
    cjDur: 'Durata: 30 giorni – 3 anni (varia in base al partner)',
    gygBadge: 'Affiliazione (GYG)',
    gygNote: 'Impostati dai widget e dai clic di GetYourGuide',
    gygBody: (siteName) => `Quando interagisce con un widget GetYourGuide su questo sito o clicca su un link di attività, GetYourGuide (Berlino, UE) può impostare cookie per tracciare le interazioni con il widget e attribuire eventuali prenotazioni successive a ${siteName} (ID partner VRMKD7N). Le prenotazioni stesse avvengono su getyourguide.com secondo la loro informativa sulla privacy.`,
    gygDur: 'Durata: sessione – 30 giorni',
    lsBadge: 'localStorage',
    lsNote: 'Memorizzato nel Suo browser, mai inviato a un server',
    lsIntro: 'Nel localStorage del Suo browser vengono memorizzate due piccole voci per rendere il sito meno fastidioso:',
    lsConsentDesc: 'la Sua scelta accetta/rifiuta (specchio del cookie di consenso sopra)',
    lsPopupDesc: 'un timestamp di quando ha chiuso per l\'ultima volta o si è iscritto con successo al popup della newsletter, in modo da non mostrarlo di nuovo per 7 giorni (o mai più se si è iscritto)',
    lsTail: 'Tecnicamente, localStorage non è un cookie. Lo elenchiamo qui per trasparenza. Può cancellarlo dalle impostazioni dati sito del Suo browser.',
    tableTitle: 'Tabella di riferimento dei cookie',
    tableCookie: 'Cookie',
    tableType: 'Tipo',
    tablePurpose: 'Finalità',
    tableDuration: 'Durata',
    tableRows: [],
    managingTitle: 'Gestione delle preferenze sui cookie',
    managing1: 'Può modificare il consenso in qualsiasi momento cancellando i cookie di questo sito nel Suo browser; alla prossima visita il banner di consenso verrà mostrato di nuovo. Può anche disattivare completamente i cookie nelle impostazioni del browser, ma ciò potrebbe influire sulla funzionalità del sito.',
    managing2: 'La maggior parte dei browser consente di visualizzare, gestire ed eliminare i cookie. Consulti la sezione di aiuto del Suo browser per le istruzioni.',
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
    lastUpdated: 'Laatst bijgewerkt: september 2026',
    whatAreTitle: 'Wat zijn cookies?',
    whatAreBody: 'Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u een website bezoekt. Ze helpen websites uw voorkeuren te onthouden en te begrijpen hoe u de site gebruikt. U kunt cookies beheren via uw browserinstellingen of via onze toestemmingsbanner.',
    cookiesWeUseTitle: 'Cookies die wij gebruiken',
    essentialBadge: 'Essentieel',
    essentialNote: 'Altijd actief, kunnen niet worden uitgeschakeld',
    essentialBody: 'Deze cookies zijn nodig voor de werking van de website. Ze slaan uw toestemmingsvoorkeur op zodat wij u niet bij elk bezoek opnieuw hoeven te vragen.',
    essentialDur: 'Duur: 1 jaar',
    analyticsBadge: 'Analyse',
    analyticsNote: 'Vereist toestemming',
    analyticsBody: 'Cookies van Google Analytics 4 helpen ons te begrijpen hoe bezoekers de site gebruiken: welke pagina’s populair zijn, hoe lang mensen blijven, met welk apparaat ze surfen en waar ze vandaan komen (land- en stadsniveau). We verzamelen geen namen, e-mailadressen of andere direct identificerende gegevens. Bezoekers worden onderscheiden via een willekeurige identificatiecode in een cookie.',
    analyticsDur: 'Duur: 14 maanden',
    cjBadge: 'Affiliate',
    cjNote: 'Geplaatst door derden wanneer u op affiliatelinks klikt',
    cjBody: (siteName) => <>Wanneer u op een boekings- of affiliatelink op {siteName} klikt, kunnen onze affiliatenetwerken een trackingcookie plaatsen of een trackingparameter aan de link toevoegen zodat de boeking aan {siteName} kan worden toegeschreven: Adtraction (partners zoals Sembo en Lomarengas, via <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> en <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (partners zoals Suomikauppa en Nordicbuddies, via <span className="font-mono text-xs text-snow/80">jdt8.net</span> en <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (partners zoals EconomyBookings, via <span className="font-mono text-xs text-snow/80">tp.media</span> of <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) en Trip.com (partnerparameters op <span className="font-mono text-xs text-snow/80">trip.com</span>). Zo verdienen wij een kleine commissie wanneer u boekt, zonder extra kosten voor u.</>,
    cjDur: 'Duur: 30 dagen – 3 jaar (verschilt per partner)',
    gygBadge: 'Affiliate (GYG)',
    gygNote: 'Geplaatst door GetYourGuide-widgets en -klikken',
    gygBody: (siteName) => `Wanneer u interactie heeft met een GetYourGuide-widget op deze site of op een activiteitenlink klikt, kan GetYourGuide (Berlijn, EU) cookies plaatsen om widget-interacties te volgen en eventuele daaropvolgende boekingen toe te wijzen aan ${siteName} (partner-ID VRMKD7N). De boekingen zelf vinden plaats op getyourguide.com onder hun privacybeleid.`,
    gygDur: 'Duur: sessie – 30 dagen',
    lsBadge: 'localStorage',
    lsNote: 'Opgeslagen in uw browser, nooit naar een server verzonden',
    lsIntro: 'Twee kleine vermeldingen worden opgeslagen in de localStorage van uw browser om de site minder vervelend te maken:',
    lsConsentDesc: 'uw keuze accepteren/weigeren (spiegel van de toestemmingscookie hierboven)',
    lsPopupDesc: 'een tijdstempel van wanneer u de nieuwsbrief-popup voor het laatst sloot of zich succesvol abonneerde, zodat we deze niet opnieuw tonen gedurende 7 dagen (of nooit, als u zich heeft geabonneerd)',
    lsTail: 'Technisch gezien is localStorage geen cookie. Wij vermelden het hier voor de transparantie. U kunt het wissen via de site-data-instellingen van uw browser.',
    tableTitle: 'Cookie-referentietabel',
    tableCookie: 'Cookie',
    tableType: 'Type',
    tablePurpose: 'Doel',
    tableDuration: 'Duur',
    tableRows: [],
    managingTitle: 'Uw cookievoorkeuren beheren',
    managing1: 'U kunt uw toestemming op elk moment wijzigen door de cookies van deze site in uw browser te wissen; bij uw volgende bezoek verschijnt de toestemmingsbanner opnieuw. U kunt cookies ook volledig uitschakelen in uw browserinstellingen, maar dat kan de functionaliteit van de site beïnvloeden.',
    managing2: 'De meeste browsers laten u cookies bekijken, beheren en verwijderen. Raadpleeg de help-sectie van uw browser voor instructies.',
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
    lastUpdated: 'Senast uppdaterad: september 2026',
    whatAreTitle: 'Vad är cookies?',
    whatAreBody: 'Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. De hjälper webbplatser att komma ihåg dina inställningar och förstå hur du använder sidan. Du kan hantera cookies via dina webbläsarinställningar eller via vår samtyckesbanner.',
    cookiesWeUseTitle: 'Cookies vi använder',
    essentialBadge: 'Nödvändig',
    essentialNote: 'Alltid aktiv, kan inte inaktiveras',
    essentialBody: 'Dessa cookies krävs för att webbplatsen ska fungera. De lagrar ditt samtyckesval så att vi inte behöver fråga dig vid varje besök.',
    essentialDur: 'Varaktighet: 1 år',
    analyticsBadge: 'Statistik',
    analyticsNote: 'Kräver samtycke',
    analyticsBody: 'Cookies från Google Analytics 4 hjälper oss att förstå hur besökare använder webbplatsen: vilka sidor som är populära, hur länge besökare stannar, vilken enhet de surfar med och varifrån de kommer (land- och stadsnivå). Vi samlar inte in namn, e-postadresser eller andra direkt identifierande uppgifter. Besökare särskiljs med en slumpmässig identifierare som sparas i en cookie.',
    analyticsDur: 'Varaktighet: 14 månader',
    cjBadge: 'Affiliate',
    cjNote: 'Placeras av tredje part när du klickar på affiliatelänkar',
    cjBody: (siteName) => <>När du klickar på en boknings- eller affiliatelänk på {siteName} kan våra affiliatenätverk placera en spårningscookie eller lägga till en spårningsparameter i länken så att bokningen kan kopplas till {siteName}: Adtraction (partner som Sembo och Lomarengas, via <span className="font-mono text-xs text-snow/80">do.sembo.fi</span> och <span className="font-mono text-xs text-snow/80">on.lomarengas.fi</span>), Daisycon (partner som Suomikauppa och Nordicbuddies, via <span className="font-mono text-xs text-snow/80">jdt8.net</span> och <span className="font-mono text-xs text-snow/80">glp8.net</span>), Travelpayouts (partner som EconomyBookings, via <span className="font-mono text-xs text-snow/80">tp.media</span> eller <span className="font-mono text-xs text-snow/80">travelpayouts.com</span>) och Trip.com (partnerparametrar på <span className="font-mono text-xs text-snow/80">trip.com</span>). Så tjänar vi en liten provision när du bokar, utan extra kostnad för dig.</>,
    cjDur: 'Varaktighet: 30 dagar – 3 år (varierar per partner)',
    gygBadge: 'Affiliate (GYG)',
    gygNote: 'Placeras av GetYourGuides widgetar och klick',
    gygBody: (siteName) => `När du interagerar med en GetYourGuide-widget på den här sidan eller klickar på en aktivitetslänk, kan GetYourGuide (Berlin, EU) sätta cookies för att spåra widget-interaktioner och koppla eventuella efterföljande bokningar till ${siteName} (partner-ID VRMKD7N). Bokningarna görs på getyourguide.com enligt deras integritetspolicy.`,
    gygDur: 'Varaktighet: session – 30 dagar',
    lsBadge: 'localStorage',
    lsNote: 'Lagras i din webbläsare, skickas aldrig till en server',
    lsIntro: 'Två små poster lagras i din webbläsares localStorage för att göra webbplatsen mindre irriterande:',
    lsConsentDesc: 'ditt val att acceptera/avböja (spegling av samtyckescookien ovan)',
    lsPopupDesc: 'en tidsstämpel för när du senast stängde eller framgångsrikt prenumererade via nyhetsbrevets popup, så att vi inte visar den igen på 7 dagar (eller aldrig, om du prenumererade)',
    lsTail: 'localStorage är tekniskt sett ingen cookie. Vi listar den här av transparensskäl. Du kan rensa den via webbläsarens inställningar för webbplatsdata.',
    tableTitle: 'Cookiereferenstabell',
    tableCookie: 'Cookie',
    tableType: 'Typ',
    tablePurpose: 'Syfte',
    tableDuration: 'Varaktighet',
    tableRows: [],
    managingTitle: 'Hantera dina cookieinställningar',
    managing1: 'Du kan ändra ditt samtycke när som helst genom att rensa webbläsarens cookies för den här webbplatsen, vilket gör att samtyckesbannern visas igen vid nästa besök. Du kan också inaktivera cookies helt i dina webbläsarinställningar, även om det kan påverka webbplatsens funktionalitet.',
    managing2: 'De flesta webbläsare låter dig visa, hantera och radera cookies. Se din webbläsares hjälpavsnitt för instruktioner.',
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

export default function CookieContent({
  siteId = 'laplandvibes',
  siteName = 'LaplandVibes',
  lang = 'en',
  sessionRecording = false,
}: CookieContentProps) {
  const t = COPY[lang] ?? COPY.en;
  const rec = SESSION_RECORDING[lang] ?? SESSION_RECORDING.en;
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
      gyg: 'GetYourGuide widgets: track activity widget interactions and attribute bookings to the site',
    },
    fi: {
      consent: 'Tallentaa evästeiden suostumusvalintasi (hyväksytty/hylätty)',
      popup: 'Muistaa, suljitko vai tilasitko uutiskirjeen ponnahdusikkunan, jotta emme näytä sitä uudelleen',
      gaUser: 'Google Analytics: erottaa yksittäiset käyttäjät',
      gaSession: 'Google Analytics: ylläpitää istuntotilaa',
      cj: 'Adtraction, Daisycon, Travelpayouts ja Trip.com: kohdistavat kumppanikomissiot, kun klikkaat kumppanilinkkiä. Verkosto tai kumppani asettaa evästeen omalle domainilleen (esimerkiksi do.sembo.fi, jdt8.net, economybookings.com tai trip.com)',
      gyg: 'GetYourGuiden widgetit: seuraavat widgettien tapahtumia ja kohdistavat varaukset sivustolle',
    },
    de: {
      consent: 'Speichert Ihre Cookie-Einwilligungswahl (akzeptiert/abgelehnt)',
      popup: 'Merkt sich, ob Sie das Newsletter-Popup geschlossen oder abonniert haben, damit es nicht erneut erscheint',
      gaUser: 'Google Analytics: unterscheidet einzelne Nutzer',
      gaSession: 'Google Analytics: verwaltet den Sitzungsstatus',
      cj: 'Adtraction, Daisycon, Travelpayouts und Trip.com: ordnen Provisionen zu, wenn Sie auf Partnerlinks klicken. Vom Netzwerk oder vom Partner auf der eigenen Domain gesetzt, z. B. do.sembo.fi, jdt8.net, economybookings.com oder trip.com',
      gyg: 'GetYourGuide-Widgets: erfassen Widget-Interaktionen und ordnen Buchungen der Seite zu',
    },
    ja: {
      consent: 'クッキー同意の選択（同意/拒否）を保存します',
      popup: 'ニュースレターポップアップを閉じたか登録したかを記憶し、再表示しないようにします',
      gaUser: 'Google Analytics：個別ユーザーを識別',
      gaSession: 'Google Analytics：セッション状態を管理',
      cj: 'Adtraction、Daisycon、Travelpayouts、Trip.com：アフィリエイトリンクをクリックした際に紹介料を帰属させます。ネットワークまたはパートナーが自社のドメインに設定します（例：do.sembo.fi、jdt8.net、economybookings.com、trip.com）',
      gyg: 'GetYourGuide ウィジェット：ウィジェットの操作を追跡し、予約をサイトに帰属させます',
    },
    es: {
      consent: 'Almacena su preferencia de consentimiento de cookies (aceptado/rechazado)',
      popup: 'Recuerda si cerró o se suscribió al popup del boletín para no mostrárselo de nuevo',
      gaUser: 'Google Analytics: distingue usuarios únicos',
      gaSession: 'Google Analytics: mantiene el estado de la sesión',
      cj: 'Adtraction, Daisycon, Travelpayouts y Trip.com: atribuyen las comisiones de afiliados cuando hace clic en enlaces de afiliados. Las establece la red o el socio en su propio dominio, por ejemplo do.sembo.fi, jdt8.net, economybookings.com o trip.com',
      gyg: 'Widgets de GetYourGuide: registran interacciones con los widgets y atribuyen las reservas al sitio',
    },
    'pt-BR': {
      consent: 'Armazena sua preferência de consentimento de cookies (aceito/recusado)',
      popup: 'Lembra se você fechou ou se inscreveu no popup do boletim, para não exibi-lo novamente',
      gaUser: 'Google Analytics: distingue usuários únicos',
      gaSession: 'Google Analytics: mantém o estado da sessão',
      cj: 'Adtraction, Daisycon, Travelpayouts e Trip.com: atribuem as comissões de afiliados quando você clica em links de afiliados. Definidos pela rede ou pelo parceiro no próprio domínio, por exemplo do.sembo.fi, jdt8.net, economybookings.com ou trip.com',
      gyg: 'Widgets do GetYourGuide: rastreiam interações com os widgets e atribuem reservas ao site',
    },
    'zh-CN': {
      consent: '保存您的 Cookie 同意偏好（已接受/已拒绝）',
      popup: '记住您是否关闭或订阅了电子简报弹窗，以避免重复显示',
      gaUser: 'Google Analytics：区分独立用户',
      gaSession: 'Google Analytics：维护会话状态',
      cj: 'Adtraction、Daisycon、Travelpayouts 与 Trip.com：当您点击联盟链接时归因佣金。由联盟网络或合作伙伴在其自有域名上设置，例如 do.sembo.fi、jdt8.net、economybookings.com 或 trip.com',
      gyg: 'GetYourGuide 小组件：追踪小组件交互并将预订归因于本网站',
    },
    ko: {
      consent: '귀하의 쿠키 동의 설정(수락/거부)을 저장',
      popup: '뉴스레터 팝업을 닫았거나 구독했는지 기억하여 다시 표시하지 않음',
      gaUser: 'Google Analytics: 고유 사용자 구분',
      gaSession: 'Google Analytics: 세션 상태 유지',
      cj: 'Adtraction, Daisycon, Travelpayouts, Trip.com: 제휴 링크 클릭 시 추천 수수료 귀속. 네트워크 또는 파트너가 자체 도메인에 설정(예: do.sembo.fi, jdt8.net, economybookings.com, trip.com)',
      gyg: 'GetYourGuide 위젯: 액티비티 위젯 상호작용 추적 및 예약의 사이트 귀속에 사용',
    },
    fr: {
      consent: 'Stocke votre préférence de consentement aux cookies (accepté/refusé)',
      popup: 'Mémorise si vous avez fermé ou souscrit au popup de la newsletter, afin de ne pas le réafficher',
      gaUser: 'Google Analytics : distingue les utilisateurs uniques',
      gaSession: 'Google Analytics : maintient l\'état de session',
      cj: 'Adtraction, Daisycon, Travelpayouts et Trip.com : attribuent les commissions d\'affiliation lorsque vous cliquez sur des liens d\'affiliation. Déposés par le réseau ou par le partenaire sur son propre domaine, par exemple do.sembo.fi, jdt8.net, economybookings.com ou trip.com',
      gyg: 'Widgets GetYourGuide : suivent les interactions avec les widgets et attribuent les réservations au site',
    },
    it: {
      consent: 'Memorizza la Sua preferenza di consenso ai cookie (accettato/rifiutato)',
      popup: 'Ricorda se Lei ha chiuso o si è iscritto al popup della newsletter, per non mostrarlo di nuovo',
      gaUser: 'Google Analytics: distingue gli utenti unici',
      gaSession: 'Google Analytics: mantiene lo stato della sessione',
      cj: 'Adtraction, Daisycon, Travelpayouts e Trip.com: attribuiscono le commissioni di affiliazione quando si clicca sui link di affiliazione. Impostati dalla rete o dal partner sul proprio dominio, ad esempio do.sembo.fi, jdt8.net, economybookings.com o trip.com',
      gyg: 'Widget GetYourGuide: tracciano le interazioni con i widget e attribuiscono le prenotazioni al sito',
    },
    nl: {
      consent: 'Slaat uw cookie-toestemmingsvoorkeur op (geaccepteerd/geweigerd)',
      popup: 'Onthoudt of u de nieuwsbrief-popup heeft gesloten of zich heeft geabonneerd, om deze niet opnieuw te tonen',
      gaUser: 'Google Analytics: onderscheidt unieke gebruikers',
      gaSession: 'Google Analytics: houdt de sessiestatus bij',
      cj: 'Adtraction, Daisycon, Travelpayouts en Trip.com: wijzen affiliatecommissies toe wanneer u op affiliatelinks klikt. Geplaatst door het netwerk of door de partner op het eigen domein, bijvoorbeeld do.sembo.fi, jdt8.net, economybookings.com of trip.com',
      gyg: 'GetYourGuide-widgets: volgen interacties met activiteit-widgets en wijzen boekingen toe aan de site',
    },
    sv: {
      consent: 'Lagrar ditt val av cookiesamtycke (accepterat/avböjt)',
      popup: 'Kommer ihåg om du stängde eller prenumererade via nyhetsbrevets popup, så att vi inte visar den igen',
      gaUser: 'Google Analytics: särskiljer unika användare',
      gaSession: 'Google Analytics: upprätthåller sessionstillstånd',
      cj: 'Adtraction, Daisycon, Travelpayouts och Trip.com: attribuerar hänvisningsprovisioner när du klickar på affiliatelänkar. Placeras av nätverket eller av partnern på den egna domänen, till exempel do.sembo.fi, jdt8.net, economybookings.com eller trip.com',
      gyg: 'GetYourGuide-widgetar: spårar interaktioner med aktivitetswidgetar och kopplar bokningar till webbplatsen',
    },
  };
  const p = purposeStrings[lang] ?? purposeStrings.en;

  const durStrings: Record<Lang, { oneYear: string; oneDay: string; cjDur: string; gygDur: string; popupDur: string; gaDur: string }> = {
    en: { oneYear: '1 year', oneDay: '1 day', cjDur: 'Varies (30 days – 3 years)', gygDur: 'Session–30 days', popupDur: '7 days (dismissed) / persistent (subscribed)', gaDur: '14 months' },
    fi: { oneYear: '1 vuosi', oneDay: '1 päivä', cjDur: 'Vaihtelee (30 päivää – 3 vuotta)', gygDur: 'Istunto–30 päivää', popupDur: '7 päivää (suljettu) / pysyvä (tilattu)', gaDur: '14 kuukautta' },
    de: { oneYear: '1 Jahr', oneDay: '1 Tag', cjDur: 'Variabel (30 Tage – 3 Jahre)', gygDur: 'Sitzung–30 Tage', popupDur: '7 Tage (geschlossen) / dauerhaft (abonniert)', gaDur: '14 Monate' },
    ja: { oneYear: '1年', oneDay: '1日', cjDur: '変動（30日〜3年）', gygDur: 'セッション〜30日', popupDur: '7日（閉じた場合）/永続（登録した場合）', gaDur: '14ヶ月' },
    es: { oneYear: '1 año', oneDay: '1 día', cjDur: 'Variable (30 días – 3 años)', gygDur: 'Sesión–30 días', popupDur: '7 días (cerrado) / persistente (suscrito)', gaDur: '14 meses' },
    'pt-BR': { oneYear: '1 ano', oneDay: '1 dia', cjDur: 'Variável (30 dias – 3 anos)', gygDur: 'Sessão–30 dias', popupDur: '7 dias (fechado) / persistente (inscrito)', gaDur: '14 meses' },
    'zh-CN': { oneYear: '1年', oneDay: '1天', cjDur: '不等（30天至3年）', gygDur: '会话至30天', popupDur: '7天（关闭后）/永久（订阅后）', gaDur: '14个月' },
    ko: { oneYear: '1년', oneDay: '1일', cjDur: '변동(30일~3년)', gygDur: '세션~30일', popupDur: '7일(닫힘)/영구(구독)', gaDur: '14개월' },
    fr: { oneYear: '1 an', oneDay: '1 jour', cjDur: 'Variable (30 jours – 3 ans)', gygDur: 'Session–30 jours', popupDur: '7 jours (fermé) / persistant (abonné)', gaDur: '14 mois' },
    it: { oneYear: '1 anno', oneDay: '1 giorno', cjDur: 'Variabile (30 giorni – 3 anni)', gygDur: 'Sessione–30 giorni', popupDur: '7 giorni (chiuso) / persistente (iscritto)', gaDur: '14 mesi' },
    nl: { oneYear: '1 jaar', oneDay: '1 dag', cjDur: 'Variabel (30 dagen – 3 jaar)', gygDur: 'Sessie–30 dagen', popupDur: '7 dagen (gesloten) / blijvend (geabonneerd)', gaDur: '14 maanden' },
    sv: { oneYear: '1 år', oneDay: '1 dag', cjDur: 'Varierar (30 dagar – 3 år)', gygDur: 'Session–30 dagar', popupDur: '7 dagar (stängd) / bestående (prenumererad)', gaDur: '14 månader' },
  };
  const d = durStrings[lang] ?? durStrings.en;

  const cookieTable = [
    { name: consentKey, type: t.typeEssential, purpose: p.consent, duration: d.oneYear },
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
    { name: '_gygwidget*, gyg_*', type: t.typeAffiliateGyg, purpose: p.gyg, duration: d.gygDur },
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
                <p className="text-xs text-snow/70 mt-2 font-mono">_gygwidget*, gyg_* · {t.gygDur}</p>
              </div>

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
            <p className="mt-3">{t.managing2}</p>
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
 * Kaikki tämän alapuolella oleva on `sessionRecording`-tekstiä (Microsoft Clarity), jota näyttää vain
 * sivusto, joka oikeasti lataa Clarityn (hubi). Crawlable-body-haravoija lukee tiedostosta JOKAISEN
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
