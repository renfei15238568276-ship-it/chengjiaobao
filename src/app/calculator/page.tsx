"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";

export default function CalculatorPage() {
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [accountBalance, setAccountBalance] = useState("10000");

  const calculate = () => {
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const lots = parseFloat(lotSize);
    const balance = parseFloat(accountBalance);

    if (!entry || !sl || !lots || !balance) return null;

    const priceDiff = Math.abs(entry - sl);
    const loss = priceDiff * lots * 100;
    const riskPercent = (loss / balance) * 100;

    const recommendedRisk = balance * 0.02;
    const recommendedLots = recommendedRisk / (priceDiff * 100);

    return {
      loss: loss.toFixed(2),
      riskPercent: riskPercent.toFixed(2),
      recommendedLots: Math.max(0.01, recommendedLots).toFixed(2),
    };
  };

  const result = calculate();

  return (
    <AppShell
      eyebrow="工具"
      title="交易风险计算器"
      description="计算仓位风险和推荐仓位大小"
    >
      <div className="mx-auto max-w-lg">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                账户余额 ($)
              </label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="10000"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                入场价格
              </label>
              <input
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="例如: 1.0850"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                止损价格
              </label>
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="例如: 1.0800"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                仓位大小 (手)
              </label>
              <input
                type="number"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="例如: 1.0"
                step="0.01"
              />
            </div>
          </div>

          {result && (
            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex justify-between">
                <span className="text-slate-600">亏损金额:</span>
                <span className="font-semibold text-red-600">-${result.loss}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">风险比例:</span>
                <span className={`font-semibold ${parseFloat(result.riskPercent) > 2 ? "text-red-600" : "text-green-600"}`}>
                  {result.riskPercent}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">2%建议仓位:</span>
                <span className="font-semibold text-cyan-600">{result.recommendedLots} 手</span>
              </div>
            </div>
          )}

          {parseFloat(result?.riskPercent || "0") > 2 && result && (
            <p className="mt-4 text-sm text-red-500">
              ⚠️ 风险超过2%，建议降低仓位
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-slate-400">
          仅供风险计算参考，不构成投资建议
        </p>
      </div>
    </AppShell>
  );
}
