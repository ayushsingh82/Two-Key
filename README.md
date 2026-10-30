# Two-Key

**Where autonomous capital moves only when the evidence does.**

An agent that acts only when two independent signals agree.

Most crypto bots follow social hype. Two-Key requires a second, independent confirmation: real money moving on-chain. A bull agent, a bear agent and a judge then argue the case from the same evidence. Every decision, including every rejection, is saved with its evidence and can be replayed.

> All trades are practice trades on a paper portfolio. No real funds are used.

Built for the RYO-CHAN Autonomous Agents bounty at the BLI Legal Tech Hackathon 2.

## The two keys

| Key | Question it answers | Signal |
|---|---|---|
| Social | Are trusted voices pushing the same narrative? | Trust-weighted convergence of KOL posts |
| On-chain | Are real wallets putting money behind it? | Net smart-money and whale flow |

A trade needs both keys. When they disagree, the agent says no and records why.

## How it works

| Step | What happens |
|---|---|
| 1 | Watch up to 20 KOLs and extract token, sentiment, conviction and urgency from each post |
| 2 | Score each KOL on past calls and filter copied or coordinated posts |
| 3 | Detect trust-weighted convergence on a token |
| 4 | Check whale and smart-money activity on the same token |
| 5 | Combine both keys with the fusion rules below |
| 6 | Bull, bear and judge agents debate the evidence |
| 7 | Record a practice trade within user risk limits, or log a rejection with reasons |
| 8 | Save an evidence snapshot and a chained hash so the decision can be replayed |

## Signal rules

| Rule | Social key | On-chain key | Decision |
|---|---|---|---|
| 1 | Strong | Strong | Full-size practice trade |
| 2 | Strong | Weak | Small trade, flagged "hype without money" |
| 3 | Weak | Strong | Watchlist, flagged "money without story" |
| 4 | Weak | Weak | Reject, reason logged |
| 5 | Any | Whales selling | Reject, flagged "possible exit liquidity" |

The same table is shown in the app at `/rules`, read from the code that makes the decisions.

## Risk limits

All limits are user-defined and enforced on every trade. Change them live in the risk lab on the Settings page.

| Setting | Default | Meaning |
|---|---|---|
| Start equity | $1,000 | Total exposure cannot exceed this |
| Max position size | $200 | Largest single position. Small trades use half |
| Max open positions | 3 | Extra trades are rejected with the reason logged |
| Daily loss cap | $100 | No new trades once realized losses reach this |
| Stop-loss | 8% | Applied to every position |
| Take-profit | 20% | Applied to every position |

## What makes it different

| Edge | Why it matters |
|---|---|
| Two independent keys | Most agents act on social posts alone |
| Exit-liquidity detection | Catches KOLs promoting a token while whales sell |
| KOL trust scoring and echo filter | Good callers count more, copied posts count once |
| Rejection log | Shows why each token was skipped and what it saved |
| Deterministic replay | The same snapshot always gives the same decision |

## Bounty coverage

The `/scorecard` page checks each requirement live against the running agent.

| Requirement | Where it is met |
|---|---|
| Interprets market evidence | KOL posts, wallet flows, price and volume |
| Records practice trades | Paper portfolio with entry, size, stop-loss, take-profit and P&L |
| Cause and effect | An evidence hash on every trade and rejection |
| Repeatable reasoning trail | Hash-chained receipts and replay |
| Up to 20 KOLs | Cap enforced in settings |
| Token, sentiment, conviction, urgency | Structured extraction per post |
| Trusted voices converge | Trust-weighted convergence |
| Transparent signal rules | Rule table in the app and in this README |
| User-defined risk limits | Settings page and trade engine |
| Bull / Bear debate | Court page |
| Whale movement tracker | On-chain key and Wallet Flow page |

## Data sources

| Data | Source | Note |
|---|---|---|
| KOL posts | Cached feed in the shape of X posts | X API access is limited, so the feed is cached |
| Wallet activity | Cached whale and smart-money events | Live source: Etherscan or public RPCs |
| Prices and volume | Cached snapshot with an hourly outcome path | Live source: any free market API |

Extraction and the court are deterministic, so replay never depends on a model call. An optional LLM extractor lives in `lib/extract-llm.ts`, and its output is stored inside the evidence.

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dashboard |
| `npm run agent` | Print decisions, trades and rejections in the terminal |
| `npm test` | Run the unit tests |
| `npm run build` | Production build |

## Project structure

| Path | Contents |
|---|---|
| `app/` | Landing page and the dashboard pages |
| `components/` | Shared UI |
| `lib/data/` | Cached KOL, wallet and market data |
| `lib/extract.ts`, `lib/trust.ts`, `lib/converge.ts` | Extraction, trust scoring, convergence |
| `lib/fusion.ts`, `lib/court.ts`, `lib/decide.ts` | Rule table, debate, decision |
| `lib/trade.ts`, `lib/backtest.ts` | Paper portfolio, risk limits, comparison with a naive agent |
| `lib/snapshot.ts`, `lib/hash.ts` | Hash chain and replay |

## Stack

Next.js (App Router), TypeScript, Tailwind CSS.

## Disclaimer

Two-Key is a research prototype. Nothing here is financial advice.
