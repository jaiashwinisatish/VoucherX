import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const FALLBACK_SUPABASE_URL = 'https://example.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'public-anon-key';

const resolvedSupabaseUrl = supabaseUrl || FALLBACK_SUPABASE_URL;
const resolvedSupabaseAnonKey = supabaseAnonKey || FALLBACK_SUPABASE_ANON_KEY;

const missingConfig = !supabaseUrl || !supabaseAnonKey;

const isPlaceholderUrl = resolvedSupabaseUrl.includes('example.supabase.co');
const isPlaceholderKey = resolvedSupabaseAnonKey === 'public-anon-key';

export const hasInvalidSupabaseConfig = missingConfig || isPlaceholderUrl || isPlaceholderKey;

export const supabase = createClient(resolvedSupabaseUrl, resolvedSupabaseAnonKey);
