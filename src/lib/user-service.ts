import { createHash } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { registerSchema, type RegisterInput } from "@/lib/register-schema";

const TRIAL_DAYS = 7; // 7 days trial

type UserRow = {
  id: string;
  username: string;
  display_name: string | null;
  role?: string | null;
  password_hash?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type OrganizationRow = {
  id: string;
  name: string;
  slug: string;
  plan: string;
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

// New function: Register user with organization
export async function registerUserWithOrganization(input: RegisterInput) {
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

  // Generate slug from organization name
  const slug = input.organizationName
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") + "-" + Date.now();

  // Create organization first
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: input.organizationName,
      slug,
      plan: "free",
    })
    .select()
    .single<OrganizationRow>();

  if (orgError || !org) {
    return { ok: false as const, message: "创建团队失败: " + orgError?.message };
  }

  // Create user
  const { data: user, error: userError } = await admin
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

  if (userError || !user) {
    // Rollback organization
    await admin.from("organizations").delete().eq("id", org.id);
    return { ok: false as const, message: "创建用户失败: " + userError?.message };
  }

  // Add user as owner of organization
  const { error: memberError } = await admin
    .from("organization_members")
    .insert({
      organization_id: org.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) {
    return { ok: false as const, message: "添加团队成员失败: " + memberError?.message };
  }

  // Create trial subscription
  const startsAt = new Date();
  const expiresAt = new Date(startsAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  await admin.from("subscriptions").insert({
    organization_id: org.id,
    plan_code: "trial",
    plan_name: `试用版（${TRIAL_DAYS}天）`,
    status: "active",
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
  });

  return {
    ok: true as const,
    user,
    organization: org,
  };
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

  const startsAt = new Date();
  const expiresAt = new Date(startsAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  const { error: subscriptionError } = await admin.from("subscriptions").insert({
    user_id: data.id,
    plan_code: "trial",
    plan_name: `试用版（${TRIAL_DAYS}天）`,
    status: "active",
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
  });

  if (subscriptionError) {
    throw subscriptionError;
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

export async function changePassword(userId: string, nextPassword: string) {
  const { error } = await getSupabaseAdmin()
    .from("users")
    .update({ password_hash: hashPassword(nextPassword) })
    .eq("id", userId);

  if (error) throw error;
}
