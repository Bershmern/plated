# Full Project Context — QR Ordering SaaS (Nigeria)

Use this to audit and update /docs/*.md. Some of this may already be
reflected in the existing docs (PRD.md, ARCHITECTURE.md, API_CONTRACTS.md,
DESIGN_SYSTEM.md, ROADMAP.md, MARKETING.md, CLAUDE.md) — some of it may
NOT be, due to a prior session (Claude Code) running out of context
before finishing updates. Treat every point below as something to check
against the current doc state: if a doc already reflects it correctly,
leave it; if it's missing, outdated, or contradicts what's below, confirm with me what it's suppose to be then update
it and flag the change.

---

## 0. Agent Instructions
- **challange my thinking** where by I violate industry standard and best practices, I am open to been corrected.
- **Flagging**: When you flag something, I expect you to propose a solution or an alternative.
- **Self-Anneal Prompting**: At the end of your response, if you think there is something you could have done better, or something you missed, include it in a section called "Self-Anneal Prompting" and provide a prompt to fix it.


Originally scoped for Malaysia (QR table-ordering, inspired by the
founder's own dining experience abroad — scan, order, pay at counter).
Pivoted to Nigeria after concluding: (a) the Malaysian market is already
saturated with mature, well-funded players (StoreHub, Qashier, Eats365,
Dinlr), and (b) entering it as a foreign student on a study visa adds
legal/operational friction. Nigeria removes both problems — the founder
is Nigerian, knows the market, and there's no visa barrier to actively
operating the business.

Product is a QR-code table-ordering platform for restaurants. Diner
scans a QR at their table using their own phone, browses an animated
menu, places an order. Order routes to a tablet at the restaurant's
counter. Diner pays at the counter (no in-app payment in MVP). Business
model is subscription SaaS, explicitly NOT commission-based.

## 2. The one and only locked USP (do not let wording drift, incase the is other USP, this is the main one)

**Animated ordering experience** — as the diner scrolls through the menu, each dish visually animates onto a rendered table/dining scene at the top of the screen, giving the sense of food landing in front of them before they've ordered. This is the primary visual hook and is non-negotiable on execution quality.

## 3. Platform surfaces (four total)

1. **Diner PWA** — public, no login, device-based recognition only.
   Browser-based (PWA), not a native app, for MVP speed/no-install
   friction via QR scan.
2. **Restaurant App** — ONE shared codebase with role-gated views:
   - Counter/tablet role: live order queue, table tabs, daily summary, order printout, receipt printout, cash-in-hand tracking, voided orders tracking
   - Manager/CEO role: menu + image uploads, analytics, business tools, connect card to renew subscription with us (via paystack) and other settings that will give them control over their restaurant, etc
   Both roles scoped to that restaurant's own data only. (Merged into
   one app deliberately, rather than two separate builds, since both
   views need the same restaurant-scoped data and auth.)
3. **Internal Ops Dashboard** — company team only, platform-wide
   visibility: all restaurants/chains, subscription/payment status, our business finances, clients activities and api calls
   support tickets, ability to suspend a restaurant's/chain's access
   after a missed payment deadline, ability to send notifications to restaurants and other internal tools, other settings that will make the internal operations easier for the company, etc
   Separate, more restrictive auth
   tier from restaurant logins — this tier should be the MOST
   policy-constrained part of the system (cross-chain read access is
   powerful and should be narrow-write, audit-logged), not a
   permissions bypass.
4. **Landing/marketing site** — public.

Repo structure: `/apps/diner`, `/apps/restaurant`, `/apps/internal`,
`/apps/landing`.

Suspension behavior: a suspended chain's diner-facing QR should show a
neutral "closed"/inactive state — NEVER a billing/payment-dispute
message. The diner is not party to that dispute.

## 4. Order lifecycle & payment model

- Order states: **Incoming → Processing → Delivered → Paid/Completed**,
  or **Cancelled** (with a reason: Cancelled / Wasted / other — used for
  waste tracking: that "wasted" reason is only used for orders that got cancelled after started preparing).
- **Cancellation policy is CONFIGURABLE PER RESTAURANT**: each
  restaurant sets whether staff can cancel only while an order is still
  Incoming, or also after it has moved to Processing (food already
  being made). This is a client-side setting, not a fixed platform rule.
- **Payment is PER-TABLE (per tab), NOT per-order.** Orders from the
  same table/QR session accumulate into one running tab; staff close
  the whole tab as paid at the counter, not individual orders. This
  requires a `table_sessions` (or `visits`) entity that groups multiple
  `orders` records — a flat orders-only schema is insufficient.
  Fulfilment status (per order) and payment/settlement status (per tab)
  are two separate lifecycles — don't conflate them into one enum.
- An abandoned/forgotten open tab is a real operational risk (staff
  forgets to close it, a new party at the same table gets merged into
  the old tab). Worth a staleness flag on sessions open past a
  threshold (e.g. 2-3 hours), surfaced to staff as an unrecorded tab before a new order
  attaches to an old session.
- Tablet's visible/active order list resets on a FIXED daily schedule
  (6 AM), NOT a rolling 24-hour window. This is a VIEW filter only —
  historical order data is NOT deleted at reset; it persists for
  analytics and the reorder/recognition feature. An open (unsettled)
  tab must never disappear at the 6 AM boundary — it should carry over
  and render as such, regardless of age.
- Tablet includes a compact daily-summary widget (e.g. "23 orders
  processed today") alongside the live order queue.

## 5. Diner-facing flow 

1. Scan QR → welcome message (venue identity, e.g. "Pizza heaven ·
   Table 4" — NOT a personalized diner greeting; that's gated
   separately on whether recognition data exists) → animated table
   scene
2. Scroll through menu → food animates onto the table per item, that
   should be the main highlight of the app so pay more attention to this
   part, the app will be dead on arrival if this is not good.
3. Filter bar at top (by category) → tapping a filter scrolls to that
   section
4. Tap a dish → expands into an accordion (add-ons: extra cheese, no
   cheese, etc. — these are modeled as options with a price delta that
   may be zero)
5. "Add to Cart" button below the accordion → confirms addition, diner
   continues browsing

## 6. Hardware

- **Tablet:** C-Idea CM8200, 10.1", Android 14, WiFi + Bluetooth,
  Type-C port with OTG support. Used by the restaurant (counter/staff),
  NOT the diner — diners always use their own phone to order.
- **Printer:** SINGLE unit, Xprinter XP-P300 — 58mm, USB + Bluetooth,
  ESC/POS-compatible, built-in paper run-out alarm sensor. Connected to
  the tablet via USB (OTG). (Earlier two-printer plans — separate
  kitchen + counter units with a network print-bridge — were
  superseded by this single-printer decision.)
- **Router:** Airtel (airtel.ng) mobile broadband/MiFi-style router.
  Chosen for cost. Does NOT support hotspot/captive-portal firmware
  (see WiFi section below — this constrains what's possible).
- Hardware cost basis (for margin calculation): C-Idea CM8200
  ₦120,000–140,000 + Xprinter XP-P300 ₦60,000 + router/data ₦20,000
  (one-time inclusion in setup, NOT an ongoing absorbed cost per current
  plan — see open question below on data recharge) ≈ ₦200,000–220,000
  total hardware cost for the with-devices tier.

## 7. Print triggers & fallback

- Order status → "Processing": prints kitchen ticket (KOT) — items,
  quantities, modifiers, table number, timestamp, NO prices.
- Order status → "Delivered": prints counter/customer receipt —
  itemized list + total.
- No QR code on printouts (considered and dropped — redundant with the
  itemized info already printed).
- **Paper-out/print-failure fallback:** do NOT build software-side
  paper-out detection (unreliable across consumer thermal printers).
  Instead: log every print job against its order
  (`{order_id, type, status}`); rely on the printer's own built-in
  alarm (beep/LED) to alert staff physically; give every order in the
  tablet's active queue a persistent "Reprint" button, available at any
  time (not just right after a failure) — staff reload paper, tap
  Reprint. This design is intentionally failure-agnostic (works the
  same for paper-out, jams, or any other print failure).

## 8. AI image processing pipeline (menu photos)

- Requirement: restaurant owners submit raw phone photos of dishes,
  often poor quality. Every dish image needs to become a clean isolated
  cutout (background removed + enhanced/normalized for the animation requirment and efficiency) for the animation
  to render correctly — this is a FUNCTIONAL requirement for USP 1
  (the animation), not cosmetic polish, since a raw photo with its own
  background breaks the "food landing on the table" illusion.
- Recommended API: **Claid.ai** — bundles background removal +
  enhancement + upscaling into a single call/credit, avoiding the need
  to chain multiple single-purpose APIs.
- After cutout, the image should be programmatically normalized (scale
  + position so the cutout's bounding box bottom edge lands at a
  consistent point in frame) so inconsistent source photos don't break
  visual consistency in the animation — this is a deterministic
  post-processing step, distinct from what Claid.ai itself provides.
- Credit system: unlimited image processing for the first 30 days after
  onboarding (no hard cap enforced — restaurants rarely exceed ~50 menu
  items in practice). After the 30-day window: 10 credits/month bundled
  into the monthly retainer. 1 credit = 1 image upload + process.
  Credits RESET monthly, NO rollover. Additional credits purchasable
  beyond the bundle — exact resale price still undecided (early
  discussion floated ~₦1,000/credit as a ballpark, not finalized).
  Actual API cost per image is roughly ₦30–280 depending on
  provider/tier, well below any resale price under consideration — this
  is a high-margin secondary revenue stream, not a cost center.

## 9. Pricing 

- **With devices:** ₦500,000 one-time setup fee. Hardware cost basis
  ≈ ₦200,000–220,000 (see Section 6), leaving ≈ ₦280,000–300,000
  upfront margin.
- **Without devices:** ₦250,000 one-time setup fee, software only,
  restaurant uses its own device. Near-pure margin (minus
  onboarding/labor time).
- **Monthly retainer:** NOT a flat published number. Public marketing
  messaging is "From ₦20,000/month*" with "*setup fee not included"
  disclosed. ₦20,000/month is a genuine floor for smaller/early-stage
  businesses — not a bait number. Actual quoted monthly price scales
  UP from ₦20,000 based on an assessment of the prospective client's
  business size/traffic (see below), and can go well above ₦20,000 for
  larger operations.
- **No explicit price list shown publicly on the marketing site.**
  Instead, a "Get a Quote" form gathers business information (website,
  Instagram, product/scale signals, quick questionaires) to determine the actual quoted
  monthly price for that specific business before a number is given.
- Multi-outlet discount: retainer scales down toward ₦20,000 to ₦50,000 per outlet at
  volume for chains with multiple locations.
- Positioning is deliberately premium vs. the existing Nigerian market
  baseline (free tools exist — SPICE, Jampos; paid direct competitors
  TappyQR, QuickMenu.africa, Ordena undercut on price; broader POS
  software runs ₦5,000–50,000/month). Justification is the animation
  USP + full-service setup.

## 10. White-labeling & brand name

- The restaurant app and diner-facing PWA present as the RESTAURANT'S
  OWN tool — no visible platform branding in the primary UI.
- A small, unobtrusive "Powered by [BRAND]" tag appears in a
  low-visibility position (e.g. footer of the diner app, footer of the
  restaurant admin, or below their logo).
- **Brand name: Plated.** Chosen after a trademark/collision check
  ruled out several other candidates:
  - Servd — ruled out (existing restaurant-dining app with the same
    name, plus an existing US trademark filing in POS/hospitality SaaS)
  - Ordo — ruled out (multiple existing in-restaurant ordering/POS
    products already using this name, extremely close to this exact
    product category)
  - Tably — ruled out (an existing restaurant table-reservation app
    AND an unrelated existing data-analytics SaaS company both already
    use this name)
  - Nosh — usable but crowded (common English word, several
    food-adjacent apps already using it) — set aside in favor of Plated
  - Diniro — clear, nothing found in search. 
  - Plated — clear, nothing found in search. THIS IS THE LOCKED NAME.

## 11. Explicitly OUT of MVP scope

- In-app payment (diner pays at counter/tab only)
- POS/cash register integration with third-party systems (Will be added in the future)
- Native mobile app (PWA only)
- Login/accounts for diners (device-based recognition only)
- Loyalty points / rewards logic


## 12. Open questions / unresolved items (flag these, don't silently decide them)

- **Data recharge recurring cost:** the router+data ₦20,000 line item
  was described as a one-time inclusion in the setup fee, but mobile
  data on an Airtel router is inherently a recurring expense once the
  initial bundle is used up. It is NOT YET DECIDED whether the
  restaurant handles their own recharges after the initial bundle, or
  whether this is folded into the ongoing monthly retainer as an
  absorbed cost. This has real margin implications and needs a decision
  before it's treated as settled in any doc.(Answer: The restaurant handles their own recharges after the initial bundle)
- **Multi-outlet discount curve** (toward ₦50,000/outlet) needs
  reconciling against the newer ₦20,000-floor quote-based pricing model
  — unclear if these are still both accurate simultaneously. (Answer: See section 9: Pricing as the source of truth)
- **Additional image-processing credit price** beyond the 10/month
  bundle — ballparked at ~₦2,000/credit in discussion, not finalized. (Answer: The price is ₦1000 per credit)
- **Franchisee framing** — how the platform's chain-scoped recognition
  and billing should be framed/sold to franchise operators — flagged
  previously as commercial, not yet resolved. (Answer: Not sure yet)
- Product name/domain registration status (Plated is chosen, but
  actual domain registration, availability across .ng/.com/.africa, and
  any formal trademark filing were not confirmed as completed — only
  informal search-based collision-checking was done). (Answer: See section 10: White-labeling & brand name, .ng is available, however a business named plated nigeria limited exists, so we will use plated.ng as our domain, not plated.com)

## 13. Doc maintenance practice going forward

Regardless of which tool is used (Claude Code, Antigravity, etc.):
- Each `/docs/*.md` file should carry a one-line dependency header
  (`Depends on:` / `Read by:`) so a change's blast radius is
  immediately visible.
- Cross-cutting facts (the two USPs, pricing, tech stack) should live
  in exactly ONE source-of-truth file (PRD.md), with other docs
  referencing rather than restating them, to avoid version drift.
- Before editing multiple docs after a real decision change, run an
  explicit audit pass first: identify every doc/section that
  references or assumes the old decision, produce a collision report,
  THEN edit — don't silently patch one file and hope the rest still
  agree.
- Maintain a running `DECISIONS.md` log — one dated line per locked
  decision plus which files it touches — as a fast-scan reference
  before future audits.
