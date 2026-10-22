import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, UserCog, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — DriftGuard" },
      { name: "description", content: "Sign in to the DriftGuard security operations console — analyst or admin demo." },
      { property: "og:title", content: "Sign in — DriftGuard" },
      { property: "og:description", content: "Sign in to the DriftGuard security operations console — analyst or admin demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { bi } = useLang();
  return (
    <AppShell hideSidebar>
      <div className="relative mx-auto flex min-h-[calc(100vh-110px)] max-w-4xl flex-col items-center justify-center px-6 py-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-mono-tech text-primary">
          <Sparkles className="h-3 w-3" /> {bi("demo access", "ডেমো অ্যাক্সেস")}
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {bi("Sign in to", "সাইন ইন করুন")} <span className="text-primary">DriftGuard</span>
        </h1>
        <p className="mt-3 max-w-md text-center text-sm text-muted-foreground">
          {bi("Pick a role to open the console. No password needed.", "কনসোল খুলতে একটি ভূমিকা বেছে নিন। পাসওয়ার্ড লাগবে না।")}
        </p>

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
          <Link
            to="/demo-user"
            className="group relative overflow-hidden rounded-xl border border-border bg-panel p-6 transition-all hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]"
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="text-lg font-semibold">{bi("Analyst demo", "বিশ্লেষক ডেমো")}</div>
            <div className="mt-1 text-[13px] text-muted-foreground">
              {bi("Security operations console: live incidents, AI triage, log copilot.", "সিকিউরিটি অপারেশন কনসোল: লাইভ ইনসিডেন্ট, এআই ট্রায়াজ, লগ কপাইলট।")}
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary">
              {bi("Enter as Analyst", "বিশ্লেষক হিসেবে প্রবেশ")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link
            to="/demo-admin"
            className="group relative overflow-hidden rounded-xl border border-border bg-panel p-6 transition-all hover:border-ok/50 hover:shadow-[0_0_40px_-10px_hsl(var(--ok)/0.35)]"
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-ok/15 ring-1 ring-ok/40">
              <UserCog className="h-5 w-5 text-ok" />
            </div>
            <div className="text-lg font-semibold">{bi("Admin demo", "অ্যাডমিন ডেমো")}</div>
            <div className="mt-1 text-[13px] text-muted-foreground">
              {bi("Admin panel: reporting hosts and collector status.", "অ্যাডমিন প্যানেল: রিপোর্টিং হোস্ট ও কালেক্টর স্ট্যাটাস।")}
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ok">
              {bi("Enter as Admin", "অ্যাডমিন হিসেবে প্রবেশ")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        <p className="mt-8 text-[11px] font-mono-tech text-muted-foreground">
          {bi("Live data from your connected collectors", "আপনার সংযুক্ত কালেক্টর থেকে লাইভ ডেটা")}
        </p>
      </div>
    </AppShell>
  );
}
