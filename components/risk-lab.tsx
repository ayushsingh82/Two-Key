"use client";

import { useState } from "react";
import { MAX_KOLS } from "@/lib/settings";
import { cn } from "@/lib/utils";

type Result = {
  kols: number;
  stats: { trades: number; wins: number; totalPnlUsd: number; rejected: number; lossAvoidedUsd: number };
  trades: { token: string; sizeUsd: number; exitReason: string; pnlUsd: number }[];
  rejections: { token: string; reason: string }[];
  backtest: { twoKeyPnl: number; naivePnl: number };
};

const FIELDS = [
  { key: "maxPositionUsd", label: "Max position ($)", value: 200 },
  { key: "maxOpenPositions", label: "Max open positions", value: 3 },
  { key: "dailyLossCapUsd", label: "Daily loss cap ($)", value: 100 },
  { key: "stopLossPct", label: "Stop-loss (%)", value: 8 },
  { key: "takeProfitPct", label: "Take-profit (%)", value: 20 },
] as const;

const usd = (n: number) => `${n < 0 ? "-" : ""}$${Math.abs(n).toFixed(2)}`;

export function RiskLab({ pool, followed }: { pool: string[]; followed: string[] }) {
  const [values, setValues] = useState<Record<string, string>>(Object.fromEntries(FIELDS.map((f) => [f.key, String(f.value)])));
  const [selected, setSelected] = useState<string[]>(followed);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...values, kols: selected }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <label key={f.key} className="block text-sm">
              <span className="text-muted-foreground">{f.label}</span>
              <input
                inputMode="decimal"
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="mt-1.5 w-full rounded-lg border bg-muted px-3 py-2 font-mono text-sm outline-none focus:border-accent"
              />
            </label>
          ))}
        </div>
        <div className="mt-5">
          <p className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">Followed KOLs</span>
            <span className={cn("font-mono text-xs", selected.length >= MAX_KOLS ? "text-amber-300" : "text-muted-foreground")}>{selected.length} of {MAX_KOLS}</span>
          </p>
          <div className="mt-2 grid max-h-44 grid-cols-2 gap-x-3 gap-y-1 overflow-y-auto rounded-lg border bg-muted p-3 text-xs">
            {pool.map((h) => {
              const on = selected.includes(h);
              return (
                <label key={h} className={cn("flex items-center gap-2", !on && selected.length >= MAX_KOLS && "opacity-40")}>
                  <input
                    type="checkbox"
                    checked={on}
                    disabled={!on && selected.length >= MAX_KOLS}
                    onChange={() => setSelected(on ? selected.filter((x) => x !== h) : [...selected, h])}
                    className="accent-[#9085fb]"
                  />
                  {h}
                </label>
              );
            })}
          </div>
          {selected.length >= MAX_KOLS && <p className="mt-1.5 text-xs text-amber-300">The cap is {MAX_KOLS}. Untick one to follow another.</p>}
        </div>
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="mt-5 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Running..." : "Run agent with these limits"}
        </button>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
      <div className="rounded-lg border bg-background p-4 text-sm">
        {!result ? (
          <p className="text-muted-foreground">Change the limits or swap KOLs, then run the agent. Try a max position of 50, or 1 open position, and watch trades turn into rejections.</p>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-3">
              {[
                ["KOLs", String(result.kols), ""],
                ["Trades", String(result.stats.trades), ""],
                ["P&L", usd(result.stats.totalPnlUsd), result.stats.totalPnlUsd >= 0 ? "text-emerald-400" : "text-red-400"],
                ["Rejected", String(result.stats.rejected), ""],
              ].map(([k, v, c]) => (
                <div key={k}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{k}</p>
                  <p className={cn("font-display text-xl font-semibold", c)}>{v}</p>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-1 border-t pt-3">
              {result.trades.map((t) => (
                <li key={t.token} className="flex justify-between">
                  <span>{t.token} <span className="text-muted-foreground">${t.sizeUsd}, {t.exitReason}</span></span>
                  <span className={t.pnlUsd >= 0 ? "text-emerald-400" : "text-red-400"}>{usd(t.pnlUsd)}</span>
                </li>
              ))}
              {result.rejections.filter((r) => r.reason?.includes("Risk limit")).map((r) => (
                <li key={r.token} className="text-amber-300">{r.token}: {r.reason}</li>
              ))}
            </ul>
            <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">Naive agent on the same data: {usd(result.backtest.naivePnl)}</p>
          </>
        )}
      </div>
    </div>
  );
}
