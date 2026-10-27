---
title: System Modals & Toasts
confluence_id: 4153802806
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153802806/System+Modals+Toasts
last_modified: 2026-09-22
pulled: 2026-10-26
---
*Rewritten August 24, 2026 following the team store testing walkthrough — the page now carries an explicit modal inventory rather than a generic statement, so new destructive flows have a registered home.*

*Amended August 31, 2026: the **paced card sequence** is specified here as a shared pattern, now that two modals use it — the Store Close Report and the Store Setup Guide.*

*Amended September 1, 2026: the **store-level fundraising disable interstitial** is registered as a Consequence-tier modal (Store General Settings, Epic A4). The **price mode switch** warning is updated — Team Profit has been removed from the product, so that modal now names two fields rather than three.*

### Executive Summary & Problem Statement

#### The Problem

Destructive and consequential actions need confirmation, and every meaningful action needs feedback. When each spec invents its own modal, the same class of action gets different copy, different button order, and different levels of warning depending on which page a rep is standing on — and genuinely destructive actions end up looking identical to routine ones.

#### The Solution

A modal layer with a **registered inventory** and a consistent severity model, plus a toast system for transient confirmations. Modals are specified in the epic that owns the underlying behavior; this page records that they exist, what tier they belong to, and the rules every one of them follows.

### User persona & use cases

**Who is this for?** All users.

**Scenarios encountered** Confirming tax settings; canceling store creation; deleting a product that sits inside a bundle; removing the second-to-last item from a bundle; switching profit entry from dollars to percentages; turning fundraising off for an entire store's catalog; awaiting a long operation; acknowledging a success.

### Functional Requirements & Core Workflows

#### User Stories

- As a rep, I want confirmations and feedback toasts, so that I avoid mistakes and know actions succeeded.
- As a rep, I want the severity of a warning to match the severity of the action, so that a routine confirmation does not read like a destructive one and I stop reading them all.
- **As a rep, I want a modal that changes many records at once to show me those records, so that a single switch is never a blind rewrite.**

#### Severity tiers

- **Informational** — explains, blocks nothing, dismissible. No consequence to acknowledge.
- **Confirmation** — a reversible or low-consequence action. Neutral copy, a primary confirm and a cancel.
- **Consequence** — the action changes something the rep may not have anticipated. The modal **names the affected records** and states the outcome before confirming.
- **Blocking** — the action is not permitted in the current state. The modal offers a route to resolve the blocker rather than a confirm.

#### Paced card sequence (shared pattern)

Two modals in the product present their content as an ordered set of cards, one card per view, advanced by the user: the **Store Close Report** (Store Status & Lifecycle, Epic H) and the **Store Setup Guide** (Tabbed Store Dashboard, Epic B). They share one shell. This section owns that shell so the two do not drift, and so a third consumer does not reinvent it.

Both are **Informational** tier. Neither gates anything, neither carries a required acknowledgement, and neither blocks any action behind having been read.

**The shell — identical for both**

- **Header:** store logo mark, store name, and a context line naming the sequence and its scope (e.g. "Store Close Report · May 20, 2026 – Aug 31, 2026").
- **Progress bar:** one segment per card, directly beneath the header. Segments fill as the reader advances. This indicates **position in the sequence** — it is not a completion, readiness, or setup-progress indicator, and must never be styled or labeled as one.
- **Skip control:** persistent, in the header, visible on every card. Jumps to the sequence's terminal destination.
- **Close:** an X in the header. Escape and backdrop click dismiss identically.
- **Footer:** Back (disabled on the first card), a position readout (n / total), Jump to end, Done, and a primary advance button. On the final card the primary button becomes the sequence's terminal action.
- **Advance:** click, tap, or arrow keys. **Never auto-advance.** The reader sets the pace on every card.

**Motion**

Card transitions are fades and scale-ins in the 200–300ms range. Card content may carry looping media. There is no in-product motion toggle — the pattern does not offer a reduce-motion control, and neither consumer should add one.

**What each consumer owns**

|  | Store Close Report | Store Setup Guide |
| --- | --- | --- |
| Card payload | one computed figure, its unit, an as-of stamp, a trend delta | one concept, plain-language copy, instructional media |
| Terminal action | **Open the full report** → detail layer | **Done** → store workspace |
| Trigger | first workspace entry after a close event | first workspace entry after store creation |
| Seen-state scope | per user, per close event | per rep, per store type |
| Card set varies by | Team Fundraising enabled / disabled | store type (Individual Team / League) |

Each owning spec defines its own card count, card content, trigger conditions, and seen-state persistence. Neither redefines the shell.

#### Acceptance Criteria

- Given a destructive action, when triggered, then a confirmation modal blocks until I confirm or cancel.
- Given a meaningful action completes, when it finishes, then a toast confirms the outcome.
- Given a **Consequence**-tier modal, when it opens, then it names every affected record by name — never a bare count — so the rep can recognize what they are about to change.
- Given a **Consequence**-tier modal where some records are exempt from the action, when it opens, then the exempt records are listed **separately** from the affected ones, each with the reason they are exempt. A rep must never have to infer why a sweep was partial.
- Given any modal, when it opens, then cancel is always available and never destructive; the destructive option is never the default focus.
- Given a **paced card sequence**, when it is open, then it never auto-advances and a skip control is visible on every card.

#### Modal inventory

| Modal | Tier | Owning spec |
| --- | --- | --- |
| Sales Tax confirmation | Confirmation | Step 1 — Basics, Epic G |
| Cancel store creation | Confirmation | Store creation flow |
| Create store | Confirmation | Store creation flow |
| Create Group | Confirmation | Roster Management |
| Global loading overlay | Informational | — |
| **Store Setup Guide** | Informational · paced card sequence | Tabbed Store Dashboard, Epic B |
| **Store Close Report** | Informational · paced card sequence | Store Status & Lifecycle, Epic H |
| Product removal — standard | Confirmation | Products Tab, Epic C |
| Product removal — restricted-source, ordered | Blocking | Products Tab, Epic C |
| **Product removal — bundle member (3+ member bundle)** | Consequence | Products Tab, Epic C |
| **Product removal — bundle member (2-member bundle)** | Consequence | Products Tab, Epic C |
| **Bundle member-visibility prompt** | Confirmation | Products Tab, Epic J |
| **Delete bundle** | Confirmation | Products Tab, Epic J |
| **Price mode switch ($ ⇄ %)** | Confirmation | Products Tab, Governing rule 3 |
| **Disable Team Fundraising (store-level)** | Consequence | Store General Settings, Epic A4 |
| Category removal with reassignment | Consequence | Products Tab, Governing rule 2 |
| Revoke team-manager access | Consequence | Store General Settings, Epic A2b |
| Close store / Re-open store | Confirmation | Store General Settings, Epic D |
| Archive store | Consequence | Store General Settings, Epic C |

#### Rules for the bundle modals

These are called out because they are the newest and the easiest to get wrong.

- **Removing a bundle member from the catalog** always names the affected bundle(s) — never "this item is used in 2 bundles."
- **The 2-member case escalates.** It states that the bundle will be left with a single member, will become **Incomplete**, and will drop off the storefront, and offers three routes: **Cancel**, **Remove anyway**, and **Go to bundle**. It never offers to dissolve or delete the bundle as a side effect of removing a product — deleting a bundle is its own action with its own modal.
- **The member-visibility prompt** appears at bundle creation, lists the specific items whose visibility it will turn off, and notes the choice is reversible per item afterward. It is a Confirmation, not a Consequence — nothing is destroyed and the toggle is per-item recoverable.
- **The price mode switch** warns that changing between $ and % **clears** Dealer Profit and Fundraising, because values are never converted. It fires only when at least one of those fields holds a value; switching an untouched section proceeds silently. (Team Profit was formerly named here as a third field; it has been removed from the product.)

#### Rules for the fundraising disable interstitial

The largest single-action sweep in the product: one toggle in Settings rewrites a fundraising flag across an entire catalog. It is **Consequence** tier and is the reason the exempt-records rule above exists.

- **It precedes the write.** The toggle does not take effect until the rep confirms. Cancelling reverts the toggle and writes nothing.
- **It lists the affected products by name, with their current fundraising amounts** — not a count. Seeing "$5.00 on the jersey, $3.00 on the shorts" is what makes the scale of the change legible; "12 products affected" does not.
- **It lists exempt items separately.** Items carrying a non-cancelled order cannot have fundraising removed (the commercial lock outranks the store-level disable, per Products Tab Governing rule 1). These appear in their own section with the reason stated plainly. The section is omitted when nothing is exempt.
- **It states that amounts are kept.** Disabling never clears an entered figure — the modal says so, because a rep who believes their numbers are being destroyed will cancel an action they actually wanted.
- **It is skipped when there is nothing to review.** A catalog with no fundraising-enabled items and no exemptions applies the toggle directly. An empty Consequence modal trains reps to click through the non-empty ones.
- **Re-enabling shows no modal.** Restoring each item's prior state adds nothing and removes nothing the rep needs to review.

### Metrics & Success Criteria

- Accidental-destructive-action rate near zero
- Action-feedback coverage 100%
- Confirmation dismissal-without-reading proxy: rate of destructive actions undone or re-created within one session
- Bundles left Incomplete after a member removal — a signal the 2-member modal is not landing
- **Fundraising disable interstitials cancelled after opening** — a healthy rate means the modal is showing reps something they did not expect, which is its whole purpose; a near-zero rate alongside frequent re-enables means it is being clicked through

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Client-side UI layer; no external dependency beyond the underlying actions each modal/toast represents. Consequence-tier modals require the owning surface to resolve and pass the **names of affected records** before the modal opens — bundle-member removal in particular depends on the bundle-membership index specified in the Products Tab spec, so the modal can name each affected bundle and detect the 2-member case before the rep confirms. The price-mode switch modal requires the price settings component to report whether any profit field is currently populated.

The **fundraising disable interstitial** requires two resolved sets before it opens: every catalog item with fundraising enabled together with its current amount, and the subset of those exempted by the commercial lock (any non-cancelled order). Both are specified in *Store General Settings*, Epic A4 and *Products Tab*, Governing rule 3. The modal renders nothing itself — it displays what the owning surface resolves — and must not open at all when both sets are empty.

The **paced card sequence** is a single shared client-side component with two consumers. Card content, card count, terminal action, and seen-state persistence are injected by the owning spec; the shell owns layout, chrome, pacing, and transitions. Each card exposes a media slot sized identically for a still image or a short looping clip, so clips can replace stills without a layout change.
