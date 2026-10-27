# Claude Design prompt — Multiple store codes

Paste everything below the line.

---

Redesign **store codes** for the Prolook Team Stores workspace. Today a store has exactly one code. It needs many — so a rep can run one code that grants entry, several that unlock different pricing tiers, and others that act as time-limited promotions.

**Build only what this brief specifies. If something seems missing, ask — do not invent it.**

## What exists today, and what's keeping it

The current Store Code panel works. Don't redesign what's listed here — absorb it.

- A single code (e.g. **JAZZ**) with **Copy code**, **Copy join link**, and **Change**
- A join URL. **Note the screenshots show `prolookstores.com/join/JAZZ`; the store slug moves into the path — see *Join links* below**
- A toggle: **Require this code to enter the storefront**. Off means anyone with the link can browse and fill a cart, with an account needed only at checkout
- The code carries a **pricing tier** — *Team / Player, 18% off retail* — with a route out to Pricing Tiers
- On a **League** store, a choice of how shoppers join: **one code for the whole store** (shopper picks their team after signing in) or **a code per team** (each team's code opens the store already scoped to that team, with the org code still working store-wide)
- Per-team codes list each team, its code, its tier, and a Copy action

**Both league join models stay.** They solve a real routing problem and neither replaces what's being added here.

## The shift

A code stops being a property of the store and becomes **a record in a list**. The store has codes, plural, each doing a defined job.

This is the whole design problem: today one code silently does three things at once — it grants entry, it sets the pricing tier, and on a league store it scopes the shopper to a team. Once there are many codes, **what each one does has to be visible on its face**, or a rep can't tell a promo from an access key.

## Vocabulary

Pick **one** name for this object and use it everywhere. Today the panel heading says "Store Code" while the field label reads "ORGANIZATION CODE" on league stores — one concept, two names, and that gets worse with a list. Recommendation: **store code** throughout, with *organization code* retired. If a league needs to distinguish the store-wide code from team codes, say **store-wide** and **team** as a property of the code, not as a different kind of object.

| Use | Never |
| --- | --- |
| Draft / Open / Closed / Archived | Active, On Hold, Paused |
| Players | Members |
| Visible *(a product customers can see)* | Published |

Never build a completion percentage, readiness score, or progress meter.

---

## What a code is

Each code is a row with these properties:

- **The code itself** — short, uppercase. **A code belongs to exactly one store**, league or individual team, and is unique within that store. Nothing is shared across stores: a rep running a league plus its individual team stores creates codes separately for each, and the same string can legitimately exist in two different stores
- **A label** — what the rep calls it. *"Early bird"*, *"Coaches"*, *"Lone Peak 10U"*. The rep needs this far more than the code string; a list of eight codes with no labels is unreadable
- **What it does** — one or more capabilities, below
- **Status** — on or off, so a rep can retire a promo without deleting its history
- **Validity** — optional start and end dates, and an optional redemption limit
- **Usage** — how many times it's been used, as a read-only figure

### Capabilities

A code does one or more of these, chosen when it's created:

| Capability | Effect |
| --- | --- |
| **Grants entry** | Opens the storefront when the store is gated. Irrelevant when it isn't |
| **Sets a pricing tier** | The shopper sees that tier's prices for the whole visit |
| **Scopes to a team** *(League only)* | Opens the store already scoped to that team |
| **Applies a promotion** | A discount applied on top of whatever tier the shopper is on |

A code can combine them — a team code typically grants entry, sets a tier, and scopes to a team. A promo code typically does only the last one.

**Show capabilities as plain-language chips on each row**, not as icons. A rep scanning for "which of these lets people in" should not have to learn a legend.

---

## The codes list

Replaces the single-code panel. Sample shape:

| Code | Label | Does | Tier | Validity | Used | |
| --- | --- | --- | --- | --- | --- | --- |
| **JAZZ** | Store-wide | Entry · Tier | Team / Player 18% | No end date | 412 | Copy · Edit |
| **COACH25** | Coaches | Entry · Tier | Coach 30% | No end date | 18 | Copy · Edit |
| **EARLYBIRD** | Early bird promo | Promotion | — | Ends Sep 14 | 96 | Copy · Edit |
| **UK86T** | 8U Boys · Lone Peak | Entry · Tier · Team | Team / Player 18% | No end date | 24 | Copy · Edit |

- **Copy code** and **Copy join link** on every row. The join link is what reps actually send
- Expired and disabled codes render muted but stay listed with their usage intact — a rep looking at last season's numbers needs to see which code drove them
- Sort and filter by capability, so "show me my promo codes" is one click
- On a league store with per-team codes enabled, **group the team codes** and collapse them behind a count — twenty-two team codes must not bury the four codes the rep actually manages. Keep the existing "16 more in My Team" idea

### The entry gate

**Require a code to enter the storefront** stays as a store-level toggle, with its current copy. What changes is the sentence beneath it: when gated, name **how many codes grant entry**, and link to them. A rep who gates the store and then disables the only entry-granting code has locked everyone out, and the panel should be where they notice.

If gating is on and no enabled code grants entry, say so plainly where the toggle is.

---

## Join links

**The store slug goes in the path.** Codes are unique within a store but not across stores, so two stores can both hold **JAZZ** — and the old `prolookstores.com/join/JAZZ` has no store in it, making it ambiguous the first time two reps pick the same word. *JAZZ*, *HAWKS*, *EAGLES* are exactly the words reps pick.

**New shape:**

```
prolookstores.com/nc-baseball-league/join/JAZZ
prolookstores.com/nc-baseball-league/join/UK86T
```

This keeps codes short and sayable — reps read them aloud at team meetings — while making every link resolve to exactly one store.

- **Copy join link** returns the full URL including the slug, on every row and in the create modal preview
- **The code alone still works** wherever a shopper is already inside the store: the cart's promo field, and a store entry prompt. Only the link needs the slug
- Show the slug in the preview as **read-only context**, visually quieter than the code the rep is choosing. They're picking a code, not a URL

### Changing the store URL breaks every link already sent

A consequence worth designing for. The slug is the store's storefront URL, which a rep can change — and the moment they do, every join link already texted to parents, printed on a flyer, or pasted into a league newsletter stops resolving.

**Warn at the point of changing the store URL**, not here: state how many codes have join links in circulation and that existing links will stop working. Whether old slugs keep redirecting is an engineering decision, but the rep needs to be told either way before they confirm.

---

## Creating and editing a code

A modal. Fields in this order:

1. **Label** first, not the code. The rep knows what they're making before they know what to call it
2. **Code** — with a **Generate** action, uppercase, validated unique within the store, with the full join link previewed live as they type, store slug included
3. **What it does** — the capability checkboxes, each revealing its own settings when ticked: tier picker, team picker, discount amount
4. **Validity** — optional start and end dates, optional redemption limit
5. **Status** — on by default

Deleting a code with usage history should be discouraged in favour of disabling it. If deletion is offered at all, state what happens to the orders placed with it.

---

## Stacking — tiers and promotions are different things

**A promotion is a discount applied on top of a tier.** The two are not the same mechanism and must not share a slot. This is settled, and the design has to express it.

- **Entry, tier, and team scope are identity.** A shopper has exactly one of these in effect at a time. Entering a second such code **replaces** the first, and the storefront says so plainly: *"You're now shopping as 8U Boys · Lone Peak. Prices updated."*
- **Promotions apply at the cart**, like a coupon, on top of whatever tier is in effect
- **Promotions do not stack with each other.** One at a time; entering a second replaces the first and states which is applied

The two kinds of code answer different questions — *who are you* versus *what deal do you have*. Merge them into one slot and entering a promo silently changes someone's prices.

**The cart must show both reductions as separate lines**, never as one combined saving:

```
Retail                 $120.00
Team / Player 18%     − $21.60
EARLYBIRD 10%         − $9.84
──────────────────────────────
Total                  $88.56
```

A shopper who can't see which saving came from where can't tell whether their promo worked, and a rep can't answer them.

**Where codes are entered:**
- **Identity codes** at the join URL or a store entry prompt, as today
- **Promotion codes** in the cart, next to the total, where shoppers expect them

---

## Storefront behaviour

- A shopper arriving via a join link has that code applied automatically, with a visible confirmation of what it gave them — the tier, the team, or both
- A shopper on **Retail** prices with no code sees a quiet, non-blocking prompt that a code unlocks team pricing. Not a modal, not a wall
- An invalid, expired, disabled, or limit-reached code gets a specific message, not a generic failure. *"This code expired on Sep 14"* tells the shopper to ask their coach; *"Invalid code"* makes them think they mistyped
- The tier in effect is visible on product pages and in the cart, so nobody discovers their discount vanished at checkout

---

## Per-code reporting

Once a rep runs four codes, *"which code drove these sales"* is the immediate next question. Two places answer it.

**On the codes list**, each row carries its usage count and the revenue attributed to it. That's enough to see at a glance that EARLYBIRD pulled 96 redemptions and COACH25 pulled 18.

**In the sales breakdown on the Reports tab**, add **Code** as a group-by alongside category, product, buyer, decoration type and brand. Same table, same columns — units, gross sales, fundraising, commission, share of total — grouped by the code in effect on each order. Rows expand to the orders beneath them.

Two rules so the numbers survive contact with a rep:

- **Orders placed with no code are their own row**, labelled as Retail rather than omitted. A group-by that silently drops a third of the orders is worse than no group-by
- **An order can carry both a tier code and a promo code**, so it belongs to two rows. State the attribution rule on the report rather than leaving a rep to discover their totals don't add up. Recommendation: attribute the order to its **identity code**, and report promotions separately as a discount line

---

## Edge cases to design

- **A store with one code** — the common case, and it must not feel heavier than today's single panel. One row, no grouping, no filters
- **Gating on, no entry code enabled** — flagged at the toggle
- **A promo whose window hasn't opened yet** — listed as scheduled, with its start date
- **A team code for a team that was deleted** — the code can't scope to nothing
- **A shopper with a tier code who enters a promo code** — both apply, and the cart shows both lines
- **Per-team codes generated in bulk** when a league enables that mode — existing behaviour, now feeding the same list
