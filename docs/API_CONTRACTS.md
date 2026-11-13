# API Contracts — QR Ordering SaaS

> **Depends on:** `PRD.md`, `ARCHITECTURE.md`  
> **Read by:** `ROADMAP.md`, `CLAUDE.md`  

> Every endpoint the product has, with request and response shapes. Traces back
> to `PRD.md`; schema and query semantics come from `ARCHITECTURE.md` and this
> file never contradicts them. Where a payload field maps to a column, the
> column is the truth.

## 1. Conventions

| | |
|---|---|
| Diner base | `https://order.plated.ng/fn/v1` — Supabase Edge Functions, service role |
| Restaurant + internal | Supabase PostgREST + Auth, not endpoints in this file. See §7. |
| Content type | `application/json` on request and response, always |
| Money | Integer minor units (kobo), field suffix `_minor`. Never a float, never a formatted string. |
| Times | ISO 8601 with offset, UTC on the wire. Outlet-local rendering is the client's job. |
| Versioning | Path segment `v1`. A breaking payload change is `v2`, not a flag. |

Four rules hold for every diner endpoint:

**The server owns money.** Requests never carry prices. The client sends
`menu_item_id`, `option_id`s and `qty`; the function reads `price_minor` and
`price_delta_minor` from the live menu and writes the snapshots itself. A
tampered cart cannot change a total.

**The server owns identity.** Requests never carry a `device_id` in the body.
Identity comes from the `__Host-dt` cookie, or from the mirror on repair
(`ARCHITECTURE.md` §4). A body field naming a device is ignored if present.

**The server owns the tab.** Requests never carry a `session_id`. The function
resolves it from `(outlet_id, table_label)` — joining the open session or opening
one — exactly as `ARCHITECTURE.md` §5 describes. A client that could name a
session could read a stranger's bill.

**Availability is resolved server-side.** The client never joins
`outlet_menu_items` and never sees `is_listed` / `in_stock`. It receives one
`availability` enum per item and renders it per `DESIGN_SYSTEM.md` §6.4.

## 2. Errors

```json
{ "error": { "code": "item_unavailable", "message": "…", "details": {} } }
```

`code` is stable and safe to switch on. `message` is for logs and is never
rendered to a diner. `details` is present only where the table says so.

| Code | HTTP | When |
|---|---|---|
| `bad_request` | 400 | Malformed body, missing required field |
| `outlet_not_found` | 404 | No outlet with that slug |
| `order_not_found` | 404 | No such order, or it belongs to another device, or it was purged. See §6. |
| `item_unavailable` | 422 | One or more cart items are NO STOCK or NO PRODUCT. `details.items[]` carries `menu_item_id` and `availability` for each. |
| `invalid_options` | 422 | A required option group is unsatisfied, `max_select` is exceeded, or an `option_id` does not belong to that item. `details.items[]` names the line. |
| `empty_cart` | 422 | Zero items, or every quantity is zero |
| `session_settled` | 409 | Staff settled the tab while this cart was open. See §5. |
| `order_stale` | 409 | A queued order arrived with a `client_created_at` far outside the TTL. See §5.1. |
| `rate_limited` | 429 | See §8 |
| `internal` | 500 | Never carries a cause |

**A closed venue is not an error.** `ARCHITECTURE.md` §5 requires a closed state
rather than a 404, so `/scan` returns `200` with `outlet.is_open: false` and an
empty menu. The client renders closed; nothing throws.

`is_open` is one flag covering two causes — `outlets.is_active` false, or the
parent chain `suspended` (`ARCHITECTURE.md` §9). **The payload never says which.**
A diner must not be able to tell an outlet that is shut for the day from a client
who has not paid us, and the copy they see is the same either way.

## 3. Device resolution — applies to every diner request

Implemented as shared middleware, not per endpoint. `ARCHITECTURE.md` §4.3 is
the behaviour; this is the wire format.

**Request headers**

| Header | When |
|---|---|
| `Cookie: __Host-dt=…` | Whenever the browser has it. The client never sets this. |
| `X-Device-Token-Mirror: v1.…` | Only when no cookie was presented and `localStorage['dt.v1']` exists. |

**Response headers, on every 2xx**

```
Set-Cookie: __Host-dt=v1.<uuid>.<iat>.<sig>; Max-Age=63072000; HttpOnly; Secure; Path=/; SameSite=Lax
```

Plus a body field so the client can keep the mirror honest:

```json
"device": { "token": "v1.…", "is_new": false }
```

The client's only job: write `device.token` to `localStorage['dt.v1']` on every
response, unconditionally. It never reads its own cookie (it can't — `HttpOnly`)
and never decides which of the two wins. The server already did.

`is_new` is `true` only when a device was minted this request. It drives nothing
in the UI; it exists so analytics can separate first-ever scans from returns.

## 4. `GET /scan`

The one endpoint a QR code hits. Returns everything needed for first paint —
outlet, accent, menu, and recognition — in a single round trip, because
`DESIGN_SYSTEM.md` §7 requires the first dish plated before the stage paints.

**Request**

```
GET /fn/v1/scan?outlet=<outlet_slug>&t=<table_label>
```

`t` is optional and opaque; it is echoed back and stored on the order verbatim.

**Response 200**

```json
{
  "device": { "token": "v1.…", "is_new": false },
  "chain":  { "id": "…", "name": "Chicken Republic",
              "display_name": "Chicken Republic", "logo_url": "…",
              "primary_color_hex": "#D2402E" },
  "outlet": { "id": "…", "slug": "chicken-republic-lekki",
              "name": "Chicken Republic Lekki",
              "is_open": true, "timezone": "Africa/Lagos",
              "table_label": "12" },
  "menu": {
    "categories": [
      { "id": "…", "name": "Rice", "position": 1,
        "items": [
          { "id": "…", "name": "Jollof Rice & Chicken",
            "description": "…", "price_minor": 450000, "currency": "NGN",
            "image_url": "…", "position": 1,
            "availability": "available",
            "option_groups": [
              { "id": "…", "name": "Make it a combo", "min_select": 0,
                "max_select": 1, "position": 1,
                "options": [
                  { "id": "…", "name": "Add plantain",
                    "price_delta_minor": 80000, "position": 1 },
                  { "id": "…", "name": "No coleslaw",
                    "price_delta_minor": 0, "position": 2 }
                ] }
            ] }
        ] }
    ]
  },
  "session": null,
  "recognition": null
}
```

`primary_color_hex` comes straight off the chain record — already
validated and corrected at write time per `DESIGN_SYSTEM.md` §3, so the client
injects them as CSS custom properties without checking contrast. `accent_wash`
and `accent_glow` are alpha derivations the client computes; they are not sent.

**These four fields are the whole of the white label.** `display_name`,
`logo_url` and `primary_color_hex` are everything a chain controls in the
diner app, and they are everything the diner app needs to read as the
restaurant's own tool rather than ours. The ground palette is not on the wire
and is not uploadable — `DESIGN_SYSTEM.md` §3 fixes it, because a chain that
sets its own background is a chain that has broken its own food photography.
`logo_mono_url` is a printer asset and never reaches a diner.

`availability` is one of `available` | `no_stock` | `no_product`, resolved
server-side by the join in `ARCHITECTURE.md` §7.

**Items with `image_ready = false` are omitted from `menu` entirely.**
`ARCHITECTURE.md` §5 is explicit that a dish without a compliant image cannot be
plated, and there is no un-plated fallback in `DESIGN_SYSTEM.md`. An item can
still appear inside `recognition` if it was ordered before its image regressed —
see §4.2.

`option_groups` is `[]` for a dish with no options, never absent, so the client's
accordion renders from one shape. Options carry no availability of their own —
`ARCHITECTURE.md` §5 keeps them chain-level for MVP — and `price_delta_minor`
may be zero, which is how a free substitution and a paid addition share one
mechanism.

`session` is the tab, and it is `null` until this device has an order on it. See
§4.4.

### 4.1 Recognised diner

`recognition` is `null` for an unrecognised diner. Not an empty object, not an
empty array — `null`, so the client's check is one truthiness test and the
"no empty state" rule in `PRD.md` falls out of the payload shape.

When the `(device, chain)` profile exists:

```json
"recognition": {
  "order_count": 5,
  "last_order": {
    "placed_at": "2026-07-19T12:04:11Z",
    "outlet_name": "Chicken Republic Ikeja",
    "items": [
      { "menu_item_id": "…", "name": "Jollof Rice & Chicken",
        "qty": 1, "price_minor": 450000, "image_url": "…",
        "availability": "available",
        "options": [ { "name": "Add plantain", "price_delta_minor": 80000 } ] },
      { "menu_item_id": "…", "name": "Chapman",
        "qty": 2, "price_minor": 150000, "image_url": null,
        "availability": "no_product", "options": [] }
    ]
  }
}
```

`outlet_name` is the outlet the order was placed at, which may not be the one
being scanned — that difference is the visible proof of USP 2 and the copy
should use it.

### 4.2 How a reorder row resolves

`name`, `price_minor`, and `image_url` are read from `menu_items` joined on
`menu_item_id` against the **scanned** outlet's chain menu — never from the
snapshot columns. `PRD.md` requires it, and `ARCHITECTURE.md` §7 is the query.

| Situation | `name` | `price_minor` | `image_url` | `availability` |
|---|---|---|---|---|
| Live and in stock here | live | live | live | `available` |
| Carried here, 86'd today | live | live | live | `no_stock` |
| Not listed at this outlet | live | live | live | `no_product` |
| Deleted from the chain menu | `name_snapshot` | `null` | `null` | `no_product` |
| Live but `image_ready = false` | live | live | `null` | as resolved |

`options` on a reorder row follows the same rule and one extra: an option that is
no longer live is **dropped from the row**, not shown as unavailable. The dish is
what the diner recognises; a retired "add plantain" does not earn a chip.

Two consequences the client has to handle. **`price_minor` is `null` only for a
dish that no longer exists** — there is no live price to show and the snapshot
price is not a substitute, so the row renders its name and its `NO PRODUCT` chip
with no figure. **A row with a null `image_url` is never plated on the stage**;
it appears in the reorder row as a text chip only. `DESIGN_SYSTEM.md` §7 has no
un-plated dish, so a row that cannot be plated stays off the stage rather than
landing as a gap.

Nothing is filtered out of `last_order.items`. Both unavailable states stay
visible and unorderable per `DESIGN_SYSTEM.md` §6.4.

### 4.3 Recognised, but outside the recognition window

The order still exists — `ARCHITECTURE.md` §8 deletes nothing — but past
`chains.recognition_window_days` the §6 lookup stops returning it. The greeting
still fires:

```json
"recognition": { "order_count": 5, "last_order": null }
```

`order_count` without a `last_order` is the intended degraded state. The client
renders the greeting ribbon and no reorder row. It is indistinguishable on the
wire from a diner whose one order was cancelled, and that is fine — the render is
the same.

### 4.4 The tab

`session` is `null` until this device has placed an order at this table. Once it
has, `/scan` and every order response carry the running tab:

```json
"session": {
  "id": "…",
  "opened_at": "2026-08-08T18:41:02Z",
  "table_label": "12",
  "order_count": 3,
  "total_minor": 1340000,
  "items": [
    { "name": "Jollof Rice & Chicken", "qty": 2, "line_total_minor": 900000,
      "mine": true },
    { "name": "Suya Platter", "qty": 1, "line_total_minor": 440000,
      "mine": false }
  ]
}
```

**This is the one place a device reads data it did not write**, so the shape is
deliberately narrow. `items` is a flattened roll-up of every order on the tab —
what was ordered, how many, what it costs. `mine` distinguishes this device's
lines so the client can group them.

What it never carries: another order's `id`, any device or profile identifier,
per-order timestamps, or anything else that would let one diner reconstruct
another's activity. A table of four is one bill, not four linked profiles.

`total_minor` is summed from live order rows, never stored — `ARCHITECTURE.md`
§5 explains why. Cancelled orders are excluded from both `total_minor` and
`items`.

The session disappears from the payload the moment staff settle it. A diner who
scans again after paying starts a new tab, which is correct: they are a new party
as far as the bill is concerned.

## 5. `POST /orders`

**Request**

```
POST /fn/v1/orders
Idempotency-Key: 5f2c9a10-…
```

```json
{
  "outlet_id": "…",
  "table_label": "12",
  "client_created_at": "2026-08-08T18:52:10Z",
  "items": [
    { "menu_item_id": "…", "qty": 1, "option_ids": ["…"], "notes": "no pepper" },
    { "menu_item_id": "…", "qty": 2, "option_ids": [], "notes": null }
  ]
}
```

No prices, no device identity, and no `session_id`, per §1. `notes` is optional,
free text, capped at 140 characters — it reaches the kitchen, so it is trimmed and
length-checked, never interpreted.

**`Idempotency-Key` is required, not optional.** It is a client-generated uuid,
minted once when the diner hits send and reused on every retry of that same
order. Unique on `(outlet_id, idempotency_key)` in Postgres, so the guarantee is
the index rather than application logic.

A replay of a key that already committed returns **`200` with the original
order**, not `201` and not an error. The client cannot distinguish "my first
attempt actually succeeded" from "this one did", which is exactly the property the
offline queue needs.

`client_created_at` is when the diner hit send. Send it always; the server stores
it only when it differs meaningfully from arrival, and the counter surfaces the
gap so staff know an order was composed twelve minutes ago before they cook it.

**The function re-resolves availability before writing.** The cart was built from
a `/scan` that may be minutes old and an outlet can 86 a dish in between. Any
item that is not `available` at write time fails the whole order:

```json
{ "error": { "code": "item_unavailable", "message": "…",
  "details": { "items": [ { "menu_item_id": "…", "availability": "no_stock" } ] } } }
```

All of it or none of it — a partial order would put food on a tray the diner
didn't agree to. The client marks the named rows and lets them fix the cart.

**One transaction, in this order:**

1. Resolve device (§3) and outlet. Re-resolve availability for every line, and
   validate `option_ids` against each item's live groups — `min_select`,
   `max_select`, and that the option actually belongs to that item.
2. Resolve the tab: take the open `table_sessions` row for
   `(outlet_id, table_label)`, or insert one. The partial unique index in
   `ARCHITECTURE.md` §5 makes a race here a constraint violation rather than two
   tabs, so retry the read on conflict.
3. Upsert `diner_profiles` on `(device_id, chain_id)`. First order creates the
   row — this is the only place it is created.
4. Insert `orders` with `chain_id`, `outlet_id`, `session_id`,
   `diner_profile_id`, `status = 'incoming'`, `idempotency_key`, and totals summed
   from live `price_minor` plus `price_delta_minor`.
5. Insert `order_items` with `name_snapshot` and `price_minor_snapshot`, and
   `order_item_options` with its own snapshots — all written from the same live
   read as the totals, so a receipt can never disagree with its own lines.
6. Update the profile: `order_count + 1`, `last_order_id`, `last_order_at`, and
   `first_order_at` if it was null.

Steps 2–6 commit together. A failure anywhere leaves no order, no incremented
count, and no orphaned tab; `ARCHITECTURE.md` requires `order_count` move exactly
once per order.

**A settled tab cannot take a new order.** If staff closed it between the cart
being built and the order arriving, step 2 finds no open session and the request
fails `session_settled` (409) rather than quietly opening a second tab. The diner
has already paid; a new tab would be a bill nobody expects. The client tells them
to speak to the counter.

### 5.1 Queued orders

An order held offline arrives with a `client_created_at` older than now. The
server accepts it, records the gap, and lets the counter decide — with one guard:
past **20 minutes** it rejects with `order_stale` (409).

The client is the first line of defence here and the more important one. Past
roughly ten minutes it asks the diner before sending, per `PRD.md`. The server
bound is a backstop for a phone that was closed in a pocket, not the primary
control.

Everything else about a queued order is ordinary: same endpoint, same shape, same
idempotency key it was minted with. There is no separate sync endpoint, because a
second write path is a second place for the money rules to be wrong.

**Response 201**

```json
{
  "device": { "token": "v1.…", "is_new": false },
  "order": {
    "id": "…", "status": "incoming", "placed_at": "2026-08-08T18:52:14Z",
    "subtotal_minor": 1080000, "total_minor": 1080000,
    "currency": "NGN",
    "items": [
      { "menu_item_id": "…", "name": "Jollof Rice & Chicken", "qty": 1,
        "price_minor": 450000, "line_total_minor": 530000, "notes": "no pepper",
        "options": [ { "name": "Add plantain", "price_delta_minor": 80000 } ] }
    ]
  },
  "session": { "…": "…" },
  "recognition": { "order_count": 6 }
}
```

`order.items[].price_minor` is the snapshot that was just written, not a fresh
read — this payload is the receipt. `line_total_minor` is
`qty × (price_minor + Σ price_delta_minor)`, computed server-side.
`subtotal_minor` equals `total_minor` in MVP; both are sent so v2 tax and service
charge don't change the shape.

`session` is the tab as of this order, in the §4.4 shape. It is the number the
diner watches climb, so it ships with every order response rather than needing a
second call.

`recognition.order_count` is the post-increment value, so the confirmation screen
can say the number the next greeting will use.

## 6. `GET /orders/:id`

The confirmation screen's read. Same shape as the 201 body's `order` object, so
the screen that placed the order and the screen that reloads it render from one
type.

```
GET /fn/v1/orders/<order_id>
```

**Ownership is checked, not assumed.** The function resolves the device (§3),
looks up the `(device, chain)` profile, and requires
`orders.diner_profile_id` to match. A mismatch returns `order_not_found` (404),
not a 403 — a wrong answer must not confirm that the id exists.

**The tab does not widen this.** A device can see another diner's *lines* in
`session.items` (§4.4) and still cannot fetch their order. The roll-up is
anonymous and aggregate; the order is owned. Do not be tempted to relax this
check because "they're at the same table" — the two reads exist at different
grains for a reason.

**Response 200** — `order` exactly as in §5, with `status` current, plus the
current `session`.

```json
{ "device": { "token": "v1.…", "is_new": false },
  "order": { "…": "…" }, "session": { "…": "…" } }
```

Status moves `incoming` → `processing` → `delivered`, or to `cancelled`, and only
staff move it (§7). Whether staff may cancel after `processing` is the chain's
setting, not the platform's — `chains.cancel_window` in `ARCHITECTURE.md` §5.

The client polls every 15s while the confirmation screen is open and stops on
`delivered` or `cancelled`. Realtime is Phase 4 — see §9.

**Payment is not in this enum.** An order is never `paid`; a *session* is
`settled`. The confirmation screen shows the tab's state from `session`, and the
two lifecycles stay separate all the way to the wire.

## 7. Restaurant and internal surfaces

Not endpoints in this file. Both apps talk to **Supabase PostgREST and Auth
directly**, with RLS carrying the tenancy (`ARCHITECTURE.md` §9). Writing a
parallel REST layer over tables that already have row-level policies would add a
second place for the tenant predicate to be wrong.

### 7.1 Restaurant — counter role

Scoped to one outlet by the `outlet_id` claim.

| Surface | Tables |
|---|---|
| Live order feed | `orders`, `order_items`, `order_item_options` — read, plus `status` writes |
| Tabs | `table_sessions` — read, plus `status` → `settled` and `settled_by` |
| Availability toggles | `outlet_menu_items` — upsert, since a missing row means available |
| Daily summary | `orders` aggregated over the current service day |
| Print log | `print_jobs` — insert only, one row per job sent |

**Cancellation is gated on `chains.cancel_window`.** A `counter` session may
always cancel an `incoming` order; it may cancel a `processing` one only where
the chain allows it. Enforce this in an RLS policy, not in the client — a rule
that lives only in the UI is a rule that a stale tab can break.

Cancelling requires a `cancel_reason`. It is the waste number the owner reads at
the end of the month, and a nullable reason column collects nothing.

**Printing is tablet-local and has no endpoint.** The tablet drives the printer
directly — see `ARCHITECTURE.md` §11, open item 7, for why that path is not yet
proven. The server is never in the path. A `print_jobs` row is written after the
send, queues offline, and syncs like a diner's order; `status` is `sent`, never
`printed`, for the reason given with the table in `ARCHITECTURE.md` §5.

**Reprint is unconditional.** Every order in the active queue carries it, at any
time, whether or not a job for that order is already logged `sent`. It reprints
and inserts a new row with `attempt` incremented. Do not gate it on the log: the
paper-out alarm is a beep on a counter, and the person who heard it should not
have to argue with a table row about whether the paper ran out.

Cancelling a `processing` order under a `through_processing` chain means the
kitchen ticket has already printed. The confirmation has to say so — the counter
is being asked to walk to the kitchen, not to click a button.

### 7.2 Restaurant — manager and owner roles

Everything above across the whole chain, plus:

| Surface | Tables |
|---|---|
| Menu CRUD | `menu_categories`, `menu_items`, `option_groups`, `options` |
| Outlet setup | `outlets`, including `service_day_start` |
| Staff | `staff_users` within their own chain |
| Analytics | `orders`, `table_sessions` aggregated over the chain |
| Image uploads | Storage, plus `image_credit_ledger` reads |
| Branding | `chains.display_name` direct; accent and logo through §7.4 |

**Branding is three fields, not a theme editor.** A chain uploads a logo, picks
one accent, and sets the `display_name` the venue welcome uses. It does not get
the ground palette. `DESIGN_SYSTEM.md` §3 draws that line and §4 above is where
the result lands on the wire.

### 7.3 Internal ops

Cross-chain read, enumerated write (`ARCHITECTURE.md` §9): `chains.status`,
`subscriptions`, `invoices`, `support_tickets`, and `image_credit_ledger` grants.
Every write lands in `audit_log`. No menu edits, no order edits, no touching a
tenant's operational data.

### 7.4 Writes that must not go through PostgREST

**The chain accent.** `DESIGN_SYSTEM.md` §1 requires a 3:1 contrast check
against `--surface-primary`, correction along the same hue on failure. A direct table write would store an unvalidated hex and the diner
app trusts these columns without checking. Accent changes go through an
Edge Function that validates and writes the column.

**Anything that touches `orders` totals.** Staff can move `status`; nothing in
either dashboard recomputes money. The order is a receipt.

**Image processing.** Upload goes to Storage, but the Claid call, the contact-line
normalisation, the `image_ready` flip and the ledger debit are one Edge Function.
Splitting them means an item can go `image_ready = true` on an asset that was
never normalised — and `DESIGN_SYSTEM.md` §7 has no un-plated fallback, so that
dish lands at the wrong depth on a real diner's phone.

**The chain logo.** One upload produces two assets: `logo_url` for the screen,
and `logo_mono_url` — 384px wide, 1-bit, dithered — for the header of a 58mm
receipt. A direct write would store whatever was uploaded and let the receipt
renderer find out at print time that a colour PNG dithers into mud. Same shape
as the accent carve-out: validate, derive, write both columns together.

## 8. Rate limiting

Keyed on the resolved device (§3), not on IP. A restaurant's diners share one
wifi egress, so an IP bucket would throttle table 9 because table 4 was busy.
A request with neither a valid cookie nor a valid mirror falls back to an IP
bucket at a tenth the allowance — the only case where a shared-IP penalty
applies, and it costs a first-time diner nothing because minting takes one
request.

| Endpoint | Limit | Window |
|---|---|---|
| `GET /scan` | 60 per device, 600 per outlet | 1 minute, sliding |
| `POST /orders` | 5 per device | 1 minute |
| `GET /orders/:id` | 120 per device | 1 minute |

`/scan` is loose because a reload is legitimate — the diner has one thumb and a
phone that backgrounds itself. It is now also how the tab is read (§4.4), so a
table watching its total refreshes more often than a table that isn't; 60 a
minute still covers it. The per-outlet ceiling is there for menu scraping, not
for diners; a full house cannot reach it.

`POST /orders` is tight because a sitting produces one order, occasionally two.
Five a minute leaves room for a fat-fingered retry and stops a loop from filling
the kitchen feed.

**A replay does not spend budget.** A `POST /orders` carrying an
`Idempotency-Key` that already exists returns the stored order (§5) without
counting against the bucket. A device that lost its connection mid-write must not
burn its allowance retrying a write that already succeeded — that is the one case
where the diner is least able to understand why the app stopped responding.

`GET /orders/:id` accommodates the 15s poll in §6 with room for several open
tabs.

**Response 429**

```
Retry-After: 12
```

```json
{ "error": { "code": "rate_limited", "message": "…",
  "details": { "retry_after_seconds": 12 } } }
```

The header and `details.retry_after_seconds` always agree; the header is for
proxies, the body for the client.

The client waits and retries once on `/scan` and on `GET /orders/:id` — a 429 on
a poll is not a state change and must not stop the loop or clear the screen. It
**never** auto-retries `POST /orders` on a 429: the server answered, so the order
is definitively not placed, and the diner is sitting right there. The dock
returns to its resting state and they press again.

**A 429 is not a queue trigger.** The offline queue (§5.1) exists for requests
that never got an answer, where the client cannot know whether the order landed.
A 429 is an answer. Queueing on it would turn a throttle into a delayed order
arriving in the kitchen minutes later, which is the exact failure §5.1 is built
to avoid.

## 9. Open items

1. **Realtime instead of polling.** §6 polls every 15s because the confirmation
   screen is the only consumer and a poll cannot desync. Phase 4 brings the
   counter feed, and once `orders` carries a Supabase Realtime subscription for
   staff the diner can ride the same channel. The payload doesn't change, only
   how it arrives — so this is not a `v2`.
2. **The tab has no endpoint of its own.** It rides on `/scan` (§4.4), so a
   diner watching the total re-fetches the whole menu to see it. Correct for MVP
   — one round trip, one payload, no second place for the tab scope to be wrong —
   and wrong the moment the tab updates more often than the menu. A
   `GET /session` returning only §4.4 is the fix, and it is worth doing when
   Realtime lands, not before.
3. **The cart is client-side only.** Nothing persists it, so a closed tab loses
   it. Deliberate — a server cart needs its own lifecycle and the diner is
   mid-sitting — and it is why there is no `GET /cart` in this file. The offline
   queue (§5.1) persists *submitted* orders, which is a different thing: an
   unsent order is a promise we made, an abandoned cart is not.
4. **Image credits are not on the wire yet.** The ledger is read by
   `apps/restaurant` through PostgREST (§7.2) and debited by the processing Edge
   Function (§7.4). What happens to an upload at zero credits is specified in
   `PRD.md` — it succeeds unprocessed and says so — but the response shape that
   carries "not processed" back to the manager is not written down. Phase 4.
   The price is settled at ₦1,000 per image beyond the included ten (`PRD.md`,
   settled August 2026), which narrows the shape question without answering it:
   an upload past the allowance is a **billing line, not an error**. Nothing here
   returns 402, nothing blocks the upload, and no diner ever sees it. The open
   question is only how the manager is told, and it is the same question it was
   before a number existed.
5. Settle is a dashboard write, not an endpoint. Staff close a tab through
   PostgREST (§7.1), which means the diner learns it on their next `/scan` and
   never through a push. Acceptable while payment happens at the counter, face to
   face; when in-app payment lands in v2, it will need an explicit webhook or
   Realtime push.

## 10. Secondary Service Endpoints

### 10.1 Quote Submission (`POST /api/quotes`)
Fired by `apps/landing` when a prospective client submits the "Get a Quote" questionnaire.

```json
// Request Body
{
  "business_name": "Tasty Bites",
  "contact_name": "Amina Bello",
  "email": "amina@tastybites.ng",
  "phone": "+2348012345678",
  "outlet_count": 2,
  "instagram_handle": "@tastybitesng",
  "estimated_daily_orders": 150
}

// Response 201 Created
{ "success": true, "quote_id": "00000000-0000-0000-0000-000000000001" }
```

### 10.2 Moniepoint Subscription Webhook (`POST /api/webhooks/moniepoint-subscription`)
Handled by Supabase Edge Function to process SaaS retainer renewals. Signed with Moniepoint HMAC header (`x-moniepoint-signature`).

```json
// Event: subscription.create / charge.success
{
  "event": "charge.success",
  "data": {
    "amount": 2000000,
    "currency": "NGN",
    "customer": { "customer_code": "CUS_12345", "email": "owner@brand.ng" },
    "plan": { "subscription_code": "SUB_67890" },
    "metadata": { "chain_id": "00000000-0000-0000-0000-000000000001" }
  }
}
```

### 10.3 Restaurant Announcements (`GET /api/announcements`)
Read by `apps/restaurant` to surface platform broadcast notifications sent from `apps/internal`.

```json
// Response 200 OK
{
  "announcements": [
    {
      "id": "00000000-0000-0000-0000-000000000001",
      "title": "Scheduled Maintenance",
      "body": "System update scheduled for Monday 3 AM.",
      "created_at": "2026-08-09T03:00:00Z"
    }
  ]
}
```

### 10.4 Moniepoint Online Checkout & Webhook

#### `POST /payments/moniepoint/initialize`
Initializes online diner checkout with automated **1% fee split** (passed to customer) to Plated's account.

```json
// Request Body
{
  "order_id": "00000000-0000-0000-0000-000000000001",
  "customer_email": "diner@example.com",
  "customer_phone": "+2348012345678"
}

// Response 200 OK
{
  "success": true,
  "moniepoint_reference": "MNP_REF_987654321",
  "checkout_url": "https://checkout.moniepoint.com/pay/MNP_REF_987654321",
  "total_minor": 450000,
  "platform_fee_minor": 2250
}
```

#### `POST /payments/moniepoint/webhook`
Moniepoint webhook confirming payment completion. Signed with Moniepoint HMAC signature. Updates `orders.payment_status` to `paid`.

---

### 10.5 Manager Whitelabel Settings (`PATCH /restaurant/manager/whitelabel`)
Executed by Manager in `apps/restaurant` to configure the chain's brand styling across `apps/diner`.

```json
// Request Body
{
  "primary_color_hex": "#1A4D2E",
  "secondary_color_hex": "#E8F5E9",
  "typography_font": "Plus Jakarta Sans",
  "logo_url": "https://storage.plated.ng/logos/chain_123.png"
}

// Response 200 OK
{
  "success": true,
  "chain_id": "00000000-0000-0000-0000-000000000001",
  "primary_color_hex": "#1A4D2E",
  "secondary_color_hex": "#E8F5E9",
  "typography_font": "Plus Jakarta Sans"
}
```

