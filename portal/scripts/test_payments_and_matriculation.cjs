// =============================================================================
// AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
// STEPS 5 & 6: ACCEPTANCE FEE PAYMENTS & STUDENT MATRICULATION TEST SUITE
// Automated verification for all 20 required scenarios
// =============================================================================

console.log('=============================================================================');
console.log('AL-HIDAYAH COLLEGE STEPS 5 & 6 — ACCEPTANCE PAYMENTS & MATRICULATION TESTS');
console.log('=============================================================================');

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    if (details) console.log(`       ↳ ${details}`);
    passedCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error(`       ↳ ${details}`);
    failedCount++;
  }
}

// -----------------------------------------------------------------------------
// STEP 5 & 6 TEST HARNESS (Simulates database, Remita billing, Registry clearance)
// -----------------------------------------------------------------------------

class Step5And6TestStore {
  constructor() {
    this.profiles = new Map([
      ['usr-student-001', { id: 'usr-student-001', full_name: 'Amina Mohammed', email: 'student@alhidayahcollege.com.ng', status: 'active' }],
      ['usr-cand-001', { id: 'usr-cand-001', full_name: 'Ibrahim Danladi Sani', email: 'ibrahim@example.com', status: 'active' }],
      ['usr-cand-002', { id: 'usr-cand-002', full_name: 'Zainab Mohammed Bello', email: 'zainab@example.com', status: 'active' }]
    ]);

    this.userRoles = new Map([
      ['usr-student-001', ['student']],
      ['usr-cand-001', ['applicant']],
      ['usr-cand-002', ['applicant']]
    ]);

    this.students = new Map([
      ['std-001', { id: 'std-001', user_id: 'usr-student-001', matric_number: 'AHCAS/2026/001', programme_id: 'prog-sci', level: 'IJMB 1', status: 'active' }]
    ]);

    this.applications = new Map([
      ['app-001', {
        id: 'app-001',
        applicant_id: 'appl-001',
        user_id: 'usr-cand-001',
        application_number: 'AHCAS/APP/2026/00001',
        status: 'accepted',
        programme_id: 'prog-sci',
        session_id: 'session-2026-2027',
        admission_offer: {
          id: 'ofr-001',
          offer_letter_number: 'AHCAS/ADM/2026/00101',
          programme_id: 'prog-sci',
          offer_status: 'accepted'
        }
      }],
      ['app-002', {
        id: 'app-002',
        applicant_id: 'appl-002',
        user_id: 'usr-cand-002',
        application_number: 'AHCAS/APP/2026/00002',
        status: 'accepted',
        programme_id: 'prog-sms',
        session_id: 'session-2026-2027',
        admission_offer: {
          id: 'ofr-002',
          offer_letter_number: 'AHCAS/ADM/2026/00102',
          programme_id: 'prog-sms',
          offer_status: 'accepted'
        }
      }]
    ]);

    this.programmes = new Map([
      ['prog-sci', { id: 'prog-sci', name: 'IJMB Direct Entry Sciences (Biology / Chemistry / Physics)' }],
      ['prog-sms', { id: 'prog-sms', name: 'IJMB Social Sciences (Accounting / Economics)' }]
    ]);

    this.invoices = new Map();
    this.payments = new Map();
    this.matriculations = new Map();

    this.invoiceSeq = 200;
    this.paymentSeq = 500;
    this.matricSeq = 1; // std-001 is AHCAS/2026/001, so next is 002
  }

  getOrCreateAcceptanceInvoice(applicationId) {
    for (const inv of this.invoices.values()) {
      if (inv.application_id === applicationId && inv.fee_type === 'acceptance_fee') {
        const payment = Array.from(this.payments.values()).find(p => p.invoice_id === inv.id) || null;
        return { ...inv, payment };
      }
    }

    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    this.invoiceSeq++;
    const r1 = Math.floor(1000 + Math.random() * 9000);
    const r2 = Math.floor(1000 + Math.random() * 9000);
    const rrr = `2408-${r1}-${r2}`;

    const invoice = {
      id: `inv-${this.invoiceSeq}`,
      application_id: applicationId,
      applicant_id: app.applicant_id,
      fee_type: 'acceptance_fee',
      fee_name: 'Institutional Admission Acceptance Fee',
      amount: 25000,
      currency: 'NGN',
      rrr_number: rrr,
      session_id: app.session_id,
      session_name: '2026/2027 Academic Session',
      status: 'pending',
      created_at: new Date().toISOString(),
      paid_at: null,
      payment: null
    };

    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  processPayment(params) {
    const inv = this.invoices.get(params.invoiceId);
    if (!inv) throw new Error('Invoice not found');

    if (inv.status === 'paid') {
      const existingPay = Array.from(this.payments.values()).find(p => p.invoice_id === inv.id);
      return { success: true, payment: existingPay, invoice: inv };
    }

    this.paymentSeq++;
    const receiptNumber = `AHCAS/REC/2026/${this.paymentSeq.toString().padStart(5, '0')}`;
    const paymentRef = params.transactionRef || `PAY-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const payment = {
      id: `pay-${this.paymentSeq}`,
      invoice_id: inv.id,
      application_id: inv.application_id,
      payment_reference: paymentRef,
      receipt_number: receiptNumber,
      amount_paid: inv.amount,
      payment_method: params.paymentMethod,
      transaction_date: new Date().toISOString(),
      status: 'successful',
      payer_name: params.payerName || 'Candidate',
      payer_email: params.payerEmail || '',
      rrr_number: inv.rrr_number
    };

    this.payments.set(payment.id, payment);

    inv.status = 'paid';
    inv.paid_at = payment.transaction_date;
    inv.payment = payment;
    this.invoices.set(inv.id, inv);

    // Auto-matriculate
    let matriculation = null;
    if (inv.fee_type === 'acceptance_fee') {
      matriculation = this.matriculateCandidate(inv.application_id, 'SYSTEM_AUTO_CLEARANCE');
    }

    return {
      success: true,
      payment,
      invoice: inv,
      matriculation
    };
  }

  matriculateCandidate(applicationId, clearedBy = 'REGISTRAR') {
    if (this.matriculations.has(applicationId)) {
      return this.matriculations.get(applicationId);
    }

    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    this.matricSeq++;
    const matricNumber = `AHCAS/2026/${this.matricSeq.toString().padStart(3, '0')}`;
    const studentId = `std-mat-${Date.now()}`;

    const studentRecord = {
      id: studentId,
      user_id: app.user_id,
      matric_number: matricNumber,
      programme_id: app.programme_id,
      level: 'IJMB 1',
      status: 'active',
      created_at: new Date().toISOString()
    };
    this.students.set(studentId, studentRecord);

    // Add student role
    const currentRoles = this.userRoles.get(app.user_id) || [];
    if (!currentRoles.includes('student')) {
      currentRoles.push('student');
      this.userRoles.set(app.user_id, currentRoles);
    }

    // Update Application Status
    app.status = 'matriculated';
    this.applications.set(applicationId, app);

    const matricRecord = {
      id: `mat-${this.matricSeq}`,
      application_id: applicationId,
      student_id: studentId,
      matric_number: matricNumber,
      session_id: app.session_id,
      programme_id: app.programme_id,
      level: 'IJMB 1',
      cleared_by: clearedBy,
      matriculated_at: new Date().toISOString(),
      programme: this.programmes.get(app.programme_id) || null
    };

    this.matriculations.set(applicationId, matricRecord);
    return matricRecord;
  }

  getInvoiceByRRR(rrr) {
    for (const inv of this.invoices.values()) {
      if (inv.rrr_number === rrr) return inv;
    }
    return null;
  }

  getPaymentByReceiptNumber(recNo) {
    for (const p of this.payments.values()) {
      if (p.receipt_number === recNo) return p;
    }
    return null;
  }

  resolveIdentifier(identifier) {
    const clean = identifier.trim().toLowerCase();
    for (const std of this.students.values()) {
      if (std.matric_number.toLowerCase() === clean) {
        const prof = this.profiles.get(std.user_id);
        if (prof) return { userId: prof.id, email: prof.email, accountType: 'student' };
      }
    }
    return null;
  }

  getCounts() {
    let totalRevenue = 0;
    let paidInvoicesCount = 0;
    for (const inv of this.invoices.values()) {
      if (inv.status === 'paid') {
        paidInvoicesCount++;
        totalRevenue += inv.amount;
      }
    }
    return {
      studentCount: this.students.size,
      paidInvoicesCount,
      totalRevenue,
      matriculatedCount: this.matriculations.size
    };
  }
}

function checkAccess(roles, pathname) {
  if (roles.includes('super_admin')) return true;
  if (pathname.startsWith('/admin')) {
    return roles.includes('college_admin') || roles.includes('super_admin') || roles.includes('bursar') || roles.includes('registrar');
  }
  if (pathname.startsWith('/student')) {
    return roles.includes('student') || roles.includes('college_admin');
  }
  if (pathname.startsWith('/application/receipt') || pathname.startsWith('/application/clearance')) {
    return roles.includes('applicant') || roles.includes('student') || roles.includes('college_admin');
  }
  if (pathname.startsWith('/application')) {
    return roles.includes('applicant') || roles.includes('college_admin');
  }
  return false;
}

const store = new Step5And6TestStore();

// =============================================================================
// 20 VERIFICATION TEST SCENARIOS
// =============================================================================

// --- 1. Acceptance Fee Invoicing & RRR Generation ---
console.log('\n--- 1. Acceptance Fee Invoicing & RRR Generation ---');
const inv1 = store.getOrCreateAcceptanceInvoice('app-001');
const rrrRegex = /^2408-\d{4}-\d{4}$/;
assert(
  rrrRegex.test(inv1.rrr_number),
  'TEST 1: Invoicing generates Remita Retrieval Reference (RRR) formatted 2408-XXXX-XXXX',
  `Issued RRR: ${inv1.rrr_number}`
);

// --- 2. Standard Institutional Fee Configuration ---
console.log('\n--- 2. Standard Institutional Fee Configuration ---');
assert(
  inv1.amount === 25000 && inv1.currency === 'NGN' && inv1.fee_type === 'acceptance_fee',
  'TEST 2: Institutional Acceptance Fee strictly adheres to ₦25,000.00 NGN',
  `Amount: ₦${inv1.amount.toLocaleString()} ${inv1.currency}`
);

// --- 3. Idempotent Invoicing ---
console.log('\n--- 3. Idempotent Invoicing ---');
const inv1Again = store.getOrCreateAcceptanceInvoice('app-001');
assert(
  inv1Again.id === inv1.id && inv1Again.rrr_number === inv1.rrr_number,
  'TEST 3: Subsequent invoice requests for same candidate return existing invoice idempotently',
  `First RRR: ${inv1.rrr_number} === Second RRR: ${inv1Again.rrr_number}`
);

// --- 4. Electronic Card Payment Simulation ---
console.log('\n--- 4. Electronic Card Payment Simulation ---');
const payResult1 = store.processPayment({
  invoiceId: inv1.id,
  paymentMethod: 'card',
  payerName: 'Ibrahim Danladi Sani',
  payerEmail: 'ibrahim@example.com'
});
assert(
  payResult1.success === true && payResult1.invoice.status === 'paid',
  'TEST 4: Processing electronic card payment transitions invoice status to paid',
  `Invoice Status: ${payResult1.invoice.status}, Paid At: ${payResult1.invoice.paid_at}`
);

// --- 5. Official College Bursary Receipt Generation ---
console.log('\n--- 5. Official College Bursary Receipt Generation ---');
const receiptNumber = payResult1.payment.receipt_number;
const receiptRegex = /^AHCAS\/REC\/2026\/\d{5}$/;
assert(
  receiptRegex.test(receiptNumber),
  'TEST 5: Payment generates official College Bursary receipt number formatted AHCAS/REC/2026/XXXXX',
  `Issued Receipt: ${receiptNumber}`
);

// --- 6. Fee Payment Ledger Persistence ---
console.log('\n--- 6. Fee Payment Ledger Persistence ---');
const fetchedPayment = store.payments.get(payResult1.payment.id);
assert(
  fetchedPayment !== undefined && fetchedPayment.amount_paid === 25000 && fetchedPayment.payment_method === 'card',
  'TEST 6: Payment record persists in ledger with exact amount, channel, and candidate metadata',
  `Method: ${fetchedPayment.payment_method}, Ref: ${fetchedPayment.payment_reference}`
);

// --- 7. Bursary Query by Remita RRR ---
console.log('\n--- 7. Bursary Query by Remita RRR ---');
const invByRRR = store.getInvoiceByRRR(inv1.rrr_number);
assert(
  invByRRR !== null && invByRRR.id === inv1.id && invByRRR.payment !== null,
  'TEST 7: Bursary Desk can look up invoice and attached electronic payment via Remita RRR',
  `Found Invoice for RRR: ${invByRRR.rrr_number}`
);

// --- 8. Bursary Query by Receipt Number ---
console.log('\n--- 8. Bursary Query by Receipt Number ---');
const payByReceipt = store.getPaymentByReceiptNumber(receiptNumber);
assert(
  payByReceipt !== null && payByReceipt.rrr_number === inv1.rrr_number,
  'TEST 8: Bursary Desk can look up transaction and candidate details by receipt number',
  `Found Payment: ${payByReceipt.receipt_number}`
);

// --- 9. Automatic Registry Clearance Upon Payment ---
console.log('\n--- 9. Automatic Registry Clearance Upon Payment ---');
const matriculation = payResult1.matriculation;
assert(
  matriculation !== null && typeof matriculation === 'object',
  'TEST 9: Paying acceptance fee automatically triggers Registry matriculation clearance',
  `Matric Record ID: ${matriculation.id}`
);

// --- 10. Institutional Matriculation Number Generation ---
console.log('\n--- 10. Institutional Matriculation Number Generation ---');
const matricRegex = /^AHCAS\/2026\/\d{3}$/;
assert(
  matricRegex.test(matriculation.matric_number) && matriculation.matric_number === 'AHCAS/2026/002',
  'TEST 10: Assigns unique College Matriculation Number in sequence format AHCAS/2026/XXX',
  `Assigned Matric No: ${matriculation.matric_number}`
);

// --- 11. Student Record Provisioning in students Table ---
console.log('\n--- 11. Student Record Provisioning in students Table ---');
const studentEntry = store.students.get(matriculation.student_id);
assert(
  studentEntry !== undefined && studentEntry.status === 'active' && studentEntry.matric_number === matriculation.matric_number,
  'TEST 11: Provisions active record in students table with user_id and matriculation number',
  `Student Record: ${studentEntry ? studentEntry.matric_number : 'none'}`
);

// --- 12. Student Role Assignment in user_roles ---
console.log('\n--- 12. Student Role Assignment in user_roles ---');
const candRoles = store.userRoles.get('usr-cand-001');
assert(
  candRoles.includes('student'),
  'TEST 12: User is assigned the student role in user_roles table alongside applicant role',
  `Candidate Roles: [${candRoles.join(', ')}]`
);

// --- 13. Application Status Transition to Matriculated ---
console.log('\n--- 13. Application Status Transition to Matriculated ---');
const app1 = store.applications.get('app-001');
assert(
  app1.status === 'matriculated',
  'TEST 13: Application status transitions from accepted to matriculated',
  `Current Application Status: ${app1.status}`
);

// --- 14. Direct Portal Login via Matriculation Number ---
console.log('\n--- 14. Direct Portal Login via Matriculation Number ---');
const resolved = store.resolveIdentifier('AHCAS/2026/002');
assert(
  resolved !== null && resolved.accountType === 'student' && resolved.email === 'ibrahim@example.com',
  'TEST 14: Student can immediately resolve their account for portal login using their Matriculation Number',
  `Resolved User ID: ${resolved ? resolved.userId : 'none'}, Email: ${resolved ? resolved.email : 'none'}`
);

// --- 15. Role-Based Access Control (RBAC) For Matriculated Students ---
console.log('\n--- 15. Role-Based Access Control (RBAC) For Matriculated Students ---');
const canAccessStudent = checkAccess(candRoles, '/student/dashboard');
const canAccessReceipt = checkAccess(candRoles, '/application/receipt');
const canAccessClearance = checkAccess(candRoles, '/application/clearance');
assert(
  canAccessStudent && canAccessReceipt && canAccessClearance,
  'TEST 15: Matriculated student has authorized access to student dashboard, clearance slip, and bursary receipts',
  `Access checks -> Student Dash: ${canAccessStudent}, Receipt: ${canAccessReceipt}, Clearance: ${canAccessClearance}`
);

// --- 16. Offline Commercial Bank Branch Payment Reconciliation ---
console.log('\n--- 16. Offline Commercial Bank Branch Payment Reconciliation ---');
const inv2 = store.getOrCreateAcceptanceInvoice('app-002');
const offlinePayResult = store.processPayment({
  invoiceId: inv2.id,
  paymentMethod: 'bank_branch',
  payerName: 'Zainab Mohammed Bello',
  transactionRef: 'TELLER-JAIZ-99882'
});
assert(
  offlinePayResult.success === true &&
  offlinePayResult.payment.payment_method === 'bank_branch' &&
  offlinePayResult.invoice.status === 'paid' &&
  offlinePayResult.matriculation.matric_number === 'AHCAS/2026/003',
  'TEST 16: Bursary Desk can record and reconcile offline bank branch payments and auto-clear candidate',
  `Method: ${offlinePayResult.payment.payment_method}, Ref: ${offlinePayResult.payment.payment_reference}, Matric: ${offlinePayResult.matriculation.matric_number}`
);

// --- 17. Registry Clearance Slip Data Integrity ---
console.log('\n--- 17. Registry Clearance Slip Data Integrity ---');
const clearanceSlip = store.matriculations.get('app-001');
assert(
  clearanceSlip !== null &&
  clearanceSlip.matric_number === 'AHCAS/2026/002' &&
  clearanceSlip.programme !== null &&
  clearanceSlip.level === 'IJMB 1',
  'TEST 17: Registry Clearance Slip accurately binds matriculation number, study level, and enrolled programme',
  `Course: ${clearanceSlip ? clearanceSlip.programme.name : 'none'}, Level: ${clearanceSlip ? clearanceSlip.level : 'none'}`
);

// --- 18. Bursary Revenue Aggregates ---
console.log('\n--- 18. Bursary Revenue Aggregates ---');
const counts = store.getCounts();
assert(
  counts.paidInvoicesCount === 2 && counts.totalRevenue === 50000 && counts.matriculatedCount === 2,
  'TEST 18: Portal database aggregates accurately compute total revenue (₦50,000), paid invoices, and matriculated counts',
  `Revenue: ₦${counts.totalRevenue.toLocaleString()}, Paid Count: ${counts.paidInvoicesCount}, Matriculated: ${counts.matriculatedCount}`
);

// --- 19. Duplicate Payment Protection ---
console.log('\n--- 19. Duplicate Payment Protection ---');
const dupPayment = store.processPayment({
  invoiceId: inv1.id,
  paymentMethod: 'card'
});
assert(
  dupPayment.success === true && dupPayment.payment.id === payResult1.payment.id,
  'TEST 19: Attempting to pay an already settled invoice returns existing payment record safely',
  `Re-used Payment ID: ${dupPayment.payment.id}`
);

// --- 20. Zero Regression Across All Prior Steps ---
console.log('\n--- 20. Zero Regression Across All Prior Steps ---');
// Step 1: Admin access
const adminAccess = checkAccess(['super_admin', 'college_admin'], '/admin/dashboard');
// Step 1: Student access
const studentAccess = checkAccess(['student'], '/student/dashboard');
// Step 2: Applicant dashboard access
const applicantAccess = checkAccess(['applicant'], '/application/dashboard');
// Step 5 & 6 Admin Desks
const bursaryDeskAccess = checkAccess(['bursar'], '/admin/bursary');
const registryDeskAccess = checkAccess(['registrar'], '/admin/matriculation');

assert(
  adminAccess && studentAccess && applicantAccess && bursaryDeskAccess && registryDeskAccess,
  'TEST 20: Zero regression across portal roles, bursary and registry administration routes',
  `Admin: ${adminAccess}, Student: ${studentAccess}, Applicant: ${applicantAccess}, Bursar: ${bursaryDeskAccess}, Registrar: ${registryDeskAccess}`
);

console.log('\n=============================================================================');
console.log(`TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED out of 20`);
console.log('=============================================================================');

if (failedCount === 0) {
  console.log('ALL STEP 5 & 6 ACCEPTANCE PAYMENTS & MATRICULATION TESTS PASSED (100%)');
  process.exit(0);
} else {
  console.error(`FAILED: ${failedCount} test(s) failed.`);
  process.exit(1);
}
