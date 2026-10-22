import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { workspaceOptions } from "@/lib/workspace";
import { consoleHead } from "@/lib/route-meta";
import { ConsoleError, ConsoleLoading, ConsoleNotFound, WorkspaceUpdated, WorkspaceEmpty } from "@/components/workspace-ui";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/chat")({
  head: () => consoleHead("Log Copilot", "Analysis grounded in real workspace incidents and cleared event groups."),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceOptions()),
  pendingComponent: ConsoleLoading, errorComponent: ConsoleError, notFoundComponent: ConsoleNotFound, component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const { bi, lang } = useLang();
  const { data } = useSuspenseQuery(workspaceOptions());
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => { scroll.current?.scrollTo({ top: scroll.current.scrollHeight }); }, [messages]);

  async function send(question: string) {
    if (!question.trim() || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: question.trim() }];
    setMessages([...next, { role: "assistant", content: "" }]); setInput(""); setBusy(true); setError("");
    abort.current = new AbortController();
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-20), language: lang }), signal: abort.current.signal });
      if (!response.ok || !response.body) throw new Error(await response.text() || bi("Copilot unavailable.", "কপাইলট এখন অপ্রাপ্য।"));
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let answer = "";
      function line(value: string) {
        if (!value.startsWith("data:")) return;
        const payload = value.slice(5).trim(); if (payload === "[DONE]") return;
        try { const json = JSON.parse(payload); const delta = json.choices?.[0]?.delta?.content; if (delta) { answer += delta; setMessages([...next, { role: "assistant", content: answer }]); } } catch { /* SSE keepalive */ }
      }
      while (true) { const { value, done } = await reader.read(); buffer += decoder.decode(value, { stream: !done }); const lines = buffer.split("\n"); buffer = lines.pop() ?? ""; lines.forEach(line); if (done) { line(buffer); break; } }
      if (!answer) throw new Error(bi("No answer received. Please try again.", "কোনো উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।"));
    } catch (cause) { if (cause instanceof Error && cause.name === "AbortError") return; setError(cause instanceof Error ? cause.message : bi("Copilot unavailable.", "কপাইলট এখন অপ্রাপ্য।")); setMessages(next); }
    finally { setBusy(false); }
  }

  return <div className="space-y-4 p-4 md:p-6"><header><h1 className="text-xl font-semibold">{bi("Log Analysis Copilot", "লগ বিশ্লেষণ কপাইলট")}</h1><WorkspaceUpdated /></header><div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]"><aside className="min-w-0 border-t border-border pt-4"><h2 className="text-sm font-semibold">{bi("Workspace context", "ওয়ার্কস্পেস প্রসঙ্গ")}</h2><p className="mt-2 font-mono-tech text-[12px] text-muted-foreground">{data.incidents.length} {bi("incidents", "ইনসিডেন্ট")} · {data.verdicts.length} {bi("cleared event groups", "পরিষ্কার ইভেন্ট গ্রুপ")}</p><pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap break-words text-[11px] text-muted-foreground">{JSON.stringify({ incidents: data.incidents, verdicts: data.verdicts }, null, 2)}</pre></aside><section className="flex min-h-[550px] min-w-0 flex-col rounded-lg border border-border bg-panel/30"><div ref={scroll} className="max-h-[650px] flex-1 space-y-4 overflow-y-auto p-4">{!data.events.length && !data.incidents.length && !data.verdicts.length && <WorkspaceEmpty />}{!messages.length && <Bot className="mx-auto my-4 h-7 w-7 text-primary" />}{messages.map((message, i) => <div key={i} className={cn("whitespace-pre-wrap break-words rounded-md p-3 text-[13px]", message.role === "user" ? "ml-6 bg-primary text-primary-foreground" : "mr-6 border border-border bg-background")}><div className="mb-1 text-[10px] uppercase opacity-70">{message.role === "user" ? bi("Analyst", "বিশ্লেষক") : bi("Copilot", "কপাইলট")}</div>{message.content || <Loader2 className="h-4 w-4 animate-spin" />}</div>)}{error && <p role="alert" className="text-sm text-critical">{error}</p>}</div><form onSubmit={(event) => { event.preventDefault(); send(input); }} className="flex items-end gap-2 border-t border-border p-3"><textarea aria-label={bi("Question for copilot", "কপাইলটের জন্য প্রশ্ন")} value={input} onChange={(event) => setInput(event.target.value)} rows={2} placeholder={bi("Ask about incidents or cleared event groups…", "ইনসিডেন্ট বা পরিষ্কার ইভেন্ট গ্রুপ নিয়ে জিজ্ঞাসা করুন…")} className="min-w-0 flex-1 resize-none rounded-md border border-border bg-background p-2 text-sm" /><Button disabled={busy || !input.trim()} type="submit" size="icon" title={bi("Send question", "প্রশ্ন পাঠান")} aria-label={bi("Send question", "প্রশ্ন পাঠান")}>{busy ? <Loader2 className="animate-spin" /> : <Send />}</Button></form></section></div></div>;
}
