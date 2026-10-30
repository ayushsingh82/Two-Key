import { ActionChip } from "@/components/action-chip";
import { PageHeader, Panel } from "@/components/panel";
import { getRun } from "@/lib/view";

export const metadata = { title: "Court" };

export default function CourtPage() {
  const run = getRun();
  return (
    <>
      <PageHeader title="Court" description="A bull and a bear argue from the same evidence. The judge compares the cases and can downgrade a trade, never upgrade a rejection." />
      <div className="grid gap-6 lg:grid-cols-2">
        {run.decisions.map((d) => (
          <section key={d.token} id={d.token} className="scroll-mt-24">
            <Panel title={d.token} subtitle={`Fusion rule ${d.fusion.rule}: ${d.fusion.label}`} right={<ActionChip action={d.action} />}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">Bull ({d.court.bullScore})</p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {d.court.bull.length ? d.court.bull.map((b) => <li key={b}>+ {b}</li>) : <li>No bull case</li>}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-red-400">Bear ({d.court.bearScore})</p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {d.court.bear.length ? d.court.bear.map((b) => <li key={b}>- {b}</li>) : <li>No bear case</li>}
                  </ul>
                </div>
              </div>
              <p className="mt-4 border-t pt-3 text-sm"><span className="font-medium">Judge:</span> <span className="text-muted-foreground">{d.court.reason}</span></p>
            </Panel>
          </section>
        ))}
      </div>
    </>
  );
}
