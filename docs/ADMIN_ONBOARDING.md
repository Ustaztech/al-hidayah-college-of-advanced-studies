# First administrator — invitation-only setup

**No administrator account has been created in a live Supabase project by this PR.**
The repo's former hardcoded credentials are compromised and must never be reused.

## Prerequisites
- Apply and validate the database migration in a secured Supabase project.
- Configure Supabase Auth site URL and allow-list the exact `AHCAS_REDIRECT_URL`.
- Configure SMTP delivery and sender domain in Supabase Auth so invitation emails are delivered.
- Obtain the Supabase service-role key on a trusted machine. Never expose it in browser, chat, logs, GitHub, or Vercel public environment variables.
- Choose the college's **verified official administrator email** and confirm mailbox ownership.

## Send the invitation
Run from the repository root in a trusted terminal, with these local environment variables set:
```bash
AHCAS_ADMIN_EMAIL="admin@your-verified-college-domain.example" \
SUPABASE_URL="https://YOUR_PROJECT.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="FROM_YOUR_SECURE_SECRET_STORE" \
AHCAS_REDIRECT_URL="https://YOUR_PRODUCTION_DOMAIN/signin" \
node scripts/invite-super-admin.mjs
```

The script invites a user and updates that account's profile to `super_admin`.
The invitation recipient must follow the email to establish a password.
**The current frontend does not yet implement an invitation password setup landing flow;
use a Supabase Auth-supported password setup/recovery redirect before going live.**
The invitation might be blocked if the email is already registered; do not delete an existing account as a workaround.
Manual, audited account promotion is needed for an existing verified user.

Login information to share safely:
- Admin URL: `https://al-hidayahcollege.vercel.app/signin` (only after environment setup)
- Username: the verified official administrator email used in `AHCAS_ADMIN_EMAIL`
- Password: **set privately by the recipient through the invitation flow**
- Access: `super_admin` as verified from Supabase profiles; never from a client-side claim.

After onboarding, enable MFA if available, implement server-side sign-out/revocation,
check cross-role access, and remove all remaining local-storage academic mutations.
