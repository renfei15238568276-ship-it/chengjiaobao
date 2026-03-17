import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";

export default async function AdminUsersPage() {
  const admin = getSupabaseAdmin();
  const { data: users } = await admin
    .from("users")
    .select("id, username, display_name, email, role, created_at")
    .order("created_at", { ascending: false });

  const { data: subs } = await admin.from("subscriptions").select("user_id, plan_name");

  const getSub = (userId: string) => subs?.find(s => s.user_id === userId);

  const plans = [
    { key: "personal_monthly", name: "个人版月付", price: "¥199/月", code: "personal_monthly" },
    { key: "personal_quarterly", name: "个人版季付", price: "¥599/季", code: "personal_quarterly" },
    { key: "personal_yearly", name: "个人版年付", price: "¥2999/年", code: "personal_yearly" },
    { key: "team_monthly", name: "团队版月付", price: "¥799/月", code: "team_monthly" },
    { key: "team_yearly", name: "团队版年付", price: "¥3500/年", code: "team_yearly" },
  ];

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
                
                {!sub && (
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {plans.map((plan) => (
                      <Link 
                        key={plan.key}
                        href={`/api/admin/activate?userId=${user.id}&plan=${plan.code}`}
                        style={{ flex: "1", minWidth: "100px", padding: "0.6rem 0.5rem", fontSize: "0.8rem", fontWeight: "600", color: "white", backgroundColor: "#10b981", border: "none", borderRadius: "0.5rem", cursor: "pointer", textAlign: "center", textDecoration: "none", display: "block" }}
                      >
                        {plan.price}
                      </Link>
                    ))}
                  </div>
                )}
                
                {user.role !== "admin" && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <Link 
                      href={`/api/admin/setadmin?userId=${user.id}`}
                      style={{ display: "inline-block", padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "white", backgroundColor: "#8b5cf6", border: "none", borderRadius: "0.5rem", cursor: "pointer", textAlign: "center", textDecoration: "none" }}
                    >
                      设为管理员
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
