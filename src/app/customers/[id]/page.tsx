import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { getCustomerById } from "@/lib/customer-service";
import { DeleteCustomerButton } from "@/app/customers/delete-button";
import { FollowUpForm } from "./follow-up-form";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">客户不存在</p>
          <Link href="/customers" className="mt-4 inline-flex rounded-full bg-cyan-500 px-4 py-2 text-white">返回客户列表</Link>
        </div>
      </main>
    );
  }

  return (
    <ProtectedShell>
      <AppShell
      eyebrow="成交宝 / 客户详情"
      title={customer.name}
      description={`${customer.company} · ${customer.stage} · 负责人 ${customer.owner}`}
      actions={
        <>
          <Link href="/customers" className="rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:border-white/35 hover:text-white">返回列表</Link>
          <Link href={`/customers/${customer.id}/edit`} className="rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:border-white/35 hover:text-white">编辑客户</Link>
          <Link href="/ai" className="rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950">AI 生成跟进话术</Link>
        </>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-cyan-700">客户画像</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Info label="来源" value={customer.source} />
                  <Info label="下次跟进" value={customer.nextFollowUp} />
                  <Info label="成交概率" value={`${customer.probability}%`} />
                  <Info label="预计金额" value={customer.estimatedAmount} />
                </div>
              </div>
              <DeleteCustomerButton id={customer.id} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {customer.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-cyan-50 px-3 py-1.5 text-sm text-cyan-700">{tag}</span>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{customer.note}</div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-sm text-cyan-300">AI 推荐动作</p>
            <h2 className="mt-2 text-2xl font-semibold">下一步建议</h2>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/85">
              先围绕当前阶段解释价值，再给客户一个明确的下一步动作，不要只问“您考虑得怎么样了”。
            </div>
            <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-cyan-100">
              推荐话术：我把您现在最关心的点单独整理了一下，您看完直接回我一个想法，我这边再按您的情况给您收一版更合适的方案。
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-700">新增跟进</p>
                <h2 className="text-2xl font-semibold">把最新进展记下来</h2>
              </div>
            </div>
            <FollowUpForm customerId={customer.id} />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-700">跟进记录</p>
                <h2 className="text-2xl font-semibold">时间线</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {customer.followUps.map((record) => (
                <div key={`${record.id}-${record.content}`} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{record.type}</span>
                    <span>{record.at}</span>
                  </div>
                  <p className="mt-3 leading-7 text-slate-700">{record.content}</p>
                </div>
              ))}
            </div>
          </div>

          {customer.aiHistory?.length ? (
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-cyan-700">AI 生成历史</p>
              <h2 className="text-2xl font-semibold">已保存的话术</h2>
              <div className="mt-6 space-y-4">
                {customer.aiHistory.map((record) => (
                  <div key={`${record.id}-${record.at}`} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{record.type}</span>
                      <span>{record.at}</span>
                    </div>
                    <p className="mt-3 leading-7 text-slate-700">{record.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
      </AppShell>
    </ProtectedShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
