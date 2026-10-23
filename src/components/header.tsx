"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Search, Scale, ChevronRight } from "lucide-react";
import { Logo } from "./logo";
import { navItems, site } from "@/lib/site";
import { useCompare } from "@/lib/compare-context";
import { GlobalSearchDialog } from "./global-search";

export function Header() {
  const pathname = usePathname();
  const { count } = useCompare();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="hidden bg-brand-950 text-white/85 text-[12px] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <p className="truncate">
            Prototype 演示網站：所有產品、條款及保費均為虛構模擬資料，並非真實報價。
          </p>
          <Link href="/transparency" className="ml-4 shrink-0 underline-offset-2 hover:underline">
            了解資料整理方式
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-ink-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-brand-800 bg-brand-50"
                      : "text-ink-soft hover:text-brand-700 hover:bg-paper"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-md border border-ink-line text-ink-soft hover:bg-paper hover:text-brand-700 transition-colors"
              aria-label="開啟全站搜尋"
            >
              <Search className="h-4.5 w-4.5" size={18} />
            </button>

            <Link
              href="/compare"
              className="relative hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line px-3 text-sm font-medium text-ink-soft hover:bg-paper hover:text-brand-700 transition-colors"
            >
              <Scale size={16} />
              比較
              {count > 0 && (
                <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>

            <Link
              href="/products"
              className="hidden md:inline-flex h-9 items-center gap-1 rounded-md bg-brand-800 px-3.5 text-sm font-semibold text-white hover:bg-brand-900 transition-colors"
            >
              開始比較
              <ChevronRight size={15} />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden grid h-9 w-9 place-items-center rounded-md border border-ink-line text-ink-soft"
              aria-label={menuOpen ? "關閉選單" : "開啟選單"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-ink-line bg-white">
            <nav className="mx-auto max-w-7xl px-4 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-3 text-sm font-medium text-ink-soft hover:bg-paper"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-ink-line pt-3">
                <Link
                  href="/compare"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-ink-line text-sm font-medium text-ink-soft"
                >
                  <Scale size={16} />
                  比較清單（{count}）
                </Link>
                <Link
                  href="/products"
                  className="inline-flex h-10 items-center justify-center gap-1 rounded-md bg-brand-800 text-sm font-semibold text-white"
                >
                  開始比較
                  <ChevronRight size={15} />
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <GlobalSearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
