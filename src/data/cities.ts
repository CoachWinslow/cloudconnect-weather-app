export interface CityConnection {
  type: "person" | "story";
  name?: string;
  tagline?: string;
  description: string;
  emoji: string;
  url?: string;
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
    id: "pittsburgh",
    name: "Pittsburgh, PA",
    country: "USA",
    lat: 40.4406,
    lng: -79.9959,
    connection: {
      type: "story",
      description: "Home of DVSport Software — my first interaction with software as a football coach (2004). DVSport is a premier digital video acquisition, analysis, and playback platform used for instant replay and coaching analysis across NCAA football and basketball programs nationwide.",
      emoji: "🏈",
      url: "https://www.dvsport.com/",
    },
    funFact: "DVSport is a premier digital video acquisition, analysis, and playback platform used for instant replay and coaching analysis across NCAA football and basketball programs nationwide.",
  },
  {
    id: "sharon-hermitage",
    name: "Sharon/Hermitage, PA",
    country: "USA",
    lat: 41.2334,
    lng: -80.4487,
    connection: {
      type: "story",
      description: "Home of LindenPointe Innovative Business Campus — my hometown. Before the cloud, there was the current. The power transformers built here by Westinghouse Electric (1922–1985) helped wire America's electrical grid.",
      emoji: "⚡",
      url: "https://www.hermitage.net/452/LindenPointe-Innovative-Business-Campus",
    },
    funFact: "Before the cloud, there was the current. The power transformers built here by Westinghouse Electric (1922–1985) helped wire America's electrical grid — the same infrastructure that keeps data centers humming and cloud services online 24/7.",
  },
  {
    id: "pleasanton",
    name: "Pleasanton, CA",
    country: "USA",
    lat: 37.6624,
    lng: -121.8747,
    connection: {
      type: "story",
      description: "Home of ICE Mortgage Technology — my first job in tech as a Data Migration Engineer & Senior Consultant. Pleasanton grew along historic railroad lines that once connected the West Coast.",
      emoji: "🏠",
      url: "https://mortgagetech.ice.com",
    },
    funFact: "Pleasanton grew along historic railroad lines that once connected the West Coast — and today it's a SaaS corridor connecting the mortgage industry to the cloud. Physical connectivity became digital connectivity.",
  },
  {
    id: "queretaro",
    name: "Querétaro",
    country: "Mexico",
    lat: 20.5888,
    lng: -100.3899,
    connection: {
      type: "story",
      description: "Home of AWS Mexico (Central) Region — mx-central-1. The first AWS cloud region in Mexico, built to deliver low-latency cloud services across the country and nearby markets.",
      emoji: "🇲🇽",
    },
    funFact: "I studied Spanish in Querétaro when we had to use internet cafés after school hours — now it's home to AWS's Mexico (Central) cloud region powering the modern internet.",
  },
  {
    id: "medellin",
    name: "Medellín",
    country: "Colombia",
    lat: 6.2476,
    lng: -75.5658,
    connection: {
      type: "story",
      description: "Home of Ruta N Innovation District — I lived in Medellín and worked in various cafés and coworking places among worldwide digital nomads and locals.",
      emoji: "🌸",
      url: "https://rutanmedellin.org/en/",
    },
    funFact: "Once defined by a troubled past, Medellín has reinvented itself as the 'Silicon Valley of South America.' In 2024, Google Cloud opened an office in El Poblado, and Ruta N partnered with Google Cloud to train 5,000 residents in cloud computing.",
  },
  {
    id: "new-york",
    name: "New York City, NY",
    country: "USA",
    lat: 40.7128,
    lng: -74.006,
    connection: {
      type: "story",
      description: "Home of 60 Hudson Street — The Internet's Nerve Center. The cloud's most connected address on the East Coast. Built in 1930 as Western Union's telegraph HQ, it went from routing telegrams to routing the internet.",
      emoji: "🗽",
      url: "https://www.60hudson.com/",
    },
    funFact: "Built in 1930 as Western Union's telegraph HQ, 60 Hudson Street in Lower Manhattan went from routing telegrams to routing the internet. Today it's one of the most connected buildings on Earth where dozens of fiber networks converge to carry data between North America and the world.",
  },
  {
    id: "miami",
    name: "Miami, FL",
    country: "USA",
    lat: 25.7617,
    lng: -80.1918,
    connection: {
      type: "story",
      description: "Home of NAP of the Americas (Equinix MI1) — my former city is where North America and Latin America unite. A single building in downtown Miami routes internet traffic between the U.S. and 150+ countries.",
      emoji: "🌴",
      url: "https://www.equinix.com/data-centers/americas-colocation/united-states-colocation/miami-data-centers",
    },
    funFact: "A single building in downtown Miami routes internet traffic between the U.S. and 150+ countries. Miami isn't just the cultural capital of Latin America, it's the cloud capital too.",
  },
  {
    id: "sarasota",
    name: "Sarasota, FL",
    country: "USA",
    lat: 27.3364,
    lng: -82.5307,
    connection: {
      type: "story",
      description: "Home of Sarasota.Tech Community — my current city is where my 100-day reinvention is being built.",
      emoji: "🚀",
      url: "https://sarasota.tech/",
    },
    funFact: "Don't sleep on Sarasota. With no marketing budget and just word of mouth, Sarasota.Tech grew from a few friends to 3,000+ tech professionals in two years. Sarasota is rising.",
  },
];
