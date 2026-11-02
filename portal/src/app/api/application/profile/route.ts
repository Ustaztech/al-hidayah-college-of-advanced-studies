import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';
import * as z from 'zod';

const updateProfileSchema = z.object({
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters' }).max(120),
  phone_number: z.string().min(10, { message: 'Please provide a valid phone number' }).max(20)
});

export async function GET() {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('applicant') && !session.roles.includes('super_admin') && !session.roles.includes('college_admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Applicant session required.' }, { status: 401 });
    }

    const applicant = portalDb.getApplicantByUserId(session.id);
    if (!applicant) {
      return NextResponse.json({ success: false, error: 'Applicant record not found.' }, { status: 404 });
    }

    const events = portalDb.getApplicantEvents(applicant.id);

    return NextResponse.json({
      success: true,
      applicant: {
        id: applicant.id,
        applicant_number: applicant.applicant_number,
        full_name: applicant.full_name || session.profile.full_name || '',
        email: session.profile.email,
        phone_number: applicant.phone_number || session.profile.phone || '',
        application_type: applicant.application_type,
        account_status: session.profile.status,
        registration_status: applicant.registration_status,
        created_at: applicant.created_at,
        updated_at: applicant.updated_at
      },
      events
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('applicant') && !session.roles.includes('super_admin') && !session.roles.includes('college_admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Applicant session required.' }, { status: 401 });
    }

    const body = await request.json();

    // Prevent modification of protected system fields
    if ('applicant_number' in body || 'roles' in body || 'registration_status' in body || 'account_status' in body || 'id' in body) {
      return NextResponse.json({
        success: false,
        error: 'Forbidden: Modifying system identifiers, roles, or registration statuses is not permitted.'
      }, { status: 403 });
    }

    const validated = updateProfileSchema.safeParse(body);
    if (!validated.success) {
      const errorMsg = validated.error.issues[0]?.message || 'Invalid profile information';
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const updated = portalDb.updateApplicantProfile(session.id, validated.data);

    return NextResponse.json({
      success: true,
      message: 'Applicant profile updated successfully.',
      applicant: updated
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
