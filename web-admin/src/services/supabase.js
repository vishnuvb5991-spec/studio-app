import { createClient } from '@supabase/supabase-js';

// These must be set in .env.production (local) or your CI/CD environment variables.
// See web-admin/.env.example for the template.
// NEVER hardcode real API keys here.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
        '[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. ' +
        'Copy web-admin/.env.example → .env.production and fill in your project credentials.'
    );
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

export default supabase;
