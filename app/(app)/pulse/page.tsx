import { Chip, PageHeader, Panel, Table, Td, TONE } from "@/components/panel";
import { getPulse } from "@/lib/view";
import { ago } from "@/lib/utils";

export const metadata = { title: "KOL Pulse" };

export default function PulsePage() {
  const { kols, posts, now, echoCount } = getPulse();
  return (
    <>
      <PageHeader title="KOL Pulse" description="Who we listen to, how much we trust them, and what each post says. Copied posts are flagged as echoes and ignored." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Trust scores" subtitle="Hit rate on past calls, smoothed" className="xl:col-span-1">
          <Table head={["KOL", "Trust", "Calls"]}>
            {kols.map((k) => (
              <tr key={k.handle}>
                <Td className="font-medium">{k.handle}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${k.trust * 100}%` }} />
                    </div>
                    <span className="font-mono text-xs">{k.trust.toFixed(2)}</span>
                  </div>
                </Td>
                <Td className="text-muted-foreground">{k.hits}/{k.calls}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
        <Panel title="Latest posts" subtitle={`${posts.length} posts, ${echoCount} flagged as echoes`} className="xl:col-span-2">
          <Table head={["KOL", "Post", "Token", "Sentiment", "Conv.", "Urg.", "When"]}>
            {posts.map((p) => (
              <tr key={p.id} className={p.echo ? "opacity-60" : ""}>
                <Td className="whitespace-nowrap font-medium">{p.kol}</Td>
                <Td className="min-w-64 text-muted-foreground">
                  {p.text} {p.echo && <Chip tone="bad">echo</Chip>}
                </Td>
                <Td>{p.x.token ?? "-"}</Td>
                <Td className={p.x.sentiment > 0.2 ? TONE.good : p.x.sentiment < -0.2 ? TONE.bad : TONE.warn}>{p.x.sentiment.toFixed(2)}</Td>
                <Td>{p.x.conviction.toFixed(2)}</Td>
                <Td>{p.x.urgency.toFixed(2)}</Td>
                <Td className="whitespace-nowrap text-muted-foreground">{ago(now, p.ts)}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </>
  );
}
