"use server";

import { revalidatePath } from "next/cache";
import { appendPaymentApplication } from "@/lib/payment-store";
import type { PaymentApplicationRecord } from "@/lib/types";

export type PaymentFormState = {
  success: boolean;
  message: string;
};

const initialState: PaymentFormState = {
  success: false,
  message: "",
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitPaymentApplication(
  _prevState: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> {
  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  const wechat = getString(formData, "wechat");
  const plan = getString(formData, "plan");
  const payMethod = getString(formData, "payMethod");
  const amount = getString(formData, "amount");
  const paidAt = getString(formData, "paidAt");
  const screenshotNote = getString(formData, "screenshotNote");
  const note = getString(formData, "note");

  if (!name || !phone || !wechat || !plan || !payMethod || !amount || !paidAt) {
    return {
      success: false,
      message: "请把姓名、手机号、微信号、套餐、支付方式、金额、付款时间填完整。",
    };
  }

  if (!["personal", "team", "private"].includes(plan)) {
    return {
      success: false,
      message: "套餐信息不合法，请重新选择。",
    };
  }

  if (!["wechat", "alipay"].includes(payMethod)) {
    return {
      success: false,
      message: "支付方式不合法，请重新选择。",
    };
  }

  const record: PaymentApplicationRecord = {
    id: `pay_${Date.now()}`,
    name,
    phone,
    wechat,
    plan: plan as PaymentApplicationRecord["plan"],
    payMethod: payMethod as PaymentApplicationRecord["payMethod"],
    amount,
    paidAt,
    screenshotNote,
    note,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await appendPaymentApplication(record);
  revalidatePath("/pay");

  return {
    success: true,
    message: "提交成功，我们会尽快核对付款并为你开通。",
  };
}

export { initialState };
