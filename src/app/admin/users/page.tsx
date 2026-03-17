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
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "1rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>用户管理</h1>
        <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>共 {users?.length || 0} 个用户</p>
        
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {users?.map((user: any) => {
            const sub = getSub(user.id);
            return (
              <div key={user.id} style={{ backgroundColor: "white", borderRadius: "0.75rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: "600", color: "#111827" }}>{user.display_name || user.username}</div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>{user.email || "无邮箱"}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "600", backgroundColor: user.role === "admin" ? "#ede9fe" : "#f3f4f6", color: user.role === "admin" ? "#7c3aed" : "#374151" }}>
                      {user.role === "admin" ? "管理员" : "用户"}
                    </span>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "600", backgroundColor: sub ? "#d1fae5" : "#f3f4f6", color: sub ? "#065f46" : "#9ca3af" }}>
                      {sub ? sub.plan_name : "未开通"}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <form action={createSubscription} style={{ flex: "1", minWidth: "120px" }}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button style={{ width: "100%", padding: "0.75rem", fontSize: "1rem", fontWeight: "600", color: "white", backgroundColor: "#10b981", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>
                      开通 ¥199
                    </button>
                  </form>
                  {user.role !== "admin" && (
                    <form action={setAdmin} style={{ flex: "1", minWidth: "120px" }}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button style={{ width: "100%", padding: "0.75rem", fontSize: "1rem", fontWeight: "600", color: "white", backgroundColor: "#8b5cf6", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>
                        设为管理员
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
