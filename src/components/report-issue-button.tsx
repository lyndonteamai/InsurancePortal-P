"use client";

import { useState } from "react";
import { Flag, X, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// ============================================================
// 回報資料問題 (Report Data Issue)
// ============================================================
// STEP 16：任何資料頁面都要有「回報資料問題」的入口。
// Prototype 階段沒有後端，提交後顯示明確的說明訊息，
// 而非假裝已收到。
// ============================================================

const ISSUE_TYPES = [
  { id: "coverage", label: "保障範圍或限額有誤" },
  { id: "premium", label: "保費數字有誤" },
  { id: "terms", label: "條款描述有誤" },
  { id: "source", label: "資料來源不正確" },
  { id: "outdated", label: "資料已過期" },
  { id: "other", label: "其他問題" },
];

export type ReportSubjectType =
  | "product"
  | "article"
  | "term"
  | "insurer"
  | "hub"
  | "faq";

export function ReportIssueButton({
  productId,
  productName,
  subjectId,
  subjectLabel,
  subjectType = "product",
  className = "",
}: {
  /** V1 相容欄位 */
  productId?: string;
  productName?: string;
  /** V2 通用欄位 */
  subjectId?: string;
  subjectLabel?: string;
  subjectType?: ReportSubjectType;
  className?: string;
}) {
  const resolvedId = subjectId ?? productId ?? "";
  const resolvedLabel = subjectLabel ?? productName ?? "";
  const subjectName =
    subjectType === "product"
      ? "保險產品"
      : subjectType === "article"
        ? "知識文章"
        : subjectType === "term"
          ? "保險術語"
          : subjectType === "insurer"
            ? "保險公司"
            : subjectType === "hub"
              ? "主題指南"
              : "常見問題";
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState("coverage");
  const [detail, setDetail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    trackEvent("report_issue", {
      subjectId: resolvedId,
      subjectType,
      issueType: type,
      hasDetail: !!detail,
    });
    setSubmitted(true);
  }

  function close() {
    setOpen(false);
    // 延遲重置，避免關閉動畫還沒結束就重置狀態
    setTimeout(() => {
      setSubmitted(false);
      setDetail("");
      setType("coverage");
    }, 200);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-mute underline decoration-dotted underline-offset-4 transition-colors hover:text-brand-700 ${className}`}
      >
        <Flag size={13} aria-hidden />
        回報資料問題
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="回報資料問題"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[17px] font-semibold tracking-tight text-ink">
                  回報資料問題
                </h2>
                <p className="mt-1 text-[13px] text-ink-mute">
                  {subjectName}：{resolvedLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="關閉"
                className="rounded-md p-1 text-ink-mute hover:bg-paper hover:text-ink"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            {submitted ? (
              <div className="py-4">
                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-700"
                    aria-hidden
                  />
                  <div>
                    <p className="text-[14px] font-medium text-emerald-900">
                      已記錄你的回報（Prototype 示範）
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-emerald-800">
                      這是一個原型示範網站，尚未接駁後端系統，因此你的回報
                      <strong>不會</strong>被實際送出或儲存。我們已記錄在本次瀏覽的
                      session 記錄中（見
                      <a href="/admin-preview" className="underline underline-offset-2">
                        資料營運預覽
                      </a>
                      ）。
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-emerald-800">
                      在正式環境中，這個表單會把回報連同內容 ID、頁面時間與具體欄位
                      直接送到內容編輯團隊的待處理佇列，並在同一頁顯示處理進度。
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="mt-4 w-full rounded-lg bg-brand-800 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-900"
                >
                  知道了
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <fieldset className="mb-4">
                  <legend className="mb-2 text-[13px] font-semibold text-ink">
                    問題類型
                  </legend>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {ISSUE_TYPES.map((t) => (
                      <label
                        key={t.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-[13px] transition-colors ${
                          type === t.id
                            ? "border-brand-500 bg-brand-50 text-brand-900"
                            : "border-ink-line bg-white text-ink-soft hover:bg-paper"
                        }`}
                      >
                        <input
                          type="radio"
                          name="issueType"
                          value={t.id}
                          checked={type === t.id}
                          onChange={() => setType(t.id)}
                          className="accent-brand-700"
                        />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="mb-1.5 block text-[13px] font-semibold text-ink">
                  詳細說明（可選）
                </label>
                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={4}
                  placeholder="例如：條款第 3 節的保障限額與此頁所列不一致。"
                  className="w-full rounded-lg border border-ink-line px-3 py-2 text-[13px] leading-relaxed text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />

                <p className="mt-3 text-[12px] leading-relaxed text-ink-mute">
                  我們不會要求你提供身份證明號碼、健康紀錄或任何個人資料。
                  回報內容只用於修正公開頁面上的資料。
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-brand-800 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-900"
                  >
                    提交回報
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-lg border border-ink-line px-4 py-2.5 text-[14px] font-medium text-ink-soft hover:bg-paper"
                  >
                    取消
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
