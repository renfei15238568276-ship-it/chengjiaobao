import { createHash } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { registerSchema, type RegisterInput } from "@/lib/register-schema";

type UserRow = {
  id: string;
  username: string;
  display_name: string | null;
  role?: string | null;
  password_hash?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export type UserSummary = {
  id: string;
  username: string;
  displayName: string;
  role: string;
  status: string;
  createdAt: string | null;
};

// Simple hash - just use the password directly as stored
export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

// Check if password matches (supports both old and new formats)
export function verifyPasswordHash(storedHash: string, password: string): boolean {
  // New format: plain hex string
  const newHash = hashPassword(password);
  if (storedHash === newHash) return true;
  
  // Old format: sha256_<base64>
  const oldFormat = "sha256_" + Buffer.from(password).toString("base64");
  if (storedHash === oldFormat) return true;
  
  return false;
}

export async function registerUser(input: RegisterInput) {
  const admin = getSupabaseAdmin();

  // Check if username exists
  const { data: existing } = await admin
    .from("users")
    .select("id")
    .eq("username", input.username)
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    return { ok: false as const, message: "用户名已被占用" };
  }

  // Create new user with hashed password
  const { data: user, error: userError } = await admin
    .from("users")
    .insert({
      username: input.username,
      password_hash: hashPassword(input.password),
      display_name: input.displayName || input.username,
      role: "user",
      status: "active",
    })
    .select("id, username, display_name, role")
    .single<UserRow>();

  if (userError || !user) {
    return { ok: false as const, message: "创建用户失败: " + userError?.message };
  }

  return {
    ok: true as const,
    user: { id: user.id, username: user.username, displayName: user.display_name || user.username },
    organization: { id: "1", name: "默认团队" },
  };
}

export async function verifyUserLogin(username: string, password: string) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("users")
    .select("id, username, display_name, role, password_hash")
    .eq("username", username)
    .limit(1)
    .maybeSingle<UserRow>();

  if (error) {
    throw error;
  }

  if (!data?.id || !data.password_hash) {
    return null;
  }

  if (!verifyPasswordHash(data.password_hash, password)) {
    return null;
  }

  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name ?? data.username,
    role: data.role ?? "user",
  };
}

export async function listUsers() {
  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .select("id, username, display_name, role, status, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => ({
    id: item.id,
    username: item.username,
    displayName: item.display_name ?? item.username,
    role: item.role ?? "user",
    status: item.status ?? "active",
    createdAt: item.created_at ?? null,
  }));
}

export async function changePassword(userId: string, nextPassword: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("users")
    .update({ password_hash: hashPassword(nextPassword) })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function getUserById(userId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .select("id, username, display_name, role, status, created_at")
    .eq("id", userId)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name ?? data.username,
    role: data.role ?? "user",
    status: data.status ?? "active",
    createdAt: data.created_at ?? null,
  };
}

export async function setUserRole(userId: string, role: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("users")
    .update({ role })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function deleteUser(userId: string) {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("users")
    .delete()
    .eq("id", userId);

  if (error) {
    throw error;
  }
}
