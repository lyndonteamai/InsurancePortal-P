import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, jsonLdScript } from "@/lib/structured-data";
import { products } from "@/data/products";
import { dictionary } from "@/data/dictionary";
import {
  ShieldCheck,
  Scale,
  FileSearch,
  Eye,
  Ban,
  Bot,
  UserCheck,
  RefreshCw,
  MessageSquareWarning,
  Scale3D,
} from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "信任中心｜平台的資料來源、編輯方針與 AI 使用原則",
  description:
    "保險指南的信任中心：說明資料從哪裡來、如何核實、編輯方針、商業合作如何不影響客觀資料、AI 的使用與限制，以及如何回報資料問題。",
  path: "/trust",
});

const SECTIONS = [
  {
    id: "what-we-are",
    icon: ShieldCheck,
    title: "平台是甚麼，不是甚麼",
    body: [
      "保險指南是一個保險資訊與比較平台。我們的工作是整理保險產品的保障內容、條款重點、常見誤解與基礎概念，讓你在投保前能夠先看清楚結構。",
      "我們不是保險公司，也不是保險經紀。我們不代你投保、不收取保費、不向你銷售任何產品，也不會因為某間保險公司付費而改變資料的呈現方式。",
      "我們提供的是資訊，不是個人化建議。甚麼產品適合你，取決於你的健康狀況、收入、既有保障與風險承受能力——這些只有你和專業人士能共同判斷。",
    ],
  },
  {
    id: "sources",
    icon: FileSearch,
    title: "資料從哪裡來",
    body: [
      "每一份產品資料都應該可以指回一份來源文件，例如保單條款、產品小冊子、保障表或監管機構的公開資料。產品頁的「資料來源」一節會列出這個產品所引用的所有來源。",
      "當某個欄位找不到對應來源時，平台會顯示「資料未提供」，而不是用推測或行業平均值填補。這是刻意的：寧可留白，也不讓一個看似完整的數字誤導你。",
      "平台的公開數據來源（例如業界統計）會標明發佈機構與統計期間，讓你可以判斷這些數字的適用範圍。",
    ],
  },
  {
    id: "verification",
    icon: Eye,
    title: "資料核實狀態的四個級別",
    body: [
      "每個產品都有一個核實狀態，它說明的是「我們有多完整地核對過這個產品的資料」，而不是「這個產品好不好」。",
      "「已核實」表示頁面所列數據已對照公開來源文件核對。「部分核實」表示部分欄位已核對，另有欄位（例如保費示例）為示範數字。「尚未核實」表示資料尚未加入可核實來源，不應直接作為投保依據。「原型模擬資料」則明確標示這是示範內容，並非任何真實產品。",
      "把核實狀態放在產品頁的顯眼位置，是平台的刻意設計：把不確定性攤開來看，比藏在細節裡有用。",
    ],
  },
  {
    id: "no-ranking",
    icon: Ban,
    title: "我們不做排名",
    body: [
      "平台不會出現在「最佳產品」、「編輯精選」、「性價比之王」或「第一名」這類標籤。原因不是謙虛，而是方法論：",
      "保險產品的優劣高度取決於你的具體情況。沒有個人化健康資料、財務資料與需求分析，任何排名都只是把平台的編輯偏好包裝成客觀結論。同樣地，「最適合你」這句話在我們的產品資料庫裡沒有依據——我們不做這個判斷，因為做不出來。",
      "比較引擎的職責是解釋差異從哪裡來，以及這些差異對你的實務影響，而不是替你下結論。",
    ],
  },
  {
    id: "commercial",
    icon: Scale,
    title: "商業合作不應改變客觀資料",
    body: [
      "平台可能與保險公司或服務提供者建立商業合作。原則是：合作可以影響合作的形式與時程，但不能改變資料本身。",
      "具體來說：保費、限額、等待期、續保條款、不保事項與核實狀態，都不會因為商業關係而調整。任何付費合作都會在相關頁面明確披露，且不會以「排序較前」作為合作條件。",
      "如果我們的客觀資料與商業利益之間出現無法調和的衝突，選項是取消合作，而不是修改資料。",
      "在實作層面，自然結果與付費結果由不同的排序邏輯處理：付費結果不會被放進自然結果佇列，也不會參與自然排序計分。詳見「搜索與比較結果如何排序？」與「商業透明度」兩頁。",
    ],
  },
  {
    id: "ai",
    icon: Bot,
    title: "AI 的使用原則與限制",
    body: [
      "平台會使用 AI 輔助內容整理與檢索，但有明確的邊界：",
      "第一，AI 生成的內容必須對照資料庫條目，並附上來源連結。資料庫中沒有的內容，不會出現在回答裡。",
      "第二，產品條款數字（保費、限額、等待期、續保、定義）不由 AI 生成，只能來自已登記的來源文件。",
      "第三，當檢索找不到匹配時，系統會明確說明「資料庫內沒有這個問題的答案」，而不是生成一段看似合理的內容。",
      "第四，AI 不會對你作個人化判斷，也不會輸出「最適合你」這類結論。",
      "在正式環境中，所有經 AI 輔助產生的內容都會經過人工覆核，並在頁面上標示覆核狀態。",
    ],
  },
  {
    id: "editorial",
    icon: UserCheck,
    title: "編輯方針",
    body: [
      "平台的語言規則：描述結構，不下判斷。寫作時用「這份產品的等待期較長」，不用「這份產品較差」。",
      "每一個數字都應該有來源；沒有來源的數字不寫，或明確標示為「資料未提供」。",
      "不用「最強」、「最抵」、「必買」這類形容詞，因為它們無法被驗證，也無法被追蹤。",
      "產品頁必須同時呈現保障與限制。只寫保障不寫限制的頁面，不是資訊平台，是宣傳單張。",
    ],
  },
  {
    id: "correction",
    icon: MessageSquareWarning,
    title: "回報資料問題",
    body: [
      "每個產品頁都有「回報資料問題」的入口。你可以指出保障範圍、保費數字、條款描述、資料來源或資料時效的問題。",
      "平台不會要求你在回報時提供身份證明號碼、健康紀錄或任何個人資料——回報只用於修正公開頁面上的資料。",
      "正式環境中，每一條回報都會進入內容團隊的待處理佇列，並記錄處理狀態與結果。",
    ],
  },
  {
    id: "update",
    icon: RefreshCw,
    title: "更新頻率與資料時效",
    body: [
      "每個產品頁都標示「資料最後更新日期」與「最後檢視日期」，兩者分別代表內容改動時間與條款覆核時間。",
      "保險條款會改版，因此頁面資料可能落後於最新條款版本。頁面上會標示條款版本號，你可以要求保險公司提供最新版本作對照。",
      "平台的目標更新節奏是：條款有重大改版時於一週內更新；每季度進行一次全面覆核。",
    ],
  },
];

export default function TrustPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "首頁", href: "/" },
    { name: "信任中心", href: "/trust" },
  ]);

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">信任中心</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
          信任中心
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
          一個資訊平台的可信度，取決於它願意把甚麼說清楚：資料從哪裡來、
          哪些部分不確定、有哪些我們不會做。這一頁把這些全部寫下來。
        </p>
      </header>

      {/* Live stats */}
      <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          icon={<FileSearch size={14} aria-hidden />}
          label="資料庫產品"
          value={`${products.length} 款`}
        />
        <Stat
          icon={<ShieldCheck size={14} aria-hidden />}
          label="已核實產品"
          value={`${products.filter((p) => p.verification.status === "verified").length} 款`}
        />
        <Stat
          icon={<Scale3D size={14} aria-hidden />}
          label="術語條目"
          value={`${dictionary.length} 條`}
        />
        <Stat
          icon={<Ban size={14} aria-hidden />}
          label="排名標籤"
          value="0 個"
        />
      </section>

      {/* Sections */}
      <div className="mt-9 space-y-8">
        {SECTIONS.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <section key={sec.id} id={sec.id} className="scroll-mt-24">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon size={16} aria-hidden />
                </span>
                <h2 className="text-[19px] font-semibold tracking-tight text-ink">
                  <span className="mr-1.5 text-[13px] font-normal tabular-nums text-ink-mute">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {sec.title}
                </h2>
              </div>
              <div className="mt-3.5 space-y-3">
                {sec.body.map((p, i) => (
                  <p key={i} className="text-[14px] leading-[1.85] text-ink-soft">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Transparency sub-pages */}
      <section className="mt-11">
        <h2 className="text-[19px] font-semibold tracking-tight text-ink">
          信任中心：更多公開文件
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          信任中心不是單一頁，而是同一套原則在不同題目上的展開。以下兩頁分別處理
          「結果如何排序」與「平台如何維生」——這兩件事最容易被混為一談，所以特別公開。
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/ranking-methodology"
            className="group rounded-xl border border-ink-line bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40"
          >
            <span className="text-[14.5px] font-semibold text-ink group-hover:text-brand-700">
              搜索與比較結果如何排序？
            </span>
            <span className="mt-1 block text-[12.5px] text-ink-mute">
              自然結果的五個排序因素、比較頁不排序的理由，以及「商業合作不會直接購買自然搜索排名」的說明
            </span>
          </Link>
          <Link
            href="/commercial-transparency"
            className="group rounded-xl border border-ink-line bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40"
          >
            <span className="text-[14.5px] font-semibold text-ink group-hover:text-brand-700">
              商業透明度
            </span>
            <span className="mt-1 block text-[12.5px] text-ink-mute">
              平台如何維生、甚麼是贊助內容、諮詢轉介如何運作，以及平台為何不會完成保險交易
            </span>
          </Link>
        </div>
      </section>

      {/* Links */}
      <section className="mt-11 grid gap-3 sm:grid-cols-2">
        <Link
          href="/transparency"
          className="group rounded-xl border border-ink-line bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40"
        >
          <span className="text-[14.5px] font-semibold text-ink group-hover:text-brand-700">
            資料來源及更新方式
          </span>
          <span className="mt-1 block text-[12.5px] text-ink-mute">
            詳細的來源清單、資料更新流程與版本記錄
          </span>
        </Link>
        <Link
          href="/legal/disclaimer"
          className="group rounded-xl border border-ink-line bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40"
        >
          <span className="text-[14.5px] font-semibold text-ink group-hover:text-brand-700">
            免責聲明
          </span>
          <span className="mt-1 block text-[12.5px] text-ink-mute">
            平台的法律定位與使用限制
          </span>
        </Link>
      </section>

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="flex items-start gap-2 text-[13px] leading-relaxed text-amber-900">
          <ShieldCheck size={15} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            本信任中心描述的是平台的
            <strong>設計原則與運作方式</strong>
            ，屬於原型示範內容。正式環境中的每一條政策都會由實際的營運流程、
            合約安排與審核紀錄支撐，並且會在這裡連結到對應的公開文件。
          </span>
        </p>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-ink-line bg-white p-4">
      <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-mute">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 text-[20px] font-bold tabular-nums text-ink">{value}</p>
    </div>
  );
}
