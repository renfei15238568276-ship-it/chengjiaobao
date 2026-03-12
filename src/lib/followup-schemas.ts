import { z } from "zod";

export const addFollowUpSchema = z.object({
  customerId: z.string().trim().min(1),
  type: z.string().trim().min(1, "请选择跟进类型"),
  content: z.string().trim().min(4, "跟进内容至少 4 个字"),
});

export const saveAiRecordSchema = z.object({
  customerId: z.string().trim().min(1),
  generationType: z.string().trim().min(1),
  tone: z.string().trim().min(1),
  concern: z.string().trim().min(2),
  goal: z.string().trim().min(2),
  generatedCopy: z.string().trim().min(8),
});

export type AddFollowUpInput = z.infer<typeof addFollowUpSchema>;
export type SaveAiRecordInput = z.infer<typeof saveAiRecordSchema>;
