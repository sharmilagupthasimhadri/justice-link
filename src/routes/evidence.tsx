import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Check } from "lucide-react";

export const Route = createFileRoute("/evidence")({ component: EvidencePage });

const EVIDENCE: Record<string, string[]> = {
  "Cyber Fraud": ["Screenshots of the scam messages/emails", "Transaction IDs & reference numbers", "Bank statement showing the debit", "UPI/wallet payment history", "Suspect phone number(s) / email(s)", "Any URLs or fake website links"],
  "Online Harassment": ["Chat records (WhatsApp/Instagram/Twitter)", "Screenshots with timestamps", "Voice recordings", "Witness contact details", "Profile URL of the harasser"],
  "Theft": ["Ownership proof (bill/serial number)", "Photos of the stolen item(s)", "Witness statements", "CCTV footage if available", "List of items with approximate value"],
  "Physical Assault": ["Medical report / MLC copy", "Photographs of injuries", "Eyewitness contact details", "CCTV / dashcam footage", "Torn clothes or physical evidence"],
  "Sexual Harassment / Molestation": ["Medical examination report", "Written or recorded statement", "Witness details", "Chat/SMS/email evidence", "CCTV footage of incident location"],
  "Consumer Dispute": ["Original invoice / bill", "Product photographs & defect proof", "Warranty card", "Communication with seller/company", "Payment proof"],
  "Employment / Salary": ["Signed offer letter / appointment letter", "Salary slips of last 6 months", "Bank statements showing salary credits", "Email trail with HR/manager", "Attendance / timesheet records"],
  "Property Dispute": ["Sale deed / title documents", "Property tax receipts", "Encumbrance certificate", "Photographs of the property", "Witness affidavits"],
  "Domestic Violence": ["Medical records of injuries", "Photographs of injuries/damage", "Written complaints filed earlier", "Witness statements from neighbours/family", "Financial dependence documents"],
};

function EvidencePage() {
  const cats = Object.keys(EVIDENCE);
  const [active, setActive] = useState(cats[0]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const items = EVIDENCE[active];
  const done = items.filter((i) => checked[`${active}:${i}`]).length;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg glass-gold"><ShieldCheck className="h-5 w-5 text-gold" /></div>
        <div>
          <h1 className="font-display text-2xl font-bold">Evidence Center</h1>
          <p className="text-sm text-muted-foreground">Dynamic checklists showing exactly what to collect before you file.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="glass rounded-2xl p-3 h-fit sticky top-20">
          {cats.map((c) => (
            <button
              key={c} onClick={() => setActive(c)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${active === c ? "bg-gold/10 text-gold" : "hover:bg-white/5"}`}
            >{c}</button>
          ))}
        </aside>

        <section className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">{active}</h2>
            <div className="text-xs text-muted-foreground">{done}/{items.length} collected</div>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden mb-6">
            <div className="h-full bg-gold gold-glow transition-all" style={{ width: `${(done / items.length) * 100}%` }} />
          </div>
          <ul className="space-y-2">
            {items.map((i) => {
              const key = `${active}:${i}`;
              const ok = !!checked[key];
              return (
                <li key={i}>
                  <button
                    onClick={() => setChecked((c) => ({ ...c, [key]: !c[key] }))}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-left transition ${ok ? "glass-gold text-foreground" : "glass hover:border-gold/40"}`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${ok ? "bg-gold border-gold text-primary-foreground" : "border-white/20"}`}>
                      {ok && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className={ok ? "line-through opacity-70" : ""}>{i}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
