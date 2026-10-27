# Step 1 - Basics

### Executive Summary & Problem Statement

#### The Problem

Setting up a store touches a dozen interdependent settings (format, address, team, sports, contacts, dates, fulfillment, tax); doing this ad-hoc produces inconsistent, error-prone stores. Several settings are conditional on each other, so a flat form invites mistakes.

#### The Solution

A single Basics step that walks the operator through every store setting in order, revealing conditional fields only when relevant: distribution format, store name + auto-generated web address, an optional timeline (pop-up only), team branding pulled from the Team Database, sports, manager & point-of-contact details, the shipping model, and the sales-tax mode. Tax is a single selection and lives here rather than in its own step.

‌

### User persona & use cases

**Who is this for?** Reps creating a new store; reps setting one up on behalf of a team.

**Scenarios encountered** Spinning up a seasonal pop-up with a hard deadline; standing up an always-on locker (no deadline); importing a school's official branding; choosing free coach-sorted freight to cut shipping cost; setting a tax-exempt checkout for a non-profit program.Functional Requirements & Core Workflows

‌

### Functional Requirements & Core Workflows

Fields render top-to-bottom in the following panels. Each is documented with its input type and conditional logic.

##### Epic A — Store Details

* **Store Name** (text, required) — on entry, auto-generates the web-address slug.
* **Web Address** (slug field, prefixed `prolookstores.com/`) — auto-derived from the Store Name and kept in sync until the operator edits it manually; once manually edited it stops auto-syncing. Input is slugified (lowercase, hyphenated, special chars stripped).

##### Epic B — Store Distribution Format (single-select, required)

* **Temporary Pop-Up** — for seasonal/uniform stores that close on a date for bulk production. Selecting it sets the store to a fixed open window _and reveals the Store Timeline panel_.
* **Always-On Locker** — for continuous year-round stores. Selecting it sets the store to stay open _and hides the Store Timeline panel entirely_ (no batch deadline applies).

##### Epic C — Store Timeline _(conditional — Temporary Pop-Up only)_

* This panel is shown **only** when the format is Temporary Pop-Up; it is not rendered for Always-On Locker.
* **Store Launch Date** and **Store Closing Deadline** (date inputs).
* **Enable Urgency Timers** (toggle) — when on, the storefront shows a real-time closing countdown.

##### Epic D — Team Branding & Sport

* **Import Team Profile / Connect to Team** (button) — opens the Team Database modal (searchable by organization name and ZIP). Selecting an organization imports its official logo, primary/secondary colors, and sports into the wizard; the button then reads "Change Team" and can be reconnected to switch.
* **Team Logo** (upload / drop zone) and **Team Colors** (swatches) — pre-filled from the imported team but editable.
* **Sports** (multi-select chips, "select all that apply").

##### Epic E — Team Manager & Point of Contact

* **Team Manager** — Email and Phone Number (the team coach).
* **Store Point of Contact** (shown on the storefront footer) — two independent channels, **Email** and **Phone**. Each offers three modes: _Service_ (PROLOOK service desk, pre-filled default), _Salesperson_ (reveals a salesperson directory dropdown), or _Custom_ (reveals a free-text input). The Salesperson dropdown and Custom input appear only when their mode is selected.

##### Epic F — Store Distribution Model (single-select, required)

* **Group Coach Freight Sorting** (badged FREE) — orders sorted by roster name and shipped in bulk to the coach/director.
* **Direct-To-Home Residential Delivery** — individual carrier rates, shipped to each buyer.

##### Epic G — Compliance & Taxation

A single binary toggle plus conditionally-revealed fields, so tax-exempt dealers aren't burdened with extra inputs while every dealer explicitly chooses their configuration path. No automated nexus integrations — this provides basic regional protection only.

* **Collect Sales Tax** (primary binary toggle) — the single entry point for tax configuration.
* **Off (tax-exempt path):** Given the toggle is **off**, when store setup proceeds, then **no additional tax inputs are shown** and no tax is applied at checkout — keeping tax-exempt dealers unencumbered.
* **On — conditional reveal:** Given the toggle is turned **on**, when enabled, then it reveals a **numeric (presentational) Tax Rate field**, a **State dropdown** (present only while the toggle is on), and a **mandatory liability-agreement checkbox**.
* **Setting the rate:** Given the toggle is on, when the dealer either **enters the rate manually** or **selects their state from the dropdown**, then the system **populates the flat Tax Rate field** (state selection inputs that state's flat rate).
* **Regional application:** Given a configured flat rate, when buyers check out, then the tax is **output exclusively to buyers in that designated region/state** — giving dealers basic regional protection without automated nexus integration.
* **Liability gate:** Given the toggle is on, when the dealer attempts to proceed, then the **liability-agreement checkbox must be checked** (required).

‌

‌

### Metrics & Success Criteria

* Wizard completion rate >80%
* Median store setup under 10 min
* Slug-collision errors near zero
* Tax-config error rate near zero

‌

---

‌

**Dependency & Technical Constraint**

Requires shared internal team services (Team Database for logo/colors/sports/roster pull), slug uniqueness validation, a salesperson/contact directory, scheduling persistence, and live **ZIP-based AutoTax** via a third-party tax service. Database updates + third-party integration.
