"use client";

import { useState } from "react";
import { inviteTeamMember, removeTeamMember, updateMemberRole } from "./actions";

type Member = {
  id: string;
  role: string;
  user: {
    id: string;
    username: string;
    display_name: string | null;
    email: string | null;
  };
};

type Props = {
  members: Member[];
  currentUser: any;
};

export function TeamMembersList({ members, currentUser }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const result = await inviteTeamMember(email, role);
      setMessage({
        type: result.ok ? "success" : "error",
        text: result.message,
      });
      if (result.ok) {
        setEmail("");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const currentUserRole = members.find(
    (m) => m.user?.id === currentUser?.id
  )?.role;

  const canInvite = currentUserRole === "owner" || currentUserRole === "admin";

  return (
    <div className="mt-6">
      {canInvite ? (
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              邮箱地址
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              角色
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-cyan-500"
            >
              <option value="member">成员</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full rounded-xl bg-cyan-400 px-4 py-2 font-medium text-slate-900 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "添加中..." : "邀请成员"}
          </button>
          {message && (
            <p
              className={`text-sm ${
                message.type === "success" ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          只有管理员可以邀请新成员
        </p>
      )}
    </div>
  );
}
