"use client";

import { useActionState } from "react";
import { initialState, submitPaymentApplication } from "./actions";

export function PaymentForm() {
  const [state, formAction, pending] = useActionState(submitPaymentApplication, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <h3 className="text-2xl font-semibold text-white">付款后提交开通信息</h3>
        <p className="mt-2 text-sm leading-6 text-white/65">
          先扫码付款，再把下面信息填好。当前版本先走人工审核开通，正常 5~30 分钟内处理。
        </p>
      </div>

      <label className="grid gap-2 text-sm text-white/80">
        联系人姓名
        <input name="name" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="怎么称呼你" />
      </label>

      <label className="grid gap-2 text-sm text-white/80">
        手机号
        <input name="phone" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="用于开通确认" />
      </label>

      <label className="grid gap-2 text-sm text-white/80">
        微信号
        <input name="wechat" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="方便联系你" />
      </label>

      <label className="grid gap-2 text-sm text-white/80">
        购买套餐
        <select name="plan" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none">
          <option value="personal">个人版 ¥59/月</option>
          <option value="team">团队版 ¥399/月</option>
          <option value="private">私有部署版 ¥2999起</option>
        </select>
      </label>

      <label className="grid gap-2 text-sm text-white/80">
        支付方式
        <select name="payMethod" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none">
          <option value="wechat">微信</option>
          <option value="alipay">支付宝</option>
        </select>
      </label>

      <label className="grid gap-2 text-sm text-white/80">
        实付金额
        <input name="amount" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="比如 59 / 399 / 2999" />
      </label>

      <label className="grid gap-2 text-sm text-white/80">
        付款时间
        <input name="paidAt" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="例如 2026-03-12 13:20" />
      </label>

      <label className="grid gap-2 text-sm text-white/80">
        付款截图说明
        <input name="screenshotNote" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="先填：已付款，可后续补上传功能" />
      </label>

      <label className="grid gap-2 text-sm text-white/80 md:col-span-2">
        备注
        <textarea name="note" rows={4} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="比如你的行业、需求、付款备注等" />
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "提交中..." : "我已付款，提交开通申请"}
        </button>
        {state.message ? (
          <p className={`mt-4 text-sm ${state.success ? "text-emerald-300" : "text-rose-300"}`}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
