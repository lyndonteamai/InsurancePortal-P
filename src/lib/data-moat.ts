import { products } from "@/data/products";
import { insurers } from "@/data/insurers";
import { dictionary } from "@/data/dictionary";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { hubs } from "@/data/hubs";
import { globalSources } from "@/data/sources";
import { getAllProductEvidence } from "@/data/evidence";
import { knowledgeGraph } from "@/lib/relationships";
import type { VerificationStatus } from "@/data/types";

// ============================================================
// Insurance Data Moat — 資料護城河指標
// ============================================================
// 這個平台的真正資產不是頁面數量，而是「結構化、可追溯、可核實的
// 保險資料」。這個檔案把這項資產量化，讓內部團隊（與未來的
// 投資者 / 合作方）看到護城河在哪裡、還有多厚、哪裡還薄。
//
// 頁面數是輸出，資料是輸入。輸出可以靠模板複製，輸入不行。
// ============================================================

export type MoatMetric = {
  key: string;
  label: string;
  value: number;
  /** 這一項相對「目標規模」的完成度 */
  target: number;
  unit: string;
  note: string;
};

export type DataMoatReport = {
  metrics: MoatMetric[];
  /** 已核實 / 未核實的事實數 */
  facts: {
    total: number;
    byStatus: Record<VerificationStatus, number>;
    verifiedRatio: number;
  };
  /** 資料分佈 */
  inventory: {
    products: number;
    insurers: number;
    sources: number;
    documents: number;
    coverageItems: number;
    terms: number;
    articles: number;
    questions: number;
    hubs: number;
    relationships: number;
  };
  /** 來源取得方式的成熟度 */
  acquisition: { label: string; count: number }[];
  /** 抽取狀態成熟度 */
  extraction: { label: string; count: number }[];
  /** 關係圖的節點/邊統計 */
  graph: {
    nodes: number;
    edges: number;
    counts: Record<string, number>;
    edgeCounts: Record<string, number>;
  };
  /** 目前的資料缺口（誠實列出，不粉飾） */
  gaps: string[];
};

/**
 * 第一階段目標規模：10,000 個「有實質價值的可索引頁面」。
 * 這不是承諾，是用來衡量資料基礎是否足以支撐這個規模的參考軸。
 */
const TARGET_SCALE = {
  products: 600,
  insurers: 40,
  sources: 2000,
  documents: 4000,
  coverageItems: 6000,
  terms: 600,
  articles: 900,
  questions: 1500,
  hubs: 60,
  relationships: 40000,
};

export function dataMoatReport(): DataMoatReport {
  const graph = knowledgeGraph();

  // 事實（Evidence）統計
  const allEvidence = products.flatMap((p) => getAllProductEvidence(p));
  const byStatus: Record<VerificationStatus, number> = {
    verified: 0,
    partially_verified: 0,
    unverified: 0,
    demo: 0,
  };
  for (const e of allEvidence) byStatus[e.verificationStatus] += 1;
  const verifiedRatio = allEvidence.length
    ? Math.round(
        ((byStatus.verified + byStatus.partially_verified) / allEvidence.length) *
          100,
      )
    : 0;

  // 文件總數（產品層 + 全域來源層）
  const productDocs = products.reduce((s, p) => s + p.sourceDocuments.length, 0);
  const documents = productDocs + globalSources.length;

  // 覆蓋項目
  const coverageItems = products.reduce((s, p) => s + p.coverage.length, 0);

  const inventory = {
    products: products.length,
    insurers: insurers.length,
    sources: new Set(
      [
        ...products.flatMap((p) => p.sourceDocuments.map((s) => s.id)),
        ...globalSources.map((s) => s.id),
      ],
    ).size,
    documents,
    coverageItems,
    terms: dictionary.length,
    articles: articles.length,
    questions: faqs.length,
    hubs: hubs.length,
    relationships: graph.totalEdges,
  };

  const metrics: MoatMetric[] = [
    {
      key: "products",
      label: "結構化產品",
      value: inventory.products,
      target: TARGET_SCALE.products,
      unit: "款",
      note: "每一款都含保障、不保、條款欄位與來源綁定。",
    },
    {
      key: "insurers",
      label: "保險公司實體",
      value: inventory.insurers,
      target: TARGET_SCALE.insurers,
      unit: "間",
      note: "保險公司是產品、條款與公司資料頁的共同上層節點。",
    },
    {
      key: "sources",
      label: "來源文件（去重）",
      value: inventory.sources,
      target: TARGET_SCALE.sources,
      unit: "份",
      note: "每個產品事實都必須能指回一份具名文件。",
    },
    {
      key: "documents",
      label: "文件實例（含重複引用）",
      value: inventory.documents,
      target: TARGET_SCALE.documents,
      unit: "份",
      note: "同一份條款會被多個產品引用，因此實例數高於去重數。",
    },
    {
      key: "coverageItems",
      label: "保障項目",
      value: inventory.coverageItems,
      target: TARGET_SCALE.coverageItems,
      unit: "項",
      note: "保障項目是與術語、FAQ、比較欄位對接的基本單位。",
    },
    {
      key: "terms",
      label: "保險術語",
      value: inventory.terms,
      target: TARGET_SCALE.terms,
      unit: "條",
      note: "術語是知識圖譜的樞紐節點，連接產品與文章。",
    },
    {
      key: "articles",
      label: "知識文章",
      value: inventory.articles,
      target: TARGET_SCALE.articles,
      unit: "篇",
      note: "文章承接搜尋流量，回答產品頁之外的問題。",
    },
    {
      key: "questions",
      label: "常見問題",
      value: inventory.questions,
      target: TARGET_SCALE.questions,
      unit: "條",
      note: "FAQ 同時服務搜尋結果、AI 回答與產品頁相關問題。",
    },
    {
      key: "hubs",
      label: "主題指南",
      value: inventory.hubs,
      target: TARGET_SCALE.hubs,
      unit: "個",
      note: "主題指南把同一類別的產品、術語與文章聚成一個權威入口。",
    },
    {
      key: "relationships",
      label: "實體關係",
      value: inventory.relationships,
      target: TARGET_SCALE.relationships,
      unit: "條",
      note: "關係數決定「一萬個頁面」是資產還是垃圾。",
    },
  ];

  // 來源取得方式分佈
  const acqMap = new Map<string, number>();
  const extMap = new Map<string, number>();
  for (const s of [
    ...globalSources,
    ...products.flatMap((p) => p.sourceDocuments),
  ]) {
    if (s.acquisitionMethod) {
      acqMap.set(s.acquisitionMethod, (acqMap.get(s.acquisitionMethod) ?? 0) + 1);
    }
    if (s.extractionState) {
      extMap.set(s.extractionState, (extMap.get(s.extractionState) ?? 0) + 1);
    }
  }

  // 資料缺口（誠實列出）
  const gaps: string[] = [];
  const unverifiedProducts = products.filter(
    (p) => p.verification.status !== "verified",
  );
  if (unverifiedProducts.length) {
    gaps.push(
      `${unverifiedProducts.length} / ${products.length} 款產品尚未達到「已核實」狀態。`,
    );
  }
  const demoFacts = byStatus.demo;
  if (demoFacts) {
    gaps.push(`${demoFacts} 項事實仍為原型模擬資料，尚未連接真實官方來源。`);
  }
  gaps.push(
    "目前只接入 4 間保險公司的示範產品；真實覆蓋需要按保單持有人名單逐一接入。",
  );
  gaps.push(
    "來源文件的取得方式全部為人工上傳示範，尚未建立自動版本監測。",
  );
  gaps.push(
    "關係圖中的「保障項目 → 術語」目前以名稱比對推導，接入真實資料後需改為結構化綁定。",
  );

  return {
    metrics,
    facts: {
      total: allEvidence.length,
      byStatus,
      verifiedRatio,
    },
    inventory,
    acquisition: [...acqMap.entries()].map(([label, count]) => ({ label, count })),
    extraction: [...extMap.entries()].map(([label, count]) => ({ label, count })),
    graph: {
      nodes: graph.totalNodes,
      edges: graph.totalEdges,
      counts: graph.counts as unknown as Record<string, number>,
      edgeCounts: graph.edgeCounts as unknown as Record<string, number>,
    },
    gaps,
  };
}

/** 產品層的核實狀態分佈（沿用 evidence 層的統一口徑） */
export function productVerificationBreakdown() {
  return products.map((p) => ({
    product: p,
    evidence: getAllProductEvidence(p),
  }));
}
