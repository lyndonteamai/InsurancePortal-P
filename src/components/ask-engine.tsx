"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles, BookOpen, Package, HelpCircle, Layers, ArrowRight } from "lucide-react";
import { composeAnswer, askSuggestions, ASK_KIND_LABELS } from "@/lib/ask-engine";
import { Database, Scale, FileText, ShieldCheck } from "lucide-react";
import type { AskSourceKind } from "@/lib/ask-engine";
import { trackEvent } from "@/lib/analytics";

// ============================================================
// 問保險問題 (/ask)
// ============================================================
// 這個頁面的定位是「資料庫檢索 + 結構化回答」，
// 而不是聊天機器人。回答永遠引用資料庫中實際存在的條目。
// ============================================================

const KIND_ICONS: Record<AskSourceKind, typeof BookOpen> = {
  faq: HelpCircle,
  term: BookOpen,
  article: Layers,
  product: Package,
  hub: Sparkles,
};

export function AskEngine() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState<string | null>(initialQuery || null);
  const [loading, setLoading] = useState(false);

  // 支援從全站搜尋以 ?q= 直接帶入問題
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setSubmitted(initialQuery);
    }
  }, [initialQuery]);

  const answer = submitted ? composeAnswer(submitted) : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    trackEvent("ask_submit", { query: q, length: q.length });
    // 模擬一點查詢延遲，讓狀態變化更明顯（正式環境會是實際 API 延遲）
    window.setTimeout(() => {
      setSubmitted(q);
      setLoading(false);
    }, 180);
  }

  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">問保險 AI</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
          問保險 AI
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
          用一句話問你想知道的保險概念。回答固定分成五段：簡單答案、相關產品、
          相關條款、官方來源、進一步比較。所有產品數字都來自平台資料庫，
          並標明根據哪些資料。
        </p>
        <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-ink-mute">
          這個引擎回答的是「甚麼是甚麼」與「有甚麼差別」。它不會告訴你該買哪一份，
          也不會替你完成任何投保程序。
        </p>
      </header>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例如：自付額高會怎樣？保證續保有甚麼限制？"
            aria-label="輸入你的保險問題"
            className="h-14 w-full rounded-xl border border-ink-line bg-white pl-12 pr-4 text-[15px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-800 px-5 text-[14px] font-semibold text-white hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "查詢中…" : "提問"}
            <ArrowRight size={15} aria-hidden />
          </button>
          {submitted && (
            <button
              type="button"
              onClick={() => {
                setSubmitted(null);
                setQuery("");
              }}
              className="inline-flex h-10 items-center rounded-lg border border-ink-line bg-white px-4 text-[13.5px] font-medium text-ink-soft hover:bg-paper"
            >
              清除
            </button>
          )}
        </div>
      </form>

      {/* Suggestions */}
      {!answer && (
        <div className="mt-8">
          <h2 className="text-[15px] font-semibold text-ink">試試這些問題</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {askSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQuery(s);
                  setSubmitted(s);
                  trackEvent("ask_submit", { query: s, fromSuggestion: true });
                }}
                className="group flex items-center justify-between gap-3 rounded-lg border border-ink-line bg-white px-3.5 py-2.5 text-left text-[13.5px] text-ink-soft transition-colors hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-800"
              >
                {s}
                <ArrowRight
                  size={14}
                  className="shrink-0 text-ink-mute transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700"
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Answer */}
      {answer && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            {/* 段 1：簡單答案 */}
            <div className="rounded-xl border-l-4 border-brand-700 bg-brand-50/70 p-5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">
                <Sparkles size={12} aria-hidden />
                簡單答案
              </p>
              <p className="mt-2 text-[15.5px] leading-relaxed text-ink">
                {answer.simpleAnswer ?? answer.direct}
              </p>
              {answer.groundedOn && answer.groundedOn.length > 0 && (
                <p className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-brand-200/70 pt-3 text-[11.5px] text-brand-900/75">
                  <Database size={11} aria-hidden />
                  這個回答根據平台資料庫的
                  {answer.groundedOn.map((g, i) => (
                    <span key={g.entity}>
                      {i > 0 && "、"}
                      <span className="font-medium">{g.count} 項{g.entity}</span>
                    </span>
                  ))}
                  組成，沒有使用平台以外的推測。
                </p>
              )}
            </div>

            {answer.detail.length > 0 && (
              <div className="mt-5 rounded-xl border border-ink-line bg-white p-5">
                <h2 className="text-[15px] font-semibold text-ink">詳細說明</h2>
                <div className="mt-3 space-y-3">
                  {answer.detail.map((d, i) => (
                    <p key={i} className="text-[13.5px] leading-[1.85] text-ink-soft">
                      {d}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {answer.sources.length > 0 && (
              <div className="mt-5">
                <h2 className="text-[15px] font-semibold text-ink">
                  回答依據（{answer.sources.length} 條資料庫條目）
                </h2>
                <ul className="mt-3 space-y-2">
                  {answer.sources.map((s) => {
                    const Icon = KIND_ICONS[s.kind];
                    return (
                      <li key={s.kind + s.id}>
                        <Link
                          href={s.href}
                          className="group flex items-start gap-3 rounded-lg border border-ink-line bg-white px-3.5 py-3 hover:border-brand-300 hover:bg-brand-50/40"
                        >
                          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700">
                            <Icon size={14} aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-[13.5px] font-medium text-ink group-hover:text-brand-700">
                                {s.title}
                              </span>
                              <span className="rounded bg-paper px-1.5 py-0.5 text-[10.5px] font-medium text-ink-mute">
                                {ASK_KIND_LABELS[s.kind]}
                              </span>
                            </span>
                            <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-mute">
                              {s.snippet.slice(0, 110)}
                              {s.snippet.length > 110 && "…"}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* 段 4：官方來源 */}
            {answer.officialSources && answer.officialSources.length > 0 && (
              <div className="mt-5 rounded-xl border border-ink-line bg-white p-5">
                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                  <FileText size={15} className="text-brand-600" aria-hidden />
                  官方來源
                </h2>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                  這個回答所引用的文件。這些是平台資料庫內登記的來源，
                  不是由 AI 生成的內容。
                </p>
                <ul className="mt-3 space-y-2">
                  {answer.officialSources.map((src) => (
                    <li
                      key={src.id}
                      className="rounded-lg border border-ink-line bg-paper px-3.5 py-2.5"
                    >
                      <p className="text-[13px] font-medium text-ink">{src.title}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-ink-mute">
                        <span>{src.publisher}</span>
                        <span className="rounded bg-white px-1.5 py-0.5 font-medium text-ink-soft">
                          {src.type}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 font-medium text-violet-800">
                          <ShieldCheck size={9} aria-hidden />
                          {src.verificationStatus === "demo"
                            ? "原型模擬資料"
                            : src.verificationStatus === "verified"
                              ? "已核實"
                              : src.verificationStatus === "partially_verified"
                                ? "部分核實"
                                : "尚未核實"}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 段 5：進一步比較 */}
            {answer.nextComparisons && answer.nextComparisons.length > 0 && (
              <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50/50 p-5">
                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-brand-900">
                  <Scale size={15} aria-hidden />
                  進一步比較
                </h2>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-brand-900/75">
                  下一步可以做甚麼。平台不會替你決定，但可以把比較的入口放在這裡。
                </p>
                <div className="mt-3 space-y-2">
                  {answer.nextComparisons.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      className="group flex items-start gap-3 rounded-lg border border-brand-100 bg-white px-3.5 py-3 hover:border-brand-300"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-medium text-ink group-hover:text-brand-700">
                          {c.label}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-mute">
                          {c.note}
                        </span>
                      </span>
                      <ArrowRight
                        size={14}
                        className="mt-0.5 shrink-0 text-ink-mute group-hover:text-brand-700"
                        aria-hidden
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            {answer.relatedProducts.length > 0 && (
              <div className="rounded-xl border border-ink-line bg-white p-4">
                <h2 className="text-[13.5px] font-semibold text-ink">相關產品</h2>
                <p className="mt-1 text-[11.5px] text-ink-mute">
                  列出僅供參考，不是推薦。
                </p>
                <ul className="mt-3 space-y-2">
                  {answer.relatedProducts.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.slug}`}
                        className="block rounded-lg border border-ink-line bg-paper px-3 py-2 hover:border-brand-300 hover:bg-brand-50/40"
                      >
                        <span className="block text-[13px] font-medium text-ink">
                          {p.name}
                        </span>
                        <span className="mt-0.5 block text-[11.5px] text-ink-mute">
                          {p.tagline}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {answer.relatedTerms.length > 0 && (
              <div className="rounded-xl border border-ink-line bg-white p-4">
                <h2 className="text-[13.5px] font-semibold text-ink">相關術語</h2>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {answer.relatedTerms.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/dictionary/${t.slug}`}
                      className="rounded-full border border-ink-line bg-paper px-2.5 py-1 text-[11.5px] text-ink-soft hover:border-brand-300 hover:text-brand-800"
                    >
                      {t.zh}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h2 className="text-[13.5px] font-semibold text-amber-900">
                這個引擎的界線
              </h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-amber-900/85">
                這個頁面只檢索平台資料庫中已收錄的內容，不會生成資料庫以外的內容，
                也不會提供個人化的投保建議。涉及具體保單條款的法律解釋，請諮詢
                保險公司或持牌經紀。
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Explain the architecture */}
      <section className="mt-11 rounded-xl border border-ink-line bg-paper p-5">
        <h2 className="text-[15px] font-semibold text-ink">
          關於這個問答引擎
        </h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
          目前的引擎採用關鍵詞與語意匹配，從平台資料庫的四類條目（常見問題、
          保險術語、知識文章、產品資料）中找出最相關的內容並組成結構化回答。
          每一條回答都附上資料庫條目連結，你可以逐條核對。
        </p>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
          這個架構是為未來接入 AI 檢索而設計的：回答永遠引用資料庫中實際存在的
          條目，並且在找不到匹配時明確告知，而不是生成看似合理的內容。
        </p>
      </section>
    </div>
  );
}
