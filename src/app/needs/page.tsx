import type { Metadata } from "next";
import { NeedsWizard } from "@/components/needs-wizard";

export const metadata: Metadata = {
  title: "保險需求分析",
  description:
    "四步互動工具：了解你想了解嘅保障類型、最重視嘅部分同希望了解嘅方向，再提供相關條款、知識文章同產品比較入口。",
  alternates: { canonical: "/needs" },
};

export default function NeedsPage() {
  return <NeedsWizard />;
}
