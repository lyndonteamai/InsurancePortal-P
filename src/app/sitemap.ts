import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { dictionary } from "@/data/dictionary";
import { hubs } from "@/data/hubs";
import { insurers } from "@/data/insurers";
import { site } from "@/lib/site";

// ============================================================
// Sitemap (STEP 10 — SEO 架構)
// 站的資料層分四類，各自有獨立的收錄策略：
//   1. 核心功能頁    — 產品庫、比較、術語、問答、信任中心
//   2. 主題權威頁    — 4 個 Topic Hub（最長尾的搜尋入口）
//   3. 資料實體頁    — 產品 / 術語 / 文章 / 保險公司
//   4. 法規頁        — 免責、私隱、透明度
// /search 與 /admin-preview 屬工具頁，不進入 sitemap。
// ============================================================

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: {
    path: string;
    priority: number;
    freq: "daily" | "weekly" | "monthly" | "yearly";
  }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/products", priority: 0.9, freq: "weekly" },
    { path: "/compare", priority: 0.9, freq: "weekly" },
    { path: "/dictionary", priority: 0.9, freq: "weekly" },
    { path: "/ask", priority: 0.8, freq: "weekly" },
    { path: "/learn", priority: 0.8, freq: "weekly" },
    { path: "/insurers", priority: 0.7, freq: "monthly" },
    { path: "/trust", priority: 0.6, freq: "monthly" },
    { path: "/needs", priority: 0.6, freq: "monthly" },
  ];

  const legal: string[] = [
    "/transparency",
    "/about",
    "/contact",
    "/legal/disclaimer",
    "/legal/privacy",
    "/legal/prototype",
  ];

  // 商業與排序透明度：屬於信任中心的一部分，同樣需要被索引
  const transparency: string[] = [
    "/ranking-methodology",
    "/commercial-transparency",
  ];

  return [
    ...core.map((c) => ({
      url: `${site.url}${c.path}`,
      lastModified: now,
      changeFrequency: c.freq,
      priority: c.priority,
    })),
    ...legal.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...transparency.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    // 主題權威頁
    ...hubs.map((h) => ({
      url: `${site.url}/${h.slug}`,
      lastModified: new Date(h.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // 產品頁
    ...products.map((p) => ({
      url: `${site.url}/products/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // 術語頁
    ...dictionary.map((t) => ({
      url: `${site.url}/dictionary/${t.slug}`,
      lastModified: new Date(t.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // 文章頁
    ...articles.map((a) => ({
      url: `${site.url}/learn/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // 保險公司頁
    ...insurers.map((i) => ({
      url: `${site.url}/insurers/${i.slug}`,
      lastModified: new Date(i.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
