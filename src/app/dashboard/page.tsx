import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { getDashboardHighlights, listCustomers } from "@/lib/customer-service";
import { getLatestMembership } from "@/lib/membership-store";

const todo = [
  "补逾期客户的跟进记录",
  "给高价值客户批量生成晚间私聊话术",
  "检查本周渠道转化最低的来源",
  "准备团队周报和成交复盘",
];

const stageColors: Record<string, string> = {
  新线索: "bg-sky-400",
  已联系: "bg-indigo-400",
  意向中: "bg-cyan-400",
  报价中: "bg-amber-400",
  谈判中: "bg-orange-400",
  待成交: "bg-violet-400",
  已成交: "bg-emerald-400",
  已流失: "bg-rose-400",
};

export default async function DashboardPage() {
  const [summary, customers, latestMembership] = await Promise.all([getDashboardHighlights(), listCustomers(), getLatestMembership()]);

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
      ai: item.aiHistory?.[0]?.content ? "已有 AI 生成记录" : "建议尽快生成成交话术",
    }));

  return (
    <ProtectedShell>
      <AppShell
      eyebrow="成交宝 / 控制台"
      title="客户跟进驾驶舱"
      description="现在控制台核心数据已经从真实客户数据里计算，不再只是写死的样子货。"
      actions={
        <>
          <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:border-white/35 hover:text-white">返回官网</Link>
          <Link href="/customers/new" className="rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950">+ 新建客户</Link>
        </>
      }
    >
      {latestMembership ? (
        <section className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-sm">
          当前会员：{latestMembership.customerName} · {latestMembership.plan === "personal" ? "个人版" : latestMembership.plan === "team" ? "团队版" : "私有部署版"} · 到期时间 {new Date(latestMembership.expiresAt).toLocaleString("zh-CN")}
        </section>
      ) : (
        <section className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800 shadow-sm">
          当前还没有开通中的会员。你可以去“收款审核”页把付款申请直接开通。
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["全部客户", String(summary.totalCustomers), "当前系统里的有效客户数"],
          ["高意向客户", String(summary.hotCount), "成交概率 ≥ 70%"],
          ["今晚待跟进", String(summary.urgentCount), "优先今晚联系"],
          ["预计总金额", `¥${summary.totalEstimated.toLocaleString("zh-CN")}`, "按客户录入金额汇总"],
        ].map(([label, value, hint]) => (
          <div key={label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{hint}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-700">销售漏斗</p>
              <h2 className="text-2xl font-semibold">客户阶段分布</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
              高意向占比 {summary.totalCustomers ? Math.round((summary.hotCount / summary.totalCustomers) * 100) : 0}%
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {funnel.map((item) => (
              <div key={item.stage}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{item.stage}</span>
                  <span>{item.count} 人</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${Math.min((item.count / Math.max(summary.totalCustomers, 1)) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm text-cyan-300">AI 今日建议</p>
          <h2 className="mt-2 text-2xl font-semibold">优先处理这 4 件事</h2>
          <ul className="mt-5 space-y-3">
            {todo.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/82">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-cyan-700">快捷入口</p>
            <h2 className="text-2xl font-semibold">业务模块</h2>
          </div>
          <div className="flex gap-3 text-sm">
            <Link href="/customers" className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-50">客户列表</Link>
            <Link href="/customers/new" className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-50">录入客户</Link>
            <Link href="/ai" className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-50">AI 助手</Link>
            <Link href="/payments" className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-50">收款审核</Link>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cyan-700">重点客户</p>
            <h2 className="text-2xl font-semibold">当前最值得盯住的人</h2>
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">客户</th>
                <th className="px-4 py-3 font-medium">阶段</th>
                <th className="px-4 py-3 font-medium">下次跟进</th>
                <th className="px-4 py-3 font-medium">负责人</th>
                <th className="px-4 py-3 font-medium">AI 状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {hotCustomers.map((customer) => (
                <tr key={customer.name}>
                  <td className="px-4 py-4 font-medium text-slate-900">{customer.name}</td>
                  <td className="px-4 py-4 text-slate-600">{customer.stage}</td>
                  <td className="px-4 py-4 text-slate-600">{customer.next}</td>
                  <td className="px-4 py-4 text-slate-600">{customer.owner}</td>
                  <td className="px-4 py-4 text-slate-600">{customer.ai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </AppShell>
    </ProtectedShell>
  );
}
