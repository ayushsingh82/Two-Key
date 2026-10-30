import { Chip, PageHeader, Panel, Table, Td, TONE } from "@/components/panel";
import { getRun, getWallets } from "@/lib/view";
import { ago, usd } from "@/lib/utils";

export const metadata = { title: "Wallet Flow" };

export default function WalletsPage() {
  const { events, now } = getWallets();
  const run = getRun();
  return (
    <>
      <PageHeader title="Wallet Flow" description="The on-chain key. Smart wallets buying confirms a narrative. Smart wallets selling means a KOL pump may be exit liquidity." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {run.decisions.map((d) => (
          <div key={d.token} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold">{d.token}</span>
              <Chip tone={d.onchain.state === "strong" ? "good" : d.onchain.state === "selling" ? "bad" : "warn"}>{d.onchain.state}</Chip>
            </div>
            <p className={`mt-3 font-display text-2xl font-semibold ${d.onchain.netSmartUsd >= 0 ? TONE.good : TONE.bad}`}>{usd(d.onchain.netSmartUsd)}</p>
            <p className="text-xs text-muted-foreground">net smart flow, {d.onchain.smartBuyers} buyers</p>
          </div>
        ))}
      </div>
      <Panel title="Recent wallet events" className="mt-6">
        <Table head={["Token", "Side", "Amount", "Wallet", "Type", "When"]}>
          {events.map((e, i) => (
            <tr key={i}>
              <Td className="font-medium">{e.token}</Td>
              <Td className={e.side === "buy" ? TONE.good : TONE.bad}>{e.side}</Td>
              <Td>{usd(e.usd)}</Td>
              <Td className="font-mono text-xs">{e.wallet}</Td>
              <Td>{e.smart ? "smart money" : "retail"}</Td>
              <Td className="text-muted-foreground">{ago(now, e.ts)}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
