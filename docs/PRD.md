# Product Requirements — QR Ordering SaaS (Plated)

> **Depends on:** None (Source of Truth)  
> **Read by:** `ARCHITECTURE.md`, `API_CONTRACTS.md`, `DESIGN_SYSTEM.md`, `ROADMAP.md`, `MARKETING.md`, `CLAUDE.md`, `DECISIONS.md`  

This is the primary source document. Every other doc in `/docs` and every build session traces back to here.

---

## Market

**Nigeria.** The product was scoped and built specifically for the Nigerian restaurant market. The competitive field is split between free/cheap functional tools (PDF redirects, static list menus) that offer zero brand experience, visual delight, or payment flexibility. Plated bridges this gap with an engaging dining experience, total white-labelling, and flexible online/offline payment.

---

## Problem

Diners scan a QR code to order at a table or place orders online for pickup/delivery, but existing tools are functional and forgettable — plain menu lists with no visual delight and no brand personality. Restaurant owners are forced to use generic third-party interfaces that dilute their brand identity.

---

## Primary Locked USP 1 — Animated Ordering Experience

As the diner swipes through the menu, each dish animates visually onto a rendered table/dining scene at the top of the screen — food doesn't just appear as a static image, it moves into place, giving the sense of the dish landing in front of them before they've ordered it. **This is the primary visual hook of the product and is non-negotiable on execution quality.**

---

## Primary Locked USP 2 — Complete White-Labelling

The software presents entirely as the restaurant's own proprietary app. Managers can customize:
1. **Brand Logo**: High-res logo displayed across the diner app and header.
2. **Color System**: Custom primary and secondary hex colors applied throughout the diner interface.
3. **Curated Restaurant Typography**: Selectable font family from a curated list of restaurant-optimized web fonts (*Inter, Plus Jakarta Sans, Outfit, Playfair Display, Space Grotesk, Cormorant Garamond*).

---

## Diner Experience & Recognition

### Scope & Fulfillment Types
The diner app (`apps/diner`) supports three fulfillment modes:
- **Dine-In**: Scanned via table QR code (`/o/<outlet_slug>?t=<table_label>`).
- **Pickup**: Order online, collect at venue.
- **Delivery**: Order online with delivery address and contact details.

### Dual Payment Engine (Online & Offline)
Diners can pay through two flexible paths:
1. **Online Payment**: Direct online checkout integrated via **Moniepoint**, automatically splitting our **1% platform fee** (passed to diner as a convenience fee) on transaction processing.
2. **Offline (Counter) Payment**: Diner submits order and pays staff at the counter via Cash, POS terminal, or Bank Transfer. Staff confirms payment on the counter tablet app.

### Silent Diner Recognition & Greeting
The app remembers returning diners across dine-in, pickup, or delivery using a silent device cookie `(device, chain)`.
- **Recognized Diner Experience**: Shows a clean, friendly greeting banner at the top of the menu:  
  👉 *"Welcome back! This is your 5th order with us."*
- **Unrecognized Diner Experience**: Shows no greeting banner and no empty state — straight to the menu. Silence is the specified behavior.

---

## The Four Platform Surfaces

| Surface | Who | Auth | Scope | Core Capabilities |
|---|---|---|---|---|
| **Diner App** (`apps/diner`) | Diners (on mobile browser) | None. Device identity only. | One outlet at a time, one chain | Animated food stage, category rail, option accordion, cart, Moniepoint online payment checkout, offline counter payment selection, **Dine-in / Pickup / Delivery** selector. |
| **Restaurant App** (`apps/restaurant`) | Counter staff & Manager/Owner | Login, role-gated (**one codebase, two roles**) | That chain's own data only | **Counter:** Live order feed, table tabs, 6 AM daily reset, ESC/POS kitchen & receipt printing, **cash-in-hand tracking**, **payment confirmation (for counter pay)**, stock availability toggles.<br>**Manager:** Menu CRUD, stock toggles, notifications from software owner, analytics, **whitelabel settings** (colors, typography font picker, brand logo upload). |
| **Internal Ops** (`apps/internal`) | Company team | Separate, restricted auth tier | Platform-wide | Multi-tenant governance, restaurant management/suspension, broadcast notifications to restaurants, platform analytics & Moniepoint 1% fee rollups, audit logs. |
| **Landing Site** (`apps/landing`) | Prospective clients | Public | — | Live product hero demo, pricing breakdown (₦20,000/mo + ₦100,000 setup + 1% convenience fee passed to diner), demo booking form. |

---

## Order Lifecycle and Payment Confirmation

Two lifecycles, deliberately separate:

**Per order — Fulfilment:**

```
Incoming → Processing → Delivered → Completed
     ↓          ↓
   Cancelled (with reason: Cancelled / Wasted / Other)
```

- **`Wasted` Cancellation Rule:** The `wasted` reason is strictly reserved for orders cancelled **after** kitchen preparation has started (`Processing` state). An order cancelled while `Incoming` is recorded as `Cancelled`.
- **Cancellation Policy Configuration:** Configurable per chain — staff can cancel `incoming_only` or `through_processing`.

**Per order / tab — Payment:**

```
pending → paid
  ↓
 failed / void
```

- **Online Payments**: Processed via Moniepoint webhook, updating `payment_status` to `paid` automatically.
- **Offline (Counter) Payments**: Orders/tabs land as `pending`. Counter staff taps **Confirm Payment** (Cash / POS / Transfer) on the tablet app to update status to `paid`.

---

## Hardware and Printing

One tablet and one printer per outlet:

| Device | Model | Details |
|---|---|---|
| **Tablet** | C-Idea CM8200, 10.1", Android 14 | WiFi + Bluetooth, Type-C port with OTG support. Used by counter staff. |
| **Printer** | Xprinter XP-P300 | 58mm thermal, USB + Bluetooth, ESC/POS, built-in paper run-out alarm. Connected via USB-OTG. |

### Print Triggers & Failure Fallback
* `Processing` → Prints kitchen ticket (items, qty, options, table/fulfillment, timestamp. **No prices**).
* `Delivered` / `Completed` → Prints counter/customer receipt (itemised list + total).
* **Failure Fallback:** Persistent **Reprint** button on every order card in the counter tablet app.

---

## Business Model & Pricing

Subscription SaaS with a one-time setup fee and a platform transaction fee.

1. **SaaS Subscription**: **₦20,000 / month** per restaurant chain.
2. **One-Time Setup Fee**: **₦100,000** (Onboarding, menu ingest, staff training, system configuration).
3. **Platform Convenience Fee**: **1% of order value** passed to the customer at checkout (automatically split via Moniepoint payment engine).

---

## Settled Decisions Summary

1. **Market:** Nigeria (NGN, `bigint` kobo `_minor`).
2. **Primary USP 1:** Animated Ordering Experience (#1 visual hook).
3. **Primary USP 2:** Complete White-Labelling (Logo, colors, curated restaurant web fonts).
4. **Pricing:** ₦20,000/mo subscription + ₦100,000 setup fee + 1% convenience fee passed to diner (Moniepoint auto-split).
5. **Fulfillment:** Dine-in, Pickup, and Delivery supported in `apps/diner`.
6. **Payment:** Online (Moniepoint) or Offline (Counter Cash/POS/Transfer with staff confirmation).
7. **Diner Recognition:** Silent greeting count (*"This is your X order with us!"*) across all fulfillment types.
8. **Domain:** `plated.ng`.
