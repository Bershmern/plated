# Locked Decisions Log — Plated (QR Table-Ordering SaaS)

This log records binding architectural and business decisions. Each entry lists the date locked, decision detail, and files affected.

---

| Date | Decision | Files Affected |
|---|---|---|
| 2026-08-09 | **Market & Currency:** Nigeria market. Currency NGN stored in integer minor units (`bigint` kobo, `_minor`). | `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md` |
| 2026-08-09 | **Primary USP:** #1 Primary locked USP is the **Animated Ordering Experience** (520ms Framer Motion landing on a rendered stage). | `PRD.md`, `DESIGN_SYSTEM.md`, `CLAUDE.md` |
| 2026-08-09 | **Pricing Structure:** Setup ₦500,000 (with devices) / ₦250,000 (software only). Monthly retainer is **quote-based starting from ₦20,000/month\*** ("Get a Quote" questionnaire on landing site). Multi-outlet discount scales down toward ₦20,000–₦50,000/outlet. | `PRD.md`, `MARKETING.md`, `ROADMAP.md`, `CLAUDE.md` |
| 2026-08-09 | **Data Recharge:** Mobile data recharge on Airtel router after initial 1-month setup bundle is handled directly by the **restaurant**. | `PRD.md`, `ARCHITECTURE.md`, `ROADMAP.md` |
| 2026-08-09 | **Extra Image Credits:** Extra image processing credits beyond the 10/month bundle cost **₦1,000 per credit**. | `PRD.md`, `ARCHITECTURE.md`, `ROADMAP.md` |
| 2026-08-09 | **Domain & Legal Entity:** Brand name is **Plated**. Domain locked to **`plated.ng`** (since a business named Plated Nigeria Limited exists, `plated.ng` is used rather than `plated.com`). | `PRD.md`, `MARKETING.md` |
| 2026-08-09 | **Restaurant App Features:** Shared codebase, two roles: Counter (order queue, table tabs, 6am reset, printing, **cash-in-hand tracking**, **voided order tracking**) & Manager (menu CRUD, image uploads, **Paystack card connection/subscription renewal**). | `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md` |
| 2026-08-09 | **Internal Ops Features:** Platform-wide visibility: multi-tenant metrics, **our business finances**, **client API calls & activity metrics**, support tickets, chain suspension, and **in-app broadcast notifications/announcements to restaurants**. | `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md` |
| 2026-08-09 | **Order & Session Rules:** Cancellation reason `wasted` is strictly gated to orders cancelled during/after `Processing`. Sessions open past 2–3 hours trigger a staleness flag on counter till. | `PRD.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md` |
