import { NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    // Check if user is admin requesting all
    const session = await getServerSessionUser();
    const isAdmin = session?.roles.includes('super_admin') || session?.roles.includes('college_admin');

    const activeOnly = !(all && isAdmin);

    // If live Supabase configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      const supabase = await createClient();
      let query = supabase.from('application_types').select('*').order('created_at', { ascending: true });
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({ success: true, types: data });
      }
    }

    const types = portalDb.getApplicationTypes(activeOnly);
    return NextResponse.json({ success: true, types });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSessionUser();
    if (!session || (!session.roles.includes('super_admin') && !session.roles.includes('college_admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, code, description, is_active } = body;

    if (!name || !code) {
      return NextResponse.json({ success: false, error: 'Name and unique code are required.' }, { status: 400 });
    }

    const created = portalDb.addApplicationType(name, code, description, is_active ?? true);
    return NextResponse.json({ success: true, type: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
