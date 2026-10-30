import { ActionChip } from "@/components/action-chip";
import { PageHeader, Panel, Table, Td, TONE } from "@/components/panel";
import { FUSION_RULES } from "@/lib/fusion";
import { getRun } from "@/lib/view";
import { usd } from "@/lib/utils";

export const metadata = { title: "Candidates" };

export default function CandidatesPage() {
  const run = getRun();
  return (
    <>
      <PageHeader title="Candidates" description="Every token mentioned by the KOLs we follow, with both keys and the rule that decided it." />
      <Panel title="Decisions" subtitle="Social key from trust-weighted KOL convergence, on-chain key from smart wallets (24h)">
        <Table head={["Token", "Voices", "Social score", "Social key", "Net smart flow", "On-chain key", "Rule", "Decision"]}>
          {run.decisions.map((d) => (
            <tr key={d.token}>
              <Td className="font-medium">{d.token}</Td>
              <Td>{d.social.bullishVoices}/{d.social.voices}</Td>
              <Td>{d.social.score.toFixed(2)}</Td>
              <Td className={d.social.strength === "strong" ? TONE.good : TONE.warn}>{d.social.strength}</Td>
              <Td>{usd(d.onchain.netSmartUsd)}</Td>
              <Td className={d.onchain.state === "strong" ? TONE.good : d.onchain.state === "selling" ? TONE.bad : TONE.warn}>{d.onchain.state}</Td>
              <Td>{d.fusion.rule}</Td>
              <Td><ActionChip action={d.action} /></Td>
            </tr>
          ))}
        </Table>
      </Panel>
      <Panel title="Fusion rules" subtitle="The same table the agent follows. Nothing is hidden in a prompt." className="mt-6">
        <Table head={["Rule", "Social key", "On-chain key", "Decision", "Meaning"]}>
          {FUSION_RULES.map((r) => (
            <tr key={r.rule}>
              <Td>{r.rule}</Td>
              <Td>{r.social}</Td>
              <Td>{r.onchain}</Td>
              <Td><ActionChip action={r.action} /></Td>
              <Td className="text-muted-foreground">{r.label}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
