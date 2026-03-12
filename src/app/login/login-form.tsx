"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { success: false };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">管理员账号</span>
        <input name="username" defaultValue="admin" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">密码</span>
        <input name="password" type="password" defaultValue="12345678" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500" />
      </label>
      {state.message ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.message}</div> : null}
      <button disabled={pending} className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400">
        {pending ? "登录中..." : "进入成交宝后台"}
      </button>
    </form>
  );
}
