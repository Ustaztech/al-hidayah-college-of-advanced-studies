import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '@/lib/auth/session';
import { ApplicantPortalLayout } from '@/components/layout/ApplicantPortalLayout';
import { portalDb } from '@/lib/store/mockDb';
import { PaymentClient } from './PaymentClient';

export default async function ApplicationPaymentsPage() {
  const session = await getServerSessionUser();

  if (!session) {
    redirect('/application/login?redirect=/application/payments');
  }

  // Ensure applicant or admin or student
  const hasAccess =
    session.roles.includes('applicant') ||
    session.roles.includes('student') ||
    session.roles.includes('super_admin') ||
    session.roles.includes('college_admin');

  if (!hasAccess) {
    redirect('/portal/unauthorised');
  }

  let applicant = session.applicant;
  if (!applicant && (session.roles.includes('super_admin') || session.roles.includes('college_admin'))) {
    applicant = portalDb.getApplicantByUserId('usr-applicant-uuid') || undefined;
  }

  if (!applicant) {
    // If logged in as student, find application by student record
    const allApps = portalDb.getAllApplications();
    const appForUser = allApps.find(a => a.applicant?.user_id === session.id);
    if (appForUser?.applicant) {
      applicant = appForUser.applicant;
    }
  }

  if (!applicant) {
    redirect('/application/dashboard');
  }

  const application = portalDb.getOrCreateApplicationForApplicant(applicant.id);
  const invoice = portalDb.getOrCreateAcceptanceInvoice(application.id);

  return (
    <ApplicantPortalLayout user={session} title="Acceptance Fee & Electronic Payment">
      <PaymentClient
        user={session}
        initialInvoice={invoice}
        application={application}
      />
    </ApplicantPortalLayout>
  );
}
