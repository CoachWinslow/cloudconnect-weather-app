import { Cloud, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight text-foreground">
              CloudConnect
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Weather
            </p>
          </div>
        </button>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">My Global Tech Network</span>
        </div>
      </div>
    </header>
  );
}
