import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('super_admin') && !session.roles.includes('college_admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin session required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || undefined;
    const typeId = searchParams.get('typeId') || undefined;

    const programmes = portalDb.getAdmissionProgrammes(sessionId, typeId, false);
    return NextResponse.json({ success: true, programmes });
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
    const {
      admission_session_id,
      programme_id,
      application_type_id,
      application_open,
      application_deadline,
      duration,
      entry_requirements
    } = body;

    if (!admission_session_id || !programme_id || !application_type_id || !application_deadline) {
      return NextResponse.json({
        success: false,
        error: 'Session ID, programme ID, application type ID, and deadline are required.'
      }, { status: 400 });
    }

    const newProg = portalDb.addAdmissionProgramme({
      admission_session_id,
      programme_id,
      application_type_id,
      application_open: application_open ?? true,
      application_deadline,
      duration: duration || '1 Academic Session',
      entry_requirements: entry_requirements || '5 O-Level credits in relevant subjects'
    });

    return NextResponse.json({ success: true, programme: newProg });
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
      return NextResponse.json({ success: false, error: 'Admission programme ID is required.' }, { status: 400 });
    }

    const updated = portalDb.updateAdmissionProgramme(id, updates);
    return NextResponse.json({ success: true, programme: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
