---
title: Store Home (Home Tab)
confluence_id: 4308860929
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4308860929/Store+Home+Home+Tab
last_modified: 2026-10-13
pulled: 2026-10-26
---
### Executive Summary & Problem Statement

#### The Problem

The workspace tells a rep where things *are*, never what to *do*. Five tabs each hold their own queue, and every one of them is a pull: the rep has to open Orders to discover four orders are sitting unsubmitted, open My Team(s) to discover three Roster Bank captures are uncommitted, open Products to discover a bundle went Incomplete, and open Settings to discover the ship-to address they cleared is blocking freight. Nothing surfaces the union of those queues, so the cost of missing one is paid by a parent who cannot order or a container that misses MOQ.

The Store Setup Guide was written for a different problem and deliberately does not solve this one. It is orientation — explanatory, one-time, dismissible, and explicitly *not* a checklist or a progress tracker ([Tabbed Store Dashboard](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153409540/Tabbed+Store+Dashboard), Epic B). A rep on their twentieth store, mid-window, with a live storefront, has no orientation problem and a substantial *operational* one.

There is also no continuity between sessions. A rep who is mid-way through re-pricing a category, or halfway through committing Roster Bank captures, closes the tab and comes back to the workspace root. The work is saved; the *place* is not. On a League store with divisions, teams, and a large catalog, re-finding the thing you were editing is a real tax.


Usability testing produced four findings that this page exists to answer. They are quoted rather than paraphrased because the phrasing is the finding.

- **The workspace already has a landing surface, and it is empty.** *"I literally keep coming here and I'm like, where's everything I've been working on? Because this is the place it keeps going back to."* The tester is describing a place the product returns them to repeatedly that holds no record of their work. This is not a request for a new destination — it is a report that the existing one is doing nothing.
- **There is no instruction at the point of return.** *"It's very like — there's not even instruction here."*
- **My Team(s) is the highest-friction tab by a distance.** *"I don't know if you guys notice how often I got stuck on my teams. Like that was the biggest piece for me."*
- **The core problem statement, verbatim.** *"I don't know what to do. I don't know where to go from here. There needs to be more guidance."*

The last quote contains two distinct asks and they map onto the two working sections of this page: **"I don't know what to do"** is answered by **Needs your attention**, and **"I don't know where to go from here"** is answered by **Pick up where you left off** and by every deep link on the page.

**The critical reading is that "there needs to be more guidance" is not a request for instructional content.** The tester who said it had unresolved work in the store — they could not see it. The answer is to surface state they already own, not to write more explanation.


#### The Solution

A **Home** tab, first in the workspace navigation, with two working sections and a summary rail.

**Needs your attention** is a prioritized, finite list of *resolvable conditions* — each one an existing state defined by an existing spec, each one carrying a single action that deep-links to the surface that owns it. It is a **derived read layer**: it computes nothing, stores nothing, and enforces nothing. Every condition it can show is enumerated in Epic C, and a condition may not appear on Home unless it is defined by a published MVP spec.

**Pick up where you left off** is a per-rep, per-store list of the rep's own recent authoring actions, each with a deep link back to the surface where it happened. It reports **location, not completion** — the same honesty constraint the Setup Guide's progress bar carries.

**In your store** is a summary rail of counts and their attention overlays, giving the rep the shape of the store at a glance and a second route into each tab.

Three further panels answer *"where's everything"* for the things reps look for most: a **Team Managers** list they can add to, a **brand assets** panel holding the team logo and colors, and — on League stores — a **structure directory** of divisions and teams that routes into My Team(s).

Home is **never a gate**. It blocks nothing, requires no acknowledgement, and no store action depends on having visited it.


---


### Governing rule 1 — Home is derived, and derives only from published state

This is the load-bearing constraint on the entire page and every future addition to it.

- **No new state.** Home persists nothing about the store. It reads existing records and renders them. The one exception is the rep-scoped resume trail in Epic D, which is activity metadata about the rep, not state about the store.
- **Home may *****host***** an existing authoring component; it may never *****define***** one.** This is the clause that permits the Team Managers panel (Epic F) and the brand assets panel (Epic G) to be editable without breaking the rule above. Where Home offers an edit, it opens **the same component, writing the same persisted field, under the same validation** as the surface that owns it. Home is a second doorway, not a second implementation.
    - **The precedent is everywhere in this product, and the pattern has a name in the specs: one value, two surfaces.** The structure editor is one component with two hosts (My Team(s) and League creation Step 2). The Add Products page is identical at Step 2 and on the Products tab. The ship-to destination address is one field shared by Step 1, the Fulfillment Method card, and the primary manager record — *"never a wizard-local value copied forward."* The announcement message is written by Step 1 and by Settings against the same store-level field with *"no creation-time copy."*
    - **Three tests every Home-hosted editor must pass.** It writes the field the owning spec owns, with no Home-local copy. It carries the owning spec's full validation and every consequence disclosure, unshortened. And a change made on Home is indistinguishable, afterward, from the same change made on the owning surface.
    - **Where a component cannot pass those tests, Home routes instead of hosting.** This is why Epic H renders the League structure read-only rather than embedding the structure editor: that editor already has two hosts and a documented rule that any change to it must be assessed against both. Adding a third host is a real cost, and a directory does not need one.
- **No second computation.** Every count, threshold, and condition on Home is read from the surface that owns it. Home must not recompute "below MOQ", "days left", "n to submit", or any figure the Orders tab, the Active Order Window card, or the Reports tab already resolves. Where Home and a tab disagree, the tab is right and Home has a defect.
- **No new vocabulary.** Home uses the label the owning spec uses. A rep must never learn a second name for a thing because they read about it on Home first. (This is the same constraint the Setup Guide carries under *Naming* in Tabbed Store Dashboard, Epic B, and for the same reason: Home is a high-traffic first-exposure surface.)
- **No enforcement.** Home never blocks, never gates, and never becomes a prerequisite. Launch readiness is enforced by the launch gate ([Store Status & Lifecycle](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4168908810/Store+Status+Lifecycle), Epic A); freight readiness by the freight gate ([Order Management](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153933836/Order+Management+Orders+Tab), Epic B). Home *describes* those gates in the same language and must not duplicate, pre-empt, or contradict them.
- **Additions are amendments to Epic C, not to the component.** A new attention condition is added by registering it in the Epic C catalogue with its owning spec, tier, trigger, and resolution route — the way a new modal is registered in [System Modals & Toasts](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802806/System+Modals+Toasts). A condition with no owning spec is not shippable.

### Governing rule 2 — Severity tiers

Home reuses the severity model already established for the modal layer in [System Modals & Toasts](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802806/System+Modals+Toasts), narrowed to three tiers and re-expressed for a persistent list rather than a modal. Tier drives ordering and treatment; it is a property of the condition, not of the rep's mood.

| Tier | Definition | Treatment | Ordering |
| --- | --- | --- | --- |
| **Blocking** | Buyers, orders, or fulfillment are stopped right now. Someone outside the workspace is already affected. | Red rail; action is a primary button | First, always |
| **Action** | Rep work is queued. Nothing is broken, but something is waiting and has a cost if it keeps waiting. | Blue rail; action is a secondary button | Second |
| **Informational** | Time or state the rep should know. There may be no wrong answer. | Neutral rail; action is a link or is absent | Last |

- **Tier is fixed per condition, not per store.** A condition does not escalate because it has been there a while. Where urgency is genuinely time-derived, it is modelled as **two separate conditions** with different triggers (see C-14 and C-15), so each has its own copy and its own tier.
- **Home's rail palette is red, blue, and neutral. Amber is not used on Home at all.** Decided. Two consequences follow, neither an objection.
    - **Blue already means Draft.** The status badge palette is **Draft (blue) / Open (green) / Closed (amber)** ([Store Status & Lifecycle](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4168908810/Store+Status+Lifecycle), Epic G). A blue Action card sitting near a blue Draft chip in the workspace header is the case to look at.
    - **Amber means "gap" at the destinations Home routes to, and that mismatch is accepted.** A team with no products renders **amber** on the My Team(s) canvas (Roster Management, Epic 6), and an unactivated invite shows an **amber** dot (Store General Settings, Epic A2b). C-07 and C-24 are therefore blue on Home and amber on arrival. The destinations are not being changed. What Home must never do is introduce a fourth colour of its own.
- **A Blocking condition always names who is blocked.** "Customers can't order this yet", "pending orders can't be submitted" — the consequence, not the internal state.

### Governing rule 3 — Guidance without a checklist

*"There needs to be more guidance"* is how this product got a permanent setup checklist the first time, and how that checklist then got removed. The original guide sat permanently in the workspace tracking completion, which — in the owning spec's own words — *made a one-time orientation problem into permanent furniture, and implied the store was incomplete long after it was fine.* Its replacement over-corrected into a wall of text testers described as having too many words. Home is the third attempt at the same underlying request, and it will fail the same way unless the distinction below holds.

**Guidance on Home means telling the rep what is true about their store right now. It never means telling them what a good store looks like.**

| Home does this | Home never does this |
| --- | --- |
| Reports a condition that currently holds | Lists steps that have not been taken |
| Names the consequence of that condition | Scores, ranks, or grades the store |
| Routes to the surface that resolves it | Implies a store is incomplete when it is fine |
| Says plainly when nothing needs the rep | Manufactures items to avoid an empty list |
| Explains what a tab is *for* when the rep lands there with nothing pending | Tracks whether the rep has visited a tab |

- **Every item on Home is falsifiable.** A card is on the page because a query returned a row. Remove the row and the card goes. Nothing on Home is an opinion about the store's quality, and nothing persists once its underlying state changes (Governing rule 1).
- **An empty attention list is the success state, not a gap to fill.** A rep with a well-run store mid-window should see nothing. The temptation to fill that space with tips, checklists, or "next steps" is exactly the pressure that produced the removed checklist, and it is prohibited.
- **Orientation content stays where it lives.** Explanations of what the Stock Vault is, what Team Required means, or how a product reaches the storefront belong to the Setup Guide, which is reopenable from Home (Epic B). Home links to it; Home does not reproduce it.
- **There is no first-visit-per-tab hint.** A one-line "what this tab is for" statement on an empty attention list was considered and **cut**: it would require per-rep per-tab visit state — the only store-adjacent state Home would hold beyond the recent-work trail — and it is the seed of a checklist. Reassess against the empty-list metric if the empty state proves too bare.


---


### User persona & use cases

**Who is this for?** The store owner (rep) operating a single store, in any lifecycle state.

**OPEN — to be confirmed, and it is not a question about whether the Home tab is conditional:** whether the **Team Manager Portal** gains an equivalent surface. That portal is not the store workspace and does not render the six-tab navigation at all — it is specified as exactly two areas, Reporting and Rosters, scoped to one store ([Store General Settings](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab), Epic A2b). So the question is *"does the portal get a third area"*, which is a separate scope decision, not a rule about this tab. Recommendation: **no, this version.** Almost every Epic C condition resolves to a surface a manager cannot reach, so a manager-facing equivalent would list actions they are not permitted to take. Confirm before build.

**Scenarios encountered** Landing back on the workspace for the fourth time in a session and needing to see the work already in progress; opening a store and not knowing which of five tabs the next action lives behind; returning to a League store and needing to get back to the one division of eleven that was mid-edit; getting lost inside My Team(s) between the canvas, a division, a team, its roster, and the Roster Bank, and needing a route back to the last place that mattered; being an experienced rep for whom the Setup Guide will never auto-present again and having no other in-product orientation; opening a store mid-window and needing to know what is waiting; returning to a store after a week away; discovering that pending orders cannot be submitted because a division has no manager assigned; finding out that a bundle dropped off the storefront when its second item was removed; noticing that six rostered players still have not ordered required gear with the window closing; realizing a decorated product never became visible because its renders were still processing; picking back up a half-finished re-pricing pass on the Fan Gear category; coming back to a League store and resuming the division whose teams were being assigned products; entering a Draft store and being told the one thing standing between it and launch; entering a closed store and being routed to the Close Report; opening an Archived store and seeing a read-only summary with no actions offered.


---


### Functional Requirements & Core Workflows

#### User Stories

Stories marked **\[UT\]** come directly from the testing findings above and should not be cut without revisiting them.

- **\[UT\]** As a rep returning to the workspace, I want the place the product keeps landing me on to show me what I have been working on, so that arriving somewhere is not the same as arriving nowhere.
- **\[UT\]** As a rep, I want to know what to do next without asking anyone, so that "I don't know where to go from here" is not how a session starts.
- **\[UT\]** As a rep, I want that answer to be about my actual store rather than a generic setup lecture, so that guidance is worth reading on my twentieth store as well as my first.
- **\[UT\]** As a rep working in My Team(s), I want to get back to the division, team, or roster I was in, so that a deep structure is not re-navigated from the top on every visit.
- **\[UT\]** As a rep who has been oriented once already, I want help that is still there on my fifth store of the same type, so that the one-time guide having already fired does not leave me with nothing.
- As a rep, I want one place that tells me what is waiting on me across all five tabs, so that I am not opening each one to find out.
- As a rep, I want the thing that is actually blocking buyers ranked above the thing that is merely untidy, so that I fix the expensive problem first.
- As a rep, I want each item to take me straight to where I fix it, so that reading about a problem and solving it are one motion rather than two.
- As a rep, I want the list to be honest about being finite — if there are only two things, I want to see two things, not two things and eight suggestions.
- As a rep, I want an empty list to say so plainly, so that "nothing needs me" is information rather than an absence.
- As a rep, I want to be returned to the work I was doing last session, so that continuity is not something I reconstruct by hand.
- As a rep, I want that trail to be mine, so that another rep's edits on a shared store are not presented to me as my own unfinished work.
- As a rep on a Draft store, I want to know the single thing standing between me and launch, so that pre-launch is one clear step rather than a scavenger hunt.
- As a rep, I want the counts on Home to match the counts on the tabs exactly, so that I trust Home enough to stop checking behind it.
- As an experienced rep, I want Home to stay out of my way when there is nothing to do, so that a hub does not become a chore.


##### Epic A — The Home tab & workspace navigation

- **Sixth tab, first position.** Given a rep opens a store workspace, when the navigation renders, then it presents six tabs in order: **Home**, **My Team(s)**, **Products**, **Orders**, **Reports**, **Settings**. Home is first.
- **Home is a permanent tab, on exactly the same footing as the other five.** It is always present in the navigation, in every store state (Draft, Open, Closed, Archived), on both store types (Individual Team, League), and on both distribution formats (pop-up, always-on). It is **never hidden, never disabled, never conditional, and never removed** — there is no store configuration in which the workspace has five tabs. A rep who learns Home is there learns it once.
    - **What varies is the content inside two of its sections, not the tab.** The precedent is the Settings tab: it carries seven sections, one of which (*Catalog & Decoration*) renders only when a third-party vendor is enabled — and the Settings **tab** is permanent regardless. Home has the same shape. Every store-state and store-type rule in Epic C governs **which cards populate one section**, exactly as the vendor flag governs one Settings section. None of it reaches the tab.
    - **The tab's structure is stable too.** The summary rail (Epic E) always renders, including at zero. The attention section (Epic C) always renders, including when it has nothing to report. Only the resume trail (Epic D) can be absent, and only because an empty trail carries no information at all.
- **The five existing tabs are unchanged.** Home composes their state; it takes nothing from them and moves nothing into itself. Every tab's contents remain owned by its own spec.
- **Tab count is no longer fixed at five.** The Tabbed Store Dashboard shell must be amended — see Appendix A. The shell owns the tab set; it does not own Home's contents, exactly as it does not own the Settings tab's section list.
- **Attention badges on tab labels.** Given one or more Epic C conditions resolve to a given tab, when the navigation renders, then that tab label carries a dot indicator. The dot reflects **presence, not count** — the count lives in the summary rail and in the attention list, and a number in the nav would be a third place for the same figure to drift.
    - **Blocking-tier conditions produce the dot; Informational-tier conditions do not.** An always-on informational item would leave a permanent dot on Settings and train reps to ignore it.
- **Home is the default landing tab on workspace entry.** Given a rep opens a store workspace, when no deep link specifies a tab, then Home is shown.
    - **The reasoning, stated precisely.** The place the tester kept returning to was the **My Team(s) tab** — they were using a working tab as a de facto hub, and it does not hold a record of their work because that is not what it is for. The decision taken was to build a surface for that job rather than load more of it onto My Team(s). Home is therefore the default because the alternative is reps continuing to treat some other tab as the hub, which is the behaviour that produced the finding.
    - **The quote alone does not carry this.** *"This is the place it keeps going back to"* describes My Team(s), not an empty landing page, so it is evidence that reps want a hub — not evidence about which tab should open first. The default-landing decision rests on the design choice above, and should be revisited against the *sessions where Home is the only tab visited* metric rather than treated as research-backed.
    - **No per-rep or per-store override in v1.** A configurable landing tab was considered and cut: it adds a preference, a settings surface to hold it, and a second entry path to reason about, in exchange for saving one click for reps who would rather start on Orders. Revisit against the *sessions where Home is the only tab visited* metric — if Home is routinely bounced through, the preference is worth building.
    - **Deep links always win.** A link into Orders, a Settings section key, or a My Team(s) division jump-in opens its target directly. Home is the default, not an interstitial.
- **Scope is confirmed as store-level.** The tester meant the **My Team(s) tab**, which sits inside the store workspace — not the Team Stores Landing Page or the Stores directory. So the problem is at store level and this page addresses the right instance of it. A workspace-level equivalent remains out of scope.
- **Home does not replace the workspace header.** The store status chip, the storefront URL, the Preview Store control, and the Setup Guide re-entry point remain in the header where they are specified ([Launch & Status Controls](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802774/Launch+Status+Controls); Tabbed Store Dashboard, Epic B). Home may *echo* header state in its summary strip but is not the authoring surface for any of it.

##### Epic B — Interaction with the two existing auto-presenting sequences

Two paced card sequences already trigger on "first workspace entry": the **Store Setup Guide** (first entry after store creation) and the **Store Close Report** (first entry after a close event) — see [System Modals & Toasts](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802806/System+Modals+Toasts). Home now sits behind both of them, so their ordering has to be stated.

- **Both sequences take precedence over Home.** Given either sequence's trigger condition is met, when the rep enters the workspace, then the sequence presents over Home. Home renders beneath and is fully available on dismissal.
- **They never both fire.** A store cannot be simultaneously newly-created-and-unlaunched and freshly-closed. No ordering rule between the two is required, and none should be built.
- **Home does not re-arm, re-trigger, or replace either sequence.** The Setup Guide's seen-state remains per rep per store type; the Close Report's remains per user per close event. Home reads neither flag and writes neither.
- **Home carries the Setup Guide's re-entry point as a secondary affordance.** Given any store in any state, when Home renders, then a reopen-the-setup-guide link is present. This is a **second entry point to the existing header control**, not a new one — opening from Home behaves identically to opening from the header (lands on card 1, no forced pacing, regardless of seen-state).
- **The Close Report entry point is likewise echoed, not owned.** Given a Closed or Archived store, then Home surfaces a route to the Close Report. Availability, disabled-state copy, and review-mode behavior are owned by [Store Status & Lifecycle](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4168908810/Store+Status+Lifecycle), Epic H.

##### Epic C — Needs your attention: the attention-card catalogue **High-impact**

**Scope of this Epic, stated first because the word "condition" invites a misreading.** A *condition* here is **a store state that causes a card to appear inside the Needs your attention section**. It is a row-level rule about card population. Nothing in this Epic governs whether the Home tab exists, renders, or appears in the navigation — Home is permanent and unconditional (Epic A). Read every rule below as *"which cards are in the list"*, never as *"whether the tab is there"*.

Concretely:

- **The tab always renders.** Six tabs, every store, every state.
- **The section always renders.** Given zero conditions hold, the section is present and says so — an empty list is a first-class state (Governing rule 3), not a hidden section.
- **The cards vary.** A Draft store and a closed League store surface different cards because they are in different states, the same way the Orders tab shows different rows to different stores without the Orders tab becoming conditional.

This Epic is the substance of the feature. Every card Home can surface is registered here with its owning spec, tier, trigger, and resolution route. **A condition not in this table produces no card.**

**Reading the table.** *Trigger* is the state that makes the card appear — expressed against the owning spec's own state, never against a figure Home computes. *Resolves to* is the deep-link target. *Clears when* is the state change that removes the card; there is no manual dismissal (see below).

**The *****Condition***** column is an internal name. It is not card copy, and must never be shipped as card copy.** Rep-facing headlines and detail lines are specified separately in **Epic I**. This distinction matters because it has already cost a design round: a prototype rendered *"Freight routing unresolved — 2 pending containers can't be submitted"* straight from the C-03 row, which describes an internal routing state rather than the action the rep needs to take — a direct violation of the rule two sections up (*a Blocking condition always names who is blocked*) and of Epic I's *name the consequence, not the internal state*. Internal names are for engineers reading the catalogue. Card copy is in Epic I and nowhere else.

###### C1 — Orders

| ID | Condition | Tier | Trigger (owning spec) | Resolves to | Clears when |
| --- | --- | --- | --- | --- | --- |
| **C-01** | Pending orders awaiting submission | Action | ≥1 order in the **storefront → pending** state, not yet submitted to the factory (Order Management, Epic A) | Orders → **Pending Orders** sub-tab | Every pending order is submitted or cancelled |
| **C-02** | A shipping group is below MOQ | Informational | ≥1 pending group below its minimum-quantity threshold (Order Management, Epic B) | Orders → Pending Orders, scrolled to that group | Group reaches MOQ, or is submitted short |
| **C-03** | Manager unassigned on a division or team with pending orders | **Blocking** | ≥1 pending group whose group or team manager is unassigned (Order Management, Epic B; Store General Settings, Epic A3) | Settings → **Distribution & Fulfillment**, with the affected division auto-opened | Every assigned group has a resolved manager |
| **C-04** | No ship-to destination address | **Blocking** | Fulfillment method is Ship to Team Manager **and** the destination address is empty (Store General Settings, Epic A3) | Settings → Distribution & Fulfillment → Fulfillment Method | A verified destination address exists |
| **C-05** | Rostered players missing required gear | Action | ≥1 committed player record with un-ordered Team Required gear (Order Management, Epic C; Roster Management, Epic 2) | My Team(s) → store-wide player view, filtered to incomplete | Every rostered player's required gear is ordered or opted out |

- **C-01 uses the owning spec's verb.** The Orders tab's action is **Submit** — Submit Group, Submit Selected, Submit All — and the state is **Pending**. Home says *"n pending orders to submit"*, **not** *"approve n orders"*. There is no approval step in the product: pending orders are submitted to the factory in batches, deliberately held to hit MOQ, and "approve" would imply a review gate that does not exist while obscuring the MOQ workflow the Pending sub-tab exists for.
- **C-03 and C-04 are separate conditions with one consequence.** Both block pending-order submission, and a store can hold both at once. They are not merged, because they resolve to different controls and a merged card would send the rep to the wrong one.
- **When C-03 suppresses C-08, C-03's copy must carry C-08's substance.** C-03 is the same underlying problem as C-08 with orders now waiting on it, and the suppression rule below means only C-03 renders for an affected division. So C-03 **must name the specific divisions or teams** — *"Division 3 and Division 7"* — not just a count. The prototype did this correctly and it should be treated as required, not incidental: without the names, the rep lands in Distribution & Fulfillment with no idea which rows to fix.
- **C-05 respects the opt-out flag.** A product with *Allow opt-out* enabled counts a player's "I already own this" as satisfied (Products Tab, Epic E), and a player who has opted out is not counted as missing.
- **C-05 does not offer Send Reminder from Home.** Reminders are per player, are disabled for players with no contact channel, and are sent from the player drawer (Roster Management, Epic 2). Home routes; it does not send.

###### C2 — My Team(s)

| ID | Condition | Tier | Trigger (owning spec) | Resolves to | Clears when |
| --- | --- | --- | --- | --- | --- |
| **C-06** | Roster Bank captures awaiting review | Action | ≥1 pending capture banked against any team (Roster Management, Epic 5) | My Team(s) → store-wide **Roster Bank** view | Every capture is committed or dismissed |
| **C-07** | Teams carrying no products *(League only)* | Action | ≥1 team with zero assigned products, direct or via division (Roster Management, Epic 6) | My Team(s) → canvas, or the division's per-team coverage table | Every team carries ≥1 product |
| **C-08** | Divisions or teams with no fulfillment manager *(League, Ship-to-Manager only)* | Action | ≥1 division or team in the "Not assigned" state (Roster Management, Epic 0) | Settings → Distribution & Fulfillment | Every division and team has an effective manager |
| **C-25** | *Retired — folded into C-05* | — | Withdrawn: contact details are absent for most players in the common case, so the card would be permanently present. The warning now rides C-05's detail line | — | — |

- **C-06 is spec-backed as written.** Capture counts are already specified to surface on team cards, division cards, and the stats header (Roster Management, Epic 5) — Home is a fourth read of the same count, not a new one.
- **C-07 mirrors the amber gap state, and must use the same language.** The canvas already renders a team with no products as amber *"No products yet"* rather than blank. Home's card is the store-level roll-up of that same condition.
- **C-08 is the *****unassigned***** precursor to C-03.** C-08 is Action tier because nothing is blocked yet; C-03 is Blocking because an order is now waiting on it. Both may be present. Where both are present for the same division, **C-03 suppresses C-08 for that division** — the blocking card already routes to the same control, and showing both would double-count one problem.

**On the My Team(s) finding — three conditions is probably the right number, and attention cards are probably not the fix.**

Testing named My Team(s) as *"the biggest piece"* of the friction, but only three registered conditions resolve to it, and that is not an oversight to correct. My Team(s) is the most structurally complex surface in the product — divisions, standalone teams, rosters, player records, the Roster Bank, per-roster duplicate-number policy, fulfillment mapping, and League product coverage, across seven Epics — and almost none of that complexity produces a *resolvable condition*. It produces a *navigation* problem. The tester said they *got stuck*, not that they missed something.

That points the fix at Epic D and at deep-link scoping, not at more cards:

- **The resume trail matters more here than anywhere else.** A rep returning to "division 7 → U12 Blue → roster" is four levels deep. Every other tab's deepest resumable target is a product detail page. The resume trail's value is concentrated in this tab, and the trail's row count and expiry should be tuned for the My Team(s) case rather than the Products case.
- **My Team(s) deep links must land scoped, not at the canvas.** C-06's store-wide Roster Bank view, C-07's division coverage table, and every resume row targeting a team must open *at* that entity with breadcrumbs intact — the existing jump-in pattern that auto-opens a targeted division. A card that dumps the rep on the canvas to find the team themselves reproduces the problem it was meant to solve.
- **"Got stuck" meant *****lost*****, not *****confused***** — confirmed.** The tester could not find or return to a place; they were not struggling to understand divisions vs. teams vs. rosters. That settles where the fix belongs: **Epic D and deep-link scoping**, not orientation content. It also means the Setup Guide's league card set is not implicated, and Home is not being asked to explain the structure — only to get the rep back into it. Every My Team(s) route on this page is therefore load-bearing rather than convenient.

**On adding rosters to the attention list — where this landed.**

"Add roster(s) to Needs your attention" had three candidate meanings. After prototype review, only one card remains.

| Reading | Status | Why |
| --- | --- | --- |
| **Rosters with uncommitted Roster Bank captures** | **Registered as C-06** | Real queued work, finite, and it clears |
| **Rosters with players who can't be reached** | **Not a card** — carried on C-05's detail line | Would be permanently present; see below |
| **Teams that have no roster yet** | **Not registered — recommend against** | Reverses a decided direction; see below |

**Why the uncontactable-players card was withdrawn, and the general rule it establishes.** It would have flagged committed player records carrying neither an email nor a phone. Prototype review established that reps and team managers commonly hold contact details for only a minority of their players — so the condition would hold on nearly every store, nearly always. **A condition that is true in the common case is not an attention condition; it is a permanent fixture**, and a permanent card trains reps to skip the list. That is the same reasoning behind Informational conditions not producing navigation dots, and behind Governing rule 3's insistence that an empty list is the success state.

**The underlying problem is real and is handled at the point of use instead.** A rep acting on C-05 lands in the player drawer and finds **Send Reminder disabled** and **Share Team Store Link reduced to copy-only** for players with no contact channel. So C-05's detail line carries the caveat — *"n of them have no email or phone, so a reminder won't reach them"* — which puts the warning exactly where the rep is about to need it rather than on a card they will learn to ignore. C-15 inherits the same caveat, since its remedy is also reminders.

- **This is a finding about the roster feature set, not only about Home.** If most players have no contact channel, then Send Reminder and the share-link flow are less useful in practice than Roster Management assumes, and the metric that tab already tracks — *share of committed records carrying a contact channel* — is the one to look at. Worth raising with whoever owns that spec; it is out of scope here.
- **C-25's ID is retired, not reused.** A future roster condition takes the next free number, so that a reference to C-25 in a ticket or a design file never resolves to something different from what it meant.

**Why "teams with no roster" is the one to be careful about.** Rosters are optional, are never a launch prerequisite, and a team may exist with no roster at all. That is not an oversight — it is the finding the roster-optional work was built on: research with high-value reps found requiring a roster up front *unacceptable*, and the spec's framing is that reps *"do not reject player tracking; they reject the roster as an upfront obligation. The roster's outputs are valuable; the roster as a gate is not."* A card headed "3 teams have no roster" reintroduces the obligation through the back door — a gate in everything but enforcement, on the highest-traffic surface in the workspace. It would also fail the same always-on test C-25 just failed.

**Unchanged:** a roster that is merely *incomplete* is not a condition. There is no known true team size to compare against, so "incomplete" is unmeasurable as well as undesirable.

###### C3 — Products

| ID | Condition | Tier | Trigger (owning spec) | Resolves to | Clears when |
| --- | --- | --- | --- | --- | --- |
| **C-09** | No visible products — store cannot launch *(Draft only)* | **Blocking** | Catalog holds zero visible products (Products Tab, Base flow; Store Status & Lifecycle, Epic A) | Products → Catalog | ≥1 product is visible |
| **C-10** | Products held by the render gate | Action | ≥1 decorated product in **Render pending** whose renders have not landed (Products Tab, Epic H) | Products → Catalog, filtered to those items | Render set exists, or the item is undecorated |
| **C-11** | Render failure — retry required | **Blocking** | ≥1 product whose render generation failed (Products Tab, Epic H) | Products → the affected product's detail page | Render succeeds on retry |
| **C-12** | Bundles in the **Incomplete** state | **Blocking** | ≥1 bundle with a single member (Products Tab, Epic J) | Products → the bundle's detail page → Members | Bundle regains a second member, or is deleted |
| **C-13** | Products with unconfirmed application sizing | Action | ≥1 product whose application-sizing confirmation state is incomplete (Products Tab, Epic F) | Products → the product's detail page → Application Sizing | Sizing is confirmed on every row |
| **C-27** | Products orphaned by a deleted category | Action | ≥1 product whose assigned category no longer resolves, because the category was deleted at workspace level (Product Categories, Epic D; Products Tab) | Products → Catalog, filtered to the affected items | Every affected product is re-filed under an existing category |

- **C-11 is Blocking and C-10 is not.** A render-pending item is in a normal transient state that resolves itself; a failed render never resolves without the rep, and the item can never become visible until it does.
- **C-12 is Blocking because a bundle in this state has already dropped off the storefront** and cannot satisfy the launch gate. This is the tail of the two-member-removal modal (System Modals & Toasts) — the modal warns at the moment of removal, Home is what catches the rep who clicked through it.
- **There is no "size run" concept, and C-13 is not a purchase blocker.** Products carry **size bands** (Youth / Adult) with base costs, and separately an **application sizing** confirmation state per decoration row. Neither gates launch and neither stops a buyer ordering a visible product. So C-13's copy must never claim *"customers can't order these yet"* — the genuine can't-order conditions are C-10 and C-11. If a real size-run gate is ever wanted, that is a change to the Products spec, not a Home card.
- **Conditions enforced at save do not appear here.** Uncategorized products and League TR/TS items with zero team assignment are both blocked at every save surface (Products Tab, Governing rule 2 and Epic L), so neither can exist to be surfaced. Adding a card for a state the system already prevents would imply the enforcement is unreliable.
- **C-27 is Action, not Blocking, and the distinction matters.** An orphaned product stays **visible and purchasable** — nothing is unpublished, no cart is affected, no order is touched. What it loses is its place in the storefront’s category filtering and search, and its grouping in category-based reporting. Buyers are not stopped, so Blocking would overstate it; rep work is queued and degrades the store while it waits, which is Action.
- **C-27 originates outside the store, which is why it needs a card at all.** Every other condition in this catalogue is produced by something happening inside the store the rep is looking at. This one is produced by a workspace-level deletion that may have been performed by a different rep, on a different day, affecting several stores at once. Nothing in the store’s own workflow would surface it.
- **C-27 clears only by re-filing.** Recreating a category with the same name does not reattach orphaned products, because a recreated category is a new record.

###### C4 — Lifecycle & schedule

| ID | Condition | Tier | Trigger (owning spec) | Resolves to | Clears when |
| --- | --- | --- | --- | --- | --- |
| **C-14** | Ordering window closing soon | Informational | Store is Open, has a set window, and the days-left pill is in its urgent range (Store General Settings, Epic E) | Settings → Schedule & Status → **Edit Store Schedule** | Window closes, or the close date moves out of range |
| **C-15** | Window closing with players still missing required gear | Action | C-14's trigger **and** C-05's trigger both hold | My Team(s) → incomplete-player view | Either underlying trigger clears |
| **C-16** | Store is Draft and ready to launch | Action | Store is Draft **and** ≥1 visible product exists (Store Status & Lifecycle, Epic A) | Workspace header → Launch control | Store transitions to Open |
| **C-17** | Store closed — Close Report not yet viewed | Informational | Store is Closed and this user has not seen the report for this close event (Store Status & Lifecycle, Epic H) | Reports → Store Close Report | Report is viewed or dismissed |
| **C-18** | Orders still in production after close | Informational | Store is Closed with ≥1 order not yet shipped (Store Status & Lifecycle, edge cases) | Orders → All Orders | Every order reaches Delivered or is cancelled |
| **C-19** | Order-window coverage gap *(per-team-code scheduling only)* | Action | The Order Window Scheduler's gap detection flags ≥1 day with no team open (Store General Settings, Epic E) | Settings → Schedule & Status → Order Window Scheduler | Gap is closed or accepted |
| **C-20** | Closed with unsettled payment | Action | ≥1 order in the window with an open PO (Store Status & Lifecycle, edge cases) | Orders → All Orders, filtered | PO settles |

- **C-14 and C-15 are deliberately two cards, not one.** It is tempting to merge "store closes in 18 days" with "6 players haven't ordered" into a single urgent card. They are two conditions with two different triggers and two different resolutions; merged, the card carries two verbs and the rep has to pick. C-14 is the clock. C-15 is the clock *plus* a consequence, and only C-15 is worth an Action-tier prompt.
- **C-14 reads the existing urgent threshold; it does not define one.** The Active Order Window card's days-left pill already turns urgent inside the final 7 days (Store General Settings, Epic E). Home reads that same resolved state. **C-14 matches the pill at 7 days. C-15 fires earlier, at 14 days**, because the action it asks for — chasing parents who have not ordered — takes days to land, and a buyer-facing countdown is not built to give the rep lead time.
- **"Extend deadline" is not a Home action, because no such control exists.** Extending a window is an edit to the store schedule in Settings; on a store that has already auto-closed it additionally requires a **Re-open** (Store Status & Lifecycle, Epic D). Home routes to Edit Store Schedule and uses that name. A one-click extend would be a new control in the Settings spec, not something Home can offer.
- **C-18 and C-20 mirror the Close Report's needs-attention strip.** Both are already specified as detail-layer callouts on the Close Report. Home surfaces them for the rep who is back in the workspace weeks after dismissing it.

###### C5 — Settings & access

| ID | Condition | Tier | Trigger (owning spec) | Resolves to | Clears when |
| --- | --- | --- | --- | --- | --- |
| **C-21** | Managers left behind by a team re-bind | Action | ≥1 manager record whose source team is no longer the connected team (Store General Settings, Epic A1) | Settings → General → League/Team Manager Information | Records are kept or removed |
| **C-22** | A left-behind manager still holds portal access | **Blocking** | C-21's trigger **and** that person holds an active or pending invite (Store General Settings, Epic A1, A2b) | Settings → **People & Access** | Access is revoked, or the record is confirmed kept |
| **C-23** | Team Fundraising disabled with items still collecting | Informational | The store's fundraising read resolves to **disabled-with-exemptions** (Store General Settings, Epic A4) | Products → Catalog, filtered to exempted items | No exempted item remains, or fundraising is re-enabled |
| **C-24** | Pending team-manager invites never activated | Informational | ≥1 invite in **Invited · not logged in** beyond a threshold (Store General Settings, Epic A2b) | Settings → People & Access | Invite activates, or is revoked |

- **C-22 is the only Settings condition at Blocking tier, and it is there deliberately.** The owning spec is explicit that a branding fix must never quietly leave the wrong person able to read a store's reporting and rosters. That is a live access problem with a person on the other side of it, which is exactly what Blocking tier is for.
- **C-23 is Informational, not Action.** The spec states plainly that disabled-with-exemptions is *expected, not a defect*. Home reports it and offers a route; it must not imply the rep did something wrong.
- **C-24's threshold is 7 days.** An invite sent an hour ago is not a problem; one unactivated for a week is.

###### Presentation, ordering & limits

- **A condition must be false on a well-run store.** Before registering anything, check whether it would hold in the common case. If it would, it is a permanent fixture rather than an attention condition, and a permanent card teaches reps to skip the list. The uncontactable-players condition was withdrawn on exactly this test. Where the underlying warning still matters, attach it to the detail line of a card the rep will act on, or to the surface where they will hit it.
- **Ordering:** Blocking → Action → Informational. Within a tier, order by **cost of delay**, defined as a fixed per-condition rank recorded in the catalogue above, not by recency and not by count. A rep should see the same order twice in a row for the same store state.
- **Cap the list at five.** Decided; tune against the cards-rendered distribution metric. Given more than five conditions resolve, when the section renders, then the top five are shown by the ordering above with a **"n more"** expander. A hub that renders fourteen cards is a backlog, and a backlog is the thing reps already have.
    - **Blocking-tier conditions are never collapsed into the expander.** If more than five Blocking conditions hold, all of them render and the cap is exceeded. This is the one case where the cap yields.
- **One card per condition, not per record.** Given four orders are pending, then one C-01 card renders naming the count — not four cards. Per-record detail belongs to the owning tab.
- **Cards state the count and the oldest age where age is meaningful.** *"Oldest placed 3 days ago"* is required on C-01, C-05, and C-06 — the three conditions where the passage of time has an operational cost.
- **No manual dismissal.** A condition clears when its underlying state clears, per the *Clears when* column. Nothing on Home can be snoozed, hidden, or marked done, because Home holds no state (Governing rule 1) and a dismissible card would need somewhere to remember the dismissal. Where a rep legitimately wants to accept a condition rather than fix it, the acceptance is expressed in the owning surface — closing a coverage gap, submitting short, deleting the bundle.
- **Empty state is a first-class state.** Given zero conditions resolve, when the section renders, then it states plainly that nothing needs the rep right now and names the store's current lifecycle state. It does not manufacture suggestions, and it does not surface Informational-tier filler to avoid looking empty.
- **Every card carries exactly one primary action.** Where a condition has two plausible resolutions, it is two conditions (see C-03/C-04) or the card routes to the surface where both are available.

###### Which cards populate the list, by store state and store type

**This subsection governs card population only.** The tab renders in all six cases below, and the section renders in all six. What differs is which of the 24 registered conditions can hold.

| Store state | Cards that can hold | Cards that cannot |
| --- | --- | --- |
| **Draft** | C-04, C-08, C-09, C-16 — plus catalog conditions C-10 to C-13 | Every order, Roster Bank, and window condition. A Draft store has never been open, so none of that state can exist |
| **Open** | The full catalogue | C-09, C-16 (launch-specific), C-17, C-18, C-20 (close-specific) |
| **Closed** | Most of the catalogue, including Action tier — the workspace stays fully editable per the lifecycle behavior matrix. C-17, C-18, C-20 are specific to this state | C-14 (no live window to be closing) |
| **Archived** | None — see below | All |

| Store variant | Effect on card population |
| --- | --- |
| **League** | Full catalogue |
| **Individual Team (Single-Team Locker)** | C-07 and C-08 cannot hold — one team, no coverage or division-mapping question |
| **Pop-up** | Full catalogue |
| **Always-on** | C-14, C-15, C-19 cannot hold — no configured ordering window exists |

- **Archived stores: the section renders and states its own emptiness.** Given an Archived store, when Home renders, then the attention section is **present** and states that the store is archived and read-only so nothing is awaiting action. The summary rail and resume trail render read-only alongside it.
    - **The section does not vanish.** Hiding it would contradict two things: Home's structure is meant to be stable and predictable (Epic A), and Governing rule 3 treats an empty list as information rather than a gap. A rep opening an archived store and finding a section missing has to work out whether that is by design; a rep finding it present and saying "archived — nothing to action" has been told.
    - **No card is rendered disabled.** The section explains the state once, at section level. It does not list conditions with dead buttons.

##### Epic D — Recently worked on **High-impact**

The second question in the brief: *how does the system know where you left off?* It does not, today — nothing persists it. This Epic specifies what would have to exist, and is deliberate about what the feature is and is not.

###### What it is

**A trail of the rep's own recent authoring actions in this store, each with a route back to where it happened.** It is a *location* aid. It is not a task list, not a draft-recovery mechanism, and not a progress tracker.

- **This distinction is the whole design, and testing confirms it.** The tester asked *"where's everything I've been working on?"* — an inventory question about **work already done**, not a request to finish something abandoned. Every candidate row points the same way: *edited pricing*, *added 4 players*, *updated the banner image* are all **completed** actions. Labeling them **Resume** implies the rep left something half-done, which is untrue and mildly accusatory. The section returns the rep to a **place**, and its copy must say so.
- **The section is named "Recently worked on", not "Pick up where you left off".** The original heading described resumption; the research describes recall. The rows contain completed work, and the heading now says so.
- **The precedent is already set in the product.** The Setup Guide's progress bar indicates *position in the sequence, not completion*, and the owning spec forbids styling or labelling it as a completion indicator. The same rule applies here: this section shows where the rep was, and must never be styled or labelled as a to-do list, a completion percentage, or a readiness score.

###### The resume record

- **A resume event is written on a rep-authored write.** Given a rep performs a qualifying write against this store, when the write commits, then a resume event is recorded carrying: the acting rep, the store, the **surface key** (the deep-link target), an **entity reference** where one exists, a short **human-readable label**, and a timestamp.
- **The surface key is the same deep-link key the rest of the workspace already uses.** Settings deep links resolve through a section key; My Team(s) jump-ins target a division; the Products catalog return path scrolls to and focuses a specific item. Resume reuses those routes. It must not introduce a parallel routing scheme.
- **The label is composed from the entity, not stored as prose.** *"Home Jersey — pricing"* is rendered from a product reference plus a field group at read time, so a product renamed after the event resumes under its current name. A frozen label would show the rep a name that no longer exists in their catalog.

###### What qualifies

| Qualifies | Does not qualify |
| --- | --- |
| A write the rep authored | Any read, filter, sort, search, or tab switch |
| A write against a **resumable surface** — one with a stable deep link | A write with no addressable destination |
| A write against **this store** | Writes in other stores, or at workspace scope |
| The rep's **own** writes | Another rep's, a team manager's, a buyer's, or the system's |

- **Buyer and system writes never qualify.** An order placed by a parent, a checkout address written back onto a roster, a Roster Bank capture created by a storefront order, an auto-close, a render completing — none of these are the rep's work and none belong in the rep's trail. Several of them are already surfaced properly as Epic C conditions, which is where a rep should meet them.
- **Bulk actions record one event, not n.** A CSV import of forty players is one event ("imported 40 players"), and a bulk-pricing apply across a catalog is one event. The event references the operation, not each row.
- **Destructive actions do not qualify.** Deleting a product, clearing a roster, or deleting a bundle produces no resume event. There is nothing to return to, and offering to "resume" a deletion is at best confusing.

###### Collapse, ordering & expiry

- **Collapse by surface + entity, keeping the most recent.** Given a rep edits one product's pricing four times in ten minutes, then one event is shown, timestamped at the most recent write. Without this the trail is a keystroke log.
- **Five visible by default, most recent first, expandable to fifteen.** Decided. A shorter list was considered, on the reasoning that a browsable trail becomes an audit log. The testing quote argues the other way: *"where's **everything** I've been working on"* is a request for coverage, not for the last thing touched, and a three-row list on a store where the rep has been working across teams, products, and settings in one session will not contain what they are looking for. The audit-log risk is real and is bounded by the ceiling, by expiry, and by collapsing on surface + entity — not by keeping the list too short to be useful.
- **Events expire after 30 days.** Decided. A rep who steps away from a store for three weeks mid-season is the case that most needs the trail, and they are exactly who a two-week window locks out. The counter-argument is that a month-old edit is noise; that is what ordering by recency is for.
- **Tune both against the My Team(s) case, not the Products case.** The deepest and most expensive re-navigation in the product is a League store's division → team → roster path, and the trail's parameters should be set so that path is reliably recoverable.
- **Per rep, always.** Given two reps co-manage a store, then each sees only their own trail. A shared trail would present another rep's work as the reader's unfinished business — the failure mode the *"whose work is this"* rule exists to prevent.

###### Presentation

- **Given the rep has no qualifying events**, when the section renders, then it is **absent**, not empty. An empty resume list carries no information and occupies the space the attention list needs.
- **Each row states the entity, the surface, and a relative timestamp**, and its action is a **return**, not a resume — *"Open"*, *"Go to Products"*. Copy is specified in Epic I.
- **A row whose target no longer exists is dropped silently**, not rendered as a dead link or an error. A product deleted after being edited simply leaves the trail.
- **Archived stores show the trail read-only**, with rows routing to the read-only surface.

##### Epic E — In your store (summary rail)

A per-tab summary giving the rep the shape of the store and a second route into each tab. Purely derived (Governing rule 1).

- **One row per tab, in navigation order:** My Team(s), Products, Orders, Reports.
- **Each row's label matches its tab's label exactly — the first row reads My Team(s), not Rosters.** Decided. The prototypes relabelled it **Rosters** / **Roster** while the navigation beside it still read **My Teams** / **My Team**; that is two names for one destination, which Governing rule 1 forbids, and the rail's whole purpose is being a second route into the tab.
    - **The roster figures live in the sub-line.** The row's *content* is roster-centric, which is what the rename was reaching for, and the sub-line delivers it without forking the label.
    - **On a League store the label is also inaccurate**, not just inconsistent: My Team(s) holds divisions, teams, rosters, product coverage, and fulfillment mapping. "Rosters" narrows it to one of those, and it collides with the League structure panel two cards below, which reports the same player count.
    - **The tab is not being renamed.** "My Team(s)" stands, so the row matches it.
- **Roster entries are players, everywhere on Home.** Decided. The prototypes said **148 players** on the League store and **18 members** on the Individual Team store; "members" is dropped. **Verify** that Roster Management's own stats header says players too — if it says members, that spec and this one must be reconciled rather than diverging (Governing rule 1).
- **Each row carries the tab's headline count and, where one exists, its attention overlay.** *"148 players · 5 Roster Bank captures"*, *"24 orders · 4 to submit"*. The overlay is the **same figure** the corresponding Epic C card names — not a second computation of it.
- **Counts come from the owning tab.** Player counts exclude captures (Roster Management, Epic 5); catalog counts follow the catalog's own count; order counts follow the Orders tab's. Home must not define what counts as a member, a product, or an order.
- **No fundraising progress bar, because there is no goal to progress toward.** No fundraising goal field exists anywhere in the MVP specs — fundraising is a per-item markup under a store-level master, and the Active Order Window card reports **total raised** with no target. A goal is a genuinely useful feature and a genuinely new one, needing a field, an entry point, and a decision about who sets it; that is a Settings amendment rather than anything Home can render.
    - **What Home may show instead:** total raised during the window, which the **Active Order Window** card already resolves (Store General Settings, Epic E), as a figure with no denominator and no bar.
- **Reports row is a route, not a KPI strip.** The Reports tab and the workspace Overview own the store's analytics. Home does not restate revenue, dealer profit, or fundraising breakdowns — a third rendering of those figures is a third thing to drift.
- **Rows are always present, including at zero.** *"0 products"* on a Draft store is the most useful thing that row can say.

##### Epic F — Team Managers panel

A list of this store's managers with the ability to add one, hosted on Home under the *one value, two surfaces* clause in Governing rule 1.

**What it is**

- **The same collection, not a copy.** The panel reads and writes the **manager collection** owned by [Store General Settings](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab), Epic A2c — the same collection written by *Step 1 — Basics* Epic E and by coach import from the Team Database. There is no Home-local manager record and no separate storage.
- **Read view:** one row per manager showing Name, Email, Phone, and Contact Preference. The panel is titled **League Manager Information** on League stores and **Team Manager Information** on Individual Team stores, matching the Settings card.
- **The designated record is tagged "Point of Contact".** Adopting the exact name of the setting it feeds — [Store General Settings](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab), Epic A2's **Store Point of Contact** — rather than inventing a near-synonym. This is the strongest form of Governing rule 1's no-new-vocabulary clause: the tag is not a new term at all, it is a pointer to an existing one. Bare **Primary** is banned because it reads as a rank or a manager type, implying a status field the product does not have, and **Primary Contact** was a third term for something already named. **The underlying designation is unchanged, and is not Home's to define.** Epic A2c specifies it as an invariant — *"exactly one record is designated primary at all times"* — and four things depend on it: Epic A2's rule that Team Manager mode inherits from this record and that *"non-primary manager records never feed the point of contact"*; Epic A1's protection of it through a team re-bind; the Dependencies section's requirement for *"a collection of manager records with exactly one designated primary"*; and the tab's metric tracking changes to it. **Only the rep-facing label moves.** "Primary" remains fine as an internal field name, the way Epic C's condition names are internal.
- **Because the tag borrows the setting's name, it must render only when the setting actually resolves to that record.** Point-of-contact mode is set **per channel**, and Email and Phone may each be **Team Manager**, **Salesperson**, or **Custom** (Epic A2). So:
    - **Given at least one channel is on Team Manager mode**, then the designated record is tagged **Point of Contact**.
    - **Given both channels are on Salesperson or Custom**, then **no row is tagged**, and the panel states at its foot who buyers actually see, with a route to the Store Point of Contact setting. Tagging a manager with the name of a setting that resolves to a salesperson would be a plain falsehood, and worse than the vague version because it borrows real authority.
    - **Given only one channel is on Team Manager mode**, then the row states which — *"Point of Contact · email"* — because the rep's coach supplies the published email while the phone belongs to someone else, and a bare tag would over-claim.
- **The tag renders on single-manager stores too.** Suppressing it at one record would be right if the label were *Primary* — a rank with nothing to outrank is noise. **Point of Contact** carries different information: it tells the rep whose details parents see in the storefront footer, which is worth stating most on a store with one manager, since a rep with a single coach is the likeliest not to know that coach's email is published. Subject to the render rule above.
- **There is no role or title field, and that stays true.** No "Coach", no "Team Mom" — and whether Team Database coach records even carry a role is an open dependency in Settings Epic A2c. "Point of Contact" is deliberately not that: it says which record buyers see, not what the person does for the team.
- **Settings must adopt the same term, and Home must not ship ahead of it.** Settings currently marks the record *primary*. Two labels for one designation is the failure Governing rule 1 exists to prevent, and it would be Home that introduced it. See Appendix A, amendment 8e.
- **Invite is offered on every manager row carrying an email**, per Settings Epic A2b. Given the person already holds an **active or pending** invite, then the row **states that status** in place of the action — *"Portal access active"* or *"Invited, not signed in"* — rather than silently omitting the button. An absent affordance reads as "not possible", not "already done", and the prototypes omitted it on managers who had emails on file with no explanation visible to the rep.
- **Add:** an **Add manager** action opening the **existing manager edit modal** with its full field set (First Name, Last Name, Email, Phone Number, Street Address, Contact Preference) and its full validation. Not a reduced inline form — a truncated version would be a second implementation and would drop consequence disclosures.
- **Edit and remove** are available on each row through the same modal, subject to every rule in Epic A2c: exactly one designated record at all times, removal of it blocked until another is designated, and any change to which record is designated stated before saving because it is buyer-visible. **The invariants hold independently of the label** — "Point of Contact" is presentation, and no display decision may become a data one.

###### Designating the point of contact — Home displays it, Home does not set it

**The designation is not set in the manager edit modal.** It is set in **Step 1 — Basics** during store creation and in **Settings → General**. Confirmed on review, and it resolves what looked like a missing affordance: the manager modal was never the place, so Home opening the full shared modal correctly gives the rep no designation control.

- **Home shows the tag read-only and routes to Settings → General to change it.** Given the rep wants to change which manager is the point of contact, then Home links them to Settings → General rather than hosting the change. This is the *route rather than host* branch of Governing rule 1: the control lives on a surface Home does not own, and the change is buyer-visible, so it happens where its full disclosure already lives.
- **Adding a manager never changes the designation**, so *Add manager* needs no designation control of its own. Epic A1 is explicit that a connect *"adds; it never replaces"* and that no existing record is *"overwritten, demoted, or deleted as a side effect."* The first record on a new store becomes the point of contact by being the only one.
- **A rep must never be able to strand the designation from Home.** Given a removal from Home would leave the collection without a designated record, then the removal is blocked with the reason stated and a route to Settings → General — the Epic A2c invariant, enforced from this surface as from any other.

**Adding a manager grants no access, and Home must say so in place**

This is the sharpest risk in the whole request. The owning spec states the rule in absolute terms: a manager record *"provisions no account, sends no email, and grants no portal access,"* and portal entitlement is created **only** by an explicit invite in Settings → People & Access. It calls this *"the single most important constraint on the feature."*

An **Add manager** button on the workspace's landing page is the most likely place in the product for a rep to assume they have just invited someone. So:

- **Given the manager modal is opened from Home**, then it states that adding a manager creates a contact record only and does not grant portal access, and offers a route to **Settings → People & Access** to send an invite.
- **Given a manager row carries an email**, then the panel offers **Invite** against it, routing to People & Access — so the rep is not retyping an address they just entered. This mirrors the affordance People & Access already offers against existing manager records.
- **Given a manager is removed from Home**, then any invite issued to that person **remains active** until revoked in People & Access, and the confirmation says so and links there. Home may not infer, create, or revoke entitlement in either direction.

**Point-of-contact propagation**

- Given a point-of-contact channel is on **Team Manager** mode, when the primary manager's email or phone changes from Home, then the storefront footer reflects it with no further action — the existing live binding. The modal states this before saving, exactly as it does in Settings.
- Home does **not** surface the Store Point of Contact mode selector. That lives in the Edit Store Details modal, and splitting a two-part setting across two surfaces is how one half gets edited without the other.

**Availability**

- The panel renders in **every store state**, because the manager collection is explicitly **exempt from post-launch locking** — coaching changes happen mid-season and must not require a store rebuild.
- On **Archived** stores it renders read-only, with no add, edit, or remove.

**Home's panel does not offer Add from Team Database. Settings' manager card does.** Decided. Home carries **Add manager** only, and a rep who wants to pull an existing coach record is routed to Settings → General.

- **This is the *****route rather than host***** branch of Governing rule 1**, and the same call as the point-of-contact designation above. Coach import is a selection flow over Team Database records — verification, multi-select, point-in-time copies — and it belongs on the surface that owns the manager collection rather than being reproduced on a landing page.
- **Settings Epic A1's standing open question closes as *****yes*** on the strength of this: the affordance goes on the manager card, which is where a rep looking to add a coach naturally goes (Appendix A, 8b).
- **Whichever surface adds the record, import grants no access.** The no-portal-access rule covers the import path exactly as it covers a typed record; an imported coach is offered for **Invite** in People & Access the same way a hand-typed one is.

##### Epic G — Brand assets panel

Team logo and team colors on Home, reusing the existing components.

**Three different things get called "logos and colors" — this panel surfaces two of them and links to the third**

| Asset | Scope | Owned by | On Home |
| --- | --- | --- | --- |
| **Team Logo** and **Team Colors** | Store-level, imported from the Team Database | Store General Settings, Epic A (Edit Store Details → Team Branding & Sport); *Step 1 — Basics*, Epic D | **Rendered, editable via the existing component** |
| **Store Theme Color** | Store-level, buttons and accents only | Store General Settings, Epic I | **Rendered, editable via the Prolook color picker** |
| **Team artwork library** — primary, wordmark, alternates, sport variants, each with a production-readiness state | **Team-level, persists across seasons** | Product Catalog Management, Epic I | **Linked, not reproduced** |

- **The third one is deliberately not embedded.** The artwork library lives on the **Team**, not the store, and is read by both the Artwork Editor and the brand customizer. Rendering a Team-scoped library inside a store-scoped panel invites a rep to think they are editing this store's marks when they are editing every store that team ever has. Home links to it and says which scope it is.
- **Components are reused, not rebuilt.** The Team Logo drop zone and Team Colors control are the Step 1 / Settings controls. The theme color uses the **Prolook color picker** — the owning spec is explicit that *"no bespoke picker is built for this card,"* and that applies here too.

**Theme color behavior is inherited whole**

- The swatch shows its **source** — **Team default** or **Custom** — so the rep can see at a glance whether anything is overridden.
- **Reset to team color** is available on a custom color and re-arms future re-derivation.
- Home carries the owning spec's helper copy stating the color applies to **buttons and accents only**. That copy exists specifically so a rep does not report the unchanged page background as a bug, and Home — a surface reps will land on far more often than Settings — needs it more than Settings does, not less.
- Home does **not** host **Change Team**. Re-binding re-imports branding, re-derives a defaulted theme color, and triggers the left-behind-manager prompt with its portal-access callout. That is a consequential multi-step flow belonging to the Edit Store Details modal; Home routes to it.

**Availability**

- **Renders and stays editable in every store state.** The two theme controls are **explicitly exempt from post-launch locking**, and **Team Logo and Team Colors do not lock after launch either** — decided, and to be recorded in Settings Epic B's lock list (Appendix A, 8d). So the whole panel is editable on a live store, and Home is not a route around a lock because there is no lock to route around.
- On **Archived** stores, read-only throughout.

**Candidate new condition, not yet registered.** The artwork library gives each mark a production-readiness state so that an unvalidated mark is *"visibly not-yet-usable rather than silently wrong at the factory."* A mark sitting in **Needs vector** is real, actionable, spec-backed state and is a strong candidate for a **C-26**. It is left unregistered here because Products Epic I is a short section without acceptance criteria, and a condition needs a trigger precise enough to query. **Recommend fleshing out Epic I first**, then registering it.

##### Epic H — League structure directory *(League stores only)*

An at-a-glance list of divisions and teams, each routing into My Team(s). This is the panel most directly answering *"how often I got stuck on my teams."*

- **League stores only.** Given an Individual Team (Single-Team Locker) store, then this panel does **not** render. That store is one team with no division tier and no grouping UI — the My Team tab drops straight into the roster, so a directory would list one row pointing at the tab's own landing view.
    - This is a **conditional panel inside a permanent tab**, the same shape as the conditional *Catalog & Decoration* section inside the permanent Settings tab. It does not make the Home tab conditional.
- **Read-only, and deliberately so.** The panel lists structure; it does not edit it. The structure editor is already one shared component with two hosts and a standing rule that any change to it must be assessed against both — a third host is a real cost and a directory does not need one (Governing rule 1).
- **Contents:** the same **divisions · teams · players** counts the My Team(s) stats header reports, then division rows with their teams nested beneath, then standalone teams listed separately — mirroring the tab's own arrangement of the canvas plus a standalone-teams list.
- **Each row carries its player count**, and its **pending Roster Bank capture count** where any exist. Capture counts already surface on division cards, team cards, and the stats header; Home is one more read of the same figure, not a new one.
- **Clicking routes into My Team(s), scoped.** A division opens that division; a team opens that team's detail. Given a team is targeted, then My Team(s) opens with the containing division auto-opened and breadcrumbs intact — the existing jump-in behavior. A row that dumps the rep on the canvas to find the team themselves reproduces the exact problem this panel exists to solve.
- **What this panel does not show:** product thumbnail strips, division product-count pills, coverage tables, or the catalog drawer. Those are the workspace canvas surfaces in Roster Management Epic 6. Home is a directory, not a second canvas — and C-07 already carries the coverage gap into the attention list, which is where a gap belongs.
- **Team codes are not shown.** They are backend routing keys, not rep-facing identifiers, and are surfaced in the workspace for reference and support rather than for navigation.
- **Divisions always render collapsed, at every league size.** Each division row shows its name and its counts; clicking expands it to reveal its teams. The panel scrolls within a **bounded height** so it can never push the attention list off-screen.
    - **There is deliberately no size threshold.** A rule like "expand when under four divisions" was considered and rejected: it gives the rep a different page shape depending on their store, adds a number that can be wrong, and the collapsed row already carries the at-a-glance content the panel exists for. Predictability is worth more here than saving one click on a small league.
    - **Expansion is per session, not persisted.** Home holds no state (Governing rule 1), so an expanded division does not survive a reload.
- On **Archived** stores, rows render and route to the read-only surfaces.

##### Epic I — Copy & vocabulary

###### Card copy — the rule, and the terms it bans

Card copy is specified here, not in the Epic C catalogue. Three rules, in priority order:

1. **Name the consequence, then the action.** The headline says what is or isn't happening to someone; the detail line and button say what the rep does about it.
2. **No internal state names.** If a rep would not use the word out loud to another rep, it does not go on a card.
3. **Say who is affected.** Customers, players, orders, or a named division — not "the system", not the passive voice.

**Banned on cards** — every one of these appeared in a first-draft condition name and would have shipped:

| Do not write | Because | Write instead |
| --- | --- | --- |
| Freight routing unresolved | Describes a routing table, not a task | Needs a manager before orders can ship |
| Below MOQ | Acronym for an internal threshold | Under the minimum to ship |
| Held by the render gate | Pure internal machinery | Still generating images |
| Unconfirmed application sizing | Rep-facing term is just "sizing" | Sizing needs confirming |
| Team re-bind / left-behind records | Describes the data operation | From the team you switched away from |
| Order-window coverage gap | Analysis output, not a problem statement | Some days have no team able to order |
| Submission blocked / cannot be submitted | Passive, and names the block not the fix | Add a manager so these orders can ship |
| Container | Internal shorthand for a freight grouping | Group |
| Primary, or Primary Contact *(as a manager tag)* | "Primary" reads as a rank or manager type, implying a status field that doesn't exist; "Primary Contact" is a third term for something the product already names | Point of Contact |
| Orphaned products / dangling category reference | Describes the data state, not what the rep lost | Products aren’t in a category |

**Say group, never container.** Confirmed: the rep-facing word for a batch of orders consolidated into one freight shipment is **group** — as in the Orders tab's own *Submit Group* action. **Container** is internal shorthand and must not appear on Home, in the summary rail, or in any card copy. The prototype used it; that was an error.

###### Rep-facing headlines

Counts and names are interpolated. These are the headline patterns; detail lines follow the same rules.

| ID | Headline | Detail line | Button |
| --- | --- | --- | --- |
| **C-01** | *n* pending orders to submit | Oldest placed *n* days ago — orders reach the factory after you submit | Go to Pending Orders |
| **C-02** | *Division 3* is under the minimum to ship | *n* more items needed, or submit as-is and a minimum-quantity fee applies | View group |
| **C-03** | *Division 3* and *Division 7* need a manager before their orders can ship | *n* orders are waiting on this | Assign managers |
| **C-04** | Add a delivery address before orders can ship | Orders ship to the team manager, and there's no address on file yet | Add address |
| **C-05** | *n* players haven't ordered their required gear | Window closes *date* — *n* of them have no email or phone, so a reminder won't reach them | View players |
| **C-06** | *n* Roster Bank captures awaiting review | Oldest captured *n* days ago — banked from storefront orders, not yet on a roster | Open Roster Bank |
| **C-07** | *n* teams carry no products | *U10 Red*, *U14 White* — there's nothing to buy for these teams yet | Review coverage |
| **C-08** | *n* divisions or teams have no manager assigned | Orders for them can't ship until someone's assigned | Assign managers |
| **C-09** | Add a product before you launch | Customers need at least one thing to buy | Go to Products |
| **C-10** | *n* products are still generating images | Customers can't see them until the images are ready | View products |
| **C-11** | Images failed for *n* products | They can't go on the storefront until this is retried | Retry |
| **C-12** | *n* bundles have only one item left | They've come off the storefront — add an item or delete the bundle | Fix bundles |
| **C-13** | Confirm sizing for *n* products | Sizing hasn't been confirmed on every decoration | Confirm sizing |
| **C-14** | Ordering window closes *date* — *n* days left | Change the close date from the store schedule | Edit Store Schedule |
| **C-15** | *n* players still haven't ordered and the window closes in *n* days | Send reminders where you have contact details, or move the close date | View players |
| **C-16** | Your store is ready to launch | Customers can start ordering as soon as you do | Launch store |
| **C-17** | Your close report is ready | Totals, fundraising, and what shipped | View report |
| **C-18** | *n* orders are still being made | They'll ship as they're finished — nothing needed from you | View orders |
| **C-19** | Some days have no team able to order | *n* days in the window aren't covered by any team's schedule | Review schedule |
| **C-20** | *n* orders haven't been paid for | Payment is still open on these | View orders |
| **C-21** | *n* manager records are from the team you switched away from | Keep them or remove them | Review managers |
| **C-22** | Someone from the previous team can still see this store | *Name* has access to this store's reports and rosters | Review access |
| **C-23** | Fundraising is off, but *n* products still add to it | This is fine if it's intentional | View products |
| **C-24** | *n* invited managers haven't signed in yet | Invited *n* days ago | Review invites |
| C-27 | *n* products aren't in a category | A category they were in was deleted — shoppers can still buy them, but can't filter or search for them | Re-file products |

- **C-12 keeps the word bundle but drops "Incomplete".** *Bundle* is rep-facing; *Incomplete* is a state name from Products Epic J. **Verify** whether reps see that state label on the Products tab — if they do, the card may use it; if it's internal, it stays off.
- **C-18, C-20, and C-23 deliberately reassure.** All three are Informational conditions that a rep may have caused on purpose or cannot act on. Per Governing rule 3, Home reports and does not scold — *"nothing needed from you"* and *"this is fine if it's intentional"* are doing real work.
- **No card uses the word "blocked".** It names the block rather than the fix, which is precisely the C-03 defect.

###### The tier is not displayed on the card — decided

The tier is **not** shown on the card. A prototype rendered a red **BLOCKING** eyebrow above C-03; it was removed.

Tier is a spec-internal ordering property, and displaying it fails rule 2 above like any other internal term. If the headline names the consequence properly the eyebrow is redundant; if it doesn't, the eyebrow is compensating for weak copy. A red all-caps **BLOCKING** on something the rep may not have caused also sits badly against the never-scold rule. The rail colour carries severity for scanning, which is all it needs to do.

###### Product vocabulary

Home is a high-traffic surface and, if it becomes the landing tab, the rep's **first exposure to the product's vocabulary on every visit**. Its copy is therefore **bound to the current labels** and must be re-checked whenever they change — the same constraint and for the same reason as the Setup Guide's card copy.

- **Bound terms as of September 3, 2026:** **Stock Vault** (not Product Vault), **Catalog Templates** (not Product Packages), **Customizer** (not Brand Catalog), **Other stores**, **My Team(s)**, **Roster Bank**, **Pending Orders**, **Submit** (not approve), **Open** (not Active), **Closed** (not Paused / On Hold), **Draft**, **Archived**, **Point of Contact** (not Primary, not Primary Contact).
- **Status vocabulary is the lifecycle spec's, without exception.** The canonical states are **Draft**, **Open**, **Closed**, **Archived**. Home must not render "Active" — a state that survives only in the stale *Launch & Status Controls* page. The workspace header's chip should be corrected on the same pass (Appendix A, 10).
- **Cards name the consequence, not the internal state.** *"Customers can't order these yet"* over *"visibility is off"*.
- **Cards never scold.** No "you forgot", no "overdue", no red on an Informational condition. The rep is operating a store, not failing a checklist — the same tonal constraint the Setup Guide rewrite was driven by.
- **No completion, readiness, or score language anywhere on the page.** Not in the attention list, not in the resume trail, not in the summary rail. This is a hard prohibition, inherited from the Setup Guide's "not a checklist" rule and extended here because Home is far more tempting to gamify.

##### Epic J — Acceptance criteria

- Given a rep opens a store workspace, then a **Home** tab is present and first in the navigation.
- Given a store in **any** state, of **any** type, on **any** distribution format, then the Home tab is present and enabled — there is no configuration in which the workspace renders five tabs.
- Given a store in any state, then the **Needs your attention** section and the **In your store** rail both render — neither is ever hidden, and neither is ever rendered disabled.
- Given the **In your store** rail, then its first row is labelled **My Team(s)**, matching the tab, and roster entries are counted as **players**.
- Given any card, then no amber is used anywhere on Home.
- Given the Setup Guide or Close Report trigger condition is met, when the rep enters the workspace, then that sequence presents over Home and Home is available on dismissal.
- Given a store in any state, then every card in **Needs your attention** corresponds to a registered condition in Epic C and no card renders for an unregistered condition.
- Given more than one condition resolves, then cards are ordered Blocking → Action → Informational, and identically on every render for the same store state.
- Given more than five conditions resolve, then the top five render with an expander — **unless** more than five are Blocking tier, in which case all Blocking cards render.
- Given a card is displayed, then its count matches the count on the owning tab exactly.
- Given a card's primary action is selected, then the rep lands on the surface that owns that condition, scoped or filtered to the affected records where the owning spec supports it.
- Given a condition's underlying state clears, when Home is next rendered, then that card is absent — and no card can be dismissed by any other means.
- Given zero conditions resolve, then the section states so plainly and surfaces no substitute content.
- Given an **Archived** store, then the attention section renders and states that the store is archived and read-only, and no card carries an action.
- Given a Draft store with zero visible products, then **C-09** renders at Blocking tier and Home does not offer any launch action.
- Given a Draft store with at least one visible product, then **C-16** renders and routes to the header launch control.
- Given the rep performs a qualifying write, then a resume event is recorded against that rep, that store, and the surface's existing deep-link key.
- Given a rep edits the same entity repeatedly, then one resume event is shown, timestamped at the most recent write.
- Given a buyer order, a checkout write-back, a Roster Bank capture, or any system event, then **no** resume event is recorded.
- Given two reps co-manage a store, then each sees only their own resume trail.
- Given a resume row's target entity has been deleted, then the row is omitted with no error state.
- Given the rep has no qualifying resume events, then the section is absent rather than empty.
- Given any surface on Home, then no completion percentage, readiness score, or setup-progress indicator is displayed anywhere.
- Given the **Team Managers** panel, then it lists the store's manager collection, and that collection is the same one Settings and Step 1 write.
- Given at least one point-of-contact channel is on Team Manager mode, then the designated record is tagged **Point of Contact** — including when the collection holds a single record — and never tagged "Primary" or "Primary Contact".
- Given only one channel is on Team Manager mode, then the tag names which channel it supplies.
- Given both channels are on Salesperson or Custom, then no row is tagged, and the panel states who buyers actually see.
- Given the rep wants to change which record is the point of contact, then Home routes to Settings → General and does not host the change.
- Given a removal from Home would leave the collection with no designated record, then the removal is blocked with the reason stated and a route to Settings → General.
- Given the manager modal is opened from Home, then it is the same modal Settings opens, with its full field set and validation and no Home-local variant.
- Given the manager panel, then **Add manager** is the only add affordance — **Add from Team Database** is not offered on Home, and coach import routes to Settings → General.
- Given any card, then its tier is not displayed as a label.
- Given any registered condition, then it is false on a store with no outstanding work — no condition holds in the common case.
- Given **Add manager** on Home, then the existing manager edit modal opens with its full field set and validation, and states that adding a manager grants no portal access.
- Given a manager is added, edited, or removed from Home, then the result is indistinguishable from the same change made in Settings, and no portal invite is created, altered, or revoked.
- Given a manager record with an active or pending invite is removed from Home, then the confirmation states that portal access remains until revoked in People & Access, and links there.
- Given a point-of-contact channel is on Team Manager mode and the primary's contact details are edited from Home, then the storefront footer reflects the change without further action, and the modal stated so before saving.
- Given the **brand assets** panel, then the Team Logo, Team Colors, and Store Theme Color render using the existing Step 1 / Settings components and the Prolook color picker, with no bespoke control — and all three stay editable after launch.
- Given a manager row whose person holds an active or pending invite, then the row states that status rather than omitting the Invite action.
- Given the theme color swatch, then its source is shown as Team default or Custom, a Reset to team color action is available on a custom value, and helper copy states the color applies to buttons and accents only.
- Given the brand assets panel, then the Team artwork library is linked with its Team-level scope stated, and is not reproduced inline.
- Given a **League** store, then the structure directory renders divisions with nested teams, standalone teams separately, and the same divisions · teams · players counts as the My Team(s) stats header, with divisions collapsed and the panel bounded in height.
- Given an **Individual Team** store, then the structure directory does not render — and the Home tab renders unchanged in every other respect.
- Given a division or team row is selected, then My Team(s) opens at that entity with the containing division auto-opened and breadcrumbs intact.
- Given the structure directory, then no product thumbnails, coverage tables, catalog drawer, or team codes are rendered.
- Given any card, then its headline names the consequence and its button names the action — no card headline states an internal system state, and no card uses a term from the banned list in Epic I.
- Given any card, then its copy is the Epic I headline for that condition, not the Epic C internal condition name.
- Given **C-03**, then the card names the specific affected divisions or teams rather than only a count.
- Given any card, then every label it uses matches the label currently used by the owning spec — no card names a retired term.
- Given Home renders, then no store state has been written by Home other than the rep-scoped resume event.


### Out of scope

Cross-store attention (a workspace-level "everything needing me across all my stores"), notifications or emails derived from attention conditions, snoozing or dismissing conditions, assigning a condition to another user, a full activity or audit log, per-rep configuration of which conditions appear, and any Home-side authoring of store state.

- **Cross-store attention is the obvious next feature and is deliberately excluded.** It needs a different scope model, a different permission read, and a different ranking problem (which store's blocking condition wins?). Building it as a generalization of this page would compromise both. Note that the workspace-level Overview already exists as its natural host.


---

### Metrics & Success Criteria

- **Share of Epic C conditions resolved within one session of first being surfaced** — the core read on whether Home changes behavior or merely reports
- **Time from a Blocking condition first holding to its resolution**, before and after Home, split by condition — the single number that justifies the feature
- **C-03 / C-04 dwell time** — freight-blocked stores are the most expensive failure Home can catch; this should fall hardest
- **Share of store sessions where Home is the only tab visited** — a hub that answers the question without a tab switch is working; a high rate alongside unresolved conditions means Home is a dead end
- **Click-through rate per condition** — a condition nobody ever acts on is either wrongly tiered or does not belong in the catalogue
- **Cards rendered per session, distribution** — a median above three suggests the tier model is too generous or the cap is too high
- **Share of sessions with an empty attention list** — healthy and expected on well-run stores; near zero means Home is manufacturing work
- **Expander open rate** — high means the cap is wrong; near zero means the cap is right and the collapsed conditions are correctly deprioritized
- **Resume-trail click-through rate** — the honest test of whether continuity was a real problem or an assumed one. A low rate is a reason to cut the section, not to make it more prominent
- **Resume rows clicked by age** — informs the expiry window
- **Resume-trail expander open rate, and the position of the clicked row** — a rep regularly clicking row 8 means the visible count is too low; nobody opening the expander means five was right
- **Share of resume clicks targeting My Team(s)** — the tab testing named as the biggest friction should be the trail's heaviest consumer. If it isn't, the friction was confusion rather than navigation and the fix is elsewhere
- **Time from workspace entry to reaching a specific team or roster on League stores**, before and after — the direct measure against *"how often I got stuck on my teams"*
- **Workspace re-entries per session** — the behavior behind *"I literally keep coming here"*. Home should either reduce the repeat landings or make them productive; if the count stays high and Home's click-through stays low, the landing surface is still empty in the way that matters
- **Manager records added from Home vs. from Settings vs. coach import** — whether the panel is where reps actually go
- **Managers added from Home who are then invited to the portal within the same session** — the read on whether the no-access-granting copy is landing. A low rate alongside support contacts about a manager "not being able to log in" means it is not
- **Theme colors and logos edited from Home vs. Settings**, and share of stores accepting the team default
- **Structure directory rows clicked, by depth** — division vs. team vs. standalone, and whether the scoped landing removes the re-navigation the *"stuck on my teams"* finding described
- **Send Reminder attempts on players with no contact channel** — the failure C-05's detail line exists to pre-empt; it should fall as reps read the caveat before acting
- **Resume rows omitted for deleted targets** — a high rate suggests the qualifying-write rules are too broad
- **Home / tab count disagreements reported** — target zero, and the direct measure of Governing rule 1
- **Support contacts about "why can't I submit these orders"** — the C-03/C-04 pair's reason for existing
- **Support contacts about a bundle disappearing from the storefront** — C-12's reason for existing
- **Stores launched with the rep having visited Home first** vs. not, and time-to-launch for each — whether Home helps the Draft case the Setup Guide was not built to solve
- **Setup Guide reopens from Home vs. from the header** — a read on whether the second entry point earns itself


---


### Dependencies & Technical Constraints


**Home requires no new store state.** It is a composition layer over existing records, and this is a constraint on the implementation as much as on the design: any figure Home renders must be sourced from the service that owns it rather than recomputed locally, or Home and the tabs will diverge and the page's credibility goes with them.

**An attention-condition resolver** is required: a single read, evaluated per store per render, returning the set of Epic C conditions currently holding, each with its count, its oldest-affected timestamp where applicable, its tier, and its resolution route. The resolver's predicates must be **the owning services' own predicates** — the pending-order query, the MOQ threshold evaluation, the freight-gate resolution, the render-state read, the Incomplete-bundle flag, the launch gate's visible-product count, the three-state fundraising read, the days-left derivation, the coverage-gap analysis, the invite-status read, and the re-bind source-team resolution. Home must not hold a second implementation of any of them. The condition catalogue is **data, not code branches**: adding a condition should be a registration, so that the "no unregistered condition renders" rule is enforceable rather than aspirational.

The resolver must be **cheap enough to run on every workspace entry**. Several predicates it composes are non-trivial on large stores — the roster↔order join behind C-05, the per-team product-coverage aggregate behind C-07, the catalog-wide fundraising read behind C-23. Home cannot be the surface that makes opening a store slow. **Conditions are resolved progressively, with Blocking-tier predicates first**, so the most consequential card is never the last to appear. Decided over synchronous resolution and short-TTL caching.

**C-27 depends on an amendment to Products Tab that must land first.** The orphaned state must be a first-class, queryable state owned by that spec, together with the Products-tab error treatment and an addressable filter for the affected items. Home may not scan for unresolved category ids itself, and must not ship ahead of that amendment: a registered condition whose owning surface has no query behind it is exactly the case Governing rule 1 prohibits.

**Deep-link routing** must exist for every resolution route in Epic C, and must reuse the existing schemes rather than adding one: Settings' section-key deep links (which must remain stable as sections are added), My Team(s)' division-scoped jump-ins including the auto-open of the targeted division, the Products catalog's scroll-to-and-focus return path, and the Orders tab's sub-tab and filter state. Where a route needs a filter Home cannot express — C-05's incomplete-player view, C-10's render-pending filter, C-23's exempted-item filter — that filter must be added to the owning tab as an addressable state, and that is an amendment to the owning spec rather than something Home implements locally. **Audit which of those filters exist today and which are new work before estimating.** This is the most likely source of hidden scope in the feature, and the only item on this page still carrying unknown cost.

**The resume trail requires a new rep-scoped activity record**: acting rep, store, surface key, optional entity reference, field-group or operation identifier, and timestamp — written on qualifying writes only, collapsed on read by surface + entity keeping the most recent, expired on read by age, and filtered to the requesting rep. Labels are **composed at read time** from the entity reference, so renames and edits are reflected and a deleted entity yields an omitted row rather than a dangling one. The write path must be **explicitly opt-in per surface**, not a blanket hook on every mutation — a general write hook would capture buyer orders, checkout write-backs, Roster Bank captures, render completions, and auto-closes, all of which are specified as non-qualifying. Bulk operations must emit one event referencing the operation rather than one per affected row.

**Tab-label indicators** need the resolver's per-tab roll-up, restricted to Blocking-tier conditions, and must express presence rather than count so that no figure lives in three places.

**The Team Managers and brand assets panels require no new persistence.** Both are additional hosts for components and fields that already exist: the **manager collection with its single-primary invariant** (writable from Settings, Step 1, and coach import, and now from Home, all against the same persisted collection), the **Team Logo / Team Colors** fields, and the **store theme color field with its source flag**. Three constraints follow. The manager modal must be the same component with unshortened validation and consequence disclosure, since a trimmed Home variant would drift. The **no-access-granting rule must hold at the code path level** — no route from Home may create, infer, or revoke a portal entitlement, and removal of a manager record must not touch the invite table. And the theme color's **source flag must not be inferrable from the value**, since a rep may pick the same color the team default would produce; Home reading or writing that field must preserve the flag so re-derivation on Change Team still behaves.

**The League structure directory requires the shared division / team / roster state read in directory form** — divisions with nested teams, standalone teams, per-entity player counts, and per-entity pending-capture counts, matching the figures the My Team(s) stats header and cards already resolve. It requires the existing **scoped jump-in routes**, including the auto-open of a targeted team's containing division. It requires **no write path**, and must not instantiate the shared structure editor, which already has two hosts and a rule that changes be assessed against both. Rendering must be bounded for large leagues so the directory cannot displace the attention list.

**Store-state and store-type gating applies to card population, not to the tab or the section.** The tab and the attention section always render; the resolver decides what the section contains. Gating belongs in the resolver rather than the view layer: Archived stores must return an empty set with an archived reason code (so the section can state its own emptiness rather than the view inferring it), League-only conditions must not be evaluated on Single-Team stores, and window-dependent conditions must not be evaluated on always-on stores. Gating in the view would leave conditions being computed for stores where they are meaningless and would eventually leak one.

**Sequencing with the two paced card sequences** requires no new state: Home reads neither the Setup Guide's per-rep-per-store-type dismissal flag nor the Close Report's per-user-per-close-event seen flag. Both sequences retain their existing triggers and precedence over Home. Home's Setup Guide link is a second caller of the existing reopen path.

**Role scope** depends on the open question above. If Home is ever extended to team-manager-role users, the resolver must return a **permission-filtered** condition set rather than the full set with disabled actions — a manager must never be shown a blocking condition they have no route to resolve.

Shared internal order, roster, catalog, store-config, and reporting services. Database updates limited to the resume-event record.
