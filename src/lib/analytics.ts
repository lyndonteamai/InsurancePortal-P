// ============================================================
// 分析事件抽象層 (Analytics Abstraction)
// ============================================================
// 目標：頁面只呼叫 trackEvent("event_name", payload)，
// 底下換成任何分析服務都不需要改動頁面。
// Prototype 階段：只寫入 console 與 localStorage（供 /admin-preview 查看）。
// ============================================================

export type AnalyticsEventName =
  | "search"
  | "search_submit"
  | "product_view"
  | "compare_add"
  | "compare_remove"
  | "compare_view"
  | "dictionary_view"
  | "article_view"
  | "hub_view"
  | "ask_submit"
  | "insurer_view"
  | "report_issue"
  | "conversion_click";

export type AnalyticsPayload = Record<string, string | number | boolean | null>;

const STORAGE_KEY = "ic-analytics-events";
const MAX_EVENTS = 200;

type AnalyticsEvent = {
  name: AnalyticsEventName;
  payload: AnalyticsPayload;
  ts: string;
  path: string;
};

function readEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnalyticsEvent[];
  } catch {
    return [];
  }
}

function writeEvents(events: AnalyticsEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // localStorage 不可用時靜默忽略，不影響功能
  }
}

/**
 * 記錄一個事件。
 * Prototype 階段的行為：console.debug + localStorage 緩存。
 */
export function trackEvent(
  name: AnalyticsEventName,
  payload: AnalyticsPayload = {},
): void {
  if (typeof window === "undefined") return;
  const event: AnalyticsEvent = {
    name,
    payload,
    ts: new Date().toISOString(),
    path: window.location.pathname,
  };
  const events = [...readEvents(), event];
  writeEvents(events);
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${name}`, payload);
  }
}

/** 供 /admin-preview 讀取事件記錄 */
export function getAnalyticsEvents(): AnalyticsEvent[] {
  return readEvents().reverse();
}

export function clearAnalyticsEvents(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** 事件說明（供 admin 頁面顯示） */
export const ANALYTICS_EVENT_LABELS: Record<AnalyticsEventName, string> = {
  search: "全站搜尋",
  search_submit: "提交搜尋關鍵字",
  product_view: "產品頁瀏覽",
  compare_add: "加入比較清單",
  compare_remove: "移出比較清單",
  compare_view: "檢視比較結果",
  dictionary_view: "術語頁瀏覽",
  article_view: "文章瀏覽",
  hub_view: "主題頁瀏覽",
  ask_submit: "提交問題",
  insurer_view: "保險公司頁瀏覽",
  report_issue: "回報資料問題",
  conversion_click: "點擊轉介連結",
};
