"use client";

import { useState, useEffect } from "react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Poll for notifications
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/notifications/count");
        const data = await res.json();
        setUnreadCount(data.count || 0);
      } catch (e) {
        // Ignore
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 text-white/80 hover:bg-white/10"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications/read-all", { method: "POST" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <h3 className="font-semibold">通知</h3>
        <button onClick={markAllRead} className="text-sm text-cyan-600 hover:underline">
          全部已读
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-slate-500">加载中...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-slate-500">暂无通知</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`border-b border-slate-50 p-4 hover:bg-slate-50 ${
                !n.read ? "bg-cyan-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!n.read ? "bg-cyan-500" : "bg-slate-300"}`} />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{n.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(n.createdAt).toLocaleString("zh-CN")}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-100 p-3">
        <a href="/notifications" className="block text-center text-sm text-cyan-600 hover:underline">
          查看全部通知 →
        </a>
      </div>
    </div>
  );
}
