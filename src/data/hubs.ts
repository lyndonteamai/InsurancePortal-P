import type { TopicHub } from "./types";

// ============================================================
// 主題權威頁 (Topic Authority Hubs)
// ============================================================
// 每個 Hub 是一個「可以被獨立擴展」的內容單元：
//   quickAnswer（給 GEO）→ intro → sections（分塊內容）→ 關聯資料
// Hub 的每個 section 都可獨立擴充，不影響其他 section。
// 日後要做到「數萬條內容」，就是靠這種可組合結構。
// ============================================================

const UPDATED = "2026-01-18";

export const hubs: TopicHub[] = [
  // ---------------------------------------------------------
  // 醫療保險
  // ---------------------------------------------------------
  {
    slug: "medical-insurance",
    title: "香港醫療保險完整指南",
    category: "medical",
    metaTitle: "香港醫療保險完整指南 2026｜自付額、續保、比較方法",
    metaDescription:
      "醫療保險的結構、自付額、續保年期、等待期與不保事項，一次講清。附 4 款醫療保險產品的可比較資料與判斷重點，不作排名推薦。",
    quickAnswer:
      "香港醫療保險的核心是三個變數：自付額結構、保障限額層級、續保年期。比較時用「每年保費 + 預期自付額」而非單看保費，並確認等待期與不保事項。",
    intro:
      "醫療保險是香港最多人持有的商業保險，但也是最容易被誤解的一類。它的作用很單純：把你因疾病或意外而產生的醫療開支，由保險公司承擔一部分。真正決定它值多少錢的，是自付額、保障限額、等待期、續保年期這四個條款變數，而不是保費數字本身。",
    sections: [
      {
        id: "what-it-covers",
        heading: "醫療保險實際上保障什麼",
        kind: "explain",
        body: [
          "醫療保險報銷的是「實際發生的合資格醫療開支」，採實報實銷：先扣除自付額，在保障限額內按報銷比例賠償，超出部分由你自付。它不是一次性給付的產品，這一點與危疾保險有本質區別。",
          "香港的醫療保險通常分兩層：住院保障是主流，門診保障多數要額外附加。住院保險的成本低而頻率低（一年未必住院一次），因此保費相對便宜；門診是大量低額、頻密的開支，保險公司通常用共付比例、就診次數上限或指定網絡來控制成本。",
          "部分產品把兩者合併為一個共同自付額，這種設計對全年有多次就診的人較為有利，但保費較高。",
        ],
        termSlugs: ["medical-insurance", "hospitalisation", "outpatient", "deductible"],
        articleSlugs: ["hk-medical-insurance-basics"],
      },
      {
        id: "four-variables",
        heading: "比較前必須確認的四個變數",
        kind: "compare-guide",
        body: [
          "第一是自付額結構。「每次住院 HK$5,000」與「每年 HK$2,000」在數字上看起來相近，但實際成本可能相反。判斷方法是用自己過去一兩年的就醫次數做一次估算，而不是憑感覺。",
          "第二是保障限額的層級。留意「每日限額」「每宗限額」「年度總限額」是三個不同的東西，並確認是否寫明「以實際開支為限」。同一產品標示「最高 HK$500,000」，可能只是年度上限而非住院限額。",
          "第三是續保年期。保證續保 5 年、續保至 75 歲、以及不保證續保，代表三種截然不同的長期成本可預測性。產品前幾年保費低，之後可能大幅加費甚至失去保障。",
          "第四是等待期。疾病等待期常見 90 至 180 日，意外等待期通常短得多甚至為零。投保後首半年內發病，是醫療保險最常見的「買了用不上」情境。",
        ],
        termSlugs: [
          "deductible",
          "coverage-limit",
          "renewal",
          "waiting-period",
          "policy-year",
        ],
        articleSlugs: ["deductible-explained", "renewal-terms", "waiting-period"],
      },
      {
        id: "medical-vs-critical",
        heading: "醫療保險與危疾保險的分工",
        kind: "compare-guide",
        body: [
          "這兩種產品經常被當成二選一，但它們處理的是不同的風險。醫療保險報銷「已發生的費用」，危疾保險一次性賠付「符合定義的保額」以替代因病失去的收入。",
          "一個簡單的判斷方式：如果你的醫療開支由醫療保險覆蓋，但康復期長達一至兩年期間沒有收入，這段缺口只有危疾保險能填補。缺少其中一項，保障都是不完整的。",
        ],
        termSlugs: ["critical-illness", "medical-insurance", "sum-insured"],
        articleSlugs: ["medical-vs-critical-illness"],
      },
      {
        id: "common-mistakes",
        heading: "投保前常見的三個誤解",
        kind: "mistake",
        body: [
          "第一，以為「有住院就能報銷」。實際上保險公司會按條款定義判定是否屬住院、是否在指定網絡、是否需預先批核，以及是否屬不保事項。治療類不保事項（藥物、復康器材、護理）尤其容易被忽略。",
          "第二，以為社保已經等於有醫療保障。醫管局提供的是公共醫療服務，私家及半私人住院的費用仍需商業保險覆蓋；而多數醫療保險產品本身也不涵蓋公共醫院收費。",
          "第三，以為首年保費低就代表划算。首年保費受年齡分級及市場定價影響，長期成本要看續保安排。把「總保費 + 預期自付額」一起算，才有意義。",
        ],
        termSlugs: [
          "exclusion",
          "pre-authorisation",
          "premium",
          "third-party-settlement",
        ],
        articleSlugs: ["hk-medical-insurance-basics"],
      },
      {
        id: "questions-to-ask",
        heading: "向保險公司或經紀提問的清單",
        kind: "faq",
        body: [
          "自付額是按每次還是每年計算？自付額用盡後是否仍然繼續計？",
          "保障範圍涵蓋哪些病房級別？指定網絡以外就診的報銷比例是多少？",
          "如果我要做手術並自費項目較多，可否先申請預先批核？批核需要多久？",
          "保證續保年期到期後，如果當時健康狀況改變會怎樣？保費會如何調整？",
          "這一版的保障限額是每項、每次還是每年？是否以實際開支為限？",
        ],
        termSlugs: ["renewal", "pre-authorisation", "coverage-limit"],
        articleSlugs: [],
      },
    ],
    productIds: ["hs-med-01", "hs-med-02", "bc-med-01", "bc-med-02"],
    termSlugs: [
      "medical-insurance",
      "hospitalisation",
      "outpatient",
      "deductible",
      "co-payment",
      "coverage-limit",
      "renewal",
      "waiting-period",
      "exclusion",
      "third-party-settlement",
    ],
    articleSlugs: [
      "hk-medical-insurance-basics",
      "deductible-explained",
      "renewal-terms",
      "waiting-period",
      "hospital-cover-limit",
    ],
    faqIds: ["faq-01", "faq-02", "faq-03", "faq-05", "faq-08"],
    updatedAt: UPDATED,
  },

  // ---------------------------------------------------------
  // 危疾保險
  // ---------------------------------------------------------
  {
    slug: "critical-illness-insurance",
    title: "香港危疾保險完整指南",
    category: "critical-illness",
    metaTitle: "香港危疾保險完整指南 2026｜危疾定義、保額、生存期解釋",
    metaDescription:
      "危疾保險的關鍵在條款定義而非疾病名稱。講解早期危疾、生存期、保額設定、多次賠付與常見不保事項，附可比較的產品資料。",
    quickAnswer:
      "危疾保險是確診即賠的一次性產品，核心在條款定義與保額是否匹配收入需要。比較時必須逐項對照定義清單，並確認生存期與早期病變是否包含。",
    intro:
      "危疾保險常被簡化成「賠錢的醫療保險」，但兩者性質完全不同。醫療保險報銷發票，危疾保險在你符合條款定義的當天就賠一笔固定金額，用途是替代因病不能工作期間的收入。這種性質決定了它的所有設計邏輯：保額應該與收入掛鈎，而不是與醫療費掛鈎。",
    sections: [
      {
        id: "how-it-works",
        heading: "危疾保險的運作方式",
        kind: "explain",
        body: [
          "投保人在保障期內確診條款列明的疾病，並符合相應的定義（嚴重程度、病理分期、治療方式等），保險公司即一次性支付基本保額。這筆錢與實際醫療開支無關，你不必提交發票。",
          "這個機制的好處是靈活性：一次賠付可以用於收入替代、康復期開支、家庭開支甚至康復後的生活調整。壞處是它對「定義」非常敏感——醫生說的診斷名稱與條款的定義，未必是同一件事。",
        ],
        termSlugs: ["critical-illness", "sum-insured", "claim"],
        articleSlugs: ["medical-vs-critical-illness", "critical-illness-claim-conditions"],
      },
      {
        id: "definition-matters",
        heading: "為甚麼「定義」比「疾病名稱」重要",
        kind: "compare-guide",
        body: [
          "一張寫着「癌症保障」的保單，不代表所有癌症都賠。要看的是：條款是否包含早期（原位癌 / 第 0 期）、是否要求特定分期、是否要求特定治療方式。同樣寫着「心臟病保障」，有的產品要求必須做過支架或心臟手術才賠，有的則涵蓋所有心臟病。",
          "比較方法是把兩份保單的定義清單並排，逐項對照「你真正可能得的病」。這需要時間，但這是唯一能確保保障範圍的方法。平台在產品頁的「重要限制」中列出了每項保障的定義要點，就是為了省去這一步。",
        ],
        termSlugs: ["critical-illness", "exclusion", "waiting-period-extension"],
        articleSlugs: ["critical-illness-claim-conditions"],
      },
      {
        id: "sum-insured-logic",
        heading: "保額應該怎樣設定",
        kind: "steps",
        body: [
          "第一步：算出家庭的必要開支，包括每月生活費、債務還款、子女教育費。",
          "第二步：加上需要在病假期間支付的部分（保險費、按揭、學費），這部分往往被漏算。",
          "第三步：除以你預期停工月數，得到基本的月度缺口。",
          "第四步：保額一般應覆蓋 3 至 5 年的需要。買得太少起不到收入替代作用，買得太多則浪費保費並可能需要更高的財務核保。",
          "注意保額應與醫療保險配合：醫療費由醫療保險報銷，危疾保額負責填補收入缺口，兩者不要重複計算。",
        ],
        termSlugs: ["sum-insured", "income-protection", "benefit"],
        articleSlugs: ["medical-vs-critical-illness"],
      },
      {
        id: "survival-period",
        heading: "生存期與等待期：兩個容易混淆的概念",
        kind: "explain",
        body: [
          "等待期是「不能賠」的期間，通常在保單生效後；生存期是「賠之前要活多久」的條件，通常在確診之後。兩者同時存在，意味着一張保單可以有很多個月完全不會賠。",
          "生存期的作用是排除短期自愈或誤診。香港常見 30 日，部分產品為 90 日，長者更長。注意部分產品會按疾病分類設定不同生存期——癌症 30 日而心臟病 90 日，這種細節在小冊子上看不到。",
        ],
        termSlugs: ["survival-period", "waiting-period", "claim"],
        articleSlugs: ["critical-illness-claim-conditions", "waiting-period"],
      },
      {
        id: "multi-pay",
        heading: "多次賠付產品：設計與限制",
        kind: "compare-guide",
        body: [
          "多次賠付產生的背景是癌症治療漸進、復發機率高，一筆賠付未必夠用。這類產品的關鍵不在「可賠幾次」，而在「間隔期」與「賠付比例」。",
          "間隔期指兩次賠付之間必須相隔多久。如果條款要求相隔 24 個月，對復發率較高的疾病，實際上第二次賠付可能永遠用不上。賠付比例同樣重要：第二次通常只賠基本保額的 50%，而癌症的第二次賠付有些產品會提高到 100%。",
        ],
        termSlugs: ["critical-illness-premium", "critical-illness"],
        articleSlugs: ["critical-illness-claim-conditions"],
      },
      {
        id: "critical-mistakes",
        heading: "危疾保險的四個常見誤解",
        kind: "mistake",
        body: [
          "第一，以為「有癌症就一定賠」。只有條款明文的定義才賠，臨床診斷與條款定義不一致時可能不獲賠。",
          "第二，以為危疾保險可以報銷醫療費。它是一次性賠付，用途是收入替代。",
          "第三，忽略續保。危疾保險普遍不保證續保，續保時保費按屆時年齡重新定價，可以是首年的兩三倍。",
          "第四，以為早期危疾是「小病」。早期癌症的治療成本可能遠高於後期，加上收入中斷期往往更長，保額需求並不低。",
        ],
        termSlugs: [
          "critical-illness",
          "renewal",
          "premium",
          "exclusion",
        ],
        articleSlugs: ["critical-illness-claim-conditions"],
      },
    ],
    productIds: ["ml-ci-01", "ml-ci-02", "bc-ci-01"],
    termSlugs: [
      "critical-illness",
      "critical-illness-premium",
      "sum-insured",
      "survival-period",
      "waiting-period",
      "waiting-period-extension",
      "renewal",
      "claim",
      "exclusion",
      "income-protection",
    ],
    articleSlugs: [
      "medical-vs-critical-illness",
      "critical-illness-claim-conditions",
      "waiting-period",
    ],
    faqIds: ["faq-04", "faq-06", "faq-09", "faq-12"],
    updatedAt: UPDATED,
  },

  // ---------------------------------------------------------
  // 人壽保險
  // ---------------------------------------------------------
  {
    slug: "life-insurance",
    title: "香港人壽保險完整指南",
    category: "life",
    metaTitle: "香港人壽保險完整指南 2026｜定期人壽、終身人壽與保額計算",
    metaDescription:
      "定期人壽與儲蓄型人壽的分別、保額計算方法、保證現金值與繳付年期，一次講清。含人壽產品可比較資料與風險提示。",
    quickAnswer:
      "人壽保險的作用是替代家庭收入，不是投資。定期人壽是純風險轉移，保費年期內固定；儲蓄型人壽有保證現金值但成本高得多，比較時必須把保證與非保證分開。",
    intro:
      "人壽保險是所有保險種類中最容易被誤購的一類。原因是它同時帶有保障與儲蓄的外觀，讓人以為買了就有「回報」。實際上，人壽保險的核心功能只有一個：當家庭的主要收入來源消失時，令家庭的生活能維持下去。任何「保本又有回報」的說法，都應該被質疑。",
    sections: [
      {
        id: "two-types",
        heading: "定期人壽與儲蓄型人壽",
        kind: "explain",
        body: [
          "定期人壽是純風險轉移：在指定保障年期內身故或全殘才賠，期滿沒有現金價值。保費在年期內固定，結構最簡單，保費也最便宜。適合已經有足夠資產、只需要填補收入缺口的人。",
          "儲蓄型人壽（終身人壽、分紅保單、儲蓄退休計劃）在身故保障之外加入了現金值累積。代價是保費高得多——同樣 HK$1,000,000 保額，定期人壽每年可能 HK$2,100，終身人壽每年可能 HK$24,500，差距超過十倍。",
          "判斷關鍵不是「哪個好」，而是「你需要的是保障還是儲蓄」。如果你的儲蓄已經足夠，買儲蓄型人壽等同用高價買了低效的儲蓄；如果儲蓄不足但有投資能力，定期人壽加自主投資通常更有效率。",
        ],
        termSlugs: ["life-insurance", "cash-value", "premium"],
        articleSlugs: ["life-insurance-types"],
      },
      {
        id: "how-much",
        heading: "保額應該怎樣計算",
        kind: "steps",
        body: [
          "第一步：算出家庭每年的必要開支（生活費、按揭、學費、保险費）。",
          "第二步：算出你身故後，家庭可以靠甚麼維持現有生活水平——其他收入來源、儲蓄、既有投資。",
          "第三步：用「必要開支 − 可替代收入」得出年度缺口，乘以需要覆蓋的年數。",
          "第四步：加上債務餘額（按揭、貸款），這部分無論收入是否仍在都必須償還。",
          "第五步：檢查保額是否受收入上限限制。很多家庭人壽產品要求提供收入證明，保額上限按年齡及收入審批。",
        ],
        termSlugs: ["sum-insured", "beneficiary", "occupation-class"],
        articleSlugs: ["life-insurance-types"],
      },
      {
        id: "beneficiary",
        heading: "受益人：最容易被遺漏的一步",
        kind: "steps",
        body: [
          "投保人填表時，經常會直接跳過「受益人」一欄。結果是保額要經遺產程序分配，既慢又可能涉及債務問題。",
          "指定受益人只需在投保時填寫表格，日後一般可書面更改。指定個人（如配偶、子女）可以避免分配程序；指定法定繼承人則保留灵活性但程序較繁。要留意受益人若先於受保人身故，或受益人為未成年子女的特殊安排。",
        ],
        termSlugs: ["beneficiary", "life-insurance", "material-fact"],
        articleSlugs: ["life-insurance-types"],
      },
      {
        id: "guaranteed-vs-non-guaranteed",
        heading: "保證與非保證的分別",
        kind: "compare-guide",
        body: [
          "儲蓄型產品都有一份現金值表，分成「保證」與「非保證」兩欄。保證部分由條款承諾不會減少；非保證部分取決於保險公司的投資表現，可以被下調，低至零。",
          "比較這類產品時，最低只應以保證部分計算。用樂觀的紅利演示去比較兩份產品，結論可能完全相反。保單上的「保證交 10 年／20 年」亦是關鍵訊息——之後的保費要由保單現金值繳付，若現金值不足以支應，保單可能失效。",
        ],
        termSlugs: ["cash-value", "benefit", "premium"],
        articleSlugs: ["life-insurance-types"],
      },
      {
        id: "life-mistakes",
        heading: "投保人壽保險的四個常見誤解",
        kind: "mistake",
        body: [
          "第一，以為人壽保險是投資。定期人壽沒有任何投資成分。",
          "第二，以為保額愈大愈好。超出收入需要的保額浪費保費，並可能引發財務核保。",
          "第三，以為「保證現金值」等於可即時取用的存款。它是保單上的數字，退保時會被扣費用。",
          "第四，以為可以隨時取消。冷靜期之後取消，通常只能取回現金值（若有的話）。",
        ],
        termSlugs: [
          "life-insurance",
          "sum-insured",
          "cash-value",
          "cancellation",
          "free-look-period",
        ],
        articleSlugs: ["life-insurance-types"],
      },
    ],
    productIds: ["hs-life-01", "ml-life-01", "pa-life-01"],
    termSlugs: [
      "life-insurance",
      "sum-insured",
      "beneficiary",
      "cash-value",
      "premium",
      "renewal",
      "cancellation",
      "free-look-period",
      "material-fact",
    ],
    articleSlugs: ["life-insurance-types"],
    faqIds: ["faq-10", "faq-13", "faq-16"],
    updatedAt: UPDATED,
  },

  // ---------------------------------------------------------
  // 旅遊保險
  // ---------------------------------------------------------
  {
    slug: "travel-insurance",
    title: "香港旅遊保險完整指南",
    category: "travel",
    metaTitle: "香港旅遊保險完整指南 2026｜醫療、行程延誤與自付額解釋",
    metaDescription:
      "旅遊保險的地理範圍、危險活動、自付額與緊急送返等關鍵項目，附可比較的旅遊保險產品資料與出發前檢查清單。",
    quickAnswer:
      "旅遊保險最關鍵的三項是地理範圍是否覆蓋目的地、危險活動是否除外、以及自付額大小。廉價行程最容易在自付額上出現「賠不到」的情況。",
    intro:
      "旅遊保險是典型的「低頻高損失」產品：幾百元的保費，覆蓋的是幾十萬元的境外醫療與緊急送返開支。它的價值高度集中在一項——你出事時能不能在異地獲得醫療與救援。因此，評估旅遊保險時，最重要的不是比較行程延誤或行李保障，而是確認醫療與救援範圍是否對得上你的行程。",
    sections: [
      {
        id: "core-coverage",
        heading: "哪些項目才是重要的",
        kind: "explain",
        body: [
          "境外醫療費用是核心項目。要留意的是限額是否「每人」計算，以及是否受自付額限制——這兩項的組合決定了你實際能拿回多少。",
          "緊急救援及送返同樣重要，而且成本極高。醫療專机送返的費用可以達到數十萬至數百萬港元，這一項往往比醫療費本身更關鍵，卻最常被忽略。",
          "行程延誤、行李遺失等屬於附加項目，對多數人而言價值較低，但在某些行程（例如需要出席重要活動）上則相反。",
        ],
        termSlugs: ["travel-insurance", "deductible", "coverage-limit"],
        articleSlugs: [],
      },
      {
        id: "geographic-scope",
        heading: "地理範圍與危險活動",
        kind: "compare-guide",
        body: [
          "不少旅遊保險對特定國家或地區另設限制（例如某些地區的醫療體系風險較高）。出發前應逐站核對，確認每個目的地都在保障範圍內。",
          "危險活動是第二個關鍵：潛水、滑雪、登山、跳傘等通常列為除外責任，部分產品提供付費加購。購買時最常見的錯誤是投保了「全旅遊」，但行程包含滑雪，結果出事時發現不保。",
        ],
        termSlugs: ["travel-insurance", "exclusion", "household"],
        articleSlugs: [],
      },
      {
        id: "deductible-trap",
        heading: "自付額陷阱：廉價行程的常見問題",
        kind: "compare-guide",
        body: [
          "旅遊保險的自付額是按每次事故計算的。行程取消導致損失 HK$8,000，若自付額為 HK$1,000，可賠 HK$7,000；但若行程總值只有 HK$3,000，自付額就已經超過損失本身。",
          "車損自付額的落差更極端。部分跨境自駕計劃的車損自付額為 HK$20,000，而整份保單保費可能只有 HK$1,180——這代表車損基本上要自己承擔，該加購項的實際價值需要重新評估。",
          "判斷方法：用「保費 ÷ 自付額」的比例來衡量這份保障對你有多實用。比例超過 1，代表你自付的錢比保費還多。",
        ],
        termSlugs: ["deductible", "travel-insurance", "coverage-limit"],
        articleSlugs: ["deductible-explained"],
      },
      {
        id: "before-departure",
        heading: "出發前檢查清單",
        kind: "steps",
        body: [
          "確認所有目的地都在保障的地理範圍內。",
          "確認行程中的所有活動都不在除外清單內，或已加購相關保障。",
          "記下保單的 24 小時緊急援助電話號碼，離線保存。",
          "確認指定醫院名單——但要注意境外就醫多由救援公司安排，指名醫院要求較寬鬆。",
          "確認電子保單可離線查閱，並把保單號碼及證明文件獨立存放。",
          "確認自付額金額，評估是否值得加購降低自付額的選項。",
        ],
        termSlugs: ["travel-insurance", "deductible", "exclusion"],
        articleSlugs: [],
      },
    ],
    productIds: ["pa-travel-01", "pa-travel-02"],
    termSlugs: [
      "travel-insurance",
      "deductible",
      "exclusion",
      "coverage-limit",
      "household",
      "accident",
    ],
    articleSlugs: ["deductible-explained", "hk-medical-insurance-basics"],
    faqIds: ["faq-05", "faq-11", "faq-15"],
    updatedAt: UPDATED,
  },
];

export const hubMap: Record<string, TopicHub> = Object.fromEntries(
  hubs.map((h) => [h.slug, h]),
);

export function getHub(slug: string): TopicHub | undefined {
  return hubMap[slug];
}
