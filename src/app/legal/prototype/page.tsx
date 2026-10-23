import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "原型開發說明",
  description: "保險指南 Prototype 嘅技術架構、模擬資料設計同未完成項目清單。",
  alternates: { canonical: "/legal/prototype" },
};

const DONE = [
  "首頁：Hero 搜尋、四個保障類型入口、熱門產品比較、知識文章列表、透明度區域。",
  "產品列表：按種類、公司、特色、模擬保費區間篩選，可排序，可清除篩選。",
  "產品詳情：保障內容表格、條款重點六個面向、模擬保費說明、相關產品同文章。",
  "產品比較：最多三個產品並排比較，每欄有「了解這項條款」說明，下方有客觀差異摘要。",
  "保險知識中心：分類篩選、文章搜尋、常見問題（20 條）搜尋模組。",
  "文章詳情：正文、重要資訊摘要、相關文章、相關產品比較、免責說明。",
  "需求分析：四步問卷，結果包含保障項目、條款清單、文章同產品比較入口。",
  "全站搜尋：可搜尋產品、示例公司、類別、文章標題同內容、常見問題。",
];

const NOT_DONE = [
  "真實保險公司／產品資料接入（需要與持牌機構簽訂資料授權協議）。",
  "即時報價或保費計算引擎（需要保險公司 API 或 actuarial 資料）。",
  "持牌保險專業人士名單及查詢功能（需要監管名單資料來源）。",
  "用戶帳戶、收藏清單跨裝置同步（需要後端與資料庫）。",
  "真實 AI 問答（目前用本地 FAQ 資料庫做關鍵字搜尋）。",
  "多語言（目前只提供繁體中文）。",
  "真實 SEO 排名（robots 已設為 noindex，正式上線前需調整）。",
];

export default function PrototypePage() {
  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">原型開發說明</span>
      </nav>

      <header className="mt-3 max-w-3xl">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">原型開發說明</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          本頁說明呢個 Prototype 嘅技術架構、資料設計同埋仲未做嘅部分，方便評審同交接。
        </p>
      </header>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-[18px] font-semibold text-ink">
          <Boxes size={18} className="text-brand-600" /> 技術架構
        </h2>
        <div className="prose-ic mt-2 max-w-3xl">
          <ul>
            <li>Next.js 15（App Router）+ React 19 + TypeScript。</li>
            <li>Tailwind CSS 3 做樣式系統，深藍色為主品牌色、青綠色為輔助色。</li>
            <li>lucide-react 做圖示。</li>
            <li>所有模擬資料放喺本地 TypeScript 資料檔案（<code>src/data/</code>），無資料庫、無外部 API。</li>
            <li>比較清單用 React Context + localStorage 實作，跨頁面保持狀態。</li>
            <li>每個主要頁面都有獨立 metadata，附 sitemap.xml 同 robots.txt。</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[18px] font-semibold text-ink">已完成功能</h2>
        <ul className="mt-3 space-y-2">
          {DONE.map((d) => (
            <li key={d} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-soft">
              <Check size={15} className="mt-0.5 shrink-0 text-accent-600" />
              {d}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-[18px] font-semibold text-ink">尚未完成／需要外部資源</h2>
        <ul className="mt-3 space-y-2">
          {NOT_DONE.map((d) => (
            <li key={d} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-soft">
              <X size={15} className="mt-0.5 shrink-0 text-amber-600" />
              {d}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-[13.5px] leading-relaxed text-amber-900/90">
          此頁內容為原型示例，正式上線前需要法律及監管審核。特別係「資料整理方式」同「持牌專業人士」相關嘅描述，
          必須由具資格人士審閱。
        </p>
      </section>

      <p className="mt-8 text-[13px] text-ink-mute">
        相關頁面：
        <Link href="/legal/disclaimer" className="ml-1 text-brand-700 hover:underline">
          免責聲明
        </Link>
        ·
        <Link href="/legal/privacy" className="ml-1 text-brand-700 hover:underline">
          私隱政策
        </Link>
        ·
        <Link href="/transparency" className="ml-1 text-brand-700 hover:underline">
          資料來源及更新方式
        </Link>
      </p>
    </div>
  );
}
