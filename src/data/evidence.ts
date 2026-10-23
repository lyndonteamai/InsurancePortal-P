import type { Evidence, InsuranceProduct, SourceDocument, VerificationStatus } from "./types";
import { products } from "./products";
import { globalSources } from "./sources";

// ============================================================
// 證據註冊表 (Evidence Registry)
// ============================================================
// Source-First 的運作原理：
//
//   事實 (fact)  ──指向──>  證據 (evidence)  ──指向──>  來源文件 (source)
//
// 每個產品頁上可核實的欄位（保額、自付額、等候期、續保、保費）
// 都在這裡登記一筆 evidence，並附上：
//   · 事實值（頁面上顯示的字串）
//   · 核實狀態
//   · 原文引用（若來源有提供）
//
// 重要：原型階段所有證據都掛在 isPrototype 的來源上。
// 平台的規則是「沒有來源就說沒有來源」，所以每一筆 evidence 都
// 必須能追到一份來源文件，追不到就不應該出現在這裡。
// ============================================================

/**
 * 從產品抽取所有可核實事實，組成 evidence 清單。
 *
 * 這個函式是「資料驅動」的：新增欄位只需要在產品資料裡多一個
 * sourceIds，就自動多一筆 evidence，不需要改 UI。
 */
export function extractProductEvidence(product: InsuranceProduct): Evidence[] {
  const out: Evidence[] = [];
  const push = (
    factLabel: string,
    factValue: string | undefined | null,
    sourceIds: string[],
    quoteOrReference?: string,
  ) => {
    if (!factValue) return;
    out.push({
      id: `${product.id}--${slugify(factLabel)}`,
      factLabel,
      factValue,
      sourceIds,
      verificationStatus: product.verification.status,
      quoteOrReference,
    });
  };

  // 保障項目（每個 coverage item 都可以是獨立的事實）
  for (const c of product.coverage) {
    push(c.name, c.limit ?? c.summary, c.sourceIds, c.summary);
  }

  // 不保事項
  for (const e of product.exclusions) {
    push(`不保：${e.name}`, e.description, e.sourceIds);
  }

  // 自付額
  if (product.deductible) {
    const value = product.deductible.hasDeductible
      ? (product.deductible.value ?? "無自付額")
      : "無自付額";
    push(
      product.deductible.basis ? `自付額（${product.deductible.basis}）` : "自付額",
      value,
      product.deductible.sourceIds,
    );
  }

  // 等候期
  if (product.waitingPeriod && product.waitingPeriod.hasWaitingPeriod) {
    push("等候期", product.waitingPeriod.value, product.waitingPeriod.sourceIds);
  }

  // 續保
  if (product.renewal) {
    push("續保安排", product.renewal.label, product.renewal.sourceIds, product.renewal.description);
  }

  // 保費示例
  for (const p of product.premiumExamples) {
    push(`保費示例：${p.label}`, `HK$${p.annualPremium.toLocaleString()}`, p.sourceIds, p.assumptions);
  }

  return out;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[（(].*?[)）]/g, "")
    .replace(/[\s　:：,，.。、/·]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

/** 全站所有產品的 evidence（建立時一次過算，之後直接查表） */
export const allEvidence: Evidence[] = products.flatMap(extractProductEvidence);

/** evidence id → evidence */
export const evidenceMap: Record<string, Evidence> = Object.fromEntries(
  allEvidence.map((e) => [e.id, e]),
);

/**
 * 依「產品 id + 欄位名」取 evidence。
 * 產品頁的「查看來源」按這個方式定位。
 */
export function getEvidence(
  product: InsuranceProduct,
  factLabel: string,
): Evidence | undefined {
  const exact = allEvidence.find(
    (e) => e.id === `${product.id}--${slugify(factLabel)}`,
  );
  if (exact) return exact;
  // 退而求其次：容許「自付額（每次住院）」對應到「自付額」
  const base = factLabel.replace(/（.*?）/g, "").trim();
  return allEvidence.find((e) => e.id === `${product.id}--${slugify(base)}`);
}

/** 產品 → evidence 清單 */
export function getProductEvidence(product: InsuranceProduct): Evidence[] {
  return allEvidence.filter((e) => e.id.startsWith(`${product.id}--`));
}

/**
 * 解析 evidence 對應的來源文件。
 * 先查產品內嵌 sourceDocuments，再查全域來源表。
 */
export function resolveEvidenceSources(
  evidence: Evidence,
  product?: InsuranceProduct,
): SourceDocument[] {
  const local = product?.sourceDocuments ?? [];
  const out: SourceDocument[] = [];
  for (const id of evidence.sourceIds) {
    const s = local.find((x) => x.id === id) ?? globalSources.find((x) => x.id === id);
    if (s && !out.some((x) => x.id === s.id)) out.push(s);
  }
  return out;
}

/**
 * 一個事實是否「有可追溯的證據」。
 * 回傳 false 時，UI 必須顯示「目前尚未加入可核實來源」，
 * 而不是假裝它有來源。
 */
export function hasTraceableEvidence(
  evidence: Evidence,
  product?: InsuranceProduct,
): boolean {
  if (!evidence.sourceIds.length) return false;
  return resolveEvidenceSources(evidence, product).length > 0;
}

/**
 * 平台整體的來源健康度：每個來源是否被至少一個事實引用。
 * 這是 Data Moat Dashboard 的其中一個指標。
 */
export function sourceUsageIndex(): Record<string, number> {
  const idx: Record<string, number> = {};
  for (const s of globalSources) idx[s.id] = 0;
  for (const p of products) {
    for (const s of p.sourceDocuments) idx[s.id] = 0;
  }
  for (const e of allEvidence) {
    for (const id of e.sourceIds) idx[id] = (idx[id] ?? 0) + 1;
  }
  return idx;
}

/**
 * 已核實事實 / 未核實事實的統計。
 * 「已核實」的定義：證據有指向來源，且來源本身的核實狀態為已核實。
 */
export function verificationBreakdown(): {
  verified: number;
  partially_verified: number;
  unverified: number;
  demo: number;
  total: number;
} {
  const counts = {
    verified: 0,
    partially_verified: 0,
    unverified: 0,
    demo: 0,
  };
  for (const e of allEvidence) {
    const st = e.verificationStatus as VerificationStatus;
    counts[st] = (counts[st] ?? 0) + 1;
  }
  return { ...counts, total: allEvidence.length };
}

/**
 * 依「產品 + 保障類別」取該類別下所有事實的證據。
 * 比較表的「逐項保障」一行會同時包含多個保障項目，
 * 所以這裡回傳一個陣列，而不是單一證據。
 */
export function getEvidenceByCoverageCategory(
  product: InsuranceProduct,
  category: string,
): Evidence[] {
  const names = product.coverage
    .filter((c) => c.category === category)
    .map((c) => c.name);
  if (!names.length) return [];
  const set = new Set(names);
  return allEvidence.filter(
    (e) =>
      e.id.startsWith(`${product.id}--`) &&
      names.some((n) => e.id === `${product.id}--${slugify(n)}`),
  );
}

/**
 * 依產品抓取所有證據（供 Evidence Drawer 一次列出）。
 */
export function getAllProductEvidence(product: InsuranceProduct): Evidence[] {
  return allEvidence.filter((e) => e.id.startsWith(`${product.id}--`));
}
