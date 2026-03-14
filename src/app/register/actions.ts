"use server";

import { registerSchema } from "@/lib/register-schema";
import { createOrganization } from "@/lib/file-orgs";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
    }
  } catch (e) {}
  return []
}

function saveUsers(users: any[]) {
  const dir = path.dirname(USERS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

export type RegisterState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  values?: Record<string, string>;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const raw = {
    username: String(formData.get("username") ?? ""),
    displayName: String(formData.get("displayName") ?? ""),
    organizationName: String(formData.get("organizationName") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "注册信息没填完整。",
      errors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  }

  // Check if user already exists
  const users = getUsers();
  if (users.find((u: any) => u.username === parsed.data.username)) {
    return {
      success: false,
      message: "用户名已经被占了，换一个吧。",
      values: raw,
    };
  }

  // Create new user (local mode)
  const userId = 'user_' + Date.now();
  
  // Create organization using file storage
  const { organization } = createOrganization(parsed.data.organizationName, userId);
  
  const newUser = {
    id: userId,
    username: parsed.data.username,
    displayName: parsed.data.displayName,
    passwordHash: hashPassword(parsed.data.password),
    organizationName: parsed.data.organizationName,
    organizationId: organization.id,
    role: 'owner',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    message: `注册成功！已为你创建"${parsed.data.organizationName}"团队，快去登录体验吧！`,
    values: {
      username: "",
      displayName: "",
      organizationName: "",
      password: "",
      confirmPassword: "",
    },
  };
}
