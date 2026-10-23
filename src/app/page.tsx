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
} from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { ProductCard, DemoBadge } from "@/components/product-card";
import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { site } from "@/lib/site";

const categoryCards = [
  {
    name: "醫療保險",
    href: "/products?category=醫療保險",
    desc: "住院、門診、慢病管理，睇清楚自付額同保障上限。",
    icon: Stethoscope,
    count: 4,
  },
  {
    name: "危疾保險",
    href: "/products?category=危疾保險",
    desc: "符合疾病定義後一次性賠付，重點在定義內容。",
    icon: HeartPulse,
    count: 3,
  },
  {
    name: "人壽保險",
    href: "/products?category=人壽保險",
    desc: "身故保障與儲蓄成分，分清楚保證與非保證。",
    icon: ShieldCheck,
    count: 3,
  },
  {
    name: "旅遊保險",
    href: "/products?category=旅遊保險",
    desc: "短期保障，留意受保地區、活動範圍同取消條款。",
    icon: Plane,
    count: 2,
  },
];

export default function HomePage() {
  const featured = products.slice(0, 3);
  const featuredArticles = articles.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-line bg-gradient-to-b from-brand-50/70 to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-100/50 blur-3xl"
        />
        <div className="container-page relative py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-[12px] font-medium text-brand-700">
              <Info size={13} />
              香港保險資訊平台 Prototype · 所有資料為虛構示範
            </p>

            <h1 className="mt-5 text-[32px] font-bold leading-[1.25] tracking-tight text-ink sm:text-[42px]">
              香港保險，先了解，再選擇。
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
              比較不同保險公司的保障內容、保費及條款，讓每一個選擇都更清晰。
            </p>

            <div className="mt-7 max-w-3xl">
              <HeroSearch />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-mute">
              <span>搜尋示例：</span>
              {["香港醫療保險", "危疾保險比較", "自付額是什麼", "住院保險保障"].map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="rounded-full border border-ink-line bg-white px-2.5 py-1 hover:border-brand-300 hover:text-brand-700 transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Category entries */}
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.name}
                  href={c.href}
                  className="group flex items-start gap-3 rounded-xl border border-ink-line bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 group-hover:bg-brand-800 group-hover:text-white transition-colors">
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-[14.5px] font-semibold text-ink">
                      {c.name}
                      <ChevronRight size={14} className="text-ink-mute group-hover:text-brand-700" />
                    </span>
                    <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-soft">
                      {c.desc}
                    </span>
                    <span className="mt-1.5 block text-[11.5px] text-ink-mute">
                      {c.count} 個模擬產品
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular products */}
      <section className="container-page py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight text-ink">熱門產品比較</h2>
            <p className="mt-1.5 text-[13.5px] text-ink-soft">
              選三個模擬產品加入比較清單，直接對照保障上限、自付額同續保條件。
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-[13.5px] font-medium text-brand-700 hover:underline"
          >
            瀏覽全部產品
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <DemoBadge />
          <span className="text-[12px] text-ink-mute">
            所有卡片資料來自本地模擬資料庫，並非真實產品報價或保障承諾。
          </span>
        </div>
      </section>

      {/* Learn */}
      <section className="border-y border-ink-line bg-white py-14">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-semibold tracking-tight text-ink">保險知識中心</h2>
              <p className="mt-1.5 text-[13.5px] text-ink-soft">
                用中立方式解釋保險概念，睇完先至知道自己想問啲咩。
              </p>
            </div>
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 text-[13.5px] font-medium text-brand-700 hover:underline"
            >
              全部文章
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/learn/${a.slug}`}
                className="group flex flex-col rounded-xl border border-ink-line bg-paper/60 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white hover:shadow-card"
              >
                <span className="inline-flex w-fit rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                  {a.category}
                </span>
                <h3 className="mt-3 text-[15px] font-semibold leading-snug text-ink group-hover:text-brand-700">
                  {a.title}
                </h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-soft">{a.excerpt}</p>
                <span className="mt-4 flex items-center gap-3 border-t border-ink-line pt-3 text-[11.5px] text-ink-mute">
                  <span className="inline-flex items-center gap-1">
                    <BookOpen size={12} /> {a.readingMinutes} 分鐘
                  </span>
                  <span>更新於 {a.updatedAt}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="container-page py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: FileSearch,
              title: "先睇條款，再睇廣告",
              desc: "每份產品資料都列出保障範圍、除外責任同需要進一步確認的地方。",
              href: "/transparency",
            },
            {
              icon: Scale,
              title: "真正的並列比較",
              desc: "最多三個產品並排對照，數據差異由系統客觀整理。",
              href: "/compare",
            },
            {
              icon: ClipboardList,
              title: "需求分析導航",
              desc: "四步問答，介紹你可以先了解嘅保障項目同相關文章。",
              href: "/needs",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.title}
                href={f.href}
                className="group rounded-xl border border-ink-line bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-50 text-accent-700">
                  <Icon size={19} />
                </span>
                <h3 className="mt-3.5 text-[15px] font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{f.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-700">
                  了解更多
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Transparency */}
      <section className="container-page pb-16">
        <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-7 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-700">
              Transparency
            </p>
            <h2 className="mt-2 text-[24px] font-semibold tracking-tight text-ink">
              我們如何整理保險資訊？
            </h2>
            <p className="mt-3.5 text-[14.5px] leading-relaxed text-ink-soft">
              我們希望將保險產品資料以一致的方式整理，協助用戶了解不同產品的保障內容、條款及限制。
              正式上線時，產品資訊將標示來源、核實狀態及更新日期。商業合作與客觀產品資訊將分開展示。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/transparency"
                className="inline-flex h-10 items-center gap-1.5 rounded-md bg-brand-800 px-4 text-[13.5px] font-semibold text-white hover:bg-brand-900 transition-colors"
              >
                了解資料整理方式
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/transparency#prototype"
                className="inline-flex h-10 items-center gap-1.5 rounded-md border border-brand-300 bg-white px-4 text-[13.5px] font-semibold text-brand-800 hover:bg-brand-100 transition-colors"
              >
                查看 Prototype 限制
              </Link>
            </div>
            <p className="mt-5 text-[12px] text-ink-mute">
              {site.prototypeNotice}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
