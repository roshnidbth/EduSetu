// supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://pqavjmnzlyummwbjrwak.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxYXZqbW56bHl1bW13Ympyd2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NzkwOTAsImV4cCI6MjA3NTU1NTA5MH0.9dCT5brlb09oycIG5lQSk_4PNCannRmC5v-Klc9rQwg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
