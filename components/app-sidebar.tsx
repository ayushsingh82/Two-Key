"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ban, FlaskConical, Gavel, History, LayoutDashboard, ListChecks, MessagesSquare, Settings, ShieldCheck, Waves, Wallet, type LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand";
import { cn } from "@/lib/utils";

const SECTIONS: { label: string; items: { href: string; label: string; icon: LucideIcon }[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/board", label: "Signal Board", icon: LayoutDashboard },
      { href: "/pulse", label: "KOL Pulse", icon: MessagesSquare },
      { href: "/court", label: "Court", icon: Gavel },
    ],
  },
  {
    label: "Signals",
    items: [
      { href: "/candidates", label: "Candidates", icon: ListChecks },
      { href: "/wallets", label: "Wallet Flow", icon: Waves },
    ],
  },
  {
    label: "Trading",
    items: [
      { href: "/portfolio", label: "Practice Portfolio", icon: Wallet },
      { href: "/rejections", label: "Rejections", icon: Ban },
      { href: "/backtest", label: "Backtest", icon: FlaskConical },
      { href: "/replay", label: "Replay", icon: History },
    ],
  },
  { label: "Account", items: [{ href: "/settings", label: "Settings", icon: Settings }] },
];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r bg-background p-4 md:flex">
        <div className="px-1 pt-1"><BrandLogo /></div>
        <nav className="flex flex-col gap-5">
          {SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">{section.label}</p>
              <div className="flex flex-col gap-0.5">
                {section.items.map(({ href, label, icon: Icon }) => {
                  const active = isActive(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
                        active && "bg-muted font-medium text-foreground",
                      )}
                    >
                      {active && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent" />}
                      <Icon className={cn("size-4 shrink-0 transition-colors", active ? "text-accent" : "text-muted-foreground group-hover:text-foreground")} />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-auto rounded-lg border bg-card p-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <ShieldCheck className="size-3.5 text-emerald-400" /> Practice trades only
            <span className="ml-auto rounded-full border border-amber-400/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-amber-300">Beta</span>
          </p>
          <p className="mt-1">Sample data. No real funds.</p>
        </div>
      </aside>

      <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-3"><BrandLogo /></div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {SECTIONS.flatMap((s) => s.items).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn("shrink-0 rounded-full border border-transparent px-3 py-1.5 text-sm text-muted-foreground", isActive(pathname, href) && "border-border bg-muted text-foreground")}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
