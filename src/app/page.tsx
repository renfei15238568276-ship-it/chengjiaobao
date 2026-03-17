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
          <p className="mt-4 max-w-3xl text-xl text-white/70 leading-relaxed">
            让每一个销售机会都不再流失 | AI 驱动的客户成交管理系统<br/>
            帮销售快速跟进客户、生成话术、提醒跟进、成交统计
          </p>
          <div className="mt-8 flex gap-4 flex-wrap justify-center">
            <a href="/register" className="rounded-full bg-emerald-500 px-8 py-3 text-lg font-medium text-white hover:bg-emerald-400">
              立即免费试用
            </a>
            <a href="/login" className="rounded-full border border-white/20 px-8 py-3 text-lg font-medium text-white hover:bg-white/10">
              登录
            </a>
          </div>
          <p className="mt-4 text-sm text-white/50">无需下载，浏览器直接用 | 手机电脑都能访问</p>
        </div>

        {/* 核心功能 */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold mb-8">核心功能</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">客户管理</h3>
              <p className="mt-2 text-white/60 text-sm">统一沉淀所有客户数据，不再散在微信和表格里。支持自定义字段，灵活管理各类客户信息。</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">AI 话术生成</h3>
              <p className="mt-2 text-white/60 text-sm">输入客户需求，AI 自动生成专业销售话术。告别 copy paste，提升成交效率。</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">智能提醒</h3>
              <p className="mt-2 text-white/60 text-sm">设置跟进提醒，系统自动推送。不再忘记跟进客户，让每一个机会都被抓住。</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">成交看板</h3>
              <p className="mt-2 text-white/60 text-sm">可视化销售数据，实时掌握业绩情况。客户漏斗、成交趋势一眼看清。</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.189 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">跟进记录</h3>
              <p className="mt-2 text-white/60 text-sm">每次沟通都有记录，客户动态随时查看。形成完整的客户画像。</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">团队协作</h3>
              <p className="mt-2 text-white/60 text-sm">支持多成员协作，团队销售情况一览无余。管理员可分配客户和权限。</p>
            </div>
          </div>
        </div>

        {/* 适用场景 */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold mb-8">适用场景</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl">🏪</div>
              <div>
                <h3 className="font-semibold">门店销售</h3>
                <p className="text-sm text-white/60">建材、家居、汽修、服装等实体店老板和销售，快速管理进店客户</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl">💼</div>
              <div>
                <h3 className="font-semibold">B2B 销售</h3>
                <p className="text-sm text-white/60">面向企业客户的销售团队，系统化管理商机和客户跟进</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl">🏠</div>
              <div>
                <h3 className="font-semibold">房产销售</h3>
                <p className="text-sm text-white/60">房产经纪人管理客户、跟进带看、成交记录</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl">🚗</div>
              <div>
                <h3 className="font-semibold">保险/金融</h3>
                <p className="text-sm text-white/60">保险代理人、金融顾问长期跟进客户必备工具</p>
              </div>
            </div>
          </div>
        </div>

        {/* 价格 */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold mb-8">价格方案</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold">免费版</h3>
              <p className="mt-2 text-3xl font-bold text-emerald-400">¥0<span className="text-sm font-normal text-white/50">/月</span></p>
              <p className="mt-2 text-sm text-white/60">适合个人快速验证想法</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>✓ 100 个客户</li>
                <li>✓ AI 话术 50 次/天</li>
                <li>✓ 基础客户管理</li>
                <li>✓ 1 个团队成员</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500 bg-emerald-500/10 p-6 ring-2 ring-emerald-500">
              <div className="text-center text-xs font-medium bg-emerald-500 text-white rounded-full py-1 mb-2 inline-block">最受欢迎</div>
              <h3 className="text-xl font-semibold">专业版</h3>
              <p className="mt-2 text-3xl font-bold text-emerald-400">¥199<span className="text-sm font-normal text-white/50">/月</span></p>
              <p className="mt-2 text-sm text-white/60">适合销售团队和门店</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>✓ 无限客户</li>
                <li>✓ AI 话术无限次</li>
                <li>✓ 5 个团队成员</li>
                <li>✓ 高级客户管理</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold">企业版</h3>
              <p className="mt-2 text-3xl font-bold text-emerald-400">联系我们</p>
              <p className="mt-2 text-sm text-white/60">适合大型团队</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>✓ 无限成员</li>
                <li>✓ 自定义品牌</li>
                <li>✓ 私有化部署</li>
                <li>✓ 7x24 支持</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold">还在用表格管理客户？</h2>
          <p className="mt-4 text-white/60">立即免费注册，让成交变得更简单</p>
          <div className="mt-6 flex gap-4 justify-center">
            <a href="/register" className="rounded-full bg-emerald-500 px-8 py-3 text-lg font-medium text-white hover:bg-emerald-400">
              立即免费试用
            </a>
          </div>
          <p className="mt-4 text-sm text-white/50">客服微信：{wechatId}</p>
        </div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-white/50">
          <p>© 2026 成交宝. All rights reserved.</p>
        </footer>
      </section>
    </main>
  );
}
