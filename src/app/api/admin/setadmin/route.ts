import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  await admin.from("users").update({ role: "admin" }).eq("id", userId);

  return NextResponse.redirect(new URL("/admin/users?admin=true", req.url));
}
