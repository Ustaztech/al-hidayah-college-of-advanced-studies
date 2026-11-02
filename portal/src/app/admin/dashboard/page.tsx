import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '../../../lib/auth/session';
import { portalDb } from '../../../lib/store/mockDb';
import { AdminDashboardClient } from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect('/portal/login?redirect=/admin/dashboard');
  }

  // Authorize: Must be super_admin or college_admin
  const isAdmin = user.roles.includes('super_admin') || user.roles.includes('college_admin');
  if (!isAdmin) {
    redirect('/portal/unauthorised');
  }

  // Real Database Queries for Institutional Counts
  const counts = portalDb.getCounts();
  const allProfiles = portalDb.getAllProfiles();
  const allStudents = portalDb.getAllStudents();
  const allStaff = portalDb.getAllStaff();
  const departments = portalDb.getAllDepartments();
  const programmes = portalDb.getAllProgrammes();

  return (
    <AdminDashboardClient
      user={user}
      counts={counts}
      profiles={allProfiles}
      students={allStudents}
      staffList={allStaff}
      departments={departments}
      programmes={programmes}
    />
  );
}
