import type { Metadata } from "next";
import Link from "next/link";
import {
  pageMetadata,
  breadcrumbJsonLd,
  jsonLdScript,
  webPageJsonLd,
} from "@/lib/structured-data";
import {
  Search,
  FileCheck2,
  Sparkles,
  Clock,
  ShieldCheck,
  Ban,
  ArrowRight,
} from "lucide-react";
import { CommercialDisclosure } from "@/components/sponsored-badge";

export const metadata: Metadata = pageMetadata({
  title: "搜索與比較結果如何排序？｜排序方法與商業關係說明",
  description:
    "保險指南的自然搜索與比較結果排序方法：相關性、資料完整度、查詢匹配、資料新鮮度、可核實程度。商業合作不會購買自然搜索排名。",
  path: "/ranking-methodology",
});

const FACTORS = [
  {
    id: "relevance",
    icon: Search,
    title: "相關性",
    weight: "最高",
    body: "你的查詢字串與該筆資料的匹配程度。這是排序最主要的依據 —— 查「自付額」，自付額相關的術語與產品應該排在前面。",
  },
  {
    id: "completeness",
    icon: FileCheck2,
    title: "資料完整度",
    weight: "高",
    body: "該筆資料有多少欄位是有完整記錄的。資料完整度 85% 的產品，在同等相關性下會排在 40% 的前面 —— 因為前者更值得比較。",
  },
  {
    id: "query-match",
    icon: Sparkles,
    title: "查詢匹配",
    weight: "高",
    body: "查詢是完整問題時，平台會先給你一句話答案，再列出相關的術語、文章與產品。",
  },
  {
    id: "freshness",
    icon: Clock,
    title: "資料新鮮度",
    weight: "中",
    body: "來源文件的版本日期與最後審核日期。較新的版本優先，但如果舊版本仍是現行有效的條款，不會因此被貶低。",
  },
  {
    id: "verifiability",
    icon: ShieldCheck,
    title: "可核實程度",
    weight: "中",
    body: "該筆資料是否有指向具體來源文件（條款、小冊子、保障表），以及該來源的核實狀態。已核實的資料在同等相關性下略微優先。",
  },
];

export default function RankingMethodologyPage() {
  const breadcrumbs = [
    { name: "首頁", href: "/" },
    { name: "信任中心", href: "/trust" },
    { name: "搜索與比較結果如何排序？", href: "/ranking-methodology" },
  ];

  const pageLd = webPageJsonLd({
    name: "搜索與比較結果如何排序？",
    description:
      "保險指南的自然搜索與比較結果排序方法，以及商業關係與排序的關係。",
    url: "/ranking-methodology",
  });
  const breadcrumbLd = breadcrumbJsonLd(breadcrumbs);

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(pageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd) }}
      />

      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/trust" className="hover:text-brand-700">
          信任中心
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">搜索與比較結果如何排序？</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
          搜索與比較結果如何排序？
        </h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          這頁說明平台怎樣決定搜尋結果與比較結果的先後順序，以及商業合作
          在甚麼情況下、或者不會影響這個順序。
        </p>
      </header>

      {/* 核心承諾 */}
      <section className="mt-7 rounded-xl border-2 border-brand-200 bg-brand-50/60 p-5">
        <p className="flex items-center gap-2 text-[14px] font-semibold text-brand-900">
          <Ban size={16} aria-hidden />
          商業合作不會直接購買自然搜索排名
        </p>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-brand-900/85">
          平台可能透過 Lead Referral、廣告、會員服務、B2B 資料 API 與其他服務
          取得收入。這些收入來源<strong>不會</strong>改變自然搜索結果與比較結果的
          排序。付費曝光會明確標示「贊助」，並且在獨立區塊呈現，
          永遠不會被放在自然結果的第一位。
        </p>
      </section>

      {/* 排序因素 */}
      <section className="mt-10" aria-labelledby="factors-heading">
        <h2
          id="factors-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          自然搜索結果的五個依據
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
          下列依據會影響自然結果的先後順序。權重代表相對影響力，
          不是精確的數值比例。
        </p>
        <ul className="mt-5 space-y-3">
          {FACTORS.map((f) => {
            const Icon = f.icon;
            return (
              <li
                key={f.id}
                className="rounded-xl border border-ink-line bg-white p-5"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon size={16} aria-hidden />
                  </span>
                  <h3 className="text-[15.5px] font-semibold text-ink">{f.title}</h3>
                  <span className="rounded-full border border-ink-line bg-paper px-2.5 py-0.5 text-[11.5px] font-medium text-ink-mute">
                    影響力：{f.weight}
                  </span>
                </div>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
                  {f.body}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 比較結果的排序 */}
      <section className="mt-10" aria-labelledby="compare-heading">
        <h2
          id="compare-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          比較結果是甚麼順序？
        </h2>
        <div className="mt-4 rounded-xl border border-ink-line bg-white p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-soft">
            比較頁<strong>不排序</strong>。你加入的產品永遠按你加入的順序排列，
            平台不會把某一份移到前面。頁面提供的是四個層次的協助：
          </p>
          <ol className="mt-3 space-y-2">
            {[
              ["快速差異", "系統自動挑出最關鍵的三個差別，讓你先看到重點。"],
              ["完整比較表", "逐項對照自付額、等候期、續保、保障額度，每個數值都可追問來源。"],
              ["差異解釋", "說明為甚麼會出現這些差別，以及對你實際的影響。"],
              ["應問的問題", "生成一份向保險公司或經紀確認的清單。"],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-800 text-[11px] font-semibold text-white">
                  {i + 1}
                </span>
                <span>
                  <span className="text-[13.5px] font-medium text-ink">{t}</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">
                    {d}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 誠實聲明 */}
      <section className="mt-10" aria-labelledby="honest-heading">
        <h2
          id="honest-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          關於「演算法是否客觀」
        </h2>
        <div className="mt-4 rounded-xl border border-ink-line bg-white p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-soft">
            我們不會聲稱排序方法完全客觀。任何排序都涉及權衡：甚麼算相關、
            資料完整度如何量度、哪些欄位優先。不同的權重設定，會得出不同的先後順序。
          </p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
            排序方法會隨著資料庫成長與使用者回饋持續改進。我們會在方法有重大變動時
            更新這一頁，並記錄變更原因。平台的立場是：與其聲稱「絕對中立」，
            不如把方法公開，讓你自己判斷。
          </p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
            另外，平台<strong>永遠不會</strong>產生「最適合你」「第一名」
            「保證最划算」這類結論。原因很直接：平台不知道你的健康狀況、
            財務狀況與風險承受能力，而排名往往由佣金與廣告預算決定。
          </p>
        </div>
      </section>

      {/* 商業透明度 */}
      <section className="mt-10" aria-labelledby="commercial-heading">
        <h2
          id="commercial-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          商業合作如何呈現
        </h2>
        <div className="mt-4">
          <CommercialDisclosure variant="panel" />
        </div>
        <div className="mt-4 rounded-xl border border-ink-line bg-white p-5">
          <ul className="space-y-2.5">
            {[
              [
                "贊助結果",
                "任何付費曝光都會標示「贊助」，在獨立區塊呈現，並附上說明文字連結到這一頁。",
              ],
              [
                "資料層面的分離",
                "搜索結果在資料結構上就有 organic（自然）與 sponsored（贊助）兩種標記。自然排序的計算函式只處理自然結果 —— 贊助項目在程式層面就無法進入排序。",
              ],
              [
                "不影響比較",
                "比較頁不排序，也不存在「贊助產品優先」的情況。付費曝光不會改變比較表的任何一行。",
              ],
              [
                "不影響核實狀態",
                "付費曝光不會提升資料的核實狀態。標示「已核實」的依據是人工審核紀錄，與商業關係無關。",
              ],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                <span>
                  <span className="text-[13.5px] font-medium text-ink">{t}</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">
                    {d}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 相關頁面 */}
      <section className="mt-10" aria-labelledby="related-heading">
        <h2
          id="related-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          相關說明
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/commercial-transparency"
            className="group rounded-xl border border-ink-line bg-white p-5 hover:border-brand-300"
          >
            <p className="text-[14.5px] font-semibold text-ink group-hover:text-brand-700">
              商業透明度
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
              平台如何賺錢、Lead Referral 如何運作、甚麼是贊助內容。
            </p>
            <p className="mt-2 flex items-center gap-1 text-[12.5px] font-medium text-brand-700">
              閱讀
              <ArrowRight size={13} aria-hidden />
            </p>
          </Link>
          <Link
            href="/trust"
            className="group rounded-xl border border-ink-line bg-white p-5 hover:border-brand-300"
          >
            <p className="text-[14.5px] font-semibold text-ink group-hover:text-brand-700">
              信任中心
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
              資料來源、編輯方針、四級核實狀態、AI 使用原則與回報資料問題。
            </p>
            <p className="mt-2 flex items-center gap-1 text-[12.5px] font-medium text-brand-700">
              閱讀
              <ArrowRight size={13} aria-hidden />
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
