# Implementation Summary — Store Settings (Settings Tab)
Sources: `input/requirements/TS-Store Settings (Settings Tab)-161026-094514.pdf` (cited as "Settings"; § = Epic, p = page).
Cross-checked against: Store Status & Lifecycle ("Lifecycle"), Launch & Status Controls ("Launch"), Order Management ("Orders"), Roster Management ("Roster"), Store Analytics ("Analytics"), Store Home ("Home"), Customize New Product ("CNP").

## 1. Scope
- In scope: Settings tab of the store workspace, where the rep edits store information after creation (Settings p2, §A).
- Seven-section sticky left sub-nav, in this order: General, Schedule & Status, Team & Roster, Store Customization & Design, People & Access, Distribution & Fulfillment, Catalog & Decoration. Catalog & Decoration is conditional (Settings §A p6).
- Each card is read-only with a pencil-edit affordance that opens a focused modal. Field types and conditional logic mirror Step 1 — Basics (Settings §A p6).
- Section contents (Settings p3-4, §A p6-8):
  - General: Store Details card, plus League/Team Manager Information card.
  - Schedule & Status: Active Order Window card (with Order Window Scheduler and repeating close dates), Store Status card (Close/Re-open, Create Template, Danger Zone → Archive), and Store Close Report.
  - Team & Roster: Roster Rules card and Jersey Number Selection card.
  - Store Customization & Design: Store Theme Color card and Announcement Message card. League stores also get per-division and per-standalone-team overrides.
  - People & Access: Team Manager portal invites.
  - Distribution & Fulfillment: Fulfillment Method card (including the ship-to destination), plus Team Manager & Order Fulfillment Mapping. "Nothing else lives here."
  - Catalog & Decoration: seller scope and art policy, shown only when a third-party vendor is enabled.
- In scope (new): store theme color, limited to buttons and accents. Full theming is out of scope (Settings p2, §I).
- Out of scope: store deletion. Archiving is the terminal action (Settings §C).
- Buyer-facing rendering of the banner and theme is owned by the Storefront Announcement Banner spec, not this spec (Settings §I).
- Section count ⚠ open question OI-27 (other specs still call this the "Detail tab").

## 2. Actors & Roles
- Rep (store manager): edits all settings. Fully editable in Draft; partly locked after launch, with the lock list still TBD (Settings §B). ⚠ open question OI-1, OI-15
- Owning rep: only the owner can Archive. The Danger Zone is hidden for manager-role users (Settings §C). ⚠ open question OI-16
- Team manager (portal invitee): slimmed portal with exactly two areas, Reporting and Rosters, scoped to one store. No products, orders, settings or vault (Settings §A2b).
- Team manager: receives the manager version of the Store Close Report while their access is active (Settings §A2b, §H). ⚠ open question OI-13
- Buyer: sees the storefront footer contact, the announcement banner, the theme accent, and closed/archived screens (Settings §A2, §C, §D, §I).
- Prolook support: the only party who can undo an archive (Settings §C). ⚠ open question OI-16
- Team Database: external source of team branding and coach records. Read-only from Team Stores (Settings §A1).

## 3. Business Rules
**General — Store Details**
- BR-1: Store Details read view shows Store Name, Store Type (Individual Team Store / League Store), Team Name, Sport, Team Logo and Team Colors, the Team Fundraising three-state pill, and the Store Point of Contact (each channel with its mode and resolved value) (Settings §A p6-7).
- BR-2: The Edit Store Details modal edits Store Name, Team Name, Team Branding & Sport (connect-to-team, Logo drop zone, Colors, Sports multi-select), the Roster Rules and Team Fundraising toggles, Compliance & Taxation, and Store Point of Contact (Settings §A p7). ⚠ open question OI-9
- BR-3: Collect Sales Tax toggle. When on, show a searchable State select that filters type-ahead on state name and two-letter postal abbreviation. Selecting a state auto-fills a read-only flat Tax Rate %. Reuses Step 1's state→flat-rate lookup and liability agreement (Settings §A p7, Dependencies p23).

**Connect-to-team & coach import (§A1)**
- BR-4: Bound store shows a "Connected — [Team Name]" banner with a Change Team action. Unbound store shows "Import Team Profile" with Connect to Team (Settings §A1 p8).
- BR-5: Change Team re-imports Team Logo, Team Colors and Sports from the new team. It also re-derives the theme color, but only where the color is still on the team default (Settings §A1 p8, §I). Post-launch availability of Change Team is undecided. ⚠ open question OI-2
- BR-6: Coach import: nothing is imported silently. Records are shown in full and can be multi-selected. Imported records are point-in-time copies that never write back to, or live-sync from, the Team Database (Settings §A1 p8).
- BR-7: A connect only adds managers. No existing record is overwritten, demoted or deleted (Settings §A1 p8).
- BR-8: On re-bind, show a prompt listing existing managers imported from the previous team, with keep/remove for each. Hand-entered records are never listed (Settings §A1 p8-9).
- BR-9: In that re-bind prompt, managers with an active or pending invite are named, with a note that removing the record does not revoke portal access (Settings §A1 p9).
- BR-10: Re-bind cannot remove the primary until another record is designated primary. Point-of-contact changes are stated, with resolved values, before saving (Settings §A1 p9).
- BR-11: If the store is already connected, the current team's coaches can be selected without re-binding (mid-season changes) (Settings §A1 p9). ⚠ open question OI-3, OI-21
- BR-12: Importing a coach creates a contact record only. No account, email, invite or portal access. This is the absolute rule for the feature (Settings §A1 p9, Dependencies p24).

**Store Point of Contact (§A2)**
- BR-13: Email channel: Team Manager Email (default), Salesperson Email, or Custom Email. Phone channel: Team Manager Phone (default), Salesperson Phone, or Custom Phone. Each channel's mode is set independently (Settings §A2 p9-10). ⚠ open question OI-10
- BR-14: Team Manager mode inherits live from the primary manager record; it is not a copy. In the modal the value is read-only and links to the manager card. Non-primary records never feed the point of contact (Settings §A2 p10).
- BR-15: When the primary's Email or Phone changes, the storefront footer updates with no further action. This binding does not extend to the Team Database (Settings §A2 p10).
- BR-16: Blank-value guard: when a channel is on Team Manager mode and the primary's field is empty, saving shows an inline error. The rep must fill the field or switch the channel to Salesperson/Custom. This applies to imported records too (Settings §A2 p10).

**People & Access (§A2b)**
- BR-17: Invite form has an email field and a Send Invite button. The button is disabled until the address validates; Enter submits. On send, the row is added and a toast confirms. The invitee receives an email link to set a Team Manager Portal password (Settings §A2b p10).
- BR-18: Manager records are never invitations. Access comes only from an explicit invite. Any manager record with an email offers Invite against it, whether imported or typed (Settings §A2b p10-11).
- BR-19: Deleting a manager record, including through the re-bind prompt, does not revoke an invite. Where the record has live access, the confirmation says so and links to People & Access (Settings §A2b p11, §A2c p12).
- BR-20: Invitee table columns are Invitee (avatar + email), Invited (date), Status, and actions. Status is Active (green, with Last login when known) or "Invited · not logged in" (amber). Empty state: "No team managers invited yet." (Settings §A2b p11).
- BR-21: Row actions: View portal as (active rows), Resend (pending rows), Revoke (every row). Revoke confirms access loss for Reporting and Rosters, notes that re-invite is possible, then removes the row and shows a toast (Settings §A2b p11).
- BR-22: Revoking access also removes the manager's Store Close Report access (Settings §A2b p11).

**Manager records (§A2c)**
- BR-23: All writers update one manager collection: Step 1 (Epic E), coach import, and this card. Origin creates no record classes, and records are identical for primary eligibility, invites and mapping (Settings §A2c p11). ⚠ open question OI-19
- BR-24: Fields are First Name, Last Name, Email, Phone Number, Street Address (street/apt, city, state, ZIP) and Contact Preference (Email/Phone chips). Any non-primary record can be added or removed (Settings §A2c p11, §A p7).
- BR-25: Edits to imported records apply to this store only and never write back to the Team Database (Settings §A2c p11).
- BR-26: Exactly one primary exists at all times. Designating a new primary demotes the old one and immediately repoints the Team Manager-mode footer. This is stated before save (Settings §A2c p11-12). ⚠ open question OI-20
- BR-27: Removing the primary is blocked until another record is designated primary (Settings §A2c p12).
- BR-28: Every manager record carries an address, used for fulfillment routing (Settings §A2c p12). ⚠ open question OI-4

**Fulfillment (§A3)**
- BR-29: Method is either Ship to Team Manager (FREE) or Direct-To-Home Residential Delivery, each shown with icon, badge and helper copy. Mirrors Step 1 Epic F (Settings §A3 p12, §A p7).
- BR-30: The ship-to destination (street/apt, city, state, ZIP) is shown, editable and clearable only for Ship to Team Manager. It is hidden for Direct-To-Home (Settings §A3 p12).
- BR-31: The destination is one field shared with Step 1 Epic F and the primary manager record, never a copy. The freight gate reads it (Settings §A3 p12-13, Dependencies p25). ⚠ open question OI-8
- BR-32: The destination can be chosen from saved workspace Pick-up Locations, or typed manually; both write the same field and the rep can switch freely. With no saved locations, manual entry works plus a prompt about saving locations (Settings §A3 p12).
- BR-33: A selected Pick-up Location is held as a reference. Workspace edits propagate. If the location is switched off, the store shows "No destination address" and is blocked at the freight gate (Settings §A3 p12).
- BR-34: Clearing the destination is allowed and saves. The card then shows "No destination address" and states that pending orders cannot be submitted until an address exists (Settings §A3 p13). ⚠ open question OI-23
- BR-35: Every entered address, including those from coach import, is verified against the map service before it is accepted (Settings §A3 p13).
- BR-36: Order Fulfillment Mapping appears only for League stores on Ship to Team Manager. It mirrors the My Team(s) division/team structure live. Per-division modes are league manager, single division manager, or individual team managers with per-team overrides (Settings §A3 p13).
- BR-37: Mapping manager records need First/Last Name, Email, 10-digit Phone and Address (required). The picker draws on the existing manager collection (Settings §A3 p13).
- BR-38: Incomplete assignments, or an assigned manager with no address, block pending-order submission. The header shows "n division · m team" counts. My Team(s) jump-ins open the right division, switching to individual-teams mode when a specific team was targeted (Settings §A3 p13).

**Team Fundraising master (§A4)**
- BR-39: An item's fundraising renders only when both the store flag and the item toggle are on. The per-item toggle can narrow but never widen (Settings §A4 p13-14).
- BR-40: Enabling at store level makes the Fundraising input available. New items then default their toggle to on (Settings §A4 p13). ⚠ open question OI-12
- BR-41: Switching off opens an interstitial, and nothing applies until the rep confirms (Settings §A4 p14). It has two lists:
  - "Will be disabled": every product and bundle with fundraising on, with name and current amount.
  - "Cannot be disabled": items already ordered, with the reason. This list is omitted when empty.
  - Cancel reverts the toggle. Confirm disables the first list only (Settings §A4 p14).
- BR-42: If no item has fundraising on and none is exempt, the interstitial is skipped (Settings §A4 p14).
- BR-43: Disabling never clears stored amounts, whether at store or item level (Settings §A4 p14).
- BR-44: Re-enabling restores each item's own prior flag and amount. Items that were off before the disable stay off (Settings §A4 p14).
- BR-45: Commercial lock: items with a non-cancelled order keep collecting, and the store-level disable cannot override this. If all orders on an exempt item are later cancelled, the disable then applies to it automatically (Settings §A4 p14-15).
- BR-46: The card pill has three states (Settings §A4 p15):
  - Enabled: shows a count of collecting items.
  - Disabled: nothing collecting.
  - Disabled with exemptions: "n items still collecting", with a link to the Products tab filtered to those items.

  The Fundraising Report is hidden only in plain Disabled (Settings §A4 p15; Analytics §D).

**Store state (§B, §C, §D)**
- BR-47: Draft: every setting is editable (Settings §B p15).
- BR-48: Launched: a TBD subset of fields locks (Settings §B p15). ⚠ open question OI-1, OI-15, OI-22
- BR-49: Decided exemptions that stay editable after launch: Store Point of Contact, ship-to destination, Team Fundraising, the manager collection, and both Store Customization & Design controls (Settings §B p15-16).
- BR-50: Archive is owner-only, from the Danger Zone (Settings §C p16). The confirmation lists the consequences:
  - The storefront is hidden immediately.
  - New orders stop and any active window closes.
  - The store is removed from the active list.
  - History and reports are retained.
  - Only support can undo it.

  (Settings §C p16) ⚠ open question OI-16
- BR-51: An archived storefront URL shows a neutral "This store is closed" screen. The workspace becomes read-only: the Status card shows an Archived pill and the close/archive actions are hidden (Settings §C p16; Lifecycle §E-F).
- BR-52: Close is manual (Close Store with a confirmation modal) or automatic at the configured close date. A closed storefront shows "This store is closed" with no shopping or checkout. The workspace stays fully editable (Settings §D p17). ⚠ open question OI-17
- BR-53: Edits made while closed go live only after a manual Re-open (Settings §D p17; Lifecycle §D). ⚠ open question OI-11
- BR-54: The Store Status card offers Create Template, which saves products, pricing and settings as a reusable blueprint (Settings §D p17).

**Order window (§E)**
- BR-55: Active Order Window card variants (Settings §E p17):
  - Every store: shows total $ raised, team avatar and name.
  - Set window: progress bar between open and close dates, with a days-left pill that turns red in the final 7 days and reads "Closed" once closed.
  - Always-on: "Always open" pill.

  (Settings §E p17) ⚠ open question OI-25
- BR-56: The Edit Store Schedule modal toggles between Set window (Opens/Closes date pickers) and Always open (Settings §E p17).
- BR-57: Order Window Scheduler: scheduling at store level or per team code. Searchable, status-sorted table with start/end/timezone per row, multi-select bulk apply (with an "only unset" option), status counts, and coverage-gap detection for days with no team open (Settings §E p17). ⚠ open question OI-18
- BR-58: League stores can set a repeating close cadence: Weekly, Every 2 weeks, Monthly, or End of season. The next close date is derived from the current one (Settings §E p18). ⚠ open question OI-17

**Team & Roster (§F)**
- BR-59: Allow Duplicate Numbers is a bulk write to every roster in the store. Each roster may override it, and the store value never re-overrides a roster. Validation always reads the roster's own value (Settings §F p18; Roster §4).
- BR-60: When rosters disagree, the control shows a mixed state with a divergence count and a link to My Team(s). New rosters, including those created during store creation, inherit the current store value once at creation (Settings §F p18).
- BR-61: Jersey Number Selection has two exclusive modes (Settings §F p18):
  - Team manager chooses on behalf of players: numbers assigned on the roster, no entry at checkout.
  - Players choose their own: buyers enter a number on the product page.

  Changing the mode saves immediately with a toast (Settings §F p18).
- BR-62: Team & Roster values are the same store-level fields written by Step 1 Epic D1. No creation-time copy exists (Settings §F p18).

**Catalog & Decoration (§G)**
- BR-63: The section and its nav entry render only when the store's third-party-vendor flag is on. Prolook-only stores see six sections. Contents: seller scope (which sellers' catalogs may be used), and art policy, whose default blocks publishing until art is cleared (Settings §G p18-19). ⚠ open question OI-26

**Store Close Report (§H)**
- BR-64: Generated when the store enters Closed, manually or by schedule. Auto-presented once on the rep's next workspace return; dismissible; afterward reachable from the Store Status card. It blocks nothing (Settings §H p19). ⚠ open question OI-14
- BR-65: The team-manager variant is scoped to that manager's team, shows team revenue and fundraising, excludes dealer profit, and is visually distinct (Settings §H p19). ⚠ open question OI-13, OI-5
- BR-66: Re-open followed by a new close generates a new report and keeps the prior one. Archiving generates no report, and existing reports stay viewable (Settings §H p19).

**Store Customization & Design (§I)**
- BR-67: The Theme Color read view shows a swatch with its source (Team default or Custom). It uses the Prolook color picker; no bespoke picker is built. Helper copy says it applies to buttons and accents only (Settings §I p20). ⚠ open question OI-6
- BR-68: The theme color defaults to the connected team's primary color. Change Team re-derives it only while the source is Team default; a Custom color survives. "Reset to team color" restores the default and re-arms re-derivation (Settings §I p20).
- BR-69: The Announcement Message is rich text, read view rendered (not markup), edited in a modal editor. The placeholder shows a worked example (dates, deadlines, returns, sizing, shipping) and is never saved. Empty state: the storefront shows no banner (Settings §I p20). ⚠ open question OI-7
- BR-70: The message is one store-level field shared with Step 1 Epic H. Saving updates a live storefront without a republish. It is not validated against the order window (Settings §I p21). ⚠ open question OI-11
- BR-71: League stores only: each division and standalone team can have an optional message override. Teams inside a division inherit the division's. Scopes without a message show as "inheriting", not as empty. The list is searchable with multi-select bulk apply (Settings §I p21).
- BR-72: Per-division toggle applies the division's existing brand color (set in My Team(s)) to shoppers resolved to that division. No color is stored here (Settings §I p21).
- BR-73: Deleting a division drops its message and applied color. Its teams then resolve to store level unless they have their own (Settings §I p21).

## 4. Data
- Settings section key: one key per section, used for deep links (for example My Team(s) → manager mapping, Home routes). Keys must stay stable when sections are added (Settings Dependencies p23; Home Dependencies).
- Store: name, type, team name, sports, logo, colors, bound team reference, collect-tax flag, state, flat tax rate %, fulfillment method, destination (an address value or a Pick-up Location reference), third-party-vendor flag, status (draft/open/closed/archived) (Settings §A, §A3, §G).
- Point of contact: mode per channel, persisted independently for Email and Phone, plus custom values (Settings Dependencies p25). ⚠ open question OI-10
- Manager record: first/last name, email, phone, address, contact preference, primary flag, and a source-team reference on imported records (none on typed records). The collection has no access side effects (Settings Dependencies p24-25). ⚠ open question OI-4, OI-20
- Invite record (per store): email, invited date, status, last login. Independent of manager records (Settings §A2b, Dependencies p26).
- Fundraising: per-item flag and amount (amount always preserved), prior-flag snapshot taken at a store-level disable, and a derived three-state read (Settings Dependencies p24).
- Theme color: value plus a source flag (team-derived or rep-selected). The flag cannot be inferred from the value (Settings Dependencies p24).
- Announcement: store-level sanitized rich text, plus optional message fields on division and standalone-team records. A division also has an "apply brand color" flag (Settings Dependencies p25).
- Duplicate-number rule: stored per roster (authoritative). The store control is a bulk write plus a mixed-state read (Settings Dependencies p26; Roster Dependencies).
- Jersey number selection mode: store-level, read by the roster editor and the buyer product page (Settings Dependencies p26).
- Order windows: store-level open/close dates or always-on, per-team-code windows with timezone, and a repeating cadence (Settings §E, Dependencies p26). ⚠ open question OI-18
- Close Report: one record per close event, a per-rep seen/dismissed flag, and a manager projection (Settings Dependencies p26). ⚠ open question OI-13

## 5. Flows
- Edit any card: open the card, click the pencil, edit in the modal, validate, save, and the read view refreshes (Settings §A).
- Re-bind team:
  1. Edit Store Details, then Change Team.
  2. Pick a team in the picker. Branding re-imports and the theme color re-derives if it is still on default.
  3. Select coaches to append.
  4. Prompt shows old-team imported managers to keep or remove, calling out those with portal access.
  5. A primary removal is blocked, and point-of-contact changes are shown.
  6. Save.

  (Settings §A1)
- Disable fundraising: switch the toggle off. If there is anything to review, the interstitial shows both lists; Cancel reverts, Confirm bulk-clears the non-exempt flags and keeps amounts and prior state. If there is nothing to review, the change applies directly (Settings §A4).
- Clear destination: save succeeds, the card shows "No destination address", and the freight gate blocks submission until an address is supplied (Settings §A3).
- Invite: enter email, Send Invite, row appears as "Invited · not logged in", invitee sets a password, row becomes Active. Revoke: confirm, row removed, close-report access also removed (Settings §A2b).
- Close: Close Store (with confirmation), or the scheduled date arrives. The storefront locks and the Close Report is generated and auto-presented on the next workspace entry. Re-open republishes edits (Settings §D, §H).
- Archive (owner only): confirmation modal, storefront hidden, workspace read-only, support-only undo (Settings §C).

## 6. Integrations
- Team Database: team branding and coach records, returned in the same payload on connect. Read-only, with no live binding (Settings §A1, Dependencies p24).
- Map/address verification service: verifies typed, imported and destination addresses before acceptance (Settings §A3).
- Workspace Pick-up Locations service (workspace-scoped): list and reference saved locations (Settings §A3, Dependencies p25).
- Tax service: state→flat-rate lookup (Settings Dependencies p23).
- Salesperson/contact directory, used for the Salesperson point-of-contact modes (Settings Dependencies p23). ⚠ open question OI-10
- Email: Team Manager Portal invite with password-set link (Settings §A2b). ⚠ open question OI-24
- Products tab: per-item fundraising toggle and commercial lock (Products Governing rules 1 and 3, referenced) (Settings §A4).
- Order Management: pending-order freight gate reads the destination and mapping (Settings §A3; Orders §B).
- Reports tab: three-state fundraising read gates the Fundraising Report (Settings §A4; Analytics §D).
- Storefront: footer contact, banner, theme tokens, closed screen (Settings §A2, §I, §C-D).
- System Modals & Toasts: registers the fundraising interstitial and the announcement editor modal (Settings §A4, §I).

## 7. Non-Functional
- Security: the announcement renderer strips script, embed, iframe and event-handler content rather than escaping it. Rep-authored content is not trusted input (Settings Dependencies p25).
- Security: no code path may infer, create or revoke portal access from manager records (Settings Dependencies p24).
- Theme color is applied through token-level indirection scoped to buttons and accents, not as a global brand-color override (Settings Dependencies p24-25).
- Storefront reads live store state, so announcement, theme, footer and destination edits propagate without a republish (Settings Dependencies p25).
- Deep-link section keys must stay stable (Settings Dependencies p23).
- Compliance: collecting sales tax requires the liability agreement from Step 1 (Settings Dependencies p23).

## 8. Acceptance Criteria
- AC-1: Settings renders the seven-section sub-nav in the order given in §1. Catalog & Decoration and its nav entry are absent when the third-party-vendor flag is false (Settings §A, §G).
- AC-2: Given a bound store, when Edit Store Details opens, then the "Connected — [Team Name]" banner with Change Team is shown. Unbound stores show "Import Team Profile" (Settings §A1).
- AC-3: Given coaches selected on reconnect, when saved, then they are appended and no existing record is overwritten, demoted or deleted (Settings §A1).
- AC-4: Given a re-bind, then managers imported from the old team are listed for keep/remove; typed records are not listed; managers with active or pending invites are named with the no-revoke note (Settings §A1).
- AC-5: Given a store already connected, when the connect component opens, then the current team's coaches are selectable without re-binding (Settings §A1).
- AC-6: Importing a coach creates no account, email, invite or entitlement (Settings §A1, Dependencies p24).
- AC-7: Given a Team Manager-mode channel, when the primary's email or phone changes, then the storefront footer updates with no further action (Settings §A2).
- AC-8: Given a Team Manager-mode channel with an empty primary field, when the rep saves, then an inline error routes to the manager card or to a mode switch (Settings §A2).
- AC-9: Send Invite stays disabled until the email validates. On send, the row and a toast appear (Settings §A2b).
- AC-10: Given a manager record is deleted, then any invite for that person remains active until revoked in People & Access (Settings §A2b).
- AC-11: Revoke confirms, removes the row, shows a toast, and removes close-report access (Settings §A2b).
- AC-12: The collection always has exactly one primary. Removing the primary is blocked until another is designated, including from the re-bind prompt (Settings §A2c).
- AC-13: Given a primary re-designation, then the footer repoints immediately, and the modal states this before saving (Settings §A2c).
- AC-14: Editing an imported manager never writes to the Team Database (Settings §A2c).
- AC-15: Given Ship to Team Manager, the card shows the destination with edit and clear. Given Direct-To-Home, no destination is shown (Settings §A3).
- AC-16: Given a cleared destination, the save succeeds, the card shows "No destination address" with the consequence, and pending-order submission is blocked (Settings §A3).
- AC-17: Given a saved Pick-up Location is selected and later edited at workspace level, the store's destination reflects the edit. If it is switched off, the store shows "No destination address" (Settings §A3).
- AC-18: Typed and imported addresses are both verified by the map service before acceptance (Settings §A3).
- AC-19: Order Fulfillment Mapping renders only for League stores on Ship to Team Manager. Incomplete assignments block pending-order submission (Settings §A3).
- AC-20: Given Team Fundraising on, when switched off, then the interstitial lists items to be disabled (with name and amount) and exempt items (with reason). Cancel writes nothing (Settings §A4).
- AC-21: Given no fundraising-enabled items and no exemptions, the toggle applies without the interstitial (Settings §A4).
- AC-22: Given a store-level disable followed by a re-enable, every item returns to its pre-disable flag with its preserved amount (Settings §A4).
- AC-23: Items with a non-cancelled order keep fundraising after a store-level disable. When all their orders are cancelled, the disable applies to them (Settings §A4).
- AC-24: The Store Details pill shows Enabled / Disabled / Disabled · n items still collecting, with a link to filtered Products (Settings §A4).
- AC-25: Given a Draft store, every setting is editable (Settings §B).
- AC-26: Given a launched store, Point of Contact, destination, Team Fundraising, manager collection, Theme Color and Announcement all remain editable (Settings §B).
- AC-27: Archive Store appears only to the owning rep. The confirmation lists the consequences. After archiving, the storefront serves "This store is closed" and the workspace is read-only with an Archived pill (Settings §C).
- AC-28: Given a closed store, the storefront shows the closed page and the workspace stays editable. Edits go live only after Re-open (Settings §D).
- AC-29: The days-left pill turns red inside the final 7 days and reads "Closed" once closed. Always-on stores show "Always open" (Settings §E).
- AC-30: Coverage-gap detection flags any day between sequential team-code windows with no team open (Settings §E).
- AC-31: Setting Allow Duplicate Numbers writes to every roster. A later roster override is never overwritten by the store value. Divergence shows a mixed state with a count and a link (Settings §F).
- AC-32: Changing the Jersey Number Selection mode saves immediately and shows a toast (Settings §F).
- AC-33: A value set in Step 1 for Team & Roster, the announcement, or the destination appears unchanged in Settings (Settings §F, §I, §A3).
- AC-34: On close, the Close Report auto-presents once on the next workspace entry, is dismissible, and stays reachable from the Store Status card. Re-open plus re-close creates a new report and keeps the old one. Archive creates none (Settings §H).
- AC-35: The theme color defaults to the team primary color. Change Team re-derives it only while it is on Team default. A Custom color survives. Reset restores Team default (Settings §I).
- AC-36: An empty announcement means no storefront banner. The placeholder is never saved. Saving on a launched store updates the banner without a republish (Settings §I).
- AC-37: League stores list divisions and standalone teams for overrides; Individual stores show none. Scopes without a message show as inheriting (Settings §I).
- AC-38: Deleting a division drops its message and its applied color (Settings §I).

## 9. Dependencies & Assumptions
- Reuses Step 1 — Basics field sets and validation for Epics D1, D2, E, F and H (Settings Dependencies p23).
- Depends on the Products tab: per-item fundraising toggle, commercial lock, and an addressable filter for exempted items (Settings §A4; Home Dependencies).
- Depends on the Pick Up Locations spec (Governing rule 3, Epic C) and the Storefront Announcement Banner spec (render, contrast, limits) (Settings §A3, §I).
- Team Database must return coach records in the same payload as branding. Its coach schema (address, role/title) is open (Settings Dependencies p24). ⚠ open question OI-4
- Lifecycle, Analytics and Home consume Settings state: status, close report, three-state fundraising, section keys (Lifecycle; Analytics §D; Home §C, §F).
- The lock list must be final before build (Settings §B). ⚠ open question OI-1

## Open items
All questions are tracked in `output/2026-10-19-store-settings/clarification-questions.md`.
- ⚠ OI-1 Post-launch lock list TBD (Settings §B)
- ⚠ OI-2 Re-bind permitted after launch? (Settings §B)
- ⚠ OI-3 "Add from Team Database" on manager card (Settings §A1)
- ⚠ OI-4 Team Database coach schema: address, role (Settings §A2c)
- ⚠ OI-5 Close Report metric set, manager-version delivery (Settings §H)
- ⚠ OI-6 Theme color contrast warn/block (Settings §I)
- ⚠ OI-7 Announcement character limit and permitted marks/links (Settings §I)
- ⚠ OI-8 Destination address vs primary manager address data model (Settings §A3, §A2c)
- ⚠ OI-9 Roster Rules editable in Edit Store Details as well as Team & Roster? (Settings §A)
- ⚠ OI-10 Salesperson point-of-contact source and binding (Settings §A2)
- ⚠ OI-11 Announcement live on a closed store vs closed-store publish rule (Settings §I vs §D; Lifecycle §D)
- ⚠ OI-12 Fundraising default for items added while store-level is off (Settings §A4)
- ⚠ OI-13 Close Report manager variant vs full parity (Settings §H vs Lifecycle)
- ⚠ OI-14 Close Report format, Team Profit, entry point (Settings §H vs Lifecycle vs Analytics)
- ⚠ OI-15 Does the post-launch lock apply to Open/Closed? (Settings §B vs Lifecycle, Launch)
- ⚠ OI-16 Archive reversal actor; archive from Draft (Settings §C vs Lifecycle)
- ⚠ OI-17 Auto-close with per-team-code windows and repeating cadence (Settings §E vs Lifecycle §C)
- ⚠ OI-18 Scheduler keyed on backend-only team codes (Settings §E vs Roster)
- ⚠ OI-19 Other writers of the manager collection (Settings §A2c vs Home, Orders, Roster)
- ⚠ OI-20 "Primary" vs "Point of Contact" label and designation surface (Settings §A2c vs Home §F)
- ⚠ OI-21 Add from Team Database: open vs decided (Settings §A1 vs Home §F)
- ⚠ OI-22 Team Logo/Colors editable after launch (Settings §B vs Home §J)
- ⚠ OI-23 Freight gate behaviour on a missing destination (Settings §A3 vs Orders §B)
- ⚠ OI-24 Which managers receive the launch email (Launch vs Settings §A2c)
- ⚠ OI-25 "Total raised" means revenue or fundraising (Settings §E vs Home §E, Analytics)
- ⚠ OI-26 Catalog & Decoration fields; seller scope vs QX7 brand entitlement (Settings §G vs CNP)
- ⚠ OI-27 "Detail tab"/"Pause" naming vs Settings → Store Status (Lifecycle, Launch vs Settings)
