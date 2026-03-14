"use client";

import { useActionState } from "react";
import { createCustomerAction, type CreateCustomerState } from "./actions";

const initialState: CreateCustomerState = {
  success: false,
};

const fields = [
  { name: "name", label: "客户姓名", placeholder: "例如：张总" },
  { name: "company", label: "公司 / 门店", placeholder: "例如：海川装饰" },
  { name: "contactHandle", label: "联系方式", placeholder: "手机号 / 微信 / Telegram" },
  { name: "source", label: "来源渠道", placeholder: "抖音投流 / 转介绍 / 门店到访" },
  { name: "stage", label: "当前阶段", placeholder: "新线索 / 意向中 / 报价中 / 待成交" },
  { name: "estimatedAmount", label: "预计金额", placeholder: "例如：58000" },
] as const;

export function CustomerForm() {
  const [state, formAction, pending] = useActionState(createCustomerAction, initialState);

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">{field.label}</span>
          <input
            name={field.name}
            defaultValue={state.values?.[field.name] ?? ""}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
            placeholder={field.placeholder}
          />
          <FieldError errors={state.errors?.[field.name]} />
        </label>
      ))}

      <label className="sm:col-span-2 block">
        <span className="mb-2 block text-sm font-medium text-slate-700">客户备注</span>
        <textarea
          name="note"
          defaultValue={state.values?.note ?? ""}
          className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
          placeholder="例如：已沟通过一次，对报价比较敏感，需要强调性价比和赠品。"
        />
        <FieldError errors={state.errors?.note} />
      </label>

      <label className="sm:col-span-2 block">
        <span className="mb-2 block text-sm font-medium text-slate-700">下次跟进时间</span>
        <input
          name="nextFollowUp"
          type="datetime-local"
          defaultValue={state.values?.nextFollowUp ?? ""}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
        />
        <FieldError errors={state.errors?.nextFollowUp} />
      </label>

      {state.message ? (
        <div className="sm:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {state.message}
        </div>
      ) : null}

      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        <button
          disabled={pending}
          className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-300"
        >
          {pending ? "保存中..." : "保存客户"}
        </button>
        <a href="/customers" className="rounded-full border border-slate-200 px-5 py-3 text-slate-700 transition hover:bg-slate-50">
          取消
        </a>
      </div>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600">{errors[0]}</p>;
}
