import { KOLS, MARKET, NOW, POSTS, WALLET_EVENTS } from "./data";
import { decide } from "./decide";
import { extractAll } from "./extract";
import { sha256 } from "./hash";
import { DEFAULT_SETTINGS, MAX_KOLS, validateSettings } from "./settings";
import { appendReceipt, verifyChain } from "./snapshot";
import { hypotheticalPnl, runTrades, type PortfolioState } from "./trade";
import { trustMap } from "./trust";
import type { Decision, Evidence, Extraction, Market, Post, Receipt, Rejection, Settings, Trade } from "./types";

export type PipelineResult = {
  settings: Settings;
  evidence: Evidence[];
  decisions: Decision[];
  trades: Trade[];
  rejections: (Rejection & { savedUsd: number })[];
  receipts: Receipt[];
  chainValid: boolean;
  stats: { trades: number; wins: number; totalPnlUsd: number; rejected: number; lossAvoidedUsd: number };
};

export function defaultSettings(): Settings {
  return { ...DEFAULT_SETTINGS, kols: KOLS.slice(0, MAX_KOLS).map((k) => k.handle) };
}

/** Builds the evidence for one token. Everything a decision depends on is inside it. */
export function buildEvidence(token: string, settings: Settings, posts: Post[], extractions: Extraction[], market: Market, now = NOW): Evidence {
  const ids = new Set(extractions.filter((e) => e.token === token).map((e) => e.postId));
  return {
    now,
    token,
    settings,
    posts: posts.filter((p) => ids.has(p.id)),
    extractions: extractions.filter((e) => ids.has(e.postId)),
    trust: trustMap(KOLS),
    walletEvents: WALLET_EVENTS.filter((e) => e.token === token),
    market,
  };
}

export function runPipeline(overrides: Partial<Settings> = {}, state?: PortfolioState, extractions?: Extraction[]): PipelineResult {
  const settings = { ...defaultSettings(), ...overrides };
  const errors = validateSettings(settings);
  if (errors.length) throw new Error(errors.join("; "));

  const watched = POSTS.filter((p) => settings.kols.includes(p.kol));
  const ex = extractions ?? extractAll(watched);
  const tokens = [...new Set(ex.map((e) => e.token).filter((t): t is string => !!t))];

  const receipts: Receipt[] = [];
  const evidence: Evidence[] = [];
  const decisions: Decision[] = [];
  const items: { decision: Decision; market: Market; evidenceHash: string }[] = [];

  for (const token of tokens) {
    const market = MARKET.find((m) => m.token === token);
    if (!market) continue;
    const ev = buildEvidence(token, settings, watched, ex, market);
    const decision = decide(ev);
    appendReceipt(receipts, ev, decision);
    evidence.push(ev);
    decisions.push(decision);
    items.push({ decision, market, evidenceHash: sha256(ev) });
  }

  const run = runTrades(items, settings, state);
  const rejections = run.rejections.map((r) => {
    const m = MARKET.find((x) => x.token === r.token)!;
    return { ...r, savedUsd: -hypotheticalPnl(m, settings) };
  });
  const wins = run.trades.filter((t) => t.pnlUsd > 0).length;
  return {
    settings,
    evidence,
    decisions,
    trades: run.trades,
    rejections,
    receipts,
    chainValid: verifyChain(receipts),
    stats: {
      trades: run.trades.length,
      wins,
      totalPnlUsd: Math.round(run.trades.reduce((n, t) => n + t.pnlUsd, 0) * 100) / 100,
      rejected: rejections.length,
      lossAvoidedUsd: Math.round(rejections.filter((r) => r.savedUsd > 0).reduce((n, r) => n + r.savedUsd, 0) * 100) / 100,
    },
  };
}
