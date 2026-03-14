import Link from "next/link";
import type { ReactNode } from "react";
import { getCurrentSession } from "@/lib/auth";

const nav: { href: string; label: string; adminOnly?: boolean }[] = [
  { href: "/dashboard", label: "控制台" },
  { href: "/customers", label: "客户" },
  { href: "/customers/new", label: "新建客户" },
  { href: "/ai", label: "AI 助手" },
  { href: "/pay", label: "付款开通" },
  { href: "/pricing", label: "套餐" },
  { href: "/settings/team", label: "团队" },
  { href: "/settings", label: "设置" },
  { href: "/payments", label: "收款审核", adminOnly: true },
  { href: "/admin/users", label: "用户开通", adminOnly: true },
];

export async function AppShell({
  title,
  eyebrow,
  description,
  actions,
  children,
}: {
  title: string;
  eyebrow: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const session = await getCurrentSession();
  const visibleNav = nav.filter((item) => !item.adminOnly || session?.role === "admin");

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="rounded-[32px] bg-slate-950 p-6 text-white shadow-xl lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm text-cyan-300">{eyebrow}</p>
              <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
              {description ? <p className="mt-3 max-w-3xl text-white/65">{description}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-3 text-sm">{actions}</div> : null}
          </div>

          <nav className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5 text-sm">
            {visibleNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:border-white/35 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-cyan-200 transition hover:bg-cyan-400/20"
            >
              官网
            </Link>
          </nav>
        </header>

        <section className="mt-6">{children}</section>
      </div>
    </main>
  );
}
