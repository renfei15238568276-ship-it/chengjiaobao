"use server";

import { getCurrentSession } from "@/lib/auth";
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

function saveUsers(users: any[]) {
  const dir = path.dirname(USERS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export type ChangePasswordState = {
  success: boolean;
  message?: string;
};

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return { success: false, message: "登录状态失效了，请重新登录。" };
  }

  const password = String(formData.get("password") ?? "").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

  if (password.length < 6) {
    return { success: false, message: "新密码至少 6 位。" };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "两次输入的新密码不一致。" };
  }

  const users = getUsers() as any[];
  const user = users.find(u => u.id === session.userId);
  
  if (!user) {
    return { success: false, message: "用户不存在。" };
  }
  
  user.passwordHash = hashPassword(password);
  saveUsers(users);
  
  return { success: true, message: "密码已更新。" };
}
