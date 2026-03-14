import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getAllUsers, updateUserRole, createSubscriptionForUser } from "./actions";

export default async function AdminUsersPage() {
  const session = await getCurrentSession();
  
  // Only admin can access
  if (session?.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">用户管理</h1>
            <p className="text-slate-500">查看和管理所有注册用户</p>
          </div>
          <a href="/settings/team" className="rounded-full bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200">返回团队设置</a>
        </div>

        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">用户</th>
                <th className="px-4 py-3 font-medium">邮箱</th>
                <th className="px-4 py-3 font-medium">角色</th>
                <th className="px-4 py-3 font-medium">注册时间</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-medium text-cyan-700">
                        {user.display_name?.[0] || user.username?.[0] || "?"}
                      </div>
                      <span className="font-medium">{user.display_name || user.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.email || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      {user.role === "admin" ? "管理员" : "普通用户"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(user.created_at).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-3">
                    <form action={async () => {
                      "use server";
                      await createSubscriptionForUser(user.id, "personal");
                    }}>
                      <button className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500">
                        开通个人版
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="p-8 text-center text-slate-500">暂无注册用户</div>
          )}
        </div>
      </div>
    </main>
  );
}
