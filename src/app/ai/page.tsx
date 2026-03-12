import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { listCustomers } from "@/lib/customer-service";
import { AiWorkbench } from "./ai-workbench";

const generators = [
  {
    title: "破冰话术",
    description: "适合新加好友、首次到店、活动后首轮触达。",
  },
  {
    title: "报价解释",
    description: "把价格、服务、权益拆开讲，减少客户只盯数字。",
  },
  {
    title: "逼单促成",
    description: "适合高意向客户迟迟不做决定的阶段。",
  },
  {
    title: "流失召回",
    description: "沉默客户重新激活，给出理由和动作指令。",
  },
];

export default async function AiPage() {
  const customers = await listCustomers();

  return (
    <ProtectedShell>
      <AppShell
      eyebrow="成交宝 / AI 助手"
      title="AI 成交助手"
      description="现在不只是展示页了：你可以生成话术，并把结果直接保存回客户记录。"
      actions={
        <>
          <Link href="/customers" className="rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:border-white/35 hover:text-white">客户列表</Link>
          <Link href="/dashboard" className="rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950">控制台</Link>
        </>
      }
    >
      <AiWorkbench customers={customers} />

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {generators.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-medium text-slate-900">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </div>
        ))}
      </section>
      </AppShell>
    </ProtectedShell>
  );
}
