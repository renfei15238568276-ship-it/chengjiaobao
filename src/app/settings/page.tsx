import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { getCurrentSession } from "@/lib/auth";
import { getCurrentUserSubscription } from "@/lib/subscription-service";
import { ChangePasswordForm } from "./change-password-form";

const subscriptionStatusLabel = {
  pending: "待开通",
  active: "已开通",
  expired: "已过期",
  cancelled: "已取消",
};

export default async function SettingsPage() {
  const [session, subscription] = await Promise.all([getCurrentSession(), getCurrentUserSubscription()]);

  const envSummary = [
    ["当前登录用户", session?.username ?? "未识别"],
    ["当前角色", session?.role ?? "未识别"],
    ["OpenRouter Base URL", process.env.OPENROUTER_BASE_URL || "未配置"],
    ["OpenRouter Model", process.env.OPENROUTER_MODEL || "未配置"],
    ["AI Key 状态", process.env.OPENROUTER_API_KEY ? "已配置" : "未配置"],
  ];

  return (
    <ProtectedShell>
      <AppShell
        eyebrow="成交宝 / 设置"
        title="账户与系统设置"
        description="这一步先把当前用户是谁、套餐状态是什么显示清楚。后面再接管理员开通和到期限制。"
      >
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-cyan-700">当前账户</p>
            <h2 className="mt-2 text-2xl font-semibold">套餐状态</h2>
            {subscription ? (
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">当前用户</p>
                  <p className="mt-1 font-medium text-slate-900">{session?.username}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">当前套餐</p>
                  <p className="mt-1 font-medium text-slate-900">{subscription.planName}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">开通状态</p>
                  <p className="mt-1 font-medium text-slate-900">{subscriptionStatusLabel[subscription.status]}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">开始时间</p>
                  <p className="mt-1 font-medium text-slate-900">{subscription.startsAt ? new Date(subscription.startsAt).toLocaleString("zh-CN") : "未设置"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">到期时间</p>
                  <p className="mt-1 font-medium text-slate-900">{subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleString("zh-CN") : "未设置"}</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                当前账号还没有套餐记录。下一步我会继续把“管理员开通用户套餐”接上。
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-cyan-700">当前环境</p>
            <h2 className="mt-2 text-2xl font-semibold">运行配置摘要</h2>
            <div className="mt-6 space-y-3">
              {envSummary.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-1 font-medium text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-cyan-700">账户安全</p>
            <h2 className="mt-2 text-2xl font-semibold">修改密码</h2>
            <div className="mt-6">
              <ChangePasswordForm />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-cyan-700">下一步规划</p>
            <h2 className="mt-2 text-2xl font-semibold">套餐系统 checklist</h2>
            <ul className="mt-6 space-y-3 text-slate-700">
              <li className="rounded-2xl bg-slate-50 px-4 py-3">1. 收款审核通过后直接写 subscriptions</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">2. 已过期用户限制 AI / 高级功能</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">3. 补月费 / 年费续费入口</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">4. 后面再补忘记密码 / 重置密码</li>
            </ul>
          </div>
        </section>
      </AppShell>
    </ProtectedShell>
  );
}
