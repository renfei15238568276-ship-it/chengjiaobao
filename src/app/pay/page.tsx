import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import Image from "next/image";
import { PaymentForm } from "./payment-form";

export default async function PayPage() {
  const session = await getCurrentSession();
  if (session?.role !== "admin") {
    redirect("/dashboard");
  }

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
    title: "支付宝支付",
    image: "/payments/wechat.jpg",
    hint: "请使用支付宝扫码付款，付款时备注“成交宝+手机号”。",
  },
  {
    title: "微信支付",
    image: "/payments/alipay.jpg",
    hint: "请使用微信扫码付款，付款时备注“成交宝+手机号”。",
  },
];

export default function PayPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        <header className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-400/12 to-blue-500/5 p-8 lg:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">成交宝 / 付款开通</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-6xl">开通成交宝会员</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 lg:text-lg">
            选择适合你的版本，付款后提交开通信息。当前支持人工审核开通，确认后即可开始使用。
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">先付款，再开通</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">支持微信 / 支付宝</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">适合个人与团队使用</span>
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

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <PaymentForm />

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-cyan-300">人工开通入口</p>
            <h3 className="mt-2 text-2xl font-semibold">付款后联系我开通</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              付款后请保存截图，并把姓名、手机号、微信号、套餐和付款金额通过 Telegram 发给我，我会尽快处理。
            </p>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4">
                <p className="text-sm text-white/55">联系 Telegram</p>
                <p className="mt-1 text-lg font-medium text-white">@gomining125</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-sm leading-7 text-white/70">
                请按这个格式发我：姓名 / 手机号 / 微信号 / 套餐 / 金额 / 付款截图。
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/contact" className="rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">
                查看 Telegram / 微信开通说明
              </a>
              <a href="/login" className="rounded-full border border-white/15 px-5 py-3 text-white/80 transition hover:border-white/35 hover:text-white">
                管理员登录
              </a>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h3 className="text-2xl font-semibold">开通说明</h3>
          <ul className="mt-5 grid gap-3 text-sm leading-7 text-white/70">
            <li>1. 先扫码付款，再填写下方信息并保存付款截图。</li>
            <li>2. 当前支持人工审核开通，确认付款信息后即可为你开通使用。</li>
            <li>3. 实际开通先走人工核对，正常 5~30 分钟内处理。</li>
            <li>4. 后续接入数据库或表单服务后，再升级成正式在线提交版。</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
