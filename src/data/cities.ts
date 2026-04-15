export interface CityConnection {
  type: "person" | "story";
  name?: string;
  tagline?: string;
  description: string;
  description_es?: string;
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
  funFact_es?: string;
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
      description_es: "Hogar de DVSport Software — mi primera interacción con software como entrenador de fútbol americano (2004). DVSport es una plataforma líder de adquisición, análisis y reproducción de video digital utilizada para repeticiones instantáneas y análisis de coaching en programas de fútbol americano y baloncesto de la NCAA.",
      emoji: "🏈",
      url: "https://www.dvsport.com/",
    },
    funFact: "DVSport is a premier digital video acquisition, analysis, and playback platform used for instant replay and coaching analysis across NCAA football and basketball programs nationwide.",
    funFact_es: "DVSport es una plataforma líder de adquisición, análisis y reproducción de video digital utilizada para repeticiones instantáneas y análisis de coaching en programas de fútbol americano y baloncesto de la NCAA.",
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
      description_es: "Hogar del campus empresarial innovador LindenPointe — mi ciudad natal. Antes de la nube, estaba la corriente. Los transformadores de energía construidos aquí por Westinghouse Electric (1922–1985) ayudaron a cablear la red eléctrica de Estados Unidos.",
      emoji: "⚡",
      url: "https://www.hermitage.net/452/LindenPointe-Innovative-Business-Campus",
    },
    funFact: "Before the cloud, there was the current. The power transformers built here by Westinghouse Electric (1922–1985) helped wire America's electrical grid — the same infrastructure that keeps data centers humming and cloud services online 24/7.",
    funFact_es: "Antes de la nube, estaba la corriente. Los transformadores de energía construidos aquí por Westinghouse Electric (1922–1985) ayudaron a cablear la red eléctrica de Estados Unidos — la misma infraestructura que mantiene los centros de datos funcionando y los servicios en la nube en línea las 24 horas.",
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
      description_es: "Hogar de ICE Mortgage Technology — mi primer trabajo en tecnología como Ingeniero de Migración de Datos y Consultor Senior. Pleasanton creció a lo largo de las líneas ferroviarias históricas que una vez conectaron la Costa Oeste.",
      emoji: "🏠",
      url: "https://mortgagetech.ice.com",
    },
    funFact: "Pleasanton grew along historic railroad lines that once connected the West Coast — and today it's a SaaS corridor connecting the mortgage industry to the cloud. Physical connectivity became digital connectivity.",
    funFact_es: "Pleasanton creció a lo largo de las líneas ferroviarias históricas que conectaban la Costa Oeste — y hoy es un corredor SaaS que conecta la industria hipotecaria con la nube. La conectividad física se convirtió en conectividad digital.",
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
      description_es: "Hogar de la Región AWS México (Central) — mx-central-1. La primera región de nube de AWS en México, construida para ofrecer servicios de nube de baja latencia en todo el país y mercados cercanos.",
      emoji: "🇲🇽",
    },
    funFact: "I studied Spanish in Querétaro when we had to use internet cafés after school hours — now it's home to AWS's Mexico (Central) cloud region powering the modern internet.",
    funFact_es: "Estudié español en Querétaro cuando teníamos que usar cafés internet después de clases — ahora es hogar de la región de nube AWS México (Central) que impulsa el internet moderno.",
  },
  {
    id: "medellin",
    name: "Medellín",
    country: "Colombia",
    lat: 6.2476,
    lng: -75.5658,
    connection: {
      type: "story",
      description: "Home of Ruta N Innovation District — I lived in Medellín and worked from cafés and coworking spaces alongside both locals and digital nomads. Some of my favorite spots include Hijamia Coffee in Manila barrio, Semilla Café in Laureles, and Tinkko coworking at Starbucks Plaza on Milla de Oro in El Poblado.",
      description_es: "Hogar del Distrito de Innovación Ruta N — Viví en Medellín y trabajé desde cafés y espacios de coworking junto a locales y nómadas digitales. Algunos de mis lugares favoritos incluyen Hijamia Coffee en el barrio Manila, Semilla Café en Laureles y Tinkko coworking en Starbucks Plaza en la Milla de Oro en El Poblado.",
      emoji: "🌸",
      url: "https://www.kometsales.com",
    },
    funFact: "Once defined by a troubled past, Medellín has reinvented itself as a technology hub and a magnet for digital nomads, remote workers, and founders from around the world. In 2024, Google Cloud opened an office in El Poblado, and innovation hub Ruta N partnered with Google Cloud to train 5,000 residents in cloud computing. The city also celebrates the annual Feria de las Flores, a testament to Colombia's role as the world's largest flower exporter to the United States, supplying over 60% of all cut flowers sold in America. Komet Sales, a cloud-based SaaS ERP platform built specifically for the floral industry, connects Colombian flower farms directly to U.S. importers, wholesalers, and retailers through its K2K network, the largest B2B floral e-commerce platform in the Americas.",
    funFact_es: "Una vez definida por un pasado difícil, Medellín se ha reinventado como un centro tecnológico y un imán para nómadas digitales, trabajadores remotos y fundadores de todo el mundo. En 2024, Google Cloud abrió una oficina en El Poblado, y el centro de innovación Ruta N se asoció con Google Cloud para capacitar a 5,000 residentes en computación en la nube. La ciudad también celebra la Feria de las Flores anual, un testimonio del papel de Colombia como el mayor exportador de flores del mundo hacia Estados Unidos, suministrando más del 60% de todas las flores cortadas vendidas en América. Komet Sales, una plataforma SaaS ERP basada en la nube construida específicamente para la industria floral, conecta las fincas de flores colombianas directamente con importadores, mayoristas y minoristas estadounidenses a través de su red K2K, la plataforma de comercio electrónico B2B floral más grande de las Américas.",
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
      description_es: "Hogar de 60 Hudson Street — El Centro Nervioso del Internet. La dirección más conectada de la nube en la Costa Este. Construido en 1930 como sede de telégrafos de Western Union, pasó de enrutar telegramas a enrutar el internet.",
      emoji: "🗽",
      url: "https://www.60hudson.com/",
    },
    funFact: "Built in 1930 as Western Union's telegraph HQ, 60 Hudson Street in Lower Manhattan went from routing telegrams to routing the internet. Today it's one of the most connected buildings on Earth where dozens of fiber networks converge to carry data between North America and the world.",
    funFact_es: "Construido en 1930 como sede de telégrafos de Western Union, 60 Hudson Street en el bajo Manhattan pasó de enrutar telegramas a enrutar el internet. Hoy es uno de los edificios más conectados del mundo donde decenas de redes de fibra convergen para transportar datos entre Norteamérica y el mundo.",
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
      description_es: "Hogar del NAP de las Américas (Equinix MI1) — mi antigua ciudad es donde Norteamérica y Latinoamérica se unen. Un solo edificio en el centro de Miami enruta tráfico de internet entre EE.UU. y más de 150 países.",
      emoji: "🌴",
      url: "https://www.equinix.com/data-centers/americas-colocation/united-states-colocation/miami-data-centers",
    },
    funFact: "A single building in downtown Miami routes internet traffic between the U.S. and 150+ countries. Miami isn't just the cultural capital of Latin America, it's the cloud capital too.",
    funFact_es: "Un solo edificio en el centro de Miami enruta tráfico de internet entre EE.UU. y más de 150 países. Miami no es solo la capital cultural de Latinoamérica, también es la capital de la nube.",
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
      description_es: "Hogar de la Comunidad Sarasota.Tech — mi ciudad actual es donde se está construyendo mi reinvención de 100 días.",
      emoji: "🚀",
      url: "https://sarasota.tech/",
    },
    funFact: "Don't sleep on Sarasota. With no marketing budget and just word of mouth, Sarasota.Tech grew from a few friends to 3,000+ tech professionals in two years. Sarasota is rising.",
    funFact_es: "No subestimes a Sarasota. Sin presupuesto de marketing y solo de boca en boca, Sarasota.Tech creció de unos pocos amigos a más de 3,000 profesionales de tecnología en dos años. Sarasota está en ascenso.",
  },
];
