export type GenerateSalesCopyInput = {
  customerName: string;
  company: string;
  stage: string;
  concern: string;
  goal: string;
  tone: string;
  generationType: string;
};

export function generateLocalSalesCopy(input: GenerateSalesCopyInput) {
  const opener =
    input.tone === "像朋友聊天"
      ? `${input.customerName}，我刚顺手把你关心的点捋了一下。`
      : input.tone === "强行动号召"
        ? `${input.customerName}，这事我建议今天就定下来最划算。`
        : `${input.customerName}，我把您现在最关心的几个点单独整理了一下。`;

  const stageHint =
    input.stage === "待成交"
      ? "现在已经不缺了解，关键是帮客户把最后的犹豫拆掉。"
      : input.stage === "报价中"
        ? "重点不是重复报价，而是解释报价背后的价值。"
        : input.stage === "意向中"
          ? "这时候最重要的是把信任感和下一步动作拉起来。"
          : "先别急着逼单，先让客户愿意继续聊。";

  return `${opener}${stageHint} 关于“${input.concern}”这点，我这边已经按${input.generationType}的思路整理好了，尽量让您看完就能判断值不值。${input.goal} 如果您方便，我现在就按您的情况给您发最合适的版本。\n\n—— ${input.company} 专属建议`;
}

export async function generateSalesCopy(input: GenerateSalesCopyInput) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const baseUrl = process.env.OPENROUTER_BASE_URL?.trim() || "https://openrouter.ai/api/v1";
  const model = process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4o-mini";

  if (!apiKey) {
    return {
      content: generateLocalSalesCopy(input),
      provider: "local-fallback",
    };
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "你是一个销售成交助手。请直接输出一段可发送给客户的中文话术，语气自然、可执行、避免空话套话，不要解释你的思路。",
          },
          {
            role: "user",
            content: `客户姓名：${input.customerName}\n公司/门店：${input.company}\n客户阶段：${input.stage}\n生成类型：${input.generationType}\n沟通语气：${input.tone}\n客户顾虑：${input.concern}\n本次目标：${input.goal}\n\n请生成一段适合直接发送给客户的话术。`,
          },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("OpenRouter empty response");
    }

    return {
      content,
      provider: "openrouter",
    };
  } catch {
    return {
      content: generateLocalSalesCopy(input),
      provider: "local-fallback",
    };
  }
}
