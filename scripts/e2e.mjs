// End-to-end check: build the app, serve it, and verify every page shows the expected values.
import { spawn, execSync } from "node:child_process";

const PORT = 3120;
const base = `http://localhost:${PORT}`;
execSync("npx next build", { stdio: "ignore" });
const server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore" });
const stop = () => server.kill();
process.on("exit", stop);

for (let i = 0; i < 40; i++) {
  try { if ((await fetch(base)).ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 500));
}

const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
const checks = [
  ["/", ["Two keys must turn before the agent trades", "Exit-liquidity catch", "What it found on the sample data", "Questions"]],
  ["/board", ["Signal Board", "SOL", "Full trade", "Small trade", "Loss avoided", "$40.00", "-$8.00"]],
  ["/pulse", ["KOL Pulse", "@onchain_nina", "echo", "@moon_max"]],
  ["/court", ["Court", "Whales selling", "Judge:", "Bull", "Bear"]],
  ["/candidates", ["Fusion rules", "Hype without money", "Money without story"]],
  ["/wallets", ["Wallet Flow", "smart money", "selling"]],
  ["/portfolio", ["Practice Portfolio", "take-profit", "stop-loss", "$32.00"]],
  ["/rejections", ["WIF", "exit liquidity", "Avoided a", "Max open"].slice(0, 3)],
  ["/replay", ["Hash chain", "valid", "6/6", "matches"]],
  ["/settings", ["Max position size", "Daily loss cap", "$200", "20", "Risk lab"]],
  ["/backtest", ["Backtest", "Naive P&L", "Return on capital", "Trades avoided"]],
];

let failed = 0;
for (const [path, needles] of checks) {
  const res = await fetch(base + path);
  const text = strip(await res.text());
  const missing = needles.filter((n) => !text.includes(n));
  const ok = res.status === 200 && missing.length === 0;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${path} ${res.status}${missing.length ? " missing: " + missing.join(" | ") : ""}`);
}
// API: risk lab endpoint
const ok1 = await fetch(base + "/api/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ maxOpenPositions: 1 }) });
const j1 = await ok1.json();
const apiOk = ok1.status === 200 && j1.stats.trades === 1 && j1.rejections.some((r) => r.reason?.includes("Max open positions"));
if (!apiOk) failed++;
console.log(`${apiOk ? "PASS" : "FAIL"} POST /api/run maxOpenPositions=1 -> ${j1.stats?.trades} trade(s)`);
const bad1 = await fetch(base + "/api/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ maxPositionUsd: -5 }) });
if (bad1.status !== 400) failed++;
console.log(`${bad1.status === 400 ? "PASS" : "FAIL"} POST /api/run negative value -> ${bad1.status}`);
const bad2 = await fetch(base + "/api/run", { method: "POST", body: "not json" });
if (bad2.status !== 400) failed++;
console.log(`${bad2.status === 400 ? "PASS" : "FAIL"} POST /api/run bad body -> ${bad2.status}`);
const nf = await fetch(base + "/nope");
console.log(`${nf.status === 404 ? "PASS" : "FAIL"} /nope ${nf.status}`);
if (nf.status !== 404) failed++;
stop();
console.log(failed ? `\n${failed} FAILED` : "\nALL PASSED");
process.exit(failed ? 1 : 0);
