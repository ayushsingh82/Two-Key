import type { Kol, Post } from "./types";

/** Hit rate with Laplace smoothing, so a KOL with no history sits at 0.5. */
export function trustScore(kol: Kol): number {
  const hits = kol.calls.filter((c) => (c.direction === "long" ? c.ret24h > 0 : c.ret24h < 0)).length;
  return Math.round(((hits + 1) / (kol.calls.length + 2)) * 1000) / 1000;
}

export function trustMap(kols: Kol[]): Record<string, number> {
  return Object.fromEntries(kols.map((k) => [k.handle, trustScore(k)]));
}

const words = (t: string) => new Set(t.toLowerCase().replace(/[^a-z0-9$ ]/g, " ").split(/\s+/).filter(Boolean));

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter || 1);
}

/**
 * Echo filter. A post is an echo when a different KOL posted almost the same text
 * earlier, within the window. The first poster is kept, later copies are flagged.
 */
export function findEchoes(posts: Post[], windowHours = 3, similarity = 0.7): Set<string> {
  const sorted = [...posts].sort((a, b) => a.ts - b.ts);
  const echoes = new Set<string>();
  sorted.forEach((p, i) => {
    const wp = words(p.text);
    for (let j = 0; j < i; j++) {
      const q = sorted[j];
      if (q.kol === p.kol || p.ts - q.ts > windowHours * 3_600_000) continue;
      if (jaccard(wp, words(q.text)) >= similarity) {
        echoes.add(p.id);
        break;
      }
    }
  });
  return echoes;
}
