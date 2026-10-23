import type { Metadata } from "next";
import Link from "next/link";
import { Target, Users, Scale, Layers, ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { products } from "@/data/products";
import { dictionary } from "@/data/dictionary";
import { articles } from "@/data/articles";
import { hubs } from "@/data/hubs";
import { insurers } from "@/data/insurers";
import { pageMetadata, breadcrumbJsonLd, jsonLdScript } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "關於我們",
  description:
    "保險指南（Insurance Compass HK）嘅平台定位、編輯原則同 V2 資料架構說明。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: "關於我們", href: "/about" },
            ]),
          ),
        }}
      />

      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">關於我們</span>
      </nav>

      <header className="mt-3 max-w-3xl">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">關於我們</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          {site.nameZh}（{site.nameEn}）係一個面向香港消費者嘅獨立保險資訊及比較平台原型。
          我哋嘅定位唔係保險公司網站，亦唔係保險經紀銷售頁面，而係一個資訊入口：
          令用戶在考慮任何保險之前，先真正了解保障內容、條款限制同價格差異。
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: Target,
            title: "平台使命",
            desc: "將複雜嘅保單條款轉化成可以比較、可以理解嘅資訊，令用戶嘅選擇更有依據。",
          },
          {
            icon: Scale,
            title: "中立立場",
            desc: "比較結果只描述數據差異，唔會使用「最適合你」、「一定最好」或「保證最划算」等結論。",
          },
          {
            icon: Users,
            title: "讀者優先",
            desc: "內容以一般保險知識為主，唔會要求讀者提交姓名、身份證、健康史或財務資料。",
          },
          {
            icon: Layers,
            title: "統一結構",
            desc: "每一份產品資料都用同一套欄位整理，令橫向比較唔會因為格式唔同而失去意義。",
          },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="rounded-xl border border-ink-line bg-white p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <Icon size={19} />
              </span>
              <h2 className="mt-3.5 text-[16px] font-semibold text-ink">{c.title}</h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{c.desc}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-[20px] font-semibold tracking-tight text-ink">我哋點樣理解「資訊平台」</h2>
        <div className="prose-ic mt-2">
          <p>
            資訊平台嘅核心唔係「有幾多個產品」，而係「用戶可唔可以喺同一個畫面上比較到真正重要嘅分別」。
            所以我哋將重點放喺四件事：
          </p>
          <ul>
            <li>
              <strong>條款結構化</strong>：保障範圍、除外責任、等候期、自付額、續保條件用同一組欄位呈現，
              每個項目附來源編號。
            </li>
            <li>
              <strong>差異可見</strong>：比較引擎分四層——快速差異、完整比較表、差異解釋、應問的問題，
              解釋差異由邊個條款機制造成。
            </li>
            <li>
              <strong>資料唔填補</strong>：冇資料嘅地方直接寫「資料未提供」，唔會用推測值填滿表格。
            </li>
            <li>
              <strong>核實狀態透明</strong>：每個產品標示已核實／部分核實／尚未核實／原型模擬資料四級狀態，
              讀者可以逐項查。
            </li>
            <li>
              <strong>限制清楚</strong>：平台唔會假裝能夠代替持牌專業人士嘅意見，亦唔會收集敏感個人資料。
            </li>
          </ul>
          <p>
            現時資料庫包含 {products.length} 款產品資料、{insurers.length} 間保險公司、{dictionary.length} 個
            保險術語、{articles.length} 篇知識文章同 {hubs.length} 個主題指南頁。呢個結構係刻意設計成可以
            擴展到數千個產品同數萬條問題，而唔需要重寫任何頁面。
          </p>
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "產品資料", value: `${products.length} 款` },
          { label: "保險公司", value: `${insurers.length} 間` },
          { label: "保險術語", value: `${dictionary.length} 個` },
          { label: "主題指南", value: `${hubs.length} 個` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-ink-line bg-white p-5">
            <p className="text-[12px] text-ink-mute">{s.label}</p>
            <p className="mt-0.5 text-[20px] font-semibold text-ink">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-brand-200 bg-brand-50/60 p-7">
        <h2 className="text-[19px] font-semibold text-ink">下一步</h2>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-ink-soft">
          你可以直接體驗平台嘅主要功能：瀏覽產品資料庫、並排比較兩個或三個產品，或者用需求分析工具
          了解自己應該先睇邊部分內容。
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-brand-800 px-4 text-[13.5px] font-semibold text-white hover:bg-brand-900"
          >
            瀏覽產品資料庫
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/dictionary"
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-brand-300 bg-white px-4 text-[13.5px] font-semibold text-brand-800 hover:bg-brand-100"
          >
            查保險術語字典
          </Link>
          <Link
            href="/trust"
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-brand-300 bg-white px-4 text-[13.5px] font-semibold text-brand-800 hover:bg-brand-100"
          >
            睇平台信任中心
          </Link>
        </div>
      </section>
    </div>
  );
}
