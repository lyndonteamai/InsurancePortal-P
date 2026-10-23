"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Package, BookOpen, CircleHelp, CornerDownLeft } from "lucide-react";
import { searchAll, searchSuggestions, type SearchResult } from "@/lib/search";

const KIND_META: Record<SearchResult["kind"], { label: string; icon: typeof Package }> = {
  product: { label: "產品", icon: Package },
  article: { label: "文章", icon: BookOpen },
  faq: { label: "保險知識", icon: CircleHelp },
};

export function GlobalSearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchAll(query), [query]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
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

  const grouped: [SearchResult["kind"], SearchResult[]][] = [
    ["product", results.filter((r) => r.kind === "product")],
    ["article", results.filter((r) => r.kind === "article")],
    ["faq", results.filter((r) => r.kind === "faq")],
  ];

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
                router.push(results[0].href);
                onClose();
              }
            }}
            placeholder="搜尋產品、條款或保險問題…"
            className="h-13 w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-ink-mute"
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
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-mute">
                試試搜尋
              </p>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((s) => (
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

          {query && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-ink">未找到相關資料</p>
              <p className="mt-1.5 text-[13px] text-ink-mute">
                請嘗試其他關鍵字，例如「自付額」、「危疾」、「續保」。
              </p>
            </div>
          )}

          {query &&
            grouped.map(([kind, list]) =>
              list.length === 0 ? null : (
                <section key={kind} className="border-b border-ink-line last:border-b-0">
                  <h3 className="bg-paper px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
                    {KIND_META[kind].label}（{list.length}）
                  </h3>
                  <ul>
                    {list.slice(0, kind === "product" ? 6 : 5).map((r) => {
                      const Icon = KIND_META[r.kind].icon;
                      return (
                        <li key={`${r.kind}-${r.id}`}>
                          <Link
                            href={r.href}
                            onClick={onClose}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-paper"
                          >
                            <Icon size={16} className="mt-0.5 shrink-0 text-brand-600" />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium text-ink">
                                {r.title}
                              </span>
                              <span className="block truncate text-[12px] text-ink-mute">
                                {r.meta}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )
            )}
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
