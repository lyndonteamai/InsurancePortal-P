import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// ============================================================
// Robots (STEP 10)
// 平台是資料層，內容頁需要被索引；
// 只擋住工具頁與內部營運頁。
// ============================================================

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search", "/admin-preview", "/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
