import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { nanoid } from "@/lib/nanoid";

export const Route = createFileRoute("/assistant/")({ component: AssistantIndex });

function AssistantIndex() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("jl_threads");
    const threads: Array<{ id: string; updatedAt: number }> = raw ? JSON.parse(raw) : [];
    if (threads.length > 0) {
      const latest = [...threads].sort((a, b) => b.updatedAt - a.updatedAt)[0];
      navigate({ to: "/assistant/$threadId", params: { threadId: latest.id }, replace: true });
    } else {
      const id = nanoid();
      const now = Date.now();
      localStorage.setItem("jl_threads", JSON.stringify([{ id, title: "New Chat", updatedAt: now }]));
      localStorage.setItem(`jl_thread_${id}`, JSON.stringify([]));
      navigate({ to: "/assistant/$threadId", params: { threadId: id }, replace: true });
    }
    setReady(true);
  }, [navigate]);
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground text-sm">
      {ready ? "Loading…" : (<Link to="/" className="text-gold">Loading assistant…</Link>)}
    </div>
  );
}
