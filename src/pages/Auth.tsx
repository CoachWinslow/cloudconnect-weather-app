import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/i18n/translations";
import Header from "@/components/Header";
import { Satellite, Mail, Lock, ArrowLeft } from "lucide-react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { signIn, signUp } = useAuth();
  const { language } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isSignUp) {
      const { error: err } = await signUp(email, password);
      if (err) setError(err.message);
      else setSuccess(language === "es" ? "¡Revisa tu correo para confirmar!" : "Check your email to confirm!");
    } else {
      const { error: err } = await signIn(email, password);
      if (err) setError(err.message);
      else navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-mono text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>{t(language, "commandCenter")}</span>
        </button>

        <div className="glow-border hud-corners rounded-md p-6 bg-card relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Satellite className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground text-center mb-1">
              {isSignUp
                ? (language === "es" ? "Crear Cuenta" : "Create Account")
                : (language === "es" ? "Iniciar Sesión" : "Sign In")}
            </h2>
            <p className="text-muted-foreground text-xs text-center mb-6 font-mono">
              {language === "es" ? "Accede a favoritos y notas personales" : "Access your favorites and personal notes"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full h-10 pl-10 pr-3 rounded-sm bg-secondary/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === "es" ? "Contraseña" : "Password"}
                  required
                  minLength={6}
                  className="w-full h-10 pl-10 pr-3 rounded-sm bg-secondary/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              {error && (
                <p className="text-destructive text-xs font-mono text-center">{error}</p>
              )}
              {success && (
                <p className="text-primary text-xs font-mono text-center">{success}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-sm bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading
                  ? "..."
                  : isSignUp
                    ? (language === "es" ? "Registrarse" : "Sign Up")
                    : (language === "es" ? "Entrar" : "Sign In")}
              </button>
            </form>

            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }}
              className="w-full mt-4 text-center text-xs text-muted-foreground hover:text-primary font-mono transition-colors"
            >
              {isSignUp
                ? (language === "es" ? "¿Ya tienes cuenta? Inicia sesión" : "Already have an account? Sign in")
                : (language === "es" ? "¿No tienes cuenta? Regístrate" : "Don't have an account? Sign up")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
