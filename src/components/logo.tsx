import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-900 text-white shadow-card group-hover:bg-brand-800 transition-colors">
        <ShieldCheck className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-ink">
          {site.nameZh}
        </span>
        {!compact && (
          <span className="block text-[11px] font-medium text-ink-mute tracking-wide">
            {site.nameEn}
          </span>
        )}
      </span>
    </Link>
  );
}
