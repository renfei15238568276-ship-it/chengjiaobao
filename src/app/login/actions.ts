"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, getAdminCredentials } from "@/lib/auth";

export type LoginState = {
  success: boolean;
  message?: string;
};

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const admin = getAdminCredentials();

  if (username !== admin.username || password !== admin.password) {
    return {
      success: false,
      message: "账号或密码不对。",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect("/login");
}
