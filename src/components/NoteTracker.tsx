import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Plus, Trash2, Clock } from "lucide-react";

interface Note {
  id: string;
  content: string;
  createdAt: Date;
  color: string;
}

const colors = [
  "border-l-primary",
  "border-l-secondary",
  "border-l-accent",
  "border-l-destructive",
];

const initialNotes: Note[] = [
  { id: "1", content: "Research best practices for state management — considering Zustand vs Jotai for the next sprint.", createdAt: new Date(Date.now() - 86400000 * 2), color: colors[0] },
  { id: "2", content: "Meeting notes: stakeholders want the dashboard to show real-time analytics. Need WebSocket integration.", createdAt: new Date(Date.now() - 86400000), color: colors[1] },
  { id: "3", content: "Idea: build a habit tracker feature that integrates with the goals system. Users can link daily habits to their goals.", createdAt: new Date(Date.now() - 3600000 * 4), color: colors[2] },
];

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NoteTracker() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes([{
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date(),
      color: colors[Math.floor(Math.random() * colors.length)],
    }, ...notes]);
    setNewNote("");
    setIsAdding(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary/15">
          <StickyNote className="w-5 h-5 text-secondary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Notes</h2>
        <span className="ml-auto text-xs font-mono text-muted-foreground tabular-nums">{notes.length} notes</span>
      </div>

      {isAdding ? (
        <div className="space-y-3" style={{ animation: "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
          <Textarea
            placeholder="What's on your mind?"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="bg-muted/50 border-border/50 min-h-[100px] resize-none"
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={addNote} size="sm" className="active:scale-95 transition-transform">Save Note</Button>
            <Button onClick={() => { setIsAdding(false); setNewNote(""); }} size="sm" variant="ghost" className="text-muted-foreground">Cancel</Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full h-10 border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Note
        </Button>
      )}

      <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
        {notes.map((note, i) => (
          <div
            key={note.id}
            className={`group rounded-lg border border-border/30 bg-muted/20 p-3 border-l-[3px] ${note.color} transition-all duration-300 hover:border-border/60`}
            style={{ animation: `slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms forwards`, opacity: 0 }}
          >
            <p className="text-sm text-foreground/90 leading-relaxed overflow-wrap-break-word">{note.content}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-[11px] font-mono">{timeAgo(note.createdAt)}</span>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
              >
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive transition-colors" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
