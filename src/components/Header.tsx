import { Satellite, Activity, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

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
              M3 CloudConnect
            </h1>
            <p className="font-mono text-[9px] text-primary/70 uppercase tracking-[0.2em]">
              Infrastructure Monitor v2.0
            </p>
          </div>
        </button>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <Activity className="w-3 h-3 text-primary telemetry-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Systems Online</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-primary/10 border border-primary/20">
            <Radio className="w-3 h-3 text-primary status-online" />
            <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
