import type { Metadata } from "next";
import { site } from "./site";

// ============================================================
// 結構化資料 (JSON-LD / Schema.org)
// ============================================================
// 原則：只標記頁面上真實可見的內容。
// 絕不使用 Review / AggregateRating / ReviewRating —— 平台沒有真實用戶評價，
// 標記不存在的評價會違反搜尋引擎指引，也違反平台的中立原則。
// ============================================================

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.nameZh,
    alternateName: site.nameEn,
    url: site.url,
    description: site.description,
    // 原型階段沒有真實營業地址，寧可省略 contactPoint 而不虛構
    logo: `${site.url}/logo.svg`,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.nameZh,
    alternateName: site.nameEn,
    url: site.url,
    inLanguage: "zh-HK",
    publisher: {
      "@type": "Organization",
      name: site.nameZh,
      url: site.url,
    },
    // 使用 SiteSearchAction 讓搜尋入口可以被結構化識別
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(args: {
  title: string;
  description: string;
  slug: string;
  updatedAt: string;
  section?: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    inLanguage: "zh-HK",
    dateModified: args.updatedAt,
    datePublished: args.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/learn/${args.slug}`,
    },
    author: {
      "@type": "Organization",
      name: `${site.nameZh} 編輯組`,
      url: site.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.nameZh,
      url: site.url,
    },
    ...(args.section ? { articleSection: args.section } : {}),
    ...(args.keywords && args.keywords.length
      ? { keywords: args.keywords.join(", ") }
      : {}),
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

/** 術語頁使用 DefinedTerm（不是 HowTo，因為不是教學步驟） */
export function definedTermJsonLd(args: {
  term: string;
  description: string;
  slug: string;
  inDefinedTermSet?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: args.term,
    description: args.description,
    inLanguage: "zh-HK",
    url: `${site.url}/dictionary/${args.slug}`,
    ...(args.inDefinedTermSet
      ? {
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: args.inDefinedTermSet,
            url: `${site.url}/dictionary`,
          },
        }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  };
}

/**
 * 保險產品：使用 InsuranceProduct 類型。
 * 注意：不填 aggregateRating / review —— 平台沒有真實評價。
 */
export function productJsonLd(args: {
  name: string;
  description: string;
  slug: string;
  category: string;
  insurerName: string;
  updatedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceProduct",
    name: args.name,
    description: args.description,
    inLanguage: "zh-HK",
    url: `${site.url}/products/${args.slug}`,
    category: args.category,
    dateModified: args.updatedAt,
    provider: {
      "@type": "Organization",
      name: args.insurerName,
    },
  };
}

/** 通用 WebPage */
export function webPageJsonLd(args: {
  name: string;
  description: string;
  url: string;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: args.name,
    description: args.description,
    inLanguage: "zh-HK",
    url: `${site.url}${args.url}`,
    ...(args.updatedAt ? { dateModified: args.updatedAt } : {}),
    isPartOf: {
      "@type": "WebSite",
      name: site.nameZh,
      url: site.url,
    },
  };
}

/** 產生 <script type="application/ld+json"> 的字串 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// ---------- Metadata helpers ----------

export function pageMetadata(args: {
  title: string;
  description: string;
  path: string;
  updatedAt?: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title: args.title,
    description: args.description,
    alternates: { canonical: args.path },
    openGraph: {
      title: args.title,
      description: args.description,
      url: args.path,
      type: args.type ?? "website",
      locale: "zh_HK",
      siteName: site.nameZh,
    },
    ...(args.updatedAt
      ? { other: { "article:modified_time": args.updatedAt } }
      : {}),
  };
}
