import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowRight, Orbit, Eye, EyeOff } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="w-full max-w-[420px] mx-auto" style={{ animation: "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
      {/* Glow backdrop */}
      <div className="absolute -inset-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(12 90% 58% / 0.3), transparent 70%)", animation: "pulse-glow 4s ease-in-out infinite" }} />
      </div>

      <div className="relative glass-card p-8 space-y-7 overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/60 to-transparent" />
          <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-primary/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-secondary/60 to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-secondary/60 to-transparent" />
        </div>

        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Orbit className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -inset-1 rounded-2xl opacity-40 blur-lg" style={{ background: "hsl(12 90% 58% / 0.3)" }} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>
            Orbit
          </h1>
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto" style={{ textWrap: "pretty" }}>
            {isSignUp ? "Create your account and start building your orbit" : "Welcome back — your goals await"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2" style={{ animation: "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
              <Label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</Label>
              <div className={`relative rounded-lg transition-all duration-300 ${focusedField === "name" ? "ring-2 ring-primary/30" : ""}`}>
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 bg-muted/30 border-border/40 focus:border-primary/60 h-12 text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
            <div className={`relative rounded-lg transition-all duration-300 ${focusedField === "email" ? "ring-2 ring-primary/30" : ""}`}>
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="pl-10 bg-muted/30 border-border/40 focus:border-primary/60 h-12 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</Label>
            <div className={`relative rounded-lg transition-all duration-300 ${focusedField === "password" ? "ring-2 ring-primary/30" : ""}`}>
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="pl-10 pr-10 bg-muted/30 border-border/40 focus:border-primary/60 h-12 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 font-semibold text-sm group active:scale-[0.97] transition-all duration-200 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card/60 backdrop-blur-sm px-3 text-[11px] text-muted-foreground uppercase tracking-widest">or</span>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span className="font-medium text-primary">{isSignUp ? "Sign in" : "Sign up"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
