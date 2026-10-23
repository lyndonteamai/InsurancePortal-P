"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Database,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  Activity,
  RefreshCw,
  Eye,
  Network,
  Layers,
  FileText,
  BookOpen,
  HelpCircle,
  Building2,
  Package,
  TrendingUp,
  Factory,
} from "lucide-react";
import { products } from "@/data/products";
import { insurers } from "@/data/insurers";
import { dictionary } from "@/data/dictionary";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { hubs } from "@/data/hubs";
import { completenessSummary } from "@/lib/completeness";
import { dataMoatReport } from "@/lib/data-moat";
import { ACQUISITION_METHOD_LABELS, EXTRACTION_STATE_LABELS } from "@/data/types";
import {
  getAnalyticsEvents,
  clearAnalyticsEvents,
  ANALYTICS_EVENT_LABELS,
} from "@/lib/analytics";
import type { AnalyticsEventName } from "@/lib/analytics";
import { VERIFICATION_LABELS } from "@/data/types";

// ============================================================
// 資料營運預覽 (/admin-preview)
// ============================================================
// ⚠️ 這個頁面是內部營運工具，設計上不應該被一般消費者使用。
//    完整性分數（Data Completeness Score）只出現在這裡，
//    絕不出現在產品頁或比較頁——因為消費者看到「80 分」會誤以為
//    那是產品質量評分，而它其實是「我們記錄得多完整」的內部指標。
// ============================================================

const RELATION_LABELS: { key: string; label: string; note: string }[] = [
  { key: "insurer_product", label: "保險公司 → 產品", note: "公司頁與產品頁的共同上層" },
  { key: "product_coverage", label: "產品 → 保障項目", note: "保障是比較、術語與 FAQ 的基本單位" },
  { key: "product_term", label: "產品 → 保險術語", note: "讓「自付額」這類術語連回具體產品" },
  { key: "product_source", label: "產品 → 來源文件", note: "Source-First 的核心邊" },
  { key: "term_term", label: "術語 ↔ 術語", note: "概念的相鄰關係，例如自付額 ↔ 不保事項" },
  { key: "term_article", label: "術語 → 知識文章", note: "術語頁的延伸閱讀" },
  { key: "article_product", label: "文章 → 產品", note: "文章頁連回可比較的產品" },
  { key: "article_term", label: "文章 → 術語", note: "文章頁連回術語字典" },
  { key: "hub_product", label: "主題指南 → 產品", note: "類別入口的產品集合" },
  { key: "hub_term", label: "主題指南 → 術語", note: "類別入口的概念集合" },
  { key: "hub_article", label: "主題指南 → 文章", note: "類別入口的閱讀集合" },
  { key: "hub_faq", label: "主題指南 → 常見問題", note: "類別入口的問題集合" },
];

export function AdminPreview() {
  const [events, setEvents] = useState<ReturnType<typeof getAnalyticsEvents>>([]);
  const [showScores, setShowScores] = useState(true);

  useEffect(() => {
    setEvents(getAnalyticsEvents());
  }, []);

  const summary = completenessSummary(products);
  const moat = dataMoatReport();
  const totalSources = products.reduce(
    (s, p) => s + p.sourceDocuments.length,
    0,
  );
  const lastUpdated = products
    .map((p) => p.verification.lastReviewedAt)
    .sort()
    .reverse()[0];

  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">資料營運預覽</span>
      </nav>

      <header className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 text-[11.5px] font-semibold text-amber-800">
            <Eye size={12} aria-hidden />
            內部營運頁面
          </span>
        </div>
        <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">
          保險資料護城河
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          這個平台真正的資產不是頁面數量，而是結構化、可追溯、可核實的保險資料。
          這一頁把這項資產量化：產品、來源、文件、保障項目、術語、文章、問題與
          實體關係的規模，以及核實狀態與資料缺口。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin-preview/seo"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 text-[12.5px] font-medium text-ink-soft hover:bg-paper"
          >
            <TrendingUp size={13} aria-hidden />
            SEO 頁面工廠預覽
          </Link>
        </div>
      </header>

      {/* Totals */}
      <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric
          icon={<Database size={14} aria-hidden />}
          label="產品總數"
          value={String(summary.total)}
        />
        <Metric
          icon={<ShieldCheck size={14} aria-hidden />}
          label="來源文件"
          value={String(totalSources)}
        />
        <Metric
          icon={<BarChart3 size={14} aria-hidden />}
          label="平均完整度"
          value={`${summary.avg}%`}
        />
        <Metric
          icon={<RefreshCw size={14} aria-hidden />}
          label="最後更新"
          value={lastUpdated}
          small
        />
      </section>

      {/* Content inventory */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Metric label="保險公司" value={String(insurers.length)} />
        <Metric label="保險術語" value={String(dictionary.length)} />
        <Metric label="知識文章" value={String(articles.length)} />
        <Metric label="常見問題" value={String(faqs.length)} />
        <Metric label="主題指南" value={String(hubs.length)} />
        <Metric
          label="主題章節"
          value={String(hubs.reduce((s, h) => s + h.sections.length, 0))}
        />
      </section>

      {/* ============ Data Moat ============ */}
      <section className="mt-9">
        <h2 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-ink">
          <Network size={17} className="text-brand-600" aria-hidden />
          資料護城河規模
        </h2>
        <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-mute">
          下表每一列都是平台累積的「結構化保險資料」，不是頁面數。
          進度條對照的是支撐第一階段一萬個可索引頁面所需的資料基礎規模。
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {moat.metrics.map((m) => {
            const pct = Math.min(100, Math.round((m.value / m.target) * 100));
            return (
              <div
                key={m.key}
                className="rounded-xl border border-ink-line bg-white p-4"
              >
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-mute">
                  {m.label}
                </p>
                <p className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-[22px] font-bold tabular-nums text-ink">
                    {m.value.toLocaleString("en-US")}
                  </span>
                  <span className="text-[12px] text-ink-mute">{m.unit}</span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full rounded-full bg-accent-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] tabular-nums text-ink-mute">
                  目標規模 {m.target.toLocaleString("en-US")} {m.unit} · {pct}%
                </p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-soft">
                  {m.note}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Facts */}
      <section className="mt-9">
        <h2 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-ink">
          <ShieldCheck size={17} className="text-brand-600" aria-hidden />
          可追溯事實的核實狀態
        </h2>
        <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-mute">
          這裡數的是「可指回來源文件的產品事實」，不是產品數。
          一款產品有 12 項事實，就會被計成 12 項。
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Metric
            label="可追溯事實總數"
            value={moat.facts.total.toLocaleString("en-US")}
          />
          {(
            Object.keys(moat.facts.byStatus) as (keyof typeof moat.facts.byStatus)[]
          ).map((status) => (
            <Metric
              key={status}
              label={VERIFICATION_LABELS[status]}
              value={moat.facts.byStatus[status].toLocaleString("en-US")}
            />
          ))}
        </div>
        <p className="mt-2 text-[12px] text-ink-mute">
          已核實或部分核實的事實佔{" "}
          <strong className="text-ink-soft">{moat.facts.verifiedRatio}%</strong>。
          其餘為原型模擬資料，接入官方條款後會隨審核流程上升。
        </p>
      </section>

      {/* Knowledge graph shape */}
      <section className="mt-9">
        <h2 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-ink">
          <Layers size={17} className="text-brand-600" aria-hidden />
          知識圖譜結構
        </h2>
        <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-mute">
          保險公司 → 產品 → 保障項目 → 保險術語 → 來源文件，並橫向連到知識文章、
          常見問題與主題指南。關係數決定「一萬個頁面」是資產還是垃圾。
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Metric label="圖譜節點" value={moat.graph.nodes.toLocaleString("en-US")} />
          <Metric label="圖譜關係" value={moat.graph.edges.toLocaleString("en-US")} />
          <Metric
            label="保險公司節點"
            value={String(moat.graph.counts.insurer ?? 0)}
          />
          <Metric
            label="保障項目節點"
            value={String(moat.graph.counts.coverage ?? 0)}
          />
          <Metric
            label="來源文件節點"
            value={String(moat.graph.counts.source ?? 0)}
          />
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-ink-line bg-white">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink-line bg-paper">
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  關係類型
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  說明
                </th>
                <th className="px-4 py-3 text-right text-[12.5px] font-semibold text-ink">
                  數量
                </th>
              </tr>
            </thead>
            <tbody>
              {RELATION_LABELS.map((r) => (
                <tr
                  key={r.key}
                  className="border-b border-ink-line/70 last:border-b-0"
                >
                  <td className="px-4 py-2.5 text-[12.5px] font-medium text-ink">
                    {r.label}
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-ink-mute">{r.note}</td>
                  <td className="px-4 py-2.5 text-right text-[13px] font-semibold tabular-nums text-ink-soft">
                    {(moat.graph.edgeCounts[r.key] ?? 0).toLocaleString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Data pipeline maturity */}
      <section className="mt-9 grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-ink">
            <Factory size={16} className="text-brand-600" aria-hidden />
            來源取得方式分佈
          </h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-mute">
            對應資料引擎的 SOURCE → DOCUMENT 階段。正式版會以自動抓取與版本監測
            逐步取代人工上傳。
          </p>
          <ul className="mt-3 space-y-1.5">
            {moat.acquisition.map((a) => (
              <li
                key={a.label}
                className="flex items-center justify-between gap-3 rounded-lg border border-ink-line bg-white px-3.5 py-2.5"
              >
                <span className="text-[12.5px] text-ink-soft">
                  {ACQUISITION_METHOD_LABELS[
                    a.label as keyof typeof ACQUISITION_METHOD_LABELS
                  ] ?? a.label}
                </span>
                <span className="text-[13px] font-semibold tabular-nums text-ink">
                  {a.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-ink">
            <Package size={16} className="text-brand-600" aria-hidden />
            抽取狀態分佈
          </h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-mute">
            對應資料引擎的 EXTRACTION → STRUCTURED DATA → HUMAN REVIEW 階段。
          </p>
          <ul className="mt-3 space-y-1.5">
            {moat.extraction.map((a) => (
              <li
                key={a.label}
                className="flex items-center justify-between gap-3 rounded-lg border border-ink-line bg-white px-3.5 py-2.5"
              >
                <span className="text-[12.5px] text-ink-soft">
                  {EXTRACTION_STATE_LABELS[
                    a.label as keyof typeof EXTRACTION_STATE_LABELS
                  ] ?? a.label}
                </span>
                <span className="text-[13px] font-semibold tabular-nums text-ink">
                  {a.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gaps */}
      <section className="mt-9">
        <h2 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-ink">
          <AlertTriangle size={17} className="text-amber-600" aria-hidden />
          目前的資料缺口
        </h2>
        <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-mute">
          護城河如果不能被誠實地量出缺口，就只是一個數字遊戲。以下是平台目前
          明確知道還沒做到的事。
        </p>
        <ul className="mt-3 space-y-2">
          {moat.gaps.map((g, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-amber-900"
            >
              <AlertTriangle size={13} className="mt-0.5 shrink-0" aria-hidden />
              {g}
            </li>
          ))}
        </ul>
      </section>

      {/* Verification distribution */}
      <section className="mt-9">
        <h2 className="text-[18px] font-semibold tracking-tight text-ink">
          核實狀態分布
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(Object.keys(summary.byStatus) as (keyof typeof summary.byStatus)[]).map(
            (status) => {
              const count = summary.byStatus[status];
              const pct = summary.total
                ? Math.round((count / summary.total) * 100)
                : 0;
              return (
                <div
                  key={status}
                  className="rounded-xl border border-ink-line bg-white p-4"
                >
                  <p className="text-[12px] font-medium text-ink-soft">
                    {VERIFICATION_LABELS[status]}
                  </p>
                  <p className="mt-1 text-[24px] font-bold tabular-nums text-ink">
                    {count}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-ink-mute">{pct}%</p>
                </div>
              );
            },
          )}
        </div>
      </section>

      {/* Completeness */}
      <section className="mt-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold tracking-tight text-ink">
              資料完整度評分（內部指標）
            </h2>
            <p className="mt-1 text-[12.5px] text-ink-mute">
              這個分數衡量的是「我們記錄這個產品有多完整」，不是產品質量。
              消費者頁面不會顯示此分數。
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowScores((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 text-[12.5px] font-medium text-ink-soft hover:bg-paper"
          >
            {showScores ? "隱藏評分明細" : "顯示評分明細"}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["A", "B", "C", "D"] as const).map((g) => (
            <div
              key={g}
              className="rounded-xl border border-ink-line bg-white p-4"
            >
              <p className="text-[12px] font-medium text-ink-soft">{g} 級</p>
              <p className="mt-1 text-[24px] font-bold tabular-nums text-ink">
                {summary.byGrade[g]}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-mute">款產品</p>
            </div>
          ))}
        </div>

        {/* Data quality table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-ink-line bg-white">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink-line bg-paper">
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  產品
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  核實狀態
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  來源數
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  缺失欄位
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  最後檢視
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  完整度
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.rows.map(({ product: p, result }) => (
                <tr
                  key={p.id}
                  className="border-b border-ink-line/70 align-top last:border-b-0"
                >
                  <th className="px-4 py-3 text-left">
                    <Link
                      href={`/products/${p.slug}`}
                      className="text-[13px] font-medium text-ink hover:text-brand-700"
                    >
                      {p.name}
                    </Link>
                    <span className="mt-0.5 block text-[11px] text-ink-mute">
                      {insurers.find((i) => i.id === p.insurerId)?.name}
                    </span>
                  </th>
                  <td className="px-4 py-3 text-[12.5px] text-ink-soft">
                    {VERIFICATION_LABELS[p.verification.status]}
                  </td>
                  <td className="px-4 py-3 text-[12.5px] tabular-nums text-ink-soft">
                    {p.sourceDocuments.length}
                  </td>
                  <td className="px-4 py-3 text-[12px] leading-relaxed text-ink-soft">
                    {result.missingFields.length ? (
                      <span className="flex items-start gap-1.5">
                        <AlertTriangle
                          size={12}
                          className="mt-0.5 shrink-0 text-amber-600"
                          aria-hidden
                        />
                        {result.missingFields.join("、")}
                      </span>
                    ) : (
                      <span className="text-emerald-700">無</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12.5px] tabular-nums text-ink-soft">
                    {p.verification.lastReviewedAt}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold tabular-nums text-ink">
                        {result.score}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10.5px] font-semibold ${
                          result.grade === "A"
                            ? "bg-emerald-50 text-emerald-800"
                            : result.grade === "B"
                              ? "bg-accent-50 text-accent-800"
                              : result.grade === "C"
                                ? "bg-amber-50 text-amber-900"
                                : "bg-red-50 text-red-800"
                        }`}
                      >
                        {result.grade}
                      </span>
                    </span>
                    {showScores && (
                      <ul className="mt-2 space-y-0.5">
                        {result.breakdown.map((b) => (
                          <li
                            key={b.label}
                            className="flex items-center justify-between gap-2 text-[11px] text-ink-mute"
                          >
                            <span>{b.label}</span>
                            <span className="tabular-nums">{b.score}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Analytics */}
      <section className="mt-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-ink">
            <Activity size={17} className="text-brand-600" aria-hidden />
            分析事件記錄
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEvents(getAnalyticsEvents())}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 text-[12.5px] font-medium text-ink-soft hover:bg-paper"
            >
              <RefreshCw size={13} aria-hidden />
              重新整理
            </button>
            <button
              type="button"
              onClick={() => {
                clearAnalyticsEvents();
                setEvents([]);
              }}
              className="inline-flex h-9 items-center rounded-md border border-ink-line bg-white px-3.5 text-[12.5px] font-medium text-ink-soft hover:bg-paper"
            >
              清除記錄
            </button>
          </div>
        </div>

        <p className="mt-1.5 text-[12.5px] text-ink-mute">
          Prototype 階段的追蹤只寫入瀏覽器 localStorage，不會傳送至任何外部服務。
        </p>

        {events.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-ink-line bg-white p-8 text-center">
            <p className="text-[13.5px] text-ink-soft">
              尚未記錄任何事件。在網站上搜尋、查看產品或加入比較清單後再回來看看。
            </p>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-ink-line bg-white">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink-line bg-paper">
                  <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                    事件
                  </th>
                  <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                    路徑
                  </th>
                  <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                    內容
                  </th>
                  <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                    時間
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 40).map((e, i) => (
                  <tr
                    key={i}
                    className="border-b border-ink-line/70 last:border-b-0"
                  >
                    <td className="px-4 py-2.5 text-[12.5px] font-medium text-ink">
                      {ANALYTICS_EVENT_LABELS[e.name as AnalyticsEventName] ??
                        e.name}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-ink-soft">{e.path}</td>
                    <td className="px-4 py-2.5 text-[11.5px] text-ink-mute">
                      {Object.entries(e.payload)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(" · ")}
                    </td>
                    <td className="px-4 py-2.5 text-[11.5px] tabular-nums text-ink-mute">
                      {new Date(e.ts).toLocaleTimeString("zh-HK")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

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
