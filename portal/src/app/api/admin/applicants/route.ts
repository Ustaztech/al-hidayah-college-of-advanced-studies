import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('super_admin') && !session.roles.includes('college_admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || undefined;
    const typeId = searchParams.get('type') || undefined;

    const applicants = portalDb.getAllApplicants(search, typeId);
    const typeCounts = portalDb.getApplicantCountsByType();

    return NextResponse.json({
      success: true,
      applicants,
      typeCounts,
      totalCount: applicants.length
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
