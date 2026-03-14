"use server";

import { generateSalesCopy } from "@/lib/ai";

export type GenerateAiState = {
  success: boolean;
  message?: string;
  generatedCopy?: string;
  provider?: string;
};

export async function generateAiCopyAction(
  _prevState: GenerateAiState,
  formData: FormData,
): Promise<GenerateAiState> {
  const input = {
    customerName: String(formData.get("customerName") ?? ""),
    company: String(formData.get("company") ?? ""),
    stage: String(formData.get("stage") ?? ""),
    concern: String(formData.get("concern") ?? ""),
    goal: String(formData.get("goal") ?? ""),
    tone: String(formData.get("tone") ?? ""),
    generationType: String(formData.get("generationType") ?? ""),
  };

  const result = await generateSalesCopy(input);

  return {
    success: true,
    generatedCopy: result.content,
    provider: result.provider,
    message: result.provider === "openrouter" ? "已通过 OpenRouter 生成。" : "当前未配置 AI key，已自动回退到本地生成。",
  };
}
