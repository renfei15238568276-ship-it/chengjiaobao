import { cookies } from "next/headers";

export const AUTH_COOKIE = "chengjiaobao_user";
export const AUTH_ROLE_COOKIE = "chengjiaobao_role";
export const AUTH_USERNAME_COOKIE = "chengjiaobao_username";
export const AUTH_USER_ID_COOKIE = "chengjiaobao_user_id";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === "1" && Boolean(cookieStore.get(AUTH_USER_ID_COOKIE)?.value);
}

export async function requireAuth() {
  return isAuthenticated();
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const authed = cookieStore.get(AUTH_COOKIE)?.value === "1";

  if (!authed) return null;

  const userId = cookieStore.get(AUTH_USER_ID_COOKIE)?.value;
  const username = cookieStore.get(AUTH_USERNAME_COOKIE)?.value;
  const role = cookieStore.get(AUTH_ROLE_COOKIE)?.value ?? "user";

  if (!userId || !username) return null;

  return { userId, username, role };
}

export async function isAdminSession() {
  const session = await getCurrentSession();
  return session?.role === "admin";
}
