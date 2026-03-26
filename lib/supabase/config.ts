const SUPABASE_URL_ENV = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_PUBLISHABLE_ENV = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";
const SUPABASE_ANON_ENV = "NEXT_PUBLIC_SUPABASE_ANON_KEY";
const SUPABASE_SECRET_ENV = "SUPABASE_SECRET_KEY";
const SUPABASE_SERVICE_ROLE_ENV = "SUPABASE_SERVICE_ROLE_KEY";

function readEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    return "";
  }

  return value.trim();
}

function getSupabasePublicKey() {
  return readEnv(SUPABASE_PUBLISHABLE_ENV) || readEnv(SUPABASE_ANON_ENV);
}

function getSupabaseSecretKey() {
  return readEnv(SUPABASE_SECRET_ENV) || readEnv(SUPABASE_SERVICE_ROLE_ENV);
}

export function hasSupabasePublicEnv() {
  return Boolean(readEnv(SUPABASE_URL_ENV) && getSupabasePublicKey());
}

export function getSupabasePublicEnv() {
  const supabaseUrl = readEnv(SUPABASE_URL_ENV);
  const supabasePublishableKey = getSupabasePublicKey();

  if (!supabaseUrl) {
    throw new Error(
      `Missing ${SUPABASE_URL_ENV}. Add it to your .env.local file before using Supabase.`,
    );
  }

  if (!supabasePublishableKey) {
    throw new Error(
      `Missing ${SUPABASE_PUBLISHABLE_ENV}. You can also use ${SUPABASE_ANON_ENV} as a legacy fallback.`,
    );
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
  };
}

export function getSupabaseAdminEnv() {
  const supabaseUrl = readEnv(SUPABASE_URL_ENV);
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
