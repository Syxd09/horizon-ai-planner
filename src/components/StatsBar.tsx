import { Target, StickyNote, TrendingUp, Flame } from "lucide-react";

const stats = [
  { label: "Active Goals", value: "3", icon: Target, color: "text-primary", bg: "bg-primary/15" },
  { label: "Notes", value: "3", icon: StickyNote, color: "text-secondary", bg: "bg-secondary/15" },
  { label: "Completion", value: "63%", icon: TrendingUp, color: "text-accent", bg: "bg-accent/15" },
  { label: "Streak", value: "7 days", icon: Flame, color: "text-primary", bg: "bg-primary/15" },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="glass-card-hover p-4 flex items-center gap-3"
          style={{ animation: `slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms forwards`, opacity: 0 }}
        >
          <div className={`p-2 rounded-lg ${stat.bg}`}>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
