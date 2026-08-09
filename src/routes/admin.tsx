import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, LogOut, Upload, BarChart3, Database, Scale } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type LogRow = { id: string; query_text: string; category: string | null; created_at: string };
type Dataset = { id: string; name: string; created_at: string };

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetName, setDatasetName] = useState("");
  const [datasetJson, setDatasetJson] = useState("");

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { navigate({ to: "/auth", replace: true }); return; }
      setUserEmail(sess.session.user.email ?? null);
      const uid = sess.session.user.id;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      const admin = (roles ?? []).some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) {
        const { data: l } = await supabase.from("query_logs").select("id, query_text, category, created_at").order("created_at", { ascending: false }).limit(100);
        setLogs((l as LogRow[]) ?? []);
        const { data: d } = await supabase.from("legal_datasets").select("id, name, created_at").order("created_at", { ascending: false });
        setDatasets((d as Dataset[]) ?? []);
      }
      setLoading(false);
    })();
  }, [navigate]);

  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/auth" }); }

  async function upload() {
    if (!datasetName.trim() || !datasetJson.trim()) { toast.error("Name and JSON required"); return; }
    let parsed: unknown;
    try { parsed = JSON.parse(datasetJson); } catch { toast.error("Invalid JSON"); return; }
    const { data: sess } = await supabase.auth.getSession();
    const { error, data } = await supabase.from("legal_datasets").insert({
      name: datasetName.trim(), data: parsed as any, uploaded_by: sess.session?.user.id,
    }).select("id, name, created_at").single();
    if (error) { toast.error(error.message); return; }
    setDatasets((d) => [data as Dataset, ...d]);
    setDatasetName(""); setDatasetJson("");
    toast.success("Dataset uploaded");
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Loading admin…</div>;
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-10 max-w-md text-center">
        <Shield className="h-10 w-10 text-gold mx-auto mb-4" />
        <h1 className="font-display text-xl font-bold">Not authorized</h1>
        <p className="text-sm text-muted-foreground mt-2">Your account ({userEmail}) doesn't have admin access.</p>
        <button onClick={signOut} className="mt-6 glass rounded-lg px-4 py-2 text-sm hover:text-gold">Sign out</button>
      </div>
    </div>
  );

  const categoryCounts = logs.reduce<Record<string, number>>((acc, l) => {
    const k = l.category ?? "Uncategorized"; acc[k] = (acc[k] ?? 0) + 1; return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-gold" />
            <span className="font-display font-bold gold-text">JusticeLink</span>
            <span className="ml-2 text-[10px] uppercase tracking-widest text-gold/70 border border-gold/30 rounded px-1.5 py-0.5">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">{userEmail}</span>
            <button onClick={signOut} className="glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 hover:text-gold"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 space-y-6">
        {/* Analytics */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-gold" />
            <h2 className="font-display text-lg font-bold">Query Analytics</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Stat label="Total queries" value={logs.length} />
            <Stat label="Unique categories" value={Object.keys(categoryCounts).length} />
            <Stat label="Latest" value={logs[0] ? new Date(logs[0].created_at).toLocaleDateString() : "—"} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Recent queries</div>
            <div className="glass rounded-xl max-h-96 overflow-y-auto divide-y divide-white/5">
              {logs.length === 0 && <div className="p-4 text-sm text-muted-foreground">No queries yet.</div>}
              {logs.map((l) => (
                <div key={l.id} className="p-3 text-sm">
                  <div className="text-foreground/90 line-clamp-2">{l.query_text}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {l.category ?? "Uncategorized"} · {new Date(l.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Datasets */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-gold" />
            <h2 className="font-display text-lg font-bold">Legal Datasets</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <input value={datasetName} onChange={(e) => setDatasetName(e.target.value)} placeholder="Dataset name (e.g. IT Act 2024)"
                className="w-full glass rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
              <textarea value={datasetJson} onChange={(e) => setDatasetJson(e.target.value)} rows={10}
                placeholder='{"laws":[{"section":"66C","title":"Identity Theft",...}]}'
                className="w-full glass rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-gold/50" />
              <button onClick={upload} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:brightness-110">
                <Upload className="h-4 w-4" /> Upload Dataset
              </button>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Uploaded datasets</div>
              <div className="glass rounded-xl divide-y divide-white/5 max-h-96 overflow-y-auto">
                {datasets.length === 0 && <div className="p-4 text-sm text-muted-foreground">None yet.</div>}
                {datasets.map((d) => (
                  <div key={d.id} className="p-3 text-sm flex items-center justify-between">
                    <div>{d.name}</div>
                    <div className="text-[10px] text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold gold-text">{value}</div>
    </div>
  );
}
