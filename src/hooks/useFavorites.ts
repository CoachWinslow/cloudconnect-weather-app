import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Favorite {
  id: string;
  city_id: string | null;
  city_name: string;
  lat: number;
  lng: number;
  note: string;
  created_at: string;
}

export function useFavorites() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Favorite[];
    },
    enabled: !!user,
  });
}

export function useAddFavorite() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fav: { city_id?: string; city_name: string; lat: number; lng: number; note?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        city_id: fav.city_id || null,
        city_name: fav.city_name,
        lat: fav.lat,
        lng: fav.lng,
        note: fav.note || "",
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useUpdateFavoriteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await supabase.from("favorites").update({ note }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("favorites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useIsFavorite(lat: number, lng: number) {
  const { data: favorites } = useFavorites();
  if (!favorites) return { isFavorite: false, favoriteId: null };
  const found = favorites.find((f) => Math.abs(f.lat - lat) < 0.001 && Math.abs(f.lng - lng) < 0.001);
  return { isFavorite: !!found, favoriteId: found?.id || null };
}
