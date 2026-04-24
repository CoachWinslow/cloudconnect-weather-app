import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Key, Server, Monitor, CheckCircle2, XCircle, Loader2, AlertTriangle, Lock } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type SecretStatus = { name: string; present: boolean; scope: "client" | "server"; note?: string };

// Client-side env vars are bundled into the browser. Anything in import.meta.env
// with the VITE_ prefix is, by definition, public.
function getClientStatuses(): SecretStatus[] {
  return [
    {
      name: "VITE_SUPABASE_URL",
      present: !!import.meta.env.VITE_SUPABASE_URL,
      scope: "client",
      note: "Public backend URL (safe to expose)",
    },
    {
      name: "VITE_SUPABASE_PUBLISHABLE_KEY",
      present: !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      scope: "client",
      note: "Anon key, protected by RLS (safe to expose)",
    },
    {
      name: "VITE_SUPABASE_PROJECT_ID",
      present: !!import.meta.env.VITE_SUPABASE_PROJECT_ID,
      scope: "client",
      note: "Project identifier (safe to expose)",
    },
  ];
}

export default function Debug() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = useIsAdmin();

  const [serverSecrets, setServerSecrets] = useState<Record<string, boolean> | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  const clientStatuses = getClientStatuses();

  const fetchServerSecrets = async () => {
    setLoading(true);
    setServerError(null);
    try {
      const { data, error } = await supabase.functions.invoke("secrets-status");
      if (error) throw error;
      if (data?.secrets) {
        setServerSecrets(data.secrets);
        setCheckedAt(data.checkedAt);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) fetchServerSecrets();
  }, [user, isAdmin]);

  // Access control
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="border border-border bg-card p-8 rounded-md text-center">
            <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
            <h1 className="font-display text-xl uppercase tracking-wider mb-2">Authentication Required</h1>
            <p className="text-sm text-muted-foreground mb-6">Sign in with an admin account to view system diagnostics.</p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="border border-destructive/40 bg-destructive/10 p-8 rounded-md text-center">
            <Shield className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h1 className="font-display text-xl uppercase tracking-wider mb-2">Access Denied</h1>
            <p className="text-sm text-muted-foreground">Admin role required to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 bg-primary/10 border border-primary/30 rounded-sm">
              <span className="font-mono text-[10px] text-primary uppercase tracking-widest">Diagnostics</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Admin Only
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide mb-1">
            System Settings & Debug
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Verify presence of API keys and secrets without revealing their values.
          </p>
        </div>

        {/* Safety notice */}
        <div className="mb-8 border border-primary/30 bg-primary/5 p-4 rounded-md flex gap-3">
          <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground mb-1">No secret values are shown</p>
            <p className="text-muted-foreground">
              This page only confirms whether each key is configured. Values stay encrypted on the server and are never sent to the browser.
            </p>
          </div>
        </div>

        {/* Client-side */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-4 h-4 text-primary" />
            <h2 className="font-display text-sm uppercase tracking-widest text-foreground">
              Client-Side (Browser)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono mb-4">
            These values are bundled into the JavaScript shipped to every visitor. Only public identifiers should appear here.
          </p>
          <div className="border border-border bg-card rounded-md divide-y divide-border">
            {clientStatuses.map((s) => (
              <SecretRow key={s.name} status={s} />
            ))}
          </div>
        </section>

        {/* Server-side */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              <h2 className="font-display text-sm uppercase tracking-widest text-foreground">
                Server-Side (Edge Functions)
              </h2>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchServerSecrets}
              disabled={loading}
              className="font-mono text-[10px] uppercase tracking-wider"
            >
              {loading ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : null}
              Refresh
            </Button>
          </div>
          <p className="text-xs text-muted-foreground font-mono mb-4">
            These secrets live only on Lovable Cloud servers and are accessed by edge functions via Deno.env.
          </p>

          {serverError && (
            <div className="border border-destructive/40 bg-destructive/10 p-4 rounded-md text-sm text-destructive mb-4">
              {serverError}
            </div>
          )}

          {loading && !serverSecrets ? (
            <div className="border border-border bg-card p-8 rounded-md flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : serverSecrets ? (
            <>
              <div className="border border-border bg-card rounded-md divide-y divide-border">
                {Object.entries(serverSecrets).map(([name, present]) => (
                  <SecretRow
                    key={name}
                    status={{
                      name,
                      present,
                      scope: "server",
                      note: serverNoteFor(name),
                    }}
                  />
                ))}
              </div>
              {checkedAt && (
                <p className="text-[10px] text-muted-foreground font-mono mt-2 uppercase tracking-wider">
                  Last checked: {new Date(checkedAt).toLocaleString()}
                </p>
              )}
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function SecretRow({ status }: { status: SecretStatus }) {
  const Icon = status.scope === "client" ? Monitor : Server;
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Key className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <code className="font-mono text-sm text-foreground">{status.name}</code>
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1">
            <Icon className="w-2.5 h-2.5" />
            {status.scope}
          </span>
        </div>
        {status.note && (
          <p className="text-xs text-muted-foreground mt-0.5">{status.note}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {status.present ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-primary">Set</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4 text-destructive" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-destructive">Missing</span>
          </>
        )}
      </div>
    </div>
  );
}

function serverNoteFor(name: string): string | undefined {
  switch (name) {
    case "OPENWEATHER_API_KEY":
      return "Used by weather-proxy edge function";
    case "LOVABLE_API_KEY":
      return "Lovable AI Gateway access";
    case "SUPABASE_SERVICE_ROLE_KEY":
      return "Full admin access — server-side only, NEVER expose";
    case "SUPABASE_URL":
    case "SUPABASE_ANON_KEY":
    case "SUPABASE_PUBLISHABLE_KEY":
      return "Auto-injected by Lovable Cloud";
    case "SUPABASE_DB_URL":
      return "Direct database connection string";
    default:
      return undefined;
  }
}