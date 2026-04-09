import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useSettings } from "@/contexts/SettingsContext";
import { ArrowLeft, Shield } from "lucide-react";
import AdminCities from "@/components/admin/AdminCities";
import AdminRoles from "@/components/admin/AdminRoles";

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const { language } = useSettings();
  const [tab, setTab] = useState<"cities" | "roles">("cities");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <span className="font-mono text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Shield className="w-10 h-10 text-destructive mx-auto mb-3" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground font-mono text-sm mb-4">
            {language === "es" ? "No tienes permisos de administrador." : "You do not have admin permissions."}
          </p>
          <button onClick={() => navigate("/")} className="text-primary hover:underline font-mono text-sm">
            {language === "es" ? "Volver al inicio" : "Return home"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-mono text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Command Center</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider">
            Admin Dashboard
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["cities", "roles"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-wider border transition-colors ${
                tab === t
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {t === "cities" ? "Manage Cities" : "Manage Roles"}
            </button>
          ))}
        </div>

        {tab === "cities" ? <AdminCities /> : <AdminRoles />}
      </div>
    </div>
  );
}
