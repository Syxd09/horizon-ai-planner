import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Plus, Trash2, Clock, Sparkles, Brain, Loader2, Target, Tag, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateContent } from "@/lib/ai-service";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  color: string;
  tag?: string;
  suggestion?: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const getAutoTag = (content: string) => {
  const c = content.toLowerCase();
  if (c.includes("fix") || c.includes("bug") || c.includes("code") || c.includes("api")) return "TECHNICAL";
  if (c.includes("plan") || c.includes("strategy") || c.includes("market") || c.includes("meeting")) return "STRATEGIC";
  if (c.includes("buy") || c.includes("cost") || c.includes("budget") || c.includes("price")) return "FINANCIAL";
  return "INTEL";
};

export default function NoteTracker() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("horizon-notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState("");
  const [noteProcessingId, setNoteProcessingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("horizon-notes", JSON.stringify(notes));
  }, [notes]);

  const cycleTag = (id: string) => {
    const TAGS = ["INTEL", "TECHNICAL", "STRATEGIC", "FINANCIAL"];
    setNotes(notes.map(n => {
      if (n.id !== id) return n;
      const currentIdx = TAGS.indexOf(n.tag || "INTEL");
      const nextTag = TAGS[(currentIdx + 1) % TAGS.length];
      return { ...n, tag: nextTag };
    }));
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes([{
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString(),
      color: "border-l-primary",
      tag: getAutoTag(newNote)
    }, ...notes]);
    setNewNote("");
    setIsAdding(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const summarizeNote = async (id: string, content: string) => {
    setNoteProcessingId(id);
    try {
      const summary = await generateContent(`Summarize this note in one very short, tactical sentence: "${content}"`, "groq");
      if (summary) {
        setNotes(notes.map(n => n.id === id ? { ...n, content: summary, tag: getAutoTag(summary) } : n));
        toast.success("Intel summarized");
      }
    } catch (error) {
      toast.error("Summarization offline");
    } finally {
      setNoteProcessingId(null);
    }
  };

  const suggestActions = async (id: string, content: string) => {
    setIsSuggesting(id);
    try {
      const suggestion = await generateContent(`Based on this note: "${content}", suggest one specific next action. Keep it under 10 words.`, "google");
      if (suggestion) {
        setNotes(notes.map(n => n.id === id ? { ...n, suggestion } : n));
        toast.info(`Suggestion: ${suggestion}`, { duration: 5000 });
      }
    } catch (error) {
      toast.error("Suggestions offline");
    } finally {
      setIsSuggesting(null);
    }
  };

  const deployAsGoal = (note: Note) => {
    if (!note.suggestion) return;
    const savedGoals = JSON.parse(localStorage.getItem("horizon-goals") || "[]");
    const newGoal = {
      id: Date.now().toString(),
      title: note.suggestion,
      progress: 0,
      completed: false,
      milestones: [],
      priority: "Medium",
      category: "mechanic",
      time: "Now",
      context: `Extracted from intel: "${note.content}"`
    };
    localStorage.setItem("horizon-goals", JSON.stringify([newGoal, ...savedGoals]));
    window.dispatchEvent(new Event("storage"));
    toast.success("Intelligence deployed to objectives!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="soft-card p-6 space-y-6 flex flex-col min-h-[400px]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pastel-blue/30 transition-transform hover:scale-110">
            <StickyNote className="w-5 h-5 text-pastel-blue-foreground" />
          </div>
          <h2 className="text-xl font-black text-foreground">Intelligence Briefs</h2>
        </div>
        <span className="text-[10px] font-black text-muted-foreground/40 bg-muted/50 px-2 py-1 rounded-lg uppercase tracking-widest">{notes.length} Active</span>
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div 
            key="adding"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4 rounded-2xl bg-muted/30 p-4 border border-border/50"
          >
            <Textarea
              placeholder="Record tactical insights..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="bg-transparent border-none focus-visible:ring-0 min-h-[120px] resize-none text-sm p-0 placeholder:text-muted-foreground/40 font-medium"
              autoFocus
            />
            <div className="flex gap-2 pt-2 border-t border-border/50">
              <Button onClick={addNote} size="sm" className="h-9 px-4 rounded-xl bg-black text-white hover:bg-black/80 transition-all font-black text-[10px] uppercase tracking-widest">Execute</Button>
              <Button onClick={() => { setIsAdding(false); setNewNote(""); }} size="sm" variant="ghost" className="h-9 px-4 text-muted-foreground/40 rounded-xl font-black text-[10px] uppercase tracking-widest">Abort</Button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="idle"
            layoutId="add-note-btn"
            onClick={() => setIsAdding(true)}
            className="w-full h-14 bg-muted/20 border-2 border-dashed border-border/50 rounded-[1.5rem] text-muted-foreground/40 hover:text-foreground hover:border-primary/40 hover:bg-white transition-all flex items-center justify-center gap-3 group"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> 
            <span className="text-sm font-black uppercase tracking-widest">Add Daily Activity</span>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="space-y-4 flex-1">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className="text-sm text-muted-foreground/30 font-bold italic">No intelligence captured today...</p>
            </motion.div>
          ) : (
            notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group p-5 bg-white border border-border/40 rounded-[1.5rem] relative hover:shadow-xl hover:shadow-primary/5 transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground leading-relaxed pr-8">{note.content}</p>
                    <div className="flex items-center gap-3 opacity-40">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{timeAgo(note.createdAt)}</span>
                    </div>
                  </div>
                  {note.tag && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); cycleTag(note.id); }}
                      className="text-[8px] font-black px-2 py-1 rounded bg-muted/60 text-muted-foreground/60 tracking-widest uppercase hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      {note.tag}
                    </button>
                  )}
                </div>
                
                {note.suggestion && (
                    <div className="mb-4 p-3 rounded-xl bg-pastel-blue/20 border border-pastel-blue/30 flex items-center justify-between group/s">
                        <div className="flex items-center gap-2 pr-4 min-w-0">
                           <Target className="w-3 h-3 text-pastel-blue-foreground shrink-0" />
                           <p className="text-[10px] font-black text-pastel-blue-foreground uppercase tracking-tight truncate">Target: {note.suggestion}</p>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deployAsGoal(note)}
                            className="h-7 w-7 rounded-lg bg-white/50 text-pastel-blue-foreground hover:bg-white shadow-sm transition-all"
                            title="Deploy as Objective"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => summarizeNote(note.id, note.content)}
                    disabled={noteProcessingId === note.id}
                    className="h-8 w-8 hover:bg-pastel-green/20 hover:text-pastel-green-foreground rounded-lg"
                  >
                    {noteProcessingId === note.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => suggestActions(note.id, note.content)}
                    disabled={isSuggesting === note.id}
                    className="h-8 w-8 hover:bg-pastel-yellow/20 hover:text-pastel-yellow-foreground rounded-lg"
                  >
                    {isSuggesting === note.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNote(note.id)}
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
