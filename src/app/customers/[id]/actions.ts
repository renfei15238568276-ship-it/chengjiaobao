"use server";

import { revalidatePath } from "next/cache";
import { addFollowUp } from "@/lib/customer-service";
import { addFollowUpSchema } from "@/lib/followup-schemas";

export type FollowUpState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  values?: Record<string, string>;
};

export async function addFollowUpAction(
  _prevState: FollowUpState,
  formData: FormData,
): Promise<FollowUpState> {
  const raw = {
    customerId: String(formData.get("customerId") ?? ""),
    type: String(formData.get("type") ?? ""),
    content: String(formData.get("content") ?? ""),
  };

  const parsed = addFollowUpSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "跟进内容没填完整。",
      errors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  }

  await addFollowUp(parsed.data.customerId, {
    type: parsed.data.type,
    content: parsed.data.content,
  });
  revalidatePath(`/customers/${parsed.data.customerId}`);

  return {
    success: true,
    message: "跟进记录已保存。",
    values: { customerId: parsed.data.customerId, type: "私聊", content: "" },
  };
}
