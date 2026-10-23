import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InsuranceProduct } from "@/data/types";
import { CATEGORY_LABELS } from "@/data/types";
import { getInsurer } from "@/data/insurers";
import { CompareButton } from "./compare-button";
import { VerificationBadge } from "./verification-badge";

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800 ${className}`}
    >
      Prototype 模擬資料
    </span>
  );
}

export function ProductCard({
  product,
  showVerification = true,
}: {
  product: InsuranceProduct;
  showVerification?: boolean;
}) {
  const insurer = getInsurer(product.insurerId);
  const catLabel = CATEGORY_LABELS[product.category];

  const premiums = product.premiumExamples.map((e) => e.annualPremium);
  const minPremium = premiums.length ? Math.min(...premiums) : null;
  const maxPremium = premiums.length ? Math.max(...premiums) : null;

  const highlights = product.coverage.filter((c) => c.highlight).slice(0, 3);

  return (
    <article className="flex flex-col rounded-xl border border-ink-line bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-ink-mute">
            {insurer?.name ?? "保險公司"}
          </p>
          <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">
            <Link href={`/products/${product.slug}`} className="hover:text-brand-700">
              {product.name}
            </Link>
          </h3>
        </div>
        <span className="shrink-0 rounded-md bg-brand-50 px-2 py-1 text-[11px] font-medium text-brand-700">
          {catLabel}
        </span>
      </div>

      <p className="mt-2.5 text-[13px] leading-relaxed text-ink-soft">
        {product.tagline}
      </p>

      {showVerification && (
        <div className="mt-3">
          <VerificationBadge
            status={product.verification.status}
            lastReviewedAt={product.verification.lastReviewedAt}
            unverifiedFields={product.verification.unverifiedFields}
            size="sm"
          />
        </div>
      )}

      <ul className="mt-3.5 space-y-1.5">
        {highlights.map((c) => (
          <li
            key={c.id}
            className="flex items-start gap-1.5 text-[12.5px] leading-snug text-ink-soft"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
            <span>
              <span className="font-medium text-ink">{c.name}</span>
              {c.limit && <span className="text-ink-mute"> · {c.limit}</span>}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-1.5 border-t border-ink-line pt-4 text-[12px]">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-mute">保費示例（年）</dt>
          <dd className="font-semibold tabular-nums text-ink">
            {minPremium == null ? (
              "資料未提供"
            ) : minPremium === maxPremium ? (
              `HK$${minPremium.toLocaleString("en-US")}`
            ) : (
              `HK$${minPremium!.toLocaleString("en-US")} – ${maxPremium!.toLocaleString("en-US")}`
            )}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-mute">自付額</dt>
          <dd className="text-right font-medium text-ink-soft">
            {!product.deductible
              ? "資料未提供"
              : product.deductible.hasDeductible
                ? (product.deductible.value ?? "資料未提供")
                : "無"}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-mute">續保</dt>
          <dd className="text-right font-medium text-ink-soft">
            {product.renewal?.label ?? "資料未提供"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-800 text-[13px] font-semibold text-white hover:bg-brand-900 transition-colors"
        >
          查看詳情
          <ArrowRight size={14} aria-hidden />
        </Link>
        <CompareButton product={product} />
      </div>
    </article>
  );
}
