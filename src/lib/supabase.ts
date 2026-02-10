import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const isPlaceholderUrl = supabaseUrl.includes('example.supabase.co');
const isPlaceholderKey = supabaseAnonKey === 'public-anon-key';

export const hasInvalidSupabaseConfig = isPlaceholderUrl || isPlaceholderKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
