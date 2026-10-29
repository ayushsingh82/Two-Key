import type { Settings } from "./types";

export const MAX_KOLS = 20;

export const DEFAULT_SETTINGS: Settings = {
  kols: [],
  equityUsd: 1000,
  maxPositionUsd: 200,
  maxOpenPositions: 3,
  dailyLossCapUsd: 100,
  stopLossPct: 8,
  takeProfitPct: 20,
  windowHours: 6,
  minVoices: 3,
  socialStrongScore: 0.5,
  onchainStrongUsd: 250_000,
  onchainSellUsd: 150_000,
  minLiquidityUsd: 1_000_000,
};

export function validateSettings(s: Settings): string[] {
  const errors: string[] = [];
  if (s.kols.length > MAX_KOLS) errors.push(`At most ${MAX_KOLS} KOLs are allowed, got ${s.kols.length}`);
  if (s.maxPositionUsd > s.equityUsd) errors.push("maxPositionUsd cannot exceed equityUsd");
  if (s.stopLossPct <= 0 || s.takeProfitPct <= 0) errors.push("stopLossPct and takeProfitPct must be positive");
  if (s.maxOpenPositions < 1) errors.push("maxOpenPositions must be at least 1");
  return errors;
}
