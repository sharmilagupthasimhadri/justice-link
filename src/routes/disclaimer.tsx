import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({ meta: [{ title: "Disclaimer — JusticeLink" }, { name: "description", content: "JusticeLink disclaimer: informational guidance only, not legal advice." }] }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-16">
      <div className="glass rounded-3xl p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg glass-gold"><AlertTriangle className="h-5 w-5 text-gold" /></div>
          <h1 className="font-display text-3xl font-bold">Disclaimer</h1>
        </div>
        <div className="prose prose-invert max-w-none">
          <p><strong>JusticeLink provides informational legal guidance only and is not legal advice.</strong> The platform helps you understand which Indian legal provisions may apply to your situation and what evidence you may need. It is not a substitute for consultation with a qualified advocate.</p>
          <h3>Please note</h3>
          <ul>
            <li>The AI can make mistakes. Always verify sections and procedures with a qualified advocate or official sources.</li>
            <li>Nothing on this platform creates an attorney-client relationship.</li>
            <li>For time-sensitive matters (arrests, injuries, ongoing threats), contact the police or an advocate immediately.</li>
            <li>The knowledge base is a curated starter set of BNS/IPC provisions; it may not reflect the very latest amendments.</li>
          </ul>
          <h3>Emergency numbers</h3>
          <ul>
            <li><strong>Police:</strong> 100 / 112</li>
            <li><strong>Women Helpline:</strong> 1091</li>
            <li><strong>Cyber Crime Helpline:</strong> 1930 · <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
