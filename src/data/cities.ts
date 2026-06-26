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
    name: "Miami, Florida",
    country: "USA",
    lat: 25.7617,
    lng: -80.1918,
    connection: {
      type: "story",
      description: "Miami is where North America becomes the Caribbean, and where the physical internet makes that geography real. Two Equinix data centers form the backbone of connectivity between the United States and 150+ countries across Latin America. Equinix MI1, built on the foundation of the former NAP of the Americas, sits downtown and operates as the primary network exchange point between the U.S. and Latin America, hosting 322 networks and 9 internet exchanges in 658,000 square feet of carrier-dense space. Fiber optics fill conduits that snake through downtown's financial district, and subsea cables land nearby carrying data from Puerto Rico, Venezuela, Brazil, and beyond. A few miles west, Equinix MI6 in Doral extends that reach with another 150,000 square feet of interconnection space, giving carriers and content delivery networks a second major point of presence in South Florida's international commerce corridor. What makes this setup remarkable is the asymmetry: data flowing south to Latin America and the Caribbean moves through Miami with almost zero latency because the cables terminate here. For any cloud service serving Spanish-speaking markets, this geography matters more than most people realize. The city that grew from that geographic advantage also grew Kaseya, founded in 2000 and now headquartered in Miami's Brickell financial district. Kaseya built the IT management platform that thousands of managed service providers (MSPs) depend on to monitor, patch, and automate infrastructure across millions of endpoints globally. The company moved its U.S. headquarters to Miami in 2018, now serves over 40,000 organizations, and holds the naming rights to the Miami Heat arena, signaling the city's shift from pure tourism destination to serious technology hub. The lesson is simple: geography shapes infrastructure, and infrastructure shapes what gets built on top of it.",
      description_es: "Miami es donde Norteamérica se convierte en el Caribe, y donde el internet físico hace real esa geografía. Dos centros de datos de Equinix forman la columna vertebral de conectividad entre Estados Unidos y más de 150 países de Latinoamérica. Equinix MI1, construido sobre los cimientos del antiguo NAP de las Américas, se ubica en el centro y opera como el principal punto de intercambio de redes entre EE.UU. y Latinoamérica, albergando 322 redes y 9 intercambios de internet en 658,000 pies cuadrados de espacio densamente ocupado por operadores. Las fibras ópticas llenan conductos que serpentean por el distrito financiero del centro, y cables submarinos llegan cerca transportando datos desde Puerto Rico, Venezuela, Brasil y más allá. A unas pocas millas al oeste, Equinix MI6 en Doral extiende ese alcance con otros 150,000 pies cuadrados de espacio de interconexión, dando a los operadores y redes de entrega de contenido un segundo punto de presencia importante en el corredor de comercio internacional del sur de Florida. Lo que hace notable esta configuración es la asimetría: los datos que fluyen hacia el sur hacia Latinoamérica y el Caribe se mueven a través de Miami con latencia casi nula porque los cables terminan aquí. Para cualquier servicio en la nube que atienda mercados hispanohablantes, esta geografía importa más de lo que la mayoría de la gente se da cuenta. La ciudad que creció de esa ventaja geográfica también creció Kaseya, fundada en 2000 y ahora con sede en el distrito financiero Brickell de Miami. Kaseya construyó la plataforma de gestión de TI en la que miles de proveedores de servicios gestionados (MSPs) dependen para monitorear, parchar y automatizar infraestructura en millones de endpoints a nivel mundial. La empresa trasladó su sede estadounidense a Miami en 2018, ahora sirve a más de 40,000 organizaciones y ostenta los derechos de nombre del estadio del Miami Heat, señalando el cambio de la ciudad de un destino turístico puro a un centro tecnológico serio. La lección es simple: la geografía moldea la infraestructura, y la infraestructura moldea lo que se construye sobre ella.",
      emoji: "🌊",
      url: "https://www.equinix.com/data-centers/americas-colocation/united-states-colocation/miami-data-centers,https://www.kaseya.com",
    },
    funFact: "Miami is where North America meets Latin America's internet. Equinix MI1 and MI6 host 322 networks and route data to 150+ countries with near-zero latency, while Kaseya, founded here in 2000, now manages millions of endpoints for 40,000+ organizations worldwide.",
    funFact_es: "Miami es donde el internet de Norteamérica se encuentra con el de Latinoamérica. Equinix MI1 y MI6 albergan 322 redes y enrutan datos hacia más de 150 países con latencia casi nula, mientras que Kaseya, fundada aquí en 2000, ahora gestiona millones de endpoints para más de 40,000 organizaciones en todo el mundo.",
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
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    connection: {
      type: "story",
      description: "Singapore is where Southeast Asia's data flows meet Wall Street capital. Equinix operates five data centers here (SG1, SG2, SG3, SG4, SG5, with SG6 opening 2027), making it home to the Asia-Pacific Network Operations Center and one of the world's top internet exchange points with access to GRX peering infrastructure. AWS runs three availability zones, Microsoft Azure has the Southeast Asia region, and Google Cloud shares the ecosystem. The carriers and cloud providers here number over 1,300, connected through Equinix Fabric and direct lines to major networks across Asia. Singapore was meant to be a transshipment hub for physical goods when it became a city-state, and that same logic applies to digital goods: it sits at the geographic and economic center of Southeast Asia, making it the natural point where data from eight Southeast Asian countries converges before heading to the rest of the world. Shopee, founded in Singapore in February 2015 and owned by parent company Sea Ltd (formerly Garena, founded 2009), is the largest e-commerce platform in Southeast Asia with 47.9 billion dollars in gross merchandise volume as of 2023. Built as a mobile-first marketplace, Shopee expanded across six Southeast Asian markets and went public on the New York Stock Exchange in 2017, becoming the first major Southeast Asian internet company to list in the U.S. Shopee operates from its six-story regional headquarters at Singapore Science Park and now serves over 187 million users across the region, proving that transformative technology can be built in Southeast Asia and scaled to global markets without relocating to Silicon Valley.",
      description_es: "Singapur es donde los datos del Sudeste Asiático se encuentran con el capital de Wall Street. Equinix opera cinco centros de datos aquí (SG1, SG2, SG3, SG4, SG5, con SG6 abriendo en 2027), convirtiéndolo en hogar del Centro de Operaciones de Red de Asia-Pacífico y uno de los principales puntos de intercambio de internet del mundo con acceso a infraestructura de interconexión GRX. AWS opera tres zonas de disponibilidad, Microsoft Azure tiene la región del Sudeste Asiático, y Google Cloud comparte el ecosistema. Los operadores y proveedores de nube aquí suman más de 1,300, conectados a través de Equinix Fabric y líneas directas a las principales redes de Asia. Singapur fue concebido como un centro de transbordo de bienes físicos cuando se convirtió en ciudad-estado, y esa misma lógica se aplica a los bienes digitales: se encuentra en el centro geográfico y económico del Sudeste Asiático, convirtiéndolo en el punto natural donde los datos de ocho países del Sudeste Asiático convergen antes de dirigirse al resto del mundo. Shopee, fundado en Singapur en febrero de 2015 y propiedad de la empresa matriz Sea Ltd (anteriormente Garena, fundada en 2009), es la plataforma de comercio electrónico más grande del Sudeste Asiático con 47.9 mil millones de dólares en volumen bruto de mercancías en 2023. Construido como un marketplace móvil primero, Shopee se expandió por seis mercados del Sudeste Asiático y salió a bolsa en la Bolsa de Valores de Nueva York en 2017, convirtiéndose en la primera gran empresa de internet del Sudeste Asiático en cotizar en EE.UU. Shopee opera desde su sede regional de seis pisos en Singapore Science Park y ahora sirve a más de 187 millones de usuarios en toda la región, demostrando que la tecnología transformadora puede construirse en el Sudeste Asiático y escalar a mercados globales sin reubicarse a Silicon Valley.",
      emoji: "🏙️",
      url: "https://www.equinix.com/data-centers/asia-pacific-colocation/singapore-colocation/,https://www.shopee.sg",
    },
    funFact: "Singapore hosts Equinix's Asia-Pacific Network Operations Center with five data centers and over 1,300 carriers, while Shopee, founded here in 2015, became the largest e-commerce platform in Southeast Asia with 187 million users and a listing on the New York Stock Exchange.",
    funFact_es: "Singapur alberga el Centro de Operaciones de Red de Asia-Pacífico de Equinix con cinco centros de datos y más de 1,300 operadores, mientras que Shopee, fundado aquí en 2015, se convirtió en la plataforma de comercio electrónico más grande del Sudeste Asiático con 187 millones de usuarios y una cotización en la Bolsa de Valores de Nueva York.",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    connection: {
      type: "story",
      description: "Tokyo is where Japan's financial markets and the digital infrastructure that powers them occupy the same physical space. Equinix operates 14 data centers here, with TY15 scheduled to open in 2024, all concentrated in Tokyo's Shinagawa corridor as a unified campus serving Japan's largest concentration of financial firms, networks, and cloud providers. AWS runs four availability zones across Tokyo and Osaka, and has announced $15 billion in new investment through 2029. Microsoft Azure and Google Cloud both operate regions here, and together they form an ecosystem where hundreds of carriers and enterprise networks interconnect at BBIX, JPIX, and JPNAP peering points. Tokyo leads Asia-Pacific in interconnection growth according to the Global Interconnection Index, with forecasted bandwidth capacity reaching 1,758 Tbps. The city's role as Japan's financial and corporate capital means data passing through Tokyo includes trades, insurance claims, supply chain updates, and customer interactions for nearly every major Japanese enterprise and bank. Rakuten, founded by Hiroshi Mikitani in February 1997 in Tokyo, launched Japan's first e-commerce marketplace, Rakuten Ichiba, on May 1, 1997 with just six employees and 13 merchants. The company went public on the JASDAQ market on April 19, 2000 and evolved into a technology conglomerate offering services spanning e-commerce, fintech, digital content, and telecommunications across 30 countries. By 2011, Rakuten Ichiba's gross transaction volume surpassed 1 trillion yen with 38,000 online shops, cementing Japan's first major internet company as the blueprint for how traditional manufacturing economies transition to digital platforms.",
      description_es: "Tokio es donde los mercados financieros de Japón y la infraestructura digital que los impulsa ocupan el mismo espacio físico. Equinix opera 14 centros de datos aquí, con TY15 programado para abrir en 2024, todos concentrados en el corredor Shinagawa de Tokio como un campus unificado que sirve a la mayor concentración de Japón de firmas financieras, redes y proveedores de nube. AWS opera cuatro zonas de disponibilidad en Tokio y Osaka, y ha anunciado $15 mil millones en nuevas inversiones hasta 2029. Microsoft Azure y Google Cloud operan regiones aquí, y juntas forman un ecosistema donde cientos de operadores y redes empresariales se interconectan en puntos de interconexión BBIX, JPIX y JPNAP. Tokio lidera el crecimiento de interconexión en Asia-Pacífico según el Índice Global de Interconexión, con una capacidad de ancho de banda prevista que alcanza 1,758 Tbps. El papel de la ciudad como capital financiera y corporativa de Japón significa que los datos que pasan por Tokio incluyen transacciones, reclamaciones de seguros, actualizaciones de la cadena de suministro e interacciones con clientes para casi cada empresa y banco japonés importante. Rakuten, fundado por Hiroshi Mikitani en febrero de 1997 en Tokio, lanzó el primer mercado de comercio electrónico de Japón, Rakuten Ichiba, el 1 de mayo de 1997 con solo seis empleados y 13 comerciantes. La empresa salió a bolsa en el mercado JASDAQ el 19 de abril de 2000 y evolucionó hacia un conglomerado tecnológico que ofrece servicios que abarcan comercio electrónico, fintech, contenido digital y telecomunicaciones en 30 países. Para 2011, el volumen bruto de transacciones de Rakuten Ichiba superó el billón de yenes con 38,000 tiendas en línea, consolidando a la primera gran empresa de internet de Japón como el modelo para cómo las economías manufactureras tradicionales hacen la transición a plataformas digitales.",
      emoji: "🗼",
      url: "https://www.equinix.com/data-centers/asia-pacific-colocation/japan-colocation/tokyo-data-centers,https://www.rakuten.co.jp",
    },
    funFact: "Tokyo hosts Equinix's largest Asia-Pacific campus with 14 data centers, leads the region in interconnection growth at 1,758 Tbps, and is home to Rakuten, Japan's first major internet company founded in 1997.",
    funFact_es: "Tokio alberga el campus más grande de Equinix en Asia-Pacífico con 14 centros de datos, lidera el crecimiento de interconexión en la región a 1,758 Tbps, y es hogar de Rakuten, la primera gran empresa de internet de Japón fundada en 1997.",
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    lat: 13.7563,
    lng: 100.5018,
    connection: {
      type: "story",
      description: "Bangkok is emerging as Southeast Asia's second-largest data center market and the region's newest hyperscale hub. Between 2019 and 2024, Bangkok's total IT capacity grew more than twentyfold, with pipeline capacity recording a compound annual growth rate of 40%. Equinix announced a $500 million investment to build two new IBX data centers in Bangkok's Bangna area, providing 3,375 cabinets at full build-out. AWS launched the AWS Asia Pacific (Thailand) Region in 2024 with a $5 billion investment commitment, deploying three availability zones with independent power and cooling systems. Google committed $1 billion for a hyperscale facility in Chonburi province east of Bangkok, while Microsoft launched its first Thailand cloud region. STT GDC, a Singapore-based infrastructure provider, is expanding operations in Thailand, and dozens of other international and regional carriers now route traffic through Bangkok. The Eastern Economic Corridor, spanning three provinces east of Bangkok, has emerged as the primary zone for hyperscale data center construction, with Chonburi and Rayong leading development. Bangkok's IT capacity for cloud computing accounts for 38% of total capacity as of early 2025, while AI workloads already consume 28%, driven by large language model training and inference demands that require high-density GPU infrastructure and massive cooling systems. The city's rapid transformation from a traditional regional telecom hub to a global AI infrastructure center is powered by abundant electricity supply, improving fiber connectivity, and Thai government incentives through the Board of Investment's digital transformation initiatives.",
      description_es: "Bangkok está emergiendo como el segundo mercado de centros de datos más grande del Sudeste Asiático y el nuevo centro hyperscale de la región. Entre 2019 y 2024, la capacidad total de TI de Bangkok creció más de veinte veces, con la capacidad en pipeline registrando una tasa de crecimiento anual compuesta del 40%. Equinix anunció una inversión de $500 millones para construir dos nuevos centros de datos IBX en el área de Bangna de Bangkok, proporcionando 3,375 gabinetes en su construcción completa. AWS lanzó la Región AWS Asia Pacífico (Tailandia) en 2024 con un compromiso de inversión de $5 mil millones, desplegando tres zonas de disponibilidad con sistemas de energía y refrigeración independientes. Google se comprometió con $1 mil millones para una instalación hyperscale en la provincia de Chonburi al este de Bangkok, mientras que Microsoft lanzó su primera región de nube en Tailandia. STT GDC, un proveedor de infraestructura con sede en Singapur, está expandiendo operaciones en Tailandia, y docenas de otros operadores internacionales y regionales ahora enrutan tráfico a través de Bangkok. El Corredor Económico del Este, que abarca tres provincias al este de Bangkok, ha surgido como la zona principal para la construcción de centros de datos hyperscale, con Chonburi y Rayong liderando el desarrollo. La capacidad de TI de Bangkok para computación en la nube representa el 38% de la capacidad total a principios de 2025, mientras que las cargas de trabajo de IA ya consumen el 28%, impulsadas por las demandas de entrenamiento e inferencia de modelos de lenguaje grande que requieren infraestructura de GPU de alta densidad y sistemas de refrigeración masivos. La rápida transformación de la ciudad de un centro regional de telecomunicaciones tradicional a un centro global de infraestructura de IA está impulsada por un suministro abundante de electricidad, la mejora de la conectividad de fibra óptica, y los incentivos del gobierno tailandés a través de las iniciativas de transformación digital de la Junta de Inversión.",
      emoji: "🌴",
      url: "https://www.equinix.com/data-centers/asia-pacific-colocation/,https://aws.amazon.com/local/thailand/",
    },
    funFact: "Bangkok's data center capacity grew twentyfold between 2019 and 2024, with cloud computing at 38% and AI workloads at 28% of total IT capacity as AWS, Google, and Microsoft all launched major cloud regions.",
    funFact_es: "La capacidad de centros de datos de Bangkok creció veinte veces entre 2019 y 2024, con computación en la nube al 38% y cargas de trabajo de IA al 28% de la capacidad total de TI, mientras que AWS, Google y Microsoft lanzaron grandes regiones de nube.",
  },
  {
    id: "ningxia",
    name: "Ningxia",
    country: "China",
    lat: 38.4680,
    lng: 106.2681,
    connection: {
      type: "story",
      description: "AWS China (Ningxia) Region launched 2017 and is operated by Ningxia Western Cloud Data Technology (NWCD), offering three availability zones in Zhongwei city within the Western Cloud Valley ecosystem. The region supports 32 AWS services and is expanding Phase 2 to 1.3x original capacity, serving Chinese enterprises with data residency compliance requirements. Alibaba Cloud and other domestic providers compete here for the massive Chinese market, which is heavily isolated from global AWS infrastructure due to Chinese regulations.",
      description_es: "La Región AWS China (Ningxia) se lanzó en 2017 y es operada por Ningxia Western Cloud Data Technology (NWCD), ofreciendo tres zonas de disponibilidad en la ciudad de Zhongwei dentro del ecosistema Western Cloud Valley. La región admite 32 servicios de AWS y está expandiendo la Fase 2 a 1.3 veces la capacidad original, atendiendo a empresas chinas con requisitos de cumplimiento de residencia de datos. Alibaba Cloud y otros proveedores nacionales compiten aquí por el enorme mercado chino, que está fuertemente aislado de la infraestructura global de AWS debido a las regulaciones chinas.",
      emoji: "🏔️",
      url: "https://aws.amazon.com/cn/about-aws/global-infrastructure/regions_availability-zones/",
    },
    funFact: "AWS China (Ningxia) launched 2017 with three availability zones in Zhongwei, operated by NWCD and expanding to 1.3x original capacity to serve Chinese enterprises with strict data residency requirements.",
    funFact_es: "AWS China (Ningxia) se lanzó en 2017 con tres zonas de disponibilidad en Zhongwei, operada por NWCD y expandiéndose a 1.3 veces la capacidad original para atender a empresas chinas con requisitos estrictos de residencia de datos.",
  },
  {
    id: "taipei",
    name: "Taipei",
    country: "Taiwan",
    lat: 25.0330,
    lng: 121.5654,
    connection: {
      type: "story",
      description: "AWS Asia Pacific (Taipei) Region launched 2024 with $5 billion investment commitment, Microsoft Azure launched its Taiwan region in 2025, and Google operates a hyperscale facility in nearby Tainan. Equinix and Vantage Data Centers are building campuses in Taipei to interconnect direct fiber to the submarine cables that link Taiwan to Japan, Hong Kong, and Southeast Asia. MediaTek, founded in Hsinchu in 1997 and Taiwan's third-largest fabless chip designer, listed on Taiwan Stock Exchange in 2001 and dominates mobile chipset manufacturing with over 31% market share globally, proving Taiwan's role as critical infrastructure for the world's AI and semiconductor supply chains.",
      description_es: "La Región AWS Asia Pacífico (Taipéi) se lanzó en 2024 con un compromiso de inversión de $5 mil millones, Microsoft Azure lanzó su región de Taiwán en 2025, y Google opera una instalación hyperscale en la cercana Tainan. Equinix y Vantage Data Centers están construyendo campus en Taipéi para interconectar fibra directa con los cables submarinos que conectan Taiwán con Japón, Hong Kong y el Sudeste Asiático. MediaTek, fundada en Hsinchu en 1997 y la tercera mayor diseñadora de chips fabless de Taiwán, se listó en la Bolsa de Valores de Taiwán en 2001 y domina la fabricación de chipsets móviles con más del 31% de cuota de mercado a nivel mundial, demostrando el papel de Taiwán como infraestructura crítica para las cadenas de suministro mundiales de IA y semiconductores.",
      emoji: "🏙️",
      url: "https://aws.amazon.com/tw/,https://www.mediatek.com",
    },
    funFact: "AWS launched Taipei in 2024 with $5B commitment, Azure followed in 2025, and MediaTek dominates global mobile chipsets with 31%+ market share, cementing Taiwan's role in AI and semiconductor supply chains.",
    funFact_es: "AWS lanzó Taipéi en 2024 con un compromiso de $5 mil millones, Azure siguió en 2025, y MediaTek domina los chipsets móviles globales con más del 31% de cuota de mercado, consolidando el papel de Taiwán en las cadenas de suministro de IA y semiconductores.",
  },
  {
    id: "seoul",
    name: "Seoul",
    country: "Korea",
    lat: 37.5665,
    lng: 126.9780,
    connection: {
      type: "story",
      description: "AWS Asia Pacific (Seoul) Region runs four availability zones and Korea Telecom provides direct connectivity; Equinix operates multiple data centers and Microsoft Azure's Korea region serves enterprise customers. Coupang, founded by Harvard dropout Bom Kim in 2010 in Seoul, revolutionized Korean e-commerce with same-day Rocket Delivery across over 2.3 million square feet of logistics centers, went public on NYSE in March 2021 at $35/share (up 41% on day one), and now dominates Korea's 37.7% e-commerce market share against Naver's 27.2%, proving logistically-integrated platforms beat marketplace models.",
      description_es: "La Región AWS Asia Pacífico (Seúl) opera cuatro zonas de disponibilidad y Korea Telecom proporciona conectividad directa; Equinix opera múltiples centros de datos y la región de Corea de Microsoft Azure atiende a clientes empresariales. Coupang, fundada por Bom Kim, desertor de Harvard, en 2010 en Seúl, revolucionó el comercio electrónico coreano con entrega Rocket Delivery el mismo día en más de 2.3 millones de pies cuadrados de centros logísticos, salió a bolsa en NYSE en marzo de 2021 a $35 por acción (subiendo 41% el primer día), y ahora domina el 37.7% de la cuota del mercado de comercio electrónico de Corea frente al 27.2% de Naver, demostrando que las plataformas integradas logísticamente superan los modelos de marketplace.",
      emoji: "🇰🇷",
      url: "https://aws.amazon.com/ko/,https://www.coupang.com",
    },
    funFact: "AWS Seoul runs four AZs and Coupang dominates Korean e-commerce at 37.7% market share via Rocket Delivery, after a blockbuster 2021 NYSE IPO that proved integrated logistics beat marketplace models.",
    funFact_es: "AWS Seúl opera cuatro zonas de disponibilidad y Coupang domina el comercio electrónico coreano con 37.7% de cuota mediante Rocket Delivery, tras una exitosa OPV en NYSE en 2021 que demostró que la logística integrada supera a los modelos de marketplace.",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    lat: 19.0760,
    lng: 72.8777,
    connection: {
      type: "story",
      description: "AWS Asia Pacific (Mumbai) Region runs four availability zones serving India's fastest-growing cloud market; Azure and Google Cloud compete locally. Tata Consultancy Services (TCS), established in Mumbai in 1968 as Tata Computer Systems, became India's largest IT services company and the first Indian IT firm to hit $200 billion market cap (September 2021), now serves 500+ Fortune 500 clients across 150 locations in 46 countries with $19+ billion in annual revenue, listing on BSE, NSE, and NASDAQ simultaneously.",
      description_es: "La Región AWS Asia Pacífico (Mumbai) opera cuatro zonas de disponibilidad atendiendo al mercado de nube de más rápido crecimiento de India; Azure y Google Cloud compiten localmente. Tata Consultancy Services (TCS), establecida en Mumbai en 1968 como Tata Computer Systems, se convirtió en la mayor empresa de servicios de TI de India y la primera firma de TI india en alcanzar $200 mil millones de capitalización de mercado (septiembre 2021), ahora atiende a más de 500 clientes de Fortune 500 en 150 ubicaciones en 46 países con más de $19 mil millones en ingresos anuales, listada simultáneamente en BSE, NSE y NASDAQ.",
      emoji: "🌊",
      url: "https://aws.amazon.com/in/,https://www.tcs.com",
    },
    funFact: "AWS Mumbai runs four AZs in India's fastest-growing cloud market, and TCS, founded 1968, became the first Indian IT firm to hit a $200B market cap, serving 500+ Fortune 500 clients across 46 countries.",
    funFact_es: "AWS Mumbai opera cuatro zonas de disponibilidad en el mercado de nube de más rápido crecimiento de India, y TCS, fundada en 1968, se convirtió en la primera firma de TI india en alcanzar $200 mil millones de capitalización, atendiendo a más de 500 clientes de Fortune 500 en 46 países.",
  },
  {
    id: "osaka",
    name: "Osaka",
    country: "Japan",
    lat: 34.6937,
    lng: 135.5023,
    connection: {
      type: "story",
      description: "Equinix operates four data centers in Osaka (compared to Tokyo's 14), serving as the second-largest peering hub in Japan with access to BBIX and JPNAP exchanges; AWS, Azure, and Google Cloud all have regions here. Rakuten, founded in Osaka in 1997 by Hiroshi Mikitani, launched Rakuten Ichiba (Japan's largest e-commerce mall) on May 1, 1997 with just six employees, went public on JASDAQ in 2000, and evolved into a diversified conglomerate offering fintech, digital content, and telecommunications across 30 countries, proving Osaka-born platforms can scale globally.",
      description_es: "Equinix opera cuatro centros de datos en Osaka (en comparación con los 14 de Tokio), sirviendo como el segundo mayor centro de peering de Japón con acceso a los intercambios BBIX y JPNAP; AWS, Azure y Google Cloud tienen regiones aquí. Rakuten, fundada en Osaka en 1997 por Hiroshi Mikitani, lanzó Rakuten Ichiba (el mayor centro comercial electrónico de Japón) el 1 de mayo de 1997 con solo seis empleados, salió a bolsa en JASDAQ en 2000, y evolucionó en un conglomerado diversificado que ofrece fintech, contenido digital y telecomunicaciones en 30 países, demostrando que las plataformas nacidas en Osaka pueden escalar globalmente.",
      emoji: "🏯",
      url: "https://www.equinix.com/data-centers/asia-pacific-colocation/japan-colocation/osaka-data-centers,https://www.rakuten.co.jp",
    },
    funFact: "Equinix operates four data centers in Osaka, Japan's second-largest peering hub, and Rakuten was founded here in 1997 before scaling into a global conglomerate spanning fintech, content, and telecom across 30 countries.",
    funFact_es: "Equinix opera cuatro centros de datos en Osaka, el segundo mayor centro de peering de Japón, y Rakuten fue fundada aquí en 1997 antes de escalar a un conglomerado global que abarca fintech, contenido y telecomunicaciones en 30 países.",
  },
];
