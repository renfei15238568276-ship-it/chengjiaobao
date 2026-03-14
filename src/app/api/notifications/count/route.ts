import { NextResponse } from "next/server";
import { getUnreadNotificationCount } from "@/lib/notifications";

export async function GET() {
  try {
    const count = await getUnreadNotificationCount();
    return NextResponse.json({ count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
