import { getCurrentSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export class SubscriptionRequiredError extends Error {
  constructor(message = "当前账号还未开通套餐") {
    super(message);
    this.name = "SubscriptionRequiredError";
  }
}

type SubscriptionRow = {
  id: string;
  user_id: string;
  plan_code: string;
  plan_name: string;
  status: string;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AccountSubscription = {
  id: string;
  planCode: string;
  planName: string;
  status: "active" | "expired" | "pending" | "cancelled";
  startsAt: string | null;
  expiresAt: string | null;
};

function normalizeStatus(status: string, expiresAt: string | null): AccountSubscription["status"] {
  if (status === "cancelled") return "cancelled";
  if (status === "pending") return "pending";
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) return "expired";
  return "active";
}

export function formatRemainingTime(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "已到期";

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes} 分 ${seconds} 秒`;
}

function getDemoSubscription(): AccountSubscription {
  return {
    id: "demo",
    planCode: "demo",
    planName: "演示版",
    status: "active",
    startsAt: null,
    expiresAt: null,
  };
}

export async function getCurrentUserSubscription(): Promise<AccountSubscription | null> {
  const session = await getCurrentSession();
  if (!session?.userId) return null;
  return getUserSubscription(session.userId);
}

export async function getUserSubscription(userId: string): Promise<AccountSubscription | null> {
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    // Supabase not configured - return demo subscription
    return getDemoSubscription();
  }
  
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, user_id, plan_code, plan_name, status, starts_at, expires_at, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    planCode: data.plan_code,
    planName: data.plan_name,
    status: normalizeStatus(data.status, data.expires_at),
    startsAt: data.starts_at,
    expiresAt: data.expires_at,
  };
}

export async function hasActiveSubscription() {
  const session = await getCurrentSession();
  if (!session?.userId) return false;
  
  const sub = await getUserSubscription(session.userId);
  if (!sub) return false;
  
  return sub.status === "active";
}

export async function requireActiveSubscription() {
  const has = await hasActiveSubscription();
  if (!has) {
    throw new SubscriptionRequiredError();
  }
}
