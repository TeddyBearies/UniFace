import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./config";

export function createClient() {
  const { supabaseUrl, supabasePublishableKey } = getSupabasePublicEnv();

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
