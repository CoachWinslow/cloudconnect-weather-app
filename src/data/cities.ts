export interface CityConnection {
  type: "person" | "story";
  name?: string;
  tagline?: string;
  description: string;
  emoji: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  connection: CityConnection;
  funFact: string;
}

export const cities: City[] = [
  {
    id: "new-york",
    name: "New York City",
    country: "USA",
    lat: 40.7128,
    lng: -74.006,
    connection: {
      type: "person",
      name: "Bob",
      tagline: "Tech junkie, loves Yankees, Miller High Life, and Jazz Clubs",
      description: "A true New Yorker at heart — Bob bleeds tech and pinstripes. When he's not deep in code, you'll find him at a smoky jazz club in the Village with a cold Miller High Life.",
      emoji: "🗽",
    },
    funFact: "NYC has 520 miles of shoreline — more than Miami, Boston, and LA combined.",
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    country: "USA",
    lat: 37.7749,
    lng: -122.4194,
    connection: {
      type: "person",
      name: "Shena S",
      tagline: "Tech savant, surfer, loving mother",
      description: "Shena rides the waves of both Silicon Valley and the Pacific. A brilliant tech mind who balances innovation with surfboards and bedtime stories.",
      emoji: "🌉",
    },
    funFact: "The fog in San Francisco has its own Twitter account — Karl the Fog.",
  },
  {
    id: "houston",
    name: "Houston",
    country: "USA",
    lat: 29.7604,
    lng: -95.3698,
    connection: {
      type: "person",
      name: "Bob W",
      tagline: "Tech mentor, sports lover, grandfather",
      description: "Bob W is the kind of mentor every engineer dreams of — patient, wise, and always ready with a sports analogy to explain complex systems. A proud grandfather who codes with grandkids on his lap.",
      emoji: "🚀",
    },
    funFact: "Houston's underground tunnel system spans 7 miles connecting 95 city blocks.",
  },
  {
    id: "hermitage",
    name: "Hermitage, PA",
    country: "USA",
    lat: 41.2334,
    lng: -80.4487,
    connection: {
      type: "person",
      name: "Jimmy B",
      tagline: "Tech guru, family man, loves Harleys & Golf",
      description: "Jimmy B proves you don't need Silicon Valley to be a tech powerhouse. From small-town PA, he builds big things — then celebrates on the golf course or cruising on his Harley.",
      emoji: "🏍️",
    },
    funFact: "Hermitage is home to the world-famous Kraynak's Christmas display with over 4 million lights.",
  },
  {
    id: "pleasanton",
    name: "Pleasanton, CA",
    country: "USA",
    lat: 37.6624,
    lng: -121.8747,
    connection: {
      type: "story",
      description: "ICE Mortgage Technology — where it all began. My first tech job that launched everything. The place where I learned that great software is built by great teams, and that mortgages are way more complicated than they look.",
      emoji: "🏠",
    },
    funFact: "Pleasanton hosts one of the oldest county fairs in California, dating back to 1912.",
  },
  {
    id: "seattle",
    name: "Seattle",
    country: "USA",
    lat: 47.6062,
    lng: -122.3321,
    connection: {
      type: "story",
      description: "Home of AWS headquarters — where cloud computing was born and continues to evolve. The epicenter of modern tech infrastructure that powers the world.",
      emoji: "☁️",
    },
    funFact: "Seattle gets fewer inches of rain per year than New York, Atlanta, or Houston.",
  },
  {
    id: "queretaro",
    name: "Querétaro",
    country: "Mexico",
    lat: 20.5888,
    lng: -100.3899,
    connection: {
      type: "story",
      description: "Amazon's strategic data center location in Mexico — a growing tech hub that bridges North American cloud infrastructure with Latin American innovation.",
      emoji: "🇲🇽",
    },
    funFact: "Querétaro's aqueduct has 74 arches spanning 1.3 km and was built as a gift of love in the 1700s.",
  },
  {
    id: "bogota",
    name: "Bogotá",
    country: "Colombia",
    lat: 4.711,
    lng: -74.0721,
    connection: {
      type: "story",
      description: "AWS hub in South America — Bogotá is rapidly becoming a cloud computing powerhouse, connecting Latin American businesses to global infrastructure.",
      emoji: "🇨🇴",
    },
    funFact: "At 8,660 feet, Bogotá is the third-highest capital city in the world.",
  },
  {
    id: "medellin",
    name: "Medellín",
    country: "Colombia",
    lat: 6.2476,
    lng: -75.5658,
    connection: {
      type: "story",
      description: "La Ciudad de la Eterna Primavera — The City of Eternal Spring. A tech innovation hub that transformed itself into one of the most forward-thinking cities in Latin America.",
      emoji: "🌸",
    },
    funFact: "Medellín's metro is the only metro system in Colombia and was the first in the country.",
  },
];
