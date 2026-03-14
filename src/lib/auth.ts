import { cookies } from "next/headers";
import { createClient } from '@supabase/supabase-js'
import { getSupabaseAdmin } from './supabase-admin'

export const AUTH_COOKIE = "chengjiaobao_user";
export const AUTH_ROLE_COOKIE = "chengjiaobao_role";
export const AUTH_USERNAME_COOKIE = "chengjiaobao_username";
export const AUTH_USER_ID_COOKIE = "chengjiaobao_user_id";
export const AUTH_ORG_ID_COOKIE = "auth-org-id";
export const AUTH_ORG_NAME_COOKIE = "auth-org-name";

// Supabase client (for browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

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

// New functions for SaaS - Get current user with org info
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

// Get current organization from Supabase
export async function getCurrentOrganization() {
  const user = await getCurrentUser()
  if (!user?.organizationId) return null
  
  try {
    const admin = getSupabaseAdmin()
    const { data: membership } = await admin
      .from('organization_members')
      .select('*, organization:organizations(*), user:users(*)')
      .eq('user_id', user.id)
      .single()
    
    return membership
  } catch (e) {
    return null
  }
}

// Require organization - throw if no org
export async function requireOrganization() {
  const org = await getCurrentOrganization()
  if (!org) {
    throw new Error('No organization found')
  }
  return org
}
