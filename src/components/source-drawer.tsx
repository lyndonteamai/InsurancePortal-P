"use client";

import { useEffect, useRef, useState } from "react";
import { X, FileText, ExternalLink, Landmark, BookOpen, ShieldCheck, FlaskConical, Quote, Calendar, Layers } from "lucide-react";
import type {
  Evidence,
  InsuranceProduct,
  SourceDocument,
  VerificationStatus,
} from "@/data/types";
import {
  SOURCE_TYPE_LABELS,
  VERIFICATION_LABELS,
  ACQUISITION_METHOD_LABELS,
  EXTRACTION_STATE_LABELS,
} from "@/data/types";
import { resolveEvidenceSources } from "@/data/evidence";

// ============================================================
// Source Drawer / Evidence Drawer
// ============================================================
// 這是 Source-First 的落地元件。任何一個產品事實都可以被打開，
// 看到它背後的證據：來自哪份文件、哪個版本、哪一頁、什麼時候取得、
// 什麼時候審核過、目前核實狀態是甚麼。
//
// 設計紅線：
//   1. 原型資料必須極醒目地標示「原型模擬資料 — 尚未連接真實官方來源」
//   2. 沒有來源就說沒有來源，不用模糊字眼掩蓋
//   3. 這個元件不做任何評價，只呈現證據
// ============================================================

const TYPE_ICONS: Record<string, typeof FileText> = {
  policy_terms: FileText,
  product_sheet: BookOpen,
  benefit_table: FileText,
  brochure: BookOpen,
  regulator: Landmark,
  industry_body: Landmark,
  news: ExternalLink,
  internal_note: FileText,
};

const STATUS_ICON: Record<VerificationStatus, typeof ShieldCheck> = {
  verified: ShieldCheck,
  partially_verified: ShieldCheck,
  unverified: ShieldCheck,
  demo: FlaskConical,
};

/** 原型資料警示條 —— 任何地方顯示 demo 來源都要掛上這個 */
export function DemoDataNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 ${className}`}
      role="note"
    >
      <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-amber-900">
        <FlaskConical size={13} aria-hidden />
        原型模擬資料 — 尚未連接真實官方來源
      </p>
      <p className="mt-1 text-[11.5px] leading-relaxed text-amber-800">
        本頁所示的文件名稱、版本號、頁碼與引用內容，全部是為示範
        「資料從哪裡來」這個功能而虛構的，並非任何真實保險公司的公開文件。
        正式版本接入官方條款 PDF 之後，這裡會顯示可公開查證的連結與原文摘錄。
      </p>
    </div>
  );
}

/** 「查看來源」觸發按鈕 */
export function SourceLinkButton({
  onClick,
  hasSource,
  label = "查看來源",
  className = "",
}: {
  onClick: () => void;
  hasSource: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded border border-ink-line bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-ink-soft transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 ${className}`}
    >
      <Quote size={10} aria-hidden />
      {hasSource ? label : "尚未有來源"}
    </button>
  );
}

function SourceRow({ s }: { s: SourceDocument }) {
  const Icon = TYPE_ICONS[s.type] ?? FileText;
  return (
    <li className="rounded-lg border border-ink-line bg-white p-3">
      <div className="flex items-start gap-2.5">
        <Icon size={15} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-snug text-ink">
            {s.title}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-ink-mute">
            <span className="rounded bg-paper px-1.5 py-0.5 font-medium text-ink-soft">
              {SOURCE_TYPE_LABELS[s.type]}
            </span>
            <span>出版：{s.publisher}</span>
            {s.documentVersion && <span>版本：{s.documentVersion}</span>}
          </p>

          <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-ink-line pt-2.5 text-[11.5px]">
            {s.effectiveDate && (
              <div>
                <dt className="inline text-ink-mute">生效日期：</dt>
                <dd className="inline text-ink-soft">{s.effectiveDate}</dd>
              </div>
            )}
            {s.retrievedDate && (
              <div>
                <dt className="inline text-ink-mute">取得日期：</dt>
                <dd className="inline text-ink-soft">{s.retrievedDate}</dd>
              </div>
            )}
            {s.lastReviewedDate && (
              <div>
                <dt className="inline text-ink-mute">最後審核：</dt>
                <dd className="inline text-ink-soft">{s.lastReviewedDate}</dd>
              </div>
            )}
            {s.section && (
              <div>
                <dt className="inline text-ink-mute">章節：</dt>
                <dd className="inline text-ink-soft">{s.section}</dd>
              </div>
            )}
            {s.pageNumber && (
              <div>
                <dt className="inline text-ink-mute">頁碼：</dt>
                <dd className="inline text-ink-soft">{s.pageNumber}</dd>
              </div>
            )}
            {s.acquisitionMethod && (
              <div>
                <dt className="inline text-ink-mute">取得方式：</dt>
                <dd className="inline text-ink-soft">
                  {ACQUISITION_METHOD_LABELS[s.acquisitionMethod]}
                </dd>
              </div>
            )}
            {s.extractionState && (
              <div>
                <dt className="inline text-ink-mute">抽取狀態：</dt>
                <dd className="inline text-ink-soft">
                  {EXTRACTION_STATE_LABELS[s.extractionState]}
                </dd>
              </div>
            )}
          </dl>

          {s.quoteOrReference && (
            <blockquote className="mt-2.5 border-l-2 border-brand-200 bg-paper/60 py-1.5 pl-2.5 text-[11.5px] leading-relaxed text-ink-soft">
              {s.quoteOrReference}
            </blockquote>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${
                s.verificationStatus === "demo"
                  ? "border-violet-200 bg-violet-50 text-violet-800"
                  : s.verificationStatus === "verified"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-ink-line bg-paper text-ink-soft"
              }`}
            >
              <ShieldCheck size={10} aria-hidden />
              {VERIFICATION_LABELS[s.verificationStatus ?? "demo"]}
            </span>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 text-[11.5px] font-medium text-brand-700 hover:underline"
              >
                開啟來源文件
                <ExternalLink size={11} aria-hidden />
              </a>
            ) : (
              <span className="text-[11px] text-ink-mute">
                {s.note ?? "此來源目前為原型示範，尚未有可公開查證的連結。"}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * 抽屜本體。可由任何頁面控制開關。
 * 傳入 evidence（或自訂的 factLabel / factValue / sources）即可。
 */
export function SourceDrawer({
  open,
  onClose,
  evidence,
  product,
  sources: providedSources,
  factLabel,
  factValue,
  title = "資料來源",
}: {
  open: boolean;
  onClose: () => void;
  evidence?: Evidence;
  product?: InsuranceProduct;
  sources?: SourceDocument[];
  factLabel?: string;
  factValue?: string;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const resolvedSources =
    providedSources ??
    (evidence ? resolveEvidenceSources(evidence, product) : []);

  const status: VerificationStatus =
    evidence?.verificationStatus ?? product?.verification.status ?? "demo";

  // Esc 關閉
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && ref.current) ref.current.focus();
  }, [open]);

  if (!open) return null;

  const StatusIcon = STATUS_ICON[status];
  const isDemo = status === "demo" || resolvedSources.some((s) => s.isPrototype);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="關閉資料來源面板"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
      />
      <div
        ref={ref}
        tabIndex={-1}
        className="relative flex h-full w-full max-w-[520px] flex-col bg-paper shadow-2xl focus:outline-none"
      >
        {/* 頭部 */}
        <div className="flex items-start justify-between gap-3 border-b border-ink-line bg-white px-5 py-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
              <Layers size={12} aria-hidden />
              Evidence
            </p>
            <h2 className="mt-1 text-[17px] font-semibold tracking-tight text-ink">
              {title}
            </h2>
            {factLabel && (
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                <span className="font-medium text-ink">{factLabel}</span>
                {factValue && (
                  <>
                    <span className="mx-1.5 text-ink-mute">—</span>
                    <span className="font-medium text-brand-800">{factValue}</span>
                  </>
                )}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-ink-mute transition hover:bg-paper hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="關閉"
          >
            <X size={17} aria-hidden />
          </button>
        </div>

        {/* 內容 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isDemo && <DemoDataNotice className="mb-4" />}

          {factLabel && (
            <div className="mb-4 rounded-lg border border-ink-line bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
                核實狀態
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-ink">
                <StatusIcon size={14} aria-hidden />
                {VERIFICATION_LABELS[status]}
              </p>
              {evidence?.quoteOrReference && (
                <blockquote className="mt-2 border-l-2 border-brand-200 bg-paper/60 py-1.5 pl-2.5 text-[12px] leading-relaxed text-ink-soft">
                  {evidence.quoteOrReference}
                </blockquote>
              )}
            </div>
          )}

          {resolvedSources.length > 0 ? (
            <>
              <p className="mb-2 text-[13px] font-semibold text-ink">
                來源文件
                <span className="ml-2 font-normal text-ink-mute">
                  共 {resolvedSources.length} 份
                </span>
              </p>
              <ul className="space-y-2.5">
                {resolvedSources.map((s) => (
                  <SourceRow key={s.id} s={s} />
                ))}
              </ul>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-ink-line bg-white p-4">
              <p className="text-[13px] font-medium text-ink-soft">
                目前尚未加入可核實來源。
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-mute">
                這個項目目前無法對照公開文件核對，因此不應直接作為投保依據。
                如果你發現資料有誤，歡迎透過「回報資料問題」告訴我們。
              </p>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="border-t border-ink-line bg-white px-5 py-3">
          <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-ink-mute">
            <Calendar size={11} className="mt-0.5 shrink-0" aria-hidden />
            <span>
              來源文件可能會更新。平台會記錄每次版本變更並重新審核受影響的欄位；
              頁面上顯示的審核日期，即是這個欄位最後一次被人工確認的時間。
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 受控的抽屜 hook：讓頁面可以用一行 state 開關證據面板。
 */
export function useSourceDrawer() {
  const [state, setState] = useState<{
    evidence?: Evidence;
    product?: InsuranceProduct;
    sources?: SourceDocument[];
    factLabel?: string;
    factValue?: string;
    title?: string;
  } | null>(null);

  const open = (cfg: {
    evidence?: Evidence;
    product?: InsuranceProduct;
    sources?: SourceDocument[];
    factLabel?: string;
    factValue?: string;
    title?: string;
  }) => setState(cfg);

  const close = () => setState(null);

  return { drawerState: state, openDrawer: open, closeDrawer: close };
}
