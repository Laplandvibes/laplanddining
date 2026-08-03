/**
 * The app announcement that runs across the network.
 *
 * Two variants, and the difference between them is deliberate:
 *
 *  `hero`  — a fixed block on the front page. Loud, always there, no dismissal.
 *  `nudge` — everywhere else. Appears only AFTER the reader has engaged (half the
 *            page scrolled, or 45 s, or the pointer leaving toward the tab bar),
 *            once per visitor, anchored to the bottom and never covering the page.
 *
 * 🔴 Why `nudge` is not an interstitial, even though an interstitial converts
 * better in the short run: Google demotes mobile pages whose content is covered
 * by a popup on arrival, and organic search is the engine of all 29 sites. A
 * banner that costs rankings costs more traffic than it converts. This shape —
 * triggered by engagement, bottom-anchored, one screen-third at most — is
 * outside that policy while still being impossible to miss.
 * (Vesa 2026-08-01 asked for a popup on every page; agreed to this instead.)
 *
 * The QR is a committed static asset (public/images/app-qr.svg), generated once
 * rather than rendered by a runtime library — 2 KB of SVG carrying its own white
 * card, so it scans on any background and costs no JavaScript on 29 sites.
 *
 * Numbers in the copy are counted from the app's own data, not invented.
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Smartphone, Download } from 'lucide-react';

/**
 * Locale straight from the URL, so this file drops into any site in the network
 * without importing that site's i18n helpers — the spokes do not all share the
 * hub's `useLocale` / `stripLocale`, and a promo block is not worth 26 forks.
 * Prefix != locale code for two of them: /br is pt-BR, /cn is zh-CN.
 */
const SEGMENT_LOCALE: Record<string, string> = {
  fi: 'fi', sv: 'sv', de: 'de', fr: 'fr', it: 'it', nl: 'nl',
  es: 'es', br: 'pt-BR', cn: 'zh-CN', ja: 'ja', ko: 'ko', kr: 'ko',
};

const localeFromPath = (pathname: string): string =>
  SEGMENT_LOCALE[pathname.split('/').filter(Boolean)[0] ?? ''] ?? 'en';

/** True on a site's front page in any locale: "/", "/fi", "/fi/". */
const isFrontPage = (pathname: string): boolean => {
  const segs = pathname.split('/').filter(Boolean);
  return segs.length === 0 || (segs.length === 1 && segs[0] in SEGMENT_LOCALE);
};

/** Arrives with ?install=1 so the app opens straight onto its install offer
 *  rather than a page that might get around to showing one. A site cannot
 *  trigger an install for another origin, so this is the shortest honest path
 *  between pressing "download" and having the app (Vesa 2026-08-01). */
const APP_URL = 'https://app.laplandvibes.com/?install=1&utm_source=web&utm_medium=promo';
const QR_SRC = '/images/app-qr.svg';
/** A real capture of the app's own front page, not a mockup. */
const SHOT_SRC = '/images/app-screenshot.webp';
const SEEN_KEY = 'lv_app_promo_seen';

type Copy = {
  eyebrow: string;
  title: string;
  /** The instruction. Without one the block described the app and asked nothing. */
  hype: string;
  lead: string;
  /** Labels for the counted figures. The numbers themselves are universal. */
  stats: [string, string, string, string];
  /** What you can actually do. Every one of these is a real screen in the app. */
  features: string[];
  cta: string;
  scan: string;
  free: string;
  dismiss: string;
};

/**
 * 🔴 Every number below is counted from the app's own data, never rounded up:
 * 31 municipalities, 211 slopes and 105 lifts across 9 resorts, 475 checked
 * places (120 restaurants, 85 shops, 47 cafes, 47 fuel stations, 39 gyms,
 * 37 ATMs, 37 bars, 33 pharmacies, 29 saunas). EV chargers come live from
 * /api/chargers, so they get no fixed figure.
 *
 * The excitement has to come from the scale being real. "Never before" is a
 * claim anyone can make; "211 slopes and the nearest charger, offline, free"
 * is one only we can make, and it is the more persuasive of the two.
 */
const COPY: Record<string, Copy> = {
  en: {
    eyebrow: 'New',
    title: 'All of Lapland. One app.',
    hype: 'Get the whole north in your pocket',
    lead: 'Nobody has put the whole of Finnish Lapland in one place before. Every municipality, every slope, every charger, every trailhead — and it still works when the signal does not.',
    stats: ['municipalities', 'slopes', 'lifts', 'checked places'],
    features: [
      'Slope and lift counts for nine resorts',
      'EV charging points and petrol stations',
      'Trails, wilderness huts and campsites',
      'Events from across Lapland',
      'Tickets kept in the app wallet',
      'Slope conditions from other skiers',
      'Flights, hotels and cars in one search',
      'Emergency numbers and nearest pharmacy',
    ],
    cta: 'Get the free app',
    scan: 'Scan to open on your phone',
    free: 'No account needed to browse',
    dismiss: 'Close',
  },
  fi: {
    eyebrow: 'Uutta',
    title: 'Koko Lappi. Yksi sovellus.',
    hype: 'Ota koko pohjoinen taskuusi',
    lead: 'Kukaan ei ole aiemmin koonnut koko Suomen Lappia yhteen paikkaan. Jokainen kunta, jokainen rinne, jokainen latausasema, jokainen reitin lähtöpaikka — ja se toimii silloinkin kun kenttää ei ole.',
    stats: ['kuntaa', 'rinnettä', 'hissiä', 'tarkistettua paikkaa'],
    features: [
      'Yhdeksän keskuksen rinteet ja hissit',
      'Sähköautojen latausasemat, huoltoasemat',
      'Vaellusreitit, autiotuvat, leirintä',
      'Tapahtumat koko Lapin alueelta',
      'Liput sovelluksen lompakossa',
      'Rinnetilanne muilta hiihtäjiltä',
      'Lennot, hotellit ja autot',
      'Hätänumerot ja lähin apteekki',
    ],
    cta: 'Lataa ilmainen sovellus',
    scan: 'Skannaa ja avaa puhelimessa',
    free: 'Selaaminen ei vaadi tiliä',
    dismiss: 'Sulje',
  },
  sv: {
    eyebrow: 'Nytt',
    title: 'Hela Lappland. En app.',
    hype: 'Ta hela norr i fickan',
    lead: 'Ingen har tidigare samlat hela finska Lappland på ett ställe. Varje kommun, varje backe, varje laddstation, varje ledstart — och det fungerar även när täckningen tar slut.',
    stats: ['kommuner', 'backar', 'liftar', 'kontrollerade platser'],
    features: [
      'Antal backar och liftar för nio orter',
      'Laddstationer för elbil och bensinstationer',
      'Leder, ödestugor och campingplatser',
      'Evenemang från hela Lappland',
      'Biljetter i appens plånbok',
      'Backförhållanden från andra åkare',
      'Flyg, hotell och bilar i en sökning',
      'Nödnummer och närmaste apotek',
    ],
    cta: 'Hämta appen gratis',
    scan: 'Skanna för att öppna i telefonen',
    free: 'Inget konto behövs för att bläddra',
    dismiss: 'Stäng',
  },
  de: {
    eyebrow: 'Neu',
    title: 'Ganz Lappland. Eine App.',
    hype: 'Hol dir den ganzen Norden in die Tasche',
    lead: 'Noch nie hat jemand das gesamte finnische Lappland an einem Ort versammelt. Jede Gemeinde, jede Piste, jede Ladesäule, jeder Wanderparkplatz — und es funktioniert auch dann, wenn kein Netz mehr da ist.',
    stats: ['Gemeinden', 'Pisten', 'Lifte', 'geprüfte Orte'],
    features: [
      'Pisten- und Liftzahlen für neun Gebiete',
      'Ladesäulen für E-Autos und Tankstellen',
      'Wege, Wildnishütten und Campingplätze',
      'Veranstaltungen aus ganz Lappland',
      'Tickets in der Wallet der App',
      'Pistenzustand von anderen Fahrern',
      'Flüge, Hotels und Autos in einer Suche',
      'Notrufnummern und nächste Apotheke',
    ],
    cta: 'Kostenlose App holen',
    scan: 'Zum Öffnen am Handy scannen',
    free: 'Zum Stöbern kein Konto nötig',
    dismiss: 'Schließen',
  },
  fr: {
    eyebrow: 'Nouveau',
    title: 'Toute la Laponie. Une appli.',
    hype: 'Tout le Grand Nord dans votre poche',
    lead: 'Personne n’avait encore réuni toute la Laponie finlandaise au même endroit. Chaque commune, chaque piste, chaque borne de recharge, chaque départ de sentier — et ça marche même sans réseau.',
    stats: ['communes', 'pistes', 'remontées', 'lieux vérifiés'],
    features: [
      'Pistes et remontées de neuf stations',
      'Bornes de recharge et stations-service',
      'Sentiers, refuges et campings',
      'Événements de toute la Laponie',
      'Billets dans le portefeuille de l’appli',
      'État des pistes par d’autres skieurs',
      'Vols, hôtels et voitures en une recherche',
      'Numéros d’urgence et pharmacie proche',
    ],
    cta: 'Obtenir l’appli gratuite',
    scan: 'Scannez pour ouvrir sur votre téléphone',
    free: 'Aucun compte requis pour parcourir',
    dismiss: 'Fermer',
  },
  es: {
    eyebrow: 'Nuevo',
    title: 'Toda Laponia. Una app.',
    hype: 'Todo el norte en tu bolsillo',
    lead: 'Nadie había reunido antes toda la Laponia finlandesa en un solo sitio. Cada municipio, cada pista, cada punto de recarga, cada inicio de ruta — y funciona también sin cobertura.',
    stats: ['municipios', 'pistas', 'remontes', 'lugares verificados'],
    features: [
      'Pistas y remontes de nueve estaciones',
      'Puntos de recarga y gasolineras',
      'Rutas, refugios y campings',
      'Eventos de toda Laponia',
      'Entradas en la cartera de la app',
      'Estado de pistas por otros esquiadores',
      'Vuelos, hoteles y coches en una búsqueda',
      'Emergencias y farmacia más cercana',
    ],
    cta: 'Consigue la app gratis',
    scan: 'Escanea para abrirla en tu móvil',
    free: 'No hace falta cuenta para explorar',
    dismiss: 'Cerrar',
  },
  it: {
    eyebrow: 'Novità',
    title: 'Tutta la Lapponia. Un’app.',
    hype: 'Tutto il nord in tasca',
    lead: 'Nessuno aveva mai riunito tutta la Lapponia finlandese in un unico posto. Ogni comune, ogni pista, ogni colonnina, ogni punto di partenza — e funziona anche quando il segnale non c’è.',
    stats: ['comuni', 'piste', 'impianti', 'luoghi verificati'],
    features: [
      'Piste e impianti di nove comprensori',
      'Colonnine per auto elettriche e distributori',
      'Sentieri, rifugi e campeggi',
      'Eventi da tutta la Lapponia',
      'Biglietti nel portafoglio dell’app',
      'Stato delle piste da altri sciatori',
      'Voli, hotel e auto in una ricerca',
      'Numeri d’emergenza e farmacia vicina',
    ],
    cta: 'Scarica l’app gratis',
    scan: 'Inquadra per aprirla sul telefono',
    free: 'Nessun account per navigare',
    dismiss: 'Chiudi',
  },
  nl: {
    eyebrow: 'Nieuw',
    title: 'Heel Lapland. Eén app.',
    hype: 'Het hele noorden in je zak',
    lead: 'Niemand heeft ooit heel Fins Lapland op één plek samengebracht. Elke gemeente, elke piste, elke laadpaal, elk startpunt — en het werkt ook als er geen bereik is.',
    stats: ['gemeenten', 'pistes', 'liften', 'gecontroleerde plekken'],
    features: [
      'Pistes en liften van negen gebieden',
      'Laadpalen voor elektrische auto’s en tankstations',
      'Routes, wildernishutten en campings',
      'Evenementen uit heel Lapland',
      'Tickets in de wallet van de app',
      'Pistestatus van andere skiërs',
      'Vluchten, hotels en auto’s in één zoektocht',
      'Alarmnummers en dichtstbijzijnde apotheek',
    ],
    cta: 'Haal de gratis app',
    scan: 'Scan om op je telefoon te openen',
    free: 'Geen account nodig om te bladeren',
    dismiss: 'Sluiten',
  },
  'pt-BR': {
    eyebrow: 'Novo',
    title: 'Toda a Lapônia. Um app.',
    hype: 'Todo o norte no seu bolso',
    lead: 'Ninguém havia reunido toda a Lapônia finlandesa em um só lugar. Cada município, cada pista, cada carregador, cada início de trilha — e funciona mesmo sem sinal.',
    stats: ['municípios', 'pistas', 'teleféricos', 'lugares verificados'],
    features: [
      'Pistas e teleféricos de nove estações',
      'Carregadores para carros elétricos e postos',
      'Trilhas, abrigos e campings',
      'Eventos de toda a Lapônia',
      'Ingressos na carteira do app',
      'Condições das pistas por outros esquiadores',
      'Voos, hotéis e carros em uma busca',
      'Emergências e farmácia mais próxima',
    ],
    cta: 'Baixar o app grátis',
    scan: 'Escaneie para abrir no celular',
    free: 'Não precisa de conta para navegar',
    dismiss: 'Fechar',
  },
  ja: {
    eyebrow: '新登場',
    title: 'ラップランドのすべてを、ひとつのアプリに。',
    hype: '北のすべてをポケットに',
    lead: 'フィンランド領ラップランド全体をひとつにまとめたアプリは、これまでありませんでした。すべての自治体、ゲレンデ、充電スタンド、登山口。電波が届かない場所でも使えます。',
    stats: ['自治体', 'ゲレンデ', 'リフト', '確認済みスポット'],
    features: [
      'スキー場9か所のゲレンデ数とリフト数',
      'EV充電スタンドとガソリンスタンド',
      'トレイル、無人小屋、キャンプ場',
      'ラップランド全域のイベント',
      'チケットはアプリのウォレットに',
      '他の滑走者によるゲレンデ状況',
      '航空券・ホテル・レンタカーを一度に検索',
      '緊急連絡先と最寄りの薬局',
    ],
    cta: '無料アプリを入手',
    scan: 'スキャンしてスマホで開く',
    free: '閲覧にアカウントは不要',
    dismiss: '閉じる',
  },
  ko: {
    eyebrow: '새로움',
    title: '라플란드 전체를, 하나의 앱에.',
    hype: '북쪽 전체를 주머니에',
    lead: '핀란드 라플란드 전체를 한곳에 모은 앱은 지금까지 없었습니다. 모든 지자체, 모든 슬로프, 모든 충전소, 모든 트레일 입구 — 신호가 없는 곳에서도 작동합니다.',
    stats: ['지자체', '슬로프', '리프트', '검증된 장소'],
    features: [
      '스키장 아홉 곳의 슬로프와 리프트 수',
      '전기차 충전소와 주유소',
      '트레일, 산장, 캠핑장',
      '라플란드 전역의 행사',
      '티켓은 앱 지갑에 보관',
      '다른 스키어들이 남긴 슬로프 상태',
      '항공·호텔·렌터카를 한 번에 검색',
      '긴급 전화번호와 가장 가까운 약국',
    ],
    cta: '무료 앱 받기',
    scan: '스캔해서 휴대폰에서 열기',
    free: '둘러보기에 계정 불필요',
    dismiss: '닫기',
  },
  'zh-CN': {
    eyebrow: '全新',
    title: '整个拉普兰，装进一个应用。',
    hype: '把整个北方装进口袋',
    lead: '此前从未有人把整个芬兰拉普兰装进一个地方。每个市镇、每条雪道、每个充电桩、每个步道起点 — 没有信号时它依然可用。',
    stats: ['市镇', '雪道', '缆车', '已核实地点'],
    features: [
      '九家滑雪场的雪道与缆车数量',
      '电动汽车充电桩与加油站',
      '步道、野外小屋与营地',
      '整个拉普兰的活动',
      '门票存放在应用卡包中',
      '来自其他雪友的雪道状况',
      '机票、酒店与租车一次搜完',
      '紧急电话与最近的药房',
    ],
    cta: '免费下载应用',
    scan: '扫码在手机上打开',
    free: '浏览无需账号',
    dismiss: '关闭',
  },
};

const copyFor = (locale: string): Copy => COPY[locale] ?? COPY.en;

/**
 * 🔴 The promo must look identical on every site in the network (Vesa
 * 2026-08-03: "kaikkialle samanlainen kuin laplandvibes.com etusivulla on").
 * Font-variant sites (carrental: Playfair/Inter) map `font-heading` to their
 * own face, which put this card's title and figures in a serif there — so the
 * display type names the network face directly instead of going through the
 * site's token, the same reasoning as the wordmark's `--font-logo` rule.
 * Every site already loads Bebas Neue for its wordmark, so this adds no fetch.
 */
const DISPLAY_FONT = { fontFamily: "'Bebas Neue', 'Arial Narrow', sans-serif" } as const;

function track(placement: string) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'app_promo_click', {
      placement,
    });
  } catch {
    /* analytics is never allowed to break a link */
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Front page: the fixed block.
   ────────────────────────────────────────────────────────────────────────── */
export function AppPromoHero() {
  const { pathname } = useLocation();
  const c = copyFor(localeFromPath(pathname));

  const FIGURES = ['31', '211', '105', '475'] as const;
  return (
    <section className="my-8 not-prose">
      <div className="relative overflow-hidden rounded-3xl border border-vibe-pink/40 bg-gradient-to-br from-[#4a1236] via-[#241a3f] to-[#123152] px-5 py-5 sm:px-7 sm:py-6">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-vibe-pink/25 blur-3xl" />

        {/* 🔴 THE SPLIT IS sm, NOT md (Vesa 2026-08-03: sites viewed at
            640–767 px showed this card with no screenshot and no QR at all —
            "miksi edelleen joillain sivuilla nämä mainokset näkyy ilman kuvaa
            ja qr koodia?"). The old md split left a band, 640–767, where the
            in-heading thumbnail had already bowed out but the side block had
            not yet arrived; narrow desktop panes and small tablets live
            exactly there. From 640 up the side block is always present —
            stacked vertically (shot over QR, ~132 px of width) until lg,
            side by side from 1024 exactly as before. */}
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-7 lg:gap-9">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-vibe-pink px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  <Smartphone className="h-3 w-3" />
                  {c.eyebrow}
                </span>

                <h2 style={DISPLAY_FONT} className="tracking-wide text-snow text-[1.9rem] sm:text-[2.75rem] mt-3 leading-[0.98]">
                  {c.title}
                </h2>

                {/* The scale is the argument, so it sits directly under the title. */}
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5">
                  {FIGURES.map((n, i) => (
                    <div key={n} className="flex items-baseline gap-1.5">
                      <span style={DISPLAY_FONT} className="tracking-wide text-vibe-pink text-2xl sm:text-3xl leading-none">
                        {n}
                      </span>
                      <span className="text-snow/65 text-[11px] sm:text-xs">{c.stats[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* The product itself, beside the whole opening block.
                  🔴 sm:hidden, not lg:hidden. This thumbnail only sits INSIDE
                  the heading row, so anything it narrows (eyebrow, h2, stats)
                  stops lining up with the bullets and CTA below it. On a real
                  phone that costs little and the image earns its place; from
                  640 up the side media block takes over. */}
              <div className="relative shrink-0 sm:hidden">
                <div aria-hidden className="absolute -inset-2 rounded-[24px] bg-vibe-pink/20 blur-2xl" />
                <img
                  src={SHOT_SRC}
                  alt={c.title}
                  width={234}
                  height={507}
                  loading="lazy"
                  className="relative w-[86px] h-auto rounded-[14px] border-2 border-white/15 shadow-2xl"
                />
              </div>
            </div>

            {/* A grid, not free-flowing pills: wrapping pills produced ragged rows of
                different lengths and read as a heap. Two aligned columns, one item
                per cell, same rhythm on every row. */}
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {[...c.features].sort((a, b) => a.length - b.length).map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] leading-[1.45] text-snow/85">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-vibe-pink" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <p style={DISPLAY_FONT} className="mt-5 tracking-wide text-aurora-green text-lg sm:text-xl leading-none">
              {c.hype}
            </p>

            <div className="mt-3">
              <a
                href={APP_URL}
                onClick={() => track('hero')}
                className="inline-flex items-center gap-2 rounded-full bg-vibe-pink px-7 py-3.5 text-base sm:text-lg font-bold text-white shadow-[0_10px_30px_-8px_rgba(236,72,153,0.7)] transition-transform active:scale-[0.98] hover:bg-pink-500"
              >
                <Download className="h-5 w-5" />
                {c.cta}
              </a>
            </div>
            <p className="mt-2.5 text-snow/55 text-[11px]">{c.free}</p>
          </div>

          {/* The product itself. A screenshot argues better than the eight lines
              beside it, so it gets the second half of the block on wide screens
              and leads on a phone.
              🔴 Both the screenshot AND the QR are visible from 640 up (Vesa
              2026-08-03). Stacking them vertically is what makes that possible:
              the column costs ~132 px whatever it holds, where the old
              side-by-side row (168 + 144 + gap ≈ 330 px) was the reason the QR
              had to hide below 1024. From lg the row returns at full size. */}
          <div className="hidden sm:flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-5 shrink-0">
            <div className="relative shrink-0">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-[32px] bg-vibe-pink/20 blur-2xl"
              />
              <img
                src={SHOT_SRC}
                alt={c.title}
                width={234}
                height={507}
                loading="lazy"
                className="relative w-[132px] lg:w-[168px] h-auto rounded-[18px] border-2 border-white/15 shadow-2xl"
              />
            </div>

            {/* QR is pointless below sm only: you cannot scan the screen in
                your hand, so the phone layout keeps its in-heading thumbnail
                and no QR. Everywhere else the QR ships with the screenshot. */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={QR_SRC}
                alt=""
                width={144}
                height={144}
                loading="lazy"
                className="h-24 w-24 lg:h-36 lg:w-36 rounded-2xl bg-white p-2 shadow-xl"
              />
              <span className="text-snow/60 text-[11px] text-center max-w-[132px] lg:max-w-[144px] leading-snug">
                {c.scan}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Everywhere else: the engagement-triggered card.
   ────────────────────────────────────────────────────────────────────────── */
export function AppPromoNudge() {
  const location = useLocation();
  const c = copyFor(localeFromPath(location.pathname));
  const [show, setShow] = useState(false);

  // The front page already carries the fixed hero. Asking twice on one screen
  // reads as pestering and makes the hero look like it failed.
  const onFrontPage = isFrontPage(location.pathname);

  useEffect(() => {
    if (onFrontPage) return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return; // private mode: never nag rather than nag on every page
    }

    let done = false;
    let retry = 0;

    // 🔴 Never two asks at once. The newsletter popup is a real modal
    // (role="dialog" aria-modal) that fires at 60 s / 60 % scroll, and this card
    // fires earlier — so without this check a reader could get both stacked, and
    // the one they did not choose becomes the reason they leave. If a modal is
    // up when our moment arrives, we wait and try again rather than compete.
    const modalUp = () => Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'));

    const fire = () => {
      if (done) return;
      if (modalUp()) {
        if (retry++ > 20) return cleanup(); // ~2 min of company: give this visit up
        window.setTimeout(fire, 6_000);
        return;
      }
      done = true;
      setShow(true);
      cleanup();
    };

    // Half the page read, 45 s spent, or the pointer heading for the tab bar —
    // all three mean "engaged", which is the moment an ask is welcome rather
    // than an obstacle.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.5) fire();
    };
    const onExit = (e: MouseEvent) => {
      if (e.clientY <= 0) fire();
    };
    const timer = window.setTimeout(fire, 45_000);

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onExit);
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onExit);
    }
    return cleanup;
  }, [onFrontPage]);

  const close = () => {
    setShow(false);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* */
    }
  };

  /** Same destination and same bookkeeping wherever the button lands — the
   *  phone layout puts it on its own row, the wide one keeps it inline. */
  const openApp = () => {
    track('nudge');
    close();
  };

  // 🔴 The front-page check has to be here too, not only in the effect. The
  // effect decides whether to START showing; it cannot un-show a card that is
  // already up. Arrive on a subpage, let the card appear, then navigate to the
  // front page and it rode along — on top of the hero that already makes this
  // exact offer (Vesa 2026-08-01: "se tulee itse asiassa laplandvibes sivulle
  // myös nyt").
  if (!show || onFrontPage) return null;

  return (
    <div
      role="complementary"
      aria-label={c.title}
      className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] animate-[lvSlideUp_0.35s_cubic-bezier(.22,1,.36,1)]"
    >
      <style>{`@keyframes lvSlideUp{from{transform:translateY(110%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <div className="mx-auto max-w-2xl rounded-2xl border-2 border-white/25 bg-gradient-to-r from-vibe-pink to-pink-600 px-4 py-3.5 sm:py-4 shadow-[0_-10px_50px_-10px_rgba(236,72,153,0.85)]">
        {/* 🔴 The button cannot share a row with the words on a phone. It is
            shrink-0 and ~190 px wide; with the 44 px icon, the close button and
            three gaps that comes to 305 px of the 303 px a 375 px screen leaves,
            so the text column collapsed to 10 px and set one word per line — a
            209 px bar, a quarter of the screen, almost all of it wrapped text.
            Below sm the button takes a full-width row of its own, and the hype
            line steps aside there because the button already says it. */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          <span className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl bg-white/20">
            <Download className="h-5 w-5 text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold text-[15px] leading-snug text-pretty">{c.title}</p>
            <p className="hidden sm:block text-white/85 text-xs mt-0.5">{c.hype}</p>
          </div>
          <a
            href={APP_URL}
            onClick={openApp}
            className="hidden sm:inline-flex shrink-0 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-vibe-pink shadow-md active:scale-[0.98] transition-transform"
          >
            {c.cta}
          </a>
          <button
            onClick={close}
            aria-label={c.dismiss}
            className="shrink-0 rounded-full p-1.5 text-white/70 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <a
          href={APP_URL}
          onClick={openApp}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-vibe-pink no-underline shadow-md transition-transform active:scale-[0.98] sm:hidden"
        >
          <Download className="h-4 w-4" />
          {c.cta}
        </a>
      </div>
    </div>
  );
}
