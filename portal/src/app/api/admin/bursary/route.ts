import { NextRequest, NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSessionUser();
    if (
      !session ||
      (!session.roles.includes('super_admin') &&
        !session.roles.includes('college_admin') &&
        !session.roles.includes('bursar'))
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Bursary administrative privileges required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const feeType = searchParams.get('feeType') || undefined;
    const status = searchParams.get('status') || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;

    const invoices = portalDb.getAllInvoices({
      feeType,
      status,
      searchQuery
    });

    const counts = portalDb.getCounts();

    return NextResponse.json({
      success: true,
      invoices,
      counts
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSessionUser();
    if (
      !session ||
      (!session.roles.includes('super_admin') &&
        !session.roles.includes('college_admin') &&
        !session.roles.includes('bursar'))
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Bursary privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { invoiceId, tellerNumber, bankName, payerName, payerEmail } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required.' },
        { status: 400 }
      );
    }

    const result = portalDb.processPayment({
      invoiceId,
      paymentMethod: 'bank_branch',
      payerName: payerName || `Bank Teller: ${bankName || 'Commercial Bank'}`,
      payerEmail: payerEmail || session.email,
      transactionRef: tellerNumber ? `TELLER-${tellerNumber}` : undefined
    });

    return NextResponse.json({
      success: true,
      message: 'Offline bank branch payment recorded and verified successfully.',
      payment: result.payment,
      invoice: result.invoice,
      matriculation: result.matriculation
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
