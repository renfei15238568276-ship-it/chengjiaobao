import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { readPaymentApplications } from "@/lib/payment-store";
import { activateMembership, updatePaymentStatus } from "@/app/pay/review-actions";

const planLabel = {
  personal: "个人版",
  team: "团队版",
  private: "私有部署版",
};

const payMethodLabel = {
  wechat: "微信",
  alipay: "支付宝",
};

const statusLabel = {
  pending: "待处理",
  approved: "已开通",
  rejected: "有问题",
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export default async function PaymentsPage() {
  const items = await readPaymentApplications();
  const stats = {
    total: items.length,
    pending: items.filter((item) => item.status === "pending").length,
    approved: items.filter((item) => item.status === "approved").length,
    rejected: items.filter((item) => item.status === "rejected").length,
  };

  return (
    <ProtectedShell>
      <AppShell
        eyebrow="成交宝 / 收款审核"
        title="付款申请审核台"
        description="先把收款、登记、审核、开通这条链路跑起来。当前阶段是人工审核，够你先卖第一批。"
      >
        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["全部申请", String(stats.total)],
            ["待处理", String(stats.pending)],
            ["已开通", String(stats.approved)],
            ["有问题", String(stats.rejected)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5">
            <p className="text-sm text-cyan-700">审核列表</p>
            <h2 className="text-2xl font-semibold">付款申请记录</h2>
          </div>

          {!items.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-500">
              还没有付款申请。等用户从 /pay 提交后，这里就会开始有数据。
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-900">{item.name}</h3>
                        <span className={`rounded-full border px-3 py-1 text-sm ${statusStyles[item.status]}`}>{statusLabel[item.status]}</span>
                      </div>
                      <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-3">
                        <p>手机号：{item.phone}</p>
                        <p>微信号：{item.wechat}</p>
                        <p>套餐：{planLabel[item.plan]}</p>
                        <p>支付方式：{payMethodLabel[item.payMethod]}</p>
                        <p>金额：{item.amount}</p>
                        <p>付款时间：{item.paidAt}</p>
                      </div>
                      {item.screenshotNote ? <p className="text-sm text-slate-500">截图说明：{item.screenshotNote}</p> : null}
                      {item.note ? <p className="text-sm text-slate-500">备注：{item.note}</p> : null}
                      <p className="text-xs text-slate-400">提交时间：{new Date(item.createdAt).toLocaleString("zh-CN")}</p>
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-[220px]">
                      <form action={updatePaymentStatus} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4">
                        <input type="hidden" name="id" value={item.id} />
                        <label className="text-sm text-slate-600">审核状态</label>
                        <select name="status" defaultValue={item.status} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
                          <option value="pending">待处理</option>
                          <option value="approved">已开通</option>
                          <option value="rejected">有问题</option>
                        </select>
                        <button className="rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                          保存状态
                        </button>
                      </form>

                      <form action={activateMembership} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <input type="hidden" name="id" value={item.id} />
                        <p className="text-sm text-emerald-700">确认收款无误后，直接给用户开通会员。</p>
                        <button className="mt-3 w-full rounded-full bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-600">
                          一键开通会员
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </AppShell>
    </ProtectedShell>
  );
}
