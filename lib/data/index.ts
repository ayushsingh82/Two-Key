import type { Kol, Market, Post, WalletEvent } from "../types";

/**
 * Mock dataset. The X feed is a cached sample shaped like real posts, not a live X API pull.
 * Time is fixed so every run and replay is deterministic.
 */
export const NOW = Date.parse("2026-10-28T12:00:00Z");
const H = 3_600_000;
const ago = (hours: number) => NOW - hours * H;

const call = (token: string, hoursAgo: number, direction: "long" | "short", ret24h: number) => ({
  token,
  ts: ago(hoursAgo),
  direction,
  ret24h,
});

export const KOLS: Kol[] = [
  { handle: "@alpha_arc", calls: [call("SOL", 200, "long", 6), call("JUP", 180, "long", 4), call("WIF", 160, "long", 9), call("BONK", 140, "long", -2), call("SOL", 120, "long", 3)] },
  { handle: "@onchain_nina", calls: [call("SOL", 220, "long", 5), call("RNDR", 190, "long", 7), call("JUP", 150, "long", 2), call("WIF", 130, "short", -6)] },
  { handle: "@degen_dave", calls: [call("WIF", 210, "long", 12), call("BONK", 170, "long", -9), call("JUP", 120, "long", -4), call("DOGE", 100, "long", -3)] },
  { handle: "@macro_mia", calls: [call("SOL", 230, "long", 4), call("RNDR", 200, "long", 3), call("DOGE", 160, "short", 2), call("JUP", 110, "long", 5)] },
  { handle: "@signal_sam", calls: [call("SOL", 240, "long", 7), call("WIF", 175, "long", 6), call("JUP", 130, "long", 3), call("RNDR", 90, "long", -1)] },
  { handle: "@moon_max", calls: [call("DOGE", 220, "long", -8), call("BONK", 190, "long", -10), call("WIF", 150, "long", -5), call("JUP", 100, "long", -6)] },
  { handle: "@clone_carl", calls: [call("DOGE", 210, "long", -4), call("BONK", 170, "long", -7), call("JUP", 120, "long", -3)] },
  { handle: "@echo_eve", calls: [call("DOGE", 200, "long", -6), call("WIF", 150, "long", -4), call("BONK", 110, "long", -8)] },
  { handle: "@quiet_quinn", calls: [call("BONK", 180, "long", 8), call("SOL", 140, "long", 5), call("RNDR", 100, "long", 4)] },
];

export const POSTS: Post[] = [
  // SOL: four trusted voices, independent wording
  { id: "p1", kol: "@alpha_arc", ts: ago(1.0), text: "Accumulating $SOL here. Breakout from the range is confirmed, I am all in on this move before the open." },
  { id: "p2", kol: "@onchain_nina", ts: ago(1.5), text: "$SOL flows look clean, smart wallets are buying every dip. Bullish into the weekend." },
  { id: "p3", kol: "@macro_mia", ts: ago(2.2), text: "Rates are easing and $SOL is the cleanest L1 setup on my screen. Long, high conviction." },
  { id: "p4", kol: "@signal_sam", ts: ago(2.8), text: "Loading $SOL on this retest. Buying now, stop is tight." },
  // JUP: hype without money
  { id: "p5", kol: "@alpha_arc", ts: ago(1.2), text: "$JUP looks strong, buying the breakout today." },
  { id: "p6", kol: "@degen_dave", ts: ago(1.8), text: "$JUP is about to run, long and loud, hurry before it moves!" },
  { id: "p7", kol: "@macro_mia", ts: ago(3.0), text: "Accumulate $JUP, the buyback narrative is bullish." },
  // WIF: strong social, whales selling (exit liquidity)
  { id: "p8", kol: "@alpha_arc", ts: ago(0.8), text: "$WIF to the moon, I am all in, buying more right now." },
  { id: "p9", kol: "@degen_dave", ts: ago(1.4), text: "$WIF is the play. Long, huge conviction, last chance to get in!" },
  { id: "p10", kol: "@signal_sam", ts: ago(2.0), text: "Bullish on $WIF, loading now." },
  { id: "p11", kol: "@onchain_nina", ts: ago(2.6), text: "Long $WIF, momentum is strong, buying today." },
  // BONK: weak social, strong on-chain
  { id: "p12", kol: "@quiet_quinn", ts: ago(4.0), text: "Watching $BONK, might accumulate if it holds." },
  // DOGE: copy-pasted shill from low-trust accounts (echo)
  { id: "p13", kol: "@moon_max", ts: ago(1.0), text: "$DOGE to the moon!! All in, buying now, last chance before it pumps, bullish bullish bullish." },
  { id: "p14", kol: "@clone_carl", ts: ago(1.1), text: "$DOGE to the moon!! All in, buying now, last chance before it pumps, bullish bullish bullish." },
  { id: "p15", kol: "@echo_eve", ts: ago(1.2), text: "$DOGE to the moon!! All in buying now, last chance before it pumps, bullish bullish bullish." },
  // RNDR: one lukewarm voice
  { id: "p16", kol: "@macro_mia", ts: ago(5.0), text: "$RNDR might be interesting, watching." },
];

const wallet = (token: string, side: "buy" | "sell", usd: number, hoursAgo: number, w: string, smart = true): WalletEvent => ({
  token,
  side,
  usd,
  ts: ago(hoursAgo),
  wallet: w,
  smart,
});

export const WALLET_EVENTS: WalletEvent[] = [
  wallet("SOL", "buy", 300_000, 2, "0xwhale1"),
  wallet("SOL", "buy", 220_000, 4, "0xwhale2"),
  wallet("SOL", "buy", 150_000, 6, "0xfund3"),
  wallet("SOL", "sell", 40_000, 8, "0xfund4"),
  wallet("JUP", "buy", 30_000, 3, "0xsmart5"),
  wallet("JUP", "sell", 20_000, 5, "0xsmart6"),
  wallet("WIF", "sell", 400_000, 1, "0xwhale7"),
  wallet("WIF", "sell", 250_000, 3, "0xwhale8"),
  wallet("WIF", "buy", 30_000, 6, "0xsmart9"),
  wallet("BONK", "buy", 280_000, 2, "0xwhale10"),
  wallet("BONK", "buy", 200_000, 5, "0xwhale11"),
  wallet("BONK", "buy", 120_000, 9, "0xfund12"),
  wallet("DOGE", "buy", 5_000, 4, "0xretail13", false),
  wallet("RNDR", "buy", 12_000, 7, "0xsmart14"),
];

export const MARKET: Market[] = [
  { token: "SOL", price: 182.4, change24h: 4.2, volume24h: 3_400_000_000, liquidityUsd: 900_000_000, outcomePath: [183, 185, 187, 190, 193, 196, 199, 204, 208, 213, 218, 224] },
  { token: "JUP", price: 1.12, change24h: 9.5, volume24h: 210_000_000, liquidityUsd: 45_000_000, outcomePath: [1.12, 1.11, 1.1, 1.07, 1.03, 1.0, 1.02, 1.04, 1.01, 0.99, 1.0, 1.01] },
  { token: "WIF", price: 2.64, change24h: 31.0, volume24h: 520_000_000, liquidityUsd: 38_000_000, outcomePath: [2.6, 2.5, 2.4, 2.3, 2.22, 2.1, 2.0, 1.95, 1.9, 1.85, 1.8, 1.78] },
  { token: "BONK", price: 0.000031, change24h: 2.1, volume24h: 180_000_000, liquidityUsd: 30_000_000, outcomePath: [0.000031, 0.000032, 0.000033, 0.000035, 0.000036, 0.000038, 0.00004, 0.000041, 0.000042, 0.000044, 0.000045, 0.000046] },
  { token: "DOGE", price: 0.19, change24h: 14.0, volume24h: 1_100_000_000, liquidityUsd: 500_000, outcomePath: [0.19, 0.185, 0.18, 0.178, 0.17, 0.168, 0.165, 0.16, 0.158, 0.155, 0.152, 0.15] },
  { token: "RNDR", price: 7.8, change24h: 0.6, volume24h: 90_000_000, liquidityUsd: 20_000_000, outcomePath: [7.8, 7.81, 7.79, 7.8, 7.82, 7.8, 7.79, 7.81, 7.8, 7.8, 7.81, 7.8] },
];
