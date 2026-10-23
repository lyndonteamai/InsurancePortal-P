import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products, getProductBySlug } from "@/data/products";
import { getInsurer } from "@/data/insurers";
import { dictionary } from "@/data/dictionary";
import { articles } from "@/data/articles";
import { CATEGORY_LABELS } from "@/data/types";
import {
  pageMetadata,
  productJsonLd,
  breadcrumbJsonLd,
  jsonLdScript,
} from "@/lib/structured-data";
import { site } from "@/lib/site";
import { ProductDetailView } from "@/components/product-detail-view";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const insurer = getInsurer(product.insurerId);
  return pageMetadata({
    title: `${product.name}｜${CATEGORY_LABELS[product.category]}保障與條款比較`,
    description: `${product.tagline}。${product.description.slice(0, 90)}`,
    path: `/products/${product.slug}`,
    updatedAt: product.updatedAt,
    type: "article",
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const insurer = getInsurer(product.insurerId);

  // 相關術語（透過 coverage 名稱與 term 的相關性比對）
  const relatedTerms = dictionary
    .filter((t) => {
      const hay = t.term + t.zh;
      const names = product.coverage.map((c) => c.name + c.summary).join(" ");
      const q = t.quickAnswer + t.explanation;
      return (
        hay.length > 0 &&
        (names.includes(t.zh) ||
          q.includes(t.zh) ||
          product.category === "medical"
            ? names.includes(t.zh) || q.includes(t.zh) || t.relatedProductIds.includes(product.id)
            : false)
      );
    })
    .slice(0, 6);

  const relatedArticles = articles
    .filter(
      (a) =>
        a.relatedProductIds.includes(product.id) ||
        (a.relatedTerms ?? []).some((t) => relatedTerms.some((rt) => rt.slug === t)),
    )
    .slice(0, 3);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const breadcrumbs = [
    { name: "首頁", href: "/" },
    { name: "保險產品", href: "/products" },
    { name: CATEGORY_LABELS[product.category], href: `/${categorySlug(product.category)}` },
    { name: product.name, href: `/products/${product.slug}` },
  ];

  // 每個實體用獨立 <script>，唔包成陣列：
  // 咁搜索引擎可以逐個 entity 解析，唔需要處理巢狀結構。
  const productLd = productJsonLd({
    name: product.name,
    description: product.tagline,
    slug: product.slug,
    category: CATEGORY_LABELS[product.category],
    insurerName: insurer?.name ?? "保險公司",
    updatedAt: product.updatedAt,
  });
  const breadcrumbLd = breadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd) }}
      />
      <ProductDetailView
        product={product}
        insurerName={insurer?.name ?? "保險公司"}
        insurerHref={insurer ? `/insurers/${insurer.slug}` : "/insurers"}
        relatedTerms={relatedTerms.map((t) => ({
          slug: t.slug,
          zh: t.zh,
          term: t.term,
        }))}
        relatedArticles={relatedArticles.map((a) => ({
          slug: a.slug,
          title: a.title,
          category: a.category,
          readingMinutes: a.readingMinutes,
        }))}
        relatedProducts={relatedProducts.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          category: p.category,
          premiumMin: p.premiumExamples.length
            ? Math.min(...p.premiumExamples.map((e) => e.annualPremium))
            : null,
        }))}
      />
    </>
  );
}

function categorySlug(c: string): string {
  switch (c) {
    case "medical":
      return "medical-insurance";
    case "critical-illness":
      return "critical-illness-insurance";
    case "life":
      return "life-insurance";
    case "travel":
      return "travel-insurance";
    default:
      return "products";
  }
}
