/**
 * Supabase HTTP transport (no additional frontend dependency).
 * This module intentionally does not use the legacy localStorage-based db.ts.
 * Never supply service-role or payment-secret keys to browser code.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export type AuthSession = { access_token: string; refresh_token: string; expires_in: number; user: { id: string; email?: string } };
export const hasSupabaseConfig = Boolean(url && anonKey);
const endpoint = (path: string) => {
 if (!url || !anonKey) throw new Error('Supabase is not configured. Contact the administrator.');
 return url.replace(/\/$/, '') + path;
};
async function request<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
 const response = await fetch(endpoint(path), {
  ...init,
  headers: {
   apikey: anonKey!,
   Authorization: 'Bearer ' + (accessToken || anonKey!),
   'Content-Type': 'application/json',
   ...init.headers
  }
 });
 if (!response.ok) {
  const body = await response.json().catch(() => ({}));
  throw new Error(body.msg || body.error_description || body.message || 'Request failed (' + response.status + ')');
 }
 return response.status === 204 ? undefined as T : await response.json() as T;
}
export const supabaseApi = {
 signUp: (email: string, password: string, fullName: string) =>
  request<AuthSession>('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ email, password, data: { full_name: fullName } }) }),
 signIn: (email: string, password: string) =>
  request<AuthSession>('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) }),
 refresh: (refreshToken: string) =>
  request<AuthSession>('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) }),
 resetPassword: (email: string, redirectTo: string) =>
  request<unknown>('/auth/v1/recover?redirect_to=' + encodeURIComponent(redirectTo), { method: 'POST', body: JSON.stringify({ email }) }),
 getMyProfile: (token: string) =>
  request<{ id: string; full_name: string; role: string; phone?: string }[]>('/rest/v1/profiles?select=id,full_name,role,phone&id=eq.' + encodeURIComponent(parseJwtSubject(token)), {}, token),
 getProgrammes: () =>
  request<{ id: string; code: string; title: string }[]>('/rest/v1/programmes?select=id,code,title&active=eq.true'),
 getMyApplications: (token: string) =>
  request<unknown[]>('/rest/v1/applications?select=id,reference,status,programme_id,created_at', {}, token)
};
function parseJwtSubject(jwt: string): string {
 const payload = jwt.split('.')[1];
 if (!payload) throw new Error('Invalid session');
 const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
 const data = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')));
 if (typeof data.sub !== 'string') throw new Error('Invalid session');
 return data.sub;
}
