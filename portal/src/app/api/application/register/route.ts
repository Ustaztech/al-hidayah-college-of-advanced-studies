import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import * as z from 'zod';

const registerSchema = z.object({
  applicationTypeId: z.string().min(1, { message: 'Please select an application type' }),
  email: z.string().email({ message: 'Enter a valid email address' }).toLowerCase().trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Za-z]/, { message: 'Password must include letters' })
    .regex(/[0-9]/, { message: 'Password must include numbers' }),
  confirmPassword: z.string().min(1, { message: 'Confirm password is required' })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError, errors: validated.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, password, applicationTypeId } = validated.data;

    // Check if application type exists and is active
    const appType = portalDb.getApplicationTypeById(applicationTypeId);
    if (!appType) {
      return NextResponse.json({ success: false, error: 'Selected application type does not exist.' }, { status: 400 });
    }
    if (!appType.is_active) {
      return NextResponse.json({
        success: false,
        error: 'The selected application programme is currently inactive and not accepting new registrations.'
      }, { status: 400 });
    }

    // Register applicant through atomic DB process
    let result;
    try {
      result = portalDb.registerApplicant({
        email,
        password,
        applicationTypeId
      });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 });
    }

    const { user, applicant, verificationToken } = result;

    // Construct institutional verification URL
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const verificationUrl = `${protocol}://${host}/application/verify-email?token=${verificationToken}`;

    // Transactional Verification Email Template
    console.log(`[TRANSACTIONAL EMAIL — AL-HIDAYAH COLLEGE]`);
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your Email — AL-HIDAYAH College Application Portal`);
    console.log(`Body: Welcome to AL-HIDAYAH COLLEGE OF ADVANCED STUDIES.\nThank you for creating your application account.\nPlease verify your email address to activate your account and continue your application.\nVerification Link: ${verificationUrl}`);

    return NextResponse.json({
      success: true,
      message: 'Registration successful! A verification link has been sent to your email address.',
      applicantNumber: applicant.applicant_number,
      verificationToken, // Provided for instant simulation/testing environments
      verificationUrl
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Registration failed' }, { status: 500 });
  }
}
