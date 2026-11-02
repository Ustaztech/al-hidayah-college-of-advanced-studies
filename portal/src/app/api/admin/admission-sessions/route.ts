import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('super_admin') && !session.roles.includes('college_admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin session required.' }, { status: 403 });
    }

    const sessions = portalDb.getAdmissionSessions(false);
    return NextResponse.json({ success: true, sessions });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('super_admin') && !session.roles.includes('college_admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin session required.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, start_date, end_date, is_active } = body;

    if (!name || !start_date || !end_date) {
      return NextResponse.json({ success: false, error: 'Session name, start date, and end date are required.' }, { status: 400 });
    }

    const newSession = portalDb.addAdmissionSession(name, start_date, end_date, is_active ?? false);
    return NextResponse.json({ success: true, session: newSession });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('super_admin') && !session.roles.includes('college_admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin session required.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Session ID is required.' }, { status: 400 });
    }

    const updated = portalDb.updateAdmissionSession(id, updates);
    return NextResponse.json({ success: true, session: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
