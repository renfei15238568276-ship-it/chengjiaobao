import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { isAdminSession } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription-service";
import { listUsers } from "@/lib/user-service";
import { grantSubscriptionAction } from "./actions";

const statusLabel = {
  pending: "待开通",
  active: "已开通",
  expired: "已过期",
  cancelled: "已取消",
};

const planOptions = [
  { value: "personal_monthly", label: "个人版月付 / 30天" },
  { value: "personal_yearly", label: "个人版年付 / 365天" },
  { value: "team_monthly", label: "团队版月付 / 30天" },
  { value: "team_yearly", label: "团队版年付 / 365天" },
  { value: "private_custom", label: "私有部署版 / 365天" },
];

export default async function AdminUsersPage() {
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    redirect("/dashboard");
  }

  const users = await listUsers();
  const subscriptions = await Promise.all(users.map((user) => getUserSubscription(user.id)));

  return (
    <ProtectedShell>
      <AppShell
        eyebrow="成交宝 / 管理员"
        title="用户与套餐开通"
        description="这一步先把管理员给指定用户开通套餐跑起来。后面再把收款审核联动到这里。"
      >
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5">
            <p className="text-sm text-cyan-700">用户列表</p>
            <h2 className="text-2xl font-semibold">给用户开通套餐</h2>
          </div>

          <div className="space-y-4">
            {users.map((user, index) => {
              const subscription = subscriptions[index];
              return (
                <div key={user.id} className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-900">{user.displayName}</h3>
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">@{user.username}</span>
                        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm text-cyan-700">{user.role}</span>
                      </div>
                      <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                        <p>用户状态：{user.status}</p>
                        <p>注册时间：{user.createdAt ? new Date(user.createdAt).toLocaleString("zh-CN") : "未知"}</p>
                      </div>
                      {subscription ? (
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          当前套餐：{subscription.planName} · {statusLabel[subscription.status]} · 到期 {subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleString("zh-CN") : "未设置"}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
                          当前还没有套餐记录。
                        </div>
                      )}
                    </div>

                    <form action={grantSubscriptionAction} className="flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-slate-50 p-4">
                      <input type="hidden" name="userId" value={user.id} />
                      <label className="text-sm text-slate-600">开通套餐</label>
                      <select name="planCode" defaultValue="personal_yearly" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
                        {planOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <button className="rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                        立即开通
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </AppShell>
    </ProtectedShell>
  );
}
