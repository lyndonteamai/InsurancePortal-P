import Link from "next/link";
import {
  FileText,
  ExternalLink,
  BookOpen,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import type { SourceDocument } from "@/data/types";
import { SOURCE_TYPE_LABELS } from "@/data/types";

// ============================================================
// 資料來源列表 (Source-First Design)
// ============================================================
// STEP 5：資料來源不是頁尾的附註，而是產品的核心組成部分。
// 每個保障項目都可以指回一份來源文件，形成可追溯的證據鏈。
// ============================================================

const TYPE_ICONS: Record<string, LucideIcon> = {
  policy_terms: FileText,
  product_sheet: BookOpen,
  benefit_table: FileText,
  brochure: BookOpen,
  regulator: Landmark,
  industry_body: Landmark,
  news: ExternalLink,
  internal_note: FileText,
};

export function SourceList({
  sources,
  compact = false,
  title = "資料來源",
}: {
  sources: SourceDocument[];
  compact?: boolean;
  title?: string;
}) {
  if (!sources.length) {
    return (
      <div className="rounded-lg border border-dashed border-ink-line bg-paper p-4">
        <p className="text-[13px] font-medium text-ink-soft">
          目前尚未加入可核實來源。
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-ink-mute">
          這個產品頁面的數據目前無法對照公開文件核對，因此不應直接作為投保依據。
          如果你發現資料有誤，歡迎透過「回報資料問題」告訴我們。
        </p>
      </div>
    );
  }

  return (
    <div>
      {!compact && (
        <h3 className="mb-2.5 text-[13px] font-semibold tracking-wide text-ink">
          {title}
          <span className="ml-2 font-normal text-ink-mute">
            共 {sources.length} 份
          </span>
        </h3>
      )}
      <ul className="space-y-2">
        {sources.map((s) => {
          const Icon = TYPE_ICONS[s.type] ?? FileText;
          return (
            <li
              key={s.id}
              className="rounded-lg border border-ink-line bg-white px-3 py-2.5"
            >
              <div className="flex items-start gap-2.5">
                <Icon
                  size={15}
                  className="mt-0.5 shrink-0 text-brand-600"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium leading-snug text-ink">
                    {s.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-ink-mute">
                    <span className="rounded bg-paper px-1.5 py-0.5 font-medium text-ink-soft">
                      {SOURCE_TYPE_LABELS[s.type]}
                    </span>
                    <span>{s.publisher}</span>
                    {s.version && <span>版本 {s.version}</span>}
                    {s.publishedAt && <span>發佈 {s.publishedAt}</span>}
                    {s.locator && <span>位置：{s.locator}</span>}
                  </p>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-brand-700 hover:underline"
                    >
                      開啟來源文件
                      <ExternalLink size={11} aria-hidden />
                    </a>
                  ) : (
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-mute">
                      {s.note ??
                        "此來源目前為原型示範，尚未有可公開查證的連結。"}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** 單一來源的內嵌引用（小字） */
export function SourceCitation({
  sourceIds,
  sources,
}: {
  sourceIds: string[];
  sources: SourceDocument[];
}) {
  if (!sourceIds.length) return null;
  const matched = sourceIds
    .map((id) => sources.find((s) => s.id === id))
    .filter(Boolean) as SourceDocument[];
  if (!matched.length) return null;
  return (
    <span className="ml-1 inline-flex align-middle text-[10.5px] text-ink-mute">
      <span className="sr-only">資料來源：</span>
      {matched.map((m, i) => (
        <span key={m.id}>
          {i > 0 && "、"}
          <Link
            href="#sources"
            className="underline decoration-dotted underline-offset-2 hover:text-brand-700"
          >
            {SOURCE_TYPE_LABELS[m.type]}
            {m.version ? ` ${m.version}` : ""}
          </Link>
        </span>
      ))}
    </span>
  );
}
