import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';
import { ApplicationDocument } from '@/lib/types';
import { calculateCompletion } from '@/lib/application-utils';

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const docIdentifier = params.id;

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

    if (application.status === 'submitted') {
      return NextResponse.json({
        success: false,
        error: 'Application has already been submitted and cannot be modified.'
      }, { status: 403 });
    }

    // Determine if docIdentifier is document_type or id
    const knownTypes: ApplicationDocument['document_type'][] = [
      'passport_photo',
      'olevel_result',
      'birth_certificate',
      'state_origin',
      'other'
    ];

    let targetType: ApplicationDocument['document_type'] | null = null;
    if (knownTypes.includes(docIdentifier as any)) {
      targetType = docIdentifier as ApplicationDocument['document_type'];
    } else {
      const existing = (application.documents || []).find(d => d.id === docIdentifier);
      if (existing) {
        targetType = existing.document_type;
      }
    }

    if (!targetType) {
      return NextResponse.json({ success: false, error: 'Document not found.' }, { status: 404 });
    }

    portalDb.removeDocument(application.id, targetType);

    const updated = portalDb.getApplicationById(application.id)!;
    const { percentage, steps } = calculateCompletion(updated);

    return NextResponse.json({
      success: true,
      message: 'Document removed successfully.',
      application: updated,
      completionPercentage: percentage,
      stepsStatus: steps
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
