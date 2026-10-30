/** Tiny SVG line for a price path. Green when it ends higher than it starts. */
export function Sparkline({ values, className = "h-10 w-full" }: { values: number[]; className?: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / span) * 26}`).join(" ");
  const up = values[values.length - 1] >= values[0];
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={className} aria-hidden>
      <polyline points={pts} fill="none" strokeWidth="1.6" vectorEffect="non-scaling-stroke" className={up ? "stroke-emerald-400" : "stroke-red-400"} />
    </svg>
  );
}
