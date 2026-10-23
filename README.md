# 保險指南 Insurance Compass HK（Prototype）

> GitHub 倉庫：**https://github.com/lyndonteamai/InsurancePortal-P**
> 倉庫名 `InsurancePortal-P` 為部署平台需要嘅識別名；網站對外品牌名仍為「保險指南 Insurance Compass HK」。

香港保險資訊及比較平台的可互動網站原型。定位類比「房產資訊入口」在保險市場的應用：
以中立、資料可驗證嘅方式整理產品資料同條款，令消費者在投保之前先了解。

> ⚠️ **Prototype 聲明**
> 所有保險公司名稱、產品、條款、保障上限、保費、知識文章及常見問題均為**虛構模擬資料**，
> 並非真實香港保險市場的產品或報價，亦不構成任何保險、法律、稅務或投資建議。
> 平台不設投保流程、不產生真實報價、不收集任何個人或健康資料。

---

## A. 啟動方式

```bash
cd /workspace/insurance-compass
npm install          # 首次執行
npm run dev          # 開發模式 → http://localhost:3000
# 或
npm run build && npm start   # 生產模式 → http://localhost:3000
```

本地預覽網址：**http://localhost:3000**

### 雲端版本（已發布）

**https://a635c5dda023162b0.app.workbuddy.host/?sharecode=4JCDI64U6X**

> 請完整保留連結（含 `?sharecode=...`）—— 它係訪問憑據，缺失會顯示「連結不完整」。
> 首次訪問後會寫入 cookie，之後直接訪問同域名各路徑亦可。

部署方式：`next start -H 0.0.0.0 -p ${PORT:-3000}`（單進程 HTTP 服務，發布通道自動注入 PORT）。

環境：Next.js 15.5.4 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 3.4 · lucide-react
無資料庫、無外部 API、無第三方註冊依賴。

---

## B. 已完成功能

| 頁面 | 路徑 | 說明 |
|---|---|---|
| 首頁 | `/` | Hero 真實搜尋（即時下拉結果）、4 個保障類型入口、熱門產品比較、6 篇文章、透明度區域 |
| 產品列表 | `/products` | 5 組篩選 + 3 種排序 + 關鍵詞搜尋 + 清除篩選，支援 `?category=` 參數 |
| 產品詳情 | `/products/[id]` | 基本資訊、保障內容表格、「了解這份保單」六面向、模擬保費聲明、相關產品/文章 |
| 產品比較 | `/compare` | 最多 3 個產品橫向比較表、每欄「了解這項條款」說明、客觀差異摘要 |
| 保險知識中心 | `/learn` | 6 大分類、標題+內容搜尋、20 條 FAQ 搜尋模組 |
| 文章詳情 | `/learn/[slug]` | 8 篇完整文章：正文、重要資訊摘要、相關文章、相關產品比較、免責說明 |
| 需求分析 | `/needs` | 4 步問卷（3 問 + 結果），輸出保障項目/條款/文章/產品導航 |
| 全站搜尋 | `/search?q=` | 涵蓋產品、公司、類別、文章、FAQ，中文複合詞 2-gram 匹配 |
| 透明度 | `/transparency` | 資料來源、產品資料結構、更新方式、商業合作分隔 |
| 其他 | `/about` `/contact` `/legal/*` | 關於、聯絡、免責聲明、私隱政策、原型開發說明 |
| 技術 | `sitemap.xml` `robots.txt` | 每頁獨立 metadata + canonical；robots 設 noindex（原型期） |

### 互動細節
- 比較清單：React Context + `localStorage`（鍵 `ic-compare-list`），**跨頁面保持**，最多 3 個
- 手機版：比較表 `overflow-x: auto` 可橫向滑動；導收合選單；無橫向溢出（實測 0px）
- 短語：**零 React Console 錯誤**（已實測）

---

## C. 專案檔案

```
insurance-compass/
├─ src/
│  ├─ data/                ← 所有模擬資料（可自由修改）
│  │  ├─ types.ts          ← 統一資料模型（InsuranceProduct / Article / FaqItem）
│  │  ├─ products.ts       ← 12 個產品 + 4 個虛構品牌
│  │  ├─ articles.ts       ← 8 篇知識文章 + 6 個分類
│  │  └─ faqs.ts           ← 20 條常見問題
│  ├─ lib/
│  │  ├─ site.ts           ← 品牌名、導覽、頁尾連結、聯絡資料
│  │  ├─ compare-context.tsx ← 比較清單狀態（Context + localStorage）
│  │  └─ search.ts         ← 全站搜尋邏輯
│  ├─ components/          ← UI 元件
│  └─ app/                 ← 頁面（App Router）
├─ e2e-test.js             ← Playwright 端到端測試（27 項）
└─ tailwind.config.ts      ← 品牌色（brand 深藍 / accent 青綠）
```

### 常見修改

| 想改什麼 | 改哪裡 |
|---|---|
| 品牌名稱 | `src/lib/site.ts` → `site.nameZh` / `site.nameEn` / `tagline` |
| Logo 圖示 | `src/components/logo.tsx`（現用 `ShieldCheck`） |
| 主題色 | `tailwind.config.ts` → `colors.brand` / `colors.accent` |
| 新增保險產品 | `src/data/products.ts` 加一個 `InsuranceProduct` 物件（欄位參考 `types.ts`） |
| 新增文章 | `src/data/articles.ts` 加一個 `Article` 物件（`slug` 自動成為 URL） |
| 新增 FAQ | `src/data/faqs.ts` 加一個 `FaqItem` |
| 新增產品類別 | `types.ts` 的 `InsuranceCategory` + `products.ts` + `app/page.tsx` 的 `categoryCards` |
| 頁尾／頁腳連結 | `src/lib/site.ts` → `footerLinks` |
| 聯絡資料 | `src/lib/site.ts` → `site.contact` |

---

## D. 尚未完成 / 需要外部資源

**只是模擬，未接入真實世界：**
- 全部保險公司、產品、條款、保費為虛構，未使用任何真實保單條款或市場報價
- 需求分析結果由固定規則對應產生，非 AI 推斷
- FAQ 為本地關鍵字搜尋，非真實 AI API
- 比較差異摘要只描述數據差異，刻意不給出「最適合你」類結論

**尚未實現：**
- 真實保險公司／產品資料接入（需與持牌機構簽訂資料授權協議）
- 即時報價或保費計算引擎（需保險公司 API 或 actuarial 資料）
- 持牌保險專業人士名單查詢（需監管名單資料來源）
- 用戶帳戶、收藏跨裝置同步（需後端 + 資料庫）
- 多語言（目前只有繁體中文）

**需要法律或監管審核：**
- 所有條款解釋文字與「資料整理方式」描述
- 免責聲明、私隱政策
- 正式上線前 robots 需改為允許索引，並補上正式 sitemap 內容

---

## E. 測試

```bash
node e2e-test.js     # 需先啟動 next start -p 3000
```

27 項檢查全部通過，涵蓋：首頁/列表/詳情/文章渲染、搜尋、篩選、排序、清除篩選、
加入/移除/清除比較清單、跨頁狀態保持、兩欄比較、差異摘要更新、條款說明展開、
知識搜尋、FAQ 搜尋與展開、需求分析四步完成、全站搜尋分類結果、
主要頁面導航、手機版選單、手機版零溢出、比較表橫向滑動、零 Console 錯誤。
