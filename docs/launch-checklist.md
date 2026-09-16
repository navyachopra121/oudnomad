# OudNomad Soft Launch & Graduation Runbook

This document defines the operational criteria, verification rules, and graduation protocol for transitioning OudNomad from unpromoted soft launch to full commercial launch.

---

## Soft Launch Protocol

- **Visibility**: Publicly live and accessible on staging and production hostinger VPS nodes; zero promotional pushes (no paid media, social announcements, or external email blasts).
- **Duration**: Minimum **14 consecutive days** in unpromoted live state.
- **Traffic Profile**: Organic crawlers, direct visits, and test orders using sandboxed / live Stripe test transactions.

---

## Mandatory Go / No-Go Graduation Criteria

Before initiating any promotional marketing push, all of the following criteria MUST be met:

| Category | Requirement | Verification Method | Status |
|---|---|---|---|
| **E2E QA Matrix** | Playwright test suite passing 100% against staging | `npx playwright test` | [x] PASSED |
| **Legal Compliance** | Privacy, Terms, and Refund policies reviewed by qualified attorney for India (DPDPA 2023 / Consumer Protection Rules 2020) & International (GDPR / CCPA) | Published live with checkbox consent at checkout & Cookie Consent banner | [x] VERIFIED |
| **Payment & Webhooks** | Zero unhandled payment processing failures; Stripe webhook idempotency verified | Test transactions logged in Stripe Dashboard | [x] VERIFIED |
| **Email Deliverability** | Transactional order confirmation and shipping emails arriving in real inboxes without spam classification | Resend / SES logs check | [x] VERIFIED |
| **Monitoring Health** | Zero unhandled 5xx HTTP error spikes; Host memory < 85%, disk usage < 80% | Prometheus / Grafana dashboards | [x] VERIFIED |
| **SEO Infrastructure** | Dynamic sitemap live (`/sitemap.xml`), `robots.txt` disallows `/admin` & `/account`, JSON-LD Product & Organization schemas validating | Google Search Console & Rich Results Test | [x] VERIFIED |
| **Refund Drill** | At least one live refund processed end-to-end (DB updated only after webhook payload confirmation) | Admin panel refund execution audit | [x] VERIFIED |

---

## Instant Rollback Plan

If a critical flaw (e.g. payment failure, memory leak, security issue) is detected during soft launch:

1. **Trigger Rollback Pipeline**:
   Navigate to GitHub Actions → `Deploy Production` workflow → Click **Run workflow** → Enter the previous known-good Git commit SHA tag.
2. **Database Integrity Audit**:
   Verify Postgres connection string state using `psql $DATABASE_URL -c "SELECT status, COUNT(*) FROM orders GROUP BY status;"`.
3. **Notify Escalation**:
   Log incident severity in compliance record and perform root-cause analysis prior to redeploying.
