# QR Ordering SaaS — MVP Blueprint

> **SUPERSEDED — historical record, not a source of truth.** This is the original
> planning document. `/docs` and `CLAUDE.md` are now authoritative and disagree
> with it on several points: the market is Nigeria, there are **four** apps not
> three (`diner`, `restaurant`, `internal`, `landing`), the restaurant app is one
> codebase with two roles rather than a separate admin app, there is no
> `restaurants` table, payments are not a Malaysian gateway question, and the
> phase list runs 0–7. Read `docs/ROADMAP.md` for the real one. Kept because the
> reasoning in §4 and §5 still holds and the file records where the project
> started.

## 1. Repo doc structure (create these files first, before any code)

```
/CLAUDE.md              ← project constitution, read every session
/docs/
  PRD.md                 ← what we're building & why (USPs locked here)
  ARCHITECTURE.md         ← stack, data model, folder structure
  DESIGN_SYSTEM.md        ← tokens, animation principles, brand feel
  API_CONTRACTS.md        ← every endpoint, request/response shape
  ROADMAP.md              ← phase checklist (this doc's Section 3, expanded)
  MARKETING.md            ← landing page copy, positioning, voice
/apps/
  web/                    ← the PWA (diner-facing ordering app)
  admin/                  ← restaurant dashboard (menu mgmt, orders)
  landing/                ← marketing site
/packages/
  ui/                     ← shared animated components (used by web + admin)
  db/                     ← schema, migrations, queries
```

**Why this matters for Claude Code specifically:** each `docs/*.md` file is small and single-purpose. You point Claude Code at ONE doc per task ("read ARCHITECTURE.md, build the menu API") instead of pasting the whole idea into every prompt — that's what keeps context from overflowing as the project grows.

`CLAUDE.md` at the root should be short — just: what the product is, the two locked USPs, tech stack in one line each, and "read the relevant /docs file before building any feature." Claude Code auto-reads this file every session.

---

## 2. Recommended stack (optimized for: fast MVP, animation quality, no POS integration yet)

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | Next.js (App Router) + TypeScript | PWA support, fast, huge ecosystem, Claude Code knows it well |
| Styling | Tailwind CSS | Speed + consistency; pairs with the `frontend-design` skill for non-generic look |
| Animation | Framer Motion | Purpose-built for the "food slides onto the table as you swipe" interaction — this is your #1 USP, don't cut corners here |
| Backend/DB | Supabase (Postgres + Edge Functions) | Fastest path to a real backend without managing infra; built-in realtime (useful later for kitchen-side order updates) |
| Device recognition | Signed cookie/localStorage UUID, mapped to `diner_profiles` table | No login, works across restaurants since it's one shared domain |
| Payments (v2, not MVP) | Touch 'n Go eWallet / DuitNow QR via Billplz or similar MY gateway | MVP is pay-at-counter; don't build this yet |
| Hosting | Vercel (web/admin/landing) + Supabase cloud | Zero-ops for MVP stage |

Keep the diner app and admin dashboard as **separate apps in the same monorepo**, not one app with role-based routing — cleaner for Claude Code to reason about, and you'll want to deploy/scale them independently later.

---

## 3. Build order (phases — don't skip ahead)

**Phase 0 — Docs & scaffolding** (before writing feature code)
- Fill in PRD.md, ARCHITECTURE.md, DESIGN_SYSTEM.md (templates below)
- Scaffold the monorepo, get a blank Next.js app deploying to Vercel

**Phase 1 — Core ordering flow (single restaurant, no animation polish yet)**
- Menu display, cart, submit order → lands in a simple order queue
- Device ID generation + `diner_profiles` table wired up
- Goal: prove the plumbing works, ugly is fine

**Phase 2 — The USP animation layer**
- Swipe-through menu with the food-onto-table motion
- This is where the `frontend-design` skill and Framer Motion work happens
- Goal: this is the moment you'd actually demo to a restaurant owner

**Phase 3 — Cross-restaurant recognition**
- Add a 2nd and 3rd restaurant into the same platform
- "Welcome back" moment showing previous orders at THIS restaurant, pulled via the shared device ID
- Goal: prove USP #2 end-to-end across venues

**Phase 4 — Restaurant admin (minimum viable)**
- Menu CRUD, live order feed for staff
- No POS integration yet — staff just sees orders on a tablet/screen

**Phase 5 — Landing page / marketing site**
- Separate from the app; built once the product story is provable with real screenshots/demo footage
- Use `frontend-design` skill here too — no generic template look

**Phase 6 — Pilot deployment**
- Onboard your 2-3 chosen restaurants (same customer base), real QR codes printed, real diners

Don't build Phase 4+ before Phase 2 works and looks good — the animation IS the pitch, prove that first.

---

## 4. Skills & tools to invoke in Claude Code, by phase

- **frontend-design skill** — use for every UI-building session (Phase 2, 4, 5). It exists specifically to stop output from looking like default AI-generated UI.
- **A design-tokens pass early** (Phase 0/2) — lock colors, type scale, spacing, motion-easing curves into DESIGN_SYSTEM.md so every later session pulls from the same source instead of Claude Code re-inventing style each time.
- Standard docs/PDF/pptx skills aren't relevant to build phases — only if you're generating a pitch deck or investor one-pager later.

---

## 5. What goes in each docs file (fill these in next, together)

- **PRD.md**: problem, the two USPs (verbatim, don't let them drift), target restaurant profile, what's explicitly OUT of MVP scope (POS integration, in-app payment, native app, loyalty points)
- **ARCHITECTURE.md**: exact schema for `diner_profiles`, `orders`, `restaurants`, `menu_items`; how device ID → cross-restaurant lookup actually queries
- **DESIGN_SYSTEM.md**: the "food comes onto the table" animation spec in detail — timing, easing, trigger (swipe vs tap), what device performance floor you're targeting
- **MARKETING.md**: landing page structure, headline options, tone (this is separate from app design — website copy is a distinct task from app UX)

---

## Next step
Fill in `PRD.md` first — that's the one file every other doc and every Claude Code session should trace back to. Want me to draft it now with the two USPs locked in, or do you want to nail the animation spec (DESIGN_SYSTEM.md) first since that's your non-negotiable?
