import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '@/lib/auth/session';
import { portalDb } from '@/lib/store/mockDb';
import { MatriculationClient } from './MatriculationClient';

export default async function AdminMatriculationPage() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect('/portal/login?redirect=/admin/matriculation');
  }

  const isRegistryAuthorized =
    user.roles.includes('super_admin') ||
    user.roles.includes('college_admin') ||
    user.roles.includes('registrar');

  if (!isRegistryAuthorized) {
    redirect('/portal/unauthorised');
  }

  const matriculations = portalDb.getAllMatriculations();
  const counts = portalDb.getCounts();

  return (
    <MatriculationClient
      user={user}
      initialMatriculations={matriculations}
      counts={counts}
    />
  );
}
