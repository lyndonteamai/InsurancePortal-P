import type { Metadata } from "next";
import Link from "next/link";
import {
  pageMetadata,
  breadcrumbJsonLd,
  jsonLdScript,
  webPageJsonLd,
} from "@/lib/structured-data";
import {
  HandCoins,
  Megaphone,
  Search,
  Users,
  Database,
  ArrowRight,
  Ban,
  FileText,
} from "lucide-react";
import { CommercialDisclosure } from "@/components/sponsored-badge";

export const metadata: Metadata = pageMetadata({
  title: "商業透明度｜平台如何賺錢、贊助內容與自然結果的分別",
  description:
    "保險指南的商業透明度說明：平台如何賺錢（Lead Referral、廣告、會員、B2B 資料、API）、什麼是贊助內容、商業合作如何標示，以及平台不會因佣金秘密改變自然結果。",
  path: "/commercial-transparency",
});

const REVENUE = [
  {
    id: "referral",
    icon: Users,
    title: "Lead Referral（諮詢轉介）",
    body: "如果你在看過比較結果後，主動要求聯絡持牌保險人士，平台可能把你的諮詢意向轉介給合適的持牌專業人士。平台本身不收取保費、不代理投保、不介入任何保單條款。",
    note: "轉介前一定會取得你的明確同意，並說明資料會如何被使用。",
  },
  {
    id: "advertising",
    icon: Megaphone,
    title: "廣告與贊助內容",
    body: "第三方（例如保險科技公司、財經媒體）可以在平台上購買明確標示的廣告位。贊助內容一律帶有「贊助」標記，放在獨立區塊，與自然結果完全分開。",
    note: "贊助曝光永遠不會被安排在自然結果的第一位。",
  },
  {
    id: "membership",
    icon: HandCoins,
    title: "會員服務",
    body: "未來可能提供付費會員，例如進階比較工具、產品變更提醒、資料匯出或 API 額度。會員權益只影響付費功能，不影響自然結果的排序。",
    note: "會員資格不會改變核實狀態，也不會讓產品在自然結果中排名上升。",
  },
  {
    id: "b2b-data",
    icon: Database,
    title: "B2B 資料與 API",
    body: "未來可能向其他機構提供經過核實的結構化保險資料 API，或提供市場統計與比較工具。出售的是「經核實的資料」，不是「把某個產品排到前面」。",
    note: "資料 API 的授權條款會明確規定不得用於建立競品的排序操控。",
  },
];

export default function CommercialTransparencyPage() {
  const breadcrumbs = [
    { name: "首頁", href: "/" },
    { name: "信任中心", href: "/trust" },
    { name: "商業透明度", href: "/commercial-transparency" },
  ];

  const pageLd = webPageJsonLd({
    name: "商業透明度",
    description:
      "保險指南的收入來源、贊助內容的定義與標示方式，以及商業合作與自然結果的分離。",
    url: "/commercial-transparency",
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
        <span className="text-ink-soft">商業透明度</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
          商業透明度
        </h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          這頁說明平台如何賺錢、甚麼是贊助內容、甚麼是自然結果，以及商業合作
          如何被標示。把它放在信任中心裡，是因為「平台怎樣賺錢」本身就是
          使用者評估平台可信度的一部分。
        </p>
      </header>

      {/* 核心原則 */}
      <section className="mt-7 rounded-xl border-2 border-brand-200 bg-brand-50/60 p-5">
        <p className="flex items-center gap-2 text-[14px] font-semibold text-brand-900">
          <Ban size={16} aria-hidden />
          平台不會因為佣金秘密改變自然結果
        </p>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-brand-900/85">
          這不是一句宣傳口號，而是程式碼層面的設計。自然搜索結果與比較結果的排序
          函式只處理自然結果，付費曝光在資料結構上就是另一種類型，
          <strong>不可能</strong>進入排序計算。
        </p>
      </section>

      {/* 收入來源 */}
      <section className="mt-10" aria-labelledby="revenue-heading">
        <h2
          id="revenue-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          平台如何賺錢
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
          以下是平台預計的收入來源。列出來，是為了讓你能自己評估每一種收入
          可能帶來甚麼樣的偏差 —— 並且知道我們用甚麼機制去防範它。
        </p>
        <ul className="mt-5 space-y-3">
          {REVENUE.map((r) => {
            const Icon = r.icon;
            return (
              <li
                key={r.id}
                className="rounded-xl border border-ink-line bg-white p-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon size={16} aria-hidden />
                  </span>
                  <h3 className="text-[15.5px] font-semibold text-ink">
                    {r.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
                  {r.body}
                </p>
                <p className="mt-2.5 rounded-lg bg-paper px-3 py-2 text-[12.5px] leading-relaxed text-ink-soft">
                  <span className="font-medium text-ink">保障機制：</span>
                  {r.note}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 三個定義 */}
      <section className="mt-10" aria-labelledby="definitions-heading">
        <h2
          id="definitions-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          三個容易混淆的概念
        </h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="rounded-xl border border-ink-line bg-white p-5">
            <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
              <Search size={15} className="text-brand-600" aria-hidden />
              自然結果
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              由相關性、資料完整度、查詢匹配、資料新鮮度與可核實程度決定。
              與任何商業關係無關。
            </p>
          </div>
          <div className="rounded-xl border-2 border-amber-300 bg-amber-50/50 p-5">
            <p className="flex items-center gap-2 text-[14.5px] font-semibold text-amber-900">
              <Megaphone size={15} aria-hidden />
              贊助結果
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-amber-900/85">
              付費換來的曝光位置。必須標示「贊助」，放在獨立區塊，
              不參與自然排序，也不會出現在自然結果的第一位。
            </p>
          </div>
          <div className="rounded-xl border border-ink-line bg-white p-5">
            <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
              <FileText size={15} className="text-brand-600" aria-hidden />
              編輯內容
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              平台編輯團隊撰寫或審核的內容（例如知識文章、術語解釋、主題指南）。
              按編輯方針獨立完成，不受商業關係影響。
            </p>
          </div>
        </div>
      </section>

      {/* Lead Referral 如何運作 */}
      <section className="mt-10" aria-labelledby="referral-heading">
        <h2
          id="referral-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          Lead Referral 如何運作
        </h2>
        <div className="mt-4 rounded-xl border border-ink-line bg-white p-5">
          <ol className="space-y-3">
            {[
              [
                "你主動要求",
                "在比較結果或需求分析結果頁，點擊「需要持牌人士進一步解釋？」。平台不會主動推銷。",
              ],
              [
                "你填寫意向",
                "提供姓名、聯絡方式、希望了解的保險類別與問題，並明確勾選同意。",
              ],
              [
                "平台轉介",
                "正式版本會根據你的同意，把請求轉交合適的持牌保險專業人士。原型階段不會真正發送。",
              ],
              [
                "平台停止",
                "聯絡請求之後，平台不再介入。保單條款、投保決定與售後全部由你與持牌人士直接進行。",
              ],
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
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
            <p className="text-[12.5px] leading-relaxed text-amber-900">
              <span className="font-semibold">平台不會完成保險交易。</span>
              平台不設有購買、投保、付款或保單簽署功能。未來商業化亦然 ——
              最多做到「聯絡 / 轉介 / 介紹」。
            </p>
          </div>
        </div>
      </section>

      {/* 商業關係如何標示 */}
      <section className="mt-10" aria-labelledby="disclosure-heading">
        <h2
          id="disclosure-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          商業合作如何標示
        </h2>
        <div className="mt-4">
          <CommercialDisclosure variant="panel" />
        </div>
        <div className="mt-4 rounded-xl border border-ink-line bg-white p-5">
          <ul className="space-y-2.5">
            {[
              "每一則付費曝光都帶有「贊助」標記，標記文字固定，不會用「精選」「推薦」「熱門」等易被誤解的字眼。",
              "贊助結果在搜尋結果頁與分類頁都放在獨立區塊，位置在自然結果之後。",
              "贊助區塊下方會說明它不參與自然排序，並連結到排序方法頁與這一頁。",
              "付費曝光不會提升任何產品的核實狀態，也不會影響比較表的任何一行。",
              "轉介請求的提交頁會說明正式版本如何處理你的資料，以及你可以隨時要求停止接收。",
            ].map((d) => (
              <li key={d} className="flex gap-3">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                <span className="text-[13px] leading-relaxed text-ink-soft">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 條款如何變更 */}
      <section className="mt-10" aria-labelledby="changes-heading">
        <h2
          id="changes-heading"
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          如果這套規則改變了
        </h2>
        <div className="mt-4 rounded-xl border border-ink-line bg-white p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-soft">
            我們希望這個平台可以一直保持同一套原則。如果未來有任何改變 ——
            例如引入新的商業合作模式 —— 我們會在這一頁與信任中心記錄下來，
            包括改變的內容、生效日期，以及為甚麼要改。
          </p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
            如果你發現平台的實際行為與這一頁描述不符，歡迎透過
            <Link href="/trust" className="mx-0.5 font-medium text-brand-700 hover:underline">
              信任中心
            </Link>
            的回報渠道告訴我們。發現不一致時，我們會公開處理。
          </p>
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
            href="/ranking-methodology"
            className="group rounded-xl border border-ink-line bg-white p-5 hover:border-brand-300"
          >
            <p className="text-[14.5px] font-semibold text-ink group-hover:text-brand-700">
              搜索與比較結果如何排序？
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
              五個排序依據、比較頁不排序的原則，以及為甚麼我們不聲稱算法絕對客觀。
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
              資料來源、四級核實狀態、AI 使用原則，以及回報資料問題的方法。
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
