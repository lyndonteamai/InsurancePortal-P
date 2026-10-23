import type { Metadata } from "next";
import { SeoPageFactory } from "@/components/seo-page-factory";

export const metadata: Metadata = {
  title: "SEO 頁面工廠預覽｜保險指南內部工具",
  description:
    "保險指南平台的內部 SEO/GEO 規模預覽：按頁面類型估算可索引頁面數量，全部標示為 DEMO ESTIMATE。",
  robots: { index: false, follow: false },
};

export default function SeoPreviewPage() {
  return <SeoPageFactory />;
}
