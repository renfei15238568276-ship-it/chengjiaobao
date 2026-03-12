"use client";

import { useActionState } from "react";
import type { CustomerRecord } from "@/lib/types";
import { updateCustomerAction, type UpdateCustomerState } from "./actions";

const initialState: UpdateCustomerState = { success: false };

export function CustomerEditForm({ customer }: { customer: CustomerRecord }) {
  const [state, formAction, pending] = useActionState(updateCustomerAction, initialState);
  const values = state.values ?? customer;

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="id" value={customer.id} />

      {[
        ["name", "客户姓名"],
        ["company", "公司 / 门店"],
        ["contactHandle", "联系方式"],
        ["source", "来源渠道"],
        ["stage", "当前阶段"],
        ["estimatedAmount", "预计金额"],
      ].map(([name, label]) => (
        <label key={name} className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
          <input
            name={name}
            defaultValue={String(values[name as keyof typeof values] ?? "")}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
          />
          <FieldError errors={state.errors?.[name]} />
        </label>
      ))}

      <label className="sm:col-span-2 block">
        <span className="mb-2 block text-sm font-medium text-slate-700">客户备注</span>
        <textarea
          name="note"
          defaultValue={String(values.note ?? "")}
          className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
        />
        <FieldError errors={state.errors?.note} />
      </label>

      <label className="sm:col-span-2 block">
        <span className="mb-2 block text-sm font-medium text-slate-700">下次跟进时间</span>
        <input
          name="nextFollowUp"
          defaultValue={String(values.nextFollowUp ?? "")}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
        />
        <FieldError errors={state.errors?.nextFollowUp} />
      </label>

      {state.message ? <div className="sm:col-span-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{state.message}</div> : null}

      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        <button disabled={pending} className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-300">
          {pending ? "保存中..." : "保存修改"}
        </button>
        <a href={`/customers/${customer.id}`} className="rounded-full border border-slate-200 px-5 py-3 text-slate-700 transition hover:bg-slate-50">取消</a>
      </div>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-2 text-sm text-rose-600">{errors[0]}</p>;
}
