"use client";

import { useMemo, useState, useActionState, useEffect } from "react";
import type { CustomerRecord } from "@/lib/types";
import { saveAiRecordAction, type SaveAiState } from "./actions";
import { generateAiCopyAction, type GenerateAiState } from "./generate-actions";

const initialSaveState: SaveAiState = { success: false };
const initialGenerateState: GenerateAiState = { success: false };

export function AiWorkbench({ customers }: { customers: CustomerRecord[] }) {
  const [selectedId, setSelectedId] = useState(customers[0]?.id ?? "");
  const [generationType, setGenerationType] = useState("报价解释");
  const [tone, setTone] = useState("专业稳重");
  const [concern, setConcern] = useState(customers[0]?.note ?? "");
  const [goal, setGoal] = useState("让客户今晚回复，并推进预约签单。");
  const [copy, setCopy] = useState("");
  const [saveState, saveAction, savePending] = useActionState(saveAiRecordAction, initialSaveState);
  const [generateState, generateAction, generatePending] = useActionState(generateAiCopyAction, initialGenerateState);

  const customer = useMemo(() => customers.find((item) => item.id === selectedId) ?? customers[0], [customers, selectedId]);

  useEffect(() => {
    if (generateState.generatedCopy) {
      setCopy(generateState.generatedCopy);
    }
  }, [generateState.generatedCopy]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-cyan-700">输入条件</p>
        <h2 className="mt-2 text-2xl font-semibold">生成一条更容易成交的话术</h2>
        <form action={generateAction} className="mt-6 grid gap-5 sm:grid-cols-2">
          <input type="hidden" name="customerName" value={customer?.name ?? ""} />
          <input type="hidden" name="company" value={customer?.company ?? ""} />
          <input type="hidden" name="stage" value={customer?.stage ?? ""} />

          <Field label="客户">
            <select
              value={selectedId}
              onChange={(e) => {
                const nextId = e.target.value;
                setSelectedId(nextId);
                const nextCustomer = customers.find((item) => item.id === nextId);
                if (nextCustomer) setConcern(nextCustomer.note);
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
            >
              {customers.map((item) => (
                <option key={item.id} value={item.id}>{item.name} · {item.company}</option>
              ))}
            </select>
          </Field>
          <Field label="生成类型">
            <select name="generationType" value={generationType} onChange={(e) => setGenerationType(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500">
              <option>报价解释</option>
              <option>破冰话术</option>
              <option>逼单促成</option>
              <option>流失召回</option>
            </select>
          </Field>
          <Field label="当前阶段">
            <input value={customer?.stage ?? ""} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
          </Field>
          <Field label="沟通语气">
            <select name="tone" value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500">
              <option>专业稳重</option>
              <option>像朋友聊天</option>
              <option>强行动号召</option>
            </select>
          </Field>
          <label className="sm:col-span-2 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">客户顾虑 / 当前情况</span>
            <textarea name="concern" value={concern} onChange={(e) => setConcern(e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500" />
          </label>
          <label className="sm:col-span-2 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">本次目标</span>
            <input name="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500" />
          </label>
          <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={generatePending} className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-300">
              {generatePending ? "生成中..." : "生成话术"}
            </button>
          </div>
          {generateState.message ? (
            <div className={`sm:col-span-2 rounded-2xl px-4 py-3 text-sm ${generateState.provider === "openrouter" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>
              {generateState.message}
            </div>
          ) : null}
        </form>
      </section>

      <section className="space-y-6">
        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm text-cyan-300">AI 输出</p>
          <h2 className="mt-2 text-2xl font-semibold">推荐发送内容</h2>
          <form action={saveAction} className="mt-5 space-y-4">
            <input type="hidden" name="customerId" value={customer?.id ?? ""} />
            <input type="hidden" name="generationType" value={generationType} />
            <input type="hidden" name="tone" value={tone} />
            <input type="hidden" name="concern" value={concern} />
            <input type="hidden" name="goal" value={goal} />
            <textarea
              name="generatedCopy"
              value={copy}
              onChange={(e) => setCopy(e.target.value)}
              className="min-h-48 w-full rounded-2xl border border-white/10 bg-white/5 p-5 leading-8 text-white/88 outline-none"
              placeholder="先点左边的“生成话术”，这里会出现结果。你也可以手动微调后再保存。"
            />
            {saveState.message ? <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{saveState.message}</div> : null}
            <div className="flex flex-wrap gap-3 text-sm">
              <button type="submit" disabled={savePending || !copy.trim()} className="rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950 disabled:cursor-not-allowed disabled:bg-cyan-200">{savePending ? "保存中..." : "保存到客户记录"}</button>
              <button type="button" onClick={() => navigator.clipboard?.writeText(copy)} className="rounded-full border border-white/15 px-4 py-2 text-white/80">一键复制</button>
            </div>
          </form>
        </div>

        {customer ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-cyan-700">客户摘要</p>
            <h2 className="mt-2 text-2xl font-semibold">当前对象：{customer.name}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Summary label="所属公司" value={customer.company} />
              <Summary label="当前阶段" value={customer.stage} />
              <Summary label="成交概率" value={`${customer.probability}%`} />
              <Summary label="下次跟进" value={customer.nextFollowUp} />
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{customer.note}</div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
