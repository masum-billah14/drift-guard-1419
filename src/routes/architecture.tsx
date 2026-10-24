import { createFileRoute } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";
import { Activity, Bot, Database, Zap, Cpu, ShieldCheck, BookOpen } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture — DriftGuard" },
      { name: "description", content: "How DriftGuard turns raw events into explainable AI-driven response." },
      { property: "og:title", content: "DriftGuard Architecture" },
      { property: "og:description", content: "Event → embedding → vector lookup → LLM reasoning → response." },
    ],
  }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  const { bi } = useLang();
  return (
    <DocShell
      title={bi("System architecture", "সিস্টেম আর্কিটেকচার")}
      subtitle={bi(
        "Every event flows through the same five stages. Each stage is inspectable, testable, and swappable.",
        "প্রতিটি ইভেন্ট একই ধাপগুলোর মধ্য দিয়ে যায়। প্রতিটি ধাপ পর্যবেক্ষণযোগ্য, পরীক্ষাযোগ্য এবং বদলানো-সম্ভব।",
      )}
    >
      <PipelineDiagram />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Layer icon={Activity} title={bi("1. Event ingestion", "১. ইভেন্ট ইনজেশন")} tech="Fluent Bit · Kafka · webhooks">
          {bi(
            "Cloud logs (AWS CloudTrail, GCP Audit), auth events (Okta, Azure AD), network telemetry (WAF, NetFlow), and application logs. Normalized into a common event envelope.",
            "ক্লাউড লগ (AWS CloudTrail, GCP Audit), অথ ইভেন্ট (Okta, Azure AD), নেটওয়ার্ক টেলিমেট্রি (WAF, NetFlow) এবং অ্যাপ্লিকেশন লগ। একটি সাধারণ ইভেন্ট এনভেলপে রূপান্তরিত।",
          )}
        </Layer>
        <Layer icon={Cpu} title={bi("2. Embedding", "২. এমবেডিং")} tech="text-embedding-3-large · sentence-transformers fallback">
          {bi(
            "Each event is embedded together with entity context (user, asset, time-of-day baseline). Embeddings are compact enough to store 30 days hot.",
            "প্রতিটি ইভেন্ট এন্টিটি প্রসঙ্গসহ (ইউজার, সম্পদ, সময়ের বেসলাইন) এমবেড করা হয়। এমবেডিং যথেষ্ট ছোট, 30 দিন হট স্টোরে রাখা যায়।",
          )}
        </Layer>
        <Layer icon={Database} title={bi("3. Vector retrieval", "৩. ভেক্টর রিট্রিভাল")} tech="pgvector · HNSW index">
          {bi(
            "The Investigator agent retrieves the top-k most similar past incidents and their human-labelled resolutions. This grounds the LLM's reasoning in your history.",
            "ইনভেস্টিগেটর এজেন্ট সবচেয়ে মিলিয়ে যাওয়া পুরোনো ইনসিডেন্ট ও তাদের মানব-লেবেলযুক্ত সমাধান খুঁজে আনে। এতে LLM-এর যুক্তি আপনার ইতিহাসে প্রতিষ্ঠিত হয়।",
          )}
        </Layer>
        <Layer icon={BookOpen} title={bi("4. RAG assembly", "৪. RAG সমাবেশ")} tech="context builder · MITRE ATT&CK · runbooks · threat intel">
          {bi(
            "Retrieved incidents are fused with authoritative context — MITRE ATT&CK techniques, your internal runbooks, CVE feeds, and asset ownership — into a compact, cited prompt. Every fact the LLM sees carries a source it can quote in its reasoning.",
            "খুঁজে পাওয়া ইনসিডেন্টগুলো নির্ভরযোগ্য প্রসঙ্গের সাথে একত্র হয় — MITRE ATT&CK কৌশল, আপনার অভ্যন্তরীণ রানবুক, CVE ফিড এবং সম্পদের মালিকানা — সংক্ষিপ্ত, উৎস-উল্লেখসহ প্রম্পটে। LLM যে প্রতিটি তথ্য দেখে, সেটির একটি উৎস থাকে যা তার যুক্তিতে উদ্ধৃত করতে পারে।",
          )}
        </Layer>
        <Layer icon={Bot} title={bi("5. LLM reasoning", "৫. LLM যুক্তি")} tech="Gemini 2.5 · Claude Sonnet 4.5 (fallback)">
          {bi(
            "A structured prompt asks: what happened, why it looks anomalous vs baseline, similar past cases, and a recommended action with confidence. Output is JSON-schema-validated.",
            "একটি স্ট্রাকচার্ড প্রম্পট জিজ্ঞাসা করে: কী ঘটেছে, বেসলাইনের তুলনায় কেন অস্বাভাবিক, অনুরূপ পুরোনো ঘটনা এবং আস্থাসহ প্রস্তাবিত পদক্ষেপ। আউটপুট JSON স্কিমা দিয়ে যাচাই করা হয়।",
          )}
        </Layer>
        <Layer icon={Zap} title={bi("6. Response", "৬. প্রতিক্রিয়া")} tech="Policy engine · webhooks · SOAR">
          {bi(
            "The Responder agent executes contained actions (block IP, revoke session, isolate pod) based on per-org policy, or escalates to a human with the full reasoning trail.",
            "রেসপন্ডার এজেন্ট সংস্থার নীতি অনুযায়ী নিয়ন্ত্রিত পদক্ষেপ (IP ব্লক, সেশন বাতিল, পড আইসোলেট) নেয়, অথবা সম্পূর্ণ যুক্তির ট্রেইলসহ মানুষের কাছে এস্কেলেট করে।",
          )}
        </Layer>
        <Layer icon={ShieldCheck} title={bi("Governance", "গভর্নেন্স")} tech="Audit log · human-in-the-loop">
          {bi(
            "Every agent action is signed and logged. Auto-response is opt-in per severity and per action type. Humans always see the reasoning before approving irreversible actions.",
            "প্রতিটি এজেন্ট পদক্ষেপ স্বাক্ষরিত ও লগ করা হয়। তীব্রতা ও পদক্ষেপের ধরন অনুযায়ী অটো-রেসপন্স চালু করতে হয়। অপরিবর্তনীয় পদক্ষেপ অনুমোদনের আগে মানুষ সবসময় যুক্তি দেখে।",
          )}
        </Layer>
      </div>

      <section className="mt-10 rounded-lg border border-border bg-panel p-5">
        <h2 className="text-sm font-semibold">{bi("Stack summary", "স্ট্যাক সারসংক্ষেপ")}</h2>
        <div className="mt-3 grid gap-1.5 text-[12.5px] font-mono-tech text-muted-foreground sm:grid-cols-2">
          <div>· {bi("Frontend — TanStack Start · React · Tailwind", "ফ্রন্টএন্ড — TanStack Start · React · Tailwind")}</div>
          <div>· {bi("Backend — Node · TypeScript · Kafka", "ব্যাকএন্ড — Node · TypeScript · Kafka")}</div>
          <div>· {bi("LLMs — Gemini 2.5 primary, Claude 4.5 fallback", "LLM — Gemini 2.5 প্রধান, Claude 4.5 ফলব্যাক")}</div>
          <div>· {bi("Vector DB — Postgres + pgvector (HNSW)", "ভেক্টর ডিবি — Postgres + pgvector (HNSW)")}</div>
          <div>· {bi("Object storage — S3-compatible (region-pinned)", "অবজেক্ট স্টোরেজ — S3-সামঞ্জস্যপূর্ণ (রিজিয়ন-পিনড)")}</div>
          <div>· {bi("Deploy — Cloudflare Workers edge · region eu-central-1", "ডিপ্লয় — Cloudflare Workers edge · রিজিয়ন eu-central-1")}</div>
        </div>
      </section>
    </DocShell>
  );
}

function PipelineDiagram() {
  const { bi } = useLang();
  const nodes = [
    { label: bi("Event source", "ইভেন্ট সোর্স"), sub: "logs · auth · net" },
    { label: bi("Embedding", "এমবেডিং"), sub: bi("vectorize context", "প্রসঙ্গ ভেক্টরাইজ") },
    { label: bi("Vector DB", "ভেক্টর ডিবি"), sub: bi("similar incidents", "অনুরূপ ইনসিডেন্ট") },
    { label: bi("RAG assembly", "RAG সমাবেশ"), sub: "MITRE · runbooks · CVE" },
    { label: bi("LLM reasoning", "LLM যুক্তি"), sub: bi("why · confidence", "কেন · আস্থা") },
    { label: bi("Response", "প্রতিক্রিয়া"), sub: bi("act or escalate", "পদক্ষেপ বা এস্কেলেশন") },
  ];
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-panel p-6">
      <div className="flex min-w-[720px] items-stretch gap-3">
        {nodes.map((n, i) => (
          <div key={String(n.label)} className="flex flex-1 items-center gap-3">
            <div className="flex-1 rounded-md border border-border bg-background p-4 text-center">
              <div className="text-[10px] font-mono-tech uppercase tracking-wider text-muted-foreground">
                {bi("stage", "ধাপ")} {i + 1}
              </div>
              <div className="mt-1 text-sm font-semibold">{n.label}</div>
              <div className="mt-1 text-[11px] font-mono-tech text-muted-foreground">{n.sub}</div>
            </div>
            {i < nodes.length - 1 && (
              <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0 text-primary">
                <path d="M4 10 H16 M12 6 L16 10 L12 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-md border border-primary/30 bg-primary/5 p-3 text-[11.5px] text-muted-foreground">
        <span className="rounded-sm bg-primary/20 px-1.5 py-0.5 font-mono-tech text-[10px] text-primary">FEEDBACK</span>
        {bi("Human resolutions are re-embedded and stored — the system learns from every incident.", "মানুষের সমাধান পুনরায় এমবেড ও সংরক্ষণ করা হয় — প্রতিটি ইনসিডেন্ট থেকে সিস্টেম শেখে।")}
      </div>
    </div>
  );
}

function Layer({
  icon: Icon,
  title,
  tech,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tech: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="mt-1 text-[11px] font-mono-tech text-muted-foreground">{tech}</div>
      <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">{children}</p>
    </div>
  );
}
