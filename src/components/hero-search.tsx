"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Package, BookOpen, CircleHelp, ArrowRight } from "lucide-react";
import { searchAll, type SearchResult } from "@/lib/search";

const META: Record<SearchResult["kind"], { label: string; icon: typeof Package }> = {
  product: { label: "產品", icon: Package },
  article: { label: "文章", icon: BookOpen },
  faq: { label: "保險知識", icon: CircleHelp },
};

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const results = useMemo(() => searchAll(query), [query]);

  const showPanel = focused && query.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (results.length > 0) {
      router.push(results[0].href);
    } else {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <div className="relative z-20">
      <form onSubmit={submit} role="search" className="relative">
        <div className="flex items-center gap-2 rounded-xl border border-ink-line bg-white p-1.5 shadow-lift">
          <Search size={19} className="ml-2.5 shrink-0 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 160)}
            placeholder="搜尋醫療保險、危疾保險、保單條款或保險問題"
            className="h-11 w-full bg-transparent text-[15px] outline-none placeholder:text-ink-mute"
            aria-label="搜尋保險產品、條款或保險問題"
          />
          <button
            type="submit"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-800 text-white hover:bg-brand-900 transition-colors sm:hidden"
            aria-label="搜尋"
          >
            <ArrowRight size={17} />
          </button>
          <button
            type="submit"
            className="hidden h-11 shrink-0 items-center gap-1.5 rounded-lg bg-brand-800 px-5 text-sm font-semibold text-white hover:bg-brand-900 transition-colors sm:inline-flex"
          >
            搜尋
            <ArrowRight size={15} />
          </button>
        </div>
      </form>

      {showPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-ink-line bg-white shadow-lift">
          {results.length === 0 ? (
            <div className="p-5 text-center">
              <p className="text-sm font-medium text-ink">未找到相關資料</p>
              <p className="mt-1.5 text-[12.5px] text-ink-mute">
                請嘗試其他關鍵字，例如「自付額」、「危疾」、「續保」。
              </p>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="mt-3 inline-flex text-[13px] font-medium text-brand-700 hover:underline"
              >
                查看完整搜尋結果
              </Link>
            </div>
          ) : (
            <ul className="max-h-[340px] overflow-y-auto">
              {results.slice(0, 8).map((r) => {
                const Icon = META[r.kind].icon;
                return (
                  <li key={`${r.kind}-${r.id}`}>
                    <Link
                      href={r.href}
                      className="flex items-start gap-3 border-b border-ink-line/70 px-4 py-3 last:border-b-0 hover:bg-paper"
                    >
                      <Icon size={16} className="mt-0.5 shrink-0 text-brand-600" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium text-ink">
                          {r.title}
                        </span>
                        <span className="block truncate text-[12px] text-ink-mute">
                          {META[r.kind].label} · {r.meta}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {results.length > 0 && (
            <div className="border-t border-ink-line bg-paper px-4 py-2.5">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="text-[12.5px] font-medium text-brand-700 hover:underline"
              >
                查看全部 {results.length} 個結果 →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
