import { Chip, PageHeader, Panel, Table, Td } from "@/components/panel";
import { FUSION_RULES } from "@/lib/fusion";
import { getRun } from "@/lib/view";
import { usd } from "@/lib/utils";

export const metadata = { title: "Signal Rules" };

const ACTION_TONE = { full: "good", small: "warn", watchlist: "warn", reject: "bad" } as const;

export default function RulesPage() {
  const { settings: s, decisions } = getRun();
  const fired = (rule: number) => decisions.filter((d) => d.fusion.rule === rule).map((d) => d.token);
  const thresholds: [string, string][] = [
    ["Signal window", `${s.windowHours}h of posts`],
    ["Minimum bullish voices", String(s.minVoices)],
    ["Strong social score", `${s.socialStrongScore} (trust-weighted)`],
    ["Strong on-chain", `${usd(s.onchainStrongUsd)} net smart-wallet buying`],
    ["Exit-liquidity trigger", `${usd(s.onchainSellUsd)} net smart-wallet selling`],
    ["Minimum liquidity", usd(s.minLiquidityUsd)],
  ];
  return (
    <>
      <PageHeader title="Signal Rules" description="The exact rules the agent follows, read from the same code that makes the decisions. Nothing here is hidden in a prompt." />
      <Panel title="Fusion rule table" subtitle="Social key and on-chain key combine into one action" className="mb-6">
        <Table head={["Rule", "Social key", "On-chain key", "Action", "Meaning", "Fired on"]}>
          {FUSION_RULES.map((r) => (
            <tr key={r.rule}>
              <Td className="font-mono">{r.rule}</Td>
              <Td className="capitalize">{r.social}</Td>
              <Td className="capitalize">{r.onchain}</Td>
              <Td><Chip tone={ACTION_TONE[r.action]}>{r.action}</Chip></Td>
              <Td className="text-muted-foreground">{r.label}</Td>
              <Td className="font-mono text-xs">{fired(r.rule).join(", ") || "-"}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Signal thresholds" subtitle="When each key counts as turned">
          <Table head={["Threshold", "Value"]}>
            {thresholds.map(([k, v]) => (
              <tr key={k}><Td className="font-medium">{k}</Td><Td className="font-mono text-muted-foreground">{v}</Td></tr>
            ))}
          </Table>
        </Panel>
        <Panel title="Risk limits" subtitle="Enforced on every practice trade">
          <Table head={["Limit", "Value"]}>
            {([
              ["Max position size", usd(s.maxPositionUsd)],
              ["Max open positions", String(s.maxOpenPositions)],
              ["Daily loss cap", usd(s.dailyLossCapUsd)],
              ["Stop-loss", `${s.stopLossPct}%`],
              ["Take-profit", `${s.takeProfitPct}%`],
              ["Start equity", usd(s.equityUsd)],
            ] as [string, string][]).map(([k, v]) => (
              <tr key={k}><Td className="font-medium">{k}</Td><Td className="font-mono text-muted-foreground">{v}</Td></tr>
            ))}
          </Table>
        </Panel>
      </div>
    </>
  );
}
