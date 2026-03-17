import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { getCurrentUserSubscription } from "@/lib/subscription-service";

const plans = [
  {
    id: "free",
    name: "免费版",
    price: "¥0",
    period: "/月",
    description: "适合个人快速验证想法",
    features: [
      "最多 100 个客户",
      "AI 话术生成 50 次/天",
      "基础客户管理",
      "1 个团队成员",
      "Email 支持",
    ],
    notIncluded: [
      "高级 AI 功能",
      "团队协作",
      "API 接入",
    ],
    cta: "当前计划",
    popular: false,
  },
  {
    id: "pro",
    name: "专业版",
    price: "¥199",
    period: "/月",
    description: "适合小团队快速增长",
    features: [
      "无限客户数量",
      "AI 话术生成无限制",
      "高级客户分析",
      "最多 10 个团队成员",
      "优先客服支持",
      "数据导出",
      "自定义字段",
    ],
    notIncluded: [
      "专属客服",
      "API 接入",
    ],
    cta: "立即升级",
    popular: true,
  },
  {
    id: "enterprise",
    name: "企业版",
    price: "¥399",
    period: "/月",
    description: "适合中大型企业",
    features: [
      "everything in Pro",
      "无限团队成员",
      "专属客服经理",
      "API 接入",
      "自定义品牌",
      "SLA 保障",
      "私有化部署",
    ],
    notIncluded: [],
    cta: "联系销售",
    popular: false,
  },
];

export default async function PricingPage() {
  const subscription = await getCurrentUserSubscription();
  const currentPlan = subscription?.planCode || "free";

  return (
    <ProtectedShell>
      <AppShell
        eyebrow="成交宝 / 套餐"
        title="选择你的套餐"
        description="选择最适合你的方案，开始高效跟进客户"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl bg-white p-6 shadow-sm ring-1 ${
                plan.popular
                  ? "border-2 border-cyan-400 ring-cyan-100"
                  : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-400 px-3 py-1 text-xs font-medium text-slate-900">
                  最受欢迎
                </div>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="ml-1 text-slate-500">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg className="h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 opacity-50">
                    <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-slate-500">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {currentPlan === plan.id ? (
                  <button disabled className="w-full rounded-xl bg-slate-100 px-4 py-3 font-medium text-slate-500">
                    当前计划
                  </button>
                ) : plan.id === "free" ? (
                  <Link
                    href="/dashboard"
                    className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-center font-medium text-slate-700 hover:bg-slate-50"
                  >
                    返回免费版
                  </Link>
                ) : (
                  <Link
                    href={`/payments/checkout?plan=${plan.id}`}
                    className="block w-full rounded-xl bg-cyan-400 px-4 py-3 text-center font-medium text-slate-900 hover:bg-cyan-500"
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-slate-900 px-6 py-8 text-white">
          <h3 className="text-xl font-semibold">需要定制方案？</h3>
          <p className="mt-2 text-slate-300">
            我们提供灵活的定制方案，满足特殊需求
          </p>
          <a
            href="mailto:sales@chengjiaobao.com"
            className="mt-4 inline-block rounded-xl border border-white/20 px-6 py-3 font-medium hover:bg-white/10"
          >
            联系销售 →
          </a>
        </div>
      </AppShell>
    </ProtectedShell>
  );
}
