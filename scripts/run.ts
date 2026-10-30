import { runPipeline } from "../lib/pipeline";
import { replay } from "../lib/snapshot";

const r = runPipeline();
console.log("== Decisions ==");
for (const d of r.decisions) {
  console.log(`${d.token.padEnd(5)} social=${d.social.strength}(${d.social.score}) onchain=${d.onchain.state} rule=${d.fusion.rule} -> ${d.action}`);
}
console.log("\n== Trades ==");
for (const t of r.trades) console.log(`${t.token} $${t.sizeUsd} ${t.exitReason} pnl $${t.pnlUsd}`);
console.log("\n== Rejections ==");
for (const x of r.rejections) console.log(`${x.token} ${x.action} saved $${x.savedUsd}\n  ${x.reasons.at(-1)}`);
console.log("\n== Stats ==", r.stats, "chainValid", r.chainValid);
const first = replay(r.evidence[0], r.receipts[0]);
console.log("replay matches:", first.matches);
