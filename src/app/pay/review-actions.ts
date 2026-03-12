"use server";

import { revalidatePath } from "next/cache";
import { readPaymentApplications } from "@/lib/payment-store";
import { promises as fs } from "fs";
import path from "path";
import { readMemberships, writeMemberships } from "@/lib/membership-store";
import type { MembershipRecord } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "payment-applications.json");

export async function updatePaymentStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!id || !["pending", "approved", "rejected"].includes(status)) {
    return;
  }

  const current = await readPaymentApplications();
  const next = current.map((item) => (item.id === id ? { ...item, status: status as "pending" | "approved" | "rejected" } : item));

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(next, null, 2), "utf8");

  revalidatePath("/payments");
}

export async function activateMembership(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return;
  }

  const applications = await readPaymentApplications();
  const payment = applications.find((item) => item.id === id);
  if (!payment) {
    return;
  }

  const memberships = await readMemberships();
  const durationDays = payment.plan === "private" ? 365 : 30;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  const record: MembershipRecord = {
    id: `member_${Date.now()}`,
    customerName: payment.name,
    phone: payment.phone,
    wechat: payment.wechat,
    plan: payment.plan,
    status: "active",
    activatedAt: now.toISOString(),
    expiresAt,
    sourcePaymentId: payment.id,
    note: `由付款申请 ${payment.id} 开通`,
  };

  await writeMemberships([record, ...memberships]);

  const updatedPayments = applications.map((item) => (item.id === id ? { ...item, status: "approved" as const } : item));
  await fs.writeFile(dataFile, JSON.stringify(updatedPayments, null, 2), "utf8");

  revalidatePath("/payments");
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
