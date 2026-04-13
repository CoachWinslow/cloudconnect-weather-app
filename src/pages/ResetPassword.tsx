import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";
import Header from "@/components/Header";
import { Lock, ArrowLeft, ShieldCheck } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const { language } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(language === "es" ? "Las contraseñas no coinciden" : "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError(language === "es" ? "La contraseña debe tener al menos 6 caracteres" : "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            {language === "es" ? "Enlace inválido" : "Invalid Link"}
          </h2>
          <p className="text-muted-foreground text-sm mb-4 font-mono">
            {language === "es"
              ? "Este enlace de restablecimiento no es válido o ha expirado."
              : "This reset link is invalid or has expired."}
          </p>
          <button onClick={() => navigate("/auth")} className="text-primary hover:underline font-mono text-sm">
            {language === "es" ? "Volver a iniciar sesión" : "Back to sign in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-mono text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>{language === "es" ? "Centro de Comando" : "Command Center"}</span>
        </button>

        <div className="glow-border hud-corners rounded-md p-6 bg-card relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground text-center mb-1">
              {language === "es" ? "Nueva Contraseña" : "New Password"}
            </h2>
            <p className="text-muted-foreground text-xs text-center mb-6 font-mono">
              {language === "es" ? "Ingresa tu nueva contraseña" : "Enter your new password"}
            </p>

            {success ? (
              <div className="text-center">
                <p className="text-primary text-sm font-mono mb-2">
                  {language === "es" ? "¡Contraseña actualizada!" : "Password updated!"}
                </p>
                <p className="text-muted-foreground text-xs font-mono">
                  {language === "es" ? "Redirigiendo..." : "Redirecting..."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === "es" ? "Nueva contraseña" : "New password"}
                    required
                    minLength={6}
                    className="w-full h-10 pl-10 pr-3 rounded-sm bg-secondary/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={language === "es" ? "Confirmar contraseña" : "Confirm password"}
                    required
                    minLength={6}
                    className="w-full h-10 pl-10 pr-3 rounded-sm bg-secondary/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>

                {error && (
                  <p className="text-destructive text-xs font-mono text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 rounded-sm bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "..." : (language === "es" ? "Actualizar Contraseña" : "Update Password")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
