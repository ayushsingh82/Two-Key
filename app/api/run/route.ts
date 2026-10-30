import { NextResponse } from "next/server";
import { backtest } from "@/lib/backtest";
import { runPipeline } from "@/lib/pipeline";
import type { Settings } from "@/lib/types";

const NUMERIC = ["maxPositionUsd", "maxOpenPositions", "dailyLossCapUsd", "stopLossPct", "takeProfitPct", "minVoices"] as const;

/** Re-runs the agent with user-chosen risk limits. Only known numeric fields are accepted. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON" }, { status: 400 });
  }
  const overrides: Partial<Settings> = {};
  for (const key of NUMERIC) {
    if (body[key] === undefined) continue;
    const n = Number(body[key]);
    if (!Number.isFinite(n) || n <= 0 || n > 1_000_000) return NextResponse.json({ error: `${key} must be a positive number` }, { status: 400 });
    overrides[key] = n;
  }
  try {
    const run = runPipeline(overrides);
    return NextResponse.json({
      stats: run.stats,
      trades: run.trades.map((t) => ({ token: t.token, sizeUsd: t.sizeUsd, exitReason: t.exitReason, pnlUsd: t.pnlUsd })),
      rejections: run.rejections.map((r) => ({ token: r.token, reason: r.reasons.at(-1) })),
      backtest: backtest(overrides),
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid settings" }, { status: 400 });
  }
}
