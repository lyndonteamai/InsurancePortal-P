"use client";

import Link from "next/link";
import {
  Factory,
  Eye,
  TrendingUp,
  Layers,
  FileText,
  BookOpen,
  HelpCircle,
  Building2,
  Package,
  Scale,
  LayoutGrid,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { products } from "@/data/products";
import { insurers } from "@/data/insurers";
import { dictionary } from "@/data/dictionary";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { hubs } from "@/data/hubs";
import { knowledgeGraph } from "@/lib/relationships";

// ============================================================
// SEO Page Factory 預覽（/admin-preview/seo）
// ============================================================
// ⚠️ 這個頁面不解釋「我們要生���一萬個頁面」，而是解釋：
//    「同一套結構化資料，可以支撐哪些種類的頁面，以及各有多少。」
//
// 紅線：
//   1. 所有數字都標示 DEMO ESTIMATE，不是承諾。
//   2. 這一輪不真的生成任何大量薄頁面。
//   3. 每種類型都必須先有「可核實的資料來源」，才允許擴張。
// ============================================================

type PageType = {
  key: string;
  label: string;
  icon: typeof FileText;
  /** 目前已存在的實體數 */
  current: number;
  /** 估算上限（以資料庫規模推算） */
  estimate: number;
  urlPattern: string;
  /** 每個頁面需要的資料條件 */
  dataRequirement: string;
  /** 為甚麼這種頁面有價值 */
  value: string;
  /** 防止變成薄頁的閘門 */
  qualityGate: string;
};

export function SeoPageFactory() {
  const graph = knowledgeGraph();

  const types: PageType[] = [
    {
      key: "products",
      label: "產品頁",
      icon: Package,
      current: products.length,
      estimate: 600,
      urlPattern: "/products/[slug]",
      dataRequirement: "至少 1 份條款來源 + 保障 / 不保 / 條款欄位",
      value: "承接「某間公司某款產品」的具體查詢",
      qualityGate: "沒有條款來源的產品不生成頁面，只進資料待辦清單",
    },
    {
      key: "insurers",
      label: "保險公司頁",
      icon: Building2,
      current: insurers.length,
      estimate: 40,
      urlPattern: "/insurers/[slug]",
      dataRequirement: "公司資料 + 該公司至少 5 款已核實產品",
      value: "承接「A 公司的醫療保險怎麼樣」這類品牌查詢",
      qualityGate: "產品少於 5 款的公司不單獨建頁，改用類別頁承接",
    },
    {
      key: "categories",
      label: "保險類別頁",
      icon: LayoutGrid,
      current: 8,
      estimate: 12,
      urlPattern: "/[category]",
      dataRequirement: "該類別至少 8 款產品 + 1 篇知識文章",
      value: "承接「醫療保險」這類大類查詢",
      qualityGate: "每個類別頁必須有原創的類別導覽內容，不是產品列表的重複",
    },
    {
      key: "hubs",
      label: "主題指南頁",
      icon: Layers,
      current: hubs.length,
      estimate: 60,
      urlPattern: "/[topic-hub]",
      dataRequirement: "一個明確的主題 + 產品 / 術語 / 文章 / FAQ 四類內容",
      value: "承接「自付額點計」這種需要完整講解的主題",
      qualityGate: "主題必須有實質教學內容，否則不開主題",
    },
    {
      key: "terms",
      label: "保險術語頁",
      icon: BookOpen,
      current: dictionary.length,
      estimate: 600,
      urlPattern: "/dictionary/[slug]",
      dataRequirement: "一句話答案 + 詳細解釋 + 舉例 + 比較重點 + 常見誤解",
      value: "承接「自付額是甚麼」這類概念查詢，長尾流量入口",
      qualityGate: "沒有舉例與比較的術語不建頁，否則只是詞典",
    },
    {
      key: "articles",
      label: "知識文章頁",
      icon: FileText,
      current: articles.length,
      estimate: 900,
      urlPattern: "/learn/[slug]",
      dataRequirement: "原創教學內容 + 條款來源 + 相關產品連結",
      value: "承接「點樣睇醫療保險條款」這類深度查詢",
      qualityGate: "不得為湊數複製產品說明；每篇要有獨立觀點",
    },
    {
      key: "faqs",
      label: "常見問題頁",
      icon: HelpCircle,
      current: faqs.length,
      estimate: 1500,
      urlPattern: "/ask?q=[question]",
      dataRequirement: "問題 + 結構化答案 + 綁定產品與術語",
      value: "承接問句型搜尋，直接在 SERP 回答",
      qualityGate: "答案必須由平台資料生成，不接受 AI 憑記憶作答",
    },
    {
      key: "coverage",
      label: "保障主題頁",
      icon: Layers,
      current: graph.counts.coverage,
      estimate: 3000,
      urlPattern: "/coverage/[topic]",
      dataRequirement: "同一個保障概念跨 ≥ 5 款產品出現 + 有條款依據",
      value: "承接「住院保障包括甚麼」這類保障層級查詢",
      qualityGate: "只保留跨產品出現的保障概念，避免同義重複頁",
    },
    {
      key: "comparisons",
      label: "比較落地頁",
      icon: Scale,
      current: 0,
      estimate: 1200,
      urlPattern: "/compare?ids=[a]-[b]",
      dataRequirement: "兩款以上產品都有完整比較欄位與證據",
      value: "承接「A 對 B」這類明確對比查詢",
      qualityGate: "比較頁不做排序、不給結論，只解釋差異來源",
    },
  ];

  const totalCurrent = types.reduce((s, t) => s + t.current, 0);
  const totalEstimate = types.reduce((s, t) => s + t.estimate, 0);

  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/admin-preview" className="hover:text-brand-700">
          保險資料護城河
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">SEO 頁面工廠</span>
      </nav>

      <header className="mt-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 text-[11.5px] font-semibold text-amber-800">
          <Eye size={12} aria-hidden />
          內部營運頁面
        </span>
        <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">
          SEO 頁面工廠
        </h1>
        <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-ink-soft">
          這個頁面展示「同一套結構化資料可以支撐哪些種類的可索引頁面，
          以及各有多少」。它不生成任何頁面，也不代表已經有這些頁面存在。
        </p>
      </header>

      {/* DEMO ESTIMATE 警示 */}
      <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-900">
          <AlertTriangle size={14} aria-hidden />
          以下全部數字為 DEMO ESTIMATE
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-amber-900/85">
          估算上限是按「資料庫規模 × 每頁需要的資料條件」推算的參考值，
          不是承諾、不是已完成的頁面數、也不是流量預測。實際可生成的頁面數
          取決於真實接入的保險公司數、產品數與條款覆蓋率。
        </p>
      </div>

      {/* Totals */}
      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric
          icon={<Factory size={14} aria-hidden />}
          label="頁面類型"
          value={String(types.length)}
        />
        <Metric
          icon={<Package size={14} aria-hidden />}
          label="現有實體"
          value={totalCurrent.toLocaleString("en-US")}
        />
        <Metric
          icon={<TrendingUp size={14} aria-hidden />}
          label="估算可索引頁面"
          value={totalEstimate.toLocaleString("en-US")}
          small
        />
        <Metric
          icon={<Layers size={14} aria-hidden />}
          label="支撐關係數"
          value={graph.totalEdges.toLocaleString("en-US")}
        />
      </section>

      {/* Types */}
      <section className="mt-9">
        <h2 className="text-[18px] font-semibold tracking-tight text-ink">
          頁面類型與資料條件
        </h2>
        <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-mute">
          每一列都標明「需要甚麼資料才允許生成這種頁面」與「甚麼情況下不生成」。
          沒有資料條件的頁面類型，不會出現在這個清單裡。
        </p>

        <div className="mt-4 space-y-3">
          {types.map((t) => {
            const Icon = t.icon;
            const pct = Math.min(100, Math.round((t.current / t.estimate) * 100));
            return (
              <div
                key={t.key}
                className="rounded-xl border border-ink-line bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon size={16} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold text-ink">
                        {t.label}
                      </h3>
                      <p className="mt-0.5 font-mono text-[11.5px] text-ink-mute">
                        {t.urlPattern}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[20px] font-bold tabular-nums text-ink">
                      {t.estimate.toLocaleString("en-US")}
                    </p>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-amber-700">
                      DEMO ESTIMATE
                    </p>
                  </div>
                </div>

                <div className="mt-3.5">
                  <div className="flex items-center justify-between gap-2 text-[11.5px] text-ink-mute">
                    <span>
                      現有 {t.current.toLocaleString("en-US")} / 估算{" "}
                      {t.estimate.toLocaleString("en-US")}
                    </span>
                    <span className="tabular-nums">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <dl className="mt-3.5 grid gap-2.5 border-t border-ink-line pt-3.5 text-[12px] leading-relaxed sm:grid-cols-3">
                  <div>
                    <dt className="font-semibold text-ink-soft">資料條件</dt>
                    <dd className="mt-0.5 text-ink-mute">{t.dataRequirement}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink-soft">搜索價值</dt>
                    <dd className="mt-0.5 text-ink-mute">{t.value}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink-soft">品質閘門</dt>
                    <dd className="mt-0.5 text-ink-mute">{t.qualityGate}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      {/* Structured data reuse */}
      <section className="mt-9">
        <h2 className="text-[18px] font-semibold tracking-tight text-ink">
          同一份結構化資料，多種輸出
        </h2>
        <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-mute">
          頁面數字的來源是同一個資料庫。不同頁型只是同一批事實的不同呈現方式，
          不需要為每種頁型重新收集資料。
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-ink-line bg-white">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink-line bg-paper">
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  底層實體
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  可生成頁型
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  結構化資料格式
                </th>
              </tr>
            </thead>
            <tbody>
              {STRUCTURED_REUSE.map((r) => (
                <tr
                  key={r.entity}
                  className="border-b border-ink-line/70 last:border-b-0"
                >
                  <td className="px-4 py-2.5 text-[12.5px] font-medium text-ink">
                    {r.entity}
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-ink-soft">
                    {r.pages}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11.5px] text-ink-mute">
                    {r.schema}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Not doing */}
      <section className="mt-9 rounded-xl border border-ink-line bg-white p-5">
        <h2 className="flex items-center gap-2 text-[16px] font-semibold text-ink">
          <XCircle size={16} className="text-brand-600" aria-hidden />
          這一輪平台沒有做的事
        </h2>
        <ul className="mt-3 space-y-2">
          {[
            "沒有生成一萬個頁面——只有上面這些估算數字。",
            "沒有批量抓取任何保險公司的公開網站——只建立了資料架構。",
            "沒有把未核實的產品做成頁面——資料條件未達標的產品留在資料庫，不上線。",
            "沒有製造假的保險公司評價、假的排名或假的優惠。",
          ].map((t) => (
            <li
              key={t}
              className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-soft"
            >
              <CheckCircle2
                size={14}
                className="mt-0.5 shrink-0 text-accent-600"
                aria-hidden
              />
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const STRUCTURED_REUSE: {
  entity: string;
  pages: string;
  schema: string;
}[] = [
  {
    entity: "產品",
    pages: "產品頁 / 類別頁 / 比較落地頁 / 主題指南",
    schema: "Product + Offer + InsuranceProduct",
  },
  {
    entity: "保險公司",
    pages: "公司頁 / 產品頁 / 類別頁",
    schema: "InsuranceCompany + Brand",
  },
  {
    entity: "保險術語",
    pages: "術語頁 / 產品頁 / 問答頁",
    schema: "DefinedTerm + DefinedTermSet",
  },
  {
    entity: "知識文章",
    pages: "文章頁 / 術語頁 / 主題指南",
    schema: "Article + FAQPage",
  },
  {
    entity: "常見問題",
    pages: "問答頁 / 產品頁相關問題 / 類別頁",
    schema: "FAQPage + Question/Answer",
  },
  {
    entity: "來源文件",
    pages: "產品頁證據面板 / 來源列表頁",
    schema: "CreativeWork + version + isBasedOn",
  },
];

function Metric({
  icon,
  label,
  value,
  small,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink-line bg-white p-4">
      <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-mute">
        {icon}
        {label}
      </p>
      <p
        className={`mt-1.5 font-bold tabular-nums text-ink ${small ? "text-[14px]" : "text-[22px]"}`}
      >
        {value}
      </p>
    </div>
  );
}
