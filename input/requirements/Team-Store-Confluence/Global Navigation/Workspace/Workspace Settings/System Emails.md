---
title: System Emails
confluence_id: 4169138177
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4169138177/System+Emails
last_modified: 2026-09-22
pulled: 2026-10-26
---
**Amendment — September 1, 2026:** this spec previously described every email as unconditional. Reps can now **enable or disable each email, and all emails at once**, from the Emails section of [Workspace Settings](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4301389828/Workspace+Settings). That page owns **enablement and template override only** — this page remains the source of truth for the inventory, triggers, recipient sets, content, and timing. The two must not diverge: the three recipient groups rendered there are Epics A, B, and C below, and its list is this page's inventory in full, so **an email added to or removed from this spec must be added to or removed from that section**. A new Global Rule below makes every send conditional on enablement.

### Executive Summary & Problem Statement

#### The Problem

Key lifecycle events across the platform — store status changes, new orders, roster activity, ordering windows, and cancellations — occur without proactive notification reaching the people who need to act on them. Reps miss orders, team managers are unaware of store changes, and consumers are left uncertain about their order state.

#### The Solution

A catalog of triggered transactional emails covering three recipient groups — **Reps & Team Managers**, **Reps only**, and **Consumers** — each sent automatically on a defined platform event. Every email has a single trigger, a defined recipient set, and a clear purpose. No marketing or promotional emails are in scope here.

‌

### User persona & use cases

**Who is this for?** Reps (store owners and collaborators) who need operational awareness; team managers (coaches/administrators) who need visibility into store activity affecting their team; consumers (buyers) who need confirmation and status on their orders and store access.

**Scenarios encountered** A rep needs to know a buyer placed an order without logging in to check; a team manager needs to know their store was archived; a consumer needs confirmation their order was received; a rep needs to know their pending batch has hit MOQ and is ready to process; a buyer needs advance warning their ordering window is about to close; a rep decides one of these emails is noise and turns it off across their whole portfolio.

### Functional Requirements & Core Workflows

#### Global Rules (all emails)

- **Trigger-based only:** All emails in this spec are transactional — sent automatically on a defined system event. No email is sent on a schedule or batch cadence except where explicitly noted.
- **Conditional on enablement:** Given an email's trigger fires, then a send occurs **only if that email is enabled for the workspace** in Workspace Settings, and only if the **All Emails** master toggle is on. Enablement is checked **before dispatch** — a disabled email is suppressed at source, not filtered at the template layer, and the event is **not queued** for later delivery if the email is re-enabled afterward. Suppression is silent to the recipient and is not an error state.
- **No duplicate sends:** Given the same trigger event fires, when an email has already been sent for that event instance, then a duplicate is not sent.
- **Unsubscribe:** All consumer-facing emails must include an unsubscribe/preference link per CAN-SPAM/GDPR requirements — this link is required regardless of any workspace or store template override. Operational emails to reps and team managers are transactional and exempt from marketing unsubscribe, but must include contact/support information.
- **From address:** All emails send from a consistent Prolook-branded address. Reply-to may be set to the relevant rep or service contact where appropriate.
- **Deliverability:** All emails must be sent through a transactional ESP with SPF/DKIM/DMARC configured on the sending domain.
- **Template ownership:** Content described per email below is the **workspace default**. A store may override the template it inherits, per Workspace Settings, Epic B; precedence is store over workspace. Overrides may not remove required elements (unsubscribe link, order identifiers, rep/store contact info where specified).

#### Epic A — Reps & Team Managers

Sent to both the store-owning rep and the team manager on record. If no team manager contact is on file, the email sends to the rep only — it does not error or suppress.

| **Email** | **Trigger - Key Content** |
| --- | --- |
| **Store Status Changed** | **Trigger:** Any store status transition — Draft→Open, Open→Closed, Closed→Open, Open/Closed→Archived. One email per transition. **Content:** Store name, previous status, new status, timestamp, who triggered it (rep name or “system” for auto-close), and a link to the store workspace. Archived transitions must state the action is irreversible without support. |
| **New Buyer Account Created** | **Trigger:** A consumer completes account creation on the storefront for the first time. **Content:** Buyer name, email, role selected (player / parent / fan), store name, timestamp, and a link to the store’s roster or orders view. |
| **New Storefront Order Placed** | **Trigger:** Any consumer completes checkout and an order is created. **Content:** Order number, buyer name, items ordered (product name, quantity, size), order total, store name, and a link to the order in the management workspace. |
| **Rostered Player Account Created** | **Trigger:** A consumer matched to a roster entry completes storefront account creation. Replaces (not supplements) the general New Buyer Account Created email. **Content:** Player name, email, roster entry matched, store name, timestamp. |
| **Rostered Player Ordered Team Gear** | **Trigger:** A rostered player places an order containing at least one **Team Required** or **Team Supplied** product. Not triggered for Fan Gear-only orders. **Content:** Player name, roster entry, items ordered (product name, type, quantity, size), order total, order number, and a link to the pending orders view. |

- **Store Status Changed — all transitions covered:** Given any store status transition, when applied, then one email is sent per event with the correct previous and new status.
- **Rostered Player vs. General Account:** Given a consumer creates a storefront account and their email matches a roster entry, then **Rostered Player Account Created** is sent instead of (not in addition to) New Buyer Account Created. Given Rostered Player Account Created is **disabled** and New Buyer Account Created is enabled, then the replacement rule still applies — the general email is not sent as a fallback.
- **Rostered Player Ordered Team Gear — team gear only:** Given a rostered player’s order contains only Fan Gear, then this email is not triggered. It fires only when at least one Team Required or Team Supplied item is in the order.

‌

#### Epic B — Reps Only

Sent exclusively to the store-owning rep. Team managers do not receive these.

| **Email** | **Trigger + Key Content** |
| --- | --- |
| **Consumer Cancellation Request** | **Trigger:** A consumer submits a cancellation request for an order. Sent immediately on submission. **Content:** Order number, buyer name, items in the order, reason for cancellation (if collected), order total, and a link to the order to action the request. The email does not auto-cancel the order — the rep must action it manually. |
| **Pending Batch Ready (MOQ Reached)** | **Trigger:** Pending orders for a store reach or exceed the configured MOQ threshold. Sent once per MOQ crossing. **Content:** Store name, current pending order count vs. MOQ, total pending order value, breakdown by product, and a link to the pending orders view to initiate processing. Not triggered for stores with no MOQ configured. |

- **Cancellation request — immediate send:** Given a consumer submits a cancellation request, when received, then the rep email is sent within 5 minutes.
- **Pending batch — fires once per MOQ crossing:** Given pending orders cross the MOQ threshold, when the threshold is crossed, then one email is sent. If orders are later cancelled and the count drops below MOQ then re-crosses it, a new email is sent for the new crossing.
- **Pending batch — no MOQ, no email:** Given a store with no MOQ configured, then the Pending Batch Ready email is never triggered.

‌

#### Epic C — Consumers (Buyers)

Sent to the consumer whose account or order triggered the event.

| **Email** | **Trigger + Key Content** |
| --- | --- |
| **Order Confirmation** | **Trigger:** Consumer completes checkout and an order is created. **Content:** Order number, itemized list (product name, quantity, size, unit price), order total, store name, estimated timeline if available, and a link to view the order in their account. |
| **Order Status Update** | **Trigger:** An order’s status changes (e.g. Artwork Production → Shipped, Shipped → Delivered). One email per status transition. **Content:** Order number, new status, relevant detail (e.g. tracking number for Shipped), store name, and a link to the order. |
| **Store Closing Notice** | **Trigger:** Store transitions to Closed state (manual or auto). Sent to all consumers with an account on that storefront. **Content:** Store name, closure message, date closed, any outstanding order status, and rep/store contact info. Does not specify whether closure is temporary or permanent. |
| **Ordering Window Closed** | **Trigger:** A pop-up store’s ordering window reaches its close date and auto-closes. Sent only to consumers with a storefront account who have **not** yet placed an order. **Content:** Store name, window close date, message that ordering is no longer available, and rep contact info. |
| **Ordering Window Closing Soon** | **Trigger:** Configurable advance notice before a pop-up store’s ordering window close date. Default: **48 hours** before close. Sent only to consumers with a storefront account who have **not** yet placed an order. **Content:** Store name, exact close date/time, urgency message, direct link to the storefront. Suppressed if the store is manually closed before the advance window fires. **OPEN:** Confirm whether the 48-hr default should be configurable per store by the rep. |
| **Order Error** | **Trigger:** A system error occurs during order processing that requires consumer action (e.g. payment failure, item no longer available). **Content:** Order number, plain-language description of the error, specific next steps for the consumer, and rep/store contact info. Generic “something went wrong” copy is not acceptable. |
| **Cancellation Request Confirmation** | **Trigger:** Consumer submits a cancellation request. Sent immediately. **Content:** Order number, confirmation that the request was received, explicit statement that cancellation is **not guaranteed** and is subject to rep review, expected response timeframe, and rep contact info. Must not imply the order has already been cancelled. |

- **Order Confirmation — within 2 minutes:** Given a consumer completes checkout, when the order is confirmed, then the Order Confirmation email is sent within 2 minutes.
- **Order Status Update — one per transition:** Given an order changes status, when the transition is applied, then one email is sent per transition. Multiple rapid transitions send independently.
- **Store Closing Notice — all account holders:** Given a store transitions to Closed, then the email is sent to every consumer with a registered account on that storefront, regardless of whether they have placed an order.
- **Ordering Window Closed / Closing Soon — non-orderers only:** Given a consumer has already placed at least one order in the store, then they do not receive the Ordering Window Closed or Closing Soon emails.
- **Ordering Window Closing Soon — suppression:** Given a store is manually closed before the 48-hour advance window fires, then the Closing Soon email is suppressed and the Store Closing Notice is sent instead.
- **Cancellation request confirmation — not a cancellation:** Given a consumer submits a cancellation request, when the confirmation email is sent, then it explicitly states the request is under review and cancellation is not guaranteed.
- **Disabling a consumer email is the rep's call, not a compliance exit:** Given a consumer-facing email is disabled, then no send occurs; the rep remains responsible for any commitment made elsewhere that depended on it (e.g. storefront copy promising order confirmation).

‌

| **Email** | **Rep** | **Team Manager** | **Consumer** |
| --- | --- | --- | --- |
| **Store Status Changed** | **✓** | **✓** | - |
| **New Buyer Account Created** | **✓** | **✓** | - |
| **New Storefront Order Placed** | **✓** | **✓** | - |
| **Rostered Player Account Created** | **✓** | **✓** | - |
| **Rostered Player Ordered Team Gear** | **✓** | **✓** | - |
| **Consumer Cancellation Request** | **✓** | - | - |
| **Pending Batch Ready (MOQ)** | **✓** | - | - |
| **Order Confirmation** | - | - | **✓** |
| **Order Status Update** | - | - | **✓** |
| **Store Closing Notice** | - | - | **✓** |
| **Ordering Window Closed** | - | - | **✓** |
| **Ordering Window Closing Soon** | - | - | **✓** |
| **Order Error** | - | - | **✓** |
| **Cancellation Request Confirmation** | - | - | **✓** |

‌

### Metrics & Success Criteria

- Email delivery rate ≥99% across all transactional sends
- Order Confirmation sent within 2 minutes of order creation: 100%
- Consumer Cancellation Request reaches rep within 5 minutes: 100%
- Zero duplicate sends for the same trigger event instance
- Ordering Window Closing Soon suppression accuracy: 100% when store is manually closed before the advance window fires
- Rep open rate on Pending Batch Ready (signal for whether MOQ notification is actionable)
- Disable rate per email across workspaces — a widely disabled email is a candidate for removal from this spec rather than a setting to keep maintaining

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Requires a **transactional ESP** (e.g. SendGrid, Postmark, or AWS SES) with SPF/DKIM/DMARC configured on the sending domain. Depends on: an **event bus or webhook system** triggering on platform events (store status transitions, order creation, account creation, MOQ threshold crossings, order status changes); the **storefront account model** linking consumers to specific stores for audience targeting; the **team manager contact model** on the store record for Epic A recipient logic; a **scheduled/delayed send capability** for the 48-hour Ordering Window Closing Soon advance notice; and **suppression logic** excluding consumers who have already ordered from Ordering Window Closed/Closing Soon sends. Email templates must be mobile-responsive and Prolook-branded. CAN-SPAM and GDPR compliance required on all consumer-facing sends.

The dispatcher must additionally read **workspace-scope enablement state** and any **store-level template override** before every send, resolving store over workspace, per [Workspace Settings](https://qstrike.atlassian.net/wiki/spaces/TS/pages/4301389828/Workspace+Settings), Epic B. Enablement is a pre-dispatch gate, not a post-render filter, and disabled events are dropped rather than queued.

‌
