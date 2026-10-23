import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Hash,
  Building2,
  Tag,
  AlertTriangle,
  Check,
  Minus,
  FileText,
  Clock,
  RefreshCw,
  Coins,
} from "lucide-react";
import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { CompareButton } from "@/components/compare-button";
import { ProductCard, DemoBadge } from "@/components/product-card";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = products.find((x) => x.id === id);
  if (!p) return { title: "找不到產品" };
  return {
    title: `${p.name}（${p.insurer}）`,
    description: `${p.coverageSummary} 模擬保費 HK$${p.simulatedPremium.toLocaleString("en-US")}，保障上限 ${p.coverageLimitLabel}。Prototype 模擬資料。`,
    alternates: { canonical: `/products/${p.id}` },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const sameCategory = products.filter((p) => p.category === product.category && p.id !== product.id);
  const relatedArticles = articles.filter((a) =>
    a.relatedProductIds.includes(product.id)
  );

  return (
    <div className="container-page py-8">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/products" className="hover:text-brand-700">
          保險產品
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-700">
          {product.category}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {/* C1 基本資訊 */}
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <DemoBadge />
              <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                {product.category}
              </span>
            </div>
            <h1 className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[30px]">
              {product.name}
            </h1>
            <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
              {product.coverageSummary}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <CompareButton product={product} variant="solid" />
              <Link
                href="/compare"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 text-[13px] font-medium text-ink-soft hover:bg-paper"
              >
                前往比較頁面
                <ArrowRight size={14} />
              </Link>
            </div>

            <dl className="mt-5 grid gap-x-6 gap-y-3 rounded-xl border border-ink-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetaItem icon={Building2} label="保險公司" value={product.insurer} note="示例品牌" />
              <MetaItem icon={Tag} label="保險種類" value={product.category} />
              <MetaItem icon={Hash} label="模擬產品編號" value={`IC-${product.id.toUpperCase()}`} />
              <MetaItem icon={CalendarDays} label="資料更新日期" value={product.updatedAt} />
            </dl>
          </header>

          {/* C2 保障內容 */}
          <section className="mt-10">
            <h2 className="text-[19px] font-semibold tracking-tight text-ink">保障內容</h2>
            <p className="mt-1.5 text-[13px] text-ink-soft">
              表格列出各保障項目、模擬保障上限及主要限制。正式上線時此表會標示資料來源與核實狀態。
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-ink-line bg-white">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink-line bg-paper">
                    <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">保障項目</th>
                    <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">保障說明</th>
                    <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">模擬保障上限</th>
                    <th className="px-4 py-3 text-[12.5px] font-semibold text-ink">主要限制</th>
                  </tr>
                </thead>
                <tbody>
                  {product.coverageItems.map((c) => (
                    <tr key={c.name} className="border-b border-ink-line/70 last:border-b-0 align-top">
                      <td className="px-4 py-3.5 text-[13.5px] font-medium text-ink">{c.name}</td>
                      <td className="px-4 py-3.5 text-[13px] leading-relaxed text-ink-soft">
                        {c.description}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] font-medium tabular-nums text-ink-soft">
                        {c.simulatedLimit}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] leading-relaxed text-ink-mute">
                        {c.keyLimit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* C3 條款重點 */}
          <section className="mt-10">
            <h2 className="text-[19px] font-semibold tracking-tight text-ink">了解這份保單</h2>
            <p className="mt-1.5 text-[13px] text-ink-soft">
              以下為模擬條款重點，示範平台會如何整理一份保單嘅保障範圍、限制同注意事項。
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TermCard icon={FileText} title="保障範圍">
                <ul className="space-y-1.5">
                  {product.termPoints.coverageScope.map((t) => (
                    <li key={t} className="flex items-start gap-1.5 text-[13px] text-ink-soft">
                      <Check size={14} className="mt-0.5 shrink-0 text-accent-600" />
                      {t}
                    </li>
                  ))}
                </ul>
              </TermCard>

              <TermCard icon={AlertTriangle} title="除外責任">
                <ul className="space-y-1.5">
                  {product.termPoints.exclusions.map((t) => (
                    <li key={t} className="flex items-start gap-1.5 text-[13px] text-ink-soft">
                      <Minus size={14} className="mt-0.5 shrink-0 text-amber-600" />
                      {t}
                    </li>
                  ))}
                </ul>
              </TermCard>

              <TermCard icon={Clock} title="等候期">
                <p className="text-[13px] text-ink-soft">{product.termPoints.waitingPeriod}</p>
              </TermCard>

              <TermCard icon={Coins} title="自付額">
                <p className="text-[13px] text-ink-soft">{product.termPoints.deductible}</p>
              </TermCard>

              <TermCard icon={RefreshCw} title="續保條件" className="sm:col-span-2">
                <p className="text-[13px] text-ink-soft">{product.termPoints.renewal}</p>
              </TermCard>

              <TermCard icon={AlertTriangle} title="需要進一步確認的事項" className="sm:col-span-2">
                <ul className="space-y-1.5">
                  {product.termPoints.needToConfirm.map((t) => (
                    <li key={t} className="flex items-start gap-1.5 text-[13px] text-ink-soft">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                      {t}
                    </li>
                  ))}
                </ul>
              </TermCard>
            </div>
          </section>

          {/* C4 保費示例 */}
          <section className="mt-10">
            <h2 className="text-[19px] font-semibold tracking-tight text-ink">模擬保費示例</h2>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
                <div>
                  <p className="text-[12px] text-amber-900/80">年保費（虛構示例）</p>
                  <p className="text-[30px] font-bold tabular-nums tracking-tight text-ink">
                    HK${product.simulatedPremium.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="pb-1">
                  <p className="text-[12px] text-amber-900/80">保障上限</p>
                  <p className="text-[15px] font-semibold text-ink">{product.coverageLimitLabel}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5">
                {[
                  "保費為虛構示例，並非保險公司正式報價。",
                  "不代表任何人都能以該價格投保。",
                  "實際保費可能因年齡、健康狀況、保障選擇及其他因素不同。",
                  "本平台不提供真實報價功能，亦不設投保流程。",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-1.5 text-[12.5px] text-amber-900/90">
                    <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 相關文章 */}
          {relatedArticles.length > 0 && (
            <section className="mt-10">
              <h2 className="text-[19px] font-semibold tracking-tight text-ink">相關知識文章</h2>
              <ul className="mt-3 space-y-2">
                {relatedArticles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/learn/${a.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-ink-line bg-white px-4 py-3 hover:border-brand-300 hover:bg-brand-50/40"
                    >
                      <span className="min-w-0">
                        <span className="block text-[14px] font-medium text-ink group-hover:text-brand-700">
                          {a.title}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-ink-mute">
                          {a.category} · 閱讀 {a.readingMinutes} 分鐘
                        </span>
                      </span>
                      <ArrowRight size={15} className="shrink-0 text-ink-mute group-hover:text-brand-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 同類產品 */}
          {sameCategory.length > 0 && (
            <section className="mt-10">
              <h2 className="text-[19px] font-semibold tracking-tight text-ink">
                其他{product.category}模擬產品
              </h2>
              <p className="mt-1.5 text-[13px] text-ink-soft">
                可以直接加入比較清單，對照保障上限同條款差異。
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {sameCategory.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-ink-line bg-white p-5 shadow-card">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-mute">
              比較呢個產品
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              加入比較清單後，可以同其他產品並排對照保障上限、自付額、等候期同續保條件。最多比較 3 個。
            </p>
            <div className="mt-4">
              <CompareButton product={product} variant="solid" />
            </div>
            <Link
              href="/compare"
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-brand-700 hover:underline"
            >
              前往比較頁面
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-4 rounded-xl border border-ink-line bg-white p-5">
            <h2 className="text-[13px] font-semibold text-ink">快速資料</h2>
            <dl className="mt-3 space-y-2.5 text-[13px]">
              {[
                ["保險公司", product.insurer],
                ["保險種類", product.category],
                ["模擬保費", `HK$${product.simulatedPremium.toLocaleString("en-US")}`],
                ["保障上限", product.coverageLimitLabel],
                ["自付額", product.deductible],
                ["等候期", product.waitingPeriod],
                ["續保條件", product.renewalTerms],
                ["更新日期", product.updatedAt],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 border-b border-ink-line/60 pb-2.5 last:border-b-0 last:pb-0">
                  <dt className="text-[11.5px] text-ink-mute">{k}</dt>
                  <dd className="text-ink-soft">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-4 rounded-xl border border-ink-line bg-paper p-5">
            <h2 className="text-[13px] font-semibold text-ink">資料透明說明</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
              {product.insurer} 係 Prototype 虛構品牌，本頁所有數據為示範用途。正式上線時，每項資料都會標示來源、核實狀態同更新日期。
            </p>
            <Link
              href="/transparency"
              className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-700 hover:underline"
            >
              了解資料整理方式
              <ArrowRight size={13} />
            </Link>
          </div>
        </aside>
      </div>

      <p className="mt-12 rounded-lg border border-ink-line bg-white p-4 text-[12px] leading-relaxed text-ink-mute">
        {site.prototypeNotice}
      </p>
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Tag;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[11.5px] text-ink-mute">
        <Icon size={12} /> {label}
      </dt>
      <dd className="mt-1 text-[13.5px] font-medium text-ink">
        {value}
        {note && <span className="ml-1.5 text-[11px] font-normal text-ink-mute">{note}</span>}
      </dd>
    </div>
  );
}

function TermCard({
  icon: Icon,
  title,
  children,
  className = "",
}: {
  icon: typeof Tag;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-ink-line bg-white p-4 ${className}`}>
      <h3 className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
        <Icon size={14} className="text-brand-600" />
        {title}
      </h3>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}
