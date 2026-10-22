import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/demo-admin")({
  head: () => ({ meta: [{ title: "Enter as Admin — DriftGuard" }, { name: "robots", content: "noindex" }] }),
  component: DemoAdmin,
});

function DemoAdmin() {
  const { bi } = useLang();
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("driftguard:role", "admin");
    navigate({ to: "/admin", replace: true });
  }, [navigate]);
  return (
    <div className="grid min-h-screen place-items-center bg-background text-muted-foreground font-mono-tech text-sm">
      {bi("Signing in as admin…", "অ্যাডমিন হিসেবে প্রবেশ করা হচ্ছে…")}
    </div>
  );
}
