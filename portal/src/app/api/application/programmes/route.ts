import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || undefined;
    const typeId = searchParams.get('typeId') || undefined;
    const includeClosed = searchParams.get('all') === 'true';

    // Verify session
    const session = await getServerSessionUser();
    let applicantTypeId = typeId;
    if (session && !applicantTypeId) {
      const applicant = portalDb.getApplicantByUserId(session.id);
      if (applicant && applicant.application_type_id) {
        applicantTypeId = applicant.application_type_id;
      }
    }

    // If candidate has an application type, fetch programmes for that type or all open ones
    const programmes = portalDb.getAdmissionProgrammes(sessionId, applicantTypeId, !includeClosed);

    return NextResponse.json({
      success: true,
      programmes
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
