import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { dictionary } from "@/data/dictionary";
import { hubs } from "@/data/hubs";
import { tokenize, matchScore } from "./search";

// ============================================================
// 問保險問題引擎 (/ask)
// ============================================================
// 設計目標：現在是「關鍵詞 + 資料匹配」的檢索式引擎，
// 但整個架構已經按未來接入 RAG / LLM 的方式預留：
//
//   1. 回答永遠引用資料庫中的具體條目（sourceRef），不自由發揮
//   2. 每個回答區塊都帶「資料來源」連結
//   3. 找不到匹配時明確說「資料庫內沒有這個問題的答案」
//   4. 回答結構固定為：直接答案 → 依據條目 → 相關產品 → 相關術語
//
// 接入 LLM 時，只需把 matchResults 換成向量檢索，
// 把 composeAnswer 換成 prompt 生成，其餘 UI 與追蹤邏輯不變。
// ============================================================

export type AskSourceKind = "faq" | "term" | "article" | "product" | "hub";

export type AskSource = {
  kind: AskSourceKind;
  id: string;
  title: string;
  snippet: string;
  href: string;
  score: number;
};

export type AskAnswer = {
  /** 直接回答（一句話） */
  direct: string;
  /** 詳細說明段落 */
  detail: string[];
  /** 依據條目 */
  sources: AskSource[];
  /** 相關產品 */
  relatedProducts: { id: string; slug: string; name: string; tagline: string }[];
  /** 相關術語 */
  relatedTerms: { slug: string; zh: string; term: string }[];
  /** 是否找到答案 */
  found: boolean;
};

export const ASK_KIND_LABELS: Record<AskSourceKind, string> = {
  faq: "常見問題",
  term: "保險術語",
  article: "知識文章",
  product: "產品資料",
  hub: "主題指南",
};

/** 匹配：同時檢索四類資料源 */
export function matchResults(query: string): AskSource[] {
  const q = query.trim();
  if (!q) return [];
  const tokens = tokenize(q);
  if (!tokens.length) return [];
  const out: AskSource[] = [];

  for (const f of faqs) {
    const score =
      matchScore([f.question, f.answer, ...f.keywords].join(" "), tokens) +
      (f.question.includes(q) ? 12 : 0);
    if (score > 0)
      out.push({
        kind: "faq",
        id: f.id,
        title: f.question,
        snippet: f.answer,
        href: `/learn#faq-${f.id}`,
        score,
      });
  }

  for (const t of dictionary) {
    const score =
      matchScore(
        [t.term, t.zh, t.quickAnswer, t.explanation, ...t.howToCompare].join(" "),
        tokens,
      ) +
      (t.zh.includes(q) ? 10 : 0) +
      (t.term.toLowerCase().includes(q.toLowerCase()) ? 12 : 0);
    if (score > 0)
      out.push({
        kind: "term",
        id: t.slug,
        title: `${t.zh}（${t.term}）`,
        snippet: t.quickAnswer,
        href: `/dictionary/${t.slug}`,
        score,
      });
  }

  for (const a of articles) {
    const score =
      matchScore(
        [
          a.title,
          a.excerpt,
          a.quickAnswer,
          ...a.sections.flatMap((s) => [s.heading, ...s.body]),
        ].join(" "),
        tokens,
      ) +
      (a.title.includes(q) ? 10 : 0);
    if (score > 0)
      out.push({
        kind: "article",
        id: a.slug,
        title: a.title,
        snippet: a.quickAnswer,
        href: `/learn/${a.slug}`,
        score,
      });
  }

  for (const h of hubs) {
    const score =
      matchScore(
        [h.title, h.intro, h.quickAnswer, ...h.sections.flatMap((s) => s.body)].join(
          " ",
        ),
        tokens,
      ) + (h.title.includes(q) ? 8 : 0);
    if (score > 0)
      out.push({
        kind: "hub",
        id: h.slug,
        title: h.title,
        snippet: h.quickAnswer,
        href: `/${h.slug}`,
        score,
      });
  }

  for (const p of products) {
    const score =
      matchScore(
        [
          p.name,
          p.tagline,
          p.description,
          ...p.features,
          ...p.coverage.map((c) => `${c.name} ${c.summary}`),
        ].join(" "),
        tokens,
      ) + (p.name.toLowerCase().includes(q.toLowerCase()) ? 10 : 0);
    if (score > 0)
      out.push({
        kind: "product",
        id: p.id,
        title: p.name,
        snippet: p.tagline,
        href: `/products/${p.slug}`,
        score,
      });
  }

  return out.sort((a, b) => b.score - a.score);
}

/**
 * 組成回答。核心原則：
 * - 只引用資料庫中實際存在的條目
 * - 找不到就明確說沒有，不編造
 */
export function composeAnswer(query: string): AskAnswer {
  const results = matchResults(query);
  const q = query.trim();

  if (!results.length) {
    return {
      direct: `資料庫內目前沒有關於「${q}」的條目。`,
      detail: [
        "這個提問引擎目前只會檢索平台資料庫中已收錄的內容，涵蓋產品條款、術語解釋、知識文章與常見問題。",
        "如果你的問題涉及具體保單條款的法律解釋，或需要評估你的個人情況，建議直接向保險公司或持牌經紀查詢——他們可以按你的實際條款版本回答。",
        "你也可以試試用更接近術語名稱的方式重新搜尋，例如「自付額」、「續保」或「危疾定義」。",
      ],
      sources: [],
      relatedProducts: [],
      relatedTerms: [],
      found: false,
    };
  }

  const top = results[0];
  const faq = faqs.find((f) => f.id === top.id);
  const term = dictionary.find((t) => t.slug === top.id);
  const article = articles.find((a) => a.slug === top.id);
  const hub = hubs.find((h) => h.slug === top.id);
  const product = products.find((p) => p.id === top.id);

  let direct = "";
  const detail: string[] = [];

  if (top.kind === "faq" && faq) {
    direct = faq.answer;
    detail.push(
      `這一條收錄在平台的常見問題中，分類為「${faq.category}」。相關的搜尋關鍵字包括：${faq.keywords.join("、")}。`,
    );
  } else if (top.kind === "term" && term) {
    direct = term.quickAnswer;
    detail.push(term.explanation);
    detail.push(`為甚麼重要：${term.whyItMatters}`);
  } else if (top.kind === "article" && article) {
    direct = article.quickAnswer;
    detail.push(article.intro);
  } else if (top.kind === "hub" && hub) {
    direct = hub.quickAnswer;
    detail.push(hub.intro);
  } else if (top.kind === "product" && product) {
    direct = `${product.name}：${product.tagline}。${product.description.slice(0, 80)}`;
    detail.push(
      product.verification.status === "verified"
        ? "這個產品的條款資料已完成核對，來源文件列於產品頁的「資料來源」一節。"
        : `這個產品的資料核實狀態為「${product.verification.status === "partially_verified" ? "部分核實" : product.verification.status === "unverified" ? "尚未核實" : "原型模擬資料"}」，詳見產品頁。`,
    );
  }

  // 補充：在同類來源中再找 1–2 條，形成「多條依據」
  const extras = results
    .slice(1)
    .filter((r) => r.kind !== top.kind)
    .slice(0, 3);
  if (extras.length) {
    detail.push(
      `另外，平台資料庫內有以下 ${extras.length} 條相關條目可以參考：${extras
        .map((e) => e.title)
        .join("、")}。`,
    );
  }

  const relatedProductIds = new Set<string>();
  for (const r of results) {
    if (r.kind === "product") relatedProductIds.add(r.id);
  }
  const termSlugByName = new Map(dictionary.map((t) => [t.zh, t.slug]));

  const relatedProducts = products
    .filter((p) => relatedProductIds.has(p.id))
    .slice(0, 3)
    .map((p) => ({ id: p.id, slug: p.slug, name: p.name, tagline: p.tagline }));

  const relatedTerms = dictionary
    .filter((t) => {
      if (top.kind === "term" && term && t.slug === term.slug) return false;
      const score = matchScore(
        [t.term, t.zh, t.quickAnswer].join(" "),
        tokenize(q),
      );
      return score > 0;
    })
    .slice(0, 5)
    .map((t) => ({ slug: t.slug, zh: t.zh, term: t.term }));

  return {
    direct,
    detail,
    sources: results.slice(0, 6),
    relatedProducts,
    relatedTerms: relatedTerms.length
      ? relatedTerms
      : Array.from(termSlugByName.keys())
          .slice(0, 3)
          .map((zh) => ({
            slug: termSlugByName.get(zh)!,
            zh,
            term: dictionary.find((t) => t.zh === zh)?.term ?? "",
          })),
    found: true,
  };
}

/** 推薦的起始問題 */
export const askSuggestions = [
  "自付額高會怎樣？",
  "保證續保是甚麼意思？",
  "危疾保險的定義包括甚麼？",
  "醫療保險和危疾保險有甚麼分別？",
  "保費是每年都一樣嗎？",
  "甚麼是保證現金值？",
  "等待期是多久？",
  "旅遊保險的自付額應該選多少？",
  "投保前已有的病症會怎樣？",
  "甚麼是生存期？",
];
