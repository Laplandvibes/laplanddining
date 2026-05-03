export interface Restaurant {
  name: string;
  city: string;
  type: string;
  cuisine: string;
  price: string;
  website: string;
  description: string;
  highlights: string[];
  featured?: boolean;
}

export const restaurants: Restaurant[] = [
  // ROVANIEMI
  {
    name: 'Nili',
    city: 'Rovaniemi',
    type: 'Fine Dining / Traditional Lappish',
    cuisine: 'Reindeer, salmon, game, cloudberry',
    price: 'Mains from €25 · Tasting menu €62',
    website: 'https://www.nili.fi',
    description:
      "Step inside a traditional wilderness cabin in the heart of Rovaniemi. Nili has been serving authentic Lappish flavors for over two decades — sautéed reindeer (€29.70), Arctic char, and cloudberry desserts. The four-course surprise menu (€62) is the best way to experience it all.",
    highlights: [
      'Sautéed reindeer €29.70',
      'Surprise menu €62',
      'Wilderness cabin interior',
    ],
    featured: true,
  },
  {
    name: 'Ravintola Gustav',
    city: 'Rovaniemi',
    type: 'Fine Dining',
    cuisine: 'Nordic fine dining, seasonal',
    price: 'Seasonal tasting menus',
    website: 'https://www.ravintolagustav.fi',
    description:
      "Rovaniemi's most refined dining experience. Gustav transforms Arctic ingredients into contemporary Nordic art — seasonal tasting menus that change with what the wilderness provides. Expect creative pairings and impeccable wine selections in an intimate setting.",
    highlights: ['Seasonal tasting menus', 'Arctic ingredients', 'Wine pairings'],
    featured: true,
  },
  {
    name: 'Ravintola Nabo',
    city: 'Rovaniemi',
    type: 'Modern Nordic',
    cuisine: 'Nordic, local ingredients',
    price: 'Casual fine dining',
    website: 'https://www.ravintolanabo.fi',
    description:
      "A modern kitchen where local ingredients tell the story of each season. Nabo keeps things creative yet approachable — a place where you'll find foragers' finds alongside familiar Nordic comfort on the same menu.",
    highlights: ['Seasonal menu', 'Local ingredients', 'Creative Nordic'],
  },
  {
    name: 'Roka Street Bistro',
    city: 'Rovaniemi',
    type: 'Casual Bistro',
    cuisine: 'Street food, burgers, Nordic',
    price: 'Budget-friendly',
    website: 'https://www.rokastreetbistro.fi',
    description:
      "Not every meal needs to be a fine dining affair. Roka brings Nordic street food energy to Rovaniemi's center — juicy burgers, creative wraps, and craft beers. The go-to spot after a Northern Lights hunt.",
    highlights: ['Burgers & street food', 'Craft beers', 'Central location'],
  },
  // LEVI
  {
    name: 'Kammi at Hullu Poro',
    city: 'Levi',
    type: 'Kota Restaurant / Fine Dining',
    cuisine: 'Traditional Lappish — reindeer, salmon, game',
    price: 'Reindeer feast €64',
    website: 'https://www.hulluporo.fi',
    description:
      "Dining doesn't get more Lappish than this. Gather inside a traditional kota tent around an open fire as reindeer sausages, smoked roast, and sautéed reindeer are served buffet-style (€64/person). End with crêpes and cloudberry jam. An experience, not just a meal.",
    highlights: [
      'Open fire cooking',
      'Kota tent atmosphere',
      'Reindeer feast €64',
    ],
    featured: true,
  },
  {
    name: 'King Crab House Levi',
    city: 'Levi',
    type: 'Specialty Restaurant',
    cuisine: 'King crab, Arctic seafood',
    price: 'Premium seafood',
    website: 'https://www.kingcrab.fi',
    description:
      "Norwegian king crab, pulled straight from the Arctic Ocean and served in ways you won't find anywhere else. The signature experience combines a king crab safari on the frozen fjord with a multi-course dinner. Pure Arctic luxury on a plate.",
    highlights: ['Arctic king crab', 'Safari + dinner packages', 'Unique experience'],
  },
  {
    name: 'Hullu Poro',
    city: 'Levi',
    type: 'Restaurant & Entertainment',
    cuisine: 'Lappish, Finnish, international',
    price: 'Mid-range',
    website: 'https://www.hulluporo.fi',
    description:
      "The legendary \"Crazy Reindeer\" is Levi's beating heart. Part restaurant, part live music venue, part nightclub — it's where everyone ends up after a day on the slopes. The food is honest, the portions generous, and the atmosphere unforgettable.",
    highlights: ['Après-ski legend', 'Live music', 'Nightclub'],
  },
  // INARI
  {
    name: 'Aanaar',
    city: 'Inari',
    type: 'Fine Dining / Sámi',
    cuisine: 'Sámi-influenced, hyper-local Arctic ingredients',
    price: 'Tasting menus',
    website: 'https://wildernesshotels.fi/wilderness-hotel-juutuaen/restaurant-aanaar',
    description:
      "Widely considered the best restaurant in Finnish Lapland. Aanaar celebrates Sámi food heritage with tasting menus built entirely from hyper-local ingredients — lake fish from Inari, hand-picked wild herbs, and reindeer from local herders. Every dish tells a story of indigenous tradition meeting modern craft.",
    highlights: ['Sámi fine dining', 'Lake Inari fish', 'Tasting menus'],
    featured: true,
  },
  // SAARISELKÄ
  {
    name: 'Star Arctic Hotel Restaurant',
    city: 'Saariselkä',
    type: 'Fine Dining / Glass Igloo',
    cuisine: 'Nordic fine dining',
    price: 'Fine dining',
    website: 'https://www.stararctichotel.com',
    description:
      "Imagine dining under the Northern Lights — literally. The glass igloo hotel's restaurant pairs Nordic fine dining with panoramic Arctic skies. On a clear night, the aurora dances above while you savor Arctic char and cloudberry soufflé.",
    highlights: ['Glass igloo dining', 'Northern Lights views', 'Nordic fine dining'],
    featured: true,
  },
  {
    name: 'Pirkon Pirtti',
    city: 'Saariselkä',
    type: 'Kota Restaurant',
    cuisine: 'Lappish — reindeer, salmon, game',
    price: 'Traditional dining',
    website: '',
    description:
      "A crackling fire, the smell of smoke, and food cooked the way it has been for centuries. Pirkon Pirtti is a kota tent experience in the wilderness of Saariselkä — no electricity, no pretense, just flame-grilled salmon and sautéed reindeer under a canopy of stars.",
    highlights: ['Open fire cooking', 'Kota atmosphere', 'Classic Lapland'],
  },
  // KEMI
  {
    name: 'SnowRestaurant',
    city: 'Kemi',
    type: 'Ice Restaurant / Unique Experience',
    cuisine: 'Lappish, Finnish',
    price: 'Seasonal experience',
    website: 'https://www.visitkemi.fi',
    description:
      "Your table, your chair, your plate — all made of ice. The SnowCastle restaurant in Kemi is a once-in-a-lifetime dining experience where food is served at -5°C on frozen plates. Open January through April, it's the kind of meal you'll talk about for years.",
    highlights: [
      'Ice castle dining',
      'Food on ice plates',
      'Winter only (Jan–Apr)',
    ],
    featured: true,
  },
  // YLLÄS
  {
    name: 'Ylläs Saaga Hotel Restaurant',
    city: 'Ylläs',
    type: 'Hotel Restaurant / Fine Dining',
    cuisine: 'Nordic, Lappish',
    price: 'Hotel fine dining',
    website: 'https://www.yllassaaga.fi',
    description:
      "Perched on the fells with views that stretch to the horizon, Ylläs Saaga pairs Lappish ingredients with fell hotel elegance. Their aurora dinner events — where the restaurant dims its lights when the Northern Lights appear — are legendary.",
    highlights: ['Fell hotel views', 'Lappish ingredients', 'Aurora dinners'],
  },
  // TORNIO
  {
    name: 'Ravintola Mustaparta',
    city: 'Tornio',
    type: 'Restaurant-Bar',
    cuisine: 'Finnish, steaks',
    price: 'Mid-range',
    website: '',
    description:
      "A Tornio institution named after a legendary local sea captain. Mustaparta serves hearty Finnish steaks and comfort food in a border-town atmosphere where Finnish and Swedish cultures blend seamlessly.",
    highlights: ['Tornio landmark', 'Steaks', 'Finnish cuisine'],
  },
  // HAPARANDA
  {
    name: 'Cape East',
    city: 'Haparanda (Sweden)',
    type: 'Hotel & Spa Restaurant',
    cuisine: 'Nordic, Swedish',
    price: 'Upscale',
    website: 'https://www.capeeast.se',
    description:
      "Cross the border into Sweden and find yourself at a waterfront spa complex with panoramic views over the Torne River. Cape East blends Swedish fine dining with Nordic simplicity — the perfect detour from the Finnish side.",
    highlights: ['Waterfront dining', 'Spa restaurant', 'Swedish-Finnish border'],
  },
  {
    name: 'Stadshotellet Haparanda',
    city: 'Haparanda (Sweden)',
    type: 'Hotel Restaurant',
    cuisine: 'Swedish, Nordic',
    price: 'Mid-range',
    website: 'https://www.haparandastadshotell.se',
    description:
      "The grand old hotel restaurant of Haparanda, where Swedish and Finnish culinary traditions meet on the border. Classic Nordic comfort in a historic setting — the kind of place where locals celebrate special occasions.",
    highlights: ['Historic hotel', 'Border town charm', 'Swedish cuisine'],
  },
];

export const cities = [
  'Rovaniemi',
  'Levi',
  'Inari',
  'Saariselkä',
  'Kemi',
  'Ylläs',
  'Tornio',
  'Haparanda (Sweden)',
];

export function getRestaurantsByCity(city: string) {
  return restaurants.filter((r) => r.city === city);
}

export function getFeaturedRestaurants() {
  return restaurants.filter((r) => r.featured);
}
