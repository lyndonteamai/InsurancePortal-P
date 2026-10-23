import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock, ArrowRight, Info } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "聯絡我們",
  description: "保險指南（Prototype）聯絡資料與意見回饋方式。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-page py-10">
      <nav aria-label="麵包屑" className="text-[12.5px] text-ink-mute">
        <Link href="/" className="hover:text-brand-700">
          首頁
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">聯絡我們</span>
      </nav>

      <header className="mt-3 max-w-2xl">
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[32px]">聯絡我們</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          如果你對平台內容、資料結構或產品設計有任何意見，歡迎同我哋講。
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Mail, label: "電郵", value: site.contact.email },
          { icon: MapPin, label: "地點", value: site.contact.address },
          { icon: Clock, label: "辦公時間", value: site.contact.hours },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-xl border border-ink-line bg-white p-5">
              <Icon size={18} className="text-brand-600" />
              <p className="mt-3 text-[12px] text-ink-mute">{c.label}</p>
              <p className="mt-0.5 text-[14px] font-medium text-ink">{c.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="flex items-start gap-2 text-[13.5px] leading-relaxed text-amber-900">
          <Info size={15} className="mt-0.5 shrink-0" />
          <span>
            Prototype 版本嘅聯絡資料為示例，平台未設真實客服系統，亦唔會收集任何個人或健康資料。
            正式上線時，本頁會提供正式渠道及私隱政策連結。
          </span>
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-[19px] font-semibold tracking-tight text-ink">你可以先睇呢啲</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { href: "/transparency", label: "資料來源及更新方式" },
            { href: "/legal/disclaimer", label: "免責聲明" },
            { href: "/legal/privacy", label: "私隱政策" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between gap-2 rounded-lg border border-ink-line bg-white px-4 py-3 text-[13.5px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
            >
              {l.label}
              <ArrowRight size={14} className="text-ink-mute group-hover:text-brand-700" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
