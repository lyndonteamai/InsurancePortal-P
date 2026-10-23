import type { Metadata } from "next";
import { ProductExplorer } from "@/components/product-explorer";
import { CATEGORY_LABELS, type ProductCategory } from "@/data/types";
import { pageMetadata } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "香港保險產品資料庫",
  description:
    "按保障類型瀏覽保險產品資料：保障內容、保障上限、自付額、等候期、續保條件、示例保費同資料來源，每項都標明核實狀態。",
  path: "/products",
});

/** 同時接受英文 enum 與中文分類名，方便分享連結 */
function resolveCategory(raw?: string): ProductCategory | undefined {
  if (!raw) return undefined;
  if (raw in CATEGORY_LABELS) return raw as ProductCategory;
  const hit = (Object.keys(CATEGORY_LABELS) as ProductCategory[]).find(
    (c) => CATEGORY_LABELS[c] === raw,
  );
  return hit;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  return <ProductExplorer initialCategory={resolveCategory(sp.category)} />;
}
