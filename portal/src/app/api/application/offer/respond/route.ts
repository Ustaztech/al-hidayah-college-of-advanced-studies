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
    const body = await request.json();
    const { response } = body;

    if (response !== 'accept' && response !== 'decline') {
      return NextResponse.json({
        success: false,
        error: "Invalid offer decision. Allowed responses: 'accept' or 'decline'."
      }, { status: 400 });
    }

    const updatedOffer = portalDb.respondToOffer(application.id, session.id, response);

    return NextResponse.json({
      success: true,
      message: response === 'accept'
        ? 'Congratulations! You have accepted the provisional admission offer.'
        : 'You have formally declined the provisional admission offer.',
      offer: updatedOffer,
      application: portalDb.getApplicationById(application.id)
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
