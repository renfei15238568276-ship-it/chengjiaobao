import { getSupabaseAdmin } from "@/lib/supabase-admin";
import AdminUsersClient from "./client";

export default async function AdminUsersPage() {
  const admin = getSupabaseAdmin();
  const { data: users } = await admin
    .from("users")
    .select("id, username, display_name, email, role, created_at")
    .order("created_at", { ascending: false });

  const { data: subs } = await admin.from("subscriptions").select("user_id, plan_name");

  return <AdminUsersClient usersData={users || []} subsData={subs || []} />;
}
