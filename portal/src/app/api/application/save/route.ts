import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';
import { calculateCompletion } from '@/lib/application-utils';

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

    // Lock check: Submitted applications cannot be modified
    if (application.status === 'submitted') {
      return NextResponse.json({
        success: false,
        error: 'Application has already been submitted and is locked for review. Modifications are not permitted.'
      }, { status: 403 });
    }

    const body = await request.json();
    const { step, data } = body;

    if (!step || !data) {
      return NextResponse.json({ success: false, error: 'Missing step or data payload.' }, { status: 400 });
    }

    switch (step) {
      case 'personal': {
        portalDb.savePersonalDetails(application.id, data);
        break;
      }
      case 'contact': {
        portalDb.saveContactDetails(application.id, data);
        break;
      }
      case 'guardians': {
        if (!Array.isArray(data)) {
          return NextResponse.json({ success: false, error: 'Guardians data must be an array.' }, { status: 400 });
        }
        portalDb.saveGuardians(application.id, data);
        break;
      }
      case 'qualifications': {
        if (!Array.isArray(data)) {
          return NextResponse.json({ success: false, error: 'Qualifications data must be an array.' }, { status: 400 });
        }
        portalDb.saveQualifications(application.id, data);
        break;
      }
      case 'programme': {
        const progId = typeof data === 'string' ? data : data.admission_programme_id;
        if (!progId) {
          return NextResponse.json({ success: false, error: 'Admission programme ID is required.' }, { status: 400 });
        }
        portalDb.saveProgrammeSelection(application.id, progId);
        break;
      }
      default:
        return NextResponse.json({ success: false, error: `Unrecognized wizard step: ${step}` }, { status: 400 });
    }

    const updated = portalDb.getApplicationById(application.id);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to retrieve updated application' }, { status: 500 });
    }

    const { percentage, steps } = calculateCompletion(updated);

    return NextResponse.json({
      success: true,
      message: `Step '${step}' saved successfully.`,
      application: updated,
      completionPercentage: percentage,
      stepsStatus: steps
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  return POST(request);
}
