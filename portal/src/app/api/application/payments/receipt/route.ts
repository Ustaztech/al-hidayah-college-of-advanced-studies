import { NextRequest, NextResponse } from 'next/server';
import { portalDb } from '@/lib/store/mockDb';
import { getServerSessionUser } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
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
        { success: false, error: 'Unauthorized: Session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const receiptNumber = searchParams.get('receiptNumber');
    const paymentId = searchParams.get('paymentId');
    const applicationId = searchParams.get('applicationId');

    let payment = null;

    if (receiptNumber) {
      payment = portalDb.getPaymentByReceiptNumber(receiptNumber);
    } else if (paymentId) {
      payment = portalDb.getPaymentById(paymentId);
    } else if (applicationId) {
      const invoices = portalDb.getInvoicesByApplicationId(applicationId);
      const paidInvoice = invoices.find(i => i.status === 'paid' && i.payment);
      payment = paidInvoice?.payment || null;
    } else {
      // Find for current logged in user
      const applicant = portalDb.getApplicantByUserId(session.id);
      if (applicant) {
        const app = portalDb.getOrCreateApplicationForApplicant(applicant.id);
        const invoices = portalDb.getInvoicesByApplicationId(app.id);
        const paidInvoice = invoices.find(i => i.status === 'paid' && i.payment);
        payment = paidInvoice?.payment || null;
      }
    }

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Official payment receipt not found.' },
        { status: 404 }
      );
    }

    const invoice = portalDb.getInvoiceById(payment.invoice_id);
    const application = portalDb.getApplicationById(payment.application_id);

    return NextResponse.json({
      success: true,
      payment,
      invoice,
      application
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
