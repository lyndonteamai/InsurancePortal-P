# PLATFORM_PRINCIPLES.md — 保險指南平台原則

> 本文件是 `InsurancePortal-P`（保險指南 Insurance Compass HK）資料層與內容生產的**約束條件**。
> 任何新增的產品、頁面、欄位、演算法，都必須符合這四條創辦人原則與下方八條實作原則。
> 原則不是宣傳文案，而是可被檢查的規則——它們對應到程式碼中的具體實作位置。

---

# 第 0 層：創辦人原則（Founder Principles）

> 這四條高於下面所有實作原則。當兩者衝突時，第 0 層優先。
> 它們不是理念宣示，而是可以被程式碼審查推翻的規則。

## F1. NEVER PAY-TO-RANK

**Never pay to rank.**

付費合作可以影響合作的形式、位置與時程，但**永遠不能購買自然搜索排名**。

**可驗證的失敗**：`src/lib/search.ts` 的 `organicRankScore()` 只接受 `resultType === "organic"` 的結果；
任何 `resultType === "sponsored"` 的項目在排序前就被 `extractSponsored()` 撈出，
不進入自然結果佇列，也不參與自然排序計分。
若有一天付費結果可以被餵進 `organicRankScore()`，這條原則即已被違反。

**對應頁面**：`/ranking-methodology`（搜索與比較結果如何排序？）

---

## F2. NEVER SELL INSURANCE DIRECTLY

**Never sell insurance directly.**

平台是資訊與比較平台，不是銷售渠道。平台**永遠不完成保險交易**。

**禁止的實作**：Buy Now / Apply Now / Checkout / Payment / 投保申請 / 立即成交 / 保單簽訂。

**允許的商業閉環上限**：Contact / Referral / Introduction —— 使用者留下聯絡方式，
平台把請求轉交合適的持牌保險人士，然後**平台停止**。

**可驗證的失敗**：`src/components/contact-professional-modal.tsx` 的按鈕文字是「請求聯絡」，
提交後的提示是「Prototype：正式版本将根据用户同意，把联系请求转交适当的持牌保险专业人士。」，
並在表單上方常駐聲明「平台不會完成保險交易」。

**對應頁面**：`/commercial-transparency`（商業透明度）

---

## F3. SOURCE BEFORE CLAIM

**Source before claim.**

任何被主張的事實，都必須先有出處。沒有來源的事實不上線；有來源但未核實的事實，
必須帶著「尚未核實」狀態出現，而不是被當成確定結論。

**可驗證的失敗**：`src/data/evidence.ts` 的 `extractProductEvidence()` 只會為帶有 `sourceIds`
的欄位產生 `Evidence`；`hasTraceableEvidence()` 在找不到可解析來源時回傳 `false`，
UI 因此顯示「尚未有來源」而不是給出一個假的連結。

**原型資料的硬性要求**：任何原型模擬資料必須顯示
「原型模擬資料 — 尚未連接真實官方來源」（`DemoDataNotice`）。
**絕對不能製造假的官方 PDF、假的發布者或假的頁碼引用。**

---

## F4. USER DECIDES

**User decides.**

平台解釋結構、揭露差異、指出需要問的問題，**但不替使用者做決定**。

**禁止的實作**：「最適合你」「第一名」「保證最划算」「性價比之王」「編輯精選」。

**允許的實作**：解釋差異從哪裡來、這個差異對你的實務影響、還有甚麼需要確認。

**使用者的路徑**：Search → Understand → Verify → Compare → Decide。
若使用者想找專業人士：Decide → Request Contact → Licensed Professional，
之後**平台停止**，不進入交易。

**對應頁面**：`/trust`（信任中心）

---

## 1. 資料優先於觀點（Source-First）

**規則**：任何產品數據如果沒有對應的來源文件，就不允許出現在頁面上。數據不是「編輯整理的描述」，而是「有出處的事實」。

**實作**：
- `src/data/types.ts` — `CoverageItem.sourceIds`、`ExclusionItem.sourceIds`、`SourceDocument`
- `src/components/source-list.tsx` — 產品頁的「資料來源」區塊；無來源時顯示 `目前尚未加入可核實來源。`
- `src/data/sources.ts` — 全域來源登錄表與 `resolveSource()` / `collectSources()`

**可驗證的失敗**：新增一個 `coverage` 項目但 `sourceIds: []`，則該項目在產品頁會被標示為未核實。

---

## 2. 主動暴露不確定性（Verification as First-Class）

**規則**：平台不隱藏自己的資料缺口。每個產品都必須有一個核實狀態，且狀態必須對讀者可見、可點擊展開。

**四個狀態**（`VerificationStatus`）：

| 狀態 | 意思 |
|---|---|
| `verified` 已核實 | 所有列出欄位已對照來源核對 |
| `partially_verified` 部分核實 | 部分欄位已核對，其餘為示例數字 |
| `unverified` 尚未核實 | 未加入可核實來源，僅作說明用途 |
| `demo` 原型模擬資料 | 為虛構示範內容 |

**實作**：
- `src/components/verification-badge.tsx` — 四狀態徽章，點擊展開解釋與 `unverifiedFields`
- `src/data/types.ts` — `VERIFICATION_LABELS` / `VERIFICATION_DESCRIPTIONS`

**硬性規則**：不存在「已核實」但同時標記多個 `unverifiedFields` 的組合。

---

## 3. 不排名、不配對（No Ranking）

**規則**：平台不對產品排序、不評分、不標示「最佳／首選／性價比之王」，也不給出「最適合你」。

**原因**：保險產品的優劣高度取決於個人健康、財務與需求條件。平台沒有這些資料，任何「最適合你」都是編輯偏好包裝成客觀結論。

**允許的排序**：純結構性排序（名稱、保費高低、條款數量、續保方式），且必須在 UI 上明確說明「這不是排名」。

**實作**：
- `src/components/product-explorer.tsx` — 排序維度全部結構性，並附說明文字
- `src/components/compare-view.tsx` — 差異解釋只說「差異從哪裡來」
- `src/app/trust/page.tsx` — 「我們不做排名」章節

**禁止的詞**：`最適合你`、`一定最好`、`保證最划算`、`最佳`、`No.1`、`編輯精選`、`人氣榜`、`冠軍`。

---

## 4. 缺失即顯示缺失（Show the Gap）

**規則**：欄位沒有值時，顯示 `資料未提供`，而不是省略該列、填上 `—`、或用 0 代替。

**原因**：缺失本身是資訊。把它藏起來，讀者就無法判斷這份資料的可用程度。

**實作**：
- `src/lib/compare-insights.ts` — `MISSING_DATA = "資料未提供"`，比較表逐格判斷
- `src/components/compare-view.tsx` — 差異欄位用斜體弱化顯示

---

## 5. 中立於商業關係（Commercial Neutrality）

**規則**：金錢不能改變數據。合作、佣金、赞助都不得影響：產品資料的完整性、核實狀態、比較表的呈現方式。

**實作**：
- 比較引擎的排序邏輯位於 `src/lib/compare-insights.ts`，不接受任何外部權重參數
- `src/app/trust/page.tsx` — 明確列出商業合作如何不影響客觀資料

**將來接入商業模式的邊界**：可以為付費用戶提供「額外功能」（例如儲存清單、更多篩選），但**產品資料本身與比較結果必須對所有用戶完全一致**。

---

## 6. 比較是解機制，不是評分（Explain the Mechanism）

**規則**：比較引擎的四個層級都不輸出結論，只輸出「數值差異 → 造成差異的條款機制 → 需要問專業人士的問題」。

**四層結構**（`src/lib/compare-insights.ts`）：
1. **快速差異** — 自動挑出最關鍵的 3 個差異並解釋成因與影響
2. **完整比較表** — 結構化分組逐列對照，缺失值明示
3. **差異解釋** — 說明差異從哪個條款機制而來
4. **應問的問題** — 自動生成要向保險公司或經紀提問的具體問題清單

**硬性規則**：任何一層的輸出字串都不得包含第 3 條列出的禁止詞。

---

## 7. 資料層與呈現層分離（Schema / Presentation Separation）

**規則**：頁面不直接依賴硬編碼的產品文案。所有產品、保險公司、條款、來源、術語都是可獨立擴展的實體，頁面透過 id 關聯。

**這是「可擴展到數千個產品、數萬個問題」的結構前提**：

| 實體 | 型別 | 檔案 |
|---|---|---|
| 保險公司 | `Insurer` | `src/data/insurers.ts` |
| 產品 | `InsuranceProduct` | `src/data/products.ts` |
| 條款項目 | `CoverageItem` / `ExclusionItem` | 內嵌於產品 |
| 來源文件 | `SourceDocument` | `src/data/sources.ts` |
| 術語 | `DictionaryTerm` | `src/data/dictionary.ts` |
| 主題頁 | `TopicHub` / `HubSection` | `src/data/hubs.ts` |
| 文章 | `Article` | `src/data/articles.ts` |
| FAQ | `FaqItem` | `src/data/faqs.ts` |

**規則細則**：
- 類別使用英文 enum（`medical` / `critical-illness` / …），中文顯示名只在 UI 層翻譯（`CATEGORY_LABELS`）
- 新增一個產品只需要在 `products.ts` 加一個物件，不需要改任何頁面
- 新增一個搜尋資料源只需要在 `src/lib/search.ts` 的 `searchAll()` 加一個迴圈
- 新增一個主題頁只需要在 `hubs.ts` 加一個物件 + 一個薄路由檔

---

## 8. 保護使用者、不製造需求（Protect the User）

**規則**：平台不設投保或報價流程，不收集健康資料、身份證明或財務資料，不製造焦慮式行銷。

**實作**：
- `src/components/report-issue-button.tsx` — 回報表單明確聲明「不會要求你提供身份證明號碼、健康紀錄或任何個人資料」
- `src/app/legal/prototype/page.tsx` — 原型說明頁列明未做與不做的事
- 全站無「立即投保」「立即報價」按鈕

**Prototype 誠實原則**：沒有後端的表單必須明確說明「不會被實際送出」，不假裝已收到。

---

## 附錄 A：分析事件抽象層

頁面只呼叫 `trackEvent(name, payload)`（`src/lib/analytics.ts`），底下換成任何分析服務都不需要改動頁面。Prototype 階段寫入 console + localStorage，供 `/admin-preview` 查看。

**規則**：事件名稱定義在 `AnalyticsEventName` union，新增事件必須先加到 union 內，不允許用任意字串。

---

## 附錄 B：資料完整度分數只在後台

`src/lib/completeness.ts` 計算六個維度的加權完整度分數與 A–D 評級。

**硬性規則**：此分數**只允許**出現在 `/admin-preview`。消費者介面永遠不顯示「你的資料完整度 87 分」這類指標——那會變成另一種隱性排名。

---

## 附錄 C：新增頁面的檢查清單

新增任何資料頁時，逐項確認：

- [ ] 資料模型有 `sourceIds` 或對應的 `sourceDocuments`
- [ ] 有 `verification` 狀態，並用 `VerificationBadge` 顯示
- [ ] 有「一句話答案」區塊（GEO / 快速答案）
- [ ] 有 `pageMetadata()` 產生 canonical + OpenGraph
- [ ] 有 `breadcrumbJsonLd()` 麵包屑結構化資料
- [ ] 有對應的 `DefinedTerm` / `Article` / `InsuranceProduct` / `FAQPage` JSON-LD
- [ ] 缺失欄位顯示 `資料未提供`
- [ ] 無排名、無「最適合你」、無禁止詞
- [ ] 有 `ReportIssueButton` 入口（subjectType 對應）
- [ ] 已加入 `src/app/sitemap.ts`
- [ ] 手機 375/390/430/768 視窗下排版正常
- [ ] 鍵盤可達、焦點可見、aria 標籤正確
