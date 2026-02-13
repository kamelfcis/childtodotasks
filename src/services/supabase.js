import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cqqoasacdvzeqwfkkvck.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcW9hc2FjZHZ6ZXF3ZmtrdmNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODk2OTgsImV4cCI6MjA4NjU2NTY5OH0.-eYGQCcSIS_x7A7fSi_dJZOaQdo7VWeO3hxVgOxwyh0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

