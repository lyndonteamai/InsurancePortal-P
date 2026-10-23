import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InsuranceProduct } from "@/data/types";
import { CompareButton } from "./compare-button";

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800 ${className}`}
    >
      Prototype 模擬資料
    </span>
  );
}

export function ProductCard({ product }: { product: InsuranceProduct }) {
  return (
    <article className="flex flex-col rounded-xl border border-ink-line bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-ink-mute">{product.insurer}</p>
          <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">
            <Link href={`/products/${product.id}`} className="hover:text-brand-700">
              {product.name}
            </Link>
          </h3>
        </div>
        <span className="shrink-0 rounded-md bg-brand-50 px-2 py-1 text-[11px] font-medium text-brand-700">
          {product.category}
        </span>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">{product.coverageSummary}</p>

      <ul className="mt-3 space-y-1.5">
        {product.keyFeatures.map((f) => (
          <li key={f} className="flex items-start gap-1.5 text-[12.5px] text-ink-soft">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-end justify-between border-t border-ink-line pt-4">
        <div>
          <p className="text-[11px] text-ink-mute">模擬保費（年）</p>
          <p className="text-[17px] font-semibold tabular-nums text-ink">
            HK${product.simulatedPremium.toLocaleString("en-US")}
          </p>
        </div>
        <p className="text-right text-[11px] text-ink-mute">
          保障上限
          <br />
          <span className="font-medium text-ink-soft">{product.coverageLimitLabel}</span>
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/products/${product.id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-800 text-[13px] font-semibold text-white hover:bg-brand-900 transition-colors"
        >
          查看詳情
          <ArrowRight size={14} />
        </Link>
        <CompareButton product={product} />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-ink-mute">
        Prototype 模擬資料，並非真實產品報價或保障承諾。
      </p>
    </article>
  );
}
