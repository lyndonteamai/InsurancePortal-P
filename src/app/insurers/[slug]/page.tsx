import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { insurers, getInsurerBySlug } from "@/data/insurers";
import { getProductsByInsurer } from "@/data/products";
import { CATEGORY_LABELS } from "@/data/types";
import {
  pageMetadata,
  breadcrumbJsonLd,
  jsonLdScript,
  webPageJsonLd,
} from "@/lib/structured-data";
import { ProductCard } from "@/components/product-card";
import { Building2, Globe, ScrollText } from "lucide-react";

export function generateStaticParams() {
  return insurers.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ins = getInsurerBySlug(slug);
  if (!ins) return {};
  return pageMetadata({
    title: `${ins.name}（${ins.nameEn}）｜旗下保險產品與公司資料`,
    description: `${ins.description.slice(0, 90)}`,
    path: `/insurers/${ins.slug}`,
    updatedAt: ins.updatedAt,
  });
}

export default async function InsurerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ins = getInsurerBySlug(slug);
  if (!ins) notFound();

  const ps = getProductsByInsurer(ins.id);
  const cats = Array.from(new Set(ps.map((p) => p.category)));

  const webPageLd = webPageJsonLd({
    name: ins.name,
    description: ins.description,
    url: `/insurers/${ins.slug}`,
    updatedAt: ins.updatedAt,
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "首頁", href: "/" },
    { name: "保險公司", href: "/insurers" },
    { name: ins.name, href: `/insurers/${ins.slug}` },
  ]);

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(webPageLd) }}
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
        <Link href="/insurers" className="hover:text-brand-700">
          保險公司
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{ins.name}</span>
      </nav>

      <header className="mt-3">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <Building2 size={22} aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">
              {ins.name}
            </h1>
            <p className="mt-1 text-[13.5px] text-ink-mute">{ins.nameEn}</p>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          {ins.description}
        </p>
      </header>

      {/* Company facts */}
      <section className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Fact
          icon={<Building2 size={13} aria-hidden />}
          label="成立年份"
          value={ins.founded ? `${ins.founded} 年` : "資料未提供"}
        />
        <Fact
          icon={<ScrollText size={13} aria-hidden />}
          label="產品數量"
          value={`${ps.length} 款`}
        />
        <Fact
          icon={<Globe size={13} aria-hidden />}
          label="監管狀態"
          value={ins.regulator ?? "資料未提供"}
          small
        />
      </section>

      {/* Focus */}
      <section className="mt-8">
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">專注範圍</h2>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {ins.focus.map((f) => (
            <span
              key={f}
              className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[12.5px] text-brand-800"
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mt-9">
        <h2 className="text-[20px] font-semibold tracking-tight text-ink">
          旗下產品
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
          {ins.name} 在平台資料庫內共有 {ps.length} 款產品，涵蓋{" "}
          {cats.map((c) => CATEGORY_LABELS[c]).join("、")}。
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {ps.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <div className="mt-10 rounded-xl border border-ink-line bg-paper p-5">
        <h2 className="text-[15px] font-semibold text-ink">關於這家公司的資料</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
          平台對保險公司的記錄包括公司背景、產品線結構與旗下產品的資料核實狀態。
          我們不會對公司作評分或排名，也不會標示「最佳保險公司」——因為這類判斷
          取決於你的具體需要，而不是公司本身。
        </p>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-mute">
          本頁的保險公司資料最後更新於 {ins.updatedAt}。
          正式環境下會連接監管機構公開登記資料，並標示資料核實狀態。
        </p>
      </div>
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
  small,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink-line bg-white p-4">
      <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-mute">
        {icon}
        {label}
      </p>
      <p
        className={`mt-1.5 font-semibold text-ink ${small ? "text-[13px] leading-relaxed" : "text-[16px]"}`}
      >
        {value}
      </p>
    </div>
  );
}
