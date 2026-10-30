import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ title, subtitle, right, className, children }: { title: string; subtitle?: string; right?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-xl border bg-card p-5 transition-colors hover:border-white/15", className)}>
      <header className="mb-4 flex items-start justify-between gap-3 border-b pb-3">
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

export const TONE = { default: "text-foreground", good: "text-emerald-400", bad: "text-red-400", warn: "text-amber-400" } as const;
export type Tone = keyof typeof TONE;
export type PulseItem = { label: string; value: string; hint?: string; tone?: Tone };

/** A horizontal strip of headline numbers. */
export function PulseRail({ items }: { items: PulseItem[] }) {
  return (
    <div className="mb-6 grid grid-cols-2 divide-x divide-y overflow-hidden rounded-xl border bg-card sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
      {items.map((it) => (
        <div key={it.label} className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{it.label}</p>
          <p className={`mt-1.5 font-display text-xl font-semibold ${TONE[it.tone ?? "default"]}`}>{it.value}</p>
          {it.hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{it.hint}</p>}
        </div>
      ))}
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-8 border-b pb-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}

const CHIP = {
  good: "border-emerald-400/30 text-emerald-300",
  bad: "border-red-400/30 text-red-300",
  warn: "border-amber-400/30 text-amber-300",
  default: "text-muted-foreground",
} as const;

export function Chip({ children, tone = "default" }: { children: ReactNode; tone?: Tone }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px]", CHIP[tone])}>{children}</span>;
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-3 py-2 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}

export const Td = ({ children, className }: { children: ReactNode; className?: string }) => <td className={cn("px-3 py-2.5 align-top", className)}>{children}</td>;
