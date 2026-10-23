import Link from "next/link";
import {
  Wallet,
  CalendarClock,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  FileCheck2,
  HelpCircle,
} from "lucide-react";
import type { InsuranceProduct } from "@/data/types";
import { getInsurer } from "@/data/insurers";
import { CATEGORY_LABELS } from "@/data/types";

// ============================================================
// 產品智能摘要 (Product Intelligence Summary)
// ============================================================
// STEP 4：產品頁最上方不是「廣告文案」，而是一段結構化的
// 快速判斷：這份產品的保障核心是甚麼、要留意甚麼、
// 適合哪類人、資料可信度如何。
//
// 這裡的措辭規則（平台八原則之延伸）：
//   ✅ 描述結構差異（「等待期較長」）
//   ❌ 不做價值判斷（「較差」「不足」「不適合你」）
// ============================================================

function ageRange(p: InsuranceProduct): string {
  const { minAge, maxAge } = p.eligibility;
  if (minAge != null && maxAge != null) return `${minAge}–${maxAge} 歲`;
  if (minAge != null) return `${minAge} 歲起`;
  if (maxAge != null) return `至 ${maxAge} 歲`;
  return "未列明";
}

function premiumRange(p: InsuranceProduct): string {
  if (!p.premiumExamples.length) return "資料未提供";
  const vals = p.premiumExamples.map((e) => e.annualPremium);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  return min === max
    ? `HK$${min.toLocaleString()}／年`
    : `HK$${min.toLocaleString()} – ${max.toLocaleString()}／年`;
}

export function ProductIntelligenceSummary({
  product,
  className = "",
}: {
  product: InsuranceProduct;
  className?: string;
}) {
  const insurer = getInsurer(product.insurerId);
  const catLabel = CATEGORY_LABELS[product.category];

  // 重點保障（最多 3 項）
  const highlights = product.coverage.filter((c) => c.highlight).slice(0, 3);
  const otherCount = product.coverage.length - highlights.length;

  // 需要留意的點（最多 3 項）
  const cautions: { icon: typeof AlertTriangle; text: string }[] = [];
  if (product.waitingPeriod?.hasWaitingPeriod) {
    cautions.push({
      icon: CalendarClock,
      text: `等待期：${product.waitingPeriod.value}`,
    });
  }
  if (product.deductible?.hasDeductible) {
    cautions.push({
      icon: Wallet,
      text: `自付額：${product.deductible.value}${
        product.deductible.basis ? `（${product.deductible.basis}）` : ""
      }`,
    });
  }
  if (product.renewal) {
    cautions.push({
      icon: RefreshCw,
      text: `續保：${product.renewal.label}`,
    });
  }
  if (product.exclusions.length) {
    cautions.push({
      icon: AlertTriangle,
      text: `列明不保事項 ${product.exclusions.length} 項，投保前建議逐項閱讀`,
    });
  }

  return (
    <section
      className={`rounded-xl border border-ink-line bg-white p-5 shadow-card ${className}`}
      aria-labelledby="intelligence-summary-heading"
    >
      <h2
        id="intelligence-summary-heading"
        className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700"
      >
        快速判斷
      </h2>
      <p className="text-[15px] leading-relaxed text-ink">
        {product.tagline}。
        <span className="text-ink-soft">
          {" "}
          這是一份
          {catLabel}，由{insurer?.name ?? "保險公司"}提供，
          可投保年齡{ageRange(product)}。
        </span>
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* 保障核心 */}
        <div className="rounded-lg bg-paper p-3.5">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
            <FileCheck2 size={13} className="text-brand-600" aria-hidden />
            保障核心
          </p>
          <ul className="mt-2 space-y-1.5">
            {highlights.map((c) => (
              <li key={c.id} className="text-[12.5px] leading-snug text-ink-soft">
                <span className="font-medium text-ink">{c.name}</span>
                {c.limit && (
                  <span className="mt-0.5 block text-[11.5px] text-ink-mute">
                    {c.limit}
                  </span>
                )}
              </li>
            ))}
            {otherCount > 0 && (
              <li className="text-[12px] text-ink-mute">
                另有 {otherCount} 項保障，詳見下方保障一覽
              </li>
            )}
          </ul>
        </div>

        {/* 需要留意 */}
        <div className="rounded-lg bg-paper p-3.5">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
            <AlertTriangle size={13} className="text-amber-600" aria-hidden />
            需要留意
          </p>
          <ul className="mt-2 space-y-1.5">
            {cautions.length ? (
              cautions.map((c) => (
                <li
                  key={c.text}
                  className="flex items-start gap-1.5 text-[12.5px] leading-snug text-ink-soft"
                >
                  <c.icon
                    size={12}
                    className="mt-0.5 shrink-0 text-ink-mute"
                    aria-hidden
                  />
                  {c.text}
                </li>
              ))
            ) : (
              <li className="text-[12.5px] text-ink-mute">
                此產品的結構限制相對較少。
              </li>
            )}
          </ul>
        </div>

        {/* 數字與資料 */}
        <div className="rounded-lg bg-paper p-3.5">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
            <Wallet size={13} className="text-brand-600" aria-hidden />
            數字與資料
          </p>
          <dl className="mt-2 space-y-1.5">
            <div>
              <dt className="text-[11.5px] text-ink-mute">保費示例</dt>
              <dd className="text-[12.5px] font-medium text-ink">
                {premiumRange(product)}
              </dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-ink-mute">條款版本</dt>
              <dd className="text-[12.5px] font-medium text-ink">
                {product.termsVersion ?? "資料未提供"}
              </dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-ink-mute">最後檢視</dt>
              <dd className="text-[12.5px] font-medium text-ink">
                {product.verification.lastReviewedAt}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 適用情境說明 — 用「結構適合」而非「適合你」 */}
      <div className="mt-4 rounded-lg border border-brand-100 bg-brand-50/60 p-3.5">
        <p className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-900">
          <UserCheck size={13} aria-hidden />
          這份產品的結構適合以下情況
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {buildFitNotes(product).map((n) => (
            <li
              key={n}
              className="flex items-start gap-1.5 text-[12.5px] leading-snug text-brand-900/85"
            >
              <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              {n}
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-[11.5px] leading-relaxed text-brand-900/60">
          這是對產品結構的描述，不是對你個人的建議。要判斷是否適合你的實際
          情況，需要考慮你的健康狀況、就醫習慣、收入與家庭責任。
        </p>
      </div>
    </section>
  );
}

/** 根據產品結構特徵，生成「結構適合」描述 */
function buildFitNotes(p: InsuranceProduct): string[] {
  const notes: string[] = [];

  if (p.eligibility.minAge === 0 && p.eligibility.maxAge && p.eligibility.maxAge >= 65) {
    notes.push("投保年齡範圍廣，可涵蓋兒童至長者");
  }
  if (p.deductible?.hasDeductible && p.deductible.basis?.includes("每年")) {
    notes.push("自付額按年度計算，全年就醫次數多的情況下較可控");
  }
  if (p.deductible?.hasDeductible && p.deductible.basis?.includes("每次")) {
    notes.push("自付額按每次計算，入院次數少的話成本較低");
  }
  if (p.renewal?.type === "guaranteed_renewal") {
    notes.push(
      `保證續保${p.renewal.years ? ` ${p.renewal.years} 年` : ""}，期內不會因健康狀況被拒絕續保`,
    );
  }
  if (p.renewal?.type === "guaranteed_renewal_period") {
    notes.push("續保年期較長，長期成本較可預測");
  }
  if (p.renewal?.type === "non_guaranteed") {
    notes.push("不保證續保，續保時保費及承保條件可能改變，需預留彈性");
  }
  if (p.coverage.some((c) => c.name.includes("門診") && c.limit?.includes("每年"))) {
    notes.push("門診保障額度較高，適合全年就醫次數較多");
  }
  if (p.coverage.some((c) => c.category === "critical" && c.name.includes("早期"))) {
    notes.push("涵蓋早期病變，適合重視早期發現的情況");
  }
  if (p.coverage.some((c) => c.category === "critical" && c.name.includes("多次"))) {
    notes.push("支援多次賠付，適合關注復發風險的情況");
  }
  if (p.coverage.some((c) => c.category === "other" && c.name.includes("保證現金值"))) {
    notes.push("含保證現金值部分，兼顧保障與傳承需要");
  }
  if (p.eligibility.healthDeclaration === false) {
    notes.push("無需健康申報，投保流程較簡單");
  }
  if (p.sourceDocuments.length >= 2) {
    notes.push("已登記多份來源文件，數據可對照條款核對");
  }
  if (p.verification.status === "unverified") {
    notes.push("目前尚未加入可核實來源，數字不宜直接依賴");
  }

  if (!notes.length) {
    notes.push("屬一般保障型產品，具體組合視乎個人需要而定");
  }

  return notes.slice(0, 4);
}

/** 條款重點（含「這是什麼？」展開說明） */
export function TermPointsExplainer({
  points,
}: {
  points: { title: string; detail: string }[];
}) {
  return (
    <div className="space-y-2.5">
      {points.map((pt) => (
        <details
          key={pt.title}
          className="group rounded-lg border border-ink-line bg-white"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
            <span className="text-[13.5px] font-semibold text-ink">
              {pt.title}
            </span>
            <HelpCircle
              size={15}
              className="shrink-0 text-ink-mute transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="border-t border-ink-line px-4 py-3 text-[13px] leading-relaxed text-ink-soft">
            {pt.detail}
          </p>
        </details>
      ))}
    </div>
  );
}

/** 相關術語（用於產品頁 SEO 內鏈） */
export function RelatedTerms({
  terms,
}: {
  terms: { slug: string; zh: string; term: string }[];
}) {
  if (!terms.length) return null;
  return (
    <div>
      <h3 className="mb-2 text-[13px] font-semibold text-ink">相關保險術語</h3>
      <div className="flex flex-wrap gap-1.5">
        {terms.map((t) => (
          <Link
            key={t.slug}
            href={`/dictionary/${t.slug}`}
            className="rounded-full border border-ink-line bg-white px-2.5 py-1 text-[12px] text-ink-soft transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            {t.zh}
            <span className="ml-1 text-ink-mute">{t.term}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
