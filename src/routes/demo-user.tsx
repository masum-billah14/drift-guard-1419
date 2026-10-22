import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/demo-user")({
  head: () => ({ meta: [{ title: "Enter as Analyst — DriftGuard" }, { name: "robots", content: "noindex" }] }),
  component: DemoUser,
});

function DemoUser() {
  const { bi } = useLang();
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("driftguard:role", "analyst");
    navigate({ to: "/app", replace: true });
  }, [navigate]);
  return (
    <div className="grid min-h-screen place-items-center bg-background text-muted-foreground font-mono-tech text-sm">
      {bi("Signing in as analyst…", "বিশ্লেষক হিসেবে প্রবেশ করা হচ্ছে…")}
    </div>
  );
}
