import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { dictionary } from "@/data/dictionary";
import { hubs } from "@/data/hubs";
import { insurers } from "@/data/insurers";
import { CATEGORY_LABELS } from "@/data/types";

// ============================================================
// 超級保險搜索 V3 (Unified Insurance Search)
// ============================================================
// 一個搜索框要同時找得到：
//   產品 / 保險公司 / 保險類別 / 保障項目 / 條款 / 保費 / 術語 / 文章 / FAQ
//
// 兩條分開的邏輯（這是本輪的關鍵紅線）：
//
//   1. resultType: organic | sponsored
//      贊助曝光與自然結果在資料結構層面就分開，兩者永���會混在
//      同一個排序佇列裡。自然結果的排序函式完全看不到 sponsored 項目。
//
//   2. isQuestionQuery：輸入是完整問題（「自付額是什麼？」）時，
//      優先回傳 Quick Answer，而不是把問題拆成關鍵詞散落在結果列表裡。
//
// 新增資料源只需在 searchAll 多一個迴圈，UI 層不必改動。
// ============================================================

/** 結果類型：自然 vs 贊助。這兩者的排序邏輯必須完全獨立。 */
export type ResultType = "organic" | "sponsored";

export type SearchResultKind =
  | "product"
  | "insurer"
  | "hub"
  | "term"
  | "article"
  | "faq";

export type SearchResult = {
  kind: SearchResultKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  score: number;
  /** 用於結果列表下方顯示的匹配摘要 */
  snippet?: string;
  /**
   * organic = 自然結果（由相關性、完整度、可核實程度等決定）
   * sponsored = 付費曝光（必須標示，且不參與自然排序）
   */
  resultType: ResultType;
  /** 贊助方（僅 sponsored 結果有值） */
  sponsorName?: string;
  /** 類別標籤（例如「醫療保險」） */
  categoryLabel?: string;
  /** 核實狀態（產品類結果有值） */
  verificationStatus?: string;
  /** 資料完整度 0–100（自然排序的其中一個依據） */
  completeness?: number;
};

export const SEARCH_KIND_LABELS: Record<SearchResultKind, string> = {
  product: "保險產品",
  insurer: "保險公司",
  hub: "主題指南",
  term: "保險術語",
  article: "保險知識",
  faq: "常見問題",
};

/**
 * 結果分組的顯示順序。
 * 「保險公司」排在「保險產品」之前，是因為使用者搜尋公司名時
 * 多半想看該公司的產品線，而不是先看一堆產品。
 */
export const SEARCH_KIND_ORDER: SearchResultKind[] = [
  "product",
  "insurer",
  "hub",
  "term",
  "article",
  "faq",
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "");
}

const CJK = /[一-鿿]/;

function bigrams(token: string): string[] {
  if (!CJK.test(token) || token.length < 3) return [];
  const out: string[] = [];
  for (let i = 0; i < token.length - 1; i++) out.push(token.slice(i, i + 2));
  return out;
}

/**
 * 比對分數：完全包含給高分，CJK 2-gram 命中率達 50% 給部分分。
 */
export function matchScore(haystack: string, tokens: string[]): number {
  const h = normalize(haystack);
  let score = 0;
  for (const t of tokens) {
    if (!t) continue;
    if (h.includes(t)) {
      score += t.length >= 3 ? 5 : 3;
      continue;
    }
    const grams = bigrams(t);
    if (grams.length) {
      const hit = grams.filter((g) => h.includes(g)).length;
      const ratio = hit / grams.length;
      if (ratio >= 0.5) score += 2 * ratio;
    }
  }
  return score;
}

/** 把查詢字串切成 token（英文按空格，中文按標點切） */
export function tokenize(query: string): string[] {
  const parts = query
    .toLowerCase()
    .split(/[\s,，。.、;；:：!！?？()（）「」《》"'|/\\-]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    out.push(p);
    // 中文長詞再切成 2-gram 片段，提高召回
    if (CJK.test(p) && p.length > 3) {
      for (const g of bigrams(p)) out.push(g);
    }
  }
  return Array.from(new Set(out));
}

/**
 * 判斷輸入是否為一個「完整問題」。
 *
 * 判斷依據（保守取向，宁可少判）：
 *   · 以問號結尾
 *   · 含有中文疑問詞（什麼 / 甚麼 / 點解 / 為何 / 如何 / 是否 / 是不是 / 差異）
 *   · 含有英文疑問詞（what / how / why / which / is / can）
 */
export function isQuestionQuery(query: string): boolean {
  const q = query.trim();
  if (!q) return false;
  if (/[?？]\s*$/.test(q)) return true;
  const zhCues = ["什麼", "甚麼", "點解", "為何", "為什麼", "如何", "怎樣", "怎麼", "是否", "是不是", "差異", "分別", "有甚麼", "有什麼", "可以", "應該"];
  const enCues = ["what", "how", "why", "which", "can i", "should i", "difference"];
  const lower = q.toLowerCase();
  if (zhCues.some((c) => q.includes(c))) return true;
  if (enCues.some((c) => lower.includes(c))) return true;
  return false;
}

/**
 * 產品資料完整度（0–100）。
 *
 * 自然排序的其中一個依據：資料越完整、越可核實的產品，
 * 在同等相關性下應該排得稍前。這不是「排名」，而是「可比較性」的度量。
 */
export function productCompleteness(p: (typeof products)[number]): number {
  let score = 0;
  // 有來源文件
  if (p.sourceDocuments.length) score += 25;
  // 保障項目有來源
  const covWithSrc = p.coverage.filter((c) => c.sourceIds.length).length;
  score += p.coverage.length ? (covWithSrc / p.coverage.length) * 20 : 0;
  // 不保事項有來源
  const excWithSrc = p.exclusions.filter((e) => e.sourceIds.length).length;
  score += p.exclusions.length ? (excWithSrc / p.exclusions.length) * 15 : 0;
  // 條款細項齊全
  if (p.deductible) score += 10;
  if (p.waitingPeriod) score += 10;
  if (p.renewal) score += 10;
  // 保費示例
  if (p.premiumExamples.length) score += 10;
  return Math.min(100, Math.round(score));
}

/**
 * 自然排序分數。
 *
 * 這是唯一的自然排序入口 —— 它只接收 organic 結果。
 * Sponsored 結果永遠不會進入這個函式，這是架構層面的保證，
 * 而不是靠開發紀律。
 */
export function organicRankScore(r: SearchResult): number {
  let s = r.score;
  // 資料完整度：最多加 8 分
  if (r.completeness != null) s += (r.completeness / 100) * 8;
  // 可核實程度：最多加 6 分
  if (r.verificationStatus === "verified") s += 6;
  else if (r.verificationStatus === "partially_verified") s += 3;
  else if (r.verificationStatus === "unverified") s -= 2;
  // demo 資料不加分也不扣分，但一定不會被當成已核實
  return s;
}

/**
 * 全域搜索。
 *
 * @param query 使用者輸入
 * @param sponsored 贊助結果（由外部注入，預設空）
 */
export function searchAll(
  query: string,
  injectedSponsored: SearchResult[] = [],
): SearchResult[] {
  const q = query.trim();
  if (q.length < 1) return [];
  const tokens = tokenize(q);
  if (!tokens.length) return [];
  const lowerQ = q.toLowerCase();
  const organic: SearchResult[] = [];
  /** 付費曝光池：只收 resultType === "sponsored" 的結果，永不進入自然排序 */
  const sponsored: SearchResult[] = [];

  // --- 產品 ---
  for (const p of products) {
    const hay = [
      p.name,
      p.nameEn,
      p.tagline,
      p.description,
      ...p.features,
      ...p.coverage.map((c) => `${c.name} ${c.summary} ${c.limit ?? ""}`),
      ...p.termPoints.map((t) => `${t.title} ${t.detail}`),
      p.eligibility.residency ?? "",
    ].join(" ");
    let score = matchScore(hay, tokens);
    if (p.name.toLowerCase().includes(lowerQ)) score += 10;
    if (p.nameEn.toLowerCase().includes(lowerQ)) score += 8;
    if (score > 0) {
      /**
       * 付費曝光隔離：帶 sponsored 標記的產品**不進入自然結果佇列**。
       * 它會被放進獨立的贊助池，由 UI 單獨渲染並附「贊助」徽章。
       * 這是 NEVER PAY-TO-RANK 的實作保證——不是「排後面」，是「不參與」。
       */
      if (p.sponsored?.isSponsored) {
        sponsored.push({
          kind: "product",
          id: p.id,
          title: p.name,
          subtitle: p.tagline,
          href: `/products/${p.slug}`,
          score,
          snippet: p.description.slice(0, 90),
          resultType: "sponsored",
          sponsorName: p.sponsored.sponsorName ?? "商業合作方",
          categoryLabel: CATEGORY_LABELS[p.category],
          verificationStatus: p.verification.status,
          completeness: productCompleteness(p),
        });
        continue;
      }
      organic.push({
        kind: "product",
        id: p.id,
        title: p.name,
        subtitle: p.tagline,
        href: `/products/${p.slug}`,
        score,
        snippet: p.description.slice(0, 90),
        resultType: "organic",
        categoryLabel: CATEGORY_LABELS[p.category],
        verificationStatus: p.verification.status,
        completeness: productCompleteness(p),
      });
    }
  }

  // --- 保險公司 ---
  for (const i of insurers) {
    const hay = [
      i.name,
      i.nameEn,
      i.description,
      i.focus.join(" "),
      ...i.productIds,
    ].join(" ");
    const score = matchScore(hay, tokens);
    if (score > 0) {
      organic.push({
        kind: "insurer",
        id: i.slug,
        title: i.name,
        subtitle: i.focus.slice(0, 3).join("・"),
        href: `/insurers/${i.slug}`,
        score: score * 1.15,
        snippet: i.description.slice(0, 110),
        resultType: "organic",
        categoryLabel: `旗下 ${i.productIds.length} 款產品`,
      });
    }
  }

  // --- 主題 Hub（類別指南）---
  for (const h of hubs) {
    const hay = [
      h.title,
      h.intro,
      h.quickAnswer,
      h.metaDescription,
      ...h.sections.flatMap((s) => [s.heading, ...s.body]),
    ].join(" ");
    const score = matchScore(hay, tokens);
    if (score > 0) {
      organic.push({
        kind: "hub",
        id: h.slug,
        title: h.title,
        subtitle: CATEGORY_LABELS[h.category],
        href: `/${h.slug}`,
        score: score * 1.05,
        snippet: h.quickAnswer,
        resultType: "organic",
        categoryLabel: "主題指南",
      });
    }
  }

  // --- 保險術語 ---
  for (const t of dictionary) {
    const hay = [
      t.term,
      t.zh,
      t.quickAnswer,
      t.explanation,
      t.whyItMatters,
      ...t.howToCompare,
    ].join(" ");
    let score = matchScore(hay, tokens) * 1.1;
    if (t.term.toLowerCase().includes(lowerQ)) score += 12;
    if (t.zh.includes(q)) score += 8;
    if (score > 0) {
      organic.push({
        kind: "term",
        id: t.slug,
        title: `${t.zh}（${t.term}）`,
        subtitle: t.quickAnswer.slice(0, 60),
        href: `/dictionary/${t.slug}`,
        score,
        snippet: t.quickAnswer,
        resultType: "organic",
        categoryLabel: "保險術語",
      });
    }
  }

  // --- 知識文章 ---
  for (const a of articles) {
    const hay = [
      a.title,
      a.excerpt,
      a.quickAnswer,
      a.intro,
      ...a.keyTakeaways,
      ...a.sections.flatMap((s) => [s.heading, ...s.body, ...(s.bullets ?? [])]),
    ].join(" ");
    let score = matchScore(hay, tokens);
    if (a.title.includes(q)) score += 10;
    if (score > 0) {
      organic.push({
        kind: "article",
        id: a.slug,
        title: a.title,
        subtitle: a.category,
        href: `/learn/${a.slug}`,
        score,
        snippet: a.quickAnswer,
        resultType: "organic",
        categoryLabel: a.category,
      });
    }
  }

  // --- FAQ ---
  for (const f of faqs) {
    const hay = [f.question, f.answer, f.category, ...f.keywords].join(" ");
    let score = matchScore(hay, tokens) * 0.95;
    if (f.question.includes(q)) score += 10;
    if (score > 0) {
      organic.push({
        kind: "faq",
        id: f.id,
        title: f.question,
        subtitle: f.category,
        href: `/learn#faq-${f.id}`,
        score,
        snippet: f.answer.slice(0, 120),
        resultType: "organic",
        categoryLabel: f.category,
      });
    }
  }

  // 自然結果排序：只用 organicRankScore，sponsored 完全不參與
  const ranked = organic
    .map((r) => ({ ...r, score: organicRankScore(r) }))
    .sort((a, b) => b.score - a.score);

  // 贊助結果附在最後，絕不混入自然排序
  return [...ranked, ...sponsored, ...injectedSponsored];
}

/** 依類型分組（自然結果與贊助結果分開處理） */
export function groupResults(
  results: SearchResult[],
): { kind: SearchResultKind; label: string; items: SearchResult[] }[] {
  const organic = results.filter((r) => r.resultType === "organic");
  const sponsored = results.filter((r) => r.resultType === "sponsored");
  const groups = SEARCH_KIND_ORDER.map((kind) => ({
    kind,
    label: SEARCH_KIND_LABELS[kind],
    items: organic.filter((r) => r.kind === kind),
  })).filter((g) => g.items.length > 0);
  return groups;
}

/** 取出贊助結果（單獨渲染，與自然結果分開） */
export function extractSponsored(results: SearchResult[]): SearchResult[] {
  return results.filter((r) => r.resultType === "sponsored");
}

/**
 * 問題型查詢的「一句話答案」。
 *
 * 當使用者輸入的是完整問題時，先給答案，再給延伸內容。
 * 這個函式只從平台自身的結構化資料取值 —— 未來接入 LLM 時，
 * 答案也必須以這裡的資料為基礎（Grounded in Platform Data）。
 */
export function findQuickAnswer(query: string): {
  answer: string;
  termSlug?: string;
  articleSlug?: string;
  faqId?: string;
} | null {
  const q = query.trim();
  const tokens = tokenize(q);

  // 1) 術語：命中度最高且是問題導向
  let bestTerm: { slug: string; quick: string; score: number } | null = null;
  for (const t of dictionary) {
    const hay = `${t.zh} ${t.term} ${t.quickAnswer}`;
    let s = matchScore(hay, tokens);
    if (t.zh.includes(q)) s += 20;
    else if (q.includes(t.zh)) s += 18;
    if (s > 0 && (!bestTerm || s > bestTerm.score)) {
      bestTerm = { slug: t.slug, quick: t.quickAnswer, score: s };
    }
  }

  // 2) FAQ：問題型查詢最直接的答案
  let bestFaq: { id: string; answer: string; score: number } | null = null;
  for (const f of faqs) {
    const hay = `${f.question} ${f.answer} ${f.keywords.join(" ")}`;
    let s = matchScore(hay, tokens);
    if (f.question.includes(q)) s += 20;
    if (s > 0 && (!bestFaq || s > bestFaq.score)) {
      bestFaq = { id: f.id, answer: f.answer, score: s };
    }
  }

  // 3) 文章
  let bestArticle: { slug: string; quick: string; score: number } | null = null;
  for (const a of articles) {
    const hay = `${a.title} ${a.quickAnswer} ${a.excerpt}`;
    const s = matchScore(hay, tokens);
    if (s > 0 && (!bestArticle || s > bestArticle.score)) {
      bestArticle = { slug: a.slug, quick: a.quickAnswer, score: s };
    }
  }

  const candidates = [bestTerm, bestFaq, bestArticle].filter(Boolean) as {
    score: number;
  }[];
  if (!candidates.length) return null;
  const top = Math.max(...candidates.map((c) => c.score));
  if (top < 4) return null;

  if (bestTerm && bestTerm.score === top) {
    return { answer: bestTerm.quick, termSlug: bestTerm.slug };
  }
  if (bestFaq && bestFaq.score === top) {
    return { answer: bestFaq.answer, faqId: bestFaq.id };
  }
  if (bestArticle) {
    return { answer: bestArticle.quick, articleSlug: bestArticle.slug };
  }
  return null;
}

/** 搜尋建議（用於搜尋框下拉） */
export function searchSuggestions(query: string): string[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const tokens = tokenize(q);
  const pool: { text: string; weight: number }[] = [];

  for (const p of products) {
    pool.push({ text: p.name, weight: 3 });
    for (const f of p.features) pool.push({ text: f, weight: 1.2 });
  }
  for (const t of dictionary) {
    pool.push({ text: t.zh, weight: 2 });
    pool.push({ text: t.term, weight: 1.5 });
  }
  for (const a of articles) pool.push({ text: a.title, weight: 2 });
  for (const h of hubs) pool.push({ text: h.title, weight: 2 });
  for (const i of insurers) pool.push({ text: i.name, weight: 2.2 });
  for (const f of faqs) pool.push({ text: f.question, weight: 1.5 });
  for (const c of [
    "醫療保險",
    "危疾保險",
    "人壽保險",
    "旅遊保險",
    "家居保險",
    "汽車保險",
    "儲蓄退休保險",
    "自付額",
    "續保",
    "等候期",
    "保額",
    "住院保障",
  ]) {
    pool.push({ text: c, weight: 2.5 });
  }

  const scored = pool
    .map((item) => ({
      text: item.text,
      score: matchScore(item.text, tokens) * item.weight,
    }))
    .filter((x) => x.score > 0);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of scored.sort((a, b) => b.score - a.score)) {
    if (seen.has(s.text)) continue;
    seen.add(s.text);
    out.push(s.text);
    if (out.length >= 8) break;
  }
  return out;
}

/** 預設建議詞（搜尋框空狀態顯示） */
export const defaultSuggestions = [
  "自付額是什麼",
  "危疾保險定義",
  "保證續保",
  "醫療保險保障範圍",
  "自付額高嗎",
  "旅遊保險自付額",
  "甚麼是現金值",
  "保單等候期",
];
