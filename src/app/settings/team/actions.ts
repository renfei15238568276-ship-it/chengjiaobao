"use server";

import { getCurrentUser } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export { getCurrentUser };

export async function getTeamMembers() {
  const user = await getCurrentUser();
  if (!user) return [];
  
  const admin = getSupabaseAdmin();

  // Get user's organization
  const { data: membership } = await admin
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return [];
  }

  // Get all members of the organization
  const { data: members } = await admin
    .from("organization_members")
    .select("*, user:users(id, username, display_name, email, created_at)")
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: true });

  return members || [];
}

export async function inviteTeamMember(email: string, role: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authenticated" };
  
  const admin = getSupabaseAdmin();

  // Get user's organization
  const { data: membership } = await admin
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return { ok: false, message: "No organization found" };
  }

  // Only owners and admins can invite
  if (!["owner", "admin"].includes(membership.role)) {
    return { ok: false, message: "No permission to invite members" };
  }

  // Check if user already exists
  const { data: existingUser } = await admin
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    // Add existing user to organization
    const { error } = await admin
      .from("organization_members")
      .insert({
        organization_id: membership.organization_id,
        user_id: existingUser.id,
        role,
      });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Team member added!" };
  }

  // TODO: Send invitation email
  return { ok: true, message: "Invitation sent (setup pending)" };
}

export async function removeTeamMember(memberId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authenticated" };
  
  const admin = getSupabaseAdmin();

  // Get user's organization
  const { data: membership } = await admin
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return { ok: false, message: "No organization found" };
  }

  // Only owners and admins can remove
  if (!["owner", "admin"].includes(membership.role)) {
    return { ok: false, message: "No permission to remove members" };
  }

  const { error } = await admin
    .from("organization_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Team member removed" };
}

export async function updateMemberRole(memberId: string, newRole: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authenticated" };
  
  const admin = getSupabaseAdmin();

  // Get user's organization
  const { data: membership } = await admin
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return { ok: false, message: "No organization found" };
  }

  // Only owners can change roles
  if (membership.role !== "owner") {
    return { ok: false, message: "Only owner can change roles" };
  }

  const { error } = await admin
    .from("organization_members")
    .update({ role: newRole })
    .eq("id", memberId);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Role updated" };
}
