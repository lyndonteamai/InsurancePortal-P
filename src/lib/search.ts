import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";

export type SearchResultKind = "product" | "article" | "faq";

export type SearchResult = {
  kind: SearchResultKind;
  id: string;
  title: string;
  snippet: string;
  href: string;
  meta: string;
};

function normalize(s: string) {
  return s.toLowerCase().trim();
}

/** 簡易分詞：按空白、標點切分，並保留中文字串整體 */
function tokenize(q: string): string[] {
  return normalize(q)
    .split(/[\s,，。.、;；:：!！?？/]+/)
    .filter(Boolean);
}

const CJK = /[\u4e00-\u9fff]/;

function isCjk(s: string) {
  return CJK.test(s);
}

/** 對中文 token 做 2-gram 拆分，用於「香港醫療保險」這類複合查詢 */
function bigrams(token: string): string[] {
  if (!isCjk(token) || token.length < 3) return [];
  const out: string[] = [];
  for (let i = 0; i < token.length - 1; i++) out.push(token.slice(i, i + 2));
  return out;
}

function matchScore(haystack: string, tokens: string[]): number {
  const h = normalize(haystack);
  let score = 0;
  for (const t of tokens) {
    if (!t) continue;
    if (h.includes(t)) {
      score += t.length >= 3 ? 5 : 3;
      continue;
    }
    // 中文複合詞：2-gram 命中率達一半即視為相關
    const grams = bigrams(t);
    if (grams.length) {
      const hit = grams.filter((g) => h.includes(g)).length;
      const ratio = hit / grams.length;
      if (ratio >= 0.5) score += 2 * ratio;
    }
  }
  return score;
}

export function searchAll(query: string): SearchResult[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];

  const results: SearchResult[] = [];

  for (const p of products) {
    const hay = [p.name, p.insurer, p.category, p.coverageSummary, ...p.keyFeatures, ...p.exclusions, ...p.features].join(" ");
    const score = matchScore(hay, tokens);
    if (score > 0) {
      results.push({
        kind: "product",
        id: p.id,
        title: p.name,
        snippet: p.coverageSummary,
        href: `/products/${p.id}`,
        meta: `${p.insurer} · ${p.category}`,
      });
    }
  }

  for (const a of articles) {
    const body = a.sections
      .map((s) => `${s.heading} ${s.paragraphs.join(" ")} ${(s.bullets ?? []).join(" ")}`)
      .join(" ");
    const hay = [a.title, a.excerpt, a.category, body].join(" ");
    const score = matchScore(hay, tokens);
    if (score > 0) {
      results.push({
        kind: "article",
        id: a.slug,
        title: a.title,
        snippet: a.excerpt,
        href: `/learn/${a.slug}`,
        meta: `${a.category} · 閱讀 ${a.readingMinutes} 分鐘`,
      });
    }
  }

  for (const f of faqs) {
    const hay = [f.question, f.answer, f.category, ...f.keywords].join(" ");
    const score = matchScore(hay, tokens);
    if (score > 0) {
      results.push({
        kind: "faq",
        id: f.id,
        title: f.question,
        snippet: f.answer,
        href: `/learn#faq-${f.id}`,
        meta: `常見問題 · ${f.category}`,
      });
    }
  }

  return results.sort((a, b) => a.title.localeCompare(b.title, "zh-HK"));
}

export const searchSuggestions = [
  "香港醫療保險",
  "危疾保險比較",
  "自付額是什麼",
  "住院保險保障",
  "續保條件",
  "旅遊保險",
];
