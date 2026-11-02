import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('super_admin') && !session.roles.includes('college_admin') && !session.roles.includes('registrar'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Registrar / Admin session required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('search') || undefined;
    const sessionId = searchParams.get('sessionId') || undefined;
    const status = searchParams.get('status') || undefined;

    const applications = portalDb.getAllApplications(query, sessionId, status);
    const counts = portalDb.getCounts();

    return NextResponse.json({
      success: true,
      applications,
      counts: {
        total: applications.length,
        submitted: counts.submittedApplications,
        underReview: counts.underReviewApplications,
        actionRequired: counts.actionRequiredApplications,
        accepted: counts.acceptedApplications,
        rejected: counts.rejectedApplications,
        offered: counts.offeredCount,
        acceptedOffers: counts.acceptedOfferCount
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
