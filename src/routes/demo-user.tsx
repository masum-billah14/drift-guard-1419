import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/demo-user")({
  head: () => ({ meta: [{ title: "Enter as Analyst — SecureAI" }, { name: "robots", content: "noindex" }] }),
  component: DemoUser,
});

function DemoUser() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("secureai:role", "analyst");
    navigate({ to: "/app", replace: true });
  }, [navigate]);
  return (
    <div className="grid min-h-screen place-items-center bg-background text-muted-foreground font-mono-tech text-sm">
      Signing in as analyst…
    </div>
  );
}
