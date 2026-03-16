"use server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function getAllUsers() {
  const admin = getSupabaseAdmin();
  const { data: users } = await admin
    .from("users")
    .select("id, username, display_name, email, role, created_at")
    .order("created_at", { ascending: false });
  return users || [];
}

export async function updateUserRole(userId: string, role: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("users")
    .update({ role })
    .eq("id", userId);
  return { ok: !error, error };
}

export async function deleteUser(userId: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("users")
    .delete()
    .eq("id", userId);
  return { ok: !error, error };
}

export async function createSubscriptionForUser(userId: string, planCode: string) {
  const admin = getSupabaseAdmin();
  const now = new Date().toISOString();
  const planName = planCode === "personal" ? "个人版" : planCode === "team" ? "团队版" : "私有部署版";
  
  // Check if subscription already exists
  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  
  if (existing) {
    // Update existing
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await admin
      .from("subscriptions")
      .update({
        plan_code: planCode,
        plan_name: planName,
        status: "active",
        expires_at: expires,
      })
      .eq("user_id", userId);
    return { ok: !error, error };
  } else {
    // Create new
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await admin.from("subscriptions").insert({
      user_id: userId,
      plan_code: planCode,
      plan_name: planName,
      status: "active",
      starts_at: now,
      expires_at: expires,
    });
    return { ok: !error, error };
  }
}
