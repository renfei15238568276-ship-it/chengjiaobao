import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { getCurrentSession } from "@/lib/auth";
import { getDashboardHighlights, listCustomers } from "@/lib/customer-service";
import { formatRemainingTime, getCurrentUserSubscription, hasActiveSubscription } from "@/lib/subscription-service";

const todo = [
  "补逾期客户的跟进记录",
  "给高价值客户批量生成晚间私聊话术",
  "检查本周渠道转化最低的来源",
  "准备团队周报和成交复盘",
];

const stageColors: Record<string, string> = {
  新线索: "bg-gradient-to-r from-sky-400 to-sky-500",
  已联系: "bg-gradient-to-r from-indigo-400 to-indigo-500",
  意向中: "bg-gradient-to-r from-cyan-400 to-cyan-500",
  报价中: "bg-gradient-to-r from-amber-400 to-amber-500",
  谈判中: "bg-gradient-to-r from-orange-400 to-orange-500",
  待成交: "bg-gradient-to-r from-violet-400 to-violet-500",
  已成交: "bg-gradient-to-r from-emerald-400 to-emerald-500",
  已流失: "bg-gradient-to-r from-rose-400 to-rose-500",
};

export default async function DashboardPage() {
  const active = await hasActiveSubscription();

  const [session, subscription, summary, customers] = await Promise.all([
    getCurrentSession(),
    getCurrentUserSubscription(),
    getDashboardHighlights(),
    listCustomers(),
  ]);

  const funnelMap = customers.reduce<Record<string, number>>((acc, item) => {
    acc[item.stage] = (acc[item.stage] ?? 0) + 1;
    return acc;
  }, {});

  const funnel = Object.entries(funnelMap).map(([stage, count]) => ({
    stage,
    count,
    color: stageColors[stage] ?? "bg-slate-400",
  }));

  const hotCustomers = [...customers]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5)
    .map((item) => ({
      name: `${item.name} · ${item.company}`,
      stage: item.stage,
      next: item.nextFollowUp,
      owner: item.owner,
      ai: item.aiHistory?.[0]?.content ? "✅ 已生成" : "🤖 待生成",
    }));

  const showPayments = session?.role === "admin";

  if (!active) {
    return (
      <ProtectedShell>
        <AppShell
          eyebrow="成交宝 / 控制台"
          title="客户跟进驾驶舱"
          description="数据实时更新，成交情况一目了然。"
        >
          <div className="flex flex-col items-center justify-center rounded-3xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-12 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">请先开通套餐</h2>
            <p className="mt-2 max-w-md text-amber-700">当前账号还未开通套餐，联系管理员开通后可使用完整功能。</p>
            <a href="/contact" className="mt-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 font-medium text-white shadow-lg shadow-amber-500/25 transition hover:scale-105 hover:shadow-xl">联系管理员</a>
          </div>
        </AppShell>
      </ProtectedShell>
    );
  }

  return (
    <ProtectedShell>
      <AppShell
      eyebrow="成交宝 / 控制台"
      title="客户跟进驾驶舱"
      description="数据实时更新，成交情况一目了然。"
      actions={
        <>
          <Link href="/" className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-white/80 backdrop-blur transition hover:bg-white/10 hover:border-white/30">🏠 返回官网</Link>
          <Link href="/customers/new" className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 font-medium text-white shadow-lg shadow-cyan-500/25 transition hover:scale-105 hover:shadow-xl">+ 新建客户</Link>
        </>
      }
    >
      {/* Subscription Banner */}
      {session?.role === "admin" ? (
        <section className="mb-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-4 text-emerald-400 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">👑</span>
            <span className="font-medium">当前是管理员账号，可直接进入用户开通和收款审核后台。</span>
          </div>
        </section>
      ) : subscription?.planCode === "trial" && subscription.expiresAt && subscription.status === "active" ? (
        <section className="mb-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 text-amber-400 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">⏰</span>
            <span className="font-medium">当前为试用版，剩余 <span className="text-amber-300">{formatRemainingTime(subscription.expiresAt)}</span>。试用到期后，核心功能将受限，请尽快去付款开通。</span>
          </div>
        </section>
      ) : subscription?.status === "active" ? (
        <section className="mb-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-4 text-emerald-400 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">✓</span>
            <span className="font-medium">当前套餐：<span className="text-emerald-300">{subscription.planName}</span> · 到期时间 {subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString("zh-CN") : "永久"}</span>
          </div>
        </section>
      ) : (
        <section className="mb-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 text-amber-400 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">!</span>
            <span className="font-medium">当前账号未开通套餐，请先前往付款开通页完成开通。</span>
          </div>
        </section>
      )}

      {/* Stats Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["全部客户", String(summary.totalCustomers), "📊 当前系统里的有效客户数", "from-blue-500 to-cyan-500"],
          ["高意向客户", String(summary.hotCount), "🔥 成交概率 ≥ 70%", "from-orange-500 to-red-500"],
          ["今晚待跟进", String(summary.urgentCount), "⚡ 优先今晚联系", "from-purple-500 to-pink-500"],
          ["预计总金额", `¥${summary.totalEstimated.toLocaleString("zh-CN")}`, "💰 按客户录入金额汇总", "from-emerald-500 to-teal-500"],
        ].map(([label, value, hint, gradient]) => (
          <div key={label} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">
            <div className={`absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br ${gradient} opacity-10`} />
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 bg-gradient-to-r bg-clip-text text-4xl font-bold text-slate-800">{value}</p>
            <p className="mt-2 text-sm text-slate-400">{hint}</p>
          </div>
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Sales Funnel */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
          <div className="absolute right-0 top-0 h-32 w-32 translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 opacity-50" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600">销售漏斗</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800">客户阶段分布</h2>
              </div>
              <span className="rounded-full bg-gradient-to-r from-emerald-100 to-green-100 px-4 py-1.5 text-sm font-medium text-emerald-600">
                高意向占比 {summary.totalCustomers ? Math.round((summary.hotCount / summary.totalCustomers) * 100) : 0}%
              </span>
            </div>
            <div className="mt-8 space-y-5">
              {funnel.map((item) => (
                <div key={item.stage}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">{item.stage}</span>
                    <span className="font-semibold text-slate-800">{item.count} 人</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-2.5 rounded-full ${item.color} transition-all duration-500`} style={{ width: `${Math.min((item.count / Math.max(summary.totalCustomers, 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-lg ring-1 ring-slate-700">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20" />
          <div className="relative">
            <p className="text-sm font-medium text-cyan-400">🤖 AI 今日建议</p>
            <h2 className="mt-1 text-2xl font-bold text-white">优先处理这 4 件事</h2>
            <ul className="mt-6 space-y-3">
              {todo.map((item, i) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-white/90 backdrop-blur">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">{i + 1}</span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Links & Hot Customers */}
      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Quick Links */}
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
          <p className="text-sm font-medium text-cyan-600">快捷入口</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">业务模块</h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ["👥", "/customers", "客户列表", "管理所有客户"],
              ["➕", "/customers/new", "录入客户", "添加新客户"],
              ["🤖", "/ai", "AI 助手", "生成成交话术"],
              ["💰", "/payments", "收款审核", "查看付款记录"],
            ].map(([icon, href, title, desc]) => (
              <Link key={href} href={href} className="group flex flex-col rounded-xl border border-slate-100 p-4 transition hover:border-cyan-200 hover:bg-cyan-50">
                <span className="text-2xl">{icon}</span>
                <span className="mt-2 font-semibold text-slate-800 group-hover:text-cyan-600">{title}</span>
                <span className="text-xs text-slate-400">{desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Hot Customers */}
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-600">重点客户</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">当前最值得盯住的人</h2>
            </div>
            <Link href="/customers" className="text-sm font-medium text-cyan-500 transition hover:text-cyan-600">查看全部 →</Link>
          </div>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-100">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600">客户</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">阶段</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {hotCustomers.length > 0 ? hotCustomers.map((customer) => (
                  <tr key={customer.name} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{customer.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{customer.stage}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{customer.ai}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-400">暂无客户数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppShell>
  </ProtectedShell>
  );
}
