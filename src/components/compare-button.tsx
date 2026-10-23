"use client";

import { useState } from "react";
import { Scale, Check, Plus, Info } from "lucide-react";
import { useCompare, MAX_COMPARE_ITEMS } from "@/lib/compare-context";
import type { InsuranceProduct } from "@/data/types";

export function CompareButton({
  product,
  variant = "outline",
  showCount = true,
}: {
  product: InsuranceProduct;
  variant?: "outline" | "solid" | "ghost";
  showCount?: boolean;
}) {
  const { has, add, remove, count, isFull } = useCompare();
  const [msg, setMsg] = useState<string | null>(null);
  const inList = has(product.id);

  function handle() {
    if (inList) {
      remove(product.id);
      setMsg("已從比較清單移除");
    } else {
      const r = add(product.id);
      if (r === "full") {
        setMsg(`比較清單最多 ${MAX_COMPARE_ITEMS} 個產品，請先移除一個`);
      } else if (r === "exists") {
        setMsg("產品已在比較清單中");
      } else {
        setMsg("已加入比較清單");
      }
    }
    window.setTimeout(() => setMsg(null), 2600);
  }

  const base =
    "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors";
  const styles =
    variant === "solid"
      ? "bg-brand-800 text-white hover:bg-brand-900"
      : variant === "ghost"
        ? "text-ink-soft hover:bg-paper hover:text-brand-700"
        : inList
          ? "border border-accent-600 bg-accent-50 text-accent-800 hover:bg-accent-100"
          : "border border-ink-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700";

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" onClick={handle} className={`${base} ${styles}`}>
        {inList ? <Check size={15} /> : <Scale size={15} />}
        {inList ? "已在比較清單" : "加入比較"}
        {showCount && !inList && isFull && (
          <span className="text-[11px] opacity-70">（{count}/{MAX_COMPARE_ITEMS}）</span>
        )}
      </button>
      {msg && (
        <span className="flex items-center gap-1 text-[11px] text-ink-mute">
          <Info size={11} /> {msg}
        </span>
      )}
    </span>
  );
}
