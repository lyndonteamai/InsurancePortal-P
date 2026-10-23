import Link from "next/link";
import { site, footerLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="text-[15px] font-semibold text-ink">{site.nameZh}</p>
            <p className="mt-1 text-[13px] text-ink-mute">{site.nameEn}</p>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
              香港保險資訊及比較平台原型。目標係令消費者在投保之前，先看清楚保障內容、條款限制同埋續保安排。
            </p>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <h2 className="text-[13px] font-semibold text-ink">{col.title}</h2>
              <ul className="mt-3 space-y-2">
                {col.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      className="text-[13px] text-ink-soft hover:text-brand-700 underline-offset-2 hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-[13px] font-semibold text-amber-900">Prototype 聲明</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-amber-900/85">
            {site.prototypeNotice}
          </p>
          <p className="mt-2 text-[13px] font-semibold text-amber-900">
            此頁內容為原型示例，正式上線前需要法律及監管審核。
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-ink-line pt-6 text-[12px] text-ink-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.nameZh}（Prototype）· 內容僅供教學及產品設計演示</p>
          <p>聯絡：{site.contact.email}</p>
        </div>
      </div>
    </footer>
  );
}
