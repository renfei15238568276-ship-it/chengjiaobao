"use server";

import { registerSchema } from "@/lib/register-schema";
import { registerUser } from "@/lib/user-service";

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

  const result = await registerUser(parsed.data);

  if (!result.ok) {
    return {
      success: false,
      message: result.message,
      values: {
        username: raw.username,
        displayName: raw.displayName,
        organizationName: raw.organizationName,
        password: "",
        confirmPassword: "",
      },
    };
  }

  return {
    success: true,
    message: `注册成功！已为你创建"${result.organization.name}"团队，快去登录体验吧！`,
    values: {
      username: "",
      displayName: "",
      organizationName: "",
      password: "",
      confirmPassword: "",
    },
  };
}
