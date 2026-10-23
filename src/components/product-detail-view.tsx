"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Phone,
  ShieldAlert,
  Table2,
  Info,
  Quote,
} from "lucide-react";
import type { InsuranceProduct, ProductCategory } from "@/data/types";
import { CATEGORY_LABELS } from "@/data/types";
import { CompareButton } from "./compare-button";
import { VerificationBadge } from "./verification-badge";
import { SourceList } from "./source-list";
import { SourceDrawer, useSourceDrawer, DemoDataNotice } from "./source-drawer";
import { getEvidence, hasTraceableEvidence } from "@/data/evidence";
import { ReportIssueButton } from "./report-issue-button";
import {
  ProductIntelligenceSummary,
  TermPointsExplainer,
  RelatedTerms,
} from "./product-intelligence-summary";
import { trackEvent } from "@/lib/analytics";

// ============================================================
// 產品詳情頁（V2）
// ============================================================
// 頁面結構（依 STEP 4–6）：
//   1. 麵包屑 + 標題 + 核實徽章
//   2. 產品智能摘要（快速判斷）
//   3. 保障一覽（含資料來源欄）
//   4. 重要限制（可展開「這是什麼？」）
//   5. 不保事項
//   6. 條款細項（自付額／等待期／續保／投保資格）
//   7. 保費示例
//   8. 資料來源
//   9. 轉介層（不破壞中立）
//  10. 相關內容
// ============================================================

export function ProductDetailView({
  product,
  insurerName,
  insurerHref,
  relatedTerms,
  relatedArticles,
  relatedQuestions,
  relatedProducts,
}: {
  product: InsuranceProduct;
  insurerName: string;
  insurerHref: string;
  relatedTerms: { slug: string; zh: string; term: string }[];
  relatedArticles: { slug: string; title: string; category: string; readingMinutes: number }[];
  relatedQuestions: { id: string; question: string }[];
  relatedProducts: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    category: ProductCategory;
    premiumMin: number | null;
  }[];
}) {
  useEffect(() => {
    trackEvent("product_view", { productId: product.id, category: product.category });
  }, [product.id, product.category]);

  // Source-First：每個欄位的「查看來源」按鈕共用這個抽屜
  const { drawerState, openDrawer, closeDrawer } = useSourceDrawer();

  /** 開啟某個事實的證據面板；沒有可追溯來源時明確顯示「尚未有來源」 */
  const showEvidence = (factLabel: string, factValue: string, sourceIds: string[]) => {
    const ev = getEvidence(product, factLabel);
    const sources = product.sourceDocuments.filter((s) => sourceIds.includes(s.id));
    openDrawer({
      evidence: ev,
      product,
      sources: ev ? undefined : sources,
      factLabel,
      factValue,
      title: "查看來源",
    });
    trackEvent("source_open", { productId: product.id, factLabel });
  };

  const catLabel = CATEGORY_LABELS[product.category];
  const hubHref = hubFor(product.category);

  return (
    <div className="container-page py-10">
      {/* Breadcrumb */}
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/products" className="hover:text-brand-700">
          保險產品
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={hubHref} className="hover:text-brand-700">
          {catLabel}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{product.name}</span>
      </nav>

      {/* Header */}
      <header className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={insurerHref}
            className="text-[13px] font-medium text-brand-700 hover:underline"
          >
            {insurerName}
          </Link>
          <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11.5px] font-medium text-brand-700">
            {catLabel}
          </span>
          <VerificationBadge
            status={product.verification.status}
            lastReviewedAt={product.verification.lastReviewedAt}
            unverifiedFields={product.verification.unverifiedFields}
            size="sm"
          />
        </div>

        <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">
          {product.name}
        </h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          {product.description}
        </p>

        {/* Primary actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <CompareButton product={product} variant="solid" />
          <Link
            href="/compare"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 text-[13px] font-medium text-ink-soft hover:bg-paper"
          >
            前往比較頁面
            <ArrowRight size={14} aria-hidden />
          </Link>
          <span className="text-[12px] text-ink-mute">
            資料最後更新：{product.updatedAt}
          </span>
        </div>
      </header>

      {/* Source-First 說明條：讓讀者知道每一個數字都可以追問來源 */}
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-brand-100 bg-brand-50/50 px-3.5 py-2.5">
        <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-900">
          <Quote size={13} aria-hidden />
          Source-First 頁面
        </p>
        <p className="text-[12.5px] leading-relaxed text-brand-900/75">
          這個頁面上的每個數字旁邊都有「查看來源」。點擊可以看到它來自哪份文件、
          哪個版本、哪一頁，以及最後一次人工審核的日期。
        </p>
      </div>

      {/* 1. Intelligence Summary */}
      <div className="mt-7">
        <ProductIntelligenceSummary product={product} />
      </div>

      {/* 2. Coverage table */}
      <section className="mt-10" aria-labelledby="coverage-heading">
        <h2 id="coverage-heading" className="text-[20px] font-semibold tracking-tight text-ink">
          保障一覽
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
          每項保障都標示其額度描述與對應的來源文件，方便你回到條款原文核對。
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-ink-line bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink-line bg-paper">
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  保障項目
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  保障內容
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  額度描述
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  資料來源
                </th>
              </tr>
            </thead>
            <tbody>
              {product.coverage.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-ink-line/70 align-top last:border-b-0"
                >
                  <th className="px-4 py-3.5 text-left align-top">
                    <span className="flex items-start gap-1.5 text-[13.5px] font-semibold text-ink">
                      {c.highlight && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                      )}
                      {c.name}
                    </span>
                  </th>
                  <td className="px-4 py-3.5 text-[13px] leading-relaxed text-ink-soft">
                    {c.summary}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] leading-relaxed text-ink-soft">
                    {c.limit ?? "資料未提供"}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => showEvidence(c.name, c.limit ?? c.summary, c.sourceIds)}
                      className="inline-flex items-center gap-1 rounded border border-ink-line bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-ink-soft transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
                    >
                      <Quote size={10} aria-hidden />
                      查看來源
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Important limits */}
      {product.termPoints.length > 0 && (
        <section className="mt-10" aria-labelledby="limits-heading">
          <h2
            id="limits-heading"
            className="text-[20px] font-semibold tracking-tight text-ink"
          >
            重要限制與理解重點
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
            點擊每一項可以展開詳細說明。這些是產品設計上最容易被忽略、但最影響
            實際成本或理賠結果的部分。
          </p>
          <div className="mt-4">
            <TermPointsExplainer points={product.termPoints} />
          </div>
        </section>
      )}

      {/* 4. Exclusions */}
      <section className="mt-10" aria-labelledby="exclusions-heading">
        <h2
          id="exclusions-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          不保事項
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
          下列情況即使發生，亦不屬於這份產品的保障範圍。投保前建議逐項確認是否與
          你的情況有關。
        </p>
        <ul className="mt-4 space-y-2.5">
          {product.exclusions.map((e) => (
            <li
              key={e.id}
              className="rounded-lg border border-ink-line bg-white p-3.5"
            >
              <p className="flex items-start gap-2 text-[13.5px] font-semibold text-ink">
                <ShieldAlert
                  size={15}
                  className="mt-0.5 shrink-0 text-amber-600"
                  aria-hidden
                />
                {e.name}
              </p>
              <p className="mt-1.5 pl-[23px] text-[13px] leading-relaxed text-ink-soft">
                {e.description}
              </p>
              <div className="mt-1.5 pl-[23px]">
                <button
                  type="button"
                  onClick={() => showEvidence(`不保：${e.name}`, e.description, e.sourceIds)}
                  className="inline-flex items-center gap-1 rounded border border-ink-line bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-ink-soft transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
                >
                  <Quote size={10} aria-hidden />
                  查看來源
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Terms detail */}
      <section className="mt-10" aria-labelledby="terms-heading">
        <h2
          id="terms-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          條款細項
        </h2>
        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TermCard
            title="自付額"
            value={
              !product.deductible
                ? "資料未提供"
                : product.deductible.hasDeductible
                  ? (product.deductible.value ?? "資料未提供")
                  : "無自付額"
            }
            note={
              product.deductible?.basis
                ? `計算基礎：${product.deductible.basis}`
                : undefined
            }
            sourceIds={product.deductible?.sourceIds ?? []}
            onShowSource={showEvidence}
          />
          <TermCard
            title="等待期"
            value={
              !product.waitingPeriod
                ? "資料未提供"
                : product.waitingPeriod.hasWaitingPeriod
                  ? (product.waitingPeriod.value ?? "資料未提供")
                  : "無等待期"
            }
            note="等待期內發生的疾病或事故不獲保障"
            sourceIds={product.waitingPeriod?.sourceIds ?? []}
            onShowSource={showEvidence}
          />
          <TermCard
            title="續保安排"
            value={product.renewal?.label ?? "資料未提供"}
            note={product.renewal?.description}
            sourceIds={product.renewal?.sourceIds ?? []}
            onShowSource={showEvidence}
          />
          <TermCard
            title="條款版本"
            value={product.termsVersion ?? "資料未提供"}
            note={`最後檢視日期：${product.verification.lastReviewedAt}`}
          />
        </dl>

        {/* eligibility */}
        <div className="mt-4 rounded-xl border border-ink-line bg-white p-4">
          <h3 className="text-[14px] font-semibold text-ink">投保資格</h3>
          <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
            <Row label="最低投保年齡">
              {product.eligibility.minAge != null
                ? `${product.eligibility.minAge} 歲`
                : "資料未提供"}
            </Row>
            <Row label="最高投保年齡">
              {product.eligibility.maxAge != null
                ? `${product.eligibility.maxAge} 歲`
                : "資料未提供"}
            </Row>
            <Row label="居住地要求">
              {product.eligibility.residency ?? "資料未提供"}
            </Row>
            <Row label="健康申報">
              {product.eligibility.healthDeclaration === undefined
                ? "資料未提供"
                : product.eligibility.healthDeclaration
                  ? "需要"
                  : "不需要"}
            </Row>
            <Row label="職業限制">
              {product.eligibility.occupationLimits === undefined
                ? "資料未提供"
                : product.eligibility.occupationLimits
                  ? "有"
                  : "無"}
            </Row>
            <Row label="付款方式">
              {product.paymentOptions?.join("、") ?? "資料未提供"}
            </Row>
          </dl>
          {product.eligibility.notes && product.eligibility.notes.length > 0 && (
            <ul className="mt-3 space-y-1.5 border-t border-ink-line pt-3">
              {product.eligibility.notes.map((n) => (
                <li
                  key={n}
                  className="flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ink-soft"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-line" />
                  {n}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 6. Premium examples */}
      <section className="mt-10" aria-labelledby="premium-heading">
        <h2
          id="premium-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          保費示例
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
          以下是假設情況下的首年保費，用來展示保費如何隨年齡與投保條件變動。
          實際保費以正式報價為準。
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-ink-line bg-white">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink-line bg-paper">
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  情境
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  假設條件
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  首年保費
                </th>
                <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                  資料來源
                </th>
              </tr>
            </thead>
            <tbody>
              {product.premiumExamples.map((e) => (
                <tr
                  key={e.label}
                  className="border-b border-ink-line/70 last:border-b-0"
                >
                  <th className="px-4 py-3.5 text-left text-[13.5px] font-medium text-ink">
                    {e.label}
                  </th>
                  <td className="px-4 py-3.5 text-[13px] leading-relaxed text-ink-soft">
                    {e.assumptions}
                  </td>
                  <td className="px-4 py-3.5 text-[14px] font-semibold tabular-nums text-ink">
                    HK${e.annualPremium.toLocaleString("en-US")}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        showEvidence(
                          `保費示例：${e.label}`,
                          `HK$${e.annualPremium.toLocaleString("en-US")}`,
                          e.sourceIds,
                        )
                      }
                      className="inline-flex items-center gap-1 rounded border border-ink-line bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-ink-soft transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
                    >
                      <Quote size={10} aria-hidden />
                      查看來源
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-ink-mute">
          <Info size={12} className="mt-0.5 shrink-0" aria-hidden />
          保費示例數字屬原型模擬資料，並非任何真實產品的報價，亦不代表任何人的實際
          保費。續保時的保費會按當時年齡與風險重新計算。
        </p>
      </section>

      {/* 7. Sources */}
      <section id="sources" className="mt-10 scroll-mt-24" aria-labelledby="sources-heading">
        <h2
          id="sources-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          資料來源
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
          這個產品頁的每一項數據都應該可以指回一份來源文件。如果沒有列出來源，
          代表該數字目前無法對照文件核對。
        </p>
        <div className="mt-4">
          <DemoDataNotice className="mb-3" />
          <SourceList sources={product.sourceDocuments} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <ReportIssueButton productId={product.id} productName={product.name} />
        </div>
      </section>

      {/* 8. Conversion layer (STEP 17) */}
      <section className="mt-10" aria-labelledby="next-heading">
        <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-5">
          <h2
            id="next-heading"
            className="text-[16px] font-semibold text-brand-900"
          >
            需要更專業的解釋？
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-brand-900/80">
            平台提供的是可比較的資料結構，不能取代持牌專業人士對你個人情況的判斷。
            如果你需要針對健康狀況、財務需要或具體條款的法律解釋，以下是合適的下一步。
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                trackEvent("conversion_click", { productId: product.id, target: "insurer" });
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-800 px-4 text-[13.5px] font-semibold text-white hover:bg-brand-900"
            >
              <Phone size={15} aria-hidden />
              前往保險公司了解更多
              <ExternalLink size={13} aria-hidden />
            </a>
            <Link
              href="/ask"
              onClick={() =>
                trackEvent("conversion_click", { productId: product.id, target: "ask" })
              }
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-4 text-[13.5px] font-semibold text-brand-800 hover:bg-brand-50"
            >
              先問清楚概念
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-brand-900/60">
            Prototype 說明：此按鈕為示範用途，不會連到任何真實保險公司，亦不會收集
            你的個人資料或健康資訊。平台不從保險公司售賣產品賺取佣金。
          </p>
        </div>
      </section>

      {/* 9. Related */}
      {relatedTerms.length > 0 && (
        <div className="mt-10">
          <RelatedTerms terms={relatedTerms} />
        </div>
      )}

      {relatedArticles.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[18px] font-semibold tracking-tight text-ink">
            相關知識
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/learn/${a.slug}`}
                className="group rounded-lg border border-ink-line bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40"
              >
                <span className="text-[11.5px] font-medium text-brand-700">
                  {a.category}
                </span>
                <span className="mt-1 block text-[14px] font-medium leading-snug text-ink group-hover:text-brand-700">
                  {a.title}
                </span>
                <span className="mt-1.5 block text-[12px] text-ink-mute">
                  閱讀 {a.readingMinutes} 分鐘
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedQuestions.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[18px] font-semibold tracking-tight text-ink">
            相關問題
          </h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">
            這些問題由關係引擎根據這款產品的保障與條款連結出來。
          </p>
          <ul className="mt-3 space-y-2">
            {relatedQuestions.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/ask?q=${encodeURIComponent(q.question)}`}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-ink-line bg-white px-4 py-3 hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <span className="text-[13.5px] leading-relaxed text-ink group-hover:text-brand-700">
                    {q.question}
                  </span>
                  <ArrowRight
                    size={15}
                    className="shrink-0 text-ink-mute group-hover:text-brand-700"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[18px] font-semibold tracking-tight text-ink">
            同類別的其他產品
          </h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">
            這是同類別產品的並列，不是推薦名單。選擇仍需按你的具體情況判斷。
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group rounded-lg border border-ink-line bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40"
              >
                <span className="text-[11.5px] font-medium text-brand-700">
                  {CATEGORY_LABELS[p.category]}
                </span>
                <span className="mt-1 block text-[14px] font-medium leading-snug text-ink group-hover:text-brand-700">
                  {p.name}
                </span>
                <span className="mt-1 block text-[12px] text-ink-mute">{p.tagline}</span>
                {p.premiumMin != null && (
                  <span className="mt-1.5 block text-[12px] font-medium text-ink-soft">
                    保費示例 HK${p.premiumMin.toLocaleString("en-US")} 起
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Source Drawer：任何欄位的「查看來源」都打開這個面板 */}
      <SourceDrawer
        open={drawerState !== null}
        onClose={closeDrawer}
        evidence={drawerState?.evidence}
        product={drawerState?.product ?? product}
        sources={drawerState?.sources}
        factLabel={drawerState?.factLabel}
        factValue={drawerState?.factValue}
        title={drawerState?.title ?? "查看來源"}
      />
    </div>
  );
}

function TermCard({
  title,
  value,
  note,
  sourceIds = [],
  onShowSource,
}: {
  title: string;
  value: string;
  note?: string;
  sourceIds?: string[];
  onShowSource?: (title: string, value: string, sourceIds: string[]) => void;
}) {
  return (
    <div className="rounded-xl border border-ink-line bg-white p-4">
      <dt className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-mute">
        <Table2 size={13} aria-hidden />
        {title}
      </dt>
      <dd className="mt-1.5 flex flex-wrap items-center gap-2 text-[14.5px] font-semibold text-ink">
        {value}
        {onShowSource && (
          <button
            type="button"
            onClick={() => onShowSource(title, value, sourceIds)}
            className="inline-flex items-center gap-1 rounded border border-ink-line bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-ink-soft transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
          >
            <Quote size={10} aria-hidden />
            查看來源
          </button>
        )}
      </dd>
      {note && (
        <dd className="mt-1 text-[12.5px] leading-relaxed text-ink-mute">{note}</dd>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-ink-line/60 pb-2 last:border-b-0">
      <dt className="text-[12.5px] text-ink-mute">{label}</dt>
      <dd className="text-right text-[13px] font-medium text-ink">{children}</dd>
    </div>
  );
}

function hubFor(category: string): string {
  switch (category) {
    case "medical":
      return "/medical-insurance";
    case "critical-illness":
      return "/critical-illness-insurance";
    case "life":
      return "/life-insurance";
    case "travel":
      return "/travel-insurance";
    default:
      return "/products";
  }
}
