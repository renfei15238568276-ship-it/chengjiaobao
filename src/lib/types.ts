export type FollowUpRecord = {
  customerId: string;
  id: string;
  at: string;
  type: string;
  content: string;
};

export type CustomerRecord = {
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
  followUps: FollowUpRecord[];
  aiHistory?: FollowUpRecord[];
  createdAt: string;
};

export type PaymentApplicationRecord = {
  id: string;
  name: string;
  phone: string;
  wechat: string;
  plan: "personal" | "team" | "private";
  payMethod: "wechat" | "alipay";
  amount: string;
  paidAt: string;
  screenshotNote: string;
  note: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type MembershipRecord = {
  id: string;
  customerName: string;
  phone: string;
  wechat: string;
  plan: "personal" | "team" | "private";
  status: "inactive" | "active" | "expired";
  activatedAt: string;
  expiresAt: string;
  sourcePaymentId?: string;
  note?: string;
};
