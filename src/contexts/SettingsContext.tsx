import { createContext, useContext, useState, ReactNode } from "react";

type TempUnit = "F" | "C";
type Language = "en" | "es";

interface SettingsContextType {
  tempUnit: TempUnit;
  language: Language;
  toggleTempUnit: () => void;
  toggleLanguage: () => void;
  convertTemp: (fahrenheit: number) => number;
  formatTemp: (fahrenheit: number) => string;
  convertWindSpeed: (mph: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [tempUnit, setTempUnit] = useState<TempUnit>("F");
  const [language, setLanguage] = useState<Language>("en");

  const toggleTempUnit = () => setTempUnit((u) => (u === "F" ? "C" : "F"));

  const toggleLanguage = () => {
    setLanguage((l) => {
      const next = l === "en" ? "es" : "en";
      // Auto-switch temp unit with language
      setTempUnit(next === "es" ? "C" : "F");
      return next;
    });
  };

  const convertTemp = (f: number): number => {
    if (tempUnit === "C") return Math.round((f - 32) * 5 / 9);
    return f;
  };

  const formatTemp = (f: number): string => {
    return `${convertTemp(f)}°${tempUnit}`;
  };

  const convertWindSpeed = (mph: number): string => {
    if (tempUnit === "C") return `${Math.round(mph * 1.609)} km/h`;
    return `${mph} mph`;
  };

  return (
    <SettingsContext.Provider
      value={{ tempUnit, language, toggleTempUnit, toggleLanguage, convertTemp, formatTemp, convertWindSpeed }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
