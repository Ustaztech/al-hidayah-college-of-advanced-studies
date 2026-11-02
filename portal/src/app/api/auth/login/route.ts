import { NextRequest, NextResponse } from 'next/server';
import { portalDb } from '../../../../lib/store/mockDb';
import { getPrimaryDashboardForRoles } from '../../../../lib/auth/roles';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const profile = portalDb.getProfileByEmail(cleanEmail);

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'No registered user found for this email address.' },
        { status: 401 }
      );
    }

    // Inactive Account Rejection (Section 5 Requirement)
    if (profile.status === 'inactive' || profile.status === 'suspended') {
      portalDb.addAuditLog(
        profile.id,
        'LOGIN_BLOCKED_INACTIVE',
        'profiles',
        profile.id,
        { reason: `Account status is ${profile.status}` }
      );
      return NextResponse.json(
        {
          success: false,
          message: `Your portal account is currently ${profile.status.toUpperCase()}. Please contact the Directorate of Academic Registry or Student Affairs.`
        },
        { status: 403 }
      );
    }

    // Password Validation
    const isPasswordValid = portalDb.verifyCredentials(cleanEmail, password);
    if (!isPasswordValid) {
      portalDb.addAuditLog(
        profile.id,
        'LOGIN_FAILED_WRONG_PASSWORD',
        'profiles',
        profile.id,
        { email: cleanEmail }
      );
      return NextResponse.json(
        { success: false, message: 'Invalid password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // Retrieve Roles
    const roles = portalDb.getUserRoles(profile.id);
    const redirectUrl = getPrimaryDashboardForRoles(roles);

    // Build session token payload
    const sessionPayload = {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      roles,
      status: profile.status,
      timestamp: Date.now()
    };
    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    // Create response and set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      redirectUrl,
      roles
    });

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day

    response.cookies.set('ahcas_portal_session', sessionToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge
    });

    portalDb.addAuditLog(
      profile.id,
      'LOGIN_SUCCESS',
      'profiles',
      profile.id,
      { roles }
    );

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
