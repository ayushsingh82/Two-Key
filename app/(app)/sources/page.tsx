import { Chip, PageHeader, Panel, Table, Td } from "@/components/panel";
import { KOLS, MARKET, POSTS, WALLET_EVENTS } from "@/lib/data";

export const metadata = { title: "Data Sources" };

export default function SourcesPage() {
  const bySource = (src: string) => POSTS.filter((p) => (p.source ?? "x") === src).length;
  const rows: { name: string; origin: string; size: string; status: string }[] = [
    { name: "X posts", origin: "Cached feed in the shape of X posts", size: `${bySource("x")} posts`, status: "Cached" },
    { name: "Telegram messages", origin: "Optional source, cached", size: `${bySource("telegram")} messages`, status: "Cached" },
    { name: "Discord messages", origin: "Optional source, cached", size: `${bySource("discord")} messages`, status: "Cached" },
    { name: "Wallet activity", origin: "Cached whale and smart-money events", size: `${WALLET_EVENTS.length} events`, status: "Cached" },
    { name: "Prices and volume", origin: "Cached snapshot with an hourly outcome path", size: `${MARKET.length} tokens`, status: "Cached" },
  ];
  return (
    <>
      <PageHeader title="Data Sources" description="Where every input comes from. The feeds here are cached, not live, and the agent treats them exactly as it would treat live data." />
      <Panel title="Inputs" subtitle="Each source has the same shape as its live equivalent" className="mb-6">
        <Table head={["Input", "Origin", "Size", "Status"]}>
          {rows.map((r) => (
            <tr key={r.name}>
              <Td className="font-medium">{r.name}</Td>
              <Td className="text-muted-foreground">{r.origin}</Td>
              <Td className="font-mono text-xs">{r.size}</Td>
              <Td><Chip tone="warn">{r.status}</Chip></Td>
            </tr>
          ))}
        </Table>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Disclosure">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>KOLs are a pool of {KOLS.length}, and up to 20 can be followed. X data comes from a cached feed because API access is limited. Swapping in a live feed changes the data layer only.</li>
            <li>All trades are practice trades on a paper portfolio. No funds move.</li>
            <li>Extraction and the court are deterministic, so the same evidence always gives the same decision.</li>
          </ul>
        </Panel>
        <Panel title="Going live">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>KOL posts: replace the cached feed with the X API, Discord or Telegram.</li>
            <li>Wallet activity: Etherscan or public RPC endpoints.</li>
            <li>Prices and volume: any free market API.</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
