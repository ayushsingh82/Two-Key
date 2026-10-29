import { court } from "./court";
import { fuse } from "./fusion";
import { onchainSignal, socialSignal } from "./converge";
import type { Decision, Evidence } from "./types";

/** Pure function of the evidence. Replay calls this again and compares hashes. */
export function decide(ev: Evidence): Decision {
  const social = socialSignal(ev);
  const onchain = onchainSignal(ev);
  const fusion = fuse(social, onchain);
  const result = court(ev, social, onchain, fusion);
  const reasons = [`Social: ${social.strength} (${social.bullishVoices} bullish voices, score ${social.score})`, `On-chain: ${onchain.state} (net $${onchain.netSmartUsd.toLocaleString("en-US")})`, `Fusion rule ${fusion.rule}: ${fusion.label}`, result.reason];
  return { token: ev.token, social, onchain, fusion, court: result, action: result.verdict, reasons };
}
