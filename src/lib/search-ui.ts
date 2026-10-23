import {
  Package,
  BookOpen,
  CircleHelp,
  BookMarked,
  Building2,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import type { SearchResultKind } from "@/lib/search";

/**
 * 搜尋結果分類的顯示樣式。
 *
 * V3 擴充為六類，覆蓋超級搜索要能找到的所有東西：
 * 產品 / 保險公司 / 主題指南 / 術語 / 知識 / 常見問題。
 */
export const SEARCH_KIND_META: Record<
  SearchResultKind,
  { label: string; icon: LucideIcon }
> = {
  product: { label: "保險產品", icon: Package },
  insurer: { label: "保險公司", icon: Building2 },
  hub: { label: "主題指南", icon: LayoutGrid },
  term: { label: "保險術語", icon: BookMarked },
  article: { label: "保險知識", icon: BookOpen },
  faq: { label: "常見問題", icon: CircleHelp },
};

/** 搜尋結果顯示順序 */
export const SEARCH_KIND_ORDER: SearchResultKind[] = [
  "product",
  "insurer",
  "hub",
  "term",
  "article",
  "faq",
];
