export type Direction = "long" | "short";

export type Post = { id: string; kol: string; text: string; ts: number };

export type Extraction = {
  postId: string;
  token: string | null;
  sentiment: number; // -1 bearish .. 1 bullish
  conviction: number; // 0..1
  urgency: number; // 0..1
};

export type Call = { token: string; ts: number; direction: Direction; ret24h: number };
export type Kol = { handle: string; calls: Call[] };

export type WalletEvent = {
  token: string;
  wallet: string;
  side: "buy" | "sell";
  usd: number;
  ts: number;
  smart: boolean;
};

export type Market = {
  token: string;
  price: number;
  change24h: number; // percent
  volume24h: number;
  liquidityUsd: number;
  /** Hourly prices after the decision time. Used to close practice trades and for replay. */
  outcomePath: number[];
};

export type Settings = {
  kols: string[]; // max 20
  equityUsd: number;
  maxPositionUsd: number;
  maxOpenPositions: number;
  dailyLossCapUsd: number;
  stopLossPct: number;
  takeProfitPct: number;
  windowHours: number;
  minVoices: number;
  socialStrongScore: number;
  onchainStrongUsd: number;
  onchainSellUsd: number;
  minLiquidityUsd: number;
};

export type Strength = "strong" | "weak";
export type OnchainState = "strong" | "weak" | "selling";

export type SocialSignal = {
  token: string;
  voices: number;
  bullishVoices: number;
  score: number;
  strength: Strength;
  echoPosts: number;
  contributors: { kol: string; trust: number; weight: number; postId: string }[];
};

export type OnchainSignal = {
  token: string;
  netSmartUsd: number;
  smartBuyers: number;
  state: OnchainState;
};

export type FusionAction = "full" | "small" | "watchlist" | "reject";
export type Fusion = { action: FusionAction; label: string; rule: number };

export type Evidence = {
  now: number;
  token: string;
  settings: Settings;
  posts: Post[];
  extractions: Extraction[];
  trust: Record<string, number>;
  walletEvents: WalletEvent[];
  market: Market;
};

export type CourtResult = {
  bull: string[];
  bear: string[];
  bullScore: number;
  bearScore: number;
  verdict: FusionAction;
  reason: string;
};

export type Decision = {
  token: string;
  social: SocialSignal;
  onchain: OnchainSignal;
  fusion: Fusion;
  court: CourtResult;
  action: FusionAction;
  reasons: string[];
};

export type Trade = {
  id: string;
  token: string;
  entry: number;
  sizeUsd: number;
  stopLoss: number;
  takeProfit: number;
  exit: number;
  exitReason: "stop-loss" | "take-profit" | "time-exit";
  pnlUsd: number;
  evidenceHash: string;
};

export type Rejection = { token: string; action: FusionAction; reasons: string[]; evidenceHash: string };

export type Receipt = {
  index: number;
  token: string;
  prevHash: string;
  evidenceHash: string;
  decisionHash: string;
  hash: string;
};
