import type { Fusion, OnchainSignal, SocialSignal } from "./types";

/** The visible rule table. Rule numbers match the README. */
export const FUSION_RULES: { rule: number; social: string; onchain: string; action: Fusion["action"]; label: string }[] = [
  { rule: 1, social: "strong", onchain: "strong", action: "full", label: "Both keys turned" },
  { rule: 2, social: "strong", onchain: "weak", action: "small", label: "Hype without money" },
  { rule: 3, social: "weak", onchain: "strong", action: "watchlist", label: "Money without story" },
  { rule: 4, social: "weak", onchain: "weak", action: "reject", label: "No signal" },
  { rule: 5, social: "any", onchain: "selling", action: "reject", label: "Whales selling, possible exit liquidity" },
];

export function fuse(social: SocialSignal, onchain: OnchainSignal): Fusion {
  const pick = (rule: number) => {
    const r = FUSION_RULES.find((x) => x.rule === rule)!;
    return { action: r.action, label: r.label, rule };
  };
  if (onchain.state === "selling") return pick(5);
  if (social.strength === "strong") return onchain.state === "strong" ? pick(1) : pick(2);
  return onchain.state === "strong" ? pick(3) : pick(4);
}
