"use client";

import { useActionState } from "react";
import { addFollowUpAction, type FollowUpState } from "./actions";

const initialState: FollowUpState = { success: false };

export function FollowUpForm({ customerId }: { customerId: string }) {
  const [state, formAction, pending] = useActionState(addFollowUpAction, initialState);

  return (
    <form action={formAction} className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name="customerId" value={customerId} />
      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">跟进类型</span>
          <select
            name="type"
            defaultValue={state.values?.type ?? "私聊"}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-cyan-500"
          >
            <option>私聊</option>
            <option>电话</option>
            <option>面谈</option>
            <option>报价</option>
            <option>回访</option>
          </select>
          <FieldError errors={state.errors?.type} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">跟进内容</span>
          <textarea
            name="content"
            defaultValue={state.values?.content ?? ""}
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-cyan-500"
            placeholder="写下这次沟通了什么、客户反馈了什么、下一步要干嘛。"
          />
          <FieldError errors={state.errors?.content} />
        </label>
      </div>

      {state.message ? (
        <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>
          {state.message}
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button disabled={pending} className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-cyan-300">
          {pending ? "保存中..." : "保存跟进记录"}
        </button>
      </div>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-2 text-sm text-rose-600">{errors[0]}</p>;
}
