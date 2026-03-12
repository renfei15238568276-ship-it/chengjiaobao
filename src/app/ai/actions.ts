"use server";

import { redirect } from "next/navigation";
import { saveAiRecord } from "@/lib/customer-service";
import { saveAiRecordSchema } from "@/lib/followup-schemas";

export type SaveAiState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function saveAiRecordAction(
  _prevState: SaveAiState,
  formData: FormData,
): Promise<SaveAiState> {
  const raw = {
    customerId: String(formData.get("customerId") ?? ""),
    generationType: String(formData.get("generationType") ?? ""),
    tone: String(formData.get("tone") ?? ""),
    concern: String(formData.get("concern") ?? ""),
    goal: String(formData.get("goal") ?? ""),
    generatedCopy: String(formData.get("generatedCopy") ?? ""),
  };

  const parsed = saveAiRecordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "AI 记录还不完整，先生成内容再保存。",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await saveAiRecord(parsed.data);
  redirect(`/customers/${parsed.data.customerId}`);
}
