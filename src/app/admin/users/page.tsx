import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export default async function AdminUsersPage() {
  const admin = getSupabaseAdmin();
  const { data: users } = await admin
    .from("users")
    .select("id, username, display_name, email, role, created_at")
    .order("created_at", { ascending: false });

  async function createSubscription(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const admin = getSupabaseAdmin();
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    
    await admin.from("subscriptions").upsert({
      user_id: userId,
      plan_code: "personal",
      plan_name: "个人版",
      status: "active",
      starts_at: now,
      expires_at: expires,
    }, { onConflict: "user_id" });
  }

  async function setAdmin(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const admin = getSupabaseAdmin();
    await admin.from("users").update({ role: "admin" }).eq("id", userId);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">用户管理</h1>
        <p className="mt-2 text-gray-500">共 {users?.length || 0} 个用户</p>
        
        <div className="mt-8 overflow-hidden rounded-xl bg-white shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users?.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.display_name || user.username}</div>
                    <div className="text-sm text-gray-500">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                      {user.role === "admin" ? "管理员" : "用户"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <form action={createSubscription}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600">
                          开通个人版
                        </button>
                      </form>
                      {user.role !== "admin" && (
                        <form action={setAdmin}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button className="rounded bg-purple-500 px-3 py-1 text-xs text-white hover:bg-purple-600">
                          设为管理员
                        </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
