import { AppShell } from "@/components/app-shell";

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
    description: "适合销售团队和门店",
    features: [
      "无限客户",
      "AI 话术无限次",
      "高级客户管理",
      "5 个团队成员",
      "优先支持",
      "自定义字段",
    ],
    notIncluded: [
      "私有化部署",
    ],
    cta: "立即开通",
    popular: true,
  },
  {
    id: "team",
    name: "企业版",
    price: "联系咨询",
    period: "",
    description: "适合大型团队",
    features: [
      "无限客户",
      "AI 话术无限次",
      "完整客户管理",
      "无限团队成员",
      "7x24 支持",
      "自定义品牌",
      "SLA 保障",
      "私有化部署",
    ],
    notIncluded: [],
    cta: "联系销售",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <AppShell
      eyebrow="成交宝 / 价格"
      title="选择适合你的方案"
      description="灵活定价，满足不同阶段需求"
    >
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl border p-8 ${
              plan.popular
                ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-500"
                : "border-slate-200 bg-white"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-4 py-1 text-sm font-medium text-white">
                最受欢迎
              </span>
            )}
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-2 text-3xl font-bold">
              {plan.price}
              {plan.period}
            </p>
            <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span className="text-cyan-500">✓</span>
                  {feature}
                </li>
              ))}
              {plan.notIncluded.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-400">
                  <span>×</span>
                  {feature}
                </li>
              ))}
            </ul>
            {plan.id === "free" ? (
              <div className="mt-8 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-600">
                当前计划
              </div>
            ) : plan.id === "team" ? (
              <a
                href="/contact"
                className="mt-8 block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-medium hover:bg-slate-100"
              >
                联系销售
              </a>
            ) : (
              <a
                href="/pay"
                className="mt-8 block rounded-full bg-cyan-500 px-4 py-3 text-center font-medium text-white hover:bg-cyan-600"
              >
                立即开通 →
              </a>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
