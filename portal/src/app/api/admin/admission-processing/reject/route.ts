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
    const { applicationId, reason } = body;

    if (!applicationId) {
      return NextResponse.json({ success: false, error: 'Application ID is required.' }, { status: 400 });
    }

    const updatedApp = portalDb.rejectApplication(applicationId, session.id, reason);

    return NextResponse.json({
      success: true,
      message: 'Application has been formally recorded as not offered admission.',
      application: updatedApp
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
