import Link from "next/link";
import {
  ArrowRight,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Plane,
  Info,
  BookOpen,
  ClipboardList,
  FileSearch,
  Scale,
  ChevronRight,
  Search,
  MessageCircleQuestion,
  BookMarked,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { dictionary } from "@/data/dictionary";
import { hubs } from "@/data/hubs";
import { site } from "@/lib/site";
import { CATEGORY_LABELS } from "@/data/types";

// ============================================================
// 首頁 V2 (STEP 18)
// ============================================================
// 結構：
//   1. Hero（新副標 + 4 個核心入口）
//   2. 主題保險指南（4 個 Hub）
//   3. 最近更新的產品
//   4. 大家正在了解（常見術語 + 常見文章）
//   5. 為甚麼使用我們（三點：可比較 / 有來源 / 講人話）
//   6. Trust CTA
// ============================================================

const coreEntries = [
  {
    href: "/products",
    label: "找保險",
    desc: "按類別瀏覽產品資料，每項數據標示核實狀態。",
    icon: Search,
  },
  {
    href: "/compare",
    label: "比較產品",
    desc: "最多三個並排對照，解釋差異從哪裡來。",
    icon: Scale,
  },
  {
    href: "/dictionary",
    label: "查保險術語",
    desc: `${dictionary.length} 個術語，一句話答案加詳細解釋。`,
    icon: BookMarked,
  },
  {
    href: "/ask",
    label: "問保險問題",
    desc: "用一句話查，從資料庫找出相關條目與來源。",
    icon: MessageCircleQuestion,
  },
];

const whyPoints = [
  {
    icon: Scale,
    title: "可比較",
    desc: "並排對照同一批欄位，並解釋每個差異背後的機制，而不是給你一個排名。",
    href: "/compare",
  },
  {
    icon: FileSearch,
    title: "有來源",
    desc: "每項數據都標明出自哪份文件。找不到來源就寫「資料未提供」，不用推測填補。",
    href: "/trust",
  },
  {
    icon: BookOpen,
    title: "講人話",
    desc: "用條款實際會怎樣影響你的方式解釋，而不是複製保險公司的銷售文案。",
    href: "/learn",
  },
];

export default function HomePage() {
  // 最近更新：按 updatedAt 倒數
  const recentProducts = [...products]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);

  // 大家正在了解：取 quickAnswer 最長的幾個術語（通常代表需要解釋的概念）
  const popularTerms = [...dictionary]
    .sort((a, b) => b.quickAnswer.length - a.quickAnswer.length)
    .slice(0, 6);

  const popularArticles = articles.slice(0, 3);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden border-b border-ink-line bg-gradient-to-b from-brand-50/70 to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-100/50 blur-3xl"
        />
        <div className="container-page relative py-12 sm:py-16">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-[12px] font-medium text-brand-700">
              <Info size={13} aria-hidden />
              香港保險資訊平台 Prototype · 所有產品資料為虛構示範
            </p>

            <h1 className="mt-5 text-[32px] font-bold leading-[1.22] tracking-tight text-ink sm:text-[42px]">
              香港保險，先了解，再選擇。
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
              我們把保險產品的保障內容、條款限制同資料來源整理成可以並排對照的結構，
              讓你在投保之前，先看清楚自己在比較甚麼。
            </p>

            <div className="mt-7 max-w-3xl">
              <HeroSearch />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-mute">
              <span>搜尋示例：</span>
              {["香港醫療保險", "自付額是什麼", "保證續保", "危疾定義"].map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="rounded-full border border-ink-line bg-white px-2.5 py-1 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* 4 core entries */}
          <div className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {coreEntries.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group flex items-start gap-3 rounded-xl border border-ink-line bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-800 group-hover:text-white">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
                      {c.label}
                      <ChevronRight
                        size={14}
                        className="text-ink-mute transition-colors group-hover:text-brand-700"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-soft">
                      {c.desc}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- 主題保險指南 ---------- */}
      <section className="container-page py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight text-ink">
              主題保險指南
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
              每個類別都有一份完整的主題頁：概念解釋、比較重點、常見誤解同應問的問題。
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-[13.5px] font-medium text-brand-700 hover:underline"
          >
            瀏覽產品資料庫
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {hubs.map((hub) => {
            const count = products.filter(
              (p) => p.category === hub.category,
            ).length;
            return (
              <Link
                key={hub.slug}
                href={`/${hub.slug}`}
                className="group flex flex-col rounded-xl border border-ink-line bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-md bg-brand-50 px-2 py-0.5 text-[11.5px] font-medium text-brand-700">
                    {CATEGORY_LABELS[hub.category]}
                  </span>
                  <span className="text-[11.5px] text-ink-mute">{count} 款產品</span>
                </div>
                <h3 className="mt-3 text-[16px] font-semibold leading-snug text-ink group-hover:text-brand-700">
                  {hub.title}
                </h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-soft">
                  {hub.quickAnswer}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-700">
                  {hub.sections.length} 個章節
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- 最近更新的產品 ---------- */}
      <section className="border-y border-ink-line bg-white py-14">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-semibold tracking-tight text-ink">
                最近更新的產品
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
                按資料最後更新日期排列。這不是排名，只是我們最近檢視過的條目。
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-[13.5px] font-medium text-brand-700 hover:underline"
            >
              全部 {products.length} 款產品
              <ArrowRight size={15} aria-hidden />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 大家正在了解 ---------- */}
      <section className="container-page py-14">
        <h2 className="text-[22px] font-semibold tracking-tight text-ink">
          大家正在了解
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
          保險術語是投保前最值得先搞清楚的部分。以下幾個是查詢量較高的概念。
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          {/* Popular terms */}
          <div>
            <h3 className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
              <BookMarked size={15} className="text-brand-600" aria-hidden />
              常見術語
            </h3>
            <div className="mt-3 space-y-2">
              {popularTerms.map((t) => (
                <Link
                  key={t.slug}
                  href={`/dictionary/${t.slug}`}
                  className="group block rounded-lg border border-ink-line bg-white px-3.5 py-3 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-ink group-hover:text-brand-700">
                      {t.zh}
                    </span>
                    <span className="text-[11.5px] text-ink-mute">{t.term}</span>
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-soft">
                    {t.quickAnswer}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular articles */}
          <div>
            <h3 className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
              <BookOpen size={15} className="text-accent-600" aria-hidden />
              知識文章
            </h3>
            <div className="mt-3 space-y-2">
              {popularArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/learn/${a.slug}`}
                  className="group block rounded-lg border border-ink-line bg-white px-3.5 py-3 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-semibold text-ink group-hover:text-brand-700">
                      {a.title}
                    </span>
                    <span className="rounded bg-paper px-1.5 py-0.5 text-[10.5px] font-medium text-ink-mute">
                      {a.category}
                    </span>
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-soft">
                    {a.quickAnswer}
                  </span>
                  <span className="mt-1.5 flex items-center gap-3 text-[11.5px] text-ink-mute">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} aria-hidden /> {a.readingMinutes} 分鐘
                    </span>
                    <span>更新於 {a.updatedAt}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 為甚麼使用我們 ---------- */}
      <section className="border-y border-ink-line bg-paper py-14">
        <div className="container-page">
          <h2 className="text-[22px] font-semibold tracking-tight text-ink">
            為甚麼用這個平台
          </h2>
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-soft">
            保險資訊的問題從來不是「太少」，而是太難比較。我們把重點放在三件事上。
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {whyPoints.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.title}
                  href={f.href}
                  className="group rounded-xl border border-ink-line bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-50 text-accent-700">
                    <Icon size={19} aria-hidden />
                  </span>
                  <h3 className="mt-3.5 text-[15.5px] font-semibold text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                    {f.desc}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-700">
                    了解更多
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Trust CTA ---------- */}
      <section className="container-page py-14">
        <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-7 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-700">
              Trust Center
            </p>
            <h2 className="mt-2 text-[24px] font-semibold tracking-tight text-ink">
              我們如何整理保險資訊？
            </h2>
            <p className="mt-3.5 text-[14.5px] leading-relaxed text-ink-soft">
              資料從哪裡來、哪些部分還沒核實、我們為甚麼不做排名、商業合作如何不影響
              客觀資料、AI 的使用有甚麼邊界——信任中心把這些全部寫下來。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/trust"
                className="inline-flex h-10 items-center gap-1.5 rounded-md bg-brand-800 px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-900"
              >
                前往信任中心
                <ArrowRight size={15} aria-hidden />
              </Link>
              <Link
                href="/needs"
                className="inline-flex h-10 items-center gap-1.5 rounded-md border border-brand-300 bg-white px-4 text-[13.5px] font-semibold text-brand-800 transition-colors hover:bg-brand-100"
              >
                <ClipboardList size={15} aria-hidden />
                先做需求分析
              </Link>
            </div>
            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {[
                `${products.length} 款產品資料`,
                `${dictionary.length} 條術語解釋`,
                `${hubs.length} 份主題指南`,
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-1.5 text-[12.5px] font-medium text-brand-900/75"
                >
                  <CheckCircle2 size={14} className="shrink-0" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[12px] text-ink-mute">{site.prototypeNotice}</p>
          </div>
        </div>
      </section>
    </>
  );
}
