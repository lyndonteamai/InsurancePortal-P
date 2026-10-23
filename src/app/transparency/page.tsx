import type { Metadata } from "next";
import Link from "next/link";
import {
  Database,
  ShieldCheck,
  CalendarClock,
  Handshake,
  AlertTriangle,
  Check,
  FileSearch,
} from "lucide-react";
import { site } from "@/lib/site";
import { products } from "@/data/products";
import { articles } from "@/data/articles";
import { faqs } from "@/data/faqs";
import { dictionary } from "@/data/dictionary";
import { hubs } from "@/data/hubs";
import { insurers } from "@/data/insurers";
import { globalSources } from "@/data/sources";
import {
  VERIFICATION_LABELS,
  VERIFICATION_DESCRIPTIONS,
  type VerificationStatus,
} from "@/data/types";
import { pageMetadata, breadcrumbJsonLd, jsonLdScript } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "資料來源及更新方式",
  description:
    "保險指南如何整理保險產品資料、標示來源同四級核實狀態，以及商業合作與客觀資訊嘅分隔原則。",
  path: "/transparency",
});

const VERIFICATION_ORDER: VerificationStatus[] = [
  "verified",
  "partially_verified",
  "unverified",
  "demo",
];

export default function TransparencyPage() {
  const latest = products
    .map((p) => p.updatedAt)
    .sort()
    .reverse()[0];

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: "資料來源及更新方式", href: "/transparency" },
            ]),
          ),
        }}
      />

      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">資料來源及更新方式</span>
      </nav>

      <header className="mt-3 max-w-3xl">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
          我們如何整理保險資訊？
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          我們希望將保險產品資料以一致的方式整理，協助用戶了解不同產品的保障內容、條款及限制。
          正式上線時，產品資訊將標示來源、核實狀態及更新日期。商業合作與客觀產品資訊將分開展示。
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Database, label: "產品條目", value: `${products.length} 個模擬產品` },
          { icon: FileSearch, label: "知識文章", value: `${articles.length} 篇模擬文章` },
          { icon: ShieldCheck, label: "保險術語", value: `${dictionary.length} 條術語` },
          { icon: CalendarClock, label: "最近更新", value: latest },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-ink-line bg-white p-5">
              <Icon size={18} className="text-brand-600" />
              <p className="mt-3 text-[12px] text-ink-mute">{s.label}</p>
              <p className="mt-0.5 text-[16px] font-semibold text-ink">{s.value}</p>
            </div>
          );
        })}
      </section>

      <section id="sources" className="mt-12 scroll-mt-24">
        <h2 className="text-[20px] font-semibold tracking-tight text-ink">資料來源</h2>
        <div className="prose-ic mt-2 max-w-3xl">
          <p>
            本 Prototype 嘅所有產品資料、條款內容、保費數字、知識文章同常見問題，全部由開發團隊撰寫嘅
            虛構示例資料，存放在本地 TypeScript 資料檔案中，唔係從任何保險公司或第三方網站擷取。
          </p>
          <ul>
            <li>
              示例保險公司：
              {insurers.map((i) => i.name).join("、")}
              （全部為虛構品牌，平台資料庫合共 {globalSources.length} 份來源文件記錄）。
            </li>
            <li>每個保障項目同不保事項都帶有來源編號，可以逐項追溯。</li>
            <li>所有保費、保障上限、自付額、等候期同續保條件均為示意數字。</li>
            <li>知識文章以一般保險概念為主，唔會引用真實條款原文或法律規定。</li>
          </ul>
        </div>
      </section>

      <section id="verification" className="mt-12 scroll-mt-24">
        <h2 className="text-[20px] font-semibold tracking-tight text-ink">
          四級核實狀態
        </h2>
        <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-ink-soft">
          平台唔會隱藏自己嘅資料缺口。每個產品都有一個核實狀態，讀者可以點擊徽章展開睇到具體意思，
          亦可以睇到邊啲欄位仲未核實。
        </p>
        <ul className="mt-4 space-y-2">
          {VERIFICATION_ORDER.map((status) => (
            <li
              key={status}
              className="rounded-lg border border-ink-line bg-white px-4 py-3"
            >
              <span className="text-[13.5px] font-semibold text-ink">
                {VERIFICATION_LABELS[status]}
              </span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-soft">
                {VERIFICATION_DESCRIPTIONS[status]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="data" className="mt-12 scroll-mt-24">
        <h2 className="text-[20px] font-semibold tracking-tight text-ink">產品資料說明</h2>
        <div className="prose-ic mt-2 max-w-3xl">
          <p>每一條產品資料會用同一套結構整理，方便用戶逐項對照同一類資訊：</p>
          <ul>
            {[
              "基本資訊：產品名稱、保險公司、保險種類、投保資格、資料更新日期。",
              "保障內容：逐項保障項目、保障說明、額度描述，每項附來源編號。",
              "不保事項：主要除外責任，同樣可追溯到來源。",
              "條款細項：等候期、自付額、續保條件、需要注意的事項。",
              "保費示例：情境標籤、假設條件同年保費，標明是否為示例數字。",
              "資料來源：來源文件類型、發佈機構、版本與日期，無來源時明示。",
            ].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p>
            如果某項資料喺原型中未能提供，介面會直接顯示「資料未提供」，唔會用推測數值填補。
          </p>
        </div>
      </section>

      <section id="update" className="mt-12 scroll-mt-24">
        <h2 className="text-[20px] font-semibold tracking-tight text-ink">更新方式</h2>
        <div className="prose-ic mt-2 max-w-3xl">
          <p>
            正式上線後，每項產品資料都會附上獨立嘅「更新日期」同「核實狀態」標籤（例如：已核實 / 待核實 /
            來源為公開資料）。當保單條款或保費資料更新時，平台會保留上一版本記錄，並在產品頁標示變更摘要。
          </p>
          <ul>
            <li>條款內容變更：更新日期即時變動，並在條款重點區塊標示「最近更新」。</li>
            <li>核實狀態變更：由「待核實」轉為「已核實」時，會在產品頁顯示狀態標籤變化。</li>
            <li>資料過期：超過指定週期未更新嘅條目，會顯示「資料可能過期」提示。</li>
          </ul>
        </div>
      </section>

      <section className="mt-12 scroll-mt-24" id="sponsorship">
        <h2 className="text-[20px] font-semibold tracking-tight text-ink">商業合作與客觀資訊嘅分隔</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-ink-line bg-white p-5">
            <h3 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
              <Handshake size={16} className="text-ink-mute" /> 客觀產品資訊
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                "獨立編輯，唔受商業合作影響排序或內容",
                "統一資料結構，唔會只展示好處",
                "保障限制同除外責任必須列出",
                "比較結果只描述數據差異",
              ].map((t) => (
                <li key={t} className="flex items-start gap-1.5 text-[13px] text-ink-soft">
                  <Check size={14} className="mt-0.5 shrink-0 text-accent-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-ink-line bg-paper p-5">
            <h3 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
              <AlertTriangle size={16} className="text-amber-600" /> 商業合作內容
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                "有廣告或合作標記，並附有合作聲明",
                "與客觀比較結果分開頁面呈現",
                "唔會影響產品排序或條件",
                "任何合作關係都會喺頁面直接披露",
              ].map((t) => (
                <li key={t} className="flex items-start gap-1.5 text-[13px] text-ink-soft">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-line" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="prototype" className="mt-12 scroll-mt-24">
        <h2 className="text-[20px] font-semibold tracking-tight text-ink">Prototype 限制</h2>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <ul className="space-y-2">
            {[
              "所有保險公司、產品同條款均為虛構，唔代表任何真實市場產品。",
              "冇接入任何真實保險交易、報價或投保流程。",
              "冇收集姓名、身份證、健康狀況、銀行或聯絡資料。",
              "比較功能只係整理模擬數據差異，唔會給出「最適合你」之類嘅結論。",
              "正式上線前，所有內容需要法律及監管審核。",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-amber-900/90">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-12 rounded-xl border border-ink-line bg-white p-5">
        <h2 className="text-[15px] font-semibold text-ink">延伸閱讀</h2>
        <ul className="mt-2.5 space-y-1.5 text-[13.5px]">
          <li>
            <Link href="/trust" className="text-brand-700 hover:underline">
              信任中心
            </Link>
            <span className="text-ink-mute">
              ：平台是甚麼、不是甚麼，以及我們不做排名的原因。
            </span>
          </li>
          <li>
            <Link href="/dictionary" className="text-brand-700 hover:underline">
              保險術語字典
            </Link>
            <span className="text-ink-mute">
              ：{dictionary.length} 個術語，每個都附比較時應看的重點。
            </span>
          </li>
          <li>
            <Link href="/medical-insurance" className="text-brand-700 hover:underline">
              主題指南
            </Link>
            <span className="text-ink-mute">
              ：{hubs.length} 個主題頁，用比較方法與判斷重點切入。
            </span>
          </li>
          <li>
            <Link href="/legal/prototype" className="text-brand-700 hover:underline">
              原型開發說明
            </Link>
            <span className="text-ink-mute">：已做、未做、以及刻意不做的部分。</span>
          </li>
        </ul>
      </div>

      <p className="mt-10 text-[12px] leading-relaxed text-ink-mute">{site.prototypeNotice}</p>
    </div>
  );
}
