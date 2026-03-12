import { promises as fs } from "fs";
import path from "path";
import type { MembershipRecord } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "memberships.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([], null, 2), "utf8");
  }
}

export async function readMemberships(): Promise<MembershipRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as MembershipRecord[];
}

export async function writeMemberships(items: MembershipRecord[]) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
}

export async function getLatestMembership() {
  const items = await readMemberships();
  return items[0] ?? null;
}
