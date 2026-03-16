import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export default async function AdminUsersPage() {
  const session = await getCurrentSession();
  
  if (session?.role !== "admin") {
    redirect("/dashboard");
  }

  const admin = getSupabaseAdmin();
  const { data: users } = await admin
    .from("users")
    .select("id, username, display_name, email, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">用户管理</h1>
      <p className="text-gray-500">共 {users?.length || 0} 个用户</p>
      <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
