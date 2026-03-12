import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { getCustomerById } from "@/lib/customer-service";
import { CustomerEditForm } from "./customer-edit-form";

export default async function CustomerEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <ProtectedShell>
      <AppShell
      eyebrow="成交宝 / 客户编辑"
      title={`编辑 ${customer.name}`}
      description="把客户资料改准确，系统统计和后续 AI 建议才会靠谱。"
      actions={<Link href={`/customers/${customer.id}`} className="rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:border-white/35 hover:text-white">返回详情</Link>}
    >
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <CustomerEditForm customer={customer} />
      </section>
      </AppShell>
    </ProtectedShell>
  );
}
