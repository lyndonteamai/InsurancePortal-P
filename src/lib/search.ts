import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { dictionary } from "@/data/dictionary";
import { hubs } from "@/data/hubs";
import { insurers } from "@/data/insurers";

// ============================================================
// 全站搜尋 V2
// ============================================================
// 四類結果：產品 / 保險術語 / 知識文章 / FAQ
// 分詞策略：標點切分 + CJK 2-gram 模糊比對
// 這一層設計成可獨立擴充：加入新資料源只需在 searchAll 中多一個
// 迴圈，不需要改 UI。
// ============================================================

export type SearchResultKind = "product" | "term" | "article" | "faq";

export type SearchResult = {
  kind: SearchResultKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  score: number;
  /** 用於結果列表下方顯示的匹配摘要 */
  snippet?: string;
};

export const SEARCH_KIND_LABELS: Record<SearchResultKind, string> = {
  product: "產品",
  term: "保險術語",
  article: "知識文章",
  faq: "常見問題",
};

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

export function searchAll(query: string): SearchResult[] {
  const q = query.trim();
  if (q.length < 1) return [];
  const tokens = tokenize(q);
  if (!tokens.length) return [];
  const results: SearchResult[] = [];

  // --- 產品 ---
  for (const p of products) {
    const hay = [
      p.name,
      p.nameEn,
      p.tagline,
      p.description,
      ...p.features,
      ...p.coverage.map((c) => `${c.name} ${c.summary}`),
    ].join(" ");
    let score = matchScore(hay, tokens);
    if (p.name.toLowerCase().includes(q.toLowerCase())) score += 10;
    if (score > 0) {
      results.push({
        kind: "product",
        id: p.id,
        title: p.name,
        subtitle: p.tagline,
        href: `/products/${p.slug}`,
        score,
        snippet: p.description.slice(0, 90),
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
      ...t.howToCompare,
    ].join(" ");
    let score = matchScore(hay, tokens) * 1.1;
    if (t.term.toLowerCase().includes(q.toLowerCase())) score += 12;
    if (t.zh.includes(q)) score += 8;
    if (score > 0) {
      results.push({
        kind: "term",
        id: t.slug,
        title: `${t.zh}（${t.term}）`,
        subtitle: t.quickAnswer.slice(0, 60),
        href: `/dictionary/${t.slug}`,
        score,
        snippet: t.quickAnswer,
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
      results.push({
        kind: "article",
        id: a.slug,
        title: a.title,
        subtitle: a.category,
        href: `/learn/${a.slug}`,
        score,
        snippet: a.quickAnswer,
      });
    }
  }

  // --- FAQ ---
  for (const f of faqs) {
    const hay = [f.question, f.answer, f.category, ...f.keywords].join(" ");
    let score = matchScore(hay, tokens) * 0.95;
    if (f.question.includes(q)) score += 10;
    if (score > 0) {
      results.push({
        kind: "faq",
        id: f.id,
        title: f.question,
        subtitle: f.category,
        href: `/learn#faq-${f.id}`,
        score,
        snippet: f.answer.slice(0, 120),
      });
    }
  }

  // --- 主題 Hub ---
  for (const h of hubs) {
    const hay = [
      h.title,
      h.intro,
      h.quickAnswer,
      ...h.sections.flatMap((s) => [s.heading, ...s.body]),
    ].join(" ");
    const score = matchScore(hay, tokens) * 0.9;
    if (score > 0) {
      results.push({
        kind: "article",
        id: `hub-${h.slug}`,
        title: h.title,
        subtitle: "主題指南",
        href: `/${h.slug}`,
        score,
        snippet: h.quickAnswer,
      });
    }
  }

  // --- 保險公司 ---
  for (const i of insurers) {
    const score = matchScore(
      `${i.name} ${i.nameEn} ${i.description} ${i.focus.join(" ")}`,
      tokens,
    );
    if (score > 0) {
      results.push({
        kind: "article",
        id: `insurer-${i.slug}`,
        title: i.name,
        subtitle: "保險公司",
        href: `/insurers/${i.slug}`,
        score: score * 0.95,
        snippet: i.description.slice(0, 90),
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/** 依類型分組 */
export function groupResults(
  results: SearchResult[],
): { kind: SearchResultKind; label: string; items: SearchResult[] }[] {
  const order: SearchResultKind[] = ["product", "term", "article", "faq"];
  return order
    .map((kind) => ({
      kind,
      label: SEARCH_KIND_LABELS[kind],
      items: results.filter((r) => r.kind === kind),
    }))
    .filter((g) => g.items.length > 0);
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
  for (const f of faqs) pool.push({ text: f.question, weight: 1.5 });
  for (const c of [
    "醫療保險",
    "危疾保險",
    "人壽保險",
    "旅遊保險",
    "自付額",
    "續保",
    "等待期",
    "保額",
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
