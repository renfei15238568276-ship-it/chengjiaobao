"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = { success: false };

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">新密码</span>
        <input name="password" type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">确认新密码</span>
        <input name="confirmPassword" type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500" />
      </label>
      {state.message ? (
        <div className={`rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {state.message}
        </div>
      ) : null}
      <button disabled={pending} className="rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:bg-slate-400">
        {pending ? "保存中..." : "修改密码"}
      </button>
    </form>
  );
}
