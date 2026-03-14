import { NextResponse } from "next/server";
import { markAllNotificationsRead } from "@/lib/notifications";

export async function POST() {
  try {
    await markAllNotificationsRead();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
