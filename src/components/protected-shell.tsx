import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { requireAuth } from "@/lib/auth";
import { logoutAction } from "@/app/login/actions";

export async function ProtectedShell({ children }: { children: ReactNode }) {
  const authed = await requireAuth();
  if (!authed) {
    redirect("/login");
  }

  return (
    <div>
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
          <div>
            <p className="text-sm text-cyan-700">成交宝</p>
            <p className="text-xs text-slate-500">单管理员模式</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/dashboard" className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-50">控制台</Link>
            <Link href="/payments" className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-50">收款审核</Link>
            <Link href="/settings" className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-50">设置</Link>
            <form action={logoutAction}>
              <button className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-slate-800">退出</button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
