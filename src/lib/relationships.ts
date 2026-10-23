import { products } from "@/data/products";
import { insurers } from "@/data/insurers";
import { dictionary, dictionaryMap } from "@/data/dictionary";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { hubs } from "@/data/hubs";
import { globalSources } from "@/data/sources";
import type {
  Article,
  DictionaryTerm,
  FaqItem,
  InsuranceProduct,
  TopicHub,
} from "@/data/types";

// ============================================================
// 關係引擎 (Relationship Engine)
// ============================================================
// 這一輪不再在頁面裡硬寫「相關文章 / 相關產品 / 相關術語」清單。
// 所有相關內容都由這裡的關係圖推導出來：
//
//   保險公司 ──▶ 產品 ──▶ 保障項目 ──▶ 保險術語
//       │           │          │            │
//       │           │          │            ├──▶ FAQ
//       │           │          └──▶ 條款來源文件
//       │           └──▶ 知識文章 / 主題指南
//       └──────────────────────────────────▶ 產品比較
//
// 好處：資料量放大到數千個產品時，關聯頁面不需要人工維護清單，
//       因為關係是從結構化資料推出來的。
// ============================================================

export type RelationKind =
  | "insurer_product"
  | "product_coverage"
  | "product_term"
  | "product_article"
  | "product_faq"
  | "product_hub"
  | "product_source"
  | "term_article"
  | "term_term"
  | "article_term"
  | "article_product"
  | "article_faq"
  | "hub_product"
  | "hub_term"
  | "hub_article"
  | "hub_faq";

export type RelationEdge = {
  from: string;
  to: string;
  kind: RelationKind;
};

export type GraphNodeType =
  | "insurer"
  | "product"
  | "coverage"
  | "term"
  | "source"
  | "article"
  | "faq"
  | "hub"
  | "comparison";

export type GraphNode = {
  id: string;
  type: GraphNodeType;
  label: string;
  href?: string;
  status?: string;
};

export type GraphSnapshot = {
  nodes: GraphNode[];
  edges: RelationEdge[];
  counts: Record<GraphNodeType, number>;
  /** 每種關係的數量 */
  edgeCounts: Record<RelationKind, number>;
  totalNodes: number;
  totalEdges: number;
};

// ------------------------------------------------------------
// 索引（module-level 建一次，重複呼叫不會重複計算）
// ------------------------------------------------------------

const productById = new Map(products.map((p) => [p.id, p]));
const productBySlug = new Map(products.map((p) => [p.slug, p]));
const articleBySlug = new Map(articles.map((a) => [a.slug, a]));
const termBySlug = new Map(dictionary.map((t) => [t.slug, t]));
/**
 * 術語的引用格式在資料層並不統一：dictionary.relatedTerms 用英文 term 名
 * （例如 "Deductible"），articles.relatedTerms / hubs.termSlugs 用 slug
 * （例如 "deductible"）。這裡做統一解析，讓關係引擎不必假設格式。
 */
const termByAnyKey = new Map<string, DictionaryTerm>();
for (const t of dictionary) {
  termByAnyKey.set(t.slug, t);
  termByAnyKey.set(t.term, t);
  termByAnyKey.set(t.term.toLowerCase(), t);
  termByAnyKey.set(t.zh, t);
}

/** 把任意格式的術語引用解析成 DictionaryTerm */
export function resolveTerm(key: string): DictionaryTerm | undefined {
  return (
    termByAnyKey.get(key) ??
    termByAnyKey.get(key.toLowerCase()) ??
    termBySlug.get(key)
  );
}

/** 把任意格式的術語引用解析成 slug */
export function resolveTermSlug(key: string): string | undefined {
  return resolveTerm(key)?.slug;
}
const hubBySlug = new Map(hubs.map((h) => [h.slug, h]));
const faqById = new Map(faqs.map((f) => [f.id, f]));

/** 產品 → 術語（反向索引，由術語的 relatedProductIds 建立） */
const productTerms = new Map<string, string[]>();
/** 產品 → 保障項目名稱 */
const productCoverageTerms = new Map<string, string[]>();

for (const t of dictionary) {
  for (const pid of t.relatedProductIds) {
    if (!productById.has(pid)) continue;
    const list = productTerms.get(pid) ?? [];
    if (!list.includes(t.slug)) list.push(t.slug);
    productTerms.set(pid, list);
  }
}

for (const p of products) {
  const names: string[] = [];
  for (const c of p.coverage) names.push(c.name);
  for (const e of p.exclusions) names.push(e.name);
  productCoverageTerms.set(p.id, names);
}

/** 覆蓋項目名稱 → 術語（把「保障」與「術語」接起來） */
function termsForCoverageName(name: string): string[] {
  const out: string[] = [];
  for (const t of dictionary) {
    const haystacks = [t.zh, t.term];
    if (haystacks.some((h) => h && (h === name || name.includes(h) || h.includes(name)))) {
      out.push(t.slug);
    }
  }
  return out;
}

/** FAQ → 產品（由 faqs.productIds 建立的索引） */
const faqProducts = new Map<string, string[]>();
for (const f of faqs) {
  for (const pid of f.productIds ?? []) {
    if (!productById.has(pid)) continue;
    const list = faqProducts.get(pid) ?? [];
    if (!list.includes(f.id)) list.push(f.id);
    faqProducts.set(pid, list);
  }
}

// ------------------------------------------------------------
// Graph snapshot
// ------------------------------------------------------------

let cachedSnapshot: GraphSnapshot | null = null;

export function knowledgeGraph(): GraphSnapshot {
  if (cachedSnapshot) return cachedSnapshot;

  const nodes: GraphNode[] = [];
  const edges: RelationEdge[] = [];

  // 保險公司
  for (const i of insurers) {
    nodes.push({
      id: `insurer:${i.id}`,
      type: "insurer",
      label: i.name,
      href: `/insurers/${i.id}`,
    });
  }

  // 產品 + 覆蓋項目 + 來源
  for (const p of products) {
    nodes.push({
      id: `product:${p.id}`,
      type: "product",
      label: p.name,
      href: `/products/${p.slug}`,
      status: p.verification.status,
    });
    edges.push({
      from: `insurer:${p.insurerId}`,
      to: `product:${p.id}`,
      kind: "insurer_product",
    });

    for (const c of p.coverage) {
      const cid = `coverage:${p.id}:${c.name}`;
      nodes.push({ id: cid, type: "coverage", label: c.name });
      edges.push({ from: `product:${p.id}`, to: cid, kind: "product_coverage" });

      // 保障項目 → 相關術語
      for (const tslug of termsForCoverageName(c.name)) {
        edges.push({
          from: `product:${p.id}`,
          to: `term:${tslug}`,
          kind: "product_term",
        });
      }
    }

    for (const s of p.sourceDocuments) {
      const sid = `source:${s.id}`;
      if (!nodes.some((n) => n.id === sid)) {
        nodes.push({
          id: sid,
          type: "source",
          label: s.title,
          href: s.url ?? undefined,
          status: s.verificationStatus ?? "demo",
        });
      }
      edges.push({ from: `product:${p.id}`, to: sid, kind: "product_source" });
    }
  }

  // 術語
  for (const t of dictionary) {
    nodes.push({
      id: `term:${t.slug}`,
      type: "term",
      label: t.zh,
      href: `/dictionary/${t.slug}`,
    });
    for (const rt of t.relatedTerms) {
      const rslug = resolveTermSlug(rt);
      if (!rslug || rslug === t.slug) continue;
      edges.push({ from: `term:${t.slug}`, to: `term:${rslug}`, kind: "term_term" });
    }
    for (const pid of t.relatedProductIds) {
      if (productById.has(pid)) {
        edges.push({
          from: `term:${t.slug}`,
          to: `product:${pid}`,
          kind: "product_term",
        });
      }
    }
    for (const aslug of t.relatedArticleSlugs) {
      edges.push({ from: `term:${t.slug}`, to: `article:${aslug}`, kind: "term_article" });
    }
  }

  // 文章
  for (const a of articles) {
    nodes.push({
      id: `article:${a.slug}`,
      type: "article",
      label: a.title,
      href: `/learn/${a.slug}`,
    });
    for (const pid of a.relatedProductIds) {
      if (productById.has(pid)) {
        edges.push({ from: `article:${a.slug}`, to: `product:${pid}`, kind: "article_product" });
      }
    }
    for (const tkey of a.relatedTerms ?? []) {
      const tslug = resolveTermSlug(tkey);
      if (!tslug) continue;
      edges.push({ from: `article:${a.slug}`, to: `term:${tslug}`, kind: "article_term" });
    }
    for (const s of a.relatedSlugs) {
      if (!articleBySlug.has(s)) continue;
      edges.push({ from: `article:${a.slug}`, to: `article:${s}`, kind: "article_term" });
    }
  }

  // FAQ
  for (const f of faqs) {
    nodes.push({
      id: `faq:${f.id}`,
      type: "faq",
      label: f.question,
      href: `/ask?q=${encodeURIComponent(f.question)}`,
    });
    for (const pid of f.productIds ?? []) {
      if (productById.has(pid)) {
        edges.push({ from: `faq:${f.id}`, to: `product:${pid}`, kind: "product_faq" });
      }
    }
  }

  // 主題指南
  for (const h of hubs) {
    nodes.push({
      id: `hub:${h.slug}`,
      type: "hub",
      label: h.title,
      href: `/${h.slug}`,
    });
    for (const pid of h.productIds) {
      if (productById.has(pid)) {
        edges.push({ from: `hub:${h.slug}`, to: `product:${pid}`, kind: "hub_product" });
      }
    }
    for (const tkey of h.termSlugs) {
      const tslug = resolveTermSlug(tkey);
      if (!tslug) continue;
      edges.push({ from: `hub:${h.slug}`, to: `term:${tslug}`, kind: "hub_term" });
    }
    for (const aslug of h.articleSlugs) {
      if (!articleBySlug.has(aslug)) continue;
      edges.push({ from: `hub:${h.slug}`, to: `article:${aslug}`, kind: "hub_article" });
    }
    for (const fid of h.faqIds) {
      if (!faqById.has(fid)) continue;
      edges.push({ from: `hub:${h.slug}`, to: `faq:${fid}`, kind: "hub_faq" });
    }
  }

  // 比較頁（作為一種節點，代表「可比較的產品組合」）
  for (const p of products) {
    nodes.push({
      id: `comparison:${p.id}`,
      type: "comparison",
      label: `${p.name} 比較`,
      href: `/compare?add=${p.id}`,
    });
  }

  // 統計
  const counts: Record<GraphNodeType, number> = {
    insurer: 0,
    product: 0,
    coverage: 0,
    term: 0,
    source: 0,
    article: 0,
    faq: 0,
    hub: 0,
    comparison: 0,
  };
  for (const n of nodes) counts[n.type] += 1;

  const edgeCounts = {} as Record<RelationKind, number>;
  for (const e of edges) {
    edgeCounts[e.kind] = (edgeCounts[e.kind] ?? 0) + 1;
  }

  cachedSnapshot = {
    nodes,
    edges,
    counts,
    edgeCounts,
    totalNodes: nodes.length,
    totalEdges: edges.length,
  };
  return cachedSnapshot;
}

// ------------------------------------------------------------
// Related Content Engine
// ------------------------------------------------------------

export type ProductRelations = {
  terms: DictionaryTerm[];
  articles: Article[];
  products: InsuranceProduct[];
  faqs: FaqItem[];
  hubs: TopicHub[];
  sources: number;
};

export function relationsForProduct(product: InsuranceProduct): ProductRelations {
  const terms: DictionaryTerm[] = [];
  const seenTerm = new Set<string>();

  const pushTerm = (slug: string) => {
    if (seenTerm.has(slug)) return;
    const t = termBySlug.get(slug);
    if (!t) return;
    seenTerm.add(slug);
    terms.push(t);
  };

  // 1. 術語的 relatedProductIds 反向命中
  for (const slug of productTerms.get(product.id) ?? []) pushTerm(slug);

  // 2. 保障 / 不保項目名稱命中術語
  for (const name of productCoverageTerms.get(product.id) ?? []) {
    for (const slug of termsForCoverageName(name)) pushTerm(slug);
  }

  // 3. 條款重點文字命中術語
  for (const tp of product.termPoints) {
    for (const slug of termsForCoverageName(tp.title)) pushTerm(slug);
  }

  // 4. 產品名 / 描述命中術語（權重最低，但能補足冷門組合）
  for (const slug of termsForCoverageName(product.name)) pushTerm(slug);

  // 文章：relatedProductIds 指向本產品，或文章 relatedTerms 命中
  const relatedArticles = articles.filter(
    (a) =>
      a.relatedProductIds.includes(product.id) ||
      (a.relatedTerms ?? []).some((slug) => seenTerm.has(slug)),
  );

  // 同類別產品（排除自己）
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category,
  );

  // FAQ：productIds 命中，或問題文字命中術語
  const relatedFaqs = faqs.filter((f) => {
    if ((f.productIds ?? []).includes(product.id)) return true;
    return (f.keywords ?? []).some((k) =>
      terms.some((t) => t.zh.includes(k) || k.includes(t.zh)),
    );
  });

  // 主題指南：productIds 命中
  const relatedHubs = hubs.filter((h) => h.productIds.includes(product.id));

  return {
    terms,
    articles: relatedArticles,
    products: sameCategory,
    faqs: relatedFaqs,
    hubs: relatedHubs,
    sources: product.sourceDocuments.length,
  };
}

export type TermRelations = {
  products: InsuranceProduct[];
  articles: Article[];
  terms: DictionaryTerm[];
};

export function relationsForTerm(term: DictionaryTerm): TermRelations {
  const relatedProducts = products.filter((p) =>
    term.relatedProductIds.includes(p.id),
  );
  const relatedArticles = articles.filter(
    (a) =>
      term.relatedArticleSlugs.includes(a.slug) ||
      (a.relatedTerms ?? []).includes(term.slug) ||
      a.relatedProductIds.some((id) => term.relatedProductIds.includes(id)),
  );
  const relatedTerms = term.relatedTerms
    .map((key) => resolveTerm(key))
    .filter(Boolean) as DictionaryTerm[];
  return { products: relatedProducts, articles: relatedArticles, terms: relatedTerms };
}

export type ArticleRelations = {
  terms: DictionaryTerm[];
  products: InsuranceProduct[];
  articles: Article[];
  faqs: FaqItem[];
};

export function relationsForArticle(article: Article): ArticleRelations {
  const terms = (article.relatedTerms ?? [])
    .map((key) => resolveTerm(key))
    .filter(Boolean) as DictionaryTerm[];
  const prods = products.filter((p) => article.relatedProductIds.includes(p.id));
  const faqsForArticle = faqs.filter(
    (f) =>
      (f.productIds ?? []).some((id) => article.relatedProductIds.includes(id)) ||
      (f.keywords ?? []).some((k) =>
        (article.relatedTerms ?? []).some((key) => {
          const t = resolveTerm(key);
          return t ? t.zh.includes(k) || k.includes(t.zh) : false;
        }),
      ),
  );
  const relatedArticles = articles.filter(
    (a) =>
      a.slug !== article.slug &&
      (article.relatedSlugs.includes(a.slug) ||
        (a.relatedTerms ?? []).some((key) =>
          (article.relatedTerms ?? []).includes(key),
        )),
  );
  return { terms, products: prods, articles: relatedArticles, faqs: faqsForArticle };
}

/** 找出與某個術語最相關的產品（用於「術語 → 產品」路徑） */
export function productsForTermSlug(slug: string): InsuranceProduct[] {
  const t = termBySlug.get(slug);
  if (!t) return [];
  const explicit = t.relatedProductIds
    .map((id) => productById.get(id))
    .filter(Boolean) as InsuranceProduct[];
  if (explicit.length) return explicit;
  return products.filter((p) => (productTerms.get(p.id) ?? []).includes(slug));
}

/** 找出與某個術語最相關的文章 */
export function articlesForTermSlug(slug: string): Article[] {
  const t = termBySlug.get(slug);
  if (!t) return [];
  const explicit = t.relatedArticleSlugs
    .map((s) => articleBySlug.get(s))
    .filter(Boolean) as Article[];
  if (explicit.length) return explicit;
  return articles.filter((a) => (a.relatedTerms ?? []).includes(slug));
}

export const __internals = {
  productById,
  productBySlug,
  articleBySlug,
  termBySlug,
  hubBySlug,
  faqById,
  globalSources,
  insurerMapNote: insurers.length,
};
