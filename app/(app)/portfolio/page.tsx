import { Chip, PageHeader, Panel, PulseRail, Table, Td, TONE } from "@/components/panel";
import { getRun } from "@/lib/view";
import { short, usd } from "@/lib/utils";

export const metadata = { title: "Practice Portfolio" };

export default function PortfolioPage() {
  const run = getRun();
  const { settings, stats, trades } = run;
  const exposure = trades.reduce((n, t) => n + t.sizeUsd, 0);
  return (
    <>
      <PageHeader title="Practice Portfolio" description="Paper trades only. Each trade links to the evidence hash behind it, so you can check why it happened." />
      <PulseRail
        items={[
          { label: "Start equity", value: usd(settings.equityUsd) },
          { label: "Realized P&L", value: usd(stats.totalPnlUsd, 2), tone: stats.totalPnlUsd >= 0 ? "good" : "bad" },
          { label: "Exposure", value: usd(exposure), hint: `max ${usd(settings.equityUsd)}` },
          { label: "Max position", value: usd(settings.maxPositionUsd) },
          { label: "Stop / take", value: `${settings.stopLossPct}% / ${settings.takeProfitPct}%` },
          { label: "Open cap", value: `${trades.length} / ${settings.maxOpenPositions}` },
        ]}
      />
      <Panel title="Trades">
        <Table head={["Token", "Size", "Entry", "Stop", "Take-profit", "Exit", "Reason", "P&L", "Evidence"]}>
          {trades.map((t) => (
            <tr key={t.id}>
              <Td className="font-medium">{t.token}</Td>
              <Td>{usd(t.sizeUsd)}</Td>
              <Td>{t.entry}</Td>
              <Td>{Number(t.stopLoss.toPrecision(5))}</Td>
              <Td>{Number(t.takeProfit.toPrecision(5))}</Td>
              <Td>{Number(t.exit.toPrecision(5))}</Td>
              <Td><Chip tone={t.exitReason === "take-profit" ? "good" : t.exitReason === "stop-loss" ? "bad" : "default"}>{t.exitReason}</Chip></Td>
              <Td className={t.pnlUsd >= 0 ? TONE.good : TONE.bad}>{usd(t.pnlUsd, 2)}</Td>
              <Td className="font-mono text-xs text-muted-foreground">{short(t.evidenceHash)}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
