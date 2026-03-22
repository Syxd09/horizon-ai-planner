import { Sparkles, Brain, Route, ChevronRight, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const features = [
  {
    icon: Sparkles,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/20",
    title: "Smart Summary",
    description: "AI analyzes your goals and notes to surface patterns, blockers, and momentum shifts.",
    cta: "Generate Summary",
  },
  {
    icon: Route,
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
    iconBorder: "border-secondary/20",
    title: "Roadmap Builder",
    description: "Auto-generate timelines with milestones, dependencies, and realistic deadlines.",
    cta: "Build Roadmap",
  },
  {
    icon: Brain,
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
    iconBorder: "border-accent/20",
    title: "Suggestions",
    description: "Get contextual next-step recommendations based on your progress and habits.",
    cta: "Get Suggestions",
  },
];

export default function AISummary() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative p-2 rounded-xl bg-accent/10 border border-accent/20">
          <Brain className="w-5 h-5 text-accent" />
          <div className="absolute -inset-1 rounded-xl opacity-0 animate-pulse-glow blur-md" style={{ background: "hsl(270 60% 58% / 0.2)" }} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Powered by intelligence</p>
        </div>
        <span className="ml-auto">
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
            <Zap className="w-3 h-3" />
            Soon
          </span>
        </span>
      </div>

      <div className="space-y-2.5">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className={`group relative rounded-xl border border-border/30 bg-muted/10 p-4 overflow-hidden transition-all duration-300 hover:border-border/50 hover:bg-muted/20`}
            style={{ animation: `slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${(i + 1) * 100}ms forwards`, opacity: 0 }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Hover glow */}
            <div className={`absolute -top-6 -right-6 w-20 h-20 ${feature.iconBg} rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />

            <div className="relative space-y-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${feature.iconBg} border ${feature.iconBorder}`}>
                  <feature.icon className={`w-4 h-4 ${feature.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed" style={{ textWrap: "pretty" }}>
                {feature.description}
              </p>
              <Button disabled variant="outline" size="sm" className="text-xs h-8 opacity-60 group-hover:opacity-80 transition-opacity">
                <Lock className="w-3 h-3 mr-1.5" />
                {feature.cta}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom hint */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-accent/5 border border-accent/10">
        <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Connect <span className="text-accent font-medium">Lovable Cloud</span> to unlock AI-powered insights, roadmaps, and smart suggestions.
        </p>
      </div>
    </div>
  );
}
