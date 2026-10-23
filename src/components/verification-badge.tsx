"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, CircleDashed, FlaskConical, Info } from "lucide-react";
import type { VerificationStatus } from "@/data/types";
import { VERIFICATION_LABELS, VERIFICATION_DESCRIPTIONS } from "@/data/types";

// ============================================================
// 核實徽章 (Verification Badge)
// ============================================================
// 四個狀態：已核實 / 部分核實 / 尚未核實 / 原型模擬資料
// 點擊可展開解釋，讓讀者知道「這個狀態代表甚麼」。
// 這是 V2 最重要的信任設計：平台主動暴露自己的不確定性。
// ============================================================

const STYLES: Record<
  VerificationStatus,
  { badge: string; icon: typeof ShieldCheck; ring: string }
> = {
  verified: {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: ShieldCheck,
    ring: "border-emerald-200",
  },
  partially_verified: {
    badge: "bg-amber-50 text-amber-900 border-amber-200",
    icon: ShieldAlert,
    ring: "border-amber-200",
  },
  unverified: {
    badge: "bg-slate-100 text-slate-700 border-slate-300",
    icon: CircleDashed,
    ring: "border-slate-300",
  },
  demo: {
    badge: "bg-violet-50 text-violet-800 border-violet-200",
    icon: FlaskConical,
    ring: "border-violet-200",
  },
};

export function VerificationBadge({
  status,
  lastReviewedAt,
  unverifiedFields,
  size = "md",
  expandable = true,
}: {
  status: VerificationStatus;
  lastReviewedAt?: string;
  unverifiedFields?: string[];
  size?: "sm" | "md";
  expandable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const style = STYLES[status];
  const Icon = style.icon;
  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  const badge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${style.badge} ${pad}`}
    >
      <Icon size={size === "sm" ? 12 : 14} aria-hidden />
      {VERIFICATION_LABELS[status]}
    </span>
  );

  if (!expandable) {
    return (
      <span title={VERIFICATION_DESCRIPTIONS[status]}>{badge}</span>
    );
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1 rounded-full ${style.ring} focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1`}
      >
        {badge}
      </button>
      {open && (
        <span className="absolute left-0 top-full z-30 mt-2 block w-72 rounded-lg border border-ink-line bg-white p-3 text-[13px] leading-relaxed text-ink-soft shadow-lg">
          <span className="mb-1 flex items-center gap-1.5 font-semibold text-ink">
            <Info size={13} aria-hidden />
            {VERIFICATION_LABELS[status]}的意思
          </span>
          {VERIFICATION_DESCRIPTIONS[status]}
          {lastReviewedAt && (
            <span className="mt-1.5 block text-[12px] text-ink-mute">
              最後檢視日期：{lastReviewedAt}
            </span>
          )}
          {unverifiedFields && unverifiedFields.length > 0 && (
            <span className="mt-1.5 block text-[12px] text-ink-mute">
              尚未核實欄位：{unverifiedFields.join("、")}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
