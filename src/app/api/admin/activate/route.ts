import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const planCode = req.nextUrl.searchParams.get("plan") || "personal_monthly";
  
  if (!userId) {
    return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
  }

  const planMap: Record<string, { name: string; months: number }> = {
    personal_monthly: { name: "个人版月付", months: 1 },
    personal_quarterly: { name: "个人版季付", months: 3 },
    personal_yearly: { name: "个人版年付", months: 12 },
    team_monthly: { name: "团队版月付", months: 1 },
    team_yearly: { name: "团队版年付", months: 12 },
  };

  const plan = planMap[planCode] || planMap.personal_monthly;

  const admin = getSupabaseAdmin();
  const now = new Date();
  const expires = new Date(now.getTime() + plan.months * 30 * 24 * 60 * 60 * 1000);
  
  await admin.from("subscriptions").upsert({
    user_id: userId,
    plan_code: planCode,
    plan_name: plan.name,
    status: "active",
    starts_at: now.toISOString(),
    expires_at: expires.toISOString(),
  }, { onConflict: "user_id" });

  return NextResponse.redirect(new URL("/admin/users?activated=true", req.url));
}
