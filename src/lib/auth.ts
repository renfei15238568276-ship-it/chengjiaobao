import { cookies } from "next/headers";

export const AUTH_COOKIE = "chengjiaobao_user";
export const AUTH_ROLE_COOKIE = "chengjiaobao_role";
export const AUTH_USERNAME_COOKIE = "chengjiaobao_username";
export const AUTH_USER_ID_COOKIE = "chengjiaobao_user_id";
export const AUTH_ORG_ID_COOKIE = "auth-org-id";
export const AUTH_ORG_NAME_COOKIE = "auth-org-name";

// Supabase client (for browser) - not needed for local auth
export const supabase = null;

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
  const orgId = cookieStore.get(AUTH_ORG_ID_COOKIE)?.value;
  const orgName = cookieStore.get(AUTH_ORG_NAME_COOKIE)?.value;

  if (!userId || !username) return null;

  return { userId, username, role, organizationId: orgId || '', organizationName: orgName || '' };
}

export async function isAdminSession() {
  const session = await getCurrentSession();
  return session?.role === "admin";
}

// Get current user info
export async function getCurrentUser() {
  const session = await getCurrentSession();
  if (!session) return null;
  
  return {
    id: session.userId,
    username: session.username,
    role: session.role,
    organizationId: session.organizationId,
    organizationName: session.organizationName,
  };
}

// Get current organization - simplified for local mode
export async function getCurrentOrganization() {
  const user = await getCurrentUser()
  if (!user?.organizationId) return null
  
  // Just return the stored org info
  return {
    id: user.organizationId,
    name: user.organizationName,
  }
}

// Require organization - throw if no org
export async function requireOrganization() {
  const org = await getCurrentOrganization()
  if (!org) {
    throw new Error('请先创建团队')
  }
  return org
}
