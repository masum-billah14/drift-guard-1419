import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

export function DocShell({
  title,
  subtitle,
  eyebrow,
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <AppShell hideSidebar>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <header className="mb-8">
          {eyebrow && (
            <div className="mb-2 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </div>
          )}
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {subtitle}
            </p>
          )}
        </header>
        {children}
      </div>
    </AppShell>
  );
}
