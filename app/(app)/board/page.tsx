import Link from "next/link";
import { ActionChip } from "@/components/action-chip";
import { PageHeader, Panel, PulseRail, Table, Td, TONE } from "@/components/panel";
import { Sparkline } from "@/components/sparkline";
import { MARKET } from "@/lib/data";
import { replay } from "@/lib/snapshot";
import { getRun } from "@/lib/view";
import { usd } from "@/lib/utils";

export const metadata = { title: "Signal Board" };

export default function BoardPage() {
  const run = getRun();
  const { stats } = run;
  const hitRate = stats.trades ? Math.round((stats.wins / stats.trades) * 100) : 0;
  const deployed = run.trades.reduce((n, t) => n + t.sizeUsd, 0);
  const lossesToday = run.trades.filter((t) => t.pnlUsd < 0).reduce((n, t) => n - t.pnlUsd, 0);
  const replayed = run.receipts.filter((r, i) => replay(run.evidence[i], r).matches).length;
  const pct = (n: number, d: number) => Math.min(100, d ? Math.round((n / d) * 100) : 0);
  const bars: [string, number, string][] = [
    ["Capital deployed", pct(deployed, run.settings.equityUsd), `${usd(deployed)} of ${usd(run.settings.equityUsd)}`],
    ["Open position slots", pct(run.stats.trades, run.settings.maxOpenPositions), `${run.stats.trades} of ${run.settings.maxOpenPositions}`],
    ["Daily loss cap used", pct(lossesToday, run.settings.dailyLossCapUsd), `${usd(lossesToday, 2)} of ${usd(run.settings.dailyLossCapUsd)}`],
  ];
  return (
    <>
      <PageHeader title="Signal Board" description="Which tokens have both keys turned: trusted KOLs talking and real wallets buying." />
      <PulseRail
        items={[
          { label: "KOLs tracked", value: String(run.settings.kols.length), hint: "max 20" },
          { label: "Candidates", value: String(run.decisions.length), hint: "tokens mentioned" },
          { label: "Trades opened", value: String(stats.trades), hint: "practice only" },
          { label: "Rejected", value: String(stats.rejected), hint: "with reasons" },
          { label: "Hit rate", value: `${hitRate}%`, hint: `${stats.wins} of ${stats.trades} trades`, tone: hitRate >= 50 ? "good" : "warn" },
          { label: "Loss avoided", value: usd(stats.lossAvoidedUsd), hint: "by saying no", tone: "good" },
        ]}
      />
      <div className="mb-8 grid gap-4 xl:grid-cols-3">
        <Panel title="Narrative convergence" subtitle="Trust-weighted score against the strong threshold">
          <ul className="space-y-3">
            {[...run.decisions].sort((a, b) => b.social.score - a.social.score).map((d) => (
              <li key={d.token}>
                <div className="flex justify-between text-sm"><span className="font-medium">{d.token}</span><span className="font-mono text-xs text-muted-foreground">{d.social.score.toFixed(2)} / {run.settings.socialStrongScore} &middot; {d.social.bullishVoices} voices</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${d.social.strength === "strong" ? "bg-emerald-400" : "bg-amber-400"}`} style={{ width: `${pct(d.social.score, run.settings.socialStrongScore * 2)}%` }} /></div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Risk exposure" subtitle="Live usage of your risk limits">
          <ul className="space-y-3">
            {bars.map(([label, value, detail]) => (
              <li key={label}>
                <div className="flex justify-between text-sm"><span>{label}</span><span className="font-mono text-xs text-muted-foreground">{detail}</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${value >= 90 ? "bg-red-400" : "bg-accent"}`} style={{ width: `${value}%` }} /></div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Audit trail" subtitle="Every decision is hashed and replayable" right={<Link href="/replay" className="text-xs text-accent underline">Open replay</Link>}>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Hash chain</dt><dd className={run.chainValid ? TONE.good : TONE.bad}>{run.chainValid ? "Valid" : "Broken"}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Replays matched</dt><dd className={replayed === run.receipts.length ? TONE.good : TONE.bad}>{replayed} of {run.receipts.length}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Total P&amp;L</dt><dd className={stats.totalPnlUsd >= 0 ? TONE.good : TONE.bad}>{usd(stats.totalPnlUsd, 2)}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scorecard</dt><dd><Link href="/scorecard" className="text-accent underline">View checks</Link></dd></div>
          </dl>
        </Panel>
      </div>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-xl font-semibold">Candidates</h2>
        <Link href="/candidates" className="text-xs text-accent underline">Full table</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {run.decisions.map((d) => (
          <Link key={d.token} href={`/court#${d.token}`} className="group block rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-semibold">{d.token}</span>
              <ActionChip action={d.action} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Rule {d.fusion.rule}: {d.fusion.label}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Social key</dt>
                <dd className={d.social.strength === "strong" ? TONE.good : TONE.warn}>{d.social.strength} ({d.social.bullishVoices} voices)</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">On-chain key</dt>
                <dd className={d.onchain.state === "strong" ? TONE.good : d.onchain.state === "selling" ? TONE.bad : TONE.warn}>{d.onchain.state} ({usd(d.onchain.netSmartUsd)})</dd>
              </div>
            </dl>
            <Sparkline values={[MARKET.find((m) => m.token === d.token)!.price, ...MARKET.find((m) => m.token === d.token)!.outcomePath]} className="mt-4 h-10 w-full" />
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Price after decision (sample)</p>
          </Link>
        ))}
      </div>
      <Panel title="Practice trades" subtitle="Closed on the sample price path" className="mt-8">
        <Table head={["Token", "Size", "Entry", "Exit", "Reason", "P&L"]}>
          {run.trades.map((t) => (
            <tr key={t.id}>
              <Td className="font-medium">{t.token}</Td>
              <Td>{usd(t.sizeUsd)}</Td>
              <Td>{t.entry}</Td>
              <Td>{Number(t.exit.toPrecision(5))}</Td>
              <Td>{t.exitReason}</Td>
              <Td className={t.pnlUsd >= 0 ? TONE.good : TONE.bad}>{usd(t.pnlUsd, 2)}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
