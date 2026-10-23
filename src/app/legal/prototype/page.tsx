import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, Check, X } from "lucide-react";
import { pageMetadata, breadcrumbJsonLd, jsonLdScript } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "原型開發說明",
  description:
    "保險指南 V2 Prototype 嘅資料架構、已完成的升級項目同仍未完成的部分。",
  path: "/legal/prototype",
});

const DONE = [
  "首頁：Hero 搜尋、四個核心入口、主題指南、最近更新產品、常見術語與文章。",
  "產品列表：按種類、保險公司、核實狀態、特色、保費區間篩選，可排序，可清除篩選。",
  "產品詳情：快速判斷摘要、保障一覽表（逐項附來源）、不保事項、條款細項、保費示例、資料來源、轉介層、相關內容。",
  "保險公司：獨立一級實體，列表頁 + 4 間公司詳情頁（成立年份、專注範圍、產品線）。",
  "保險術語字典：39 個術語，A–Z 索引 + 術語頁（一句話答案、常見誤解、比較重點）。",
  "比較引擎 V2：四層結構——快速差異、完整比較表、差異解釋、應問的問題（含複製清單）。",
  "主題權威頁：4 個 Hub，內含比較重點、常見誤解、提問清單，同時掛接產品、術語、文章、FAQ。",
  "問保險問題：/ask 檢索式問答引擎，回答只引用資料庫條目並附來源連結。",
  "信任中心：/trust 九個章節，說明平台是甚麼、不是甚麼，以及不做排名的原因。",
  "資料營運預覽：/admin-preview 提供完整度分級、核實狀態分佈、資料品質表與分析事件記錄。",
  "回報資料問題：所有資料頁面都有回報入口，並明確說明原型階段不會實際送出。",
  "SEO／GEO：JSON-LD（Organization、WebSite、Article、FAQPage、DefinedTerm、InsuranceProduct、BreadcrumbList）、canonical、sitemap、robots。",
];

const NOT_DONE = [
  "真實保險公司／產品資料接入（需要與持牌機構簽訂資料授權協議）。",
  "即時報價或保費計算引擎（需要保險公司 API 或 actuarial 資料）。",
  "持牌保險專業人士名單及查詢功能（需要監管名單資料來源）。",
  "用戶帳戶、收藏清單跨裝置同步（比較清單目前只存在瀏覽器 localStorage）。",
  "後端資料庫與內容編輯流程（目前資料以本地 TypeScript 檔案管理，/admin-preview 唯讀）。",
  "真實 AI 問答（/ask 目前用本地資料庫做檢索式匹配，架構已預留向量檢索接口）。",
  "多語言（目前只提供繁體中文）。",
  "真實搜尋引擎排名累積（V2 已開放索引，但站點仍缺乏外部連結與真實內容規模）。",
];

export default function PrototypePage() {
  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: "原型開發說明", href: "/legal/prototype" },
            ]),
          ),
        }}
      />

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
