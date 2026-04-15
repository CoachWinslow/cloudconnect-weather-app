import { Satellite, Activity, Radio, Globe, Thermometer, User, Heart, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useUserRole";
import { t } from "@/i18n/translations";

export default function Header() {
  const navigate = useNavigate();
  const { tempUnit, language, toggleTempUnit, toggleLanguage } = useSettings();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();

  return (
    <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 border border-primary/30 group-hover:border-primary/60 transition-colors">
            <Satellite className="w-5 h-5 text-primary" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary status-online" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-wider uppercase text-foreground">
              Cloud Connect
            </h1>
            <p className="font-mono text-[9px] text-primary/70 uppercase tracking-[0.2em]">
              {t(language, "infrastructureMonitor")}
            </p>
          </div>
          <p className="hidden md:block font-display text-lg italic text-primary/50 ml-4 tracking-wide">
            Enveniam Viam
          </p>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Settings toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTempUnit}
              className="flex items-center gap-1 px-2 py-1 rounded-sm border border-border hover:border-primary/40 transition-colors bg-secondary/50"
              title={tempUnit === "F" ? "Switch to Celsius" : "Switch to Fahrenheit"}
            >
              <Thermometer className="w-3 h-3 text-primary" />
              <span className="font-mono text-[10px] font-semibold text-foreground uppercase">
                {tempUnit === "F" ? "°F" : "°C"}
              </span>
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1 rounded-sm border border-border hover:border-primary/40 transition-colors bg-secondary/50"
              title={language === "en" ? "Cambiar a Español" : "Switch to English"}
            >
              <Globe className="w-3 h-3 text-primary" />
              <span className="font-mono text-[10px] font-semibold text-foreground uppercase">
                {language === "en" ? "EN" : "ES"}
              </span>
            </button>
          </div>

          {/* Auth / Favorites / Admin */}
          <div className="flex items-center gap-1.5">
            {user && isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-1 px-2 py-1 rounded-sm border border-primary/30 hover:border-primary/60 transition-colors bg-primary/10"
                title="Admin Dashboard"
              >
                <Shield className="w-3 h-3 text-primary" />
                <span className="font-mono text-[10px] font-semibold text-primary uppercase hidden sm:inline">
                  Admin
                </span>
              </button>
            )}
            {user && (
              <button
                onClick={() => navigate("/favorites")}
                className="flex items-center gap-1 px-2 py-1 rounded-sm border border-border hover:border-primary/40 transition-colors bg-secondary/50"
                title={language === "es" ? "Favoritos" : "Favorites"}
              >
                <Heart className="w-3 h-3 text-red-400" />
              </button>
            )}
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 px-2 py-1 rounded-sm border border-border hover:border-primary/40 transition-colors bg-secondary/50"
                title={language === "es" ? "Cerrar sesión" : "Sign out"}
              >
                <LogOut className="w-3 h-3 text-primary" />
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center gap-1 px-2 py-1 rounded-sm border border-border hover:border-primary/40 transition-colors bg-secondary/50"
                title={language === "es" ? "Iniciar sesión" : "Sign in"}
              >
                <User className="w-3 h-3 text-primary" />
                <span className="font-mono text-[10px] font-semibold text-foreground uppercase hidden sm:inline">
                  {language === "es" ? "Entrar" : "Sign In"}
                </span>
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <Activity className="w-3 h-3 text-primary telemetry-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider">{t(language, "systemsOnline")}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-primary/10 border border-primary/20">
            <Radio className="w-3 h-3 text-primary status-online" />
            <span className="font-mono text-[10px] text-primary uppercase tracking-wider">{t(language, "live")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
