"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE,
  AUTH_ROLE_COOKIE,
  AUTH_USER_ID_COOKIE,
  AUTH_USERNAME_COOKIE,
} from "@/lib/auth";
import { verifyUserLogin } from "@/lib/user-service";

export type LoginState = {
  success: boolean;
  message?: string;
};

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const user = await verifyUserLogin(username, password);

  if (!user) {
    return {
      success: false,
      message: "账号或密码不对。",
    };
  }

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const baseCookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  cookieStore.set(AUTH_COOKIE, "1", baseCookie);
  cookieStore.set(AUTH_USER_ID_COOKIE, user.id, baseCookie);
  cookieStore.set(AUTH_USERNAME_COOKIE, user.username, baseCookie);
  cookieStore.set(AUTH_ROLE_COOKIE, user.role, baseCookie);

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(AUTH_USER_ID_COOKIE);
  cookieStore.delete(AUTH_USERNAME_COOKIE);
  cookieStore.delete(AUTH_ROLE_COOKIE);
  redirect("/login");
}
