"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, CornerDownLeft, History, ArrowRight, Sparkles } from "lucide-react";
import {
  searchAll,
  searchSuggestions,
  defaultSuggestions,
  isQuestionQuery,
  findQuickAnswer,
  type SearchResult,
} from "@/lib/search";
import { SEARCH_KIND_META, SEARCH_KIND_ORDER } from "@/lib/search-ui";
import { trackEvent } from "@/lib/analytics";

const RECENT_KEY = "ic-recent-searches";
const MAX_RECENT = 6;

export function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function pushRecentSearch(q: string) {
  if (typeof window === "undefined") return;
  const trimmed = q.trim();
  if (!trimmed) return;
  try {
    const list = [
      trimmed,
      ...readRecentSearches().filter((x) => x !== trimmed),
    ].slice(0, MAX_RECENT);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* 儲存失敗時忽略，不影響搜尋 */
  }
}

export function GlobalSearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchAll(query), [query]);
  const dynamicSuggestions = useMemo(() => searchSuggestions(query), [query]);
  const isQuestion = useMemo(() => isQuestionQuery(query), [query]);
  const quickAnswer = useMemo(
    () => (isQuestion ? findQuickAnswer(query) : null),
    [isQuestion, query],
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      setRecent(readRecentSearches());
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const grouped = SEARCH_KIND_ORDER.map((kind) => ({
    kind,
    items: results.filter((r) => r.kind === kind && r.resultType === "organic"),
  })).filter((g) => g.items.length > 0);

  function go(href: string) {
    pushRecentSearch(query);
    trackEvent("search_submit", { query, resultCount: results.length });
    router.push(href);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[8vh]">
      <button
        type="button"
        aria-label="關閉搜尋"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="全站搜尋"
        className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-ink-line bg-white shadow-lift"
      >
        <div className="flex items-center gap-2 border-b border-ink-line px-4">
          <Search size={18} className="shrink-0 text-ink-mute" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results.length > 0) {
                go(results[0].href);
              }
            }}
            placeholder="搜索保險產品、公司、保障、條款或直接問問題…"
            className="w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-ink-mute"
            style={{ height: 52 }}
          />
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 shrink-0 place-items-center rounded text-ink-mute hover:bg-paper"
            aria-label="關閉"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query && (
            <div className="p-4">
              {recent.length > 0 && (
                <>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-mute">
                    <History size={12} /> 最近搜尋
                  </p>
                  <div className="mb-5 flex flex-wrap gap-2">
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
                </>
              )}
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-mute">
                試試搜尋
              </p>
              <div className="flex flex-wrap gap-2">
                {defaultSuggestions.map((s) => (
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

          {query && quickAnswer && (
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
                onClick={onClose}
                className="mt-1.5 inline-block text-[12px] font-medium text-brand-700 hover:underline"
              >
                深入問問 →
              </Link>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-ink">未找到相關資料</p>
              <p className="mt-1.5 text-[13px] text-ink-mute">
                請嘗試其他關鍵字，例如「自付額」、「危疾」、「續保」。
              </p>
              {dynamicSuggestions.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {dynamicSuggestions.map((s) => (
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
              )}
              <Link
                href={`/ask?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-brand-700 hover:underline"
              >
                用問答方式查這條問題
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {query &&
            grouped.map((g) => (
              <section
                key={g.kind}
                className="border-b border-ink-line last:border-b-0"
              >
                <h3 className="bg-paper px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
                  {SEARCH_KIND_META[g.kind].label}（{g.items.length}）
                </h3>
                <ul>
                  {g.items
                    .slice(0, g.kind === "product" ? 6 : 5)
                    .map((r: SearchResult) => {
                      const Icon = SEARCH_KIND_META[r.kind].icon;
                      return (
                        <li key={`${r.kind}-${r.id}`}>
                          <Link
                            href={r.href}
                            onClick={() => {
                              pushRecentSearch(query);
                              trackEvent("search_submit", {
                                query,
                                resultCount: results.length,
                              });
                              onClose();
                            }}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-paper"
                          >
                            <Icon
                              size={16}
                              className="mt-0.5 shrink-0 text-brand-600"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium text-ink">
                                {r.title}
                              </span>
                              <span className="block truncate text-[12px] text-ink-mute">
                                {r.subtitle}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </section>
            ))}
        </div>

        <div className="flex items-center justify-between border-t border-ink-line bg-paper px-4 py-2 text-[11px] text-ink-mute">
          <span className="flex items-center gap-1.5">
            <CornerDownLeft size={12} /> 按 Enter 開啟第一個結果
          </span>
          <span>Esc 關閉</span>
        </div>
      </div>
    </div>
  );
}
