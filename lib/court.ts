import type { CourtResult, Evidence, Fusion, FusionAction, OnchainSignal, SocialSignal } from "./types";

const DOWNGRADE: Record<FusionAction, FusionAction> = { full: "small", small: "watchlist", watchlist: "watchlist", reject: "reject" };

/**
 * Deterministic bull, bear and judge. Both sides argue from the same evidence and
 * the judge compares counts. It can downgrade a trade but never upgrade a rejection.
 */
export function court(ev: Evidence, social: SocialSignal, onchain: OnchainSignal, fusion: Fusion): CourtResult {
  const { market, settings } = ev;
  const bull: string[] = [];
  const bear: string[] = [];
  const avgTrust = social.contributors.length ? social.contributors.reduce((n, c) => n + c.trust, 0) / social.contributors.length : 0;

  if (social.bullishVoices >= settings.minVoices) bull.push(`${social.bullishVoices} KOLs are bullish on ${ev.token}`);
  if (avgTrust >= 0.6) bull.push(`Average KOL trust is ${avgTrust.toFixed(2)}`);
  if (onchain.state === "strong") bull.push(`Smart wallets net bought $${onchain.netSmartUsd.toLocaleString("en-US")} from ${onchain.smartBuyers} wallets`);
  if (market.change24h > 2 && market.change24h < 25) bull.push(`Healthy momentum, ${market.change24h}% in 24h`);

  if (social.echoPosts > 0) bear.push(`${social.echoPosts} copied posts were filtered out as echoes`);
  if (market.liquidityUsd < settings.minLiquidityUsd) bear.push(`Liquidity $${market.liquidityUsd.toLocaleString("en-US")} is under the $${settings.minLiquidityUsd.toLocaleString("en-US")} minimum`);
  if (market.change24h >= 25) bear.push(`Overextended, already up ${market.change24h}% in 24h`);
  if (onchain.state === "selling") bear.push(`Smart wallets net sold $${Math.abs(onchain.netSmartUsd).toLocaleString("en-US")}`);
  if (social.strength === "strong" && onchain.state === "weak") bear.push("No on-chain confirmation of the narrative");
  if (avgTrust > 0 && avgTrust < 0.4) bear.push(`Average KOL trust is only ${avgTrust.toFixed(2)}`);

  const bullScore = bull.length;
  const bearScore = bear.length;
  let verdict = fusion.action;
  let reason = `Fusion rule ${fusion.rule} stands: ${fusion.label}`;
  if (fusion.action === "reject") {
    reason = `Rejected by fusion rule ${fusion.rule}: ${fusion.label}`;
  } else if (bearScore >= bullScore && bearScore > 0) {
    verdict = DOWNGRADE[fusion.action];
    reason = `Bear case (${bearScore}) matches or beats bull case (${bullScore}), downgraded to ${verdict}`;
  }
  return { bull, bear, bullScore, bearScore, verdict, reason };
}
