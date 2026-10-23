import type { InsuranceProduct, VerificationStatus } from "@/data/types";

// ============================================================
// 資料完整度評分 (Data Completeness Score)
// ============================================================
// ⚠️ 這個分數只出現在 /admin-preview（營運後台），絕不出現在消費者頁面。
// 理由：消費者看到「80 分」只會誤以為是產品質量評分，而它其實是
// 「我們有多完整地記錄了這個產品」的內部指標。兩者用途完全不同。
//
// 計算維度（等權重）：
//   1. 來源文件數量
//   2. 必填欄位齊備度（eligibility / deductible / waitingPeriod / renewal）
//   3. 保障項目數量
//   4. 不保事項數量
//   5. 保費示例數量
//   6. 核實狀態
// ============================================================

export type CompletenessBreakdown = {
  label: string;
  score: number; // 0–100
  detail: string;
};

export type CompletenessResult = {
  score: number; // 0–100 整數
  grade: "A" | "B" | "C" | "D";
  breakdown: CompletenessBreakdown[];
  missingFields: string[];
};

const STATUS_SCORE: Record<VerificationStatus, number> = {
  verified: 100,
  partially_verified: 70,
  unverified: 35,
  demo: 20,
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function completenessOf(p: InsuranceProduct): CompletenessResult {
  const breakdown: CompletenessBreakdown[] = [];
  const missingFields: string[] = [];

  // 1. 來源文件
  const srcCount = p.sourceDocuments.length;
  const srcScore = clamp((srcCount / 3) * 100);
  breakdown.push({
    label: "來源文件",
    score: srcScore,
    detail:
      srcCount === 0
        ? "尚未加入任何可核實來源。"
        : `已登記 ${srcCount} 份來源文件（條款、小冊子等）。`,
  });
  if (srcCount === 0) missingFields.push("來源文件");

  // 2. 必填結構欄位
  const required: { key: string; label: string; ok: boolean }[] = [
    { key: "eligibility", label: "投保資格", ok: !!p.eligibility },
    { key: "deductible", label: "自付額", ok: !!p.deductible },
    { key: "waitingPeriod", label: "等待期", ok: !!p.waitingPeriod },
    { key: "renewal", label: "續保安排", ok: !!p.renewal },
    { key: "paymentOptions", label: "付款方式", ok: !!p.paymentOptions?.length },
    { key: "termsVersion", label: "條款版本", ok: !!p.termsVersion },
  ];
  const okCount = required.filter((r) => r.ok).length;
  breakdown.push({
    label: "必填欄位",
    score: clamp((okCount / required.length) * 100),
    detail: `${okCount} / ${required.length} 項必填欄位已填寫。`,
  });
  for (const r of required) {
    if (!r.ok) missingFields.push(r.label);
  }

  // 3. 保障項目
  const covCount = p.coverage.length;
  breakdown.push({
    label: "保障項目",
    score: clamp((covCount / 5) * 100),
    detail: `已記錄 ${covCount} 項保障項目。`,
  });
  if (covCount < 3) missingFields.push("保障項目（少於 3 項）");

  // 4. 不保事項
  const excCount = p.exclusions.length;
  breakdown.push({
    label: "不保事項",
    score: clamp((excCount / 3) * 100),
    detail: `已記錄 ${excCount} 項不保事項。`,
  });
  if (excCount < 2) missingFields.push("不保事項（少於 2 項）");

  // 5. 保費示例
  const premCount = p.premiumExamples.length;
  breakdown.push({
    label: "保費示例",
    score: clamp((premCount / 3) * 100),
    detail: `已記錄 ${premCount} 個保費示例。`,
  });
  if (premCount < 2) missingFields.push("保費示例（少於 2 個）");

  // 6. 核實狀態
  breakdown.push({
    label: "核實狀態",
    score: STATUS_SCORE[p.verification.status],
    detail:
      p.verification.unverifiedFields && p.verification.unverifiedFields.length
        ? `尚未核實：${p.verification.unverifiedFields.join("、")}`
        : "全部欄位已核實。",
  });
  if (p.verification.unverifiedFields?.length) {
    missingFields.push(...p.verification.unverifiedFields);
  }

  const score = clamp(
    breakdown.reduce((sum, b) => sum + b.score, 0) / breakdown.length,
  );
  const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D";

  return { score, grade, breakdown, missingFields };
}

/** 全站統計 */
export function completenessSummary(products: InsuranceProduct[]) {
  const rows = products.map((p) => ({ product: p, result: completenessOf(p) }));
  const avg = rows.length
    ? Math.round(rows.reduce((s, r) => s + r.result.score, 0) / rows.length)
    : 0;
  const byGrade = { A: 0, B: 0, C: 0, D: 0 };
  for (const r of rows) byGrade[r.result.grade]++;
  const byStatus: Record<VerificationStatus, number> = {
    verified: 0,
    partially_verified: 0,
    unverified: 0,
    demo: 0,
  };
  for (const p of products) byStatus[p.verification.status]++;
  return { rows, avg, byGrade, byStatus, total: products.length };
}
