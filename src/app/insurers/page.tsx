import type { Metadata } from "next";
import Link from "next/link";
import { insurers } from "@/data/insurers";
import { getProductsByInsurer } from "@/data/products";
import { CATEGORY_LABELS } from "@/data/types";
import {
  pageMetadata,
  breadcrumbJsonLd,
  jsonLdScript,
} from "@/lib/structured-data";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, Building2, Globe } from "lucide-react";

// ============================================================
// 保險公司列表頁 (/insurers)
// ============================================================

export const metadata: Metadata = pageMetadata({
  title: "保險公司列表｜香港保險資料庫",
  description:
    "查看平台資料庫內的保險公司及其產品線。每間公司以獨立實體記錄，包含專注範圍、產品數量及資料完整度資訊。",
  path: "/insurers",
});

export default function InsurersPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "首頁", href: "/" },
    { name: "保險公司", href: "/insurers" },
  ]);

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd) }}
      />

      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">保險公司</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
          保險公司
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
          保險公司在平台上是獨立的一級資料實體，不只是產品頁上的一個標籤。
          這讓你可以先看一家公司的產品線結構與保險公司取向，再進入個別產品。
          以下全部為原型虛構公司。
        </p>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {insurers.map((ins) => {
          const ps = getProductsByInsurer(ins.id);
          const cats = Array.from(new Set(ps.map((p) => p.category)));
          return (
            <article
              key={ins.id}
              className="flex flex-col rounded-xl border border-ink-line bg-white p-5 shadow-card"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Building2 size={18} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[16px] font-semibold leading-snug text-ink">
                    <Link href={`/insurers/${ins.slug}`} className="hover:text-brand-700">
                      {ins.name}
                    </Link>
                  </h2>
                  <p className="text-[12px] text-ink-mute">{ins.nameEn}</p>
                </div>
                <span className="shrink-0 rounded-md bg-paper px-2 py-1 text-[11.5px] font-medium text-ink-soft">
                  {ps.length} 款產品
                </span>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
                {ins.description}
              </p>

              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {cats.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-ink-line bg-paper px-2.5 py-0.5 text-[11.5px] text-ink-soft"
                  >
                    {CATEGORY_LABELS[c]}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-ink-line pt-3.5">
                <span className="text-[11.5px] text-ink-mute">
                  專注：{ins.focus.join(" · ")}
                </span>
                <Link
                  href={`/insurers/${ins.slug}`}
                  className="inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-700 hover:underline"
                >
                  查看詳情
                  <ArrowRight size={13} aria-hidden />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl border border-ink-line bg-paper p-5">
        <h2 className="text-[15px] font-semibold text-ink">
          為甚麼把保險公司獨立列出來？
        </h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
          同一類別的產品，續保政策、理賠風格與核保取向往往在同一間公司內保持一致。
          比較產品的時候，知道它屬於哪一間公司、該公司的產品線如何定位，
          往往比單看一個保費數字更有參考價值。
        </p>
        <p className="mt-2.5 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ink-mute">
          <Globe size={13} className="mt-0.5 shrink-0" aria-hidden />
          正式環境下，這個頁面會連接監管機構的公開登記資料，
          讓你核對保險公司的註冊狀態與實際持有的牌照類別。
        </p>
      </div>
    </div>
  );
}
