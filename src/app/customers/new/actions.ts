"use server";

import { redirect } from "next/navigation";
import { createCustomerSchema } from "@/lib/customer-schemas";
import { createCustomer } from "@/lib/customer-service";
import { SubscriptionRequiredError, requireActiveSubscription } from "@/lib/subscription-service";

export type CreateCustomerState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  values?: Record<string, string>;
};

export async function createCustomerAction(
  _prevState: CreateCustomerState,
  formData: FormData,
): Promise<CreateCustomerState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
    contactHandle: String(formData.get("contactHandle") ?? ""),
    source: String(formData.get("source") ?? ""),
    stage: String(formData.get("stage") ?? ""),
    estimatedAmount: String(formData.get("estimatedAmount") ?? ""),
    note: String(formData.get("note") ?? ""),
    nextFollowUp: String(formData.get("nextFollowUp") ?? ""),
  };

  const parsed = createCustomerSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "表单没填完整，先把必填项补齐。",
      errors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  }

  try {
    await requireActiveSubscription();
    await createCustomer(parsed.data);
  } catch (error) {
    if (error instanceof SubscriptionRequiredError) {
      return {
        success: false,
        message: "当前账号还未开通套餐，先去付款开通后再新建客户。",
        values: raw,
      };
    }
    throw error;
  }

  redirect(`/customers?created=${encodeURIComponent(parsed.data.name)}`);
}
