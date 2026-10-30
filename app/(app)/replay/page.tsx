import { Chip, PageHeader, Panel, PulseRail, Table, Td } from "@/components/panel";
import { replay } from "@/lib/snapshot";
import { getRun } from "@/lib/view";
import { short } from "@/lib/utils";

export const metadata = { title: "Replay" };

export default function ReplayPage() {
  const run = getRun();
  const rows = run.receipts.map((r, i) => ({ r, ok: replay(run.evidence[i], r).matches }));
  const allOk = rows.every((x) => x.ok);
  return (
    <>
      <PageHeader title="Replay" description="Every decision is stored with its evidence and chained to the one before it. Re-running the stored evidence must give the same hash. If anything was edited, it shows here." />
      <PulseRail
        items={[
          { label: "Receipts", value: String(rows.length) },
          { label: "Replays matched", value: `${rows.filter((x) => x.ok).length}/${rows.length}`, tone: allOk ? "good" : "bad" },
          { label: "Hash chain", value: run.chainValid ? "valid" : "broken", tone: run.chainValid ? "good" : "bad" },
        ]}
      />
      <Panel title="Receipts" subtitle="hash = sha256(previous hash + evidence hash + decision hash)">
        <Table head={["#", "Token", "Evidence hash", "Decision hash", "Chain hash", "Replay"]}>
          {rows.map(({ r, ok }) => (
            <tr key={r.index}>
              <Td>{r.index}</Td>
              <Td className="font-medium">{r.token}</Td>
              <Td className="font-mono text-xs">{short(r.evidenceHash)}</Td>
              <Td className="font-mono text-xs">{short(r.decisionHash)}</Td>
              <Td className="font-mono text-xs">{short(r.hash)}</Td>
              <Td><Chip tone={ok ? "good" : "bad"}>{ok ? "matches" : "differs"}</Chip></Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
