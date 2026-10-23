"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Scale,
  X,
  Trash2,
  ArrowRight,
  Info,
  ArrowUpRight,
  Info as InfoIcon,
} from "lucide-react";
import { useCompare, MAX_COMPARE_ITEMS } from "@/lib/compare-context";
import { products } from "@/data/products";
import { articles } from "@/data/articles";
import type { InsuranceProduct } from "@/data/types";

type Row = {
  label: string;
  help: string;
  render: (p: InsuranceProduct) => string | null;
  numeric?: (p: InsuranceProduct) => number | null;
  higherIsBetter?: boolean;
};

const ROWS: Row[] = [
  {
    label: "保險公司",
    help: "產品所屬嘅示例保險公司。Prototype 全部品牌均為虛構。",
    render: (p) => p.insurer,
  },
  {
    label: "產品名稱",
    help: "完整產品名稱，點擊可跳去產品詳情頁。",
    render: (p) => p.name,
  },
  {
    label: "保險類別",
    help: "醫療、危疾、人壽、旅遊四大分類之一。",
    render: (p) => p.category,
  },
  {
    label: "模擬保費",
    help: "虛構年保費，用作示範排序。並非真實報價，唔代表任何人都能以該價格投保。",
    render: (p) => `HK$${p.simulatedPremium.toLocaleString("en-US")}`,
    numeric: (p) => p.simulatedPremium,
  },
  {
    label: "主要保障",
    help: "保障範圍摘要，詳情請參考產品詳情頁嘅保障表格。",
    render: (p) => p.termPoints.coverageScope.slice(0, 3).join("；"),
  },
  {
    label: "保障上限",
    help: "模擬保障金額。總額可能設有分項上限，實際可賠金額視乎個別項目。",
    render: (p) => p.coverageLimitLabel,
    numeric: (p) => p.coverageLimit,
    higherIsBetter: true,
  },
  {
    label: "自付額",
    help: "保險公司計算賠償前由投保人自行承擔嘅金額。計法（每次／每年／終身）會直接影響實際成本。",
    render: (p) => p.deductible,
  },
  {
    label: "等候期",
    help: "保單生效後、可以正式索償之前嘅時間。意外通常有豁免，但只針對非意外引致嘅疾病。",
    render: (p) => p.waitingPeriod,
  },
  {
    label: "續保條件",
    help: "續保是否需要審批、保費會否固定年期不變。續保時公司可能調整保費、自付額同保障上限。",
    render: (p) => p.renewalTerms,
  },
  {
    label: "主要限制",
    help: "需要特別留意嘅條款，例如除外責任、非指定提供者或已達上限嘅分項。",
    render: (p) => p.termPoints.exclusions.slice(0, 3).join("；"),
  },
];

export function CompareView() {
  const { ids, count, remove, clear } = useCompare();
  const [openHelp, setOpenHelp] = useState<string | null>(null);

  const selected = useMemo(
    () => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as InsuranceProduct[],
    [ids]
  );

  const insights = useMemo(() => buildInsights(selected), [selected]);

  if (count < 2) {
    return (
      <div className="container-page py-10">
        <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
          <Link href="/" className="hover:text-brand-700">
            首頁
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink-soft">產品比較</span>
        </nav>

        <header className="mt-3">
          <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">產品比較</h1>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
            將兩至三個模擬產品並排對照，直接睇到保障上限、自付額、等候期同續保條件嘅差異。
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-dashed border-ink-line bg-white p-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <Scale size={24} />
          </span>
          <p className="mt-4 text-[16px] font-semibold text-ink">
            請加入至少兩個產品，開始比較保障內容。
          </p>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-ink-soft">
            你可以喺產品列表或產品詳情頁按「加入比較」，最多可以同時比較 {MAX_COMPARE_ITEMS} 個產品。
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-brand-800 px-4 text-[13.5px] font-semibold text-white hover:bg-brand-900"
            >
              返回產品列表繼續選擇
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/products?category=醫療保險"
              className="inline-flex h-10 items-center rounded-md border border-ink-line bg-white px-4 text-[13.5px] font-semibold text-ink-soft hover:bg-paper"
            >
              由醫療保險開始
            </Link>
          </div>
        </div>

        {count === 1 && selected[0] && (
          <div className="mt-6">
            <h2 className="text-[15px] font-semibold text-ink">已經加入</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-accent-600 bg-accent-50 px-3 py-1.5 text-[13px] text-accent-800">
                {selected[0].name}
                <button
                  type="button"
                  onClick={() => remove(selected[0].id)}
                  className="text-accent-700 hover:text-ink"
                  aria-label="移除"
                >
                  <X size={14} />
                </button>
              </span>
            </div>
            <p className="mt-3 text-[12.5px] text-ink-mute">
              再加多一個產品就可以開始比較。
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">產品比較</span>
      </nav>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">產品比較</h1>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
            正在比較 {count} 個模擬產品。表格內容全部來自本地模擬資料，差異說明只作客觀數據整理。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/products"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 text-[13px] font-medium text-ink-soft hover:bg-paper"
          >
            返回產品列表
          </Link>
          <button
            type="button"
            onClick={clear}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-line bg-white px-3.5 text-[13px] font-medium text-ink-soft hover:bg-paper"
          >
            <Trash2 size={14} />
            清除全部
          </button>
        </div>
      </header>

      {/* Selected chips */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {selected.map((p) => (
          <span
            key={p.id}
            className="inline-flex items-center gap-2 rounded-md border border-brand-200 bg-brand-50 px-3 py-1.5 text-[12.5px] text-brand-800"
          >
            <span className="font-medium">{p.name}</span>
            <button
              type="button"
              onClick={() => remove(p.id)}
              className="text-brand-600 hover:text-ink"
              aria-label={`移除 ${p.name}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
        {count < MAX_COMPARE_ITEMS && (
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-ink-line px-3 py-1.5 text-[12.5px] font-medium text-ink-mute hover:border-brand-300 hover:text-brand-700"
          >
            + 加入更多（最多 {MAX_COMPARE_ITEMS} 個）
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-ink-line bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink-line bg-paper">
              <th className="sticky left-0 z-10 w-[168px] bg-paper px-4 py-3.5 text-[12.5px] font-semibold text-ink">
                比較欄位
              </th>
              {selected.map((p) => (
                <th key={p.id} className="min-w-[220px] px-4 py-3.5 align-top">
                  <span className="block text-[11.5px] font-medium text-ink-mute">{p.insurer}</span>
                  <Link
                    href={`/products/${p.id}`}
                    className="group mt-0.5 flex items-start gap-1 text-[14px] font-semibold leading-snug text-ink hover:text-brand-700"
                  >
                    {p.name}
                    <ArrowUpRight size={14} className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                  <span className="mt-1.5 inline-block rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-700">
                    {p.category}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const values = selected.map((p) => row.render(p));
              const distinct = new Set(values.filter((v) => v !== null)).size > 1;
              return (
                <tr key={row.label} className="border-b border-ink-line/70 align-top last:border-b-0">
                  <th className="sticky left-0 z-10 bg-white px-4 py-3.5 text-left align-top">
                    <span className="flex items-center gap-1 text-[13px] font-semibold text-ink">
                      {row.label}
                      <button
                        type="button"
                        onClick={() => setOpenHelp(openHelp === row.label ? null : row.label)}
                        className="text-ink-mute hover:text-brand-700"
                        aria-label={`了解 ${row.label}`}
                      >
                        <InfoIcon size={13} />
                      </button>
                    </span>
                    {openHelp === row.label && (
                      <span className="mt-2 block rounded-md border border-brand-100 bg-brand-50 p-2.5 text-[11.5px] font-normal leading-relaxed text-brand-900">
                        {row.help}
                      </span>
                    )}
                  </th>
                  {values.map((v, i) => (
                    <td key={selected[i].id + row.label} className="px-4 py-3.5">
                      {v === null || v === "" ? (
                        <span className="text-[13px] text-ink-mute">資料未提供</span>
                      ) : (
                        <span
                          className={`text-[13px] leading-relaxed ${
                            distinct ? "font-medium text-ink" : "text-ink-soft"
                          }`}
                        >
                          {v}
                        </span>
                      )}
                      {distinct && (
                        <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent-500 align-middle" />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11.5px] text-ink-mute">
        小提示：手機版可以左右滑動表格查看全部欄位。綠色圓點代表該欄位喺不同產品之間存在差異。
      </p>

      {/* Insights */}
      <section className="mt-10">
        <h2 className="text-[20px] font-semibold tracking-tight text-ink">這些產品有什麼不同？</h2>
        <p className="mt-1.5 max-w-3xl text-[13.5px] leading-relaxed text-ink-soft">
          以下內容由系統根據模擬資料客觀整理，只描述數據差異，唔構成推薦或購買建議。
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {insights.map((ins) => (
            <div key={ins.title} className="rounded-xl border border-ink-line bg-white p-5">
              <h3 className="flex items-center gap-1.5 text-[14.5px] font-semibold text-ink">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-accent-50 text-accent-700">
                  <ins.icon size={13} />
                </span>
                {ins.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {ins.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[13px] leading-relaxed text-ink-soft">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-line" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-amber-900">
            <Info size={14} className="mt-0.5 shrink-0" />
            <span>
              本平台不會給出「最適合你」、「一定最好」或「保證最划算」等結論。實際選擇需要考慮你的健康狀況、預算、
              現有保障同埋對風險嘅承受能力，並且以保單條款為準。
            </span>
          </p>
        </div>
      </section>

      {/* Related reading */}
      <section className="mt-10">
        <h2 className="text-[18px] font-semibold tracking-tight text-ink">比較前可以先了解</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <Link
              key={a.slug}
              href={`/learn/${a.slug}`}
              className="group rounded-lg border border-ink-line bg-white p-4 hover:border-brand-300 hover:bg-brand-50/40"
            >
              <span className="text-[11.5px] font-medium text-brand-700">{a.category}</span>
              <span className="mt-1 block text-[14px] font-medium text-ink group-hover:text-brand-700">
                {a.title}
              </span>
              <span className="mt-1.5 block text-[12px] text-ink-mute">
                閱讀 {a.readingMinutes} 分鐘
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function buildInsights(selected: InsuranceProduct[]) {
  if (selected.length === 0) return [];
  const insights: {
    title: string;
    icon: typeof Info;
    points: string[];
  }[] = [];

  // 保障上限
  const limits = selected
    .map((p) => ({ p, v: p.coverageLimit }))
    .filter((x) => x.v > 0);
  if (limits.length) {
    const max = limits.reduce((a, b) => (a.v >= b.v ? a : b));
    const min = limits.reduce((a, b) => (a.v <= b.v ? a : b));
    const points: string[] = [];
    if (max.v !== min.v) {
      points.push(
        `模擬保障上限最高的是 ${max.p.name}（${max.p.coverageLimitLabel}）；最低的是 ${min.p.name}（${min.p.coverageLimitLabel}）。`
      );
      points.push(
        `保障上限相差 ${(max.v - min.v).toLocaleString("en-US")} 港元（以模擬數據計算），但實際可賠金額仍受分項上限、自付額及報銷百分比限制。`
      );
    } else {
      points.push("各產品的模擬保障上限相同。");
    }
    insights.push({ title: "保障上限差異", icon: Info, points });
  }

  // 自付額
  const deductibles = new Map(selected.map((p) => [p.deductible, p.name]));
  if (deductibles.size > 1) {
    insights.push({
      title: "自付額差異",
      icon: Info,
      points: Array.from(deductibles.entries()).map(
        ([d, name]) => `${name} 的模擬自付額設定為 ${d}。`
      ),
    });
  } else {
    insights.push({
      title: "自付額",
      icon: Info,
      points: ["各產品的模擬自付額設定相同。"],
    });
  }

  // 續保
  const renewals = new Map(selected.map((p) => [p.renewalTerms, p.name]));
  if (renewals.size > 1) {
    insights.push({
      title: "續保條件差異",
      icon: Info,
      points: Array.from(renewals.entries()).map(
        ([r, name]) => `${name}：${r}`
      ),
    });
  } else {
    insights.push({
      title: "續保條件",
      icon: Info,
      points: ["各產品的模擬續保條件相同。"],
    });
  }

  // 保障限制
  const limitPoints = selected.map((p) => {
    const first = p.termPoints.exclusions[0];
    return `${p.name} 的主要限制包括：${p.termPoints.exclusions.join("、")}。`;
  });
  insights.push({
    title: "重要保障限制",
    icon: Info,
    points: limitPoints,
  });

  // 等候期
  const waits = new Map(selected.map((p) => [p.waitingPeriod, p.name]));
  if (waits.size > 1) {
    insights.push({
      title: "等候期差異",
      icon: Info,
      points: Array.from(waits.entries()).map(([w, name]) => `${name}：${w}`),
    });
  }

  // 保費
  const prem = selected.map((p) => p.simulatedPremium);
  const pMax = Math.max(...prem);
  const pMin = Math.min(...prem);
  const pMaxName = selected.find((p) => p.simulatedPremium === pMax)!.name;
  const pMinName = selected.find((p) => p.simulatedPremium === pMin)!.name;
  insights.push({
    title: "模擬保費差異",
    icon: Info,
    points: [
      `模擬保費最高：${pMaxName}（HK$${pMax.toLocaleString("en-US")}）；最低：${pMinName}（HK$${pMin.toLocaleString("en-US")}）。`,
      "以上為 Prototype 虛構數字，排序及金額唔代表真實香港保險市場的價格水平。",
    ],
  });

  return insights;
}
