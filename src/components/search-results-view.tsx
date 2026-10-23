"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ArrowRight,
  X,
  MessageCircleQuestion,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import {
  searchAll,
  isQuestionQuery,
  findQuickAnswer,
  groupResults,
  extractSponsored,
  type SearchResult,
} from "@/lib/search";
import { SEARCH_KIND_META, SEARCH_KIND_ORDER } from "@/lib/search-ui";
import { trackEvent } from "@/lib/analytics";
import { pushRecentSearch, readRecentSearches } from "./global-search";
import { SponsoredBadge } from "./sponsored-badge";

export function SearchResultsView() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [active, setActive] = useState<SearchResult["kind"] | "all">("all");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setQuery(initial);
    setRecent(readRecentSearches());
  }, [initial]);

  const results = useMemo(() => searchAll(query), [query]);
  const organic = useMemo(
    () => results.filter((r) => r.resultType === "organic"),
    [results],
  );
  const sponsored = useMemo(() => extractSponsored(results), [results]);
  const grouped = useMemo(() => groupResults(results), [results]);

  const isQuestion = useMemo(() => isQuestionQuery(query), [query]);
  const quickAnswer = useMemo(
    () => (isQuestion ? findQuickAnswer(query) : null),
    [isQuestion, query],
  );

  const counts = SEARCH_KIND_ORDER.reduce(
    (acc, kind) => {
      acc[kind] = organic.filter((r) => r.kind === kind).length;
      return acc;
    },
    {} as Record<SearchResult["kind"], number>,
  );

  function submitSearch(q: string) {
    setQuery(q);
    pushRecentSearch(q);
    setRecent(readRecentSearches());
    trackEvent("search_submit", { query: q, resultCount: organic.length });
  }

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
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
          超級保險搜尋
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
          一個搜尋框，同時找得到保險產品、保險公司、保障項目、條款、保費資料、
          保險術語、知識文章與常見問題。輸入完整問題，會先給你一句話答案。
        </p>
      </header>

      <div className="relative mt-6 max-w-2xl">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitSearch(query);
          }}
          placeholder="搜索保險產品、公司、保障、條款或直接問問題"
          className="h-12 w-full rounded-lg border border-ink-line bg-white pl-11 pr-10 text-[15px] outline-none focus:border-brand-400"
          aria-label="超級保險搜尋"
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
          <p className="mt-3 text-[14.5px] font-medium text-ink">
            請輸入關鍵字開始搜尋
          </p>
          <p className="mt-1.5 text-[13px] text-ink-mute">
            例如：自付額、危疾、續保、住院保障上限、甚麼是現金值
          </p>
          {recent.length > 0 && (
            <div className="mt-6 border-t border-ink-line pt-5">
              <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wider text-ink-mute">
                最近搜尋
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {recent.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-ink-line bg-paper px-3 py-1.5 text-[13px] text-ink-soft hover:border-brand-300 hover:text-brand-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 分類篩選 */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {(
              [
                ["all", `全部（${organic.length}）`],
                ...SEARCH_KIND_ORDER.map(
                  (k) =>
                    [k, `${SEARCH_KIND_META[k].label}（${counts[k]}）`] as const,
                ),
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

          {/* 一句話答案：完整問題優先顯示 */}
          {quickAnswer && (
            <section className="mt-5 rounded-xl border border-brand-200 bg-brand-50/60 p-5">
              <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-brand-700">
                <Sparkles size={13} aria-hidden />
                一句話答案
              </p>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-brand-900">
                {quickAnswer.answer}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickAnswer.termSlug && (
                  <Link
                    href={`/dictionary/${quickAnswer.termSlug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-brand-800 hover:bg-brand-50"
                  >
                    查看術語解釋
                    <ArrowRight size={12} aria-hidden />
                  </Link>
                )}
                {quickAnswer.articleSlug && (
                  <Link
                    href={`/learn/${quickAnswer.articleSlug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-brand-800 hover:bg-brand-50"
                  >
                    查看相關文章
                    <ArrowRight size={12} aria-hidden />
                  </Link>
                )}
                <Link
                  href={`/ask?q=${encodeURIComponent(query)}`}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-brand-800 hover:bg-brand-50"
                >
                  用問保險 AI 深入查
                  <ArrowRight size={12} aria-hidden />
                </Link>
              </div>
            </section>
          )}

          {/* 贊助區：與自然結果完全分開 */}
          {sponsored.length > 0 && (
            <section className="mt-5" aria-label="贊助結果">
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-amber-800">
                  贊助結果
                </p>
                <ul className="mt-3 space-y-2">
                  {sponsored.map((r) => (
                    <li key={`sp-${r.kind}-${r.id}`}>
                      <Link
                        href={r.href}
                        className="group flex items-start gap-3 rounded-lg border border-amber-200 bg-white p-3.5 hover:border-amber-300"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <SponsoredBadge sponsorName={r.sponsorName} />
                            <span className="text-[14px] font-semibold text-ink group-hover:text-brand-700">
                              {r.title}
                            </span>
                          </span>
                          <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-soft">
                            {r.snippet ?? r.subtitle}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-2.5 text-[11px] leading-relaxed text-amber-800">
                  贊助結果不參與自然搜尋排序，也不會因為商業關係被排在自然結果前面。
                  詳見
                  <Link href="/commercial-transparency" className="mx-0.5 underline">
                    商業透明度
                  </Link>
                  與
                  <Link href="/ranking-methodology" className="mx-0.5 underline">
                    排序方法
                  </Link>
                  。
                </p>
              </div>
            </section>
          )}

          {organic.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-ink-line bg-white p-10 text-center">
              <p className="text-[14.5px] font-medium text-ink">
                目前沒有找到相關資料。你可以嘗試其他關鍵字，或改用問答方式查詢。
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link
                  href={`/ask?q=${encodeURIComponent(query)}`}
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-brand-700 hover:underline"
                >
                  <MessageCircleQuestion size={14} />
                  前往問保險 AI
                </Link>
                <Link
                  href="/dictionary"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-brand-700 hover:underline"
                >
                  前往保險術語字典
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* 自然結果：分組顯示 */}
              {active === "all" ? (
                <div className="mt-5 space-y-7">
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-brand-200 bg-brand-50/50 px-3.5 py-2.5">
                    <p className="text-[12.5px] font-semibold text-brand-900">
                      自然結果
                    </p>
                    <p className="text-[12px] leading-relaxed text-brand-900/75">
                      以下結果由平台按相關性、資料完整度、查詢匹配、資料新鮮度與
                      可核實程度排序，不受任何商業合作影響。
                    </p>
                  </div>
                  {grouped.map((g) => {
                    const Icon = SEARCH_KIND_META[g.kind].icon;
                    return (
                      <section key={g.kind} aria-labelledby={`grp-${g.kind}`}>
                        <h2
                          id={`grp-${g.kind}`}
                          className="flex items-center gap-2 text-[15px] font-semibold text-ink"
                        >
                          <Icon size={16} className="text-brand-600" aria-hidden />
                          {g.label}
                          <span className="text-[12px] font-normal text-ink-mute">
                            {g.items.length} 項
                          </span>
                        </h2>
                        <ul className="mt-3 space-y-2.5">
                          {g.items.map((r) => (
                            <ResultRow key={`${r.kind}-${r.id}`} r={r} query={query} />
                          ))}
                        </ul>
                      </section>
                    );
                  })}
                </div>
              ) : (
                <ul className="mt-5 space-y-2.5">
                  {organic
                    .filter((r) => r.kind === active)
                    .map((r) => (
                      <ResultRow key={`${r.kind}-${r.id}`} r={r} query={query} />
                    ))}
                </ul>
              )}

              {/* 搜索提示 */}
              <div className="mt-8 rounded-xl border border-dashed border-ink-line bg-white p-5">
                <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                  <Lightbulb size={14} className="text-accent-600" aria-hidden />
                  找不到想要的？
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                  試試用完整問題問，例如「自付額是什麼」、「保證續保有甚麼限制」，
                  或者直接前往問保險 AI 頁。
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/ask?q=${encodeURIComponent(query)}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-brand-800 px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-brand-900"
                  >
                    <MessageCircleQuestion size={13} aria-hidden />
                    問保險 AI
                  </Link>
                  <Link
                    href="/dictionary"
                    className="inline-flex items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 py-2 text-[12.5px] font-medium text-ink-soft hover:bg-paper"
                  >
                    保險術語字典
                  </Link>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

/** 單條搜尋結果 */
function ResultRow({ r, query }: { r: SearchResult; query: string }) {
  const Icon = SEARCH_KIND_META[r.kind].icon;
  return (
    <li>
      <Link
        href={r.href}
        onClick={() => pushRecentSearch(query)}
        className="group flex items-start gap-3 rounded-xl border border-ink-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
          <Icon size={17} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-snug text-ink group-hover:text-brand-700">
            {r.title}
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
            {r.snippet ?? r.subtitle}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-ink-mute">
            <span>{SEARCH_KIND_META[r.kind].label}</span>
            {r.categoryLabel && r.categoryLabel !== SEARCH_KIND_META[r.kind].label && (
              <span>· {r.categoryLabel}</span>
            )}
            {r.completeness != null && (
              <span>· 資料完整度 {r.completeness}%</span>
            )}
            {r.verificationStatus === "verified" && (
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-800">
                已核實
              </span>
            )}
          </span>
        </span>
        <ArrowRight
          size={15}
          className="mt-1 shrink-0 text-ink-mute group-hover:text-brand-700"
          aria-hidden
        />
      </Link>
    </li>
  );
}
