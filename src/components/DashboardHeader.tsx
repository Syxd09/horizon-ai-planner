import { Sparkles, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary" />
        <span className="text-xl font-bold tracking-tight text-foreground">Orbit</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/30">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground/80">Demo User</span>
        </div>
        <Button
          onClick={onLogout}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
