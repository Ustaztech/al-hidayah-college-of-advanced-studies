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
        !session.roles.includes('registrar'))
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    let matricRecord = null;
    let application = null;

    if (applicationId) {
      matricRecord = portalDb.getMatriculationByApplicationId(applicationId);
      application = portalDb.getApplicationById(applicationId);
    } else {
      let applicant = portalDb.getApplicantByUserId(session.id);
      if (!applicant && (session.roles.includes('super_admin') || session.roles.includes('college_admin'))) {
        applicant = portalDb.getApplicantByUserId('usr-applicant-uuid') || null;
      }
      if (applicant) {
        application = portalDb.getOrCreateApplicationForApplicant(applicant.id);
        matricRecord = portalDb.getMatriculationByApplicationId(application.id);
      }
    }

    if (!matricRecord) {
      return NextResponse.json(
        { success: false, error: 'Matriculation record not found. Please ensure acceptance fee payment is completed.' },
        { status: 404 }
      );
    }

    const student = portalDb.getAllStudents().find(s => s.id === matricRecord?.student_id) || null;

    return NextResponse.json({
      success: true,
      matriculation: matricRecord,
      application,
      student
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
