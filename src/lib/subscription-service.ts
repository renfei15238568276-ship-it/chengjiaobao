import { getCurrentSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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

export async function getCurrentUserSubscription(): Promise<AccountSubscription | null> {
  const session = await getCurrentSession();
  if (!session?.userId) return null;
  return getUserSubscription(session.userId);
}

export async function getUserSubscription(userId: string): Promise<AccountSubscription | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("subscriptions")
    .select("id, user_id, plan_code, plan_name, status, starts_at, expires_at, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionRow>();

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
