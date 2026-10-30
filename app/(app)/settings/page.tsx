import { PageHeader, Panel, Table, Td } from "@/components/panel";
import { RiskLab } from "@/components/risk-lab";
import { KOLS } from "@/lib/data";
import { MAX_KOLS } from "@/lib/settings";
import { getRun } from "@/lib/view";
import { usd } from "@/lib/utils";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  const s = getRun().settings;
  const rows: [string, string, string][] = [
    ["Max position size", usd(s.maxPositionUsd), "Largest single practice position. Small trades use half."],
    ["Max open positions", String(s.maxOpenPositions), "Extra trades are rejected with the reason logged."],
    ["Daily loss cap", usd(s.dailyLossCapUsd), "No new trades once realized losses reach this."],
    ["Stop-loss", `${s.stopLossPct}%`, "Applied to every position."],
    ["Take-profit", `${s.takeProfitPct}%`, "Applied to every position."],
    ["Start equity", usd(s.equityUsd), "Total exposure cannot exceed this."],
    ["Signal window", `${s.windowHours}h`, "Only posts inside this window count."],
    ["Min bullish voices", String(s.minVoices), "Needed for the social key to turn."],
    ["Social strong score", String(s.socialStrongScore), "Trust-weighted score needed for a strong social key."],
    ["On-chain strong", usd(s.onchainStrongUsd), "Net smart-wallet buying needed for a strong on-chain key."],
    ["On-chain selling", usd(s.onchainSellUsd), "Net smart-wallet selling that triggers an exit-liquidity rejection."],
    ["Min liquidity", usd(s.minLiquidityUsd), "Below this the bear case gets a point."],
  ];
  return (
    <>
      <PageHeader title="Settings" description={`Risk limits and signal thresholds. Up to ${MAX_KOLS} KOLs can be followed. These values are read from the default configuration.`} />
      <Panel title="Risk lab" subtitle="Change the limits and re-run the agent. Nothing is saved." className="mb-6">
        <RiskLab pool={KOLS.map((k) => k.handle)} followed={s.kols} />
      </Panel>
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Risk limits and thresholds" className="xl:col-span-2">
          <Table head={["Setting", "Value", "What it does"]}>
            {rows.map(([k, v, d]) => (
              <tr key={k}>
                <Td className="font-medium">{k}</Td>
                <Td className="font-mono">{v}</Td>
                <Td className="text-muted-foreground">{d}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
        <Panel title="Followed KOLs" subtitle={`${s.kols.length} of ${MAX_KOLS}, from a pool of ${KOLS.length}`}>
          <ul className="space-y-1.5 text-sm">
            {s.kols.map((k) => <li key={k} className="text-muted-foreground">{k}</li>)}
          </ul>
          <p className="mt-4 border-t pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Available, not followed</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {KOLS.filter((k) => !s.kols.includes(k.handle)).map((k) => <li key={k.handle} className="text-muted-foreground/60">{k.handle}</li>)}
          </ul>
        </Panel>
      </div>
    </>
  );
}
