import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('applicant') && !session.roles.includes('super_admin') && !session.roles.includes('college_admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Applicant session required.' }, { status: 401 });
    }

    let applicant = portalDb.getApplicantByUserId(session.id);
    if (!applicant && (session.roles.includes('super_admin') || session.roles.includes('college_admin'))) {
      applicant = portalDb.getApplicantByUserId('usr-applicant-uuid') || null;
    }

    if (!applicant) {
      return NextResponse.json({ success: false, error: 'Applicant record not found.' }, { status: 404 });
    }

    const application = portalDb.getOrCreateApplicationForApplicant(applicant.id);

    // If already submitted, return existing reference
    if (application.status === 'submitted') {
      return NextResponse.json({
        success: true,
        message: 'Application has already been submitted.',
        submissionReference: application.submission_reference,
        application
      });
    }

    const body = await request.json().catch(() => ({}));
    if (body.declarationConfirmed === false) {
      return NextResponse.json({
        success: false,
        error: 'You must certify that all statements made in this application are true, accurate and complete.'
      }, { status: 400 });
    }

    // Submit and enforce comprehensive validation checks
    const result = portalDb.submitApplication(application.id);

    return NextResponse.json({
      success: true,
      message: 'Your application has been successfully submitted to Al-Hidayah College of Advanced Studies.',
      submissionReference: result.submissionReference,
      application: result.application
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Application submission failed. Please review your entries and try again.'
    }, { status: 400 });
  }
}
