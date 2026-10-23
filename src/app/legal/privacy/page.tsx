import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Database, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "私隱政策",
  description: "保險指南（Prototype）私隱政策：平台不收集個人或健康資料，比較清單只儲存在本機瀏覽器。",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">私隱政策</span>
      </nav>

      <header className="mt-3 max-w-3xl">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">私隱政策</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          本政策說明 Prototype 版本點樣處理資料。正式上線前，此頁內容需要法律及監管審核。
        </p>
      </header>

      <div className="mt-8 max-w-3xl space-y-7">
        <section>
          <h2 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
            <ShieldCheck size={17} className="text-brand-600" /> 我們不收集甚麼
          </h2>
          <ul className="prose-ic mt-2">
            {[
              "姓名、身份證號碼、地址、聯絡電話或電郵。",
              "任何形式的財務或銀行資料。",
              "醫療紀錄、健康狀況、體檢結果或生物識別資料。",
              "任何用於識別或追蹤你嘅廣告識別碼。",
            ].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="prose-ic mt-3">
            需求分析工具只會記住你喺本次瀏覽中揀選嘅選項，唔會要求輸入任何個人資料。
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
            <Database size={17} className="text-brand-600" /> 我們儲存甚麼
          </h2>
          <p className="prose-ic mt-2">
            產品比較清單會以 JSON 格式儲存喺你嘅瀏覽器 localStorage（鍵名：
            <code className="rounded bg-paper px-1.5 py-0.5 text-[12.5px]">ic-compare-list</code>），
            內容只包含產品 ID。呢啲資料只留喺你嘅裝置，唔會傳送到我哋嘅伺服器。
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
            <Trash2 size={17} className="text-brand-600" /> 點樣清除
          </h2>
          <p className="prose-ic mt-2">
            你可以喺比較頁面按「清除全部」移除比較清單，或者直接喺瀏覽器設定中清除網站資料。
            Prototype 冇使用分析工具、追蹤像素或第三方 cookie。
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-ink">正式上線時的變更</h2>
          <p className="prose-ic mt-2">
            正式版本如果加入帳戶系統、專業人士名單查詢或個人化功能，將會另外發布完整嘅私隱政策，
            並說明收集目的、保存期限、第三方服務商同埋查閱及刪除資料嘅方式。
          </p>
        </section>

        <p className="text-[13px] text-ink-mute">
          更新日期：2026-10-01 · 詳情可參考{" "}
          <Link href="/legal/prototype" className="text-brand-700 hover:underline">
            原型開發說明
          </Link>
        </p>
      </div>
    </div>
  );
}
