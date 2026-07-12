import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const body = (await request.json()) as { messages?: Msg[]; logs?: string };
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) return new Response("messages required", { status: 400 });

        const system: Msg = {
          role: "system",
          content:
            "You are SecureAI's log analysis copilot for a Security Operations Console. " +
            "You help SOC analysts triage, correlate and reason over system, network, auth and application logs. " +
            "Be concise, technical, and structured. When given logs, extract: (1) suspicious events, " +
            "(2) likely MITRE ATT&CK techniques with IDs, (3) affected assets/IPs/users, " +
            "(4) severity (critical/high/medium/low) with justification, and (5) recommended next actions. " +
            "Use short markdown headings and bullet lists. If no logs are provided, answer the analyst's question directly.",
        };

        if (body.logs && body.logs.trim().length > 0) {
          const last = messages[messages.length - 1];
          if (last?.role === "user") {
            last.content = `${last.content}\n\n---\nLOG SAMPLE:\n\`\`\`\n${body.logs.slice(0, 20000)}\n\`\`\``;
          }
        }

        const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [system, ...messages],
            stream: true,
          }),
        });

        if (!resp.ok || !resp.body) {
          const text = await resp.text().catch(() => "");
          if (resp.status === 429) return new Response("Rate limited. Try again shortly.", { status: 429 });
          if (resp.status === 402) return new Response("AI credits exhausted.", { status: 402 });
          return new Response(text || "Gateway error", { status: resp.status || 500 });
        }

        return new Response(resp.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
