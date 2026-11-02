import { NextRequest, NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSessionUser();
    if (
      !session ||
      (!session.roles.includes('super_admin') &&
        !session.roles.includes('college_admin') &&
        !session.roles.includes('registrar'))
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Registry administrative privileges required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;

    const matriculations = portalDb.getAllMatriculations({
      sessionId,
      searchQuery
    });

    const counts = portalDb.getCounts();

    return NextResponse.json({
      success: true,
      matriculations,
      counts
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
      (!session.roles.includes('super_admin') &&
        !session.roles.includes('college_admin') &&
        !session.roles.includes('registrar'))
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Registry clearance privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { applicationId, remarks } = body;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required for matriculation clearance.' },
        { status: 400 }
      );
    }

    const matricRecord = portalDb.matriculateCandidate(
      applicationId,
      session.profile.full_name || 'Academic Registrar'
    );

    return NextResponse.json({
      success: true,
      message: 'Candidate formally cleared and matriculated successfully.',
      matriculation: matricRecord
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
