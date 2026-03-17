import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ activated?: string; admin?: string; deleted?: string }> }) {
  const params = await searchParams;
  
  // Auto-refresh after any action
  if (params.activated || params.admin || params.deleted) {
    redirect("/admin/users");
  }

  const admin = getSupabaseAdmin();
  const { data: users } = await admin
    .from("users")
    .select("id, username, display_name, email, role, created_at")
    .order("created_at", { ascending: false });

  const { data: subs } = await admin.from("subscriptions").select("user_id, plan_name");

  const getSub = (userId: string) => subs?.find(s => s.user_id === userId);

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui" }}>
      <h1>用户管理 ({users?.length}人)</h1>
      {users?.map((user: any) => {
        const sub = getSub(user.id);
        return (
          <div key={user.id} style={{ border: "1px solid #ddd", margin: "10px 0", padding: "10px", borderRadius: "8px" }}>
            <div><strong>{user.display_name || user.username}</strong> ({user.email || "无邮箱"})</div>
            <div>角色: {user.role === "admin" ? "✅管理员" : "用户"} | 套餐: {sub ? sub.plan_name : "❌未开通"}</div>
            
            {!sub && (
              <div style={{ marginTop: "10px" }}>
                <p>开通套餐：</p>
                <form method="GET" action="/api/admin/activate" style={{ display: "inline" }}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button name="plan" value="personal_monthly" style={{ background: "#10b981", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px", margin: "2px" }}>个人月付¥199</button>
                  <button name="plan" value="personal_quarterly" style={{ background: "#10b981", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px", margin: "2px" }}>个人季付¥599</button>
                  <button name="plan" value="personal_yearly" style={{ background: "#10b981", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px", margin: "2px" }}>个人年付¥2999</button>
                  <button name="plan" value="team_monthly" style={{ background: "#3b82f6", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px", margin: "2px" }}>团队月付¥799</button>
                  <button name="plan" value="team_yearly" style={{ background: "#3b82f6", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px", margin: "2px" }}>团队年付¥3500</button>
                </form>
              </div>
            )}
            
            {user.role !== "admin" && (
              <div style={{ marginTop: "10px" }}>
                <form method="GET" action="/api/admin/setadmin" style={{ display: "inline" }}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button style={{ background: "#8b5cf6", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px" }}>设为管理员</button>
                </form>
              </div>
            )}
            
            <div style={{ marginTop: "10px" }}>
              <form method="GET" action="/api/admin/delete" style={{ display: "inline" }}>
                <input type="hidden" name="userId" value={user.id} />
                <button style={{ background: "#ef4444", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px" }}>删除用户</button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
