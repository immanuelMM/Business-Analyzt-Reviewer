# Claude Design prompt — Bundle report & per-code reporting

Two additions to the Reports tab. Build them in order.

Paste everything below the line.

---

Add two reports to the Prolook Team Stores **Reports tab**, in the store workspace: a **bundle report** card, and **per-code performance** on the sales report.

**Build only what this brief specifies. If something seems missing, ask — do not invent it.**

## Vocabulary

| Use | Never |
| --- | --- |
| Submit *(orders go to the factory)* | Approve |
| Draft / Open / Closed / Archived | Active, On Hold, Paused |
| Players | Members |
| Visible *(a product customers can see)* | Published |

Never build a completion percentage, readiness score, setup checklist, or progress meter. Sales counts are facts about what customers did and belong on these reports; scores about how well a rep is doing do not, and were deliberately removed from this product.

---

# Part 1 — Bundle report

## Where it lives

A card on the **Reports tab**, sharing the row with the team gear card — two cards side by side, equal weight. They answer adjacent questions and reps will read them together.

## What it's for

How many of each bundle have sold, and which. That's the whole brief, and the card shouldn't grow past it.

But it carries a second job that shapes the design. **For a team without a roster, the bundle count is how a rep knows whether everyone has their gear.** A coach who knows there are 22 players on the team watches for 22 sales of the team gear bundle and treats that as done.

**The system does not track that target.** There's no field for team size, no goal to set, no progress bar. The rep holds the number in their head and compares. The card's job is to make the comparison effortless — a large, unambiguous count of bundles sold — not to model the comparison.

## The card

Per bundle:

- **Bundle name**
- **Units sold**, as the prominent figure — this is the number the rep is reading against the one in their head
- **What's inside it** — the constituent items, visible without opening anything. A rep looking at "Team Gear Pack · 18 sold" needs to know whether that pack includes the jersey
- **Revenue**, secondary to the count

Order by units sold, descending. Cap the card at the top few bundles with a link into the full view when there are more. If the store has no bundles, the card doesn't render at all.

## Name the limit of the inference

A count is not the same as knowing who ordered, and the design should be honest about the gap. Two orders from one family, a parent buying for two siblings, or a coach picking one up all make 22 sales without meaning 22 players are covered.

A short line beneath the card does it:

> Counts sales, not players. Add a roster to see exactly who's ordered.

That line is also the right place to offer the roster, because it sits at the exact moment the rep is making an inference the roster would replace with a fact. **Offer it as an upgrade, never as a correction** — no warning icon, no incomplete state, no empty-state illustration. Rosters are optional in this product and a rep working from counts is working legitimately.

When the store **does** have a roster, the two cards divide cleanly and the card should say so: **bundles tell you how many, the roster tells you who.** Point to the team gear card for the by-name view.

## Drill into the bundle

Clicking through opens a fuller view — the same shape as the team gear detail page. For each bundle:

- Its contents, itemised
- **Item-level sales within the bundle**, so a rep can see how the jersey inside the pack performed, not only the pack
- The orders behind it — who bought, when, and which size or variant where that applies

Visibility into what's inside a bundle is wanted in both places: a summary of contents on the card, the full item-level breakdown here.

## League stores

Bundles sell across teams, so the card totals store-wide and breaks down **per team** on expansion. A league rep's question is usually "which team is behind", which a store-wide total can't answer.

## Keep it reconciled with the team gear card

**Bundle sales must also count in the team gear card.** A bundle containing required gear satisfies that requirement, and two cards sitting side by side that disagree by the number of bundles sold is the fastest way to lose a rep's trust in both.

---

# Part 2 — Bundles and codes on the sales report

## Bundles on the sales report

**A bundle appears as its own line: the bundle name and the amount**, expandable to the item sales inside it. The rep sees the unit they actually sold, and can open it to see what that unit was made of.

This also settles how the numbers reconcile, and the rule needs stating on the report:

**A bundle is the unit of sale. Its items are the unit of attribution.**

- **Grouping by product or by bundle** → the bundle is the row. Expanding reveals its items and their individual sales
- **Grouping by category, brand, or decoration type** → bundles **decompose**, because a single bundle can hold items from several categories and brands. Those figures come from the items inside, and the report should label them as such so a rep doesn't wonder why their bundle vanished

Without that rule, a bundle holding a jersey and a hoodie either double-counts across two categories or disappears from both. Say which is happening, where it's happening.

## Per-code reporting

The sales breakdown already gains **Store code** as a group-by. This is the dedicated view, for the questions that generic table can't answer.

### Two kinds of code, two different questions

Don't put them in one table. They're read for opposite reasons.

**Identity codes** — the ones that grant entry, set a pricing tier, or scope to a team. The question is *where did my shoppers come from*.
Columns: code, label, tier, shoppers, orders, gross sales, fundraising, commission.

**Promotion codes** — discounts applied at the cart. The question is *what did this cost me and what did it bring in*.
Columns: code, label, discount, redemptions, orders, gross sales, **discount given**, net sales, commission.

**Discount given is the number a rep opens this report for.** A promo that drove $4,000 in sales and gave away $900 is a different story from one that drove $4,000 and gave away $200, and a table showing only gross hides it.

### Rules that keep the totals honest

- **Orders with no code are their own row, labelled Retail.** A report that silently omits a third of the orders is worse than no report
- **An order can carry both an identity code and a promo code.** Attribute the order to its **identity code**; report the promotion separately as a discount. State this rule on the report rather than letting a rep discover their rows don't sum
- Every row links to the orders beneath it. Every total traces to rows

### Promo codes need their lifecycle visible

A promo with a window or a redemption limit is read differently from an open-ended one. Show inline on the row: **days remaining**, and **redemptions against the limit** where one is set.

Expired and disabled codes stay in the report with their history intact. A rep reviewing last season needs to see what the early-bird promo did, long after it stopped working.

### Period

Inherit the report's month picker rather than adding a second one. A code's lifetime total is also worth seeing — offer a lifetime toggle on the code row, clearly labelled, rather than silently mixing periods in one table.
