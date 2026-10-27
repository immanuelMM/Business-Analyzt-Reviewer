# Implementation Summary — Launch & Status Controls

Sources: input/requirements/TS-Launch & Status Controls-161026-094523.pdf (L&S). Cross-checked for conflicts only, against every other input file: TS-Store Status & Lifecycle-161026-094525.pdf (Lifecycle), TS-Store Settings (Settings Tab)-161026-094514.pdf (Settings), TS-Store Home (Home Tab)-161026-011919.pdf (Home), TS-Roster Management (My Team(s) Tab)-161026-092450.pdf (Roster), TS-Order Management (Orders Tab)-161026-094455.pdf (Orders), TS-Store Analytics (Reports Tab)-161026-094501.pdf (Reports), TS-Customize New Product-161026-094448.pdf (Customize). This summary covers only L&S; the other files are cited only where they conflict with it.

References use `(Doc §Section)`. L&S has no numbered sections, so `§AC <name>` points to the bold label of an acceptance criterion. Open items are tracked in `clarification-questions.md` in this folder under the same OI-IDs.

## 1. Scope

**In scope**
- New stores start as Draft (L&S §Solution, §AC Draft on creation).
- LAUNCH STORE control in the workspace header, gated on ≥1 product added (L&S §AC Gate). ⚠ open question OI-1
- "Launch Team Store" confirmation modal and "Your store is now live!" success modal (L&S §AC Launch confirmation modal, §AC Launch).
- Launch notification email and onboarding-milestone event (L&S §AC Launch confirmation modal, §Dependencies). ⚠ open question OI-6, OI-8, OI-17, OI-18
- Post-launch header: Preview Store button plus a store menu with Create Template (L&S §AC Live header controls). ⚠ open question OI-4, OI-5
- Status semantics (Open / Closed) and the status read model shown on dashboard store cards and the Stores-tab filter (L&S §AC Status semantics, §AC Status surfaces).

**Owned elsewhere (referenced, not built here)**
- The Close / Re-open actions on the Store Status card. This doc only points to them (L&S §AC Status semantics). ⚠ open question OI-3
- Full lifecycle rules (auto-close, archive, buyer closed screen, Close Report) belong to Store Status & Lifecycle, which this doc defers to for status names (L&S §AC Status semantics).
- Archived Stores section on the Account page (L&S §AC Status surfaces). ⚠ open question OI-13

**Out of scope (explicit)**
- Roster gate at launch: "no roster gate applies at launch" (L&S §AC Gate).
- Basics-completeness checks at launch. These are enforced upstream by the creation wizard's per-step validation (L&S §AC Gate).
- Pause/resume controls in the workspace header (L&S §AC Status semantics).

## 2. Actors & Roles

- **Rep / store owner**: launches, previews, creates templates, closes and re-opens (L&S §Persona, §User Stories). ⚠ open question OI-14 (owner vs co-managing rep vs team-manager role vs Roster's "league directors" is undefined)
- **Players (rostered)** and **team manager**: receive the launch email (L&S §AC Launch confirmation modal, §Dependencies). ⚠ open question OI-6, OI-17, OI-18
- **Buyers**: can order only while the store is Open (L&S §User Stories, §AC Status semantics).

## 3. Business Rules

- BR-1: Every newly created store starts as Draft and is not live (L&S §AC Draft on creation).
- BR-2: LAUNCH STORE is disabled while the store has zero products added to its catalog (L&S §AC Gate; §Dependencies "catalog count ≥1"). ⚠ open question OI-1, OI-2
- BR-3: Disabled-state tooltip, exact copy: "Add at least one product to launch your store." (L&S §AC Gate).
- BR-4: The gate counts products added, not published. "Published" is no longer a valid term; the per-item visibility toggle replaced it (L&S §AC Gate). ⚠ open question OI-1
- BR-5: No roster gate and no Basics-completeness gate at launch (L&S §AC Gate).
- BR-6: Clicking an enabled LAUNCH STORE opens a "Launch Team Store" confirmation modal. The store does not change state until the rep confirms (L&S §AC Launch confirmation modal). ⚠ open question OI-7, OI-20 (post-launch field lock not disclosed)
- BR-7: On confirm, the status becomes Open, the success modal shows, the launch email is sent and the onboarding milestone advances (L&S §AC Launch; §Dependencies). ⚠ open question OI-15, OI-16
- BR-8: After launch, LAUNCH STORE is replaced by Preview Store and a store menu (L&S §AC Live header controls).
- BR-9: The post-launch store menu has a single option, Create Template (L&S §AC Live header controls). ⚠ open question OI-4
- BR-10: A launched store is either Open or Closed. Closed suspends ordering (L&S §AC Status semantics). ⚠ open question OI-11 ("technically equivalent to a draft")
- BR-11: Closed flips back to Open directly. Unlike a never-launched Draft, it needs no launch flow (L&S §AC Status semantics).
- BR-12: Status changes are confirmed with toasts (L&S §AC Status semantics). ⚠ open question OI-12
- BR-13: The pause/resume write path is only the Store Status card (Close Store / Re-open Store), never the workspace header (L&S §AC Status semantics; §Dependencies). ⚠ open question OI-3
- BR-14: Status names are Draft, Open, Closed, Archived. "Active" and "On Hold" are retired and must not render (L&S §AC Status semantics; Home Epic I). ⚠ open question OI-19 (Roster and Lifecycle still say "Active")
- BR-15: Archived is a fourth status. Archived stores are excluded from the Stores directory and the Stores-tab filter (L&S §AC Status surfaces). ⚠ open question OI-13
- BR-16: Status is a single shared read model. A change made anywhere shows up on every surface (L&S §AC Status surfaces; §Dependencies).

## 4. Data

- **Store.status**: enum `draft | open | closed | archived`, persisted, default `draft` on creation (L&S §Dependencies; §AC Draft on creation).
- **Store catalog count**: the number of products added, read by the launch gate (L&S §Dependencies). ⚠ open question OI-1, OI-2
- **Launch notification**: the recipient set is all rostered players plus the team manager (L&S §Dependencies). Recipient resolution, template and content are not specified. ⚠ open question OI-6, OI-17, OI-18
- **Onboarding-milestone event**: fired on launch. Name, payload and consumer are not specified (L&S §Dependencies). ⚠ open question OI-8
- **Store template**: created from the store's configuration. Schema, storage and consumers are not specified (L&S §Dependencies; Settings Epic D says "products, pricing, and settings"). ⚠ open question OI-5
- **Status read model**: consumed by dashboard-card tags and the Stores-tab filter (L&S §Dependencies). ⚠ open question OI-10 (header chip)

## 5. Flows

**Launch (main path)**
1. The rep opens a Draft store's workspace. The header shows LAUNCH STORE (L&S §AC Gate).
2. If the catalog count is 0, the button is disabled and shows the tooltip from BR-3 (L&S §AC Gate).
3. If the count is ≥1, clicking opens the "Launch Team Store" modal. The modal states that all players and the team manager get an email saying the store was created and they can buy team goods, and that the store can be closed at any time. Actions: **Cancel** / **Launch Team Store** (L&S §AC Launch confirmation modal).
4. On **Launch Team Store**, the status becomes Open, the email is sent and the onboarding milestone advances (L&S §AC Launch; §Dependencies).
5. The "Your store is now live!" modal offers **View Store** (opens the storefront) or **Stay In Editor** (closes the modal) (L&S §AC Launch). ⚠ open question OI-9
6. The header now shows **Preview Store** and the store menu (Create Template) (L&S §AC Live header controls).

**Alternate / error paths**
- **Cancel** in the confirmation modal: the store stays Draft (implied by L&S §AC Launch confirmation modal).
- Failures (status write, email send, gate no longer holding at confirm, concurrent launch): not specified. ⚠ open question OI-15
- Launch relative to a pop-up store's order-window dates: not specified. ⚠ open question OI-16

**Preview Store**
- Opens the live storefront, behaving like the former View Store link (L&S §AC Live header controls). ⚠ open question OI-9

**Create Template**
- Store menu → Create Template creates a reusable store template from this store (L&S §AC Live header controls). The rest of the flow is undefined. ⚠ open question OI-5

**Close / Re-open**
- Done on the Store Status card (Close Store / Re-open Store), with a toast confirming each change (L&S §AC Status semantics). Behaviour detail lives in Store Status & Lifecycle Epics B/D. ⚠ open question OI-3, OI-12

## 6. Integrations

- **Email / notification service**: launch email to rostered players and the team manager (L&S §Dependencies). ⚠ open question OI-6, OI-17, OI-18
- **Onboarding / milestone tracking**: launch event (L&S §Dependencies). ⚠ open question OI-8
- **Storefront**: status propagates to the storefront's open/closed behaviour. A storefront preview route is required (L&S §Dependencies). ⚠ open question OI-9
- **Template service**: a create-template flow seeded from the store's configuration (L&S §Dependencies). ⚠ open question OI-5

## 7. Non-Functional

- Consistency: every status surface reads one shared model and stays in sync (L&S §Dependencies; §AC Status surfaces).
- Launch should be reversible in practice (close at any time). The target metric is "accidental-launch reversals near zero" (L&S §Metrics).
- Analytics events to capture: launch success rate, launches blocked by the product gate, time to first product added, storefront previews from the header, templates created from launched stores (L&S §Metrics).

## 8. Acceptance Criteria

- AC-1: Given a rep creates a new store, then it is created in Draft and is not live (L&S §AC Draft on creation).
- AC-2: Given a Draft store with zero products in its catalog, when the rep views the workspace header, then LAUNCH STORE is disabled with the tooltip "Add at least one product to launch your store." (L&S §AC Gate). ⚠ open question OI-1
- AC-3: Given a Draft store with zero roster entries but ≥1 product, then LAUNCH STORE is enabled (L&S §AC Gate "no roster gate applies at launch").
- AC-4: Given an enabled LAUNCH STORE, when clicked, then the "Launch Team Store" modal appears, states the email consequence and that the store can be closed at any time, and offers Cancel / Launch Team Store (L&S §AC Launch confirmation modal).
- AC-5: Given the confirmation modal, when the rep clicks Cancel, then the store stays Draft and no email is sent (L&S §AC Launch confirmation modal, implied).
- AC-6: Given the confirmation modal, when the rep confirms, then the store status is Open, the "Your store is now live!" modal shows View Store and Stay In Editor, and the onboarding-milestone event fires (L&S §AC Launch; §Dependencies). ⚠ open question OI-8
- AC-7: Given launch is confirmed, then a notification is sent to all rostered players and the team manager (L&S §Dependencies). ⚠ open question OI-6, OI-17, OI-18
- AC-8: Given a launched store, when the workspace renders, then LAUNCH STORE is absent and Preview Store and a store menu are present (L&S §AC Live header controls).
- AC-9: Given Preview Store is clicked, then the live storefront opens, behaving like the former View Store link (L&S §AC Live header controls). ⚠ open question OI-9
- AC-10: Given the store menu is opened, then its only option is Create Template, and choosing it creates a reusable store template from this store (L&S §AC Live header controls). ⚠ open question OI-4, OI-5
- AC-11: Given a launched store, then its status is Open or Closed and is never Draft again (L&S §AC Status semantics; Lifecycle §Transitions).
- AC-12: Given a Closed store, when the rep chooses Re-open Store on the Store Status card, then the store returns to Open directly with no launch flow, and a toast confirms it (L&S §AC Status semantics). ⚠ open question OI-12
- AC-13: Given any status change, then the workspace header has no pause/resume control (L&S §AC Status semantics).
- AC-14: Given any store, then its dashboard store card shows a Draft, Open or Closed tag matching its current status (L&S §AC Status surfaces).
- AC-15: Given the Stores-tab Filter control, then Open, Draft and Closed are offered as filter values and Archived is not (L&S §AC Status surfaces).
- AC-16: Given a store is Archived, then it does not appear in the Stores directory, and its card appears only in the Archived Stores section of the Account page (L&S §AC Status surfaces). ⚠ open question OI-13
- AC-17: Given a status change on any surface, then every status surface shows the new status without a manual refresh of the other surfaces (L&S §AC Status surfaces "changing status anywhere reflects everywhere").
- AC-18: Given any status surface, then the labels "Active" and "On Hold" never render (L&S §AC Status semantics). ⚠ open question OI-19

## 9. Dependencies & Assumptions

- Store status persistence with four values, propagated to the storefront (L&S §Dependencies).
- A catalog-count read for the launch gate (L&S §Dependencies). ⚠ open question OI-1, OI-2
- A notification send service (L&S §Dependencies). ⚠ open question OI-6
- An onboarding-milestone event consumer (L&S §Dependencies). ⚠ open question OI-8
- A storefront preview route (L&S §Dependencies). ⚠ open question OI-9
- A create-template flow (L&S §Dependencies). ⚠ open question OI-5
- The Store Status card (Close / Re-open) is specified in another spec and must exist (L&S §AC Status semantics). ⚠ open question OI-3
- The Account page Archived Stores section must exist (L&S §AC Status surfaces). ⚠ open question OI-13
- The post-launch field-lock list from Settings Epic B is applied at launch (Settings Epic B). ⚠ open question OI-20
- Assumption: the creation wizard guarantees Basics completeness, so launch does not re-validate it (L&S §AC Gate).
- Assumption: Store Status & Lifecycle is authoritative for status semantics (L&S §AC Status semantics "per Store Status & Lifecycle").

## Open items

All are detailed in `output/2026-10-19-launch-status-controls/clarification-questions.md`. Every conflict cites both documents.

- ⚠ OI-1 CONFLICT: the launch gate counts "products added" (L&S §AC Gate) but "visible products" (Home C-09/C-16, Epic J).
- ⚠ OI-2 AMBIGUOUS: what counts toward the catalog count (bundles, render-pending/failed, Incomplete bundles per Home C-12), re-check at confirm, and an Open store with zero products.
- ⚠ OI-3 CONFLICT: the Store Status card sits in Settings→General (L&S), Settings→Schedule & Status (Settings §Solution, Epic D), or the Detail tab (Lifecycle Epic B/D); the button is labelled "Pause" (Lifecycle §Transitions) or Close Store.
- ⚠ OI-4 CONFLICT: Create Template is in the header store menu, post-launch only (L&S), and on the Store Status card (Settings Epic D); state availability is unclear.
- ⚠ OI-5 GAP: the Create Template flow (contents, storage, consumers, permissions, feedback) is undefined; its relation to "Catalog Templates" (Customize Epic A) is unclear.
- ⚠ OI-6 AMBIGUOUS: launch email recipient resolution (which manager, League stores, players added after launch), plus content and template (L&S; Roster §Schema; Settings Epic A2c).
- ⚠ OI-7 CONFLICT: launch needs a confirmation modal (L&S) but is "Open immediately" on click (Lifecycle Epic A).
- ⚠ OI-8 GAP/CONFLICT: the onboarding milestone is undefined, and "milestone advances" (L&S) sits against the no-progress-tracking rule (Home Epic B, Governing rule 3).
- ⚠ OI-9 AMBIGUOUS: Preview Store / View Store target, behaviour when Closed or Archived (Lifecycle Epic F), and any pre-launch preview (Home Epic A).
- ⚠ OI-10 GAP/CONFLICT: header composition. L&S has Launch, then Preview + menu; Home Epic A has a status chip, storefront URL, Preview Store and Setup Guide re-entry; Lifecycle Epic D has a header status badge.
- ⚠ OI-11 AMBIGUOUS: "Closed is technically equivalent to a draft" (L&S) vs the distinct Draft/Closed behaviour in the Lifecycle §Behavior Matrix.
- ⚠ OI-12 CONFLICT: "status changes confirm with toasts" (L&S) vs the Close confirmation modal (Lifecycle Epic B; Settings Epic D) and no confirmation on Re-open (Lifecycle Epic D); toast copy is undefined.
- ⚠ OI-13 GAP: the Account page Archived Stores section (L&S) is undefined anywhere; Lifecycle Epic E, Settings Epic C and Home Epic A cover only the read-only workspace.
- ⚠ OI-14 GAP: role permissions for Launch, Preview Store and Create Template (L&S §Persona; Lifecycle §Transitions "Rep only"; Roster §Solution "league directors").
- ⚠ OI-15 GAP: launch failure, partial-send, race and modal-dismissal paths.
- ⚠ OI-16 GAP: launch relative to the order-window Opens/Closes dates and Always open (Settings Epic E; Lifecycle Epic C; Reports Epic D "This season").
- ⚠ OI-17 CONFLICT: the launch modal promises email to "all players" (L&S) but contact email is optional, rosters are optional, and player emails must degrade (Roster §Schema, §Dependencies).
- ⚠ OI-18 CONFLICT: launch emails "the team manager" (L&S) but manager records "send no email", there can be several managers, and access is invite-only (Settings Epic A1/A2b/A2c; Home Epic F).
- ⚠ OI-19 CONFLICT: L&S retires "Active", but Roster Epic 7 and the Lifecycle Epic G "Active Stores KPI" still use it.
- ⚠ OI-20 GAP: launch triggers a TBD post-launch field lock (Settings Epic B) that the L&S launch modal and ACs don't mention.
