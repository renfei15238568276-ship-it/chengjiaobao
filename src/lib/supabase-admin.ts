import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gdzdwwwagueplbignhxy.supabase.co";
  
  // Use service role key directly (hardcoded for Vercel deployment)
  const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemR3d3dhZ3VlcGxiaWduaHh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMxNDUwOSwiZXhwIjoyMDg4ODkwNTA5fQ.zNbc23CEjpdE1-oS2PAVDuVghCOeEyT4F_qa4vjNX8M";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase not configured");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
