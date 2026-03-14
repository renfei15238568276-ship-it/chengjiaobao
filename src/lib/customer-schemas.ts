import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().trim().min(2, "客户姓名至少 2 个字"),
  company: z.string().trim().min(2, "公司或门店名至少 2 个字"),
  contactHandle: z.string().trim().min(2, "请填写联系方式"),
  source: z.string().trim().min(2, "请填写来源渠道"),
  stage: z.string().trim().min(2, "请选择当前阶段"),
  estimatedAmount: z.string().trim().min(1, "请填写预计金额"),
  note: z.string().trim().min(4, "备注至少写 4 个字"),
  nextFollowUp: z.string().trim().min(1, "请选择下次跟进时间"),
});

export const updateCustomerSchema = createCustomerSchema.extend({
  id: z.string().trim().min(1, "缺少客户 ID"),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
