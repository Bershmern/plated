# Design System — QR Ordering SaaS

> **Depends on:** `PRD.md`  
> **Read by:** `ROADMAP.md`, `CLAUDE.md`  

> Tokens and motion specs. §§1–9 are the diner PWA, where USP 1 lives; §10 is
> the restaurant and internal surfaces, which share the tokens and none of the
> motion. Every UI session pulls values from here rather than re-inventing them.
> Traces back to `PRD.md` — USP 1 is the landing animation specified in §6, and
> it is non-negotiable on quality.

## 1. Direction

The diner is sitting at a table, one thumb free, phone at arm's length, in
whatever light the restaurant has. The screen's job is to make the food arrive.

So the page is a **dim room with one lit table**. The ground is a warm near-black;
the table surface at the top sits in a pool of light, and the dishes land in it.
Food photography reads best against dark warm ground, and pooled light over
tables is how restaurants actually light a room — the layout borrows both.

Two consequences that shape everything downstream:

- **Light is the hierarchy.** The lit zone is where the food is. Menu cards,
  controls, and copy sit on the dim ground and stay quiet. No competing accents.
- **Unavailability is the light going off.** "No Stock" and "No Product" items
  are drained of warmth rather than hidden — desaturated, unlit, still readable.
  This is the visual half of the rule in `PRD.md` § Returning-diner experience.

The per-restaurant accent colour is the **colour of the light over the table**,
not button paint sprayed across the UI. See §3.

## 2. Palette

Six ground tokens. Fixed for every chain.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#16110E` | Page ground. The dim room. Warm near-black, never neutral grey. |
| `--linen` | `#F1E8DB` | The table surface. Warm off-white, the lit zone. |
| `--porcelain` | `#FFFDF9` | Plate and card surfaces sitting on linen. |
| `--chalk` | `#EDE4D9` | Primary text on `--ink`. |
| `--graphite` | `#33261F` | Primary text on `--linen` / `--porcelain`. |
| `--brass` | `#B08D57` | Labels, dividers, category eyebrows. Warm metal — cutlery, rails. |

Support:

| Token | Hex | Role |
|---|---|---|
| `--slate` | `#7A736C` | Unavailable items. Deliberately the only cool tone in the system. |
| `--ok` | `#4C8C5A` | Order confirmed. |
| `--alert` | `#C2452D` | Destructive only (remove item, cancel). Never for emphasis. |

Rules:

- `--brass` is for structure, never for a call to action. The CTA is the accent.
- `--alert` and the accent must never sit adjacent; if a chain's accent is red,
  destructive actions drop to a `--graphite` outline instead of a red fill.
- No pure `#000` or `#FFF` anywhere.

## 3. Per-restaurant accent

One hue per chain, read from the chain record and injected as CSS custom
properties on the app shell at request time. Nothing else varies per chain.

```
--accent           /* from chain record, e.g. #D2402E */
--accent-ink       /* computed: --ink or --porcelain, whichever hits 4.5:1 on --accent */
--accent-wash      /* computed: --accent at 12% alpha — the tint of the table light */
--accent-glow      /* computed: --accent at 6% alpha — the pool's outer falloff */
```

Where the accent is allowed, and nowhere else:

1. The cart dock fill and its label (`--accent-ink`).
2. The active dish indicator on the rail.
3. The returning-diner greeting ribbon.
4. `--accent-wash` / `--accent-glow` in the table's light pool.
5. Focus rings.

Guardrails, enforced at ingest — a chain's accent is validated when it is saved,
not at render time:

- Must reach **3:1 against `--porcelain`** to be usable as a surface. If it
  fails, darken along its own hue until it passes and store the corrected value.
- `--accent-ink` is computed, never authored. A chain with a pale accent gets
  `--ink` labels automatically.
- Hue only — we do not accept a chain's full brand palette. One colour.

### 3.1 The rest of a chain's identity

A chain uploads three things and only three: a **logo**, a **display name**, and
the hue above. Together they are the entire white-label surface. A diner should
read the app as that restaurant's own, not as ours wearing their colour.

| Asset | Renders in | Constraints |
|---|---|---|
| Logo | Venue welcome, restaurant app header | Transparent PNG or SVG. Fixed height, never fixed width — a wide wordmark and a square mark must occupy the same vertical band or every venue welcome lays out differently |
| Logo, mono | Print only (`logo_mono_url`) | **Derived, never uploaded** — a 384px 1-bit reduction of the logo above, produced at ingest (`ARCHITECTURE.md` § chains). A thermal head has no greys, so a colour logo left alone dithers into mud |
| Display name | Venue welcome beside the table label, page title, receipt | Text, never an image. A screen reader reads it and it is the document `<title>` |

**The logo never enters the table scene.** §6's stage is a lit dining surface, and
a brand mark floating in it reads as an advertisement — the one thing the
animation cannot look like.

### 3.2 The platform tag

Our name appears once per surface, in one line, at the foot of `apps/diner` and in
the footer of `apps/restaurant`:

```
POWERED BY PLATED
```

`--t-label`, the ground's muted tone, and it still clears 4.5:1 per §8. Low
visibility is a matter of position and size, not a contrast exemption.

Rules, because this is exactly the element that grows:

- Below every interactive element, clear of the dock, never above the fold.
- Never accent-coloured, no logo beside it, not a link on the diner side.
- Identical on both surfaces. It does not print — a ticket and a receipt are the
  restaurant's paper, and `logo_mono_url` is the only mark on them.
- It is the only place our name appears in either app. No header mark, nothing in
  the venue welcome, nothing anywhere in the ordering flow.

Set in caps as shown. **Word only, never the mark** — §3.3 says where the mark is
allowed, and neither app is on that list.

### 3.3 Our own mark

`brand/plated-mark.svg`. Five segments fanning from an off-centre vertex, two
specks trailing off the lower right. The negative-space cross where the segments
meet is the feature the eye locks onto, so nothing may be layered over the
centre.

**It ships as `currentColor` and carries no fill of its own.** The ground picks
the fill, and there are exactly two:

| Ground | Fill | Measured |
|---|---|---|
| `--ink` | `--chalk` | 14.9:1 |
| `--linen` / `--porcelain` | `--graphite` | 12.0:1 / 14.4:1 |

A matched pair by design — the mark carries the same weight on either ground, so
a dark header and a light one don't need different lockups.

- **Never `--brass`.** It measures 2.55:1 on `--linen`, under even the 3:1 surface
  floor in §3, so it fails on the ground the landing site is built on.
- **Never the chain accent.** §3 lists the five places an accent is allowed and a
  logo is not among them. Our mark in a client's hue reads as their mark.
- **Never pure `#FFF`.** The file as supplied was `fill="white"`; §2 forbids it.
  `--chalk` is the near-white in this system and the difference is visible on
  `--ink`.

**Minimum 24px tall.** Measured, not guessed: the mark holds at 40 and 28, the
gaps between segments start closing at 20, and by 14 it is a blob. Clear space is
half the mark's height on every side.

`plated-mark-mono.svg` is the 1-bit variant for print and drops the two specks —
at 32px they reduce to stray pixels, which reads as dirt on a thermal roll. It is
the one file in the system allowed pure black, for the same reason the receipt is
allowed `N` in §10.1: the head has two states and neither is a choice we make.

Where the mark is allowed: `apps/landing`, `apps/internal`, printed collateral
and QR table cards. That is the whole list.

**The diner PWA's home-screen icon is the chain's logo, not ours.** An installed
icon is the strongest brand claim on a phone, and §3.1's premise is that the
diner reads the app as that restaurant's own. Our mark there would undo the
white-labelling more thoroughly than anything on screen could.

## 4. Type

Three faces, each with one job. Variable fonts, self-hosted, `swap`.

| Role | Face | Use |
|---|---|---|
| Display | **Bricolage Grotesque** | Dish names on the stage, greeting. Quirky terminals, width axis. Used with restraint. |
| Body | **Instrument Sans** | Descriptions, body copy, buttons. Holds up at 15px. |
| Utility | **Martian Mono** | Prices, quantities, order numbers, "No Stock" labels. |

Prices are monospace for two reasons: figures align down a column without
tabular hacks, and the receipt is a real artifact of this domain.

**Naira is rendered whole.** `₦4,500`, never `₦4,500.00`. Money is stored in kobo
(`ARCHITECTURE.md` §5) and kobo are not priced in, quoted in, or paid in — a
trailing `.00` on every line is two characters of noise on a 15px price and reads
as a foreign currency's habit. Group thousands with a comma. Never render a bare
integer of minor units to a diner.

Scale — mobile first, base 16px:

| Token | Size / line | Face | Notes |
|---|---|---|---|
| `--t-stage` | 34 / 1.0 | Display 600 | Dish name on the table. `-0.02em`, width 96%. |
| `--t-greeting` | 22 / 1.15 | Display 500 | "Welcome back…" |
| `--t-card` | 17 / 1.2 | Display 500 | Dish name on a rail card. |
| `--t-body` | 15 / 1.45 | Body 400 | Descriptions. |
| `--t-button` | 15 / 1 | Body 550 | Dock, actions. |
| `--t-price` | 15 / 1 | Utility 500 | Tabular figures on. |
| `--t-label` | 11 / 1.1 | Utility 500 | Uppercase, `0.08em`. Categories, availability. |

Only `--t-stage` scales up past 430px viewport (to 40px). Everything else is
fixed — this is a phone product, not a responsive marketing page.

## 5. Space, radius, elevation

4pt base. `--s-1` 4, `--s-2` 8, `--s-3` 12, `--s-4` 16, `--s-5` 24, `--s-6` 32,
`--s-7` 48, `--s-8` 64.

Radius: `--r-card` 14px, `--r-dock` 20px, `--r-pill` 999px. The table edge and
the stage are **not** rounded — the lit zone is bounded by light falloff, not by
a border.

Elevation is light, not shadow-on-white. Two tokens only:

- `--lift-card` — `0 1px 0 rgba(255,253,249,.06) inset, 0 8px 24px -12px rgba(0,0,0,.7)`
- `--lift-dock` — `0 -1px 0 rgba(255,253,249,.08) inset, 0 -12px 32px -8px rgba(0,0,0,.55)`

Dish shadows are their own system and are specified in §6.3 — do not use these
tokens for food.

## 6. Signature motion — the landing (USP 1)

> This is the product. Everything else in this doc exists to keep the rest of
> the screen quiet enough for this to land.

### 6.1 Layout and trigger

```
┌───────────────────────────────┐
│                               │
│         ·  ·  · · ·           │  light falloff (--accent-glow)
│      ·                 ·      │
│   ·      [  DISH  ]       ·   │  ← STAGE: one dish, plated, lit
│  ·         ▁▁▁▁▁           ·  │     contact shadow under it
│ ─────────────────────────────  │  ← table edge (light, not a line)
│   Jollof Rice & Chicken       │  --t-stage
│   ₦4,500                      │  --t-price
│                               │
│  RICE · GRILLS · SIDES · DRIN │  ← FILTER: category pills, scrolls
│                               │     the rail to that section
│  ┌─────┐ ┌─────┐ ┌─────┐      │  ← RAIL: horizontal, snap, one card
│  │     │ │     │ │     │  →   │     per dish. Swipe here drives
│  └─────┘ └─────┘ └─────┘      │     the stage.
│                               │
│ ┌───────────────────────────┐ │
│ │  3 items       ₦13,400  → │ │  ← DOCK: accent fill, thumb zone
│ └───────────────────────────┘ │
└───────────────────────────────┘
```

**Trigger is the swipe on the rail, not a tap.** The rail is scroll-snapped; the
card crossing the snap centre is the plated dish. Tapping a card scrolls it to
centre, which fires the same landing. The stage itself is never a scroll target
and never a tap target — it is the result, not a control.

Rationale: swipe is what the diner is already doing to read a menu, so the
landing is a reward for browsing rather than a separate interaction to learn.

**The filter bar scrolls the rail; it does not filter it.** Tapping a category
animates the rail to that section's first card, which fires one ordinary landing.
Nothing is removed from the rail and nothing is re-rendered.

That is a deliberate rejection of the obvious behaviour. A real filter would
empty the rail and re-fill it, which means either a landing with no outgoing dish
or a rail that jumps without one — and the diner loses their place in a menu they
were halfway through reading. Scroll-to keeps one continuous strip of food, keeps
the browse position recoverable, and makes the categories a map rather than a
mode.

| Property | Value |
|---|---|
| Pill | `--t-label`, `--r-pill`, `--s-2` / `--s-3` padding, `--brass` on `--ink` |
| Active | `--accent` at 12%, label to `--chalk`. Not a filled pill — the accent belongs to the light and the dock |
| Scroll | 380ms `--ease-land`, matching Contact. The rail arrives as the dish does |
| Sync | The active pill follows the rail on manual swipe, 120ms `--ease-ui` |

The bar itself scrolls horizontally and is never wrapped to two lines. A chain
with fourteen categories has a menu problem, and hiding it behind a taller
header solves nothing.

### 6.2 Phases and timing

One landing is **520ms** end to end. Phases overlap; times are from swipe
settle (`scrollend` on the snap container, or a 90ms velocity-idle fallback on
browsers without it).

| Phase | Window | What moves |
|---|---|---|
| **Clear** | 0 → 140ms | Outgoing dish: `y −18px`, `scale .94`, `opacity 0`, translated 12px along swipe direction. Its contact shadow widens and fades. |
| **Approach** | 90 → 380ms | Incoming dish: `y −34px → 0`, `scale 1.06 → 1.0`, `rotate −1.5deg → 0`, `opacity 0 → 1` (opacity completes by 200ms so it is never a ghost mid-fall). |
| **Contact** | 380ms | Shadow crossfade completes. This is the frame the whole animation is for. |
| **Settle** | 380 → 520ms | Spring: `scale` overshoots to `.994` and returns. Light pool blooms `--accent-glow → --accent-wash` and back over 240ms. |

Easing tokens:

```
--ease-lift    cubic-bezier(.55, 0, .85, .35)   /* leaving, accelerating */
--ease-land    cubic-bezier(.16, .84, .28, 1)   /* arriving, decelerating hard */
--ease-ui      cubic-bezier(.4, 0, .2, 1)       /* everything non-food */
--spring-settle  { type: spring, stiffness: 520, damping: 34, mass: .7 }
```

Dish name and price do not travel with the dish. They swap at 200ms with a 90ms
`--ease-ui` crossfade and a 4px rise — subordinate, so they don't compete with
the food.

### 6.3 The contact shadow

The shadow is what sells the landing. It is **two stacked pre-rendered layers**,
crossfaded — never an animated `box-shadow` or `filter: drop-shadow`, both of
which repaint per frame and are the first thing to drop frames on mid-range
Android.

| Layer | Appearance | At start of Approach | At Contact |
|---|---|---|---|
| `shadow-air` | wide, soft, 22% opacity | `opacity 1`, `scale 1.18` | `opacity 0`, `scale 1` |
| `shadow-contact` | tight, dark, 46% opacity | `opacity 0`, `scale .82` | `opacity 1`, `scale 1` |

Both animate on `opacity` and `transform` only. The crossfade uses `--ease-land`
and lands exactly on the 380ms mark — earlier and the dish looks dropped, later
and it looks like it sinks through the table.

### 6.4 Unavailable dishes — the light doesn't come on

For a `No Stock` or `No Product` item, the dish still lands, at full timing. What
changes:

- `filter: grayscale(.85) brightness(.72)`, `opacity .55`
- No light-pool bloom in Settle — the accent stays at `--accent-glow`
- `shadow-contact` peaks at 24% instead of 46%
- A `--t-label` chip in `--slate` on the card and the stage: `NO STOCK` / `NO PRODUCT`
- The dock cannot receive it; the add control is replaced by the chip, not disabled-looking

The item is never hidden and never skipped in the rail. Per `PRD.md`, a diner
must be able to see that the dish they had last time exists here and just isn't
available today.

The `filter` here is applied once at render and never animated. §7 bans animating
`filter` per frame, not using it — an unavailable dish is drained before it starts
moving and stays that way.

### 6.5 Returning-diner sequence

Fires once on load, only for a recognised diner. One orchestrated moment, 940ms:

| Beat | Start | What |
|---|---|---|
| Greeting ribbon | 0 | Slides from behind the table edge, `y −12px → 0`, opacity in. 260ms `--ease-land`. Holds 4s, then retracts on scroll or tap. |
| First dish lands | 180 | Standard §6.2 landing for item 1 of the last order. |
| Reorder row rises | 520 | Item chips rise from the dock, `y 16px → 0`, stagger 60ms, cap the visual stagger at 6 chips regardless of order length. |

Nothing animates on load for an unrecognised diner — the first dish is simply
already plated. Absence of the sequence is how "we don't know you" is expressed;
there is no empty state.

### 6.6 Options — the card opens, the dish does not move

Tapping the plated dish's card expands it in place into an options accordion.
`PRD.md` § Diner-facing flow fixes this: the dish expands, the diner picks
add-ons, Add to Cart sits below the options, and browsing continues.

**Not a bottom sheet, not a modal, not a route.** All three cover the stage, and
the stage is the product. An accordion keeps the plated dish lit and visible
above the choices being made about it, which is the whole argument for plating it
in the first place.

| Beat | Window | What |
|---|---|---|
| Open | 0 → 240ms | Card height to content, `--ease-land`. Rail cards either side translate outward on `transform` only |
| Groups | 80ms + 40ms stagger | Each option group fades and rises 6px, `--ease-ui` |
| Close | 0 → 180ms | Reverse, `--ease-ui`. No stagger — leaving is not a moment |

Height animation is the one sanctioned exception to the transform-and-opacity
rule in §7, and it is bounded: it runs once per tap, on a card, never during a
landing, and never on more than one card at a time. Everything moving *around*
the accordion still animates on `transform`.

**The plated dish does not change when options change.** No second cutout, no
swap, no re-land. `PRD.md` states this and it is a rendering rule as much as a
content one — "extra plantain" is a line of text and a price delta, and a dish
that re-lands on every checkbox turns the signature moment into a twitch.

What the options look like:

- Group header: `--t-label` in `--brass`, with the rule stated plainly beside it
  — `PICK 1`, `PICK UP TO 3`. Never "required" as a lone asterisk.
- Row: `--t-body` name left, `--t-price` delta right. A zero delta renders as
  nothing at all, not as `₦0` — "No coleslaw" is a substitution and pricing it at
  zero draws the eye to a number that does not matter.
- Selected: `--accent` at 12% fill, `--chalk` label, 44px minimum row height.
- An unavailable option is `--slate` and unselectable, with the same NO STOCK
  chip as §6.4. Same rule, same reason: the diner sees it exists.

Add to Cart sits at the accordion's foot, inside the card. The dock stays where
it is and updates its count — it is the tab's running state, not this dish's
confirm button.

### 6.7 The tab

A table's running total lives in the dock, second line, `--t-label` in `--brass`:
`TABLE 12 · 3 ORDERS · ₦13,400`. It appears when the session exists and is absent
otherwise — `API_CONTRACTS.md` §4.4 sends `session: null` before the first order,
and absence is the empty state here as it is everywhere else in this system.

Tapping it expands the tab: aggregate lines, quantity, line total, and the
diner's own lines marked. **Marked, not separated.** One list in kitchen order,
with the diner's rows carrying a small `--brass` `YOURS` label, because the point
of the tab is that the table is one bill. Splitting the list into "mine" and
"theirs" builds the mental model we are explicitly not building.

No names, no avatars, no device labels. The other diners at the table are rows of
food.

### 6.8 Not sent yet

The order the connection swallowed. `PRD.md` § Connectivity requires an honest
state and forbids a fake success, so this is a named visual state, not a spinner
that never resolves.

| State | Dock | Copy |
|---|---|---|
| Sending | Accent fill holds, `--t-button`, no spinner on the fill | `Sending…` |
| Not sent | Dock drops to `--graphite` fill, `--chalk` label, 2px `--brass` top rule | `Not sent yet · will retry` |
| Stale | Same, plus a `--t-label` line | `Still not sent · send now?` |
| Sent | `--ok` fill for 900ms, then the dock returns to accent | `Order sent` |

The transition to Not sent is a 200ms `--ease-ui` colour change and nothing else.
No shake, no pulse, no red. `--alert` is for destructive actions (§2) and a
queued order is not a failure — it is a promise the app is still keeping.

Stale appears past roughly ten minutes and asks rather than fires
(`API_CONTRACTS.md` §5.1). It is the one place the diner app raises its voice, and
it still only raises it to a question.

**There is no offline banner across the top of the screen.** The menu is already
loaded, the cart still works, and browsing is unaffected — a full-width warning
would tell the diner the app is broken when only the last three seconds were. The
dock carries the state because the dock is where the consequence lives.

## 7. Performance floor

Target device class: **Tecno Spark / Infinix Hot / Redmi A-series**, and an
iPhone SE (2nd gen) for the iOS path. Android 11–13, 3–4GB RAM, mid-tier
Mali or Adreno.

This is a floor, not an average. Lagos and Abuja both carry plenty of flagship
phones and the animation will fly on those — but the diner the pilot must not
lose is the one on a two-year-old Spark, and every budget below is written for
that phone.

- 60fps during a landing; **45fps sustained is the hard floor** — below that, cut
  the light-pool bloom first, the settle spring second.
- Only `transform` and `opacity` animate. Anything animating `width`, `top`,
  `filter`, `box-shadow`, or `background` per frame is a bug. The one sanctioned
  exception is the options accordion's height (§6.6), which is bounded to one
  card, one tap, never during a landing.
- `will-change: transform` on the stage dish only, and removed after Settle.
- Rail cards render the dish at 96px and load a 192×192 crop for 2× density —
  never the stage asset scaled down.
- First landing must be ready before first paint of the stage — a dish that
  pops in unlit and then animates is worse than a slower load.

### Data is a cost the diner pays

Most diners will scan on mobile data bought by the megabyte, on a network that is
often 3G in practice regardless of what the status bar claims. A menu that costs
₦200 to open is a menu people stop opening, and the restaurant will hear about it
before we do.

| Budget | Value |
|---|---|
| Stage asset | WebP, 720×720, transparent, **≤120KB** |
| Rail crop | WebP, 192×192, **≤18KB** |
| First load, 20-item menu | **≤900KB** total, including fonts and JS |
| Preload | Stage assets ±2 cards from centre. Rail crops all. Nothing else |
| Repeat scan | Cache-first on images; only the `/scan` JSON crosses the wire |

Stage assets beyond ±2 load lazily as the rail moves. A 60-item menu must never
fetch 60 stage assets, and the diner who swipes the whole menu pays for the whole
menu — which is their choice, made one dish at a time, not ours made at load.

Fonts: three faces, variable, subset to Latin, `swap`, self-hosted, preloaded —
two of them (Display and Utility) in the critical path, Body allowed to swap in.
Total font payload ≤110KB or a face gets cut.

### Photography — the pipeline, not a wish

`PRD.md` § Menu imagery settles this: Claid.ai removes the background and
enhances, then **a normalisation step we own** measures the cutout's bounding box
and scales it so the bottom edge lands on the contact line below. That step is
deterministic and it is what makes photos shot at inconsistent distances usable.

The output contract, which the normaliser guarantees and the renderer assumes:

- Square frame, transparent background, dish centred horizontally.
- **Contact edge at 86% of frame height** — the anchor the landing and the shadow
  are registered to. Inconsistent contact points make dishes appear to land at
  different depths, which reads as broken rather than unfinished.

What Claid cannot fix, and what the one-page shoot guide at onboarding therefore
has to: **key light upper-left at ~35° elevation**, consistent across a chain's
whole menu, and **camera ~25° down** on the plate. Not flat lay, not eye level.
Light direction and camera angle are baked into the pixels; framing is not.

**There is no un-plated fallback.** An item without a compliant asset is not
plated at all — `image_ready` false, and `apps/restaurant` says so plainly
(`ARCHITECTURE.md` §5). A placeholder dish in the stage is worse than a gap,
because the gap is honest and the placeholder is the demo failing quietly.

## 8. Quality floor

Not optional, not announced in the UI.

- Touch targets ≥44px on the diner app, ≥56px on the counter tablet (§10.1). All
  interactive elements in the bottom 60% of the phone viewport — the stage is out
  of thumb reach by design.
- Focus rings: 2px `--accent`, 2px offset, visible on keyboard only.
- Text contrast ≥4.5:1; `--t-label` at 11px must clear 4.5:1, which is why
  `--slate` is as light as it is.
- Status is never colour alone. Every state that matters carries a word beside
  its hue — availability, order status, tab state.
- `prefers-reduced-motion: reduce` → dishes crossfade in place over 160ms. No
  travel, no rotation, no settle, no bloom. Shadow renders in its contact state.
  The returning-diner sequence becomes a simple fade-in of all three beats
  together. The filter bar jumps instead of scrolling; the options accordion
  opens instantly at full height.
- Everything legible at 200% browser zoom without horizontal scroll.
- Every price the diner sees is formatted per §4 — grouped, whole naira, never a
  raw minor-unit integer. A leaked `450000` on a menu card is a shipping bug, not
  a typo.

## 9. What this system does not do

Guardrails against drift in later sessions:

- No gradients other than the light pool.
- No glassmorphism, no blur backdrops — they cost frames the landing needs.
- No skeleton shimmer. Dishes fade in when ready; the stage holds ground colour.
- No icon set beyond a back chevron, a plus, and a cart glyph.
- No secondary accent. A chain gets one hue.
- No animation on `apps/restaurant` or `apps/internal` beyond `--ease-ui` state
  changes. The landing belongs to the diner app only — see §10.
- No dark-mode variant. The diner app is already a dim room; a second theme would
  mean a second set of contrast proofs for the light pool and no diner has asked.

## 10. The restaurant surfaces

`apps/restaurant` and `apps/internal` borrow the palette and the type and share
none of the motion. Same tokens, different job: the diner app is read at arm's
length for pleasure, the counter tablet is read across a counter under pressure.

### 10.1 The counter tablet

Landscape, 10", propped at the till, in daylight through a window, read by
someone with one hand full.

| Rule | Value |
|---|---|
| Ground | `--linen`, not `--ink`. Daylight beats a dim room, and the tablet is not a dining scene |
| Body type | 17px floor, not 15px. Read at 60–80cm, not 30 |
| Order card | Table label at `--t-stage` weight — the number staff shout across the room is the biggest thing on the card |
| Status | Colour plus a word. `--ok` alone fails for the ~8% of men with red-green deficiency, and this is a shift-long tool |
| Touch targets | 56px, not 44px. A thumb, a queue, and no time to aim |
| Destructive | Cancel is a two-step with the reason picker as step two. `--alert` outline, filled only on the second tap |

**Stale state is loud here, unlike on the phone.** When the tablet loses its
connection it says so across the top of the queue — `LAST UPDATED 14:32 ·
RECONNECTING` — because a silent stale queue means staff cook from a list that
stopped updating, and that is the failure that loses a client in week one
(`PRD.md` § Connectivity).

**Carried-over tabs are marked, never hidden.** The daily reset is a view filter
on settled sessions; an open tab from yesterday renders with a `--brass`
`CARRIED OVER` chip and stays until someone closes it.

**Reprint is on every card, always.** 56px, `--brass` outline, `--t-label`,
bottom-right of the order card where the thumb already rests.

| Rule | Why |
|---|---|
| Always present | Not revealed by a failure, not hidden until a job row exists, not disabled after a ticket has gone. Staff never work out what state the printer was in |
| One tap, no confirm | It is not destructive. The two-step in the table above is for cancel and stays there — a modal between a jammed printer and a waiting kitchen is the wrong cost |
| Reprints what the status calls for | Kitchen ticket on `processing`, receipt on `delivered`. One button, not two |
| Confirms in place | `SENT TO PRINTER · 14:32` under the button, `--brass`, `--ease-ui`, gone in 4s. Never a toast that covers the next card |

The word is **Reprint** on the first press as much as the fifth. "Print" implies
we know whether the first attempt landed, and there is no paper sensor telling us
(`PRD.md` § Hardware and printing).

**58mm is 32 characters.** Both layouts are monospace by force, not choice — the
printer has one font and no proportional metrics. Set them in Martian Mono on
screen so a preview matches the paper.

**Kitchen ticket — no prices, none.**

```
      TABLE 12
   14:32 · #A47
--------------------------------
2x  JOLLOF RICE & CHICKEN
      + extra chicken
      - no pepper
1x  MOI MOI
--------------------------------
        (end)
```

Quantity leads because the cook reads down the left edge. Modifiers indent under
their item, `+` for additions and `-` for removals, and they are never collapsed
into the name — a cook scanning for "no pepper" needs it on its own line. The
short order ref is what staff say aloud when a ticket and a plate get separated.

A price on this ticket is a bug, not a variation. It reaches a diner eventually,
and then it is a number we have to honour.

**Counter receipt — itemised, with the total.**

```
      <RESTAURANT>
      TABLE 12
   14:58 · SESSION #S91
--------------------------------
2x JOLLOF RICE & CHICKEN  9,000
     + extra chicken        500
1x MOI MOI                1,200
--------------------------------
TOTAL                   N10,700
        (end)
```

Prices right-aligned on the last column, whole naira, grouped, no kobo — §4 and
§8's rule holds on paper. `N` rather than `₦` because a 58mm ESC/POS head has no
glyph for it and prints a box; the receipt is the one place in the product where
naira is not typeset as `₦`, and that is a printer limitation, not licence to
drift on screen.

The total is the tab's, not the order's. A receipt prints per order as it is
delivered while the tab stays open, so the number on paper is the running total
at that moment — which is what the counter is reading when a table asks what they
are at so far.

### 10.2 Internal ops

`--ink` ground, `--chalk` text, dense tables, `--brass` structure, no accent at
all — there is no chain whose colour this surface should wear, and a per-chain
accent on a cross-chain dashboard would misread as scoping. Suspension controls
use `--alert` and are the only place in the system where a destructive action is
also a routine one.
