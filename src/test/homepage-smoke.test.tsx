import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import CityCard from "@/components/CityCard";
import type { City } from "@/data/cities";

// Mock supabase client used by FavoriteButton so render does not hit the network.
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const sampleCity: City = {
  id: "san-francisco",
  name: "San Francisco",
  country: "California",
  lat: 37.7749,
  lng: -122.4194,
  connection: {
    type: "story",
    description: "Smoke test city.",
    emoji: "🌉",
  },
  funFact: "Test fixture.",
};

describe("homepage smoke", () => {
  it.skipIf(!SUPABASE_URL || !SUPABASE_KEY)("weather-proxy returns HTTP 200 for a real city lookup", async () => {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/weather-proxy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Origin: "http://localhost:5173",
      },
      body: JSON.stringify({
        endpoint: "weather",
        params: { lat: sampleCity.lat, lon: sampleCity.lng, units: "imperial", lang: "en" },
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body?.main?.temp).toEqual(expect.any(Number));
    expect(body?.weather?.[0]?.icon).toEqual(expect.any(String));
  }, 20_000);

  it("renders a city's temperature in the homepage card UI", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SettingsProvider>
              <CityCard
                city={sampleCity}
                weather={{ temp: 62, icon: "01d", description: "clear sky" }}
                index={0}
              />
            </SettingsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("62°F")).toBeInTheDocument();
    expect(screen.getByText("San Francisco")).toBeInTheDocument();
  });
});