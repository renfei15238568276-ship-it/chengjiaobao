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

async function getCurrentUserId() {
  const session = await getCurrentSession();
  if (session?.userId) return session.userId;

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
    customerId: row.customer_id,
    type: row.type,
    content: row.content,
    createdAt: row.created_at,
    at: row.created_at,
  };
}

function mapAiHistory(row: AiHistoryRow) {
  return {
    id: row.id,
    customerId: row.customer_id,
    type: row.type,
    content: row.content,
    createdAt: row.created_at,
    at: row.created_at,
  };
}

function mapCustomer(row: CustomerRow): CustomerRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    company: row.company,
    contactHandle: row.contact_handle,
    source: row.source,
    stage: row.stage,
    owner: row.owner,
    nextFollowUp: row.next_follow_up,
    probability: row.probability,
    estimatedAmount: row.estimated_amount,
    tags: row.tags ?? [],
    note: row.note,
    createdAt: row.created_at,
    at: row.created_at,
  };
}

export async function createCustomer(input: CreateCustomerInput) {
  const userId = await getCurrentUserId();

  const { data, error } = await getSupabaseAdmin()
    .from("customers")
    .insert({
      user_id: userId,
      name: input.name,
      company: input.company,
      contact_handle: input.contactHandle ?? "",
      source: input.source ?? "",
      stage: input.stage ?? "新线索",
      owner: input.owner ?? "",
      next_follow_up: input.nextFollowUp ?? "",
      probability: estimateProbability(input.stage ?? "新线索"),
      estimated_amount: input.estimatedAmount ?? "",
      tags: input.tags ?? [],
      note: input.note ?? "",
    })
    .select()
    .single<CustomerRow>();

  if (error) throw error;

  return mapCustomer(data!);
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  const userId = await getCurrentUserId();

  const { data, error } = await getSupabaseAdmin()
    .from("customers")
    .update({
      name: input.name,
      company: input.company,
      contact_handle: input.contactHandle,
      source: input.source,
      stage: input.stage,
      owner: input.owner,
      next_follow_up: input.nextFollowUp,
      probability: estimateProbability(input.stage),
      estimated_amount: input.estimatedAmount,
      tags: input.tags,
      note: input.note,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single<CustomerRow>();

  if (error) throw error;

  return mapCustomer(data!);
}

export async function deleteCustomer(id: string) {
  const userId = await getCurrentUserId();

  const { error } = await getSupabaseAdmin()
    .from("customers")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getCustomer(id: string): Promise<CustomerDetail | null> {
  const userId = await getCurrentUserId();

  const { data, error } = await getSupabaseAdmin()
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single<CustomerRow>();

  if (error) return null;

  const customer = mapCustomer(data!);

  const { data: followUps } = await getSupabaseAdmin()
    .from("follow_ups")
    .select("*")
    .eq("customer_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: aiHistory } = await getSupabaseAdmin()
    .from("ai_history")
    .select("*")
    .eq("customer_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    ...customer,
    followUps: (followUps ?? []).map(mapFollowUp),
    aiHistory: (aiHistory ?? []).map(mapAiHistory),
  };
}

export async function listCustomers(search?: string, stage?: string) {
  const userId = await getCurrentUserId();

  let query = getSupabaseAdmin()
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (stage) {
    query = query.eq("stage", stage);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,company.ilike.%${search}%,contact_handle.ilike.%${search}%`,
    );
  }

  const { data, error } = await query.limit(100);

  if (error) throw error;

  return (data ?? []).map((row) => {
    const record = mapCustomer(row);
    return {
      ...record,
      nextFollowUpLabel: row.next_follow_up ? nowLabelFromDate(row.next_follow_up) : "",
      estimatedAmountLabel: formatCurrency(row.estimated_amount),
    };
  });
}

export async function addFollowUp(customerId: string, input: AddFollowUpInput) {
  const userId = await getCurrentUserId();

  const { data, error } = await getSupabaseAdmin()
    .from("follow_ups")
    .insert({
      customer_id: customerId,
      user_id: userId,
      type: input.type,
      content: input.content,
    })
    .select()
    .single<FollowUpRow>();

  if (error) throw error;

  return mapFollowUp(data!);
}

export async function saveAiRecord(input: SaveAiRecordInput) {
  const userId = await getCurrentUserId();

  const { data, error } = await getSupabaseAdmin()
    .from("ai_history")
    .insert({
      customer_id: input.customerId ?? null,
      user_id: userId,
      type: input.type,
      content: input.content,
    })
    .select()
    .single<AiHistoryRow>();

  if (error) throw error;

  return mapAiHistory(data!);
}

export async function getCustomerById(id: string) {
  return getCustomer(id);
}

export async function getDashboardHighlights() {
  const customers = await listCustomers();
  
  const total = customers.length;
  const newLeads = customers.filter(c => c.stage === "新线索").length;
  const inProgress = customers.filter(c => ["已联系", "意向中", "报价中", "谈判中"].includes(c.stage)).length;
  const closed = customers.filter(c => c.stage === "已成交").length;
  
  const totalAmount = customers.reduce((sum, c) => {
    const num = parseFloat(c.estimatedAmount.replace(/[^0-9.]/g, "")) || 0;
    return sum + num;
  }, 0);
  
  return {
    total,
    newLeads,
    inProgress,
    closed,
    totalCustomers: total,
    hotCount: customers.filter(c => c.probability >= 70).length,
    urgentCount: customers.filter(c => c.nextFollowUp && new Date(c.nextFollowUp) <= new Date(Date.now() + 24*60*60*1000)).length,
    totalEstimated: totalAmount,
    totalAmount: `¥${totalAmount.toLocaleString("zh-CN")}`,
  };
}

export async function exportCustomersCsv() {
  const customers = await listCustomers();
  
  const headers = ["客户名", "公司", "联系方式", "来源", "阶段", "负责人", "预估金额", "创建时间"];
  const rows = customers.map(c => [
    c.name,
    c.company,
    c.contactHandle,
    c.source,
    c.stage,
    c.owner,
    c.estimatedAmountLabel,
    c.createdAt,
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
  return csv;
}
