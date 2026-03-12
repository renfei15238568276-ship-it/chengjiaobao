import { createHash } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { RegisterInput } from "@/lib/register-schema";

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

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function registerUser(input: RegisterInput) {
  const admin = getSupabaseAdmin();

  const { data: existing, error: existingError } = await admin
    .from("users")
    .select("id")
    .eq("username", input.username)
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (existingError) {
    throw existingError;
  }

  if (existing?.id) {
    return {
      ok: false as const,
      message: "这个用户名已经被占了，换一个。",
    };
  }

  const { data, error } = await admin
    .from("users")
    .insert({
      username: input.username,
      password_hash: hashPassword(input.password),
      display_name: input.displayName,
      role: "user",
      status: "active",
    })
    .select("id, username, display_name, role")
    .single<UserRow>();

  if (error || !data) {
    throw error ?? new Error("Failed to register user");
  }

  return {
    ok: true as const,
    user: data,
  };
}

export async function ensureBuiltinAdmin() {
  const admin = getSupabaseAdmin();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "12345678";

  const { error } = await admin.from("users").upsert(
    {
      username: "admin",
      password_hash: hashPassword(adminPassword),
      display_name: "管理员",
      role: "admin",
      status: "active",
    },
    { onConflict: "username" },
  );

  if (error) {
    throw error;
  }
}

export async function verifyUserLogin(username: string, password: string) {
  if (username === "admin") {
    await ensureBuiltinAdmin();
  }

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

  if (data.password_hash !== hashPassword(password)) {
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

  return ((data ?? []) as UserRow[]).map(
    (item): UserSummary => ({
      id: item.id,
      username: item.username,
      displayName: item.display_name ?? item.username,
      role: item.role ?? "user",
      status: item.status ?? "active",
      createdAt: item.created_at ?? null,
    }),
  );
}
