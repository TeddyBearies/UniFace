import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./config";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  const { supabaseUrl, supabasePublishableKey } = getSupabasePublicEnv();

  browserClient = createBrowserClient(supabaseUrl, supabasePublishableKey);

  return browserClient;
}
