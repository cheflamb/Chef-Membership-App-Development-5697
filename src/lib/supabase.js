import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://htuggbwptckrmlhbrvng.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dWdnYndwdGNrcm1saGJydm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjM3ODEsImV4cCI6MjA2NjI5OTc4MX0.Eas8YE6gxRM1QBC40D8P3SbpZiMNe6m5DjlTRM6MjLo'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})