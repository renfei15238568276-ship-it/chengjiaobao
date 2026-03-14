import Link from "next/link";

export function SubscriptionGuardCard({
  title = "当前账号还未开通套餐",
  description = "你可以先注册和登录，但核心功能需要开通套餐后才能正式使用。",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <p className="text-sm text-amber-700">权限限制</p>
      <h2 className="mt-2 text-2xl font-semibold text-amber-900">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-amber-800">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/pay" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
          去付款开通
        </Link>
        <Link href="/settings" className="rounded-full border border-amber-300 px-5 py-3 text-sm text-amber-900 transition hover:bg-amber-100">
          查看账户状态
        </Link>
      </div>
    </section>
  );
}
