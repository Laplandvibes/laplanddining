import type { NewsletterPopupCopy, NewsletterPopupTheme } from '../shared/NewsletterPopup';

/**
 * laplanddining.com: uutiskirjepopupin oma väri ja teksti.
 *
 * Vesa 23.9.2026: "tekstit ja värimaailma sivustokohtaisiksi" → "kyllä, vie
 * kaikille". Kuva, lomake, nappi ja #LAPLAND-merkki pysyvät verkoston yhteisinä.
 * Väri = tämän sivuston oma pääväri, mitattu elävältä etusivulta 23.9.2026
 * (lämmin meripihka #B45309 tekstissä, #F59E0B napeissa). Kontrasti tarkistettu: napin teksti ≥ 4,5:1,
 * kuvan rengas ≥ 3:1 korttia vasten.
 * Teksti = sivun oma aihe lukijan näkökulmasta, 12 kielellä natiivina.
 * 🔴 Ei hälytyksiä, ei lähetystahtia, ei "ensimmäisenä" (9.8.2026 lupauspurku):
 * uutiskirje lähtee vain kun on kerrottavaa. Otsikko tulee jaetusta komponentista.
 */
export const POPUP_THEME: NewsletterPopupTheme = {
  surface: '#0F172A',
  accent: '#F59E0B',
  cta: '#B45309',
  onCta: '#FFFFFF',
};

export const POPUP_COPY: NewsletterPopupCopy = {
  en: {
    description: 'Founder of LaplandVibes. Fell restaurants, small village cafés, and Arctic char and reindeer on the plate. I tell you where to eat, which tables to book early and which places genuinely surprise you.',
  },
  fi: {
    description: 'LaplandVibesin perustaja. Tunturiravintolat, kylien pienet kahvilat ja lautasella nieriää ja poroa. Kerron, missä kannattaa syödä, mihin pöytä pitää varata ajoissa ja mitkä paikat oikeasti yllättävät.',
  },
  de: {
    description: 'Gründer von LaplandVibes. Fjällrestaurants, kleine Dorfcafés, dazu Saibling und Rentier auf dem Teller. Ich zeige Ihnen, wo Sie essen sollten, wo Sie rechtzeitig einen Tisch reservieren müssen und welche Lokale wirklich überraschen.',
  },
  ja: {
    description: 'LaplandVibes創業者。フェルのレストランに村の小さなカフェ、お皿には北極イワナとトナカイ。どこで食べるとよいか、早めに席を予約しておきたい店、本当に驚かされる場所をご紹介します。',
  },
  es: {
    description: 'Fundador de LaplandVibes. Restaurantes en el fjäll, pequeñas cafeterías de pueblo y, en el plato, salvelino ártico y reno. Le cuento dónde vale la pena comer, dónde hay que reservar mesa con anticipación y qué lugares de verdad sorprenden.',
  },
  'pt-BR': {
    description: 'Fundador do LaplandVibes. Restaurantes nos montes, pequenos cafés de vilarejo e, no prato, salvelino-ártico e rena. Conto onde vale a pena comer, em quais lugares é preciso reservar mesa com antecedência e quais realmente surpreendem.',
  },
  'zh-CN': {
    description: 'LaplandVibes创始人。山地餐厅、村里的小咖啡馆，盘中有北极红点鲑和驯鹿肉。我告诉你去哪里吃、哪家要提前订位，以及哪些地方真正令人惊喜。',
  },
  ko: {
    description: 'LaplandVibes 창립자. 펠 레스토랑, 마을의 작은 카페, 접시 위의 북극 곤들매기와 순록. 어디서 먹으면 좋은지, 어느 식당은 미리 예약해야 하는지, 어떤 곳이 정말 기대 이상인지 알려드립니다.',
  },
  fr: {
    description: 'Fondateur de LaplandVibes. Restaurants sur les fjälls, petits cafés de village et, dans l\'assiette, omble arctique et renne. Je vous indique où bien manger, quelles tables réserver à l\'avance et quelles adresses surprennent vraiment.',
  },
  it: {
    description: 'Fondatore di LaplandVibes. Ristoranti sui fjäll, piccoli caffè di paese e, nel piatto, salmerino artico e renna. Le segnalo dove vale la pena mangiare, in quali locali il tavolo va prenotato per tempo e quali posti sorprendono davvero.',
  },
  nl: {
    description: 'Oprichter van LaplandVibes. Fjällrestaurants en kleine dorpscafés, met beekridder en rendier op het bord. Ik vertel u waar u goed eet, waar u op tijd een tafel moet reserveren en welke plekken echt verrassen.',
  },
  sv: {
    description: 'Grundare av LaplandVibes. Fjällrestauranger och små kaféer i byarna, med röding och ren på tallriken. Jag berättar var du ska äta, var du behöver boka bord i god tid och vilka ställen som verkligen överraskar.',
  },
};
