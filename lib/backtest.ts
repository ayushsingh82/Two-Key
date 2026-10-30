import { MARKET } from "./data";
import { runPipeline } from "./pipeline";
import { hypotheticalPnl } from "./trade";
import type { Settings } from "./types";

export type BacktestRow = { token: string; action: string; twoKeyPnl: number; naivePnl: number };

/**
 * Compares Two-Key against a naive agent that trades every token the KOLs mention at full size.
 * Both use the same price paths, stop-loss and take-profit.
 */
export function backtest(overrides: Partial<Settings> = {}) {
  const run = runPipeline(overrides);
  const rows: BacktestRow[] = run.decisions.map((d) => {
    const trade = run.trades.find((t) => t.token === d.token);
    const m = MARKET.find((x) => x.token === d.token)!;
    return { token: d.token, action: d.action, twoKeyPnl: trade?.pnlUsd ?? 0, naivePnl: hypotheticalPnl(m, run.settings) };
  });
  const sum = (f: (r: BacktestRow) => number) => Math.round(rows.reduce((n, r) => n + f(r), 0) * 100) / 100;
  const naiveWins = rows.filter((r) => r.naivePnl > 0).length;
  const twoKeyDeployed = run.trades.reduce((n, t) => n + t.sizeUsd, 0);
  const naiveDeployed = rows.length * run.settings.maxPositionUsd;
  const pct = (pnl: number, deployed: number) => (deployed ? Math.round((pnl / deployed) * 1000) / 10 : 0);
  return {
    rows,
    twoKeyDeployed,
    naiveDeployed,
    twoKeyReturnPct: pct(sum((r) => r.twoKeyPnl), twoKeyDeployed),
    naiveReturnPct: pct(sum((r) => r.naivePnl), naiveDeployed),
    twoKeyPnl: sum((r) => r.twoKeyPnl),
    naivePnl: sum((r) => r.naivePnl),
    twoKeyTrades: run.trades.length,
    naiveTrades: rows.length,
    twoKeyWinRate: run.trades.length ? Math.round((run.stats.wins / run.trades.length) * 100) : 0,
    naiveWinRate: rows.length ? Math.round((naiveWins / rows.length) * 100) : 0,
  };
}
