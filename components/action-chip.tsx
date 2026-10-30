import type { FusionAction } from "@/lib/types";
import { Chip, type Tone } from "@/components/panel";

const MAP: Record<FusionAction, { label: string; tone: Tone }> = {
  full: { label: "Full trade", tone: "good" },
  small: { label: "Small trade", tone: "good" },
  watchlist: { label: "Watchlist", tone: "warn" },
  reject: { label: "Rejected", tone: "bad" },
};

export function ActionChip({ action }: { action: FusionAction }) {
  const { label, tone } = MAP[action];
  return <Chip tone={tone}>{label}</Chip>;
}

export const pnlTone = (n: number): Tone => (n > 0 ? "good" : n < 0 ? "bad" : "default");
