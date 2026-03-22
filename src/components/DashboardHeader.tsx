import { Orbit, LogOut, User, Bell, Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="relative z-10 border-b border-border/20 bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-16">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-primary/10 border border-primary/20">
            <Orbit className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">Orbit</span>
          <span className="hidden md:inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 ml-1">beta</span>
        </div>

        {/* Search bar — center */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-8">
          <div className={`relative w-full transition-all duration-300 ${searchFocused ? "scale-[1.02]" : ""}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search goals, notes..."
              className="w-full h-9 pl-9 pr-14 rounded-lg bg-muted/30 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-muted/50 transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted/50 border border-border/40">
              <Command className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-mono">K</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground active:scale-95 transition-all h-9 w-9">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </Button>

          <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border/30">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">D</span>
              </div>
              <span className="hidden sm:block text-sm text-foreground/80 font-medium">Demo</span>
            </div>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground active:scale-95 transition-all h-9 w-9"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
