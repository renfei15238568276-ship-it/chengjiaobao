"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE,
  AUTH_ROLE_COOKIE,
  AUTH_USER_ID_COOKIE,
  AUTH_USERNAME_COOKIE,
  AUTH_ORG_ID_COOKIE,
  AUTH_ORG_NAME_COOKIE,
} from "@/lib/auth";
import { verifyUserLogin } from "@/lib/user-service";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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

  // Get user's organization
  let orgId = "";
  let orgName = "";
  
  try {
    const admin = getSupabaseAdmin()
    const { data: membership } = await admin
      .from("organization_members")
      .select("*, organization:organizations(name)")
      .eq("user_id", user.id)
      .single()
    
    if (membership) {
      orgId = membership.organization_id
      orgName = membership.organization?.name || ""
    }
  } catch (e) {
    // Supabase not configured, continue without org
  }

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const baseCookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };

  cookieStore.set(AUTH_COOKIE, "1", baseCookie);
  cookieStore.set(AUTH_USER_ID_COOKIE, user.id, baseCookie);
  cookieStore.set(AUTH_USERNAME_COOKIE, user.username, baseCookie);
  cookieStore.set(AUTH_ROLE_COOKIE, user.role, baseCookie);
  
  if (orgId) {
    cookieStore.set(AUTH_ORG_ID_COOKIE, orgId, baseCookie);
    cookieStore.set(AUTH_ORG_NAME_COOKIE, orgName, baseCookie);
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(AUTH_USER_ID_COOKIE);
  cookieStore.delete(AUTH_USERNAME_COOKIE);
  cookieStore.delete(AUTH_ROLE_COOKIE);
  cookieStore.delete(AUTH_ORG_ID_COOKIE);
  cookieStore.delete(AUTH_ORG_NAME_COOKIE);
  redirect("/login");
}
