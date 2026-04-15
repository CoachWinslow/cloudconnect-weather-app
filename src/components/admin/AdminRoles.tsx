import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, UserPlus, Trash2, Activity, Shield, Pencil, Eye, Users } from "lucide-react";
import { toast } from "sonner";
import type { AppRole } from "@/hooks/useUserRole";

interface RoleRow {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  email?: string;
  display_name?: string;
}

export default function AdminRoles() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("viewer");
  const [assigning, setAssigning] = useState(false);

  const { data: roles, isLoading } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;

      // Enrich with profile display names
      const userIds = [...new Set((data as RoleRow[]).map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p.display_name]));
      return (data as RoleRow[]).map((r) => ({
        ...r,
        display_name: profileMap.get(r.user_id) || r.user_id,
      }));
    },
  });

  const handleAssign = async () => {
    if (!email.trim()) {
      toast.error("Enter an email address");
      return;
    }
    setAssigning(true);
    try {
      // Look up user by email in profiles (display_name may be email)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .ilike("display_name", email.trim());

      if (!profiles || profiles.length === 0) {
        toast.error("No user found with that email. They need to sign up first.");
        return;
      }

      const userId = profiles[0].user_id;
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: selectedRole,
      });
      if (error) {
        if (error.code === "23505") {
          toast.error("This user already has this role");
        } else {
          throw error;
        }
        return;
      }
      toast.success(`Assigned ${selectedRole} role to ${email}`);
      setEmail("");
      qc.invalidateQueries({ queryKey: ["admin-roles"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to assign role");
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this role?")) return;
    try {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
      toast.success("Role removed");
      qc.invalidateQueries({ queryKey: ["admin-roles"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to remove");
    }
  };

  const roleIcon = (role: AppRole) => {
    if (role === "admin") return <Shield className="w-3 h-3 text-primary" />;
    if (role === "editor") return <Pencil className="w-3 h-3 text-accent" />;
    return <Eye className="w-3 h-3 text-muted-foreground" />;
  };

  const roleBadgeClass = (role: AppRole) => {
    if (role === "admin") return "bg-primary/20 text-primary border-primary/30";
    if (role === "editor") return "bg-accent/20 text-accent border-accent/30";
    return "bg-secondary text-muted-foreground border-border";
  };

  return (
    <div>
      {/* Assign Role */}
      <div className="glow-border hud-corners rounded-md bg-card p-5 mb-6">
        <h4 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" /> Assign Role
        </h4>
        <p className="font-mono text-[10px] text-muted-foreground mb-3">
          Enter the email the user signed up with. They must have an account first.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full h-8 pl-7 pr-2 rounded-sm bg-secondary/50 border border-border font-mono text-xs text-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as AppRole)}
            className="h-8 px-2 rounded-sm bg-secondary/50 border border-border font-mono text-xs text-foreground focus:outline-none focus:border-primary/50"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleAssign}
            disabled={assigning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <UserPlus className="w-3 h-3" /> {assigning ? "..." : "Assign"}
          </button>
        </div>
      </div>

      {/* Current Roles */}
      <h4 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">
        Current Roles
      </h4>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Activity className="w-5 h-5 animate-pulse text-primary mr-2" />
          <span className="font-mono text-sm text-muted-foreground">Loading roles...</span>
        </div>
      ) : !roles?.length ? (
        <p className="font-mono text-xs text-muted-foreground text-center py-8">No roles assigned yet.</p>
      ) : (
        <div className="space-y-2">
          {roles.map((r) => (
            <div key={r.id} className="glow-border rounded-md bg-card p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {roleIcon(r.role)}
                <div className="min-w-0">
                  <div className="font-mono text-xs text-foreground truncate">{r.display_name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{r.user_id.slice(0, 8)}...</div>
                </div>
                <span className={`px-2 py-0.5 rounded-sm border font-mono text-[10px] uppercase ${roleBadgeClass(r.role)}`}>
                  {r.role}
                </span>
              </div>
              <button
                onClick={() => handleRemove(r.id)}
                className="p-1.5 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
