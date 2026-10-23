import type { Metadata } from "next";
import { ProductExplorer } from "@/components/product-explorer";

export const metadata: Metadata = {
  title: "香港保險產品資料庫",
  description:
    "瀏覽不同保障類型（醫療、危疾、人壽、旅遊）的模擬保險產品，了解保障摘要、模擬保費、保障上限、自付額、等候期及續保條件。",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  return <ProductExplorer initialCategory={sp.category} />;
}
