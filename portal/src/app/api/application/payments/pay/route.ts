import { NextRequest, NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSessionUser();
    if (
      !session ||
      (!session.roles.includes('applicant') &&
        !session.roles.includes('student') &&
        !session.roles.includes('super_admin') &&
        !session.roles.includes('college_admin') &&
        !session.roles.includes('bursar'))
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Session required to make payments.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { invoiceId, paymentMethod, payerName, payerEmail, transactionRef } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required.' },
        { status: 400 }
      );
    }

    const validMethods = ['card', 'bank_transfer', 'ussd', 'bank_branch'];
    if (!paymentMethod || !validMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, error: 'Valid payment method is required (card, bank_transfer, ussd, bank_branch).' },
        { status: 400 }
      );
    }

    const result = portalDb.processPayment({
      invoiceId,
      paymentMethod,
      payerName: payerName || session.profile.full_name,
      payerEmail: payerEmail || session.profile.email,
      transactionRef
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and processed successfully.',
      payment: result.payment,
      invoice: result.invoice,
      matriculation: result.matriculation
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
