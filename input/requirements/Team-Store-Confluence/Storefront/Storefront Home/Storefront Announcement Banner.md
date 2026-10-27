---
title: Storefront Announcement Banner
confluence_id: 4305616902
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4305616902/Storefront+Announcement+Banner
last_modified: 2026-09-02
pulled: 2026-10-26
---
> **New — September 2, 2026.** A rep-authored announcement banner on the storefront, distinct from the system-driven [Ordering-Window Banner](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154163201/Ordering-Window+Banner). Authoring is owned by [Store General Settings (Settings Tab)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4154130493/Store+Settings+Settings+Tab), Epic I — Store Customization & Design, and by [Step 1 - Basics](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4152164609/Step+1+-+Basics), Epic H. This page owns only the buyer-facing render.

> **Dependency note.** Scope resolution on League stores keys off the storefront team selector specified in [Roster-Optional Architecture (Open Access Stores)](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4230545435/Roster-Optional+Architecture+Open+Access+Stores), Epic D. This page does **not** use the role cards or roster-email match still described in [Branded Storefront Landing & Role Selection](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153606269/Branded+Storefront+Landing) — that model was superseded by Roster-Optional Architecture and that page is pending correction.

### Executive Summary & Problem Statement

#### The Problem

A rep has no way to tell buyers anything the product catalog does not already say. Key dates, order deadlines, return policy, sizing guidance, and shipping expectations are the questions parents actually ask, and today the answers live in a coach's group text, a flyer, or nowhere. The rep absorbs the cost as repeat questions, and the buyer absorbs it as uncertainty at the moment of purchase.

The storefront does have a banner, but it cannot serve this purpose. The **Ordering-Window Banner** is generated from the store's configured schedule, carries no rep-authored content, and renders **only on Temporary Pop-Up stores** — an Always-On Locker store has no banner at all, despite having the same returns, sizing, and shipping questions.

Usability research found that reps treat store information as **setup**, not decoration: they expect a field to type it into, not a theming feature to opt into.

#### The Solution

A persistent, rep-authored **announcement banner** at the top of the storefront, rendering rich text the rep enters as the **Announcement Message** in Settings or during store creation. It carries whatever the rep needs it to carry, renders on **every store type**, and is hidden entirely when empty.

On League stores the message resolves from the shopper's selected team: a division or standalone team may carry its own message, falling back to the store-level message when it does not.

### User persona & use cases

**Who is this for?** Buyers on the storefront — players, parents/guardians, and fans. Authored by reps and team managers.

**Scenarios encountered** A parent landing on a store and needing to know the order deadline before deciding whether to wait; a parent checking whether jerseys run small before choosing a size; a fan wondering whether spirit wear can be returned; a buyer on an always-on locker store with no ordering window and therefore no schedule banner, who still needs the shipping lead time; a parent on a league store whose division has a different deadline from the rest of the league; a rep updating the deadline mid-window because the mill pushed the production date; a rep who has entered nothing and whose storefront should look untouched rather than showing an empty box.

### Functional Requirements & Core Workflows

#### User Stories

- As a buyer, I want key store information at the top of the storefront, so that I am not guessing at deadlines, sizing, returns, or shipping.
- As a buyer on an always-on store, I want that information too, so that having no ordering window does not mean having no information.
- As a parent on a league store, I want my own division's information, so that I am not reading a deadline that belongs to another division.
- As a fan with no team selected, I want the league-wide information, so that the banner is not blank for me.
- As a rep, I want the banner to disappear when I have written nothing, so that an unused feature is not visible clutter on my storefront.

##### Epic A — Render conditions and placement

- **Placement:** Given a resolved announcement message, when the storefront renders, then the banner appears at the top of the storefront content region, above the role-adaptive layout specified in [Role-Adaptive Welcome & Layout](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4155506693).
- **All store types:** Given any store type — Temporary Pop-Up or Always-On Locker, Individual Team Store or League Store — when a message is present, then the banner renders. This is the deliberate difference from the Ordering-Window Banner, which is pop-up-only.
- **Empty is absent:** Given no announcement message at any applicable level, when the storefront renders, then **no banner element is present** — not an empty container, not a placeholder, not a zero-height region.
- **Persistent:** The banner is not dismissible. It carries no close control, does not collapse, and no dismissal state is stored.
- **Role-independent:** Given any buyer, when the banner renders, then its content does not vary by buyer role. Returns, sizing, and shipping apply to fans as much as to players, and a rep who wants team-only content has divisions and standalone teams for that, not roles.
- **Closed stores:** Given a store in a closed state that serves the closed-store experience rather than the storefront, then the banner does not render — there is no storefront to render it on.

##### Epic B — Coexistence with the Ordering-Window Banner

The two banners are different features and both may be present at once. This section exists so that neither spec is read as owning "the banner."

|  | Ordering-Window Banner | Storefront Announcement Banner |
| --- | --- | --- |
| Source | System-derived from store schedule | Rep-authored rich text |
| Store types | Temporary Pop-Up only | All |
| States | Open / Closing soon / Closed | One state; present or absent |
| Content | Fixed system copy + countdown | Whatever the rep enters |

- **Stacking:** Given a Temporary Pop-Up store with both an active ordering-window state and an announcement message, when the storefront renders, then the **Ordering-Window Banner sits above** the announcement banner. The schedule state is time-critical and system-guaranteed; the announcement is contextual.
- **Independent presence:** Given either banner is absent, when the storefront renders, then the other renders unchanged in its own position. Neither is nested inside the other.
- **No content coordination:** The two are not reconciled. A rep may type a date into the announcement that differs from the countdown, and the system does not detect, warn about, or resolve the discrepancy. This is an accepted consequence of a free-text field — see Out of scope.

##### Epic C — Scope resolution on League stores

Roster-Optional Architecture, Epic D, specifies that a league store presents a **team selector at arrival — division, then team — resolving the shopper to exactly one team**. That resolution is the input to this epic. No separate association mechanism is introduced.

- **Resolution order:** Given a shopper resolved to a team, when the banner renders, then the message is resolved as: the **team's own message** if the team is standalone and carries one → its **division's message** if it belongs to a division that carries one → the **store-level message** → absent.
- **Teams inside a division do not carry their own message.** Override granularity is division and standalone team only. A team within a division inherits its division's message.
- **No team selected:** Given a shopper who has not selected a team — a fan proceeding to spirit wear without selecting, or any shopper before the selector resolves — when the banner renders, then the **store-level message** is used. Roster-Optional Architecture Epic D permits fans to proceed without selecting a team, so this is a supported path, not an edge case.
- **Individual Team Stores:** Given a Single-Team Locker store, then there is no division tier and no selector; the store-level message is the only message.
- **Re-selection:** Given a shopper who returns to the landing and selects a different team, when the storefront re-renders, then the banner resolves against the newly selected team. A parent buying for two children in different divisions reaches each division's message by re-selecting, and no attempt is made to merge or stack messages for multi-player buyers.
- **Division deletion:** Given a division carrying a message is deleted, when its teams become standalone, then they drop the division's message along with its branding and resolve to the store-level message unless they carry their own. This matches the existing rule in Roster-Optional Architecture, Epic B — deleting a division makes its teams standalone and drops the division's branding.

##### Epic D — Theme color application

The theme color is authored in Settings (Epic I) and consumed here.

- **Scope — buttons and accents only:** Given a store theme color, when the storefront renders, then it applies to **buttons and accent elements only**. Page background, surface, header, navigation, body text, and product imagery are unaffected. Anything that is not a button or an accent is out of scope for this control.
- **Resolution:** the theme color resolves by the **same order as the announcement message** in Epic C — standalone team → division → store → default.
- **Division contribution is the existing brand color.** A division's contribution is its **existing division brand color** set in the My Team(s) tab detail panel, not a second color field. See Store General Settings, Epic I.
- **Contrast is not guaranteed.** A rep may select any color the Prolook picker permits, including one with poor contrast against button labels. See Open questions.

### Metrics & Success Criteria

- Share of live stores with a non-empty announcement message — the read on whether reps treat this as setup, as research suggested
- Share of League stores using division-level or standalone-team-level overrides vs. store-level only — whether override granularity earns its complexity
- Support contacts about deadlines, returns, sizing, and shipping, compared between stores with and without a message — the questions the banner exists to answer
- Announcement message edits after launch, and time from launch to first edit — a live-store communication tool should show ongoing edits, not write-once behavior
- Share of stores overriding the default theme color vs. accepting the team primary color
- Storefront bounce rate on stores with and without a message

---

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires a **store-level announcement message field** and a **store-level theme color field**, both read from the same records that Store General Settings Epic I writes and that Step 1 — Basics Epic H writes for the message. There is **no storefront-local copy** — the storefront reads live store state, so a mid-window edit in Settings is reflected without a republish.

Requires **optional per-division and per-standalone-team announcement message fields** on the existing division and team structure records specified in Roster-Optional Architecture, Epic B. The division's theme color contribution is the **existing division brand color** and introduces no new field. Team records inside a division carry neither.

Requires the storefront to read the **shopper's resolved team** from the team selector specified in Roster-Optional Architecture, Epic D, and to resolve both fields through the fallback chain in Epic C above. Resolution must tolerate an unresolved shopper — no selection is a supported state, not an error.

Rich text requires a **sanitizing renderer**: rep-entered markup is rendered as formatted content, and script, embed, iframe, and event-handler content is stripped rather than escaped-and-displayed. The banner is rep-authored, but reps are not a trusted-input boundary.

The theme color must be applied through **token-level indirection scoped to buttons and accents**, so the blast radius is bounded by the token set rather than by a stylesheet search. Applying it as a global brand-color override is explicitly not the implementation.

**Out of scope**

- Reconciliation between announcement content and the ordering-window countdown, or any date parsing, validation, or warning on message content. The message is free text and its accuracy is the rep's responsibility.
- Buyer dismissal, collapse, or seen-state.
- Role-scoped message content.
- Per-team overrides for teams inside a division.
- Scheduled or expiring messages.
- Any theming beyond buttons and accents.

**Open questions — implementation-blocking, not yet decided**

1. **Contrast enforcement.** Should the picker warn or block on a theme color with insufficient contrast against button label text? An unreadable button is an accessibility problem the rep will not see coming. A non-blocking warning is the suggested default; undecided.
2. **Character limit.** A ceiling is needed for the field, plus a decision on whether the banner scrolls, clamps with a control, or grows unbounded when a rep pastes several hundred words.
3. **Rich-text feature set.** Which marks are permitted — bold, italic, lists, links, headings? Links in particular need a decision, since a rep linking to an external sizing chart is an obvious use and an open redirect surface.
