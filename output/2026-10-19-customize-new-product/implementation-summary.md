# Implementation Summary — Customize New Product
Sources: input/requirements/TS-Customize New Product-161026-094448.pdf (cited as "CNP"). Cross-checked for conflicts only: TS-Store Settings (Settings Tab), TS-Store Status & Lifecycle, TS-Launch & Status Controls, TS-Store Home (Home Tab), TS-Order Management (Orders Tab), TS-Roster Management (My Team(s) Tab), TS-Store Analytics (Reports Tab).

Section refs: §Sol = The Solution, §Persona = User persona & use cases, §US = User Stories, §AC-BR / §AC-Scope / §AC-Sw / §AC-Pick = Acceptance Criteria groups (Brand resolution / Scope of the selection / Switching and enforcement / Picker and hand-off), §A1–A8, §B1–B3, §C1–C2 = epics, §Dep = Dependencies & Technical Constraints.

## 1. Scope
- In scope: brand-entitlement enforcement on the Add Products page's SOURCE pill (CNP §Sol, §A1–A8).
- In scope: the pill scopes the Customizer source chip (saved designs + saved carts) and picks which brand customizer opens (CNP §Sol, §A4).
- In scope: sport/category picker scoped to the resolved brand (CNP §B1–B3).
- In scope: hand-off to the brand customizer with store branding pre-filled, and return as a staged custom product (CNP §C1–C2).
- In scope: server-side blocking of direct routes to customizers/catalogs the dealership is not entitled to (CNP §A5).
- Entry points: store creation "Step 2 – Products" and an existing store's Products tab (CNP §Persona, §A8). ⚠ open question OI-17, OI-18
- Not affected: Stock Vault, Catalog Templates and Other stores chips are not brand-scoped (CNP §A4). ⚠ open question OI-23
- Out of scope: managing brand entitlements. Prolook admins do that in QX7 (CNP §Persona).
- Per-item configuration modal is owned by Product Catalog Management, Epic A, not by this spec (CNP §C2). ⚠ open question OI-12
- Store-state availability (Draft/Open/Closed/Archived) is not stated. ⚠ open question OI-19

## 2. Actors & Roles
- Rep: adds custom products to a store. Sees only brands their dealership is entitled to sell (CNP §Persona, §A1). ⚠ open question OI-24
- Prolook admin: owns brand entitlement in QX7. Takes no action in this flow (CNP §Persona).
- Rep variants that change behaviour: single-entitlement, multi-entitlement, zero-entitlement, and lost-access (CNP §Persona, §US).

## 3. Business Rules
- BR-1 The brand list is resolved from QX7 and filtered to the brands the rep's dealership is entitled to sell. There is no fixed list, and the count varies per user (CNP §A1, §AC-BR #1). ⚠ open question OI-4
- BR-2 Exactly one entitled brand: the pill auto-resolves to it and no brand picker is shown (CNP §A2, §AC-BR #2).
- BR-3 Exactly one entitled brand: Customize New Product opens that brand's customizer "with no intermediate step" (CNP §A2, §US #1). ⚠ open question OI-1
- BR-4 Two or more entitled brands: the rep must resolve the pill before Customize New Product will open a customizer (CNP §A3, §AC-BR #3). ⚠ open question OI-2, OI-3
- BR-5 Brand type (owned/manufactured vs licensed) is shown in the picker only where QX7 exposes it. Licensed brands are listed alongside owned/manufactured ones (CNP §A3, §US #3). ⚠ open question OI-8
- BR-6 The pill governs only the Customizer source chip and the Customize New Product button. Stock Vault, Catalog Templates and Other stores ignore it (CNP §A4, §AC-Scope #3). ⚠ open question OI-23
- BR-7 The Customizer chip returns only the resolved brand's saved designs and saved carts (CNP §AC-Scope #1). ⚠ open question OI-13
- BR-8 Server-side enforcement: a direct request to a customizer or catalog route for a brand the dealership is not currently entitled to returns access-denied, not data. Hiding the UI is not enough (CNP §A5, §AC-Sw #3). ⚠ open question OI-6
- BR-9 Server-side enforcement must ship in the same release as the UI change, not after it (CNP §A5).
- BR-10 The rep can reopen the picker at any time. The prior selection is shown but not pre-committed, so the rep must re-select explicitly (CNP §A6, §AC-Sw #1).
- BR-11 Switching brand re-scopes the Customizer chip and the customizer target. Already-staged items are unaffected (CNP §A6, §AC-Sw #2). ⚠ open question OI-5
- BR-12 Zero entitled brands: the pill and the Customizer chip show an explicit state that names the problem and directs the rep to their Prolook admin, never a silent empty list. The other three source chips keep working (CNP §A7, §AC-BR #4). ⚠ open question OI-7
- BR-13 Both entry points (store creation Step 2 and the Products tab) enforce BR-1 to BR-12 identically (CNP §A8). ⚠ open question OI-17, OI-18
- BR-14 The sport/category grid shows only templates that belong to the resolved brand (CNP §B2, §AC-Pick #1). ⚠ open question OI-9
- BR-15 Selecting a card hands off to that brand's customizer on the matching design template (CNP §B3, §AC-Pick #2).
- BR-16 When opened from this flow, the customizer pre-fills Team Name, Team Colors and Logos from the store's branding (CNP §C1, §AC-Pick #3). ⚠ open question OI-11, OI-16
- BR-17 A finished design returns as a staged custom product and is configured in the standard per-item configuration modal. That modal is the last point at which the design can change (CNP §C2, §AC-Pick #4). ⚠ open question OI-12, OI-20
- BR-18 Custom items carry a permanent design lock on commit, per Governing rule 1 (CNP §C2). ⚠ open question OI-15

## 4. Data
- Brand entitlement: list of brands per dealership, with an optional brand type (owned/manufactured, licensed). QX7 is the source of truth (CNP §Sol, §A1, §A3). ⚠ open question OI-4, OI-8
- Pill selection: the currently resolved brand, plus the prior selection, which is shown but not pre-committed (CNP §A6). Persistence scope is not specified. ⚠ open question OI-3
- Saved designs and saved carts: filtered by brand (CNP §AC-Scope #1). Owner and source system are not stated. ⚠ open question OI-13
- Sport/category templates: belong to a brand. Cards cover baseball, basketball, football, soccer, apparel, accessories and "gendered variants" (CNP §B1–B2). ⚠ open question OI-9
- Store branding passed to the customizer: Team Name, Team Colors, Logos (CNP §C1). ⚠ open question OI-16
- Staged custom product: the design returned from the customizer, held as staged until commit (CNP §C2). ⚠ open question OI-10, OI-12

## 5. Flows
- Main flow: open Add Products, the pill resolves from QX7, click Customize New Product, the sport/category picker opens (brand-scoped), select a card, the brand customizer opens on that template with branding pre-filled, the rep designs, returns, the item is staged and configured in the per-item modal, then commits (CNP §Sol, §B1–B3, §C1–C2). ⚠ open question OI-1, OI-10
- Single-brand path: the pill auto-resolves and Customize New Product goes straight into the customizer (CNP §A2). ⚠ open question OI-1
- Multi-brand path: if the pill is unresolved, the rep must choose a brand before any customizer opens (CNP §A3). ⚠ open question OI-2
- Brand switch: Change link, Choose a brand picker, explicit re-select. The chip and target re-scope and staged items stay (CNP §A1, §A6).
- Zero-entitlement path: explicit state on the pill and Customizer chip, pointing to the Prolook admin. Other chips still work (CNP §A7). ⚠ open question OI-7
- Lost-access / bookmarked-link path: the server returns access-denied and the rep sees a clear access-denied message, not a silent failure (CNP §A5, §US #7). ⚠ open question OI-5, OI-6
- Cancel or abandon inside the customizer: not specified. ⚠ open question OI-10

## 6. Integrations
- QX7: entitlement lookup per dealership, returning brands and optional brand type. Also backs the server-side check (CNP §Sol, §A1, §A5). ⚠ open question OI-4
- Customizer 3.0 (external brand design tool, "referenced but outside these files"): hand-off with brand, template and store branding, and return of the finished design (CNP §Dep, §B3, §C1–C2). ⚠ open question OI-10
- Sport/category template catalog: per-brand template source (CNP §Dep, §B2). ⚠ open question OI-9
- Product Catalog Management, Epic A: the per-item configuration modal used after return (CNP §C2). ⚠ open question OI-12

## 7. Non-Functional
- Security: entitlement is enforced server-side on every brand customizer and catalog route, regardless of UI state (CNP §A5).
- Release constraint: enforcement ships together with the UI change (CNP §A5).
- Metrics to instrument: picker-to-customizer hand-off completion and time to start a new product. No targets are given (CNP §Metrics). ⚠ open question OI-14

## 8. Acceptance Criteria
- AC-1 Given the Add Products page loads, then the SOURCE pill resolves against QX7 and offers only the dealership's entitled brands (CNP §AC-BR #1).
- AC-2 Given QX7 returns exactly one brand, then the pill auto-resolves to it and no picker is shown (CNP §AC-BR #2).
- AC-3 Given two or more brands and an unresolved pill, when the rep clicks Customize New Product, then they must choose a brand before a customizer opens (CNP §AC-BR #3). ⚠ open question OI-2
- AC-4 Given zero brands, then the pill and Customizer chip show an explicit state naming the problem and directing the rep to their Prolook admin, while Stock Vault, Catalog Templates and Other stores still work (CNP §AC-BR #4).
- AC-5 Given a resolved brand, when the rep filters to the Customizer chip, then only that brand's saved designs and saved carts are returned (CNP §AC-Scope #1).
- AC-6 Given a resolved brand, when the rep clicks Customize New Product, then that brand's customizer opens (CNP §AC-Scope #2). ⚠ open question OI-1
- AC-7 Given a resolved brand, when the rep filters to Stock Vault, Catalog Templates or Other stores, then results do not change with the brand (CNP §AC-Scope #3).
- AC-8 Given a resolved pill, when the rep reopens the picker, then the prior selection is visible but not pre-committed and must be re-selected explicitly (CNP §AC-Sw #1).
- AC-9 Given a switch to another entitled brand, when it commits, then the Customizer chip and customizer target re-scope and already-staged items stay staged and unchanged (CNP §AC-Sw #2).
- AC-10 Given a direct request to a brand customizer or catalog route the dealership is not currently entitled to, then the server returns access-denied and no catalog data (CNP §AC-Sw #3).
- AC-11 Given the sport/category picker renders, then only the resolved brand's templates are shown (CNP §AC-Pick #1).
- AC-12 Given the picker, when the rep selects a card, then they are handed off to that brand's customizer on the matching template (CNP §AC-Pick #2).
- AC-13 Given the customizer opens from this flow, then Team Name, Team Colors and Logos are pre-filled from store branding (CNP §AC-Pick #3). ⚠ open question OI-16
- AC-14 Given a finished design, when the rep returns, then the item is staged as a custom product and configured in the standard per-item modal, the last point where its design can change (CNP §AC-Pick #4).
- AC-15 Given Step 2 of store creation or an existing store's Products tab, then AC-1 to AC-10 behave identically (CNP §A8). ⚠ open question OI-18

## 9. Dependencies & Assumptions
- Depends on QX7 exposing per-dealership brand entitlements, with brand type where available (CNP §Sol, §A1, §A3). ⚠ open question OI-4
- Depends on the external Customizer 3.0 and a per-brand sport/category template catalog (CNP §Dep). ⚠ open question OI-9, OI-10
- Depends on Product Catalog Management, Epic A (configuration modal) and "Governing rule 1" (design lock). Neither is in the input set (CNP §C2). ⚠ open question OI-12, OI-15
- Interacts with the store launch gate ("≥1 product added") and the render gate in other specs (Store Status & Lifecycle §Epic A; Store Home §C-09/C-10/C-11). ⚠ open question OI-20
- Interacts with MOQ shipping groups when one store carries several brands (Order Management §Epic B). ⚠ open question OI-21
- Interacts with third-party vendor / seller scope settings (Store Settings §Epic G). ⚠ open question OI-22

## Open items
All items below were sent to consolidator-customize-new-product. Questions are in output/2026-10-19-customize-new-product/clarification-questions.md.
- OI-1 CONFLICT: single-brand rep skips straight to the customizer (A2) vs Customize New Product always opens the sport/category grid (B1).
- OI-2 AMBIGUOUS: what the UI does when a multi-brand rep clicks Customize New Product with an unresolved pill.
- OI-3 GAP: default pill state for multi-brand reps and how long the selection persists.
- OI-4 GAP: QX7 API contract, failure/timeout handling, and entitlement freshness/caching.
- OI-5 GAP: what happens to the pill and staged items when an entitlement is revoked mid-session.
- OI-6 GAP: access-denied message copy, UI, HTTP status and audit logging.
- OI-7 GAP: zero-entitlement copy and how the Prolook admin contact is identified.
- OI-8 AMBIGUOUS: QX7 brand-type field and values, and how type is shown in the picker.
- OI-9 GAP: template catalog source, card data, "gendered variants", and a brand with no templates.
- OI-10 GAP: Customizer 3.0 hand-off/return contract and the cancel/abandon/error paths.
- OI-11 GAP: missing or partial store branding at hand-off, and whether customizer edits write back.
- OI-12 GAP: config modal and "Governing rule 1" are out of set; the commit event and persistence of staged items are undefined.
- OI-13 AMBIGUOUS: who owns saved designs/carts and which system they come from.
- OI-14 GAP: metric targets and event definitions.
- OI-15 CONFLICT: "permanent design lock on commit" vs Settings' commercial lock on first non-cancelled order, which releases on cancellation.
- OI-16 CONFLICT: which logos and colors pre-fill the customizer (store logo, team artwork library, theme color, division color).
- OI-17 CONFLICT: "Step 2 – Products" vs League creation Step 2 = Divisions & Teams.
- OI-18 GAP: third entry point (My Team(s) → Add New Product): is it enforced, and is the product auto-assigned?
- OI-19 GAP: Customize New Product availability by store state (Archived read-only, Closed, launched lock list).
- OI-20 AMBIGUOUS: whether staged items count toward the launch gate, and whether they pass the render gate.
- OI-21 GAP: MOQ thresholds, fees and shipping groups across multiple brands/manufacturers.
- OI-22 AMBIGUOUS: licensed brand vs third-party vendor / seller scope.
- OI-23 CONFLICT: Other stores, Catalog Templates and Create Template can bring in unentitled-brand products.
- OI-24 AMBIGUOUS: which roles can use the flow, and whether entitlement comes from the rep's dealership or the store's.
