import Link from "next/link";
import { cn } from "@/lib/utils";

/** Two-Key mark: two keys crossing on the accent tile. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Two-Key" className={cn("size-7", className)}>
      <rect width="64" height="64" rx="16" className="fill-accent" />
      <g className="stroke-accent-foreground" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="22" cy="22" r="7" />
        <path d="M27 27 L47 47 M38 38 L34 42 M44 44 L40 48" />
        <circle cx="42" cy="22" r="7" opacity="0.55" />
        <path d="M37 27 L17 47" opacity="0.55" />
      </g>
    </svg>
  );
}

export function BrandLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <BrandMark />
      <span className="font-display text-lg font-semibold tracking-tight">Two-Key</span>
    </Link>
  );
}
