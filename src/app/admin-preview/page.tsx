import type { Metadata } from "next";
import { AdminPreview } from "@/components/admin-preview";

export const metadata: Metadata = {
  title: "資料營運預覽｜保險指南內部工具",
  description: "保險指南平台的內部資料營運工具：資料量統計、核實狀態分布、完整度評分與分析事件記錄。",
  robots: { index: false, follow: false },
};

export default function AdminPreviewPage() {
  return <AdminPreview />;
}
