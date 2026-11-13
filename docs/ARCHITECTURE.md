# Architecture — QR Ordering SaaS

> **Depends on:** `PRD.md`  
> **Read by:** `API_CONTRACTS.md`, `ROADMAP.md`, `CLAUDE.md`  

> Stack, data model, and the queries that make the two USPs work. Traces back to
> `PRD.md`; where the two disagree, `PRD.md` wins and this file is wrong.
> `PRD.md` defers the device-token schema here — it is §4.

**Naming note.** The blueprint says `restaurants`. `PRD.md` settled that the
paying client is a **chain** and its venues are **outlets**, so `restaurants`
splits into `chains` + `outlets` throughout. There is no `restaurants` table.

"Restaurant" remains the product-facing word — it is what the client calls
themselves and it names the app they log into (`apps/restaurant`). It is never a
schema name. In the data model there are only chains and outlets.

## 1. Stack

| Layer | Choice |
|---|---|
| Framework | Next.js App Router + TypeScript |
| Styling | Tailwind, tokens from `DESIGN_SYSTEM.md` as CSS custom properties |
| Animation | Framer Motion |
| Database | Supabase Postgres |
| Server logic | Supabase Edge Functions (Deno) |
| Hosting | Vercel (diner, restaurant, internal, landing) + Supabase cloud |
| Payments | Online via **Moniepoint** (1% fee split passed to diner) or Offline at Counter. |
| Money | `bigint` minor units — **kobo** for NGN. Never float, never `int4`. |

Four Vercel projects off one repo, deployed independently. `apps/diner` must be
able to ship without waiting on anything else, and `apps/landing` must be able to
ship without touching the product at all.

**On `bigint`.** A single order never approaches `int4`, but kobo multiplies
every figure by 100 and `int4` in kobo caps at about ₦21.5m — inside the range a
chain's monthly revenue rollup will reach, and `apps/internal` computes exactly
those rollups. Two bytes are cheaper than the migration.

## 2. Tenancy

```
chain  ──┬── outlet (Ikeja)       ← QR codes point at an outlet
         ├── outlet (Lekki)
         └── outlet (Wuse)

chain  ──┬── menu_categories      ← menu is chain-level, shared by every outlet
         ├── menu_items
         └── option_groups ── options

outlet ──── outlet_menu_items     ← per-outlet exceptions only (listed / in stock)

outlet ──── table_session ──┬── order ── order_item ── order_item_option
                            └── order      ← one tab, many orders, one payment

(device, chain) ──── diner_profile ──── last order

chain  ──┬── staff_users          ← restaurant app logins, role + outlet scoped
         ├── subscription ── invoices
         └── image_credit_ledger
```

`chain_id` is the tenant boundary. Every row that is not global carries one,
including `orders` (denormalised from `outlet_id` deliberately — it makes the
tenant predicate a single indexed column on the hottest table).

The menu belongs to the chain, not the outlet. `PRD.md` expects menus to be
identical across a chain's outlets with **availability as the only variable**,
so per-outlet menu duplication would be data we have to keep in sync for no
gain. Outlets diverge only through `outlet_menu_items`.

## 3. URLs and QR codes

One host for the whole platform, outlets as paths:

```
https://order.plated.ng/o/<outlet_slug>?t=<table_label>
```

Path-based, not subdomain-based, and that is a load-bearing decision: it lets
the device cookie use the `__Host-` prefix (§4), which pins it to one origin and
forbids a `Domain` attribute. Moving outlets to subdomains later would force
dropping the prefix and widening the cookie's scope — don't, without revisiting
§4 in full.

| Surface | Host | App |
|---|---|---|
| Diner | `order.plated.ng` | `apps/diner` |
| Restaurant | `app.plated.ng` | `apps/restaurant` |
| Internal | `admin.plated.ng` | `apps/internal` |
| Landing | `plated.ng` + `www.plated.ng` | `apps/landing` |

`order.plated.ng` is the only origin the `__Host-dt` cookie is ever issued on —
every outlet of every chain, one host, no exceptions.

## 4. Device identity

The mechanism `PRD.md` settled: server-set signed cookie as source of truth,
`localStorage` mirror as a repair kit, mutual repair each visit.

### 4.1 Token format

Opaque to the client, signed not encrypted — it carries no secrets.

```
v1.<device_uuid>.<issued_at_unix>.<base64url(hmac_sha256(key, "v1.<uuid>.<iat>"))>
```

`v1` allows format migration. The signing key lives in Edge Function env, never
in the client bundle. Key rotation: accept the previous key for verification for
30 days, always sign with the current one.

### 4.2 Cookie attributes

| Attribute | Value | Why |
|---|---|---|
| Name | `__Host-dt` | Prefix forces `Secure`, `Path=/`, and **no** `Domain`. Browser-enforced. |
| `Max-Age` | `63072000` (2 years) | Re-set on every response, so it slides and never lapses for an active diner. |
| `HttpOnly` | yes | Keeps it out of reach of injected script, and out of the iOS 7-day script-storage cap. |
| `SameSite` | `Lax` | A QR scan is a top-level GET; `Lax` sends the cookie. `Strict` would drop it on any inbound link and silently break USP 2. |
| `Secure`, `Path=/` | forced by prefix | — |

### 4.3 The mirror and mutual repair

Mirror key `dt.v1` in `localStorage`, holding the same token string. The client
sends it as `X-Device-Token-Mirror` on first load when no cookie was presented.

| Cookie | Mirror | Action |
|---|---|---|
| valid | absent or different | Cookie wins. Response carries the token; client overwrites mirror. |
| absent | valid signature | Re-issue cookie from the mirror's `device_uuid`. Identity survives. |
| absent | absent or bad signature | Mint a new device. This diner is new to us. |
| valid | valid, equal | Refresh both. Nothing else. |

**The cookie always wins.** A stale mirror must never resurrect a retired
identity or fork a live one.

**The mirror is untrusted input.** It is client-writable, so it is accepted only
on HMAC verification; an unsigned or tampered mirror is discarded silently and a
fresh device minted. Anyone who can read another device's token can replay it —
which buys them a stranger's last order at one chain, and nothing else. That is
tolerable only because the token confers no payment authority and no personal
data. **When payments land in v2, they must not hang off this token.**

## 5. Data model

Times are `timestamptz`. Money is `bigint` minor units (kobo for NGN) — never
float. Primary keys are `uuid` with `gen_random_uuid()` unless noted.

Columns holding money are suffixed `_minor`, not `_cents`. Nigeria has no
practical sub-unit in circulation, so "cents" would be wrong twice over and the
suffix is what stops a float creeping in three phases from now.

### chains

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `name` | text | |
| `slug` | text unique | |
| `accent_hex` | text | Validated and corrected at write time per `DESIGN_SYSTEM.md` §3. |

| `display_name` | text | What the diner sees on the venue welcome. Defaults to `name`. |
| `logo_url` | text | Screen asset, uploaded by the chain. |
| `logo_mono_url` | text | Computed: 384px 1-bit derivative for the 58mm receipt. Never authored — see `API_CONTRACTS.md` §7.4. |
| `status` | text | `active` \| `suspended`. Suspended renders the closed state — see §9. |
| `cancel_window` | text | `incoming_only` \| `through_processing`. The client's choice, per `PRD.md`. |
| `recognition_window_days` | int | Default `90`. See §8. |
| `created_at` | timestamptz | |

### outlets

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `chain_id` | uuid fk → chains | |
| `name`, `slug` | text | `slug` unique per chain; appears in the QR URL. |
| `address`, `city`, `state` | text | |
| `timezone` | text | Default `Africa/Lagos`. Service-day boundaries are local. |
| `service_day_start` | time | Default `06:00`. The counter's daily reset line. |
| `is_active` | boolean | An inactive outlet's QR shows a closed state, not a 404. |

Nigeria is a single timezone with no daylight saving, so the service-day boundary
is a plain local-time comparison. Keep the column anyway — it costs nothing and a
second country would otherwise mean touching every query that reads a day.

### menu_categories

`id`, `chain_id` fk, `name`, `position` int.

### menu_items

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `chain_id` | uuid fk | |
| `category_id` | uuid fk | |
| `name`, `description` | text | |
| `price_minor` | bigint | |
| `currency` | text | `NGN` |
| `image_url` | text | Transparent WebP meeting `DESIGN_SYSTEM.md` §7 photography spec. |
| `image_ready` | boolean | False until the asset passes the contact-point spec. A dish without a compliant image cannot be plated on the stage. |
| `is_active` | boolean | Soft delete. Retired items stay for order history to resolve against. |
| `position` | int | |

### option_groups

The accordion a diner opens when they tap a dish. `id`, `chain_id` fk,
`menu_item_id` fk, `name`, `min_select` int, `max_select` int, `position`.

`min_select = 0` makes the group optional; `max_select = 1` makes it a radio
group, anything higher makes it checkboxes.

### options

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `option_group_id` | uuid fk **on delete cascade** | |
| `name` | text | "Extra cheese", "No cheese", "Large" |
| `price_delta_minor` | bigint | May be positive, zero, or negative. |
| `is_active` | boolean | Soft delete, same reason as `menu_items`. |
| `position` | int | |

**A paid addition and a free substitution are the same mechanism.** "Extra
cheese" at +₦500 and "No cheese" at ₦0 differ only in the delta. Do not build two
concepts.

Two deliberate simplifications for MVP, both worth revisiting later and neither
worth building now: option groups belong to one item rather than being shared
across a menu, and option availability is chain-level — an outlet cannot 86 a
single option, only the whole dish.

### outlet_menu_items

Per-outlet exceptions. Composite pk `(outlet_id, menu_item_id)`.

| Column | Type | Notes |
|---|---|---|
| `outlet_id`, `menu_item_id` | uuid | |
| `is_listed` | boolean | False = this outlet does not carry the item at all → **NO PRODUCT**. |
| `in_stock` | boolean | False = carried but 86'd → **NO STOCK**. |
| `restock_at` | timestamptz null | Optional auto-clear so staff don't have to remember. |

**A missing row means listed and in stock.** Every read `LEFT JOIN`s and
`COALESCE`s to `true`. Onboarding a new outlet therefore writes zero rows and it
inherits the full chain menu immediately.

### diner_devices

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | The `device_uuid` inside the token. |
| `first_seen_at`, `last_seen_at` | timestamptz | |

Global, deliberately not chain-scoped. One device, many chains — the silo is in
`diner_profiles`, not here.

### diner_profiles

The `(device, chain)` grain. This one table is USP 2.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `device_id` | uuid fk → diner_devices | |
| `chain_id` | uuid fk → chains | |
| `order_count` | int | The greeting's number. Never resets, never purged. |
| `last_order_id` | uuid fk → orders, **on delete set null** | Survives retention purge as null. |
| `first_order_at`, `last_order_at` | timestamptz | |
| `last_seen_at` | timestamptz | Touched on scan; `last_order_at` is not. |

`UNIQUE (device_id, chain_id)`.

**A profile row is created on first order, not first scan.** A diner who scans
and leaves without ordering has no row, so §6 returns nothing and they get the
unrecognised experience `PRD.md` specifies — no greeting, no empty state.

**On `order_count`.** `PRD.md`'s settled-decisions table calls this the visit
counter, but the greeting it quotes says *"you've ordered for the 5th time"*.
Counting orders is the only reading consistent with that copy, and it removes
the need to define what a "visit" is — a diner refreshing the page cannot
inflate it. Incremented inside the order transaction, exactly once.

### table_sessions

The tab. One row per party at a table, grouping every order they place into a
single thing to pay for.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `chain_id`, `outlet_id` | uuid fk | |
| `table_label` | text | From `?t=` on the QR URL. |
| `status` | text | `open` \| `settled` \| `void` |
| `cash_collected_minor` | bigint | Cash amount collected for cash-in-hand tracking at settle time. |
| `service_day` | date | The outlet-local day this session opened, per `service_day_start`. |
| `opened_at` | timestamptz | |
| `settled_at` | timestamptz null | |
| `settled_by` | uuid fk → staff_users, null | Who took the payment. |

**Session Staleness Alert (2–3 Hours):** An open session where `now() - opened_at > interval '3 hours'` triggers a staleness warning banner on the counter till to prompt staff before a new party's order attaches to an old unclosed tab.

```sql
create unique index on table_sessions (outlet_id, table_label)
  where status = 'open';
```

**That partial index is the whole design.** A table has at most one open session,
so the first order at a table opens one and every later scan at that table joins
it. Staff close it when they take payment — an action they were already
performing, so the tab costs them one tap at the end and nothing at the start.

Three consequences to hold on to:

- **A tab is shared, and that is intentional.** Four phones at one table are one
  bill. It means a device gains read access to orders it did not place; the
  contract for that is in `API_CONTRACTS.md` §6 and it is deliberately narrow —
  items and a running total, never anything identifying another diner.
- **Totals are computed, never stored here.** A denormalised tab total drifts the
  first time an order is cancelled. The tablet reads a sum.
- **The session is the payment grain; the order is the kitchen grain.** They do
  not share a lifecycle and must never share an enum.

### orders

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `chain_id`, `outlet_id` | uuid fk | |
| `session_id` | uuid fk → table_sessions | |
| `diner_profile_id` | uuid fk | |
| `status` | text | `incoming` \| `processing` \| `delivered` \| `cancelled` |
| `cancel_reason` | text null | `cancelled` \| `wasted` \| `other`. Waste tracking, per `PRD.md`. |
| `cancel_note` | text null | |
| `cancelled_by` | uuid fk → staff_users, null | |
| `subtotal_minor`, `total_minor` | bigint | Equal in MVP — no tax or service charge modelling yet. |
| `currency` | text | |
| `client_created_at` | timestamptz null | When the diner hit send. Null unless the order was queued offline. |
| `placed_at` | timestamptz | When the server accepted it. This is the one the kitchen sorts on. |
| `idempotency_key` | text | Unique per `(outlet_id, idempotency_key)`. See `API_CONTRACTS.md` §5. |

`table_label` is **not** duplicated here — it lives on the session, which is the
only thing that owns it. `chain_id` stays denormalised for the reason it always
was: the tenant predicate should be one indexed column on the hottest table.

**`client_created_at` exists for the offline queue.** An order composed twelve
minutes ago and delivered on reconnect is not the same as one placed just now,
and the counter has to be able to see the difference before the kitchen starts
cooking it.

### order_items

`id`, `order_id` fk **on delete cascade**, `menu_item_id` fk, `qty` int,
`position` int, `notes` text, plus two snapshot columns:

| Column | Purpose |
|---|---|
| `name_snapshot` | What the diner ordered, as it was named that day. |
| `price_minor_snapshot` | What they were charged, before options. |

### order_item_options

`id`, `order_item_id` fk **on delete cascade**, `option_id` fk, plus
`name_snapshot` and `price_delta_minor_snapshot` on the same reasoning as above.

The line total for an item is
`qty × (price_minor_snapshot + sum(price_delta_minor_snapshot))`, computed on the
server inside the order transaction and never sent by the client.

**Snapshots are authoritative for the order record and are ignored by the
reorder flow.** The receipt and the kitchen log must not be rewritten by a later
price change. But `PRD.md` requires that price, image, and description on the
reorder row resolve against the *current outlet's* menu — so §7 joins on
`menu_item_id` and never reads these columns. The one exception:
`name_snapshot` is the label fallback when an item has been deleted from the
chain menu entirely and there is no live name to show. Never the price.

### print_jobs

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `chain_id`, `outlet_id` | uuid fk | |
| `order_id` | uuid fk → orders, null | Null on a bill — that artifact belongs to the session. |
| `session_id` | uuid fk → table_sessions, null | Set on a bill. |
| `type` | text | `kitchen_ticket` \| `order_receipt` \| `bill` |
| `status` | text | `sent` \| `failed_to_send` |
| `attempt` | int | `1` on the first pass, incremented on each reprint of the same artifact. |
| `created_at` | timestamptz | |

**Neither fk cascades.** `order_items` and `order_item_options` delete with their
order because they are parts of it. A print job is a record *about* an order, and
a record that vanishes with its subject is not a record.

**`status` is `sent`, not `printed`.** There is no software-side paper detection.
ESC/POS over USB or Bluetooth acknowledges transmission and nothing further — the
printer's own alarm is the paper-out sensor and the person at the counter is who
reads it. A column called `printed` would assert something the system cannot
observe, and this project does not report a success it has not seen.

The tablet writes these rows, so they queue locally and sync on reconnect exactly
as a diner's order does. The counter's **Reprint** action does not consult this
table for permission: every order in the active queue is reprintable at any time,
whatever the log says. The log answers *what happened*; it does not gate the fix.

### staff_users

Restaurant app logins. `id` is the Supabase `auth.users` id, not a fresh uuid.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk = auth.users.id | |
| `chain_id` | uuid fk | The tenant boundary, mirrored into the JWT as a claim. |
| `outlet_id` | uuid fk null | **Null means all outlets of the chain.** |
| `role` | text | `counter` \| `manager` \| `owner` |
| `name` | text | |
| `is_active` | boolean | |

`counter` is expected to carry an `outlet_id`. A cashier at Ikeja has no business
reading the Lekki queue, and the tablet is a device left unattended on a counter
all day — it should hold the narrowest session in the system, not the widest.

### platform_users

Our team. Separate table and separate tier from `staff_users` deliberately: there
is no role value on a restaurant login that can escalate into platform access.

`id` (= auth.users.id), `name`, `role` (`support` \| `admin`), `is_active`.

### subscriptions

One per chain. `id`, `chain_id` fk, `tier` (`tablet` \| `software_only`),
`setup_fee_minor`, `retainer_minor` (flat ₦20,000/mo), `outlet_count`, `status` (`active` \|
`past_due` \| `suspended`), `moniepoint_customer_id` text null, `moniepoint_subscription_code` text null, `moniepoint_email` text null, `current_period_start`, `current_period_end`,
`grace_until`, `onboarding_until`.

`onboarding_until` is the 30-day unlimited-image window from `PRD.md`. Inside it,
processing deducts nothing.

`grace_until` is what `apps/internal` acts on: suspension is a decision someone
makes after a deadline passes, never an automatic consequence of a date.

Moniepoint customer and subscription code fields allow managers/CEOs to connect card and renew SaaS retainer directly in `apps/restaurant`.

### announcements

Broadcast notifications sent from `apps/internal` to restaurant tablets and manager dashboards.

`id` (uuid pk), `title` (text), `body` (text), `target_chain_id` (uuid fk → chains, null for platform-wide), `created_at` (timestamptz), `expires_at` (timestamptz null).

### invoices

`id`, `chain_id` fk, `subscription_id` fk, `period_start`, `period_end`,
`amount_minor`, `status` (`draft` \| `sent` \| `paid` \| `overdue` \| `void`),
`due_at`, `paid_at`, `note`.

Payment collection is out of band for MVP — transfer, confirmed by a human. This
table records the truth of it; it does not move money.

### support_tickets

`id`, `chain_id` fk, `outlet_id` fk null, `opened_by`, `subject`, `body`,
`status` (`open` \| `pending` \| `resolved`), `priority`, `created_at`,
`resolved_at`.

### image_credit_ledger

A ledger, not a counter, because credits are granted, spent and purchased and
somebody will eventually ask where they went.

`id`, `chain_id` fk, `delta` int (negative spends), `reason` (`monthly_grant` \|
`purchase` \| `process` \| `adjustment`), `menu_item_id` fk null, `at`.

Balance is `sum(delta)`. At zero, an upload still succeeds — it is stored
unprocessed with `image_ready = false`, which the existing gate already renders
honestly. Nothing is silently dropped.

### audit_log

`id`, `actor_type` (`staff` \| `platform` \| `system`), `actor_id`, `chain_id`
null, `action`, `target_table`, `target_id`, `payload` jsonb, `at`.

Every platform-tier write goes here. A tier that can read across tenants earns
the strictest record of what it did — see §9.

### Indexes

```sql
create unique index on diner_profiles (device_id, chain_id);   -- §6, the USP 2 lookup
create index on orders (diner_profile_id, placed_at desc);
create index on orders (session_id, placed_at);                -- the tab
create index on orders (outlet_id, status, placed_at desc);    -- kitchen feed, Phase 4
create unique index on orders (outlet_id, idempotency_key);    -- offline retry safety
create index on print_jobs (order_id, created_at desc);        -- print state on the queue
create index on print_jobs (session_id, created_at desc);      -- the bill, on settle

create unique index on table_sessions (outlet_id, table_label)
  where status = 'open';                                       -- one open tab per table
create index on table_sessions (outlet_id, service_day, status);  -- the daily reset view

create index on menu_items (chain_id, category_id, position);
create index on option_groups (menu_item_id, position);
create index on options (option_group_id, position);
create index on order_items (order_id, position);
create index on order_item_options (order_item_id);

create index on staff_users (chain_id, outlet_id);
create index on image_credit_ledger (chain_id, at desc);
create index on audit_log (chain_id, at desc);
```

## 6. The recognition lookup

What happens on a scan of `/o/<outlet_slug>`:

1. Resolve outlet → `outlet_id`, `chain_id`. Inactive outlet → closed state.
2. Resolve device per §4. New device → skip to 5.
3. The lookup:

```sql
select
  p.id,
  p.order_count,
  case
    when p.last_order_at >= now() - make_interval(days => c.recognition_window_days)
    then p.last_order_id
  end as last_order_id
from diner_profiles p
join chains c on c.id = p.chain_id
where p.device_id = $device_id
  and p.chain_id  = $chain_id;
```

4. No row → unrecognised. One row → greeting with `order_count`, and load the
   last order through §7 if `last_order_id` came back non-null.
5. Render. `last_seen_at` is touched asynchronously; it never blocks first paint.

**The window is applied here, not by deleting data.** A diner outside it is still
greeted with their count and simply has no reorder row beneath it — see §8. The
`case` expression is the entire retention mechanism on the read path.

That single predicate pair is the whole of USP 2. It does **not** filter by
outlet — which is why history pools across every outlet of a chain — and the
`chain_id` term is what siloes it between brands. Chidi matches at Chicken
Republic Lekki on a profile written at Ikeja; Aisha has no `(device, Café Neo)`
row so she gets nothing; Tunde has three rows and each scan reads exactly one.

## 7. Resolving the last order against this outlet

```sql
select
  oi.menu_item_id,
  oi.qty,
  mi.name, mi.description, mi.price_minor, mi.image_url,
  oi.name_snapshot,
  (mi.id is null or mi.is_active = false) as gone_from_chain,
  coalesce(omi.is_listed, true)           as listed_here,
  coalesce(omi.in_stock,  true)           as in_stock_here
from order_items oi
left join menu_items mi
  on  mi.id       = oi.menu_item_id
  and mi.chain_id = $chain_id
left join outlet_menu_items omi
  on  omi.menu_item_id = oi.menu_item_id
  and omi.outlet_id    = $outlet_id
where oi.order_id = $last_order_id
order by oi.position;
```

State machine, evaluated in this order:

| Condition | Result |
|---|---|
| `gone_from_chain` or not `listed_here` | **NO PRODUCT** — label from `name_snapshot` if `mi.name` is null |
| not `in_stock_here` | **NO STOCK** |
| otherwise | orderable |

Both unavailable states stay visible and unorderable, rendered per
`DESIGN_SYSTEM.md` §6.4. Nothing is filtered out of this list — the diner must
see that the dish they had last time exists here and just isn't available today.

**Options on a reorder row resolve the same way.** Join `order_item_options` to
`options` on `option_id`; an option whose group or parent is gone, or whose
`is_active` is false, is dropped from the row rather than shown as unavailable.
The dish is what the diner recognises; a missing "extra cheese" is not worth a
chip on the card. `name_snapshot` is still the label fallback, and the delta
always comes from the live `options` row.

## 8. Retention, the recognition window, and the daily reset

Three different lifetimes that used to be conflated into one nightly delete.

| Data | Kept | Governed by |
|---|---|---|
| `orders`, `order_items`, `order_item_options` | Indefinitely | The restaurant's own records |
| `table_sessions` | Indefinitely | Same |
| Device → order **linkage** | `chains.recognition_window_days`, default 90 | §6's `case` expression |
| `diner_profiles.order_count` | Indefinitely | Never resets, per `PRD.md` |
| `diner_devices` | Indefinitely | |

**Nothing deletes orders.** They are the client's sales history and ours to hold,
not ours to discard. What expires is the diner's *access* to them: past the
window, §6 stops returning `last_order_id` and the reorder row does not render.

That makes the retention rule a query predicate rather than a scheduled deletion,
with three consequences worth naming:

- Analytics keeps its full history, which `apps/internal` and the manager role
  both depend on.
- Changing the window is a column update, not a backfill, and it cannot destroy
  anything.
- The greeting still fires outside the window, because `order_count` lives on the
  profile. A long-absent diner is greeted with their count and no reorder row
  beneath it. **That is the intended degraded state, not a bug.**

The one scheduled job that remains is a **session sweep**: at each outlet's
`service_day_start`, sessions still `open` from a previous service day are
flagged for staff attention. It does not close them. An unpaid tab is money the
restaurant has not collected, and software should not decide on its own that it
is gone.

### The daily reset is a view, not a job

The counter's order list filters on
`service_day = current_service_day(outlet)`, **plus every session still `open`
regardless of `service_day`**. So a tab opened at 11pm and unpaid at 7am is still
on screen, marked as carried over.

A tab that vanishes overnight is the single fastest way to lose a client's trust,
and it would look exactly like the software losing an order.

## 9. Access boundaries

Three tiers, not two.

| Tier | Identity | Enforcement |
|---|---|---|
| **Diner** (`apps/diner`) | Signed device cookie. Not a Supabase auth identity. | Edge Functions holding the service role. The function *is* the boundary. |
| **Restaurant staff** (`apps/restaurant`) | Supabase Auth. Claims: `chain_id`, `role`, `outlet_id`. | RLS on every table, filtering `chain_id`, and `outlet_id` where the claim is set. |
| **Platform** (`apps/internal`) | Supabase Auth against `platform_users`. Claim: `is_platform`. | RLS policies that permit cross-chain **read** and a narrow, enumerated **write** set. |

### The diner tier

**The diner app never talks to Postgres directly.** Device identity is not a
Supabase auth identity, so RLS cannot key on it. All diner reads and writes go
through Edge Functions holding the service role, and those functions are the
only place the `(device, chain)` scope — and now the tab-read scope — is
enforced. Treat every function as the security boundary it is.

### The restaurant tier

Every policy filters on the `chain_id` claim. A `counter` session additionally
filters on its `outlet_id` claim, so the tablet cannot read another outlet's
queue. `manager` and `owner` carry a null `outlet_id` and see the whole chain.

Role gates writes, not just reads: `counter` may transition an order's status and
settle a session; only `manager` and `owner` may touch menus, options, prices,
accent, or availability defaults.

### The platform tier

This is the tier that can read every tenant, so it gets the tightest policies in
the system rather than the loosest.

- **It does not use the service role.** A god-mode key in a browser app is how a
  support tool becomes the incident.
- **Read is broad; write is enumerated.** Suspend or reinstate a chain, mark an
  invoice paid, change a subscription, act on a ticket. Nothing else — no menu
  edits, no order edits, no touching another tenant's operational data.
- **Every write lands in `audit_log`.** Non-negotiable. A tier with cross-tenant
  reach and no record of its own actions is a tier nobody can be held to.

### Suspension

`chains.status = 'suspended'` makes every outlet under it render **the same
neutral closed state as an inactive outlet** — the §6 lookup short-circuits at
step 1 and no menu is served.

**A diner never sees a billing message.** They are not a party to that dispute,
and a "this restaurant has not paid" notice sitting on a customer's table is how
you lose the client permanently rather than collect from them. The pressure goes
through `apps/internal` and a phone call.

Suspension is also always a decision, never a cron job. `subscriptions.grace_until`
tells our team a deadline has passed; a person still has to act on it.

## 10. Repo layout

```
/apps
  diner/                diner PWA — the QR target
  restaurant/           counter + manager, role-gated, one codebase
  internal/             our ops dashboard — platform-wide
  landing/              marketing site
/packages
  ui/                   shared animated components and tokens
  db/                   schema, migrations, generated types, query helpers
/supabase
  functions/            Edge Functions (device resolution, order placement, sessions)
  migrations/
/docs
```

Four apps, four Vercel projects, deployed independently.

`packages/db` owns the schema and exports generated TypeScript types. Nothing
outside it writes raw SQL against these tables.

**`apps/restaurant` is one codebase with two roles, not two apps.** Counter and
manager share auth, tenancy, types and most data access; they differ in routes
and in what the role claim permits. Splitting them would mean maintaining the
same RLS assumptions twice.

## 11. Open items

1. **Cookie lifetime on real hardware.** `PRD.md` records the mechanism as
   decided and the expiry window as unmeasured. Verify on physical iOS and
   Android before Phase 3 — the 2-year `Max-Age` is what we request, not
   necessarily what Safari honours.
2. **`?t=` is now load-bearing, and we are not the ones printing it.** It was an
   opaque analytics label; it is now the key that groups orders into a tab. Two QR
   codes carrying the same label at one outlet merge two parties into one bill.
   White-labelling puts print time in the client's hands, so the control sits at
   **generation** instead: the manager dashboard in `apps/restaurant` emits the
   pack for an outlet and rejects a duplicate label there, before any artwork
   exists (`ROADMAP.md` Phase 4, card spec in `DESIGN_SYSTEM.md` §3.3). That is a
   generator-side guarantee, not a server-side one — nothing on the server rejects
   a duplicate label and nothing detects one afterwards, so a client who hand-edits
   a card or sticks card 4 on table 5 still produces a stranger's items on a bill.
   Hence the handover document and the scan-every-card check before go-live
   (`ROADMAP.md` Phase 7). The v2 fix is a `tables` row with an fk, which ends the
   ambiguity and also unlocks per-table analytics.
3. **A party that changes table mid-meal** opens a second session and ends up
   with two tabs. Staff can settle both, so it is not broken, but it is not
   handled either. A "move tab" action on the counter is the obvious answer and
   it is not MVP.
4. **Shared option groups.** Groups belong to one menu item today, so "Add
   protein" is re-entered per dish. A junction table fixes it and can be added
   without touching the order path.
5. **Per-outlet option availability.** An outlet can 86 a dish but not a single
   option. If this comes up in the pilot it is an `outlet_options` table shaped
   exactly like `outlet_menu_items`.
6. **Order-of-magnitude check on `orders`.** The kitchen-feed index assumes reads
   are always outlet-scoped. `apps/internal` breaks that assumption by design —
   revisit when chain-level and platform-level reporting arrive, which is Phase 5.
7. **Browser to printer is unproven.** `apps/restaurant` is a PWA, so the only
   paths to the XP-P300 are WebUSB and Web Bluetooth — both Chromium-only, both
   requiring HTTPS and a per-device user gesture that has to survive the tablet
   being left on a counter for a week. Bluetooth is the presumed primary because
   the CM8200 has one Type-C port and OTG occupies it, which means a tablet that
   prints all service cannot charge during it. Spike this before Phase 4 commits
   to it. If both paths fail, the fallback is a thin Android WebView wrapper
   exposing a local print endpoint — a build step, not a redesign.
