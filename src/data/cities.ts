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
      description: "Once defined by a troubled past, Medellín has reinvented itself as a technology hub and a magnet for digital nomads, remote workers, and founders from around the world. In 2024, Google Cloud opened an office in El Poblado, and innovation hub Ruta N partnered with Google Cloud to train 5,000 residents in cloud computing.\n\nThe city also celebrates the annual Feria de las Flores, a testament to Colombia's role as the world's largest flower exporter to the United States, supplying over 60% of all cut flowers sold in America. Komet Sales, a cloud-based SaaS ERP platform built specifically for the floral industry, connects Colombian flower farms directly to U.S. importers, wholesalers, and retailers through its K2K network, the largest B2B floral e-commerce platform in the Americas.\n\nI've lived in Medellín and worked from cafés and coworking spaces alongside both locals and digital nomads. Some of my favorite spots include Hijamia Coffee in Manila barrio, Semilla Café in Laureles, and Tinkko coworking at Starbucks Plaza on Milla de Oro in El Poblado.",
      description_es: "Una vez definida por un pasado difícil, Medellín se ha reinventado como un centro tecnológico y un imán para nómadas digitales, trabajadores remotos y fundadores de todo el mundo. En 2024, Google Cloud abrió una oficina en El Poblado, y el centro de innovación Ruta N se asoció con Google Cloud para capacitar a 5,000 residentes en computación en la nube.\n\nLa ciudad también celebra la Feria de las Flores anual, un testimonio del papel de Colombia como el mayor exportador de flores del mundo hacia Estados Unidos, suministrando más del 60% de todas las flores cortadas vendidas en América. Komet Sales, una plataforma SaaS ERP basada en la nube construida específicamente para la industria floral, conecta las fincas de flores colombianas directamente con importadores, mayoristas y minoristas estadounidenses a través de su red K2K, la plataforma de comercio electrónico B2B floral más grande de las Américas.\n\nViví en Medellín y trabajé desde cafés y espacios de coworking junto a locales y nómadas digitales. Algunos de mis lugares favoritos incluyen Hijamia Coffee en el barrio Manila, Semilla Café en Laureles y Tinkko coworking en Starbucks Plaza en la Milla de Oro en El Poblado.",
      emoji: "🌸",
      url: "https://www.hijamiacoffee.com,https://www.semilla.com.co,https://tinkko.com/sede/milla-de-oro,https://www.kometsales.com,https://rutanmedellin.org",
    },
    funFact: "Once defined by a troubled past, Medellín has reinvented itself as a technology hub and a magnet for digital nomads, remote workers, and founders from around the world. In 2024, Google Cloud opened an office in El Poblado, and innovation hub Ruta N partnered with Google Cloud to train 5,000 residents in cloud computing. The city also celebrates the annual Feria de las Flores, a testament to Colombia's role as the world's largest flower exporter to the United States, supplying over 60% of all cut flowers sold in America. Komet Sales, a cloud-based SaaS ERP platform built specifically for the floral industry, connects Colombian flower farms directly to U.S. importers, wholesalers, and retailers through its K2K network, the largest B2B floral e-commerce platform in the Americas.",
    funFact_es: "Una vez definida por un pasado difícil, Medellín se ha reinventado como un centro tecnológico y un imán para nómadas digitales, trabajadores remotos y fundadores de todo el mundo. En 2024, Google Cloud abrió una oficina en El Poblado, y el centro de innovación Ruta N se asoció con Google Cloud para capacitar a 5,000 residentes en computación en la nube. La ciudad también celebra la Feria de las Flores anual, un testimonio del papel de Colombia como el mayor exportador de flores del mundo hacia Estados Unidos, suministrando más del 60% de todas las flores cortadas vendidas en América. Komet Sales, una plataforma SaaS ERP basada en la nube construida específicamente para la industria floral, conecta las fincas de flores colombianas directamente con importadores, mayoristas y minoristas estadounidenses a través de su red K2K, la plataforma de comercio electrónico B2B floral más grande de las Américas.",
  },
  {
    id: "new-york-city",
    name: "New York City, New York",
    country: "USA",
    lat: 40.7128,
    lng: -74.006,
    connection: {
      type: "story",
      description: "New York City is where the physical internet comes ashore. Long before fiber, it was the nerve center of American communication, and that role never left, it just changed form. The clearest proof is 60 Hudson Street in Tribeca, built between 1928 and 1930 as the headquarters of Western Union and once called the Telegraph Capital of America. When Western Union relocated in the 1970s, the building did not fade into history. The same pneumatic tubes that once shot paper telegrams across its floors were filled first with copper and later with fiber, and 60 Hudson became one of the most important carrier hotels on the planet. Today more than 100 telecommunications carriers and over 300 networks meet inside its walls, exchanging traffic in a meet-me room where transatlantic undersea cables landing near Lower Manhattan link North America to Europe. When data routes between continents or hops out of a server in New Jersey, there is a strong chance it passes through this single Art Deco block. The lesson for anyone learning the cloud is that the cloud is not weightless. It is buildings, power, cooling, and fiber, and New York is one of the places where the global map physically converges. That same city produced the modern tools used to watch all of this data move. Datadog, founded in New York City in 2010 by Olivier Pomel and Alexis Le-Quoc, was built for the cloud-native world, giving engineers a single SaaS platform to monitor the metrics, traces, and logs flowing across AWS, Azure, and Google Cloud. The company went public on the Nasdaq in 2019 under the ticker DDOG and now serves more than 30,000 customers, making it the observability layer that thousands of teams trust to watch their infrastructure in real time.",
      description_es: "La ciudad de Nueva York es donde el internet fisico llega a tierra. Mucho antes de la fibra optica, fue el centro nervioso de la comunicacion estadounidense, y ese papel nunca desaparecio, solo cambio de forma. La prueba mas clara es el 60 Hudson Street en Tribeca, construido entre 1928 y 1930 como sede de Western Union y conocido alguna vez como la Capital del Telegrama de America. Cuando Western Union se mudo en la decada de 1970, el edificio no se desvanecio en la historia. Los mismos tubos neumaticos que antes lanzaban telegramas de papel por sus pisos fueron llenados primero con cobre y luego con fibra, y el 60 Hudson se convirtio en uno de los carrier hotels mas importantes del planeta. Hoy mas de 100 operadores de telecomunicaciones y mas de 300 redes se encuentran dentro de sus paredes, intercambiando trafico en una sala de interconexion donde los cables submarinos transatlanticos que llegan cerca del bajo Manhattan conectan Norteamerica con Europa. Cuando los datos se enrutan entre continentes o saltan desde un servidor en Nueva Jersey, hay una gran probabilidad de que pasen por este solo bloque de estilo Art Deco. La leccion para quien aprende sobre la nube es que la nube no es ingravida. Son edificios, energia, refrigeracion y fibra, y Nueva York es uno de los lugares donde el mapa global converge fisicamente. Esa misma ciudad produjo las herramientas modernas que se usan para observar todo este movimiento de datos. Datadog, fundado en la ciudad de Nueva York en 2010 por Olivier Pomel y Alexis Le-Quoc, fue construido para el mundo nativo de la nube, dando a los ingenieros una unica plataforma SaaS para monitorear las metricas, trazas y registros que fluyen a traves de AWS, Azure y Google Cloud. La empresa salio a bolsa en el Nasdaq en 2019 bajo el ticker DDOG y ahora sirve a mas de 30,000 clientes, convirtiendose en la capa de observabilidad que miles de equipos confian para vigilar su infraestructura en tiempo real.",
      emoji: "🗽",
      url: "https://www.datadoghq.com,https://60hudsonstreet.com",
    },
    funFact: "New York City's 60 Hudson Street hosts over 300 networks in a single Art Deco building where transatlantic cables meet, while Datadog, founded here in 2010, now monitors cloud infrastructure for 30,000 customers worldwide.",
    funFact_es: "El 60 Hudson Street de la ciudad de Nueva York alberga mas de 300 redes en un solo edificio Art Deco donde se encuentran los cables transatlanticos, mientras que Datadog, fundado aqui en 2010, monitorea ahora la infraestructura en la nube para 30,000 clientes en todo el mundo.",
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
      description: "My current city, where my AWS and tech journey continue to grow. You can usually find me at 'the lab' downtown in the Palm Tower Suites working on my tech game. Don't sleep on Sarasota. This is the home of the Sarasota.Tech community, launched with no marketing budget and fueled entirely by word of mouth, it has exploded from a handful of friends to more than 3,000 builders, founders, and cloud professionals in just two years. Sarasota isn't just a beach town anymore, it's becoming a launchpad for modern, cloud-native innovation. Sarasota is also home to Nucleus Security, a fast-growing cybersecurity SaaS company and Rampant Technologies, a defense-focused technology firm delivering mission-critical cloud, cyber, and intelligence capabilities to the U.S. Department of Defense and Intelligence Community.",
      description_es: "Mi ciudad actual, donde mi viaje en AWS y tecnología continúa creciendo. Generalmente me pueden encontrar en 'the lab' en el centro en Palm Tower Suites trabajando en mi desarrollo tecnológico. No subestimes a Sarasota. Este es el hogar de la comunidad Sarasota.Tech, lanzada sin presupuesto de marketing y alimentada completamente por el boca a boca, ha explotado de un puñado de amigos a más de 3,000 constructores, fundadores y profesionales de la nube en solo dos años. Sarasota ya no es solo una ciudad de playa, se está convirtiendo en una plataforma de lanzamiento para innovación moderna nativa de la nube. Sarasota también es hogar de Nucleus Security, una empresa de ciberseguridad SaaS en rápido crecimiento y Rampant Technologies, una firma tecnológica enfocada en defensa que ofrece capacidades críticas de nube, ciberseguridad e inteligencia al Departamento de Defensa y la Comunidad de Inteligencia de EE.UU.",
      emoji: "🚀",
      url: "https://labsrq.com,https://sarasota.tech,https://nucleussec.com,https://rampanttechnologies.com",
    },
    funFact: "My current city, where my AWS and tech journey continue to grow. You can usually find me at 'the lab' downtown in the Palm Tower Suites working on my tech game. Don't sleep on Sarasota. This is the home of the Sarasota.Tech community, launched with no marketing budget and fueled entirely by word of mouth, it has exploded from a handful of friends to more than 3,000 builders, founders, and cloud professionals in just two years. Sarasota is also home to Nucleus Security and Rampant Technologies.",
    funFact_es: "Mi ciudad actual, donde mi viaje en AWS y tecnología continúa creciendo. No subestimes a Sarasota. Este es el hogar de la comunidad Sarasota.Tech, ha explotado de un puñado de amigos a más de 3,000 constructores, fundadores y profesionales de la nube en solo dos años. Sarasota también es hogar de Nucleus Security y Rampant Technologies.",
  },
];
