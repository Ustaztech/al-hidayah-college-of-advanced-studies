# Al-Hidayah College: secure rollout plan

## Current status
This branch establishes a **new backend foundation**, not a complete production deployment.
The existing pages and styling remain untouched. Existing `src/services/db.ts` still uses
browser localStorage, includes a committed administrative credential and is **unsafe for real
student or payment data**. Do not open admissions or collect payments on the old interface.

## Before enabling a live portal
1. Create a Supabase project; apply `supabase/migrations/202610270001_core.sql` to an empty project using Supabase CLI. Confirm PostgreSQL policies and grants in staging.
2. Configure the public `VITE_SUPABASE_*` environment variables only in Vercel; configure privileged keys only in server-side functions. Do not put Paystack or Resend secrets in `VITE_*`.
3. Replace legacy `AuthContext` and all calls to `db.ts` with Supabase Auth and database queries. Implement expiration/refresh, sign-out and password recovery. **Do not auto-promote roles based on user metadata.**
4. Provision the first super admin through an audited one-time SQL operation using the intended `auth.users.id`. Never seed static usernames or passwords. Revoke old seeded credentials and invalidate browser sessions.
5. Implement admissions via an authenticated server function or PostgreSQL function with atomic enrolment, unique matriculation IDs, registration fee verification and audited status transitions.
6. Implement payment initialization and signed Paystack webhook verification on the server. Enforce amount/currency, match the server-created transaction reference, and ensure idempotent settlement. Do not trust success redirects or client-generated receipts.
7. Implement Resend notifications from server functions after committed events, with sender-domain verification, retry and event deduplication.
8. Add RLS tests across all roles, including malicious role changes, cross-student reads, unpublished results, payments, and unauthenticated access.
9. Add password-reset, admission, result and payment end-to-end tests, automated backups and restore drills; inspect accessibility and mobile views.
10. Remove remaining fake status indicators and demo payment receipts; add privacy policy, data retention and operational logging.

## Critical validation notes
- A Supabase public/anon key is intentionally exposed in browsers; **service-role keys never are**.
- Database RLS is defense in depth; authorization must also be checked by privileged handlers.
- The SQL migration is additive and has not been executed against a live Supabase database in this PR.
- No external credentials were supplied to this change, and no payment or email messages have been sent.
- Avoid merging or deploying until the critical localStorage/auth migration is complete.
