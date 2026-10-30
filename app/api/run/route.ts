import { NextResponse } from "next/server";
import { backtest } from "@/lib/backtest";
import { KOLS } from "@/lib/data";
import { runPipeline } from "@/lib/pipeline";
import type { Settings } from "@/lib/types";

const NUMERIC = ["maxPositionUsd", "maxOpenPositions", "dailyLossCapUsd", "stopLossPct", "takeProfitPct", "minVoices"] as const;

/** Re-runs the agent with user-chosen risk limits and KOLs. Only known numeric fields and known handles are accepted. */
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
  if (body.kols !== undefined) {
    const known = new Set(KOLS.map((k) => k.handle));
    if (!Array.isArray(body.kols) || !body.kols.every((k) => typeof k === "string" && known.has(k))) {
      return NextResponse.json({ error: "kols must be a list of known KOL handles" }, { status: 400 });
    }
    overrides.kols = body.kols;
  }
  try {
    const run = runPipeline(overrides);
    return NextResponse.json({
      kols: run.settings.kols.length,
      stats: run.stats,
      trades: run.trades.map((t) => ({ token: t.token, sizeUsd: t.sizeUsd, exitReason: t.exitReason, pnlUsd: t.pnlUsd })),
      rejections: run.rejections.map((r) => ({ token: r.token, reason: r.reasons.at(-1) })),
      backtest: backtest(overrides),
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid settings" }, { status: 400 });
  }
}
