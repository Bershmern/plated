# Locked Decisions Log — Plated (QR Ordering SaaS)

This log records binding architectural and business decisions. Each entry lists the date locked, decision detail, and files affected.

---

| Date | Decision | Files Affected |
|---|---|---|
| 2026-08-09 | **Market & Currency:** Nigeria market. Currency NGN stored in integer minor units (`bigint` kobo, `_minor`). | `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md` |
| 2026-08-09 | **Primary USP 1:** #1 Primary locked USP is the **Animated Ordering Experience** (520ms Framer Motion landing on a rendered stage). | `PRD.md`, `DESIGN_SYSTEM.md`, `CLAUDE.md` |
| 2026-08-14 | **Primary USP 2:** #2 Primary locked USP is **Complete White-Labelling** (Custom logo, primary/secondary color hexes, and curated restaurant web fonts: Inter, Plus Jakarta Sans, Outfit, Playfair Display, Space Grotesk, Cormorant Garamond). | `PRD.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `CLAUDE.md` |
| 2026-08-14 | **Pricing Structure (Realigned):** SaaS Subscription **₦20,000 / month** + One-Time Setup **₦100,000** + **1% platform convenience fee** (passed to diner). | `PRD.md`, `MARKETING.md`, `ROADMAP.md`, `CLAUDE.md` |
| 2026-08-14 | **Payment Engine & Split Fee:** **Moniepoint** payment integration with automated **1% fee splitting** for online diner payments, plus offline counter payment option (Cash / POS / Transfer) with counter staff confirmation. | `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md` |
| 2026-08-14 | **Diner Scope & Recognition:** `apps/diner` supports **Dine-in, Pickup, and Delivery**. Returning diners recognized via silent cookie `(device, chain)` displaying a simple greeting (*"This is your X order with us!"*). | `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md`, `CLAUDE.md` |
| 2026-08-09 | **Data Recharge:** Mobile data recharge on Airtel router after initial 1-month setup bundle is handled directly by the **restaurant**. | `PRD.md`, `ARCHITECTURE.md`, `ROADMAP.md` |
| 2026-08-09 | **Domain & Legal Entity:** Brand name is **Plated**. Domain locked to **`plated.ng`**. | `PRD.md`, `MARKETING.md` |
| 2026-08-09 | **Restaurant App Features:** Shared codebase, two roles: Counter (order queue, table tabs, 6am reset, ESC/POS printing, **cash-in-hand tracking**, **payment confirm for counter pay**) & Manager (menu CRUD, image uploads, whitelabel settings, analytics). | `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md` |
| 2026-08-09 | **Internal Ops Features:** Platform-wide governance: multi-tenant metrics, **company finances & 1% fee rollups**, client API calls, chain suspension, and broadcast notifications to restaurants. | `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md` |
| 2026-08-09 | **Order & Session Rules:** Cancellation reason `wasted` is strictly gated to orders cancelled during/after `Processing`. | `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md` |
