import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Provide a valid URL fallback so missing build-time env vars do NOT crash the bundle
// during public landing page rendering.
const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  rawUrl !== 'https://placeholder.supabase.co'
)

const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co'
const supabaseAnonKey = isSupabaseConfigured ? rawKey : 'placeholder-anon-key'

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
