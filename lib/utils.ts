import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const usd = (n: number, digits = 0) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

export const price = (n: number) => (n >= 1 ? usd(n, 2) : `$${n.toPrecision(3)}`);
export const short = (hash: string) => `${hash.slice(0, 8)}...${hash.slice(-6)}`;
export const ago = (now: number, ts: number) => {
  const h = (now - ts) / 3_600_000;
  return h < 1 ? `${Math.round(h * 60)}m ago` : `${h.toFixed(1)}h ago`;
};
