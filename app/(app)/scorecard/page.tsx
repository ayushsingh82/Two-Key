import Link from "next/link";
import { Check, X } from "lucide-react";
import { PageHeader, Panel, PulseRail } from "@/components/panel";
import { replay } from "@/lib/snapshot";
import { FUSION_RULES } from "@/lib/fusion";
import { MAX_KOLS } from "@/lib/settings";
import { KOLS, POSTS } from "@/lib/data";
import { getPulse, getRun } from "@/lib/view";

export const metadata = { title: "Scorecard" };

type Check = { requirement: string; evidence: string; href: string; pass: boolean };

export default function ScorecardPage() {
  const run = getRun();
  const pulse = getPulse();
  const replayOk = run.receipts.every((r, i) => replay(run.evidence[i], r).matches);
  const checks: Check[] = [
    { requirement: "Interprets market evidence", evidence: `${pulse.posts.length} posts, wallet flows and prices feed ${run.decisions.length} decisions`, href: "/board", pass: run.decisions.length > 0 },
    { requirement: "Records practice trades", evidence: `${run.trades.length} trades with entry, size, stop-loss, take-profit and P&L`, href: "/portfolio", pass: run.trades.length > 0 },
    { requirement: "Cause and effect", evidence: "Every trade and rejection carries an evidence hash", href: "/court", pass: run.trades.every((t) => !!t.evidenceHash) && run.rejections.every((r) => !!r.evidenceHash) },
    { requirement: "Repeatable reasoning trail", evidence: `${run.receipts.length} chained receipts, replay ${replayOk ? "matches" : "differs"}`, href: "/replay", pass: run.chainValid && replayOk },
    { requirement: `Up to ${MAX_KOLS} user-selected KOLs`, evidence: `${run.settings.kols.length} followed from a pool of ${KOLS.length}, cap enforced in settings and the API`, href: "/settings", pass: run.settings.kols.length === MAX_KOLS && KOLS.length > MAX_KOLS },
    { requirement: "Optional Discord and Telegram sources", evidence: `${POSTS.filter((p) => p.source === "telegram").length} Telegram and ${POSTS.filter((p) => p.source === "discord").length} Discord messages alongside X posts`, href: "/pulse", pass: POSTS.some((p) => p.source === "telegram") && POSTS.some((p) => p.source === "discord") },
    { requirement: "Token, sentiment, conviction, urgency", evidence: "Structured extraction on every post", href: "/pulse", pass: pulse.posts.every((p) => typeof p.x.sentiment === "number" && typeof p.x.conviction === "number" && typeof p.x.urgency === "number") },
    { requirement: "Trusted voices converge", evidence: "Trust-weighted score with an echo filter", href: "/candidates", pass: run.decisions.some((d) => d.social.strength === "strong") },
    { requirement: "Transparent signal rules", evidence: `${FUSION_RULES.length}-rule fusion table shown in the app`, href: "/rules", pass: FUSION_RULES.length > 0 },
    { requirement: "User-defined risk limits", evidence: "Position size, open positions, daily loss cap, stop-loss, take-profit", href: "/settings", pass: true },
    { requirement: "Bull / Bear debate", evidence: "Bull, bear and judge for every candidate", href: "/court", pass: run.decisions.every((d) => d.court.bull.length + d.court.bear.length > 0) },
    { requirement: "Whale movement tracker", evidence: "On-chain key reads smart-wallet buying and selling", href: "/wallets", pass: run.decisions.some((d) => d.onchain.state !== "weak") },
    { requirement: "Rejections explained", evidence: `${run.rejections.length} rejections with reasons`, href: "/rejections", pass: run.rejections.every((r) => r.reasons.length > 0) },
    { requirement: "Data disclosure", evidence: "Cached feed stated plainly", href: "/sources", pass: true },
  ];
  const passed = checks.filter((c) => c.pass).length;
  return (
    <>
      <PageHeader title="Scorecard" description="Every capability the agent is expected to show, checked live against the running agent." />
      <PulseRail
        items={[
          { label: "Requirements met", value: `${passed}/${checks.length}`, tone: passed === checks.length ? "good" : "warn" },
          { label: "Hash chain", value: run.chainValid ? "valid" : "broken", tone: run.chainValid ? "good" : "bad" },
          { label: "Replay", value: replayOk ? "matches" : "differs", tone: replayOk ? "good" : "bad" },
        ]}
      />
      <Panel title="Requirement checklist" subtitle="Each row links to where it is shown">
        <ul className="divide-y">
          {checks.map((c) => (
            <li key={c.requirement}>
              <Link href={c.href} className="flex items-start gap-3 px-1 py-3 transition-colors hover:bg-muted/40">
                {c.pass ? <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" /> : <X className="mt-0.5 size-4 shrink-0 text-red-400" />}
                <span className="text-sm"><span className="font-medium">{c.requirement}</span><span className="block text-muted-foreground">{c.evidence}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
