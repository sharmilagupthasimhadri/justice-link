import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Scale } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account created. You're now signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally { setBusy(false); }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/admin" });
    if (res.error) toast.error(res.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass rounded-3xl p-8 md:p-10 w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <Scale className="h-6 w-6 text-gold" />
          <span className="font-display font-bold gold-text">JusticeLink</span>
        </Link>
        <h1 className="font-display text-2xl font-bold">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="text-sm text-muted-foreground mt-1">Admin area — restricted access.</p>

        <button onClick={google} className="mt-6 w-full glass rounded-xl px-4 py-2.5 text-sm hover:border-gold/40 transition flex items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#FBBC05" d="M23.49 12.27c0-.85-.08-1.68-.24-2.48H12v4.7h6.44c-.28 1.5-1.13 2.77-2.4 3.63v3.02h3.88c2.27-2.1 3.57-5.18 3.57-8.87z" opacity=".9"/><path fill="#EA4335" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.24 21.3 7.31 24 12 24z" opacity=".9"/><path fill="#4285F4" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76l4-3.11z" opacity=".9"/><path fill="#34A853" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.24 2.7 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75z" opacity=".9"/></svg>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full glass rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full glass rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
          </div>
          <button type="submit" disabled={busy}
            className="w-full rounded-xl bg-gold text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:brightness-110 disabled:opacity-40">
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-4 text-xs text-muted-foreground hover:text-gold w-full text-center">
          {mode === "signin" ? "No account? Create one" : "Already have an account? Sign in"}
        </button>
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-gold">← Back to JusticeLink</Link>
        </div>
      </div>
    </div>
  );
}
