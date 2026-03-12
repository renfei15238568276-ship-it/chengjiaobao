import Image from "next/image";
import { PaymentForm } from "./payment-form";

const plans = [
  {
    key: "personal",
    name: "个人版",
    price: "¥59 / 月",
    desc: "适合个人销售、顾问、私域成交用户",
    items: ["客户管理", "跟进记录", "AI 跟进话术", "跟进提醒", "基础数据看板"],
  },
  {
    key: "team",
    name: "团队版",
    price: "¥399 / 月",
    desc: "适合 2-20 人小团队统一管理客户",
    items: ["多账号协作", "团队客户池", "团队跟进统计", "更高 AI 配额", "权限管理"],
  },
  {
    key: "private",
    name: "私有部署版",
    price: "¥2999 起",
    desc: "适合老板、工作室、公司独立部署使用",
    items: ["独立部署", "数据独立存储", "可定制 Logo/名称", "部署支持", "适合正式商用"],
  },
];

const payQRCodes = [
  {
    title: "微信支付",
    image: "/payments/wechat.jpg",
    hint: "请使用微信扫码付款，付款时备注“成交宝+手机号”。",
  },
  {
    title: "支付宝支付",
    image: "/payments/alipay.jpg",
    hint: "请使用支付宝扫码付款，付款时备注“成交宝+手机号”。",
  },
];

export default function PayPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        <header className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-400/12 to-blue-500/5 p-8 lg:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">成交宝收款页</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-6xl">开通成交宝会员</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 lg:text-lg">
            选择适合你的版本，扫码付款后提交开通信息。当前阶段先走人工审核开通，适合你先卖起来，不等正式支付系统也能收钱。
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">先收款，再开通</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">支持微信 / 支付宝</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">适合内测期与首批付费用户</span>
          </div>
        </header>

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.key} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-cyan-300">{plan.name}</p>
              <h2 className="mt-3 text-4xl font-semibold">{plan.price}</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">{plan.desc}</p>
              <ul className="mt-6 grid gap-3 text-sm text-white/80">
                {plan.items.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {payQRCodes.map((item) => (
            <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-cyan-300">{item.title}</p>
              <h3 className="mt-2 text-2xl font-semibold">扫码付款</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{item.hint}</p>
              <div className="mt-6 overflow-hidden rounded-[24px] bg-white p-4">
                <Image src={item.image} alt={item.title} width={900} height={1200} className="h-auto w-full rounded-2xl object-contain" />
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <PaymentForm />
        </section>

        <section className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h3 className="text-2xl font-semibold">开通说明</h3>
          <ul className="mt-5 grid gap-3 text-sm leading-7 text-white/70">
            <li>1. 先扫码付款，再提交开通信息。</li>
            <li>2. 正常情况下 5~30 分钟内完成核对并开通。</li>
            <li>3. 当前版本先不接自动支付回调，先跑通收钱和人工开通流程。</li>
            <li>4. 后续公网稳定后，再把这一页升级成正式在线支付页。</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
