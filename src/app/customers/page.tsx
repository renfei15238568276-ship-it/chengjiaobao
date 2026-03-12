import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { listCustomers } from "@/lib/customer-service";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: Promise<{ created?: string; q?: string; stage?: string }>;
}) {
  const customers = await listCustomers();
  const params = await searchParams;
  const created = params?.created;
  const q = (params?.q ?? "").trim();
  const stage = (params?.stage ?? "全部").trim();

  const filtered = customers.filter((customer) => {
    const matchesQ =
      !q ||
      customer.name.includes(q) ||
      customer.company.includes(q) ||
      customer.source.includes(q) ||
      customer.contactHandle.includes(q);

    const matchesStage = stage === "全部" || customer.stage === stage;
    return matchesQ && matchesStage;
  });

  const totalEstimated = filtered.reduce((sum, item) => {
    const normalized = Number(item.estimatedAmount.replace(/[¥,]/g, ""));
    return sum + normalized;
  }, 0);

  const stageTabs = ["全部", "新线索", "已联系", "意向中", "报价中", "谈判中", "待成交", "已成交", "已流失"];

  return (
    <ProtectedShell>
      <AppShell
      eyebrow="成交宝 / 客户管理"
      title="客户列表"
      description="现在已经是可搜索、可筛选、可编辑、可导出的客户页了。"
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

      <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 p-5">
          <form className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2 text-sm">
              {stageTabs.map((tab) => (
                <button
                  key={tab}
                  type="submit"
                  name="stage"
                  value={tab}
                  className={`rounded-full border px-4 py-2 transition ${stage === tab ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                >
                  {tab}
                </button>
              ))}
              {q ? <input type="hidden" name="q" value={q} /> : null}
            </div>
            <div className="flex gap-3">
              <input
                name="q"
                defaultValue={q}
                placeholder="搜客户名 / 公司 / 来源 / 联系方式"
                className="w-full min-w-[260px] rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-cyan-500"
              />
              {stage !== "全部" ? <input type="hidden" name="stage" value={stage} /> : null}
              <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">搜索</button>
            </div>
          </form>
        </div>

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
            没搜到结果，换个关键词或者把阶段切回“全部”。
          </div>
        ) : null}
      </section>
      </AppShell>
    </ProtectedShell>
  );
}
