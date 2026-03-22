import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Plus, CheckCircle2, Circle, Trash2, ChevronRight } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  progress: number;
  completed: boolean;
  milestones: { id: string; text: string; done: boolean }[];
}

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Learn TypeScript deeply",
    progress: 65,
    completed: false,
    milestones: [
      { id: "m1", text: "Generics & utility types", done: true },
      { id: "m2", text: "Conditional types", done: true },
      { id: "m3", text: "Build a typed API client", done: false },
    ],
  },
  {
    id: "2",
    title: "Ship side project MVP",
    progress: 40,
    completed: false,
    milestones: [
      { id: "m4", text: "Design system", done: true },
      { id: "m5", text: "Core features", done: false },
      { id: "m6", text: "Deploy & share", done: false },
    ],
  },
  {
    id: "3",
    title: "Read 12 books this year",
    progress: 83,
    completed: false,
    milestones: [
      { id: "m7", text: "10 books done", done: true },
      { id: "m8", text: "Finish current book", done: false },
    ],
  },
];

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [newGoal, setNewGoal] = useState("");
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, {
      id: Date.now().toString(),
      title: newGoal,
      progress: 0,
      completed: false,
      milestones: [],
    }]);
    setNewGoal("");
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed, progress: g.completed ? g.progress : 100 } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      const updated = g.milestones.map(m => m.id === milestoneId ? { ...m, done: !m.done } : m);
      const doneCount = updated.filter(m => m.done).length;
      return { ...g, milestones: updated, progress: updated.length ? Math.round((doneCount / updated.length) * 100) : g.progress };
    }));
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/15">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Goals</h2>
        <span className="ml-auto text-xs font-mono text-muted-foreground tabular-nums">
          {goals.filter(g => g.completed).length}/{goals.length}
        </span>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add a new goal..."
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addGoal()}
          className="bg-muted/50 border-border/50 h-10"
        />
        <Button onClick={addGoal} size="icon" className="h-10 w-10 shrink-0 active:scale-95 transition-transform">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
        {goals.map((goal, i) => (
          <div
            key={goal.id}
            className="group rounded-lg border border-border/30 bg-muted/20 overflow-hidden transition-all duration-300 hover:border-border/60"
            style={{ animation: `slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms forwards`, opacity: 0 }}
          >
            <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}>
              <button
                onClick={(e) => { e.stopPropagation(); toggleGoal(goal.id); }}
                className="shrink-0 active:scale-90 transition-transform"
              >
                {goal.completed
                  ? <CheckCircle2 className="w-5 h-5 text-secondary" />
                  : <Circle className="w-5 h-5 text-muted-foreground" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${goal.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {goal.title}
                </p>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${goal.progress}%`,
                      background: goal.progress >= 80 ? "hsl(var(--secondary))" : "hsl(var(--primary))",
                    }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground tabular-nums shrink-0">{goal.progress}%</span>
              <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expandedGoal === goal.id ? "rotate-90" : ""}`} />
              <button
                onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 active:scale-90"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
              </button>
            </div>

            {expandedGoal === goal.id && goal.milestones.length > 0 && (
              <div className="px-3 pb-3 pl-11 space-y-1.5" style={{ animation: "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
                {goal.milestones.map(m => (
                  <button
                    key={m.id}
                    onClick={() => toggleMilestone(goal.id, m.id)}
                    className="flex items-center gap-2 w-full text-left active:scale-[0.98] transition-transform"
                  >
                    {m.done
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                      : <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    }
                    <span className={`text-xs ${m.done ? "line-through text-muted-foreground" : "text-foreground/80"}`}>{m.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
