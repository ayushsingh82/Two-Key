import { findEchoes } from "./trust";
import type { Evidence, OnchainSignal, SocialSignal } from "./types";

const H = 3_600_000;
const round = (n: number) => Math.round(n * 1000) / 1000;

/** Trust-weighted convergence. Each KOL counts once, using their latest non-echo post. */
export function socialSignal(ev: Evidence): SocialSignal {
  const { settings, now, token } = ev;
  const since = now - settings.windowHours * H;
  const byPost = new Map(ev.extractions.map((e) => [e.postId, e]));
  const inWindow = ev.posts.filter((p) => p.ts >= since && p.ts <= now && ev.settings.kols.includes(p.kol));
  const echoes = findEchoes(inWindow);
  const latest = new Map<string, (typeof inWindow)[number]>();
  for (const p of [...inWindow].sort((a, b) => a.ts - b.ts)) {
    if (!echoes.has(p.id)) latest.set(p.kol, p);
  }
  const contributors: SocialSignal["contributors"] = [];
  let score = 0;
  let bullish = 0;
  for (const [kol, p] of latest) {
    const x = byPost.get(p.id);
    if (!x || x.token !== token) continue;
    const trust = ev.trust[kol] ?? 0.5;
    const recency = Math.exp(-((now - p.ts) / H) / settings.windowHours);
    const weight = trust * x.conviction * recency * x.sentiment;
    score += weight;
    if (x.sentiment > 0.2) bullish++;
    contributors.push({ kol, trust, weight: round(weight), postId: p.id });
  }
  const strength = bullish >= settings.minVoices && score >= settings.socialStrongScore ? "strong" : "weak";
  return {
    token,
    voices: contributors.length,
    bullishVoices: bullish,
    score: round(score),
    strength,
    echoPosts: inWindow.filter((p) => echoes.has(p.id) && byPost.get(p.id)?.token === token).length,
    contributors,
  };
}

export function onchainSignal(ev: Evidence): OnchainSignal {
  const { settings, now, token } = ev;
  const events = ev.walletEvents.filter((e) => e.token === token && e.smart && e.ts >= now - 24 * H && e.ts <= now);
  const net = events.reduce((n, e) => n + (e.side === "buy" ? e.usd : -e.usd), 0);
  const buyers = new Set(events.filter((e) => e.side === "buy").map((e) => e.wallet)).size;
  const state = net <= -settings.onchainSellUsd ? "selling" : net >= settings.onchainStrongUsd && buyers >= 2 ? "strong" : "weak";
  return { token, netSmartUsd: net, smartBuyers: buyers, state };
}
