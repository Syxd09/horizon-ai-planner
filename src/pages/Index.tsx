import { useState } from "react";
import Scene3D from "@/components/Scene3D";
import AuthForm from "@/components/AuthForm";
import DashboardHeader from "@/components/DashboardHeader";
import StatsBar from "@/components/StatsBar";
import GoalTracker from "@/components/GoalTracker";
import NoteTracker from "@/components/NoteTracker";
import AISummary from "@/components/AISummary";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Scene3D className="absolute inset-0 z-0" />
        <div className="absolute inset-0 bg-background/40 z-[1]" />
        <div className="relative z-10 w-full px-4">
          <AuthForm onLogin={() => setIsLoggedIn(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Scene3D className="fixed inset-0 z-0 opacity-30" />
      <div className="relative z-10 min-h-screen">
        <DashboardHeader onLogout={() => setIsLoggedIn(false)} />

        <main className="max-w-7xl mx-auto px-4 md:px-6 pb-12 space-y-6">
          <div className="pt-4 space-y-1" style={{ animation: "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>
              Your <span className="text-gradient-warm">Mission Control</span>
            </h1>
            <p className="text-muted-foreground">Track goals, capture ideas, and let AI guide your path.</p>
          </div>

          <StatsBar />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1" style={{ animation: "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 200ms forwards", opacity: 0 }}>
              <GoalTracker />
            </div>
            <div className="lg:col-span-1" style={{ animation: "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards", opacity: 0 }}>
              <NoteTracker />
            </div>
            <div className="lg:col-span-1" style={{ animation: "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 400ms forwards", opacity: 0 }}>
              <AISummary />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
