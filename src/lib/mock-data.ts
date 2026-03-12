export type CustomerItem = {
  id: string;
  name: string;
  company: string;
  stage: string;
  source: string;
  owner: string;
  nextFollowUp: string;
  probability: number;
  estimatedAmount: string;
  tags: string[];
  note: string;
};

export const customers: CustomerItem[] = [
  {
    id: "cus_zhang",
    name: "张总",
    company: "海川装饰",
    stage: "待成交",
    source: "抖音投流",
    owner: "任飞",
    nextFollowUp: "今晚 20:30",
    probability: 85,
    estimatedAmount: "¥58,000",
    tags: ["高意向", "报价已发"],
    note: "已看过方案，主要犹豫付款节奏和赠品。",
  },
  {
    id: "cus_li",
    name: "李女士",
    company: "颜值管理工作室",
    stage: "意向中",
    source: "老客户转介绍",
    owner: "顾问 A",
    nextFollowUp: "明天 10:00",
    probability: 62,
    estimatedAmount: "¥12,800",
    tags: ["复购潜力", "需要案例"],
    note: "对储值活动感兴趣，想先看疗程前后对比。",
  },
  {
    id: "cus_wang",
    name: "王先生",
    company: "启航教育",
    stage: "报价中",
    source: "公众号咨询",
    owner: "顾问 B",
    nextFollowUp: "3 月 12 日",
    probability: 48,
    estimatedAmount: "¥9,999",
    tags: ["试听完成"],
    note: "孩子试听反馈不错，家长在比较两家机构。",
  },
  {
    id: "cus_chen",
    name: "陈老板",
    company: "臻选建材",
    stage: "新线索",
    source: "线下活动",
    owner: "任飞",
    nextFollowUp: "今晚 22:00",
    probability: 24,
    estimatedAmount: "¥30,000",
    tags: ["首次接触"],
    note: "刚加上联系方式，还没发完整资料。",
  },
];

export const followUps = {
  cus_zhang: [
    {
      at: "今天 18:20",
      type: "报价",
      content: "已发送装修报价单和施工周期说明。",
    },
    {
      at: "昨天 14:10",
      type: "私聊",
      content: "客户询问是否可分阶段付款，已说明可谈。",
    },
  ],
  cus_li: [
    {
      at: "今天 11:30",
      type: "回访",
      content: "客户想看真实案例和到店前后对比。",
    },
  ],
  cus_wang: [
    {
      at: "昨天 19:00",
      type: "面谈",
      content: "试听结束，家长认可老师，但还在比较价格。",
    },
  ],
  cus_chen: [
    {
      at: "今天 17:40",
      type: "私聊",
      content: "活动现场加上联系方式，约定晚上发资料。",
    },
  ],
};
