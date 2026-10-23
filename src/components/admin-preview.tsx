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
} from "lucide-react";
import { products } from "@/data/products";
import { insurers } from "@/data/insurers";
import { dictionary } from "@/data/dictionary";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { hubs } from "@/data/hubs";
import { completenessSummary } from "@/lib/completeness";
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

export function AdminPreview() {
  const [events, setEvents] = useState<ReturnType<typeof getAnalyticsEvents>>([]);
  const [showScores, setShowScores] = useState(true);

  useEffect(() => {
    setEvents(getAnalyticsEvents());
  }, []);

  const summary = completenessSummary(products);
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
          資料營運預覽
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          這個頁面展示平台資料庫的整體狀態：資料量、核實狀態分布、完整度評分與
          分析事件記錄。完整度分數只在此顯示，消費者頁面不會出現。
        </p>
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
