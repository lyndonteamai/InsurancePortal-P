// ============================================================
// 保險指南 Insurance Compass HK — V2 資料模型 (Data Schema V2)
// ============================================================
// 設計原則：
// 1. 產品、保險公司、條款、來源、術語都是「可獨立擴展」的實體，
//    之間用 id 關聯，避免頁面直接依賴硬編碼文字。
// 2. 每個產品都必須帶 verification 狀態與 sourceDocuments，
//    讓「資料是否可信」成為一等公民，而不是裝飾。
// 3. 所有 enum 使用英文常數 + 中文顯示名，方便日後接真實 API。
// ============================================================

// ---------- 分類（英文 enum 為資料層唯一真相，UI 層再翻譯）----------

export type ProductCategory =
  | "medical"
  | "critical-illness"
  | "life"
  | "travel"
  | "home"
  | "motor"
  | "savings-retirement";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  medical: "醫療保險",
  "critical-illness": "危疾保險",
  life: "人壽保險",
  travel: "旅遊保險",
  home: "家居保險",
  motor: "汽車保險",
  "savings-retirement": "儲蓄退休保險",
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "medical",
  "critical-illness",
  "life",
  "savings-retirement",
  "travel",
  "home",
  "motor",
];

// ---------- 核實狀態 (Verification State Machine) ----------

export type VerificationStatus =
  | "verified"
  | "partially_verified"
  | "unverified"
  | "demo";

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  verified: "已核實",
  partially_verified: "部分核實",
  unverified: "尚未核實",
  demo: "原型模擬資料",
};

export const VERIFICATION_DESCRIPTIONS: Record<VerificationStatus, string> = {
  verified:
    "此頁面所列的數據已對照公開來源文件核對，來源連結列於「資料來源」欄。",
  partially_verified:
    "此頁面部分欄位已對照來源核對，另有欄位（例如保費）為示例數字，尚未逐項核實。",
  unverified:
    "此頁面資料目前尚未加入可核實來源，內容僅作說明用途，請勿直接依賴作決定。",
  demo: "此頁面為原型示範內容，數據為虛構模擬，並非任何真實保險產品的條款或保費。",
};

// ---------- 來源文件 (Source Document) ----------

export type SourceType =
  | "policy_terms"
  | "product_sheet"
  | "benefit_table"
  | "brochure"
  | "regulator"
  | "industry_body"
  | "news"
  | "internal_note";

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  policy_terms: "保單條款",
  product_sheet: "產品小冊子",
  benefit_table: "保障表",
  brochure: "宣傳單張",
  regulator: "監管機構資料",
  industry_body: "業界公開統計",
  news: "公開報導",
  internal_note: "平台內部註記",
};

export type SourceDocument = {
  id: string;
  title: string;
  type: SourceType;
  publisher: string;
  /** 條款版本 / 發佈日期，用於判斷資料是否過期 */
  version?: string;
  publishedAt?: string;
  /** 對外可查證的連結；原型階段多為 null */
  url?: string | null;
  /** 平台內部可追溯的說明（例如「條款第 3 節 保障範圍」） */
  locator?: string;
  /** 原型資料為 true；表示這份來源尚未真正公開 */
  isPrototype: boolean;
  note?: string;
};

// ---------- 覆蓋項目 / 不保事項 ----------

export type CoverageCategory =
  | "hospital"
  | "surgical"
  | "outpatient"
  | "critical"
  | "death"
  | "disability"
  | "medical"
  | "trip"
  | "property"
  | "liability"
  | "vehicle"
  | "income"
  | "education"
  | "retirement"
  | "other";

export const COVERAGE_CATEGORY_LABELS: Record<CoverageCategory, string> = {
  hospital: "住院",
  surgical: "手術",
  outpatient: "門診",
  critical: "危疾",
  death: "身故",
  disability: "殘疾",
  medical: "醫療",
  trip: "旅程",
  property: "財產",
  liability: "責任",
  vehicle: "車輛",
  income: "收入",
  education: "教育",
  retirement: "退休",
  other: "其他",
};

export type CoverageItem = {
  id: string;
  category: CoverageCategory;
  name: string;
  /** 一句話說明保障什麼 */
  summary: string;
  /** 保障額度描述（文字），避免虛構精確數字 */
  limit?: string;
  /** 是否為此產品的重點保障 */
  highlight?: boolean;
  /** 引用此項的來源 id 列表 */
  sourceIds: string[];
};

export type ExclusionItem = {
  id: string;
  name: string;
  description: string;
  sourceIds: string[];
};

// ---------- 細項結構（自付額 / 等待期 / 續保）----------

export type DeductibleInfo = {
  hasDeductible: boolean;
  /** 文字描述，例如「每次住院 HK$5,000」 */
  value?: string;
  /** 說明類型，例如「每次住院」 */
  basis?: string;
  sourceIds: string[];
};

export type WaitingPeriodInfo = {
  hasWaitingPeriod: boolean;
  value?: string;
  sourceIds: string[];
};

export type RenewalInfo = {
  type: "guaranteed_renewal" | "guaranteed_renewal_period" | "non_guaranteed";
  label: string;
  description: string;
  /** 續保年數（部分產品） */
  years?: number;
  sourceIds: string[];
};

export const RENEWAL_TYPE_LABELS: Record<RenewalInfo["type"], string> = {
  guaranteed_renewal: "保證續保",
  guaranteed_renewal_period: "保證續保年期",
  non_guaranteed: "不保證續保",
};

// ---------- 保費示例 ----------

export type PremiumExample = {
  /** 適用情境標籤，例如「30 歲非吸煙」 */
  label: string;
  /** 假設條件，例如「30 歲・非吸煙・自願投保」 */
  assumptions: string;
  /** 每年保費（HK$） */
  annualPremium: number;
  currency: "HKD";
  /** 是否為示例數字（原型階段全部為 true） */
  isExample: boolean;
  sourceIds: string[];
};

// ---------- 投保資格 ----------

export type EligibilityInfo = {
  minAge?: number;
  maxAge?: number;
  residency?: string;
  healthDeclaration?: boolean;
  occupationLimits?: boolean;
  notes?: string[];
};

// ---------- 保險公司 (Insurer Entity) ----------

export type Insurer = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  /** 成立年份（原型為虛構） */
  founded?: number;
  /** 專注範圍 */
  focus: string[];
  website?: string | null;
  /** 監管狀態 */
  regulator?: string;
  /** 旗下產品 id */
  productIds: string[];
  updatedAt: string;
  isDemo: boolean;
};

// ---------- 產品 ----------

export type InsuranceProduct = {
  id: string;
  /** URL 友善識別碼 */
  slug: string;
  name: string;
  nameEn: string;
  insurerId: string;
  category: ProductCategory;
  /** 一句話定位 */
  tagline: string;
  /** 產品介紹 */
  description: string;

  eligibility: EligibilityInfo;

  coverage: CoverageItem[];
  exclusions: ExclusionItem[];

  deductible?: DeductibleInfo;
  waitingPeriod?: WaitingPeriodInfo;
  renewal?: RenewalInfo;

  premiumExamples: PremiumExample[];

  /** 重點特色（用於列表卡片與篩選） */
  features: string[];
  /** 條款重點 */
  termPoints: { title: string; detail: string }[];

  sourceDocuments: SourceDocument[];
  verification: {
    status: VerificationStatus;
    lastReviewedAt: string;
    /** 尚未核實的欄位清單 */
    unverifiedFields?: string[];
  };

  /** 適用的付款方式 */
  paymentOptions?: string[];
  /** 條款生效年份（用於展示「條款版本」） */
  termsVersion?: string;

  updatedAt: string;
  isDemo: true;
};

// ---------- 知識文章 ----------

export type ArticleSection = {
  heading: string;
  body: string[];
  /** 重點列表 */
  bullets?: string[];
  /** 該節引用的來源 id */
  sourceIds?: string[];
};

export type Article = {
  slug: string;
  title: string;
  /** SEO 用一句話答案 */
  quickAnswer: string;
  category: string;
  excerpt: string;
  updatedAt: string;
  readingMinutes: number;
  intro: string;
  sections: ArticleSection[];
  keyTakeaways: string[];
  relatedSlugs: string[];
  relatedProductIds: string[];
  relatedTerms?: string[];
  sourceIds?: string[];
  disclaimer: string;
};

// ---------- 保險術語字典 ----------

export type DictionaryTerm = {
  /** 英文術語 */
  term: string;
  /** URL 用字串 */
  slug: string;
  /** 繁體中文對應 */
  zh: string;
  /** 字母排序索引用 */
  letter: string;
  /** 一句話答案（40–80 字），供 GEO / 快速答案區塊使用 */
  quickAnswer: string;
  /** 詳細解釋 */
  explanation: string;
  /** 舉例 */
  example: string;
  /** 為什麼重要 */
  whyItMatters: string;
  /** 比較時要看的重點 */
  howToCompare: string[];
  /** 常見誤解 */
  misconceptions: { myth: string; truth: string }[];
  relatedProductIds: string[];
  relatedArticleSlugs: string[];
  relatedTerms: string[];
  sourceIds: string[];
  updatedAt: string;
};

// ---------- 主題 Hub (Topic Authority Hub) ----------

export type HubSection = {
  id: string;
  heading: string;
  body: string[];
  kind: "explain" | "compare-guide" | "mistake" | "faq" | "steps";
  productIds?: string[];
  termSlugs?: string[];
  articleSlugs?: string[];
};

export type TopicHub = {
  slug: string;
  title: string;
  /** 主要類別對應 */
  category: ProductCategory;
  metaTitle: string;
  metaDescription: string;
  /** 一句話答案 */
  quickAnswer: string;
  intro: string;
  sections: HubSection[];
  productIds: string[];
  termSlugs: string[];
  articleSlugs: string[];
  faqIds: string[];
  updatedAt: string;
};

// ---------- FAQ ----------

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  productIds?: string[];
  updatedAt: string;
};

// ---------- 品牌 (平台層) ----------

export type Brand = {
  name: string;
  tagline: string;
  founded: string;
  focus: string;
};
