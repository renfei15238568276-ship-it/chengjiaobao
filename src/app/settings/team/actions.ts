"use server";

import { getCurrentUser } from "@/lib/auth";
import { 
  getUserOrganization, 
  getOrganizationMembers, 
  addOrganizationMember, 
  removeOrganizationMember,
  updateMemberRole as updateMemberRoleFromFile
} from "@/lib/file-orgs";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
    }
  } catch (e) {}
  return []
}

export { getCurrentUser };

export async function getTeamMembers(): Promise<any[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  
  const organization = getUserOrganization(user.id);
  if (!organization) return [];
  
  const memberships = getOrganizationMembers(organization.id);
  
  const users = getUsers() as any[];
  
  return memberships.map((m: any) => {
    const u = users.find((uu: any) => uu.id === m.userId);
    return {
      id: m.id,
      organization_id: m.organizationId,
      user_id: m.userId,
      role: m.role,
      created_at: m.createdAt,
      user: u ? {
        id: u.id,
        username: u.username,
        display_name: u.displayName,
        email: null,
        created_at: u.createdAt
      } : { id: '', username: '', display_name: null, email: null, created_at: '' }
    };
  });
}

export async function inviteTeamMember(email: string, role: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authenticated" };
  
  const organization = getUserOrganization(user.id);
  if (!organization) {
    return { ok: false, message: "No organization found" };
  }
  
  // Find user by email/username
  const users = getUsers();
  const existingUser = users.find((u: any) => u.username === email || u.email === email);
  
  if (existingUser) {
    addOrganizationMember(organization.id, existingUser.id, role);
    return { ok: true, message: "Team member added!" };
  }
  
  return { ok: true, message: "User not found. They need to register first." };
}

export async function removeTeamMember(memberId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authenticated" };
  
  const organization = getUserOrganization(user.id);
  if (!organization) {
    return { ok: false, message: "No organization found" };
  }
  
  const memberships = getOrganizationMembers(organization.id);
  const membership = memberships.find(m => m.id === memberId);
  
  if (!membership) {
    return { ok: false, message: "Member not found" };
  }
  
  if (membership.role === 'owner') {
    return { ok: false, message: "Cannot remove owner" };
  }
  
  removeOrganizationMember(memberId);
  return { ok: true, message: "Team member removed" };
}

export async function updateMemberRole(memberId: string, newRole: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authenticated" };
  
  const organization = getUserOrganization(user.id);
  if (!organization) {
    return { ok: false, message: "No organization found" };
  }
  
  const memberships = getOrganizationMembers(organization.id);
  const currentMembership = memberships.find(m => m.userId === user.id);
  
  if (!currentMembership || currentMembership.role !== 'owner') {
    return { ok: false, message: "Only owner can change roles" };
  }
  
  updateMemberRole(memberId, newRole);
  return { ok: true, message: "Role updated" };
}
