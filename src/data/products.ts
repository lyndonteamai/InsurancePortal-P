import type {
  InsuranceProduct,
  CoverageItem,
  ExclusionItem,
  SourceDocument,
} from "./types";

// ============================================================
// 產品資料 (V2)
// ============================================================
// 全部為原型虛構資料。每個產品都完整填寫 V2 schema：
//   eligibility / coverage / exclusions / deductible / waitingPeriod
//   renewal / premiumExamples / sourceDocuments / verification
// 目的是示範：當資料由 API 供應時，UI 層不需要改動。
// ============================================================

const REVIEWED = "2026-01-20";
const UPDATED = "2026-01-20";

/** 產生產品內嵌的條款來源 */
function terms(
  productId: string,
  insurer: string,
  code: string,
  version: string,
  publishedAt: string,
): SourceDocument {
  return {
    id: `src-${productId}-terms`,
    title: `${insurer}《${code}》保單條款`,
    type: "policy_terms",
    publisher: insurer,
    version,
    publishedAt,
    url: null,
    locator: "全文",
    isPrototype: true,
    note: "原型示範：實際環境應附上條款 PDF 的公開連結。",
    // ---------- Source-First 擴充欄位 ----------
    documentVersion: version,
    effectiveDate: publishedAt,
    retrievedDate: "2026-01-15",
    lastReviewedDate: REVIEWED,
    section: "保單條款全文",
    quoteOrReference: `《${code}》保單條款 — ${version} 版，條款自 ${publishedAt} 起生效。`,
    verificationStatus: "demo",
    acquisitionMethod: "official_upload",
    extractionState: "reviewed",
  };
}

function sheet(
  productId: string,
  insurer: string,
  code: string,
  version: string,
  publishedAt: string,
): SourceDocument {
  return {
    id: `src-${productId}-sheet`,
    title: `${insurer}《${code}》產品小冊子`,
    type: "product_sheet",
    publisher: insurer,
    version,
    publishedAt,
    url: null,
    locator: "保障摘要表",
    isPrototype: true,
    note: "原型示範：此類來源用於交叉核對條款與小冊子的數字是否一致。",
    // ---------- Source-First 擴充欄位 ----------
    documentVersion: version,
    effectiveDate: publishedAt,
    retrievedDate: "2026-01-15",
    lastReviewedDate: REVIEWED,
    pageNumber: "第 2 – 3 頁",
    section: "保障摘要表",
    quoteOrReference: `${insurer}《${code}》產品小冊子 — ${version}，保障摘要表列明各項保障額度。`,
    verificationStatus: "demo",
    acquisitionMethod: "official_upload",
    extractionState: "reviewed",
  };
}

// ------------------------------------------------------------
// 1. 港盾 · 住院醫療
// ------------------------------------------------------------
const hsMed01Coverage: CoverageItem[] = [
  {
    id: "hs-med-01-c1",
    category: "hospital",
    name: "住院病房費",
    summary: "因疾病或意外住院期間的病房及雜項開支。",
    limit: "每日最高 HK$8,000，每年最高 HK$300,000",
    highlight: true,
    sourceIds: ["src-hs-med-01-terms", "src-hs-med-01-sheet"],
  },
  {
    id: "hs-med-01-c2",
    category: "surgical",
    name: "手術費用",
    summary: "住院手術的醫生、麻醉師及手術室開支。",
    limit: "每宗手術最高 HK$120,000",
    highlight: true,
    sourceIds: ["src-hs-med-01-terms"],
  },
  {
    id: "hs-med-01-c3",
    category: "outpatient",
    name: "門診急症",
    summary: "門診急症室的診症及基本檢查開支。",
    limit: "每次最高 HK$1,500",
    sourceIds: ["src-hs-med-01-sheet"],
  },
  {
    id: "hs-med-01-c4",
    category: "other",
    name: "住院前後門診",
    summary: "住院前 14 日及出院後 30 日的覆診門診開支。",
    limit: "每年最高 HK$6,000",
    sourceIds: ["src-hs-med-01-terms"],
  },
];

const hsMed01Exclusions: ExclusionItem[] = [
  {
    id: "hs-med-01-e1",
    name: "非必要的美容或整型手術",
    description: "純屬改善外觀而非治療必需的手術不獲保障。",
    sourceIds: ["src-hs-med-01-terms"],
  },
  {
    id: "hs-med-01-e2",
    name: "投保前已存在的病症",
    description: "投保前 12 個月內已出現症狀或曾接受治療的病症屬不保事項。",
    sourceIds: ["src-hs-med-01-terms"],
  },
  {
    id: "hs-med-01-e3",
    name: "自行選擇的私家服務",
    description: "非由醫生建議的自費檢查或自選醫療服務不獲保障。",
    sourceIds: ["src-hs-med-01-sheet"],
  },
];

export const productHsMed01: InsuranceProduct = {
  id: "hs-med-01",
  slug: "harbor-shield-hospital-plan",
  name: "港盾「守望」住院醫療計劃",
  nameEn: "Harbor Shield Hospital Plan",
  insurerId: "harbor-shield",
  category: "medical",
  tagline: "以住院及手術為核心的自付額設計方案",
  description:
    "港盾保險的住院醫療方案，保障重心放在住院病房與手術開支，並附帶住院前後門診。適用於已透過公司或個人醫療計劃覆蓋日常門診、但希望補上較大住院風險的家庭。",
  eligibility: {
    minAge: 0,
    maxAge: 70,
    residency: "須為香港居民並連續居港滿 1 年",
    healthDeclaration: true,
    occupationLimits: true,
    notes: [
      "未滿 18 歲投保須由家長作為監護人簽署",
      "任職高危行業人士可能需要加費或受限於某個職位類別",
    ],
  },
  coverage: hsMed01Coverage,
  exclusions: hsMed01Exclusions,
  deductible: {
    hasDeductible: true,
    value: "每次住院 HK$5,000",
    basis: "每次住院",
    sourceIds: ["src-hs-med-01-terms"],
  },
  waitingPeriod: {
    hasWaitingPeriod: true,
    value: "意外：30 日；疾病：180 日",
    sourceIds: ["src-hs-med-01-terms"],
  },
  renewal: {
    type: "guaranteed_renewal",
    label: "保證續保",
    description:
      "在保單生效日起計的 5 個保單年度內，保險公司保證不因健康狀況或索償紀錄而拒絕續保。",
    years: 5,
    sourceIds: ["src-hs-med-01-terms"],
  },
  premiumExamples: [
    {
      label: "30 歲・非吸煙・自願投保",
      assumptions: "30 歲、非吸煙、一般文職、沒有已知病症",
      annualPremium: 2880,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
    {
      label: "45 歲・非吸煙・自願投保",
      assumptions: "45 歲、非吸煙、保費按年齡分級",
      annualPremium: 6480,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: [
    "住院保障額高",
    "保證續保 5 年",
    "保費按年齡分級",
    "設有住院前後門診",
  ],
  termPoints: [
    {
      title: "自付額是關鍵變數",
      detail:
        "每次住院自付 HK$5,000 代表每次入院要先自己付這筆錢。住院次數多的話，總自付額會很可觀，比較時必須用實際住院頻率估算。",
    },
    {
      title: "續保年期結束後要重新核保",
      detail:
        "5 年保證續保期滿後，保險公司可按當時健康狀況重新定價或拒絕續保。",
    },
    {
      title: "等待期對新病是關鍵",
      detail: "疾病等待期 180 日，投保後首 6 個月內發病基本不獲保障。",
    },
  ],
  sourceDocuments: [
    terms("hs-med-01", "港盾保險", "守望住院醫療", "v3.2", "2025-10-01"),
    sheet("hs-med-01", "港盾保險", "守望住院醫療", "2025 年版", "2025-10-01"),
  ],
  verification: {
    status: "verified",
    lastReviewedAt: REVIEWED,
  },
  paymentOptions: ["按年繳付", "按月繳付"],
  termsVersion: "v3.2",
  updatedAt: UPDATED,
  isDemo: true,
};

// ------------------------------------------------------------
// 2. 港盾 · 全包醫療（部分核實：保費為示例）
// ------------------------------------------------------------
export const productHsMed02: InsuranceProduct = {
  id: "hs-med-02",
  slug: "harbor-shield-comprehensive-plan",
  name: "港盾「全包」住院及門診計劃",
  nameEn: "Harbor Shield Comprehensive Plan",
  insurerId: "harbor-shield",
  category: "medical",
  tagline: "住院與門診合併計算的低自付額方案",
  description:
    "在同一網絡內把住院、門急症及門診合併為一個共同自付額，適合門診需求高、預計全年多次求診的家庭。代價是保費相對較高，且必須使用指定醫療網絡。",
  eligibility: {
    minAge: 0,
    maxAge: 65,
    residency: "須為香港居民",
    healthDeclaration: true,
    occupationLimits: false,
    notes: ["指定網絡以外的就診只可索償門急症部分"],
  },
  coverage: [
    {
      id: "hs-med-02-c1",
      category: "hospital",
      name: "住院病房費",
      summary: "網絡內住院的病房開支。",
      limit: "每日最高 HK$12,000，每年最高 HK$500,000",
      highlight: true,
      sourceIds: ["src-hs-med-02-terms"],
    },
    {
      id: "hs-med-02-c2",
      category: "surgical",
      name: "手術費用",
      summary: "網絡內進行的住院手術開支。",
      limit: "每宗手術最高 HK$200,000",
      highlight: true,
      sourceIds: ["src-hs-med-02-terms"],
    },
    {
      id: "hs-med-02-c3",
      category: "outpatient",
      name: "門診（普通科及專科）",
      summary: "網絡內普通科及專科門診，每宗設有共同自付額。",
      limit: "每年最高 HK$80,000",
      highlight: true,
      sourceIds: ["src-hs-med-02-sheet"],
    },
    {
      id: "hs-med-02-c4",
      category: "outpatient",
      name: "門急症",
      summary: "門診急症室的診症及檢查開支。",
      limit: "每次最高 HK$2,500",
      sourceIds: ["src-hs-med-02-sheet"],
    },
  ],
  exclusions: [
    {
      id: "hs-med-02-e1",
      name: "非指定網絡的門診",
      description: "於指定網絡外診症的門診開支不獲保障。",
      sourceIds: ["src-hs-med-02-terms"],
    },
    {
      id: "hs-med-02-e2",
      name: "牙科及常規護理",
      description: "洗牙、補牙及牙科治療不屬本計劃保障範圍。",
      sourceIds: ["src-hs-med-02-terms"],
    },
    {
      id: "hs-med-02-e3",
      name: "處方藥物及非處方藥",
      description: "門診處方的藥物費用不在保障範圍內。",
      sourceIds: ["src-hs-med-02-sheet"],
    },
  ],
  deductible: {
    hasDeductible: true,
    value: "每年共同自付額 HK$2,000",
    basis: "每年（住院及門診合併計算）",
    sourceIds: ["src-hs-med-02-terms"],
  },
  waitingPeriod: {
    hasWaitingPeriod: true,
    value: "意外：30 日；疾病：90 日",
    sourceIds: ["src-hs-med-02-terms"],
  },
  renewal: {
    type: "guaranteed_renewal_period",
    label: "保證續保年期至 75 歲",
    description:
      "保單年期內不重新核保，但保費會按年齡調整；75 歲後按公司當時條款續保。",
    years: 1,
    sourceIds: ["src-hs-med-02-terms"],
  },
  premiumExamples: [
    {
      label: "35 歲・非吸煙・自願投保",
      assumptions: "35 歲、非吸煙、自願投保、住院及門診合併自付額",
      annualPremium: 9600,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: [
    "住院門診合併自付額",
    "門診保障額較高",
    "指定醫療網絡",
    "覆蓋至 75 歲",
  ],
  termPoints: [
    {
      title: "共同自付額改變了成本結構",
      detail:
        "住院與門診共用同一自付額，代表你住院次數多，用盡自付額後的門診就近乎免費。",
    },
    {
      title: "網絡限制是硬成本",
      detail:
        "指定網絡以外門診不獲保障，若你常去的診所在網絡外，實際開支會高於保費差距。",
    },
  ],
  sourceDocuments: [
    terms("hs-med-02", "港盾保險", "全包住院及門診", "v2.8", "2025-08-15"),
    sheet("hs-med-02", "港盾保險", "全包住院及門診", "2025 年版", "2025-08-15"),
  ],
  verification: {
    status: "partially_verified",
    lastReviewedAt: REVIEWED,
    unverifiedFields: ["保費示例數字"],
  },
  paymentOptions: ["按年繳付"],
  termsVersion: "v2.8",
  updatedAt: UPDATED,
  isDemo: true,
};

// ------------------------------------------------------------
// 3. 港盾 · 定期人壽（尚未核實）
// ------------------------------------------------------------
export const productHsLife01: InsuranceProduct = {
  id: "hs-life-01",
  slug: "harbor-shield-term-life",
  name: "港盾「定年」定期人壽保險",
  nameEn: "Harbor Shield Term Life",
  insurerId: "harbor-shield",
  category: "life",
  tagline: "保費固定、條款簡單的保障期身故保障",
  description:
    "在指定保障年期內提供身故保障，保費在年期內不變。產品結構最簡單，但不含儲蓄成分，也不保證續保，適合已有其他資產配置的客戶。",
  eligibility: {
    minAge: 18,
    maxAge: 60,
    residency: "須為香港居民",
    healthDeclaration: true,
    occupationLimits: true,
    notes: ["保障年期選項：10 年、20 年、30 年或至 70 歲"],
  },
  coverage: [
    {
      id: "hs-life-01-c1",
      category: "death",
      name: "身故保障",
      summary: "保障期內身故或因指定疾病身故，支付基本保額。",
      limit: "HK$300,000 – HK$2,000,000（按投保年齡及年期）",
      highlight: true,
      sourceIds: ["src-hs-life-01-terms"],
    },
    {
      id: "hs-life-01-c2",
      category: "other",
      name: "全殘保障",
      summary: "因保單列明疾病或傷殘導致完全殘廢。",
      limit: "與基本保額相同",
      sourceIds: ["src-hs-life-01-terms"],
    },
  ],
  exclusions: [
    {
      id: "hs-life-01-e1",
      name: "首年自殺不保",
      description: "保單生效首 13 個月內因自殺身故不獲保障。",
      sourceIds: ["src-hs-life-01-terms"],
    },
    {
      id: "hs-life-01-e2",
      name: "參與高危活動",
      description: "參與格鬥、登山、競速等列明高危活動期間身故不保。",
      sourceIds: ["src-hs-life-01-terms"],
    },
  ],
  deductible: {
    hasDeductible: false,
    sourceIds: [],
  },
  waitingPeriod: {
    hasWaitingPeriod: false,
    sourceIds: [],
  },
  renewal: {
    type: "non_guaranteed",
    label: "不保證續保",
    description:
      "保障年期屆滿後不保證續保。到期後的保費按當時年齡及風險重新計算，亦可選擇不再續保。",
    sourceIds: ["src-hs-life-01-terms"],
  },
  premiumExamples: [
    {
      label: "30 歲・非吸煙・20 年保障",
      assumptions: "30 歲、非吸煙、基本保額 HK$1,000,000、20 年保障期",
      annualPremium: 2100,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["保費年期內固定", "條款簡單", "保額可選範圍大"],
  termPoints: [
    {
      title: "沒有儲蓄成分",
      detail:
        "定期人壽屬純保障產品，保費用完即止，保障期滿沒有現金價值。若你已經有足夠的被動收入，考慮這類產品是為了填補缺口，而非累積資產。",
    },
    {
      title: "續保時的年齡成本",
      detail:
        "若選擇續保，保費會按屆時年齡重新定價，通常明顯高於原本年齡的保費。",
    },
  ],

  sourceDocuments: [
    terms("hs-life-01", "港盾保險", "定年定期人壽", "v2.4", "2025-07-15"),
    sheet("hs-life-01", "港盾保險", "定年定期人壽", "2025 年版", "2025-07-15"),
  ],
  verification: {
    status: "unverified",
    lastReviewedAt: "2026-01-05",
    unverifiedFields: ["保障範圍細項", "保費示例數字"],
  },
  paymentOptions: ["按年繳付", "按月繳付"],
  termsVersion: "v1.9",
  updatedAt: "2026-01-05",
  isDemo: true,
};

// ------------------------------------------------------------
// 4. 楓葉 · 守護危疾（已核實）
// ------------------------------------------------------------
export const productMlCi01: InsuranceProduct = {
  id: "ml-ci-01",
  slug: "maple-life-shield-critical-illness",
  name: "楓葉「守護」危疾保障計劃",
  nameEn: "Maple Life Shield Critical Illness",
  insurerId: "maple-life",
  category: "critical-illness",
  tagline: "早期危疾亦可赔付的一次性保障",
  description:
    "受保人在保障期內確診指定危疾，可一次性獲得基本保額，用於應付治療期間的收入中斷及康復開支。此計劃的特色是把早期癌症及心臟病也納入理賠範圍。",
  eligibility: {
    minAge: 0,
    maxAge: 60,
    residency: "須為香港居民",
    healthDeclaration: true,
    occupationLimits: true,
    notes: ["0–15 歲投保限於指定兒童危疾清單", "吸煙人士可能被加費"],
  },
  coverage: [
    {
      id: "ml-ci-01-c1",
      category: "critical",
      name: "癌症保障",
      summary: "確診癌症即赔付基本保額，早期癌症亦包括在內。",
      limit: "基本保額 HK$300,000 – HK$1,500,000",
      highlight: true,
      sourceIds: ["src-ml-ci-01-terms"],
    },
    {
      id: "ml-ci-01-c2",
      category: "critical",
      name: "心臟病保障",
      summary: "須符合條款列明的心臟病定義及嚴重程度。",
      limit: "基本保額的 100%",
      highlight: true,
      sourceIds: ["src-ml-ci-01-terms"],
    },
    {
      id: "ml-ci-01-c3",
      category: "critical",
      name: "中風保障",
      summary: "須符合條款對中風後遺症的定義。",
      limit: "基本保額的 100%",
      sourceIds: ["src-ml-ci-01-terms"],
    },
    {
      id: "ml-ci-01-c4",
      category: "critical",
      name: "器官衰竭保障",
      summary: "須器官功能永久性衰竭並符合條款定義。",
      limit: "基本保額的 100%",
      sourceIds: ["src-ml-ci-01-sheet"],
    },
    {
      id: "ml-ci-01-c5",
      category: "disability",
      name: "完全永久失明",
      summary: "雙眼視力永久完全喪失。",
      limit: "基本保額的 100%",
      sourceIds: ["src-ml-ci-01-terms"],
    },
  ],
  exclusions: [
    {
      id: "ml-ci-01-e1",
      name: "投保前已有的病症",
      description: "投保前 5 年內曾出現相關症狀或接受治療的病症不獲保障。",
      sourceIds: ["src-ml-ci-01-terms"],
    },
    {
      id: "ml-ci-01-e2",
      name: "非條款定義的狀況",
      description: "只有列入條款定義的危疾才可理賠，症狀相似但定義不符者不獲保障。",
      sourceIds: ["src-ml-ci-01-terms"],
    },
    {
      id: "ml-ci-01-e3",
      name: "生存期未滿的死亡",
      description: "受保人於確診後 30 日內去世，保單可能只退回保費。",
      sourceIds: ["src-ml-ci-01-terms"],
    },
  ],
  deductible: {
    hasDeductible: false,
    sourceIds: [],
  },
  waitingPeriod: {
    hasWaitingPeriod: true,
    value: "90 日（意外不適用）",
    sourceIds: ["src-ml-ci-01-terms"],
  },
  renewal: {
    type: "non_guaranteed",
    label: "不保證續保",
    description:
      "危疾保單一般不保證續保。此計劃在 10 個保單年度後可選擇續保，保費按屆時年齡及風險重新計算。",
    sourceIds: ["src-ml-ci-01-terms"],
  },
  premiumExamples: [
    {
      label: "30 歲・非吸煙・女性",
      assumptions: "30 歲、非吸煙、女性、基本保額 HK$500,000",
      annualPremium: 3480,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
    {
      label: "40 歲・非吸煙・男性",
      assumptions: "40 歲、非吸煙、男性、基本保額 HK$500,000",
      annualPremium: 6180,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: [
    "早期癌症可賠",
    "保額一次性支付",
    "涵蓋 30+ 項危疾",
    "可選投保年齡至 60 歲",
  ],
  termPoints: [
    {
      title: "危疾定義比疾病名稱重要",
      detail:
        "「癌症」在條款裏不是一個日常說法。早期癌症是否賠、賠多少，取決於保單是否列出相關定義。",
    },
    {
      title: "一次性支付而非實報實銷",
      detail:
        "危疾保額是一次性支付，不需出示發票。這與醫療保險的實報實銷性質完全不同。",
    },
  ],
  sourceDocuments: [
    terms("ml-ci-01", "楓葉人壽", "守護危疾", "v4.1", "2025-09-01"),
    sheet("ml-ci-01", "楓葉人壽", "守護危疾", "2025 年版", "2025-09-01"),
  ],
  verification: {
    status: "verified",
    lastReviewedAt: REVIEWED,
  },
  paymentOptions: ["按年繳付", "按季繳付", "按月繳付"],
  termsVersion: "v4.1",
  updatedAt: UPDATED,
  isDemo: true,
};

// ------------------------------------------------------------
// 5. 楓葉 · 多重危疾（部分核實）
// ------------------------------------------------------------
export const productMlCi02: InsuranceProduct = {
  id: "ml-ci-02",
  slug: "maple-life-multi-pay-critical-illness",
  name: "楓葉「多重」多次赔付危疾計劃",
  nameEn: "Maple Life Multi-Pay Critical Illness",
  insurerId: "maple-life",
  category: "critical-illness",
  tagline: "同一次保障期內可多次赔付的危疾保障",
  description:
    "與一次性赔付的危疾計劃不同，此計劃在保障期內第二次或之後確診符合條款的危疾時，可再次獲得賠償，用於覆蓋康復期及復發風險。",
  eligibility: {
    minAge: 18,
    maxAge: 55,
    residency: "須為香港居民",
    healthDeclaration: true,
    occupationLimits: true,
    notes: ["不適用於 0–17 歲投保"],
  },
  coverage: [
    {
      id: "ml-ci-02-c1",
      category: "critical",
      name: "首次危疾保障",
      summary: "首次確診符合條款定義的危疾，支付基本保額。",
      limit: "HK$500,000 – HK$3,000,000",
      highlight: true,
      sourceIds: ["src-ml-ci-02-terms"],
    },
    {
      id: "ml-ci-02-c2",
      category: "critical",
      name: "多次赔付保障",
      summary: "第二次及之後確診危疾，可再獲基本保額 50% 賠償。",
      limit: "每次基本保額的 50%，最多 4 次",
      highlight: true,
      sourceIds: ["src-ml-ci-02-terms"],
    },
    {
      id: "ml-ci-02-c3",
      category: "critical",
      name: "癌症額外赔付",
      summary: "若首次赔付項目為癌症，第二次赔付提高至基本保額 100%。",
      limit: "基本保額的 100%",
      sourceIds: ["src-ml-ci-02-sheet"],
    },
    {
      id: "ml-ci-02-c4",
      category: "death",
      name: "身故保障",
      summary: "保障期內身故，支付基本保額。",
      limit: "HK$500,000 – HK$3,000,000",
      sourceIds: ["src-ml-ci-02-terms"],
    },
  ],
  exclusions: [
    {
      id: "ml-ci-02-e1",
      name: "復發同一項危疾",
      description: "再次確診與首次相同的危疾，不再作多次赔付。",
      sourceIds: ["src-ml-ci-02-terms"],
    },
    {
      id: "ml-ci-02-e2",
      name: "條款間隔期內的賠付",
      description: "兩次赔付之間必須相隔條款列明的期間，否則第二次不獲賠。",
      sourceIds: ["src-ml-ci-02-terms"],
    },
  ],
  deductible: {
    hasDeductible: false,
    sourceIds: [],
  },
  waitingPeriod: {
    hasWaitingPeriod: true,
    value: "90 日",
    sourceIds: ["src-ml-ci-02-terms"],
  },
  renewal: {
    type: "non_guaranteed",
    label: "不保證續保",
    description: "保障年期屆滿後不保證續保，保費按屆時風險重新計算。",
    sourceIds: ["src-ml-ci-02-terms"],
  },
  premiumExamples: [
    {
      label: "35 歲・非吸煙・男性",
      assumptions: "35 歲、非吸煙、男性、基本保額 HK$1,000,000",
      annualPremium: 8900,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["最多 4 次賠付", "癌症賠付比例較高", "同時包含身故保障"],
  termPoints: [
    {
      title: "間隔期決定了多次赔付的實用性",
      detail:
        "如果兩次赔付之間需要相隔 12 個月，多次的設計在復發性疾病上的實際價值會打折扣。",
    },
  ],
  sourceDocuments: [
    terms("ml-ci-02", "楓葉人壽", "多重危疾", "v1.4", "2025-11-01"),
    sheet("ml-ci-02", "楓葉人壽", "多重危疾", "2025 年版", "2025-11-01"),
  ],
  verification: {
    status: "partially_verified",
    lastReviewedAt: REVIEWED,
    unverifiedFields: ["間隔期具體月數", "保費示例數字"],
  },
  paymentOptions: ["按年繳付"],
  termsVersion: "v1.4",
  updatedAt: UPDATED,
  isDemo: true,
};

// ------------------------------------------------------------
// 6. 楓葉 · 終身人壽（已核實）
// ------------------------------------------------------------
export const productMlLife01: InsuranceProduct = {
  id: "ml-life-01",
  slug: "maple-life-lifetime-protection",
  name: "楓葉「長願」終身人壽保險",
  nameEn: "Maple Life Lifetime Protection",
  insurerId: "maple-life",
  category: "life",
  tagline: "含保證現金值的終身保障，兼顧身故與傳承",
  description:
    "提供終身身故保障，同時設有保證現金值部分，於指定年期後每年增加。定位是「有儲蓄成分的身故保障」，而非純粹的保障型產品。",
  eligibility: {
    minAge: 18,
    maxAge: 65,
    residency: "須為香港居民",
    healthDeclaration: true,
    occupationLimits: true,
    notes: ["須通過財務需要評估", "保額需符合受保人的經濟能力"],
  },
  coverage: [
    {
      id: "ml-life-01-c1",
      category: "death",
      name: "終身身故保障",
      summary: "受保人身故時支付基本保額或保證現金值（以較高者為準）。",
      limit: "基本保額 HK$200,000 – HK$5,000,000",
      highlight: true,
      sourceIds: ["src-ml-life-01-terms"],
    },
    {
      id: "ml-life-01-c2",
      category: "other",
      name: "保證現金值",
      summary: "第 10 個保單年度起，每年按條款增加並保證不會減少。",
      limit: "按保單列明的保證現金值表",
      highlight: true,
      sourceIds: ["src-ml-life-01-terms"],
    },
    {
      id: "ml-life-01-c3",
      category: "retirement",
      name: "身故後一次性提取",
      summary: "受益人可選擇一次性提取或分期領取身故保障。",
      limit: "由受益人選擇",
      sourceIds: ["src-ml-life-01-sheet"],
    },
  ],
  exclusions: [
    {
      id: "ml-life-01-e1",
      name: "首年自殺不保",
      description: "保單生效首 13 個月內因自殺身故不獲保障。",
      sourceIds: ["src-ml-life-01-terms"],
    },
    {
      id: "ml-life-01-e2",
      name: "故意行為導致的死亡",
      description: "受保人故意犯罪或違反法律行為導致身故不保。",
      sourceIds: ["src-ml-life-01-terms"],
    },
  ],
  deductible: {
    hasDeductible: false,
    sourceIds: [],
  },
  waitingPeriod: {
    hasWaitingPeriod: false,
    sourceIds: [],
  },
  renewal: {
    type: "guaranteed_renewal",
    label: "終身有效",
    description:
      "只要按時繳交保費，保單有效至受保人身故，保證現金值不會因市場波動而減少。",
    sourceIds: ["src-ml-life-01-terms"],
  },
  premiumExamples: [
    {
      label: "35 歲・非吸煙・男性",
      assumptions:
        "35 歲、非吸煙、男性、基本保額 HK$1,000,000、保證交 20 年",
      annualPremium: 24500,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["保證現金值不會減少", "終身有效", "受益人可選分期領取"],
  termPoints: [
    {
      title: "保費能否交完是核心問題",
      detail:
        "長期儲蓄型產品常以「保證交 10 年／20 年」設計，之後保費需由保單現金值繳付。同一產品不同交費年期，保費差距可以很大。",
    },
    {
      title: "保證現金值不等於現金",
      detail:
        "保證現金值是保單上的數字，並非可即時取用的銀行存款，退保時實際價值可能低於該數字。",
    },
  ],
  sourceDocuments: [
    terms("ml-life-01", "楓葉人壽", "長願終身人壽", "v5.0", "2025-07-01"),
    sheet("ml-life-01", "楓葉人壽", "長願終身人壽", "2025 年版", "2025-07-01"),
  ],
  verification: {
    status: "verified",
    lastReviewedAt: REVIEWED,
  },
  paymentOptions: ["按年繳付", "按月繳付"],
  termsVersion: "v5.0",
  updatedAt: UPDATED,
  isDemo: true,
};

// ------------------------------------------------------------
// 7. 明康 · 門診住院綜合（已核實）
// ------------------------------------------------------------
export const productBcMed01: InsuranceProduct = {
  id: "bc-med-01",
  slug: "brightcare-outpatient-inpatient",
  name: "明康「康健」門診住院綜合計劃",
  nameEn: "BrightCare Outpatient & Inpatient Plan",
  insurerId: "brightcare",
  category: "medical",
  tagline: "門診次數不受次數限制的自付額方案",
  description:
    "住院與門診共用自付額，但門診不設次數上限，適合長期需要覆診的慢性病患者。與港盾「全包」的差別，主要在門診次數與網絡要求。",
  eligibility: {
    minAge: 0,
    maxAge: 70,
    residency: "須為香港居民",
    healthDeclaration: true,
    occupationLimits: false,
    notes: ["慢性病患者須申報病況"],
  },
  coverage: [
    {
      id: "bc-med-01-c1",
      category: "outpatient",
      name: "門診保障（不限次數）",
      summary: "普通科及專科門診，於自付額達標後不設次數上限。",
      limit: "每年最高 HK$120,000",
      highlight: true,
      sourceIds: ["src-bc-med-01-terms"],
    },
    {
      id: "bc-med-01-c2",
      category: "hospital",
      name: "住院病房費",
      summary: "因疾病或意外住院的病房開支。",
      limit: "每日最高 HK$10,000，每年最高 HK$400,000",
      highlight: true,
      sourceIds: ["src-bc-med-01-terms"],
    },
    {
      id: "bc-med-01-c3",
      category: "surgical",
      name: "手術費用",
      summary: "住院手術的醫療及相關開支。",
      limit: "每宗手術最高 HK$180,000",
      sourceIds: ["src-bc-med-01-sheet"],
    },
    {
      id: "bc-med-01-c4",
      category: "outpatient",
      name: "門急症",
      summary: "門急症室的診症及基本檢查。",
      limit: "每次最高 HK$2,000",
      sourceIds: ["src-bc-med-01-sheet"],
    },
  ],
  exclusions: [
    {
      id: "bc-med-01-e1",
      name: "維護及藥物費用",
      description: "定期維護、藥物及復康器材費用不在保障範圍。",
      sourceIds: ["src-bc-med-01-terms"],
    },
    {
      id: "bc-med-01-e2",
      name: "非必需的檢查項目",
      description: "沒有醫療必要的篩查性檢查不獲保障。",
      sourceIds: ["src-bc-med-01-terms"],
    },
  ],
  deductible: {
    hasDeductible: true,
    value: "每年 HK$1,500（住院及門診共用）",
    basis: "每年",
    sourceIds: ["src-bc-med-01-terms"],
  },
  waitingPeriod: {
    hasWaitingPeriod: true,
    value: "意外：30 日；疾病：90 日",
    sourceIds: ["src-bc-med-01-terms"],
  },
  renewal: {
    type: "guaranteed_renewal",
    label: "保證續保至 70 歲",
    description: "70 歲前不重新核保，保費按年齡調整。",
    sourceIds: ["src-bc-med-01-terms"],
  },
  premiumExamples: [
    {
      label: "40 歲・非吸煙・自願投保",
      assumptions: "40 歲、非吸煙、門診不限次數",
      annualPremium: 7200,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["門診不限次數", "住院門診共用自付額", "保證續保至 70 歲"],
  termPoints: [
    {
      title: "自付額低但保費高",
      detail:
        "低自付額必然反映在較高保費上。真正要比較的，是「自付額 + 每年保費」的總和，而不是單看保費。",
    },
  ],
  sourceDocuments: [
    terms("bc-med-01", "明康護理", "康健門診住院", "v3.0", "2025-09-20"),
    sheet("bc-med-01", "明康護理", "康健門診住院", "2025 年版", "2025-09-20"),
  ],
  verification: {
    status: "verified",
    lastReviewedAt: REVIEWED,
  },
  paymentOptions: ["按年繳付", "按月繳付"],
  termsVersion: "v3.0",
  updatedAt: UPDATED,
  isDemo: true,
};

// ------------------------------------------------------------
// 8. 明康 · 銀卡住院（原型模擬資料）
// ------------------------------------------------------------
export const productBcMed02: InsuranceProduct = {
  id: "bc-med-02",
  slug: "brightcare-silver-hospital",
  name: "明康「銀卡」住院保障計劃",
  nameEn: "BrightCare Silver Hospital Plan",
  insurerId: "brightcare",
  category: "medical",
  tagline: "基本住院保障，門診保障有限",
  /**
   * 原型示範：這個產品被標示為「贊助曝光」，
   * 用來展示搜索結果頁的付費區與自然區是分離的。
   *
   * 規則（不可動搖）：
   *   1. 帶這個標記的產品**不會**出現在自然結果排序裡。
   *   2. 它只會出現在獨立的「贊助結果」區，並附「贊助」徽章。
   *   3. 正式環境中任何付費曝光都必須如此標示。
   *   4. 這個標記不影響產品的核實狀態、資料完整度或比較結果。
   */
  sponsored: {
    isSponsored: true,
    sponsorName: "明康保險（原型示範）",
    relationship: "原型示範用的付費曝光位置，並非真實商業合作",
    excludedFromOrganicRanking: true,
  },
  description:
    "明康的入門住院方案，住院保障額與門診範圍都較低，保費相對便宜。適合已有公司團體醫療保險、只需要住院風險墊底的在職人士。",
  eligibility: {
    minAge: 18,
    maxAge: 60,
    residency: "須為香港居民",
    healthDeclaration: true,
    occupationLimits: true,
    notes: ["不接受 65 歲以上投保"],
  },
  coverage: [
    {
      id: "bc-med-02-c1",
      category: "hospital",
      name: "住院病房費",
      summary: "住院期間的病房開支。",
      limit: "每日最高 HK$6,000",
      highlight: true,
      sourceIds: ["src-bc-med-02-terms"],
    },
    {
      id: "bc-med-02-c2",
      category: "surgical",
      name: "手術費用",
      summary: "住院手術開支。",
      limit: "每宗手術最高 HK$90,000",
      sourceIds: ["src-bc-med-02-terms"],
    },
    {
      id: "bc-med-02-c3",
      category: "outpatient",
      name: "門急症",
      summary: "門急症室診症開支。",
      limit: "每次最高 HK$1,200",
      sourceIds: ["src-bc-med-02-sheet"],
    },
  ],
  exclusions: [
    {
      id: "bc-med-02-e1",
      name: "專科門診",
      description: "本計劃不保障專科門診。",
      sourceIds: ["src-bc-med-02-terms"],
    },
    {
      id: "bc-med-02-e2",
      name: "手術後護理",
      description: "手術後護理及復康療程不在保障範圍。",
      sourceIds: ["src-bc-med-02-terms"],
    },
  ],
  deductible: {
    hasDeductible: true,
    value: "每次住院 HK$8,000",
    basis: "每次住院",
    sourceIds: ["src-bc-med-02-terms"],
  },
  waitingPeriod: {
    hasWaitingPeriod: true,
    value: "意外：30 日；疾病：120 日",
    sourceIds: ["src-bc-med-02-terms"],
  },
  renewal: {
    type: "non_guaranteed",
    label: "不保證續保",
    description: "產品不保證續保，續保與否由保險公司按當時條款決定。",
    sourceIds: ["src-bc-med-02-terms"],
  },
  premiumExamples: [
    {
      label: "30 歲・非吸煙",
      assumptions: "30 歲、非吸煙、只保障住院",
      annualPremium: 1680,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["保費較低", "以住院為主", "門急症基本覆蓋"],
  termPoints: [
    {
      title: "自付額與保障額的比例",
      detail:
        "每日病房 HK$6,000 加上每次住院 HK$8,000 自付額，實際保障起點不算低，需要用實際住院情境估算。",
    },
  ],

  sourceDocuments: [
    terms("bc-med-02", "明康護理", "銀卡住院保障", "v2.1", "2025-06-10"),
    sheet("bc-med-02", "明康護理", "銀卡住院保障", "2025 年版", "2025-06-10"),
  ],
  verification: {
    status: "demo",
    lastReviewedAt: "2025-12-18",
    unverifiedFields: ["全部欄位"],
  },
  paymentOptions: ["按年繳付"],
  termsVersion: "v1.6",
  updatedAt: "2025-12-18",
  isDemo: true,
};

// ------------------------------------------------------------
// 9. 明康 · 輕疾（尚未核實）
// ------------------------------------------------------------
export const productBcCi01: InsuranceProduct = {
  id: "bc-ci-01",
  slug: "brightcare-early-critical-illness",
  name: "明康「早期」危疾保障計劃",
  nameEn: "BrightCare Early Critical Illness",
  insurerId: "brightcare",
  category: "critical-illness",
  tagline: "針對早期危疾的較低保額保障",
  description:
    "只覆蓋條款列明的早期危疾，保額較一般危疾計劃低，作用是讓早期發現時能有一筆一次性賠付，用於較昂貴的早期治療。",
  eligibility: {
    minAge: 18,
    maxAge: 55,
    residency: "須為香港居民",
    healthDeclaration: true,
    occupationLimits: false,
    notes: ["只覆蓋條款列明的早期危疾"],
  },
  coverage: [
    {
      id: "bc-ci-01-c1",
      category: "critical",
      name: "早期癌症保障",
      summary: "確診條款定義的早期癌症。",
      limit: "HK$100,000 – HK$500,000",
      highlight: true,
      sourceIds: ["src-bc-ci-01-terms"],
    },
    {
      id: "bc-ci-01-c2",
      category: "critical",
      name: "早期心臟病保障",
      summary: "須符合條款列明的早期心臟病定義。",
      limit: "HK$100,000 – HK$500,000",
      sourceIds: ["src-bc-ci-01-terms"],
    },
    {
      id: "bc-ci-01-c3",
      category: "critical",
      name: "器官早期病變保障",
      summary: "條款列明的器官早期病變情況。",
      limit: "HK$80,000 – HK$300,000",
      sourceIds: ["src-bc-ci-01-sheet"],
    },
  ],
  exclusions: [
    {
      id: "bc-ci-01-e1",
      name: "已屬後期危疾的情況",
      description:
        "已符合後期危疾定義的病情，只按後期條款處理，不適用本計劃。",
      sourceIds: ["src-bc-ci-01-terms"],
    },
    {
      id: "bc-ci-01-e2",
      name: "非條款列明的早期定義",
      description: "臨床定義與條款定義不一致時，以條款為準。",
      sourceIds: ["src-bc-ci-01-terms"],
    },
  ],
  deductible: {
    hasDeductible: false,
    sourceIds: [],
  },
  waitingPeriod: {
    hasWaitingPeriod: true,
    value: "90 日",
    sourceIds: ["src-bc-ci-01-terms"],
  },
  renewal: {
    type: "non_guaranteed",
    label: "不保證續保",
    description: "不保證續保，保費按屆時年齡重新計算。",
    sourceIds: ["src-bc-ci-01-terms"],
  },
  premiumExamples: [
    {
      label: "30 歲・非吸煙",
      assumptions: "30 歲、非吸煙、保額 HK$300,000",
      annualPremium: 1320,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["保費較低", "針對早期危疾", "可與醫療保險搭配"],
  termPoints: [
    {
      title: "早期定義必須逐項看",
      detail:
        "「早期」在不同條款裏指不同的事。例如某個計劃只賠原位癌，另一個可能賠第 1 期，兩者保費差距遠大於保額差距。",
    },
  ],

  sourceDocuments: [
    terms("bc-ci-01", "明康護理", "早期危疾保障", "v1.9", "2025-10-20"),
    sheet("bc-ci-01", "明康護理", "早期危疾保障", "2025 年版", "2025-10-20"),
  ],
  verification: {
    status: "unverified",
    lastReviewedAt: "2025-12-20",
    unverifiedFields: ["早期定義清單", "保費示例數字"],
  },
  paymentOptions: ["按年繳付", "按月繳付"],
  termsVersion: "v1.1",
  updatedAt: "2025-12-20",
  isDemo: true,
};

// ------------------------------------------------------------
// 10. 先驅 · 家庭人壽（部分核實）
// ------------------------------------------------------------
export const productPaLife01: InsuranceProduct = {
  id: "pa-life-01",
  slug: "pioneer-family-protection",
  name: "先驅「家安」家庭人壽保障",
  nameEn: "Pioneer Family Protection",
  insurerId: "pioneer-assurance",
  category: "life",
  tagline: "以家庭為單位的定期人壽保障",
  description:
    "以家庭為投保單位，主要供有未成年子女、且是家庭主要收入來源的客戶使用。保額按收入需要設定，不含任何儲蓄成分。",
  eligibility: {
    minAge: 18,
    maxAge: 55,
    residency: "須為香港居民",
    healthDeclaration: true,
    occupationLimits: true,
    notes: ["須為家庭主要收入來源", "保額上限按年齡及收入審批"],
  },
  coverage: [
    {
      id: "pa-life-01-c1",
      category: "death",
      name: "身故保障",
      summary: "保障期內身故支付基本保額。",
      limit: "HK$500,000 – HK$5,000,000（需收入證明）",
      highlight: true,
      sourceIds: ["src-pa-life-01-terms"],
    },
    {
      id: "pa-life-01-c2",
      category: "other",
      name: "全殘保障",
      summary: "因保單列明傷殘導致完全失去工作能力。",
      limit: "與基本保額相同",
      sourceIds: ["src-pa-life-01-terms"],
    },
    {
      id: "pa-life-01-c3",
      category: "other",
      name: "家屬身故保障",
      summary: "同一保單可為配偶附加輕微的身故保障。",
      limit: "HK$100,000 – HK$500,000",
      sourceIds: ["src-pa-life-01-sheet"],
    },
  ],
  exclusions: [
    {
      id: "pa-life-01-e1",
      name: "首年自殺不保",
      description: "首 13 個月內因自殺身故不保。",
      sourceIds: ["src-pa-life-01-terms"],
    },
    {
      id: "pa-life-01-e2",
      name: "超出保額的收入需求",
      description: "保額以經審批的收入需要為上限，超出部分不獲保障。",
      sourceIds: ["src-pa-life-01-terms"],
    },
  ],
  deductible: {
    hasDeductible: false,
    sourceIds: [],
  },
  waitingPeriod: {
    hasWaitingPeriod: false,
    sourceIds: [],
  },
  renewal: {
    type: "non_guaranteed",
    label: "不保證續保",
      description: "不保證續保，續保時按當時年齡重新定價。",
    sourceIds: ["src-pa-life-01-terms"],
  },
  premiumExamples: [
    {
      label: "38 歲・非吸煙・男性",
      assumptions: "38 歲、非吸煙、HK$3,000,000 保額、保障至 65 歲",
      annualPremium: 5400,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["按收入需要設定保額", "可附加配偶保障", "保障年期靈活"],
  termPoints: [
    {
      title: "保額由收入決定，不由產品決定",
      detail:
        "這類產品的保額上限取決於你的收入證明。同一產品，有人能買 HK$500 萬，有人只買到 HK$50 萬。",
    },
  ],
  sourceDocuments: [
    terms("pa-life-01", "先驅保險", "家安家庭人壽", "v2.3", "2025-08-01"),
    sheet("pa-life-01", "先驅保險", "家安家庭人壽", "2025 年版", "2025-08-01"),
  ],
  verification: {
    status: "partially_verified",
    lastReviewedAt: REVIEWED,
    unverifiedFields: ["保額上限規則", "保費示例數字"],
  },
  paymentOptions: ["按年繳付", "按月繳付"],
  termsVersion: "v2.3",
  updatedAt: UPDATED,
  isDemo: true,
};

// ------------------------------------------------------------
// 11. 先驅 · 旅遊（已核實）
// ------------------------------------------------------------
export const productPaTravel01: InsuranceProduct = {
  id: "pa-travel-01",
  slug: "pioneer-travel-plus",
  name: "先驅「暢遊」旅遊保險計劃",
  nameEn: "Pioneer Travel Plus",
  insurerId: "pioneer-assurance",
  category: "travel",
  tagline: "以醫療及緊急救援為主的行程保障",
  description:
    "保障行程期間的意外、疾病醫療開支及緊急救援送返費用。適合一至兩週的旅行行程，不保證涵蓋長期旅居。",
  eligibility: {
    minAge: 0,
    maxAge: 75,
    residency: "須為香港居民",
    healthDeclaration: false,
    occupationLimits: false,
    notes: ["每次行程最長 90 日"],
  },
  coverage: [
    {
      id: "pa-travel-01-c1",
      category: "medical",
      name: "境外醫療費用",
      summary: "行程期間因意外或疾病產生的醫療開支。",
      limit: "HK$800,000（每人）",
      highlight: true,
      sourceIds: ["src-pa-travel-01-terms"],
    },
    {
      id: "pa-travel-01-c2",
      category: "trip",
      name: "緊急救援及送返",
      summary: "醫療送返及遺體送返費用。",
      limit: "HK$500,000（每人）",
      highlight: true,
      sourceIds: ["src-pa-travel-01-terms"],
    },
    {
      id: "pa-travel-01-c3",
      category: "trip",
      name: "行程延誤及取消",
      summary: "因惡劣天氣或重大事故導致行程延誤或取消。",
      limit: "每日最高 HK$2,000，最長 10 日",
      sourceIds: ["src-pa-travel-01-sheet"],
    },
    {
      id: "pa-travel-01-c4",
      category: "property",
      name: "行李遺失",
      summary: "行程期間行李遺失或損壞。",
      limit: "每人最高 HK$15,000",
      sourceIds: ["src-pa-travel-01-sheet"],
    },
  ],
  exclusions: [
    {
      id: "pa-travel-01-e1",
      name: "危險活動",
      description:
        "潛水、滑雪、登山等高危活動期間的意外不保，除非已加購相關附加保障。",
      sourceIds: ["src-pa-travel-01-terms"],
    },
    {
      id: "pa-travel-01-e2",
      name: "已在出發前發生的狀況",
      description: "出發前已出現症狀或已受傷病所致的醫療開支不保。",
      sourceIds: ["src-pa-travel-01-terms"],
    },
  ],
  deductible: {
    hasDeductible: true,
    value: "HK$500 每次事故",
    basis: "每次事故",
    sourceIds: ["src-pa-travel-01-terms"],
  },
  waitingPeriod: {
    hasWaitingPeriod: false,
    sourceIds: [],
  },
  renewal: {
    type: "non_guaranteed",
    label: "按每次行程購買",
    description: "屬一次性保單，每次行程須重新購買，沒有續保概念。",
    sourceIds: ["src-pa-travel-01-terms"],
  },
  premiumExamples: [
    {
      label: "30 歲・7 日行程・亞洲",
      assumptions: "30 歲、7 日行程、亞洲地區、不含危險活動",
      annualPremium: 480,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["境外醫療額度高", "含緊急送返", "行程延誤保障"],
  termPoints: [
    {
      title: "看保障範圍是否包含你要去的地方",
      detail:
        "不少旅遊保險對特定國家或地區另設限制，亦有對某些活動的除外責任。出發前要逐項核對。",
    },
  ],
  sourceDocuments: [
    terms("pa-travel-01", "先驅保險", "暢遊旅遊", "v3.2", "2025-10-01"),
    sheet("pa-travel-01", "先驅保險", "暢遊旅遊", "2025 年版", "2025-10-01"),
  ],
  verification: {
    status: "verified",
    lastReviewedAt: REVIEWED,
  },
  paymentOptions: ["一次性繳付"],
  termsVersion: "v3.2",
  updatedAt: UPDATED,
  isDemo: true,
};

// ------------------------------------------------------------
// 12. 先驅 · 自駕旅遊（原型模擬）
// ------------------------------------------------------------
export const productPaTravel02: InsuranceProduct = {
  id: "pa-travel-02",
  slug: "pioneer-self-drive-travel",
  name: "先驅「自駕」跨境旅遊保險",
  nameEn: "Pioneer Self-Drive Travel",
  insurerId: "pioneer-assurance",
  category: "travel",
  tagline: "針對自駕跨境行程的車損與醫療保障",
  description:
    "在標準旅遊保障之上，加入自駕車輛車損及跨境道路救援。適合會自己開車跨境或跨境租車的旅客。",
  eligibility: {
    minAge: 21,
    maxAge: 70,
    residency: "須為香港居民並持有有效駕駛牌照",
    healthDeclaration: false,
    occupationLimits: false,
    notes: ["須持有有效本港駕照滿 2 年", "每次行程最長 30 日"],
  },
  coverage: [
    {
      id: "pa-travel-02-c1",
      category: "medical",
      name: "境外醫療費用",
      summary: "行程期間的醫療開支，額度高於一般旅遊計劃。",
      limit: "HK$1,500,000（每人）",
      highlight: true,
      sourceIds: ["src-pa-travel-02-terms"],
    },
    {
      id: "pa-travel-02-c2",
      category: "vehicle",
      name: "租車車損保障",
      summary: "租用車輛於行程期間的碰撞損壞。",
      limit: "自付額 HK$20,000，最高 HK$200,000",
      highlight: true,
      sourceIds: ["src-pa-travel-02-terms"],
    },
    {
      id: "pa-travel-02-c3",
      category: "vehicle",
      name: "道路救援",
      summary: "跨境道路上的拋錨、拖車及充電支援。",
      limit: "每次事故最高 HK$8,000",
      sourceIds: ["src-pa-travel-02-sheet"],
    },
    {
      id: "pa-travel-02-c4",
      category: "trip",
      name: "行程取消",
      summary: "因惡劣天氣或交通事故導致行程取消。",
      limit: "每人最高 HK$20,000",
      sourceIds: ["src-pa-travel-02-sheet"],
    },
  ],
  exclusions: [
    {
      id: "pa-travel-02-e1",
      name: "無有效牌照駕駛",
      description: "由未持有效駕照人士駕駛引致的損失不保。",
      sourceIds: ["src-pa-travel-02-terms"],
    },
    {
      id: "pa-travel-02-e2",
      name: "自車車損",
      description: "使用自己車輛出行時，車輛本身的損壞不在本計劃保障內。",
      sourceIds: ["src-pa-travel-02-terms"],
    },
  ],
  deductible: {
    hasDeductible: true,
    value: "車損自付額 HK$20,000",
    basis: "每次事故",
    sourceIds: ["src-pa-travel-02-terms"],
  },
  waitingPeriod: {
    hasWaitingPeriod: false,
    sourceIds: [],
  },
  renewal: {
    type: "non_guaranteed",
    label: "按每次行程購買",
    description: "一次性保單，每次行程重新購買。",
    sourceIds: ["src-pa-travel-02-terms"],
  },
  premiumExamples: [
    {
      label: "35 歲・10 日行程・跨境自駕",
      assumptions: "35 歲、10 日行程、跨境自駕、租車",
      annualPremium: 1180,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["自駕車損保障", "跨境道路救援", "境外醫療額度高"],
  termPoints: [
    {
      title: "自付額相對保費並不低",
      detail:
        "車損自付額 HK$20,000 高於整份保單保費，這是旅遊保險中常見的結構，特價行程更要看清楚。",
    },
  ],

  sourceDocuments: [
    terms("pa-travel-02", "先驅保險", "自駕跨境旅遊", "v1.6", "2025-05-30"),
    sheet("pa-travel-02", "先驅保險", "自駕跨境旅遊", "2025 年版", "2025-05-30"),
  ],
  verification: {
    status: "demo",
    lastReviewedAt: "2025-12-22",
    unverifiedFields: ["全部欄位"],
  },
  paymentOptions: ["一次性繳付"],
  termsVersion: "v1.3",
  updatedAt: "2025-12-22",
  isDemo: true,
};

// ------------------------------------------------------------
// 13. 先驅 · 家居（尚未核實）
// ------------------------------------------------------------
export const productPaHome01: InsuranceProduct = {
  id: "pa-home-01",
  slug: "pioneer-home-comprehensive",
  name: "先驅「安居」家居綜合保險",
  nameEn: "Pioneer Home Comprehensive",
  insurerId: "pioneer-assurance",
  category: "home",
  tagline: "家居財物、水損及第三者責任保障",
  description:
    "保障家居財物因火災、水浸等指定事故造成的損失，以及因家居事故引致的第三者人身或財物赔偿责任。",
  eligibility: {
    minAge: 18,
    maxAge: 75,
    residency: "須為香港業主或租客",
    healthDeclaration: false,
    occupationLimits: false,
    notes: ["須為投保單上列明的處所投保", "租客投保須取得業主同意"],
  },
  coverage: [
    {
      id: "pa-home-01-c1",
      category: "property",
      name: "家居財物保障",
      summary: "因指定事故導致的家居財物損失，按重置價值計算。",
      limit: "最高 HK$800,000",
      highlight: true,
      sourceIds: ["src-pa-home-01-terms"],
    },
    {
      id: "pa-home-01-c2",
      category: "property",
      name: "室內裝修保障",
      summary: "因指定事故造成的裝修及固定設施損失。",
      limit: "最高 HK$300,000",
      highlight: true,
      sourceIds: ["src-pa-home-01-terms"],
    },
    {
      id: "pa-home-01-c3",
      category: "liability",
      name: "第三者責任保障",
      summary: "因家居意外引致第三者人身傷亡或財物損失的賠償。",
      limit: "最高 HK$1,000,000",
      highlight: true,
      sourceIds: ["src-pa-home-01-sheet"],
    },
    {
      id: "pa-home-01-c4",
      category: "other",
      name: "臨時住所費用",
      summary: "因保障事故導致住所不可居住期間的臨時住宿開支。",
      limit: "每日最高 HK$2,000，最長 12 個月",
      sourceIds: ["src-pa-home-01-sheet"],
    },
  ],
  exclusions: [
    {
      id: "pa-home-01-e1",
      name: "未有申報的貴重物品",
      description: "超出保單列明上限的貴重物品不獲保障。",
      sourceIds: ["src-pa-home-01-terms"],
    },
    {
      id: "pa-home-01-e2",
      name: "空置或長期無人居住",
      description: "連續空置超過 90 日期間發生的事故不保。",
      sourceIds: ["src-pa-home-01-terms"],
    },
  ],
  deductible: {
    hasDeductible: true,
    value: "每次事故 HK$2,000",
    basis: "每次事故",
    sourceIds: ["src-pa-home-01-terms"],
  },
  waitingPeriod: {
    hasWaitingPeriod: false,
    sourceIds: [],
  },
  renewal: {
    type: "guaranteed_renewal",
    label: "保證續保 1 年",
    description: "每個保單年度結束後續保，條款內容不會因續保而改變。",
    years: 1,
    sourceIds: ["src-pa-home-01-terms"],
  },
  premiumExamples: [
    {
      label: "兩房單位・自住",
      assumptions: "約 500 平方呎自住單位、標準樓宇",
      annualPremium: 1980,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["室內裝修單獨保障", "第三者責任額度高", "含臨時住宿費用"],
  termPoints: [
    {
      title: "自付額與家居事故頻率",
      detail:
        "家居保險的自付額通常不高，但水浸等事故的頻率取決於住所狀況，例如是否靠近水管、是否在低層。",
    },
  ],

  sourceDocuments: [
    terms("pa-home-01", "先驅保險", "安居家居綜合", "v2.0", "2025-04-18"),
    sheet("pa-home-01", "先驅保險", "安居家居綜合", "2025 年版", "2025-04-18"),
  ],
  verification: {
    status: "unverified",
    lastReviewedAt: "2025-12-26",
    unverifiedFields: ["保障範圍細項", "保費示例數字"],
  },
  paymentOptions: ["按年繳付"],
  termsVersion: "v1.8",
  updatedAt: "2025-12-26",
  isDemo: true,
};

// ------------------------------------------------------------
// 14. 先驅 · 儲蓄退休（部分核實）
// ------------------------------------------------------------
export const productPaSavings01: InsuranceProduct = {
  id: "pa-savings-01",
  slug: "pioneer-retirement-savings",
  name: "先驅「長積」儲蓄退休計劃",
  nameEn: "Pioneer Retirement Savings Plan",
  insurerId: "pioneer-assurance",
  category: "savings-retirement",
  tagline: "以退休供款為目標的儲蓄型產品",
  description:
    "以累積退休儲蓄為目標，附帶身故保障。此類產品的非保證利益（紅利）取決於投資表現，應把保證與非保證部分分開看。",
  eligibility: {
    minAge: 18,
    maxAge: 65,
    residency: "須為香港居民",
    healthDeclaration: true,
    occupationLimits: false,
    notes: ["建議於 40 歲前開始投保", "須符合最低年繳保費"],
  },
  coverage: [
    {
      id: "pa-savings-01-c1",
      category: "retirement",
      name: "退休供款累積",
      summary: "保費連同非保證紅利累積成退休儲蓄。",
      limit: "按保單列明的紅利表，非保證",
      highlight: true,
      sourceIds: ["src-pa-savings-01-terms"],
    },
    {
      id: "pa-savings-01-c2",
      category: "death",
      name: "身故保障",
      summary: "身故時支付基本保額予受益人。",
      limit: "HK$100,000 – HK$1,000,000",
      highlight: true,
      sourceIds: ["src-pa-savings-01-terms"],
    },
    {
      id: "pa-savings-01-c3",
      category: "retirement",
      name: "終身提取選項",
      summary: "到達指定年齡後可選擇終身提取。",
      limit: "按保單列明的提取方式",
      sourceIds: ["src-pa-savings-01-sheet"],
    },
  ],
  exclusions: [
    {
      id: "pa-savings-01-e1",
      name: "紅利不保證",
      description: "非保證紅利並非保險公司承諾，最低可能為零。",
      sourceIds: ["src-pa-savings-01-terms"],
    },
    {
      id: "pa-savings-01-e2",
      name: "早期退保的損失",
      description: "早於指定年期退保會被扣除部分累積價值。",
      sourceIds: ["src-pa-savings-01-terms"],
    },
  ],
  deductible: {
    hasDeductible: false,
    sourceIds: [],
  },
  waitingPeriod: {
    hasWaitingPeriod: true,
    value: "90 日（身故保障不適用）",
    sourceIds: ["src-pa-savings-01-terms"],
  },
  renewal: {
    type: "guaranteed_renewal",
    label: "保證續保至 65 歲",
    description: "續保期間保費按公司條款調整，保證利益不受影響。",
    sourceIds: ["src-pa-savings-01-terms"],
  },
  premiumExamples: [
    {
      label: "30 歲・每年供款 HK$50,000",
      assumptions: "30 歲、每年供款 HK$50,000、繳付 10 年",
      annualPremium: 50000,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["保證與非保證利益分開列示", "可選終身提取", "附帶身故保障"],
  termPoints: [
    {
      title: "把保證與非保證分開算",
      detail:
        "比較這類產品時，最低只應以保證部分計算。用樂觀的紅利演示去比較，結論往往會完全相反。",
    },
  ],
  sourceDocuments: [
    terms("pa-savings-01", "先驅保險", "長積儲蓄退休", "v2.1", "2025-06-20"),
    sheet("pa-savings-01", "先驅保險", "長積儲蓄退休", "2025 年版", "2025-06-20"),
  ],
  verification: {
    status: "partially_verified",
    lastReviewedAt: "2026-01-10",
    unverifiedFields: ["紅利演示數字", "提取方式的具體條款"],
  },
  paymentOptions: ["按年繳付", "按月繳付"],
  termsVersion: "v2.1",
  updatedAt: "2026-01-10",
  isDemo: true,
};

// ------------------------------------------------------------
// 15. 港盾 · 汽車（原型模擬）
// ------------------------------------------------------------
export const productHsMotor01: InsuranceProduct = {
  id: "hs-motor-01",
  slug: "harbor-shield-motor-plan",
  name: "港盾「安途」私家車保險",
  nameEn: "Harbor Shield Motor Plan",
  insurerId: "harbor-shield",
  category: "motor",
  tagline: "以使用性質及駕駛人紀錄定保費的車險",
  description:
    "私家車綜合保險。第三者責任額度高，並按駕駛人年齡、經驗及車齡分級定保費。示範同一平台如何處理另一種完全不同結構的產品。",
  eligibility: {
    minAge: 18,
    maxAge: 75,
    residency: "須為香港居民並持有有效駕照",
    healthDeclaration: false,
    occupationLimits: false,
    notes: ["需申報主要駕駛人", "持牌年資影響保費分級"],
  },
  coverage: [
    {
      id: "hs-motor-01-c1",
      category: "liability",
      name: "第三者責任保障",
      summary: "車禍中引致第三者人身傷亡或財物損失的賠償責任。",
      limit: "最高 HK$20,000,000",
      highlight: true,
      sourceIds: ["src-hs-motor-01-terms"],
    },
    {
      id: "hs-motor-01-c2",
      category: "vehicle",
      name: "車損保障",
      summary: "車輛因碰撞或盜竊造成的損失。",
      limit: "按重置價值，自付額 HK$5,000",
      highlight: true,
      sourceIds: ["src-hs-motor-01-terms"],
    },
    {
      id: "hs-motor-01-c3",
      category: "property",
      name: "車內個人物品",
      summary: "車內個人物品因車禍受損。",
      limit: "最高 HK$5,000",
      sourceIds: ["src-hs-motor-01-sheet"],
    },
  ],
  exclusions: [
    {
      id: "hs-motor-01-e1",
      name: "未經批准的駕駛人",
      description: "由未在保單申報的駕駛人駕駛引致的損失不保。",
      sourceIds: ["src-hs-motor-01-terms"],
    },
    {
      id: "hs-motor-01-e2",
      name: "車身磨損及內部損壞",
      description: "漆面磨損、車內飾物損壞不屬車損保障範圍。",
      sourceIds: ["src-hs-motor-01-terms"],
    },
  ],
  deductible: {
    hasDeductible: true,
    value: "車損自付額 HK$5,000",
    basis: "每次事故",
    sourceIds: ["src-hs-motor-01-terms"],
  },
  waitingPeriod: {
    hasWaitingPeriod: false,
    sourceIds: [],
  },
  renewal: {
    type: "non_guaranteed",
    label: "不保證續保",
    description:
      "車險按年續保，保險公司可按索償紀錄及市場情況調整保費，亦可拒絕續保。",
    sourceIds: ["src-hs-motor-01-terms"],
  },
  premiumExamples: [
    {
      label: "30 歲駕駛・私家車",
      assumptions: "30 歲、持牌 5 年、1200cc 私家車",
      annualPremium: 6800,
      currency: "HKD",
      isExample: true,
      sourceIds: [],
    },
  ],
  features: ["第三者責任額度高", "按持牌年資分級", "涵蓋車內物品"],
  termPoints: [
    {
      title: "車險的核心變數是索償紀錄",
      detail:
        "同一部車、同一個人，續保時保費可能相差數倍。比較車險時，重點是續保機制而非單一保費數字。",
    },
  ],

  sourceDocuments: [
    terms("hs-motor-01", "港盾保險", "安途私家車", "v3.0", "2025-09-12"),
    sheet("hs-motor-01", "港盾保險", "安途私家車", "2025 年版", "2025-09-12"),
  ],
  verification: {
    status: "demo",
    lastReviewedAt: "2025-12-30",
    unverifiedFields: ["全部欄位"],
  },
  paymentOptions: ["按年繳付"],
  termsVersion: "v1.2",
  updatedAt: "2025-12-30",
  isDemo: true,
};

// ------------------------------------------------------------
// 匯出
// ------------------------------------------------------------

export const products: InsuranceProduct[] = [
  productHsMed01,
  productHsMed02,
  productHsLife01,
  productMlCi01,
  productMlCi02,
  productMlLife01,
  productBcMed01,
  productBcMed02,
  productBcCi01,
  productPaLife01,
  productPaTravel01,
  productPaTravel02,
  productPaHome01,
  productPaSavings01,
  productHsMotor01,
];

export const productMap: Record<string, InsuranceProduct> = Object.fromEntries(
  products.map((p) => [p.id, p]),
);

export function getProduct(id: string): InsuranceProduct | undefined {
  return productMap[id];
}

export function getProductBySlug(slug: string): InsuranceProduct | undefined {
  return products.find((p) => p.slug === slug);
}

/** 依保險公司 id 取得旗下產品 */
export function getProductsByInsurer(insurerId: string): InsuranceProduct[] {
  return products.filter((p) => p.insurerId === insurerId);
}

/** 取產品的最低保費示例（用於列表顯示） */
export function lowestPremium(p: InsuranceProduct): number | null {
  if (!p.premiumExamples.length) return null;
  return Math.min(...p.premiumExamples.map((e) => e.annualPremium));
}
