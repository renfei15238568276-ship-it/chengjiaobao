"use client";

import { useActionState } from "react";
import { registerAction, type RegisterState } from "./actions";

const initialState: RegisterState = { success: false };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="用户名" name="username" defaultValue={state.values?.username} placeholder="至少 3 位，例如 renfei" error={state.errors?.username?.[0]} />
      <Field label="昵称" name="displayName" defaultValue={state.values?.displayName} placeholder="展示给系统看的名字" error={state.errors?.displayName?.[0]} />
      <Field label="公司/团队名称" name="organizationName" defaultValue={state.values?.organizationName} placeholder="例如：我的公司" error={state.errors?.organizationName?.[0]} />
      <Field label="密码" name="password" type="password" defaultValue={state.values?.password} placeholder="至少 6 位" error={state.errors?.password?.[0]} />
      <Field label="确认密码" name="confirmPassword" type="password" defaultValue={state.values?.confirmPassword} placeholder="再输一次密码" error={state.errors?.confirmPassword?.[0]} />

      {state.message ? (
        <div className={`rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {state.message}
        </div>
      ) : null}

      <button disabled={pending} className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400">
        {pending ? "注册中..." : "创建账号"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
      />
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}
