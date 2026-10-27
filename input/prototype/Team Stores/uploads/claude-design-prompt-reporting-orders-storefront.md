# Claude Design prompt — Reporting, Orders, Storefront, Integrations

Six phases. Build them in order; each assumes the one before it exists.

**Before you paste:** five things in this brief are underspecified. They're listed in *Needs confirmation* at the end. Everything else is settled.

---

## Standing rules — apply to every phase

Build only what's specified. **If something seems missing, ask — do not invent it.** An earlier prototype in this product invented five features that didn't exist, and the copy reached spec review before anyone caught it.

**Vocabulary.** These are the product's real terms, and substitutes have caused real defects:

| Use | Never |
| --- | --- |
| Submit *(orders go to the factory)* | Approve |
| Group *(a batch of orders shipped together)* | Container |
| Draft / Open / Closed / Archived | Active, On Hold, Paused |
| Players | Members |
| Point of Contact | Primary, Primary Contact |
| Visible *(a product customers can see)* | Published |

**Tone.** Name the consequence, then the action. Never scold — no "you forgot", no "overdue". The rep is running a business, not failing a test.

**Never build** a completion percentage, readiness score, setup checklist, or progress meter. A permanent checklist was deliberately removed from this workspace and must not return.

**Money.** One currency format throughout. Negative values are unambiguous — parenthesised or explicitly signed, never red alone. Every total is traceable to the rows that produce it.

---

# Phase 1 — Monthly commission report

**Reports tab.** The rep's question is *"what am I making this month?"* and they want it answered before they read anything.

## Structure: answer, then composition, then detail

**A single hero number: commission earned this month.** Largest element on the page, top left. Beside it, the period it covers and a comparison against the previous month — both the delta and the direction.

**Three supporting figures, no more**, on the same line or immediately beside it:
- **Gross sales**
- **Fundraising raised**
- **Net commission payable** — after reversals

Four top-line numbers is the ceiling. A fifth turns a glance into a read.

**A month picker** at the top, since commission settles monthly. Default to the most recently completed month, not the current partial one — a rep checking on the 3rd wants last month's finished number, not three days of this one. Make the current month reachable and label it clearly as in progress.

**A small trend chart** — commission by month, last twelve. This is what makes a number mean something: "$4,860" answers nothing until you can see it against the last year. Keep it compact; it supports the hero number rather than competing with it.

## The reconciliation

The rep needs to see how gross becomes payable, as a visible sequence rather than a single net figure:

```
Gross commission          $ ____
Refund reversals        − $ ____
─────────────────────────────────
Net commission payable    $ ____
```

**Refund reversals are their own line and are never netted silently.** A rep whose commission dropped needs to see why without exporting anything. Each reversal links to the order that caused it.

## Parent vs. rep split

A table, one row per rep, showing how each rep's sales divide between the parent and that rep. Columns: rep, gross sales, fundraising, parent share, rep share, total commission. A totals row that reconciles to the hero number.

Sortable by any column. Default sort: total commission, descending — biggest earners first.

**"Rep" now means two things on this page, and the labels have to keep them apart.** The person reading the report is a rep; so is every row in this table. Column headers can say **Rep** because the table makes the referent obvious, but prose and summary figures must not — write **your share** and **their share**, never a bare "rep share" sitting next to the viewer's own commission. If a figure could be read as either, name whose it is.

## Export

**CSV** and **PDF**, as two distinct actions rather than a dropdown. They serve different jobs: CSV goes into a spreadsheet, PDF goes to an accountant or a file. Both export **the selected month**, and the control states which month it's exporting so nobody mails the wrong one.

---

# Phase 2 — Sales breakdown

**Reports tab**, beneath the commission report.

**One table with a group-by selector — not five tabs.** The rep is asking the same question five ways, and tabs make comparison across dimensions harder than a control that swaps the grouping in place.

Group by: **Category · Product · Buyer · Decoration type · Brand**

Decoration type values: **Sublimated · Decorated · Stock**.

Columns, consistent across every grouping: units, gross sales, fundraising, commission, and share of total. Sortable. Show share of total as a number with a light inline bar — the bar makes the distribution readable at a glance without a separate chart.

Rows expand one level to reveal their constituent items. Deeper than one level becomes a spreadsheet, and the rep already has CSV for that.

Inherit the month picker from Phase 1 rather than adding a second one, and make it visibly shared so changing the month changes both.

---

# Phase 3 — Still need to order

This has two quite different shapes depending on whether the store has rosters, and getting the no-roster case right matters more than the other.

## On the Reports tab: a summary component

A card showing **total team-required gear sold**, bundles included. One number, a short supporting line, and an expand affordance that opens a dedicated page.

## The dedicated page — structured like the All Orders page

### Without a roster

The honest version: a list of orders for team-required and team-supplied items, who bought each, and the total count. That's all the data supports.

Below it — **not above, and not as a blocker** — an invitation to add a roster, framed by what it unlocks:

> **Add a roster to see who hasn't ordered.** Right now this page shows what's been bought. With a roster it also shows which players are still missing their gear, and lets you remind them.
>
> [Add players] [Import from CSV]

**Rosters are optional in this product and must never be presented as an obligation.** Research found reps reject the roster as an upfront requirement while valuing everything it produces. So lead with the outcome, offer the route, and let the page be fully useful without it. No warning icon, no incomplete state, no empty-state illustration implying something is wrong.

### With a roster

A matrix: **every player × every required item**, each cell showing **Ordered · Opted out · Not ordered**.

- Ordered and Opted out both read as resolved — visually distinct from each other but neither demanding attention
- Not ordered is the only state that stands out
- Sticky player column and item header, since this grid gets wide and long
- Filter to "Not ordered only", which is the view the rep actually works from
- A per-player summary column: "3 of 4 ordered"

Actions: **Export** and **Send reminder**. Reminder is available per player and in bulk from a selection.

**Reminders must handle missing contact details honestly.** Most players have neither an email nor a phone on file — this is the normal case, not an edge case. So:

- A player with no contact channel shows Send reminder **disabled, with the reason visible** — not hidden, not silently failing
- Bulk reminder states the real outcome before sending: *"Send to 12 of 18 — 6 players have no email or phone on file"*
- Offer a shareable store link as the fallback for those 6, since that's what the rep will actually do

---

# Phase 4 — Returns & Refunds

**A new subtab of the Orders tab.** Order rows already carry a refunded flag with no interface on it.

- **Refunded status on order rows**, visible in the main Orders list as well as here, so a rep scanning orders isn't misled by a total that's since been reversed
- The subtab lists refunded and partially refunded orders: order, buyer, date, original amount, refunded amount, reason if captured, and the resulting commission reversal
- **Each row links both ways** — to the original order, and to the reversal line it produced in the commission report

Partial refunds need their own treatment. An order refunded in part is not a refunded order, and showing it as one will cost someone a reconciliation.

---

# Phase 5 — Orders: routing and fulfillment

**Route per line.** Each order line shows its route: **Warehouse · Decoration · Sublimation**. Add it as an Orders tab filter with a count beside each value, so the rep can see the shape of the queue before filtering it.

**Fulfillment source per line**, on order detail: **Warehouse · Factory direct**. Once shipped, factory-direct lines carry their factory tracking.

A single order can mix routes and sources across its lines. Design for that as the normal case, not an exception — a per-order badge would be wrong.

**Live production tracker — storefront, buyer-facing.** Replaces the generic three-stage shipping stepper with per-line stages:

**Ordered → Art approved → In production → Quality check → Shipped → Delivered**

Each completed stage carries its date. Lines on one order progress independently, so the tracker is per line, and the order-level view summarises the slowest line rather than averaging. Buyers reading this are parents, not reps — stage names should mean something without product knowledge.

---

# Phase 6 — Storefront: accounts and cart

## Authentication

**Browsing and adding to cart need no account. Checkout does.**

- Anyone can reach the store, browse, and fill a cart with no account
- Optionally the store requires an **access code** to enter — a per-store setting the rep controls in store settings
- An account is required only at the point of purchase
- Account creation at checkout is a step within the flow, not a wall in front of it. The cart survives it intact

## Cart saved to the account

The cart follows a signed-in shopper across devices. Items whose **price or stock changed** since they were added are flagged on return, with the change stated plainly — what it was, what it is now. Today there's only a "Saved to your account" note with nothing behind it.

## Out of stock while in cart

A banner at the top of the cart naming the affected items. Per item, one tap to **switch to an in-stock size** or **remove**. Checkout is blocked until every affected line is resolved, and the block states which items are holding it up.

Resolve in the cart. Don't send the shopper back to the product page — they've already decided.

## Abandoned-cart reminders

**Settings → Emails** lists the **24-hour** and **48-hour** reminders, each independently on or off, each with a preview.

A returning shopper lands on a **Return to cart** page showing what's still held, with any price or stock changes already flagged.

---

# Phase 7 — Integrations

**A new sub-page under Workspace settings.**

A grid of available integrations from a fixed, pre-filled list. **Klaviyo** and **QuickBooks** are the first two. Each tile: logo, name, one line on what it does, and a **Connect** button that becomes a connected state with a **Disconnect** option.

Connect opens an authentication modal where the user enters credentials for that service, then shows a connected state.

Three constraints for the prototype:

- **It only needs to appear to work.** No real authentication, no real credential storage
- **Use obviously fake placeholder values.** Never real API keys or real account credentials, even in a mockup — mockups get screenshotted and shared
- **Don't add integrations beyond the two named.** A grid of greyed-out logos implies a roadmap that doesn't exist

---

# Needs confirmation before build

1. **Bundle report** — listed with no definition. What should it show? Likely candidates are bundle sales against individual-item sales, or attach rate per bundle, and those are different reports. Specify before building.
2. **Two empty bullets** under Reporting in the source brief. Something was intended and didn't get written down.
3. **"Parent"** — confirm this means the parent account or organisation above the reps, not a parent as a buyer. The word does double duty in this product, and since the storefront's buyers are mostly literal parents, a column header reading "Parent" on a sales report is going to be misread by someone. Worth choosing a less loaded label if one exists.
4. **Commission basis** — is commission a percentage of gross sales, of margin, or a per-item rate? The reconciliation block needs to show the right arithmetic.
5. **Storefront accounts versus Roster Bank** — today, storefront orders from non-rostered buyers create Roster Bank captures for the rep to review. Requiring an account at checkout changes what identity data arrives and may change what a capture contains, or whether one is created at all. Worth confirming with whoever owns the roster spec before Phase 6 is built.

**One caveat on this whole brief:** it was written from the feature list, not from the existing Confluence specs for the Reports tab, All Orders, or the storefront. Some of what's above may collide with behaviour already specified there. Worth a read-through against those pages before build.
