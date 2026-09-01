import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zgkzblmellqqphjvtzaa.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3pibG1lbGxxcXBoanZ0emFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMjg2NTgsImV4cCI6MjEwMzgwNDY1OH0.B2RjyURoI7abXTpHKSFpn7TIZGXxyawyZDv-BafXA2Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

export default supabase;
