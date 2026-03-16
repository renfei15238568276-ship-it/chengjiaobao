import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gdzdwwwagueplbignhxy.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemR3d3dhZ3VlcGxiaWduaHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTQ1MDksImV4cCI6MjA4ODg5MDUwOX0.sb_publishable_2KndRHYM05SsWTLJx08-4g_tmjYPHQO";

  // Use service role key if available, otherwise use anon key
  const key = serviceRoleKey || anonKey;

  if (!supabaseUrl || !key) {
    throw new Error("Supabase not configured. Please set environment variables.");
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
