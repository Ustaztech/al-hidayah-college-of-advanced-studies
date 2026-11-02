import { NextRequest, NextResponse } from 'next/server';
import { getServerSessionUser } from '../../../../lib/auth/session';
import { portalDb } from '../../../../lib/store/mockDb';
import { UserRoleName } from '../../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const caller = await getServerSessionUser();

    // Verify caller is an authorized administrator
    if (!caller || (!caller.roles.includes('super_admin') && !caller.roles.includes('college_admin'))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorised. Administrative clearance required.' },
        { status: 403 }
      );
    }

    const {
      fullName,
      email,
      phone,
      provisionType,
      identifierNumber,
      role,
      departmentId,
      programmeId,
      designation,
      level
    } = await request.json();

    if (!fullName || !email || !identifierNumber) {
      return NextResponse.json(
        { success: false, message: 'Full name, email, and identifier number are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = portalDb.getProfileByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'A user account with this email already exists.' },
        { status: 409 }
      );
    }

    // Generate secure setup invitation token
    const setupToken = `ahcas-inv-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const temporarySecurePassword = `AHCAS@${Math.random().toString(36).substring(2, 8)}!`;
    const newUserId = `usr-${Date.now()}`;

    // Provision user profile and credentials
    portalDb.createUserWithProfile({
      userId: newUserId,
      email: cleanEmail,
      password: temporarySecurePassword,
      fullName: fullName.trim(),
      phone: phone || undefined,
      status: 'active',
      role: (role as UserRoleName) || (provisionType === 'student' ? 'student' : 'staff')
    });

    // Create student or staff entity record
    if (provisionType === 'student') {
      (portalDb as any).students.set(`std-${Date.now()}`, {
        id: `std-${Date.now()}`,
        user_id: newUserId,
        matric_number: identifierNumber.trim(),
        programme_id: programmeId || null,
        level: level || '100',
        status: 'active',
        created_at: new Date().toISOString()
      });
    } else {
      (portalDb as any).staff.set(`stf-${Date.now()}`, {
        id: `stf-${Date.now()}`,
        user_id: newUserId,
        staff_number: identifierNumber.trim(),
        department_id: departmentId || null,
        designation: designation || 'Academic Staff',
        status: 'active',
        created_at: new Date().toISOString()
      });
    }

    portalDb.addAuditLog(
      caller.id,
      'USER_ACCOUNT_PROVISIONED',
      'profiles',
      newUserId,
      {
        email: cleanEmail,
        provisionType,
        identifierNumber,
        assignedRole: role
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Account successfully provisioned.',
      userId: newUserId,
      setupToken,
      temporaryPassword: temporarySecurePassword
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Server error provisioning account.' },
      { status: 500 }
    );
  }
}
