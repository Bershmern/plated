# Product Requirements — QR Ordering SaaS

> **Depends on:** None (Source of Truth)  
> **Read by:** `ARCHITECTURE.md`, `API_CONTRACTS.md`, `DESIGN_SYSTEM.md`, `ROADMAP.md`, `MARKETING.md`, `CLAUDE.md`, `DECISIONS.md`  

This is the primary source document. Every other doc in `/docs` and every build session traces back to here.

---

## Market

**Nigeria.** The product was first scoped for Malaysia and pivoted for two structural reasons:

1. Malaysia is saturated with mature, funded incumbents — StoreHub, Qashier, Eats365, Dinlr — competing on POS depth and price.
2. Selling there as a foreign student on a study visa adds legal and operational friction to every deal.

Nigeria removes both. The founder is Nigerian, knows the market, and has no visa barrier. The competitive field is thinner and split at the extremes: free or near-free tools (SPICE, Jampos) at one end, and cheap paid QR menus (TappyQR, QuickMenu.africa, Ordena) at the other. Nobody in that field competes on the dining experience itself.

---

## Problem

Diners scan a QR code to order at the table, but existing tools are functional and forgettable — plain menu lists, no memory of the diner, no visual delight. Restaurant owners choose between free tools that look free and paid tools that are a PDF behind a redirect. Nobody is selling the *moment*.

---

## Primary Locked USP — Animated Ordering Experience

As the diner swipes through the menu, each dish animates visually onto a rendered table/dining scene at the top of the screen — food doesn't just appear as a static image, it moves into place, giving the sense of the dish landing in front of them before they've ordered it. **This is the primary visual hook of the product and is non-negotiable on execution quality.**

---

## Core Feature — Loginless Cross-Outlet Recognition

The app remembers a diner by device and restaurant chain (no account, no login). When that diner returns to any outlet of a chain they have ordered from before on our platform, it surfaces their previous orders from that chain so they can reorder in one tap. Recognition is scoped to the chain: history follows the diner across every outlet of the same brand, and never crosses between brands.

### Recognition Behaviour — Canonical Examples

Treat these as acceptance tests for recognition. Brand names are illustrative.

- **Chidi** (iPhone 15 Pro) orders at Chicken Republic Ikeja, later scans at Chicken Republic Lekki on the same device. Both outlets are on our platform → he sees his Ikeja history at Lekki.
- **Aisha** (Tecno Spark) orders at Chicken Republic Lekki, later scans at Café Neo Wuse. Both are on our platform → she sees **nothing** at Café Neo, having never ordered at a Café Neo outlet. Her Chicken Republic history does not follow her to another brand.
- **Tunde** frequents Café Neo, Chicken Republic and The Place across Lagos and Abuja, all on our platform → at any Chicken Republic he sees only his Chicken Republic history; at The Place only his The Place history; at Café Neo only his Café Neo history. One device, several independent per-brand histories.

**Rule:** History is keyed on `(device, chain)`. It pools across all outlets of one chain and is siloed between chains.

### Returning-Diner Experience

When a recognised diner scans at any outlet of a chain they have ordered from:

1. **Greeting** — "Welcome back, you've ordered for the 5th time... we love you!" The count is per `(device, chain)` and never resets.
2. **Last Order Replayed** — The items from their most recent order at that chain, ready to re-add in one tap.
3. **Availability Marked, Not Hidden** — An item this outlet doesn't stock today shows "No Stock"; an item not on this outlet's menu at all shows "No Product". Both stay visible, neither is orderable.

Prices, images, and descriptions always resolve against the **current outlet's** menu, never the snapshot stored with the old order.

A diner we don't recognise sees no greeting and no history — just the menu. No empty state, no prompt to sign in. Silence is the specified behaviour.

---

## The Four Platform Surfaces

| Surface | Who | Auth | Scope | Core Capabilities |
|---|---|---|---|---|
| **Diner PWA** | The diner, on their own phone | None. Device identity only. | One outlet at a time, one chain's history | Animated table stage, category filter bar, option accordion, cart, order submission. |
| **Restaurant App** | Counter staff and Manager/CEO | Login, role-gated (**one codebase, two roles**) | That chain's own data only | **Counter:** live order feed, table tabs, 6 AM daily reset, kitchen/receipt thermal printing, **cash-in-hand tracking**, **voided order tracking**.<br>**Manager:** menu CRUD, Claid.ai photo ingest, availability toggles, accent hex, **Paystack card connection for SaaS subscription renewal**. |
| **Internal Ops** | Company team | Separate, highly restricted auth tier | Platform-wide | Multi-tenant governance, **company business finances**, **client API calls & activity metrics**, support tickets, chain suspension, **in-app broadcast notifications to restaurants**, audit logs. |
| **Landing Site** | Prospective clients | Public | — | Live product hero, pricing breakdown, **"Get a Quote" questionnaire form**. |

---

## Order Lifecycle and the Tab

Two lifecycles, deliberately separate:

**Per order — Fulfilment:**

```
Incoming → Processing → Delivered → Paid/Completed
     ↓          ↓
   Cancelled (with reason: Cancelled / Wasted / Other)
```

- **`Wasted` Cancellation Rule:** The `wasted` reason is **strictly reserved for orders cancelled AFTER preparation has started** (`Processing` state). An order cancelled while `Incoming` is recorded as `Cancelled`.
- **Cancellation Policy Configuration:** Configurable per chain — staff can cancel `incoming_only` or `through_processing`.

**Per table — Payment (The Tab):**

```
open → settled
  ↓
 void
```

- **Payment is per tab (`table_sessions`), not per order.** Orders from the same table accumulate into one tab; staff close the whole tab as paid at the counter.
- **Session Staleness Alert:** Sessions open past **2–3 hours** surface a staleness/unrecorded tab alert to counter staff before a new order attaches to an old session.
- **The Daily Reset:** The counter's visible order list clears on a fixed daily schedule (6 AM local time). It is a **view filter only** — nothing is deleted. An open (unsettled) tab **carries over** across the 6 AM boundary.
- **Daily Summary Widget:** Compact widget on the counter till showing daily metrics (e.g. "23 orders processed today", cash collected, void count).

---

## Hardware and Printing

One tablet and one printer per outlet:

| Device | Model | Details |
|---|---|---|
| **Tablet** | C-Idea CM8200, 10.1", Android 14 | WiFi + Bluetooth, Type-C port with OTG support. Used by counter staff. |
| **Printer** | Xprinter XP-P300 | 58mm thermal, USB + Bluetooth, ESC/POS, built-in paper run-out alarm. Connected via USB-OTG. |
| **Router** | Airtel mobile broadband (MiFi) | Cost-effective router. Does not support captive portal firmware. |

### Hardware Cost Basis
* Tablet: ₦120,000–140,000
* Thermal Printer: ₦60,000
* Router & initial 1-month bundle: ₦20,000
* **Total hardware cost basis:** ₦200,000–220,000 for the With Devices tier.

### Print Triggers & Failure Fallback
* `Processing` → Prints kitchen ticket (items, qty, options, table, timestamp. **No prices**).
* `Delivered` → Prints counter/customer receipt (itemised list + total).
* **Failure Fallback:** No unreliable software paper-out sensing. Printer beeps/lights on paper-out. Every active order has a persistent **Reprint** button on the counter tablet.

---

## Menu Imagery & AI Pipeline

* **Pipeline:** Claid.ai for background removal + enhancement + upscaling in a single call.
* **Post-processing Normalisation:** Deterministic scale and bottom-edge positioning pass so cutouts land consistently on the table stage.
* **Credit System:**
  * **First 30 days:** Unlimited image processing (no cap enforced).
  * **After 30 days:** 10 credits/month bundled into monthly retainer (resets monthly, no rollover).
  * **Additional Credits:** **₦1,000 per credit** (purchasable in bundles, API cost ≈ ₦30–280).

---

## Business Model & Pricing

Subscription SaaS with a one-time setup fee. **Not commission-based.**

### One-Time Setup Fee
| Tier | Price | Includes |
|---|---|---|
| **With Devices** | ₦500,000 | Tablet, 58mm thermal printer, router + 1st month data, on-site installation, menu ingest, staff training. (Margin: ₦280k–300k). |
| **Software Only** | ₦250,000 | Same setup & onboarding on restaurant's existing 58mm ESC/POS hardware. |

* **Router Data Recharge:** The setup fee includes the router and the **first month of mobile data**. All subsequent monthly data recharges are **handled directly by the restaurant**.

### Monthly Retainer
* **Quote-Based Model:** Marketing publishes *"From ₦20,000/month\*"* (disclosing setup fee not included). ₦20,000 is a genuine floor for single/small venues.
* **Get a Quote Questionnaire:** Prospective clients submit business signals (website, Instagram, outlet count, order volume) on `apps/landing` to receive their custom quoted retainer.
* **Multi-Outlet Scaling Curve:** Retainer scales down toward ₦20,000–₦50,000 per outlet at volume for multi-location chains.

---

## White-Labelling, Brand Name & Domain

* **Product presents as the restaurant's own.** No platform logo in primary UI.
* **Platform Tag:** `POWERED BY PLATED` in small muted caps at foot of diner PWA & restaurant app.
* **Brand Name:** **Plated**.
* **Domain:** **`plated.ng`** (locked; used due to existing local company registration norms).

---

## Explicitly OUT of MVP Scope

- In-app diner payment (diner pays at counter/tab).
- Direct 3rd-party POS integration (v2 roadmap).
- Native mobile app (PWA only).
- Diner accounts (device identity only).
- Loyalty points and rewards logic.

---

## Settled Decisions Summary

1. **Market:** Nigeria (NGN, `bigint` kobo `_minor`).
2. **Primary USP:** Animated Ordering Experience (#1 visual hook).
3. **Pricing:** Setup ₦500k/₦250k. Monthly retainer quote-based starting at ₦20,000/mo. Extra image credits ₦1,000/credit.
4. **Data Recharge:** Restaurant handles after month 1.
5. **Domain:** `plated.ng`.
6. **Restaurant App:** Shared codebase, 2 roles. Counter includes cash-in-hand & void tracking. Manager includes Paystack subscription card renewal.
7. **Internal Ops:** Business finances, client API metrics, broadcast notifications to restaurants.
