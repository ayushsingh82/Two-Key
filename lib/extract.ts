import type { Extraction, Post } from "./types";

const BULL = ["long", "buy", "buying", "bullish", "accumulate", "accumulating", "breakout", "loading", "moon", "run", "strong", "clean", "send", "pumps", "dip"];
const BEAR = ["short", "sell", "selling", "bearish", "dump", "rug", "exit", "top", "weak", "fade", "crash"];
const HIGH_CONVICTION = ["all in", "high conviction", "huge conviction", "convinced", "max size", "100%", "confirmed"];
const HEDGE = ["might", "maybe", "watching", "could", "if it holds", "not sure", "perhaps"];
const URGENT = ["now", "today", "before", "last chance", "hurry", "asap", "right now", "quick"];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number) => Math.round(n * 1000) / 1000;

function countHits(text: string, words: string[]): number {
  return words.reduce((n, w) => {
    const re = new RegExp(`(^|[^a-z])${w.replace(/ /g, "\\s+")}([^a-z]|$)`, "g");
    return n + (text.match(re)?.length ?? 0);
  }, 0);
}

/**
 * Deterministic extractor. It is the default and the fallback for the LLM extractor,
 * so the pipeline and replay never depend on a network call.
 */
export function extractPost(post: Post): Extraction {
  const text = post.text.toLowerCase();
  const ticker = post.text.match(/\$([A-Za-z]{2,10})/)?.[1]?.toUpperCase() ?? null;
  const net = Math.min(countHits(text, BULL), 4) - Math.min(countHits(text, BEAR), 4);
  const hedged = countHits(text, HEDGE) > 0;
  let sentiment = Math.tanh(net / 2);
  if (hedged) sentiment *= 0.5;
  const high = countHits(text, HIGH_CONVICTION);
  const conviction = hedged ? 0.25 : clamp(0.5 + 0.2 * high, 0, 1);
  const urgency = clamp(0.1 + 0.3 * countHits(text, URGENT), 0, 1);
  return { postId: post.id, token: ticker, sentiment: round(sentiment), conviction: round(conviction), urgency: round(urgency) };
}

export const extractAll = (posts: Post[]) => posts.map(extractPost);
