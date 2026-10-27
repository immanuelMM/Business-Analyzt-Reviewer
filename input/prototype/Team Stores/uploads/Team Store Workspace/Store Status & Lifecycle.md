# Store Status & Lifecycle

### Executive Summary & Problem Statement

#### The Problem

Store status governs buyer access, order intake, workspace permissions, and reporting across the entire platform — but the rules defining what each state means, how transitions occur, and what changes per surface are scattered across individual UI epics rather than defined in one authoritative place.

#### The Solution

A single source of truth for all four store states — **Draft**, **Open**, **Closed**, and **Archived** — covering their definitions, valid transitions, behavioral consequences per surface, and acceptance criteria. All other features reference this section for status semantics; they own only the UI surface that triggers a transition.

### Store Definitions

| **Status** | **Detail** |
| --- | --- |
| Draft | The default state of every newly created store. The storefront is not live and is inaccessible to buyers. The rep has full management access to configure the store — products, roster, settings, and schedule. A Draft store **cannot be launched until at least one product has been added**. Once launched it transitions to **Open** and cannot return to Draft. Draft stores exist only in the management workspace. |
| Open | The store is fully operational. The storefront is publicly accessible; buyers can browse, configure, and place new orders. The rep has full management access. This is the state a store enters on launch and returns to when manually re-opened from Paused. |
| Closed | The storefront is closed to new orders, but the management workspace remains fully editable and existing orders continue to process normally. Can be entered **manually** (rep pauses from the Store Status card) or **automatically** when a pop-up store's configured ordering window close date is reached. The store can be re-opened to Active at any time. _Corresponds to the "store closing" state referenced in Store Detail Tab Epics C–D._ |
| Archived | The store is permanently shut down. The storefront is hidden from all buyers immediately; no new orders can be placed; any active ordering window is closed; and the store is removed from the active stores list. All order history and reports are retained as a read-only record. **Cannot be self-reversed** — restoring an archived store requires a Prolook support request. |

#### Valid State Transitions

| **From > To** | **Trigger - Who - Reversible?** |
| --- | --- |
| **Draft → Open** | Manual only — rep clicks Launch Store (requires at least one product to be added first). Rep only. **One-way** — a store cannot return to Draft once launched. |
| **Open → Closed** | Manual (rep clicks Pause on the Store Status card) _or_ automatic (scheduled ordering window close date reached). Rep or system. **Reversible** — rep re-opens to Open at any time. |
| **Closed → Open** | Manual only — rep clicks Re-open Store on the Store Status card. Rep only. **Reversible**. |
| **Open → Archived** | Manual only — store owner clicks Archive Store in the Danger Zone of the Detail tab. Owner only. **Irreversible** without a support request. |
| **Closed → Archived** | Manual only — store owner clicks Archive Store in the Danger Zone of the Detail tab. Owner only. **Irreversible** without a support request. |
| **Archived → Open** _or_ **Closed** | **Not self-service.** Requires a Prolook support request. Support staff only. |
| **Open / Closed / Archived → Draft** | **Not allowed.** Draft is the entry state only. Once a store is launched it can never return to Draft. |

**Note:** There is no store deletion. Archiving is the terminal state. Draft (pre-launch) is a setup state and not part of the Open / Closed / Archived lifecycle — it transitions to Open on first launch.

#### Behavior Matrix by Surface

| **Surface** | **Draft** | **Open** | **Closed** | **Archived** |
| --- | --- | --- | --- | --- |
| **Storefront (buyer-facing)** | Not live — storefront URL is inaccessible to buyers | Fully accessible — browse, configure, checkout | "This store is closed" landing page — no shopping or checkout | Hidden immediately — URL serves a neutral closed screen |
| **New orders** | Blocked — not live | **Allowed** | **Blocked** | **Blocked** |
| **Existing / in-flight orders** | None — store has never been open | Unaffected | Unaffected — continue to process normally | Unaffected — retained as read-only history |
| **Management workspace** | Fully editable | Fully editable | Fully editable — changes go live on re-open | Read-only — all records viewable, nothing editable |
| **Open stores list** | Visible — Draft badge | Visible — Open badge | Visible — Closed badge | Removed from list entirely |
| **Ordering window (pop-up only)** | Configurable but not running | Runs as configured | Suspended — does not advance | Closed immediately and permanently |
| **Order history & reports** | Empty — no orders yet | Accessible | Accessible | Retained — read-only |
| **Overview KPI — Open Stores count** | Not counted | Counted | Not counted | Not counted |

### User persona & use cases

**Who is this for?** Store owners (reps) managing store availability; Prolook support agents handling archive reversals; buyers who encounter a closed or archived storefront URL.

**Scenarios encountered** Setting up a new store in Draft before it's ready to go live; attempting to launch without any products added; manually closing a store mid-season to make catalog changes; a pop-up store auto-closing when its ordering window closes; extending a window by re-opening; permanently archiving a store at season end; a buyer landing on a closed storefront URL.

## Functional Requirements & Acceptance Criteria

#### User Stories

* As a rep, I want my new store to start as a draft so I can configure it fully before any buyers can see it.
* As a rep, I want to be prevented from launching a store with no products, so I don't accidentally go live with an empty catalog.
* As a rep, I want to close my store so buyers can't place new orders while I make changes, knowing I can re-open it at any time.
* As a rep, I want the store to automatically close when its ordering window closes, so I don't have to manually intervene at end-of-window.
* As a rep, I want to re-open a closed store so my changes go live and buyers can order again.
* As a rep, I want to archive a store at season end so it's removed from my active list while all history is preserved.
* As a buyer, I want a clear message when I land on a closed or archived storefront, so I understand why I can't order.

Epic A — Draft state & launch

* **Default state on creation:** Given a rep completes the store creation wizard and deploys, when the store is created, then it enters **Draft** state. The storefront is not live and no buyer-facing URL is accessible.
* **Full workspace access:** Given a Draft store, when the rep opens the management workspace, then all tabs (Detail, Products, Roster, Orders, Reports) are accessible and fully editable — the rep can configure everything before launch.
* **Launch gate — product required:** Given a Draft store with **zero published products**, when the rep attempts to launch, then the launch action is **disabled** and a clear message explains that at least one product must be added before the store can open.
* **Launch gate satisfied:** Given a Draft store with **at least one published product**, when the rep clicks Launch Store, then the store transitions to **Open** immediately and the storefront becomes publicly accessible.
* **One-way transition:** Given a store that has been launched and is now Open, Closed, or Archived, then the Draft state is **not available** as a target — there is no "revert to draft" action anywhere in the UI.
* **Draft badge in stores list:** Given a Draft store, when it appears in the Stores tab list, then it shows a **Draft** badge and is excluded from the Open Stores KPI count.

Epic B — Closing a store (manual)

* **Trigger surface:** Given an Open store, when the rep opens the Store Status card on the Detail tab, then a **Close Store** action is available. If the store is already Closed, the action is not shown.
* **Confirmation:** Given the rep clicks Close Store, when the confirmation appears, then it discloses: buyers won't be able to place new orders while the store is closed; existing orders are unaffected; the store can be re-opened at any time.
* **Immediate state change:** Given the rep confirms, when the action is applied, then the store transitions to **Closed** instantly — the storefront shows a closed landing page and the status badge updates to Closed.
* **Workspace access retained:** Given the store is Closed, when the rep opens any workspace tab (Products, Roster, Orders, Detail), then all content remains fully editable.
* **No order disruption:** Given the store is Closed and orders are in-flight, then those orders continue to process normally — no automatic cancellation or hold is applied.

Epic C — Auto-close on ordering window close (pop-up stores)

* **Trigger:** Given a pop-up store with a configured close date/time, when that moment is reached, then the store automatically transitions to **Closed** — no rep action required.
* **Behavioral parity:** Given the auto-close has fired, then storefront access, order handling, workspace editability, and status badge behavior are identical to a manually paused store.
* **Rep notification:** Given auto-close has fired, when the rep next opens the workspace, then a banner or status indicator informs them the ordering window has closed and the store is now Closed.
* **Re-open available:** Given the auto-closed store, when the rep wants to extend or restart the window, then they can re-open to Active from the Store Status card and optionally edit the store schedule.

Epic D — Re-opening a closed store

* **Trigger surface:** Given a Closed store, when the rep opens the Store Status card, then a **Re-open Store** action is available (Close Store is not shown while closed).
* **No confirmation required:** Given the rep clicks Re-open Store, then the store transitions to **Open** immediately — re-opening is a low-risk, reversible action and requires no confirmation modal.
* **Workspace changes go live:** Given edits were made in the workspace while Paused, when the store is re-opened, then those changes are reflected on the live storefront immediately.
* **Status badge updates:** Given the store is now Active, then the status badge updates to Open in the store list, workspace header, and any KPI aggregations.

Epic E — Archiving a store

See also: **Store Detail Tab — Epic C (Store archiving)** for the UI surface (Danger Zone placement, modal copy). This epic defines the behavioral contract; that feature owns the controls.

* **Owner-only:** Given a store in Open or Closed state, when a rep who is _not_ the owner opens the Detail tab, then the Archive Store action is **not visible to them**.
* **Confirmation — full consequences disclosed:** Given the owning rep clicks Archive Store, when the confirmation modal appears, then it explicitly states all four consequences: (1) the storefront is hidden from all buyers immediately; (2) no new orders can be placed and any active ordering window is closed; (3) the store is removed from the active stores list; (4) order history and reports are retained. It also states that **this can only be undone by Prolook support**.
* **Immediate storefront takedown:** Given the rep confirms, when archiving is applied, then the public storefront URL immediately serves a neutral closed screen and is no longer discoverable or shoppable.
* **Removed from active list:** Given the store is Archived, when the rep views the Stores tab, then the store no longer appears in the list.
* **Read-only workspace:** Given the store is Archived, when the rep opens the management workspace, then settings, products, roster, and orders are all visible but **no field or action is editable**.
* **History fully retained:** Given the store is Archived, then all order history, reports, roster data, and product records are permanently retained and accessible in the read-only workspace.
* **Support-only reversal:** Given the rep wishes to un-archive, when they contact Prolook support, then support can reverse the Archived state — **no self-service reversal path exists in the product UI**.

Epic F — Buyer-facing closed storefront screen

* **Closed store:** Given a buyer visits a Closed store's URL, when the page loads, then they see a neutral _"This store is currently closed"_ screen — no products, cart, or checkout are accessible.
* **Archived store:** Given a buyer visits an Archived store's URL, when the page loads, then they see the same neutral closed screen — the storefront is indistinguishable from Paused to buyers; no indication it is permanently archived is surfaced.
* **No leakage:** Given either Closed or Archived state, when a buyer attempts to access a product URL or checkout URL directly, then they are redirected to the closed screen — no part of the storefront is accessible via direct link.

Epic G — Status badge & filter alignment

* **Badge display:** Given any store in the Stores tab list, when rendered, then its status badge reflects current state: **Draft** (blue), **Open** (green), **Closed** (amber). Archived stores do not appear in the list.
* **Filter parity:** Given the Stores tab Filter control, when opened, then **Draft**, **Open**, and **Closed** are available as status filter values. Archived is not a filter option — those stores are excluded from the list entirely.
* **Overview KPI:** Given the Active Stores KPI card on the Overview, when rendered, then it counts only stores in the **Open** state — Paused and Archived stores do not contribute to the count.

### Metrics & Success Criteria

* Launch gate enforcement: 0% of stores successfully launch with zero published products
* Draft-to-launch conversion rate (signal for setup friction)
* Auto-close accuracy: 100% of pop-up stores transition to Closed at their configured close date/time
* Zero buyer orders accepted while a store is in Closed or Archived state
* Close → re-open cycle time (signal for how quickly reps act after a window closes)
* Archive rate per season (adoption of intentional lifecycle management vs. stores abandoned in Active)
* Support tickets for archive reversal (informs whether a self-service undo path is needed)

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

**Verification is a manual, asynchronous process — not an automated check.** Requires: secure database storage for application submissions (business-entity fields incl. EIN and banking, with sensitive-data handling/encryption); an internal **admin review queue and tooling** plus a notification service for the Prolook reviewer; and a persistent access-grant/entitlement model (not session-only). Approval introduces a **24–48 hr** waiting period between submission and access. Likely third-party integrations for banking/EIN validation and applicant email notification.
