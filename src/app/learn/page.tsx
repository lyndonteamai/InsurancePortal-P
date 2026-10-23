import type { Metadata } from "next";
import { LearnView } from "@/components/learn-view";

export const metadata: Metadata = {
  title: "保險知識中心",
  description:
    "保險入門、醫療保險、危疾保險、人壽保險、保險條款及保險理賠文章，附常見保險問題搜尋。",
  alternates: { canonical: "/learn" },
};

export default function LearnPage() {
  return <LearnView />;
}
