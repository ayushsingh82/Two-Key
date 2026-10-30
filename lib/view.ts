import { cache } from "react";
import { KOLS, MARKET, NOW, POSTS, WALLET_EVENTS } from "./data";
import { extractAll } from "./extract";
import { runPipeline } from "./pipeline";
import { findEchoes, trustMap } from "./trust";

/** One pipeline run per request, shared by every page. */
export const getRun = cache(() => runPipeline());

export const getPulse = cache(() => {
  const trust = trustMap(KOLS);
  const echoes = findEchoes(POSTS);
  const ex = new Map(extractAll(POSTS).map((e) => [e.postId, e]));
  const posts = [...POSTS]
    .sort((a, b) => b.ts - a.ts)
    .map((p) => ({ ...p, x: ex.get(p.id)!, trust: trust[p.kol] ?? 0.5, echo: echoes.has(p.id) }));
  const kols = KOLS.map((k) => {
    const hits = k.calls.filter((c) => (c.direction === "long" ? c.ret24h > 0 : c.ret24h < 0)).length;
    return { handle: k.handle, trust: trust[k.handle], calls: k.calls.length, hits };
  }).sort((a, b) => b.trust - a.trust);
  return { now: NOW, posts, kols, echoCount: echoes.size };
});

export const getWallets = cache(() => ({
  now: NOW,
  events: [...WALLET_EVENTS].sort((a, b) => b.ts - a.ts),
  markets: MARKET,
}));
