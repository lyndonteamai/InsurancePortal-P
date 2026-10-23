import Link from "next/link";
import { getProduct } from "@/data/products";
import { dictionary } from "@/data/dictionary";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { CATEGORY_LABELS } from "@/data/types";
import type { TopicHub } from "@/data/types";
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  jsonLdScript,
} from "@/lib/structured-data";
import {
  ArrowRight,
  Lightbulb,
  ListChecks,
  AlertTriangle,
  MessageCircleQuestion,
} from "lucide-react";
import { ProductCard } from "./product-card";

// ============================================================
// 主題權威頁渲染器 (HubView)
// 每一個 section 都可以獨立擴充：加內容不需要改這個元件。
// ============================================================

const KIND_META: Record<
  string,
  { label: string; icon: typeof Lightbulb; tone: string }
> = {
  explain: {
    label: "概念解釋",
    icon: Lightbulb,
    tone: "text-brand-600 bg-brand-50",
  },
  "compare-guide": {
    label: "比較重點",
    icon: ListChecks,
    tone: "text-accent-700 bg-accent-50",
  },
  mistake: {
    label: "常見誤解",
    icon: AlertTriangle,
    tone: "text-amber-700 bg-amber-50",
  },
  faq: { label: "提問清單", icon: ListChecks, tone: "text-brand-600 bg-brand-50" },
  steps: { label: "步驟", icon: ListChecks, tone: "text-accent-700 bg-accent-50" },
};

export function HubView({ hub }: { hub: TopicHub }) {
  const hubProducts = hub.productIds
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const hubTerms = hub.termSlugs
    .map((slug) => dictionary.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const hubArticles = hub.articleSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const hubFaqs = hub.faqIds
    .map((id) => faqs.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            webPageJsonLd({
              name: hub.title,
              description: hub.metaDescription,
              url: `/${hub.slug}`,
              updatedAt: hub.updatedAt,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: hub.title, href: `/${hub.slug}` },
            ]),
          ),
        }}
      />
      {hubFaqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(
              faqPageJsonLd(
                hubFaqs.map((f) => ({ question: f.question, answer: f.answer })),
              ),
            ),
          }}
        />
      )}

      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{hub.title}</span>
      </nav>

      <header className="mt-3 max-w-3xl">
        <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-[11.5px] font-medium text-brand-700">
          {CATEGORY_LABELS[hub.category]} · 主題指南
        </span>
        <h1 className="mt-3 text-[28px] font-bold leading-[1.25] tracking-tight text-ink sm:text-[36px]">
          {hub.title}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          {hub.intro}
        </p>
        <p className="mt-3 text-[12px] text-ink-mute">
          更新於 {hub.updatedAt} · 本頁不排名任何產品，只提供比較方法與可核對的資料
        </p>
      </header>

      {/* 一句話答案（GEO 區塊） */}
      <section className="mt-7 max-w-3xl rounded-xl border border-brand-200 bg-brand-50/60 p-5">
        <p className="text-[11.5px] font-semibold uppercase tracking-wider text-brand-700">
          一句話答案
        </p>
        <p className="mt-1.5 text-[15px] font-medium leading-relaxed text-ink">
          {hub.quickAnswer}
        </p>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <div className="min-w-0">
          {hub.sections.map((section) => {
            const meta = KIND_META[section.kind] ?? KIND_META.explain;
            const Icon = meta.icon;
            const secProducts = (section.productIds ?? [])
              .map((id) => getProduct(id))
              .filter((p): p is NonNullable<typeof p> => Boolean(p));
            const secTerms = (section.termSlugs ?? [])
              .map((slug) => dictionary.find((t) => t.slug === slug))
              .filter((t): t is NonNullable<typeof t> => Boolean(t));
            const secArticles = (section.articleSlugs ?? [])
              .map((slug) => articles.find((a) => a.slug === slug))
              .filter((a): a is NonNullable<typeof a> => Boolean(a));

            return (
              <section
                key={section.id}
                id={section.id}
                className="mb-10 scroll-mt-24"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11.5px] font-medium ${meta.tone}`}
                  >
                    <Icon size={12} aria-hidden />
                    {meta.label}
                  </span>
                </div>
                <h2 className="mt-2.5 text-[21px] font-semibold leading-snug tracking-tight text-ink">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((p, i) => (
                    <p
                      key={i}
                      className="text-[14.5px] leading-[1.85] text-ink-soft"
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {(secTerms.length > 0 || secArticles.length > 0) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {secTerms.map((t) => (
                      <Link
                        key={`t-${t.slug}`}
                        href={`/dictionary/${t.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-ink-line bg-white px-3 py-1.5 text-[12.5px] text-ink-soft hover:border-brand-300 hover:text-brand-700"
                      >
                        術語：{t.zh}
                      </Link>
                    ))}
                    {secArticles.map((a) => (
                      <Link
                        key={`a-${a.slug}`}
                        href={`/learn/${a.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-ink-line bg-white px-3 py-1.5 text-[12.5px] text-ink-soft hover:border-brand-300 hover:text-brand-700"
                      >
                        文章：{a.title}
                      </Link>
                    ))}
                  </div>
                )}

                {secProducts.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {secProducts.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/products/${p.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-lg border border-ink-line bg-white px-4 py-3 hover:border-brand-300 hover:bg-brand-50/40"
                        >
                          <span className="min-w-0">
                            <span className="block text-[13.5px] font-medium text-ink group-hover:text-brand-700">
                              {p.name}
                            </span>
                            <span className="mt-0.5 block text-[11.5px] text-ink-mute">
                              {p.tagline}
                            </span>
                          </span>
                          <ArrowRight
                            size={15}
                            className="shrink-0 text-ink-mute group-hover:text-brand-700"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          {/* 相關產品 */}
          {hubProducts.length > 0 && (
            <section id="products" className="mt-12 scroll-mt-24">
              <h2 className="text-[20px] font-semibold tracking-tight text-ink">
                本指南涉及的產品資料
              </h2>
              <p className="mt-1.5 text-[13.5px] text-ink-soft">
                以下產品資料可用於並排對照。平台不提供排名或推薦，你可以加入比較清單自行對照條款差異。
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {hubProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {hubFaqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-[20px] font-semibold tracking-tight text-ink">
                常見問題
              </h2>
              <ul className="mt-4 space-y-2.5">
                {hubFaqs.map((f) => (
                  <li
                    key={f.id}
                    className="rounded-xl border border-ink-line bg-white p-4"
                  >
                    <p className="text-[14px] font-medium text-ink">{f.question}</p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
                      {f.answer}
                    </p>
                    <p className="mt-2 text-[11.5px] text-ink-mute">
                      分類：{f.category} · 更新於 {f.updatedAt}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 術語索引 */}
          {hubTerms.length > 0 && (
            <section className="mt-12">
              <h2 className="text-[20px] font-semibold tracking-tight text-ink">
                本頁相關術語
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {hubTerms.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/dictionary/${t.slug}`}
                      className="group block h-full rounded-xl border border-ink-line bg-white p-4 hover:border-brand-300 hover:shadow-card"
                    >
                      <span className="block text-[14px] font-semibold text-ink group-hover:text-brand-700">
                        {t.zh}
                        <span className="ml-1.5 text-[12px] font-normal text-ink-mute">
                          {t.term}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-[12.5px] leading-relaxed text-ink-soft">
                        {t.quickAnswer}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-ink-line bg-white p-5">
            <h2 className="text-[14px] font-semibold text-ink">本頁目錄</h2>
            <ul className="mt-3 space-y-1.5">
              {hub.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block text-[13px] leading-relaxed text-ink-soft hover:text-brand-700"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
              {hubProducts.length > 0 && (
                <li>
                  <a
                    href="#products"
                    className="block text-[13px] text-ink-soft hover:text-brand-700"
                  >
                    涉及的產品資料
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-ink-line bg-white p-5">
            <h2 className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <MessageCircleQuestion size={14} className="text-brand-600" />
              仲有其他問題？
            </h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
              用一句話查詢，系統會從資料庫找出相關條目、術語同來源。
            </p>
            <Link
              href="/ask"
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-brand-700 hover:underline"
            >
              前往問保險問題
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="rounded-xl border border-ink-line bg-paper p-5">
            <h2 className="text-[13px] font-semibold text-ink">中立聲明</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
              本頁只提供概念解釋、判斷方法同可核對的資料，不排名任何產品，亦不代表合作或推薦。所有數據為
              Prototype 模擬資料。
            </p>
            <Link
              href="/trust"
              className="mt-3 inline-flex text-[13px] font-medium text-brand-700 hover:underline"
            >
              平台原則
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
