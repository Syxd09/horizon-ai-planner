import { Target, StickyNote, TrendingUp, Flame, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  { label: "Active Goals", value: "3", icon: Target, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", trend: "+1", up: true },
  { label: "Notes", value: "3", icon: StickyNote, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20", trend: "+2", up: true },
  { label: "Completion", value: "63%", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", trend: "+8%", up: true },
  { label: "Streak", value: "7d", icon: Flame, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", trend: "Best!", up: true },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`group relative glass-card p-4 overflow-hidden border ${stat.border} hover:border-opacity-60 transition-all duration-300 active:scale-[0.98]`}
          style={{ animation: `slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms forwards`, opacity: 0 }}
        >
          {/* Subtle glow */}
          <div className={`absolute -top-8 -right-8 w-24 h-24 ${stat.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold tabular-nums text-foreground tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
            <div className={`p-2 rounded-xl ${stat.bg} border ${stat.border}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1">
            {stat.up ? (
              <ArrowUpRight className="w-3 h-3 text-secondary" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-destructive" />
            )}
            <span className="text-[10px] font-mono text-secondary">{stat.trend}</span>
            <span className="text-[10px] text-muted-foreground ml-0.5">this week</span>
          </div>
        </div>
      ))}
    </div>
  );
}
