import { NextRequest, NextResponse } from 'next/server';
import { portalDb } from '../../../../lib/store/mockDb';

export async function POST(request: NextRequest) {
  try {
    const { identifier, email, newPassword, action } = await request.json();

    if (action === 'request') {
      if (!identifier) {
        return NextResponse.json({ success: false, message: 'Identifier is required.' }, { status: 400 });
      }

      const resolved = portalDb.resolveIdentifier(identifier);
      if (!resolved) {
        return NextResponse.json(
          { success: false, message: 'No registered user found with this identifier.' },
          { status: 404 }
        );
      }

      portalDb.addAuditLog(null, 'PASSWORD_RESET_REQUESTED', 'profiles', null, { target: resolved.email });

      return NextResponse.json({
        success: true,
        message: 'Password reset instructions have been generated.',
        targetEmail: resolved.email
      });
    }

    if (action === 'confirm') {
      if (!email || !newPassword) {
        return NextResponse.json({ success: false, message: 'Email and new password are required.' }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ success: false, message: 'Password must be at least 8 characters.' }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      const updated = portalDb.updatePassword(cleanEmail, newPassword);

      if (!updated) {
        return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
      }

      portalDb.addAuditLog(null, 'PASSWORD_RESET_COMPLETED', 'profiles', null, { email: cleanEmail });

      return NextResponse.json({
        success: true,
        message: 'Password successfully updated.'
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Internal error processing reset.' }, { status: 500 });
  }
}
