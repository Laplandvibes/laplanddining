import type { Restaurant } from './restaurants';

/**
 * Editorial overrides keyed by Google Place ID. Each override is optional and
 * merged on top of the Maps-sourced data in `generated/restaurants-from-maps.json`.
 *
 * Use this file to:
 *   - Upgrade a restaurant's partnership tier (B2B billing flow)
 *   - Move a topPick to a different restaurant in the same city (editorial choice)
 *   - Add a curated `curatedDescription` written in our voice (vs Google's).
 *     Can be a plain string (English-only legacy) OR `{ en, fi, de }` for localized copy.
 *   - Surface hand-picked `menuHighlights` (dish + price)
 *   - Tag dietary options + reservation policy
 *
 * The Maps sync NEVER touches this file. Re-running the sync only updates
 * generated/restaurants-from-maps.json.
 *
 * Why the FI/DE `curatedDescription` entries exist for the city top picks:
 * Google's `reviewQuote` field is English-only. Without an editorial override
 * the FI/DE cards fall back to a synthesised "4.6 tähden arvio • 627 arvostelua"
 * factual line, which is correct but flat. Translating the genuine review into
 * FI/DE (keeping it as a quote in spirit) keeps the warmth without leaking
 * English onto the localised page.
 */

type Override = Partial<Pick<Restaurant,
  | 'topPick'
  | 'partnership'
  | 'curatedDescription'
  | 'highlights'
  | 'cuisine'
  | 'type'
  | 'menuHighlights'
  | 'dietary'
  | 'reservationPolicy'
  | 'website'
>> & {
  /**
   * Ravintola on lopettanut tai ilmoittaa olevansa suljettu toistaiseksi.
   * Listaus piilotetaan kokonaan: kortti, skeema ja kaupungin laskuri.
   *
   * Maps voi näyttää lopettaneen ravintolan yhä avoimena kuukausia, joten
   * tämä on toimituksellinen päätös eikä synkasta tuleva tieto. Peruste
   * kirjataan aina kommenttiin.
   */
  permanentlyClosed?: boolean;
};

export const restaurantOverrides: Record<string, Override> = {
  // ── Rikkinäiset verkkosivulinkit, tarkistettu 2026-08-10 ────────────────
  // Maps-datan `website` osoitti neljällä ravintolalla sivulle joka ei vastaa.
  // Nämä olivat livenä `Nettisivut →` -linkkeinä ja veivät 404-sivulle.
  // Korjaus kuuluu tänne eikä generoituun tiedostoon, koska seuraava
  // sync-restaurants.mjs pyyhkisi sen.

  // Tori-Kioski Mikkola — Sodankylä. Maps-osoite /hinnasto/eng oli 404;
  // domainin juuri vastaa ja on oikean ravintolan sivu.
  'ChIJ4bE7F8Ir00URltDAnU0CI5Q': { website: 'https://torikioski.fi/' },

  // CAMP Kitchen & Bar — Pyhätunturi. campkitchen.fi/pyha/ on 404 ja koko
  // sivusto on nykyään pelkkä CAMP RUKA: nolla mainintaa Pyhästä. Ruka-sivulle
  // linkittäminen Pyhätunturin kortista olisi väärä tieto, joten linkki pois.
  'ChIJudCrtkbrLEQRQCnerLesTPM': { website: undefined },

  // Luoston Hovi — Luosto. Koko luosto.fi ei vastaa nimipalvelussa,
  // eikä luostonhovi.fi tai ravintolaluostonhovi.fi ole olemassa.
  'ChIJlwbjdmHPLEQRqKhaPx0gHV0': { website: undefined },

  // Niestapaikka — Hetta. niestapaikka.onverkossa.fi ei vastaa,
  // eikä niestapaikka.fi ole olemassa.
  'ChIJBfuXzkyN0UURA2S2OkxMsVA': { website: undefined },

  // ── Piilotetut listaukset ───────────────────────────────────────────────
  // Ravintola Tunturikettu — Muonio. Sivuston etusivun pääotsikko on
  // "Suljettu toistaiseksi!" (myös englanniksi "closed until further notice"),
  // eikä avaamisajankohtaa mainita. Maps näyttää sen yhä avoimena, mutta
  // ruokaopas ei voi lähettää ihmistä suljettuun ravintolaan. Tarkistettu
  // 2026-08-10. Jos ravintola avaa uudelleen, poista tämä rivi.
  'ChIJST3thVW900URZ7CT6hKOiqY': { permanentlyClosed: true },

  // Sataman Krouwi ja Perämeren Jähti — Kemi. Sivuston JUURI on 404 (sekä
  // www että apex), mutta /lounaslista/ vastaa ja on oikean ravintolan sivu.
  // Verkkosivulinkki pois; ruokalistalinkki jää, jottei kaksi nappia veisi
  // samaan osoitteeseen.
  'ChIJ8QV9vzJL1UUR09TOcEEMzhg': { website: undefined },

  // Skiknööli — Luosto. Sama kuollut luosto.fi kuin Luoston Hovilla.
  'ChIJcTDrKGfPLEQRi7X4v_876hc': { website: undefined },

  // Nili — Rovaniemi
  'ChIJvySHpvNLK0QRY-dnGYTVum4': {
    cuisine: {
      en: 'Traditional Lappish: reindeer, salmon, game, cloudberry',
      fi: 'Perinteinen lappilainen: poro, lohi, riista, lakka',
      de: 'Traditionell lappländisch: Rentier, Lachs, Wild, Moltebeere',
    },
    type: {
      en: 'Fine Dining / Traditional Lappish',
      fi: 'Fine dining / perinteinen lappilainen',
      de: 'Fine Dining / traditionell lappländisch',
    },
    curatedDescription: {
      en: 'Step inside a wilderness cabin in the heart of Rovaniemi. Nili has served Lappish flavours for over two decades: sautéed reindeer, Arctic char, cloudberry desserts. The four-course surprise menu is the best way in.',
      fi: 'Rovaniemen keskustaan kätketty kelohirsikämppä. Nili on tarjonnut lappilaisia makuja yli kaksikymmentä vuotta: poronkäristystä, nieriää ja lakkajälkiruokia. Neljän ruokalajin yllätysmenu on helpoin tapa päästä makuun.',
      de: 'Eine Wildnis-Hütte mitten in Rovaniemi. Nili serviert seit über zwei Jahrzehnten lappländische Aromen: geschnetzeltes Rentier, arktischen Saibling und Moltebeer-Desserts. Das viergängige Überraschungsmenü ist der beste Einstieg.',
      ja: 'ロヴァニエミの中心にたたずむ山小屋。Nili は二十年以上にわたりラップランドの味を届けてきました。トナカイのソテー、北極イワナ、クラウドベリーのデザート。4品のおまかせコースが入り口にいちばんです。',
      es: 'Una cabaña en plena naturaleza, en el corazón de Rovaniemi. Nili lleva más de veinte años sirviendo sabores lapones: reno salteado, salvelino ártico y postres de mora ártica. El menú sorpresa de cuatro platos es la mejor manera de empezar.',
      'pt-BR': 'Uma cabana em meio à natureza, no coração de Rovaniemi. Há mais de vinte anos a Nili serve sabores da Lapônia: rena salteada, salvelino-ártico e sobremesas de amora-ártica. O menu surpresa de quatro pratos é a melhor porta de entrada.',
      'zh-CN': '一座藏在罗瓦涅米市中心的荒野木屋。二十多年来，Nili 一直端出拉普兰的味道：香煎驯鹿肉、北极红点鲑、云莓甜点。四道菜的惊喜套餐是最好的入门方式。',
      ko: '로바니에미 한복판에 자리한 오두막. Nili는 이십 년 넘게 라플란드의 맛을 내어 왔습니다. 순록 볶음, 북극 곤들매기, 클라우드베리 디저트. 네 코스의 셰프 추천 메뉴가 가장 좋은 시작입니다.',
      fr: 'Une cabane au cœur de la nature, en plein Rovaniemi. Depuis plus de vingt ans, Nili sert les saveurs de Laponie: renne sauté, omble arctique, desserts à la mûre arctique. Le menu surprise en quatre services est la meilleure porte d\'entrée.',
      it: 'Una baita immersa nella natura, nel cuore di Rovaniemi. Da oltre vent\'anni Nili porta in tavola i sapori della Lapponia: renna saltata, salmerino artico, dolci al lampone artico. Il menù a sorpresa di quattro portate è il modo migliore per cominciare.',
      nl: 'Een wildernishut middenin Rovaniemi. Al meer dan twintig jaar serveert Nili Laplandse smaken: gebakken rendier, arctische riddervis en desserts van kruipbraam. Het verrassingsmenu van vier gangen is de beste manier om kennis te maken.',
    },
    highlights: [
      {
        en: 'Sautéed reindeer',
        fi: 'Poronkäristys',
        de: 'Geschnetzeltes Rentier',
        ja: 'トナカイのソテー',
        es: 'Reno salteado',
        'pt-BR': 'Rena salteada',
        'zh-CN': '香煎驯鹿肉',
        ko: '순록 볶음',
        fr: 'Renne sauté',
        it: 'Renna saltata',
        nl: 'Gebakken rendier',
      },
      {
        en: 'Surprise menu',
        fi: 'Yllätysmenu',
        de: 'Überraschungsmenü',
        ja: 'おまかせコース',
        es: 'Menú sorpresa',
        'pt-BR': 'Menu surpresa',
        'zh-CN': '惊喜套餐',
        ko: '셰프 추천 코스',
        fr: 'Menu surprise',
        it: 'Menù a sorpresa',
        nl: 'Verrassingsmenu',
      },
      {
        en: 'Wilderness cabin interior',
        fi: 'Erämaakämpän tunnelma',
        de: 'Wildnishütten-Ambiente',
        ja: '山小屋風の店内',
        es: 'Interior de cabaña salvaje',
        'pt-BR': 'Interior de cabana selvagem',
        'zh-CN': '荒野木屋风格内饰',
        ko: '오두막 분위기의 실내',
        fr: 'Décor de cabane sauvage',
        it: 'Interni da baita nella natura',
        nl: 'Interieur van een wildernishut',
      },
    ],
  },

  // Panoramic Restaurant TUIKKU — Levi (top pick)
  'ChIJ7zWSIUxN0kUREMxPrEL0c40': {
    curatedDescription: {
      en: 'The atmosphere is joyful, vibrant, and authentic: the kind of place where strangers become one happy crowd, while winter stays far outside.',
      fi: 'Tunnelma on lämmin ja aito: sellainen paikka, jossa tuntemattomatkin alkavat pian jutella keskenään ja talvi unohtuu täysin oven taakse.',
      de: 'Die Atmosphäre ist warm, lebendig und echt, ein Ort, an dem Fremde nach einer Stunde miteinander reden und der Winter draußen bleibt.',
      ja: '雰囲気は温かく、にぎやかで、飾り気がない。見知らぬ者どうしが一時間後には語り合い、冬は外に置き去りになる、そんな店です。',
      es: 'El ambiente es cálido, animado y auténtico: de esos lugares donde los desconocidos acaban charlando en una hora y el invierno se queda fuera.',
      'pt-BR': 'O ambiente é caloroso, animado e autêntico, daqueles lugares onde os desconhecidos acabam conversando em uma hora e o inverno fica lá fora.',
      'zh-CN': '气氛温暖、热闹而真实。在这样的地方，陌生人一小时后便攀谈起来，而冬天被留在了门外。',
      ko: '분위기는 따뜻하고 활기차며 꾸밈이 없습니다. 낯선 사람들도 한 시간이면 이야기를 나누고, 겨울은 문밖에 남는 그런 곳입니다.',
      fr: 'L\'ambiance est chaleureuse, vivante et authentique, le genre d\'endroit où les inconnus se parlent au bout d\'une heure et où l\'hiver reste dehors.',
      it: 'L\'atmosfera è calda, vivace e autentica, uno di quei posti dove gli sconosciuti chiacchierano dopo un\'ora e l\'inverno resta fuori.',
      nl: 'De sfeer is warm, levendig en echt, zo\'n plek waar vreemden na een uur met elkaar praten en de winter buiten blijft.',
    },
  },

  // Saamen Kammi — Kittilä (top pick)
  'ChIJd2up905N0kURTWJBTBizK7A': {
    curatedDescription: {
      en: 'The smoked salmon cooked next to the fire was beautiful.',
      fi: 'Avotulen vieressä savustettu lohi on aterian paras hetki: liekitetty tulella ja syöty kodassa, ei vain salissa.',
      de: 'Der Lachs, am offenen Feuer geräuchert, ist der Höhepunkt des Abends, in der Kota gegart, nicht nur im Saal serviert.',
      ja: '直火のそばで燻したサーモンが、その夜いちばんの瞬間。ホールではなく kota のなかで、火を相手に仕上げられます。',
      es: 'El salmón ahumado junto al fuego es el mejor momento de la cena: cocinado al fuego dentro de la kota, no solo servido en la sala.',
      'pt-BR': 'O salmão defumado junto ao fogo é o melhor momento da noite: preparado no fogo dentro da kota, não apenas servido no salão.',
      'zh-CN': '在篝火旁熏制的三文鱼，是这一晚最好的时刻：在 kota 里以火慢煨，而不只是端上餐桌。',
      ko: '불 옆에서 훈제한 연어가 그날 저녁의 백미입니다. 홀이 아니라 kota 안에서, 불을 마주하고 완성됩니다.',
      fr: 'Le saumon fumé près du feu est le meilleur moment du repas, cuit au feu dans la kota, pas seulement servi en salle.',
      it: 'Il salmone affumicato accanto al fuoco è il momento più bello della cena, cotto sul fuoco dentro la kota, non solo servito in sala.',
      nl: 'De zalm, naast het vuur gerookt, is het mooiste moment van de avond, boven het vuur bereid in de kota, niet alleen in de zaal geserveerd.',
    },
  },

  // Muotkan Ruoktu Tunturikylä — Inari (top pick)
  'ChIJTV_WZOkVzUURy3OSF3ioobg': {
    curatedDescription: {
      en: 'Nature hikes, plenty of activities such as snow mobile and local Sami culture of traditional salmon cooking on an open fire, delicious.',
      fi: 'Vaelluksia, moottorikelkkailua ja saamelaista perinneruokaa: lohta paistetaan avotulella, ja maku jää mieleen koko illaksi.',
      de: 'Wanderungen, Schneemobile und samische Tradition: Lachs auf offenem Feuer gegart, der Geschmack bleibt den ganzen Abend hängen.',
      ja: 'トレッキング、スノーモービル、そしてサーミの伝統。サーモンを直火で焼き上げ、その味わいは夜じゅう心に残ります。',
      es: 'Caminatas, motos de nieve y tradición sami: el salmón se asa al fuego abierto y el sabor se queda contigo toda la noche.',
      'pt-BR': 'Caminhadas, motos de neve e tradição sami: o salmão é assado em fogo aberto e o sabor fica com você a noite toda.',
      'zh-CN': '徒步、雪地摩托，还有萨米传统。三文鱼以明火烤制，那味道整晚萦绕不散。',
      ko: '하이킹, 스노모빌, 그리고 사미 전통. 연어를 모닥불에 구워내고, 그 맛은 밤새 마음에 남습니다.',
      fr: 'Randonnées, motoneiges et tradition samie: le saumon grillé au feu de bois, dont le goût vous accompagne toute la soirée.',
      it: 'Escursioni, motoslitte e tradizione sami: il salmone cotto sul fuoco vivo, e il sapore Le resta per tutta la sera.',
      nl: 'Wandelingen, sneeuwscooters en Samische traditie: de zalm boven open vuur bereid, de smaak blijft de hele avond hangen.',
    },
  },

  // Fieno — Saariselkä (top pick)
  'ChIJf1rbx69DzUURsAGH-M64lM8': {
    curatedDescription: {
      en: 'The atmosphere inside was so cosy and inviting, a perfect contrast to the magical snowy surroundings outside.',
      fi: 'Sisällä on tunnelmallista ja lämmintä, täydellinen vastapaino ulkona kimaltelevalle lumimaisemalle.',
      de: 'Drinnen warm und einladend, draußen die glitzernde Schneelandschaft: der Kontrast macht den Abend aus.',
      ja: '店内は温かく心地よく、外には雪のきらめく景色。その対比が、この一夜をかたちづくります。',
      es: 'Dentro, acogedor y cálido; fuera, el paisaje nevado que brilla: ese contraste es lo que hace la velada.',
      'pt-BR': 'Por dentro, aconchegante e acolhedor; lá fora, a paisagem nevada a brilhar: é esse contraste que faz a noite.',
      'zh-CN': '室内温暖宜人，窗外是闪着微光的雪景，正是这份反差成就了整个夜晚。',
      ko: '안은 아늑하고 따뜻하며, 밖은 반짝이는 설경. 그 대비가 이 저녁을 완성합니다.',
      fr: 'À l\'intérieur, chaleureux et accueillant ; dehors, le paysage enneigé qui scintille: c\'est ce contraste qui fait la soirée.',
      it: 'Dentro, accogliente e caldo; fuori, il paesaggio innevato che luccica: è questo contrasto a fare la serata.',
      nl: 'Binnen warm en uitnodigend, buiten het glinsterende sneeuwlandschap: dat contrast maakt de avond.',
    },
  },

  // Kemin Puistopaviljonki — Kemi (top pick)
  'ChIJfwLqSC5L1UURbXQMTAr-hNc': {
    curatedDescription: {
      en: 'Salmon soup and reindeer stew were both delicious.',
      fi: 'Lohikeitto ja poronkäristys olivat molemmat omalla tavallaan kohdallaan, kaksi Lapin perusannosta, kumpikin tehty huolella.',
      de: 'Lachssuppe und Rentiergeschnetzeltes: zwei lappländische Klassiker, beide mit Sorgfalt zubereitet.',
      ja: 'サーモンスープとトナカイのソテー。ラップランドの二つの定番が、どちらも丁寧に仕立てられています。',
      es: 'Sopa de salmón y reno salteado: dos clásicos lapones, ambos preparados con esmero.',
      'pt-BR': 'Sopa de salmão e rena salteada: dois clássicos da Lapônia, ambos preparados com cuidado.',
      'zh-CN': '三文鱼汤与香煎驯鹿肉，两道拉普兰经典，皆用心烹制。',
      ko: '연어 수프와 순록 볶음. 라플란드의 두 정석을 모두 정성껏 차려냈습니다.',
      fr: 'Soupe de saumon et renne sauté: deux classiques lapons, préparés l\'un comme l\'autre avec soin.',
      it: 'Zuppa di salmone e renna saltata: due classici lapponi, preparati entrambi con cura.',
      nl: 'Zalmsoep en gebakken rendier: twee Laplandse klassiekers, beide met zorg bereid.',
    },
  },

  // Ravintola Rouhe — Ylläs (top pick)
  'ChIJi-G83CoShEQRRUEm0zRaos0': {
    curatedDescription: {
      en: 'Local fish dishes and reindeer specialties can be warmly recommended.',
      fi: 'Paikallisia kala-annoksia ja poro­erikoisuuksia: molempia voi suositella ilman epäilystä.',
      de: 'Heimische Fischgerichte und Rentierspezialitäten: beide sind eine klare Empfehlung.',
      ja: '地元の魚料理と、トナカイのスペシャリテ。どちらも迷わず勧められる一皿です。',
      es: 'Pescados de la zona y especialidades de reno: ambos se recomiendan sin dudarlo.',
      'pt-BR': 'Peixes da região e especialidades de rena: ambos se recomendam sem hesitar.',
      'zh-CN': '本地鱼料理与驯鹿招牌菜，两者都值得毫不犹豫地推荐。',
      ko: '이 지역의 생선 요리와 순록 별미. 둘 다 망설임 없이 권할 만합니다.',
      fr: 'Poissons du coin et spécialités de renne: les deux se recommandent sans hésiter.',
      it: 'Pesci del posto e specialità di renna: entrambi una raccomandazione senza riserve.',
      nl: 'Streekvis en rendierspecialiteiten: beide zonder twijfel een aanrader.',
    },
  },

  // Kukkolaforsen Turist & Konferens — Haparanda (top pick)
  'ChIJia3ekmY-1UURpiwLrRRqEa4': {
    curatedDescription: {
      en: 'The Tornio river runs right past your table, and on the way out you can pick up fish smoked on the premises, a detail that makes the evening its own.',
      fi: 'Tornionjoki virtaa pöydän vieressä, ja paikan päällä savustettua kalaa saa lähtiessä mukaan, pieni yksityiskohta, joka tekee illasta omanlaisensa.',
      de: 'Der Tornionjoki fließt direkt am Tisch vorbei, und auf dem Heimweg kann man den im Haus geräucherten Fisch mitnehmen, ein Detail, das den Abend besonders macht.',
      ja: 'トルニオ川がテーブルのすぐそばを流れ、帰り際には自家燻製の魚を持ち帰れます。その一手間が、夜をかけがえのないものにしてくれます。',
      es: 'El río Tornio pasa justo al lado de tu mesa y, al salir, puedes llevarte pescado ahumado en la casa: un detalle que hace la velada única.',
      'pt-BR': 'O rio Tornio passa bem ao lado da sua mesa e, na saída, dá para levar peixe defumado na casa, um detalhe que torna a noite única.',
      'zh-CN': '托尔尼奥河就从餐桌旁流过，临走时还能带走店家自烟熏的鱼。正是这一处细节，让这一晚与众不同。',
      ko: '토르니오 강이 식탁 바로 옆을 흐르고, 나갈 때는 직접 훈제한 생선을 챙겨 갈 수 있습니다. 그 작은 디테일이 저녁을 특별하게 만듭니다.',
      fr: 'La rivière Tornio coule juste à côté de votre table et, en repartant, on peut emporter du poisson fumé sur place, un détail qui rend la soirée unique.',
      it: 'Il fiume Tornio scorre proprio accanto al tavolo e, all\'uscita, si può portare via il pesce affumicato in casa, un dettaglio che rende la serata unica.',
      nl: 'De rivier de Tornio stroomt vlak langs uw tafel, en op weg naar buiten kunt u in huis gerookte vis meenemen, een detail dat de avond bijzonder maakt.',
    },
  },

  // Café Loimu — Pyhätunturi. EI enää top pick (kahvila → tilalle Bistro
  // Vanha Pappila, Vesa 3.8.2026) — kortti säilyy katalogissa.
  'ChIJdUzUC3vqLEQRdUuWbK803p0': {
    topPick: false,
    curatedDescription: {
      en: 'Good food and an easy, friendly mood, kept going by staff who clearly work hard. A warm stop at the foot of the fell.',
      fi: 'Hyvää ruokaa ja rento, ystävällinen tunnelma, jota pitää yllä selvästi ahkera henkilökunta. Lämmin pysähdys tunturin juurella.',
      de: 'Gutes Essen und eine unkomplizierte, freundliche Stimmung, getragen von einem sichtlich fleißigen Team. Ein warmer Halt am Fuß des Fjälls.',
      ja: 'おいしい料理と、気取らない親しみやすい空気。よく働くスタッフがそれを支えています。フェルの麓の、心あたたまる立ち寄り先です。',
      es: 'Buena comida y un ambiente cercano y relajado, sostenido por un personal que se nota que trabaja de firme. Una parada cálida al pie del fell.',
      'pt-BR': 'Boa comida e um clima descontraído e acolhedor, mantido por uma equipe que claramente trabalha com afinco. Uma parada calorosa ao pé do fell.',
      'zh-CN': '美味的食物，加上轻松友好的气氛，由一群显然勤恳的员工撑起。这是山脚下一处暖心的歇脚处。',
      ko: '맛있는 음식과 편안하고 다정한 분위기, 그리고 부지런히 일하는 직원들이 그 분위기를 떠받칩니다. 펠 기슭의 따뜻한 쉼터입니다.',
      fr: 'Une bonne cuisine et une ambiance simple et chaleureuse, portée par une équipe qui travaille manifestement dur. Une halte accueillante au pied du fjäll.',
      it: 'Buona cucina e un\'atmosfera semplice e cordiale, tenuta viva da un personale che si vede che lavora sodo. Una sosta calda ai piedi del fell.',
      nl: 'Lekker eten en een ongedwongen, vriendelijke sfeer, in stand gehouden door een personeel dat duidelijk hard werkt. Een warme stop aan de voet van de fjeld.',
    },
  },

  // Hotelli Hetan Majatalo — Hetta (top pick)
  'ChIJxRQqF7Py0UURjHyXilIvSUs': {
    curatedDescription: {
      en: 'A warm, cosy guesthouse with a relaxed dining room, a bar and a sauna, and staff guests keep calling friendly and helpful.',
      fi: 'Lämmin ja kodikas majatalo, jossa on rento ruokasali, baari ja sauna, ja henkilökunta, jota vieraat kuvaavat yhä uudestaan ystävälliseksi ja avuliaaksi.',
      de: 'Ein warmes, gemütliches Gasthaus mit entspanntem Speisesaal, Bar und Sauna, und einem Personal, das Gäste immer wieder freundlich und hilfsbereit nennen.',
      ja: '温かく居心地のよい宿。くつろいだ食堂とバー、サウナがあり、ゲストが何度も「親切で頼りになる」と語るスタッフが迎えてくれます。',
      es: 'Una casa de huéspedes cálida y acogedora, con un comedor tranquilo, un bar y una sauna, y un personal al que los huéspedes describen una y otra vez como amable y servicial.',
      'pt-BR': 'Uma pousada calorosa e aconchegante, com sala de refeições tranquila, bar e sauna, e uma equipe que os hóspedes não cansam de chamar de simpática e prestativa.',
      'zh-CN': '一家温暖舒适的旅馆，配有轻松的餐厅、酒吧和桑拿。住客一次次称赞这里的员工亲切又乐于助人。',
      ko: '따뜻하고 아늑한 게스트하우스. 편안한 식당과 바, 사우나가 있고, 손님들이 거듭 친절하고 도움이 된다고 말하는 직원들이 있습니다.',
      fr: 'Une maison d\'hôtes chaleureuse et confortable, avec une salle à manger paisible, un bar et un sauna, et un personnel que les clients qualifient sans cesse d\'aimable et serviable.',
      it: 'Una locanda calda e accogliente, con una sala da pranzo tranquilla, un bar e una sauna, e un personale che gli ospiti continuano a definire gentile e disponibile.',
      nl: 'Een warm, gezellig gasthuis met een ontspannen eetzaal, een bar en een sauna, en personeel dat gasten keer op keer vriendelijk en behulpzaam noemen.',
    },
  },

  // Pizzeria Ruka — Kuusamo. EI enää top pick (Vesa 3.8.2026: pizzeria ei voi
  // olla "Kuusamon paras pöytä" ruokasivustolla) — kortti säilyy katalogissa.
  'ChIJP39o0c5UKUQR-WqaWDdvYM0': {
    topPick: false,
    curatedDescription: {
      en: 'The kind of pizzeria you stumble into and walk out of saying wow. A simple, reliable favourite at the foot of Ruka.',
      fi: 'Sellainen pizzeria, johon eksyt sattumalta ja josta lähtiessä sanot vain vau. Mutkaton ja luotettava suosikki Rukan juurella.',
      de: 'So eine Pizzeria, in die man zufällig hineingerät und aus der man staunend wieder herauskommt. Ein schlichter, verlässlicher Liebling am Fuße von Ruka.',
      ja: 'たまたま入って、出るころには「すごい」とつぶやいてしまう、そんなピッツェリア。ルカの麓の、気取らず頼れる一軒です。',
      es: 'De esas pizzerías en las que entras de casualidad y sales diciendo guau. Un favorito sencillo y de fiar al pie de Ruka.',
      'pt-BR': 'Daquelas pizzarias em que você entra por acaso e sai dizendo uau. Um favorito simples e confiável ao pé de Ruka.',
      'zh-CN': '那种你偶然撞进去、出来时只想说一声“哇”的披萨店。鲁卡山脚下一家朴实又靠谱的心头好。',
      ko: '우연히 들어갔다가 나오면서 절로 “와” 하게 되는 그런 피자집. 루카 기슭의 소박하고 믿음직한 단골입니다.',
      fr: 'Le genre de pizzeria où l\'on entre par hasard et d\'où l\'on ressort en disant waouh. Une valeur sûre et sans chichis au pied de Ruka.',
      it: 'Quel tipo di pizzeria in cui entri per caso e da cui esci dicendo wow. Un punto fermo semplice e affidabile ai piedi di Ruka.',
      nl: 'Zo\'n pizzeria waar u per toeval binnenloopt en met een wauw weer naar buiten komt. Een eenvoudige, betrouwbare favoriet aan de voet van Ruka.',
    },
  },

  // Sallatunturin Tuvat — Salla (top pick)
  'ChIJ-Yu9cMZALEQRT0F0KQ9GMJU': {
    curatedDescription: {
      en: 'A woodsy cabin resort with a casual restaurant and pub, an easy place to warm up after a day out on the trails.',
      fi: 'Metsäinen mökkikylä, jossa on rento ravintola ja pubi, helppo paikka lämmitellä päivän retkeilyn jälkeen.',
      de: 'Ein waldiges Hüttendorf mit unkompliziertem Restaurant und Pub, ein guter Ort, um sich nach einem Tag auf den Wegen aufzuwärmen.',
      ja: '森に抱かれたコテージ村に、気取らないレストランとパブ。トレイルで一日過ごしたあと、ひと息つくのにちょうどいい場所です。',
      es: 'Un complejo de cabañas entre bosques, con un restaurante informal y un pub: un sitio fácil para entrar en calor tras un día por los senderos.',
      'pt-BR': 'Um refúgio de cabanas em meio à floresta, com restaurante despojado e pub, um lugar fácil para se aquecer depois de um dia nas trilhas.',
      'zh-CN': '一处林间木屋度假地，配有随性的餐厅和酒馆。在小径上玩了一天后，这里最适合暖暖身子。',
      ko: '숲속 오두막 리조트에 편안한 레스토랑과 펍이 있습니다. 하루 종일 트레일을 걷고 난 뒤 몸을 녹이기 좋은 곳입니다.',
      fr: 'Un domaine de chalets en pleine forêt, avec un restaurant décontracté et un pub, un endroit tout simple pour se réchauffer après une journée sur les sentiers.',
      it: 'Un villaggio di chalet immerso nel bosco, con un ristorante informale e un pub, un posto facile dove scaldarsi dopo una giornata sui sentieri.',
      nl: 'Een bosrijk huisjespark met een ongedwongen restaurant en pub, een fijne plek om op te warmen na een dag op de paden.',
    },
  },

  // Lapland Restaurant Kotahovi — Posio (top pick)
  'ChIJe-d8LX5OK0QR5GbJ1coh5xE': {
    curatedDescription: {
      en: 'A happy accident for the guests who find it: the atmosphere, the menu and the whole evening tend to leave people genuinely surprised.',
      fi: 'Iloinen sattuma sille, joka tänne osuu: tunnelma, ruokalista ja koko ilta jättävät vieraat usein aidosti yllättyneiksi.',
      de: 'Ein glücklicher Zufall für alle, die hierher finden: Atmosphäre, Karte und der ganze Abend lassen die Gäste oft ehrlich überrascht zurück.',
      ja: 'たどり着いた人にとっては、うれしい偶然。雰囲気も、メニューも、その夜ぜんたいも、訪れた人を心から驚かせてくれます。',
      es: 'Un feliz hallazgo para quien da con él: el ambiente, la carta y la velada entera suelen dejar a la gente sinceramente sorprendida.',
      'pt-BR': 'Um feliz acaso para quem o encontra: o ambiente, o cardápio e a noite inteira costumam deixar as pessoas sinceramente surpresas.',
      'zh-CN': '对偶然寻到这里的客人来说，是个美丽的意外。气氛、菜单与整个夜晚，往往让人由衷惊喜。',
      ko: '우연히 찾아든 손님에게는 반가운 행운. 분위기와 메뉴, 그리고 저녁 전체가 사람들을 진심으로 놀라게 하곤 합니다.',
      fr: 'Une heureuse surprise pour qui le découvre: l\'ambiance, la carte et la soirée tout entière laissent souvent les clients sincèrement étonnés.',
      it: 'Una bella sorpresa per chi lo scopre: l\'atmosfera, il menù e l\'intera serata lasciano spesso gli ospiti davvero sorpresi.',
      nl: 'Een gelukkig toeval voor wie het vindt: de sfeer, de kaart en de hele avond laten mensen vaak oprecht verrast achter.',
    },
  },

  // ── Top-pick-swapit 3.8.2026 (Vesa hyväksyi: "Lapin paras pöytä" ei voi
  // olla pizzeria, kahvila tai kiinalainen take away) ─────────────────────

  // Ravintola Golden Flower — Tornio. EI enää top pick — tilalle Mustaparran
  // Päämaja; kortti säilyy katalogissa.
  'ChIJNazYkp1H1UURmqQ-worb6y8': {
    topPick: false,
  },

  // Ruka Trek | Gasthaus & Hard Trek Café — Kuusamo (top pick 3.8.2026 alkaen).
  // 4,8 / 235 on koko oppaan Kuusamon-alueen korkein keskiarvo, ja gasthaus-
  // malli (keittiö + vierashuoneet) istuu sivuston "yövy siellä missä syöt"
  // -teemaan. Kuvaus omista faktoista, ei keksittyjä ruokalajeja.
  'ChIJi34WdzpVKUQRcWqhDjVPY4E': {
    topPick: true,
    curatedDescription: {
      en: 'A gasthaus in Ruka village that pairs its kitchen with guest rooms, so dinner and a bed can be under the same roof. Its 4.8-star average is the highest in our Kuusamo catalogue.',
      fi: 'Gasthaus Rukan kylässä: keittiö ja vierashuoneet saman katon alla, joten illallinen ja yöpaikka löytyvät samasta talosta. 4,8 tähden keskiarvo on koko oppaamme Kuusamon-alueen korkein.',
      de: 'Ein Gasthaus im Dorf Ruka, das Küche und Gästezimmer unter einem Dach vereint: Abendessen und Bett im selben Haus. Der 4,8-Sterne-Schnitt ist der höchste in unserem Kuusamo-Katalog.',
      ja: 'ルカの村にあるガストハウス。キッチンと客室がひとつ屋根の下にあり、夕食とベッドが同じ家で完結します。平均4.8の評価は、当ガイドのクーサモ地区でいちばん高い数字です。',
      es: 'Una casa de huéspedes en el pueblo de Ruka que une cocina y habitaciones bajo el mismo techo: cena y cama en la misma casa. Su media de 4,8 estrellas es la más alta de nuestro catálogo de Kuusamo.',
      'pt-BR': 'Uma gasthaus na vila de Ruka que reúne cozinha e quartos sob o mesmo teto: jantar e cama na mesma casa. Sua média de 4,8 estrelas é a mais alta do nosso catálogo de Kuusamo.',
      'zh-CN': '鲁卡村里的一家家庭旅馆餐厅，厨房与客房同在一个屋檐下，晚餐和床铺都在同一栋房子里。4.8 星的平均分是本指南库萨莫地区的最高分。',
      ko: '루카 마을의 가스트하우스. 주방과 객실이 한 지붕 아래 있어 저녁 식사와 잠자리를 같은 집에서 해결할 수 있습니다. 평점 4.8은 저희 쿠사모 카탈로그에서 가장 높은 수치입니다.',
      fr: 'Une maison d\'hôtes du village de Ruka qui réunit cuisine et chambres sous le même toit: dîner et lit dans la même maison. Sa moyenne de 4,8 étoiles est la plus haute de notre catalogue de Kuusamo.',
      it: 'Una gasthaus nel villaggio di Ruka che unisce cucina e camere sotto lo stesso tetto: cena e letto nella stessa casa. La media di 4,8 stelle è la più alta del nostro catalogo di Kuusamo.',
      nl: 'Een gasthaus in het dorp Ruka met keuken en gastenkamers onder één dak: diner en bed in hetzelfde huis. Het gemiddelde van 4,8 sterren is het hoogste in onze Kuusamo-catalogus.',
    },
  },

  // Bistro Vanha Pappila — Pyhätunturi (top pick 3.8.2026 alkaen).
  // Kuvaus pohjaa aitoon arvioon (reviewQuote) käännettynä, kuten muutkin.
  'ChIJwRKrKrPpLEQR_BDo-K25Y30': {
    topPick: true,
    curatedDescription: {
      en: 'The atmosphere feels cosy and welcoming, like being at home, and the friendliness of the owners makes the evening even more special. A bistro in an old parsonage at the foot of Pyhä.',
      fi: 'Tunnelma on kodikas ja lämmin, kuin kylässä hyvien ystävien luona, ja isäntäväen ystävällisyys tekee illasta vielä erityisemmän. Bistro vanhassa pappilassa Pyhän juurella.',
      de: 'Die Stimmung ist gemütlich und herzlich, wie zu Hause, und die Freundlichkeit der Gastgeber macht den Abend noch besonderer. Ein Bistro im alten Pfarrhaus am Fuße des Pyhä.',
      ja: '雰囲気は家にいるように居心地よく温かで、オーナー夫妻の親しみやすさが夜をさらに特別にしてくれます。ピュハの麓、古い牧師館のビストロです。',
      es: 'El ambiente es acogedor y cálido, como estar en casa, y la amabilidad de los dueños hace la velada aún más especial. Un bistró en una antigua casa parroquial al pie de Pyhä.',
      'pt-BR': 'O ambiente é aconchegante e acolhedor, como estar em casa, e a simpatia dos donos torna a noite ainda mais especial. Um bistrô numa antiga casa paroquial ao pé de Pyhä.',
      'zh-CN': '气氛温馨亲切，宾至如归，店主的热情让这一晚更加特别。这是皮哈山脚下一座老牧师宅邸里的小馆。',
      ko: '집에 있는 듯 아늑하고 따뜻한 분위기에, 주인 내외의 다정함이 저녁을 더욱 특별하게 만듭니다. 퓌하 기슭의 옛 목사관에 자리한 비스트로입니다.',
      fr: 'L\'ambiance est chaleureuse et accueillante, comme à la maison, et la gentillesse des propriétaires rend la soirée encore plus particulière. Un bistrot dans un ancien presbytère au pied du Pyhä.',
      it: 'L\'atmosfera è accogliente e calda, come a casa, e la gentilezza dei proprietari rende la serata ancora più speciale. Un bistrot in una vecchia canonica ai piedi del Pyhä.',
      nl: 'De sfeer is knus en gastvrij, alsof u thuis bent, en de vriendelijkheid van de eigenaren maakt de avond nog specialer. Een bistro in een oude pastorie aan de voet van Pyhä.',
    },
  },

  // Mustaparran Päämaja — Tornio (top pick 3.8.2026 alkaen).
  // Kuvaus pohjaa aitoon arvioon (lista + oluet), ei keksittyjä väitteitä.
  'ChIJaxo1dZ5H1UUR3eIxu_vnRbY': {
    topPick: true,
    curatedDescription: {
      en: 'Plenty of choices on the menu and good beers, as one review puts it. A relaxed local headquarters for dinner in Tornio.',
      fi: 'Monipuolinen ruokalista ja hyvät oluet, kuten eräs arvio asian tiivistää. Rento paikallinen päämaja illalliselle Torniossa.',
      de: 'Eine vielseitige Karte und gute Biere, wie es eine Bewertung zusammenfasst. Ein entspanntes lokales Hauptquartier für das Abendessen in Tornio.',
      ja: '「メニューが豊富でビールもうまい」と、あるレビューは言い切ります。トルニオでの夕食の、気取らない地元の司令部です。',
      es: 'Una carta variada y buenas cervezas, como resume una reseña. Un cuartel general local y relajado para cenar en Tornio.',
      'pt-BR': 'Um cardápio variado e boas cervejas, como resume uma avaliação. Um quartel-general local e descontraído para jantar em Tornio.',
      'zh-CN': '正如一则点评所说：菜单选择多，啤酒也不错。这是在托尔尼奥吃晚餐时轻松自在的本地大本营。',
      ko: '한 리뷰의 말처럼, 메뉴 선택이 다양하고 맥주도 좋습니다. 토르니오에서 저녁을 즐기기 좋은 편안한 동네 본부입니다.',
      fr: 'Une carte variée et de bonnes bières, comme le résume un avis. Un quartier général local et décontracté pour dîner à Tornio.',
      it: 'Un menù ricco di scelte e buone birre, come riassume una recensione. Un quartier generale locale e rilassato per la cena a Tornio.',
      nl: 'Een gevarieerde kaart en goede bieren, zoals een recensie het samenvat. Een ontspannen lokaal hoofdkwartier voor het diner in Tornio.',
    },
  },
};
