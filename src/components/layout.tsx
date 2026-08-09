import { Link, useRouterState } from "@tanstack/react-router";
import { Scale, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/assistant", label: "Legal Assistant" },
  { to: "/fir", label: "FIR Generator" },
  { to: "/evidence", label: "Evidence Center" },
  { to: "/about", label: "About" },
  { to: "/disclaimer", label: "Disclaimer" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg glass-gold gold-glow">
            <Scale className="h-5 w-5 text-gold" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-lg gold-text">JusticeLink</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Know Your Rights</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? "text-gold bg-white/5" : "text-foreground/80 hover:text-gold hover:bg-white/5"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-white/5 px-4 pb-4 pt-2 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-gold hover:bg-white/5"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Scale className="h-5 w-5 text-gold" />
            <span className="font-display font-bold gold-text">JusticeLink</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Informational legal guidance for Indian citizens. Not a substitute for professional legal advice.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground mb-3">Product</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/assistant" className="hover:text-gold">Legal Assistant</Link></li>
            <li><Link to="/fir" className="hover:text-gold">FIR Generator</Link></li>
            <li><Link to="/evidence" className="hover:text-gold">Evidence Center</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground mb-3">Legal</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/disclaimer" className="hover:text-gold">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-muted-foreground px-4">
        © {new Date().getFullYear()} JusticeLink · Informational guidance only, not legal advice · Consult a qualified advocate for professional assistance.
      </div>
    </footer>
  );
}
