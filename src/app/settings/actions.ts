"use server";

import { getCurrentSession } from "@/lib/auth";
import { changePassword } from "@/lib/user-service";

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

  await changePassword(session.userId, password);
  return { success: true, message: "密码已更新。" };
}
