---
title: Earnings
confluence_id: 4377968641
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4377968641/Earnings
last_modified: 2026-10-12
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

A rep's read on their own business is scattered. The Overview dashboard answers how the *stores* are performing; the store-level Reports tab answers how *one store* is performing for its team. Neither answers the question a rep actually asks at the end of a month: **how much did I make, and where did it come from?** Commission settles monthly, is split with the organization, and is reduced by refunds on orders placed weeks earlier — so a rep who wants to verify a payout has no way to see the arithmetic. Reps also cannot see which products, which teams, or which store codes are actually producing their commission, which makes it guesswork to know where to push.

#### The Solution

An **Earnings** page at workspace level, sitting in the global navigation alongside Overview and Stores, covering every store on the workspace. A single month selector governs the page. Two tabs divide the question:

- **Commission report** — what was earned, how it splits with the organization, how the rep ranks, and exactly how gross commission became the payable figure.
- **Sales breakdown** — what sold, grouped by category, product, or bundle, and how store codes contributed.

The page reports money. It does not configure it: split rates live in Workspace Settings, store codes live on each store.

### Governing rules

1. **The month selector governs the whole page.** Commission settles monthly, and every figure on both tabs is scoped to the single month chosen in the header. The month persists across a tab switch. The one exception is the Lifetime toggle on Store code performance (Epic G), which is a deliberate local override.
2. **Net commission payable is the reconciling figure.** Gross commission minus refund reversals equals net commission payable, and that number must agree everywhere it appears — the headline card's third stat, the split table's total, the leaderboard row, and the reconciliation in Epic E. If any two disagree the page is wrong, regardless of which is right.
3. **Identity codes and promotion codes do not sum.** They are two different attributions of the same orders. An order that used both appears once in each table. The two tables must never be added together or presented as parts of a whole.
4. **Earnings reports; it never configures.** Split rates are set in Workspace Settings → User Management. Store codes are managed per store under Settings → Store Codes. This page links to those places and changes nothing itself.

### Scope boundary

Three surfaces report money and are easily confused. **Overview** reports portfolio performance — gross revenue and dealer profit across all stores. The store-level **Reports tab** reports one store's performance and the team-side fundraising money. **Earnings** reports the rep's own commission and the sales that produced it. A rep asking "how are my stores doing" belongs on Overview; a rep asking "what am I being paid" belongs here.

### User persona & use cases

**Who is this for?** Reps, for their own commission. Organization admins additionally use it to see every rep in the organization.

**Scenarios encountered** Checking what this month's commission came to and whether it is up or down; verifying a payout against the gross figure and understanding what was deducted; opening a reversal to see which order was refunded; seeing how commission divides between the organization and themselves; an admin ranking the team and seeing who moved; finding which product categories are actually producing commission; expanding a category to see the individual sellers; checking whether a team's store code or a promotion drove the month; exporting the month for a payroll or accounting conversation.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want one page showing what I earned this month, so that I am not inferring my income from store performance charts.
- As a rep, I want to see gross commission, what was deducted, and the payable figure, so that I can check a payout rather than trust it.
- As a rep, I want each refund reversal itemized and linked to its order, so that I can investigate a deduction I do not recognize.
- As a rep, I want to see how my commission splits with the organization, so that I understand the rate I am working under.
- As a rep, I want twelve months of history at a glance, so that I can see whether a bad month is a trend.
- As an admin, I want every rep ranked by commission, so that I can see how the organization is performing and who is moving.
- As a rep, I want to know which categories and products are producing my commission, so that I can push what works.
- As a rep, I want to see which store codes brought shoppers in and what promotions cost, so that I can judge whether a discount paid for itself.
- As a rep, I want to export a month, so that I can take it into a payroll or accounting conversation.

##### Epic A — Page frame

- **Placement.** Earnings is a top-level item in the workspace navigation, alongside Overview and Stores. It is **workspace-scoped** — every store the rep has, not a single store.
- **Header.** The title is followed by a line stating the page covers every store on the workspace, that commission settles monthly, and that the selected month applies to everything below.
- **Month selector.** A single-month dropdown at the header's right. It governs both tabs per Governing rule 1 and persists when the rep switches tabs.
- **Tabs.** A segmented control offering **Commission report** (default) and **Sales breakdown**.
- **OPEN — to be confirmed:** the default month on load — the month in progress, or the last fully settled month. Since commission settles monthly, an in-progress month shows a figure that is not yet payable, and the distinction should be visible to the rep either way.
- **OPEN — to be confirmed:** whether the month selector offers a lifetime or multi-month range. The only such affordance in the approved design is local to Store code performance.

##### Epic B — Commission earned

The headline card for the Commission report tab.

- **Headline figure:** **gross** commission for the selected month, with the month named beside the card title.
- **Month-over-month delta:** a signed, coloured percentage naming the prior month and its value in full, so the comparison is legible without a tooltip.
- **Three supporting figures:** **Gross Sales**, **Fundraising Raised**, and **Net Commission Payable**, the last annotated *after reversals*.
- **Twelve-month series:** a compact bar chart labelled **Net commission · last 12 months**, the selected month emphasised and value-labelled, with a dashed placeholder bar for the upcoming month so the series does not appear to end abruptly.
- **The headline and the series are different measures.** The headline is gross commission; the series is net. In the approved design this reads as $2,426 above a bar labelled $2,267 for the same month. Both labels must stay explicit, or the card will be read as internally inconsistent.
- **OPEN — to be confirmed:** whether the month-over-month delta compares gross to gross or net to net. The headline is gross, so gross-to-gross is the consistent reading, but it should be stated.

##### Epic C — Organization vs. rep split

- **Purpose:** how net commission divides between the organization and the rep. A subtitle states that split rates are set in **Workspace Settings → User Management**, per Governing rule 4.
- **Columns:** Rep, Gross Sales, Fundraising, Organization Share, Rep Share, Total Commission. Sorted by total commission, descending.
- **Rep cell:** carries a **You** badge on the current user and the rep's **split rate** as a badge (e.g. 40/60, organization first).
- **Visibility:** **admins see a row for every rep in the organization; every other rep sees only their own row.**
- **Total row** is labelled as reconciling to net payable. Note that this label means different things in the two views — for a single-rep view it is that rep's net payable, for an admin it is the organization's total net commission — and the label should make the distinction rather than relying on the reader to infer it.
- **Exports:** CSV and PDF, each stamped with the selected month.
- **OPEN — to be confirmed:** this is the only section offering PDF. Confirm whether that is deliberate (a payroll-facing artifact) or an inconsistency.
- **OPEN — to be confirmed:** how a split rate that changes mid-month is handled — applied to the whole month, or effective-dated and prorated.

##### Epic D — Rep leaderboard

- **Purpose:** every rep in the organization ranked by net commission for the selected month, with the viewer's own position stated in the subtitle (*you're #1 of 12*).
- **Columns:** rank, rep, share of organization commission (proportional bar plus percentage), gross sales, orders, rep share with the split percentage shown, and net commission.
- **Rep cell:** a **You** badge on the current user, a signed **rank movement** indicator against the prior month, and the rep's store count.
- **Ranking treatment:** the top three ranks are visually distinguished from the rest.
- **Footer:** an organization total row stating the rep count alongside totals for gross sales, orders, rep share, and net commission.
- **Export:** CSV, stamped with the month.
- **OPEN — not yet decided, and blocking:** who can see this section. Two candidate models are in play and the design currently asserts the second: **(a)** admins only, with the section hidden entirely from everyone else; **(b)** all reps see it, with non-admins seeing only their own row — which is what the shipped subtitle says. The decision is not only a filter. Under (b) the share-of-organization-commission column and the organization total row expose organization-level earnings to every rep, which may be the reason to prefer (a). Whichever is chosen, the subtitle copy and the *Admin view · all reps* badge must be brought into line with it.

##### Epic E — How gross becomes payable

- **Reconciliation, left side:** gross commission, then **refund reversals** with a count, then **net commission payable** as the resolved total. This is the arithmetic behind Governing rule 2, shown rather than asserted.
- **Itemized reversals, right side:** every reversal listed, each row carrying the **order identifier as a link to that order**, a descriptor, the item, an optional **partial** marker where only part of the order was refunded, and the negative amount.
- The count beside "refund reversals" must equal the number of rows listed, and the rows must sum to the deduction.
- **OPEN — to be confirmed:** what the name on each reversal row refers to — the buyer, the rep whose order it was, or the store. The seeded design reuses rep names from the leaderboard, so it cannot be read off the design.
- **OPEN — to be confirmed:** behavior when a month carries more reversals than the card can show — scroll, paginate, or truncate with a link to a full list.
- **OPEN — to be confirmed:** whether a refund on an order from a *prior* month reverses against the month the order was placed or the month the refund occurred. This determines whether a settled month can change retroactively.

##### Epic F — Sales breakdown

- **Purpose:** what sold, and what it produced. A subtitle restates the selected month, confirms it matches the Commission report tab, and states that **refunded amounts are already taken out**.
- **Group by control:** **Category** by default, with **Product** and **Bundle** as alternatives.
- **Columns:** the grouping dimension, Units, Gross Sales (default sort, descending), Fundraising, Commission, and Share of Total as a proportional bar plus percentage.
- **Expansion:** every group row expands to reveal the individual items within it, so a rep can go from "hoodies are 26% of the month" to which hoodie.
- **Total row** closes the table at 100% of share.
- **Bundle attribution.** A bundle is the unit of sale; its items are the unit of attribution. Under Category and Product grouping a bundle is split into its items, so a bundle holding a jersey and a hoodie counts under both categories and **units are item units, not bundle units**. Grouping by Bundle shows bundles whole. This rule must be stated in the UI, because the unit count is otherwise unexplainable against order counts elsewhere on the page.
- **Export:** CSV, stamped with the month.

##### Epic G — Store code performance

One card carrying two tables that describe the same orders from different angles.

- **Attribution rule.** Orders are attributed to the **identity code** that let the shopper in, or to **Retail** where there was none. A promotion applied to the same order is reported separately as a discount. Per Governing rule 3, an order using both appears once in each table and the two tables do not sum.
- **Period control.** A local toggle between the selected month and **Lifetime**, plus CSV export. **OPEN — to be confirmed:** this is the page's only override of the global month selector. Confirm it is intended, and whether Lifetime also re-scopes the CSV.

**Identity codes — where shoppers came from**

- **Columns:** Code · Label, Period, Tier, Shoppers, Orders, Gross Sales, Fundraising, Commission. Rows expand.
- **Retail** is a synthetic row representing orders placed with no code, labelled as public storefront prices.
- **Tier** names the audience and its rate — Retail, Team / Player, Coach & Staff — with the discount percentage shown alongside.
- **Rows are code × store.** The same code string appears once per store that uses it, distinguished by the label line naming the store. A reader must not treat repeated code strings as duplicates.
- A total row stamped with the period closes the table.

**Promotion codes — what each cost and what it brought in**

- **Columns:** Code · Label, Period, Discount, Redemptions, Orders, Gross Sales, **Discount Given** (negative and visually distinct), Net Sales, Commission.
- **Status badges.** A scheduled code shows its start date; a disabled code shows an off state and is visually de-emphasised. **Expired and disabled codes remain listed with their history** rather than disappearing, so a rep can see what a retired promotion did.
- Codes that have not yet run show zeroes across the row rather than being hidden.
- A footer states that refunded amounts are already removed and that codes are managed on each store under **Settings → Store Codes**.

#### Acceptance Criteria

**Page frame**

- Given the Earnings page, when the rep changes the month, then every figure on the active tab re-resolves to that month.
- Given a month is selected, when the rep switches tabs, then the month carries over and the new tab reports the same month.

**Commission**

- Given any month, when the page renders, then net commission payable is identical in the headline card, the split table total, the rep's leaderboard row, and the Epic E reconciliation.
- Given the Epic E card, when it renders, then gross commission minus the listed reversals equals net commission payable exactly, and the reversal count matches the number of rows.
- Given a reversal row, when the rep clicks its order identifier, then that order opens.
- Given a non-admin rep, when the split table renders, then it contains only their own row.
- Given an admin, when the split table renders, then it contains a row for every rep in the organization.

**Sales breakdown**

- Given the Sales breakdown tab, when it loads, then rows are grouped by Category and sorted by gross sales descending, and the share column totals 100%.
- Given a group row, when the rep expands it, then the individual items within that group are listed.
- Given a bundle containing items in two categories, when grouped by Category, then it contributes to both, and the units column counts item units.
- Given the same month on both tabs, when the rep compares commission figures, then the Sales breakdown commission total equals net commission payable.

**Store codes**

- Given an order placed with no identity code, when the identity table renders, then it is attributed to the Retail row.
- Given an order using both an identity code and a promotion code, when both tables render, then it appears once in each and neither table claims to be a complete accounting of the month.
- Given a disabled or expired code, when the promotion table renders, then it remains listed with its historical figures.
- Given the Lifetime toggle, when it is selected, then only this card re-scopes; the rest of the page stays on the selected month.

### Metrics & Success Criteria

- Monthly active reps on Earnings, and share returning at month close — the page should become the settlement ritual
- **Share of reps opening "How gross becomes payable"** — the card exists to make deductions checkable; if nobody opens it, either trust is already high or the card is not findable
- **Commission disputes raised to support, before and after launch** — the clearest read on whether showing the arithmetic reduces the need to ask
- Reversal order-link click-through — whether reps actually investigate deductions
- CSV and PDF export usage by section
- Group-by distribution across Category, Product, and Bundle — whether three groupings earn their place
- Share of orders attributed to Retail versus an identity code — a read on whether store codes are being distributed at all
- Admin engagement with the leaderboard, once its visibility model is settled

---

### Dependencies & Technical Constraints

Requires a **monthly commission settlement** producing, per rep per month, gross commission, refund reversals with their underlying orders, and net commission payable, with at least **twelve months of history** for the trend series. Reversals must be linkable to order detail, and the treatment of a refund against a prior month's order must be defined before build (Epic E) because it determines whether a settled month is immutable.

Split rates are read from **Workspace Settings → User Management** and must be resolvable per rep for the month being reported, including the mid-month change case. A **role model** distinguishing organization admin from rep gates Epic C's row set and Epic D's visibility; both must be enforced server-side, since the organization totals in those sections are the sensitive part and hiding a table client-side does not protect them.

The Sales breakdown requires a **category, product, and bundle taxonomy** with **bundle decomposition** — attributing a bundle's component items to their own categories while retaining the bundle as a sellable unit. Store code performance requires identity codes carrying tier and rate, promotion codes carrying discount, status, and schedule, both scoped per store, and both aggregated per code × store rather than per code.

**OPEN — not yet decided, and blocking:** the page reports two different gross sales figures for the same month. The Commission report tab shows one value across the headline card, the split table, and the leaderboard; the Sales breakdown and the identity-codes total show a lower value, around $1,430 less in the seeded month. The Sales breakdown states refunded amounts are already removed, which would explain the gap — but if so, the Commission tab is labelling a pre-refund figure with the same column name, and a rep comparing the two tabs will read it as a defect. Either the two must be reconciled to one definition, or each must be labelled to say which it is.

**OPEN — to be confirmed:** how Earnings reconciles against the Overview's *Revenue & Dealer Profit* chart. Both claim to report across all of a rep's stores, and for the same seeded month the two surfaces report materially different revenue. Some of this is known seed-data noise, but the relationship between **dealer profit** (revenue minus COGS, platform fee, sales tax, and fundraising) and **commission** is not defined anywhere, and a rep will expect the two pages to agree or to explain why they do not.
