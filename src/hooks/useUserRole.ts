import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "editor" | "viewer";

export function useUserRole() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (error) throw error;
      if (!data || data.length === 0) return null;
      // Return highest privilege role
      const roles = data.map((r: any) => r.role as AppRole);
      if (roles.includes("admin")) return "admin" as AppRole;
      if (roles.includes("editor")) return "editor" as AppRole;
      return "viewer" as AppRole;
    },
    enabled: !!user,
  });
}

export function useIsAdmin() {
  const { data: role } = useUserRole();
  return role === "admin";
}
