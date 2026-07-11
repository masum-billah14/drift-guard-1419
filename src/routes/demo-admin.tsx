import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/demo-admin")({
  head: () => ({ meta: [{ title: "Enter as Admin — SecureAI" }, { name: "robots", content: "noindex" }] }),
  component: DemoAdmin,
});

function DemoAdmin() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("secureai:role", "admin");
    navigate({ to: "/admin", replace: true });
  }, [navigate]);
  return (
    <div className="grid min-h-screen place-items-center bg-background text-muted-foreground font-mono-tech text-sm">
      Signing in as admin…
    </div>
  );
}
