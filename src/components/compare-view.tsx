"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  X,
  Trash2,
  ArrowRight,
  Info,
  ArrowUpRight,
  Lightbulb,
  HelpCircle,
  Layers,
  ListChecks,
  MessageSquareQuote,
  Quote,
} from "lucide-react";
import { useCompare, MAX_COMPARE_ITEMS } from "@/lib/compare-context";
import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { getInsurer } from "@/data/insurers";
import { CATEGORY_LABELS } from "@/data/types";
import { trackEvent } from "@/lib/analytics";
import type { InsuranceProduct } from "@/data/types";
import {
  buildDifferences,
  buildComparisonRows,
  buildExplanations,
  buildQuestions,
  groupRows,
  MISSING_DATA,
  sameCategory,
} from "@/lib/compare-insights";
import { SourceDrawer, useSourceDrawer, DemoDataNotice } from "./source-drawer";
import { ContactProfessional } from "./contact-professional-modal";
import { resolveEvidenceSources } from "@/data/evidence";

// ============================================================
// 比較引擎 V2 — 四個層次
// ============================================================
//   Level 1  快速差異：系統自動挑出最關鍵的 3 個差別
//   Level 2  完整比較表：結構化欄位 + 資料來源欄
//   Level 3  差異解釋：為甚麼會出現這些差異
//   Level 4  應問的問題：自動生成的追問清單
//
// 平台的語氣規則：解釋「差異從哪裡來」，絕不排名。
// ============================================================

type Tab = "quick" | "full" | "explain" | "questions";

const TABS: { id: Tab; label: string; icon: typeof Layers; desc: string }[] = [
  {
    id: "quick",
    label: "快速差異",
    icon: Lightbulb,
    desc: "系統根據資料自動挑出最關鍵的三個差別。",
  },
  {
    id: "full",
    label: "完整比較表",
    icon: Layers,
    desc: "全部結構化欄位並排對照，資料缺失會明確標示。",
  },
  {
    id: "explain",
    label: "差異解釋",
    icon: MessageSquareQuote,
    desc: "說明這些差異是甚麼機制造成的，以及對你的實際影響。",
  },
  {
    id: "questions",
    label: "應問的問題",
    icon: ListChecks,
    desc: "按你的比較對象自動生成的追問清單。",
  },
];

export function CompareView() {
  const { ids, count, remove, clear } = useCompare();
  const [tab, setTab] = useState<Tab>("quick");
  const [openHelp, setOpenHelp] = useState<string | null>(null);
  // Evidence-Based Comparison：比較表的每個數值都可打開證據面板
  const {
    drawerState: evidenceState,
    openDrawer: openEvidenceDrawer,
    closeDrawer: closeEvidenceDrawer,
  } = useSourceDrawer();

  const selected = useMemo(
    () =>
      ids
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as InsuranceProduct[],
    [ids],
  );

  const differences = useMemo(() => buildDifferences(selected), [selected]);
  const rows = useMemo(() => buildComparisonRows(selected), [selected]);
  const groupedRows = useMemo(() => groupRows(rows), [rows]);
  const explanations = useMemo(() => buildExplanations(selected), [selected]);
  const questions = useMemo(() => buildQuestions(selected), [selected]);

  useEffect(() => {
    if (count >= 2) trackEvent("compare_view", { count, products: ids.join(",") });
  }, [count, ids]);

  if (count < 2) {
    return (
      <div className="container-page py-10">
        <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
          <Link href="/" className="hover:text-brand-700">
            首頁
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink-soft">產品比較</span>
        </nav>

        <header className="mt-3">
          <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
            產品比較
          </h1>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
            把兩至三個產品並排對照，直接看到自付額結構、續保安排、保障範圍同資料核實狀態的差異。
            比較結果只解釋「差異從哪裡來」，不會給出排名或推薦。
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-dashed border-ink-line bg-white p-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <Scale size={24} aria-hidden />
          </span>
          <p className="mt-4 text-[16px] font-semibold text-ink">
            請加入至少兩個產品，開始比較保障內容。
          </p>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-ink-soft">
            你可以在產品列表或產品詳情頁按「加入比較」，最多可以同時比較{" "}
            {MAX_COMPARE_ITEMS} 個產品。
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-brand-800 px-4 text-[13.5px] font-semibold text-white hover:bg-brand-900"
            >
              返回產品列表繼續選擇
              <ArrowRight size={15} aria-hidden />
            </Link>
            <Link
              href="/medical-insurance"
              className="inline-flex h-10 items-center rounded-md border border-ink-line bg-white px-4 text-[13.5px] font-semibold text-ink-soft hover:bg-paper"
            >
              由醫療保險指南開始
            </Link>
          </div>
        </div>

        {count === 1 && selected[0] && (
          <div className="mt-6">
            <h2 className="text-[15px] font-semibold text-ink">已經加入</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-accent-600 bg-accent-50 px-3 py-1.5 text-[13px] text-accent-800">
                {selected[0].name}
                <button
                  type="button"
                  onClick={() => remove(selected[0].id)}
                  className="text-accent-700 hover:text-ink"
                  aria-label="移除"
                >
                  <X size={14} aria-hidden />
                </button>
              </span>
            </div>
            <p className="mt-3 text-[12.5px] text-ink-mute">
              再加多一個產品就可以開始比較。
            </p>
          </div>
        )}
      </div>
    );
  }

  const mixedCategories = !sameCategory(selected);

  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">產品比較</span>
      </nav>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
            產品比較
          </h1>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
            正在比較 {count} 個產品。表格內容全部來自平台資料庫，
            差異說明只作客觀數據整理，不構成推薦或購買建議。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/products"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 text-[13px] font-medium text-ink-soft hover:bg-paper"
          >
            返回產品列表
          </Link>
          <button
            type="button"
            onClick={clear}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 text-[13px] font-medium text-ink-soft hover:bg-paper"
          >
            <Trash2 size={14} aria-hidden />
            清除全部
          </button>
        </div>
      </header>

      {/* Selected chips */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {selected.map((p) => (
          <span
            key={p.id}
            className="inline-flex items-center gap-2 rounded-md border border-brand-200 bg-brand-50 px-3 py-1.5 text-[12.5px] text-brand-800"
          >
            <span className="font-medium">{p.name}</span>
            <button
              type="button"
              onClick={() => remove(p.id)}
              className="text-brand-600 hover:text-ink"
              aria-label={`移除 ${p.name}`}
            >
              <X size={14} aria-hidden />
            </button>
          </span>
        ))}
        {count < MAX_COMPARE_ITEMS && (
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-ink-line px-3 py-1.5 text-[12.5px] font-medium text-ink-mute hover:border-brand-300 hover:text-brand-700"
          >
            + 加入更多（最多 {MAX_COMPARE_ITEMS} 個）
          </Link>
        )}
      </div>

      {mixedCategories && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
          <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-amber-900">
            <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
            <span>
              你比較的產品屬於不同保險類別。跨類別比較在數字上可行，
              但保障功能本身不同（例如醫療保險報銷費用，危疾保險賠付保額），
              建議先確認兩者的保障目標是否一致。
            </span>
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-7 border-b border-ink-line">
        <div
          role="tablist"
          aria-label="比較層次"
          className="-mb-px flex gap-1 overflow-x-auto"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                  active
                    ? "border-brand-700 text-brand-800"
                    : "border-transparent text-ink-mute hover:border-ink-line hover:text-ink-soft"
                }`}
              >
                <Icon size={15} aria-hidden />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-[13px] text-ink-mute">
        {TABS.find((t) => t.id === tab)?.desc}
      </p>

      {/* ---------------- Level 1: 快速差異 ---------------- */}
      {tab === "quick" && (
        <section className="mt-5">
          {differences.length === 0 ? (
            <div className="rounded-xl border border-ink-line bg-white p-6 text-center">
              <p className="text-[14px] text-ink-soft">
                這幾個產品的結構資料完全相同，沒有可比較的差異。
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {differences.map((d) => (
                <article
                  key={d.kind}
                  className="rounded-xl border border-ink-line bg-white p-5"
                >
                  <h2 className="text-[14.5px] font-semibold text-ink">{d.title}</h2>

                  <ul className="mt-3 space-y-2">
                    {d.values.map((v) => {
                      const p = selected.find((x) => x.id === v.productId);
                      return (
                        <li
                          key={v.productId}
                          className="rounded-lg bg-paper px-3 py-2"
                        >
                          <p className="text-[11.5px] font-medium text-ink-mute">
                            {p?.name}
                          </p>
                          <p className="mt-0.5 text-[13.5px] font-medium text-ink">
                            {v.text}
                          </p>
                          {v.note && (
                            <p className="mt-0.5 text-[11.5px] text-ink-mute">
                              {v.note}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-3.5 border-t border-ink-line pt-3">
                    <p className="text-[11.5px] font-semibold uppercase tracking-wide text-brand-700">
                      為甚麼會有這個差異
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
                      {d.explanation}
                    </p>
                  </div>

                  <div className="mt-2.5 rounded-lg border border-accent-100 bg-accent-50/60 p-2.5">
                    <p className="text-[11.5px] font-semibold text-accent-800">
                      對你的實際影響
                    </p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-accent-900/85">
                      {d.impact}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-amber-900">
              <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                本平台不會給出「最適合你」、「一定最好」或「保證最划算」等結論。
                實際選擇需要考慮你的健康狀況、預算、現有保障同埋對風險的承受能力，
                並且以保單條款為準。
              </span>
            </p>
          </div>
        </section>
      )}

      {/* ---------------- Level 2: 完整比較表 ---------------- */}
      {tab === "full" && (
        <section className="mt-5">
          {/* Evidence-Based Comparison 說明 */}
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-brand-100 bg-brand-50/50 px-3.5 py-2.5">
            <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-900">
              <Quote size={13} aria-hidden />
              每個數值都可以追問來源
            </p>
            <p className="text-[12.5px] leading-relaxed text-brand-900/75">
              比較表裡每個數值旁的「查看證據」會打開證據面板，顯示它來自哪份文件、
              哪個版本、哪一頁，以及最後一次人工審核的日期。
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-ink-line bg-white">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink-line bg-paper">
                  <th className="sticky left-0 z-10 w-[180px] bg-paper px-4 py-3.5 text-[12.5px] font-semibold text-ink">
                    比較欄位
                  </th>
                  {selected.map((p) => (
                    <th key={p.id} className="min-w-[230px] px-4 py-3.5 align-top">
                      <span className="block text-[11.5px] font-medium text-ink-mute">
                        {getInsurer(p.insurerId)?.name ?? "保險公司"}
                      </span>
                      <Link
                        href={`/products/${p.slug}`}
                        className="group mt-0.5 flex items-start gap-1 text-[14px] font-semibold leading-snug text-ink hover:text-brand-700"
                      >
                        {p.name}
                        <ArrowUpRight
                          size={14}
                          className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      </Link>
                      <span className="mt-1.5 inline-block rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-700">
                        {CATEGORY_LABELS[p.category]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              {groupedRows.map((group) => (
                <tbody key={group.group}>
                  <tr>
                    <th
                      colSpan={selected.length + 1}
                      className="sticky left-0 bg-paper px-4 py-2 text-left text-[11.5px] font-semibold uppercase tracking-wide text-brand-700"
                    >
                      {group.group}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr
                      key={`${group.group}-${row.label}`}
                      className="border-b border-ink-line/70 align-top last:border-b-0"
                    >
                      <th className="sticky left-0 z-10 bg-white px-4 py-3.5 text-left align-top">
                        <span className="flex items-center gap-1 text-[13px] font-semibold text-ink">
                          {row.label}
                          <button
                            type="button"
                            onClick={() =>
                              setOpenHelp(openHelp === row.label ? null : row.label)
                            }
                            className="text-ink-mute hover:text-brand-700"
                            aria-label={`了解 ${row.label}`}
                          >
                            <HelpCircle size={13} aria-hidden />
                          </button>
                        </span>
                        {openHelp === row.label && row.hint && (
                          <span className="mt-2 block rounded-md border border-brand-100 bg-brand-50 p-2.5 text-[11.5px] font-normal leading-relaxed text-brand-900">
                            {row.hint}
                          </span>
                        )}
                      </th>
                      {row.values.map((v, i) => {
                        const ev = row.evidences?.[i] ?? null;
                        return (
                          <td
                            key={selected[i].id + row.label}
                            className="px-4 py-3.5"
                          >
                            {v === null || v === "" ? (
                              <span className="text-[13px] italic text-ink-mute">
                                {MISSING_DATA}
                              </span>
                            ) : (
                              <span
                                className={`text-[13px] leading-relaxed ${
                                  row.differs ? "font-medium text-ink" : "text-ink-soft"
                                }`}
                              >
                                {v}
                              </span>
                            )}
                            {row.differs && (
                              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent-500 align-middle" />
                            )}
                            {/* Evidence-Based Comparison：任何一個數值都可以追問來源 */}
                            {row.evidences && (
                              <button
                                type="button"
                                onClick={() => {
                                  const product = selected[i];
                                  const sources = ev
                                    ? resolveEvidenceSources(ev, product)
                                    : [];
                                  openEvidenceDrawer({
                                    evidence: ev ?? undefined,
                                    product,
                                    sources,
                                    factLabel: row.label,
                                    factValue: v ?? MISSING_DATA,
                                  });
                                  trackEvent("evidence_open", {
                                    productId: product.id,
                                    field: row.label,
                                  });
                                }}
                                className="mt-1.5 inline-flex items-center gap-1 rounded border border-ink-line bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-ink-soft transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
                              >
                                <Quote size={10} aria-hidden />
                                {ev ? "查看證據" : "尚未有來源"}
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <p className="mt-2 text-[11.5px] text-ink-mute">
            小提示：手機版可以左右滑動表格查看全部欄位。綠色圓點代表該欄位在
            不同產品之間存在差異；斜體的「{MISSING_DATA}」代表平台尚未記錄該項資料。
          </p>
          <div className="mt-3">
            <DemoDataNotice />
          </div>
        </section>
      )}

      {/* ---------------- Level 3: 差異解釋 ---------------- */}
      {tab === "explain" && (
        <section className="mt-5 space-y-4">
          {explanations.map((e) => (
            <article
              key={e.title}
              className="rounded-xl border border-ink-line bg-white p-5"
            >
              <h2 className="flex items-start gap-2 text-[15px] font-semibold text-ink">
                <MessageSquareQuote
                  size={16}
                  className="mt-0.5 shrink-0 text-brand-600"
                  aria-hidden
                />
                {e.title}
              </h2>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
                {e.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.productIds.map((pid) => {
                  const p = selected.find((x) => x.id === pid);
                  if (!p) return null;
                  return (
                    <Link
                      key={pid}
                      href={`/products/${p.slug}`}
                      className="rounded-full border border-ink-line bg-paper px-2.5 py-1 text-[11.5px] text-ink-soft hover:border-brand-300 hover:text-brand-700"
                    >
                      {p.name}
                    </Link>
                  );
                })}
              </div>
            </article>
          ))}
        </section>
      )}

      {/* ---------------- Level 4: 應問的問題 ---------------- */}
      {tab === "questions" && (
        <section className="mt-5">
          <div className="rounded-xl border border-ink-line bg-white p-5">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
              <ListChecks size={16} className="text-brand-600" aria-hidden />
              比較前建議向保險公司或經紀確認的問題
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
              這份清單由系統根據你所選的產品類別與條款特徵自動生成。
              把清單印出或複製去問，比逐頁閱讀條款更快找到答案。
            </p>
            <ol className="mt-4 space-y-2">
              {questions.map((q, i) => (
                <li
                  key={q}
                  className="flex items-start gap-3 rounded-lg border border-ink-line bg-paper px-3.5 py-2.5"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-800 text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="text-[13.5px] leading-relaxed text-ink-soft">
                    {q}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const text = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                  }
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 text-[13px] font-medium text-ink-soft hover:bg-paper"
              >
                複製清單
              </button>
              <Link
                href="/ask"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand-800 px-3.5 text-[13px] font-semibold text-white hover:bg-brand-900"
              >
                在問保險問題頁發問
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 需要持牌人士進一步解釋 ---------------- */}
      {count >= 2 && (
        <section className="mt-10">
          <ContactProfessional
            variant="panel"
            context={{
              from: "compare",
              productIds: selected.map((p) => p.id),
              productNames: selected.map((p) => p.name),
              category: selected[0]?.category ?? "general",
              question: questions[0]
                ? `我想先問清楚：${questions[0]}`
                : undefined,
            }}
          />
          <p className="mt-2.5 text-[12px] leading-relaxed text-ink-mute">
            平台只做轉介：你的請求會按同意轉交合適的持牌保險人士，由對方直接與你聯絡。
            平台不會代你投保、不會收取保費，也不會完成任何保險交易。
            詳見{" "}
            <Link href="/commercial-transparency" className="text-brand-700 underline underline-offset-2 hover:text-brand-900">
              商業透明度
            </Link>
            。
          </p>
        </section>
      )}

      {/* Related reading */}
      <section className="mt-10">
        <h2 className="text-[18px] font-semibold tracking-tight text-ink">
          比較前可以先了解
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <Link
              key={a.slug}
              href={`/learn/${a.slug}`}
              className="group rounded-lg border border-ink-line bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40"
            >
              <span className="text-[11.5px] font-medium text-brand-700">
                {a.category}
              </span>
              <span className="mt-1 block text-[14px] font-medium text-ink group-hover:text-brand-700">
                {a.title}
              </span>
              <span className="mt-1.5 block text-[12px] text-ink-mute">
                閱讀 {a.readingMinutes} 分鐘
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Evidence Drawer */}
      <SourceDrawer
        open={evidenceState !== null}
        onClose={closeEvidenceDrawer}
        evidence={evidenceState?.evidence}
        product={evidenceState?.product}
        sources={evidenceState?.sources}
        factLabel={evidenceState?.factLabel}
        factValue={evidenceState?.factValue}
        title="比較證據"
      />
    </div>
  );
}
