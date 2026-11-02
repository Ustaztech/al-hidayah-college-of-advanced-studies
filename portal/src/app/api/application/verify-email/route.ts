import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, resendEmail } = body;

    // Resend requested
    if (resendEmail) {
      const cleanEmail = resendEmail.trim().toLowerCase();
      const profile = portalDb.getProfileByEmail(cleanEmail);
      if (!profile) {
        return NextResponse.json({
          success: false,
          error: 'No application account found with this email address.'
        }, { status: 404 });
      }

      const applicant = portalDb.getApplicantByUserId(profile.id);
      if (!applicant) {
        return NextResponse.json({
          success: false,
          error: 'User is not registered as an applicant.'
        }, { status: 400 });
      }

      if (applicant.registration_status === 'verified') {
        return NextResponse.json({
          success: true,
          alreadyVerified: true,
          message: 'Your email is already verified. You can proceed to log in.'
        });
      }

      const newToken = portalDb.createVerificationToken(profile.id, cleanEmail);
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const verificationUrl = `${protocol}://${host}/application/verify-email?token=${newToken}`;

      console.log(`[RESENT VERIFICATION EMAIL] To: ${cleanEmail} -> ${verificationUrl}`);

      return NextResponse.json({
        success: true,
        message: 'A fresh verification link has been dispatched to your email address.',
        verificationToken: newToken,
        verificationUrl
      });
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Verification token is required.' }, { status: 400 });
    }

    const verificationResult = portalDb.verifyEmailToken(token);

    if (!verificationResult.success) {
      return NextResponse.json({
        success: false,
        error: verificationResult.error || 'Verification failed.'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email address verified successfully! Your application account is now active.',
      applicant: verificationResult.applicant
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Verification error' }, { status: 500 });
  }
}
