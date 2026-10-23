import type { Metadata } from "next";
import { CompareView } from "@/components/compare-view";

export const metadata: Metadata = {
  title: "產品比較",
  description:
    "將最多三個香港保險模擬產品並排比較：保障上限、自付額、等候期、續保條件及主要限制，一眼睇到數據差異。",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return <CompareView />;
}
