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
    const { applicationId, programmeId, acceptanceDeadlineDays } = body;

    if (!applicationId || !programmeId) {
      return NextResponse.json({
        success: false,
        error: 'Application ID and admitted programme ID are required.'
      }, { status: 400 });
    }

    const offer = portalDb.issueAdmissionOffer(applicationId, session.id, {
      programmeId,
      acceptanceDeadlineDays: acceptanceDeadlineDays ? Number(acceptanceDeadlineDays) : 21
    });

    const updatedApp = portalDb.getApplicationById(applicationId);

    return NextResponse.json({
      success: true,
      message: `Provisional Admission Offer (${offer.offer_letter_number}) issued successfully.`,
      offer,
      application: updatedApp
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
