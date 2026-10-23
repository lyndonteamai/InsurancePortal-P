import Link from "next/link";
import { SearchX, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-brand-50 text-brand-700">
        <SearchX size={24} />
      </span>
      <h1 className="mt-5 text-[26px] font-bold tracking-tight text-ink">搵唔到呢一頁</h1>
      <p className="mx-auto mt-2.5 max-w-md text-[14px] leading-relaxed text-ink-soft">
        你瀏覽嘅頁面唔存在，或者已經喺呢個 Prototype 入面移除咗。
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-brand-800 px-4 text-[13.5px] font-semibold text-white hover:bg-brand-900"
        >
          返回首頁
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/products"
          className="inline-flex h-10 items-center rounded-md border border-ink-line bg-white px-4 text-[13.5px] font-semibold text-ink-soft hover:bg-paper"
        >
          瀏覽產品資料庫
        </Link>
      </div>
    </div>
  );
}
