import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { FileText, Printer, Download, Sparkles } from "lucide-react";
import { generateFIR } from "@/lib/legal.functions";

export const Route = createFileRoute("/fir")({ component: FIRPage });

function FIRPage() {
  const gen = useServerFn(generateFIR);
  const [incident, setIncident] = useState("");
  const [complainant, setComplainant] = useState("");
  const [location, setLocation] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (incident.trim().length < 15) { toast.error("Please describe the incident in more detail."); return; }
    setLoading(true);
    try {
      const res = await gen({ data: { incident: incident.trim(), complainant, location } });
      setDraft(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate FIR");
    } finally { setLoading(false); }
  }

  function printDoc() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>FIR Draft</title><style>
      body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:20px;line-height:1.7;color:#111}
      h1,h2,h3{font-family:Georgia,serif}
      hr{margin:24px 0;border:0;border-top:1px solid #ccc}
      pre{white-space:pre-wrap;font-family:inherit}
    </style></head><body><pre>${draft.replace(/</g, "&lt;")}</pre><script>window.print()</script></body></html>`);
    w.document.close();
  }

  function downloadTxt() {
    const blob = new Blob([draft], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "FIR_Draft.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 grid gap-6 md:grid-cols-2">
      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg glass-gold"><FileText className="h-4 w-4 text-gold" /></div>
          <div>
            <h1 className="font-display text-xl font-bold">FIR Generator</h1>
            <p className="text-xs text-muted-foreground">Draft a First Information Report in seconds.</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Describe the incident</label>
            <textarea
              value={incident} onChange={(e) => setIncident(e.target.value)}
              rows={8} placeholder="On 12 July around 9 PM, an unknown person called claiming to be from my bank and…"
              className="mt-1.5 w-full glass rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Complainant name</label>
              <input value={complainant} onChange={(e) => setComplainant(e.target.value)}
                className="mt-1.5 w-full glass rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Location / City</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)}
                className="mt-1.5 w-full glass rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
            </div>
          </div>
          <button
            onClick={submit} disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-primary-foreground px-4 py-3 text-sm font-semibold hover:brightness-110 disabled:opacity-40 gold-glow"
          >
            <Sparkles className="h-4 w-4" /> {loading ? "Drafting FIR…" : "Generate FIR Draft"}
          </button>
        </div>
      </section>

      <section className="glass rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">Draft Preview</h2>
          {draft && (
            <div className="flex gap-2">
              <button onClick={printDoc} className="glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 hover:text-gold"><Printer className="h-3.5 w-3.5" /> Print / PDF</button>
              <button onClick={downloadTxt} className="glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 hover:text-gold"><Download className="h-3.5 w-3.5" /> .txt</button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {draft ? (
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap prose-headings:font-display prose-headings:text-gold">
              <ReactMarkdown>{draft}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full min-h-64 flex items-center justify-center text-sm text-muted-foreground text-center px-6">
              Your FIR draft will appear here.<br/>Describe the incident and click Generate.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
