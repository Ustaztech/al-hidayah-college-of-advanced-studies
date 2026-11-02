import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '../../../lib/auth/session';
import { StaffDashboardClient } from './StaffDashboardClient';

export default async function StaffDashboardPage() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect('/portal/login?redirect=/staff/dashboard');
  }

  // Authorize: Must have a staff role or admin
  const isStaff = user.roles.some(r =>
    ['lecturer', 'staff', 'hod', 'registrar', 'examination_officer', 'bursar'].includes(r)
  );
  const isAdmin = user.roles.includes('super_admin') || user.roles.includes('college_admin');

  if (!isStaff && !isAdmin) {
    redirect('/portal/unauthorised');
  }

  return <StaffDashboardClient user={user} />;
}
