import { NextRequest, NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSessionUser();
    if (
      !session ||
      (!session.roles.includes('applicant') &&
        !session.roles.includes('student') &&
        !session.roles.includes('super_admin') &&
        !session.roles.includes('college_admin') &&
        !session.roles.includes('bursar'))
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid portal session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedAppId = searchParams.get('applicationId');

    let application = null;
    if (requestedAppId) {
      application = portalDb.getApplicationById(requestedAppId);
    } else {
      let applicant = portalDb.getApplicantByUserId(session.id);
      if (!applicant && (session.roles.includes('super_admin') || session.roles.includes('college_admin'))) {
        applicant = portalDb.getApplicantByUserId('usr-applicant-uuid') || null;
      }
      if (applicant) {
        application = portalDb.getOrCreateApplicationForApplicant(applicant.id);
      }
    }

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application record not found.' },
        { status: 404 }
      );
    }

    // Generate or fetch acceptance invoice
    const invoice = portalDb.getOrCreateAcceptanceInvoice(application.id);

    return NextResponse.json({
      success: true,
      invoice,
      application
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSessionUser();
    if (
      !session ||
      (!session.roles.includes('applicant') &&
        !session.roles.includes('student') &&
        !session.roles.includes('super_admin') &&
        !session.roles.includes('college_admin'))
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Session required.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    let applicationId = body.applicationId;

    if (!applicationId) {
      const applicant = portalDb.getApplicantByUserId(session.id);
      if (applicant) {
        const app = portalDb.getOrCreateApplicationForApplicant(applicant.id);
        applicationId = app.id;
      }
    }

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required.' },
        { status: 400 }
      );
    }

    const invoice = portalDb.getOrCreateAcceptanceInvoice(applicationId);

    return NextResponse.json({
      success: true,
      invoice
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
