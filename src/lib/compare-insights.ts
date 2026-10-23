import type { InsuranceProduct, ProductCategory, Evidence } from "@/data/types";
import { CATEGORY_LABELS } from "@/data/types";
import { getInsurer } from "@/data/insurers";
import { getEvidence } from "@/data/evidence";

// ============================================================
// 比較引擎 V2 — 四個層次
// ============================================================
//   Level 1  快速差異（自動產生 3 個最關鍵的差別）
//   Level 2  完整比較表（結構化欄位，資料缺失顯示「資料未提供」）
//   Level 3  差異解釋（為甚麼會有這些差別）
//   Level 4  應問的問題（自動生成清單）
//
// 設計原則：解釋「差異從哪裡來」，而不是給排名。
// 任何一層都不允許出現「最適合你」「最好」「第一名」這類字眼。
// ============================================================

export const MISSING_DATA = "資料未提供";

export type DifferenceKind =
  | "deductible"
  | "coverage"
  | "renewal"
  | "premium"
  | "eligibility"
  | "exclusion"
  | "waiting"
  | "verification";

export type Difference = {
  kind: DifferenceKind;
  title: string;
  /** 每個產品的對應值（依 selected 順序） */
  values: { productId: string; text: string; note?: string }[];
  /** 為甚麼會有這個差異 */
  explanation: string;
  /** 這個差異對用戶的實務影響 */
  impact: string;
};

export type ComparisonRow = {
  label: string;
  group: string;
  /** 每個產品的顯示值；null 表示資料未提供 */
  values: (string | null)[];
  /** 若此欄在產品之間不同，給一個簡短標記 */
  differs?: boolean;
  hint?: string;
  /**
   * 每個產品的證據（Evidence-Based Comparison）。
   * 與 values 一一對應：使用者點擊任何一個數值，就能看到它背後的來源。
   * 沒有證據時這裡是 null —— UI 必須如實顯示「尚未有來源」，
   * 不可以用模糊字眼掩蓋資料缺口。
   */
  evidences?: (Evidence | null)[];
};

// ------------------------------------------------------------
// Level 1：快速差異
// ------------------------------------------------------------

function deductibleText(p: InsuranceProduct): string {
  if (!p.deductible) return MISSING_DATA;
  if (!p.deductible.hasDeductible) return "無自付額";
  return p.deductible.value ?? MISSING_DATA;
}

function renewalText(p: InsuranceProduct): string {
  if (!p.renewal) return MISSING_DATA;
  return p.renewal.label;
}

function premiumText(p: InsuranceProduct): string {
  if (!p.premiumExamples.length) return MISSING_DATA;
  const lows = p.premiumExamples.map((e) => e.annualPremium);
  const min = Math.min(...lows);
  const max = Math.max(...lows);
  if (min === max) return `HK$${min.toLocaleString()}`;
  return `HK$${min.toLocaleString()} – ${max.toLocaleString()}`;
}

function ageText(p: InsuranceProduct): string {
  const { minAge, maxAge } = p.eligibility;
  if (minAge == null && maxAge == null) return MISSING_DATA;
  if (minAge != null && maxAge != null) return `${minAge} – ${maxAge} 歲`;
  if (minAge != null) return `${minAge} 歲起`;
  return `至 ${maxAge} 歲`;
}

/** 依據資料差異程度，挑出最多 3 個最關鍵的差異 */
export function buildDifferences(
  selected: InsuranceProduct[],
): Difference[] {
  if (selected.length < 2) return [];

  const candidates: Difference[] = [];

  // 1. 自付額
  const dedValues = selected.map((p) => ({
    productId: p.id,
    text: deductibleText(p),
    note: p.deductible?.basis,
  }));
  if (new Set(dedValues.map((v) => v.text)).size > 1) {
    candidates.push({
      kind: "deductible",
      title: "自付額結構",
      values: dedValues,
      explanation:
        "這些產品的自付額採用不同計算基礎（每次事故、每個保單年度，或兩者共用）。計算基礎不同，即使金額數字相近，實際承擔的總額可以差很遠。",
      impact:
        "用自己的就醫次數估算一次：如果一年入院兩次，「每次 HK$5,000」等於自付 HK$10,000，而「每年 HK$2,000」只等於 HK$2,000。",
    });
  }

  // 2. 保障範圍
  const covCounts = selected.map((p) => p.coverage.length);
  if (new Set(covCounts).size > 1) {
    candidates.push({
      kind: "coverage",
      title: "保障項目數量與層次",
      values: selected.map((p) => ({
        productId: p.id,
        text: `${p.coverage.length} 項主要保障`,
        note: p.coverage
          .filter((c) => c.highlight)
          .map((c) => c.name)
          .join("、"),
      })),
      explanation:
        "保障項目數量反映產品的設計重點：項目多不代表覆蓋較廣，可能只是把同一項保障拆細。要看的是有沒有覆蓋你實際會用到的那一類（例如門診不限次數、危疾早期病變）。",
      impact:
        "逐項比對而不是看數量。特別留意你必定會用到但對方沒有的那一項，例如專科門診或早期危疾。",
    });
  }

  // 3. 續保
  const renValues = selected.map((p) => ({
    productId: p.id,
    text: renewalText(p),
    note: p.renewal?.description,
  }));
  if (new Set(renValues.map((v) => v.text)).size > 1) {
    candidates.push({
      kind: "renewal",
      title: "續保安排",
      values: renValues,
      explanation:
        "續保安排決定你的長期成本可預測性。保證續保的意思是期內不重新核保，但保費通常仍會隨年齡調整；不保證續保則代表保險公司可重新定價，甚至拒絕續保。",
      impact:
        "這是長期成本的最大變數。首年保費便宜，但續保時的重新定價可能令總成本完全不同。",
    });
  }

  // 4. 投保年齡
  const ageValues = selected.map((p) => ({
    productId: p.id,
    text: ageText(p),
  }));
  if (new Set(ageValues.map((v) => v.text)).size > 1) {
    candidates.push({
      kind: "eligibility",
      title: "可投保年齡範圍",
      values: ageValues,
      explanation:
        "投保年齡上限直接影響產品的可持續性——如果你打算長期持有，接近上限才投保的產品在續保時面臨的重新核保風險較高。",
      impact:
        "以「打算持有多久」而非「今年能否投保」來判斷。年齡上限愈高，產品愈適合長期持有。",
    });
  }

  // 5. 保費
  const preValues = selected.map((p) => ({
    productId: p.id,
    text: premiumText(p),
    note: p.premiumExamples[0]?.assumptions,
  }));
  if (new Set(preValues.map((v) => v.text)).size > 1) {
    candidates.push({
      kind: "premium",
      title: "保費示例",
      values: preValues,
      explanation:
        "保費示例反映的是不同年齡與吸煙狀況下的首年保費，並非完整年度成本。產品之間的保費差異，同時受保額設計與市場定價影響。",
      impact:
        "把保費與自付額放在一起看：總成本＝每年保費 ＋ 預期自付額。單看保費會得出相反結論。",
    });
  }

  // 6. 等待期
  const waitValues = selected.map((p) => ({
    productId: p.id,
    text: p.waitingPeriod?.hasWaitingPeriod
      ? (p.waitingPeriod.value ?? MISSING_DATA)
      : "無等待期",
  }));
  if (new Set(waitValues.map((v) => v.text)).size > 1) {
    candidates.push({
      kind: "waiting",
      title: "等待期",
      values: waitValues,
      explanation:
        "等待期是保單生效後仍不能索償的期間。疾病與意外的等待期通常不同長度，部分產品更有按疾病分類的額外年期限制。",
      impact:
        "如果你有已知健康狀況，或投保後即有已知行程安排，等待期長短會直接影響這段期間能否受保障。",
    });
  }

  // 7. 不保事項
  const excCounts = selected.map((p) => p.exclusions.length);
  if (new Set(excCounts).size > 1) {
    candidates.push({
      kind: "exclusion",
      title: "不保事項範圍",
      values: selected.map((p) => ({
        productId: p.id,
        text: `${p.exclusions.length} 項列明不保事項`,
        note: p.exclusions
          .slice(0, 2)
          .map((e) => e.name)
          .join("、"),
      })),
      explanation:
        "不保事項數量反映產品的承保邊界，但同樣重要的是類型：治療類不保（藥物、復康、護理）與活動類不保（高危活動、高危職業）對你的實際影響很不同。",
      impact:
        "找出跟你生活相關的那一項，而不是逐條背誦。治療類不保通常影響每次索償。",
    });
  }

  // 8. 核實狀態
  const verValues = selected.map((p) => ({
    productId: p.id,
    text: p.verification.status,
    note:
      p.verification.unverifiedFields && p.verification.unverifiedFields.length
        ? `未核實：${p.verification.unverifiedFields.join("、")}`
        : undefined,
  }));
  if (new Set(verValues.map((v) => v.text)).size > 1) {
    candidates.push({
      kind: "verification",
      title: "資料核實狀態",
      values: verValues,
      explanation:
        "平台對每份產品資料標示核實狀態。狀態不同的產品，可信程度並不相同——未核實的部分代表目前無法對照來源確認。",
      impact:
        "比較時，把資料可信度也視為一個維度。資料完整度低的產品，數字再吸引也不宜直接依賴。",
    });
  }

  // 按「對用戶影響力」排序，最多取 3 個
  const priority: DifferenceKind[] = [
    "deductible",
    "renewal",
    "coverage",
    "exclusion",
    "waiting",
    "eligibility",
    "premium",
    "verification",
  ];
  candidates.sort(
    (a, b) => priority.indexOf(a.kind) - priority.indexOf(b.kind),
  );
  return candidates.slice(0, 3);
}

// ------------------------------------------------------------
// Level 2：完整比較表
// ------------------------------------------------------------

export function buildComparisonRows(selected: InsuranceProduct[]): ComparisonRow[] {
  const n = selected.length;
  const rows: ComparisonRow[] = [];

  /**
   * push 一個比較欄位。
   *
   * sourceFactLabel 用來定位證據：它會對應到 evidence 註冊表裡的事實名稱。
   * 傳了 sourceFactLabel，這一行的每個數值就會帶上證據，UI 可以顯示
   * 「查看證據」按鈕；沒傳的欄位（例如「保險公司」這種平台自身資料）
   * 就沒有證據按鈕 —— 這是刻意的，不是遺漏。
   */
  const push = (
    group: string,
    label: string,
    fn: (p: InsuranceProduct) => string | null,
    hint?: string,
    sourceFactLabel?: string,
  ) => {
    const values = selected.map((p) => fn(p));
    const evidences = sourceFactLabel
      ? selected.map((p) => getEvidence(p, sourceFactLabel) ?? null)
      : undefined;
    rows.push({
      group,
      label,
      values,
      differs: new Set(values.map((v) => v ?? MISSING_DATA)).size > 1,
      hint,
      evidences,
    });
  };

  // 基本資料
  push("基本資料", "保險公司", (p) => getInsurer(p.insurerId)?.name ?? null);
  push("基本資料", "產品類別", (p) => CATEGORY_LABELS[p.category]);
  push("基本資料", "條款版本", (p) => p.termsVersion ?? null);
  push(
    "基本資料",
    "資料核實狀態",
    (p) => p.verification.status,
    "平台對此產品資料的核實程度",
  );
  push("基本資料", "最後檢視日期", (p) => p.verification.lastReviewedAt);

  // 投保資格
  push("投保資格", "最低投保年齡", (p) =>
    p.eligibility.minAge != null ? `${p.eligibility.minAge} 歲` : null,
  );
  push("投保資格", "最高投保年齡", (p) =>
    p.eligibility.maxAge != null ? `${p.eligibility.maxAge} 歲` : null,
  );
  push("投保資格", "居住地要求", (p) => p.eligibility.residency ?? null);
  push("投保資格", "需要健康申報", (p) =>
    p.eligibility.healthDeclaration === undefined
      ? null
      : p.eligibility.healthDeclaration
        ? "需要"
        : "不需要",
  );
  push("投保資格", "職業限制", (p) =>
    p.eligibility.occupationLimits === undefined
      ? null
      : p.eligibility.occupationLimits
        ? "有"
        : "無",
  );

  // 保費
  push("保費", "保費示例", (p) => premiumText(p), undefined, "保費示例");
  push(
    "保費",
    "示例假設條件",
    (p) => p.premiumExamples[0]?.assumptions ?? null,
    "保費示例所假設的年齡、吸煙與投保情況",
  );
  push("保費", "付款方式", (p) =>
    p.paymentOptions && p.paymentOptions.length
      ? p.paymentOptions.join("、")
      : null,
  );

  // 保障結構
  push("保障結構", "自付額", (p) => deductibleText(p), undefined, "自付額");
  push("保障結構", "自付額計算基礎", (p) => p.deductible?.basis ?? null);
  push(
    "保障結構",
    "等待期",
    (p) =>
      p.waitingPeriod?.hasWaitingPeriod
        ? (p.waitingPeriod.value ?? null)
        : "無",
    undefined,
    "等候期",
  );
  push("保障結構", "續保安排", (p) => renewalText(p), undefined, "續保安排");
  push("保障結構", "續保說明", (p) => p.renewal?.description ?? null);
  push(
    "保障結構",
    "保障項目數量",
    (p) => `${p.coverage.length} 項`,
  );
  push(
    "保障結構",
    "不保事項數量",
    (p) => `${p.exclusions.length} 項`,
  );

  // 逐項保障（住院／手術／門診等）
  const catLabels: { key: string; label: string }[] = [
    { key: "hospital", label: "住院保障" },
    { key: "surgical", label: "手術保障" },
    { key: "outpatient", label: "門診保障" },
    { key: "critical", label: "危疾保障" },
    { key: "death", label: "身故保障" },
    { key: "medical", label: "醫療費用保障" },
  ];
  for (const c of catLabels) {
    push(
      "逐項保障",
      c.label,
      (p) => {
        const items = p.coverage.filter((x) => x.category === c.key);
        if (!items.length) return null;
        return items
          .map((i) => `${i.name}${i.limit ? `（${i.limit}）` : ""}`)
          .join("；");
      },
      undefined,
      // 逐項保障由多個 coverage item 組成，證據掛在第一項上；
      // Evidence Drawer 會列出該產品此類別的所有來源。
      undefined,
    );
  }

  // 資料來源
  push(
    "資料來源",
    "來源文件數量",
    (p) => `${p.sourceDocuments.length} 份`,
    "此產品的保障數據可對照的條款或小冊子份數",
  );
  push(
    "資料來源",
    "來源文件",
    (p) =>
      p.sourceDocuments.length
        ? p.sourceDocuments.map((s) => `${s.title}（${s.version ?? "未註明版本"}）`).join("；")
        : null,
  );
  push(
    "資料來源",
    "尚未核實欄位",
    (p) =>
      p.verification.unverifiedFields && p.verification.unverifiedFields.length
        ? p.verification.unverifiedFields.join("、")
        : "無",
  );

  return rows;
}

export function groupRows(rows: ComparisonRow[]): { group: string; rows: ComparisonRow[] }[] {
  const map = new Map<string, ComparisonRow[]>();
  for (const r of rows) {
    const arr = map.get(r.group) ?? [];
    arr.push(r);
    map.set(r.group, arr);
  }
  return Array.from(map.entries()).map(([group, rs]) => ({ group, rows: rs }));
}

// ------------------------------------------------------------
// Level 3：差異解釋
// ------------------------------------------------------------

export type Explanation = {
  title: string;
  body: string;
  /** 適用的產品 id */
  productIds: string[];
};

/** 依產品的結構特徵，生成「為甚麼會有這個差異」的解釋 */
export function buildExplanations(
  selected: InsuranceProduct[],
): Explanation[] {
  if (selected.length < 2) return [];
  const out: Explanation[] = [];

  const medicalLike = selected.filter((p) => p.category === "medical");
  if (medicalLike.length >= 2) {
    const hasNetwork = medicalLike.filter((p) =>
      p.coverage.some((c) => c.name.includes("網絡")) ||
      (p.exclusions ?? []).some((e) => e.name.includes("網絡")),
    );
    if (hasNetwork.length) {
      out.push({
        title: "為甚麼有些醫療計劃要求使用指定網絡",
        body: "指定網絡是保險公司控制醫療成本與風險結構的手段之一：與網絡醫院約定收費，減低索償時的議價成本與爭議。這種設計的代價，是網絡外就診的報銷比例會顯著下降，甚至完全不獲保障。對經常需要私家醫院或跨區就診的人，這是一項實際成本，應與保費差額一併計算。",
        productIds: hasNetwork.map((p) => p.id),
      });
    }
  }

  const ciLike = selected.filter((p) => p.category === "critical-illness");
  if (ciLike.length >= 2) {
    out.push({
      title: "為甚麼危疾產品的保額差距比醫療產品大",
      body: "危疾保險的定價反映「何時可能發病」的風險分布，年齡的影響力遠高於醫療保險——醫療保險的主要變數是索償頻率，而危疾保險的主要變數是發病年齡。這也解釋了為甚麼危疾產品的保額差距往往比保費差距更能反映實際價值：把保額調高一倍，保費可能增加四成，但保障缺口才真正被填補。",
      productIds: ciLike.map((p) => p.id),
    });
  }

  const savingLike = selected.filter(
    (p) => p.category === "savings-retirement" || p.renewal?.type === "guaranteed_renewal",
  );
  if (savingLike.length >= 2) {
    out.push({
      title: "為甚麼「有儲蓄成分」的產品保費相差這麼多",
      body: "儲蓄型產品的保費差距，主要來自保證現金值累積的速度與保證交費年期。保證交費年期愈長，投保人在其後不需再繳付保費，但年繳保費愈高。反之，若只交 5 年，往後的保費要由保單現金值繳付，若現金值不足支應，保單可能失效。比較時應看完整的現金值表，而非只看首年保費。",
      productIds: savingLike.map((p) => p.id),
    });
  }

  const demoLike = selected.filter(
    (p) => p.verification.status === "demo" || p.verification.status === "unverified",
  );
  if (demoLike.length && demoLike.length < selected.length) {
    out.push({
      title: "為甚麼資料核實狀態不一致會影響比較",
      body: "不同產品的資料完整度不同，代表它們的數字可靠程度不同。核實狀態較低的產品，其保費或限額數字尚未能對照來源確認，因此即使數字看起來更有吸引力，也不宜直接依賴作決定。平台把核實狀態放進比較表，就是為了讓這項差異可見，而不是把它藏在細節裏。",
      productIds: demoLike.map((p) => p.id),
    });
  }

  if (out.length === 0) {
    out.push({
      title: "結構相近的產品，差異主要來自細節",
      body: "這幾款產品的整體結構接近，差別主要落在自付額計算基礎、保障限額層級、續保年期，以及個別條款的寫法。這類產品之間的選擇，往往取決於你的具體就醫習慣與持有年期，而不是產品的「大方向」差異。建議用下方「應問的問題」清單，逐條向保險公司或經紀確認。",
      productIds: selected.map((p) => p.id),
    });
  }

  return out;
}

// ------------------------------------------------------------
// Level 4：應問的問題
// ------------------------------------------------------------

export function buildQuestions(selected: InsuranceProduct[]): string[] {
  if (!selected.length) return [];
  const questions = new Set<string>();
  const cats = new Set(selected.map((p) => p.category));

  if (cats.has("medical")) {
    questions.add("自付額是按每次住院還是每個保單年度計算？用盡後是否仍然繼續計？");
    questions.add("保障涵蓋哪些病房級別？指定網絡以外就診的報銷比例是多少？");
    questions.add("住院前可否申請預先批核？批核需要多少時間？");
    questions.add("藥物、復康器材及護理費用是否在保障範圍內？");
  }
  if (cats.has("critical-illness")) {
    questions.add("這份保單的危疾定義清單可否提供？早期病變（例如原位癌）是否包含？");
    questions.add("生存期為多長？不同疾病的生存期是否相同？");
    questions.add("有沒有按疾病分類的額外等待期限制？");
    questions.add("續保時保費如何重新定價？");
  }
  if (cats.has("life")) {
    questions.add("保額上限如何計算？是否需要收入證明？");
    questions.add("受益人可否自由指定及更改？更改何時生效？");
    questions.add("保單的現金值表可否提供？保證與非保證部分各是多少？");
    questions.add("繳付年期結束後，保費由保單現金值繳付還是另行支付？");
  }
  if (cats.has("travel")) {
    questions.add("所有目的地是否都在保障的地理範圍內？");
    questions.add("行程中的高危活動是否需要額外加購？");
    questions.add("自付額是多少？按每次事故還是按行程計算？");
    questions.add("24 小時緊急援助的聯絡方式及費用上限是多少？");
  }
  if (cats.has("home")) {
    questions.add("「住戶」的定義包括哪些成員？訪客是否受保？");
    questions.add("貴重物品的申報上限是多少？");
    questions.add("空置超過多少日後不再受保？");
  }
  if (cats.has("motor")) {
    questions.add("保費按甚麼分級？續保時如何調整？");
    questions.add("自付額是否適用於所有損失？");
    questions.add("主要駕駛人變更時需要通知嗎？");
  }
  if (cats.has("savings-retirement")) {
    questions.add("保證現金值與非保證現金值在現金值表上各佔多少？");
    questions.add("早於指定年期退保的扣減如何計算？");
    questions.add("紅利採用甚麼派發機制？派發記錄可查嗎？");
  }

  // 通用條款問題
  questions.add("續保年期屆滿後會怎樣？是否需要重新核保？");
  questions.add("投保時的健康申報範圍包括多久的求診紀錄？");
  questions.add("這一份條款版本的有效日期及發佈日期是甚麼？");

  return Array.from(questions).slice(0, 10);
}

// ------------------------------------------------------------
// 輔助
// ------------------------------------------------------------

/** 產品之間的類別是否一致（用於提示比較是否合理） */
export function sameCategory(selected: InsuranceProduct[]): boolean {
  if (selected.length < 2) return true;
  const set = new Set(selected.map((p) => p.category));
  return set.size === 1;
}

export function categoryLabel(c: ProductCategory): string {
  return CATEGORY_LABELS[c];
}
