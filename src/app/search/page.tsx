import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResultsView } from "@/components/search-results-view";

export const metadata: Metadata = {
  title: "搜尋結果",
  description: "搜尋保險產品、知識文章及常見保險問題。",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-ink-mute">載入中…</div>}>
      <SearchResultsView />
    </Suspense>
  );
}
