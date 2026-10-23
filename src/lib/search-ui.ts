import { Package, BookOpen, CircleHelp, BookMarked, type LucideIcon } from "lucide-react";
import type { SearchResultKind } from "@/lib/search";

/** 搜尋結果分類的顯示樣式（V2：產品 / 術語 / 文章 / FAQ） */
export const SEARCH_KIND_META: Record<
  SearchResultKind,
  { label: string; icon: LucideIcon }
> = {
  product: { label: "保險產品", icon: Package },
  term: { label: "保險術語", icon: BookMarked },
  article: { label: "知識文章", icon: BookOpen },
  faq: { label: "常見問題", icon: CircleHelp },
};

/** 搜尋結果顯示順序 */
export const SEARCH_KIND_ORDER: SearchResultKind[] = [
  "product",
  "term",
  "article",
  "faq",
];
