import type { Metadata } from "next";
import Link from "next/link";
import { dictionary, groupTermsByLetter } from "@/data/dictionary";
import { pageMetadata, breadcrumbJsonLd, jsonLdScript } from "@/lib/structured-data";
import { Search } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: `保險術語字典｜自付額、續保、危疾定義等 ${dictionary.length} 個術語`,
  description:
    "香港保險術語的中文解釋。每個術語包含一句話答案、詳細解釋、常見誤解、比較時應看的重點，以及相關條款來源。",
  path: "/dictionary",
});

export default function DictionaryPage() {
  const groups = groupTermsByLetter(dictionary);

  const jsonLd = breadcrumbJsonLd([
    { name: "首頁", href: "/" },
    { name: "保險術語", href: "/dictionary" },
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
        <span className="text-ink-soft">保險術語</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
          保險術語字典
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
          收錄 {dictionary.length} 個香港保險常見術語。每個術語都提供一句話答案、
          詳細解釋、常見誤解，以及比較產品時應該留意甚麼。
        </p>
      </header>

      {/* A-Z index */}
      <nav
        aria-label="字母索引"
        className="mt-6 flex flex-wrap gap-1.5 rounded-xl border border-ink-line bg-white p-3.5"
      >
        <span className="mr-1 flex items-center gap-1.5 text-[12px] font-medium text-ink-mute">
          <Search size={13} aria-hidden />
          跳至
        </span>
        {groups.map((g) => (
          <a
            key={g.letter}
            href={`#letter-${g.letter}`}
            className="grid h-7 min-w-7 place-items-center rounded-md border border-ink-line bg-paper px-1.5 text-[12.5px] font-semibold text-ink-soft hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
          >
            {g.letter}
          </a>
        ))}
      </nav>

      {/* Groups */}
      <div className="mt-8 space-y-8">
        {groups.map((g) => (
          <section key={g.letter} id={`letter-${g.letter}`} className="scroll-mt-24">
            <h2 className="text-[17px] font-semibold tracking-tight text-ink">
              <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-md bg-brand-800 text-[13px] text-white">
                {g.letter}
              </span>
              {g.terms.length} 個以 {g.letter} 開頭的術語
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.terms.map((t) => (
                <Link
                  key={t.slug}
                  href={`/dictionary/${t.slug}`}
                  className="group flex flex-col rounded-xl border border-ink-line bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <span className="text-[15px] font-semibold text-ink group-hover:text-brand-800">
                    {t.zh}
                  </span>
                  <span className="mt-0.5 text-[12px] text-ink-mute">{t.term}</span>
                  <span className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-ink-soft">
                    {t.quickAnswer}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-ink-line bg-paper p-5">
        <h2 className="text-[15px] font-semibold text-ink">關於這個字典</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
          字典的內容以「術語解釋」為主，不會對個別產品作出評價。每個術語的
          「比較時要看的重點」一欄，是我們認為最實用的部分——因為術語本身的定義
          你可以在網上找到，但「比較產品時應該問甚麼」才是不容易自己想到的部分。
        </p>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-mute">
          所有術語最後更新於 2026-01-18。術語頁會隨產品資料更新而同步檢視。
        </p>
      </div>
    </div>
  );
}
