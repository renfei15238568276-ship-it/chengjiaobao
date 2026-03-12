"use server";

import { revalidatePath } from "next/cache";
import { deleteCustomer } from "@/lib/customer-service";

export async function deleteCustomerAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteCustomer(id);
  revalidatePath("/customers");
}
