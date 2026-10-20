export function consoleHead(title: string, description: string) {
  return { meta: [
    { title: `${title} — DriftGuard` }, { name: "description", content: description },
    { property: "og:title", content: `${title} — DriftGuard` }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] };
}