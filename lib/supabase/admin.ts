import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminEnv } from "./config";

export function createAdminClient() {
  const { supabaseUrl, supabaseSecretKey } = getSupabaseAdminEnv();

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
