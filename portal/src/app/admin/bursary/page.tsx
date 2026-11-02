import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '@/lib/auth/session';
import { portalDb } from '@/lib/store/mockDb';
import { BursaryClient } from './BursaryClient';

export default async function AdminBursaryPage() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect('/portal/login?redirect=/admin/bursary');
  }

  const isBursaryAuthorized =
    user.roles.includes('super_admin') ||
    user.roles.includes('college_admin') ||
    user.roles.includes('bursar');

  if (!isBursaryAuthorized) {
    redirect('/portal/unauthorised');
  }

  const invoices = portalDb.getAllInvoices();
  const counts = portalDb.getCounts();

  return (
    <BursaryClient
      user={user}
      initialInvoices={invoices}
      counts={counts}
    />
  );
}
