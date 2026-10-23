import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/structured-data";
import { AskEngine } from "@/components/ask-engine";

export const metadata: Metadata = pageMetadata({
  title: "問保險問題｜用一句話查香港保險概念與條款",
  description:
    "用自然語言查詢香港保險概念。引擎從平台資料庫的常見問題、術語、知識文章與產品資料中找出最相關的條目，附上來源連結，不生成資料庫以外的內容。",
  path: "/ask",
});

export default function AskPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-16 text-center text-ink-mute">載入中…</div>
      }
    >
      <AskEngine />
    </Suspense>
  );
}
