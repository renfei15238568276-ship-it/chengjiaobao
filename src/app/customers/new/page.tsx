import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { CustomerForm } from "./customer-form";

export default function NewCustomerPage() {
  return (
    <ProtectedShell>
      <AppShell
      eyebrow="成交宝 / 客户管理"
      title="新建客户"
      description="这一步已经接上 Server Action 和表单校验。下一步只要把 action 里的 redirect 改成数据库写入，就是真 CRUD。"
      actions={
        <Link href="/customers" className="rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:border-white/35 hover:text-white">返回客户列表</Link>
      }
    >
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <CustomerForm />
      </section>
      </AppShell>
    </ProtectedShell>
  );
}
