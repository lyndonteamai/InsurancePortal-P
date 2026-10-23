"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, BookOpen, CalendarDays, X, CircleHelp, ArrowRight } from "lucide-react";
import { articles, articleCategories } from "@/data/articles";
import { faqs } from "@/data/faqs";

export function LearnView() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [faqQuery, setFaqQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return articles.filter((a) => {
      if (category && a.category !== category) return false;
      if (!kw) return true;
      const body = a.sections
        .map((s) => `${s.heading} ${s.paragraphs.join(" ")} ${(s.bullets ?? []).join(" ")}`)
        .join(" ");
      const hay = `${a.title} ${a.excerpt} ${a.category} ${body}`.toLowerCase();
      return hay.includes(kw);
    });
  }, [keyword, category]);

  const faqResults = useMemo(() => {
    const q = faqQuery.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((f) =>
      `${f.question} ${f.answer} ${f.category} ${f.keywords.join(" ")}`.toLowerCase().includes(q)
    );
  }, [faqQuery]);

  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">保險知識</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">保險知識中心</h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
          用中立、唔賣產品嘅方式解釋保險概念。所有文章為 Prototype 教學示例。
        </p>
      </header>

      {/* Search + categories */}
      <div className="mt-7 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜尋文章標題及內容"
              className="h-10 w-full rounded-md border border-ink-line bg-white pl-9 pr-3 text-[13.5px] outline-none focus:border-brand-400"
              aria-label="搜尋文章"
            />
          </div>

          <div className="mt-4 rounded-xl border border-ink-line bg-white p-3">
            <h2 className="px-1 text-[11.5px] font-semibold uppercase tracking-wider text-ink-mute">
              文章分類
            </h2>
            <ul className="mt-2 space-y-0.5">
              <li>
                <button
                  type="button"
                  onClick={() => setCategory(null)}
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-[13px] transition-colors ${
                    category === null
                      ? "bg-brand-50 font-semibold text-brand-800"
                      : "text-ink-soft hover:bg-paper"
                  }`}
                >
                  全部
                  <span className="text-[11.5px] text-ink-mute">{articles.length}</span>
                </button>
              </li>
              {articleCategories.map((c) => {
                const n = articles.filter((a) => a.category === c).length;
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-[13px] transition-colors ${
                        category === c
                          ? "bg-brand-50 font-semibold text-brand-800"
                          : "text-ink-soft hover:bg-paper"
                      }`}
                    >
                      {c}
                      <span className="text-[11.5px] text-ink-mute">{n}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-ink-soft">
              找到 <span className="font-semibold text-ink">{filtered.length}</span> 篇文章
            </p>
            {(category || keyword) && (
              <button
                type="button"
                onClick={() => {
                  setCategory(null);
                  setKeyword("");
                }}
                className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-mute hover:text-brand-700"
              >
                <X size={12} /> 清除篩選
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-ink-line bg-white p-12 text-center">
              <BookOpen size={28} className="mx-auto text-ink-mute" />
              <p className="mt-3 text-[15px] font-medium text-ink">未找到相關文章</p>
              <p className="mt-1.5 text-[13px] text-ink-mute">試下其他關鍵字，或者查看下方常見問題。</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {filtered.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/learn/${a.slug}`}
                    className="group block rounded-xl border border-ink-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                        {a.category}
                      </span>
                      <span className="text-[11.5px] text-ink-mute">更新於 {a.updatedAt}</span>
                      <span className="text-[11.5px] text-ink-mute">·</span>
                      <span className="text-[11.5px] text-ink-mute">閱讀 {a.readingMinutes} 分鐘</span>
                    </div>
                    <h2 className="mt-2.5 text-[16.5px] font-semibold leading-snug text-ink group-hover:text-brand-700">
                      {a.title}
                    </h2>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{a.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-700">
                      閱讀全文
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* FAQ */}
      <section id="faq" className="mt-14 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight text-ink">常見保險問題</h2>
            <p className="mt-1.5 text-[13.5px] text-ink-soft">
              輸入你嘅問題，搜尋本地 FAQ 資料庫（共 {faqs.length} 條）。
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
          <div className="rounded-xl border border-ink-line bg-white p-4 lg:sticky lg:top-24">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input
                value={faqQuery}
                onChange={(e) => setFaqQuery(e.target.value)}
                placeholder="例如：自付額是什麼？"
                className="h-10 w-full rounded-md border border-ink-line bg-white pl-9 pr-3 text-[13.5px] outline-none focus:border-brand-400"
                aria-label="搜尋常見問題"
              />
            </div>
            <p className="mt-3 text-[12px] text-ink-mute">
              {faqQuery
                ? `找到 ${faqResults.length} 條相關答案`
                : "示範搜尋功能：輸入關鍵字即時篩選常見問題。"}
            </p>
            {faqQuery && (
              <button
                type="button"
                onClick={() => setFaqQuery("")}
                className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-ink-mute hover:text-brand-700"
              >
                <X size={12} /> 清除
              </button>
            )}
          </div>

          <div className="min-w-0">
            {faqResults.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink-line bg-white p-10 text-center">
                <CircleHelp size={26} className="mx-auto text-ink-mute" />
                <p className="mt-3 text-[14.5px] font-medium text-ink">
                  目前沒有找到相關資料。你可以嘗試其他關鍵字，或瀏覽保險知識中心。
                </p>
                <button
                  type="button"
                  onClick={() => setFaqQuery("")}
                  className="mt-3 inline-flex text-[13px] font-medium text-brand-700 hover:underline"
                >
                  檢視全部常見問題
                </button>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {faqResults.map((f) => {
                  const open = openFaq === f.id;
                  return (
                    <li
                      key={f.id}
                      id={`faq-${f.id}`}
                      className="scroll-mt-24 rounded-xl border border-ink-line bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : f.id)}
                        className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left"
                      >
                        <span className="text-[14px] font-medium text-ink">{f.question}</span>
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-ink-line text-ink-mute ${
                            open ? "rotate-45" : ""
                          }`}
                        >
                          +
                        </span>
                      </button>
                      {open && (
                        <div className="border-t border-ink-line px-4 py-3.5">
                          <p className="text-[13.5px] leading-relaxed text-ink-soft">{f.answer}</p>
                          <p className="mt-2.5 flex items-center gap-1.5 text-[11.5px] text-ink-mute">
                            <CalendarDays size={12} />
                            分類：{f.category} · Prototype 模擬資料
                          </p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
