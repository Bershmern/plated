# Roadmap — QR Ordering SaaS

> **Depends on:** `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md`, `DESIGN_SYSTEM.md`, `MARKETING.md`  
> **Read by:** `CLAUDE.md`  

> The phase checklist. A phase is done when its **exit criteria** pass on a real
> phone, not when the code is written. The order is fixed and is not negotiable —
> see below for why.

## The rule that governs the order

**Do not build Phase 4 or later before Phase 2 works and looks good.** The
animation is the pitch. A restaurant owner watching the demo should react to the
food landing before anything else is explained (`PRD.md` § Success criteria), and
no amount of admin tooling substitutes for that reaction.

The corollary is that Phases 1 and 2 are allowed to be narrow. One chain, one
outlet, hardcoded if it helps. Breadth arrives in Phase 3.

The second rule, which the phase order also encodes: **the diner app is built
before the tools that feed it.** Every phase from 4 on exists to make Phases 1–3
operable by someone other than us. Building the dashboard first would mean
designing a control panel for a product whose behaviour is still a guess.

## Phase 0 — Docs and scaffolding

**Goal:** every later session can be pointed at one doc instead of the whole idea.

- [x] `PRD.md` — problem, primary USP locked, settled decisions, open questions
- [x] `ARCHITECTURE.md` — stack, schema, tenancy, device tokens
- [x] `DESIGN_SYSTEM.md` — tokens, the 520ms landing spec, performance floor
- [x] `API_CONTRACTS.md` — every endpoint, request and response shapes
- [x] `ROADMAP.md` — this file
- [x] `MARKETING.md` — positioning, landing copy, quote form
- [x] `DECISIONS.md` — locked decision log
- [x] `CLAUDE.md` at the root — short; what the product is, USPs, the
      stack in one line each, and "read the relevant `/docs` file first"
- [ ] Monorepo scaffolded per `ARCHITECTURE.md` §10 — four apps, two packages
- [ ] Blank `apps/diner` deploying to Vercel on push
- [ ] Supabase project created, `packages/db` holding the first migration

**Exit criteria.** A blank page is live on a real URL and a migration has been
applied to a real database. Nothing renders yet; the pipe is open.

## Phase 1 — Core ordering flow

Single outlet, no animation. Ugly is fine and expected.

- [ ] Schema migrated: every table in `ARCHITECTURE.md` §5, with indexes — including
      `table_sessions`, `option_groups`, `options`, `order_item_options`
- [ ] Seed one chain, one outlet, one menu with real Nigerian dish names and
      kobo prices, and at least one item carrying two option groups
- [ ] Device resolution middleware — cookie, mirror, and the four-row repair
      matrix from `ARCHITECTURE.md` §4.3
- [ ] `GET /scan` returning the §4 payload, menu only, `recognition: null`,
      `session: null`
- [ ] Cart, client-side, no persistence (`API_CONTRACTS.md` §9.3)
- [ ] `POST /orders` with the six-step transaction from `API_CONTRACTS.md` §5,
      including tab resolution and the `Idempotency-Key` uniqueness index
- [ ] `GET /orders/:id` with the ownership check
- [ ] Orders visible somewhere — a raw Supabase table view is acceptable here

**Exit criteria.** Scan a QR on a phone, add two dishes with options, submit, and
see the row land in Postgres with correct `chain_id`, `outlet_id`, `session_id`
and totals computed server-side. Submit a second order from a **second phone on
the same table label** and watch it join the same open tab. Close the browser tab,
scan again, and the same `device_id` resolves — the cookie survived.

**The trap in this phase** is treating device identity as a Phase 3 concern. It
is built here, because retrofitting an identity boundary into a working order
flow means rewriting the order flow. Recognition is Phase 3; the identity it
reads is Phase 1.

**The second trap** is treating the tab as a Phase 4 concern because staff settle
it. `session_id` is written by the order transaction, so it is Phase 1 or it is a
migration over live orders. Settling can wait; the grouping cannot.

## Phase 2 — The landing

This is the product. `DESIGN_SYSTEM.md` §6 is the specification and it is not a
starting point to riff on.

- [ ] Design tokens as CSS custom properties, accent injected on the app shell
- [ ] STAGE / FILTER / RAIL / DOCK layout per §6.1
- [ ] Scroll-snap rail; `scrollend` with the 90ms velocity-idle fallback
- [ ] The 520ms landing — Clear, Approach, Contact, Settle, with the easing
      tokens as written
- [ ] Two-layer crossfaded contact shadow, landing exactly on 380ms
- [ ] Dish name and price swapping at 200ms, not travelling with the dish
- [ ] Light pool bloom on Settle
- [ ] Category filter bar — scrolls the rail, never filters it (§6.1)
- [ ] Options accordion per §6.6, with the height exception bounded as specified
- [ ] `prefers-reduced-motion` path — crossfade in place, 160ms, no travel
- [ ] Image pipeline end to end: upload → Claid → contact-line normalisation →
      `image_ready`, run over a real demo menu
- [ ] Data budgets from §7 measured, not assumed
- [ ] Venue welcome carrying the chain's logo and display name, and
      `POWERED BY PLATED` at the foot of the app (`DESIGN_SYSTEM.md` §3.1, §3.2)
      — word only, no mark, and the PWA's home-screen icon is the chain's logo

**Exit criteria.** On a Tecno Spark and an iPhone SE 2, swiping the rail holds
45fps sustained with no dropped contact frame, and a 20-item menu loads under
900KB. Someone who has not seen it before watches the demo and reacts to the food
before asking a question.

**The image pipeline is in this phase, not Phase 4.** The animation cannot be
evaluated on placeholder images — inconsistent contact points make dishes land at
different depths, which reads as broken rather than as unfinished. The manager's
*upload UI* is Phase 4; the processing path that produces a compliant asset is
here, even if we run it by hand.

## Phase 3 — Cross-outlet recognition

USP 2 end to end. Needs at least two outlets under one chain and one outlet
under a second chain — the second chain is not optional, because without it the
silo cannot be observed and a bug that pools history across brands looks exactly
like success.

- [ ] Seed a second outlet on chain A and one outlet on chain B
- [ ] `diner_profiles` written inside the order transaction, first order only
- [ ] The §6 recognition lookup wired into `/scan`, bounded by
      `chains.recognition_window_days`
- [ ] The §7 resolution query, with the NO PRODUCT → NO STOCK → orderable
      state machine
- [ ] `recognition` in the `/scan` payload, strictly `null` when unrecognised
- [ ] Greeting ribbon, reorder row, and the 940ms sequence from
      `DESIGN_SYSTEM.md` §6.5
- [ ] Unavailable rendering per §6.4 — visible, unlit, unorderable
- [ ] Cookie lifetime verified on physical iOS and Android
      (`ARCHITECTURE.md` §11.1)

**Exit criteria — the three acceptance tests in `PRD.md`, run on real phones,
not in a seeded database:**

| Test | Pass condition |
|---|---|
| Chidi | Orders at outlet A1, scans at A2 on the same phone → sees his A1 order, greeted with count 1 |
| Aisha | Orders at A1, scans at chain B → sees **nothing**. No greeting, no empty state, no prompt |
| Tunde | Has profiles at A and B → each scan surfaces exactly one chain's history, never both |

Plus three degraded paths that are part of the contract, not edge cases:

- Clear `localStorage` only → identity survives on the cookie.
- Clear cookies only → identity is rebuilt from the mirror, same `device_id`.
- Age an order past the recognition window → greeting still fires with the count,
  no reorder row beneath it (`ARCHITECTURE.md` §8).

**Do not ship a "sign in to see your history" affordance if recognition fails.**
Silence is the specified behaviour. A fallback prompt would contradict
`PRD.md` and would train diners to expect an account.

## Phase 4 — Restaurant app

`apps/restaurant`, both roles, one codebase. This is what a client actually
operates, and it is the difference between a demo and a deployment.

- [ ] Supabase Auth with `chain_id`, `outlet_id` and role claims; RLS on every
      table (`ARCHITECTURE.md` §9)
- [ ] **Counter:** live order feed, filtered by outlet, with status transitions
- [ ] **Counter:** cancel with the reason picker, gated on `chains.cancel_window`
      in RLS rather than in the client (`API_CONTRACTS.md` §7.1)
- [ ] **Counter:** table tabs — open sessions, running totals, settle
- [ ] **Counter:** the service-day view filter on `outlets.service_day_start`,
      with carried-over open tabs rendering regardless
- [ ] **Counter:** daily summary widget
- [ ] **Counter:** last-known-state cache and the stale banner
      (`DESIGN_SYSTEM.md` §10.1)
- [ ] **Counter:** printing — kitchen ticket on `processing`, receipt on
      `delivered`, both laid out per `DESIGN_SYSTEM.md` §10.1 at 32 columns
- [ ] **Counter:** the persistent Reprint button on every card in the active
      queue, ungated, writing `print_jobs` with `attempt` incremented
- [ ] **Manager:** branding — logo upload with the mono derivative generated at
      ingest, display name, and the accent hue (`DESIGN_SYSTEM.md` §3.1)
- [ ] **Manager:** menu CRUD — categories, items, prices, option groups, options
- [ ] **Manager:** image upload through the processing Edge Function, with
      `image_ready` gating and the credit ledger visible
- [ ] **Manager:** per-outlet availability toggles writing `outlet_menu_items`,
      including `restock_at`
- [ ] **Manager:** chain accent editor going through the Edge Function carve-out —
      3:1 validation and computed `accent_ink` (`API_CONTRACTS.md` §7.4)
- [ ] Realtime on the order feed for staff, which unlocks
      `API_CONTRACTS.md` §9.1 for the diner side

**Exit criteria.** A staff member 86's a dish on the tablet; a diner scanning
thirty seconds later sees NO STOCK on it, and cannot add it. Two phones order at
table 12, the counter settles one tab, and the total is right. An owner adds an
outlet and it inherits the full chain menu with **zero** rows written to
`outlet_menu_items`. Pull the tablet's network mid-service and the queue is still
on screen, plainly labelled stale. Move an order to `processing` and a ticket with
no prices comes out of the XP-P300; move it to `delivered` and a receipt with the
tab's total does. Take the paper out mid-service, put it back, press Reprint, and
the ticket comes out again with no other step in between.

**Printing gets spiked before this phase commits**, not during it. A PWA reaches
the printer only through WebUSB or Web Bluetooth, and the CM8200 charges through
the same Type-C port OTG needs (`ARCHITECTURE.md` §11, open item 7). Prove one
transport end to end on the real tablet with the real printer first. If neither
holds, that is a hardware or a delivery-model decision and it is cheaper to make
it before the counter UI is built around a print button that cannot fire.

**The restaurant app does not animate.** `DESIGN_SYSTEM.md` §9 — the landing
belongs to the diner app. An animated dashboard dilutes the one thing the demo is
for.

## Phase 5 — Internal ops dashboard

`apps/internal`. Cross-chain, and therefore the most policy-constrained surface
in the system (`ARCHITECTURE.md` §9).

- [ ] Separate auth tier — internal accounts are not staff accounts with a bigger
      claim
- [ ] Chain list with subscription and payment status
- [ ] Suspend and restore, writing `chains.status` and nothing else
- [ ] Support tickets
- [ ] Image credit grants against the ledger
- [ ] `audit_log` written on every internal write, and readable in the UI
- [ ] Revenue and usage rollups per chain

**Exit criteria.** Suspend a chain and its outlets' QR codes render the same
neutral closed state as an inactive outlet — **the diner payload never says why**
(`API_CONTRACTS.md` §2). Restore it and ordering resumes without a redeploy. Every
action taken in this phase's UI has a row in `audit_log` naming who did it.

**This phase is where the tenancy model gets tested properly.** Every other
surface is scoped to one chain by a claim; this one deliberately is not, and it is
the only place a cross-tenant leak can originate. Treat a missing predicate here
as a security bug, not a display bug.

## Phase 6 — Landing page and marketing site

Built after Phase 2, and `MARKETING.md` says why: this happens once the product
story is provable with real demo footage. Copy written against an animation that
does not exist yet describes an intention, and it always ends up promising
something slightly different from what shipped.

- [ ] `apps/landing`, deployed independently
- [ ] Above the fold: the landing itself, running, not a screenshot of it
- [ ] Demo footage captured on the target device class, not a desktop recording
- [ ] USP 2 told as the Chidi walk — one device, two outlets, no login
- [ ] Pricing stated plainly: ₦500,000 / ₦250,000 setup and ₦50,000 per outlet
      monthly, no curve (`PRD.md` § Business model)
- [ ] One conversion path — book a demo. No self-serve trial; onboarding needs a
      menu and photography, and neither self-serves yet.

**Exit criteria.** An owner who has never spoken to us understands both USPs from
the page alone, and the demo request is the only thing the page asks of them.

**The landing site does not inherit the diner app's motion.** It borrows the
palette and the type, but the 520ms landing is the product's, and a marketing
page that mimics it cheapens the thing it is selling.

**No longer blocked.** The name, the domain and the mark are all settled — Plated
on `plated.ng`, with the mark at `DESIGN_SYSTEM.md` §3.3. What survives of
`PRD.md` open question 2 is the trademark and CAC check, and that wants running
before Phase 7, because the QR cards carry the name as well as the URL and a
wrong one means reprinting every card in the building.

This is also the one surface our own mark appears on. `apps/landing` uses
`--graphite` on `--linen` per §3.3, and the fixed CTA accent stays separate from
the mark — a page that is all one colour argues nothing.

## Phase 7 — Pilot deployment

Real QR codes, real diners, real money changing hands at the counter.

Target profile from `PRD.md`: **2-3 outlets of the same chain**, in different
locations, sharing an overlapping customer base. Unrelated neighbouring
restaurants will not do — USP 2 is only observable across outlets of one brand,
so a pilot of three separate businesses demos the ordering flow and silently
omits half the product.

- [ ] One chain onboarded: chain record, accent validated at ingest, outlets
      created, logo uploaded and its mono derivative verified on real paper
      (`DESIGN_SYSTEM.md` §3.1)
- [ ] Full menu entered, every dish shot to the `DESIGN_SYSTEM.md` §7 spec,
      `image_ready` true across the board
- [ ] The one-page shoot guide handed over, and used at least once by the client
      without us in the room
- [ ] QR codes printed per table, `?t=` labels matching the floor plan — **and
      unique within the outlet**, because a duplicate label merges two parties
      onto one bill (`ARCHITECTURE.md` §11.2)
- [ ] Tablet, printer, router and first-month data installed and tested on site,
      including a spare paper roll left with the staff
- [ ] Both tickets printed on the client's own counter and read by their own
      kitchen before go-live — a 32-column layout that reads fine on screen can
      still wrap badly on paper
- [ ] Staff trained on the order feed, the availability toggles, settling a tab
      and changing the paper roll — the 86 workflow and the settle workflow are
      the two they touch every service, and the roll is the one thing that stops
      the counter dead
- [ ] Cookie lifetime re-checked on the phones these diners actually carry
- [ ] A named contact on our side for the pilot week; the first broken order
      needs a human answer in minutes, not a ticket

**Exit criteria.** A diner who has never seen the product orders unaided at
outlet 1, returns to outlet 2 inside the recognition window, and is greeted with
their count and their last order ready to re-add. A table of four orders from four
phones and pays one bill. Staff run a full service without calling us.

## Not on this roadmap

From `PRD.md` § Explicitly OUT of MVP scope, listed so a later session does not
read the absence as an oversight:

- In-app payment. The diner pays at the counter. When it arrives it must not hang
  off the device token (`ARCHITECTURE.md` §4.3), and it lands on the *session*,
  not the order — the tab is already the payment grain.
- POS and cash-register integration.
- A native app. PWA only.
- Diner accounts. The device is the identity, and USP 2 depends on there being
  nothing to sign into.
- Loyalty points, tax and service-charge modelling.
- Moving a tab between tables mid-meal (`ARCHITECTURE.md` §11.3).

Each has a place it would attach in the current schema, and each is a v2
conversation. None of them is a reason to delay Phase 2.
