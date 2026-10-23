import type { DictionaryTerm } from "./types";

// ============================================================
// 保險術語字典 (Insurance Dictionary)
// ============================================================
// 每個術語都必須有 quickAnswer（40–80 字），這是 GEO / AI 搜尋
// 時代最重要的一層：讓「一句話答案」可以被直接引用。
//
// 擴充到數萬條的作法：
//   術語本身只是「條目」，內容拆成獨立欄位，
//   新增術語不需要改動任何 UI 元件。
// ============================================================

type TermSeed = Omit<
  DictionaryTerm,
  "letter" | "updatedAt" | "relatedProductIds" | "relatedArticleSlugs" | "relatedTerms" | "sourceIds"
> &
  Partial<
    Pick<
      DictionaryTerm,
      | "relatedProductIds"
      | "relatedArticleSlugs"
      | "relatedTerms"
      | "sourceIds"
    >
  >;

const UPDATED = "2026-01-18";

function t(seed: TermSeed): DictionaryTerm {
  const letter = seed.term.charAt(0).toUpperCase();
  return {
    ...seed,
    letter,
    updatedAt: UPDATED,
    relatedProductIds: seed.relatedProductIds ?? [],
    relatedArticleSlugs: seed.relatedArticleSlugs ?? [],
    relatedTerms: seed.relatedTerms ?? [],
    sourceIds: seed.sourceIds ?? ["src-internal-style"],
  };
}

export const dictionary: DictionaryTerm[] = [
  // ---------------- A–C ----------------
  t({
    term: "Accident",
    slug: "accident",
    zh: "意外",
    quickAnswer:
      "意外指不是刻意造成、亦非疾病引致的突發事件。保險中「意外」的定義通常要求外來、突發、非自願三個條件，是否符合以條款為準。",
    explanation:
      "意外事故保險與醫療保險的分野，在於「非疾病」這個條件。同一個傷害，源於跌倒（意外）還是源於糖尿病足潰瘍（疾病），兩者的理賠結果完全不同。條款會把意外定義得很細，例如要求由外來客體（object）導致，單靠自身內因（如中暑、體溫過低）通常不構成意外。",
    example:
      "浴室滑倒扭傷腳踝屬意外；糖尿病患者足部出現傷口需住院則屬疾病，走醫療保險而非意外險。",
    whyItMatters:
      "很多投保糾紛源自「以為是意外」。例如運動造成的十字韌帶撕裂，究竟是意外還是疾病引致，可能取決於條款是否將運動傷害列為除外項目。",
    howToCompare: [
      "查看條款對「意外」的完整定義，而非只看中文名稱",
      "確認是否列明高危活動除外（運動、旅遊、職業類別）",
      "留意是否有部分失蹤、單獨事故的特別條款",
    ],
    misconceptions: [
      {
        myth: "所有突發的受傷都算意外",
        truth:
          "須同時符合外來、突發、非自願三項條件，且不受保單列明的除外項目影響。",
      },
      {
        myth: "跌倒受傷一定賠",
        truth: "仍要視乎成因、活動性質及是否有除外條款，應以條款為準。",
      },
    ],
    relatedProductIds: ["pa-travel-01", "hs-motor-01"],
    relatedArticleSlugs: ["hk-medical-insurance-basics"],
    relatedTerms: ["Deductible", "Exclusion", "Waiting Period"],
  }),
  t({
    term: "Claim",
    slug: "claim",
    zh: "索償",
    quickAnswer:
      "索償是受保人向保險公司申請賠付的過程，通常要提交指定文件。香港常見做法是先由醫院直接向保險公司索償（第三方結算），投保人毋須逐項付款再申請。",
    explanation:
      "醫療保險的索償有兩種模式：第一種是「第三方結算」，醫院直接向保險公司申請賠償，病人只需在出院時確認簽署；第二種是「先付後償」，病人先繳付費用，再自行向保險公司申請手續較繁瑣的償還。危疾與人壽保險則採用「確診即賠」模式，只需提交診斷證明，不需提供發票。",
    example:
      "住院後醫院帳單直接送到保險公司，病人出院時只簽一份表格，稱為第三方結算。",
    whyItMatters:
      "索償流程直接影響實際現金流。先付後償的情況下，病人要先墊付幾萬元，對現金流較緊的家庭是實際風險。",
    howToCompare: [
      "確認產品是否支援第三方結算，以及指定醫院名單",
      "查看索償需要提交的文件清單",
      "確認非指定醫院就診的報銷比例是否較低",
    ],
    misconceptions: [
      {
        myth: "有住院就能報銷",
        truth:
          "須符合條款定義、扣除自付額、且在保障額度與網絡範圍內，才可報銷。",
      },
      {
        myth: "危疾保險也要交發票",
        truth:
          "危疾保險是確診即賠，只需符合定義的診斷證明文件，不需發票。",
      },
    ],
    relatedProductIds: ["hs-med-01", "bc-med-01", "ml-ci-01"],
    relatedArticleSlugs: ["critical-illness-claim-conditions"],
    relatedTerms: ["Pre-authorisation", "Third-party Settlement"],
  }),
  t({
    term: "Critical Illness",
    slug: "critical-illness",
    zh: "危疾",
    quickAnswer:
      "危疾指保單條款明文列出的嚴重疾病狀態。投保人一旦確診並符合定義，保險公司即一次性賠付保額，無需證明實際醫療開支。",
    explanation:
      "危疾保險與醫療保險的性質完全不同。醫療保險是實報實銷，賠你花掉的錢；危疾保險是一次性賠付符合定義的保額，用途是替代因病期間的收入中斷。關鍵在「定義」：一張「癌症保單」可能只賠特定階段的癌症，也可能賠任何惡性腫瘤。早期（原位癌）是否包含，是同類產品價格差異的最大來源。",
    example:
      "投保 HK$500,000 危疾保額，確診條款定義的癌症後可獲一次性 HK$500,000，與實際治療費無關。",
    whyItMatters:
      "危疾保險的價值在於收入替代，所以保額應該覆蓋你康復期間的收入損失，而不是醫療費——因為醫療費有醫療保險覆蓋。",
    howToCompare: [
      "逐項對照兩份保單的危疾定義清單，看哪些病你有、對方沒有",
      "確認早期病變是否包含，以及原位癌的處理方式",
      "留意「多次賠付」產品的間隔期與上限",
    ],
    misconceptions: [
      {
        myth: "有癌症就一定賠",
        truth:
          "只賠條款明文列出的疾病與定義，臨床診斷與條款定義不一致時可能不賠。",
      },
      {
        myth: "危疾保險可以報銷醫療費",
        truth:
          "危疾保險是一次性賠付，用途是收入替代；報銷醫療費是醫療保險的工作。",
      },
    ],
    relatedProductIds: ["ml-ci-01", "ml-ci-02", "bc-ci-01"],
    relatedArticleSlugs: [
      "medical-vs-critical-illness",
      "critical-illness-claim-conditions",
    ],
    relatedTerms: ["Waiting Period", "Survival Period", "Claim"],
  }),
  t({
    term: "Coverage Limit",
    slug: "coverage-limit",
    zh: "保障限額",
    quickAnswer:
      "保障限額是保險公司就某項保障最多願意赔付的上限。超出限額的部分由你自付，因此限額越高代表保障深度越大，但保費通常也越高。",
    explanation:
      "保障限額可以出現在不同層級：單項保障的限額（例如「每宗手術最高 HK$120,000」）、全年度的總限額、以及產品的最高保額。留意「每日限額 × 365 日」不一定等於年度限額，兩者通常並存並取較低者。有些條款會寫明「以實際開支為限」，代表即使限額很高，也不會賠超過實際花費。",
    example:
      "病房費每日限額 HK$8,000、年度總限額 HK$300,000，住院 40 日會先觸及年度上限。",
    whyItMatters:
      "限額是「保障是否足夠」的判斷基礎。若年度上限只等於你預期醫療開支的一半，即使「最高 HK$500,000」的字面數字很大，實際上仍不足。",
    howToCompare: [
      "分清楚「每日限額」「每宗限額」「年度總限額」三層",
      "確認是否寫明「以實際開支為限」",
      "用你自己的預期醫療次數做一次限額測算",
    ],
    misconceptions: [
      {
        myth: "寫着最高 HK$500,000 就一定夠",
        truth:
          "要看是每項、每次、每日還是每年限額，以及是否以實際開支為限。",
      },
      {
        myth: "限額用盡後還可以再申請",
        truth:
          "通常限額是年度或全單上限，用盡即不會再賠，除非保單另有「重建限額」安排。",
      },
    ],
    relatedProductIds: ["hs-med-01", "bc-med-02", "pa-travel-01"],
    relatedArticleSlugs: ["hospital-cover-limit"],
    relatedTerms: ["Deductible", "Exclusion", "Benefit"],
  }),

  // ---------------- D–H ----------------
  t({
    term: "Deductible",
    slug: "deductible",
    zh: "自付額／自負額",
    quickAnswer:
      "自付額是每次或每年理赔前，你須自行支付的部分，之後保險公司才開始承擔。香港醫療保險常見設定為每次住院 HK$5,000 或每年 HK$2,000。",
    explanation:
      "自付額是控制保費的機制：保險公司把第一層風險留給投保人，就可以收取較低保費。關鍵在「每次」與「每年」的區別——每次住院自付 HK$5,000，代表你全年住院 4 次就自付了 HK$20,000；每年自付 HK$2,000，代表無論住院多少次都只需付一次。同一產品的兩種結構，實際成本可能完全相反。",
    example:
      "一位同事一年住院 2 次，每次費用 HK$30,000：每次自付 HK$5,000 即自付 HK$10,000；每年自付 HK$2,000 則只需付 HK$2,000。",
    whyItMatters:
      "比較保費時如果只看保單上的年保費，會嚴重誤判真實成本。正確算法是「每年保費 + 預期自付額」。",
    howToCompare: [
      "先確認自付額是按每次、每次事故、還是每年計算",
      "用自己過去 1–2 年的實際就醫次數估算年度自付額",
      "比較「每年保費 + 預期自付額」的總和，而不是單看保費",
    ],
    misconceptions: [
      {
        myth: "自付額愈低就一定愈好",
        truth:
          "自付額低通常反映在高保費。總成本才是比較的基準。",
      },
      {
        myth: "自付額扣一次就夠",
        truth:
          "按每次計算的話，每次入院都會再扣一次，年度累計可能很高。",
      },
    ],
    relatedProductIds: ["hs-med-01", "hs-med-02", "bc-med-01"],
    relatedArticleSlugs: ["deductible-explained"],
    relatedTerms: ["Co-payment", "Coverage Limit", "Premium"],
  }),
  t({
    term: "Exclusion",
    slug: "exclusion",
    zh: "不保事項／除外責任",
    quickAnswer:
      "不保事項是保單明確列明不獲賠償的情況，即使該情況發生。香港醫療保險常見的不保事項包括投保前已有的病症、非必要美容手術及高危活動。",
    explanation:
      "不保事項可以分三類：疾病類（投保前已有的病症）、活動類（高危運動、危險職業）、治療類（美容整形、Experimental 治療、維護性護理）。第三類最容易被忽略——很多人以為住院就全包，但藥物、復康器材、護理費用往往被排除。保單通常也列出「部分不保」的項目，例如等候期內的疾病。",
    example:
      "投保前已確診的高血壓，日後因高血壓住院住院，屬不保事項，不會賠。",
    whyItMatters:
      "不保事項是「為何投保後無法索償」最常見的原因，也是比較產品時最容易被忽略的維度。",
    howToCompare: [
      "逐條閱讀不保事項，注意是「全部不保」還是「部分不保」",
      "特別留意治療類不保事項（藥物、復康、護理、器材）",
      "確認你的職業與生活習慣是否觸發任何除外條款",
    ],
    misconceptions: [
      {
        myth: "住院了就一定全包",
        truth:
          "藥物、復康器材、護理、牙科等項目通常被排除在醫療保險之外。",
      },
      {
        myth: "不保事項只是寫在合約末頁",
        truth:
          "它直接決定你能否索償，應該與保障範圍同時閱讀。",
      },
    ],
    relatedProductIds: ["hs-med-01", "bc-med-02", "pa-travel-01"],
    relatedArticleSlugs: ["hk-medical-insurance-basics"],
    relatedTerms: ["Waiting Period", "Pre-existing Condition", "Coverage Limit"],
  }),
  t({
    term: "Grace Period",
    slug: "grace-period",
    zh: "寬限期",
    quickAnswer:
      "寬限期是保單到期或扣費失敗後的一段延長時間，通常為 30 日，期間保單仍然有效。寬限期內繳清欠款可避免保單失效。",
    explanation:
      "寬限期主要出現在按月或按季繳付的保單。若寬限期內仍未繳款，保單會失效，之前的保障亦會中斷——這是「保障斷層」的常見來源，特別常見於重病康復後收入下跌、開始供款有困難的客戶。有些保單另設 90 日的「追討期」，期內繳清可恢復原保單。",
    example:
      "按月繳付的危疾保單，扣卡失敗後 30 日內繳清，保單不中斷。",
    whyItMatters:
      "重病後最容易出現供款中斷。若沒有寬限期，一次信用卡失敗就可能令你失去全部保障。",
    howToCompare: [
      "確認寬限期長度（30 日或 90 日）",
      "確認寬限期內保障是否繼續有效",
      "確認是否有「追討期」可恢復已失效的保單",
    ],
    misconceptions: [
      {
        myth: "寬限期可以無限延長",
        truth: "寬限期是固定年期，逾期保單即告失效。",
      },
      {
        myth: "保單失效只是失去未來保障",
        truth:
          "已發生的索償通常也會受影響，保單失效後可能連已發生的醫療費都無法報銷。",
      },
    ],
    relatedProductIds: ["ml-ci-01", "bc-ci-01"],
    relatedArticleSlugs: ["renewal-terms"],
    relatedTerms: ["Renewal", "Premium", "Grace Period"],
  }),

  // ---------------- H–M ----------------
  t({
    term: "Hospitalisation",
    slug: "hospitalisation",
    zh: "住院",
    quickAnswer:
      "住院指在醫院連續留宿至少一晚並接受住院服務。香港醫療保險一般只賠「有住院」才發生的費用，所以門診保障需另外購買。",
    explanation:
      "住院定義是醫療保險理賠的起點。日間病房（day case）與住院不同：很多條款把日間手術視作「住院」，但明確排除不需留宿的純門診程序。醫院等級亦影響保障：公立醫院與私家醫院的病房費用差距可以數倍，產品會指定涵蓋病房級別（例如只涵蓋普通病房）。",
    example:
      "在私家醫院住雙人房，屬住院；同一手術在日間病房進行，若條款只賠住院，可能不獲賠。",
    whyItMatters:
      "「我需要住院才有用」是很多人買醫療保險的理由，但如果日間治療不獲賠，這個假設就站不住腳。",
    howToCompare: [
      "確認是否涵蓋日間病房及日間手術",
      "確認保障的病房級別（普通病房 / 半私 / 私房）",
      "留意公立與私家醫院的分別是否明確界定",
    ],
    misconceptions: [
      {
        myth: "去醫院就算住院",
        truth:
          "需連續留宿並接受住院服務；日間程序按條款另論。",
      },
      {
        myth: "所有病房級別都一樣",
        truth:
          "多數產品只涵蓋指定病房級別，升級病房差額需自付。",
      },
    ],
    relatedProductIds: ["hs-med-01", "bc-med-01", "bc-med-02"],
    relatedArticleSlugs: ["hospital-cover-limit", "hk-medical-insurance-basics"],
    relatedTerms: ["Outpatient", "Coverage Limit", "Deductible"],
  }),
  t({
    term: "Insurer",
    slug: "insurer",
    zh: "保險公司",
    quickAnswer:
      "保險公司是承擔保險責任的法人實體。在香港，保險公司須在保險業監管局登記或取得認可，並受《保險業條例》規管。",
    explanation:
      "在保險資訊平台中，保險公司不應只是產品頁上的一個字串，而應是獨立的資料實體：每間公司有自己的產品線、條款風格、續保政策與財務狀況。比較同一類別的不同公司產品時，續保政策與理賠記錄往往比保費更能反映長期成本。平台本身不應該對保險公司作任何排名或推薦。",
    example:
      "港盾保險與明康護理同樣有住院醫療計劃，但自付額結構、門診設計與續保年期不同。",
    whyItMatters:
      "同一份保障在不同公司旗下會有不同條款寫法。只看產品名稱很容易被誤導。",
    howToCompare: [
      "留意續保政策：保證續保年期愈長，長期可預測性愈高",
      "留意是否有「因個別情況不續保」的例外條款",
      "留意同一公司同類產品的條款是否一致",
    ],
    misconceptions: [
      {
        myth: "大公司一定好過小公司",
        truth:
          "規模不等於對單一客戶的條款友善，要看具體條款內容。",
      },
      {
        myth: "同一公司不同產品差不多",
        truth:
          "同一公司可以同時有高自付額與低自付額、不同續保年期的高端與入門線。",
      },
    ],
    relatedProductIds: ["hs-med-01", "bc-med-01", "pa-travel-01"],
    relatedArticleSlugs: ["renewal-terms"],
    relatedTerms: ["Underwriting", "Renewal", "Broker"],
  }),
  t({
    term: "Life Insurance",
    slug: "life-insurance",
    zh: "人壽保險",
    quickAnswer:
      "人壽保險在受保人身故（或全殘）時向指定受益人支付保額。分為定期人壽（純保障）與儲蓄型人壽（兼具現金值）兩大類。",
    explanation:
      "人壽保險的設計要回答三個問題：保障誰（受益人）、賠多少（保額）、賠付形式（一次性或分期）。定期人壽純粹是風險轉移，保費年期內固定，期滿無現金值；儲蓄型人壽則有保證現金值，但保費高得多，且必須留意繳付年期（常見「保證交 10 年／20 年」，之後由保單現金值繳費）。",
    example:
      "定期人壽 HK$1,000,000 保額、保費 HK$2,100/年、20 年期：身故賠 HK$1,000,000，期滿無退還。",
    whyItMatters:
      "人壽保險的作用是替代家庭收入，不是投資。要判斷保額是否足夠，應以「家庭剩餘開支 ÷ 現有可替代收入」計算。",
    howToCompare: [
      "確認保額是否與收入需要匹配（很多產品設收入上限）",
      "確認是純保障型還是含現金值，以及繳付年期",
      "確認受益人與賠付方式是否可更改",
    ],
    misconceptions: [
      {
        myth: "人壽保險是投資",
        truth:
          "定期人壽是純風險轉移，沒有投資成分；儲蓄型的現金值亦非等同銀行存款。",
      },
      {
        myth: "保額愈大愈好",
        truth:
          "超出收入需要的保額會浪費保費，且可能需要更高的財務核保。",
      },
    ],
    relatedProductIds: ["hs-life-01", "ml-life-01", "pa-life-01"],
    relatedArticleSlugs: ["life-insurance-types"],
    relatedTerms: ["Beneficiary", "Premium", "Cash Value"],
  }),
  t({
    term: "Medical Insurance",
    slug: "medical-insurance",
    zh: "醫療保險",
    quickAnswer:
      "醫療保險報銷因疾病或意外產生的實際醫療開支，採實報實銷方式，設有自付額與保障限額。香港常見分為住院與門診兩層。",
    explanation:
      "醫療保險的核心是成本轉移：你付保費，保險公司承擔條款範圍內的醫療費用。它與危疾保險不是二選一，而是互補——一個處理「已發生的費用」，一個處理「因病失去的收入」。香港市場上「住院保」較普及，門診保障通常要額外附加，住院前後門診則多是有限期的延伸安排。",
    example:
      "住院 5 日費用 HK$80,000，扣除自付額 HK$5,000、限額內全額報銷 HK$75,000。",
    whyItMatters:
      "沒有醫療保險，住院一次的成本就可能吃掉數個月的現金流；有醫療保險但沒買危疾保險，則疾病期間的收入完全沒有補償。",
    howToCompare: [
      "確認自付額結構與保障限額層級",
      "確認是否涵蓋私家醫院及指定病房級別",
      "確認門診保障是否需額外附加，以及是否設次數上限",
    ],
    misconceptions: [
      {
        myth: "醫療保險和危疾保險二選一",
        truth:
          "兩者功能不同：前者報銷費用，後者補償收入。完整方案通常需要兩者配合。",
      },
      {
        myth: "有社保就有醫療保障",
        truth:
          "醫管局提供的是公共醫療服務，私人及半私人住院的費用仍需商業保險覆蓋。",
      },
    ],
    relatedProductIds: ["hs-med-01", "hs-med-02", "bc-med-01", "bc-med-02"],
    relatedArticleSlugs: ["hk-medical-insurance-basics", "medical-vs-critical-illness"],
    relatedTerms: ["Deductible", "Coverage Limit", "Critical Illness"],
  }),

  // ---------------- N–R ----------------
  t({
    term: "Premium",
    slug: "premium",
    zh: "保費",
    quickAnswer:
      "保費是投保人向保險公司支付的費用。醫療保險多按年齡分級，危疾與人壽按年齡、性別、吸煙與職業定價，同類產品的保費差異主要來自這些分級。",
    explanation:
      "保費不是保額的固定比例，而是風險定價的結果。同一保障額度下，吸煙者、有病史者、高危職業人士的保費可高出一倍或以上。有些產品的保費逐年上升（age-banded），有些在續保時才調整。比較保費時，必須確認是否為「第一年保費」——第一年最便宜不代表長期最便宜。",
    example:
      "同樣 HK$500,000 危疾保額，30 歲非吸煙女性與 40 歲吸煙男性的年保費可以相差超過一倍。",
    whyItMatters:
      "「第一年保費」是常見的誤導來源。20 年期的產品若只看首年保費，會嚴重低估長期總支出。",
    howToCompare: [
      "確認報價是首年保費還是整個年期平均",
      "確認保費會否按年齡調整，以及調整頻率",
      "確認吸煙與職業等因素對保費的影響幅度",
    ],
    misconceptions: [
      {
        myth: "保費低就代表划算",
        truth:
          "應以「總保費 + 預期自付額 + 保障缺口」三者一起評估。",
      },
      {
        myth: "保費是固定的",
        truth:
          "多數產品保費會隨年齡或風險變化調整，須看條款。",
      },
    ],
    relatedProductIds: ["hs-med-01", "ml-ci-01", "pa-savings-01"],
    relatedArticleSlugs: ["renewal-terms"],
    relatedTerms: ["Underwriting", "Renewal", "Deductible"],
  }),
  t({
    term: "Pre-authorisation",
    slug: "pre-authorisation",
    zh: "預先批核",
    quickAnswer:
      "預先批核指在進行治療前，向保險公司申報擬進行的項目並取得書面同意。未經批核的治療，保險公司可拒絕索償或減低保額。",
    explanation:
      "預先批核主要用於兩類情況：非必要的治療（美容、整形）以及大型開支的手術。它的作用是讓你在承擔費用前知道能否獲賠，避免「做完才發現不賠」。香港常見做法是透過保險公司的第三方結算服務進行，醫院代為提交申請。",
    example:
      "計劃做心臟搭橋手術，先向保險公司申請，確認在保障範圍內並知道自付額，才安排入院。",
    whyItMatters:
      "沒有預先批核就做大手術，可能面臨全額自付的風險。這是醫療保險使用者最需要建立的工作流程。",
    howToCompare: [
      "確認哪些治療必須預先批核",
      "確認批核需要多少時間，以及緊急情況下的處理方式",
      "確認未經批核的實際後果（拒赔或減賠）",
    ],
    misconceptions: [
      {
        myth: "在網絡內就一定不用批核",
        truth:
          "部分指定治療即使在網絡內也需預先批核，須看條款列明的清單。",
      },
      {
        myth: "醫生說可以做就可以做",
        truth:
          "醫療必要性不等於保險可賠，兩者是不同的判定。",
      },
    ],
    relatedProductIds: ["hs-med-01", "bc-med-01"],
    relatedArticleSlugs: ["hk-medical-insurance-basics"],
    relatedTerms: ["Claim", "Exclusion", "Third-party Settlement"],
  }),
  t({
    term: "Pre-existing Condition",
    slug: "pre-existing-condition",
    zh: "投保前已有的病症",
    quickAnswer:
      "指投保前已存在、已出現症狀或曾接受治療的病症。香港醫療保險通常設有追溯期（常見 12 至 60 個月），期內相關病症不獲保障。",
    explanation:
      "追溯期是防止逆選擇的機制：如果沒有追溯期，人可以在確診後才投保，然後把已發生的費用轉嫁給保險公司。不同產品的追溯期長短不一，12 個月是最常見的設定。注意追溯期一般由「上次就診或治療」起算，不一定由正式診斷日起算。",
    example:
      "兩年前曾因血壓偏高求診並開藥，兩年後投保醫療保險，日後因高血壓住院——若追溯期為 24 個月，不獲賠。",
    whyItMatters:
      "誠實申報是投保的前提。漏報過去的求診紀錄，日後可能面對拒賠甚至取消保單，風險由你承擔。",
    howToCompare: [
      "確認追溯期長度，並留意由甚麼事件起算",
      "確認自己過去的求診紀錄是否符合申報要求",
      "留意是否有「可加費承保」的處理方式",
    ],
    misconceptions: [
      {
        myth: "只是例行求診不算",
        truth:
          "追溯期通常涵蓋任何求診、檢查或治療紀錄，不論是否嚴重。",
      },
      {
        myth: "追溯期過了就沒問題",
        truth:
          "要視乎追溯期長短，以及期內的紀錄是否涉及現有病症。",
      },
    ],
    relatedProductIds: ["hs-med-01", "bc-med-01", "ml-ci-01"],
    relatedArticleSlugs: ["hk-medical-insurance-basics"],
    relatedTerms: ["Exclusion", "Waiting Period", "Underwriting"],
  }),
  t({
    term: "Renewal",
    slug: "renewal",
    zh: "續保",
    quickAnswer:
      "續保指保單期滿後繼續投保。保證續保代表保險公司承諾不重新核保；非保證續保則可按當時風險調整保費，甚至拒絕續保。",
    explanation:
      "續保是長期成本的最大變數。保證續保有兩種形式：保證續保 N 年（期滿後可重新核保），以及保證續保至某個年齡。在保證期內，保險公司不能因你曾經索償或健康狀況變差而拒保，但保費仍會按年齡調整。危疾保險與定期人壽多數不保證續保，因為高齡時的風險難以承擔。",
    example:
      "一份保證續保 5 年的住院醫療，5 年後公司可按當時健康狀況重新定價或拒絕續保。",
    whyItMatters:
      "產品前 5 年的保費很低，但 6 年起可能面對大幅加費甚至失去保障，續保條款直接決定你的長期可預測性。",
    howToCompare: [
      "確認是「保證續保 N 年」還是「保證至某年齡」，兩者長短不同",
      "確認保證期內保費是否仍會調整",
      "確認續保時有否額外費用或重新核保要求",
    ],
    misconceptions: [
      {
        myth: "保證續保＝保費不變",
        truth:
          "保證的是不重新核保、不拒絕續保，保費通常仍會隨年齡調整。",
      },
      {
        myth: "續保是自動的",
        truth:
          "仍需在指定限期內繳付保費，逾期有寬限期安排，逾期即失效。",
      },
    ],
    relatedProductIds: ["hs-med-01", "bc-med-01", "ml-life-01"],
    relatedArticleSlugs: ["renewal-terms"],
    relatedTerms: ["Grace Period", "Premium", "Underwriting"],
  }),

  // ---------------- S–Z ----------------
  t({
    term: "Survival Period",
    slug: "survival-period",
    zh: "生存期",
    quickAnswer:
      "生存期指受保人確診危疾後須繼續生存若干日或若干月，保險公司才須賠付。香港常見設定為 30 日，部分產品為 90 日或 1 年。",
    explanation:
      "生存期的作用是排除短期自愈或誤診的情況。越長的生存期對保險公司越有利，但對投保人越不利——期間若身故，通常只退回已繳保費而非賠付保額。部分危疾計劃會對不同疾病設定不同生存期，例如癌症 30 日而心臟病 90 日，這在條款細節中容易漏看。",
    example:
      "確診癌症後第 20 日身故，若生存期為 30 日，保險公司通常只退回保費。",
    whyItMatters:
      "生存期直接影響「最壞情況」下的實際回報。比較危疾產品時，這是常被忽略的條款差異。",
    howToCompare: [
      "確認生存期長度，以及是否按疾病分類設定",
      "確認生存期內身故的處理方式（退回保費或其他）",
      "確認不同產品的生存期差異如何影響你的實際情況",
    ],
    misconceptions: [
      {
        myth: "確診就一定有保額",
        truth: "須在生存期內持續生存才可獲賠。",
      },
      {
        myth: "生存期都一樣長",
        truth: "不同產品、甚至同一產品內不同疾病的生存期都可能不同。",
      },
    ],
    relatedProductIds: ["ml-ci-01", "ml-ci-02", "bc-ci-01"],
    relatedArticleSlugs: ["critical-illness-claim-conditions"],
    relatedTerms: ["Critical Illness", "Waiting Period", "Claim"],
  }),
  t({
    term: "Third-party Settlement",
    slug: "third-party-settlement",
    zh: "第三方結算",
    quickAnswer:
      "第三方結算是保險公司與醫院直接結算的安排：病人入院時出示保險證明，出院時只確認帳單，保險公司直接向醫院付款。",
    explanation:
      "第三方結算解決的是現金流問題。沒有這項安排，病人須先付清全數費用再自行申請償還，對醫療費高昂的情況是實質負擔。第三方結算通常只覆蓋「基本醫療」範圍，私家醫院、升級病房、自費項目往往仍需自付。指定醫院名單是使用這項服務的前提。",
    example:
      "入院時交出保險證明，出院時醫院直接向保險公司索償 HK$75,000，你只需支付自付額 HK$5,000。",
    whyItMatters:
      "很多人在投保後才發現自己常用的醫院不在指定名單內，等於失去了這項便利。",
    howToCompare: [
      "確認指定醫院名單是否覆蓋你常去的醫院",
      "確認第三方結算涵蓋哪些項目（是否包括私家醫院、升級病房）",
      "確認自費項目的處理方式",
    ],
    misconceptions: [
      {
        myth: "有第三方結算就完全不用付錢",
        truth:
          "自付額、差額費用、自費項目通常仍須由你支付。",
      },
      {
        myth: "所有醫院都可以直接結算",
        truth: "只在指定網絡內的醫院適用。",
      },
    ],
    relatedProductIds: ["hs-med-02", "bc-med-01", "hs-med-01"],
    relatedArticleSlugs: ["hk-medical-insurance-basics"],
    relatedTerms: ["Pre-authorisation", "Claim", "Deductible"],
  }),
  t({
    term: "Waiting Period",
    slug: "waiting-period",
    zh: "等待期",
    quickAnswer:
      "等待期是保單生效後的一段期間，期間內發生的疾病或事故不獲保障。香港醫療保險常見為 30 至 180 日，意外通常短於疾病。",
    explanation:
      "等待期與追溯期針對不同風險：追溯期防「投保前已發生的病」，等待期防「投保後立刻發生的病」。等待期長短與保費直接相關，等待期愈長，保費通常愈低。危疾保險的等待期通常為 90 日；醫療保險的疾病等待期可達 180 日，而意外等待期往往只有 30 日甚至 0 日——這是同一產品內不同條款之間的風險差異。",
    example:
      "一張疾病等待期 180 日的住院醫療，投保後第 100 日因病住院，不獲賠；同期間因意外住院，則可賠。",
    whyItMatters:
      "等待期是「買了保險但用不上」的常見原因。如果你有已知健康狀況，或投保後即有行程安排，等待期長短會直接影響實際價值。",
    howToCompare: [
      "確認疾病與意外的等待期是否不同",
      "確認等待期是按保單生效日還是按每項保障分別計算",
      "比較時把等待期長短與保費差額一起看",
    ],
    misconceptions: [
      {
        myth: "等待期只有一個",
        truth:
          "通常按保障類別分別設定，意外與疾病的等待期可以相差甚遠。",
      },
      {
        myth: "等待期內住院也可以報銷",
        truth:
          "等待期內發生的疾病或事故不獲保障，這是明確的除外責任。",
      },
    ],
    relatedProductIds: ["hs-med-01", "hs-med-02", "ml-ci-01"],
    relatedArticleSlugs: ["waiting-period", "hk-medical-insurance-basics"],
    relatedTerms: ["Pre-existing Condition", "Exclusion", "Critical Illness"],
  }),
  // ---------------- B–C ----------------
  t({
    term: "Beneficiary",
    slug: "beneficiary",
    zh: "受益人",
    quickAnswer:
      "受益人是保單指定、可獲得保險賠付的人。人壽及危疾保險的身故賠付一律支付予受益人，因此受益人的指定與範圍，直接決定實際保障是否落到家人手上。",
    explanation:
      "受益人可以是指定個人或機構（如配偶、子女、父母），也可以寫「法定繼承人」。指定受益人的好處是避免遺產分配程序與債務糾紛；壞處是如果受益人先於受保人身故、或受益人安排不當，保額可能落入其他程序。指定受益人一般可以隨時更改，但部分產品設有更改頻率限制。",
    example:
      "投保人指定配偶為受益人，日後更改為子女，只需向保險公司提交書面通知。",
    whyItMatters:
      "很多家庭買了人壽保險卻從未指定受益人，結果賠付要經遺產程序，既慢又可能涉及債務。",
    howToCompare: [
      "確認可否自由指定或更改受益人",
      "確認更改的生效時間（提交後即時還是下一個保單年度）",
      "確認受益人為未成年子女時的特殊安排",
    ],
    misconceptions: [
      {
        myth: "受益人是自動的",
        truth: "如未指定，通常須按保單條款或法律程序處理，並非自動。",
      },
      {
        myth: "指定了就不能改",
        truth:
          "多數產品容許更改，只是部分設有每年次數或通知期限限制。",
      },
    ],
    relatedProductIds: ["ml-life-01", "hs-life-01", "pa-life-01"],
    relatedArticleSlugs: ["life-insurance-types"],
    relatedTerms: ["Life Insurance", "Policy Year", "Cash Value"],
  }),
  t({
    term: "Broker",
    slug: "broker",
    zh: "保險經紀",
    quickAnswer:
      "保險經紀代表投保人而非保險公司，向客戶提供產品比較、方案設計及投保服務。香港設有《保險業條例》對保險經紀的註冊及行為規管。",
    explanation:
      "經紀與代理人的核心差別是代表性：代理人代表保險公司，經紀代表投保人。經紀一般可跨公司比價並提供意見，但受制於佣金披露規定，不代表其意見必然中立。作為資訊平台的定位，平台應說明自身是資訊提供者而非經紀，並清楚交代商業合作如何影響內容。",
    example:
      "同一位投保人，代理人只能提供所屬公司的產品，經紀則可比較多家公司的方案。",
    whyItMatters:
      "知道對方是代理還是經紀，能幫助你判斷建議的出發點，也避免把「推銷」誤認為「中立分析」。",
    howToCompare: [
      "確認對方註冊身份及可提供的公司數目",
      "要求書面解釋方案建議的理由",
      "注意佣金披露及平台的商業合作聲明",
    ],
    misconceptions: [
      {
        myth: "經紀一定會幫我慳到最多錢",
        truth:
          "經紀的價值在於方案設計與服務，不保證在任何情況下保費最低。",
      },
      {
        myth: "平台的比較排名就是專業建議",
        truth:
          "中立資訊平台提供的是可比較的資料，不構成個人化投保建議。",
      },
    ],
    relatedProductIds: [],
    relatedArticleSlugs: [],
    relatedTerms: ["Insurer", "Underwriting", "Premium"],
  }),
  t({
    term: "Cash Value",
    slug: "cash-value",
    zh: "現金值",
    quickAnswer:
      "現金值是儲蓄型保單在特定年度的可退保金額。保證現金值由條款保證不會減少；非保證現金值則取決於投資表現，最低可能很低。",
    explanation:
      "只有含儲蓄成分的保單（終身人壽、儲蓄型退休計劃、分紅保單）才會有現金值。閱讀現金值表時，最重要的一項是分清「保證」與「非保證」兩欄——保證部分是非保證部分的基礎，非保證部分可能隨時下調至零。退保時實際收到的金額，等於保單現金值扣減退保費用。",
    example:
      "某保單第 10 年保證現金值 HK$80,000、非保證現金值 HK$120,000；退保時至少可取回 HK$80,000，實際可能高於此數。",
    whyItMatters:
      "「現金值」常被當成等同存款，但退保時通常會被扣除費用，且早期退保的損失可能相當大。",
    howToCompare: [
      "先看保證現金值欄，非保證欄只作參考",
      "查閱保單的現金值表，確認指定年度的數字",
      "確認退保費用及最早可提取的年度",
    ],
    misconceptions: [
      {
        myth: "現金值等於銀行存款",
        truth:
          "現金值是保單上的數字，退保時會被扣費用，且早期退保損失大。",
      },
      {
        myth: "有非保證現金值就代表一定賺",
        truth:
          "非保證部分由保險公司投資表現決定，可能低於演示數字甚至為零。",
      },
    ],
    relatedProductIds: ["ml-life-01", "pa-savings-01"],
    relatedArticleSlugs: ["life-insurance-types"],
    relatedTerms: ["Life Insurance", "Beneficiary", "Premium"],
  }),
  t({
    term: "Co-payment",
    slug: "co-payment",
    zh: "共同支付",
    quickAnswer:
      "共同支付是每次使用保障時，投保人須自行支付的一固定金額或百分比，與自付額不同：自付額通常按事故或年度計算，共同支付則按每次服務計算。",
    explanation:
      "在醫療保險裏，兩者有時並存。自付額是一道門檻（達到門檻後才開始賠），共同支付則是每次賠付時仍要分擔的比例。例如「自付額每年 HK$2,000，其後每次報銷 80%」，代表你每年首 HK$2,000 全自付，之後每次仍要付 20%。這個結構在門診保障中特別常見，因為門診的價值密度低，不宜全數報銷。",
    example:
      "門診費用 HK$500，自付額已達標，報銷 80%：保險公司賠 HK$400，你付 HK$100。",
    whyItMatters:
      "共同支付比例直接決定報銷率，比例愈低代表自付比例愈高。忽略這一項會高估醫療保險的實際效用。",
    howToCompare: [
      "確認報銷比例是 100%、90% 還是 80%",
      "確認共同支付是否有每次上限",
      "確認自付額與共同支付是並存還是二選一",
    ],
    misconceptions: [
      {
        myth: "報銷 100% 就等於全包",
        truth: "仍受自付額、保障限額、不保事項與網絡限制影響。",
      },
      {
        myth: "自付額和共同支付是同一件事",
        truth:
          "兩者計算方式不同，若保單同時有，實際自付可能高於預期。",
      },
    ],
    relatedProductIds: ["hs-med-02", "bc-med-01"],
    relatedArticleSlugs: ["deductible-explained"],
    relatedTerms: ["Deductible", "Coverage Limit", "Outpatient"],
  }),
  t({
    term: "Critical Illness Premium",
    slug: "critical-illness-premium",
    zh: "危疾保費",
    quickAnswer:
      "危疾保費主要由投保年齡、性別、吸煙狀況、職業及保額決定。同一保額下，30 歲與 50 歲的年保費差距可以超過三倍，且多數產品不保證續保。",
    explanation:
      "危疾保險的定價反映「何時可能發病」的風險分布，因此年齡的影響力遠高於醫療保險。此外危疾保險通常不會每年重檢健康狀況（醫療保險續保時可能重新核保），所以首年保費與續保保費的差距相對有限，但續保年齡的重新定價仍會顯著推高保費。",
    example:
      "HK$500,000 危疾保額：30 歲女性非吸煙約 HK$3,480/年；50 歲男性非吸煙約 HK$11,000/年。",
    whyItMatters:
      "危疾保費在 40 歲後跳升明顯。晚投保的代價不只是保費高，而是年齡段本身的風險已經較高。",
    howToCompare: [
      "確認報價所對應的投保年齡與吸煙狀況",
      "確認續保時的保費調整方式",
      "比較不同產品時統一保額與性別，避免變數干擾",
    ],
    misconceptions: [
      {
        myth: "危疾保費比醫療保險貴就一定不划算",
        truth:
          "兩者功能不同，危疾保險賠的是收入損失，不是醫療費用。",
      },
      {
        myth: "鎖定首年保費就代表長期成本固定",
        truth:
          "續保時按屆時年齡重新定價，長期保費會明顯上升。",
      },
    ],
    relatedProductIds: ["ml-ci-01", "ml-ci-02", "bc-ci-01"],
    relatedArticleSlugs: ["medical-vs-critical-illness", "renewal-terms"],
    relatedTerms: ["Premium", "Critical Illness", "Renewal"],
  }),

  // ---------------- D–F ----------------
  t({
    term: "Free Look Period",
    slug: "free-look-period",
    zh: "冷靜期",
    quickAnswer:
      "冷靜期是新造保單交付後的一段期間（香港通常為 14 日），投保人可在此期間內取消保單並取回已繳保費，用於重新檢視條款是否適合自己。",
    explanation:
      "冷靜期是消費者保護機制，針對的是「簽約時沒有充分理解條款」的問題。這段時間特別適合用來做三件事：對照需求分析結果、核對健康申報的完整性、以及確認保單的保障項目是否與產品說明一致。取消後的健康紀錄影響，在香港的處理方式與其他地區不同，具體應向保險公司確認。",
    example:
      "交付保單後第 10 日發現健康申報漏報，取消保單，取回全數保費。",
    whyItMatters:
      "冷靜期是唯一「零成本反悔」機會。過了這個窗口，退保通常只能取回現金值（若有的話）。",
    howToCompare: [
      "確認冷靜期長度及起算日（交付日或收妥保單日）",
      "確認取消後保費退還方式與所需時間",
      "確認取消是否影響健康申報紀錄",
    ],
    misconceptions: [
      {
        myth: "冷靜期可以隨便用",
        truth:
          "是給投保人重新檢視的權利，應在真正了解條款後才取消。",
      },
      {
        myth: "取消後就完全沒有紀錄",
        truth:
          "涉及健康申報的取消，會否留下紀錄應向保險公司個別確認。",
      },
    ],
    relatedProductIds: [],
    relatedArticleSlugs: [],
    relatedTerms: ["Cancellation", "Pre-existing Condition", "Policy Year"],
  }),

  // ---------------- H–P ----------------
  t({
    term: "Household",
    slug: "household",
    zh: "住戶",
    quickAnswer:
      "住戶指共用同一住所並一起生活的一群人。家居及旅遊保險通常以「每住戶」或「每個地址」為計算單位，影響保費及理賠上限。",
    explanation:
      "住戶定義決定了保單的涵蓋範圍。若兩位朋友同居，是否算同一住戶？若子女已成年但仍住父母家，是否仍是同一住戶？這些都取決於條款定義。住戶數目亦影響旅遊保險的團體折扣與每人的保障限額計算方式。",
    example:
      "兩位不相關的室友同住一個單位，投保家居保險時應分別申報為兩個獨立住戶，避免日後理賠時出現爭議。",
    whyItMatters:
      "住戶定義不清最常見的後果是理賠時被指漏報或重複申報，導致爭議及延遲。",
    howToCompare: [
      "確認「住戶」在條款中的完整定義",
      "確認保費是按住戶還是按地址計算",
      "確認訪客或短住成員的處理方式",
    ],
    misconceptions: [
      {
        myth: "同住就是同一住戶",
        truth: "是否構成同一住戶取決於條款定義，不必然等同地址相同。",
      },
      {
        myth: "只為主要住戶投保就夠",
        truth:
          "其他成員的財物未必受保，應按條款確認是否需要加保。",
      },
    ],
    relatedProductIds: ["pa-home-01", "pa-travel-01"],
    relatedArticleSlugs: [],
    relatedTerms: ["Exclusion", "Coverage Limit", "Travel Insurance"],
  }),
  t({
    term: "Income Protection",
    slug: "income-protection",
    zh: "收入保障保險",
    quickAnswer:
      "收入保障保險在你因疾病或傷殘不能工作時，按保單訂明比例支付每月收入，通常可支薪至約 60 至 75 歲。",
    explanation:
      "收入保障解決的是「醫療保險與危疾保險之間的缺口」：醫療保險報銷費用、危疾保險一次性賠一筆，但若你只需要休養兩三個月而非重病，一次性賠付未必覆蓋得了期間的收入損失，而收入保障正好填補這個空窗。設定時要注意「每月可賠金額」通常設有上限（例如月入 75% 或 HK$25,000 為限），以及等待期長短。",
    example:
      "月入 HK$30,000，因病需休養 4 個月，收入保障按每月 HK$22,500 支付 4 個月，合共 HK$90,000。",
    whyItMatters:
      "危疾保額通常按 3–5 年收入設定，但初期康復期間的日常開支缺口，並非危疾一次性賠付能靈活覆蓋。",
    howToCompare: [
      "確認每月可賠金額及上限計算方式",
      "確認等待期長短（由不能工作起計或由病發起計）",
      "確認是否需要連續工作能力的證明",
    ],
    misconceptions: [
      {
        myth: "收入保障等於社保的傷殘津貼",
        truth:
          "兩者是不同制度，金額與資格條件不同，可並行申請。",
      },
      {
        myth: "有危疾保險就不需要收入保障",
        truth:
          "危疾是一次性賠付，收入保障是按月補償，兩者覆蓋的時間結構不同。",
      },
    ],
    relatedProductIds: [],
    relatedArticleSlugs: ["medical-vs-critical-illness"],
    relatedTerms: ["Premium", "Waiting Period", "Critical Illness"],
  }),

  // ---------------- S–Z ----------------
  t({
    term: "No-claim Discount",
    slug: "no-claim-discount",
    zh: "無索償折扣",
    quickAnswer:
      "無索償折扣指連續一段時間沒有提出索償，下次續保時可獲保費下調。車險最常見，醫療及旅遊保險較少採用。",
    explanation:
      "折扣機制設計上是為了鼓勵慎索償——因為自付額的存在，本來就應該讓投保人承擔部分小额費用。不過折扣計算有細節要留意：是按「沒有索償」還是「沒有索償且報告損失」計算？索償金額低於某個門檻是否也會影響折扣？以及折扣會否在索償後歸零。",
    example:
      "車險連續 3 年無索償續保，保費可下調至原價的六成左右。",
    whyItMatters:
      "折扣看似是「優惠」，實際上反映了你過去的風險紀錄。計劃索償前，值得先算清楚放棄折扣是否值得。",
    howToCompare: [
      "確認折扣級距與適用年期",
      "確認哪些情況會令折扣歸零（索償金額門檻）",
      "確認折扣是否適用於新投保或轉保客戶",
    ],
    misconceptions: [
      {
        myth: "有折扣就代表保單更划算",
        truth:
          "折扣反映索償紀錄，本身說明你過往的風險情況，需與保費一起看。",
      },
      {
        myth: "小額索償不會影響折扣",
        truth: "很多產品設有金額門檻，超過即令折扣歸零。",
      },
    ],
    relatedProductIds: ["hs-motor-01"],
    relatedArticleSlugs: [],
    relatedTerms: ["Premium", "Renewal", "Deductible"],
  }),
  t({
    term: "Occupation Class",
    slug: "occupation-class",
    zh: "職業類別",
    quickAnswer:
      "職業類別是保險公司按工作風險把職業分級，用以決定可承保的產品、保費、甚至最高保額。高風險職業可能完全不受保。",
    explanation:
      "職業分級通常是承保的硬門檻。辦公室白領與地盤工人的風險差異巨大，保險公司對某些職業（例如高空工作、內河船員、拳擊手）直接拒保。部分產品對高風險職業收取加費，或設較低的保額上限。申請時如從事的工作有變化，應主動通知保險公司，否則可能影響理賠。",
    example:
      "從事地盤工作的投保人，部分危疾保險會要求加費或限制保額。",
    whyItMatters:
      "職業申報不實可能導致日後索償被拒，是投保文件中最常見的失誤之一。",
    howToCompare: [
      "確認產品的可承保職業列表與分類方法",
      "確認加費幅度與保額上限是否因職業而異",
      "比較時統一職業類別，否則保費不可比",
    ],
    misconceptions: [
      {
        myth: "危險運動只是加分項，不影響承保",
        truth:
          "部分職業及運動類別直接不受保，須在投保前確認。",
      },
      {
        myth: "入職後轉職不用再通知",
        truth:
          "職業變動通常須通知保險公司，否則可能影響保障效力。",
      },
    ],
    relatedProductIds: ["hs-life-01", "ml-ci-01", "hs-motor-01"],
    relatedArticleSlugs: [],
    relatedTerms: ["Underwriting", "Premium", "Exclusion"],
  }),
  t({
    term: "Policy Year",
    slug: "policy-year",
    zh: "保單年度",
    quickAnswer:
      "保單年度是保單由生效日起計的一年。保障限額、自付額、等待期與免賠額通常以「每個保單年度」為單位計算，因此跨年的開支會分開計算。",
    explanation:
      "保單年度是很多條款計算的時間單位，這在跨年住院的情況下特別重要：若你在 12 月 28 日住院、1 月 5 日出院，部分條款會把費用按天數拆到兩個保單年度，分別計算自付額及限額。續保時保單年度重新起算，剩余的年度限額不會結轉。",
    example:
      "12 月 28 日至 1 月 5 日住院共 9 日，費用按 4 日與 5 日分攤至兩個保單年度。",
    whyItMatters:
      "跨年住院是實際會遇到的情況。若不清楚分攤規則，可能對報銷金額有完全錯誤的預期。",
    howToCompare: [
      "確認保單年度的起訖日（而非曆年）",
      "確認跨年開支的分攤方式",
      "確認年度限額是否會結轉至下一年",
    ],
    misconceptions: [
      {
        myth: "保單年度就是曆年",
        truth:
          "保單年度由生效日起算，可能是任何月份至次年同一月份。",
      },
      {
        myth: "用剩的年度限額會累積",
        truth:
          "多數產品年度限額用完即清零，不會結轉。",
      },
    ],
    relatedProductIds: ["hs-med-01", "bc-med-01"],
    relatedArticleSlugs: ["hospital-cover-limit", "renewal-terms"],
    relatedTerms: ["Coverage Limit", "Deductible", "Renewal"],
  }),
  t({
    term: "Material Fact",
    slug: "material-fact",
    zh: "重要事實",
    quickAnswer:
      "投保時必須向保險公司申報既有的疾病、求診紀錄及用藥情況。漏報可能導致保單被取消、拒絕索償，甚至要求退還已付保費。",
    explanation:
      "誠實申報是投保人的法律責任，也是保險公司定價的基礎。申報的範圍通常包括：過去 5 年的求診紀錄、正在使用的藥物、已確診的病症、以及曾接受的手術。香港的常見做法是要求投保人提交指定表格並簽署聲明，部分公司會進一步要求提供病歷副本。",
    example:
      "投保前兩年曾因濕疹求診並使用外用藥膏，投保表格問及過去就診紀錄，應如實申報。",
    whyItMatters:
      "漏報的代價在理賠時才會浮現，而且不僅是本次索償被拒，可能連帶整張保單失效。",
    howToCompare: [
      "確認申報要求的時間範圍（通常 5 年）",
      "確認申報不足的後果條款",
      "保留申報文件的副本及提交記錄",
    ],
    misconceptions: [
      {
        myth: "小病不用申報",
        truth:
          "一般求診紀錄都屬申報範圍，不因嚴重程度而豁免。",
      },
      {
        myth: "問診時順口講一句就算完成申報",
        truth:
          "須以書面表格及聲明為準，口頭提及不等於正式申報。",
      },
    ],
    relatedProductIds: ["hs-med-01", "ml-ci-01", "bc-med-01"],
    relatedArticleSlugs: ["hk-medical-insurance-basics"],
    relatedTerms: ["Underwriting", "Pre-existing Condition", "Exclusion"],
  }),
  t({
    term: "Sum Insured",
    slug: "sum-insured",
    zh: "保額",
    quickAnswer:
      "保額是保險公司最多愿意就某項保障赔付的上限金額。危疾與人壽是一次性賠付，保額即賠付金額；醫療保險則通常以年度限額或分項限額的形式出現。",
    explanation:
      "保額的設定邏輯因產品而異。人壽與危疾的保額應與收入需要掛鈎：一般以 3 至 5 年的家庭開支作參考，再加上債務與教育負擔。醫療保險的限額則應以最嚴重情境的預期醫療開支作參考。兩種邏輯不能混用——買了 HK$1,000,000 危疾保額但每月開支只有 HK$15,000，是保障過度；反之則是保障不足。",
    example:
      "家庭每月開支 HK$40,000、有一筆 HK$300,000 房貸、子女教育需 HK$500,000，危疾保額需要覆蓋這三項。",
    whyItMatters:
      "保額不足是「保了但賠不到位」的根源，而保額過度則浪費保費並增加財務核保難度。",
    howToCompare: [
      "確認保額是每項獨立限額還是全單共用",
      "確認保額是否會隨年齡或紅利調整",
      "用需求分析結果而非產品熱銷度來決定保額",
    ],
    misconceptions: [
      {
        myth: "保額愈高愈有保障",
        truth:
          "保額應與實際需要匹配，超出需要的保額只是浪費保費。",
      },
      {
        myth: "危疾保額可以當醫療費額用",
        truth:
          "危疾保額是一次性賠付，用途是收入替代；醫療費用需靠醫療保險。",
      },
    ],
    relatedProductIds: ["ml-ci-01", "ml-life-01", "hs-med-01"],
    relatedArticleSlugs: ["medical-vs-critical-illness", "hospital-cover-limit"],
    relatedTerms: ["Coverage Limit", "Life Insurance", "Critical Illness"],
  }),
  t({
    term: "Travel Insurance",
    slug: "travel-insurance",
    zh: "旅遊保險",
    quickAnswer:
      "旅遊保險保障旅行期間的意外、疾病醫療、行程延誤、財物遺失等風險，屬一次性保單，每次行程須重新購買。",
    explanation:
      "旅遊保險的核心風險是「在境外無法使用本地醫療及救援系統」。因此最高價值的保障往往是境外醫療費用及緊急送返，而不是財物保障。購買時要核對三件事：保障是否覆蓋你要去的所有國家、危險活動是否除外、以及自付額的大小。自付額對廉價行程尤其關鍵——有些計劃的車損自付額高於整份保單保費。",
    example:
      "行程取消導致已付旅費損失 HK$8,000，但自付額為 HK$1,000，最高可賠 HK$7,000。",
    whyItMatters:
      "旅遊保險是「低頻高損失」產品，幾百元的保費可能覆蓋幾十萬元的醫療開支，但前提是保障範圍對得上行程。",
    howToCompare: [
      "確認保障的地理範圍是否包含所有目的地",
      "確認危險活動清單及是否需要額外加購",
      "比較自付額與保費的比例",
    ],
    misconceptions: [
      {
        myth: "信用卡附送的旅遊保險就夠用",
        truth:
          "信用卡保障通常限額較低、涵蓋範圍有限，且不涵蓋所有行程類型。",
      },
      {
        myth: "旅遊保險可以年繳一次",
        truth:
          "多數旅遊保單按每次行程購買，須於出發前投保。",
      },
    ],
    relatedProductIds: ["pa-travel-01", "pa-travel-02"],
    relatedArticleSlugs: [],
    relatedTerms: ["Deductible", "Exclusion", "Claim"],
  }),
  t({
    term: "Underwriting",
    slug: "underwriting",
    zh: "核保",
    quickAnswer:
      "核保是保險公司評估風險並決定是否承保、以甚麼條款承保及收取多少保費的過程。核保結果可分為標準承保、加費承保、除外承保及拒保。",
    explanation:
      "核保是保險公司的風險閘門。醫療保險的核保多在投保時進行，但續保時也可能重新核保（除非保證續保）；危疾與人壽的核保通常更嚴格，須提交病歷及進行財務核保。「除外承保」是常見結果之一：某些病症（如已確診的高血壓）會被列為除外責任，該病症引發的索償不賠，但其他保障仍然生效。",
    example:
      "投保人申報有高血壓，核保結果為「除外承保」：因高血壓引發的住院不賠，其他疾病住院照常賠。",
    whyItMatters:
      "核保結果直接決定你實際擁有的保障範圍。「已投保」不等於「所有保障都生效」。",
    howToCompare: [
      "確認產品的核保類型（簡易核保 / 體檢 / 病歷審閱）",
      "確認除外承保的具體條款與影響範圍",
      "確認續保時是否會重新核保",
    ],
    misconceptions: [
      {
        myth: "核保通過就代表所有保障生效",
        truth:
          "除外承保是常見結果，部分病症已被列為不保，須看核保批註。",
      },
      {
        myth: "續保一定不會再核保",
        truth:
          "除保證續保產品外，續保時通常可按健康狀況重新評估。",
      },
    ],
    relatedProductIds: ["hs-med-01", "ml-ci-01", "ml-life-01"],
    relatedArticleSlugs: ["renewal-terms", "hk-medical-insurance-basics"],
    relatedTerms: ["Pre-existing Condition", "Premium", "Renewal"],
  }),
  t({
    term: "Waiting Period Extension",
    slug: "waiting-period-extension",
    zh: "等待期延長",
    quickAnswer:
      "部分保單會把等待期延長至指定年期（例如首 5 年不賠特定危疾），這是保險公司控制早期風險的常見做法，比較時要特別留意。",
    explanation:
      "常見的寫法是「於保單生效首 5 年內不保 X 疾病」或「等待期為 90 日，但若於 1 年內確診 X 疾病則不保」。這類條款的目的是減少逆選擇——避免投保後短期內就因高風險疾病索償。對比產品時，除了保額與保費，也要看是否有這類附加限制，因為它們可以令「保額較高」的產品在實際保障上反而較弱。",
    example:
      "A 產品保額 HK$1,000,000，但首 3 年不保癌症；B 產品保額 HK$800,000，無此限制——A 的實際保障未必較好。",
    whyItMatters:
      "這類條款在產品小冊子上常被略過，只在條款細則裏出現，是比較產品時最容易漏掉的一項。",
    howToCompare: [
      "逐條搜尋條款中的「首 X 年」、「不保」等字眼",
      "確認是否有按疾病分類的個別等待期",
      "比較時把附加限制與保額一併考慮",
    ],
    misconceptions: [
      {
        myth: "等待期就是 90 日這一個數字",
        truth:
          "部分產品有附加的年期限制，須看條款細則。",
      },
      {
        myth: "額外限制只在有索償時才重要",
        truth:
          "它直接決定你能否就特定疾病獲賠，屬於保障範圍的一部分。",
      },
    ],
    relatedProductIds: ["ml-ci-01", "ml-ci-02", "bc-ci-01"],
    relatedArticleSlugs: ["waiting-period", "critical-illness-claim-conditions"],
    relatedTerms: ["Waiting Period", "Critical Illness", "Exclusion"],
  }),

  // ---------------- A–C ----------------
  t({
    term: "Cancellation",
    slug: "cancellation",
    zh: "取消保單",
    quickAnswer:
      "取消保單指在保障生效後、於指定限期內或因特定原因（如延續供款、欺詐）終止合約。冷靜期內取消可全數退回保費。",
    explanation:
      "取消的原因決定了退款金額。冷靜期內取消是消費者權利，通常全額退款；之後的「因供款困難而取消」屬保險公司的酌情安排，可能只退還現金值或甚至不退款；因隱瞞重要事實而取消，則屬於欺詐處理，保險公司可取消合約並追討已付保費。香港部分產品提供「保單冷靜期以外的寬限取消」安排（例如首 90 日內可取消並扣減行政費）。",
    example:
      "投保後第 60 日因轉工而想取消：若保單沒有相關安排，只能按退保處理，退還現金值（若有的話）。",
    whyItMatters:
      "取消的經濟後果差異極大。規劃保險時應了解「如果將來改變主意會怎樣」，這是很多人在投保後才發現完全沒有退路的原因。",
    howToCompare: [
      "確認冷靜期外的取消安排是否存在及其條件",
      "確認退款金額的計算方式與所需文件",
      "確認因供款問題而取消時的處理",
    ],
    misconceptions: [
      {
        myth: "取消保單一定可以拿回保費",
        truth:
          "冷靜期後的取消通常只能退還現金值，若沒有現金值則可能全損。",
      },
      {
        myth: "供款困難可以隨時停繳",
        truth:
          "停繳不等於取消，保單會在寬限期後失效，保障隨之中斷。",
      },
    ],
    relatedProductIds: ["ml-life-01", "pa-savings-01"],
    relatedArticleSlugs: ["renewal-terms"],
    relatedTerms: ["Free Look Period", "Grace Period", "Cash Value"],
  }),
  t({
    term: "Disclosure",
    slug: "disclosure",
    zh: "披露／告知",
    quickAnswer:
      "披露是投保人向保險公司如實告知重要事實的義務。重要事實包括健康狀況、求診紀錄、职业、吸煙習慣及財務狀況。",
    explanation:
      "香港的保險法例要求投保人在訂約前披露足以影響保險公司承保決定的重要事實。實務上，保險公司會以書面表格列明具體問題，並要求投保人簽署聲明確認已回答。重要事實的界定以「理性投保人會認為相關」為標準。漏報的法律後果可以是索償被拒、合約被取消，以及退還已收保費。",
    example:
      "投保表格問「過去 5 年是否曾因任何原因求診或接受治療」，即使只是感冒求診也應如實回答。",
    whyItMatters:
      "披露是投保人最容易犯下、但代價最重的程序錯誤。而且錯誤往往在多年後理賠時才被發現。",
    howToCompare: [
      "逐項閱讀投保表格，確認每一題都已回答",
      "保留已填寫及簽署的表格副本",
      "確認已向保險公司提交所需的病歷或檢查報告",
    ],
    misconceptions: [
      {
        myth: "問「有沒有大病」才需要回答",
        truth:
          "表格上每一條列明的問題都需要回答，即使你認為與承保無關。",
      },
      {
        myth: "由保險公司代填就沒問題",
        truth:
          "投保人仍須確認內容正確並承擔責任，應親自核對每一項。",
      },
    ],
    relatedProductIds: [],
    relatedArticleSlugs: ["hk-medical-insurance-basics"],
    relatedTerms: ["Underwriting", "Pre-existing Condition", "Broker"],
  }),

  // ---------------- A–C ----------------
  t({
    term: "Outpatient",
    slug: "outpatient",
    zh: "門診",
    quickAnswer:
      "門診指在醫院逗留少於 24 小時的求診服務，不需過夜留宿。住院保險通常不覆蓋門診，門診保障一般須額外購買。",
    explanation:
      "門診與住院的費用結構完全不同：門診是大量低額、頻密；住院是少量高額、稀疏。保險公司因此把兩者拆開處理——住院可以做成基本層，門診則要加入共付比例、就診次數上限或指定網絡來控制成本。留意「門急症」與「門診」是不同項目：門急症指在急症室求診，通常較寬鬆且不會有門診的次數限制。",
    example:
      "感冒到診所看醫生、化驗血後回家，屬門診；同一個病人留院觀察一晚，屬住院。",
    whyItMatters:
      "醫療保險的門診保障是最高頻使用的一層，但很多產品只覆蓋住院，令投保人日常看病開支完全沒有報銷。",
    howToCompare: [
      "確認門診是否需額外附加，以及附加後的保費增幅",
      "確認門診是否設次數上限或只限指定網絡",
      "確認門急症是否獨立於門診保障",
    ],
    misconceptions: [
      {
        myth: "有住院保險就等於有醫療保障",
        truth:
          "住院保險通常不含門診，兩者費用結構不同，保險公司分開設計。",
      },
      {
        myth: "門急症等同門診",
        truth:
          "門急症是另一項獨立保障，條款及限制通常與門診不同。",
      },
    ],
    relatedProductIds: ["bc-med-01", "hs-med-02", "bc-med-02"],
    relatedArticleSlugs: ["hk-medical-insurance-basics", "medical-vs-critical-illness"],
    relatedTerms: ["Hospitalisation", "Co-payment", "Coverage Limit"],
  }),
  t({
    term: "Industry Data",
    slug: "industry-data",
    zh: "業界公開數據",
    quickAnswer:
      "業界公開數據指保險業公會或監管機構定期發布的統計，例如保費收入、索償率與投保人次。平台引用這些數字時應註明來源與統計期間。",
    explanation:
      "宏觀數據無法告訴你個別產品的保費是貴還是便宜，但能告訴你市場的整體方向：例如某類別保費普遍上升、索償率持續偏高、新造產品減少。這類資訊在判斷「為甚麼今年比去年貴」時特別有用。平台上的這類數據必須標明統計期間與發佈機構，否則讀者無從判斷其適用性。",
    example:
      "「2025 年香港個人醫療保險新造保單數量按年變化」這類統計可反映市場活動程度，但不能用來推斷個別產品質素。",
    whyItMatters:
      "公開數據是少數「完全不需要擔心商業利益動機」的資訊來源，在平台的信任架構中角色重要。",
    howToCompare: [
      "確認數據的發佈機構與統計期間",
      "留意是「保費收入」還是「新造保單數量」，兩者反映不同事情",
      "留意數據是否只覆蓋會員公司，而非全市場",
    ],
    misconceptions: [
      {
        myth: "業界數據可以用來比較個別產品",
        truth:
          "宏觀數據只能反映市場趨勢，不能推斷個別產品的條款或定價合理性。",
      },
      {
        myth: "有數字就代表準確",
        truth:
          "須留意統計口徑、涵蓋範圍及收集方式，不同機構的數字未必可直接比較。",
      },
    ],
    relatedProductIds: [],
    relatedArticleSlugs: ["renewal-terms"],
    relatedTerms: ["Claim Ratio", "Premium", "Renewal"],
  }),
  t({
    term: "Claim Ratio",
    slug: "claim-ratio",
    zh: "索償率",
    quickAnswer:
      "索償率是保險公司收到的保費中，用於支付理賠的比例。市場層面的整體索償率，是判斷保費走勢的重要參考，但個別產品的實際索償率不對外公開。",
    explanation:
      "當整體市場的索償率上升，保險公司通常會調整產品定價或收緊核保，這會反映在新保單的保費上。這解釋了為甚麼同一款產品相隔幾年投保，保費可能明顯不同——市場環境變了，不是你變了。所以比較同一產品的不同年份報價時，須留意當時的市場背景。",
    example:
      "某年整體醫療索償率上升，新一年推出的住院計劃保費普遍上調，與投保人年齡無關。",
    whyItMatters:
      "這解釋了為甚麼「同樣的產品，不同時候買，保費不同」，也提醒不要把市場性的保費調整理解成個別產品的性價比變化。",
    howToCompare: [
      "比較不同年份的保費時，先確認是否同期同一版本條款",
      "留意條款版本與發佈日期的差異",
      "留意市場整體的調整方向，而非只看單一產品",
    ],
    misconceptions: [
      {
        myth: "保費上升一定代表產品變差了",
        truth:
          "多數情況是市場索償率變化造成的重新定價，產品結構可能沒有變。",
      },
      {
        myth: "個別產品的索償率可以查到",
        truth:
          "通常只有公司層面的整體數字，個別產品數據不公開。",
      },
    ],
    relatedProductIds: [],
    relatedArticleSlugs: ["renewal-terms"],
    relatedTerms: ["Premium", "Renewal", "Industry Data"],
  }),
];

export const dictionaryMap: Record<string, DictionaryTerm> = Object.fromEntries(
  dictionary.map((d) => [d.slug, d]),
);

export function getTerm(slug: string): DictionaryTerm | undefined {
  return dictionaryMap[slug];
}

export function getTermByTerm(term: string): DictionaryTerm | undefined {
  return dictionary.find((d) => d.term.toLowerCase() === term.toLowerCase());
}

/** 依字母分組 */
export function groupTermsByLetter(
  list: DictionaryTerm[] = dictionary,
): { letter: string; terms: DictionaryTerm[] }[] {
  const map = new Map<string, DictionaryTerm[]>();
  for (const item of list) {
    const arr = map.get(item.letter) ?? [];
    arr.push(item);
    map.set(item.letter, arr);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([letter, terms]) => ({
      letter,
      terms: terms.sort((a, b) => a.term.localeCompare(b.term)),
    }));
}

/** 依字母索引（首字母 -> 術語），用於 A-Z 導航 */
export function termIndex(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const item of dictionary) {
    const key = item.letter.toLowerCase();
    out[key] = out[key] ?? [];
    out[key].push(item.slug);
  }
  return out;
}
