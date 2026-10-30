import { ActionChip } from "@/components/action-chip";
import { PageHeader, Panel, TONE } from "@/components/panel";
import { getRun } from "@/lib/view";
import { short, usd } from "@/lib/utils";

export const metadata = { title: "Rejections" };

export default function RejectionsPage() {
  const run = getRun();
  return (
    <>
      <PageHeader title="Rejections" description="Why each token was skipped, and what would have happened if we had traded it anyway." />
      <div className="grid gap-6 lg:grid-cols-2">
        {run.rejections.map((r) => (
          <Panel
            key={r.token}
            title={r.token}
            right={<ActionChip action={r.action} />}
            subtitle={`Evidence ${short(r.evidenceHash)}`}
          >
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {r.reasons.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <p className="mt-4 border-t pt-3 text-sm">
              {r.savedUsd > 0 ? (
                <span className={TONE.good}>Avoided a {usd(r.savedUsd)} loss on a full-size trade</span>
              ) : r.savedUsd < 0 ? (
                <span className={TONE.warn}>Would have made {usd(-r.savedUsd)}. Kept on the watchlist, since only one key turned.</span>
              ) : (
                <span className="text-muted-foreground">Would have been flat</span>
              )}
            </p>
          </Panel>
        ))}
      </div>
    </>
  );
}
