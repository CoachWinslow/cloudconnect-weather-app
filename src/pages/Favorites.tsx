import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useFavorites, useRemoveFavorite, useUpdateFavoriteNote } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/i18n/translations";
import { ArrowLeft, Heart, Trash2, MapPin, StickyNote, Edit2, Check, X } from "lucide-react";
import { cities } from "@/data/cities";

export default function Favorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useSettings();
  const { data: favorites, isLoading } = useFavorites();
  const removeFav = useRemoveFavorite();
  const updateNote = useUpdateFavoriteNote();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground font-mono text-sm">
            {language === "es" ? "Inicia sesión para ver tus favoritos" : "Sign in to view your favorites"}
          </p>
          <button onClick={() => navigate("/auth")} className="text-primary hover:underline font-mono text-sm mt-2">
            {language === "es" ? "Iniciar Sesión" : "Sign In"}
          </button>
        </div>
      </div>
    );
  }

  const handleNavigate = (fav: any) => {
    const listedCity = cities.find((c) => c.id === fav.city_id);
    if (listedCity) {
      navigate(`/city/${listedCity.id}`);
    } else {
      navigate(`/search?lat=${fav.lat}&lng=${fav.lng}&name=${encodeURIComponent(fav.city_name)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-mono text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>{t(language, "commandCenter")}</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider">
            {language === "es" ? "Mis Favoritos" : "My Favorites"}
          </h2>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[10px] text-muted-foreground">
            {favorites?.length || 0} {language === "es" ? "guardados" : "saved"}
          </span>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground font-mono text-sm text-center py-10">
            {language === "es" ? "Cargando..." : "Loading..."}
          </p>
        ) : !favorites?.length ? (
          <div className="text-center py-16 glow-border hud-corners rounded-md bg-card p-8">
            <Heart className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-mono text-sm">
              {language === "es" ? "No tienes favoritos aún" : "No favorites yet"}
            </p>
            <p className="text-muted-foreground/60 font-mono text-xs mt-1">
              {language === "es" ? "Toca el ❤ en cualquier ciudad para guardarla" : "Tap the ❤ on any city to save it"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="glow-border hud-corners rounded-md bg-card p-4 relative overflow-hidden animate-fade-in"
              >
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <button onClick={() => handleNavigate(fav)} className="flex-1 text-left group">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {fav.city_name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {fav.lat.toFixed(2)}°, {fav.lng.toFixed(2)}°
                    </span>
                  </button>
                  <button
                    onClick={() => removeFav.mutate(fav.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    title={language === "es" ? "Eliminar" : "Remove"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Note section */}
                <div className="relative z-10 mt-2 border-t border-border/50 pt-2">
                  {editingId === fav.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="flex-1 h-8 px-2 rounded-sm bg-secondary/50 border border-border font-mono text-xs text-foreground focus:outline-none focus:border-primary/50"
                        autoFocus
                      />
                      <button
                        onClick={() => { updateNote.mutate({ id: fav.id, note: editNote }); setEditingId(null); }}
                        className="text-primary hover:text-primary/80 p-1"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-muted-foreground p-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <StickyNote className="w-3 h-3 text-accent shrink-0" />
                      <span className="font-mono text-xs text-muted-foreground flex-1">
                        {fav.note || (language === "es" ? "Sin nota" : "No note")}
                      </span>
                      <button
                        onClick={() => { setEditingId(fav.id); setEditNote(fav.note || ""); }}
                        className="text-muted-foreground hover:text-primary p-1"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
