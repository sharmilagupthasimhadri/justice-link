import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import guardrail from "@/data/guardrail.txt?raw";
import knowledgeBase from "@/data/knowledge_base.json";
import firTemplates from "@/data/fir_templates.json";

type Law = {
  section: string;
  title: string;
  category: string;
  keywords: string[];
  description?: string;
  recommended_action?: string;
};

const laws = (knowledgeBase as { laws: Law[] }).laws;

function retrieveRelevantLaws(query: string, limit = 8): Law[] {
  const q = query.toLowerCase();
  const scored = laws.map((l) => {
    let score = 0;
    for (const kw of l.keywords) if (q.includes(kw.toLowerCase())) score += 3;
    if (q.includes(l.title.toLowerCase())) score += 2;
    if (q.includes(l.category.toLowerCase())) score += 1;
    return { l, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.l);
}

function buildContext(matches: Law[]) {
  if (!matches.length) return "No specific sections matched. Use general Indian legal knowledge cautiously.";
  return matches
    .map(
      (l) =>
        `Section ${l.section} — ${l.title} (${l.category})\n${l.description ?? ""}\nRecommended: ${l.recommended_action ?? "N/A"}`,
    )
    .join("\n\n");
}

const SYSTEM = `${guardrail}

You are JusticeLink AI. Format EVERY legal response in clean markdown with these exact section headings:

## Issue Category
## Relevant Laws / Sections
## Explanation
## Evidence Required
## Recommended Action
## Disclaimer

Use bullet points inside sections. Cite the section numbers from the retrieved context. If the user's message is not related to Indian law, reply EXACTLY: "I can only assist with legal and law-related queries."`;

async function callGateway(messages: Array<{ role: "system" | "user" | "assistant"; content: string }>) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);
  const { text } = await generateText({
    model: gateway("google/gemini-3-flash-preview"),
    messages,
  });
  return text;
}

export const askLegalAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().min(1).max(5000),
            }),
          )
          .min(1)
          .max(30),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
    const context = lastUser ? buildContext(retrieveRelevantLaws(lastUser.content)) : "";
    const text = await callGateway([
      { role: "system", content: SYSTEM },
      { role: "system", content: `Retrieved legal context:\n\n${context}` },
      ...data.messages,
    ]);
    return { text };
  });

export const generateFIR = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        incident: z.string().min(10).max(4000),
        complainant: z.string().max(200).optional(),
        location: z.string().max(200).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const matches = retrieveRelevantLaws(data.incident, 5);
    const templates = JSON.stringify(firTemplates);
    const prompt = `You are drafting a First Information Report (FIR) for Indian police.

Templates for reference: ${templates}

Retrieved relevant sections:
${buildContext(matches)}

Incident description: ${data.incident}
Complainant: ${data.complainant ?? "(unspecified)"}
Location: ${data.location ?? "(unspecified)"}

Draft a formal FIR letter in this exact structure (markdown, no code fences):

To,
The Station House Officer,
[Police Station Name],
[City, State].

Subject: FIR regarding <short subject>

Respected Sir/Madam,

<3-5 paragraph narrative describing the incident chronologically, with specific facts>

The above act appears to attract the following provisions:
- <Section — Title>
- <Section — Title>

I request you to kindly register an FIR and initiate investigation.

Thanking you,
[Complainant Name]
[Contact Number]
[Date]`;
    const text = await callGateway([
      { role: "system", content: "You draft formal Indian police FIR letters. Never invent sections not present in the context." },
      { role: "user", content: prompt },
    ]);
    return { text, sections: matches };
  });

export const logQuery = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ query_text: z.string().min(1).max(5000), category: z.string().max(100).optional() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("query_logs").insert({
      query_text: data.query_text,
      category: data.category ?? null,
    });
    return { ok: true };
  });
