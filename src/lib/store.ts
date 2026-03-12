import { promises as fs } from "fs";
import path from "path";
import type { CustomerRecord } from "@/lib/types";
import { customers as mockCustomers, followUps as mockFollowUps } from "@/lib/mock-data";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "customers.json");

function mockToRecords(): CustomerRecord[] {
  return mockCustomers.map((item) => ({
    ...item,
    contactHandle: "未填写",
    followUps: (mockFollowUps[item.id as keyof typeof mockFollowUps] ?? []).map((record, index) => ({
      id: `${item.id}_${index}`,
      at: record.at,
      type: record.type,
      content: record.content,
    })),
    createdAt: new Date().toISOString(),
  }));
}

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(mockToRecords(), null, 2), "utf8");
  }
}

export async function readCustomers(): Promise<CustomerRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as CustomerRecord[];
}

export async function writeCustomers(customers: CustomerRecord[]) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(customers, null, 2), "utf8");
}
