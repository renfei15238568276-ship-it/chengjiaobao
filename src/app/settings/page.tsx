import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { getLatestMembership } from "@/lib/membership-store";

const planLabel = {
  personal: "个人版",
  team: "团队版",
  private: "私有部署版",
};

const statusLabel = {
  inactive: "未开通",
  active: "已开通",
  expired: "已过期",
};

export default async function SettingsPage() {
  const latestMembership = await getLatestMembership();

  const envSummary = [
    ["管理员账号", process.env.ADMIN_USERNAME || "admin"],
    ["OpenRouter Base URL", process.env.OPENROUTER_BASE_URL || "未配置"],
    ["OpenRouter Model", process.env.OPENROUTER_MODEL || "未配置"],
    ["AI Key 状态", process.env.OPENROUTER_API_KEY ? "已配置" : "未配置"],
  ];

  return (
    <ProtectedShell>
      <AppShell
        eyebrow="成交宝 / 设置"
        title="系统设置"
        description="这是最快成品方案里的设置页：先把管理员账号和 AI 接口配置入口摆清楚。"
      >
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-cyan-700">当前会员</p>
            <h2 className="mt-2 text-2xl font-semibold">开通状态</h2>
            {latestMembership ? (
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">会员用户</p>
                  <p className="mt-1 font-medium text-slate-900">{latestMembership.customerName}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">当前套餐</p>
                  <p className="mt-1 font-medium text-slate-900">{planLabel[latestMembership.plan]}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">会员状态</p>
                  <p className="mt-1 font-medium text-slate-900">{statusLabel[latestMembership.status]}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">到期时间</p>
                  <p className="mt-1 font-medium text-slate-900">{new Date(latestMembership.expiresAt).toLocaleString("zh-CN")}</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
                还没有开通过会员。你可以先去收款审核页，把付款申请一键开通。
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

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <p className="text-sm text-cyan-700">接下来怎么变成更正式</p>
            <h2 className="mt-2 text-2xl font-semibold">成品落地 checklist</h2>
            <ul className="mt-6 space-y-3 text-slate-700">
              <li className="rounded-2xl bg-slate-50 px-4 py-3">1. 把 .env 里的管理员账号密码改掉</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">2. 填入 OPENROUTER_API_KEY，接真 AI 接口</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">3. 用 npm run build && npm run start 跑生产版</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">4. 后续补会员自动到期、续费和正式在线支付</li>
            </ul>
          </div>
        </section>
      </AppShell>
    </ProtectedShell>
  );
}
