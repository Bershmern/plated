# Marketing — QR Ordering SaaS

> **Depends on:** `PRD.md`  
> **Read by:** `ROADMAP.md`, `CLAUDE.md`  

> Positioning, voice, and the landing page's copy deck. Traces back to `PRD.md`;
> the two USP blocks there are locked, and this file translates them for a buyer
> without rewriting them. Built in Phase 6, after the animation exists —
> `ROADMAP.md` says why.

## 1. Who is reading the page

Not the diner. The diner never sees this site; they meet us through a QR code on
a table. The reader is the **owner or operator of a 2-3 outlet chain** in Lagos
or Abuja — the person who signs the subscription and who will be standing next
to us during the pilot.

What that person already has: a POS or a cash register they are not going to
replace, a menu on a laminated board or a Canva PDF, and — if they have looked at
this category at all — a free tool that looks free, or a ₦15,000 QR menu that is
a PDF behind a redirect.

So the page does not compete on features, and it cannot compete on price. **It
competes on the fifteen seconds where they watch a dish land on a table and want
it for their restaurant.** Everything else either sets that moment up or gets out
of its way.

Three things about this reader shape the copy:

- **They think in outlets, not accounts.** "Works across your outlets" lands;
  "multi-tenant" does not.
- **They have been burned by setup.** Anything that sounds like a migration reads
  as a threat. The setup fee is easier to sell than the setup work, so the page
  is honest about both.
- **They are quoted in naira and they compare in naira.** We are an order of
  magnitude above the cheap tools and they will notice on the pricing section, not
  on the call. The page has to have already earned the number by the time the
  reader reaches it.

## 2. Positioning

One sentence, and everything else on the page is evidence for it:

> **The QR menu your regulars recognise, and your first-timers remember.**

The second clause is USP 1, the first is USP 2, in the order an owner cares
about — a returning customer is money they can picture, and the animation is
what they will actually feel while reading.

Said plainly: a QR table-ordering app that looks like the food, and that
remembers a diner across every outlet you run without asking them to sign in.

**What we do not claim.** Written down because a headline drifts toward these
under pressure:

- Not a POS, and not a POS replacement. We do not touch the register.
- Not a payments product. The diner pays at the counter, as they do today.
- Not a loyalty programme. No points, no tiers, no cards.
- Not a delivery platform. No marketplace, no commission, no riders.

The temptation is to soften "not a POS" into "works alongside your POS", which
implies an integration we do not have. Say the smaller true thing.

**And we are not the cheap option.** The page never apologises for the price and
never argues against a competitor's. `PRD.md` calls the premium position an
accepted strategic bet; on the page that means the number appears plainly, once,
after the reader has seen what it buys.

## 3. Voice

The reader runs a restaurant. They are busy, they are sold to constantly, and
they can tell a claim from a demonstration.

| Do | Don't |
|---|---|
| Short declaratives. "Your menu, on their phone, in thirty seconds." | Feature lists with checkmarks. |
| Concrete nouns — outlet, table, dish, counter, tablet. | Platform, solution, seamless, ecosystem. |
| Naira, printed as `₦`, grouped: `₦50,000`. | Vague pricing, "contact us for a quote". |
| Name the competitors' category, not the competitors. | Comparison tables against named products. |
| Nigerian English as it is written in business. | Manufactured local flavour, pidgin as decoration. |

Two rules that matter more than the table:

**Show the product doing the thing instead of describing it.** The real landing
runs above the fold, so every sentence near it can be shorter than it would
otherwise need to be. The animation carries the claim.

**Never write in the diner's voice.** No invented testimonials, no "I loved
reordering my usual!" The diner is the subject of this page, never its narrator.

## 4. Headlines

Five options against the same page. The recommendation is first, and the
reasoning matters more than the list — a later session may need a sixth.

| # | Headline | Reads as |
|---|---|---|
| 1 | **Food that arrives before it arrives.** | The animation, in the diner's experience. Recommended. |
| 2 | They scanned once. Now every outlet knows them. | USP 2, owner-facing. |
| 3 | The menu that plates itself. | The animation, playful. |
| 4 | Your regulars, recognised at every branch. No app, no login. | USP 2, plainest. |
| 5 | Most QR menus are a PDF with extra steps. | The category, attacked. |

**Why 1.** It describes the one thing the page can prove in the same viewport,
and it is the only option that gets better once the animation is running behind
it. It also survives being screenshotted into a WhatsApp forward, which is how
this page will actually travel between owners.

**Why not 5**, despite being the sharpest line: opening on what competitors are
gets a nodding reader rather than an interested one, and it invites the feature
comparison we are trying to leave behind.

Subhead under 1, doing the work the headline skipped:

> A QR menu where dishes land on the table as your diners swipe — and where a
> regular who ordered at your Ikeja outlet is recognised at your Lekki one,
> without an account.

## 5. Page structure

Seven sections, in order. Each has one job and is allowed to fail at nothing
else. `apps/landing` is a separate deploy from `apps/diner` (`ROADMAP.md` Phase
6), so nothing here is constrained by the diner app's bundle.

### 5.1 Above the fold — the product, running

The real landing animation, live, on a phone-shaped frame. Not a screenshot, not
a looping video of a screenshot. `ROADMAP.md`: "the landing itself, running, not
a screenshot of it."

Headline, subhead, and one button. Nothing else competes.

> **Food that arrives before it arrives.**
>
> A QR menu where dishes land on the table as your diners swipe — and where a
> regular who ordered at your Ikeja outlet is recognised at your Lekki one,
> without an account.
>
> `[ Book a demo ]`

The frame is swipeable on touch and auto-advances on desktop. A visitor who
swipes it once has already understood USP 1, and every word after this is
support.

**If the live embed cannot hold 45fps on the visitor's device, fall back to the
captured footage** rather than shipping a stuttering hero. A janky animation on
the marketing page is worse than no animation, because it disproves the claim in
the same viewport that makes it.

### 5.2 The problem, in their words

Three lines, no header art:

> Your QR menu is a PDF with a shopping cart bolted on.
>
> It works. Nobody remembers it. And the third-time regular at your Lekki outlet
> gets the same blank screen as a stranger.

This is the only section allowed to be negative, and it names the category
rather than a competitor (§3).

### 5.3 USP 1 — the animation, explained once

The reader has already seen it. This section tells them why it is not decoration:

> **Dishes get ordered when people can picture eating them.**
>
> Every dish is shot on a plate, on a transparent background, and lands on a lit
> table as the diner swipes. Not a thumbnail in a list — the actual dish,
> arriving. It is the difference between reading a menu and being shown one.

One constraint, stated here rather than discovered at onboarding:

> This only works with proper photography, so we handle it. We shoot your menu to
> a fixed spec before you go live, and every image is processed before it lands on
> the table.

That is now a promise the business can keep: `PRD.md` § Menu imagery settles the
pipeline — background removal and enhancement through Claid.ai, then our own
normalisation pass for the contact line — and onboarding includes the shoot. Do
not water this sentence down to "supply your own photos". The whole animation
rests on it.

### 5.4 USP 2 — the Chidi walk

The strongest thing on the page for an owner, and the hardest to explain in the
abstract. So it is not explained in the abstract. It is one diner, two outlets,
told in three beats — the `PRD.md` acceptance test, rewritten for a buyer:

> **Monday. Ikeja.**
> Chidi scans the code on table 12, orders jollof rice and chicken. Pays at the
> counter, as usual.
>
> **Three weeks later. Lekki.**
> He scans a different code, at a different outlet, on the same phone.
>
> **"Welcome back — that's your 4th order with us."**
> His jollof is already on screen, one tap from the cart. He never made an
> account. He never downloaded anything. He does not know we did this.

Then the boundary, because an owner will ask and the honest answer sells:

> Your history stays yours. A diner who orders at your outlets sees your orders,
> at any of your outlets. They will never see them at another restaurant, and
> another restaurant's diners will never arrive carrying someone else's.

That last sentence is doing compliance work, not just marketing work. Keep it.

### 5.5 Built for the way service actually goes

The section the cheap tools cannot write, and the one an owner in Lagos will read
twice. Three realities, three plain answers:

> **One table, one bill.** Four people at a table order from four phones. It is
> one tab, with one total, settled once at the counter. Nobody is adding up
> receipts.
>
> **The network drops. The order doesn't.** If a diner's connection goes while
> they are ordering, the order waits on their phone and sends itself when the
> signal returns — and it tells them plainly that it hasn't gone yet. It can
> never be sent twice.
>
> **The queue survives a power cut.** If the restaurant's connection goes, the
> tablet keeps showing the last orders it received and says exactly how old they
> are. Your staff are never staring at a blank screen during a rush.

No hedging language here and no boasting either. These are answers to things the
reader has personally lost money to, so state them and move on.

### 5.6 What it takes to run it

The setup objection, answered before it is raised:

| | |
|---|---|
| Your POS | Stays exactly as it is. We do not touch it. |
| Payment | At the counter, the way you do it now. |
| Hardware | We bring the tablet, the printer and the router, installed and working. Or use your own and pay less. |
| Printing | A kitchen ticket when the order goes in, a receipt when it goes out. One printer, on your counter. |
| Connectivity | First month of data is on us. After that it is your line, and we say so at signing. |
| Your menu | We enter it. You approve it. |
| Photography | We shoot it, to the spec the animation needs. |
| Your brand | Your logo, your name, your colour. Ours sits small at the bottom of the screen. |
| Your staff | Two things to learn: read the order feed, mark a dish sold out. |

The last row is the one owners actually care about, and it is deliberately last
so it is what they finish reading.

**The data row is not a footnote.** `PRD.md` is explicit that the bundled data
covers the first month only, as part of installation. An owner who discovers that
in month two has been misled by us, and it is a cheap thing to be honest about
while the tablet is still the best part of the offer.

### 5.7 Public Pricing & Dual-Mode "Get a Quote" Questionnaire

On the public landing page (`apps/landing`), we display **one public price baseline** to preserve high-converting quote intake:

> **From ₦20,000 / month\***  
> *\*Setup fee not included. Retainer scales based on business size & order volume.*  
>  
> **No commission. No per-order cut. No percentage of anything. What you sell is yours.**

**Dual-Mode Questionnaire Flow (`/quote` & Modal Popup):**
- **Modal Popup**: Clicking any `"Get a Custom Quote"` button opens a smooth slide-over modal over the current viewport.
- **Dedicated Route (`/quote`)**: Standalone page for direct sharing, email links, and search indexing.
- **3-Step Intake**:
  1. *Venue Profile*: Restaurant Name, Outlet Count (1, 2–3, 4+), City (Lagos, Abuja, Other), Instagram/Website handle.
  2. *Operational Volume*: Estimated daily table orders (<50, 50–150, 150+), current menu format.
  3. *Contact*: Owner Name, WhatsApp Phone, Email.
  4. *Confirmation*: *"We are analyzing your outlets — expect your custom quote on WhatsApp within 2 hours."*

### 5.8 "Book a Demo" Pre-Call Intake Modal

A 30-second intake modal for high-intent leads booking a live call:
- **Fields**: Name, Restaurant Name, WhatsApp Phone Number, Preferred Date/Time.
- **Microcopy Offer**: *"Fifteen minutes. We pre-load a sample of your actual menu onto our demo phone before we call."*

### 5.9 Social Proof — Partner Logos & Owner Review Carousel

- **Monochrome Partner Logo Strip**: Renders onboarded chain logos in single-tone `--graphite` on `--linen` to maintain visual luxury and avoid logo color clash.
- **Framer-Style Owner Metrics Carousel**: Tactile `--porcelain` cards highlighting concrete business outcomes in `Martian Mono` (*"35% Faster Table Turnover"*, *"Zero Lost Orders During Peak Rush"*).
- **Conditional Render Gate**: Gated by a flag so placeholder/empty blocks are never rendered prior to Phase 7 pilot onboarding (`MARKETING.md §8`).

### 5.10 Interactive Accordion FAQ

Smooth height-animating accordions (`--ease-ui` 200ms) answering the 6 primary owner objections:
1. *POS Integration*: Does not replace your POS; staff key orders in from the tablet feed.
2. *Payment Handling*: Diners pay at the counter as usual; orders accumulate into one tab.
3. *Network & Power Outages*: Unsent orders queue on diner phones; tablet queue retains state with age timestamps.
4. *Thermal Paper Failure*: Beeps physically; persistent **Reprint** button on every queue card.
5. *Cross-Brand Privacy*: History is strictly siloed per `(device, chain)`.
6. *Image Credits*: 10 free credits/month included; extra credits cost ₦1,000/credit.

### 5.11 Comprehensive 4-Column Architectural Footer

- **Col 1 (Brand & Mission)**: Plated Mark (`currentColor`), brand statement, copyright.
- **Col 2 (Product Surfaces)**: Diner PWA (`order.plated.ng/o/demo`), Counter Tablet preview, Internal Ops.
- **Col 3 (Conversion & Quotes)**: Dedicated `/quote` questionnaire, Book a Demo modal, Pricing floor information.
- **Col 4 (Legal & Support)**: Privacy Policy, Terms of Service, NDPA Compliance notice, Direct WhatsApp support.
- **Bottom Bar**: `POWERED BY PLATED` tag in muted caps.

## 6. How the site looks — and what it must not borrow


`apps/landing` shares a brand with `apps/diner`, not a codebase and not a motion
system.

**It borrows** the palette from `DESIGN_SYSTEM.md` §2 — `--ink` ground, `--linen`
lit surfaces, `--brass` for structure — and the three faces from §4: Bricolage
Grotesque for display, Instrument Sans for body, Martian Mono for prices. An
owner who sees the site and then the product should recognise the second from the
first.

**It does not borrow the 520ms landing.** `ROADMAP.md` Phase 6 states this
directly:

> **The landing site does not inherit the diner app's motion.** It borrows the
> palette and the type, but the 520ms landing is the product's, and a marketing
> page that mimics it cheapens the thing it is selling.

The reasoning is worth keeping because it is easy to argue against. The landing
is USP 1. If the marketing page's section headers also fly in on `--ease-land`,
if the pricing card settles with `--spring-settle`, if every scroll reveal drops
a dish-shaped shadow, then by the time the reader reaches the hero the motion is
ambient — it is how this website behaves, not what this product does. The demo
inside the frame stops being remarkable because everything around it moves the
same way.

So the rule is a hard split:

| Where | Motion |
|---|---|
| Inside the hero frame | The real 520ms landing, exactly as specified. Untouched. |
| Everywhere else on the site | `--ease-ui` only. Fades and short offsets, ≤200ms. |

No parallax, no scroll-jacking, no reveal-on-scroll cascade down the page. The
one animated thing on this website is the product, running.

**Type on the site may scale up where the app's does not.** `DESIGN_SYSTEM.md`
§4 caps everything but `--t-stage` because the diner app is a phone product held
at arm's length. A landing page is read on a laptop by someone deciding whether
to book a call, so the display face is allowed to go large here. That is a
divergence, not an oversight — the constraint it breaks was written for a
different screen and a different task.

The rest of §8's quality floor still applies unchanged: 44px targets, visible
keyboard focus, 4.5:1 text contrast, `prefers-reduced-motion` honoured. Under
reduced motion the hero shows the captured footage's contact frame as a still,
with the same headline over it. The page still makes its argument; it just makes
it in one image.

**Naira is written the app's way**, per `DESIGN_SYSTEM.md` §4: `₦50,000`, whole,
grouped, never with kobo. A price on this page and a price in the product should
be typeset identically.

**Accent colour on this site.** The marketing page has no chain, so it has no
per-chain accent. It uses one fixed accent of our own, and that accent must not
be a colour we would hand a client — a page that looks like one restaurant's
brand reads as that restaurant's page. `--brass` is the safe default for
structure; the single CTA is where the fixed accent belongs.

**Our mark, on the other hand, is not the accent.** This site and `apps/internal`
are the only screens it appears on, and it renders `--graphite` on `--linen` per
`DESIGN_SYSTEM.md` §3.3 — never brass, which fails contrast on this ground, and
never the CTA accent, which would leave the page arguing in one colour. The word
**Plated** does the naming; the mark sits beside it and stays quiet.

**And the page loads on a phone on mobile data**, because that is how a forwarded
link gets opened. The hero is the only heavy thing on it, and it is deferred until
the fold is painted.

## 7. Objections, answered

What owners will ask, in roughly the order they ask it. These are for the demo
call as much as for the page, and the page should already have answered the first
three before the call happens.

**"Why is this ₦500,000 when I can get a QR menu for ₦15,000?"** Because a
₦15,000 QR menu is a PDF with a link, and this is a fitted installation: we come
to you, shoot the menu, enter it, set up the tablet, the printer and the router,
and train your staff. The animation is the part your customers see; the setup is
the part you would otherwise have to do yourself. Say it in that order — the work
first, the number second — and never argue that the cheap tool is bad. It is not
bad. It is a different purchase.

**"Do I have to change my POS?"** No. We do not touch it, integrate with it, or
read from it. Orders arrive on a tablet; your staff key them into the register
exactly as they do when someone orders at the counter. That is a real cost —
double entry — and it is the honest trade for not being a POS migration
(`PRD.md` § Explicitly OUT of MVP scope).

**"How do my customers pay?"** At the counter, as they do now. The app takes the
order, not the money. Everything a table orders adds up into one tab and your
staff close it once. When payments arrive they will be a separate decision, and
`ARCHITECTURE.md` §4.3 already constrains how — it will not hang off the device
token.

**"What happens when the light goes?"** The tablet holds the last orders it
received and shows how old they are, so nobody is staring at a blank screen. The
diner's phone holds an unsent order and sends it when the signal returns, and it
can never send twice. What we do not claim: the tablet cannot receive an order
that was never transmitted. Say the limit out loud — an owner who has run service
through an outage will trust the honest version and distrust the other one.

**"What if the printer runs out of paper mid-rush?"** It beeps and lights up, your
staff change the roll, and every order on screen has a Reprint button they press
once. The button is always there, not something that appears after a failure, so
nobody has to work out what state the printer was in. Say it plainly — an owner
who has lost a ticket knows exactly how much this question is worth.

**"Will my customers see your name?"** Barely. The app is yours: your logo, your
name, your colour, and no branding of ours anywhere in the ordering flow. One
small "powered by" line sits at the bottom of the screen, below everything a
diner uses. Do not oversell this into "fully white-label with no attribution" —
the line is there, and an owner who spots it later after we said otherwise has
caught us in something small and cheap.

**"How does it know who they are without an account?"** The phone remembers, we
do not. Nothing is stored under a name, an email, or a number — there is no
account to have. Say it that way. Do not say "we track them", which is both
uglier and less accurate than what the mechanism does.

**"What if they clear their phone?"** They are a new diner again. It is a soft
failure, not a broken one: the menu still works, the ordering still works, and
the greeting comes back the next time they order. Worth saying out loud rather
than being discovered — an owner who hears it from us first does not treat it as
a defect when they see it.

**"Can I see my competitors' customers?"** No, and neither can they see yours.
§5.4's boundary sentence is the answer, verbatim.

**"What about the data protection law?"** `PRD.md` open question 5 and
**unresolved**. The mechanic is defensible — no names, no numbers, and the link
between a device and its orders expires after 90 days — but what notice we owe a
diner who never signs up for anything is not decided. **Do not improvise an NDPA
answer on a call.** Describe the mechanism and say we will come back with the
formal position.

**"I have two branches but my brother owns the third."** `PRD.md` open question 1
and also **unresolved**. The mechanic is fixed: two separately signed franchisees
are two chains, so history does not pool between them. What is not fixed is
whether we offer to put them on one chain record when both sign, and what that
means for billing and for who owns the diner data if they later split. Say the
history is per account and that we will come back on it.

**"How long does setup take?"** The menu and the shoot are the long poles, and
until the first pilot is done the honest answer is that we do it with you and we
will know precisely after the first one.

## 8. What has to exist before this page ships

The page is mostly assets, not code. Each of these blocks publication, and none
of them can be written around:

| Asset | State it must be in |
|---|---|
| Demo footage | Captured on a Tecno Spark or an iPhone SE 2, not a desktop recording (`ROADMAP.md` Phase 6). The hero's fallback is only credible if it looks like a phone. |
| A live demo menu | Real Nigerian dish names, real naira prices, real photography. A placeholder menu in the hero teaches the reader that the product is a mockup. |
| A demo booking link | One calendar, one owner, answered inside a day. A CTA that goes to a form nobody reads is worse than no CTA. |

Pricing is no longer on this list. `PRD.md` § Business model is locked and §5.7
prints the numbers as they stand.

**On testimonials: there are none yet, and the page must not fake the shape of
one.** `ROADMAP.md` puts the pilot in Phase 7, after this page exists, so the
first version ships with no logos, no quotes, and no "trusted by" strip. An empty
version of that strip — three grey placeholder marks — is the single most common
way an early landing page tells a buyer it has no customers. Leave the section out
entirely and add it when there is a real name to put in it, with that client's
permission in writing.

Until then the proof is the demo itself. An owner watching their own dish land
is stronger evidence than another owner's quote, which is the whole reason §5.8
offers to bring their menu to the call.

## 9. Open items

1. **Headline not final.** §4 recommends option 1, but the recommendation is made
   against an animation nobody outside the team has watched yet. Show the hero to
   three owners before the copy is set; if they describe what they saw using
   different words than ours, use theirs.
2. **Domain, not the name.** The product is **Plated**, settled August 2026, so
   the copy can use it throughout. `PRD.md` open question 2 is now the domain and
   the trademark clearance behind it, and that still blocks publication and the
   printed QR codes in Phase 7.
3. **Franchisee framing unresolved.** `PRD.md` open question 1. §7 records the
   mechanic and refuses to invent the sales answer; whoever closes the PRD
   question should come back and write the real one here.
4. **Folded.** `PRD.md` closed the multi-outlet curve question when the retainer
   went flat. §5.7 now states one per-outlet number that does not move.
5. **NDPA notice.** `PRD.md` open question 5. §7 defers it deliberately. Whatever
   the formal position turns out to be, it will need a plain-language line on this
   page, not only in a policy nobody opens.
6. **Whether the price is ever tested.** `PRD.md` calls the premium position an
   accepted bet and forbids re-litigating it in a build session. That is the right
   instruction for a build session; it is not a reason never to learn from the
   first three sales calls. Record what owners actually say about the number —
   record it, do not act on it alone.






