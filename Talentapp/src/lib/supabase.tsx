import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Extend types for better autocompletion
declare global {
  interface Window {
    supabase: ReturnType<typeof createClient>;
  }
}

if (import.meta.env.DEV) {
  window.supabase = supabase; // For debugging in browser console
}