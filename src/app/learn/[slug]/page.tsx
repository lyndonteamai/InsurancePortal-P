import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  BookOpen,
  AlertTriangle,
  Check,
  Scale,
  ChevronLeft,
} from "lucide-react";
import { articles } from "@/data/articles";
import { products } from "@/data/products";
import { CompareButton } from "@/components/compare-button";
import { ProductCard } from "@/components/product-card";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return { title: "找不到文章" };
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/learn/${a.slug}` },
    openGraph: { title: a.title, description: a.excerpt, type: "article" },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articles.filter(
    (a) => article.relatedSlugs.includes(a.slug) && a.slug !== article.slug
  );
  const relatedProducts = products.filter((p) => article.relatedProductIds.includes(p.id));

  return (
    <article className="container-page py-8">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/learn" className="hover:text-brand-700">
          保險知識
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{article.title}</span>
      </nav>

      <div className="mx-auto mt-6 max-w-3xl">
        <header>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2 py-0.5 text-[11.5px] font-medium text-brand-700">
            <BookOpen size={12} />
            {article.category}
          </span>
          <h1 className="mt-3.5 text-[28px] font-bold leading-[1.3] tracking-tight text-ink sm:text-[33px]">
            {article.title}
          </h1>
          <p className="mt-3.5 text-[15.5px] leading-relaxed text-ink-soft">{article.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-ink-line py-3 text-[12.5px] text-ink-mute">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} /> 更新日期：{article.updatedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} /> 閱讀時間：約 {article.readingMinutes} 分鐘
            </span>
            <span className="inline-flex items-center gap-1.5">
              <AlertTriangle size={13} /> Prototype 教學示例
            </span>
          </div>
        </header>

        <div className="mt-6 rounded-lg border border-ink-line bg-white p-4">
          <p className="text-[13.5px] leading-relaxed text-ink-soft">{article.intro}</p>
        </div>

        <div className="prose-ic mt-4">
          {article.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* 重要資訊摘要 */}
        <section className="mt-10 rounded-xl border border-accent-200 bg-accent-50/60 p-5">
          <h2 className="text-[16px] font-semibold text-ink">重要資訊摘要</h2>
          <ul className="mt-3 space-y-2">
            {article.keyTakeaways.map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-soft">
                <Check size={15} className="mt-0.5 shrink-0 text-accent-600" />
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* 相關文章 */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[18px] font-semibold tracking-tight text-ink">相關文章</h2>
            <ul className="mt-3 space-y-2">
              {related.map((a) => (
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
      </div>

      {/* 相關產品比較 */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto mt-12 max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-semibold tracking-tight text-ink">相關產品比較</h2>
              <p className="mt-1.5 text-[13.5px] text-ink-soft">
                以下模擬產品同本文概念有關。可以加入比較清單，直接對照條款差異。
              </p>
            </div>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-brand-700 hover:underline"
            >
              <Scale size={15} />
              前往比較頁面
            </Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 免責說明 */}
      <section className="mx-auto mt-12 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="flex items-center gap-2 text-[14px] font-semibold text-amber-900">
          <AlertTriangle size={15} />
          免責說明
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-amber-900/90">{article.disclaimer}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-amber-900/90">
          本平台唔會收集你的健康資料，亦唔設任何投保或報價流程。正式上線前，所有內容都需要法律及監管審核。
        </p>
      </section>

      <div className="mx-auto mt-8 max-w-3xl">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-brand-700 hover:underline"
        >
          <ChevronLeft size={15} />
          返回保險知識中心
        </Link>
      </div>
    </article>
  );
}
