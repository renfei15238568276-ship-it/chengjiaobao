import { getSupabaseAdmin } from "./supabase-admin";
import { getCurrentUser } from "./auth";

export type NotificationType = 
  | "follow_up_reminder"
  | "customer_added"
  | "team_invite"
  | "subscription_expiring"
  | "lead_from_website";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// Get notifications for current user
export async function getNotifications(limit = 20) {
  const user = await getCurrentUser();
  if (!user) return [];
  
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return []; // Return empty if not configured
  }

  const { data, error } = await admin
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return (data || []).map(formatNotification);
}

// Mark notification as read
export async function markNotificationRead(notificationId: string) {
  const user = await getCurrentUser();
  if (!user) return;
  
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return;
  }

  await admin
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);
}

// Mark all as read
export async function markAllNotificationsRead() {
  const user = await getCurrentUser();
  if (!user) return;
  
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return;
  }

  await admin
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);
}

// Create a notification (called by other services)
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: Record<string, any>
) {
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return;
  }

  const { error } = await admin.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    data: data || {},
    read: false,
  });

  if (error) {
    console.error("Error creating notification:", error);
  }
}

// Check and create follow-up reminders
export async function createFollowUpReminders() {
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return;
  }

  // Find customers with upcoming follow-ups
  const { data: customers } = await admin
    .from("customers")
    .select("*, organization:organizations(*), organization_members(user_id)")
    .lte("next_follow_up_at", new Date().toISOString())
    .gte("next_follow_up_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  for (const customer of customers || []) {
    for (const member of customer.organization_members || []) {
      await createNotification(
        member.user_id,
        "follow_up_reminder",
        "跟进提醒",
        `客户"${customer.name}"需要跟进`,
        { customerId: customer.id }
      );
    }
  }
}

// Get unread count
export async function getUnreadNotificationCount() {
  const user = await getCurrentUser();
  if (!user) return 0;
  
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return 0;
  }

  const { count } = await admin
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return count || 0;
}

function formatNotification(row: any): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    data: row.data,
    read: row.read,
    createdAt: row.created_at,
  };
}
