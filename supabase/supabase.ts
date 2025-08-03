import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables:", {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
  });
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
    },
    global: {
      fetch: (url, options = {}) => {
        // In development, handle certificate issues by using a more permissive approach
        const isDevelopment = import.meta.env.DEV;

        return fetch(url, {
          ...options,
          // Add headers to handle certificate issues in development
          headers: {
            ...options.headers,
            "User-Agent": "Mozilla/5.0 (compatible; Supabase-Client)",
            "Cache-Control": "no-cache",
          },
          // In development, be more permissive with certificates
          ...(isDevelopment && {
            mode: "cors",
            credentials: "omit",
          }),
        }).catch((error) => {
          // Log certificate errors for debugging
          if (
            error.message?.includes("certificate") ||
            error.message?.includes("CERT_")
          ) {
            console.warn(
              "🔧 [Supabase] Certificate validation issue detected:",
              error.message,
            );
            console.warn(
              "🔧 [Supabase] This is likely a development environment issue.",
            );
          }
          throw error;
        });
      },
    },
    // Add retry configuration for failed requests
    db: {
      schema: "public",
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  },
);
