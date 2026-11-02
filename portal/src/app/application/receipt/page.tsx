import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSessionUser } from '@/lib/auth/session';
import { ApplicantPortalLayout } from '@/components/layout/ApplicantPortalLayout';
import { portalDb } from '@/lib/store/mockDb';
import { ReceiptClient } from './ReceiptClient';

interface ReceiptPageProps {
  searchParams: Promise<{
    receiptNumber?: string;
    paymentId?: string;
    applicationId?: string;
  }>;
}

export default async function ApplicationReceiptPage({ searchParams }: ReceiptPageProps) {
  const session = await getServerSessionUser();
  const params = await searchParams;

  if (!session) {
    redirect('/application/login?redirect=/application/receipt');
  }

  const hasAccess =
    session.roles.includes('applicant') ||
    session.roles.includes('student') ||
    session.roles.includes('super_admin') ||
    session.roles.includes('college_admin') ||
    session.roles.includes('bursar');

  if (!hasAccess) {
    redirect('/portal/unauthorised');
  }

  let payment = null;
  let application = null;

  if (params.receiptNumber) {
    payment = portalDb.getPaymentByReceiptNumber(params.receiptNumber);
    if (payment) {
      application = portalDb.getApplicationById(payment.application_id);
    }
  } else if (params.paymentId) {
    payment = portalDb.getPaymentById(params.paymentId);
    if (payment) {
      application = portalDb.getApplicationById(payment.application_id);
    }
  } else if (params.applicationId) {
    application = portalDb.getApplicationById(params.applicationId);
    if (application) {
      const invoices = portalDb.getInvoicesByApplicationId(application.id);
      const paid = invoices.find(i => i.status === 'paid' && i.payment);
      payment = paid?.payment || null;
    }
  } else {
    // Current user's application
    let applicant = session.applicant;
    if (!applicant && (session.roles.includes('super_admin') || session.roles.includes('college_admin'))) {
      applicant = portalDb.getApplicantByUserId('usr-applicant-uuid') || undefined;
    }
    if (!applicant) {
      const allApps = portalDb.getAllApplications();
      const appForUser = allApps.find(a => a.applicant?.user_id === session.id);
      if (appForUser?.applicant) {
        applicant = appForUser.applicant;
      }
    }

    if (applicant) {
      application = portalDb.getOrCreateApplicationForApplicant(applicant.id);
      const invoices = portalDb.getInvoicesByApplicationId(application.id);
      const paid = invoices.find(i => i.status === 'paid' && i.payment);
      payment = paid?.payment || null;
    }
  }

  if (!payment || !application) {
    redirect('/application/payments');
  }

  const invoice = portalDb.getInvoiceById(payment.invoice_id);
  if (!invoice) {
    redirect('/application/payments');
  }

  return (
    <ApplicantPortalLayout user={session} title="Official College Bursary Receipt">
      <ReceiptClient
        user={session}
        payment={payment}
        invoice={invoice}
        application={application}
      />
    </ApplicantPortalLayout>
  );
}
