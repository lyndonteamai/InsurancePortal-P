import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", "/products", "/compare", "/learn", "/needs", "/about", "/contact", "/transparency", "/legal/disclaimer", "/legal/privacy", "/legal/prototype"];
  return [
    ...staticPaths.map((p) => ({ url: `${site.url}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${site.url}/products/${p.id}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${site.url}/learn/${a.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
