# Plan

Project: Two-Key, for the RYO-CHAN Autonomous Agents bounty.
Deadline: 2026-11-01 06:31 (UTC+5:30).

## Goal

Ship a working agent with a dashboard that:

- reads KOL posts and wallet activity
- decides trades through a bull, bear and judge debate
- records practice trades within user risk limits
- keeps a replayable reasoning trail for every decision

## Progress

| # | Milestone | State |
|---|---|---|
| 1 | Data layer and mock feed | Done (`lib/data/index.ts`, 24 KOLs (20 followed by default), 29 posts across X, Telegram and Discord, wallet events, market paths) |
| 2 | Extraction and convergence | Done (`lib/extract.ts`, `lib/converge.ts`). Optional LLM extractor in `lib/extract-llm.ts`, untested without an API key. |
| 3 | Wallet check and fusion | Done (`lib/converge.ts`, `lib/fusion.ts`) |
| 4 | Trade engine and risk limits | Done (`lib/trade.ts`) |
| 5 | Evidence links and replay | Done (`lib/snapshot.ts`, hash chain and replay) |
| 6 | Trust score and echo filter | Done (`lib/trust.ts`) |
| 7 | Court (bull, bear, judge) | Done, rule-based and deterministic (`lib/court.ts`) |
| 8 | Dashboard | Done: landing page and 10 app pages in the Orca style, plus a risk lab that re-runs the agent via `/api/run` |
| 9 | Backtest and demo data | Done: `/backtest` compares Two-Key with a naive buy-everything agent |
| 10 | README, video, submission | Open |

Run it: `npm run agent` prints decisions, trades and rejections. `npm test` runs 14 tests, all passing. `node scripts/e2e.mjs` builds, serves and checks every page and the API.

Demo result on the sample data:

| Token | Social | On-chain | Rule | Outcome |
|---|---|---|---|---|
| SOL | strong | strong | 1 | Full trade, take-profit, +$40 |
| JUP | strong | weak | 2 | Small trade, stop-loss, loss |
| WIF | strong | selling | 5 | Rejected as exit liquidity, avoided a loss |
| BONK | weak | strong | 3 | Watchlist |
| DOGE | weak (echoes) | weak | 4 | Rejected |
| RNDR | weak | weak | 4 | Rejected |

Backtest finding: on the sample data Two-Key and the naive agent both end at +$32, because Two-Key skips BONK, a winner. Two-Key risks $300 of capital against $1,200 for the naive agent. The app says this plainly instead of claiming a P&L win.

Next: demo video and submission.

## Architecture

| Layer | Piece | Notes |
|---|---|---|
| Data | `lib/data/kols` | Mock or cached KOL posts, same shape as X data |
| Data | `lib/data/wallets` | Whale and smart-money activity per token |
| Data | `lib/data/market` | Price and volume |
| Analysis | `lib/extract` | LLM returns token, sentiment, conviction, urgency as JSON |
| Analysis | `lib/trust` | KOL trust score and echo filter |
| Analysis | `lib/converge` | Trust-weighted convergence per token |
| Analysis | `lib/fusion` | Combines social and on-chain keys using the rule table |
| Decision | `lib/court` | Bull, bear and judge agents |
| Trading | `lib/trade` | Paper portfolio, risk limits, stop-loss, take-profit |
| Trail | `lib/snapshot` | Evidence snapshot, hash, deterministic replay |
| App | `app/` | Dashboard, signals, court, trades, settings |

## Data model (draft)

| Entity | Fields |
|---|---|
| Post | id, kol, text, timestamp, token, sentiment, conviction, urgency |
| Kol | handle, trustScore, callHistory |
| WalletEvent | token, wallet, side, amount, timestamp |
| Candidate | token, socialScore, onchainScore, fusionResult |
| Debate | candidateId, bullArgument, bearArgument, verdict |
| Trade | id, token, entry, size, stopLoss, takeProfit, exit, pnl, evidenceHash |
| Snapshot | id, evidence, hash, createdAt |
| Settings | kols (max 20), risk limits, thresholds |

## Milestones

| # | Milestone | Done when | Est. time |
|---|---|---|---|
| 1 | Data layer and mock feed | Posts, wallet events and prices load from local files | 2h |
| 2 | Extraction and convergence | Each post yields structured JSON, convergence per token works | 3h |
| 3 | Wallet check and fusion | Rule table produces a decision for each candidate | 2h |
| 4 | Trade engine and risk limits | Paper trades open and close, limits enforced | 3h |
| 5 | Evidence links and replay | Every trade links to its evidence, replay gives the same result | 3h |
| 6 | Trust score and echo filter | KOL scores update from past calls, copied posts are dropped | 3h |
| 7 | Court (bull, bear, judge) | Debate stored and shown per candidate | 3h |
| 8 | Dashboard | Signals, court, trades, rejections, settings pages | 5h |
| 9 | Backtest and demo data | A past week replay shows P&L and hit rate | 2h |
| 10 | README, video, submission | Everything in BOUNTY.md checklist done | 3h |

## Schedule

| When | Focus |
|---|---|
| Day 1 morning | Milestones 1 and 2 |
| Day 1 afternoon | Milestones 3 and 4 |
| Day 1 evening | Milestone 5 |
| Day 2 morning | Milestones 6 and 7 |
| Day 2 afternoon | Milestones 8 and 9 |
| Day 2 evening | Milestone 10 and submit before the deadline |

## Cut order if time runs short

| Cut first | Keep |
|---|---|
| Backtest charts | Replay for individual trades |
| Echo filter | Trust score |
| Dashboard polish | Core pages: signals, trades, court |
| Court as separate agents | A single structured argument for and against |

Never cut: extraction, convergence, fusion rules, practice trades, risk limits, evidence links.

## Risks

| Risk | Mitigation |
|---|---|
| X API unavailable or paid | Mock or cached feed, stated clearly in README and demo |
| Wallet data access | Cached dataset for the demo |
| LLM output varies between runs | Fixed temperature, JSON schema, and saved outputs inside each snapshot |
| Scope too large | Follow the cut order above |

## Definition of done

- [ ] All requirements in [BOUNTY.md](./BOUNTY.md) checked
- [ ] Demo shows at least one trade, one rejection and one replay
- [ ] README has signal rules, risk limits and data source notes
- [ ] 2 to 3 minute demo video recorded
- [ ] Submitted on DoraHacks before 2026-11-01 06:31 (UTC+5:30)
