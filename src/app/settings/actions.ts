"use server";

import { getCurrentSession } from "@/lib/auth";

export type ChangePasswordState = {
  success: boolean;
  message?: string;
};

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await getCurrentSession();
  console.log("Session:", JSON.stringify(session));
  
  if (!session?.userId || !session?.username) {
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

  // Hash password using SHA256
  const passwordHash = await hashPassword(password);

  // Use direct REST API to update password
  const supabaseUrl = "https://gdzdwwwagueplbignhxy.supabase.co";
  const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemR3d3dhZ3VlcGxiaWduaHh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMxNDUwOSwiZXhwIjoyMDg4ODkwNTA5fQ.zNbc23CEjpdE1-oS2PAVDuVghCOeEyT4F_qa4vjNX8M";

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/users?username=eq.${session.username}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({ password_hash: passwordHash }),
    });

    console.log("Password update response:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Password change error:", response.status, errorText);
      return { success: false, message: `修改密码失败: ${response.status}` };
    }

    return { success: true, message: "密码已更新。" };
  } catch (error) {
    console.error("Password change exception:", error);
    return { success: false, message: "修改密码失败，请重试。" };
  }
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
