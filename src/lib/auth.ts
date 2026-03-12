import { cookies } from "next/headers";

export const AUTH_COOKIE = "chengjiaobao_admin";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === "1";
}

export async function requireAuth() {
  const ok = await isAuthenticated();
  return ok;
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "12345678",
  };
}
