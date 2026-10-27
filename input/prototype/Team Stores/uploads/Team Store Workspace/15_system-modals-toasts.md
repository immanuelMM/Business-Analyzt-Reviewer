# System Modals & Toasts

### Executive Summary & Problem Statement

#### The Problem

Destructive and consequential actions need confirmation, and every meaningful action needs feedback.

#### The Solution

A modal layer (Sales Tax confirmation, Cancel-create, Create-store, Create-Group, global loading overlay) and a toast system for transient confirmations.

‌

### User persona & use cases

**Who is this for?** All users.

**Scenarios encountered** Confirming tax settings; canceling store creation; awaiting a long operation; acknowledging a success.

### Functional Requirements & Core Workflows

#### User Stories

* As a rep, I want confirmations and feedback toasts, so that I avoid mistakes and know actions succeeded.

#### Acceptance Criteria

* Given a destructive action, when triggered, then a confirmation modal blocks until I confirm/cancel.
* Given a meaningful action completes, when it finishes, then a toast confirms the outcome.

‌

### Metrics & Success Criteria

* Accidental-destructive-action rate near zero
* Action-feedback coverage 100%

---

‌

### Dependencies & Technical Constraints

**Dependency & Technical Constraint**

Client-side UI layer; no external dependency beyond the underlying actions each modal/toast represents.
