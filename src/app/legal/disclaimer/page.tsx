import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "免責聲明",
  description: "保險指南（Prototype）免責聲明：內容為虛構示範資料，不構成保險、法律或投資建議。",
  alternates: { canonical: "/legal/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">免責聲明</span>
      </nav>

      <header className="mt-3 max-w-3xl">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">免責聲明</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          請喺使用本 Prototype 前閱讀以下內容。
        </p>
      </header>

      <div className="mt-8 max-w-3xl space-y-6">
        {[
          {
            h: "一、內容為虛構示範",
            p: "本網站所有保險公司名稱（包括 Harbor Shield、Maple Life、BrightCare、Pioneer Assurance）、產品、條款、保障上限、自付額、等候期、續保條件、保費數字、知識文章及常見問題，全部為開發團隊撰寫嘅虛構示例資料，並非真實香港保險市場上任何產品，亦不構成任何保險公司嘅產品建議或報價。",
          },
          {
            h: "二、不構成專業意見",
            p: "本網站內容僅作產品設計演示及一般保險知識教學用途，不構成保險、法律、稅務、會計或投資意見，亦不構成任何形式的推薦。投保決定應以保險公司正式文件、持牌保險專業人士意見及你自身情況為準。",
          },
          {
            h: "三、不提供真實報價或投保",
            p: "本平台不設任何投保流程、報價引擎、支付功能或保單簽發功能，亦不會產生真實保險報價。所有顯示嘅保費均為說明用途嘅虛構數字，不代表任何人的投保條件或市場價格水平。",
          },
          {
            h: "四、不收集敏感資料",
            p: "本平台不收集姓名、身份證號碼、財務狀況、醫療或健康史資料。所有互動功能（包括需求分析工具同比較清單）只在本機瀏覽器內運作，比較清單儲存於瀏覽器 localStorage。",
          },
          {
            h: "五、比較結果嘅性質",
            p: "比較頁面嘅差異摘要只根據模擬資料客觀描述數字上的不同，包括保障上限、自付額、等候期、續保條件同主要限制。平台刻意唔會使用「最適合你」、「一定最好」或「保證最划算」等結論。",
          },
          {
            h: "六、正式上線前嘅審核",
            p: "本頁內容為原型示例，正式上線前需要法律及監管審核，包括但不限於：保險條款引用嘅準確性、廣告與內容嘅合規性、私隱政策、個人資料收集實務，以及與香港保險監管要求嘅一致性。",
          },
        ].map((s) => (
          <section key={s.h}>
            <h2 className="text-[17px] font-semibold text-ink">{s.h}</h2>
            <p className="mt-2 text-[14px] leading-[1.9] text-ink-soft">{s.p}</p>
          </section>
        ))}

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="flex items-start gap-2 text-[13.5px] leading-relaxed text-amber-900">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <span>
              平台名稱「保險指南 Insurance Compass HK」為 Prototype 名稱，唔代表已完成商標註冊，
              亦唔代表任何商業合作關係或監管認可。
            </span>
          </p>
        </div>

        <p className="text-[13px] text-ink-mute">
          更新日期：2026-10-01 · 詳情可參考{" "}
          <Link href="/transparency" className="text-brand-700 hover:underline">
            資料來源及更新方式
          </Link>
        </p>
      </div>
    </div>
  );
}
