"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X, ChevronDown, Search, PackageSearch } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import type { InsuranceCategory } from "@/data/types";

const CATEGORIES: InsuranceCategory[] = ["醫療保險", "危疾保險", "人壽保險", "旅遊保險"];
const INSURERS = Array.from(new Set(products.map((p) => p.insurer))).sort();
const FEATURES = Array.from(new Set(products.flatMap((p) => p.features))).sort();

const PREMIUM_BANDS = [
  { id: "any", label: "任何模擬保費", min: 0, max: Infinity },
  { id: "u3000", label: "HK$3,000 以下", min: 0, max: 3000 },
  { id: "3000-6000", label: "HK$3,000 – 6,000", min: 3000, max: 6000 },
  { id: "6000p", label: "HK$6,000 以上", min: 6000, max: Infinity },
];

type SortKey = "name" | "premium-asc" | "premium-desc";

export function ProductExplorer({ initialCategory }: { initialCategory?: string }) {
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState<string[]>(
    initialCategory && CATEGORIES.includes(initialCategory as InsuranceCategory)
      ? [initialCategory]
      : []
  );
  const [insurers, setInsurers] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [band, setBand] = useState("any");
  const [comparableOnly, setComparableOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("name");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const b = PREMIUM_BANDS.find((x) => x.id === band)!;
    const kw = keyword.trim().toLowerCase();
    const list = products.filter((p) => {
      if (categories.length && !categories.includes(p.category)) return false;
      if (insurers.length && !insurers.includes(p.insurer)) return false;
      if (features.length && !features.some((f) => p.features.includes(f))) return false;
      if (p.simulatedPremium < b.min || p.simulatedPremium > b.max) return false;
      if (comparableOnly && !p.keyFeatures.length) return false;
      if (kw) {
        const hay = `${p.name} ${p.insurer} ${p.category} ${p.coverageSummary} ${p.keyFeatures.join(" ")} ${p.exclusions.join(" ")}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });

    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b2) => a.name.localeCompare(b2.name, "zh-HK"));
    if (sort === "premium-asc") sorted.sort((a, b2) => a.simulatedPremium - b2.simulatedPremium);
    if (sort === "premium-desc") sorted.sort((a, b2) => b2.simulatedPremium - a.simulatedPremium);
    return sorted;
  }, [keyword, categories, insurers, features, band, comparableOnly, sort]);

  const activeCount =
    categories.length + insurers.length + features.length + (band !== "any" ? 1 : 0) + (comparableOnly ? 1 : 0);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function clearAll() {
    setCategories([]);
    setInsurers([]);
    setFeatures([]);
    setBand("any");
    setComparableOnly(false);
    setKeyword("");
  }

  const filterPanel = (
    <div className="space-y-6">
      <FilterGroup title="保險種類">
        {CATEGORIES.map((c) => (
          <CheckRow
            key={c}
            label={c}
            checked={categories.includes(c)}
            onChange={() => toggle(categories, c, setCategories)}
            count={products.filter((p) => p.category === c).length}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="保險公司（示例品牌）">
        {INSURERS.map((i) => (
          <CheckRow
            key={i}
            label={i}
            checked={insurers.includes(i)}
            onChange={() => toggle(insurers, i, setInsurers)}
            count={products.filter((p) => p.insurer === i).length}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="產品特色">
        {FEATURES.map((f) => (
          <CheckRow
            key={f}
            label={f}
            checked={features.includes(f)}
            onChange={() => toggle(features, f, setFeatures)}
            count={products.filter((p) => p.features.includes(f)).length}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="模擬保費區間">
        <div className="space-y-2">
          {PREMIUM_BANDS.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-soft">
              <input
                type="radio"
                name="band"
                checked={band === b.id}
                onChange={() => setBand(b.id)}
                className="h-4 w-4 accent-[#234570]"
              />
              {b.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="比較功能">
        <CheckRow
          label="可加入比較清單"
          checked={comparableOnly}
          onChange={() => setComparableOnly((v) => !v)}
          count={products.length}
        />
        <p className="text-[11.5px] leading-relaxed text-ink-mute">
          所有模擬產品均可加入比較清單，最多同時比較 3 個。
        </p>
      </FilterGroup>
    </div>
  );

  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">保險產品</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">
          香港保險產品資料庫
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
          瀏覽不同保障類型，了解產品特色及主要條款。全部條目均為 Prototype 模擬資料。
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Filters */}
        <aside className="lg:w-64 lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between rounded-t-xl border border-ink-line bg-white px-4 py-3">
              <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
                <SlidersHorizontal size={15} /> 篩選
                {activeCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-800 px-1 text-[11px] font-semibold text-white">
                    {activeCount}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-brand-700 hover:underline"
                  >
                    <X size={12} /> 清除
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  className="lg:hidden inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-soft"
                >
                  {filtersOpen ? "收起" : "展開"}
                  <ChevronDown size={14} className={filtersOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>
              </div>
            </div>

            <div className={`${filtersOpen ? "block" : "hidden"} lg:block rounded-b-xl border border-t-0 border-ink-line bg-white px-4 py-5`}>
              {filterPanel}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜尋產品名稱或保障內容"
                className="h-10 w-full rounded-md border border-ink-line bg-white pl-9 pr-3 text-[13.5px] outline-none focus:border-brand-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-[12.5px] text-ink-mute">
                排序
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 rounded-md border border-ink-line bg-white px-3 text-[13px] outline-none focus:border-brand-400"
              >
                <option value="name">產品名稱</option>
                <option value="premium-asc">模擬保費由低至高</option>
                <option value="premium-desc">模擬保費由高至低</option>
              </select>
            </div>
          </div>

          <p className="mt-2 text-[12px] text-ink-mute">
            模擬保費排序只反映 Prototype 資料，並不代表真實市場的價格排名。
          </p>

          {activeCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {[...categories.map((c) => ["種類", c] as const),
                ...insurers.map((i) => ["公司", i] as const),
                ...features.map((f) => ["特色", f] as const),
                ...(band !== "any" ? ([["保費", PREMIUM_BANDS.find((b) => b.id === band)!.label]] as const) : []),
                ...(comparableOnly ? ([["可比較", "可加入比較清單"]] as const) : []),
              ].map(([kind, val]) => (
                <span
                  key={kind + val}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[12px] text-brand-800"
                >
                  <span className="text-brand-600">{kind}</span>
                  {val}
                </span>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-ink-mute hover:text-brand-700"
              >
                <X size={12} /> 清除全部篩選
              </button>
            </div>
          )}

          <p className="mt-4 text-[13px] text-ink-soft">
            找到 <span className="font-semibold text-ink">{filtered.length}</span> 個產品
          </p>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-ink-line bg-white p-12 text-center">
              <PackageSearch size={30} className="mx-auto text-ink-mute" />
              <p className="mt-3 text-[15px] font-medium text-ink">沒有符合條件的產品</p>
              <p className="mt-1.5 text-[13px] text-ink-mute">
                試下放寬篩選條件，或者清除全部篩選重新開始。
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 inline-flex h-9 items-center rounded-md bg-brand-800 px-4 text-[13px] font-semibold text-white hover:bg-brand-900"
              >
                清除全部篩選
              </button>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-ink-mute">{title}</h3>
      <div className="mt-2.5 space-y-2">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-soft hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-ink-line accent-[#234570]"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-[11.5px] text-ink-mute">{count}</span>}
    </label>
  );
}
