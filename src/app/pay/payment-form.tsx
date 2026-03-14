"use client";

import { useState } from "react";

export function PaymentForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6 md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <h3 className="text-2xl font-semibold text-white">付款后提交开通信息</h3>
        <p className="mt-2 text-sm leading-6 text-white/65">
          当前 Vercel 演示版先不做在线写库提交，避免你提交时报错。先扫码付款，再把下面信息填好并截图保存，随后通过微信手动联系开通。
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
        <input name="screenshotNote" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="例如：已付款并保存截图" />
      </label>

      <label className="grid gap-2 text-sm text-white/80 md:col-span-2">
        备注
        <textarea name="note" rows={4} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" placeholder="比如你的行业、需求、付款备注等" />
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          className="rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
        >
          我已付款，查看开通说明
        </button>

        {submitted ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-4 text-sm leading-7 text-emerald-200">
            已记录你的填写内容（仅当前页面展示，不写入服务器）。请立即保存付款截图，并通过微信联系你自己的人工开通入口完成审核。当前 Vercel 演示版先保证页面可用、不报错，后续再接正式数据库或表单服务。
          </div>
        ) : null}
      </div>
    </form>
  );
}
