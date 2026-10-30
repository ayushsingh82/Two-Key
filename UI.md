# UI spec

Goal: the exact same look and feel as the Orca app (`~/Desktop/new projects/orca/app`). Dark only, Geist fonts, a violet accent, bordered cards on a near-black background. Only the brand name, logo and page content change.

Source files to copy from, all under `orca/app/src`:

| What | File |
|---|---|
| Tokens, utilities | `app/globals.css` |
| Fonts, root layout | `app/layout.tsx` |
| App shell | `app/(app)/layout.tsx` |
| Sidebar | `components/app-sidebar.tsx` |
| Panel, PulseRail | `components/panel.tsx` |
| Page header | `components/page-header.tsx` |
| Logo | `components/brand.tsx` |
| Live badge | `components/source-badge.tsx` |
| Class helper | `lib/utils.ts` |
| Landing page | `app/page.tsx`, `components/site/*` |
| Example page | `app/(app)/dashboard/page.tsx` |

## Design tokens (from `globals.css`)

| Token | Value | Use |
|---|---|---|
| `--background` | `#151515` | Page background |
| `--foreground` | `oklch(0.96 0.003 265)` | Main text |
| `--muted` | `#1e1e1e` | Active nav item, chips |
| `--muted-foreground` | `oklch(0.65 0.01 265)` | Secondary text |
| `--card` | `#1a1a1a` | Cards and panels |
| `--border` | `oklch(1 0 0 / 8%)` | All borders (applied to `*`) |
| `--accent` | `oklch(0.68 0.17 285)` | Violet accent: active states, links, logo tile |
| `--accent-foreground` | `#151515` | Text on accent |
| Good / bad / warn | `text-emerald-400` / `text-red-400` / `text-amber-400` | Long, short, warning |
| Chart colors | `#a78bfa #34d399 #fbbf24 #f87171 #60a5fa` | Multi-series charts |

- `color-scheme: dark`. There is no light theme.
- `::selection` is 30% accent.
- `html` has smooth scrolling, disabled under `prefers-reduced-motion`.
- Utility `bg-grid`: 56px grid lines drawn with the border color, used behind the hero.
- Keyframe `float`: moves up 10px and back, used for floating hero cards.

## Typography

| Role | Font | Notes |
|---|---|---|
| Body | Geist Sans | `--font-geist-sans` |
| Mono | Geist Mono | Labels, badges, numbers, small caps with wide tracking |
| Display | Bricolage Grotesque, weights 500, 600, 700 | Headings, stat values, brand name |

| Element | Classes |
|---|---|
| Page title | `font-display text-3xl sm:text-4xl font-semibold tracking-tight` |
| Page description | `text-sm text-muted-foreground max-w-2xl` |
| Panel title | `font-display text-lg font-semibold` |
| Section label | `font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70` |
| Stat label | `font-mono text-[10px] uppercase tracking-[0.2em]` |
| Stat value | `font-display text-xl font-semibold` |

## App shell

| Part | Spec |
|---|---|
| Layout | `flex flex-col md:flex-row`, sidebar plus `main` |
| Main | `min-w-0 flex-1 p-4 md:p-10` |
| Desktop sidebar | `w-64`, sticky, full height, `border-r`, `bg-background`, `p-4`, hidden below `md` |
| Sidebar top | Logo, then grouped nav |
| Sidebar bottom | User menu, then a "Live data" card with a pulsing emerald dot and an amber "Beta" pill |
| Mobile | Sticky top bar with a blurred background (`bg-background/80 backdrop-blur`), logo and user menu, plus a horizontal scrolling pill nav |

Nav item: `rounded-lg px-3 py-2 text-sm text-muted-foreground`, hover `bg-muted/60 text-foreground`. Active: `bg-muted font-medium text-foreground`, a 2px accent bar on the left edge, and an accent-colored icon. Icons are `lucide-react`, `size-4`.

## Components

| Component | Spec |
|---|---|
| Panel | `rounded-xl border bg-card p-5`, hover `border-white/15`. Header has the title, optional subtitle, optional right slot, and a bottom border. |
| PulseRail | A bordered `rounded-xl bg-card` strip of headline numbers with dividers. Grid is 2, 3 or 6 columns by breakpoint. Each cell has a mono label, a display value (tone: default, good, bad or warn) and an optional hint. |
| Opportunity card | `rounded-xl border bg-card p-5`, hover `-translate-y-0.5 border-white/20 bg-muted/50` |
| PageHeader | Title and description with `border-b` and `mb-8 pb-6` |
| SourceBadge | Pill: `rounded-full border bg-card px-2.5 py-0.5 font-mono text-[11px]` with a small emerald dot |
| Buttons | Primary: `rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background`, hover `opacity-90`. Secondary: `rounded-lg border px-5 py-3`, hover `bg-muted`. |
| Links | `text-xs text-accent underline` |
| Hero cards | `rounded-2xl border bg-card p-4 ring-1 ring-white/10` with a large soft black shadow |
| Brand mark | 64x64 SVG, rounded tile filled with accent, glyph in accent-foreground |

## Landing page

| Section | Notes |
|---|---|
| Navbar | Sticky, `h-16`, `bg-background/70 backdrop-blur-xl`, `max-w-6xl`. Logo, anchor links, Login button, "Open app" button. |
| Hero | Centered. Beta pill, large display headline, subtext, two buttons, small note. Background grid with a radial mask. Four floating feature cards at the corners (visible from `lg`) that bob with the `float` animation. |
| Sections | Stats, live now, journey, research, agents, money, safety, pricing, FAQ, CTA |
| Footer | Standard links |
| Width | `max-w-6xl`, gutters `px-4 sm:px-6` |

## Mapping to Two-Key

Keep the shell and components identical. Swap the content.

| Orca | Two-Key |
|---|---|
| Brand "Orca" | Two-Key |
| Intelligence Board | Signal Board (candidates with fusion result) |
| Market Sentiment | KOL Pulse |
| Live Bots / Agents | Court (bull, bear, judge debates) |
| Markets / Signals | Candidates |
| News Impact | Evidence |
| Order Flow | Wallet Flow (on-chain key) |
| Portfolio | Practice Portfolio |
| RSI Research | KOL Trust Scores |
| Wallet and Billing | Settings (KOL list, risk limits) |
| "Live data" badge | "Practice trades only" badge |

Proposed sidebar:

| Section | Items |
|---|---|
| Overview | Signal Board, KOL Pulse, Court |
| Signals | Candidates, Wallet Flow, Evidence, KOL Trust |
| Trading | Practice Portfolio, Rejections, Replay |
| Account | Settings |

Proposed PulseRail on the Signal Board: KOLs tracked, Candidates, Trades opened, Rejected, Hit rate, Updated.

## Setup notes

- Dependencies to add: `lucide-react`, `clsx`, `tailwind-merge`. Orca also uses `motion`.
- Fonts come from `next/font/google`: Geist, Geist_Mono, Bricolage_Grotesque.
- Copy `globals.css` tokens as they are. Orca's comment says they come from "BestUI's `.dark` theme".
- Do not copy Orca's name, logo or marketing copy into the final product. Make a new logo mark with the same tile construction.
