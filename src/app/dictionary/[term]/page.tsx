import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dictionary, getTerm } from "@/data/dictionary";
import { getProduct } from "@/data/products";
import { articles } from "@/data/articles";
import {
  pageMetadata,
  definedTermJsonLd,
  breadcrumbJsonLd,
  jsonLdScript,
} from "@/lib/structured-data";
import { Lightbulb, XCircle, ListChecks, ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return dictionary.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) return {};
  return pageMetadata({
    title: `${t.zh}（${t.term}）是甚麼｜保險術語解釋與比較重點`,
    description: t.quickAnswer,
    path: `/dictionary/${t.slug}`,
    updatedAt: t.updatedAt,
    type: "article",
  });
}

export default async function TermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) notFound();

  const relatedTerms = t.relatedTerms
    .map((name) => dictionary.find((x) => x.term === name || x.zh === name))
    .filter(Boolean)
    .slice(0, 6);

  const relatedProducts = t.relatedProductIds
    .map((id) => getProduct(id))
    .filter(Boolean)
    .slice(0, 3);

  const relatedArticles = t.relatedArticleSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean)
    .slice(0, 3);

  const definedTermLd = definedTermJsonLd({
    term: t.term,
    description: t.quickAnswer,
    slug: t.slug,
    inDefinedTermSet: "保險指南保險術語字典",
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "首頁", href: "/" },
    { name: "保險術語", href: "/dictionary" },
    { name: t.zh, href: `/dictionary/${t.slug}` },
  ]);

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(definedTermLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd) }}
      />

      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/dictionary" className="hover:text-brand-700">
          保險術語
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{t.zh}</span>
      </nav>

      <article className="mt-3">
        <header>
          <p className="text-[13px] font-medium text-brand-700">{t.term}</p>
          <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">
            {t.zh}
          </h1>
          <p className="mt-1.5 text-[12.5px] text-ink-mute">
            最後更新：{t.updatedAt}
          </p>
        </header>

        {/* Quick answer (GEO) */}
        <div className="mt-5 rounded-xl border-l-4 border-brand-700 bg-brand-50/70 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">
            一句話答案
          </p>
          <p className="mt-2 text-[15.5px] leading-relaxed text-ink">
            {t.quickAnswer}
          </p>
        </div>

        {/* Explanation */}
        <section className="mt-8">
          <h2 className="text-[19px] font-semibold tracking-tight text-ink">
            詳細解釋
          </h2>
          <p className="prose-ic mt-3">{t.explanation}</p>
        </section>

        {/* Example */}
        <section className="mt-8">
          <h2 className="text-[19px] font-semibold tracking-tight text-ink">舉例</h2>
          <div className="mt-3 rounded-xl border border-ink-line bg-white p-4">
            <p className="text-[13.5px] leading-relaxed text-ink-soft">{t.example}</p>
          </div>
        </section>

        {/* Why it matters */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-[19px] font-semibold tracking-tight text-ink">
            <Lightbulb size={18} className="text-accent-600" aria-hidden />
            為甚麼重要
          </h2>
          <div className="mt-3 rounded-xl border border-accent-100 bg-accent-50/60 p-4">
            <p className="text-[13.5px] leading-relaxed text-ink-soft">
              {t.whyItMatters}
            </p>
          </div>
        </section>

        {/* How to compare */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-[19px] font-semibold tracking-tight text-ink">
            <ListChecks size={18} className="text-brand-600" aria-hidden />
            比較產品時要看的重點
          </h2>
          <ul className="mt-3 space-y-2">
            {t.howToCompare.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2.5 rounded-lg border border-ink-line bg-white px-4 py-3 text-[13.5px] leading-relaxed text-ink-soft"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Misconceptions */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-[19px] font-semibold tracking-tight text-ink">
            <XCircle size={18} className="text-amber-600" aria-hidden />
            常見誤解
          </h2>
          <div className="mt-3 space-y-3">
            {t.misconceptions.map((m) => (
              <div
                key={m.myth}
                className="rounded-xl border border-ink-line bg-white p-4"
              >
                <p className="flex items-start gap-2 text-[13.5px] font-semibold text-ink">
                  <span className="mt-0.5 shrink-0 rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-semibold text-red-700">
                    誤解
                  </span>
                  {m.myth}
                </p>
                <p className="mt-2.5 flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-soft">
                  <span className="mt-0.5 shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    事實
                  </span>
                  {m.truth}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        {relatedTerms.length > 0 && (
          <section className="mt-8">
            <h2 className="text-[17px] font-semibold tracking-tight text-ink">
              相關術語
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {relatedTerms.map((rt) => (
                <Link
                  key={rt!.slug}
                  href={`/dictionary/${rt!.slug}`}
                  className="rounded-full border border-ink-line bg-white px-3 py-1.5 text-[12.5px] text-ink-soft transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                >
                  {rt!.zh}
                  <span className="ml-1 text-ink-mute">{rt!.term}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-[17px] font-semibold tracking-tight text-ink">
              這個術語出現在哪些產品
            </h2>
            <p className="mt-1 text-[12.5px] text-ink-mute">
              僅列出條款中涉及此術語的產品，不代表推薦。
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <Link
                  key={p!.id}
                  href={`/products/${p!.slug}`}
                  className="group rounded-lg border border-ink-line bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <span className="mt-0.5 block text-[14px] font-medium leading-snug text-ink group-hover:text-brand-700">
                    {p!.name}
                  </span>
                  <span className="mt-1 block text-[12px] text-ink-mute">
                    {p!.tagline}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section className="mt-8">
            <h2 className="text-[17px] font-semibold tracking-tight text-ink">
              相關文章
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((a) => (
                <Link
                  key={a!.slug}
                  href={`/learn/${a!.slug}`}
                  className="group rounded-lg border border-ink-line bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <span className="text-[11.5px] font-medium text-brand-700">
                    {a!.category}
                  </span>
                  <span className="mt-1 block text-[14px] font-medium leading-snug text-ink group-hover:text-brand-700">
                    {a!.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/dictionary"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink-line bg-white px-4 text-[13.5px] font-medium text-ink-soft hover:bg-paper"
          >
            返回術語字典
          </Link>
          <Link
            href="/ask"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-800 px-4 text-[13.5px] font-semibold text-white hover:bg-brand-900"
          >
            問一個相關問題
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </article>
    </div>
  );
}
