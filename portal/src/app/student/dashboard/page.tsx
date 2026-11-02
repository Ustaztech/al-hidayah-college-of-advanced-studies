import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '../../../lib/auth/session';
import { StudentDashboardClient } from './StudentDashboardClient';

export default async function StudentDashboardPage() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect('/portal/login?redirect=/student/dashboard');
  }

  // Authorize: Must be student or super_admin
  const isStudent = user.roles.includes('student');
  const isAdmin = user.roles.includes('super_admin') || user.roles.includes('college_admin');

  if (!isStudent && !isAdmin) {
    redirect('/portal/unauthorised');
  }

  return <StudentDashboardClient user={user} />;
}
