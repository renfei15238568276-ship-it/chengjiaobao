import type { CreateCustomerInput, UpdateCustomerInput } from "@/lib/customer-schemas";
import type { AddFollowUpInput, SaveAiRecordInput } from "@/lib/followup-schemas";
import { getCurrentSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { CustomerRecord, FollowUpRecord } from "@/lib/types";

export type CustomerDetail = CustomerRecord;

type UserRow = { id: string };
type CustomerRow = {
  id: string;
  user_id: string;
  name: string;
  company: string;
  contact_handle: string;
  source: string;
  stage: string;
  owner: string;
  next_follow_up: string;
  probability: number;
  estimated_amount: string;
  tags: string[] | null;
  note: string;
  created_at: string;
};

type FollowUpRow = {
  id: string;
  customer_id: string;
  user_id: string;
  type: string;
  content: string;
  created_at: string;
};

type AiHistoryRow = {
  id: string;
  user_id: string;
  customer_id: string | null;
  type: string;
  content: string;
  created_at: string;
};

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

function nowLabelFromDate(input: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(input));
}


  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .select("id")
    .eq("username", "admin")
    .limit(1)
    .single<UserRow>();

  if (error || !data) {
    throw error ?? new Error("Failed to resolve current user");
  }

  return data.id;
}

function mapFollowUp(row: FollowUpRow): FollowUpRecord {
  return {
    id: row.id,
    at: nowLabelFromDate(row.created_at),
    type: row.type,
    content: row.content,
  };
}

function mapAiHistory(row: AiHistoryRow): FollowUpRecord {
  return {
    id: row.id,
    at: nowLabelFromDate(row.created_at),
    type: row.type,
    content: row.content,
  };
}

function mapCustomer(customer: CustomerRow, followUps: FollowUpRow[], aiHistory: AiHistoryRow[]): CustomerRecord {
  return {
    id: customer.id,
    name: customer.name,
    company: customer.company,
    contactHandle: customer.contact_handle,
    source: customer.source,
    stage: customer.stage,
    owner: customer.owner,
    nextFollowUp: customer.next_follow_up,
    probability: customer.probability,
    estimatedAmount: customer.estimated_amount,
    tags: customer.tags ?? [],
    note: customer.note,
    followUps: followUps.map(mapFollowUp),
    aiHistory: aiHistory.map(mapAiHistory),
    createdAt: customer.created_at,
  };
}

async function enrichCustomers(userId: string, customers: CustomerRow[]) {
  if (!customers.length) return [] as CustomerRecord[];

  const ids = customers.map((item) => item.id);
  const admin = getSupabaseAdmin();

  const [{ data: followUps, error: followUpError }, { data: aiHistory, error: aiError }] = await Promise.all([
    admin
      .from("follow_ups")
      .select("id, customer_id, user_id, type, content, created_at")
      .eq("user_id", userId)
      .in("customer_id", ids)
      .order("created_at", { ascending: false }),
    admin
      .from("ai_histories")
      .select("id, user_id, customer_id, type, content, created_at")
      .eq("user_id", userId)
      .in("customer_id", ids)
      .order("created_at", { ascending: false }),
  ]);

  if (followUpError) throw followUpError;
  if (aiError) throw aiError;

  const followUpsByCustomer = new Map<string, FollowUpRow[]>();
  for (const row of (followUps ?? []) as FollowUpRow[]) {
    const list = followUpsByCustomer.get(row.customer_id) ?? [];
    list.push(row);
    followUpsByCustomer.set(row.customer_id, list);
  }

  const aiByCustomer = new Map<string, AiHistoryRow[]>();
  for (const row of (aiHistory ?? []) as AiHistoryRow[]) {
    if (!row.customer_id) continue;
    const list = aiByCustomer.get(row.customer_id) ?? [];
    list.push(row);
    aiByCustomer.set(row.customer_id, list);
  }

  return customers.map((customer) => mapCustomer(customer, followUpsByCustomer.get(customer.id) ?? [], aiByCustomer.get(customer.id) ?? []));
}

export async function listCustomers() {
  const userId = await getCurrentUserId();
  const { data, error } = await getSupabaseAdmin()
    .from("customers")
    .select("id, user_id, name, company, contact_handle, source, stage, owner, next_follow_up, probability, estimated_amount, tags, note, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return enrichCustomers(userId, (data ?? []) as CustomerRow[]);
}

export async function getCustomerById(id: string): Promise<CustomerDetail | null> {
  const userId = await getCurrentUserId();
  const { data, error } = await getSupabaseAdmin()
    .from("customers")
    .select("id, user_id, name, company, contact_handle, source, stage, owner, next_follow_up, probability, estimated_amount, tags, note, created_at")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle<CustomerRow>();

  if (error) throw error;
  if (!data) return null;

  const [detail] = await enrichCustomers(userId, [data]);
  return detail ?? null;
}

export async function createCustomer(input: CreateCustomerInput) {
  const userId = await getCurrentUserId();
  const estimatedAmount = formatCurrency(input.estimatedAmount);
  const probability = estimateProbability(input.stage);

  const { data, error } = await getSupabaseAdmin()
    .from("customers")
    .insert({
      user_id: userId,
      name: input.name,
      company: input.company,
      contact_handle: input.contactHandle,
      source: input.source,
      stage: input.stage,
      owner: "当前用户",
      next_follow_up: input.nextFollowUp,
      probability,
      estimated_amount: estimatedAmount,
      tags: [input.stage],
      note: input.note,
    })
    .select("id, user_id, name, company, contact_handle, source, stage, owner, next_follow_up, probability, estimated_amount, tags, note, created_at")
    .single<CustomerRow>();

  if (error || !data) throw error ?? new Error("Failed to create customer");

  const { error: followUpError } = await getSupabaseAdmin().from("follow_ups").insert({
    customer_id: data.id,
    user_id: userId,
    type: "录入",
    content: `新客户录入：${input.contactHandle}，来源 ${input.source}，预计金额 ${estimatedAmount}。`,
  });

  if (followUpError) throw followUpError;

  const [detail] = await enrichCustomers(userId, [data]);
  return detail;
}

export async function updateCustomer(input: UpdateCustomerInput) {
  const userId = await getCurrentUserId();
  const estimatedAmount = formatCurrency(input.estimatedAmount);
  const probability = estimateProbability(input.stage);

  const { data, error } = await getSupabaseAdmin()
    .from("customers")
    .update({
      name: input.name,
      company: input.company,
      contact_handle: input.contactHandle,
      source: input.source,
      stage: input.stage,
      next_follow_up: input.nextFollowUp,
      probability,
      estimated_amount: estimatedAmount,
      tags: [input.stage],
      note: input.note,
    })
    .eq("id", input.id)
    .eq("user_id", userId)
    .select("id, user_id, name, company, contact_handle, source, stage, owner, next_follow_up, probability, estimated_amount, tags, note, created_at")
    .maybeSingle<CustomerRow>();

  if (error) throw error;
  if (!data) return null;

  const { error: followUpError } = await getSupabaseAdmin().from("follow_ups").insert({
    customer_id: data.id,
    user_id: userId,
    type: "编辑",
    content: `已更新客户资料：阶段 ${input.stage}，来源 ${input.source}，预计金额 ${estimatedAmount}。`,
  });

  if (followUpError) throw followUpError;

  const [detail] = await enrichCustomers(userId, [data]);
  return detail;
}

export async function deleteCustomer(id: string) {
  const userId = await getCurrentUserId();
  const { error, count } = await getSupabaseAdmin()
    .from("customers")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
  return (count ?? 0) > 0;
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
  const userId = await getCurrentUserId();

  const customer = await getCustomerById(input.customerId);
  if (!customer) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("follow_ups")
    .insert({
      customer_id: input.customerId,
      user_id: userId,
      type: input.type,
      content: input.content,
    })
    .select("id, customer_id, user_id, type, content, created_at")
    .single<FollowUpRow>();

  if (error || !data) throw error ?? new Error("Failed to add follow up");
  return mapFollowUp(data);
}

export async function saveAiRecord(input: SaveAiRecordInput) {
  const userId = await getCurrentUserId();

  const customer = await getCustomerById(input.customerId);
  if (!customer) return null;

  const content = `语气：${input.tone}；顾虑：${input.concern}；目标：${input.goal}；生成结果：${input.generatedCopy}`;

  const { data, error } = await getSupabaseAdmin()
    .from("ai_histories")
    .insert({
      user_id: userId,
      customer_id: input.customerId,
      type: `AI-${input.generationType}`,
      content,
    })
    .select("id, user_id, customer_id, type, content, created_at")
    .single<AiHistoryRow>();

  if (error || !data) throw error ?? new Error("Failed to save AI history");

  const { error: followUpError } = await getSupabaseAdmin().from("follow_ups").insert({
    customer_id: input.customerId,
    user_id: userId,
    type: "AI话术",
    content: `已生成并保存一条${input.generationType}话术。`,
  });

  if (followUpError) throw followUpError;

  return mapAiHistory(data);
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
