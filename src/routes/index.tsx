import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, MessageSquare, FileText, ShieldCheck, Sparkles, ArrowRight, Lock, Zap, BookOpen } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

const CATEGORIES = [
  "Cyber Crime", "Women Safety", "Property Crime", "Violent Crime",
  "Public Order", "Documents & Fraud", "Consumer Issues", "Employment Issues", "Family Law",
];

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-gold mb-6">
                <Sparkles className="h-3 w-3" /> Powered by Indian legal knowledge
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                <span className="gold-text">⚖ JusticeLink</span>
              </h1>
              <p className="mt-4 text-xl md:text-2xl text-foreground/90 font-medium">
                Know Your Rights. Understand the Law.
              </p>
              <p className="mt-4 text-base text-muted-foreground max-w-lg">
                Describe your legal issue in simple language and receive legal guidance,
                applicable sections, evidence requirements, and suggested next steps.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/assistant"
                  className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 gold-glow transition"
                >
                  <MessageSquare className="h-4 w-4" /> Start Legal Analysis <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/fir"
                  className="inline-flex items-center gap-2 rounded-lg glass border border-gold/30 px-6 py-3 text-sm font-semibold text-gold hover:bg-gold/10 transition"
                >
                  <FileText className="h-4 w-4" /> Generate FIR
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-gold/70" /> Private</div>
                <div className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-gold/70" /> Instant</div>
                <div className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-gold/70" /> Verified sections</div>
              </div>
            </div>

            {/* Courthouse illustration */}
            <div className="relative">
              <div className="glass-gold rounded-3xl p-10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 blur-2xl">
                  <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-gold/40" />
                  <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-navy/60" />
                </div>
                <svg viewBox="0 0 400 300" className="relative w-full h-auto text-gold animate-pulse-slow">
                  {/* Courthouse */}
                  <g stroke="currentColor" strokeWidth="2" fill="none">
                    {/* Roof */}
                    <polygon points="50,120 200,50 350,120" fill="oklch(0.82 0.16 85 / 0.15)" />
                    {/* Columns */}
                    {[80, 130, 180, 220, 270, 320].map((x, i) => (
                      <rect key={i} x={x - 8} y="130" width="16" height="100" fill="oklch(0.82 0.16 85 / 0.08)" />
                    ))}
                    {/* Base */}
                    <rect x="40" y="230" width="320" height="20" fill="oklch(0.82 0.16 85 / 0.2)" />
                    <rect x="30" y="250" width="340" height="12" fill="oklch(0.82 0.16 85 / 0.3)" />
                    {/* Steps */}
                    <line x1="60" y1="130" x2="340" y2="130" strokeWidth="3" />
                    {/* Scales of justice */}
                    <g transform="translate(200,90)">
                      <line x1="0" y1="-30" x2="0" y2="20" strokeWidth="2.5" />
                      <line x1="-40" y1="-20" x2="40" y2="-20" strokeWidth="2.5" />
                      <circle cx="-40" cy="-5" r="10" />
                      <circle cx="40" cy="-5" r="10" />
                      <circle cx="0" cy="-30" r="4" fill="currentColor" />
                    </g>
                  </g>
                </svg>
                <div className="relative mt-6 grid grid-cols-3 gap-3">
                  {[Scale, ShieldCheck, BookOpen].map((I, i) => (
                    <div key={i} className="glass rounded-xl p-4 flex flex-col items-center gap-2">
                      <I className="h-5 w-5 text-gold" />
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {["Justice", "Rights", "Sections"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Everything you need to <span className="gold-text">navigate the law</span></h2>
          <p className="mt-3 text-muted-foreground">Three pillars, one platform.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: MessageSquare, title: "Legal Assistant", desc: "Chat-based AI trained on Indian legal provisions, from BNS/IPC to specialized acts.", to: "/assistant" },
            { icon: FileText, title: "FIR Generator", desc: "Turn a plain-language incident description into a properly formatted FIR draft.", to: "/fir" },
            { icon: ShieldCheck, title: "Evidence Center", desc: "Dynamic checklists tell you exactly what to collect before filing.", to: "/evidence" },
          ].map((f) => (
            <Link key={f.title} to={f.to} className="group glass rounded-2xl p-6 hover:border-gold/40 transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl glass-gold mb-4">
                <f.icon className="h-5 w-5 text-gold" />
              </div>
              <div className="font-display text-xl font-semibold">{f.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <div className="mt-4 text-sm text-gold flex items-center gap-1">
                Open <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-24">
        <div className="glass rounded-3xl p-8 md:p-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">Legal Categories We Cover</h3>
          <p className="text-muted-foreground mb-6 text-sm">Click a category to start a focused query.</p>
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to="/assistant"
                className="glass rounded-full px-4 py-2 text-sm hover:border-gold/40 hover:text-gold transition"
              >
                {c}
              </Link>

            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
