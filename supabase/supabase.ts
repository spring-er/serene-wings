import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables:", {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
  });
}

// Create a custom fetch function that handles certificate issues in development
const customFetch = (url: string, options: any = {}) => {
  const isDevelopment = import.meta.env.DEV;

  // Enhanced headers for better compatibility
  const enhancedHeaders = {
    ...options.headers,
    "User-Agent": "Mozilla/5.0 (compatible; Supabase-Client)",
    "Cache-Control": "no-cache",
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const fetchOptions = {
    ...options,
    headers: enhancedHeaders,
    // In development, use more permissive settings
    ...(isDevelopment && {
      mode: "cors" as RequestMode,
      credentials: "omit" as RequestCredentials,
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(20000), // 20 second timeout
    }),
  };

  return fetch(url, fetchOptions).catch((error) => {
    // Enhanced error logging and handling
    const errorMessage = error.message || String(error);

    if (
      errorMessage.includes("certificate") ||
      errorMessage.includes("CERT_") ||
      errorMessage.includes("SSL") ||
      errorMessage.includes("TLS") ||
      errorMessage.includes("Failed to fetch")
    ) {
      console.warn("🔧 [Supabase] Network/Certificate issue detected:", {
        url: url.replace(/\?.*/g, ""), // Remove query params for cleaner logs
        error: errorMessage,
        isDevelopment,
        timestamp: new Date().toISOString(),
      });

      if (isDevelopment) {
        console.warn(
          "🔧 [Supabase] This is likely a development environment SSL certificate issue. In production, this should resolve automatically.",
        );
      }
    }

    // Re-throw the error with additional context
    const enhancedError = new Error(`Supabase fetch failed: ${errorMessage}`);
    enhancedError.cause = error;
    throw enhancedError;
  });
};

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
    },
    global: {
      fetch: customFetch,
    },
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
