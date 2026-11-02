import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '@/lib/auth/session';
import { ApplicantPortalLayout } from '@/components/layout/ApplicantPortalLayout';
import { portalDb } from '@/lib/store/mockDb';
import { ClearanceClient } from './ClearanceClient';

interface ClearancePageProps {
  searchParams: Promise<{
    applicationId?: string;
  }>;
}

export default async function ApplicationClearancePage({ searchParams }: ClearancePageProps) {
  const session = await getServerSessionUser();
  const params = await searchParams;

  if (!session) {
    redirect('/application/login?redirect=/application/clearance');
  }

  const hasAccess =
    session.roles.includes('applicant') ||
    session.roles.includes('student') ||
    session.roles.includes('super_admin') ||
    session.roles.includes('college_admin') ||
    session.roles.includes('registrar');

  if (!hasAccess) {
    redirect('/portal/unauthorised');
  }

  let application = null;
  let matricRecord = null;

  if (params.applicationId) {
    application = portalDb.getApplicationById(params.applicationId);
    if (application) {
      matricRecord = portalDb.getMatriculationByApplicationId(application.id);
    }
  } else {
    // Check current user's profile
    let applicant = session.applicant;
    if (!applicant && (session.roles.includes('super_admin') || session.roles.includes('college_admin'))) {
      applicant = portalDb.getApplicantByUserId('usr-applicant-uuid') || undefined;
    }
    if (!applicant) {
      const allApps = portalDb.getAllApplications();
      const appForUser = allApps.find(a => a.applicant?.user_id === session.id);
      if (appForUser?.applicant) {
        applicant = appForUser.applicant;
      }
    }

    if (applicant) {
      application = portalDb.getOrCreateApplicationForApplicant(applicant.id);
      matricRecord = portalDb.getMatriculationByApplicationId(application.id);
    }
  }

  if (!application || !matricRecord) {
    redirect('/application/payments');
  }

  const student = portalDb.getAllStudents().find(s => s.id === matricRecord?.student_id) || null;

  return (
    <ApplicantPortalLayout user={session} title="Provisional Matriculation & Registry Clearance Slip">
      <ClearanceClient
        user={session}
        matriculation={matricRecord}
        application={application}
        student={student}
      />
    </ApplicantPortalLayout>
  );
}
