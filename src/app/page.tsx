const metrics = [
  { label: "今日待跟进", value: "28", hint: "+6 个高意向客户" },
  { label: "本周成交额", value: "¥86,400", hint: "较上周 +18.2%" },
  { label: "AI 生成话术", value: "1,284", hint: "平均节省 2.4 小时/天" },
  { label: "团队跟进完成率", value: "91%", hint: "还有 3 条逾期提醒" },
];

const features = [
  {
    title: "客户全链路管理",
    description: "从新线索、报价、谈判到成交和流失，统一沉淀客户数据，不再散在微信、表格和脑子里。",
  },
  {
    title: "AI 成交助手",
    description: "根据客户阶段、行业和沟通历史，自动生成破冰、跟单、逼单、售后、召回等高转化话术。",
  },
  {
    title: "提醒与看板",
    description: "今天谁该跟进、哪个客户快流失、哪个销售效率低，打开仪表盘一眼看明白。",
  },
];

const scenarios = ["装修销售", "美业门店", "教培顾问", "房产中介", "私域操盘", "高客单顾问服务"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <div>
            <p className="text-sm text-cyan-300">成交宝</p>
            <h1 className="text-lg font-semibold">客户跟进 + AI 成交助手</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="#features" className="text-white/70 transition hover:text-white">功能</a>
            <a href="#scenarios" className="text-white/70 transition hover:text-white">行业</a>
            <a href="/dashboard" className="rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-300">查看控制台</a>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              正式产品骨架 · 可继续扩成 CRM SaaS
            </div>
            <h2 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight lg:text-7xl">
              帮销售和老板
              <span className="text-cyan-300"> 少丢单、多成交、快跟进</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              成交宝把客户管理、跟进记录、AI 话术生成、提醒和团队看板揉成一个系统。
              不是玩具，不是纯 AI 壳子，是能直接往正式产品走的销售工作台。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/dashboard" className="rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">
                进入产品原型
              </a>
              <a href="/pay" className="rounded-full bg-emerald-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-emerald-300">
                去付款开通
              </a>
              <a href="#features" className="rounded-full border border-white/15 px-6 py-3 font-medium text-white/80 transition hover:border-white/35 hover:text-white">
                看核心功能
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/60">
              {scenarios.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/6 p-4 shadow-2xl shadow-cyan-950/40 backdrop-blur">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-cyan-300">销售驾驶舱</p>
                  <h3 className="text-2xl font-semibold">今晚重点跟进</h3>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-300">转化率 +18%</span>
              </div>
              <div className="mt-5 grid gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                    <p className="text-sm text-white/55">{metric.label}</p>
                    <div className="mt-1 flex items-end justify-between gap-4">
                      <p className="text-3xl font-semibold">{metric.value}</p>
                      <p className="text-sm text-white/45">{metric.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-4">
                <p className="text-sm text-cyan-200">AI 建议</p>
                <p className="mt-2 text-base leading-7 text-white/85">
                  高意向客户「张总」3 天未回复，建议今晚 20:30 发送“报价说明 + 限时活动”组合话术，优先推动预约成交。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-10 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">核心功能</p>
          <h3 className="mt-3 text-3xl font-semibold">先把真正能卖钱的链路打通</h3>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-xl font-semibold">{feature.title}</h4>
              <p className="mt-4 leading-7 text-white/65">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="scenarios" className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
        <div className="grid gap-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-blue-500/5 p-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">适用行业</p>
            <h3 className="mt-3 text-3xl font-semibold">先盯住高频跟进、高客单、高复购行业</h3>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">
              第一阶段建议从装修、美业、教培、房产或私域销售切进去。先做出行业话术模板和转化流程，后面再扩成通用 CRM + AI 平台。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {scenarios.map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-sm text-cyan-300">场景 0{index + 1}</p>
                <p className="mt-2 text-lg font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 