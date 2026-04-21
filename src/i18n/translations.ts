const translations = {
  en: {
    // Header
    infrastructureMonitor: "Infrastructure Monitor v1.4",
    systemsOnline: "Systems Online",
    live: "Live",

    // Index
    globalTelemetryActive: "Global Telemetry Active",
    infrastructureCommandCenter: "Infrastructure Command Center",
    indexSubtitle: "Real-time weather telemetry across cloud infrastructure locations and tech hubs worldwide.",
    nodes: "Nodes",
    online: "Online",
    satelliteOverlay: "Satellite Overlay — Live Feed",
    monitoredLocations: "Monitored Locations",
    stations: "stations",
    searchPlaceholder: "Search any city worldwide...",
    searchNoResults: "No cities found",
    searchHint: "Type to search any city in the world",
    backToSearch: "Searched City",
    monitoredStations: "Monitored Stations",
    otherResults: "Other Results",

    // CityCard
    personnel: "Personnel",
    station: "Station",
    accessData: "Access Data",

    // CityDetail
    stationNotFound: "Station Not Found",
    returnToCommandCenter: "← Return to Command Center",
    commandCenter: "Command Center",
    stationActive: "Station Active",
    weatherTelemetry: "Weather Telemetry",
    acquiringData: "Acquiring data...",
    feelsLike: "Feels Like",
    humidity: "Humidity",
    wind: "Wind",
    personnelFile: "Personnel File",
    stationLog: "Station Log",
    currentConditions: "Current Conditions",
    nextHours: "Next Hours",
    conditionsSummary: "Currently {description} at {temp}, feeling like {feelsLike}.",
    conditionsToday: " Today's high near {high} with a low of {low}.",
    conditionsTomorrow: " Tomorrow expect {description}.",
    forecastProjection: "5-Day Forecast Projection",
    acquiringForecast: "Acquiring forecast telemetry...",
    intelReport: "Intel Report",
    learnMore: "Learn More",

    // Footer
    footer: "Cloud Connect — Mission Control Interface — Built with Lovable",

    // Toggles
    fahrenheit: "°F",
    celsius: "°C",
    english: "EN",
    spanish: "ES",
  },
  es: {
    // Header
    infrastructureMonitor: "Monitor de Infraestructura v1.4",
    systemsOnline: "Sistemas en Línea",
    live: "En Vivo",

    // Index
    globalTelemetryActive: "Telemetría Global Activa",
    infrastructureCommandCenter: "Centro de Comando de Infraestructura",
    indexSubtitle: "Telemetría climática en tiempo real en ubicaciones de infraestructura cloud y centros tecnológicos en todo el mundo.",
    nodes: "Nodos",
    online: "En Línea",
    satelliteOverlay: "Vista Satelital — Señal en Vivo",
    monitoredLocations: "Ubicaciones Monitoreadas",
    stations: "estaciones",
    searchPlaceholder: "Buscar cualquier ciudad del mundo...",
    searchNoResults: "No se encontraron ciudades",
    searchHint: "Escribe para buscar cualquier ciudad del mundo",
    backToSearch: "Ciudad Buscada",
    monitoredStations: "Estaciones Monitoreadas",
    otherResults: "Otros Resultados",

    // CityCard
    personnel: "Personal",
    station: "Estación",
    accessData: "Ver Datos",

    // CityDetail
    stationNotFound: "Estación No Encontrada",
    returnToCommandCenter: "← Volver al Centro de Comando",
    commandCenter: "Centro de Comando",
    stationActive: "Estación Activa",
    weatherTelemetry: "Telemetría Climática",
    acquiringData: "Adquiriendo datos...",
    feelsLike: "Sensación",
    humidity: "Humedad",
    wind: "Viento",
    personnelFile: "Ficha de Personal",
    stationLog: "Registro de Estación",
    currentConditions: "Condiciones Actuales",
    nextHours: "Próximas Horas",
    conditionsSummary: "Actualmente {description} a {temp}, sensación térmica de {feelsLike}.",
    conditionsToday: " Máxima de {high} con mínima de {low} hoy.",
    conditionsTomorrow: " Mañana se espera {description}.",
    forecastProjection: "Pronóstico de 5 Días",
    acquiringForecast: "Adquiriendo pronóstico...",
    intelReport: "Reporte de Inteligencia",
    learnMore: "Más Información",

    // Footer
    footer: "Cloud Connect — Interfaz de Control de Misión — Hecho con Lovable",

    // Toggles
    fahrenheit: "°F",
    celsius: "°C",
    english: "EN",
    spanish: "ES",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(language: "en" | "es", key: TranslationKey): string {
  return translations[language][key];
}
