import { Megaphone, HandCoins } from "lucide-react";

// ============================================================
// SponsoredBadge / CommercialDisclosure
// ============================================================
// 平台的一條硬規則：
//
//   付費曝光必須明確標示，而且永遠不能影響自然搜尋與比較排序。
//
// 這個元件是這個規則的 UI 落點。任何付費曝光的位置都應該掛上它，
// 讓使用者一眼看出「這是廣告，不是自然結果」。
//
// 實作上的雙重保證：
//   1. 資料層：SearchResult.resultType 分 organic / sponsored，
//      自然排序函式只處理 organic。
//   2. 呈現層：贊助結果在獨立區塊渲染，並附上說明文字。
// ============================================================

/**
 * 贊助標記。
 *
 * 文字固定是「贊助」—— 這是使用者最直接理解的說法。
 * 不使用「精選」「推薦」「熱門」這類容易被誤會為自然排序的字眼。
 */
export function SponsoredBadge({
  sponsorName,
  size = "sm",
}: {
  sponsorName?: string | null;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-1.5 py-0.5 text-[10.5px]" : "px-2 py-1 text-[11.5px]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-100 font-semibold text-amber-900 ${pad}`}
      title={
        sponsorName
          ? `此結果由 ${sponsorName} 贊助，不參與自然搜尋排序`
          : "此結果為贊助內容，不參與自然搜尋排序"
      }
    >
      <Megaphone size={size === "sm" ? 10 : 12} aria-hidden />
      贊助
      {sponsorName ? ` · ${sponsorName}` : ""}
    </span>
  );
}

/**
 * 商業關係揭露。
 *
 * 用於說明「平台如何賺錢」與「商業關係如何影響內容」。
 * 放在 Trust Center、Commercial Transparency 頁面，
 * 以及任何可能存在商業關係的內容區塊。
 */
export function CommercialDisclosure({
  variant = "inline",
  children,
}: {
  variant?: "inline" | "panel";
  children?: React.ReactNode;
}) {
  if (variant === "panel") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-900">
          <HandCoins size={15} aria-hidden />
          商業關係揭露
        </p>
        <div className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-amber-900/85">
          {children ?? (
            <>
              <p>
                平台可能透過贊助內容、Lead Referral、會員服務、B2B 資料 API
                與廣告取得收入。這些收入來源不影響自然搜尋結果與比較結果的排序。
              </p>
              <p>
                所有付費曝光都會標示「贊助」，並且在獨立區塊呈現，
                不會與自然結果混在一起。商業合作無法購買自然排名。
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-ink-mute">
      <HandCoins size={12} className="mt-0.5 shrink-0" aria-hidden />
      <span>
        {children ?? (
          <>
            此區塊可能包含贊助內容。付費曝光一律標示「贊助」，並且不影響
            自然搜尋與比較結果的排序。
          </>
        )}
      </span>
    </p>
  );
}
