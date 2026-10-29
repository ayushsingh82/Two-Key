# Two-Key

An autonomous agent that only makes a practice trade when two independent keys turn together:

1. **Social key:** trusted crypto KOLs are pushing the same narrative.
2. **On-chain key:** real wallets are moving money into the same token.

A bull agent, a bear agent and a judge then argue the case from the same evidence. Every decision, including rejections, is saved with its evidence so it can be replayed.

Built for the RYO-CHAN "Autonomous Agents" bounty at the BLI Legal Tech Hackathon 2 (DoraHacks). See [BOUNTY.md](./BOUNTY.md) for the bounty details and [PLAN.md](./PLAN.md) for the build plan.

All trades are practice trades. No real funds are used.

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
| 8 | Save the evidence snapshot and a hash so the decision can be replayed |

## Fusion rules

| Social key | On-chain key | Decision |
|---|---|---|
| Strong | Strong | Full-size practice trade |
| Strong | Weak | Small trade or watchlist, flagged "hype without money" |
| Weak | Strong | Watchlist, flagged "money without story" |
| Weak | Weak | Reject, reason logged |
| Strong | Whales selling | Reject, flagged "possible exit liquidity" |

## Risk limits (user-defined)

| Setting | Meaning |
|---|---|
| Max position size | Largest single practice position |
| Max open positions | Cap on simultaneous trades |
| Daily loss cap | Stop opening trades after this loss |
| Stop-loss and take-profit | Applied to every position |

## What makes it different

| Edge | Why it matters |
|---|---|
| Two independent keys | Most entries use only social posts |
| Exit-liquidity detection | Catches KOLs promoting a token while whales sell |
| KOL trust scoring | Good callers count more over time |
| Rejection log | Shows why each token was skipped |
| Deterministic replay | Same snapshot gives the same decision |

## Data sources

| Data | Source | Note |
|---|---|---|
| KOL posts | Mock or cached feed of real public posts | X API access is limited, so this is stated clearly |
| Wallet activity | Free sources (Etherscan, public RPCs) or a cached dataset | |
| Prices and volume | Free market API | |

## Stack

- Next.js (App Router, TypeScript, Tailwind)
- LLM for extraction and the debate agents
- Local storage for snapshots and the paper portfolio

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Status

Idea finalised, build in progress. Track progress in [PLAN.md](./PLAN.md).
