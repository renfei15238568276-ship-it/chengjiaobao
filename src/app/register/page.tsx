import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-2xl ring-1 ring-slate-200 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="bg-slate-950 px-8 py-10 text-white lg:px-10 lg:py-12">
          <p className="text-sm text-cyan-300">成交宝 / 用户注册</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">先把账号注册体系跑起来，再往多用户隔离和年费上接。</h1>
          <p className="mt-4 text-white/70">这一版先把“能注册进数据库”做实。登录、登录态和用户隔离，下一刀继续接。</p>
          <div className="mt-8 space-y-3 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">注册后会写入 Supabase 的 users 表</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">默认角色：user</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">默认状态：active（未开通前不能白用核心功能）</div>
          </div>
        </section>
        <section className="px-8 py-10 lg:px-10 lg:py-12">
          <p className="text-sm text-cyan-700">第一步</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">创建账号</h2>
          <p className="mt-3 text-slate-600">先把注册这一步打通。完成后我再接登录和用户隔离。</p>
          <div className="mt-8">
            <RegisterForm />
          </div>
          <div className="mt-6 text-sm text-slate-500">
            已有管理员入口？ <Link href="/login" className="text-cyan-700 hover:underline">去登录</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
