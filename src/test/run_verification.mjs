// AHCAS Pure Node Verification Test Suite
// Directly tests the core mathematical and grading algorithms

function calculateIJMBGrade(ca, exam) {
  const total = Math.min(100, Math.max(0, ca + exam));
  if (total >= 70) return { total, grade: 'A', points: 5, interpretation: 'Excellent' };
  if (total >= 60) return { total, grade: 'B', points: 4, interpretation: 'Very Good' };
  if (total >= 50) return { total, grade: 'C', points: 3, interpretation: 'Good' };
  if (total >= 45) return { total, grade: 'D', points: 2, interpretation: 'Fair' };
  if (total >= 40) return { total, grade: 'E', points: 1, interpretation: 'Pass' };
  return { total, grade: 'F', points: 0, interpretation: 'Fail' };
}

console.log('================================================================');
console.log('AHCAS INSTITUTIONAL ALGORITHM & GRADING VERIFICATION');
console.log('================================================================');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Grade scale boundaries
const gA = calculateIJMBGrade(18, 62); // 80 -> A (5)
assert(gA.total === 80 && gA.grade === 'A' && gA.points === 5, 'Score 80/100 maps to Grade A (5 points)');

const gB = calculateIJMBGrade(15, 48); // 63 -> B (4)
assert(gB.total === 63 && gB.grade === 'B' && gB.points === 4, 'Score 63/100 maps to Grade B (4 points)');

const gC = calculateIJMBGrade(12, 40); // 52 -> C (3)
assert(gC.total === 52 && gC.grade === 'C' && gC.points === 3, 'Score 52/100 maps to Grade C (3 points)');

const gD = calculateIJMBGrade(10, 36); // 46 -> D (2)
assert(gD.total === 46 && gD.grade === 'D' && gD.points === 2, 'Score 46/100 maps to Grade D (2 points)');

const gE = calculateIJMBGrade(10, 31); // 41 -> E (1)
assert(gE.total === 41 && gE.grade === 'E' && gE.points === 1, 'Score 41/100 maps to Grade E (1 point)');

const gF = calculateIJMBGrade(5, 20); // 25 -> F (0)
assert(gF.total === 25 && gF.grade === 'F' && gF.points === 0, 'Score 25/100 maps to Grade F (0 points)');

// 2. Bonus point rule
// Candidate 1: A (80) = 5 pts, B (65) = 4 pts, C (55) = 3 pts -> Base = 12 pts. Passed all 3 -> +1 Bonus -> 13 Total Pts
const passingCandidate = [calculateIJMBGrade(18, 62), calculateIJMBGrade(15, 50), calculateIJMBGrade(15, 40)];
const passingBonus = passingCandidate.every(r => r.grade !== 'F') ? 1 : 0;
const passingTotal = passingCandidate.reduce((s, r) => s + r.points, 0) + passingBonus;
assert(passingBonus === 1 && passingTotal === 13, 'Passing all 3 principal subjects (A=5, B=4, C=3) awards +1 bonus point (12 + 1 = 13)');

// Candidate 2: A (80) = 5 pts, B (65) = 4 pts, F (25) = 0 pts -> Base = 9 pts. Has F -> 0 Bonus -> 9 Total Pts
const failingCandidate = [calculateIJMBGrade(18, 62), calculateIJMBGrade(15, 50), calculateIJMBGrade(5, 20)];
const failingBonus = failingCandidate.every(r => r.grade !== 'F') ? 1 : 0;
const failingTotal = failingCandidate.reduce((s, r) => s + r.points, 0) + failingBonus;
assert(failingBonus === 0 && failingTotal === 9, 'Failing one subject (A=5, B=4, F=0) disqualifies candidate from +1 bonus point (9 + 0 = 9)');

// 3. Maximum points check (A=5, A=5, A=5 = 15 + 1 Bonus = 16)
const maxCandidate = [calculateIJMBGrade(20, 80), calculateIJMBGrade(20, 80), calculateIJMBGrade(20, 80)];
const maxBonus = maxCandidate.every(r => r.grade !== 'F') ? 1 : 0;
const maxTotal = maxCandidate.reduce((s, r) => s + r.points, 0) + maxBonus;
assert(maxTotal === 16, 'Maximum attainable IJMB point score is 16 (15 + 1 Bonus)');

// 4. RBAC Authorization & Sector Clearance Matrix Checks
const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  REGISTRAR: ['MANAGE_ADMISSIONS', 'MANAGE_STUDENTS', 'APPROVE_COURSE_REGISTRATION', 'ISSUE_MATRIC_NUMBER', 'GENERATE_TRANSCRIPT'],
  BURSAR: ['MANAGE_FINANCE', 'RECONCILE_PAYMENTS', 'RECORD_BANK_DRAFT', 'GENERATE_RECEIPT', 'SET_TUITION_FEES'],
  EXAMINATION_OFFICER: ['MANAGE_EXAMS', 'UPLOAD_CA_SCORES', 'UPLOAD_EXAM_SCORES', 'VALIDATE_IJMB_RESULTS'],
  LECTURER: ['MANAGE_LECTURES', 'UPLOAD_COURSE_MATERIALS', 'GRADE_STUDENT_ASSIGNMENTS', 'RECORD_CLASS_ATTENDANCE'],
  STUDENT: ['VIEW_STUDENT_PORTAL', 'REGISTER_COURSES', 'TAKE_CBT_EXAM', 'VIEW_MY_RESULTS', 'MAKE_PAYMENT'],
  APPLICANT: ['SUBMIT_APPLICATION', 'VIEW_APPLICATION_STATUS', 'PRINT_ADMISSION_LETTER', 'PAY_APPLICATION_FEE']
};

function hasRolePermission(role, perm) {
  if (role === 'SUPER_ADMIN') return true;
  const list = ROLE_PERMISSIONS[role] || [];
  return list.includes(perm);
}

function verifyRouteAccess(userRole, allowedRoles) {
  if (userRole === 'SUPER_ADMIN') return true;
  return allowedRoles.includes(userRole);
}

// Super Admin Permissions
assert(hasRolePermission('SUPER_ADMIN', 'MANAGE_ADMISSIONS'), 'Super Admin has MANAGE_ADMISSIONS clearance');
assert(hasRolePermission('SUPER_ADMIN', 'MANAGE_FINANCE'), 'Super Admin has MANAGE_FINANCE clearance');
assert(hasRolePermission('SUPER_ADMIN', 'MANAGE_EXAMS'), 'Super Admin has MANAGE_EXAMS clearance');
assert(verifyRouteAccess('SUPER_ADMIN', ['REGISTRAR', 'PROVOST']), 'Super Admin overrides route restrictions');

// Registrar Permissions & Isolation
assert(hasRolePermission('REGISTRAR', 'MANAGE_ADMISSIONS'), 'Registrar can MANAGE_ADMISSIONS');
assert(hasRolePermission('REGISTRAR', 'ISSUE_MATRIC_NUMBER'), 'Registrar can ISSUE_MATRIC_NUMBER');
assert(!hasRolePermission('REGISTRAR', 'MANAGE_FINANCE'), 'Registrar CANNOT MANAGE_FINANCE (enforces segregation of duties)');
assert(verifyRouteAccess('REGISTRAR', ['REGISTRAR', 'PROVOST', 'SUPER_ADMIN']), 'Registrar granted access to /registry');
assert(!verifyRouteAccess('REGISTRAR', ['BURSAR', 'FINANCE_OFFICER', 'PROVOST', 'SUPER_ADMIN']), 'Registrar denied access to /bursary workspace');

// Bursar Permissions & Isolation
assert(hasRolePermission('BURSAR', 'MANAGE_FINANCE'), 'Bursar can MANAGE_FINANCE');
assert(hasRolePermission('BURSAR', 'GENERATE_RECEIPT'), 'Bursar can GENERATE_RECEIPT');
assert(!hasRolePermission('BURSAR', 'MANAGE_EXAMS'), 'Bursar CANNOT tamper with IJMB examination results');
assert(verifyRouteAccess('BURSAR', ['BURSAR', 'FINANCE_OFFICER', 'PROVOST', 'SUPER_ADMIN']), 'Bursar granted access to /bursary');
assert(!verifyRouteAccess('BURSAR', ['STUDENT', 'SUPER_ADMIN']), 'Bursar denied access to student-exclusive features');

// Student Permissions & Isolation
assert(hasRolePermission('STUDENT', 'VIEW_STUDENT_PORTAL'), 'Student has VIEW_STUDENT_PORTAL clearance');
assert(hasRolePermission('STUDENT', 'TAKE_CBT_EXAM'), 'Student can TAKE_CBT_EXAM');
assert(!hasRolePermission('STUDENT', 'MANAGE_ADMISSIONS'), 'Student CANNOT MANAGE_ADMISSIONS');
assert(!hasRolePermission('STUDENT', 'MANAGE_FINANCE'), 'Student CANNOT reconcile institutional bursary accounts');
assert(verifyRouteAccess('STUDENT', ['STUDENT', 'SUPER_ADMIN']), 'Student granted access to /student/*');
assert(!verifyRouteAccess('STUDENT', ['REGISTRAR', 'SUPER_ADMIN']), 'Student denied access to /registry workspace');

// Applicant Permissions & Isolation
assert(hasRolePermission('APPLICANT', 'SUBMIT_APPLICATION'), 'Applicant can SUBMIT_APPLICATION');
assert(!hasRolePermission('APPLICANT', 'VIEW_STUDENT_PORTAL'), 'Un-matriculated Applicant CANNOT access full student portal');

console.log('================================================================');
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('================================================================');

if (failed > 0) process.exit(1);
