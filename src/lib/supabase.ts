import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project configuration for EduHub
const DEFAULT_SUPABASE_URL = 'https://slosofqdfxelmonorspt.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'sb_publishable_m_LgqoY8RX6pzxeCRLtJTw_h5heX-mx';

/**
 * Validates and normalizes the Supabase URL.
 * Ensures the value is a valid HTTP/HTTPS URL and prevents runtime app crashes
 * if the user enters a non-URL value (e.g. project name, ID, or invalid text).
 */
function resolveSupabaseUrl(): string {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string || '').trim();
  if (!envUrl) {
    return DEFAULT_SUPABASE_URL;
  }

  // 1. Direct valid HTTP or HTTPS URL check
  try {
    const parsed = new URL(envUrl);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return envUrl;
    }
  } catch {
    // envUrl is not a standard full URL
  }

  // 2. Check if user entered domain without protocol (e.g. slosofqdfxelmonorspt.supabase.co)
  if (envUrl.includes('.supabase.co')) {
    const withProtocol = `https://${envUrl.replace(/^https?:\/\//, '')}`;
    try {
      new URL(withProtocol);
      return withProtocol;
    } catch {
      // invalid URL format
    }
  }

  // 3. Check if user entered just the project reference code (alphanumeric, e.g. slosofqdfxelmonorspt)
  if (/^[a-z0-9_-]{15,30}$/i.test(envUrl)) {
    const projectUrl = `https://${envUrl}.supabase.co`;
    try {
      new URL(projectUrl);
      return projectUrl;
    } catch {
      // invalid
    }
  }

  // If the provided environment variable is invalid (e.g. a name, roll number, or non-URL string),
  // safely fall back to the project default so the app does not crash with Uncaught Error: Invalid supabaseUrl
  console.warn(
    `[Supabase] The provided VITE_SUPABASE_URL "${envUrl}" is not a valid HTTP/HTTPS URL. Using default: ${DEFAULT_SUPABASE_URL}`
  );
  return DEFAULT_SUPABASE_URL;
}

/**
 * Validates and normalizes the Supabase Anon Key.
 * Supports standard JWT keys as well as new Supabase sb_publishable_* format keys.
 */
function resolveSupabaseAnonKey(): string {
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string || '').trim();
  if (!envKey) {
    return DEFAULT_SUPABASE_ANON_KEY;
  }

  // Support both new publishable keys (sb_publishable_...) and legacy JWTs (header.payload.sig)
  if (envKey.startsWith('sb_publishable_') || (envKey.length >= 20 && envKey.includes('.'))) {
    return envKey;
  }

  // If key is clearly invalid
  if (envKey.length < 15) {
    console.warn(
      `[Supabase] The provided VITE_SUPABASE_ANON_KEY does not appear to be a valid Supabase key. Using default.`
    );
    return DEFAULT_SUPABASE_ANON_KEY;
  }

  return envKey;
}

const supabaseUrl = resolveSupabaseUrl();
const supabaseAnonKey = resolveSupabaseAnonKey();

let client: SupabaseClient;
try {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} catch (err) {
  console.error('[Supabase] Failed to initialize Supabase client with resolved URL, falling back:', err);
  client = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = client;
export { supabaseUrl, supabaseAnonKey };

