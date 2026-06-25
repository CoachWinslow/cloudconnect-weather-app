import { createClient } from "@supabase/supabase-js";

const url = "https://tnofpnyjlkeyilyinwsw.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const description = `New York City is where the physical internet comes ashore. Long before fiber, it was the nerve center of American communication, and that role never left, it just changed form. The clearest proof is 60 Hudson Street in Tribeca, built between 1928 and 1930 as the headquarters of Western Union and once called the Telegraph Capital of America. When Western Union relocated in the 1970s, the building did not fade into history. The same pneumatic tubes that once shot paper telegrams across its floors were filled first with copper and later with fiber, and 60 Hudson became one of the most important carrier hotels on the planet. Today more than 100 telecommunications carriers and over 300 networks meet inside its walls, exchanging traffic in a meet-me room where transatlantic undersea cables landing near Lower Manhattan link North America to Europe. When data routes between continents or hops out of a server in New Jersey, there is a strong chance it passes through this single Art Deco block. The lesson for anyone learning the cloud is that the cloud is not weightless. It is buildings, power, cooling, and fiber, and New York is one of the places where the global map physically converges. That same city produced the modern tools used to watch all of this data move. Datadog, founded in New York City in 2010 by Olivier Pomel and Alexis Le-Quoc, was built for the cloud-native world, giving engineers a single SaaS platform to monitor the metrics, traces, and logs flowing across AWS, Azure, and Google Cloud. The company went public on the Nasdaq in 2019 under the ticker DDOG and now serves more than 30,000 customers, making it the observability layer that thousands of teams trust to watch their infrastructure in real time.`;

const descriptionEs = `La ciudad de Nueva York es donde el internet fisico llega a tierra. Mucho antes de la fibra optica, fue el centro nervioso de la comunicacion estadounidense, y ese papel nunca desaparecio, solo cambio de forma. La prueba mas clara es el 60 Hudson Street en Tribeca, construido entre 1928 y 1930 como sede de Western Union y conocido alguna vez como la Capital del Telegrama de America. Cuando Western Union se mudo en la decada de 1970, el edificio no se desvanecio en la historia. Los mismos tubos neumaticos que antes lanzaban telegramas de papel por sus pisos fueron llenados primero con cobre y luego con fibra, y el 60 Hudson se convirtio en uno de los carrier hotels mas importantes del planeta. Hoy mas de 100 operadores de telecomunicaciones y mas de 300 redes se encuentran dentro de sus paredes, intercambiando trafico en una sala de interconexion donde los cables submarinos transatlanticos que llegan cerca del bajo Manhattan conectan Norteamerica con Europa. Cuando los datos se enrutan entre continentes o saltan desde un servidor en Nueva Jersey, hay una gran probabilidad de que pasen por este solo bloque de estilo Art Deco. La leccion para quien aprende sobre la nube es que la nube no es ingravida. Son edificios, energia, refrigeracion y fibra, y Nueva York es uno de los lugares donde el mapa global converge fisicamente. Esa misma ciudad produjo las herramientas modernas que se usan para observar todo este movimiento de datos. Datadog, fundado en la ciudad de Nueva York en 2010 por Olivier Pomel y Alexis Le-Quoc, fue construido para el mundo nativo de la nube, dando a los ingenieros una unica plataforma SaaS para monitorear las metricas, trazas y registros que fluyen a traves de AWS, Azure y Google Cloud. La empresa salio a bolsa en el Nasdaq en 2019 bajo el ticker DDOG y ahora sirve a mas de 30,000 clientes, convirtiendose en la capa de observabilidad que miles de equipos confian para vigilar su infraestructura en tiempo real.`;

const funFact = "New York City's 60 Hudson Street hosts over 300 networks in a single Art Deco building where transatlantic cables meet, while Datadog, founded here in 2010, now monitors cloud infrastructure for 30,000 customers worldwide.";

const funFactEs = "El 60 Hudson Street de la ciudad de Nueva York alberga mas de 300 redes en un solo edificio Art Deco donde se encuentran los cables transatlanticos, mientras que Datadog, fundado aqui en 2010, monitorea ahora la infraestructura en la nube para 30,000 clientes en todo el mundo.";

const urlField = "https://www.datadoghq.com,https://60hudsonstreet.com";

async function main() {
  const { error } = await supabase
    .from("cities")
    .update({
      connection_description: description,
      connection_description_es: descriptionEs,
      connection_url: urlField,
      fun_fact: funFact,
      fun_fact_es: funFactEs,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "new-york-city");

  if (error) {
    console.error("Update failed:", error);
    process.exit(1);
  }
  console.log("Update successful");
}

main();
