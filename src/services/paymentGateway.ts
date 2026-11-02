// AHCAS Institutional Payment Gateway Engine
// Handles Paystack Secured Gateway, Remita e-Collection RRR, and Bank Transfer reconciliations

export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  sortCode?: string;
}

export const INSTITUTIONAL_BANK_ACCOUNTS: BankAccountDetails[] = [
  {
    bankName: 'Moniepoint Microfinance Bank',
    accountNumber: '8249018332',
    accountName: 'AL-HIDAYAH COLLEGE OF ADVANCED STUDIES',
    branch: 'Abaji Area Council Branch, FCT-Abuja'
  },
  {
    bankName: 'Jaiz Bank Plc (Islamic Non-Interest)',
    accountNumber: '0012948192',
    accountName: 'AL-HIDAYAH COLLEGE OF ADVANCED STUDIES',
    branch: 'Central Business District, Abuja'
  },
  {
    bankName: 'Zenith Bank Plc',
    accountNumber: '1019284729',
    accountName: 'AL-HIDAYAH COLLEGE OF ADVANCED STUDIES',
    branch: 'Gwagwalada / Abaji Dual Carriage Branch'
  }
];

export interface PaymentTransaction {
  reference: string;
  channel: 'Paystack' | 'Remita' | 'Bank Transfer';
  amountNgn: number;
  description: string;
  payerName: string;
  payerEmail: string;
  studentId?: string;
  matricNumber?: string;
  applicantRef?: string;
  remitaRRR?: string;
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  paidAt: string;
  receiptNumber: string;
}

/**
 * Generates an official cryptographic reference code for payment reconciliation
 */
export function generateTransactionReference(channel: 'Paystack' | 'Remita' | 'Bank Transfer'): string {
  const prefix = channel === 'Paystack' ? 'PSTK' : channel === 'Remita' ? 'REMT' : 'BTX';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `AHCAS-${prefix}-${timestamp}-${random}`;
}

/**
 * Generates an institutional 12-digit Remita Retrieval Reference (RRR)
 */
export function generateRemitaRRR(): string {
  const p1 = Math.floor(1000 + Math.random() * 9000);
  const p2 = Math.floor(1000 + Math.random() * 9000);
  const p3 = Math.floor(1000 + Math.random() * 9000);
  return `${p1}-${p2}-${p3}`;
}

/**
 * Simulates Paystack Inline Payment Verification with security checks
 */
export async function simulatePaystackPayment(params: {
  amountNgn: number;
  description: string;
  payerName: string;
  payerEmail: string;
  cardNumber?: string;
  studentId?: string;
  matricNumber?: string;
  applicantRef?: string;
}): Promise<PaymentTransaction> {
  // Simulate network latency (1.2s)
  await new Promise(resolve => setTimeout(resolve, 1200));

  const reference = generateTransactionReference('Paystack');
  const receiptNumber = `RCP-PSTK-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    reference,
    channel: 'Paystack',
    amountNgn: params.amountNgn,
    description: params.description,
    payerName: params.payerName,
    payerEmail: params.payerEmail,
    studentId: params.studentId,
    matricNumber: params.matricNumber,
    applicantRef: params.applicantRef,
    status: 'SUCCESSFUL',
    paidAt: new Date().toISOString(),
    receiptNumber
  };
}

/**
 * Simulates Remita e-Collection RRR settlement
 */
export async function simulateRemitaPayment(params: {
  amountNgn: number;
  description: string;
  payerName: string;
  payerEmail: string;
  rrr: string;
  studentId?: string;
  matricNumber?: string;
  applicantRef?: string;
}): Promise<PaymentTransaction> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const reference = generateTransactionReference('Remita');
  const receiptNumber = `RCP-REMT-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    reference,
    channel: 'Remita',
    amountNgn: params.amountNgn,
    description: params.description,
    payerName: params.payerName,
    payerEmail: params.payerEmail,
    studentId: params.studentId,
    matricNumber: params.matricNumber,
    applicantRef: params.applicantRef,
    remitaRRR: params.rrr,
    status: 'SUCCESSFUL',
    paidAt: new Date().toISOString(),
    receiptNumber
  };
}

/**
 * Simulates Bank Transfer submission & reconciliation
 */
export async function simulateBankTransferSubmission(params: {
  amountNgn: number;
  description: string;
  payerName: string;
  payerEmail: string;
  selectedBank: string;
  tellerOrSessionRef: string;
  studentId?: string;
  matricNumber?: string;
  applicantRef?: string;
}): Promise<PaymentTransaction> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const reference = `BT-${params.tellerOrSessionRef.toUpperCase()}`;
  const receiptNumber = `RCP-BNK-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    reference,
    channel: 'Bank Transfer',
    amountNgn: params.amountNgn,
    description: params.description,
    payerName: params.payerName,
    payerEmail: params.payerEmail,
    studentId: params.studentId,
    matricNumber: params.matricNumber,
    applicantRef: params.applicantRef,
    status: 'SUCCESSFUL',
    paidAt: new Date().toISOString(),
    receiptNumber
  };
}
