import { Sparkles, Brain, Route, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AISummary() {
  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/15">
          <Brain className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
        <span className="ml-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent">Coming Soon</span>
        </span>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-border/30 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Smart Summary</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            AI will analyze your goals and notes to generate personalized summaries, identify patterns, and suggest next steps.
          </p>
          <Button disabled variant="outline" size="sm" className="text-xs opacity-50">
            Generate Summary <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <div className="rounded-lg border border-border/30 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-medium text-foreground">Roadmap Builder</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Get AI-generated roadmaps based on your goals, with suggested milestones, timelines, and dependencies.
          </p>
          <Button disabled variant="outline" size="sm" className="text-xs opacity-50">
            Build Roadmap <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <div className="rounded-lg border border-border/30 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-medium text-foreground">Suggestions</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Receive contextual suggestions for new goals, task breakdowns, and productivity improvements.
          </p>
          <Button disabled variant="outline" size="sm" className="text-xs opacity-50">
            Get Suggestions <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
