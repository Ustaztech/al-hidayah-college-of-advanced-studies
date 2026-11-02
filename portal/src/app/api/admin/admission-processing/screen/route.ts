import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('super_admin') && !session.roles.includes('college_admin') && !session.roles.includes('registrar'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Registrar / Admin session required.' }, { status: 403 });
    }

    const body = await request.json();
    const {
      applicationId,
      status,
      screeningScore,
      olevelVerified,
      credentialsVerified,
      actionRequiredNote,
      internalNotes
    } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ success: false, error: 'Application ID and screening status are required.' }, { status: 400 });
    }

    const validStatuses = ['under_review', 'action_required', 'recommended_for_admission', 'not_recommended'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: `Invalid screening verdict: ${status}` }, { status: 400 });
    }

    const screening = portalDb.saveScreening(applicationId, session.id, {
      status,
      screeningScore: screeningScore ? Number(screeningScore) : null,
      olevelVerified: Boolean(olevelVerified),
      credentialsVerified: Boolean(credentialsVerified),
      actionRequiredNote,
      internalNotes
    });

    const updatedApp = portalDb.getApplicationById(applicationId);

    return NextResponse.json({
      success: true,
      message: 'Candidate application screening recorded successfully.',
      screening,
      application: updatedApp
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
