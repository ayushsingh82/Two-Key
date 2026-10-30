import Link from "next/link";
import { ActionChip } from "@/components/action-chip";
import { PageHeader, Panel, PulseRail, Table, Td, TONE } from "@/components/panel";
import { Sparkline } from "@/components/sparkline";
import { MARKET } from "@/lib/data";
import { getRun } from "@/lib/view";
import { usd } from "@/lib/utils";

export const metadata = { title: "Signal Board" };

export default function BoardPage() {
  const run = getRun();
  const { stats } = run;
  const hitRate = stats.trades ? Math.round((stats.wins / stats.trades) * 100) : 0;
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
