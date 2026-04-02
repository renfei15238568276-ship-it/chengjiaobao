"use server";

import { redirect } from "next/navigation";
import { updateCustomerSchema } from "@/lib/customer-schemas";
import { updateCustomer } from "@/lib/customer-service";

export type UpdateCustomerState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  values?: Record<string, string>;
};

export async function updateCustomerAction(
  _prevState: UpdateCustomerState,
  formData: FormData,
): Promise<UpdateCustomerState> {
  const raw = {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
    contactHandle: String(formData.get("contactHandle") ?? ""),
    source: String(formData.get("source") ?? ""),
    stage: String(formData.get("stage") ?? ""),
    estimatedAmount: String(formData.get("estimatedAmount") ?? ""),
    note: String(formData.get("note") ?? ""),
    nextFollowUp: String(formData.get("nextFollowUp") ?? ""),
  };

  const parsed = updateCustomerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "客户资料还没填完整。",
      errors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  }

  await updateCustomer(parsed.data.id, parsed.data);
  redirect(`/customers/${parsed.data.id}`);
}
