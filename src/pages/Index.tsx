import Header from "@/components/Header";
import WorldMap from "@/components/WorldMap";
import CityCard from "@/components/CityCard";
import { cities } from "@/data/cities";
import { useAllCitiesWeather } from "@/hooks/useWeatherData";

const Index = () => {
  const { data: weatherData } = useAllCitiesWeather();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            My Global Tech Network
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Weather conditions across the cities and people that shaped my tech journey.
          </p>
        </div>

        {/* Map */}
        <div className="mb-10">
          <WorldMap weatherData={weatherData || {}} />
        </div>

        {/* City Cards */}
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">
          All Locations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city, i) => (
            <CityCard
              key={city.id}
              city={city}
              weather={weatherData?.[city.id]}
              index={i}
            />
          ))}
        </div>
      </div>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground mt-10">
        <p>CloudConnect Weather — Built with ❤️ and Lovable</p>
      </footer>
    </div>
  );
};

export default Index;
