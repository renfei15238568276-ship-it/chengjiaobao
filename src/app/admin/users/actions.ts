"use server";

import { revalidatePath } from "next/cache";
import { isAdminSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const planConfig = {
  personal_monthly: { name: "个人版月付", days: 30 },
  personal_yearly: { name: "个人版年付", days: 365 },
  team_monthly: { name: "团队版月付", days: 30 },
  team_yearly: { name: "团队版年付", days: 365 },
  private_custom: { name: "私有部署版", days: 365 },
} as const;

export async function grantSubscriptionAction(formData: FormData) {
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    throw new Error("Only admin can grant subscriptions");
  }

  const userId = String(formData.get("userId") ?? "").trim();
  const planCode = String(formData.get("planCode") ?? "").trim() as keyof typeof planConfig;

  if (!userId || !(planCode in planConfig)) {
    throw new Error("Invalid subscription request");
  }

  const config = planConfig[planCode];
  const startsAt = new Date();
  const expiresAt = new Date(startsAt.getTime() + config.days * 24 * 60 * 60 * 1000);

  const admin = getSupabaseAdmin();

  const { error } = await admin.from("subscriptions").insert({
    user_id: userId,
    plan_code: planCode,
    plan_name: config.name,
    status: "active",
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw error;
  }

  revalidatePath("/admin/users");
  revalidatePath("/settings");
}
