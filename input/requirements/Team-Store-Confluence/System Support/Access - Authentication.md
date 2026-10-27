---
title: Access / Authentication
confluence_id: 4153016322
url: https://qstrike.atlassian.net/wiki/spaces/TS/pages/4153016322/Access+Authentication
last_modified: 2026-10-05
pulled: 2026-10-26
---
**Amended ****: Hybrid authentication & account linking.** Team Stores now supports **native Team Stores accounts in addition to Customizer authentication** (see Team Stores Landing Page, Epics D and E). Reason: some of our customers won't have access to a Customizer and will require native authentication capabilities. The gate applies identically to both sign-in paths and is keyed to the single linked Team Stores user record. This amendment overrides any earlier content or amendments on this page where they conflict.

### Executive Summary & Problem Statement

#### The Problem

Not every rep who can authenticate is authorized to operate Team Stores. Reps can now reach Team Stores through a Customizer or by creating a native Team Stores account, so the platform must gate the tools consistently on both paths, with no way to bypass verification by switching sign-in method.

#### The Solution

A verification gate between authentication (by either path) and the tools. Unverified users submit a business-entity application (EIN, banking details, and related business information), which is **manually reviewed by a Prolook admin**. Reps who sign up natively with no dealership association register their business through a **Stripe-generated registration form**, also reviewed internally by Prolook. On approval the user is granted access and dropped into the Overview with a confirmation. Because review is manual, access is not instant — see the asynchronous-approval note below. Access status belongs to the rep's single Team Stores user record, so it carries across every linked sign-in method.


### User persona & use cases

**Who is this for?** Two roles: the **unverified end user** (new reps, whether signing in through a Customizer or with a native Team Stores account) who submits the application, and the **Prolook admin reviewer** who manually approves or denies it.

**Scenarios encountered** A first-time operator attempts to enter Team Stores and is asked to submit the business-entity form; a rep who signed up natively with no dealership association registers their business through the Stripe-generated form; an applicant waits during the 24–48 hr review window; a Prolook admin reviews a submitted application and approves or denies it; an approved rep later signs in by a different, linked method and keeps their access; a returning user whose pass has expired re-applies.


### Functional Requirements & Core Workflows

##### Epic A — Application submission (end user)

- As an unverified user, I want a clear gate with a path to apply, so that I can request authorization to the Team Stores tools.
- As an applicant, I want to know my request is under review and roughly when I'll hear back, so that I'm not left wondering whether the gate is broken.
- Given I lack access, when I authenticate to Team Stores by **either** Customizer sign-in or a native Team Stores account, then I am shown the gate with a path to submit the application form.
- Given the application form, when I open it, then it collects business-entity information including EIN, banking details, and related business identity fields, with required-field validation before submission.
- **Native sign-up with no dealership:** Given I signed up natively and am not associated with a dealership, then I am prompted to register my organization (business) through a **Stripe-generated registration form**, which is reviewed internally by Prolook. I have **no access to Team Stores** until it is approved.
- Given I submit a complete application, when it is received, then I see a “pending review” state that clearly states verification is a **manual process** with a typical **24–48 hour** turnaround — access is *not* granted on submission.
- Given my application is pending, when I return to Team Stores before a decision by **any** sign-in method, then I continue to see the pending state rather than the tools.

##### Epic B — Manual admin review (Prolook admin)

- As a Prolook admin, I want to review a submitted application and approve or deny it, so that only authorized business entities operate Team Stores.
- Given a submitted application or Stripe business registration, when a Prolook admin reviews it, then they can see all submitted business-entity fields and the applicant's sign-in method(s), and approve or deny the request.
- Given an admin approves, when the grant is applied, then the applicant gains access and, on next entry, lands on the Overview with a confirmation. Given an admin denies, then the applicant is informed of the denial.

##### Epic C — Sign-in path parity

- As a Prolook admin, I want verification to follow the person rather than the sign-in method, so that nobody can bypass the gate by signing in a different way.
- As an approved rep, I want my access to work however I sign in, so that I don't have to reapply.

- **Grant follows the user record:** Given an approval, then the access grant is stored on the rep's single Team Stores user record, not on a Customizer identity or native credential.
- **Linked accounts inherit status:** Given a rep's Customizer identity and native account are linked (Landing Page, Epic E), then both sign-in methods show the same gate status: approved, pending, denied or expired.
- **No bypass:** Given a rep has a pending or denied application, when they sign in by a different method, then they still see the pending or denied state, never the tools.
- **No duplicate applications:** Given a rep already has an application on file, when they authenticate by another linked method, then they are not asked to apply again.


### Metrics & Success Criteria

- Application completion rate for eligible users \>90%
- Median admin review turnaround within the stated 24–48 hr window
- Zero unauthorized entries to the tools across both sign-in paths
- Form-abandonment rate on the EIN/banking step minimized
- Zero duplicate applications from the same person under linked sign-in methods

---


### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

**Verification is a manual, asynchronous process — not an automated check.** Requires: secure database storage for application submissions (business-entity fields incl. EIN and banking, with sensitive-data handling/encryption); an internal **admin review queue and tooling** plus a notification service for the Prolook reviewer; and a persistent access-grant/entitlement model (not session-only) **keyed to the single Team Stores user ID** shared by all linked sign-in methods. Depends on the **account-linking service** defined in Team Stores Landing Page (Epic E). Native sign-ups with no dealership association use a **Stripe-generated business registration form**, which requires a Stripe integration and a way to route those submissions into the Prolook review queue. Approval introduces a **24–48 hr** waiting period between submission and access. Likely third-party integrations for banking/EIN validation and applicant email notification.

### Open Questions

- **Stripe registration vs. application form:** does the Stripe-generated business registration replace the EIN/banking application form described in Epic A, or do both exist for different reps?
- **Native-path vetting:** do native-only applicants, who lack the implicit pre-filter of an existing Customizer account, need any checks beyond the standard manual review?
- **Review SLA:** does the 24–48 hr turnaround also apply to Stripe business registrations?
