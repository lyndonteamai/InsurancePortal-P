import type { Insurer } from "./types";

// ============================================================
// 保險公司實體 (Insurer Entity)
// ============================================================
// 保險公司在 V2 是一級實體，不再只是產品上的一個字串欄位。
// 日後接入真實 API 時，這裡就是 insurer registry 的落點。
// 注意：以下全部為原型的虛構公司，並非真實保險公司。
// ============================================================

export const insurers: Insurer[] = [
  {
    id: "harbor-shield",
    slug: "harbor-shield",
    name: "港盾保險",
    nameEn: "Harbor Shield Insurance",
    description:
      "原型虛構保險公司。定位為以醫療保障為核心的直保公司，產品線集中於住院及手術保障，條款設計偏向自付額較低的住院方案。",
    founded: 1998,
    focus: ["醫療保險", "住院保障", "自付額設計"],
    website: null,
    regulator: "原型資料，未接駁監管機構登記資料",
    productIds: ["hs-med-01", "hs-med-02", "hs-life-01"],
    updatedAt: "2026-01-18",
    isDemo: true,
  },
  {
    id: "maple-life",
    slug: "maple-life",
    name: "楓葉人壽",
    nameEn: "Maple Life Insurance",
    description:
      "原型虛構保險公司。以危疾與長身故保障見稱，條款同時提供分紅與保證選擇，產品線涵蓋兒童與成人兩種投保年齡段。",
    founded: 2004,
    focus: ["危疾保險", "人壽保險", "分紅與保證選擇"],
    website: null,
    regulator: "原型資料，未接駁監管機構登記資料",
    productIds: ["ml-ci-01", "ml-ci-02", "ml-life-01"],
    updatedAt: "2026-01-20",
    isDemo: true,
  },
  {
    id: "brightcare",
    slug: "brightcare",
    name: "明康護理",
    nameEn: "BrightCare Health",
    description:
      "原型虛構保險公司。專注醫療保障，特色是門診與住院合併設計，並提供較長的門診保障期，用於示範不同保障結構的差異。",
    founded: 2011,
    focus: ["醫療保險", "門診保障", "住院加項"],
    website: null,
    regulator: "原型資料，未接駁監管機構登記資料",
    productIds: ["bc-med-01", "bc-med-02", "bc-ci-01"],
    updatedAt: "2026-01-12",
    isDemo: true,
  },
  {
    id: "pioneer-assurance",
    slug: "pioneer-assurance",
    name: "先驅保險",
    nameEn: "Pioneer Assurance",
    description:
      "原型虛構保險公司。產品線最廣，涵蓋旅遊、家居及儲蓄退休三個範疇，用於示範同一平台如何容納不同類型的產品資料。",
    founded: 1995,
    focus: ["旅遊保險", "家居保險", "儲蓄退休保險"],
    website: null,
    regulator: "原型資料，未接駁監管機構登記資料",
    productIds: ["pa-life-01", "pa-travel-01", "pa-travel-02", "pa-home-01", "pa-savings-01"],
    updatedAt: "2026-01-15",
    isDemo: true,
  },
];

export const insurerMap: Record<string, Insurer> = Object.fromEntries(
  insurers.map((i) => [i.id, i]),
);

export function getInsurer(id: string): Insurer | undefined {
  return insurerMap[id];
}

export function getInsurerBySlug(slug: string): Insurer | undefined {
  return insurers.find((i) => i.slug === slug);
}
