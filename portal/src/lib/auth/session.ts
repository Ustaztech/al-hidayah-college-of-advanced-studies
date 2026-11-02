import { cookies } from 'next/headers';
import { AuthSessionUser, UserRoleName } from '../types';
import { portalDb } from '../store/mockDb';
import { createClient } from '../supabase/server';

export async function getServerSessionUser(): Promise<AuthSessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('ahcas_portal_session')?.value;

  // 1. Check local session cookie (supports both mock and active Supabase bridge)
  if (sessionToken) {
    try {
      const parsed = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf8'));
      const email = parsed.email?.toLowerCase();
      if (!email) return null;

      const profile = portalDb.getProfileByEmail(email);
      if (!profile) return null;

      // Reject inactive or suspended accounts immediately
      if (profile.status !== 'active') {
        return null;
      }

      const roles = portalDb.getUserRoles(profile.id);
      const student = roles.includes('student') ? portalDb.getStudentByUserId(profile.id) || undefined : undefined;
      const staff = roles.some(r => ['lecturer', 'staff', 'hod', 'registrar', 'examination_officer', 'bursar'].includes(r))
        ? portalDb.getStaffByUserId(profile.id) || undefined
        : undefined;
      const applicant = roles.includes('applicant')
        ? portalDb.getApplicantByUserId(profile.id) || undefined
        : undefined;

      return {
        id: profile.id,
        email: profile.email,
        profile,
        roles,
        student,
        staff,
        applicant
      };
    } catch {
      // invalid token
    }
  }

  // 2. Try live Supabase Auth session if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
    try {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user || !user.email) return null;

      // Query database for profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile || profile.status !== 'active') return null;

      // Query database for roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id);

      const roles: UserRoleName[] = (userRoles || [])
        .map((ur: any) => ur.roles?.name as UserRoleName)
        .filter(Boolean);

      let applicant;
      if (roles.includes('applicant')) {
        const { data: appData } = await supabase
          .from('applicants')
          .select('*, application_types(*)')
          .eq('user_id', user.id)
          .single();
        if (appData) {
          applicant = {
            ...appData,
            application_type: appData.application_types
          };
        }
      }

      return {
        id: user.id,
        email: user.email,
        profile,
        roles,
        applicant
      };
    } catch {
      return null;
    }
  }

  return null;
}
