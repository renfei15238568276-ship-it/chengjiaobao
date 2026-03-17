"use client";

import { useState } from "react";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const wechatId = "r18974670134";

  const copyWechat = () => {
    navigator.clipboard.writeText(wechatId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-400/12 to-blue-500/5 p-8 lg:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">成交宝 / 联系开通</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">付款后联系我开通</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 lg:text-lg">
            请把付款截图、姓名、手机号、微信号和购买套餐发给我，我会尽快为你完成开通。当前版本先走人工审核，保证不漏单、不误开。
          </p>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-cyan-300">联系方式</p>
            <h2 className="mt-2 text-2xl font-semibold">加我微信开通</h2>
            
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-4">
              <p className="text-sm text-white/55">微信号</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xl font-medium">{wechatId}</p>
                <button 
                  onClick={copyWechat}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400"
                >
                  {copied ? "已复制 ✓" : "复制"}
                </button>
              </div>
            </div>
            
            <p className="mt-4 text-sm leading-7 text-white/70">
              复制微信后，打开微信添加好友。付款后把截图和开通信息发给我，我会尽快核对并处理。
            </p>
            
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm leading-7 text-emerald-200">
              📱 复制微信 → 打开微信 → 添加朋友 → 粘贴 → 发送付款截图
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-cyan-300">请按下面格式发我</p>
            <h2 className="mt-2 text-2xl font-semibold">开通信息模板</h2>
            <ul className="mt-6 grid gap-3 text-sm leading-7 text-white/75">
              <li className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">1. 姓名 / 昵称</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">2. 手机号</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">3. 微信号</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">4. 购买套餐</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">5. 付款金额</li>
              <li className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">6. 付款截图</li>
            </ul>
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm leading-7 text-emerald-200">
              正常情况下，付款并提交信息后 5~30 分钟内完成开通。如遇高峰时段可能会稍慢一点，耐心等我一下。
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/pay" className="rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">
                返回付款页
              </a>
              <a href="/" className="rounded-full border border-white/15 px-5 py-3 text-white/80 transition hover:border-white/35 hover:text-white">
                返回首页
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
