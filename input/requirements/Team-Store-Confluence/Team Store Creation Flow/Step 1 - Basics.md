---
title: Step 1 - Basics
confluence_id: 4152164609
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152164609/Step+1+-+Basics
last_modified: 2026-10-12
pulled: 2026-10-26
---
> **Audit update — July 20, 2026.** This spec was audited against the current Team Stores Workspace prototype and updated to match: a new leading **Store Type** panel, a **Team Fundraising** toggle, the coach-freight model renamed **Ship to Team Manager**, a **state-driven read-only tax rate** (manual entry removed), and expanded manager fields. *Amended August 20, 2026: store templates removed from scope. Rewritten August 24, 2026 following the team store testing walkthrough: the Store Point of Contact **Service** mode is replaced by **Team Manager**, and the tax **State** dropdown is searchable. Updated August 31, 2026: the wizard step count is now store-type dependent (League stores gain a Divisions & Teams step); Step 1 gains a **Team & Roster** panel (Epic D1) and support for **additional team managers**; **Ship to Team Manager** now captures a destination address. None of the August 31 additions are required to advance.*

> *Amended September 1, 2026 (a) — **Enable Team Fundraising is now a store-level default over per-item toggles**, not an absolute switch. Fundraising has replaced Team Profit as the sole team-side markup and each product carries its own fundraising toggle in the price settings component (see* [*Product Catalog Management (Products Tab)*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153376773/Product+Catalog+Management+Products+Tab)*, Governing rule 3). At this step the distinction is mostly academic — no products exist yet, so the toggle simply sets the default every item will inherit. The consequences of changing it later are owned by* [*Store General Settings*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab)*, Epic A4.*

> *Amended September 1, 2026 (b) — **connect-to-team now imports coach records.** The Team Database holds coach records attached to its teams and organizations, but the connect-to-team component was specified as pulling only logo, colors, sports, and team name. Reps were therefore re-typing contact details the platform already held. Coaches are now returned by the connect and offered to the rep for **verification and selection** as Team Manager records — the rep chooses which ones, and nothing is added silently. Specified in the new **Epic D2**; the manager collection it writes into is Epic E. The equivalent behavior on re-bind is owned by* [*Store General Settings*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab)*, Epic A1.*

> *Amended September 2, 2026 (c) — **the step gains an Announcement Message panel.** Usability research found reps treat store information — key dates, deadlines, returns, sizing, shipping — as **setup rather than theming**, and there was previously nowhere in this step or in Settings to enter it. The panel is specified in the new **Epic H** and writes the same store-level field as* [*Store General Settings*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab)*, Epic I — Store Customization & Design. It is **optional and outside the Next validation set**. The buyer-facing render is owned by* [*Storefront Announcement Banner*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4305616902/Storefront+Announcement+Banner)*. The store theme color, the other control in that Settings section, is deliberately **not** offered here — team colors are already imported two panels up in Epic D, and a second color control during creation would invite confusion about which one drives the storefront.*

> *Amended October 12, 2026 (d) — **the Ship to Team Manager destination can now be chosen from saved Pick-up Locations.** Destinations are saved once at workspace level and selected per store, rather than typed by hand into every store. Specified in Epic F below; the locations themselves are owned by* [*Pick Up Locations*](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4380065805/Pick+Up+Locations)*. Manual address entry is unchanged and remains available, and the destination stays outside the Next validation set.*

### Executive Summary & Problem Statement

#### The Problem

Setting up a store touches a dozen interdependent settings (format, address, team, sports, contacts, dates, fulfillment, tax); doing this ad-hoc produces inconsistent, error-prone stores. Several settings are conditional on each other, so a flat form invites mistakes.

Two further gaps surfaced in usability testing. Roster policy — whether numbers may repeat, and who picks them — was reachable only after the store existed, so a rep who cared about it had to launch first and configure second. And choosing **Ship to Team Manager** committed the store to a bulk shipment without ever asking where that shipment goes.

A third gap is a data one. The **Team Database already holds coach records** attached to its teams and organizations, but connect-to-team pulled only branding — logo, colors, sports, team name. The rep then typed the coach's name, email, and phone by hand into the panel immediately below, reproducing information the platform was already holding two fields away. Worse, hand-typed contact details drift from the record of truth: a coach whose phone number is corrected in the Team Database has a stale number sitting in every store a rep set up by hand.

A fourth: the rep finishes this step having set a launch date, a closing deadline, and a shipping model, and has **nowhere to tell buyers about any of it**. Deadlines, returns, sizing, and shipping lead times are the questions parents ask, and the answers ended up in a coach's group text rather than on the storefront.

A fifth, closely related to the second: once the destination address was captured, it was captured **per store, by hand, every time**. A rep running a dozen stores that all ship to the same place retyped the same address a dozen times, and a typo in any one of them surfaced only at order submission.

#### The Solution

A single Basics step that walks the operator through every store setting in order, revealing conditional fields only when relevant: store type (Multi-Team Hub vs Single-Team Locker), store name and auto-generated web address, a fundraising toggle, distribution format, an optional timeline (pop-up only), an optional announcement message for buyers, team branding pulled from the Team Database, sports, roster policy, manager and point-of-contact details, the shipping model and its destination address, and the sales-tax mode. Tax is a single selection and lives here rather than in its own step.

Connecting to a team now returns **branding and coaches together**. The rep is shown the coach records attached to that team and picks the ones who should become Team Managers for this store — one, several, or none. Selection is deliberate: the rep verifies each record before it is added, because a team in the database may carry coaches who have nothing to do with this store.

Roster policy is set here as a **store-level default** rather than left for later, and the shipping model asks for its destination at the moment it is chosen — now offering **saved Pick-up Locations** alongside manual entry, so a destination a rep uses repeatedly is chosen rather than retyped. The **Announcement Message** panel gives the rep somewhere to write what buyers need to know, immediately after the dates it usually refers to. All of these are optional — a rep who skips them gets today's behavior and today's defaults.

**Add Store** opens this step directly — there is no interstitial choice modal. A store started from the Stock Vault's **Start store with selected (n)** action also lands here, with its selected products pre-loaded so the Add Products step arrives already populated.

### User persona & use cases

**Who is this for?** Reps creating a new store; reps setting one up on behalf of a team.

**Scenarios encountered** Spinning up a seasonal pop-up with a hard deadline; standing up an always-on locker (no deadline); importing a school's official branding; connecting to a team and adding its head coach as the team manager without typing a single field; connecting to a team that carries four coach records and picking only the two who run this store; connecting to a team whose coach records are stale and entering a manager manually instead; connecting to a team with no coaches on file; setting the duplicate-number rule for a varsity program before any roster exists; deciding at setup that players will pick their own numbers; **writing the closing deadline and production lead time into the announcement message right after setting the dates; noting that jerseys run small so parents size up; stating the return policy on a fan-gear locker that has no deadline at all; skipping the announcement entirely and adding it from Settings after the coach tells the rep what to say;** naming a second and third coach who will help run the store; entering the coach's address so bulk freight has a destination; **picking the dealership's own saved pick-up location as the destination rather than typing it for the twelfth time; setting up a store whose freight goes somewhere one-off and typing that address by hand; choosing Ship to Team Manager before any destination is known and coming back to it in Settings;** choosing free coach-sorted freight to cut shipping cost; setting a tax-exempt checkout for a non-profit program; pointing buyers at the team manager rather than a central service desk; deciding up front that this store will fundraise, so every product added starts with fundraising on; starting a store from a Stock Vault selection or catalog template with products already pre-loaded.

### Functional Requirements & Core Workflows

Fields render top-to-bottom in the following panels. Each is documented with its input type and conditional logic.

**Step count is store-type dependent.** The wizard is **three steps for an Individual Team Store** — Basics → Add Products → Review & Deploy — and **four steps for a League Store** — Basics → **Divisions & Teams** → Add Products → Review & Deploy. The League-only step is specified in *Step 2 — Divisions & Teams (League Stores)*. Because Store Type is chosen inside this step (Epic A0), the stepper cannot know its own length at first render; the resolution is specified in Epic A0 below.

**Next** validates this step before advancing: Store Name, Web Address, both timeline dates (Temporary Pop-Up only), the Team Manager contact fields backing any selected Team Manager point-of-contact channel, and, when tax collection is on, a populated rate plus the liability agreement. The **Team & Roster** panel (Epic D1), **coach selection** (Epic D2), **additional managers** (Epic E), the **Ship to Team Manager destination** (Epic F) — whether supplied as a saved location or typed by hand — and the **Announcement Message** (Epic H) are deliberately **outside** this validation set — they carry working defaults, are recoverable in Settings, or are optional by design, and blocking on them would reintroduce the upfront burden the roster-optional work removed.

**Epic A0 — Store Type.** The step opens with a structural choice that branches the entire workspace.

- **League Store · Multi-Team Hub** — unlocks per-team branding, product-to-team assignment, manager mapping, and the **Divisions & Teams** step.
- **Individual Team Store · Single-Team Locker** — enforces one roster sheet and a streamlined single-profile workflow; the Divisions & Teams step is not part of this flow.
- **Live consequence note** — an info line under the cards states the downstream effect of the current selection (e.g. "Single-Team Locker enforces one roster sheet — team grouping and multi-team assignment stay off across this store").
- **Stepper resolution.** Given no Store Type has been selected yet, when the wizard first renders, then the stepper renders in its **four-step (League)** form. Selecting **Individual Team Store** **removes** the Divisions & Teams step and renumbers the trailing steps to 2 and 3; selecting **League Store** retains it. Growing the step count mid-task reads as the system changing the rules; collapsing it reads as a simplification, so the wizard starts long and shortens.
- **Switching type after building structure:** given a League store with divisions or teams already created in Step 2, when the rep switches to Individual Team Store, then a confirmation modal states that the structure will be discarded before the switch is applied. Structure is never silently destroyed.
- **Single source of truth for step labels.** Every step indicator, "Step *n* of *m*" string, and back/next affordance reads the resolved step list. No surface hardcodes a total.

**Epic A — Store Details.**

- **Store Name** (text, required) — on entry, auto-generates the web-address slug.
- **Web Address** (slug field, prefixed `prolookstores.com/`, required) — auto-derived from the Store Name and kept in sync until the operator edits it manually; once manually edited it stops auto-syncing. Input is slugified (lowercase, hyphenated, special characters stripped).
- **Enable Team Fundraising** (toggle, default on) — the store-level master for fundraising, and the **default every product inherits**.
    - **When on:** products can carry a fundraising markup. Each item added to the catalog starts with its **own fundraising toggle on**, and the rep may switch individual items off from the price settings component (see *Products Tab*, Governing rule 3). The **Fundraising Report** is available under Reports.
    - **When off:** no product can collect fundraising. The Fundraising input does not render in any price settings section, items added to the catalog start with their own toggle off, **Dealer Profit is the only markup available**, and the Fundraising Report is hidden.
    - **Fundraising is the team's markup.** It replaced **Team Profit**, which has been removed from the product entirely. There is no second team-side field.
    - **At this step the toggle is uncomplicated.** Store creation runs before any product exists, so switching it here changes a default rather than rewriting a catalog. There is nothing to sweep and no ordered item to protect.
    - **Changing it later is not uncomplicated.** Disabling fundraising on a store that already has products presents a confirmation interstitial listing every affected item, and **cannot** remove fundraising from items that already carry orders — so a live store can legitimately sit with fundraising off while ordered items keep collecting. Re-enabling restores each item's prior state rather than switching everything on. All of that behavior is owned by *Store General Settings*, Epic A4; helper copy here should point the rep there rather than restate it.

**Epic B — Store Schedule** (single-select, required).

- **Temporary Pop-Up** — for seasonal/uniform stores that close on a date for bulk production. Selecting it sets the store to a fixed open window and reveals the Store Timeline panel.
- **Always-On Locker** — for continuous year-round stores. Selecting it sets the store to stay open and hides the Store Timeline panel entirely (no batch deadline applies).

**Epic C — Store Timeline** *(conditional — Temporary Pop-Up only)*.

- This panel is shown **only** when the format is Temporary Pop-Up; it is not rendered for Always-On Locker.
- **Store Launch Date** and **Store Closing Deadline** (date inputs) — both required for Pop-Up stores; validated on Next.
- **Enable Urgency Timers** (toggle) — when on, the storefront shows a real-time closing countdown.

**Epic H — Announcement Message — New**

Somewhere for the rep to write what buyers need to know. Usability research found reps treat this as a **setup field, not a theming feature** — they expect a place to type it during setup, and until now there wasn't one anywhere in the product.

- **Placement:** the panel sits immediately **after Store Timeline** and before Team Branding & Sport. The rep has just set the launch date and closing deadline, which is the content most likely to go into the message, so the panel is placed where that context is freshest. It renders for **both** store schedules — an Always-On Locker has no timeline panel above it but still has returns, sizing, and shipping to communicate.
- **The field:** a **rich-text** editor holding the message buyers see at the top of the storefront. One free-text block, not a set of structured fields — reps say different things and the platform does not know in advance what matters to a given program.
- **Placeholder guidance:** Given the field is empty, then placeholder text demonstrates the intended use with a worked example covering **key dates, order deadlines, returns, sizing, and shipping**. The placeholder is illustrative only and is **never saved as content** — a rep who skips the panel ships no message, not the example.
- **Optional, and outside validation.** Given the panel is left empty, when the rep chooses **Next**, then they advance with no error, no warning, and no confirmation. This matches the treatment of Epics D1, D2, E, and F: nothing added to this step after the roster-optional work may become a launch prerequisite.
- **Empty means no banner.** Helper copy states that leaving the field blank shows **no banner at all** on the storefront rather than an empty one, so the rep understands that skipping is a clean outcome rather than an unfinished one.
- **One field, two surfaces.** The panel writes the **same store-level field** that *Store General Settings* Epic I reads and writes. There is **no creation-time copy**: a message entered here is what Settings displays afterward, and an edit in Settings is what the storefront renders. This is the same pattern already applied to the ship-to destination address (Epic F) and the Team & Roster defaults (Epic D1).
- **Editable forever, including after launch.** Helper copy states the message can be changed at any time from Settings, **including on a live store**. This is not a general property of store settings — most of them face a post-launch lock list — so it is worth stating here: the announcement is explicitly exempt from that lock (*Store General Settings*, Epic B), because a moved production date is the ordinary case.
- **League stores:** the message entered here is the **store-level** message. Per-division and per-standalone-team overrides exist but are **not** offered in the wizard — divisions and teams are built in Step 2 and may not exist yet when this panel renders, and per-scope messaging is a refinement rather than a setup task. Overrides are configured in Settings → Store Customization & Design (*Store General Settings*, Epic I).
- **No theme color here.** The store theme color is the other control in Store Customization & Design and is deliberately absent from the wizard. Team colors are imported in Epic D immediately below, and offering a second color control during creation would leave the rep unsure which one the storefront uses.
- **Free text, unvalidated.** The message is not parsed or date-checked, and it is not reconciled against the timeline dates set in Epic C. A rep may type a deadline that differs from the one they just entered, and the system will not detect it. Accuracy is the rep's responsibility — the accepted consequence of a free-text field.
- **Character limit and permitted marks — OPEN.** A ceiling on message length and the permitted rich-text feature set (in particular whether links are allowed) are undecided and implementation-blocking; see the open questions on *Storefront Announcement Banner*.

**Epic D — Team Branding & Sport.**

- **Import Team Profile / Connect to Team** (button) — opens the Team Database modal (searchable by organization name and ZIP). Selecting an organization imports its official logo, primary/secondary colors, sports, **and returns its attached coach records for selection** (Epic D2). The button then reads "Change Team" and can be reconnected to switch. Connecting also fills the Team Name, seeds an empty Store Name, and regenerates the slug if it has not been manually edited.
- **Team Name** (text) — auto-fills from the connected team profile but remains editable.
- **Team Logo** (upload / drop zone) and **Team Colors** (swatches) — pre-filled from the imported team but editable.
- **Sports** (multi-select chips, "select all that apply").
- **What a connect returns, in full:** team name, logo, primary and secondary colors, sports, and **coach records**. Branding lands in this panel; coaches are handled in Epic D2 and land in the manager collection in Epic E.
- **The imported primary color is also the storefront theme default.** The primary color imported here is what *Store General Settings* Epic I uses as the default store theme color, applied to storefront buttons and accents. No control for it appears in this wizard; the rep overrides it in Settings if they want something else.

**Epic D2 — Coach import & verification — New**

The Team Database attaches **coach records to its teams and organizations**. Connecting to a team returns those records alongside the branding, and the rep converts the ones they want into **Team Manager** records for this store. This exists so that a rep who has just connected to a team is not hand-typing contact details the platform already holds two panels below.

**Nothing is imported silently**

- **Selection is required, and it is opt-in.** Given a connect returns coach records, when the branding import completes, then the rep is shown those records and must **explicitly select** any they want added. A connect never writes a manager record on its own.
- **Verification, not just selection.** Each returned record is displayed with its full contents — name, email, phone, and whatever else the Team Database holds — so the rep is confirming a specific person's details rather than ticking a name. A team in the database can carry coaches from prior seasons, other sports, or other programs; the rep is the one who knows which apply to this store.

**Multiple coaches**

- **Multi-select.** Given a team carries more than one coach record, when the selection surface renders, then the rep may choose **one, several, or none**. Nothing about the database's ordering implies which is the right one.
- **Each selection becomes its own manager record**, written into the collection specified in Epic E, identical in shape to a hand-entered one.
- **Primary designation.** Given the rep selects two or more coaches, then exactly one must be **primary**, per Epic E. The first selected record is proposed as primary and the rep may change it before advancing. The primary is what the Store Point of Contact inherits from, so this is a buyer-visible choice and is labelled as such.
- **Imported and hand-entered records mix freely.** A rep may import two coaches and then add a third by hand, or import none and type everything. The collection does not distinguish them functionally.

**Imported records are copies, not live links**

- **Editing is local.** Given an imported manager record, when the rep edits any field, then the change applies to this store's manager record only. **Nothing is written back to the Team Database.** Team Stores is a consumer of that data, not an editor of it.
- **No live sync.** A coach's details changing in the Team Database after import do **not** propagate into an existing store. The import is a point-in-time copy. This is the same snapshot behavior the branding import already has — a logo updated in the database does not retroactively change a store that imported the old one.
- **OPEN — to be confirmed:** whether a store should surface a passive indicator when an imported record has since diverged from its Team Database source. It would help reps catch stale contact details, but it requires retaining the source record id and a comparison pass. Confirm before build; the import itself does not depend on it.

**Empty and partial cases**

- **No coaches on file:** given a connect returns zero coach records, when the import completes, then the coach section states plainly that the team has no coaches on file and the rep enters manager details manually in Epic E. It is not an error, and it does not block.
- **Incomplete coach records:** given a selected coach record is missing an email or phone, when it is added, then it is added as-is with the blank fields empty and editable. If a Store Point of Contact channel is left on Team Manager mode against a primary record with a blank in that channel, the existing **blank-value guard** in Epic E fires at Next — the rep fills it or switches that channel. Import does not exempt a record from validation.
- **Skipping entirely:** given the rep selects no coaches, when they advance, then nothing is written and Epic E behaves exactly as it did before this feature existed.

**Reconnecting**

- Given the rep uses **Change Team** to bind to a different team, then that team's coach records are offered in the same way. **Existing manager records are not deleted** — a reconnect adds, it does not replace, because a rep may have hand-entered a manager who is still correct. Where re-binding would leave records from the previous team that no longer apply, the rep removes them in Epic E or in Settings. The equivalent behavior after the store exists is specified in *Store General Settings*, Epic A1.

**Epic D1 — Team & Roster.** The two roster-policy controls that previously existed only in **Settings → Team & Roster** are surfaced here so a rep can set them before the store exists. Both use the **same components as the Settings cards** — this is the same setting reached earlier, not a parallel one, and a value set here is what Settings shows afterward.

- **Placement:** the panel sits between Team Branding & Sport and Team Manager & Point of Contact — it concerns the team's composition rules, so it belongs with team identity rather than among fulfillment and tax.
- **Allow Duplicate Numbers** (toggle, **default off**) — whether two players on the same roster may share a jersey number. Given the toggle is set here, when rosters are later created anywhere in the store, then each **inherits this value at creation** and may override it afterward. This is a **bulk default, not an enforcement layer**: the authoritative value lives on each roster (see *Roster Management (My Team(s) Tab)*, Epic 4), and the store-level value never overrides a roster once set. Helper copy states this and notes that individual rosters can diverge from the My Team(s) tab.
- **Jersey Number Selection** (two exclusive modes) — **Team manager chooses on behalf of players** (numbers assigned on the roster; buyers see their assigned number and enter nothing at checkout) or **Players choose their own numbers** (buyers enter a number on the product page and the roster fills in as orders arrive). Helper copy states where number entry lives for each mode and notes that duplicate-number rules still apply per roster.
- **Not required.** Given the rep skips this panel entirely, when they advance, then the store is created with duplicates disallowed and the default jersey-number mode, and both remain editable in Settings → Team & Roster.

**Epic E — Team Manager & Point of Contact.**

- **Team Manager** — First Name, Last Name, Email, and Phone Number. The panel is titled **League Manager** (league director) for Multi-Team Hub stores and **Team Manager** (team coach) for Single-Team Lockers.
- **Records arrive from two places.** A manager record is either **imported from the Team Database** through coach selection (Epic D2) or **entered by hand** here. Both write the same collection and behave identically thereafter; an imported record is fully editable and carries no special state.
- **Additional managers.** Given the primary manager's fields, when the rep chooses **Add another manager**, then a repeatable manager row with the same four fields is appended; each added row is individually removable. Additional managers are **optional** and add no validation.
    - **The first manager stays privileged.** Only the primary manager's record feeds the **Store Point of Contact** when a channel is on Team Manager mode, and only the primary manager's Email or Phone can block **Next**. The primary row is labelled as such in the UI so a rep does not expect the storefront footer to list every manager entered. Where managers were imported, the primary is the one designated during coach selection (Epic D2) and can be changed here.
    - **Contact records, not invitations.** Managers entered here — imported or typed — are **contact records only**. Nothing is sent, no portal invite affordance appears in the wizard, and importing a coach from the Team Database grants that coach **no access to anything**. Team Manager Portal invites remain a separate, deliberate action in **Settings → People & Access** (see *Store General Settings*, Epic A2b), which the rep takes once the store exists.
    - Additional manager records populate the pool that **Team Manager & Order Fulfillment Mapping** draws on for League stores, so a rep who names their coaches here — or imports them — is not re-typing them at mapping time.
- **Store Point of Contact** (shown on the storefront footer) — two independent channels, **Email** and **Phone**. Each offers three modes:
    - **Team Manager** (default) — pulls the Email or Phone Number entered in the **primary** Team Manager record above. The field renders read-only, showing the inherited value with a note that it follows the Team Manager record; editing it means editing the Team Manager fields. Buyers with a question reach the coach or league director directly rather than a central desk.
    - **Salesperson** — reveals a salesperson directory dropdown.
    - **Custom** — reveals a free-text input.
- **Mode is per channel.** Email and Phone are selected independently — a store may list the team manager's email alongside a salesperson's phone.
- **Validation dependency:** because Team Manager is the default mode, the corresponding **primary** Team Manager field becomes **required** for any channel left on that mode. A primary Team Manager email or phone left blank blocks **Next** with an inline error on the Team Manager panel, not on the point-of-contact block, so the rep is sent to the field that actually needs filling. Switching a channel to Salesperson or Custom releases that requirement. This applies equally to imported records — a coach record with no email on file does not satisfy an Email channel on Team Manager mode.
- **Live sync:** editing the primary Team Manager Email or Phone Number updates any point-of-contact channel set to Team Manager, in the wizard and afterward in Settings. This is sync **within Team Stores** — it does not reach back to the Team Database.

**Epic F — Fulfillment Method** (single-select, required).

- **Ship to Team Manager** (badged FREE) — renamed from "Group Coach Freight Sorting" — orders sorted by roster name and shipped in bulk to the coach or director.
- **Direct-To-Home Residential Delivery** — individual carrier rates, shipped to each buyer.
- **Destination** *(conditional — Ship to Team Manager only)*. Given the rep selects **Ship to Team Manager**, when the option is selected, then a destination control is revealed inline beneath it for the place the bulk shipment goes to. Selecting **Direct-To-Home Residential Delivery** hides it.
    - **Two ways to supply it.** Given the workspace has saved **Pick-up Locations**, when the destination control renders, then the rep may either **select a saved location** or **enter a Ship-To Address manually** (street / apt, city, state, ZIP). The locations themselves are created and managed in **Workspace Settings → Pick-up Locations** (see *Pick Up Locations*); this panel only chooses among them.
    - **Manual entry is never removed.** Saved locations are a convenience, not a constraint. A rep whose freight goes somewhere one-off types the address exactly as before, whether or not locations exist on the workspace.
    - **No locations on file.** Given the workspace has no saved Pick-up Locations, when the rep selects Ship to Team Manager, then manual entry behaves exactly as it does today and helper copy **prompts** that destinations can be saved once and reused across stores. The prompt is informational — **Ship to Team Manager remains selectable with no locations saved and no address entered.**
    - **A selected location is a reference, not a copy.** Given a store's destination resolves to a saved location, when that location's address is later edited in Workspace Settings, then this store resolves to the updated address with no action here. Conversely, given the location is switched off at workspace level, then this store is left with **no destination** and its pending orders are blocked at the freight gate until one is supplied — the removal is immediate and applies to stores already using it (*Pick Up Locations*, Epic C).
    - **One destination, two surfaces.** However it is supplied, the destination resolves to the **same record** as the shipping address on the store's team-manager record — not a second address, and not a separate field per input method. What is set here is what **Settings → Distribution & Fulfillment** displays afterward, where it can be changed, swapped to a different location, or cleared (see *Store General Settings*, Epic A3). Neither surface holds a value the other cannot see.
    - **Optional at creation, gated at submission.** Given no destination is supplied, when the rep advances, then **Next** is not blocked — but helper copy states plainly that orders cannot be submitted for fulfillment until a destination exists. This is the existing freight gate on pending-order submission (see the *Order Management* spec), surfaced earlier rather than a new gate.
    - **Address on an imported coach record.** **OPEN — to be confirmed:** whether Team Database coach records carry a mailing address, and whether it should pre-fill the manual field when an imported coach is the primary manager. If the data exists it is worth using, since the destination is the field reps most often skip. Confirm the Team Database coach schema before build.
    - **League stores:** the destination captured here belongs to the league manager and serves as the default. Per-division and per-team routing — where a division ships to its own manager or its own saved location instead — is configured in **Settings → Distribution & Fulfillment** (*Store General Settings*, Epic A3) and is unchanged by this panel.

**Epic G — Compliance & Taxation.** A single binary toggle plus conditionally-revealed fields, so tax-exempt dealers are not burdened with extra inputs while every dealer explicitly chooses their configuration path. No automated nexus integrations — this provides basic regional protection only.

- **Collect Sales Tax** (primary binary toggle) — the single entry point for tax configuration.
- **Off (tax-exempt path):** given the toggle is off, when store setup proceeds, then no additional tax inputs are shown and no tax is applied at checkout.
- **On — conditional reveal:** given the toggle is turned on, then it reveals a **State dropdown**, a **Tax Rate field**, and a **mandatory liability-agreement checkbox** (all present only while the toggle is on).
- **Searchable State dropdown:** the State control is a **type-ahead searchable select**, not a plain scrolling list. Typing filters the options by state name and by two-letter postal abbreviation, so a dealer reaches their state by keystroke rather than scrolling fifty entries. Selection is still single-choice and the list remains browsable when nothing is typed.
- **Setting the rate:** given the toggle is on, when the dealer selects their state from the dropdown, then the system populates the flat Tax Rate field with that state's rate. The rate field is **read-only** — manual rate entry was removed; state selection is the only way to set it.
- **Regional application:** given a configured flat rate, when buyers check out, then the tax is output exclusively to buyers in that designated region or state.
- **Liability gate:** given the toggle is on, when the dealer attempts to proceed, then the liability-agreement checkbox must be checked (required); a missing rate or unchecked agreement blocks Next with inline errors.

### Metrics & Success Criteria

- Wizard completion rate above 80%
- Median store setup under 10 minutes — tracked separately for the three-step and four-step flows, since the League flow is now longer by construction
- Slug-collision errors near zero
- Tax-config error rate near zero
- Time to select a state in the tax panel, before and after type-ahead
- **Share of connects that return at least one coach record** — the ceiling on how much this feature can do, and a read on Team Database coverage. A low rate means the data isn't there and reps will keep typing regardless
- **Share of returned coach records that reps actually select** — a low rate means the records are stale or irrelevant, and the verification step is doing exactly the job it exists for
- **Manager records imported vs. hand-entered per store**, and time spent in the Team Manager panel before and after coach import
- **Imported manager records edited within the same session** — a high rate means the Team Database data is close but not right, which is a data-quality signal rather than a UI one
- Share of stores keeping the Team Manager point-of-contact default vs. switching to Salesperson or Custom
- Next-blocked events caused by missing primary Team Manager contact fields — a read on whether the default is creating friction, now split by whether the primary record was imported or typed
- **Share of stores created with Team Fundraising turned off at this step** — the read on whether "default on" is the right default, and a baseline against which later store-level disables (Settings, Epic A4) can be measured
- **Share of stores setting Team & Roster values at creation vs. leaving the defaults** — a read on whether surfacing the panel this early was worth it
- **Share of rosters later overriding the creation-time duplicate-number default** — if high, the default is set to the wrong value
- **Stores with more than one manager entered at creation**, and how many of those managers are later invited to the portal
- **Ship-to-Team-Manager stores launching with no destination**, and time from launch to destination entry — the gap this panel exists to close
- **Share of Ship to Team Manager destinations supplied as a saved Pick-up Location vs. typed by hand** — the read on whether saved locations are reaching the moment they are meant to save work
- **Time spent in the destination control, before and after saved locations** — the direct measure of the retyping problem this addresses
- **Share of stores entering an announcement message at creation vs. adding one later in Settings vs. never** — the read on whether this panel is placed where reps will actually use it. A high never-rate on live stores means the field is not perceived as setup after all, contrary to what research suggested
- **Announcement messages entered at creation and then edited before launch** — a read on whether the panel sits too early in the step to be written confidently
- **Announcement message length at creation**, as the empirical input to the OPEN character-limit question
- Store-type switches that discard built structure — should be rare; a non-trivial rate means Store Type is being chosen too late

### Dependencies & Technical Constraints

Requires shared internal team services (Team Database for logo, colors, sports, coach records, and roster pull), slug uniqueness validation, a salesperson/contact directory, and scheduling persistence.

The wizard needs a **resolved step list derived from Store Type** rather than a fixed step array, consumed by every step indicator and navigation control, plus a discard-confirmation path when a League store carrying Step 2 structure is switched to Individual. The League-only step's own requirements are specified in *Step 2 — Divisions & Teams (League Stores)*.

**Coach import** requires the Team Database connect to return the **coach records attached to the selected team or organization** alongside the branding payload — one call, not a second lookup the rep has to trigger. Each returned record must expose enough fields to be verifiable on sight: at minimum first name, last name, email, and phone. **OPEN — the Team Database coach schema must be confirmed**, specifically whether coach records carry a mailing address (which would let an imported primary manager pre-fill the ship-to destination in Epic F) and whether a record carries a role or title that would help a rep distinguish a head coach from an assistant.

Imported coaches are written into the **same manager collection** as hand-entered records (no separate imported-manager entity, no parallel table) and must be indistinguishable from hand-entered records to every downstream consumer — the Store Point of Contact, the League/Team Manager Information card, Team Manager & Order Fulfillment Mapping, and the freight gate. The import is a **point-in-time copy with no live binding**: edits to a manager record must never write back to the Team Database, and changes in the Team Database must never mutate an existing store's manager record. Retaining the source record id is required only if the divergence indicator flagged as OPEN in Epic D2 is built.

Import must carry **no access-granting side effect whatsoever** — this is the sharpest risk the feature introduces. Pulling a coach out of a shared database and into a store must not create a portal invite, an account, an entitlement, or a notification. Portal access is created solely by an explicit invite in Settings → People & Access. A silent path from "the database says this person coaches this team" to "this person can see this store's reporting and rosters" must not exist.

**Enable Team Fundraising** writes the store-level fundraising flag consumed by the price settings component (*Products Tab*, Governing rule 3), by the Fundraising Report's render gate (*Store Analytics (Reports Tab)*, Epic D), and by the store-level master control in *Store General Settings*, Epic A4. The flag is read **at product-add time** to initialise each item's own fundraising toggle, and thereafter both flags are evaluated together — an item's fundraising renders only where the store flag and the item flag agree. This step writes only the store-level value; it has no catalog to sweep and no ordered items to exempt, so none of the interstitial, exemption, or state-restoration machinery specified in Settings Epic A4 is invoked here. No creation-time copy of the flag may exist separately from the value Settings reads.

The **Announcement Message** panel writes the **store-level announcement message field** that *Store General Settings* Epic I reads and writes and that *Storefront Announcement Banner* renders. It must be **the same persisted field**, not a wizard-local value copied forward on deploy — the same constraint that governs the ship-to destination and the Team & Roster defaults. The field holds **sanitized rich text**; sanitization is a property of the stored value and the storefront renderer, not of this editor alone, so a message entered here and a message entered in Settings must pass through the same path. The panel writes **only the store-level value**: per-division and per-standalone-team override fields exist on structure records (*Roster-Optional Architecture*, Epic B) and are not writable from the wizard, since a League store's divisions are created in Step 2 and may not exist when this panel renders. The field must be **excluded from the post-launch lock list** (*Store General Settings*, Epic B). The store theme color is **not written by this step** at all; its default derives from the primary color imported in Epic D and is read at store creation by Settings Epic I, which owns the source flag governing later re-derivation.

The **Team & Roster** panel writes the store-level roster defaults consumed by *Store General Settings* Epic F and *Roster Management* Epic 4. **Allow Duplicate Numbers** must be persisted as a **default read at roster creation**, not a parent value inherited at read time — the authoritative value lives on each roster — so the creation-time value and the Settings bulk-apply control must write to the same store-level field. **Jersey number selection** writes a store-level mode consumed by both the roster editor and the buyer product page.

The **Team Manager** panel requires **a collection of manager records rather than a single record**, with a designated primary whose Email and Phone are the inheritance source for the Store Point of Contact and the only fields in the collection subject to Next validation. The collection is the same one surfaced on the League/Team Manager Information card and drawn on by Team Manager & Order Fulfillment Mapping; no invite, email, or account-provisioning side effect may fire from this panel, whether a record was typed or imported.

The **Store Point of Contact** requires a per-channel mode (Team Manager / Salesperson / Custom) persisted independently for Email and Phone, a **live binding from the primary Team Manager record** so contact edits propagate to any channel on the Team Manager mode, and conditional required-field validation that surfaces the error on the Team Manager panel. That binding is internal to Team Stores and does not extend to the Team Database. The storefront footer reads the resolved channel values, not the mode.

The **Ship to Team Manager destination** must resolve to the **same persisted field** as the team-manager record's shipping address that Settings → Distribution & Fulfillment reads and writes, and that the pending-order freight gate consumes — one destination per store, written from either surface and by either input method, with backend map-service verification shared with that gate. It must not be modelled as a wizard-local value copied into Settings on deploy, and a destination supplied as a saved **Pick-up Location** must be held as a **reference to that location** rather than a copy of its address, so that an edit at workspace level propagates and a location switched off leaves the store detectably without a destination (*Pick Up Locations*, Governing rule 3 and Epic C). Reading the saved-location list during store creation requires the workspace-scoped location service; a workspace with no locations must render the manual path with no error and no empty-state dead end.

The **State** control requires a searchable select filtering on state name and postal abbreviation over the static state-to-flat-rate lookup. Starting a store from the Stock Vault requires the pre-load path that carries the selected items into the Add Products step in a completed, review-optional stepper state. The prototype uses a static state-to-flat-rate lookup in place of the planned live **ZIP-based AutoTax** third-party service; that integration remains an open dependency.
