import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { getTeamMembers, getCurrentUser } from "./actions";
import { TeamMembersList } from "./team-members-list";

export default async function TeamSettingsPage() {
  const members = await getTeamMembers();
  const currentUser = await getCurrentUser();

  return (
    <ProtectedShell>
      <AppShell
        eyebrow="成交宝 / 团队设置"
        title="团队成员"
        description="管理你的团队成员，邀请新成员加入或调整权限。"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Invite Form */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold">邀请新成员</h3>
            <p className="mt-1 text-sm text-slate-500">
              邀请团队成员一起跟进客户
            </p>
            <TeamMembersList members={members} currentUser={currentUser} />
          </div>

          {/* Members List */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-semibold">团队成员 ({members.length})</h3>
              
              {members.length === 0 ? (
                <p className="mt-4 text-slate-500">暂无团队成员</p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {members.map((member: any) => (
                    <li key={member.id} className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 font-medium">
                          {member.user?.display_name?.[0] || member.user?.username?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-medium">
                            {member.user?.display_name || member.user?.username}
                          </p>
                          <p className="text-sm text-slate-500">
                            {member.user?.email || "未设置邮箱"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          member.role === "owner" 
                            ? "bg-amber-100 text-amber-700"
                            : member.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {member.role === "owner" ? "所有者" : 
                           member.role === "admin" ? "管理员" : "成员"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedShell>
  );
}
