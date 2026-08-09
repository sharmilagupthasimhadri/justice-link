import { createFileRoute, useNavigate, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import {
  Send, Plus, Mic, MicOff, Trash2, MessageSquare, ScrollText, Sparkles,
} from "lucide-react";
import { askLegalAssistant, logQuery } from "@/lib/legal.functions";
import { nanoid } from "@/lib/nanoid";

export const Route = createFileRoute("/assistant/$threadId")({ component: AssistantThread });

type ThreadMeta = { id: string; title: string; updatedAt: number };
type Msg = { role: "user" | "assistant"; content: string; ts: number };

const CATEGORIES = [
  "Cyber Crime", "Women Safety", "Property Crime", "Violent Crime",
  "Public Order", "Documents & Fraud", "Consumer Issues", "Employment Issues", "Family Law",
];

function loadThreads(): ThreadMeta[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("jl_threads") ?? "[]");
  } catch { return []; }
}
function saveThreads(t: ThreadMeta[]) { localStorage.setItem("jl_threads", JSON.stringify(t)); }
function loadMessages(id: string): Msg[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(`jl_thread_${id}`) ?? "[]"); } catch { return []; }
}
function saveMessages(id: string, m: Msg[]) { localStorage.setItem(`jl_thread_${id}`, JSON.stringify(m)); }

function AssistantThread() {
  const { threadId } = useParams({ from: "/assistant/$threadId" });
  const navigate = useNavigate();
  const ask = useServerFn(askLegalAssistant);
  const log = useServerFn(logQuery);

  const [threads, setThreads] = useState<ThreadMeta[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<any>(null);

  // Initial load per thread
  useEffect(() => {
    setThreads(loadThreads());
    setMessages(loadMessages(threadId));
    inputRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const currentTitle = useMemo(
    () => threads.find((t) => t.id === threadId)?.title ?? "New Chat",
    [threads, threadId],
  );

  function persistMessages(id: string, next: Msg[]) {
    saveMessages(id, next);
    setMessages(next);
    // Update thread meta / title
    setThreads((cur) => {
      const existing = cur.find((t) => t.id === id);
      const firstUser = next.find((m) => m.role === "user");
      const title = firstUser ? firstUser.content.slice(0, 60) : "New Chat";
      const now = Date.now();
      const updated: ThreadMeta[] = existing
        ? cur.map((t) => (t.id === id ? { ...t, title, updatedAt: now } : t))
        : [...cur, { id, title, updatedAt: now }];
      saveThreads(updated);
      return updated;
    });
  }

  function newThread() {
    const id = nanoid();
    const meta: ThreadMeta = { id, title: "New Chat", updatedAt: Date.now() };
    const next = [meta, ...threads];
    saveThreads(next);
    setThreads(next);
    saveMessages(id, []);
    navigate({ to: "/assistant/$threadId", params: { threadId: id } });
  }

  function deleteThread(id: string) {
    const remaining = threads.filter((t) => t.id !== id);
    saveThreads(remaining);
    setThreads(remaining);
    localStorage.removeItem(`jl_thread_${id}`);
    if (id === threadId) {
      if (remaining[0]) navigate({ to: "/assistant/$threadId", params: { threadId: remaining[0].id } });
      else navigate({ to: "/assistant" });
    }
  }

  async function send(e?: FormEvent, override?: string) {
    e?.preventDefault();
    const text = (override ?? input).trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text, ts: Date.now() };
    const next = [...messages, userMsg];
    persistMessages(threadId, next);
    setLoading(true);
    try {
      const history = next.map((m) => ({ role: m.role, content: m.content }));
      const [res] = await Promise.all([
        ask({ data: { messages: history } }),
        log({ data: { query_text: text } }).catch(() => null),
      ]);
      const asst: Msg = { role: "assistant", content: res.text, ts: Date.now() };
      persistMessages(threadId, [...next, asst]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      persistMessages(threadId, [...next, {
        role: "assistant", ts: Date.now(),
        content: `**Error:** ${msg}\n\nPlease try again in a moment.`,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function toggleVoice() {
    if (typeof window === "undefined") return;
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { toast.error("Voice input not supported in this browser"); return; }
    if (listening && recogRef.current) { recogRef.current.stop(); return; }
    const r = new SR();
    r.lang = "en-IN"; r.interimResults = false; r.continuous = false;
    r.onresult = (e: any) => setInput((prev) => (prev ? prev + " " : "") + e.results[0][0].transcript);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    recogRef.current = r;
    setListening(true);
  }

  return (
    <div className="mx-auto max-w-7xl px-2 md:px-4 py-4 grid gap-4 md:grid-cols-[280px_1fr] min-h-[calc(100vh-5rem)]">
      {/* SIDEBAR */}
      <aside className="glass rounded-2xl p-4 flex flex-col gap-4 md:sticky md:top-20 md:h-[calc(100vh-6rem)]">
        <button
          onClick={newThread}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition gold-glow"
        >
          <Plus className="h-4 w-4" /> New Chat
        </button>

        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">Previous Queries</div>
          <div className="space-y-1 overflow-y-auto max-h-64 md:max-h-none md:flex-1">
            {threads.length === 0 && <div className="text-xs text-muted-foreground px-2 py-4">No conversations yet.</div>}
            {threads.sort((a, b) => b.updatedAt - a.updatedAt).map((t) => (
              <div key={t.id} className={`group flex items-center gap-1 rounded-lg text-sm transition ${t.id === threadId ? "bg-gold/10 text-gold" : "hover:bg-white/5"}`}>
                <button
                  onClick={() => navigate({ to: "/assistant/$threadId", params: { threadId: t.id } })}
                  className="flex-1 text-left px-3 py-2 truncate"
                  title={t.title}
                >
                  <MessageSquare className="inline h-3.5 w-3.5 mr-2 opacity-60" />
                  {t.title}
                </button>
                <button
                  onClick={() => deleteThread(t.id)}
                  className="p-2 opacity-0 group-hover:opacity-60 hover:opacity-100 text-destructive"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">Categories</div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => send(undefined, `I have a legal question related to ${c}. Please guide me on relevant Indian legal provisions.`)}
                className="text-[11px] rounded-full glass px-2.5 py-1 hover:border-gold/40 hover:text-gold transition"
              >{c}</button>
            ))}
          </div>
        </div>

        <Link to="/" className="text-xs text-muted-foreground hover:text-gold mt-auto">← Home</Link>
      </aside>

      {/* CHAT */}
      <section className="glass rounded-2xl flex flex-col h-[calc(100vh-6rem)]">
        <header className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-gold" />
          <div className="text-sm font-medium truncate">{currentTitle}</div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl glass-gold gold-glow mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-gold" />
              </div>
              <h2 className="font-display text-2xl font-bold">How can JusticeLink help?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Describe your legal issue in plain language. I'll return the applicable sections,
                evidence needed, and next steps under Indian law.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2 text-left">
                {[
                  "Someone hacked my bank account and withdrew ₹50,000.",
                  "My employer hasn't paid my salary for 3 months.",
                  "I'm receiving harassing WhatsApp messages every night.",
                  "A shopkeeper sold me a defective phone and refuses to refund.",
                ].map((s) => (
                  <button key={s} onClick={() => send(undefined, s)} className="glass rounded-xl p-3 text-sm text-left hover:border-gold/40 hover:text-gold transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <MessageBubble key={i} m={m} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-gold animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-gold animate-bounce [animation-delay:0.15s]" />
                <span className="h-2 w-2 rounded-full bg-gold animate-bounce [animation-delay:0.3s]" />
              </div>
              Analyzing legal context…
            </div>
          )}
        </div>

        <form onSubmit={send} className="border-t border-white/5 p-3 md:p-4">
          <div className="glass rounded-2xl p-2 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) send(e as any); }}
              placeholder="Describe your legal issue..."
              rows={1}
              className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none resize-none max-h-40"
              disabled={loading}
            />
            <button
              type="button"
              onClick={toggleVoice}
              className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl border border-white/10 transition ${listening ? "bg-destructive/20 text-destructive border-destructive/40" : "hover:bg-white/5 text-muted-foreground"}`}
              aria-label="Voice input"
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-10 px-4 shrink-0 flex items-center gap-2 rounded-xl bg-gold text-primary-foreground text-sm font-semibold hover:brightness-110 disabled:opacity-40 transition"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground text-center">
            JusticeLink provides informational guidance only. Not a substitute for professional legal advice.
          </p>
        </form>
      </section>
    </div>
  );
}

function MessageBubble({ m }: { m: Msg }) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-2xl rounded-2xl bg-gold text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap shadow-lg">
          {m.content}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-3xl">
      <div className="text-[10px] uppercase tracking-widest text-gold/80 mb-1.5">JusticeLink AI</div>
      <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:text-gold prose-h2:text-base prose-h2:mt-4 prose-h2:mb-1.5 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-1 prose-strong:text-foreground prose-a:text-gold">
        <ReactMarkdown>{m.content}</ReactMarkdown>
      </div>
    </div>
  );
}
