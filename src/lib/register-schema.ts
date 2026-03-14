import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().trim().min(3, "用户名至少 3 位").max(32, "用户名别太长"),
    displayName: z.string().trim().min(2, "昵称至少 2 个字").max(32, "昵称别太长"),
    organizationName: z.string().trim().min(2, "公司/团队名称至少 2 个字").max(64, "名称别太长"),
    password: z.string().trim().min(6, "密码至少 6 位").max(64, "密码别太长"),
    confirmPassword: z.string().trim().min(6, "请再次输入密码"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "两次输入的密码不一致",
      });
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;
