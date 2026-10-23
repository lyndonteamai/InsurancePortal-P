"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import {
  searchAll,
  isQuestionQuery,
  findQuickAnswer,
  type SearchResult,
} from "@/lib/search";
import { SEARCH_KIND_META } from "@/lib/search-ui";
import { pushRecentSearch } from "./global-search";
import { trackEvent } from "@/lib/analytics";

// ============================================================
// 首頁超級搜索
// ============================================================
// 一個搜索框覆蓋：產品 / 公司 / 類別 / 保障 / 條款 / 保費 /
// 術語 / 文章 / FAQ / 比較 / AI 問答。
//
// 下拉面板的邏輯：
//   · 輸入完整問題 → 先顯示「一句話答案」，再列延伸結果
//   · 輸入關鍵詞   → 直接列結果，按類型分組
// ============================================================

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const results = useMemo(() => searchAll(query), [query]);

  const isQuestion = useMemo(() => isQuestionQuery(query), [query]);
  const quickAnswer = useMemo(
    () => (isQuestion ? findQuickAnswer(query) : null),
    [isQuestion, query],
  );

  // 下拉只顯示前 8 條，但按類型分散，避免全部被同一類霸佔
  const topResults = useMemo(() => {
    const organic = results.filter((r) => r.resultType === "organic");
    const byKind = new Map<string, SearchResult[]>();
    for (const r of organic) {
      const arr = byKind.get(r.kind) ?? [];
      arr.push(r);
      byKind.set(r.kind, arr);
    }
    const out: SearchResult[] = [];
    // 輪流各類別取，避免單一類別佔滿
    let round = 0;
    while (out.length < 8) {
      let added = false;
      for (const arr of byKind.values()) {
        if (arr[round]) {
          out.push(arr[round]);
          added = true;
          if (out.length >= 8) break;
        }
      }
      if (!added) break;
      round++;
    }
    return out;
  }, [results]);

  const showPanel = focused && query.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    pushRecentSearch(q);
    trackEvent("search_submit", { query: q, from: "hero" });
    // 問題型查詢 → 送到問保險 AI；否則送到完整搜尋頁
    if (isQuestionQuery(q)) {
      router.push(`/ask?q=${encodeURIComponent(q)}`);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
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
            placeholder="搜索保險產品、公司、保障、條款或直接問問題"
            className="h-11 w-full bg-transparent text-[15px] outline-none placeholder:text-ink-mute"
            aria-label="搜索保險產品、公司、保障、條款或直接問問題"
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
          {/* 一句話答案（完整問題優先） */}
          {quickAnswer && (
            <div className="border-b border-ink-line bg-brand-50/60 px-4 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                <Sparkles size={11} aria-hidden />
                一句話答案
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-brand-900">
                {quickAnswer.answer}
              </p>
              <Link
                href={`/ask?q=${encodeURIComponent(query)}`}
                className="mt-1.5 inline-block text-[12px] font-medium text-brand-700 hover:underline"
              >
                深入問問 →
              </Link>
            </div>
          )}

          {results.length === 0 ? (
            <div className="p-5 text-center">
              <p className="text-sm font-medium text-ink">未找到相關資料</p>
              <p className="mt-1.5 text-[12.5px] text-ink-mute">
                請嘗試其他關鍵字，例如「自付額」、「危疾」、「續保」。
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="inline-flex text-[13px] font-medium text-brand-700 hover:underline"
                >
                  查看完整搜尋結果
                </Link>
                <Link
                  href={`/ask?q=${encodeURIComponent(query)}`}
                  className="inline-flex text-[13px] font-medium text-brand-700 hover:underline"
                >
                  用問保險 AI 查詢
                </Link>
              </div>
            </div>
          ) : (
            <ul className="max-h-[340px] overflow-y-auto">
              {topResults.map((r: SearchResult) => {
                const Icon = SEARCH_KIND_META[r.kind].icon;
                return (
                  <li key={`${r.kind}-${r.id}`}>
                    <Link
                      href={r.href}
                      onClick={() => pushRecentSearch(query)}
                      className="flex items-start gap-3 border-b border-ink-line/70 px-4 py-3 last:border-b-0 hover:bg-paper"
                    >
                      <Icon
                        size={16}
                        className="mt-0.5 shrink-0 text-brand-600"
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium text-ink">
                          {r.title}
                        </span>
                        <span className="block truncate text-[12px] text-ink-mute">
                          {SEARCH_KIND_META[r.kind].label} · {r.subtitle}
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
