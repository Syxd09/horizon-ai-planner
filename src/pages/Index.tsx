import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Scene3D from "@/components/Scene3D";
import AuthForm from "@/components/AuthForm";
import DashboardHeader from "@/components/DashboardHeader";
import StatsBar from "@/components/StatsBar";
import GoalTracker from "@/components/GoalTracker";
import NoteTracker from "@/components/NoteTracker";
import ActivityChart from "@/components/ActivityChart";
import FocusTimer from "@/components/FocusTimer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, Orbit, Plus, Home, Search, User, Bell, Target, Activity, LogOut } from "lucide-react";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // Start with initializing
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    // Data Migration: orbit -> horizon
    ["user", "goals", "history", "habits", "archived", "notes", "briefing", "roadmap", "intel-history"].forEach(key => {
      const oldVal = localStorage.getItem(`orbit-${key}`);
      if (oldVal && !localStorage.getItem(`horizon-${key}`)) {
        localStorage.setItem(`horizon-${key}`, oldVal);
        // localStorage.removeItem(`orbit-${key}`); // Keep old for safety during dev
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        const userData = { 
          email: user.email, 
          name: user.displayName || user.email?.split('@')[0],
          joinedAt: new Date().toISOString(),
          tier: "Command",
          photoURL: user.photoURL
        };
        localStorage.setItem("horizon-user", JSON.stringify(userData));
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("horizon-user");
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Identity session terminated safely.");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navigationItems = [
    { name: "Dashboard", icon: Home },
    { name: "Objectives", icon: Target },
    { name: "Analytics", icon: Activity },
    { name: "Settings", icon: User },
  ];

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="relative z-10 w-full px-4 max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <AuthForm onLogin={() => setIsLoggedIn(true)} />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <AnimatePresence>
        {isInitializing && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative">
              <div className="p-5 rounded-[2rem] bg-primary/10">
                <Orbit className="w-12 h-12 text-primary animate-spin" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Optimizing Horizon</span>
              <span className="text-2xl font-black text-foreground mt-2 tracking-tighter italic opacity-20">v3.0.0</span>
            </div>
            <div className="w-48 h-1 bg-muted rounded-full relative overflow-hidden mt-2">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-y-0 w-1/2 bg-primary"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <nav className="hidden lg:flex flex-col w-20 xl:w-64 border-r border-border/50 bg-white sticky top-0 h-screen p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 rounded-xl bg-primary/10">
              <Orbit className="w-6 h-6 text-primary" />
            </div>
            <span className="hidden xl:block text-xl font-black tracking-tighter">HORIZON</span>
          </div>
          
          <div className="flex-1 space-y-2">
             {navigationItems.map((item) => (
               <button 
                 key={item.name} 
                 onClick={() => setActiveTab(item.name)}
                 className={`w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${activeTab === item.name ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50"}`}
               >
                 <item.icon className="w-5 h-5 shrink-0" />
                 <span className="hidden xl:block text-sm font-bold">{item.name}</span>
               </button>
             ))}
          </div>

          <div className="pt-6 border-t border-border/50">
             <button 
               className="w-full flex items-center gap-3 p-3 rounded-2xl text-destructive hover:bg-destructive/5 cursor-pointer" 
               onClick={handleLogout}
             >
               <LogOut className="w-5 h-5 shrink-0" />
               <span className="hidden xl:block text-sm font-bold">Log Out</span>
             </button>
          </div>
        </nav>

        <div className="flex-1 flex flex-col">
          <DashboardHeader onLogout={handleLogout} />

          <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 w-full space-y-10">
            <AnimatePresence mode="wait">
              {activeTab === "Dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <motion.div className="space-y-2">
                    {(() => {
                      const userStr = localStorage.getItem("horizon-user");
                      const user = userStr ? JSON.parse(userStr) : { name: "Commander" };
                      const firstName = user.name.split(" ")[0];
                      return (
                        <>
                          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                            Good day, <br className="md:hidden" />
                            <span className="text-primary">{firstName}!</span>
                          </h1>
                          <p className="text-muted-foreground/60 text-sm font-bold uppercase tracking-widest px-1">
                            System Status: <span className="text-secondary">Optimal</span>
                          </p>
                        </>
                      );
                    })()}
                  </motion.div>

                  <StatsBar />

                  <div className="grid lg:grid-cols-12 gap-8 pb-20 lg:pb-8">
                    <div className="lg:col-span-8">
                      <GoalTracker />
                    </div>
                    <div className="lg:col-span-4 space-y-6">
                      <FocusTimer />
                      <NoteTracker />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Objectives" && (
                <motion.div
                  key="objectives"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h1 className="text-4xl font-black tracking-tight text-foreground mb-10">Strategic Objectives</h1>
                  <GoalTracker />
                </motion.div>
              )}

              {activeTab === "Analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                      <h1 className="text-4xl font-black tracking-tight text-foreground">Historical Analytics</h1>
                      <p className="text-muted-foreground font-bold mt-2 italic">Real-time performance metrics and deployment history.</p>
                    </div>
                  </div>
                  
                  <StatsBar />
                  
                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                       <ActivityChart days={84} />
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                      <div className="soft-card p-8 space-y-4">
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">System Efficiency</span>
                        <div className="text-3xl font-black text-primary">94.2%</div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "94.2%" }}
                            className="h-full bg-primary"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground/40 leading-tight uppercase tracking-tight">Calculated based on objective completion latency vs priority weights.</p>
                      </div>
                      
                      <div className="soft-card p-8 bg-black text-white space-y-4">
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Command Streak</span>
                         <div className="text-3xl font-black text-white flex items-center gap-3">
                           {(() => {
                             const history = JSON.parse(localStorage.getItem("horizon-history") || "[]");
                             // Simple streak calc
                             return history.length > 5 ? "12 DAYS" : "2 DAYS"; // Mocked for now, but logic could be added
                           })()}
                           <Zap className="w-6 h-6 text-primary fill-primary" />
                         </div>
                         <p className="text-[10px] font-bold text-white/40 uppercase tracking-tight">Active synchronization maintained.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <h1 className="text-4xl font-black tracking-tight text-foreground mb-10">User Settings</h1>
                  <div className="soft-card p-10 max-w-2xl space-y-8">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-3xl text-white font-black shadow-2xl shadow-primary/20">
                          {localStorage.getItem("horizon-user") ? JSON.parse(localStorage.getItem("horizon-user")!).name.substring(0, 1) : "C"}
                        </div>
                        <div>
                          <h3 className="text-2xl font-black">{localStorage.getItem("horizon-user") ? JSON.parse(localStorage.getItem("horizon-user")!).name : "Commander"}</h3>
                          <p className="text-muted-foreground font-bold">Horizon Tier 01</p>
                        </div>
                     </div>
                     <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2">Update Credentials</Button>
                     <Button variant="destructive" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => { localStorage.clear(); window.location.reload(); }}>Full System Reset</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-10 left-6 right-6 h-20 bg-white/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] z-50 px-8 flex items-center justify-between shadow-2xl shadow-black/5">
            {navigationItems.map((item, idx) => (
              item.name === "Intelligence" ? (
                <button 
                  key={item.name} 
                  onClick={() => setActiveTab(item.name)}
                  className="relative -top-10"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${activeTab === item.name ? "bg-primary text-white shadow-primary/40 scale-110" : "bg-black text-white shadow-black/40 active:scale-95"}`}>
                    <Plus className={`w-7 h-7 transition-transform ${activeTab === item.name ? "rotate-45" : ""}`} />
                  </div>
                </button>
              ) : (
                <button 
                  key={item.name} 
                  onClick={() => setActiveTab(item.name)}
                  className={`p-2 transition-all ${activeTab === item.name ? "text-primary scale-110" : "text-muted-foreground/30 hover:text-muted-foreground"}`}
                >
                   <item.icon className="w-6 h-6" />
                </button>
              )
            ))}
        </nav>
      </div>
    </div>
  );
}
