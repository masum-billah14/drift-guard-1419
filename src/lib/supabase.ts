import { createClient } from "@supabase/supabase-js";

// Public configuration: anonymous access is restricted by the existing view policies.
const url = "https://rbmdjypyjzozvgvhnyps.supabase.co";
const publicKey = "sb_publishable_8YDJ66YDxIHxJfmyyr86Sg_oKiqwJb5";

export function createReadClient() {
  return createClient(url, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        // Publishable keys are opaque, not JWT bearer tokens. Always read as anon.
        headers.delete("Authorization");
        headers.set("apikey", publicKey);
        const method = (init?.method ?? "GET").toUpperCase();
        if (method !== "GET" && method !== "HEAD") throw new Error("Workspace access is read-only.");
        return fetch(input, { ...init, headers });
      },
    },
  });
}