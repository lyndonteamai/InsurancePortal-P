import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/structured-data";
import { AskEngine } from "@/components/ask-engine";

export const metadata: Metadata = pageMetadata({
  title: "問保險 AI｜用一句話查香港保險概念與條款",
  description:
    "用自然語言查詢香港保險概念。回答分成簡單答案、相關產品、相關條款、官方來源與進一步比較五段，全部數字來自平台資料庫並標明根據，不生成資料庫以外的內容。",
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
