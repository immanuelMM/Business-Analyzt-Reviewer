# Store General Settings (Details Tab)

### Executive Summary & Problem Statement

#### The Problem

The settings a rep chooses during store creation (name, web address, format, timeline, branding, contacts, fulfillment, tax) aren't final — names get corrected, dates shift, branding updates, contacts change. Without a place to revisit them, a rep would have to recreate a store to fix a setting.

#### The Solution

A **Detail** tab inside the store manager where the rep edits and manages the store's general information after creation. It surfaces the **same inputs/fields as Step 1 — Basics** of the creation flow, all freely editable while the store is in **draft mode**. Once the store is launched, a (still-TBD) subset of fields locks; the rest remain editable.

‌

### User persona & use cases

**Who is this for?** The store manager (rep) editing and managing general store information after or as a store has been created.

**Scenarios encountered** Fixing a store name or web address before launch; extending a pop-up's closing deadline; swapping the imported team logo/colors; changing the point-of-contact from Service to a salesperson; switching the fulfillment model or tax mode while still in draft.

‌

### Functional Requirements & Core Workflows

#### User Stories

* As a rep, I want a Detail tab to edit my store's general information, so that I can correct or update settings without recreating the store.
* As a rep, I want the same fields I configured at creation, so that there's one consistent place to manage every store setting.
* As a rep, I want to freely edit everything while the store is in draft, so that I can fully dial it in before going live.

##### Epic A — Field parity with Step 1 — Basics

The Detail tab exposes the **same inputs/fields** as _Step 1 — Basics_ in the store-creation flow, with the same input types and conditional logic. (See Step 1 — Basics for the authoritative field definitions.)

* **Store Details** — Store Name (text) and the auto-derived **Web Address** slug.
* **Store Distribution Format** — Temporary Pop-Up vs. Always-On Locker (the Store Timeline panel shows only for Pop-Up).
* **Store Timeline** _(Pop-Up only)_ — Launch Date, Closing Deadline, Enable Urgency Timers.
* **Team Branding & Sport** — connected Team Profile, Team Logo, Team Colors, Sports.
* **Team Manager & Point of Contact** — manager email/phone; storefront Email and Phone contact channels (Service / Salesperson / Custom).
* **Store Distribution Model** — Group Coach Freight Sorting vs. Direct-To-Home.
* **Compliance & Taxation** — Sales Tax Mode (ZIP AutoTax / Flat Rate / Tax Exempt) with its conditional fields.

##### Epic B — Edit permissions by store state **TBD**

* **Draft — fully editable:** Given a store in **draft mode** (created but not yet launched), when the rep opens the Detail tab, then **all** store settings and information can be edited/changed.
* **Launched — partial lock TBD:** Given a **launched** store, when the rep opens the Detail tab, then a subset of fields becomes non-editable while the rest stay editable.

**OPEN — to be determined:** the exact fields/inputs that lock after launch are _TBD_ and must be defined before build (likely candidates touch fulfillment, tax, format/timeline, and the web address — anything that would disrupt live orders or buyer expectations).

##### Epic C — Store archiving

There is **no store deletion**. Instead, the **rep who owns the store** can **archive** it from the Detail tab. Archiving shuts the store down while preserving it as a historical record — nothing is destroyed.

* **Owner-only:** Given a store, when the **owning rep** opens the Detail tab, then an **Archive Store** action is available to them.
* **Confirmation:** Given Archive Store, when clicked, then a confirmation modal explains the consequences (storefront shutdown + read-only dashboard) before the rep confirms.
* **Storefront shutdown:** Given the store is archived, when a guest visits the **public storefront URL**, then it is **completely shut down** and routes them to a neutral _"This store is closed"_ landing screen.
* **Read-only historical record:** Given the store is archived, when the rep opens the backend management dashboard, then it is **permanently transitioned into a read-only historical record** (orders, roster, products, and settings remain viewable but no longer editable).

##### Epic D — Store closing

**Closing is distinct from archiving** — both shut the storefront, but closing is **reversible** while archiving is **permanent**. A closed store can be re-opened at any time and keeps a **fully editable** management workspace; an archived store can never re-open and is locked to **read-only** (see Epic C).

* **Triggers — manual or scheduled:** Given a store, when the rep **manually closes** it, OR when its configured **close date** is reached, then the store enters the **closed** state.
* **Storefront locked:** Given a closed store, when an end-user visits the storefront, then it is **locked** and they see a _"This store is closed"_ landing page (no shopping/checkout).
* **Full management access retained:** Given a closed store, when the rep/owner opens the **Manage-Store Workspace**, then they retain **full access** to manage the store (products, roster, orders, settings remain editable — unlike archiving).
* **Manual re-open to publish changes:** Given a closed store with edits made in the workspace, when the rep wants those changes live, then they must **manually re-open the store** — changes are **not reflected on the storefront until the store is re-opened**.

##### Epic E — Active Order Window tracking card

**Pop-up only:** applies to **temporary pop-up stores** that have a specific ordering window (not always-on 24/7 stores). The Detail tab surfaces a card summarizing the live window at a glance.

* **Visibility:** Given a **pop-up store** with an active ordering window, when the rep opens the Detail tab, then an **Active Order Window** card is shown; given an always-on 24/7 store, the card is **not rendered**.
* **Total raised:** Given the card, then it shows the **total $ amount raised** during the window.
* **Progress bar:** Given the card, then a **progress bar** visualizes progress through the window.
* **Days-left label:** Given the card, then a **"days left" label** tracks the number of days the store will remain open.

‌

### Metrics & Success Criteria

* Store edits made without recreating a store
* Setting-change error rate near zero
* Post-launch edit attempts blocked on locked fields (once defined)
* Scheduled vs. manual closures; re-open rate
* Archived stores retained as read-only records

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Reuses the entire **Step 1 — Basics** field set and validation (slug uniqueness, Team Database pull for logo/colors/sports, salesperson/contact directory, scheduling persistence, and the **Collect Sales Tax** toggle with its state→flat-rate lookup and liability agreement). Adds a **store-state-aware edit-permission layer**: in **draft** every field is writable; once **launched**, a **TBD subset of fields is locked** (the lock list must be finalized before build). **Archiving** requires an owner-scoped state transition that **disables the public storefront route** (serving a neutral "store closed" screen) and flips the management dashboard to **read-only** while retaining all records — no destructive delete. **Closing** is a separate **reversible** state (manual or triggered by the scheduled close date) that **locks the storefront** behind a "This store is closed" page while keeping the workspace fully editable; storefront changes only go live on a **manual re-open**. Database updates + shared internal team / tax services.
