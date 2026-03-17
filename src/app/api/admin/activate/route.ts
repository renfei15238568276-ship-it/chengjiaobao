import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const now = new Date().toISOString();
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  
  await admin.from("subscriptions").upsert({
    user_id: userId,
    plan_code: "personal",
    plan_name: "个人版",
    status: "active",
    starts_at: now,
    expires_at: expires,
  }, { onConflict: "user_id" });

  return NextResponse.redirect(new URL("/admin/users?activated=true", req.url));
}
