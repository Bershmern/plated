# CLAUDE.md

**Plated** — a QR-code ordering SaaS for restaurants in Nigeria. A diner scans the code at their table (or accesses pickup/delivery links), browses an animated menu where dishes land on a virtual table stage, and submits an order. Staff receive the order on a counter tablet, print kitchen tickets/receipts, and the diner pays either online (Moniepoint) or offline at the counter.

**Read the relevant `/docs` file before writing code.** This file routes; it does not restate. Where this file and a `/docs` file disagree, `/docs` wins.

**CRITICAL RULE:** Read `PLANNING_RULES.md` first. You MUST plan, evaluate, and explicitly wait for user approval before making any code changes or implementations.

## Primary USPs

Defined in `PRD.md` and locked:

1. **USP 1 — Animated Ordering Experience**: Dishes animate onto a rendered table stage as the diner swipes. Non-negotiable on visual quality — this is the primary visual hook.
2. **USP 2 — Complete White-Labelling**: Custom brand logo, primary/secondary color hexes, and curated restaurant typography (*Inter, Plus Jakarta Sans, Outfit, Playfair Display, Space Grotesk, Cormorant Garamond*).

## Stack & Pricing

| Layer | Choice |
|---|---|
| Framework | Next.js App Router + TypeScript |
| Styling | Tailwind CSS + Whitelabel CSS Custom Properties |
| Animation | Framer Motion |
| Database | Supabase Postgres |
| Server Logic | Supabase Edge Functions (Deno) |
| Hosting | Vercel (four projects) + Supabase Cloud |
| Payments | Online via **Moniepoint** (0.5% auto-split) or Offline at Counter |
| Pricing | **₦10,000/month** subscription + **₦50,000** setup fee + **0.5%** transaction fee |

## The Four Surfaces

| App | Who | Auth |
|---|---|---|
| `apps/diner` | Diners (on mobile browser). Supports Dine-in, Pickup, Delivery. | None — device identity only |
| `apps/restaurant` | Counter and Manager, **one codebase, two roles** | Login, role + outlet scope |
| `apps/internal` | Company ops team, platform-wide governance | Separate restricted auth tier |
| `apps/landing` | Prospective client restaurant owners | Public |

## Where to Look

| Question | File |
|---|---|
| What are we building; USPs; pricing; payment & fulfillment | `docs/PRD.md` |
| Locked decision log and date history | `docs/DECISIONS.md` |
| Schema, Moniepoint integration, tenancy, whitelabel CSS | `docs/ARCHITECTURE.md` |
| Design tokens, animation specs, font pairings | `docs/DESIGN_SYSTEM.md` |
| Endpoints, request/response contracts, Moniepoint webhooks | `docs/API_CONTRACTS.md` |
| Implementation phases and exit criteria | `docs/ROADMAP.md` |
| Marketing positioning, pricing copy, demo booking | `docs/MARKETING.md` |

## Key Rules & Conventions

- **Money is `bigint` in kobo**, columns suffixed `_minor`, never float. Diners see whole Naira (`₦4,500`).
- **Platform Fee is 0.5%** of order total (`platform_fee_minor`), split automatically via Moniepoint.
- **Two Lifecycles**: `orders.status` (`incoming|processing|ready|delivered|completed|cancelled`) and `orders.payment_status` (`pending|paid|failed`).
- **Diner Identity**: Silent recognition `(device, chain)` displaying greeting *"This is your X order with us!"*. No account required.
- **Manager Capabilities**: Menu CRUD, stock availability toggles, Moniepoint details, internal notifications, analytics, **Whitelabel theme settings**.
- **Counter Capabilities**: Live order feed, 6 AM daily reset, ESC/POS ticket printing, **confirm counter payment** (cash/POS/transfer), stock toggles.
