import assert from "node:assert/strict";
import test from "node:test";
import { KOLS, POSTS } from "./data";
import { extractPost } from "./extract";
import { runPipeline } from "./pipeline";
import { MAX_KOLS, validateSettings, DEFAULT_SETTINGS } from "./settings";
import { replay, verifyChain } from "./snapshot";
import { simulateExit } from "./trade";
import { findEchoes, trustScore } from "./trust";

const action = (r: ReturnType<typeof runPipeline>, t: string) => r.decisions.find((d) => d.token === t)?.action;

test("extraction reads token, sentiment, conviction and urgency", () => {
  const x = extractPost(POSTS[0]);
  assert.equal(x.token, "SOL");
  assert.ok(x.sentiment > 0.5);
  assert.ok(x.conviction >= 0.7);
  assert.ok(x.urgency > 0.1);
});

test("hedged posts get low conviction", () => {
  const x = extractPost(POSTS.find((p) => p.id === "p12")!);
  assert.ok(x.conviction <= 0.25);
});

test("trust score rewards a good record and punishes a bad one", () => {
  const good = trustScore(KOLS.find((k) => k.handle === "@onchain_nina")!);
  const bad = trustScore(KOLS.find((k) => k.handle === "@moon_max")!);
  assert.ok(good > 0.7 && bad < 0.3);
  assert.equal(trustScore({ handle: "@new", calls: [] }), 0.5);
});

test("echo filter flags copied posts but keeps the original", () => {
  const echoes = findEchoes(POSTS.filter((p) => ["p13", "p14", "p15"].includes(p.id)));
  assert.deepEqual([...echoes].sort(), ["p13", "p14"]); // p15 posted first
});

test("fusion table drives each scenario", () => {
  const r = runPipeline();
  assert.equal(action(r, "SOL"), "full"); // rule 1
  assert.equal(action(r, "JUP"), "small"); // rule 2, hype without money
  assert.equal(action(r, "WIF"), "reject"); // rule 5, exit liquidity
  assert.equal(action(r, "BONK"), "watchlist"); // rule 3
  assert.equal(action(r, "DOGE"), "reject"); // echoes plus thin liquidity
});

test("trades record entry, size, exit and pnl", () => {
  const r = runPipeline();
  const sol = r.trades.find((t) => t.token === "SOL")!;
  assert.equal(sol.sizeUsd, 200);
  assert.equal(sol.exitReason, "take-profit");
  assert.ok(sol.pnlUsd > 0);
  const jup = r.trades.find((t) => t.token === "JUP")!;
  assert.equal(jup.sizeUsd, 100);
  assert.equal(jup.exitReason, "stop-loss");
  assert.ok(jup.pnlUsd < 0);
});

test("rejections show what they saved", () => {
  const r = runPipeline();
  const wif = r.rejections.find((x) => x.token === "WIF")!;
  assert.ok(wif.savedUsd > 0);
  assert.ok(wif.reasons.some((x) => x.includes("exit liquidity")));
});

test("risk limits block extra trades", () => {
  const capped = runPipeline({ maxOpenPositions: 1 });
  assert.equal(capped.trades.length, 1);
  assert.ok(capped.rejections.find((x) => x.token === "JUP")?.reasons.at(-1)?.includes("Max open positions"));
  const lossCap = runPipeline({}, { realizedLossTodayUsd: 100 });
  assert.equal(lossCap.trades.length, 0);
});

test("stop-loss and take-profit exits", () => {
  assert.equal(simulateExit(100, [99, 90], 8, 20).reason, "stop-loss");
  assert.equal(simulateExit(100, [101, 125], 8, 20).reason, "take-profit");
  assert.equal(simulateExit(100, [101, 102], 8, 20).reason, "time-exit");
});

test("replay reproduces every decision and the hash chain verifies", () => {
  const r = runPipeline();
  assert.ok(r.chainValid);
  r.evidence.forEach((ev, i) => assert.ok(replay(ev, r.receipts[i]).matches));
});

test("tampering with evidence or the chain is detected", () => {
  const r = runPipeline();
  const ev = structuredClone(r.evidence[0]);
  ev.market.change24h = 99;
  assert.equal(replay(ev, r.receipts[0]).matches, false);
  const chain = structuredClone(r.receipts);
  chain[1].decisionHash = "x";
  assert.equal(verifyChain(chain), false);
});

test("settings enforce the 20 KOL cap", () => {
  const kols = Array.from({ length: MAX_KOLS + 1 }, (_, i) => `@k${i}`);
  assert.ok(validateSettings({ ...DEFAULT_SETTINGS, kols }).length > 0);
  assert.throws(() => runPipeline({ kols }));
});

test("same inputs always give the same result", () => {
  assert.deepEqual(runPipeline().receipts, runPipeline().receipts);
});

test("backtest compares Two-Key with a naive agent on equal footing", async () => {
  const { backtest } = await import("./backtest");
  const b = backtest();
  assert.equal(b.naiveTrades, 6);
  assert.equal(b.twoKeyTrades, 2);
  // Same P&L on the sample data, because Two-Key skips the BONK winner, but far less capital at risk.
  assert.ok(b.twoKeyDeployed < b.naiveDeployed);
  assert.ok(b.twoKeyReturnPct > b.naiveReturnPct);
});

test("a pool of more than 20 KOLs is available and exactly 20 are followed by default", () => {
  assert.ok(KOLS.length > MAX_KOLS);
  const r = runPipeline();
  assert.equal(r.settings.kols.length, MAX_KOLS);
});

test("posts from KOLs that are not followed are ignored, and swapping them in changes the result", () => {
  const base = runPipeline();
  const bonk = base.evidence.find((e) => e.token === "BONK")!;
  assert.ok(!bonk.posts.some((p) => ["@hype_hana", "@bot_bart"].includes(p.kol)));
  const swapped = runPipeline({ kols: [...base.settings.kols.slice(0, MAX_KOLS - 2), "@hype_hana", "@bot_bart"] });
  assert.ok(swapped.evidence.find((e) => e.token === "BONK")!.posts.some((p) => p.kol === "@hype_hana"));
});

test("Telegram and Discord posts are read alongside X posts", () => {
  const sources = new Set(POSTS.map((p) => p.source ?? "x"));
  assert.deepEqual([...sources].sort(), ["discord", "telegram", "x"]);
  const r = runPipeline();
  const sol = r.evidence.find((e) => e.token === "SOL")!;
  assert.ok(sol.posts.some((p) => p.source === "telegram") && sol.posts.some((p) => p.source === "discord"));
});
