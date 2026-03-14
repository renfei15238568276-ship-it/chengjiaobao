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
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
    }
  } catch (e) {}
  return []
}

export type LoginState = {
  success: boolean;
  message?: string;
};

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  // Local file-based login
  const users = getUsers();
  const user = users.find((u: any) => u.username === username);
  
  if (!user) {
    return {
      success: false,
      message: "用户不存在，请先注册。",
    };
  }

  if (user.passwordHash !== hashPassword(password)) {
    return {
      success: false,
      message: "密码不对。",
    };
  }

  // Get stored org info
  const orgId = user.organizationId || "";
  const orgName = user.organizationName || "";

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
  cookieStore.set(AUTH_ROLE_COOKIE, user.role || "user", baseCookie);
  
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
