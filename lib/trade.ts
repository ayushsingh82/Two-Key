import type { Decision, Market, Rejection, Settings, Trade } from "./types";

const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

/** Walk the price path after entry and close on stop-loss, take-profit, or the last price. */
export function simulateExit(entry: number, path: number[], stopPct: number, tpPct: number) {
  const stop = entry * (1 - stopPct / 100);
  const tp = entry * (1 + tpPct / 100);
  for (const p of path) {
    if (p <= stop) return { exit: stop, reason: "stop-loss" as const };
    if (p >= tp) return { exit: tp, reason: "take-profit" as const };
  }
  return { exit: path[path.length - 1] ?? entry, reason: "time-exit" as const };
}

/** P&L if we had traded a decision we skipped. Used to show what a rejection saved. */
export function hypotheticalPnl(market: Market, settings: Settings): number {
  const { exit } = simulateExit(market.price, market.outcomePath, settings.stopLossPct, settings.takeProfitPct);
  return round(settings.maxPositionUsd * (exit / market.price - 1));
}

export type PortfolioState = { realizedLossTodayUsd: number };

export type TradeRun = { trades: Trade[]; rejections: Rejection[]; exposureUsd: number };

const ORDER = { full: 0, small: 1, watchlist: 2, reject: 3 } as const;

/**
 * Opens practice trades for approved decisions, strongest first, and enforces the
 * user's risk limits. Anything blocked becomes a rejection with the reason.
 */
export function runTrades(
  decisions: { decision: Decision; market: Market; evidenceHash: string }[],
  settings: Settings,
  state: PortfolioState = { realizedLossTodayUsd: 0 },
): TradeRun {
  const trades: Trade[] = [];
  const rejections: Rejection[] = [];
  let exposure = 0;
  const ordered = [...decisions].sort((a, b) => ORDER[a.decision.action] - ORDER[b.decision.action] || b.decision.social.score - a.decision.social.score);

  for (const { decision, market, evidenceHash } of ordered) {
    const { action, token } = decision;
    if (action === "reject" || action === "watchlist") {
      rejections.push({ token, action, reasons: decision.reasons, evidenceHash });
      continue;
    }
    const size = action === "full" ? settings.maxPositionUsd : settings.maxPositionUsd / 2;
    const block =
      state.realizedLossTodayUsd >= settings.dailyLossCapUsd
        ? `Daily loss cap $${settings.dailyLossCapUsd} reached`
        : trades.length >= settings.maxOpenPositions
          ? `Max open positions (${settings.maxOpenPositions}) reached`
          : exposure + size > settings.equityUsd
            ? "Not enough equity for this position"
            : null;
    if (block) {
      rejections.push({ token, action: "reject", reasons: [...decision.reasons, `Risk limit: ${block}`], evidenceHash });
      continue;
    }
    const entry = market.price;
    const { exit, reason } = simulateExit(entry, market.outcomePath, settings.stopLossPct, settings.takeProfitPct);
    exposure += size;
    trades.push({
      id: `t${trades.length + 1}`,
      token,
      entry,
      sizeUsd: size,
      stopLoss: entry * (1 - settings.stopLossPct / 100),
      takeProfit: entry * (1 + settings.takeProfitPct / 100),
      exit,
      exitReason: reason,
      pnlUsd: round(size * (exit / entry - 1)),
      evidenceHash,
    });
  }
  return { trades, rejections, exposureUsd: exposure };
}
