import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { hasActiveSubscription } from "@/lib/subscription-service";
import { CustomerForm } from "./customer-form";

export default async function NewCustomerPage() {
  const active = await hasActiveSubscription();

  if (!active) {
    redirect("/pay");
  }

  return (
    <ProtectedShell>
      <AppShell
      eyebrow="成交宝 / 客户管理"
      title="新建客户"
      description="已开通用户可以正常录入客户。"
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
