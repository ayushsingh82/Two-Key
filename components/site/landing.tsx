import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Gavel, History, MessagesSquare, ShieldCheck, Waves } from "lucide-react";
import { BrandLogo } from "@/components/brand";
import { backtest } from "@/lib/backtest";
import { getRun } from "@/lib/view";
import { cn, usd } from "@/lib/utils";

const card = "rounded-2xl border bg-card p-4 shadow-[0_24px_60px_-15px] shadow-black/50 ring-1 ring-white/10";

function Float({ className, duration = 8, delay = 0, children }: { className?: string; duration?: number; delay?: number; children: ReactNode }) {
  return (
    <div className={cn("absolute hidden lg:block", className)}>
      <div className="animate-[float_var(--d)_ease-in-out_infinite]" style={{ "--d": `${duration}s`, animationDelay: `${delay}s` } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <BrandLogo />
          <nav className="hidden items-center gap-1 md:flex">
            {[["#how", "How it works"], ["#rules", "Rules"], ["#edge", "Why it is different"]].map(([h, l]) => (
              <a key={h} href={h} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">{l}</a>
            ))}
          </nav>
        </div>
        <Link href="/board" className="rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">Open app</Link>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Float className="left-[3%] top-[22%] -rotate-[6deg]" duration={7}>
          <div className={cn(card, "w-56")}><MessagesSquare className="size-5 text-accent" /><p className="mt-3 text-sm font-medium">Trusted voices</p><p className="mt-1 text-xs text-muted-foreground">KOLs are scored on their past calls. Copied posts are ignored.</p></div>
        </Float>
        <Float className="right-[3%] top-[16%] rotate-[5deg]" duration={9} delay={1}>
          <div className={cn(card, "w-56")}><Waves className="size-5 text-accent" /><p className="mt-3 text-sm font-medium">Real money</p><p className="mt-1 text-xs text-muted-foreground">Smart wallets must be buying the same token.</p></div>
        </Float>
        <Float className="left-[6%] bottom-[12%] rotate-[3deg]" duration={8} delay={2}>
          <div className={cn(card, "w-56")}><Gavel className="size-5 text-accent" /><p className="mt-3 text-sm font-medium">A court decides</p><p className="mt-1 text-xs text-muted-foreground">Bull and bear argue, a judge rules.</p></div>
        </Float>
        <Float className="right-[6%] bottom-[10%] -rotate-[4deg]" duration={8} delay={3}>
          <div className={cn(card, "w-56")}><History className="size-5 text-accent" /><p className="mt-3 text-sm font-medium">Replayable</p><p className="mt-1 text-xs text-muted-foreground">Every decision keeps its evidence and a hash.</p></div>
        </Float>
      </div>
      <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-24 text-center sm:px-6 sm:pt-32 sm:pb-40">
        <span className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-accent" /> Practice trades only. No real funds.
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          Where autonomous capital
          <span className="block text-muted-foreground">moves only when the evidence does.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Two-Key follows up to 20 crypto KOLs, checks whether real wallets agree, and only then records a practice trade inside your risk limits. Every decision, including every no, can be replayed.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/board" className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90">Open the board <ArrowRight className="size-4" /></Link>
          <Link href="/replay" className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted">See a replay</Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Runs on a cached sample of KOL posts, wallet flows and prices.</p>
      </div>
    </section>
  );
}

const STEPS = [
  ["1", "Listen", "Read posts from up to 20 KOLs. Extract token, sentiment, conviction and urgency."],
  ["2", "Trust", "Weight each KOL by their record. Drop copied posts."],
  ["3", "Confirm", "Check smart-wallet flow on the same token."],
  ["4", "Judge", "Bull and bear argue from the same evidence."],
  ["5", "Trade or reject", "Record a practice trade inside your limits, or log why not."],
  ["6", "Replay", "Re-run the stored evidence. The hash must match."],
];

const RULES = [
  ["Strong", "Strong", "Full-size practice trade"],
  ["Strong", "Weak", "Small trade, flagged hype without money"],
  ["Weak", "Strong", "Watchlist, flagged money without story"],
  ["Weak", "Weak", "Reject"],
  ["Strong", "Whales selling", "Reject, possible exit liquidity"],
];

const EDGE = [
  ["Two independent keys", "Most agents only read social posts."],
  ["Exit-liquidity catch", "Flags KOLs promoting a token while whales sell."],
  ["KOL trust scoring", "Good callers count more over time."],
  ["Rejection log", "Shows why each token was skipped and what it would have done."],
  ["Deterministic replay", "Same evidence, same decision, same hash."],
  ["Visible rules", "The rule table is on screen, not hidden in a prompt."],
];

export function Sections() {
  return (
    <>
      <section id="how" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(([n, t, d]) => (
            <div key={n} className="rounded-xl border bg-card p-5">
              <span className="font-mono text-xs text-accent">{n}</span>
              <p className="mt-2 font-display text-lg font-semibold">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="rules" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">The rules</h2>
        <div className="mt-8 overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"><th className="px-4 py-3 font-normal">Social key</th><th className="px-4 py-3 font-normal">On-chain key</th><th className="px-4 py-3 font-normal">Decision</th></tr></thead>
            <tbody className="divide-y">{RULES.map(([a, b, c]) => (<tr key={a + b}><td className="px-4 py-3">{a}</td><td className="px-4 py-3">{b}</td><td className="px-4 py-3 text-muted-foreground">{c}</td></tr>))}</tbody>
          </table>
        </div>
      </section>
      <section id="edge" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Why it is different</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EDGE.map(([t, d]) => (
            <div key={t} className="rounded-xl border bg-card p-5"><ShieldCheck className="size-5 text-accent" /><p className="mt-3 font-medium">{t}</p><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}


const FAQ = [
  ["Is this real trading?", "No. Every trade is a practice trade on a sample dataset. No funds, wallets or exchanges are connected."],
  ["Where does the data come from?", "A cached sample of KOL posts, wallet flows and prices, shaped like real feeds. The X API is not called. Swapping in live feeds only means replacing the files in lib/data."],
  ["Does it use an LLM?", "Extraction and the court run on deterministic rules so every decision can be replayed exactly. An optional LLM extractor exists, and its output is stored in the evidence so replay never calls the model."],
  ["How does replay work?", "Each decision stores its full evidence and a hash. Replay re-runs the decision from that evidence and checks both hashes. Each receipt also hashes the one before it."],
  ["Can I change the risk limits?", "Yes. The settings page has a risk lab that re-runs the agent with your limits."],
];

export function Preview() {
  const run = getRun();
  const b = backtest();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="font-display text-3xl font-semibold tracking-tight">What it found on the sample data</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Real output from the agent, not a mock-up.</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 lg:col-span-2">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"><th className="py-2 font-normal">Token</th><th className="py-2 font-normal">Rule</th><th className="py-2 font-normal">Decision</th></tr></thead>
            <tbody className="divide-y">
              {run.decisions.map((d) => (
                <tr key={d.token}>
                  <td className="py-2.5 font-medium">{d.token}</td>
                  <td className="py-2.5 text-muted-foreground">{d.fusion.label}</td>
                  <td className="py-2.5 capitalize">{d.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Versus a naive agent</p>
          <p className="mt-3 font-display text-3xl font-semibold">{usd(b.twoKeyDeployed)}</p>
          <p className="text-xs text-muted-foreground">Capital Two-Key risked for {usd(b.twoKeyPnl, 2)} P&L ({b.twoKeyReturnPct}%)</p>
          <p className="mt-4 font-display text-2xl font-semibold text-muted-foreground">{usd(b.naiveDeployed)}</p>
          <p className="text-xs text-muted-foreground">Capital a naive agent risks for {usd(b.naivePnl, 2)} P&L ({b.naiveReturnPct}%)</p>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h2 className="font-display text-3xl font-semibold tracking-tight">Questions</h2>
      <div className="mt-8 divide-y rounded-xl border bg-card">
        {FAQ.map(([q, a]) => (
          <details key={q} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-medium marker:hidden">{q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
      <div className="mt-16 rounded-2xl border bg-card p-8 text-center">
        <h3 className="font-display text-2xl font-semibold">See every decision, including the no.</h3>
        <Link href="/board" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90">Open the board <ArrowRight className="size-4" /></Link>
      </div>
    </section>
  );
}

const FOOTER_LINKS: { title: string; links: [string, string][] }[] = [
  { title: "Product", links: [["/board", "Signal Board"], ["/court", "Court"], ["/portfolio", "Portfolio"], ["/backtest", "Backtest"]] },
  { title: "Transparency", links: [["/rules", "Signal Rules"], ["/replay", "Replay"], ["/sources", "Data Sources"], ["/scorecard", "Scorecard"]] },
  { title: "Resources", links: [["/pulse", "KOL Pulse"], ["/wallets", "Wallet Flow"], ["/rejections", "Rejections"], ["/settings", "Settings"]] },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <BrandLogo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">An autonomous agent that acts only when social conviction and on-chain money agree, and keeps a replayable record of every decision.</p>
        </div>
        {FOOTER_LINKS.map(({ title, links }) => (
          <nav key={title} aria-label={title}>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">{title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {links.map(([href, label]) => (
                <li key={href}><Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; 2026 Two-Key. All rights reserved.</p>
          <p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-400" /> All systems operational</p>
        </div>
      </div>
    </footer>
  );
}
