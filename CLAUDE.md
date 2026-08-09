# CLAUDE.md

**Plated** — a QR table-ordering SaaS for small restaurant chains in Nigeria. A
diner scans the code on their table, browses an animated menu, and submits an
order. Staff read orders off a tablet at the counter. The diner pays at the
counter.

**Read the relevant `/docs` file before writing code.** This file routes; it does
not restate. Where this file and a `/docs` file disagree, `/docs` wins.

## Primary USP & Core Feature

Both are defined in `PRD.md` and quoted, never paraphrased:

1. **Primary Locked USP — The landing animation.** Dishes animate onto a lit table as the diner
   swipes. Non-negotiable on quality — this is the visual hook, and a restaurant owner
   should react to it before anything is explained.
2. **Core Feature — Loginless cross-outlet recognition.** History is keyed on
   `(device, chain)`. It pools across every outlet of one chain and never crosses
   between brands. No account, no login, nothing to sign into.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js App Router + TypeScript |
| Styling | Tailwind, tokens from `DESIGN_SYSTEM.md` as CSS custom properties |
| Animation | Framer Motion |
| Database | Supabase Postgres |
| Server logic | Supabase Edge Functions (Deno) |
| Hosting | Vercel (four projects) + Supabase cloud |
| Payments | None in MVP. The diner pays at the counter. |

## The four surfaces

| App | Who | Auth |
|---|---|---|
| `apps/diner` | The diner, on their own phone. PWA. | None — device identity only |
| `apps/restaurant` | Counter and manager, **one codebase, two roles** | Login, role + outlet scope |
| `apps/internal` | Our team, platform-wide | Separate auth tier |
| `apps/landing` | Prospective clients | Public |

## Where to look

| Question | File |
|---|---|
| What are we building and why; what is out of scope; pricing | `docs/PRD.md` |
| Locked decision log and date history | `docs/DECISIONS.md` |
| Schema, device identity, the two USP 2 queries, tenancy | `docs/ARCHITECTURE.md` |
| Tokens, type, the 520ms landing spec, performance floor | `docs/DESIGN_SYSTEM.md` |
| Endpoints, request and response shapes, error codes | `docs/API_CONTRACTS.md` |
| What phase we are in and what "done" means for it | `docs/ROADMAP.md` |
| Positioning, landing copy, what we do not claim | `docs/MARKETING.md` |

## Vocabulary

A **chain** is the paying client account. Its venues are **outlets**. There is no
`restaurants` table — `apps/restaurant` is the app a restaurant's staff use, and
that name says nothing about the schema. `chain_id` is the tenant boundary and it
is on every row that is not global.

A **tab** is a `table_sessions` row: every order from one table, accumulating into
one bill. Orders belong to a session; the session is what gets settled.

## Things that are easy to get wrong

- **Money is `bigint` in kobo**, columns suffixed `_minor`, never `_cents`, never
  float. The server computes every total; requests never carry prices. Diners see
  whole naira — `₦4,500`, never `₦4,500.00` and never `450000`.
- **The server owns identity and the tab.** No `device_id` and no `session_id` in
  a request body. Identity comes from the cookie; the tab is resolved from
  `(outlet_id, table_label)`.
- **Two lifecycles, two tables.** `orders.status` is
  `incoming|processing|delivered|cancelled` (fulfilment). `table_sessions.status` is
  `open|settled|void` (payment tab). An order cancellation with reason `wasted` is strictly
  gated to orders cancelled during/after `Processing`. A session is settled when payment is collected.
- **`POST /orders` is idempotent or it is broken.** `Idempotency-Key` is
  mandatory, unique on `(outlet_id, idempotency_key)`, and a replay returns `200`
  with the original order. The offline queue depends on this.
- **`recognition` is strictly `null`** when we don't know a diner. No greeting,
  no empty state, no prompt to sign in. Silence is the specified behaviour. The
  venue welcome — "Café Neo · Table 4" — is a different component and shows for
  everyone.
- **A missing `outlet_menu_items` row means listed and in stock.** Every read
  `LEFT JOIN`s and `COALESCE`s to `true`, so a new outlet inherits the chain menu
  with zero rows written.
- **Unavailable items stay visible.** "No Stock" and "No Product" are rendered
  unlit and unorderable, never hidden or skipped.
- **Nothing is deleted for retention.** Order rows are the restaurant's business
  records. What expires is the device→order link, via
  `chains.recognition_window_days`. The daily reset is a view filter, and an open
  tab survives it.
- **Only `transform` and `opacity` animate.** Anything animating `box-shadow`,
  `filter`, `width`, or `background` per frame is a bug, not a preference. The one
  exception is the options accordion's height, bounded as `DESIGN_SYSTEM.md` §6.6
  specifies.
- **Reorder rows resolve against the current outlet's live menu.** Order
  snapshots are for the receipt and the counter log; the only snapshot the
  reorder flow may read is `name_snapshot`, as a label fallback.
- **A suspended chain looks closed, not unpaid.** One `is_open` flag, and the
  diner payload never says which cause fired.
- **Printing is tablet-local and has no endpoint.** The tablet drives the printer;
  the server is never in the path. `print_jobs` is insert-only and its status is
  `sent`, never `printed`, because there is no paper sensor to read. Reprint is on
  every card in the queue at all times and is never gated on the log.
- **A chain gets one hue, not a palette.** White-labelling is a logo, a display
  name, and one accent colour validated at ingest. `logo_mono_url` is derived for
  the 58mm printer, never uploaded.
- **Our mark is `currentColor` and belongs on three surfaces.** `apps/landing`,
  `apps/internal`, and print. In the diner and restaurant apps our name appears
  once, as the words `POWERED BY PLATED` — no mark, and the installed PWA icon is
  the chain's logo, not ours. Fill is `--chalk` on `--ink` or `--graphite` on
  light. Never `--brass`, never a chain's accent, never `#FFF`
  (`DESIGN_SYSTEM.md` §3.3).

## Order of work

`ROADMAP.md` fixes the phase order and it is not negotiable. The rule that
governs it: **do not build Phase 4 or later before Phase 2 works and looks
good.** Phases 1 and 2 are allowed to be narrow — one chain, one outlet.

Current phase: **0 — docs and scaffolding.**
