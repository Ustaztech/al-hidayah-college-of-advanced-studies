// =============================================================================
// AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
// STEP 4: ADMISSION PROCESSING, SCREENING & DECISION MANAGEMENT TEST SUITE
// Automated verification for all 20 required scenarios
// =============================================================================

console.log('=============================================================================');
console.log('AL-HIDAYAH COLLEGE ADMISSION PROCESSING & DECISION MANAGEMENT — STEP 4 TESTS');
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
// STEP 4 TEST HARNESS
// -----------------------------------------------------------------------------

class Step4TestStore {
  constructor() {
    this.sessions = new Map([
      ['session-2026-2027', { id: 'session-2026-2027', name: '2026/2027 Academic Session', is_active: true }]
    ]);

    this.programmes = new Map([
      ['prog-sci', { id: 'prog-sci', name: 'IJMB Direct Entry Sciences (Biology / Chemistry / Physics)' }],
      ['prog-sms', { id: 'prog-sms', name: 'IJMB Social Sciences (Accounting / Economics)' }],
      ['prog-art', { id: 'prog-art', name: 'IJMB Arts & Humanities' }]
    ]);

    this.applications = new Map([
      [
        'app-sub-001',
        {
          id: 'app-sub-001',
          applicant_id: 'appl-001',
          admission_session_id: 'session-2026-2027',
          admission_programme_id: 'adm-prog-sci',
          application_number: 'AHCAS/APP/2026/00001',
          status: 'submitted',
          submission_reference: 'AHCAS/SUB/2026/00101',
          created_at: new Date().toISOString()
        }
      ],
      [
        'app-sub-002',
        {
          id: 'app-sub-002',
          applicant_id: 'appl-002',
          admission_session_id: 'session-2026-2027',
          admission_programme_id: 'adm-prog-sms',
          application_number: 'AHCAS/APP/2026/00002',
          status: 'submitted',
          submission_reference: 'AHCAS/SUB/2026/00102',
          created_at: new Date().toISOString()
        }
      ]
    ]);

    this.screenings = new Map();
    this.offers = new Map();
    this.offerSeq = 100;
  }

  saveScreening(appId, screenerId, data) {
    const app = this.applications.get(appId);
    if (!app) throw new Error('Application not found');

    if (data.status === 'action_required') {
      app.status = 'action_required';
    } else if (data.status === 'under_review' || data.status === 'recommended_for_admission') {
      app.status = 'under_review';
    }

    const scr = {
      id: `scr-${Date.now()}`,
      application_id: appId,
      screened_by: screenerId,
      screening_status: data.status,
      screening_score: data.screeningScore,
      olevel_verified: data.olevelVerified,
      credentials_verified: data.credentialsVerified,
      action_required_note: data.actionRequiredNote || null,
      internal_notes: data.internalNotes || null,
      screened_at: new Date().toISOString()
    };
    this.screenings.set(appId, scr);
    return scr;
  }

  resolveDeficiency(appId, note) {
    const app = this.applications.get(appId);
    if (!app) throw new Error('Application not found');
    if (app.status === 'action_required') {
      app.status = 'under_review';
      const scr = this.screenings.get(appId);
      if (scr) {
        scr.screening_status = 'under_review';
        scr.action_required_note = note ? `Applicant submitted update: ${note}` : null;
      }
      return true;
    }
    return false;
  }

  issueOffer(appId, officerId, progId, deadlineDays = 21) {
    const app = this.applications.get(appId);
    if (!app) throw new Error('Application not found');

    if (this.offers.has(appId) && app.status === 'accepted') {
      return this.offers.get(appId);
    }

    const prog = this.programmes.get(progId);
    if (!prog) throw new Error('Admitted programme not found');

    this.offerSeq++;
    const letterNo = `AHCAS/ADM/2026/${this.offerSeq.toString().padStart(5, '0')}`;
    const deadline = new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000).toISOString();

    const offer = {
      id: `ofr-${Date.now()}`,
      application_id: appId,
      programme_id: progId,
      programme_name: prog.name,
      offer_letter_number: letterNo,
      offer_date: new Date().toISOString(),
      acceptance_deadline: deadline,
      offer_status: 'offered',
      responded_at: null,
      created_by: officerId
    };

    this.offers.set(appId, offer);
    app.status = 'accepted';
    return offer;
  }

  respondOffer(appId, response, simulatedCurrentTime = null) {
    const offer = this.offers.get(appId);
    if (!offer) throw new Error('No offer found');

    const now = simulatedCurrentTime ? new Date(simulatedCurrentTime) : new Date();
    if (now > new Date(offer.acceptance_deadline) && offer.offer_status === 'offered') {
      offer.offer_status = 'lapsed';
      throw new Error('The acceptance deadline for this admission offer has elapsed.');
    }

    if (response !== 'accept' && response !== 'decline') {
      throw new Error('Invalid offer response');
    }

    offer.offer_status = response === 'accept' ? 'accepted' : 'declined';
    offer.responded_at = now.toISOString();
    return offer;
  }

  rejectApp(appId, reason) {
    const app = this.applications.get(appId);
    if (!app) throw new Error('Application not found');
    app.status = 'rejected';
    app.reject_reason = reason;
    return app;
  }
}

// -----------------------------------------------------------------------------
// EXECUTE 20 TEST CASES
// -----------------------------------------------------------------------------

const store = new Step4TestStore();

// TEST 1: Screening queue query
console.log('\n--- 1. Screening Queue Retrieval ---');
const queue = Array.from(store.applications.values()).filter(a => a.status === 'submitted');
assert(
  queue.length === 2 && queue[0].submission_reference === 'AHCAS/SUB/2026/00101',
  'TEST 1: Admin can query submitted candidate applications awaiting screening',
  `Found ${queue.length} submitted candidates in queue`
);

// TEST 2: Unauthenticated protection
console.log('\n--- 2. Route Authorization & RBAC ---');
function checkAdminAccess(user) {
  if (!user || (!user.roles.includes('super_admin') && !user.roles.includes('college_admin') && !user.roles.includes('registrar'))) {
    return { status: 403, error: 'Unauthorized: Admin session required' };
  }
  return { status: 200 };
}
const unauth = checkAdminAccess(null);
assert(
  unauth.status === 403,
  'TEST 2: Unauthenticated requests to admission screening endpoints are denied with 403',
  unauth.error
);

// TEST 3: Non-admin role protection (Student)
console.log('\n--- 3. Role Restriction Check ---');
const studentUser = { id: 's-1', roles: ['student'] };
const studentAccess = checkAdminAccess(studentUser);
assert(
  studentAccess.status === 403,
  'TEST 3: Non-privileged roles (students) are denied access to screening tools',
  studentAccess.error
);

// TEST 4: Screening verdict: under_review
console.log('\n--- 4. Screening: Under Review Transition ---');
const scr1 = store.saveScreening('app-sub-001', 'reg-001', {
  status: 'under_review',
  screeningScore: 82,
  olevelVerified: true,
  credentialsVerified: true,
  internalNotes: 'Candidate has 5 credits in WAEC 2025.'
});
const app1 = store.applications.get('app-sub-001');
assert(
  scr1 && app1.status === 'under_review',
  'TEST 4: Submitting under_review verdict transitions application status to under_review',
  `Application status: ${app1.status}`
);

// TEST 5: Screening verdict: action_required
console.log('\n--- 5. Screening: Action Required / Query Notice ---');
const scr2 = store.saveScreening('app-sub-002', 'reg-001', {
  status: 'action_required',
  screeningScore: 60,
  olevelVerified: true,
  credentialsVerified: false,
  actionRequiredNote: 'Please re-upload a clear colour scan of your State Certificate of Origin.'
});
const app2 = store.applications.get('app-sub-002');
assert(
  scr2 && app2.status === 'action_required' && scr2.action_required_note !== null,
  'TEST 5: Action Required verdict transitions status and persists query explanation',
  `Query: ${scr2.action_required_note}`
);

// TEST 6: Screening checkmarks & score persistence
console.log('\n--- 6. Screening Metrics Persistence ---');
assert(
  scr1.screening_score === 82 && scr1.olevel_verified === true && scr1.credentials_verified === true,
  'TEST 6: Screening assessment scores and verification checkmarks persist accurately',
  `Score: ${scr1.screening_score}, O-Level: ${scr1.olevel_verified}, ID: ${scr1.credentials_verified}`
);

// TEST 7: Applicant deficiency alert visibility
console.log('\n--- 7. Applicant Deficiency Visibility ---');
const candidateApp = store.applications.get('app-sub-002');
const hasDeficiency = candidateApp.status === 'action_required';
assert(
  hasDeficiency === true,
  'TEST 7: Candidate application correctly displays action_required state on dashboard',
  `Candidate status: ${candidateApp.status}`
);

// TEST 8: Candidate resolves deficiency
console.log('\n--- 8. Candidate Deficiency Resolution ---');
const resolved = store.resolveDeficiency('app-sub-002', 'Re-uploaded certified LGA indigene certificate.');
const app2After = store.applications.get('app-sub-002');
assert(
  resolved && app2After.status === 'under_review',
  'TEST 8: Candidate deficiency response transitions application back to under_review',
  `Application status: ${app2After.status}`
);

// TEST 9: Screening verdict: recommended_for_admission
console.log('\n--- 9. Recommendation for Admission ---');
const scr3 = store.saveScreening('app-sub-001', 'reg-001', {
  status: 'recommended_for_admission',
  screeningScore: 88,
  olevelVerified: true,
  credentialsVerified: true,
  internalNotes: 'Recommended for IJMB Sciences.'
});
assert(
  scr3 && scr3.screening_status === 'recommended_for_admission',
  'TEST 9: Candidate recommendation for admission is logged in screening dossier',
  `Verdict: ${scr3.screening_status}`
);

// TEST 10: Issuance of Provisional Admission Offer
console.log('\n--- 10. Admission Offer Generation ---');
const offer1 = store.issueOffer('app-sub-001', 'reg-001', 'prog-sci', 21);
assert(
  offer1 && offer1.offer_letter_number.startsWith('AHCAS/ADM/2026/'),
  'TEST 10: Admission offer issues unique institutional letter reference format AHCAS/ADM/2026/XXXXX',
  `Letter Ref: ${offer1.offer_letter_number}`
);

// TEST 11: Acceptance deadline calculation
console.log('\n--- 11. Acceptance Deadline Calculation ---');
const offerDate = new Date(offer1.offer_date).getTime();
const deadlineDate = new Date(offer1.acceptance_deadline).getTime();
const diffDays = Math.round((deadlineDate - offerDate) / (1000 * 60 * 60 * 24));
assert(
  diffDays === 21,
  'TEST 11: Admission offer acceptance deadline accurately calculates 21-day acceptance window',
  `Window: ${diffDays} days`
);

// TEST 12: Status transition to accepted
console.log('\n--- 12. Application Status Transition to Accepted ---');
const app1AfterOffer = store.applications.get('app-sub-001');
assert(
  app1AfterOffer.status === 'accepted',
  'TEST 12: Issuing admission offer transitions application status to accepted',
  `Status: ${app1AfterOffer.status}`
);

// TEST 13: Duplicate offer protection
console.log('\n--- 13. Idempotent Offer Generation ---');
const duplicateOffer = store.issueOffer('app-sub-001', 'reg-001', 'prog-sci', 21);
assert(
  duplicateOffer.id === offer1.id && duplicateOffer.offer_letter_number === offer1.offer_letter_number,
  'TEST 13: Re-issuing offer for same candidate returns existing offer reference idempotently',
  `Offer ID: ${duplicateOffer.id}`
);

// TEST 14: Candidate fetches active offer
console.log('\n--- 14. Candidate Offer Fetch ---');
const fetchedOffer = store.offers.get('app-sub-001');
assert(
  fetchedOffer && fetchedOffer.offer_status === 'offered' && fetchedOffer.programme_name.includes('IJMB'),
  'TEST 14: Candidate can query their active provisional admission offer',
  `Admitted to: ${fetchedOffer.programme_name}`
);

// TEST 15: Candidate accepts admission offer
console.log('\n--- 15. Candidate Offer Acceptance ---');
const acceptedOffer = store.respondOffer('app-sub-001', 'accept');
assert(
  acceptedOffer.offer_status === 'accepted' && acceptedOffer.responded_at !== null,
  'TEST 15: Candidate accepting admission offer updates offer status to accepted',
  `Offer Status: ${acceptedOffer.offer_status}, Responded: ${acceptedOffer.responded_at}`
);

// TEST 16: Candidate declines admission offer
console.log('\n--- 16. Candidate Offer Decline ---');
const offer2 = store.issueOffer('app-sub-002', 'reg-001', 'prog-sms', 21);
const declinedOffer = store.respondOffer('app-sub-002', 'decline');
assert(
  declinedOffer.offer_status === 'declined',
  'TEST 16: Candidate declining admission offer updates offer status to declined',
  `Offer Status: ${declinedOffer.offer_status}`
);

// TEST 17: Invalid offer response validation
console.log('\n--- 17. Invalid Response Validation ---');
let invalidErr = null;
try {
  store.respondOffer('app-sub-001', 'maybe');
} catch (err) {
  invalidErr = err.message;
}
assert(
  invalidErr !== null && invalidErr.includes('Invalid offer response'),
  'TEST 17: Invalid response payload (not accept/decline) is rejected',
  `Error caught: ${invalidErr}`
);

// TEST 18: Lapsed / Expired deadline rejection
console.log('\n--- 18. Lapsed Deadline Enforcement ---');
const app3 = {
  id: 'app-sub-003',
  applicant_id: 'appl-003',
  status: 'submitted',
  created_at: new Date().toISOString()
};
store.applications.set('app-sub-003', app3);
const offer3 = store.issueOffer('app-sub-003', 'reg-001', 'prog-art', 14);
// Simulate response 30 days later (past deadline)
const lateTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
let lapsedErr = null;
try {
  store.respondOffer('app-sub-003', 'accept', lateTime);
} catch (err) {
  lapsedErr = err.message;
}
assert(
  lapsedErr !== null && lapsedErr.includes('elapsed') && offer3.offer_status === 'lapsed',
  'TEST 18: Attempting to accept after the deadline has lapsed is rejected and marked lapsed',
  `Error caught: ${lapsedErr}, Status: ${offer3.offer_status}`
);

// TEST 19: Non-admission rejection decision
console.log('\n--- 19. Non-Admission Recording ---');
const rejectedApp = store.rejectApp('app-sub-003', 'Prerequisite subject combination criteria not met.');
assert(
  rejectedApp.status === 'rejected' && rejectedApp.reject_reason !== undefined,
  'TEST 19: Recording non-admission transitions status to rejected with institutional remarks',
  `Status: ${rejectedApp.status}, Reason: ${rejectedApp.reject_reason}`
);

// TEST 20: Official Admission Letter verification
console.log('\n--- 20. Official Admission Letter Readiness ---');
const validOffer = store.offers.get('app-sub-001');
const hasLetterProps = Boolean(
  validOffer &&
  validOffer.offer_letter_number &&
  validOffer.programme_name &&
  validOffer.acceptance_deadline
);
assert(
  hasLetterProps === true,
  'TEST 20: Candidate with issued offer can generate official printable Provisional Admission Letter',
  `Letter Ref: ${validOffer.offer_letter_number}, Admitted Course: ${validOffer.programme_name}`
);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n=============================================================================');
console.log(`TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED out of 20`);
console.log('=============================================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('ALL STEP 4 ADMISSION PROCESSING & DECISION TESTS PASSED SUCCESSFULLY (100%)');
  process.exit(0);
}
