import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';

export async function GET() {
  try {
    const programmes = portalDb.getAllProgrammes();
    return NextResponse.json({ success: true, programmes });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
