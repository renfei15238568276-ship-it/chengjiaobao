import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export default async function AdminUsersPage() {
  const admin = getSupabaseAdmin();
  const { data: users } = await admin
    .from("users")
    .select("id, username, display_name, email, role, created_at")
    .order("created_at", { ascending: false });

  const { data: subs } = await admin.from("subscriptions").select("user_id, plan_name, expires_at");

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

  const getSub = (userId: string) => subs?.find(s => s.user_id === userId);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>用户管理</h1>
        <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>共 {users?.length || 0} 个用户</p>
        
        <div style={{ marginTop: "2rem", overflow: "hidden", borderRadius: "0.75rem", backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>用户</th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>邮箱</th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>套餐</th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>角色</th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>注册时间</th>
                <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>操作</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: "1px solid #e5e7eb" }}>
              {users?.map((user: any) => {
                const sub = getSub(user.id);
                return (
                  <tr key={user.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ fontWeight: "500", color: "#111827" }}>{user.display_name || user.username}</div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>{user.username}</div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "#6b7280" }}>{user.email || "-"}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      {sub ? (
                        <span style={{ display: "inline-flex", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "600", backgroundColor: "#d1fae5", color: "#065f46" }}>
                          {sub.plan_name} (¥199)
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af", fontSize: "0.875rem" }}>未开通</span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ display: "inline-flex", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "600", backgroundColor: user.role === "admin" ? "#ede9fe" : "#f3f4f6", color: user.role === "admin" ? "#7c3aed" : "#374151" }}>
                        {user.role === "admin" ? "管理员" : "用户"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "#6b7280" }}>
                      {new Date(user.created_at).toLocaleDateString("zh-CN")}
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <form action={createSubscription}>
                          <input type="hidden" name="userId" value={user.id} />
                          <button style={{ borderRadius: "0.25rem", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: "500", color: "white", backgroundColor: "#10b981", border: "none", cursor: "pointer" }}>
                            开通个人版 ¥199
                          </button>
                        </form>
                        {user.role !== "admin" && (
                          <form action={setAdmin}>
                            <input type="hidden" name="userId" value={user.id} />
                            <button style={{ borderRadius: "0.25rem", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: "500", color: "white", backgroundColor: "#8b5cf6", border: "none", cursor: "pointer" }}>
                              设为管理员
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
