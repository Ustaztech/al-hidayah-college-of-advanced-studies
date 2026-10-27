#!/usr/bin/env node
// Secure one-time staff invite. Run on a trusted admin machine ONLY.
// Usage: AHCAS_ADMIN_EMAIL=admin@your-domain.com SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/invite-super-admin.mjs
// This script does NOT generate, reveal or store an administrator password.
const { AHCAS_ADMIN_EMAIL: email, SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, AHCAS_REDIRECT_URL: redirectTo } = process.env;
if (!email || !url || !key || !redirectTo) {
 console.error('Missing AHCAS_ADMIN_EMAIL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or AHCAS_REDIRECT_URL.');
 process.exit(1);
}
const origin = new URL(url).origin;
const headers = { Authorization: 'Bearer '+key, apikey:key, 'Content-Type':'application/json' };
async function api(path, options={}) {
 const r = await fetch(origin+path,{...options,headers:{...headers,...options.headers}});
 const body = await r.json().catch(()=>({}));
 if(!r.ok) throw new Error(body.msg||body.message||body.error||'HTTP '+r.status);
 return body;
}
const cleanEmail=email.trim().toLowerCase();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))throw new Error('Invalid admin email');
if(new URL(redirectTo).protocol!=='https:')throw new Error('Redirect must use HTTPS');
try {
 // Invites the account holder. Supabase Auth delivers an invitation email and password-setup link.
 const invitation = await api('/auth/v1/invite',{method:'POST',body:JSON.stringify({email:cleanEmail,redirect_to:redirectTo})});
 const id = invitation.id ?? invitation.user?.id;
 if(!id) throw new Error('Invite accepted but no user ID returned. Verify manually in Supabase Auth.');
 // Promote ONLY the newly invited identity. Never accept role claims from the browser.
 const result = await api('/rest/v1/profiles?id=eq.'+encodeURIComponent(id),{
  method:'PATCH',headers:{Prefer:'return=representation'},
  body:JSON.stringify({role:'super_admin'})
 });
 if(!Array.isArray(result)||result.length!==1) throw new Error('Promotion not confirmed; check profile trigger and database.');
 console.log('Invitation sent and profile promoted. Email:',cleanEmail,'User ID:',id);
 console.log('Administrator must accept the email invitation and set their own password.');
} catch(error){console.error('Provisioning failed:',error.message);process.exit(1);}
