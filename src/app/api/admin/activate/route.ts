import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  // Use Supabase client with service role
  const supabase = createClient(
    "https://gdzdwwwagueplbignhxy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemR3d3dhZ3VlcGxiaWduaHh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMxNDUwOSwiZXhwIjoyMDg4ODkwNTA5fQ.zNbc23CEjpdE1-oS2PAVDuVghCOeEyT4F_qa4vjNX8M"
  );

  const now = new Date();
  const expires = new Date(now.getTime() + plan.months * 30 * 24 * 60 * 60 * 1000);

  // First delete existing subscription
  await supabase.from("subscriptions").delete().eq("user_id", userId);

  // Then insert new one
  const { error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    plan_code: planCode,
    plan_name: plan.name,
    status: "active",
    starts_at: now.toISOString(),
    expires_at: expires.toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/users?activated=true", req.url));
}
