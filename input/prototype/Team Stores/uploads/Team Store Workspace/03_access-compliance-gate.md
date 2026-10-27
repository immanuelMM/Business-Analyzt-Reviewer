# Access / Compliance Gate

### Executive Summary & Problem Statement

#### The Problem

Not every prolook.com user is authorized to operate Team Stores; the platform must gate the tools without a hard, separate login wall.

#### The Solution

A verification gate between the brand site and the tools. Unverified users submit a business-entity application form (EIN, banking details, and related business information), which is **manually reviewed by a Prolook admin**. On approval the user is granted access and dropped into the Overview with a confirmation. Because review is manual, access is not instant — see the asynchronous-approval note below.

‌

### User persona & use cases

**Who is this for?** Two roles: the **unverified end user** (new reps) who submits the application, and the **Prolook admin reviewer** who manually approves or denies it.

**Scenarios encountered** A first-time operator attempts to enter Team Stores and is asked to submit the business-entity form; an applicant waits during the 24–48 hr review window; a Prolook admin reviews a submitted application and approves or denies it; a returning user whose pass has expired re-applies.

‌

### Functional Requirements & Core Workflows

##### Epic A — Application submission (end user)

* As an unverified user, I want a clear gate with a path to apply, so that I can request authorization to the Team Stores tools.
* As an applicant, I want to know my request is under review and roughly when I'll hear back, so that I'm not left wondering whether the gate is broken.
* Given I lack access, when I select Team Stores, then I am shown the gate with a path to submit the application form.
* Given the application form, when I open it, then it collects business-entity information including EIN, banking details, and related business identity fields, with required-field validation before submission.
* Given I submit a complete application, when it is received, then I see a "pending review" state that clearly states verification is a **manual process** with a typical **24–48 hour** turnaround — access is _not_ granted on submission.
* Given my application is pending, when I return to Team Stores before a decision, then I continue to see the pending state rather than the tools.

##### Epic B — Manual admin review (Prolook admin)

* As a Prolook admin, I want to review a submitted application and approve or deny it, so that only authorized business entities operate Team Stores.
* Given a submitted application, when a Prolook admin reviews it, then they can see all submitted business-entity fields and approve or deny the request.
* Given an admin approves, when the grant is applied, then the applicant gains access and, on next entry, lands on the Overview with a confirmation. Given an admin denies, then the applicant is informed of the denial.

‌

### Metrics & Success Criteria

* Application completion rate for eligible users >90%
* Median admin review turnaround within the stated 24–48 hr window
* Zero unauthorized entries to the tools
* Form-abandonment rate on the EIN/banking step minimized

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

**Verification is a manual, asynchronous process — not an automated check.** Requires: secure database storage for application submissions (business-entity fields incl. EIN and banking, with sensitive-data handling/encryption); an internal **admin review queue and tooling** plus a notification service for the Prolook reviewer; and a persistent access-grant/entitlement model (not session-only). Approval introduces a **24–48 hr** waiting period between submission and access. Likely third-party integrations for banking/EIN validation and applicant email notification.
