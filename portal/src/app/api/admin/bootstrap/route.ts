import { NextRequest, NextResponse } from 'next/server';
import { portalDb } from '../../../../lib/store/mockDb';

export async function POST(request: NextRequest) {
  try {
    const { adminEmail, bootstrapKey, fullName, newPassword } = await request.json();

    const authorizedAdminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@alhidayahcollege.com.ng';
    const authorizedBootstrapKey = process.env.ADMIN_BOOTSTRAP_SECRET_KEY || 'AHCAS-INSTITUTIONAL-SECURE-KEY-2026';

    if (!bootstrapKey || bootstrapKey !== authorizedBootstrapKey) {
      return NextResponse.json(
        { success: false, message: 'Invalid bootstrap authorization key.' },
        { status: 403 }
      );
    }

    if (adminEmail?.toLowerCase() !== authorizedAdminEmail.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'This email is not authorized for administrator bootstrap.' },
        { status: 403 }
      );
    }

    const existing = portalDb.getProfileByEmail(authorizedAdminEmail);

    if (existing) {
      if (newPassword) {
        portalDb.updatePassword(authorizedAdminEmail, newPassword);
      }
      return NextResponse.json({
        success: true,
        message: 'Administrator account already configured. Security credentials refreshed.'
      });
    }

    // Provision Super Admin
    const adminId = 'usr-super-admin-01';
    portalDb.createUserWithProfile({
      userId: adminId,
      email: authorizedAdminEmail,
      password: newPassword || 'AdminPassword2026!',
      fullName: fullName || 'Chief Administrator',
      status: 'active',
      role: 'super_admin'
    });

    portalDb.addAuditLog(adminId, 'ADMIN_BOOTSTRAP_COMPLETED', 'profiles', adminId, { email: authorizedAdminEmail });

    return NextResponse.json({
      success: true,
      message: 'Initial administrator bootstrap successfully completed.',
      adminEmail: authorizedAdminEmail
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Error running administrator bootstrap.' },
      { status: 500 }
    );
  }
}
