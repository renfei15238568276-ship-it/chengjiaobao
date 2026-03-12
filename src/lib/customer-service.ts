import type { CreateCustomerInput, UpdateCustomerInput } from "@/lib/customer-schemas";
import type { AddFollowUpInput, SaveAiRecordInput } from "@/lib/followup-schemas";
import { readCustomers, writeCustomers } from "@/lib/store";
import type { CustomerRecord, FollowUpRecord } from "@/lib/types";

export type CustomerDetail = CustomerRecord;

function estimateProbability(stage: string) {
  switch (stage) {
    case "新线索":
      return 20;
    case "已联系":
      return 35;
    case "意向中":
      return 60;
    case "报价中":
      return 75;
    case "谈判中":
      return 82;
    case "待成交":
      return 90;
    case "已成交":
      return 100;
    case "已流失":
      return 0;
    default:
      return 30;
  }
}

function formatCurrency(input: string) {
  const amount = Number(input.replace(/[^\d.]/g, "")) || 0;
  return `¥${amount.toLocaleString("zh-CN")}`;
}

function nowLabel() {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function makeRecord(type: string, content: string): FollowUpRecord {
  return {
    id: `${type}_${Date.now()}`,
    at: nowLabel(),
    type,
    content,
  };
}

export async function listCustomers() {
  return readCustomers();
}

export async function getCustomerById(id: string): Promise<CustomerDetail | null> {
  const customers = await readCustomers();
  return customers.find((item) => item.id === id) ?? null;
}

export async function createCustomer(input: CreateCustomerInput) {
  const customers = await readCustomers();
  const record: CustomerRecord = {
    id: `cus_${Date.now()}`,
    name: input.name,
    company: input.company,
    contactHandle: input.contactHandle,
    source: input.source,
    stage: input.stage,
    owner: "任飞",
    nextFollowUp: input.nextFollowUp,
    probability: estimateProbability(input.stage),
    estimatedAmount: formatCurrency(input.estimatedAmount),
    tags: [input.stage],
    note: input.note,
    followUps: [makeRecord("录入", `新客户录入：${input.contactHandle}，来源 ${input.source}，预计金额 ${formatCurrency(input.estimatedAmount)}。`)],
    aiHistory: [],
    createdAt: new Date().toISOString(),
  };

  customers.unshift(record);
  await writeCustomers(customers);
  return record;
}

export async function updateCustomer(input: UpdateCustomerInput) {
  const customers = await readCustomers();
  const index = customers.findIndex((item) => item.id === input.id);
  if (index === -1) return null;

  customers[index] = {
    ...customers[index],
    name: input.name,
    company: input.company,
    contactHandle: input.contactHandle,
    source: input.source,
    stage: input.stage,
    nextFollowUp: input.nextFollowUp,
    probability: estimateProbability(input.stage),
    estimatedAmount: formatCurrency(input.estimatedAmount),
    tags: [input.stage],
    note: input.note,
  };

  customers[index].followUps.unshift(makeRecord("编辑", `已更新客户资料：阶段 ${input.stage}，来源 ${input.source}，预计金额 ${formatCurrency(input.estimatedAmount)}。`));
  await writeCustomers(customers);
  return customers[index];
}

export async function deleteCustomer(id: string) {
  const customers = await readCustomers();
  const next = customers.filter((item) => item.id !== id);
  const removed = next.length !== customers.length;
  if (!removed) return false;
  await writeCustomers(next);
  return true;
}

export async function exportCustomersCsv() {
  const customers = await readCustomers();
  const headers = ["ID", "姓名", "公司", "联系方式", "来源", "阶段", "负责人", "下次跟进", "成交概率", "预计金额", "备注"];
  const rows = customers.map((item) => [
    item.id,
    item.name,
    item.company,
    item.contactHandle,
    item.source,
    item.stage,
    item.owner,
    item.nextFollowUp,
    `${item.probability}%`,
    item.estimatedAmount,
    item.note.replace(/\n/g, " "),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export async function addFollowUp(input: AddFollowUpInput) {
  const customers = await readCustomers();
  const index = customers.findIndex((item) => item.id === input.customerId);
  if (index === -1) return null;

  const record = makeRecord(input.type, input.content);
  customers[index].followUps.unshift(record);
  await writeCustomers(customers);
  return record;
}

export async function saveAiRecord(input: SaveAiRecordInput) {
  const customers = await readCustomers();
  const index = customers.findIndex((item) => item.id === input.customerId);
  if (index === -1) return null;

  const summary = makeRecord(
    `AI-${input.generationType}`,
    `语气：${input.tone}；顾虑：${input.concern}；目标：${input.goal}；生成结果：${input.generatedCopy}`,
  );

  customers[index].aiHistory = [summary, ...(customers[index].aiHistory ?? [])];
  customers[index].followUps.unshift(makeRecord("AI话术", `已生成并保存一条${input.generationType}话术。`));
  await writeCustomers(customers);
  return summary;
}

export async function getDashboardHighlights() {
  const all = await readCustomers();
  const totalEstimated = all.reduce((sum, item) => {
    const normalized = Number(item.estimatedAmount.replace(/[¥,]/g, ""));
    return sum + normalized;
  }, 0);

  const urgent = all.filter((item) => item.nextFollowUp.includes("今晚"));
  const hot = all.filter((item) => item.probability >= 70);

  return {
    totalCustomers: all.length,
    urgentCount: urgent.length,
    hotCount: hot.length,
    totalEstimated,
  };
}
