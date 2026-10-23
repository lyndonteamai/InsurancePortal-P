"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Package, BookOpen, CircleHelp, ArrowRight, X } from "lucide-react";
import { searchAll, type SearchResult } from "@/lib/search";

const META: Record<SearchResult["kind"], { label: string; icon: typeof Package }> = {
  product: { label: "產品", icon: Package },
  article: { label: "文章", icon: BookOpen },
  faq: { label: "保險知識", icon: CircleHelp },
};

export function SearchResultsView() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [active, setActive] = useState<SearchResult["kind"] | "all">("all");

  useEffect(() => {
    setQuery(initial);
  }, [initial]);

  const results = useMemo(() => searchAll(query), [query]);
  const filtered = active === "all" ? results : results.filter((r) => r.kind === active);

  const counts = {
    product: results.filter((r) => r.kind === "product").length,
    article: results.filter((r) => r.kind === "article").length,
    faq: results.filter((r) => r.kind === "faq").length,
  };

  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">搜尋</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">全站搜尋</h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
          搜尋範圍包括產品名稱、示例保險公司、保險類別、知識文章標題同內容，以及常見保險問題。
        </p>
      </header>

      <div className="relative mt-6 max-w-2xl">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋醫療保險、危疾保險、保單條款或保險問題"
          className="h-12 w-full rounded-lg border border-ink-line bg-white pl-11 pr-10 text-[15px] outline-none focus:border-brand-400"
          aria-label="全站搜尋"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-ink-mute hover:bg-paper"
            aria-label="清除"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {!query ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink-line bg-white p-10 text-center">
          <Search size={26} className="mx-auto text-ink-mute" />
          <p className="mt-3 text-[14.5px] font-medium text-ink">請輸入關鍵字開始搜尋</p>
          <p className="mt-1.5 text-[13px] text-ink-mute">
            例如：自付額、危疾、續保、住院保障上限
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {(
              [
                ["all", `全部（${results.length}）`],
                ["product", `產品（${counts.product}）`],
                ["article", `文章（${counts.article}）`],
                ["faq", `保險知識（${counts.faq}）`],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setActive(k)}
                className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  active === k
                    ? "bg-brand-800 text-white"
                    : "border border-ink-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {results.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-ink-line bg-white p-10 text-center">
              <p className="text-[14.5px] font-medium text-ink">
                目前沒有找到相關資料。你可以嘗試其他關鍵字，或瀏覽保險知識中心。
              </p>
              <Link
                href="/learn"
                className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-brand-700 hover:underline"
              >
                前往保險知識中心
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-ink-line bg-white p-8 text-center">
              <p className="text-[14px] text-ink-soft">呢個分類冇符合條件嘅結果。</p>
            </div>
          ) : (
            <ul className="mt-5 space-y-2.5">
              {filtered.map((r) => {
                const Icon = META[r.kind].icon;
                return (
                  <li key={`${r.kind}-${r.id}`}>
                    <Link
                      href={r.href}
                      className="group flex items-start gap-3 rounded-xl border border-ink-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                        <Icon size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold leading-snug text-ink group-hover:text-brand-700">
                          {r.title}
                        </span>
                        <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                          {r.snippet}
                        </span>
                        <span className="mt-1.5 block text-[11.5px] text-ink-mute">
                          {META[r.kind].label} · {r.meta}
                        </span>
                      </span>
                      <ArrowRight
                        size={15}
                        className="mt-1 shrink-0 text-ink-mute group-hover:text-brand-700"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
