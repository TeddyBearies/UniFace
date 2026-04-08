const SUPABASE_URL_ENV = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_PUBLISHABLE_ENV = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";
const SUPABASE_PUBLISHABLE_DEFAULT_ENV = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY";
const SUPABASE_ANON_ENV = "NEXT_PUBLIC_SUPABASE_ANON_KEY";
const SUPABASE_SECRET_ENV = "SUPABASE_SECRET_KEY";
const SUPABASE_SERVICE_ROLE_ENV = "SUPABASE_SERVICE_ROLE_KEY";

function normalizeEnv(value: string | undefined) {
  return value?.trim() || "";
}

function getSupabasePublicKey() {
  return (
    normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) ||
    normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

function getSupabaseSecretKey() {
  return (
    normalizeEnv(process.env.SUPABASE_SECRET_KEY) ||
    normalizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export function hasSupabasePublicEnv() {
  return Boolean(normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) && getSupabasePublicKey());
}

export function getSupabasePublicEnv() {
  const supabaseUrl = normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabasePublishableKey = getSupabasePublicKey();

  if (!supabaseUrl) {
    throw new Error(
      `Missing ${SUPABASE_URL_ENV}. Add it to your .env.local file before using Supabase.`,
    );
  }

  if (!supabasePublishableKey) {
    throw new Error(
      `Missing ${SUPABASE_PUBLISHABLE_ENV}. You can also use ${SUPABASE_PUBLISHABLE_DEFAULT_ENV} or ${SUPABASE_ANON_ENV} as fallbacks.`,
    );
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
  };
}

export function getSupabaseAdminEnv() {
  const supabaseUrl = normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseSecretKey = getSupabaseSecretKey();

  if (!supabaseUrl) {
    throw new Error(
      `Missing ${SUPABASE_URL_ENV}. Add it to your .env.local file before creating an admin client.`,
    );
  }

  if (!supabaseSecretKey) {
    throw new Error(
      `Missing ${SUPABASE_SECRET_ENV}. You can also use ${SUPABASE_SERVICE_ROLE_ENV} as a legacy fallback.`,
    );
  }

  return {
    supabaseUrl,
    supabaseSecretKey,
  };
}
