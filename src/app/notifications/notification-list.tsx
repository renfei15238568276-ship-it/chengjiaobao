"use client";

import { useState } from "react";
import Link from "next/link";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
};

export function NotificationList({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "POST" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "follow_up_reminder":
        return "⏰";
      case "customer_added":
        return "👤";
      case "team_invite":
        return "👥";
      case "subscription_expiring":
        return "⚠️";
      default:
        return "📢";
    }
  };

  const getLink = (type: string, data: any) => {
    switch (type) {
      case "follow_up_reminder":
        return data?.customerId ? `/customers/${data.customerId}` : "/customers";
      case "customer_added":
        return "/customers";
      case "team_invite":
        return "/settings/team";
      default:
        return "/dashboard";
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-4xl">🔔</div>
        <p className="mt-4 text-slate-500">暂无通知</p>
        <Link href="/dashboard" className="mt-4 inline-block text-cyan-600 hover:underline">
          返回控制台
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <h3 className="font-semibold">通知列表</h3>
        <p className="text-sm text-slate-500">
          {unreadCount} 条未读
        </p>
      </div>

      <ul className="divide-y divide-slate-50">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-4 transition hover:bg-slate-50 ${
              !notification.read ? "bg-cyan-50/50" : ""
            }`}
          >
            <Link
              href={getLink(notification.type, notification.data)}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className="flex gap-4"
            >
              <span className="text-2xl">{getIcon(notification.type)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${!notification.read ? "text-slate-900" : "text-slate-700"}`}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {new Date(notification.createdAt).toLocaleString("zh-CN")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
