import { createFileRoute } from "@tanstack/react-router";
import { Scale, Users, ShieldCheck, BookOpen } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — JusticeLink" }, { name: "description", content: "About JusticeLink: an AI-powered legal guidance platform for Indian citizens." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-16">
      <div className="glass-gold rounded-3xl p-10">
        <Scale className="h-10 w-10 text-gold mb-4" />
        <h1 className="font-display text-4xl font-bold gold-text">About JusticeLink</h1>
        <p className="mt-4 text-lg text-foreground/90">
          JusticeLink helps Indian citizens understand applicable legal provisions by describing their issue in plain language. We combine a curated knowledge base of BNS/IPC sections with AI to return the sections that matter, the evidence you'll need, and the next step to take.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-8">
        {[
          { icon: Users, title: "For citizens", body: "Written for people without a legal background. No jargon walls." },
          { icon: BookOpen, title: "Grounded in law", body: "Every response points back to specific Indian sections from our knowledge base." },
          { icon: ShieldCheck, title: "Guardrailed", body: "The AI only answers questions related to Indian law and never invents sections." },
        ].map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6">
            <f.icon className="h-5 w-5 text-gold mb-3" />
            <div className="font-display font-semibold">{f.title}</div>
            <p className="text-sm text-muted-foreground mt-1">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 glass rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold">Our roadmap</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
          <li>Vector search with OpenAI embeddings and Qdrant for deeper retrieval.</li>
          <li>User accounts for saved legal queries and case timelines.</li>
          <li>Regional language support beyond English.</li>
          <li>Advocate directory and one-click consultations.</li>
        </ul>
      </div>
    </div>
  );
}
