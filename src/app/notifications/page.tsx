import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { getNotifications } from "@/lib/notifications";
import { NotificationList } from "./notification-list";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <ProtectedShell>
      <AppShell
        eyebrow="成交宝 / 通知"
        title="通知中心"
        description="查看所有跟进提醒和系统通知"
      >
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <NotificationList initialNotifications={notifications} />
        </div>
      </AppShell>
    </ProtectedShell>
  );
}
