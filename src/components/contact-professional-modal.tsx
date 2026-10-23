"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  UserCheck,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  CheckCircle2,
  FlaskConical,
  Ban,
} from "lucide-react";
import { CATEGORY_LABELS, type ProductCategory } from "@/data/types";
import { trackEvent } from "@/lib/analytics";

// ============================================================
// 持牌保險人士聯絡請求 Modal（Contact-Only Journey）
// ============================================================
// 平台的红线（不可协商）：
//   1. 平台 NEVER 完成保险交易。没有 Buy Now / Apply Now /
//      Checkout / Payment / 投保 / 成交 任何入口。
//   2. 商业闭环的最高点是 Contact / Referral / Introduction：
//      用户留下联系方式 -> 转交合适的持牌保险专业人士 -> 平台停止。
//   3. 用户自己决定。平台不推荐「最适合你」的产品。
//   4. Prototype 阶段不会真正发送任何资料。
// ============================================================

const CATEGORY_OPTIONS: { value: ProductCategory | "general"; label: string }[] = [
  { value: "general", label: "不確定 / 想先了解概念" },
  { value: "medical", label: CATEGORY_LABELS.medical },
  { value: "critical-illness", label: CATEGORY_LABELS["critical-illness"] },
  { value: "life", label: CATEGORY_LABELS.life },
  { value: "savings-retirement", label: CATEGORY_LABELS["savings-retirement"] },
  { value: "travel", label: CATEGORY_LABELS.travel },
  { value: "home", label: CATEGORY_LABELS.home },
  { value: "motor", label: CATEGORY_LABELS.motor },
];

export type ContactContext = {
  /** 触发来源页面 */
  from: string;
  /** 相关产品 id（可选） */
  productIds?: string[];
  /** 相关产品名称（可选，用于展示） */
  productNames?: string[];
  /** 预设的保险类别 */
  category?: ProductCategory | "general";
  /** 预填的问题 */
  question?: string;
};

type FormState = {
  name: string;
  contact: string;
  category: ProductCategory | "general";
  question: string;
  consent: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  contact: "",
  category: "general",
  question: "",
  consent: false,
};

/**
 * 触发按钮 + Modal 的组合封装。
 * 页面只要放这一个组件就可以得到完整的联絡请求流程。
 */
export function ContactProfessional({
  context,
  buttonLabel = "需要持牌人士進一步解釋？",
  variant = "inline",
  className = "",
}: {
  context: ContactContext;
  buttonLabel?: string;
  variant?: "inline" | "panel" | "sidebar";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // 每次開啟時重置表單（避免上一輪資料殘留）
  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setError(null);
    setForm({
      ...EMPTY_FORM,
      category: context.category ?? "general",
      question: context.question ?? "",
    });
  }, [open, context.category, context.question]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open && ref.current) ref.current.focus();
  }, [open]);

  const trigger =
    variant === "panel" ? (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          trackEvent("contact_request_open", { from: context.from });
        }}
        className={`flex w-full items-start gap-3 rounded-xl border border-brand-200 bg-brand-50/70 p-4 text-left transition hover:border-brand-300 hover:bg-brand-50 ${className}`}
      >
        <UserCheck size={18} className="mt-0.5 shrink-0 text-brand-700" aria-hidden />
        <span>
          <span className="block text-[14px] font-semibold text-ink">
            {buttonLabel}
          </span>
          <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-soft">
            如果你希望進一步了解产品，可以选择留下联系方式，让相关持牌保险专业人士与你联系。
          </span>
        </span>
      </button>
    ) : variant === "sidebar" ? (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          trackEvent("contact_request_open", { from: context.from });
        }}
        className={`inline-flex h-9 items-center gap-1.5 rounded-md border border-brand-300 bg-white px-3 text-[13px] font-semibold text-brand-800 transition hover:bg-brand-50 ${className}`}
      >
        <UserCheck size={14} aria-hidden />
        {buttonLabel}
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          trackEvent("contact_request_open", { from: context.from });
        }}
        className={`inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-900 ${className}`}
      >
        <UserCheck size={14} aria-hidden />
        {buttonLabel}
      </button>
    );

  return (
    <>
      {trigger}
      {open && (
        <ContactModalBody
          panelRef={ref}
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
          submitted={submitted}
          setSubmitted={setSubmitted}
          context={context}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function ContactModalBody({
  panelRef,
  form,
  setForm,
  error,
  setError,
  submitted,
  setSubmitted,
  context,
  onClose,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  form: FormState;
  setForm: (f: FormState) => void;
  error: string | null;
  setError: (e: string | null) => void;
  submitted: boolean;
  setSubmitted: (b: boolean) => void;
  context: ContactContext;
  onClose: () => void;
}) {
  const contextLine = useMemo(() => {
    if (context.productNames && context.productNames.length > 0) {
      return `你正在查看：${context.productNames.join("、")}`;
    }
    return null;
  }, [context.productNames]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("請填寫姓名。");
      return;
    }
    if (!form.contact.trim()) {
      setError("請填寫 Email 或電話，方便持牌人士聯絡你。");
      return;
    }
    if (!form.consent) {
      setError("請先勾選同意條款，我們才會把你的聯絡請求轉交。");
      return;
    }
    setError(null);
    trackEvent("contact_request_submit", {
      from: context.from,
      category: form.category,
      productCount: context.productIds?.length ?? 0,
    });
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="請求持牌保險人士聯絡"
    >
      <button
        type="button"
        aria-label="關閉"
        onClick={onClose}
        className="fixed inset-0 bg-ink/45 backdrop-blur-[1px]"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-[560px] rounded-t-2xl bg-paper shadow-2xl focus:outline-none sm:rounded-2xl"
      >
        {/* 頭部 */}
        <div className="flex items-start justify-between gap-3 border-b border-ink-line bg-white px-5 py-4 sm:rounded-t-2xl">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
              <UserCheck size={12} aria-hidden />
              Contact Only
            </p>
            <h2 className="mt-1 text-[17px] font-semibold tracking-tight text-ink">
              需要持牌人士進一步解釋？
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
              如果你希望進一步了解产品，可以选择留下联系方式，让相关持牌保险专业人士与你联系。
            </p>
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
        {submitted ? (
          <div className="px-5 py-6">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-emerald-900">
                <CheckCircle2 size={15} aria-hidden />
                你的聯絡請求已記錄
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-emerald-900/90">
                Prototype：正式版本将根据用户同意，把联系请求转交适当的持牌保险专业人士。
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-[12.5px] leading-relaxed text-ink-soft">
              <li className="flex items-start gap-1.5">
                <ShieldCheck size={13} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
                平台只做轉介：合適的持牌保險人士會直接與你聯絡，並由對方了解你的實際需要。
              </li>
              <li className="flex items-start gap-1.5">
                <Ban size={13} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
                平台不會代你投保、不會收取保費、不會完成任何保險合約。所有條款與決定都在你與持牌人士之間完成。
              </li>
              <li className="flex items-start gap-1.5">
                <Lock size={13} className="mt-0.5 shrink-0 text-brand-600" aria-hidden />
                你的聯絡資料只會用於這次查詢的轉介用途。
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand-800 px-4 text-[13px] font-semibold text-white hover:bg-brand-900"
              >
                關閉
              </button>
              <a
                href="/compare"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-4 text-[13px] font-medium text-ink-soft hover:bg-paper"
              >
                回到比較頁
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="px-5 py-5">
            {/* 平台紅線聲明 */}
            <div className="rounded-lg border border-brand-200 bg-brand-50/70 px-3.5 py-2.5">
              <p className="flex items-start gap-1.5 text-[12px] font-semibold text-brand-900">
                <ShieldCheck size={13} className="mt-0.5 shrink-0" aria-hidden />
                平台不會完成保險交易
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-brand-900/80">
                這是一個諮詢轉介表單，不是投保申請。平台不會向你銷售產品、不会代你簽訂保單，
                你的資料只會被轉交給合適的持牌保險人士。
              </p>
            </div>

            {contextLine && (
              <p className="mt-3.5 rounded-lg border border-ink-line bg-white px-3.5 py-2 text-[12.5px] text-ink-soft">
                {contextLine}
              </p>
            )}

            {/* 姓名 */}
            <div className="mt-4">
              <label
                htmlFor={`cp-name-${context.from}`}
                className="block text-[12.5px] font-semibold text-ink"
              >
                姓名 <span className="text-ink-mute">（必填）</span>
              </label>
              <input
                id={`cp-name-${context.from}`}
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="陳大文"
                autoComplete="name"
                className="mt-1.5 h-10 w-full rounded-md border border-ink-line bg-white px-3 text-[13.5px] text-ink placeholder:text-ink-mute/70 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {/* Email 或電話 */}
            <div className="mt-3.5">
              <label
                htmlFor={`cp-contact-${context.from}`}
                className="block text-[12.5px] font-semibold text-ink"
              >
                Email 或電話 <span className="text-ink-mute">（必填）</span>
              </label>
              <div className="relative mt-1.5">
                <Mail
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute"
                  aria-hidden
                />
                <input
                  id={`cp-contact-${context.from}`}
                  type="text"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="you@example.com 或 9123 4567"
                  className="h-10 w-full rounded-md border border-ink-line bg-white pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-mute/70 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-mute">
                <Phone size={11} aria-hidden />
                填寫其中一項即可。
              </p>
            </div>

            {/* 保險類別 */}
            <div className="mt-3.5">
              <label
                htmlFor={`cp-category-${context.from}`}
                className="block text-[12.5px] font-semibold text-ink"
              >
                希望了解的保險類別
              </label>
              <select
                id={`cp-category-${context.from}`}
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as ProductCategory | "general",
                  })
                }
                className="mt-1.5 h-10 w-full rounded-md border border-ink-line bg-white px-3 text-[13.5px] text-ink focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 問題 */}
            <div className="mt-3.5">
              <label
                htmlFor={`cp-question-${context.from}`}
                className="block text-[12.5px] font-semibold text-ink"
              >
                希望咨询的问题
              </label>
              <textarea
                id={`cp-question-${context.from}`}
                rows={3}
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="例如：兩份醫療產品的自付額差異，對我實際的醫療開支影響有多大？"
                className="mt-1.5 w-full resize-y rounded-md border border-ink-line bg-white px-3 py-2 text-[13.5px] leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {/* Consent */}
            <div className="mt-4 rounded-lg border border-ink-line bg-white p-3.5">
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-line text-brand-700 focus:ring-2 focus:ring-brand-200"
                />
                <span className="text-[12.5px] leading-relaxed text-ink-soft">
                  我同意平台根據這次查詢，把我的聯絡方式轉交給合適的持牌保險人士與我聯絡，
                  並明白平台本身不是保險公司、不會代我投保或完成任何保險交易。
                </span>
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-800"
              >
                {error}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-1.5 rounded-md bg-brand-800 px-5 text-[13.5px] font-semibold text-white transition hover:bg-brand-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                <UserCheck size={15} aria-hidden />
                請求聯絡
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 items-center rounded-md border border-ink-line bg-white px-4 text-[13.5px] font-medium text-ink-soft transition hover:bg-paper"
              >
                取消
              </button>
              <p className="flex items-center gap-1 text-[11px] text-ink-mute">
                <FlaskConical size={11} aria-hidden />
                Prototype：不會真正發送任何資料
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
