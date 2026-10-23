// Prototype 統一資料模型。所有品牌、產品、條款及保費均為虛構示範資料，
// 並非真實香港保險市場的產品或報價。

export type InsuranceCategory =
  | "醫療保險"
  | "危疾保險"
  | "人壽保險"
  | "旅遊保險";

export type CoverageItem = {
  name: string;
  description: string;
  simulatedLimit: string;
  keyLimit: string;
};

export type InsuranceProduct = {
  id: string;
  name: string;
  insurer: string;
  category: InsuranceCategory;
  simulatedPremium: number;
  coverageLimit: number;
  coverageLimitLabel: string;
  deductible: string;
  waitingPeriod: string;
  renewalTerms: string;
  coverageSummary: string;
  keyFeatures: string[];
  coverageItems: CoverageItem[];
  exclusions: string[];
  termPoints: {
    coverageScope: string[];
    exclusions: string[];
    waitingPeriod: string;
    deductible: string;
    renewal: string;
    needToConfirm: string[];
  };
  premiumNote: string;
  updatedAt: string;
  features: string[];
  isDemo: true;
};

export type ArticleCategory =
  | "保險入門"
  | "醫療保險"
  | "危疾保險"
  | "人壽保險"
  | "保險條款"
  | "保險理賠";

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  title: string;
  category: ArticleCategory;
  excerpt: string;
  updatedAt: string;
  readingMinutes: number;
  intro: string;
  sections: ArticleSection[];
  keyTakeaways: string[];
  relatedSlugs: string[];
  relatedProductIds: string[];
  disclaimer: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: ArticleCategory;
  keywords: string[];
};

export type Brand = {
  name: string;
  tagline: string;
  founded: string;
  focus: InsuranceCategory[];
};
