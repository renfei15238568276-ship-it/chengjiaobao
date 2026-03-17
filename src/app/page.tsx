"use client";

import { useState } from "react";

export default function Home() {
  const [showWechat, setShowWechat] = useState(false);
  const wechatId = "r18974670134";

  const copyWechat = () => {
    navigator.clipboard.writeText(wechatId);
    setShowWechat(true);
    setTimeout(() => setShowWechat(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* Floating Contact Button */}
      <button
        onClick={copyWechat}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 font-medium text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 hover:scale-105"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.49c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/>
        </svg>
        {showWechat ? "已复制 ✨" : "联系我们"}
      </button>

      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xl font-bold">成交宝</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm text-white/70 hover:text-white">登录</a>
            <a href="/register" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400">免费注册</a>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
            成交宝
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            面向销售、老板和门店的客户管理、AI 话术生成、提醒和成交看板系统
          </p>
          <div className="mt-8 flex gap-4">
            <a href="/register" className="rounded-full bg-emerald-500 px-8 py-3 text-lg font-medium text-white hover:bg-emerald-400">
              立即免费试用
            </a>
            <a href="/login" className="rounded-full border border-white/20 px-8 py-3 text-lg font-medium text-white hover:bg-white/10">
              登录
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">客户管理</h3>
            <p className="mt-2 text-white/60">统一沉淀所有客户数据，不再散在微信和表格里</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">AI 成交助手</h3>
            <p className="mt-2 text-white/60">AI 自动生成销售话术，智能跟进提醒</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">成交看板</h3>
            <p className="mt-2 text-white/60">可视化销售数据，实时掌握业绩情况</p>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/50">© 2026 成交宝. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">客服微信：</span>
            <button 
              onClick={copyWechat}
              className="text-sm font-medium text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              {wechatId}
            </button>
            {showWechat && <span className="text-xs text-emerald-400">✓ 已复制</span>}
          </div>
        </div>
      </footer>
    </main>
  );
}
