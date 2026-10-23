"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ClipboardList,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Plane,
  HelpCircle,
  Coins,
  FileText,
  RefreshCw,
  BookOpen,
  Scale,
  Info,
  RotateCcw,
} from "lucide-react";
import { articles } from "@/data/articles";
import { products } from "@/data/products";
import { CompareButton } from "@/components/compare-button";

type Option = { id: string; label: string; desc?: string };

const STEP1: Option[] = [
  { id: "medical", label: "醫療保險", desc: "住院、門診、慢病管理等醫療費用" },
  { id: "critical", label: "危疾保險", desc: "符合疾病定義後提供保障金" },
  { id: "life", label: "人壽保險", desc: "身故保障及非保證儲蓄成分" },
  { id: "travel", label: "旅遊保險", desc: "短期旅程嘅醫療及行程保障" },
  { id: "unsure", label: "尚未確定", desc: "先了解不同保險的分別" },
];

const STEP2: Option[] = [
  { id: "coverage", label: "保障範圍", desc: "邊啲情況會受保" },
  { id: "budget", label: "保費預算", desc: "每年可以承擔幾多支出" },
  { id: "terms", label: "條款及限制", desc: "除外責任同自付額" },
  { id: "renewal", label: "續保條件", desc: "保障可以持續幾耐" },
  { id: "understand", label: "理解不同保險的分別", desc: "醫療、危疾、人壽有咩唔同" },
];

const STEP3: Option[] = [
  { id: "basics", label: "保險入門" },
  { id: "compare", label: "產品比較" },
  { id: "terms", label: "條款解釋" },
  { id: "faq", label: "常見問題" },
];

const CATEGORY_ICON: Record<string, typeof Stethoscope> = {
  medical: Stethoscope,
  critical: HeartPulse,
  life: ShieldCheck,
  travel: Plane,
  unsure: HelpCircle,
};

const FOCUS_ICON: Record<string, typeof Coins> = {
  coverage: FileText,
  budget: Coins,
  terms: FileText,
  renewal: RefreshCw,
  understand: BookOpen,
};

const TOPIC_ICON: Record<string, typeof BookOpen> = {
  basics: BookOpen,
  compare: Scale,
  terms: FileText,
  faq: HelpCircle,
};

export function NeedsWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);

  const questions = [STEP1, STEP2, STEP3];
  const current = questions[step];
  const selected = answers[step];

  const result = useMemo(() => buildResult(answers), [answers]);

  function choose(id: string) {
    setAnswers((a) => ({ ...a, [step]: id }));
  }

  function next() {
    if (!selected) return;
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function back() {
    if (done) {
      setDone(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  if (done && result) {
    return (
      <div className="container-page py-10">
        <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
          <Link href="/" className="hover:text-brand-700">
            首頁
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink-soft">保險需求分析</span>
        </nav>

        <header className="mt-3">
          <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">需求分析結果</h1>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
            以下係根據你嘅選擇整理嘅資訊導航建議，只提供一般保險知識同閱讀方向，唔代表你一定需要購買任何產品。
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-5">
            {/* 選擇摘要 */}
            <section className="rounded-xl border border-ink-line bg-white p-5">
              <h2 className="text-[16px] font-semibold text-ink">你嘅選擇</h2>
              <dl className="mt-3 space-y-2.5">
                {[
                  ["保障類型", result.categoryLabel],
                  ["最重視", result.focusLabel],
                  ["希望了解", result.topicLabel],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-wrap items-center gap-2 border-b border-ink-line/60 pb-2.5 last:border-b-0 last:pb-0">
                    <dt className="w-24 text-[12.5px] text-ink-mute">{k}</dt>
                    <dd className="text-[14px] font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* 需要進一步理解 */}
            <section className="rounded-xl border border-ink-line bg-white p-5">
              <h2 className="text-[16px] font-semibold text-ink">需要進一步理解的保障項目</h2>
              <ul className="mt-3 space-y-2">
                {result.concepts.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-soft">
                    <Check size={15} className="mt-0.5 shrink-0 text-accent-600" />
                    {c}
                  </li>
                ))}
              </ul>
            </section>

            {/* 建議比較條款 */}
            <section className="rounded-xl border border-ink-line bg-white p-5">
              <h2 className="text-[16px] font-semibold text-ink">建議比較的條款</h2>
              <ul className="mt-3 space-y-2">
                {result.termsToCompare.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-soft">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </section>

            {/* 文章 */}
            <section className="rounded-xl border border-ink-line bg-white p-5">
              <h2 className="text-[16px] font-semibold text-ink">可以閱讀的知識文章</h2>
              <ul className="mt-3 space-y-2">
                {result.articles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/learn/${a.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-ink-line px-4 py-3 hover:border-brand-300 hover:bg-brand-50/40"
                    >
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-medium text-ink group-hover:text-brand-700">
                          {a.title}
                        </span>
                        <span className="mt-0.5 block text-[11.5px] text-ink-mute">
                          {a.category} · 閱讀 {a.readingMinutes} 分鐘
                        </span>
                      </span>
                      <ArrowRight size={15} className="shrink-0 text-ink-mute group-hover:text-brand-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* 產品 */}
            <section className="rounded-xl border border-ink-line bg-white p-5">
              <h2 className="text-[16px] font-semibold text-ink">可以進入的產品比較</h2>
              <p className="mt-1.5 text-[12.5px] text-ink-mute">
                呢啲係同你選擇相關嘅模擬產品，可以加入比較清單對照條款。
              </p>
              <ul className="mt-3 space-y-2">
                {result.products.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-line px-4 py-3"
                  >
                    <Link href={`/products/${p.id}`} className="min-w-0 group">
                      <span className="block text-[13.5px] font-medium text-ink group-hover:text-brand-700">
                        {p.name}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] text-ink-mute">
                        {p.insurer} · 模擬保費 HK${p.simulatedPremium.toLocaleString("en-US")} ·{" "}
                        {p.coverageLimitLabel}
                      </span>
                    </Link>
                    <span className="flex items-center gap-2">
                      <CompareButtonFor productId={p.id} />
                      <Link
                        href="/compare"
                        className="inline-flex h-8 items-center gap-1 rounded-md bg-brand-800 px-2.5 text-[12.5px] font-semibold text-white hover:bg-brand-900"
                      >
                        比較
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <div className="rounded-xl border border-ink-line bg-white p-5">
              <h2 className="text-[14px] font-semibold text-ink">下一步</h2>
              <ul className="mt-3 space-y-2 text-[13px] text-ink-soft">
                <li className="flex items-start gap-1.5">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-500" />
                  <Link href="/compare" className="hover:text-brand-700 hover:underline">
                    前往產品比較頁
                  </Link>
                </li>
                <li className="flex items-start gap-1.5">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-500" />
                  <Link href="/learn" className="hover:text-brand-700 hover:underline">
                    瀏覽保險知識中心
                  </Link>
                </li>
                <li className="flex items-start gap-1.5">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-500" />
                  <Link href="/products" className="hover:text-brand-700 hover:underline">
                    返回產品資料庫
                  </Link>
                </li>
              </ul>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-ink-line text-[13px] font-medium text-ink-soft hover:bg-paper"
                >
                  <ArrowLeft size={14} /> 上一步
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-ink-line px-3 text-[13px] font-medium text-ink-soft hover:bg-paper"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-ink-line bg-paper p-5">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                <Info size={14} className="text-brand-600" /> 分析說明
              </h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
                結果係根據你揀嘅三個選項，用固定規則對應到產品、條款同文章。佢唔會判斷你「需要」邊個產品，
                亦唔會收集任何個人或健康資料。
              </p>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  const Icon = step === 0 ? ClipboardList : step === 1 ? Coins : BookOpen;

  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">保險需求分析</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">保險需求分析</h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
          用四步了解你想知啲咩，再話你知可以先睇邊啲資料。呢個工具唔會推銷任何產品，亦唔會收集你嘅個人或健康資料。
        </p>
      </header>

      {/* Steps indicator */}
      <ol className="mt-8 flex flex-wrap items-center gap-2">
        {["保障類型", "最重視什麼", "希望了解", "分析結果"].map((label, i) => {
          const state = i < step ? "done" : i === step ? "active" : "todo";
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12.5px] font-medium ${
                  state === "active"
                    ? "bg-brand-800 text-white"
                    : state === "done"
                      ? "bg-accent-50 text-accent-800"
                      : "bg-white text-ink-mute border border-ink-line"
                }`}
              >
                {state === "done" ? <Check size={13} /> : <span>{i + 1}</span>}
                {label}
              </span>
              {i < 3 && <span className="text-ink-line">→</span>}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 rounded-2xl border border-ink-line bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <Icon size={19} />
          </span>
          <div>
            <p className="text-[12px] font-medium text-ink-mute">
              第 {step + 1} 步／共 3 步
            </p>
            <h2 className="mt-1 text-[20px] font-semibold tracking-tight text-ink">
              {step === 0 && "你想了解哪一類保障？"}
              {step === 1 && "你最重視什麼？"}
              {step === 2 && "你希望了解哪方面？"}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {current.map((opt) => {
            const active = selected === opt.id;
            const OptIcon =
              step === 0
                ? CATEGORY_ICON[opt.id]
                : step === 1
                  ? FOCUS_ICON[opt.id]
                  : TOPIC_ICON[opt.id];
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt.id)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-brand-700 bg-brand-50 ring-1 ring-brand-700"
                    : "border-ink-line bg-white hover:border-brand-300 hover:bg-paper"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                    active ? "bg-brand-800 text-white" : "bg-paper text-ink-soft"
                  }`}
                >
                  <OptIcon size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-semibold text-ink">{opt.label}</span>
                  {opt.desc && (
                    <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-soft">
                      {opt.desc}
                    </span>
                  )}
                </span>
                <span
                  className={`ml-auto mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                    active ? "border-brand-700 bg-brand-700 text-white" : "border-ink-line"
                  }`}
                >
                  {active && <Check size={12} />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-ink-line pt-5">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-ink-line px-4 text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={15} /> 上一步
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!selected}
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-brand-800 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === 2 ? "查看分析結果" : "下一步"}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* 小型比較按鈕 */
function CompareButtonFor({ productId }: { productId: string }) {
  const product = products.find((p) => p.id === productId)!;
  return <CompareButton product={product} variant="outline" showCount={false} />;
}

function buildResult(answers: Record<number, string>) {
  const cat = answers[0] ?? "unsure";
  const focus = answers[1] ?? "understand";
  const topic = answers[2] ?? "basics";

  const catLabel = STEP1.find((o) => o.id === cat)?.label ?? "";
  const focusLabel = STEP2.find((o) => o.id === focus)?.label ?? "";
  const topicLabel = STEP3.find((o) => o.id === topic)?.label ?? "";

  const conceptMap: Record<string, string[]> = {
    medical: [
      "自付額嘅計算方式（每次／每年／終身）",
      "總額同分項保障上限嘅分別",
      "病房級別對保費同日常使用嘅影響",
      "住院保障嘅等候期同意外豁免",
    ],
    critical: [
      "危疾疾病定義（例如分期、持續時間要求）",
      "一次性理賠同多次理賠嘅取捨",
      "等候期長短同已有症狀嘅分別",
      "受保人保費豁免嘅實際作用",
    ],
    life: [
      "身故保障同儲蓄成分嘅分別",
      "固定年期保費 vs 逐年續保定價",
      "非保證金額嘅披露方式",
      "保單年期內身故保障嘅限制",
    ],
    travel: [
      "受保地區同活動範圍",
      "行程延誤／取消嘅觸發條件",
      "行李同個人財物嘅單件上限",
      "醫療保障嘅自付額同海外就醫程序",
    ],
    unsure: [
      "醫療保險報銷開支 vs 危疾保險賠付保險金",
      "保障缺口：邊類風險你而家未覆蓋",
      "自付額、等候期、續保條件三大限制",
      "保障上限點樣睇",
    ],
  };

  const termsMap: Record<string, string[]> = {
    coverage: [
      "保障範圍清單（包括唔受保嘅主要情況）",
      "分項保障上限同總額上限",
      "自付額或墊底費嘅計算方式",
      "等候期長短同有冇意外豁免",
    ],
    budget: [
      "自付額設定對保費嘅影響",
      "自付額設定對實際索償金額嘅影響",
      "有冇分項上限會令成本上升",
      "續保時保費調整嘅可能幅度",
    ],
    terms: [
      "除外責任完整清單",
      "疾病定義或保障定義嘅具體要求",
      "自付額計算單位同重設時間",
      "需要進一步確認嘅事項",
    ],
    renewal: [
      "續保係咪保證、需唔需要審批",
      "保費固定年期定逐年定價",
      "續保時可能調整嘅項目",
      "續保申請嘅截止日期同逾期後果",
    ],
    understand: [
      "醫療保險 vs 危疾保險 vs 人壽保險嘅理賠方式",
      "一次性理賠 vs 報銷式賠償",
      "定期壽險 vs 儲蓄壽險",
      "保障上限、自付額、等候期嘅基本意思",
    ],
  };

  const articleMap: Record<string, string[]> = {
    medical: ["hk-medical-insurance-basics", "deductible-explained", "hospital-cover-limit"],
    critical: ["medical-vs-critical-illness", "waiting-period", "renewal-terms"],
    life: ["renewal-terms", "medical-vs-critical-illness"],
    travel: ["hk-medical-insurance-basics", "deductible-explained"],
    unsure: ["medical-vs-critical-illness", "hk-medical-insurance-basics", "deductible-explained"],
  };

  const focusArticles: Record<string, string[]> = {
    coverage: ["hospital-cover-limit", "hk-medical-insurance-basics"],
    budget: ["deductible-explained", "renewal-terms"],
    terms: ["hospital-cover-limit", "waiting-period"],
    renewal: ["renewal-terms", "waiting-period"],
    understand: ["medical-vs-critical-illness", "hk-medical-insurance-basics"],
  };

  const topicArticles: Record<string, string[]> = {
    basics: ["hk-medical-insurance-basics", "medical-vs-critical-illness"],
    compare: ["hospital-cover-limit", "deductible-explained"],
    terms: ["deductible-explained", "waiting-period", "renewal-terms", "hospital-cover-limit"],
    faq: ["medical-vs-critical-illness", "hk-medical-insurance-basics"],
  };

  const slugs = Array.from(
    new Set([
      ...(articleMap[cat] ?? []),
      ...(focusArticles[focus] ?? []),
      ...(topicArticles[topic] ?? []),
    ])
  ).slice(0, 4);

  const categoryProducts = products.filter((p) =>
    cat === "unsure" ? true : p.category === ({ medical: "醫療保險", critical: "危疾保險", life: "人壽保險", travel: "旅遊保險" }[cat] ?? "")
  );

  return {
    categoryLabel: catLabel,
    focusLabel: focusLabel,
    topicLabel: topicLabel,
    concepts: conceptMap[cat] ?? conceptMap.unsure,
    termsToCompare: termsMap[focus] ?? termsMap.understand,
    articles: slugs
      .map((s) => articles.find((a) => a.slug === s))
      .filter(Boolean)
      .map((a) => a!),
    products: (categoryProducts.length ? categoryProducts : products).slice(0, 3),
  };
}
