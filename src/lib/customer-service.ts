import type { CreateCustomerInput, UpdateCustomerInput } from "@/lib/customer-schemas";
import type { AddFollowUpInput, SaveAiRecordInput } from "@/lib/followup-schemas";
import { getCurrentUser, getCurrentSession } from "@/lib/auth";
import type { CustomerRecord, FollowUpRecord } from "@/lib/types";
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');

type CustomerData = {
  id: string;
  name: string;
  company: string;
  contactHandle: string;
  source: string;
  stage: string;
  owner: string;
  nextFollowUp: string;
  probability: number;
  estimatedAmount: string;
  tags: string[];
  note: string;
  followUps: any[];
  aiHistory: any[];
  createdAt: string;
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getCustomers(): CustomerData[] {
  ensureDataDir();
  if (fs.existsSync(CUSTOMERS_FILE)) {
    return JSON.parse(fs.readFileSync(CUSTOMERS_FILE, 'utf-8'));
  }
  return [];
}

function saveCustomers(customers: CustomerData[]) {
  ensureDataDir();
  fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
}

function estimateProbability(stage: string) {
  switch (stage) {
    case "新线索": return 20;
    case "已联系": return 35;
    case "意向中": return 60;
    case "报价中": return 75;
    case "谈判中": return 82;
    case "待成交": return 90;
    case "已成交": return 100;
    case "已流失": return 0;
    default: return 30;
  }
}

function formatCurrency(input: string) {
  const amount = Number(input.replace(/[^\d.]/g, "")) || 0;
  return `¥${amount.toLocaleString("zh-CN")}`;
}

function nowLabelFromDate(input: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(input));
}

async function getCurrentUserId() {
  const session = await getCurrentSession();
  if (session?.userId) return session.userId;
  return 'admin'; // default for demo
}

function mapCustomer(customer: CustomerData): CustomerRecord {
  return {
    id: customer.id,
    name: customer.name,
    company: customer.company,
    contactHandle: customer.contactHandle,
    source: customer.source,
    stage: customer.stage,
    owner: customer.owner,
    nextFollowUp: customer.nextFollowUp,
    probability: customer.probability,
    estimatedAmount: customer.estimatedAmount,
    tags: customer.tags ?? [],
    note: customer.note,
    followUps: (customer.followUps || []).map((f: any) => ({
      id: f.id,
      at: f.at || nowLabelFromDate(f.createdAt || new Date().toISOString()),
      type: f.type,
      content: f.content,
    })),
    aiHistory: (customer.aiHistory || []).map((a: any) => ({
      id: a.id,
      at: a.at || nowLabelFromDate(a.createdAt || new Date().toISOString()),
      type: a.type,
      content: a.content,
    })),
    createdAt: customer.createdAt,
  };
}

export async function listCustomers() {
  const customers = getCustomers();
  return customers.map(mapCustomer);
}

export async function getCustomerById(id: string): Promise<CustomerDetail | null> {
  const customers = getCustomers();
  const customer = customers.find(c => c.id === id);
  if (!customer) return null;
  return mapCustomer(customer);
}

export async function createCustomer(input: CreateCustomerInput) {
  const userId = await getCurrentUserId();
  const estimatedAmount = formatCurrency(input.estimatedAmount);
  const probability = estimateProbability(input.stage);

  const customers = getCustomers();
  
  const newCustomer: CustomerData = {
    id: 'cus_' + Date.now(),
    name: input.name,
    company: input.company,
    contactHandle: input.contactHandle || '未填写',
    source: input.source,
    stage: input.stage,
    owner: '当前用户',
    nextFollowUp: input.nextFollowUp || '',
    probability,
    estimatedAmount,
    tags: [input.stage],
    note: input.note || '',
    followUps: [{
      id: 'followup_' + Date.now(),
      type: '录入',
      content: `新客户录入：${input.contactHandle || '未填写'}，来源 ${input.source}，预计金额 ${estimatedAmount}。`,
      createdAt: new Date().toISOString(),
    }],
    aiHistory: [],
    createdAt: new Date().toISOString(),
  };

  customers.push(newCustomer);
  saveCustomers(customers);

  return mapCustomer(newCustomer);
}

export async function updateCustomer(input: UpdateCustomerInput) {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === input.id);
  
  if (index === -1) return null;

  const estimatedAmount = formatCurrency(input.estimatedAmount);
  const probability = estimateProbability(input.stage);

  const customer = customers[index];
  customer.name = input.name;
  customer.company = input.company;
  customer.contactHandle = input.contactHandle;
  customer.source = input.source;
  customer.stage = input.stage;
  customer.nextFollowUp = input.nextFollowUp || '';
  customer.probability = probability;
  customer.estimatedAmount = estimatedAmount;
  customer.tags = [input.stage];
  customer.note = input.note;
  
  customer.followUps = customer.followUps || [];
  customer.followUps.push({
    id: 'followup_' + Date.now(),
    type: '编辑',
    content: `已更新客户资料：阶段 ${input.stage}，来源 ${input.source}，预计金额 ${estimatedAmount}。`,
    createdAt: new Date().toISOString(),
  });

  saveCustomers(customers);
  return mapCustomer(customer);
}

export async function deleteCustomer(id: string) {
  const customers = getCustomers();
  const filtered = customers.filter(c => c.id !== id);
  
  if (filtered.length === customers.length) return false;
  
  saveCustomers(filtered);
  return true;
}

export async function exportCustomersCsv() {
  const customers = await listCustomers();
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
  const customers = getCustomers();
  const customer = customers.find(c => c.id === input.customerId);
  
  if (!customer) return null;

  const followUp = {
    id: 'followup_' + Date.now(),
    type: input.type,
    content: input.content,
    createdAt: new Date().toISOString(),
  };

  customer.followUps = customer.followUps || [];
  customer.followUps.push(followUp);
  saveCustomers(customers);

  return {
    id: followUp.id,
    at: nowLabelFromDate(followUp.createdAt),
    type: followUp.type,
    content: followUp.content,
  };
}

export async function saveAiRecord(input: SaveAiRecordInput) {
  const customers = getCustomers();
  const customer = customers.find(c => c.id === input.customerId);
  
  if (!customer) return null;

  const content = `语气：${input.tone}；顾虑：${input.concern}；目标：${input.goal}；生成结果：${input.generatedCopy}`;

  const aiRecord = {
    id: 'ai_' + Date.now(),
    type: `AI-${input.generationType}`,
    content,
    createdAt: new Date().toISOString(),
  };

  customer.aiHistory = customer.aiHistory || [];
  customer.aiHistory.push(aiRecord);
  
  customer.followUps = customer.followUps || [];
  customer.followUps.push({
    id: 'followup_' + Date.now(),
    type: 'AI话术',
    content: `已生成并保存一条${input.generationType}话术。`,
    createdAt: new Date().toISOString(),
  });

  saveCustomers(customers);

  return {
    id: aiRecord.id,
    at: nowLabelFromDate(aiRecord.createdAt),
    type: aiRecord.type,
    content: aiRecord.content,
  };
}

export async function getDashboardHighlights() {
  const all = await listCustomers();
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

export type CustomerDetail = CustomerRecord;
