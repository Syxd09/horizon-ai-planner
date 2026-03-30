import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowRight, Orbit, Eye, EyeOff, Github, Chrome, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";

interface AuthFormProps {
  onLogin: () => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthError = (error: any) => {
    console.error("Auth error:", error);
    let message = "Authentication failed";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = "Invalid neural ID or access protocol";
    } else if (error.code === 'auth/email-already-in-use') {
      message = "Neural ID already registered";
    } else if (error.code === 'auth/weak-password') {
      message = "Access protocol too weak";
    } else if (error.code === 'auth/popup-closed-by-user') {
      message = "Authorization cancelled";
    }
    toast.error(message);
  };

  const handleSocialLogin = async (provider: any) => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userData = { 
        email: user.email, 
        name: user.displayName || user.email?.split('@')[0],
        joinedAt: new Date().toISOString(),
        tier: "Command",
        photoURL: user.photoURL
      };
      
      localStorage.setItem("orbit-user", JSON.stringify(userData));
      toast.success("Access granted via secure link.");
      onLogin();
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Invalid neural ID format");
      return;
    }
    if (password.length < 6) {
      toast.error("Access protocol requires at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        
        const userData = { 
          email: result.user.email, 
          name: name || email.split('@')[0],
          joinedAt: new Date().toISOString(),
          tier: "Command"
        };
        localStorage.setItem("orbit-user", JSON.stringify(userData));
        toast.success("Account initialized. Welcome to the network.");
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const userData = { 
          email: result.user.email, 
          name: result.user.displayName || result.user.email?.split('@')[0],
          joinedAt: new Date().toISOString(),
          tier: "Command"
        };
        localStorage.setItem("orbit-user", JSON.stringify(userData));
        toast.success("Access granted. Synchronizing orbital data.");
      }
      onLogin();
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto animate-in fade-in zoom-in-95 duration-700">
      <div className="relative soft-card p-10 space-y-8 overflow-hidden bg-white shadow-2xl">
        {/* Decorative dynamic elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="text-center space-y-4 relative z-10">
          <div className="flex items-center justify-center">
            <div className="p-4 rounded-[2rem] bg-black text-white shadow-2xl shadow-black/20 group cursor-pointer transition-all hover:scale-110">
              <Orbit className="w-10 h-10 group-hover:rotate-180 transition-transform duration-1000" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic">
              Orbit
            </h1>
            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] font-mono">
              {isSignUp ? "System Registration" : "Command Authorization"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {isSignUp && (
            <div className="space-y-1 animate-in slide-in-from-left-4 duration-300">
              <Label className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest ml-1">Identity</Label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === "name" ? "text-primary" : "text-muted-foreground/20"}`} />
                <Input
                  className="pl-12 bg-muted/30 border-none rounded-2xl h-14 text-sm font-bold focus:ring-1 ring-primary/20"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest ml-1">Neural ID</Label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === "email" ? "text-primary" : "text-muted-foreground/20"}`} />
              <Input
                className="pl-12 bg-muted/30 border-none rounded-2xl h-14 text-sm font-bold focus:ring-1 ring-primary/20"
                placeholder="email@orbit.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <Label className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest ml-1">Protocol</Label>
              {!isSignUp && <button type="button" className="text-[9px] font-black text-primary/60 uppercase tracking-widest hover:text-primary transition-colors">Recover</button>}
            </div>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === "password" ? "text-primary" : "text-muted-foreground/20"}`} />
              <Input
                className="pl-12 pr-12 bg-muted/30 border-none rounded-2xl h-14 text-sm font-bold focus:ring-1 ring-primary/20"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 hover:text-primary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-black text-white hover:bg-black/90 shadow-2xl shadow-black/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <span className="flex items-center gap-2">
                {isSignUp ? "Initialize Identity" : "Authorize Session"}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted/50" /></div>
          <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 bg-white px-4">Secure Link</div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          <Button 
            variant="outline" 
            className="h-14 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest gap-2 bg-transparent"
            onClick={() => handleSocialLogin(githubProvider)}
            disabled={isLoading}
          >
            <Github className="w-4 h-4" /> Github
          </Button>
          <Button 
            variant="outline" 
            className="h-14 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest gap-2 bg-transparent"
            onClick={() => handleSocialLogin(googleProvider)}
            disabled={isLoading}
          >
            <Chrome className="w-4 h-4" /> Google
          </Button>
        </div>

        <div className="pt-2 text-center relative z-10">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest hover:text-primary transition-colors duration-200"
          >
            {isSignUp ? "Access existing ID? " : "New to orbital network? "}
            <span className="text-primary">{isSignUp ? "Sign In" : "Register"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
