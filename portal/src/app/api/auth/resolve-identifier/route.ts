import { NextRequest, NextResponse } from 'next/server';
import { portalDb } from '../../../../lib/store/mockDb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identifier = body.identifier?.trim();

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: 'Identifier input is required.' },
        { status: 400 }
      );
    }

    // Resolve identifier securely on the server
    const resolved = portalDb.resolveIdentifier(identifier);

    if (!resolved) {
      return NextResponse.json(
        {
          success: false,
          message: 'No institutional account found matching this identifier. Please verify your matriculation number, staff ID, or email.'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      email: resolved.email,
      type: resolved.accountType
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Server error resolving identifier.' },
      { status: 500 }
    );
  }
}
