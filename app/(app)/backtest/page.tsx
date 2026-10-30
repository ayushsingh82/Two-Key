import { PageHeader, Panel, PulseRail, Table, Td, TONE } from "@/components/panel";
import { ActionChip } from "@/components/action-chip";
import { Sparkline } from "@/components/sparkline";
import { backtest } from "@/lib/backtest";
import { MARKET } from "@/lib/data";
import type { FusionAction } from "@/lib/types";
import { usd } from "@/lib/utils";

export const metadata = { title: "Backtest" };

export default function BacktestPage() {
  const b = backtest();
  return (
    <>
      <PageHeader title="Backtest" description="Two-Key against a naive agent that buys every token the KOLs mention. Same price paths, same stop-loss and take-profit." />
      <PulseRail
        items={[
          { label: "Two-Key P&L", value: usd(b.twoKeyPnl, 2), tone: b.twoKeyPnl > 0 ? "good" : b.twoKeyPnl < 0 ? "bad" : "default", hint: `${b.twoKeyTrades} trades` },
          { label: "Naive P&L", value: usd(b.naivePnl, 2), tone: b.naivePnl > 0 ? "good" : b.naivePnl < 0 ? "bad" : "default", hint: `${b.naiveTrades} trades` },
          { label: "Capital used", value: `${usd(b.twoKeyDeployed)} vs ${usd(b.naiveDeployed)}`, hint: "Two-Key vs naive" },
          { label: "Return on capital", value: `${b.twoKeyReturnPct}% vs ${b.naiveReturnPct}%`, tone: b.twoKeyReturnPct >= b.naiveReturnPct ? "good" : "warn", hint: "Two-Key vs naive" },
          { label: "Win rate", value: `${b.twoKeyWinRate}% vs ${b.naiveWinRate}%`, hint: "Two-Key vs naive" },
          { label: "Trades avoided", value: String(b.naiveTrades - b.twoKeyTrades), hint: "rejected or watchlisted" },
        ]}
      />
      <Panel title="Per token" subtitle="Price path after the decision, with what each agent made" >
        <Table head={["Token", "Path", "Two-Key decision", "Two-Key P&L", "Naive P&L"]}>
          {b.rows.map((r) => {
            const m = MARKET.find((x) => x.token === r.token)!;
            return (
              <tr key={r.token}>
                <Td className="font-medium">{r.token}</Td>
                <Td className="w-40"><Sparkline values={[m.price, ...m.outcomePath]} /></Td>
                <Td><ActionChip action={r.action as FusionAction} /></Td>
                <Td className={r.twoKeyPnl > 0 ? TONE.good : r.twoKeyPnl < 0 ? TONE.bad : "text-muted-foreground"}>{usd(r.twoKeyPnl, 2)}</Td>
                <Td className={r.naivePnl > 0 ? TONE.good : r.naivePnl < 0 ? TONE.bad : "text-muted-foreground"}>{usd(r.naivePnl, 2)}</Td>
              </tr>
            );
          })}
        </Table>
      </Panel>
      <p className="mt-4 text-xs text-muted-foreground">Sample data and one decision point, so this shows how the rules behave, not a track record. Total P&L can be similar because Two-Key also skips some winners, such as BONK. The difference is how much capital it risks to get there.</p>
    </>
  );
}
