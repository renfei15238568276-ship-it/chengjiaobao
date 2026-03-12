import { promises as fs } from "fs";
import path from "path";
import type { PaymentApplicationRecord } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "payment-applications.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([], null, 2), "utf8");
  }
}

export async function readPaymentApplications(): Promise<PaymentApplicationRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as PaymentApplicationRecord[];
}

export async function appendPaymentApplication(record: PaymentApplicationRecord) {
  const current = await readPaymentApplications();
  current.unshift(record);
  await fs.writeFile(dataFile, JSON.stringify(current, null, 2), "utf8");
}
