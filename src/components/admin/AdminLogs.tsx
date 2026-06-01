import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";

type LogRow = {
  id: number;
  path: string;
  method: string;
  status_code: number;
  user_agent: string | null;
  ip: string | null;
  cache_status: string | null;
  duration_ms: number | null;
  rate_limited: boolean;
  created_at: string;
};

const STATUS_OPTIONS = ["all", "200", "400", "401", "403", "429", "500"] as const;
const WINDOW_OPTIONS = [
  { label: "Last 15 min", value: 15 },
  { label: "Last 1 hour", value: 60 },
  { label: "Last 24 hours", value: 60 * 24 },
  { label: "Last 7 days", value: 60 * 24 * 7 },
];

function shortenUA(ua: string | null): string {
  if (!ua) return "—";
  const m = ua.match(/(Chrome|Firefox|Safari|Edge|Edg|Mobile|curl|node|deno|python|bot)[\/\s]?[\d.]*/i);
  return m ? m[0] : ua.slice(0, 32);
}

export default function AdminLogs() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [pathFilter, setPathFilter] = useState("");
  const [uaFilter, setUaFilter] = useState("");
  const [windowMin, setWindowMin] = useState(60);

  async function load() {
    setLoading(true);
    setError(null);
    const since = new Date(Date.now() - windowMin * 60 * 1000).toISOString();
    let query = supabase
      .from("request_logs")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(500);
    if (status !== "all") query = query.eq("status_code", Number(status));
    const { data, error } = await query;
    if (error) setError(error.message);
    else setRows((data ?? []) as LogRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowMin, status]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (pathFilter && !r.path.toLowerCase().includes(pathFilter.toLowerCase())) return false;
      if (uaFilter && !(r.user_agent ?? "").toLowerCase().includes(uaFilter.toLowerCase())) return false;
      return true;
    });
  }, [rows, pathFilter, uaFilter]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const ok = filtered.filter((r) => r.status_code < 400).length;
    const rate = filtered.filter((r) => r.rate_limited || r.status_code === 429).length;
    const err = filtered.filter((r) => r.status_code >= 500).length;
    const uniqueUA = new Set(filtered.map((r) => r.user_agent)).size;
    const uniqueIP = new Set(filtered.map((r) => r.ip)).size;
    return { total, ok, rate, err, uniqueUA, uniqueIP };
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 font-mono text-xs">
        {[
          { label: "TOTAL", value: stats.total, tone: "text-foreground" },
          { label: "2XX", value: stats.ok, tone: "text-primary" },
          { label: "429", value: stats.rate, tone: stats.rate > 0 ? "text-amber-400" : "text-muted-foreground" },
          { label: "5XX", value: stats.err, tone: stats.err > 0 ? "text-destructive" : "text-muted-foreground" },
          { label: "UNIQUE UA", value: stats.uniqueUA, tone: "text-foreground" },
          { label: "UNIQUE IP", value: stats.uniqueIP, tone: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-sm px-3 py-2">
            <div className="text-muted-foreground uppercase tracking-wider text-[10px]">{s.label}</div>
            <div className={`text-lg font-bold ${s.tone}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* 429 alert */}
      {stats.rate > 0 && (
        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/40 rounded-sm px-3 py-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
          <div className="font-mono text-xs">
            <div className="text-amber-300 font-bold uppercase tracking-wider">Rate Limit Alert</div>
            <div className="text-muted-foreground">
              {stats.rate} rate-limited request(s) in this window. Investigate retry storms or upstream OWM throttling.
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={windowMin}
          onChange={(e) => setWindowMin(Number(e.target.value))}
          className="bg-card border border-border rounded-sm px-2 py-1.5 text-xs font-mono"
        >
          {WINDOW_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="bg-card border border-border rounded-sm px-2 py-1.5 text-xs font-mono"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All statuses" : `Status ${s}`}</option>
          ))}
        </select>
        <input
          placeholder="Filter path..."
          value={pathFilter}
          onChange={(e) => setPathFilter(e.target.value)}
          className="bg-card border border-border rounded-sm px-2 py-1.5 text-xs font-mono flex-1 min-w-[140px]"
        />
        <input
          placeholder="Filter user-agent..."
          value={uaFilter}
          onChange={(e) => setUaFilter(e.target.value)}
          className="bg-card border border-border rounded-sm px-2 py-1.5 text-xs font-mono flex-1 min-w-[140px]"
        />
        <button
          onClick={load}
          className="flex items-center gap-1 bg-primary/20 border border-primary/40 text-primary rounded-sm px-3 py-1.5 text-xs font-mono uppercase hover:bg-primary/30"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Table */}
      {error && <div className="text-destructive text-sm font-mono">{error}</div>}
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full text-xs font-mono">
            <thead className="bg-muted/30 sticky top-0">
              <tr className="text-left text-muted-foreground uppercase tracking-wider">
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Method</th>
                <th className="px-3 py-2">Path</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Cache</th>
                <th className="px-3 py-2">ms</th>
                <th className="px-3 py-2">IP</th>
                <th className="px-3 py-2">User-Agent</th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr><td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading logs...
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">No requests in this window.</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/20">
                    <td className="px-3 py-1.5 text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleTimeString()}
                    </td>
                    <td className="px-3 py-1.5">{r.method}</td>
                    <td className="px-3 py-1.5 max-w-[200px] truncate" title={r.path}>{r.path}</td>
                    <td className={`px-3 py-1.5 font-bold ${
                      r.status_code === 429 || r.rate_limited ? "text-amber-400"
                      : r.status_code >= 500 ? "text-destructive"
                      : r.status_code >= 400 ? "text-orange-400"
                      : "text-primary"
                    }`}>{r.status_code}{r.rate_limited && r.status_code !== 429 ? "*" : ""}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{r.cache_status ?? "—"}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{r.duration_ms ?? "—"}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{r.ip ?? "—"}</td>
                    <td className="px-3 py-1.5 text-muted-foreground" title={r.user_agent ?? ""}>{shortenUA(r.user_agent)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-[10px] font-mono text-muted-foreground">
        Auto-refreshes every 15s. Showing up to 500 rows. Logs retained for 7 days.
      </div>
    </div>
  );
}