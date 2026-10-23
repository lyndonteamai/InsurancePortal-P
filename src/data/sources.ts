import type { SourceDocument } from "./types";

// ============================================================
// 來源文件登記表 (Source Document Registry)
// ============================================================
// V2 的核心規則：頁面上的每一個數據，理論上都要能指回一份來源文件。
// 原型階段所有「條款類」來源都是 isPrototype: true，表示這些文件
// 並不存在於公開世界，僅用來示範「有來源」與「沒來源」的 UI 差異。
//
// 真實環境接入方式：
//   1. 由編輯後台把 file upload 的條款 PDF 轉為 SourceDocument
//   2. 每個 CoverageItem / ExclusionItem 記錄自己的 sourceIds
//   3. 產品頁的「資料來源」欄由 sourceIds 聚合而成
// ============================================================

/** 平台層面的公共來源（跨產品引用） */
export const globalSources: SourceDocument[] = [
  {
    id: "src-hkia-medical-guide",
    title: "醫療保險計劃條款閱覽指引",
    type: "regulator",
    publisher: "保險業監管局（原型引用說明）",
    version: "指引 v3",
    publishedAt: "2025-11-20",
    url: null,
    locator: "第二章 · 自願醫療保險計劃",
    isPrototype: true,
    note: "原型中用來示範「監管機構公開指引」這一類來源的呈現方式。",
  },
  {
    id: "src-hkia-disclosure",
    title: "保險產品資訊披露要求摘要",
    type: "regulator",
    publisher: "保險業監管局（原型引用說明）",
    version: "披露指引 v2",
    publishedAt: "2025-09-08",
    url: null,
    locator: "第 4 節 · 產品資料披露",
    isPrototype: true,
    note: "示範「平台以監管要求作為資料完整度基準」的概念。",
  },
  {
    id: "src-hkai-hk-insurance-stat",
    title: "香港保險業統計數據摘要",
    type: "industry_body",
    publisher: "香港保險業聯會（原型引用說明）",
    version: "2025 年度摘要",
    publishedAt: "2026-01-30",
    url: null,
    locator: "保費收入 · 分業務類別",
    isPrototype: true,
    note: "示範跨產品、跨時間的宏觀數據來源。",
  },
  {
    id: "src-internal-style",
    title: "平台編輯方針：數據表達與用語規範",
    type: "internal_note",
    publisher: "保險指南 編輯組",
    version: "v1.4",
    publishedAt: "2026-01-10",
    url: null,
    locator: "第 2 節 · 中立用語",
    isPrototype: true,
    note: "說明為何平台不使用「最強」「最抵」等排名式描述。",
  },
];

export const globalSourceMap: Record<string, SourceDocument> = Object.fromEntries(
  globalSources.map((s) => [s.id, s]),
);

/** 依 id 取來源（先查全域表，再查產品內嵌表） */
export function resolveSource(
  id: string,
  local: SourceDocument[] = [],
): SourceDocument | undefined {
  return local.find((s) => s.id === id) ?? globalSourceMap[id];
}

/** 收集一個產品引用的所有來源（去重） */
export function collectSources(
  local: SourceDocument[],
  referencedIds: string[],
): SourceDocument[] {
  const seen = new Set<string>();
  const out: SourceDocument[] = [];
  for (const id of referencedIds) {
    if (seen.has(id)) continue;
    const s = resolveSource(id, local);
    if (s) {
      seen.add(id);
      out.push(s);
    }
  }
  return out;
}
