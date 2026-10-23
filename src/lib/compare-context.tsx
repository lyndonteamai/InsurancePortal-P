"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "ic-compare-list";
const MAX_ITEMS = 3;

type CompareContextValue = {
  ids: string[];
  count: number;
  isFull: boolean;
  has: (id: string) => boolean;
  add: (id: string) => "added" | "exists" | "full";
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setIds(parsed.filter((v) => typeof v === "string").slice(0, MAX_ITEMS));
        }
      }
    } catch {
      /* 忽略讀取失敗，使用空清單 */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* 忽略寫入失敗 */
    }
  }, [ids, hydrated]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const add = useCallback<CompareContextValue["add"]>(
    (id) => {
      let result: "added" | "exists" | "full" = "added";
      setIds((prev) => {
        if (prev.includes(id)) {
          result = "exists";
          return prev;
        }
        if (prev.length >= MAX_ITEMS) {
          result = "full";
          return prev;
        }
        return [...prev, id];
      });
      return result;
    },
    []
  );

  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((v) => v !== id));
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : prev.length >= MAX_ITEMS ? prev : [...prev, id]
    );
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      isFull: ids.length >= MAX_ITEMS,
      has,
      add,
      remove,
      toggle,
      clear,
    }),
    [ids, has, add, remove, toggle, clear]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export const MAX_COMPARE_ITEMS = MAX_ITEMS;

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare 必須在 CompareProvider 內使用");
  return ctx;
}
