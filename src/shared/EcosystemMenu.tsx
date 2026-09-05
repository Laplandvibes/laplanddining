import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import APP_STATS from './appStats';
import { LayoutGrid, ChevronDown, ArrowUpRight, MapPin, Search, X, BedDouble, Compass, UtensilsCrossed, Car, Sparkles, ShoppingBag, BookOpen, Download } from 'lucide-react';

/**
 * EcosystemMenu — the network jump-menu that sits to the LEFT of the logo on
 * every ecosystem site (Vesa 2026-07-03). v2 (Vesa 2026-09-05, "todella
 * epäselvä … teksti leikkaantuu … eri näyttöko'oilla ei optimointia"):
 *
 *   - sites are GROUPED under visible headings in trip order (CAT_ORDER), not
 *     one alphabetical list whose order changed per language;
 *   - a search box filters by localised name, Finnish, English and domain;
 *   - desktop (≥768 px): one wide panel, all 27 sites + the app visible at once
 *     without an inner scrollbar (1280×800: 631 px tall, 4 columns);
 *   - phone (<768 px): a full-screen sheet with a sticky header (wordmark,
 *     close, search), 50 px rows, body scroll locked;
 *   - names are never truncated — the column is sized for the longest name in
 *     any of the 12 languages (es "Gastronomía y productos locales", 216 px);
 *   - the current site is marked IN PLACE inside its group ("Olet tässä");
 *   - lapland.blog and the app (footer's "Get the app") are in the menu.
 *
 * v2.1 (Vesa 2026-09-05 evening, "liian samanlaisia kaikki, valkoinen puurouttaa
 * kaiken, 1–2 hierarkiaa väreissä, taustoja"): every group is a CARD with a
 * tinted background and border in its category colour, the group title is set
 * in that colour with a category icon, rows keep snow names + dimmer domains.
 * Four visible levels instead of one wall of white text.
 *
 * v2.2 (Vesa, same evening, "laatikot on eri kokoisia ja ei istu hyvin"): the
 * CSS column flow is replaced by a 4-column GRID whose cards stretch to the
 * same height within a row. MENU_ORDER puts the four tallest groups on the
 * top row (4/6/4/4 sites) and the three 3-site groups + the app tile on the
 * bottom row, so no card sits under a tall neighbour with a long empty tail.
 *
 * v2.3 (Vesa: "lataa sovellus on poor"): the app cell is a real promo tile —
 * title + counted figures (./appStats) + CTA + the app's own screenshot rising
 * from the bottom edge; copy verbatim from the hub's AppPromo in 12 languages.
 *
 * v2.4 (Vesa, laplandgifts on a 2560 px screen, "mitoitettu ihan päin
 * persettä"): the desktop panel takes the width and position of the header's
 * content column (the site's max-width container), so it lines up with the
 * logo and nav on any screen instead of being a fixed 1160 px box beside the
 * trigger.
 *
 * v2.5 (Vesa, hub: "toi app kuva menee ruudusta ohi"): the phone screenshot
 * sits fully inside the app tile in its own frame instead of rising out of the
 * tile's bottom edge — the crop read as a broken image on a big screen.
 *
 * SHARED across all sites, so it is THEME-INDEPENDENT: brand colours are inline
 * hex, and ALL layout lives in the scoped <style> block below (no Tailwind
 * utilities — a class that a site's Tailwind scan does not emit silently does
 * nothing, which is how the 44 px mobile tap target went missing on live sites
 * before v2). Pass `lang` (locale string) + `currentDomain` per site.
 *
 * The open panel is rendered through a portal onto <body>: several site
 * headers use `backdrop-filter`, which turns a `position: fixed` descendant
 * into a header-relative box, so a full-screen sheet inside the header would
 * be 64 px tall.
 *
 * 🔴 SITES + NAME_I18N are parsed by regex in every site's
 * scripts/_prerender_crawlable_body.mjs (hub label per locale). Keep the row
 * format `{ domain: '…', cat: '…', fi: '…', en: '…' }` and NAME_I18N as one
 * JSON line.
 */

const PINK = '#EC4899';
/**
 * 🔴 FILLED pink surfaces use PINK_FILL, not PINK.
 *
 * Measured 2026-08-02 (canvas-composited, not eyeballed): white on the brand
 * pink #EC4899 is 3.53:1. Every filled pill in this file carries text at
 * 9–14 px, i.e. NORMAL text by WCAG — the 3:1 large-text floor does not apply,
 * 4.5:1 does.
 *
 *   white on #EC4899 (brand pink) = 3.53:1  ✗
 *   white on #DB2777 (pink-600)   = 4.63:1  ✓
 *
 * PINK is unchanged and still correct for hairlines, gradients, icons and
 * borders — non-text UI, where the floor is 3:1 and #EC4899 clears it.
 */
const PINK_FILL = '#DB2777';
const SNOW = '#F9FAFB';
const HUB = 'laplandvibes.com';
const APP = 'app.laplandvibes.com';
/** Same landing as the network-wide AppPromo: opens straight onto the install offer. */
const APP_URL = 'https://app.laplandvibes.com/?install=1&utm_source=web&utm_medium=network_menu';
/** The app's own front page, a real capture (shipped as public/images on every site by AppPromo). */
const APP_SHOT = '/images/app-screenshot.webp';

/**
 * Network wordmark font. The `#LAPLANDVIBES` lockup is ALWAYS Bebas Neue, on
 * every site, including the variant-font sites (weddings + luxuryvillas use
 * Cormorant Garamond, carrental/gifts/store/stayinlapland use Playfair,
 * lapland-blog uses Manrope, nightlife uses Space Grotesk). The stack degrades
 * safely: if Bebas Neue is not loaded on a given site the mark falls back to
 * that site's own heading font (`--font-heading`), then to a condensed sans.
 */
const WORDMARK_FONT = "'Bebas Neue', var(--font-heading, 'Arial Narrow'), sans-serif";
const BODY_FONT = "'DM Sans', var(--font-body, system-ui), sans-serif";

export type Cat = 'stay' | 'activity' | 'food' | 'transport' | 'season' | 'shopping' | 'guide' | 'hub';

const CAT_RGB: Record<Cat, string> = {
  stay: '236, 72, 153',       // vibe pink
  activity: '6, 182, 212',    // arctic cyan
  food: '249, 115, 22',       // orange
  transport: '147, 197, 253', // sky blue
  season: '52, 211, 153',     // aurora green
  shopping: '167, 139, 250',  // violet
  guide: '251, 191, 36',      // amber (v2.1: was cyan-bright, indistinguishable from activity's cyan on tinted cards)
  hub: '236, 72, 153',        // pink
};

export interface Site { domain: string; cat: Cat; fi: string; en: string }

// Grouped at render by `cat` in CAT_ORDER. Names bilingual (fi/en); the other
// ten locales live in NAME_I18N. The hub row stays here for the prerender
// reader even though the menu renders the hub as its wordmark, not as a row.
export const SITES: Site[] = [
  { domain: 'laplandvibes.com',        cat: 'hub',       fi: 'Etusivu (verkoston keskus)', en: 'Hub (network home)' },
  { domain: 'stayinlapland.com',       cat: 'stay',      fi: 'Majoitus Lapissa',           en: 'Stay in Lapland' },
  { domain: 'laplandstays.com',        cat: 'stay',      fi: 'Mökit ja majoitus',          en: 'Cabins & stays' },
  { domain: 'laplandhoteldeals.com',   cat: 'stay',      fi: 'Hotellitarjoukset',          en: 'Hotel deals' },
  { domain: 'laplandluxuryvillas.com', cat: 'stay',      fi: 'Luksushuvilat',              en: 'Luxury villas' },
  { domain: 'laplandhuskysafaris.com', cat: 'activity',  fi: 'Huskysafarit',               en: 'Husky safaris' },
  { domain: 'laplandsnowmobile.com',   cat: 'activity',  fi: 'Moottorikelkkailu',          en: 'Snowmobiling' },
  { domain: 'laplandskiresorts.com',   cat: 'activity',  fi: 'Laskettelu ja hiihtokeskukset', en: 'Ski resorts' },
  { domain: 'laplandactivities.fi',cat: 'activity',  fi: 'Tekeminen ja retket',        en: 'Activities & tours' },
  { domain: 'laplandtours.online',     cat: 'activity',  fi: 'Opastetut retket',           en: 'Guided tours' },
  { domain: 'laplandkids.com',         cat: 'activity',  fi: 'Perhematkailu',              en: 'Family travel' },
  { domain: 'laplanddining.com',       cat: 'food',      fi: 'Ravintolat',                 en: 'Dining' },
  { domain: 'laplandfood.com',         cat: 'food',      fi: 'Ruoka ja lähiruoka',         en: 'Food & local produce' },
  { domain: 'laplandbars.com',         cat: 'food',      fi: 'Baarit ja pienpanimot',      en: 'Bars & breweries' },
  { domain: 'laplandtransport.com',    cat: 'transport', fi: 'Kuljetus',                   en: 'Transport' },
  { domain: 'laplandcarrental.com',    cat: 'transport', fi: 'Autovuokraus',               en: 'Car rental' },
  { domain: 'laplandflights.fi',       cat: 'transport', fi: 'Lennot Lappiin',             en: 'Flights to Lapland' },
  { domain: 'laplandchristmas.com',    cat: 'season',    fi: 'Joulu',                      en: 'Christmas' },
  { domain: 'laplandwellness.com',     cat: 'season',    fi: 'Hyvinvointi ja kylpylät',    en: 'Wellness & spa' },
  { domain: 'laplandnightlife.com',    cat: 'season',    fi: 'Yöelämä',                    en: 'Nightlife' },
  { domain: 'laplandweddings.online',  cat: 'season',    fi: 'Häät',                       en: 'Weddings' },
  { domain: 'laplandgifts.com',        cat: 'shopping',  fi: 'Lahjat ja matkamuistot',     en: 'Gifts & souvenirs' },
  { domain: 'laplanddeals.com',        cat: 'shopping',  fi: 'Tarjoukset',                 en: 'Deals & offers' },
  { domain: 'laplandstore.fi',         cat: 'shopping',  fi: 'Verkkokauppa',               en: 'Store' },
  { domain: 'laplandvisit.com',        cat: 'guide',     fi: 'Matkaopas',                  en: 'Travel guide' },
  { domain: 'laplandnature.com',       cat: 'guide',     fi: 'Luonto ja kansallispuistot', en: 'Nature & parks' },
  { domain: 'laplandwork.com',         cat: 'guide',     fi: 'Työ Lapissa',                en: 'Work in Lapland' },
  { domain: 'lapland.blog',           cat: 'guide',     fi: 'Matkablogi',                 en: 'Travel blog' },
];

const NAME_I18N: Record<string, Record<string, string>> = {"laplandvibes.com":{"de":"Zentrale (Netzwerk-Startseite)","ja":"ハブ（ネットワークの拠点）","es":"Inicio (centro de la red)","pt-BR":"Início (centro da rede)","zh-CN":"主站（网络主页）","ko":"메인 사이트(네트워크 홈)","fr":"Accueil (centre du réseau)","it":"Hub (centro della rete)","nl":"Hub (netwerkcentrum)","sv":"Nav (nätverkets startsida)"},"stayinlapland.com":{"de":"Übernachten in Lappland","ja":"ラップランドで泊まる","es":"Alojamiento en Laponia","pt-BR":"Hospedagem na Lapônia","zh-CN":"拉普兰住宿","ko":"라플란드 숙박","fr":"Séjour en Laponie","it":"Soggiorno in Lapponia","nl":"Verblijf in Lapland","sv":"Bo i Lappland"},"laplandstays.com":{"de":"Hütten & Unterkünfte","ja":"コテージと宿泊","es":"Cabañas y alojamiento","pt-BR":"Chalés e hospedagem","zh-CN":"小木屋与住宿","ko":"오두막과 숙소","fr":"Chalets et hébergements","it":"Chalet e alloggi","nl":"Vakantiehuisjes & verblijven","sv":"Stugor & boenden"},"laplandhoteldeals.com":{"de":"Hotelangebote","ja":"ホテルのお得情報","es":"Ofertas de hoteles","pt-BR":"Ofertas de hotéis","zh-CN":"酒店优惠","ko":"호텔 특가","fr":"Offres d'hôtels","it":"Offerte hotel","nl":"Hotelaanbiedingen","sv":"Hotellerbjudanden"},"laplandluxuryvillas.com":{"de":"Luxusvillen","ja":"ラグジュアリーヴィラ","es":"Villas de lujo","pt-BR":"Vilas de luxo","zh-CN":"豪华别墅","ko":"럭셔리 빌라","fr":"Villas de luxe","it":"Ville di lusso","nl":"Luxe villa's","sv":"Lyxvillor"},"laplandhuskysafaris.com":{"de":"Husky-Safaris","ja":"ハスキーサファリ","es":"Safaris con huskies","pt-BR":"Safáris de huskies","zh-CN":"哈士奇雪橇之旅","ko":"허스키 사파리","fr":"Safaris en traîneau de huskies","it":"Safari con husky","nl":"Husky-safari's","sv":"Huskysafarier"},"laplandsnowmobile.com":{"de":"Schneemobilfahren","ja":"スノーモービル","es":"Motos de nieve","pt-BR":"Passeios de moto de neve","zh-CN":"雪地摩托","ko":"스노모빌","fr":"Motoneige","it":"Motoslitta","nl":"Sneeuwscooteren","sv":"Snöskoteråkning"},"laplandskiresorts.com":{"de":"Skigebiete","ja":"スキーリゾート","es":"Estaciones de esquí","pt-BR":"Estações de esqui","zh-CN":"滑雪度假村","ko":"스키 리조트","fr":"Stations de ski","it":"Stazioni sciistiche","nl":"Skigebieden","sv":"Skidorter"},"laplandactivities.fi":{"de":"Aktivitäten & Touren","ja":"アクティビティとツアー","es":"Actividades y excursiones","pt-BR":"Atividades e passeios","zh-CN":"活动与游览","ko":"액티비티와 투어","fr":"Activités et excursions","it":"Attività ed escursioni","nl":"Activiteiten & tours","sv":"Aktiviteter & turer"},"laplandtours.online":{"de":"Geführte Touren","ja":"ガイドツアー","es":"Tours guiados","pt-BR":"Passeios guiados","zh-CN":"导览行程","ko":"가이드 투어","fr":"Visites guidées","it":"Tour guidati","nl":"Begeleide tours","sv":"Guidade turer"},"laplanddining.com":{"de":"Essen gehen","ja":"レストラン","es":"Restaurantes","pt-BR":"Restaurantes","zh-CN":"餐饮","ko":"다이닝","fr":"Restaurants","it":"Ristoranti","nl":"Uit eten","sv":"Äta ute"},"laplandfood.com":{"de":"Essen & regionale Produkte","ja":"食と地元の食材","es":"Gastronomía y productos locales","pt-BR":"Comida e produtos locais","zh-CN":"美食与当地特产","ko":"음식과 로컬 식재료","fr":"Cuisine et produits locaux","it":"Cibo e prodotti locali","nl":"Eten & streekproducten","sv":"Mat & lokala produkter"},"laplandbars.com":{"de":"Bars & Brauereien","ja":"バーとブルワリー","es":"Bares y cervecerías","pt-BR":"Bares e cervejarias","zh-CN":"酒吧与啤酒厂","ko":"바와 브루어리","fr":"Bars et brasseries","it":"Bar e birrifici","nl":"Bars & brouwerijen","sv":"Barer & bryggerier"},"laplandtransport.com":{"de":"Transport","ja":"交通","es":"Transporte","pt-BR":"Transporte","zh-CN":"交通","ko":"교통","fr":"Transport","it":"Trasporti","nl":"Vervoer","sv":"Transport"},"laplandcarrental.com":{"de":"Autovermietung","ja":"レンタカー","es":"Alquiler de autos","pt-BR":"Aluguel de carros","zh-CN":"租车","ko":"렌터카","fr":"Location de voiture","it":"Autonoleggio","nl":"Autoverhuur","sv":"Biluthyrning"},"laplandchristmas.com":{"de":"Weihnachten","ja":"クリスマス","es":"Navidad","pt-BR":"Natal","zh-CN":"圣诞","ko":"크리스마스","fr":"Noël","it":"Natale","nl":"Kerstmis","sv":"Jul"},"laplandwellness.com":{"de":"Wellness & Spa","ja":"ウェルネスとスパ","es":"Bienestar y spa","pt-BR":"Bem-estar e spa","zh-CN":"养生与水疗","ko":"웰니스와 스파","fr":"Bien-être et spa","it":"Benessere e spa","nl":"Wellness & spa","sv":"Wellness & spa"},"laplandnightlife.com":{"de":"Nachtleben","ja":"ナイトライフ","es":"Vida nocturna","pt-BR":"Vida noturna","zh-CN":"夜生活","ko":"나이트라이프","fr":"Vie nocturne","it":"Vita notturna","nl":"Uitgaansleven","sv":"Nattliv"},"laplandweddings.online":{"de":"Hochzeiten","ja":"ウェディング","es":"Bodas","pt-BR":"Casamentos","zh-CN":"婚礼","ko":"웨딩","fr":"Mariages","it":"Matrimoni","nl":"Bruiloften","sv":"Bröllop"},"laplandgifts.com":{"de":"Geschenke & Souvenirs","ja":"ギフトとお土産","es":"Regalos y recuerdos","pt-BR":"Presentes e lembranças","zh-CN":"礼品与纪念品","ko":"선물과 기념품","fr":"Cadeaux et souvenirs","it":"Regali e souvenir","nl":"Cadeaus & souvenirs","sv":"Presenter & souvenirer"},"laplanddeals.com":{"de":"Angebote & Deals","ja":"セールとお得情報","es":"Ofertas y promociones","pt-BR":"Ofertas e promoções","zh-CN":"优惠与特价","ko":"할인과 특가","fr":"Bons plans et offres","it":"Offerte e promozioni","nl":"Deals & aanbiedingen","sv":"Erbjudanden & deals"},"laplandstore.fi":{"de":"Onlineshop","ja":"オンラインストア","es":"Tienda online","pt-BR":"Loja online","zh-CN":"在线商店","ko":"온라인 스토어","fr":"Boutique en ligne","it":"Negozio online","nl":"Webshop","sv":"Webbutik"},"laplandvisit.com":{"de":"Reiseführer","ja":"旅行ガイド","es":"Guía de viaje","pt-BR":"Guia de viagem","zh-CN":"旅行指南","ko":"여행 가이드","fr":"Guide de voyage","it":"Guida di viaggio","nl":"Reisgids","sv":"Reseguide"},"laplandnature.com":{"de":"Natur & Nationalparks","ja":"自然と国立公園","es":"Naturaleza y parques","pt-BR":"Natureza e parques","zh-CN":"自然与国家公园","ko":"자연과 국립공원","fr":"Nature et parcs","it":"Natura e parchi","nl":"Natuur & parken","sv":"Natur & nationalparker"},"laplandkids.com":{"de":"Familienreisen","ja":"家族旅行","es":"Viajes en familia","pt-BR":"Viagens em família","zh-CN":"亲子旅行","ko":"가족 여행","fr":"Voyages en famille","it":"Viaggi in famiglia","nl":"Gezinsreizen","sv":"Familjeresor"},"laplandflights.fi":{"de":"Flüge nach Lappland","ja":"ラップランドへの航空券","es":"Vuelos a Laponia","pt-BR":"Voos para a Lapônia","zh-CN":"飞往拉普兰的航班","ko":"라플란드행 항공편","fr":"Vols vers la Laponie","it":"Voli per la Lapponia","nl":"Vluchten naar Lapland","sv":"Flyg till Lappland"},"laplandwork.com":{"de":"Arbeiten in Lappland","ja":"ラップランドで働く","es":"Trabajar en Laponia","pt-BR":"Trabalhar na Lapônia","zh-CN":"在拉普兰工作","ko":"라플란드에서 일하기","fr":"Travailler en Laponie","it":"Lavorare in Lapponia","nl":"Werken in Lapland","sv":"Jobba i Lappland"},"lapland.blog":{"de":"Reiseblog","ja":"旅行ブログ","es":"Blog de viajes","pt-BR":"Blog de viagem","zh-CN":"旅行博客","ko":"여행 블로그","fr":"Blog voyage","it":"Blog di viaggio","nl":"Reisblog","sv":"Reseblogg"}};
/** App tile copy, verbatim from laplandvibes/src/components/AppPromo.tsx COPY (title, stats[0..2], cta). Numbers come from ./appStats, never typed here. */
const APP_I18N: Record<string, { title: string; stats: string[]; cta: string }> = {"en":{"title":"All of Lapland. One app.","stats":["destinations","slopes","lifts"],"cta":"Get the free app"},"fi":{"title":"Koko Lappi. Yksi sovellus.","stats":["kohdetta","rinnettä","hissiä"],"cta":"Lataa ilmainen sovellus"},"sv":{"title":"Hela Lappland. En app.","stats":["resmål","backar","liftar"],"cta":"Hämta appen gratis"},"de":{"title":"Ganz Lappland. Eine App.","stats":["Ziele","Pisten","Lifte"],"cta":"Kostenlose App holen"},"fr":{"title":"Toute la Laponie. Une appli.","stats":["destinations","pistes","remontées"],"cta":"Obtenir l’appli gratuite"},"es":{"title":"Toda Laponia. Una app.","stats":["destinos","pistas","remontes"],"cta":"Consiga la app gratis"},"it":{"title":"Tutta la Lapponia. Un’app.","stats":["destinazioni","piste","impianti"],"cta":"Scarica l’app gratis"},"nl":{"title":"Heel Lapland. Eén app.","stats":["bestemmingen","pistes","liften"],"cta":"Haal de gratis app"},"pt-BR":{"title":"Toda a Lapônia. Um app.","stats":["destinos","pistas","teleféricos"],"cta":"Baixar o app grátis"},"ja":{"title":"ラップランドのすべてを、ひとつのアプリに。","stats":["目的地","ゲレンデ","リフト"],"cta":"無料アプリを入手"},"ko":{"title":"라플란드 전체를, 하나의 앱에.","stats":["목적지","슬로프","리프트"],"cta":"무료 앱 받기"},"zh-CN":{"title":"整个拉普兰，装进一个应用。","stats":["目的地","雪道","缆车"],"cta":"免费下载应用"}};
const CHROME_I18N: Record<string, Record<string, string>> = {"label":{"de":"Netzwerk","ja":"ネットワーク","es":"Red","pt-BR":"Rede","zh-CN":"站点网络","ko":"네트워크","fr":"Réseau","it":"Rete","nl":"Netwerk","sv":"Nätverk"},"heading":{"de":"Das gesamte Lappland-Netzwerk","ja":"ラップランド・ネットワーク全体","es":"Toda la red de Laponia","pt-BR":"Toda a rede da Lapônia","zh-CN":"整个拉普兰站点网络","ko":"라플란드 네트워크 전체","fr":"Tout le réseau Laponie","it":"Tutta la rete Lapponia","nl":"Het hele Lapland-netwerk","sv":"Hela Lappland-nätverket"},"here":{"de":"Sie sind hier","ja":"現在のページ","es":"Está aquí","pt-BR":"Você está aqui","zh-CN":"当前位置","ko":"현재 위치","fr":"Vous êtes ici","it":"Si trova qui","nl":"U bent hier","sv":"Du är här"},"hint":{"de":"Alle Seiten des Netzwerks: hier!","ja":"ネットワークの全サイトはここから！","es":"¡Todos los sitios de la red, aquí!","pt-BR":"Todos os sites da rede: aqui!","zh-CN":"整个站点网络都在这里！","ko":"네트워크의 모든 사이트가 여기에!","fr":"Tous les sites du réseau: ici !","it":"Tutti i siti della rete: qui!","nl":"Alle sites van het netwerk: hier!","sv":"Alla sajter i nätverket: här!"},"jump":{"de":"Zu einer Seite wechseln","ja":"サイトへ移動","es":"Ir a un sitio","pt-BR":"Ir para um site","zh-CN":"前往站点","ko":"사이트로 이동","fr":"Aller sur un site","it":"Vai a un sito","nl":"Ga naar een site","sv":"Gå till en sajt"},"search":{"de":"Website suchen…","ja":"サイトを検索…","es":"Buscar sitio…","pt-BR":"Buscar site…","zh-CN":"搜索站点…","ko":"사이트 검색…","fr":"Rechercher un site…","it":"Cerca un sito…","nl":"Site zoeken…","sv":"Sök sajt…"},"noResults":{"de":"Keine Treffer.","ja":"該当なし","es":"Sin resultados.","pt-BR":"Sem resultados.","zh-CN":"无匹配结果","ko":"검색 결과 없음","fr":"Aucun résultat.","it":"Nessun risultato.","nl":"Geen resultaten.","sv":"Inga träffar."},"close":{"de":"Schließen","ja":"閉じる","es":"Cerrar","pt-BR":"Fechar","zh-CN":"关闭","ko":"닫기","fr":"Fermer","it":"Chiudi","nl":"Sluiten","sv":"Stäng"},"getApp":{"de":"App holen","ja":"アプリを入手","es":"Descargar la app","pt-BR":"Baixar o app","zh-CN":"获取应用","ko":"앱 받기","fr":"Obtenir l'app","it":"Scarica l'app","nl":"Download de app","sv":"Hämta appen"}};

/**
 * Category order for presenting the whole network: the reader's own trip
 * order — where you sleep, what you do, what you eat, how you move.
 */
export const CAT_ORDER: Cat[] = ['hub', 'stay', 'activity', 'food', 'transport', 'season', 'shopping', 'guide'];

/**
 * Localised category headings. Generic nouns only — no place names, so the
 * Swedish place-name trap (Åbo vs Turku) does not apply here.
 */
const CAT_I18N: Record<Cat, Record<string, string>> = {
  hub:       { en: 'Network hub', fi: 'Verkoston keskus', de: 'Netzwerk-Zentrale', ja: 'ネットワークの拠点', es: 'Centro de la red', 'pt-BR': 'Central da rede', 'zh-CN': '网络主页', ko: '네트워크 허브', fr: 'Centre du réseau', it: 'Centro della rete', nl: 'Netwerkcentrum', sv: 'Nätverkets nav' },
  stay:      { en: 'Stay', fi: 'Majoitus', de: 'Übernachten', ja: '泊まる', es: 'Alojamiento', 'pt-BR': 'Hospedagem', 'zh-CN': '住宿', ko: '숙박', fr: 'Hébergement', it: 'Alloggi', nl: 'Verblijven', sv: 'Bo' },
  activity:  { en: 'Activities', fi: 'Tekeminen', de: 'Aktivitäten', ja: 'アクティビティ', es: 'Actividades', 'pt-BR': 'Atividades', 'zh-CN': '活动', ko: '액티비티', fr: 'Activités', it: 'Attività', nl: 'Activiteiten', sv: 'Aktiviteter' },
  food:      { en: 'Eat & drink', fi: 'Ruoka ja juoma', de: 'Essen & Trinken', ja: '食べる・飲む', es: 'Comer y beber', 'pt-BR': 'Comer e beber', 'zh-CN': '餐饮', ko: '먹고 마시기', fr: 'Manger et boire', it: 'Mangiare e bere', nl: 'Eten & drinken', sv: 'Äta & dricka' },
  transport: { en: 'Getting around', fi: 'Liikkuminen', de: 'Mobilität', ja: '移動', es: 'Cómo moverse', 'pt-BR': 'Como se locomover', 'zh-CN': '交通出行', ko: '이동', fr: 'Se déplacer', it: 'Spostarsi', nl: 'Vervoer', sv: 'Ta sig fram' },
  season:    { en: 'Seasons & occasions', fi: 'Kaudet ja teemat', de: 'Saison & Anlässe', ja: '季節とイベント', es: 'Temporadas y ocasiones', 'pt-BR': 'Temporadas e ocasiões', 'zh-CN': '季节与场合', ko: '시즌과 이벤트', fr: 'Saisons et occasions', it: 'Stagioni e occasioni', nl: 'Seizoenen & gelegenheden', sv: 'Säsonger & tillfällen' },
  shopping:  { en: 'Shopping', fi: 'Ostokset', de: 'Einkaufen', ja: 'ショッピング', es: 'Compras', 'pt-BR': 'Compras', 'zh-CN': '购物', ko: '쇼핑', fr: 'Achats', it: 'Acquisti', nl: 'Shoppen', sv: 'Shopping' },
  guide:     { en: 'Guides', fi: 'Oppaat', de: 'Ratgeber', ja: 'ガイド', es: 'Guías', 'pt-BR': 'Guias', 'zh-CN': '指南', ko: '가이드', fr: 'Guides', it: 'Guide', nl: 'Gidsen', sv: 'Guider' },
};

/** Localised heading for a category. */
export function ecosystemCatLabel(cat: Cat, lang?: string): string {
  const L = ecosystemLocaleKey(lang);
  return CAT_I18N[cat]?.[L] ?? CAT_I18N[cat].en;
}

/** Accent RGB triplet for a category, e.g. '6, 182, 212'. */
export function ecosystemCatRgb(cat: Cat): string {
  return CAT_RGB[cat];
}

/**
 * Locale key used by the i18n maps above. `pt`/`zh` variants collapse to the
 * single translated locale we actually ship.
 */
export function ecosystemLocaleKey(lang?: string): string {
  const l = (lang || '').toLowerCase();
  if (l.startsWith('pt')) return 'pt-BR';
  if (l.startsWith('zh')) return 'zh-CN';
  return l;
}

/**
 * Localised display name for one network site.
 *
 * Exported so pages that present the ecosystem (e.g. an About page listing the
 * whole network) render the SAME names as this menu instead of keeping their
 * own copy of the list. The Levi lesson: one fact, one place — a site name
 * duplicated per page drifts the moment a domain or wording changes.
 */
export function ecosystemSiteName(site: Site, lang?: string): string {
  const L = ecosystemLocaleKey(lang);
  return NAME_I18N[site.domain]?.[L] ?? (L.startsWith('fi') ? site.fi : site.en);
}

/** Search key: lower-case, diacritics stripped ("hôtel" matches "hotel"). */
function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Grid order (v2.2). Not CAT_ORDER: the 4-column grid stretches every card in a
 * row to the tallest one, so the row that holds Tekeminen (6 sites) should
 * hold the other 4-site groups, and the 3-site groups share the second row
 * with the app tile. Majoitus keeps the first slot.
 */
const MENU_ORDER: Cat[] = ['stay', 'activity', 'season', 'guide', 'food', 'transport', 'shopping'];

type IconCmp = typeof LayoutGrid;
/** One icon per group so the seven cards differ by shape as well as by colour. */
const CAT_ICON: Record<Cat, IconCmp> = { hub: LayoutGrid, stay: BedDouble, activity: Compass, food: UtensilsCrossed, transport: Car, season: Sparkles, shopping: ShoppingBag, guide: BookOpen };

const MOBILE_QUERY = '(max-width: 767px)';
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * All styling, scoped by the lv-eco- prefix. Mirrors the approved mock
 * (_design-mocks/verkosto-v2/, artifact 89fdb62e…) line for line; if you
 * change a value here, change it there too.
 */
const CSS = `
.lv-eco-wrap{position:relative;flex-shrink:0;font-family:${BODY_FONT}}
.lv-eco-btn{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.32);background:rgba(255,255,255,.10);color:${SNOW};cursor:pointer;font-family:${WORDMARK_FONT};font-size:14px;letter-spacing:.14em;text-transform:uppercase;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);transition:background .2s,border-color .2s,color .2s;white-space:nowrap;margin:0}
.lv-eco-btn svg{flex:none}
.lv-eco-btn .lv-eco-grid{color:${PINK}}
.lv-eco-btn .lv-eco-lbl{text-shadow:0 1px 6px rgba(0,0,0,.6);line-height:1;transform:translateY(1px)}
.lv-eco-btn .lv-eco-chev{transition:transform .2s}
.lv-eco-btn[aria-expanded="true"] .lv-eco-chev{transform:rotate(180deg)}
.lv-eco-btn:hover,.lv-eco-btn[aria-expanded="true"]{background:rgba(236,72,153,.14);border-color:rgba(236,72,153,.55)}
.lv-eco-btn:focus-visible{outline:2px solid #06B6D4;outline-offset:2px}
.lv-eco-btn--light{background:rgba(15,23,42,.05);border-color:rgba(15,23,42,.22);color:rgba(15,23,42,.78)}
.lv-eco-btn--light .lv-eco-lbl{text-shadow:none}
.lv-eco-btn--light:hover,.lv-eco-btn--light[aria-expanded="true"]{background:rgba(236,72,153,.08);border-color:rgba(236,72,153,.55);color:${PINK}}
@media(max-width:767px){.lv-eco-btn{height:44px;min-width:44px}}
@media(max-width:639px){.lv-eco-btn{padding:0 11px;gap:4px}.lv-eco-btn .lv-eco-lbl{display:none}}
.lv-eco-hint{display:none;position:absolute;left:0;top:calc(100% + 12px);z-index:40;width:max-content;max-width:78vw;animation:lvEcoNudge 1.6s ease-in-out infinite}
@media(min-width:768px){.lv-eco-hint{display:block}}
.lv-eco-hint-arrow{position:absolute;top:-7px;left:20px;width:14px;height:14px;transform:rotate(45deg);border-radius:3px;background:${PINK};box-shadow:0 0 14px rgba(236,72,153,.55)}
.lv-eco-hint-pill{position:relative;display:flex;align-items:center;gap:8px;border-radius:999px;padding:6px 6px 6px 14px;font-size:12px;font-weight:600;background:${PINK_FILL};color:#fff;box-shadow:0 14px 34px -12px rgba(236,72,153,.7)}
.lv-eco-hint-x{display:flex;width:20px;height:20px;align-items:center;justify-content:center;border-radius:999px;border:0;padding:0;cursor:pointer;color:rgba(255,255,255,.85);background:rgba(0,0,0,.22);font:inherit;line-height:1}
.lv-eco-hint-x:hover{color:#fff}
.lv-eco-panel{position:fixed;z-index:9990;top:var(--lv-eco-t,72px);left:var(--lv-eco-l,16px);width:var(--lv-eco-w,min(1160px,calc(100vw - 32px)));max-height:calc(100vh - var(--lv-eco-t,72px) - 16px);overflow:auto;overscroll-behavior:contain;box-sizing:border-box;background:rgba(15,23,42,.97);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px);border:1px solid rgba(255,255,255,.12);border-radius:20px;box-shadow:0 1px 0 rgba(255,255,255,.06) inset,0 30px 70px -24px rgba(0,0,0,.85),0 0 60px -30px rgba(236,72,153,.5);color:${SNOW};padding:16px 22px 18px;font-family:${BODY_FONT};animation:lvEcoPop .16s ease-out;transform-origin:top left;text-align:left;line-height:1.4}
.lv-eco-panel:focus{outline:0}
.lv-eco-panel *,.lv-eco-panel *::before,.lv-eco-panel *::after{box-sizing:border-box}
.lv-eco-top{display:flex;align-items:center;gap:14px 18px;flex-wrap:wrap}
.lv-eco-brand{display:flex;flex-direction:column;gap:3px;text-decoration:none;color:${SNOW};flex:none;padding:2px 4px;border-radius:8px}
.lv-eco-brand:focus-visible{outline:2px solid #06B6D4;outline-offset:2px}
.lv-eco-mark{font-family:${WORDMARK_FONT};font-size:24px;letter-spacing:.04em;line-height:1;white-space:nowrap;font-weight:400}
.lv-eco-mark i{font-style:normal;color:${PINK}}
.lv-eco-brand:hover .lv-eco-mark{color:#fff;text-shadow:0 0 18px rgba(236,72,153,.45)}
.lv-eco-sub{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(249,250,251,.5);font-weight:600;white-space:nowrap}
.lv-eco-search{flex:1 1 240px;max-width:420px;display:flex;align-items:center;gap:8px;height:38px;padding:0 14px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);color:rgba(249,250,251,.55);cursor:text;margin:0}
.lv-eco-search:focus-within{border-color:rgba(6,182,212,.7);box-shadow:0 0 0 3px rgba(6,182,212,.18);color:${SNOW}}
.lv-eco-search svg{flex:none}
.lv-eco-search input{flex:1;min-width:0;background:none;border:0;outline:0;color:${SNOW};font:inherit;font-size:14px;padding:0;margin:0;box-shadow:none;border-radius:0;-webkit-appearance:none;appearance:none}
.lv-eco-search input::placeholder{color:rgba(249,250,251,.45);opacity:1}
.lv-eco-search input::-webkit-search-cancel-button,.lv-eco-search input::-webkit-search-decoration{-webkit-appearance:none;appearance:none}
.lv-eco-close{display:none}
.lv-eco-rule{height:1px;margin:14px 0 16px;background:linear-gradient(to right,rgba(236,72,153,.45),rgba(255,255,255,.1),transparent)}
.lv-eco-cols{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;align-items:stretch}
@media(min-width:768px) and (max-width:1023px){.lv-eco-cols{grid-template-columns:repeat(3,minmax(0,1fr))}}
.lv-eco-group{display:flex;flex-direction:column;min-width:0;height:100%;box-sizing:border-box;margin:0;padding:9px 9px 6px;border-radius:14px;background:linear-gradient(180deg,rgba(var(--c),.15),rgba(var(--c),.05));border:1px solid rgba(var(--c),.32);box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
.lv-eco-group--app{background:none;border:0;padding:0;box-shadow:none}
.lv-eco-group--app .lv-eco-app{position:relative;overflow:hidden;height:100%;display:flex;align-items:stretch;justify-content:space-between;gap:12px;padding:14px;border-radius:14px;background:linear-gradient(150deg,rgba(236,72,153,.32),rgba(15,23,42,.3) 58%,rgba(6,182,212,.18));border:1px solid rgba(236,72,153,.5);text-decoration:none;color:${SNOW}}
.lv-eco-app-txt{display:flex;flex-direction:column;gap:9px;min-width:0;flex:1;justify-content:center}
.lv-eco-app-title{font-family:${WORDMARK_FONT};font-weight:400;font-size:22px;letter-spacing:.04em;line-height:1;color:${SNOW};text-transform:none}
.lv-eco-app-stats{font-size:11.5px;line-height:1.35;color:rgba(249,250,251,.72)}
.lv-eco-app-cta{display:inline-flex;align-items:center;gap:6px;align-self:flex-start;max-width:100%;padding:7px 11px;border-radius:14px;background:${PINK_FILL};color:#fff;font-size:12px;font-weight:700;letter-spacing:.01em;line-height:1.2;text-align:left;transition:background .15s}
.lv-eco-app-cta svg{flex:none}
.lv-eco-app:hover .lv-eco-app-cta{background:#BE185D}
.lv-eco-app-shot{flex:none;align-self:center;height:160px;width:auto;max-width:40%;margin:0;border-radius:12px;overflow:hidden;border:2px solid rgba(255,255,255,.22);box-shadow:0 8px 24px -10px rgba(0,0,0,.8);background:#0F172A;transition:transform .2s}
.lv-eco-app:hover .lv-eco-app-shot{transform:translateY(-2px)}
.lv-eco-app-shot img{display:block;height:100%;width:auto;object-fit:cover;object-position:top}
.lv-eco-h{display:flex;align-items:center;gap:8px;font-family:${WORDMARK_FONT};font-weight:400;font-size:19px;letter-spacing:.06em;line-height:1.1;color:rgb(var(--c));margin:0 0 5px 3px;padding-bottom:6px;border-bottom:1px solid rgba(var(--c),.22);text-transform:none}
.lv-eco-h svg{flex:none;filter:drop-shadow(0 0 6px rgba(var(--c),.55))}
.lv-eco-h .lv-eco-here{margin-left:auto}
.lv-eco-h .lv-eco-here svg{filter:none}
.lv-eco-group ul{list-style:none;margin:0;padding:0}
.lv-eco-group li{margin:0;padding:0}
.lv-eco-row{display:flex;align-items:center;gap:10px;padding:6px 7px;border-radius:9px;text-decoration:none;color:${SNOW};transition:background .15s}
.lv-eco-row:hover{background:rgba(var(--c),.2);color:${SNOW}}
.lv-eco-row:focus-visible{outline:0;background:rgba(var(--c),.2);box-shadow:inset 0 0 0 2px rgba(6,182,212,.7)}
.lv-eco-txt{min-width:0;flex:1;display:flex;flex-direction:column;gap:2px}
.lv-eco-name{font-size:14px;font-weight:600;line-height:1.25;color:${SNOW}}
.lv-eco-dom{font-size:11.5px;color:rgba(249,250,251,.5);line-height:1.2;overflow-wrap:anywhere}
.lv-eco-arrow{width:14px;height:14px;flex:none;color:rgba(249,250,251,.3);transition:color .15s}
.lv-eco-row:hover .lv-eco-arrow,.lv-eco-row:focus-visible .lv-eco-arrow{color:${PINK}}
.lv-eco-row.is-current{background:rgba(236,72,153,.2);box-shadow:inset 0 0 0 1px rgba(236,72,153,.6)}
.lv-eco-here{flex:none;display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:999px;background:${PINK_FILL};color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;line-height:1;white-space:nowrap}
.lv-eco-app:hover,.lv-eco-app:focus-visible{border-color:rgba(236,72,153,.85);outline:0;color:${SNOW}}
.lv-eco-app:focus-visible{box-shadow:0 0 0 2px rgba(6,182,212,.7)}
.lv-eco-empty{margin:18px 8px 6px;color:rgba(249,250,251,.6);font-size:14px}
@keyframes lvEcoPop{from{opacity:0;transform:translateY(-6px) scale(.985)}to{opacity:1;transform:none}}
@keyframes lvEcoSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes lvEcoNudge{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes lvEcoRing{0%{box-shadow:0 0 0 0 rgba(236,72,153,.55)}70%{box-shadow:0 0 0 9px rgba(236,72,153,0)}100%{box-shadow:0 0 0 0 rgba(236,72,153,0)}}
.lv-eco-ring{animation:lvEcoRing 1.8s ease-out infinite}
@media(prefers-reduced-motion:reduce){.lv-eco-panel,.lv-eco-hint,.lv-eco-ring{animation:none}.lv-eco-btn .lv-eco-chev{transition:none}}
@media(max-width:767px){
.lv-eco-panel{inset:0;top:0;left:0;width:auto;max-width:none;max-height:none;border-radius:0;border:0;padding:0 0 24px;animation:lvEcoSlide .2s ease-out;transform-origin:center top}
.lv-eco-top{position:sticky;top:0;z-index:1;gap:10px 12px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 12px;background:#0F172A;border-bottom:1px solid rgba(255,255,255,.1)}
.lv-eco-brand{flex:1;min-width:0}
.lv-eco-sub{white-space:normal;font-size:10px;letter-spacing:.1em}
.lv-eco-top>.lv-eco-here{order:1}
.lv-eco-close{order:2;display:inline-flex;flex:none;width:44px;height:44px;align-items:center;justify-content:center;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:${SNOW};cursor:pointer;padding:0;margin:0}
.lv-eco-close:focus-visible{outline:2px solid #06B6D4;outline-offset:2px}
.lv-eco-search{order:3;flex:1 1 100%;max-width:none;height:46px}
.lv-eco-search input{font-size:16px}
.lv-eco-rule{display:none}
.lv-eco-cols{display:block;padding:10px 10px 0}
.lv-eco-group{height:auto;margin:0 0 12px;padding:10px 10px 6px}
.lv-eco-group--app .lv-eco-app{height:auto;min-height:0;padding:12px 14px}
.lv-eco-app-title{font-size:20px}
.lv-eco-app-shot{align-self:center;height:104px;max-width:none}
.lv-eco-h{font-size:20px;margin:0 0 6px 4px}
.lv-eco-row{min-height:50px;padding:6px 10px;border-radius:12px}
.lv-eco-name{font-size:15.5px}
.lv-eco-dom{font-size:12.5px}
.lv-eco-app{margin-top:4px;min-height:58px}
}
`;

interface Props {
  /** Domain of the site this menu is mounted on; marked "you are here". */
  currentDomain?: string;
  /** Active locale (e.g. 'fi', 'en', 'de'). Passed by the site Nav. */
  lang?: string;
  /** Header tone. 'light' = for sites with a white/light header (stayinlapland, christmas…). */
  variant?: 'dark' | 'light';
}

export default function EcosystemMenu({ currentDomain = HUB, lang, variant = 'dark' }: Props) {
  const L = ecosystemLocaleKey(lang);
  const isFi = L.startsWith('fi');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mobile, setMobile] = useState(false);
  const [pos, setPos] = useState({ top: 72, left: 16, width: 0 });
  // One-time discovery hint (Vesa 2026-07-10: "pop up nuoli joka näyttäisi
  // verkosto-tabin, jotta jengi tajuaa sen") — shows once per browser until
  // the menu is opened or the bubble dismissed. Desktop bubble only; on narrow
  // screens the bubble covered page content (Vesa 21.8.2026), the pulse ring
  // on the button is enough there.
  const [hint, setHint] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const siteName = useCallback((s: Site) => ecosystemSiteName(s, lang), [lang]);
  const chrome = (k: string, fi: string, en: string) => CHROME_I18N[k]?.[L] ?? (isFi ? fi : en);

  const label = chrome('label', 'Verkosto', 'Network');
  const heading = chrome('heading', 'Koko Lapland-verkosto', 'The whole Lapland network');
  const hereLabel = chrome('here', 'Olet tässä', 'You are here');
  const searchLabel = chrome('search', 'Hae sivustoa…', 'Search sites…');
  const noResults = chrome('noResults', 'Ei osumia.', 'No matches.');
  const closeLabel = chrome('close', 'Sulje', 'Close');
  const appLabel = chrome('getApp', 'Lataa sovellus', 'Get the app');
  const app = APP_I18N[L] ?? (isFi ? APP_I18N.fi : APP_I18N.en);
  const onHub = currentDomain === HUB;

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || window.localStorage.getItem('lv_eco_hint_seen') === '1') return;
    } catch { return; }
    const id = window.setTimeout(() => setHint(true), 1400);
    return () => window.clearTimeout(id);
  }, []);
  const dismissHint = () => {
    setHint(false);
    try { window.localStorage.setItem('lv_eco_hint_seen', '1'); } catch { /* private mode */ }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Groups in trip order; the hub is the wordmark, not a row.
  const groups = useMemo(() => MENU_ORDER.map((cat) => ({
    cat,
    label: ecosystemCatLabel(cat, lang),
    rgb: CAT_RGB[cat],
    sites: SITES.filter((s) => s.cat === cat).map((s) => {
      const name = siteName(s);
      return { site: s, name, key: norm(`${name} ${s.fi} ${s.en} ${s.domain}`) };
    }),
  })), [lang, siteName]);

  const q = norm(query.trim());
  const visible = groups
    .map((g) => ({ ...g, sites: q ? g.sites.filter((x) => x.key.includes(q)) : g.sites }))
    .filter((g) => g.sites.length > 0);
  const appVisible = !q || norm(`${appLabel} ${app.title} ${app.cta} app appi sovellus ${APP}`).includes(q);
  const total = visible.reduce((n, g) => n + g.sites.length, 0) + (appVisible ? 1 : 0);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    setQuery('');
    if (returnFocus) btnRef.current?.focus({ preventScroll: true });
  }, []);

  // Anchor the desktop panel under the trigger; follow it on resize/scroll.
  useIsoLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const btn = btnRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      // Size and align the panel to the header's content column — the nearest
      // ancestor narrower than the viewport, i.e. the site's max-width container
      // (gifts ~1250 px centred, hub 1440, work 1536). A 2560 px screen otherwise
      // showed a 1160 px box hugging the right-hand trigger with the site content
      // centred far to its left (Vesa 2026-09-05). No container → viewport − 32.
      let colLeft = 16, colWidth = vw - 32;
      for (let el = btn.parentElement; el && el !== document.body; el = el.parentElement) {
        const b = el.getBoundingClientRect();
        if (b.width >= 700 && b.width <= vw - 40) { colLeft = b.left; colWidth = b.width; break; }
      }
      const width = Math.min(1600, Math.round(colWidth));
      const left = Math.round(colLeft + (colWidth - width) / 2);
      setPos({ top: Math.round(r.bottom + 8), left, width });
    };
    update();
    let raf = 0;
    const onChange = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener('resize', onChange);
    window.addEventListener('scroll', onChange, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onChange); window.removeEventListener('scroll', onChange); };
  }, [open]);

  // Focus: search on desktop, the sheet itself on phones (no keyboard pop-up).
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      if (mobile) panelRef.current?.focus({ preventScroll: true });
      else inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [open, mobile]);

  // Phone sheet: lock page scroll while open.
  useEffect(() => {
    if (!open || !mobile) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = 'hidden';
    return () => { el.style.overflow = prev; };
  }, [open, mobile]);

  // Escape clears the query first, then closes; click outside closes.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      close(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (query) { setQuery(''); inputRef.current?.focus(); } else close();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, query, close]);

  // Phone sheet is modal: keep Tab inside it.
  const onPanelKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !mobile || !panelRef.current) return;
    const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href],button,input'))
      .filter((el) => el.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const herePill = (
    <span className="lv-eco-here">
      <MapPin size={10} strokeWidth={2.4} aria-hidden="true" />
      {hereLabel}
    </span>
  );
  const arrow = <ArrowUpRight className="lv-eco-arrow" size={14} strokeWidth={2.2} aria-hidden="true" />;

  const panel = open && typeof document !== 'undefined' ? createPortal(
    <div
      ref={panelRef}
      className="lv-eco-panel"
      role="dialog"
      aria-modal={mobile}
      aria-label={heading}
      tabIndex={-1}
      onKeyDown={onPanelKeyDown}
      style={{ '--lv-eco-t': `${pos.top}px`, '--lv-eco-l': `${pos.left}px`, ...(pos.width ? { '--lv-eco-w': `${pos.width}px` } : {}) } as CSSProperties}
    >
      <div className="lv-eco-top">
        <a
          className="lv-eco-brand"
          href={`https://${HUB}`}
          {...(onHub ? { 'aria-current': 'page' as const } : { target: '_blank', rel: 'noopener' })}
          data-umami-event="eco_jump"
          data-umami-event-site={HUB}
        >
          <span className="lv-eco-mark"><i>#</i>LAPLAND<i>VIBES</i></span>
          <span className="lv-eco-sub">{heading} · {HUB}</span>
        </a>
        {onHub && herePill}
        <label className="lv-eco-search">
          <Search size={15} strokeWidth={2.2} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchLabel}
            aria-label={searchLabel}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
          />
        </label>
        <button type="button" className="lv-eco-close" aria-label={closeLabel} onClick={() => close()}>
          <X size={18} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
      <div className="lv-eco-rule" />
      <div className="lv-eco-cols">
        {visible.map((g) => { const Icon = CAT_ICON[g.cat]; return (
          <section key={g.cat} className="lv-eco-group" style={{ '--c': g.rgb } as CSSProperties}>
            <h3 className="lv-eco-h"><Icon size={18} strokeWidth={2.2} aria-hidden="true" />{g.label}{g.sites.some((x) => x.site.domain === currentDomain) && herePill}</h3>
            <ul>
              {g.sites.map(({ site, name }) => {
                const cur = site.domain === currentDomain;
                return (
                  <li key={site.domain}>
                    <a
                      className={`lv-eco-row${cur ? ' is-current' : ''}`}
                      href={`https://${site.domain}`}
                      {...(cur ? { 'aria-current': 'page' as const } : { target: '_blank', rel: 'noopener' })}
                      data-umami-event="eco_jump"
                      data-umami-event-site={site.domain}
                    >
                      <span className="lv-eco-txt">
                        <span className="lv-eco-name">{name}</span>
                        <span className="lv-eco-dom">{site.domain}</span>
                      </span>
                      {cur ? null : arrow}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ); })}
        {appVisible && (
          <div className="lv-eco-group lv-eco-group--app">
            <a className="lv-eco-app" href={APP_URL} target="_blank" rel="noopener" aria-label={`${app.title} ${app.cta}`} data-umami-event="eco_jump" data-umami-event-site={APP}>
              <span className="lv-eco-app-txt">
                <span className="lv-eco-app-title">{app.title}</span>
                <span className="lv-eco-app-stats">{APP_STATS.destinations} {app.stats[0]} · {APP_STATS.slopes} {app.stats[1]} · {APP_STATS.lifts} {app.stats[2]}</span>
                <span className="lv-eco-app-cta"><Download size={13} strokeWidth={2.4} aria-hidden="true" />{app.cta}</span>
              </span>
              <span className="lv-eco-app-shot" aria-hidden="true">
                <img src={APP_SHOT} alt="" loading="lazy" decoding="async" width={468} height={1013} onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }} />
              </span>
            </a>
          </div>
        )}
      </div>
      {total === 0 && <p className="lv-eco-empty">{noResults}</p>}
    </div>,
    document.body,
  ) : null;

  return (
    <div className="lv-eco-wrap">
      <style>{CSS}</style>

      <button
        ref={btnRef}
        type="button"
        onClick={() => { if (hint) dismissHint(); if (open) close(); else setOpen(true); }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={heading}
        data-umami-event="eco_open"
        className={`lv-eco-btn${variant === 'light' ? ' lv-eco-btn--light' : ''}${hint ? ' lv-eco-ring' : ''}`}
      >
        <LayoutGrid className="lv-eco-grid" size={16} strokeWidth={2.3} aria-hidden="true" />
        <span className="lv-eco-lbl">{label}</span>
        <ChevronDown className="lv-eco-chev" size={13} strokeWidth={2.4} aria-hidden="true" />
      </button>

      {hint && !open && (
        <div className="lv-eco-hint" role="status">
          <span aria-hidden="true" className="lv-eco-hint-arrow" />
          <span className="lv-eco-hint-pill">
            {chrome('hint', 'Kaikki verkoston sivut täältä!', 'Every site in the network: in here!')}
            <button type="button" onClick={dismissHint} aria-label={isFi ? 'Sulje vinkki' : 'Dismiss'} className="lv-eco-hint-x">×</button>
          </span>
        </div>
      )}

      {panel}
    </div>
  );
}
