import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { listCustomers } from "@/lib/customer-service";

const stageTabs = ["全部", "新线索", "已联系", "意向中", "报价中", "谈判中", "待成交", "已成交", "已流失"];
const sourceTabs = ["全部", "微信", "Telegram", "转介绍", "抖音", "小红书", "线下", "其它"];

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: Promise<{ created?: string; q?: string; stage?: string; source?: string }>;
}) {
  const customers = await listCustomers();
  const params = await searchParams;
  const created = params?.created;
  const q = (params?.q ?? "").trim();
  const stage = (params?.stage ?? "全部").trim();
  const source = (params?.source ?? "全部").trim();

  const filtered = customers.filter((customer) => {
    const keyword = q.toLowerCase();
    const haystack = [customer.name, customer.company, customer.source, customer.contactHandle, customer.note, ...(customer.tags ?? [])]
      .join(" ")
      .toLowerCase();

    const matchesQ = !q || haystack.includes(keyword);
    const matchesStage = stage === "全部" || customer.stage === stage;
    const matchesSource = source === "全部" || customer.source.includes(source);

    return matchesQ && matchesStage && matchesSource;
  });

  const totalEstimated = filtered.reduce((sum, item) => {
    const normalized = Number(item.estimatedAmount.replace(/[¥,]/g, ""));
    return sum + normalized;
  }, 0);

  const stageCounts = Object.fromEntries(stageTabs.map((tab) => [tab, tab === "全部" ? customers.length : customers.filter((item) => item.stage === tab).length]));
  const sourceCounts = Object.fromEntries(sourceTabs.map((tab) => [tab, tab === "全部" ? customers.length : customers.filter((item) => item.source.includes(tab)).length]));

  return (
    <ProtectedShell>
      <AppShell
        eyebrow="成交宝 / 客户管理"
        title="客户列表"
        description="支持按关键词、客户阶段和来源筛选，已经开始像真正 CRM 的客户库了。"
        actions={
          <>
            <Link href="/dashboard" className="rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:border-white/35 hover:text-white">返回控制台</Link>
            <a href="/customers/export" className="rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:border-white/35 hover:text-white">导出 CSV</a>
            <Link href="/customers/new" className="rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950">+ 新建客户</Link>
          </>
        }
      >
        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["筛选后客户", filtered.length.toString()],
            ["高意向客户", filtered.filter((item) => item.probability >= 70).length.toString()],
            ["今晚待跟进", filtered.filter((item) => item.nextFollowUp.includes("今晚")).length.toString()],
            ["预计成交额", `¥${totalEstimated.toLocaleString("zh-CN")}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        {created ? (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-sm">
            客户「{created}」已保存，列表已经接入真实持久化数据。
          </div>
        ) : null}

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <form className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">搜索客户</span>
              <input
                name="q"
                defaultValue={q}
                placeholder="搜客户名 / 公司 / 联系方式 / 备注 / 标签"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">按阶段筛选</span>
              <select name="stage" defaultValue={stage} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500">
                {stageTabs.map((tab) => (
                  <option key={tab} value={tab}>{tab}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">按来源筛选</span>
              <select name="source" defaultValue={source} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500">
                {sourceTabs.map((tab) => (
                  <option key={tab} value={tab}>{tab}</option>
                ))}
              </select>
            </label>
            <div className="flex gap-3">
              <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">应用筛选</button>
              <Link href="/customers" className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700 transition hover:bg-slate-50">重置</Link>
            </div>
          </form>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">阶段分布</p>
              <div className="flex flex-wrap gap-2">
                {stageTabs.map((tab) => (
                  <Link
                    key={tab}
                    href={`/customers?stage=${encodeURIComponent(tab)}${source !== "全部" ? `&source=${encodeURIComponent(source)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    className={`rounded-full border px-4 py-2 text-sm transition ${stage === tab ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                  >
                    {tab} · {stageCounts[tab]}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">来源分布</p>
              <div className="flex flex-wrap gap-2">
                {sourceTabs.map((tab) => (
                  <Link
                    key={tab}
                    href={`/customers?source=${encodeURIComponent(tab)}${stage !== "全部" ? `&stage=${encodeURIComponent(stage)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    className={`rounded-full border px-4 py-2 text-sm transition ${source === tab ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                  >
                    {tab} · {sourceCounts[tab]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">客户</th>
                <th className="px-4 py-3 font-medium">阶段</th>
                <th className="px-4 py-3 font-medium">来源</th>
                <th className="px-4 py-3 font-medium">负责人</th>
                <th className="px-4 py-3 font-medium">下次跟进</th>
                <th className="px-4 py-3 font-medium">成交概率</th>
                <th className="px-4 py-3 font-medium">预计金额</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{customer.name}</p>
                      <p className="mt-1 text-slate-500">{customer.company}</p>
                      <p className="mt-1 text-xs text-slate-400">{customer.contactHandle}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {customer.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs text-cyan-700">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{customer.stage}</td>
                  <td className="px-4 py-4 text-slate-600">{customer.source}</td>
                  <td className="px-4 py-4 text-slate-600">{customer.owner}</td>
                  <td className="px-4 py-4 text-slate-600">{customer.nextFollowUp}</td>
                  <td className="px-4 py-4">
                    <div className="w-28 rounded-full bg-slate-100">
                      <div className="rounded-full bg-cyan-500 px-2 py-1 text-right text-xs font-medium text-white" style={{ width: `${customer.probability}%` }}>
                        {customer.probability}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{customer.estimatedAmount}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/customers/${customer.id}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50">查看</Link>
                      <Link href={`/customers/${customer.id}/edit`} className="rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50">编辑</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length ? (
            <div className="border-t border-slate-200 px-5 py-8 text-center text-sm text-slate-500">
              没搜到结果，换个关键词或者重置筛选试试。
            </div>
          ) : null}
        </section>
      </AppShell>
    </ProtectedShell>
  );
}
