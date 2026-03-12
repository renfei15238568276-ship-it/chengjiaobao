import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const authed = await isAuthenticated();
  if (authed) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-2xl ring-1 ring-slate-200 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="bg-slate-950 px-8 py-10 text-white lg:px-10 lg:py-12">
          <p className="text-sm text-cyan-300">成交宝 / 用户登录</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">把客户、跟进、AI 话术和成交过程，拢到一个后台里。</h1>
          <p className="mt-4 text-white/70">现在开始切真实用户体系：先支持 users 表登录，后面再继续接用户隔离和套餐。</p>
          <div className="mt-8 space-y-3 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">注册用户可直接用用户名 + 密码登录</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">老 admin 用户也还能继续登录</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">下一步再接“每人只看自己的数据”</div>
          </div>
        </section>
        <section className="px-8 py-10 lg:px-10 lg:py-12">
          <p className="text-sm text-cyan-700">登录入口</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">登录后台</h2>
          <p className="mt-3 text-slate-600">先完成登录保护，这套东西才更像正式产品。</p>
          <div className="mt-8">
            <LoginForm />
          </div>
          <div className="mt-6 text-sm text-slate-500">
            还没账号？ <a href="/register" className="text-cyan-700 hover:underline">先注册</a>
          </div>
        </section>
      </div>
    </main>
  );
}
