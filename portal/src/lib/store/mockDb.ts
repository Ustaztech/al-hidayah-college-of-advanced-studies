import {
  Profile,
  Role,
  UserRole,
  Student,
  Staff,
  Department,
  Programme,
  AuditLog,
  UserRoleName,
  ApplicationType,
  Applicant,
  ApplicantEvent,
  ApplicantRegistrationStatus,
  ApplicationStatus,
  AdmissionSession,
  AdmissionProgramme,
  ApplicationPersonalDetails,
  ApplicationContactDetails,
  ApplicationGuardian,
  AcademicQualification,
  QualificationSubject,
  ApplicationDocument,
  ApplicationStatusHistory,
  Application,
  AdmissionScreening,
  AdmissionOffer,
  ScreeningStatus,
  OfferStatus,
  FeeInvoice,
  FeePayment,
  MatriculationRecord,
  FeeType,
  InvoiceStatus,
  PaymentStatus
} from '../types';

export interface MockUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  profile: Profile;
  roles: UserRoleName[];
  student?: Student;
  staff?: Staff;
  applicant?: Applicant;
}

export interface VerificationTokenRecord {
  userId: string;
  email: string;
  token: string;
  expiresAt: number; // timestamp in ms
  used: boolean;
}

// Global in-memory storage seeded with valid initial data
class PortalDatabase {
  private profiles: Map<string, Profile> = new Map();
  private credentials: Map<string, { email: string; passwordHash: string }> = new Map();
  private roles: Map<string, Role> = new Map();
  private userRoles: UserRole[] = [];
  private departments: Map<string, Department> = new Map();
  private programmes: Map<string, Programme> = new Map();
  private students: Map<string, Student> = new Map();
  private staff: Map<string, Staff> = new Map();
  private applicationTypes: Map<string, ApplicationType> = new Map();
  private applicants: Map<string, Applicant> = new Map();
  private applicantEvents: ApplicantEvent[] = [];
  private verificationTokens: Map<string, VerificationTokenRecord> = new Map();
  private auditLogs: AuditLog[] = [];
  private applicantSeq: number = 10;

  // Step 3 Storage Collections
  private admissionSessions: Map<string, AdmissionSession> = new Map();
  private admissionProgrammes: Map<string, AdmissionProgramme> = new Map();
  private applications: Map<string, Application> = new Map();
  private personalDetails: Map<string, ApplicationPersonalDetails> = new Map();
  private contactDetails: Map<string, ApplicationContactDetails> = new Map();
  private guardians: Map<string, ApplicationGuardian[]> = new Map();
  private qualifications: Map<string, AcademicQualification[]> = new Map();
  private documents: Map<string, ApplicationDocument[]> = new Map();
  private statusHistory: Map<string, ApplicationStatusHistory[]> = new Map();
  private submissionSeq: number = 100;

  // Step 4 Storage Collections
  private screenings: Map<string, AdmissionScreening> = new Map();
  private admissionOffers: Map<string, AdmissionOffer> = new Map();
  private offerSeq: number = 100;

  // Step 5 & 6 Storage Collections
  private feeInvoices: Map<string, FeeInvoice> = new Map();
  private feePayments: Map<string, FeePayment> = new Map();
  private matriculationRecords: Map<string, MatriculationRecord> = new Map();
  private invoiceSeq: number = 200;
  private paymentSeq: number = 500;
  private matricSeq: number = 10;

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Seed Roles
    const roleList: { name: UserRoleName; description: string }[] = [
      { name: 'super_admin', description: 'Supreme Institutional Governance & Systems Controller' },
      { name: 'college_admin', description: 'College Academic Operations & Administrative Oversight' },
      { name: 'student', description: 'Matriculated Candidate Enrolled in Academic Programmes' },
      { name: 'lecturer', description: 'Academic Faculty Member Responsible for Instruction & Assessment' },
      { name: 'staff', description: 'Non-Teaching / General College Support Personnel' },
      { name: 'hod', description: 'Head of Academic Department' },
      { name: 'registrar', description: 'Chief Custodian of Admissions, Student Records & Transcripts' },
      { name: 'examination_officer', description: 'Directorate of External & Internal Examinations' },
      { name: 'bursar', description: 'College Bursary, Tuitions & Financial Reconciliations' },
      { name: 'applicant', description: 'Prospective College Applicant' }
    ];

    roleList.forEach((r, idx) => {
      const id = `role-uuid-${idx + 1}`;
      this.roles.set(id, { id, name: r.name, description: r.description });
    });

    // 2. Seed Departments
    const depts: { id: string; name: string; code: string }[] = [
      { id: 'dept-bio', name: 'Department of Biological & Life Sciences', code: 'DEPT-BIO' },
      { id: 'dept-chm', name: 'Department of Chemical & Physical Sciences', code: 'DEPT-CHM-PHY' },
      { id: 'dept-mth', name: 'Department of Mathematics & Computing', code: 'DEPT-MTH-COMP' },
      { id: 'dept-arts', name: 'Department of Arts, Languages & Humanities', code: 'DEPT-ARTS' },
      { id: 'dept-sms', name: 'Department of Social & Management Sciences', code: 'DEPT-SMS' },
      { id: 'dept-reg', name: 'Registry & Academic Affairs Directorate', code: 'DEPT-REGISTRY' },
      { id: 'dept-bur', name: 'Bursary & Financial Services', code: 'DEPT-BURSARY' }
    ];
    depts.forEach(d => this.departments.set(d.id, { ...d, status: 'active', created_at: new Date().toISOString() }));

    // 3. Seed Programmes
    const progs: { id: string; deptId: string; name: string; code: string }[] = [
      { id: 'prog-sci', deptId: 'dept-bio', name: 'IJMB Direct Entry Sciences (Biology / Chemistry / Physics)', code: 'IJMB-SCI-01' },
      { id: 'prog-sms', deptId: 'dept-sms', name: 'IJMB Social Sciences (Accounting / Business Management / Economics)', code: 'IJMB-SMS-01' },
      { id: 'prog-art', deptId: 'dept-arts', name: 'IJMB Arts & Humanities (Government / Literature / Islamic Studies)', code: 'IJMB-ART-01' }
    ];
    progs.forEach(p => this.programmes.set(p.id, { id: p.id, department_id: p.deptId, name: p.name, code: p.code, status: 'active', created_at: new Date().toISOString() }));

    // 4. Seed Application Types (Step 2)
    const appTypes: { id: string; name: string; code: string; description: string; is_active: boolean }[] = [
      {
        id: 'app-type-1',
        name: 'IJMB Regular Admission',
        code: 'IJMB_REG',
        description: 'One-year intensive Cambridge/ABU A-Level direct entry programme leading to 200 Level in universities.',
        is_active: true
      },
      {
        id: 'app-type-2',
        name: 'Direct Entry Programme',
        code: 'DE_PROG',
        description: 'Advanced level direct entry pathway into 200-level university degree with accredited results.',
        is_active: true
      },
      {
        id: 'app-type-3',
        name: 'Diploma Programme',
        code: 'DIP_PROG',
        description: 'Professional diploma in Management, Science and Information Technology.',
        is_active: true
      },
      {
        id: 'app-type-4',
        name: 'Certificate Programme',
        code: 'CERT_PROG',
        description: 'Specialized vocational and pre-university remedial certificate course.',
        is_active: false
      }
    ];
    appTypes.forEach(at => this.applicationTypes.set(at.id, { ...at, created_at: new Date().toISOString() }));

    // 5. Seed Verified Initial Accounts
    // A. Super Admin
    this.createUserWithProfile({
      userId: 'usr-admin-uuid',
      email: 'admin@alhidayahcollege.com.ng',
      password: 'AdminPassword2026!',
      fullName: 'Chief Dr. Muhammad Baba Suleiman, PhD',
      phone: '08056350078',
      status: 'active',
      role: 'super_admin'
    });

    // B. College Staff
    const staffId = this.createUserWithProfile({
      userId: 'usr-staff-uuid',
      email: 'staff@alhidayahcollege.com.ng',
      password: 'StaffPassword2026!',
      fullName: 'Mall. Usman Saidu (Academic Registrar)',
      phone: '08056350078',
      status: 'active',
      role: 'registrar'
    });
    this.staff.set('stf-001', {
      id: 'stf-001',
      user_id: staffId,
      staff_number: 'AHCAS/STF/2026/001',
      department_id: 'dept-reg',
      designation: 'Academic Registrar & Examination Coordinator',
      status: 'active',
      created_at: new Date().toISOString()
    });

    // C. Matriculated Student
    const studentId = this.createUserWithProfile({
      userId: 'usr-student-uuid',
      email: 'student@alhidayahcollege.com.ng',
      password: 'StudentPassword2026!',
      fullName: 'Amina Mohammed',
      phone: '08056350078',
      status: 'active',
      role: 'student'
    });
    this.students.set('std-001', {
      id: 'std-001',
      user_id: studentId,
      matric_number: 'AHCAS/2026/001',
      programme_id: 'prog-sci',
      level: 'IJMB 1',
      status: 'active',
      created_at: new Date().toISOString()
    });

    // D. Inactive Student Account
    const inactiveId = this.createUserWithProfile({
      userId: 'usr-inactive-uuid',
      email: 'inactive@alhidayahcollege.com.ng',
      password: 'InactivePassword2026!',
      fullName: 'Suspended Candidate',
      phone: '08056350078',
      status: 'inactive',
      role: 'student'
    });
    this.students.set('std-inactive', {
      id: 'std-inactive',
      user_id: inactiveId,
      matric_number: 'AHCAS/2026/INACTIVE',
      programme_id: 'prog-sci',
      level: '100',
      status: 'inactive',
      created_at: new Date().toISOString()
    });

    // E. Seed Verified Initial Applicant
    const applicantUserId = this.createUserWithProfile({
      userId: 'usr-applicant-uuid',
      email: 'applicant@example.com',
      password: 'ApplicantPassword2026!',
      fullName: 'Fatima Abubakar Bello',
      phone: '08104256900',
      status: 'active',
      role: 'applicant'
    });
    const seedApplicant: Applicant = {
      id: 'app-seed-001',
      user_id: applicantUserId,
      applicant_number: 'AHCAS/APP/2026/00001',
      application_type_id: 'app-type-1',
      full_name: 'Fatima Abubakar Bello',
      phone_number: '08104256900',
      registration_status: 'verified',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.applicants.set(seedApplicant.id, seedApplicant);

    // 6. Seed Admission Sessions (Step 3)
    const session2026: AdmissionSession = {
      id: 'session-2026-2027',
      name: '2026/2027 Academic Session',
      start_date: '2026-09-01',
      end_date: '2027-08-31',
      is_active: true,
      created_at: new Date().toISOString()
    };
    this.admissionSessions.set(session2026.id, session2026);

    // 7. Seed Admission Programmes (Step 3)
    const admProgs: AdmissionProgramme[] = [
      {
        id: 'adm-prog-sci',
        admission_session_id: session2026.id,
        programme_id: 'prog-sci',
        application_type_id: 'app-type-1',
        application_open: true,
        application_deadline: '2027-02-28T23:59:59Z',
        duration: '9 Months (1 Academic Session)',
        entry_requirements: '5 O-Level Credits in English, Maths, Biology, Chemistry, Physics in max 2 sittings.',
        created_at: new Date().toISOString()
      },
      {
        id: 'adm-prog-sms',
        admission_session_id: session2026.id,
        programme_id: 'prog-sms',
        application_type_id: 'app-type-1',
        application_open: true,
        application_deadline: '2027-02-28T23:59:59Z',
        duration: '9 Months (1 Academic Session)',
        entry_requirements: '5 O-Level Credits in English, Maths, Economics, and 2 relevant social sciences.',
        created_at: new Date().toISOString()
      },
      {
        id: 'adm-prog-art',
        admission_session_id: session2026.id,
        programme_id: 'prog-art',
        application_type_id: 'app-type-1',
        application_open: true,
        application_deadline: '2027-02-28T23:59:59Z',
        duration: '9 Months (1 Academic Session)',
        entry_requirements: '5 O-Level Credits in English, Literature in English, Government, CRS/IRS, etc.',
        created_at: new Date().toISOString()
      },
      {
        id: 'adm-prog-de-sci',
        admission_session_id: session2026.id,
        programme_id: 'prog-sci',
        application_type_id: 'app-type-2',
        application_open: true,
        application_deadline: '2027-02-28T23:59:59Z',
        duration: 'Direct Entry to 200 Level',
        entry_requirements: 'ND / NCE / IJMB / JUPEB with minimum Merit / Lower Credit pass.',
        created_at: new Date().toISOString()
      },
      {
        id: 'adm-prog-closed',
        admission_session_id: session2026.id,
        programme_id: 'prog-sci',
        application_type_id: 'app-type-3',
        application_open: false,
        application_deadline: '2026-08-31T23:59:59Z',
        duration: '2 Years Diploma',
        entry_requirements: '4 O-Level Credits including English and Mathematics.',
        created_at: new Date().toISOString()
      }
    ];
    admProgs.forEach(ap => this.admissionProgrammes.set(ap.id, ap));

    // 8. Seed Initial In-Progress Application for Fatima
    const seedApplication: Application = {
      id: 'appl-seed-001',
      applicant_id: 'app-seed-001',
      admission_session_id: session2026.id,
      admission_programme_id: 'adm-prog-sci',
      application_number: 'AHCAS/APP/2026/00001',
      status: 'in_progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.applications.set(seedApplication.id, seedApplication);

    this.personalDetails.set(seedApplication.id, {
      application_id: seedApplication.id,
      surname: 'Bello',
      first_name: 'Fatima',
      middle_name: 'Abubakar',
      date_of_birth: '2005-04-12',
      gender: 'female',
      marital_status: 'Single',
      nationality: 'Nigerian',
      state_of_origin: 'Nasarawa State',
      lga_of_origin: 'Toto',
      passport_url: '/ahcas-student-cohort.jpg'
    });

    this.contactDetails.set(seedApplication.id, {
      application_id: seedApplication.id,
      phone_number: '08104256900',
      alternative_phone: '08056350078',
      residential_address: 'No. 14 Toto Road, Near Central Mosque',
      state_of_residence: 'Nasarawa State',
      lga_of_residence: 'Toto',
      city: 'Toto'
    });

    this.guardians.set(seedApplication.id, [
      {
        id: 'grd-001',
        application_id: seedApplication.id,
        full_name: 'Alhaji Abubakar Bello',
        relationship: 'Father',
        phone_number: '08031234567',
        email: 'abubakar.bello@example.com',
        address: 'No. 14 Toto Road, Toto, Nasarawa State'
      }
    ]);

    this.qualifications.set(seedApplication.id, [
      {
        id: 'qual-001',
        application_id: seedApplication.id,
        qualification_type: 'WAEC',
        institution: 'Government Secondary School, Toto',
        examination_year: 2024,
        examination_number: '4251029014',
        sitting: 'First Sitting',
        subjects: [
          { id: 'subj-1', qualification_id: 'qual-001', subject: 'English Language', grade: 'B3' },
          { id: 'subj-2', qualification_id: 'qual-001', subject: 'Mathematics', grade: 'A1' },
          { id: 'subj-3', qualification_id: 'qual-001', subject: 'Biology', grade: 'B2' },
          { id: 'subj-4', qualification_id: 'qual-001', subject: 'Chemistry', grade: 'B3' },
          { id: 'subj-5', qualification_id: 'qual-001', subject: 'Physics', grade: 'C4' }
        ]
      }
    ]);

    this.documents.set(seedApplication.id, [
      {
        id: 'doc-001',
        application_id: seedApplication.id,
        document_type: 'passport_photo',
        file_name: 'fatima_passport.jpg',
        file_size: 145000,
        mime_type: 'image/jpeg',
        storage_path: '/uploads/documents/appl-seed-001/passport_photo.jpg',
        uploaded_at: new Date().toISOString()
      },
      {
        id: 'doc-002',
        application_id: seedApplication.id,
        document_type: 'olevel_result',
        file_name: 'waec_result_2024.pdf',
        file_size: 320000,
        mime_type: 'application/pdf',
        storage_path: '/uploads/documents/appl-seed-001/olevel_result.pdf',
        uploaded_at: new Date().toISOString()
      }
    ]);
  }

  public createUserWithProfile({
    userId,
    email,
    password,
    fullName,
    phone,
    status = 'active',
    role
  }: {
    userId?: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    status?: 'active' | 'inactive' | 'suspended';
    role: UserRoleName;
  }): string {
    const cleanEmail = email.trim().toLowerCase();
    const id = userId || `usr-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    this.profiles.set(id, {
      id,
      email: cleanEmail,
      full_name: fullName,
      phone: phone || null,
      avatar_url: null,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    this.credentials.set(cleanEmail, {
      email: cleanEmail,
      passwordHash: password
    });

    let roleObj = Array.from(this.roles.values()).find(r => r.name === role);
    if (!roleObj) {
      const newRoleId = `role-${role}`;
      roleObj = { id: newRoleId, name: role, description: role };
      this.roles.set(newRoleId, roleObj);
    }

    this.userRoles.push({
      id: `ur-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      user_id: id,
      role_id: roleObj.id,
      assigned_at: new Date().toISOString(),
      assigned_by: 'system'
    });

    return id;
  }

  // Identifier Resolution
  public resolveIdentifier(identifier: string): { userId: string; email: string; accountType: 'email' | 'student' | 'staff' | 'applicant' } | null {
    const clean = identifier.trim().toLowerCase();

    // 1. Direct Email Match
    for (const [id, prof] of this.profiles.entries()) {
      if (prof.email.toLowerCase() === clean) {
        return { userId: id, email: prof.email, accountType: 'email' };
      }
    }

    // 2. Matric Number Match
    for (const [id, std] of this.students.entries()) {
      if (std.matric_number.toLowerCase() === clean) {
        const prof = this.profiles.get(std.user_id);
        if (prof) {
          return { userId: prof.id, email: prof.email, accountType: 'student' };
        }
      }
    }

    // 3. Staff Number Match
    for (const [id, st] of this.staff.entries()) {
      if (st.staff_number.toLowerCase() === clean) {
        const prof = this.profiles.get(st.user_id);
        if (prof) {
          return { userId: prof.id, email: prof.email, accountType: 'staff' };
        }
      }
    }

    // 4. Applicant Number Match
    for (const [id, app] of this.applicants.entries()) {
      if (app.applicant_number.toLowerCase() === clean) {
        const prof = this.profiles.get(app.user_id);
        if (prof) {
          return { userId: prof.id, email: prof.email, accountType: 'applicant' };
        }
      }
    }

    return null;
  }

  public getProfileById(userId: string): Profile | null {
    return this.profiles.get(userId) || null;
  }

  public getProfileByEmail(email: string): Profile | null {
    const clean = email.trim().toLowerCase();
    for (const prof of this.profiles.values()) {
      if (prof.email.toLowerCase() === clean) return prof;
    }
    return null;
  }

  public getUserRoles(userId: string): UserRoleName[] {
    const roleIds = this.userRoles.filter(ur => ur.user_id === userId).map(ur => ur.role_id);
    return roleIds
      .map(id => this.roles.get(id)?.name)
      .filter((n): n is UserRoleName => Boolean(n));
  }

  public getStudentByUserId(userId: string): (Student & { programme?: Programme | null }) | null {
    for (const std of this.students.values()) {
      if (std.user_id === userId) {
        const programme = std.programme_id ? this.programmes.get(std.programme_id) || null : null;
        return { ...std, programme };
      }
    }
    return null;
  }

  public getStaffByUserId(userId: string): (Staff & { department?: Department | null }) | null {
    for (const st of this.staff.values()) {
      if (st.user_id === userId) {
        const department = st.department_id ? this.departments.get(st.department_id) || null : null;
        return { ...st, department };
      }
    }
    return null;
  }

  public verifyCredentials(email: string, passwordAttempt: string): boolean {
    const cred = this.credentials.get(email.trim().toLowerCase());
    if (!cred) return false;
    return cred.passwordHash === passwordAttempt;
  }

  public updatePassword(email: string, newPassword: string): boolean {
    const clean = email.trim().toLowerCase();
    const cred = this.credentials.get(clean);
    if (!cred) return false;
    cred.passwordHash = newPassword;
    this.credentials.set(clean, cred);
    return true;
  }

  // ---------------------------------------------------------------------------
  // STEP 2: APPLICATION TYPES MANAGEMENT
  // ---------------------------------------------------------------------------
  public getApplicationTypes(activeOnly = true): ApplicationType[] {
    const list = Array.from(this.applicationTypes.values());
    if (activeOnly) {
      return list.filter(t => t.is_active);
    }
    return list;
  }

  public getApplicationTypeById(id: string): ApplicationType | null {
    return this.applicationTypes.get(id) || null;
  }

  public addApplicationType(name: string, code: string, description: string | null, isActive = true): ApplicationType {
    const cleanCode = code.trim().toUpperCase();
    for (const t of this.applicationTypes.values()) {
      if (t.code === cleanCode) {
        throw new Error(`Application type code '${cleanCode}' already exists`);
      }
    }

    const id = `app-type-${Date.now()}`;
    const newType: ApplicationType = {
      id,
      name: name.trim(),
      code: cleanCode,
      description: description ? description.trim() : null,
      is_active: isActive,
      created_at: new Date().toISOString()
    };
    this.applicationTypes.set(id, newType);
    this.addAuditLog('admin', 'create', 'application_type', id, { code: cleanCode, name });
    return newType;
  }

  public updateApplicationType(id: string, updates: Partial<Omit<ApplicationType, 'id' | 'created_at'>>): ApplicationType {
    const existing = this.applicationTypes.get(id);
    if (!existing) {
      throw new Error(`Application type '${id}' not found`);
    }

    if (updates.code && updates.code !== existing.code) {
      const cleanCode = updates.code.trim().toUpperCase();
      for (const [tId, t] of this.applicationTypes.entries()) {
        if (tId !== id && t.code === cleanCode) {
          throw new Error(`Application type code '${cleanCode}' already exists`);
        }
      }
      existing.code = cleanCode;
    }

    if (updates.name !== undefined) existing.name = updates.name.trim();
    if (updates.description !== undefined) existing.description = updates.description ? updates.description.trim() : null;
    if (updates.is_active !== undefined) existing.is_active = updates.is_active;

    this.applicationTypes.set(id, existing);
    this.addAuditLog('admin', 'update', 'application_type', id, updates);
    return existing;
  }

  public deleteApplicationType(id: string): { success: boolean; message: string } {
    let count = 0;
    for (const app of this.applicants.values()) {
      if (app.application_type_id === id) count++;
    }

    if (count > 0) {
      throw new Error(`Cannot delete application type: ${count} applicant(s) are actively enrolled under this type. Deactivate it instead.`);
    }

    this.applicationTypes.delete(id);
    this.addAuditLog('admin', 'delete', 'application_type', id);
    return { success: true, message: 'Application type deleted successfully' };
  }

  public generateApplicantNumber(year = '2026'): string {
    this.applicantSeq++;
    const padded = this.applicantSeq.toString().padStart(5, '0');
    return `AHCAS/APP/${year}/${padded}`;
  }

  public createVerificationToken(userId: string, email: string): string {
    const token = `verify_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    this.verificationTokens.set(token, {
      userId,
      email: email.trim().toLowerCase(),
      token,
      expiresAt,
      used: false
    });
    return token;
  }

  public verifyEmailToken(token: string): { success: boolean; error?: string; applicant?: Applicant } {
    const record = this.verificationTokens.get(token);
    if (!record) {
      return { success: false, error: 'Invalid or unrecognized email verification link.' };
    }

    if (record.used) {
      return { success: false, error: 'This verification link has already been used.' };
    }

    if (Date.now() > record.expiresAt) {
      return { success: false, error: 'Verification link has expired. Please request a new verification link.' };
    }

    record.used = true;
    this.verificationTokens.set(token, record);

    const applicant = this.getApplicantByUserId(record.userId);
    if (applicant) {
      applicant.registration_status = 'verified';
      applicant.updated_at = new Date().toISOString();
      this.applicants.set(applicant.id, applicant);

      this.applicantEvents.push({
        id: `ev-${Date.now()}`,
        applicant_id: applicant.id,
        event_type: 'email_verified',
        created_at: new Date().toISOString()
      });

      this.addAuditLog(record.userId, 'verify_email', 'applicant', applicant.id);
      return { success: true, applicant };
    }

    return { success: true };
  }

  public registerApplicant({
    email,
    password,
    applicationTypeId
  }: {
    email: string;
    password: string;
    applicationTypeId: string;
  }): { user: Profile; applicant: Applicant; verificationToken: string } {
    const cleanEmail = email.trim().toLowerCase();

    for (const prof of this.profiles.values()) {
      if (prof.email.toLowerCase() === cleanEmail) {
        throw new Error('An account with this email address already exists. Please log in or use password recovery.');
      }
    }

    const appType = this.applicationTypes.get(applicationTypeId);
    if (!appType) {
      throw new Error('Selected application type does not exist.');
    }
    if (!appType.is_active) {
      throw new Error('The selected application programme is currently inactive and not accepting new registrations.');
    }

    const userId = this.createUserWithProfile({
      email: cleanEmail,
      password,
      fullName: '',
      status: 'active',
      role: 'applicant'
    });

    const userProfile = this.profiles.get(userId)!;
    const applicantNumber = this.generateApplicantNumber();

    const applicantId = `app-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const newApplicant: Applicant = {
      id: applicantId,
      user_id: userId,
      applicant_number: applicantNumber,
      application_type_id: applicationTypeId,
      full_name: '',
      phone_number: null,
      registration_status: 'pending_verification',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.applicants.set(applicantId, newApplicant);

    this.applicantEvents.push({
      id: `ev-${Date.now()}`,
      applicant_id: applicantId,
      event_type: 'account_created',
      created_at: new Date().toISOString()
    });

    const verificationToken = this.createVerificationToken(userId, cleanEmail);

    this.addAuditLog(userId, 'register', 'applicant', applicantId, {
      applicant_number: applicantNumber,
      application_type: appType.name
    });

    return {
      user: userProfile,
      applicant: { ...newApplicant, application_type: appType },
      verificationToken
    };
  }

  public getApplicantByUserId(userId: string): (Applicant & { application_type?: ApplicationType | null; email?: string }) | null {
    for (const app of this.applicants.values()) {
      if (app.user_id === userId) {
        const application_type = this.applicationTypes.get(app.application_type_id) || null;
        const profile = this.profiles.get(userId);
        return { ...app, application_type, email: profile?.email };
      }
    }
    return null;
  }

  public getApplicantById(applicantId: string): (Applicant & { application_type?: ApplicationType | null; email?: string }) | null {
    const app = this.applicants.get(applicantId);
    if (!app) return null;
    const application_type = this.applicationTypes.get(app.application_type_id) || null;
    const profile = this.profiles.get(app.user_id);
    return { ...app, application_type, email: profile?.email };
  }

  public updateApplicantProfile(userId: string, safeData: { full_name?: string; phone_number?: string }): Applicant {
    const app = this.getApplicantByUserId(userId);
    if (!app) {
      throw new Error('Applicant record not found for this user');
    }

    if (safeData.full_name !== undefined) {
      app.full_name = safeData.full_name.trim();
      const prof = this.profiles.get(userId);
      if (prof) {
        prof.full_name = safeData.full_name.trim();
        prof.updated_at = new Date().toISOString();
        this.profiles.set(userId, prof);
      }
    }

    if (safeData.phone_number !== undefined) {
      app.phone_number = safeData.phone_number ? safeData.phone_number.trim() : null;
      const prof = this.profiles.get(userId);
      if (prof) {
        prof.phone = app.phone_number;
        prof.updated_at = new Date().toISOString();
        this.profiles.set(userId, prof);
      }
    }

    app.updated_at = new Date().toISOString();
    this.applicants.set(app.id, app);

    this.applicantEvents.push({
      id: `ev-${Date.now()}`,
      applicant_id: app.id,
      event_type: 'profile_updated',
      created_at: new Date().toISOString()
    });

    this.addAuditLog(userId, 'update_profile', 'applicant', app.id);
    return app;
  }

  public getAllApplicants(searchQuery?: string, typeId?: string): (Applicant & { application_type?: ApplicationType | null; email?: string })[] {
    let list = Array.from(this.applicants.values()).map(app => {
      const application_type = this.applicationTypes.get(app.application_type_id) || null;
      const prof = this.profiles.get(app.user_id);
      return { ...app, application_type, email: prof?.email };
    });

    if (typeId && typeId !== 'all') {
      list = list.filter(a => a.application_type_id === typeId);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(a =>
        a.applicant_number.toLowerCase().includes(q) ||
        (a.full_name && a.full_name.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getApplicantCountsByType(): Record<string, { name: string; count: number }> {
    const counts: Record<string, { name: string; count: number }> = {};
    for (const t of this.applicationTypes.values()) {
      counts[t.id] = { name: t.name, count: 0 };
    }
    for (const app of this.applicants.values()) {
      if (counts[app.application_type_id]) {
        counts[app.application_type_id].count++;
      }
    }
    return counts;
  }

  public getApplicantEvents(applicantId: string): ApplicantEvent[] {
    return this.applicantEvents
      .filter(ev => ev.applicant_id === applicantId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // ---------------------------------------------------------------------------
  // STEP 3: ADMISSION SESSIONS & PROGRAMMES
  // ---------------------------------------------------------------------------
  public getAdmissionSessions(activeOnly = false): AdmissionSession[] {
    const list = Array.from(this.admissionSessions.values());
    if (activeOnly) return list.filter(s => s.is_active);
    return list;
  }

  public getActiveAdmissionSession(): AdmissionSession | null {
    for (const s of this.admissionSessions.values()) {
      if (s.is_active) return s;
    }
    return null;
  }

  public addAdmissionSession(name: string, startDate: string, endDate: string, isActive = true): AdmissionSession {
    const id = `session-${Date.now()}`;
    if (isActive) {
      for (const s of this.admissionSessions.values()) s.is_active = false;
    }
    const session: AdmissionSession = {
      id,
      name: name.trim(),
      start_date: startDate,
      end_date: endDate,
      is_active: isActive,
      created_at: new Date().toISOString()
    };
    this.admissionSessions.set(id, session);
    this.addAuditLog('admin', 'create_session', 'admission_session', id);
    return session;
  }

  public updateAdmissionSession(id: string, updates: Partial<AdmissionSession>): AdmissionSession {
    const session = this.admissionSessions.get(id);
    if (!session) throw new Error(`Admission session '${id}' not found`);
    if (updates.is_active) {
      for (const [sId, s] of this.admissionSessions.entries()) {
        if (sId !== id) s.is_active = false;
      }
    }
    Object.assign(session, updates);
    this.admissionSessions.set(id, session);
    return session;
  }

  public getAdmissionProgrammes(sessionId?: string, typeId?: string, openOnly = false): AdmissionProgramme[] {
    let list = Array.from(this.admissionProgrammes.values()).map(ap => {
      const programme = this.programmes.get(ap.programme_id);
      const session = this.admissionSessions.get(ap.admission_session_id);
      const application_type = this.applicationTypes.get(ap.application_type_id);
      return { ...ap, programme, admission_session: session, application_type };
    });

    if (sessionId) list = list.filter(ap => ap.admission_session_id === sessionId);
    if (typeId) list = list.filter(ap => ap.application_type_id === typeId);
    if (openOnly) {
      const now = new Date();
      list = list.filter(ap => ap.application_open && new Date(ap.application_deadline) > now);
    }
    return list;
  }

  public getAdmissionProgrammeById(id: string): AdmissionProgramme | null {
    const ap = this.admissionProgrammes.get(id);
    if (!ap) return null;
    const programme = this.programmes.get(ap.programme_id);
    const session = this.admissionSessions.get(ap.admission_session_id);
    const application_type = this.applicationTypes.get(ap.application_type_id);
    return { ...ap, programme, admission_session: session, application_type };
  }

  public addAdmissionProgramme(data: Omit<AdmissionProgramme, 'id' | 'created_at'>): AdmissionProgramme {
    const id = `adm-prog-${Date.now()}`;
    const newProg: AdmissionProgramme = {
      id,
      ...data,
      created_at: new Date().toISOString()
    };
    this.admissionProgrammes.set(id, newProg);
    return newProg;
  }

  public updateAdmissionProgramme(id: string, updates: Partial<AdmissionProgramme>): AdmissionProgramme {
    const existing = this.admissionProgrammes.get(id);
    if (!existing) throw new Error(`Admission programme '${id}' not found`);
    Object.assign(existing, updates);
    this.admissionProgrammes.set(id, existing);
    return existing;
  }

  // ---------------------------------------------------------------------------
  // STEP 3: APPLICATION ENTITY LIFECYCLE
  // ---------------------------------------------------------------------------
  public getOrCreateApplicationForApplicant(applicantId: string): Application {
    for (const app of this.applications.values()) {
      if (app.applicant_id === applicantId) {
        return this.hydrateApplication(app);
      }
    }

    const applicant = this.applicants.get(applicantId);
    if (!applicant) throw new Error(`Applicant '${applicantId}' not found`);

    const activeSession = this.getActiveAdmissionSession() || {
      id: 'session-2026-2027',
      name: '2026/2027 Academic Session',
      start_date: '2026-09-01',
      end_date: '2027-08-31',
      is_active: true,
      created_at: new Date().toISOString()
    };

    const appId = `appl-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const newApp: Application = {
      id: appId,
      applicant_id: applicantId,
      admission_session_id: activeSession.id,
      admission_programme_id: null,
      application_number: applicant.applicant_number,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.applications.set(appId, newApp);

    // Initialize personal details from applicant record if present
    const names = (applicant.full_name || '').split(' ');
    const surname = names[0] || '';
    const firstName = names[1] || '';
    const middleName = names.slice(2).join(' ') || null;

    this.personalDetails.set(appId, {
      application_id: appId,
      surname,
      first_name: firstName,
      middle_name: middleName,
      date_of_birth: '2005-01-01',
      gender: 'male',
      marital_status: 'Single',
      nationality: 'Nigerian',
      state_of_origin: '',
      lga_of_origin: '',
      passport_url: null
    });

    this.contactDetails.set(appId, {
      application_id: appId,
      phone_number: applicant.phone_number || '',
      alternative_phone: null,
      residential_address: '',
      state_of_residence: '',
      lga_of_residence: '',
      city: ''
    });

    this.guardians.set(appId, []);
    this.qualifications.set(appId, []);
    this.documents.set(appId, []);

    this.addAuditLog(applicant.user_id, 'initialize_application', 'application', appId);
    return this.hydrateApplication(newApp);
  }

  public getApplicationById(applicationId: string): Application | null {
    const app = this.applications.get(applicationId);
    if (!app) return null;
    return this.hydrateApplication(app);
  }

  public getApplicationByUserId(userId: string): Application | null {
    const applicant = this.getApplicantByUserId(userId);
    if (!applicant) return null;
    return this.getOrCreateApplicationForApplicant(applicant.id);
  }

  private hydrateApplication(app: Application): Application {
    const personal = this.personalDetails.get(app.id) || null;
    const contact = this.contactDetails.get(app.id) || null;
    const guardiansList = this.guardians.get(app.id) || [];
    const qualsList = this.qualifications.get(app.id) || [];
    const docsList = this.documents.get(app.id) || [];
    const programme = app.admission_programme_id ? this.getAdmissionProgrammeById(app.admission_programme_id) : null;
    const session = this.admissionSessions.get(app.admission_session_id) || null;
    const applicant = this.applicants.get(app.applicant_id) || null;
    const screening = this.screenings.get(app.id) || null;
    const rawOffer = this.admissionOffers.get(app.id) || null;
    let admission_offer: AdmissionOffer | null = null;

    if (rawOffer) {
      const prog = this.programmes.get(rawOffer.programme_id) || null;
      const sess = this.admissionSessions.get(rawOffer.admission_session_id) || null;
      admission_offer = { ...rawOffer, programme: prog, admission_session: sess };
    }

    const invoices = this.getInvoicesByApplicationId(app.id);
    const matriculation_record = this.getMatriculationByApplicationId(app.id);

    return {
      ...app,
      personal_details: personal,
      contact_details: contact,
      guardians: guardiansList,
      qualifications: qualsList,
      documents: docsList,
      selected_programme: programme,
      admission_session: session,
      applicant,
      screening,
      admission_offer,
      invoices,
      matriculation_record
    };
  }

  // ---------------------------------------------------------------------------
  // STEP 3: APPLICATION WIZARD MULTI-STEP SAVE OPERATIONS
  // ---------------------------------------------------------------------------
  public savePersonalDetails(applicationId: string, data: Partial<ApplicationPersonalDetails>): ApplicationPersonalDetails {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.status === 'submitted') throw new Error('Application has already been submitted and cannot be modified.');

    const existing = this.personalDetails.get(applicationId) || {
      application_id: applicationId,
      surname: '',
      first_name: '',
      middle_name: null,
      date_of_birth: '2005-01-01',
      gender: 'male',
      marital_status: 'Single',
      nationality: 'Nigerian',
      state_of_origin: '',
      lga_of_origin: '',
      passport_url: null
    };

    const updated = { ...existing, ...data };
    this.personalDetails.set(applicationId, updated);

    // Sync applicant full name
    const applicant = this.applicants.get(app.applicant_id);
    if (applicant && (data.surname || data.first_name)) {
      const full = [updated.surname, updated.first_name, updated.middle_name].filter(Boolean).join(' ');
      applicant.full_name = full;
      this.applicants.set(applicant.id, applicant);
      const prof = this.profiles.get(applicant.user_id);
      if (prof) {
        prof.full_name = full;
        this.profiles.set(prof.id, prof);
      }
    }

    if (app.status === 'draft') app.status = 'in_progress';
    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    return updated;
  }

  public saveContactDetails(applicationId: string, data: Partial<ApplicationContactDetails>): ApplicationContactDetails {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.status === 'submitted') throw new Error('Application has already been submitted and cannot be modified.');

    const existing = this.contactDetails.get(applicationId) || {
      application_id: applicationId,
      phone_number: '',
      alternative_phone: null,
      residential_address: '',
      state_of_residence: '',
      lga_of_residence: '',
      city: ''
    };

    const updated = { ...existing, ...data };
    this.contactDetails.set(applicationId, updated);

    const applicant = this.applicants.get(app.applicant_id);
    if (applicant && data.phone_number) {
      applicant.phone_number = data.phone_number;
      this.applicants.set(applicant.id, applicant);
      const prof = this.profiles.get(applicant.user_id);
      if (prof) {
        prof.phone = data.phone_number;
        this.profiles.set(prof.id, prof);
      }
    }

    if (app.status === 'draft') app.status = 'in_progress';
    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    return updated;
  }

  public saveGuardians(applicationId: string, guardiansList: Omit<ApplicationGuardian, 'application_id' | 'id'>[]): ApplicationGuardian[] {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.status === 'submitted') throw new Error('Application has already been submitted and cannot be modified.');

    const saved: ApplicationGuardian[] = guardiansList.map((g, idx) => ({
      id: `grd-${Date.now()}-${idx}`,
      application_id: applicationId,
      full_name: g.full_name.trim(),
      relationship: g.relationship.trim(),
      phone_number: g.phone_number.trim(),
      email: g.email ? g.email.trim() : null,
      address: g.address.trim()
    }));

    this.guardians.set(applicationId, saved);
    if (app.status === 'draft') app.status = 'in_progress';
    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    return saved;
  }

  public saveQualifications(applicationId: string, qualsList: AcademicQualification[]): AcademicQualification[] {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.status === 'submitted') throw new Error('Application has already been submitted and cannot be modified.');

    const saved: AcademicQualification[] = qualsList.map((q, idx) => {
      const qId = q.id || `qual-${Date.now()}-${idx}`;
      const subjects: QualificationSubject[] = (q.subjects || []).map((s, sIdx) => ({
        id: s.id || `subj-${Date.now()}-${idx}-${sIdx}`,
        qualification_id: qId,
        subject: s.subject.trim(),
        grade: s.grade.trim()
      }));

      return {
        ...q,
        id: qId,
        application_id: applicationId,
        subjects
      };
    });

    this.qualifications.set(applicationId, saved);
    if (app.status === 'draft') app.status = 'in_progress';
    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    return saved;
  }

  public saveProgrammeSelection(applicationId: string, admissionProgrammeId: string): AdmissionProgramme {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.status === 'submitted') throw new Error('Application has already been submitted and cannot be modified.');

    const admProg = this.getAdmissionProgrammeById(admissionProgrammeId);
    if (!admProg) throw new Error('Selected admission programme does not exist.');
    if (!admProg.application_open) throw new Error('This programme is currently closed for applications.');
    if (new Date(admProg.application_deadline) < new Date()) {
      throw new Error('Application deadline for this programme has passed.');
    }

    app.admission_programme_id = admissionProgrammeId;
    if (app.status === 'draft') app.status = 'in_progress';
    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    return admProg;
  }

  public uploadDocument(
    applicationId: string,
    docData: {
      document_type: ApplicationDocument['document_type'];
      file_name: string;
      file_size: number;
      mime_type: string;
      storage_path: string;
    }
  ): ApplicationDocument {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.status === 'submitted') throw new Error('Application has already been submitted and cannot be modified.');

    let docs = this.documents.get(applicationId) || [];
    // Replace if document of same type exists
    docs = docs.filter(d => d.document_type !== docData.document_type);

    const newDoc: ApplicationDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      application_id: applicationId,
      ...docData,
      uploaded_at: new Date().toISOString()
    };
    docs.push(newDoc);
    this.documents.set(applicationId, docs);

    // If passport photo, sync to personal details as well
    if (docData.document_type === 'passport_photo') {
      const personal = this.personalDetails.get(applicationId);
      if (personal) {
        personal.passport_url = docData.storage_path;
        this.personalDetails.set(applicationId, personal);
      }
    }

    if (app.status === 'draft') app.status = 'in_progress';
    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    return newDoc;
  }

  public removeDocument(applicationId: string, documentType: ApplicationDocument['document_type']): boolean {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.status === 'submitted') throw new Error('Application has already been submitted and cannot be modified.');

    let docs = this.documents.get(applicationId) || [];
    docs = docs.filter(d => d.document_type !== documentType);
    this.documents.set(applicationId, docs);
    return true;
  }

  // ---------------------------------------------------------------------------
  // STEP 3: FINAL APPLICATION SUBMISSION & VALIDATION
  // ---------------------------------------------------------------------------
  public submitApplication(applicationId: string): { success: boolean; submissionReference: string; application: Application } {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application record not found.');

    if (app.status === 'submitted') {
      return {
        success: true,
        submissionReference: app.submission_reference || 'AHCAS/SUB/2026/00001',
        application: this.hydrateApplication(app)
      };
    }

    // Validation 1: Personal Details
    const personal = this.personalDetails.get(applicationId);
    if (!personal || !personal.surname || !personal.first_name || !personal.state_of_origin || !personal.lga_of_origin) {
      throw new Error('Incomplete personal details. Please fill all required personal information fields.');
    }

    // Validation 2: Contact Details
    const contact = this.contactDetails.get(applicationId);
    if (!contact || !contact.phone_number || !contact.residential_address || !contact.state_of_residence) {
      throw new Error('Incomplete contact details. Please provide residential address and phone number.');
    }

    // Validation 3: Guardians / Next of Kin
    const guardiansList = this.guardians.get(applicationId) || [];
    if (guardiansList.length === 0 || !guardiansList[0].full_name || !guardiansList[0].phone_number) {
      throw new Error('Next of Kin / Parent details required. Please provide guardian contact details.');
    }

    // Validation 4: Academic Qualifications
    const quals = this.qualifications.get(applicationId) || [];
    if (quals.length === 0) {
      throw new Error('Academic qualifications required. Please enter your O-Level examination results.');
    }
    const totalSubjects = quals.reduce((acc, q) => acc + (q.subjects?.length || 0), 0);
    if (totalSubjects < 5) {
      throw new Error('A minimum of 5 O-Level subjects with grades must be provided.');
    }

    // Validation 5: Programme Selection
    if (!app.admission_programme_id) {
      throw new Error('No programme selected. Please choose an available admission programme.');
    }
    const prog = this.getAdmissionProgrammeById(app.admission_programme_id);
    if (!prog || !prog.application_open) {
      throw new Error('The selected programme is not open for admission applications.');
    }

    // Validation 6: Required Documents
    const docs = this.documents.get(applicationId) || [];
    const hasPassport = docs.some(d => d.document_type === 'passport_photo');
    const hasOlevel = docs.some(d => d.document_type === 'olevel_result');
    if (!hasPassport) {
      throw new Error('Missing document: Passport photograph upload is mandatory.');
    }
    if (!hasOlevel) {
      throw new Error('Missing document: O-Level certificate or statement of result upload is mandatory.');
    }

    // All Validations Passed -> Transition to Submitted
    this.submissionSeq++;
    const year = '2026';
    const subRef = `AHCAS/SUB/${year}/${this.submissionSeq.toString().padStart(5, '0')}`;

    app.status = 'submitted';
    app.submitted_at = new Date().toISOString();
    app.submission_reference = subRef;
    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    // Update applicant status
    const applicant = this.applicants.get(app.applicant_id);
    if (applicant) {
      applicant.registration_status = 'submitted';
      this.applicants.set(applicant.id, applicant);
    }

    // Record Status History
    const history = this.statusHistory.get(applicationId) || [];
    history.push({
      id: `hist-${Date.now()}`,
      application_id: applicationId,
      previous_status: 'in_progress',
      new_status: 'submitted',
      changed_by: applicant?.user_id || 'applicant',
      created_at: new Date().toISOString()
    });
    this.statusHistory.set(applicationId, history);

    this.addAuditLog(applicant?.user_id || 'system', 'submit_application', 'application', applicationId, {
      submission_reference: subRef,
      programme: prog.programme?.name
    });

    console.log(`[SUBMISSION CONFIRMATION EMAIL SENT] To applicant ${applicant?.applicant_number} -> Ref: ${subRef}`);

    return {
      success: true,
      submissionReference: subRef,
      application: this.hydrateApplication(app)
    };
  }

  public getAllApplications(searchQuery?: string, sessionId?: string, status?: string): Application[] {
    let list = Array.from(this.applications.values()).map(app => this.hydrateApplication(app));

    if (sessionId && sessionId !== 'all') {
      list = list.filter(a => a.admission_session_id === sessionId);
    }

    if (status && status !== 'all') {
      list = list.filter(a => a.status === status);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(a =>
        a.application_number.toLowerCase().includes(q) ||
        (a.submission_reference && a.submission_reference.toLowerCase().includes(q)) ||
        (a.personal_details?.surname && a.personal_details.surname.toLowerCase().includes(q)) ||
        (a.personal_details?.first_name && a.personal_details.first_name.toLowerCase().includes(q)) ||
        (a.applicant?.email && a.applicant.email.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // ---------------------------------------------------------------------------
  // STEP 4: ADMISSION PROCESSING, SCREENING & DECISION MANAGEMENT
  // ---------------------------------------------------------------------------
  public getScreeningByApplicationId(applicationId: string): AdmissionScreening | null {
    const screening = this.screenings.get(applicationId);
    if (!screening) return null;
    const screenerProfile = this.profiles.get(screening.screened_by) || null;
    return { ...screening, screener_profile: screenerProfile };
  }

  public saveScreening(
    applicationId: string,
    screenerId: string,
    data: {
      status: ScreeningStatus;
      screeningScore?: number | null;
      olevelVerified: boolean;
      credentialsVerified: boolean;
      actionRequiredNote?: string | null;
      internalNotes?: string | null;
    }
  ): AdmissionScreening {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    const prevStatus = app.status;

    // Update application status according to screening verdict
    if (data.status === 'action_required') {
      app.status = 'action_required';
    } else if (data.status === 'under_review') {
      app.status = 'under_review';
    } else if (data.status === 'recommended_for_admission') {
      app.status = 'under_review'; // Stays under_review until official offer issued
    }

    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    const screeningRecord: AdmissionScreening = {
      id: `scr-${Date.now()}`,
      application_id: applicationId,
      screened_by: screenerId,
      screening_status: data.status,
      screening_score: data.screeningScore ?? null,
      olevel_verified: data.olevelVerified,
      credentials_verified: data.credentialsVerified,
      action_required_note: data.actionRequiredNote ?? null,
      internal_notes: data.internalNotes ?? null,
      screened_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.screenings.set(applicationId, screeningRecord);

    // Record Status History
    if (prevStatus !== app.status) {
      const history = this.statusHistory.get(applicationId) || [];
      history.push({
        id: `hist-${Date.now()}`,
        application_id: applicationId,
        previous_status: prevStatus,
        new_status: app.status,
        changed_by: screenerId,
        created_at: new Date().toISOString()
      });
      this.statusHistory.set(applicationId, history);
    }

    this.addAuditLog(screenerId, 'screen_application', 'application', applicationId, {
      verdict: data.status,
      score: data.screeningScore
    });

    return { ...screeningRecord, screener_profile: this.profiles.get(screenerId) || null };
  }

  public issueAdmissionOffer(
    applicationId: string,
    officerId: string,
    data: {
      programmeId: string;
      sessionId?: string;
      acceptanceDeadlineDays?: number;
    }
  ): AdmissionOffer {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    const existingOffer = this.admissionOffers.get(applicationId);
    if (existingOffer && app.status === 'accepted') {
      return existingOffer;
    }

    const prog = this.programmes.get(data.programmeId);
    if (!prog) throw new Error('Admitted programme not found');

    const sessionId = data.sessionId || app.admission_session_id;
    const session = this.admissionSessions.get(sessionId);
    if (!session) throw new Error('Academic session not found');

    this.offerSeq++;
    const year = '2026';
    const offerLetterNumber = `AHCAS/ADM/${year}/${this.offerSeq.toString().padStart(5, '0')}`;

    const days = data.acceptanceDeadlineDays || 21;
    const deadline = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    const offer: AdmissionOffer = {
      id: `ofr-${Date.now()}`,
      application_id: applicationId,
      programme_id: data.programmeId,
      admission_session_id: sessionId,
      offer_letter_number: offerLetterNumber,
      offer_date: new Date().toISOString(),
      acceptance_deadline: deadline,
      offer_status: 'offered',
      responded_at: null,
      created_by: officerId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.admissionOffers.set(applicationId, offer);

    const prevStatus = app.status;
    app.status = 'accepted';
    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    // Record Status History
    const history = this.statusHistory.get(applicationId) || [];
    history.push({
      id: `hist-${Date.now()}`,
      application_id: applicationId,
      previous_status: prevStatus,
      new_status: 'accepted',
      changed_by: officerId,
      created_at: new Date().toISOString()
    });
    this.statusHistory.set(applicationId, history);

    this.addAuditLog(officerId, 'issue_admission_offer', 'application', applicationId, {
      offer_letter_number: offerLetterNumber,
      admitted_programme: prog.name
    });

    return { ...offer, programme: prog, admission_session: session };
  }

  public rejectApplication(applicationId: string, officerId: string, reason?: string): Application {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    const prevStatus = app.status;
    app.status = 'rejected';
    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    // Record Status History
    const history = this.statusHistory.get(applicationId) || [];
    history.push({
      id: `hist-${Date.now()}`,
      application_id: applicationId,
      previous_status: prevStatus,
      new_status: 'rejected',
      changed_by: officerId,
      created_at: new Date().toISOString()
    });
    this.statusHistory.set(applicationId, history);

    this.addAuditLog(officerId, 'reject_application', 'application', applicationId, { reason });
    return this.hydrateApplication(app);
  }

  public respondToOffer(
    applicationId: string,
    applicantUserId: string,
    response: 'accept' | 'decline'
  ): AdmissionOffer {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    const offer = this.admissionOffers.get(applicationId);
    if (!offer) throw new Error('No provisional admission offer found for this candidate.');

    // Check if offer has lapsed
    if (new Date() > new Date(offer.acceptance_deadline) && offer.offer_status === 'offered') {
      offer.offer_status = 'lapsed';
      this.admissionOffers.set(applicationId, offer);
      throw new Error('The acceptance deadline for this admission offer has elapsed.');
    }

    if (offer.offer_status !== 'offered') {
      // Already responded
      return offer;
    }

    offer.offer_status = response === 'accept' ? 'accepted' : 'declined';
    offer.responded_at = new Date().toISOString();
    offer.updated_at = new Date().toISOString();
    this.admissionOffers.set(applicationId, offer);

    this.addAuditLog(applicantUserId, `${response}_admission_offer`, 'admission_offer', offer.id);

    const prog = this.programmes.get(offer.programme_id) || null;
    const session = this.admissionSessions.get(offer.admission_session_id) || null;
    return { ...offer, programme: prog, admission_session: session };
  }

  public submitDeficiencyResponse(applicationId: string, applicantUserId: string, note?: string): boolean {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    if (app.status === 'action_required') {
      app.status = 'under_review';
      app.updated_at = new Date().toISOString();
      this.applications.set(applicationId, app);

      const screening = this.screenings.get(applicationId);
      if (screening) {
        screening.screening_status = 'under_review';
        screening.action_required_note = note ? `Applicant submitted update: ${note}` : null;
        screening.updated_at = new Date().toISOString();
        this.screenings.set(applicationId, screening);
      }

      this.addAuditLog(applicantUserId, 'resolve_deficiency', 'application', applicationId, { note });
    }
    return true;
  }

  public getOfferByApplicationId(applicationId: string): AdmissionOffer | null {
    const offer = this.admissionOffers.get(applicationId);
    if (!offer) return null;
    const prog = this.programmes.get(offer.programme_id) || null;
    const session = this.admissionSessions.get(offer.admission_session_id) || null;
    return { ...offer, programme: prog, admission_session: session };
  }

  // ---------------------------------------------------------------------------
  // STEP 5: ELECTRONIC INVOICING & REMITA PAYMENTS
  // ---------------------------------------------------------------------------
  public getInvoicesByApplicationId(applicationId: string): FeeInvoice[] {
    const list: FeeInvoice[] = [];
    for (const inv of this.feeInvoices.values()) {
      if (inv.application_id === applicationId) {
        const payment = Array.from(this.feePayments.values()).find(p => p.invoice_id === inv.id) || null;
        list.push({ ...inv, payment });
      }
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getInvoiceById(invoiceId: string): FeeInvoice | null {
    const inv = this.feeInvoices.get(invoiceId);
    if (!inv) return null;
    const payment = Array.from(this.feePayments.values()).find(p => p.invoice_id === inv.id) || null;
    return { ...inv, payment };
  }

  public getInvoiceByRRR(rrr: string): FeeInvoice | null {
    const cleanRRR = rrr.trim();
    for (const inv of this.feeInvoices.values()) {
      if (inv.rrr_number === cleanRRR) {
        const payment = Array.from(this.feePayments.values()).find(p => p.invoice_id === inv.id) || null;
        return { ...inv, payment };
      }
    }
    return null;
  }

  public getOrCreateAcceptanceInvoice(applicationId: string): FeeInvoice {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    // Check if invoice already exists
    const existing = Array.from(this.feeInvoices.values()).find(
      inv => inv.application_id === applicationId && inv.fee_type === 'acceptance_fee'
    );
    if (existing) {
      const payment = Array.from(this.feePayments.values()).find(p => p.invoice_id === existing.id) || null;
      return { ...existing, payment };
    }

    const applicant = this.applicants.get(app.applicant_id);
    const session = this.admissionSessions.get(app.admission_session_id) || {
      id: 'session-2026-2027',
      name: '2026/2027 Academic Session',
      start_date: '2026-09-01',
      end_date: '2027-08-31',
      is_active: true
    };

    this.invoiceSeq++;
    // Generate institutional RRR formatted 2408-XXXX-XXXX
    const r1 = Math.floor(1000 + Math.random() * 9000);
    const r2 = Math.floor(1000 + Math.random() * 9000);
    const rrrNumber = `2408-${r1}-${r2}`;

    const invoice: FeeInvoice = {
      id: `inv-acc-${Date.now()}-${this.invoiceSeq}`,
      application_id: applicationId,
      applicant_id: app.applicant_id,
      fee_type: 'acceptance_fee',
      fee_name: 'Institutional Admission Acceptance Fee',
      amount: 25000,
      currency: 'NGN',
      rrr_number: rrrNumber,
      session_id: session.id,
      session_name: session.name,
      status: 'pending',
      created_at: new Date().toISOString(),
      paid_at: null,
      payment: null
    };

    this.feeInvoices.set(invoice.id, invoice);

    this.addAuditLog(
      applicant?.user_id || 'system',
      'generate_fee_invoice',
      'fee_invoices',
      invoice.id,
      { fee_type: invoice.fee_type, amount: invoice.amount, rrr: rrrNumber }
    );

    return invoice;
  }

  public processPayment(params: {
    invoiceId: string;
    paymentMethod: 'card' | 'bank_transfer' | 'ussd' | 'bank_branch';
    payerName?: string;
    payerEmail?: string;
    transactionRef?: string;
  }): { success: boolean; payment: FeePayment; invoice: FeeInvoice; matriculation?: MatriculationRecord | null } {
    const inv = this.feeInvoices.get(params.invoiceId);
    if (!inv) throw new Error('Invoice not found');

    // If already paid, return existing payment
    if (inv.status === 'paid') {
      const existingPayment = Array.from(this.feePayments.values()).find(p => p.invoice_id === inv.id);
      if (existingPayment) {
        const matric = this.getMatriculationByApplicationId(inv.application_id);
        return {
          success: true,
          payment: existingPayment,
          invoice: { ...inv, payment: existingPayment },
          matriculation: matric
        };
      }
    }

    this.paymentSeq++;
    const receiptNumber = `AHCAS/REC/2026/${this.paymentSeq.toString().padStart(5, '0')}`;
    const paymentRef = params.transactionRef || `PAY-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const payment: FeePayment = {
      id: `pay-${Date.now()}-${this.paymentSeq}`,
      invoice_id: inv.id,
      application_id: inv.application_id,
      payment_reference: paymentRef,
      receipt_number: receiptNumber,
      amount_paid: inv.amount,
      payment_method: params.paymentMethod,
      transaction_date: new Date().toISOString(),
      status: 'successful',
      payer_name: params.payerName || 'Admitted Candidate',
      payer_email: params.payerEmail || '',
      rrr_number: inv.rrr_number
    };

    this.feePayments.set(payment.id, payment);

    // Update invoice status
    inv.status = 'paid';
    inv.paid_at = payment.transaction_date;
    inv.payment = payment;
    this.feeInvoices.set(inv.id, inv);

    this.addAuditLog(
      null,
      'verify_payment',
      'fee_payments',
      payment.id,
      {
        receipt_number: receiptNumber,
        amount: payment.amount_paid,
        method: payment.payment_method,
        rrr: inv.rrr_number
      }
    );

    let matriculationRecord: MatriculationRecord | null = null;
    // Step 6 Automatic Transition: If acceptance fee is paid, auto-matriculate candidate
    if (inv.fee_type === 'acceptance_fee') {
      try {
        matriculationRecord = this.matriculateCandidate(inv.application_id, 'SYSTEM_AUTO_CLEARANCE');
      } catch (err: any) {
        console.error('Error during auto-matriculation:', err);
      }
    }

    return {
      success: true,
      payment,
      invoice: inv,
      matriculation: matriculationRecord
    };
  }

  public getPaymentById(paymentId: string): FeePayment | null {
    return this.feePayments.get(paymentId) || null;
  }

  public getPaymentByReceiptNumber(receiptNumber: string): FeePayment | null {
    const clean = receiptNumber.trim().toUpperCase();
    for (const p of this.feePayments.values()) {
      if (p.receipt_number.toUpperCase() === clean) {
        return p;
      }
    }
    return null;
  }

  public getAllInvoices(filter?: {
    feeType?: string;
    status?: string;
    searchQuery?: string;
  }): (FeeInvoice & { application?: Application | null; applicant?: Applicant | null })[] {
    let list: (FeeInvoice & { application?: Application | null; applicant?: Applicant | null })[] = [];

    for (const inv of this.feeInvoices.values()) {
      const payment = Array.from(this.feePayments.values()).find(p => p.invoice_id === inv.id) || null;
      const app = this.applications.get(inv.application_id) || null;
      const applicant = this.applicants.get(inv.applicant_id) || null;

      list.push({
        ...inv,
        payment,
        application: app ? this.hydrateApplication(app) : null,
        applicant
      });
    }

    if (filter?.feeType && filter.feeType !== 'all') {
      list = list.filter(i => i.fee_type === filter.feeType);
    }

    if (filter?.status && filter.status !== 'all') {
      list = list.filter(i => i.status === filter.status);
    }

    if (filter?.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.trim().toLowerCase();
      list = list.filter(
        i =>
          i.rrr_number.toLowerCase().includes(q) ||
          i.fee_name.toLowerCase().includes(q) ||
          (i.payment?.receipt_number && i.payment.receipt_number.toLowerCase().includes(q)) ||
          (i.applicant?.full_name && i.applicant.full_name.toLowerCase().includes(q)) ||
          (i.application?.application_number && i.application.application_number.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // ---------------------------------------------------------------------------
  // STEP 6: STUDENT MATRICULATION & ENROLLMENT TRANSITION
  // ---------------------------------------------------------------------------
  public matriculateCandidate(applicationId: string, clearedBy: string = 'ACADEMIC_REGISTRAR'): MatriculationRecord {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    // Check if already matriculated
    const existing = this.matriculationRecords.get(applicationId);
    if (existing) {
      const prog = this.programmes.get(existing.programme_id) || null;
      return { ...existing, programme: prog };
    }

    const applicant = this.applicants.get(app.applicant_id);
    if (!applicant) throw new Error('Applicant profile not found');

    // Resolve Programme
    const offer = this.admissionOffers.get(applicationId);
    let programmeId = offer?.programme_id;
    if (!programmeId && app.admission_programme_id) {
      const admProg = this.admissionProgrammes.get(app.admission_programme_id);
      programmeId = admProg?.programme_id;
    }
    if (!programmeId) {
      programmeId = 'prog-sci'; // Default to IJMB Sciences
    }

    const programme = this.programmes.get(programmeId) || null;
    let level = 'IJMB 1';
    if (programme?.name.toLowerCase().includes('diploma')) {
      level = 'Diploma 1';
    }

    // Generate Matriculation Number: AHCAS/2026/XXX
    this.matricSeq++;
    const matricNumber = `AHCAS/2026/${this.matricSeq.toString().padStart(3, '0')}`;

    // Create or Update Student Record in students table
    let student = Array.from(this.students.values()).find(s => s.user_id === applicant.user_id);
    if (!student) {
      const studentId = `std-mat-${Date.now()}`;
      student = {
        id: studentId,
        user_id: applicant.user_id,
        matric_number: matricNumber,
        programme_id: programmeId,
        level: level,
        status: 'active',
        created_at: new Date().toISOString()
      };
      this.students.set(studentId, student);
    } else {
      student.matric_number = matricNumber;
      student.programme_id = programmeId;
      student.level = level;
      student.status = 'active';
      this.students.set(student.id, student);
    }

    // Assign 'student' role in user_roles
    const studentRole = this.roles.get('role-student');
    if (studentRole) {
      const hasStudentRole = this.userRoles.some(
        ur => ur.user_id === applicant.user_id && ur.role_id === studentRole.id
      );
      if (!hasStudentRole) {
        this.userRoles.push({
          id: `ur-${Date.now()}`,
          user_id: applicant.user_id,
          role_id: studentRole.id,
          assigned_at: new Date().toISOString(),
          assigned_by: clearedBy
        });
      }
    }

    // Update Application Status to 'matriculated'
    app.status = 'matriculated';
    app.updated_at = new Date().toISOString();
    this.applications.set(applicationId, app);

    // Update Applicant Registration Status to 'admitted'
    applicant.registration_status = 'admitted';
    applicant.updated_at = new Date().toISOString();
    this.applicants.set(applicant.id, applicant);

    // Record Matriculation Record
    const matricRecord: MatriculationRecord = {
      id: `mat-${Date.now()}`,
      application_id: applicationId,
      student_id: student.id,
      matric_number: matricNumber,
      session_id: app.admission_session_id,
      programme_id: programmeId,
      level: level,
      cleared_by: clearedBy,
      matriculated_at: new Date().toISOString()
    };

    this.matriculationRecords.set(applicationId, matricRecord);

    // Record Status History
    const history = this.statusHistory.get(applicationId) || [];
    history.push({
      id: `hist-${Date.now()}`,
      application_id: applicationId,
      previous_status: 'accepted',
      new_status: 'matriculated',
      changed_by: clearedBy,
      created_at: new Date().toISOString()
    });
    this.statusHistory.set(applicationId, history);

    this.addAuditLog(
      applicant.user_id,
      'matriculate_student',
      'matriculation_records',
      matricRecord.id,
      {
        matric_number: matricNumber,
        programme: programme?.name,
        cleared_by: clearedBy
      }
    );

    return { ...matricRecord, programme };
  }

  public getMatriculationByApplicationId(applicationId: string): MatriculationRecord | null {
    const record = this.matriculationRecords.get(applicationId);
    if (!record) return null;
    const prog = this.programmes.get(record.programme_id) || null;
    return { ...record, programme: prog };
  }

  public getAllMatriculations(filter?: {
    sessionId?: string;
    searchQuery?: string;
  }): (MatriculationRecord & { student?: Student | null; profile?: Profile | null; application?: Application | null })[] {
    let list: (MatriculationRecord & { student?: Student | null; profile?: Profile | null; application?: Application | null })[] = [];

    for (const record of this.matriculationRecords.values()) {
      const student = this.students.get(record.student_id) || null;
      const profile = student ? this.profiles.get(student.user_id) || null : null;
      const app = this.applications.get(record.application_id) || null;
      const prog = this.programmes.get(record.programme_id) || null;

      list.push({
        ...record,
        programme: prog,
        student,
        profile,
        application: app ? this.hydrateApplication(app) : null
      });
    }

    if (filter?.sessionId && filter.sessionId !== 'all') {
      list = list.filter(m => m.session_id === filter.sessionId);
    }

    if (filter?.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.trim().toLowerCase();
      list = list.filter(
        m =>
          m.matric_number.toLowerCase().includes(q) ||
          (m.profile?.full_name && m.profile.full_name.toLowerCase().includes(q)) ||
          (m.application?.application_number && m.application.application_number.toLowerCase().includes(q)) ||
          (m.programme?.name && m.programme.name.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.matriculated_at).getTime() - new Date(a.matriculated_at).getTime());
  }

  // ---------------------------------------------------------------------------
  // SYSTEM STATS
  // ---------------------------------------------------------------------------
  public getCounts() {
    let activeStudents = 0;
    let inactiveStudents = 0;
    for (const s of this.students.values()) {
      if (s.status === 'active') activeStudents++;
      else inactiveStudents++;
    }

    let activeStaff = 0;
    let inactiveStaff = 0;
    for (const st of this.staff.values()) {
      if (st.status === 'active') activeStaff++;
      else inactiveStaff++;
    }

    let submittedApps = 0;
    let inProgressApps = 0;
    let underReviewApps = 0;
    let actionRequiredApps = 0;
    let acceptedApps = 0;
    let rejectedApps = 0;
    let matriculatedApps = 0;
    for (const a of this.applications.values()) {
      if (a.status === 'submitted') submittedApps++;
      else if (a.status === 'under_review') underReviewApps++;
      else if (a.status === 'action_required') actionRequiredApps++;
      else if (a.status === 'accepted') acceptedApps++;
      else if (a.status === 'rejected') rejectedApps++;
      else if (a.status === 'matriculated') matriculatedApps++;
      else inProgressApps++;
    }

    let acceptedOfferCount = 0;
    for (const ofr of this.admissionOffers.values()) {
      if (ofr.offer_status === 'accepted') acceptedOfferCount++;
    }

    let paidInvoicesCount = 0;
    let totalRevenue = 0;
    for (const inv of this.feeInvoices.values()) {
      if (inv.status === 'paid') {
        paidInvoicesCount++;
        totalRevenue += inv.amount;
      }
    }

    return {
      studentCount: this.students.size,
      activeStudents,
      inactiveStudents,
      staffCount: this.staff.size,
      activeStaff,
      inactiveStaff,
      applicantCount: this.applicants.size,
      applicationTypeCount: this.applicationTypes.size,
      departmentCount: this.departments.size,
      programmeCount: this.programmes.size,
      totalApplications: this.applications.size,
      submittedApplications: submittedApps,
      inProgressApplications: inProgressApps,
      underReviewApplications: underReviewApps,
      actionRequiredApplications: actionRequiredApps,
      acceptedApplications: acceptedApps,
      rejectedApplications: rejectedApps,
      matriculatedApplications: matriculatedApps,
      screenedCount: this.screenings.size,
      offeredCount: this.admissionOffers.size,
      acceptedOfferCount,
      paidInvoicesCount,
      totalRevenue,
      matriculatedCount: this.matriculationRecords.size,
      totalProfiles: this.profiles.size
    };
  }

  public getAllProfiles(): Profile[] {
    return Array.from(this.profiles.values());
  }

  public getAllStudents() {
    return Array.from(this.students.values()).map(s => {
      const profile = this.profiles.get(s.user_id);
      const programme = s.programme_id ? this.programmes.get(s.programme_id) : null;
      return { ...s, profile, programme };
    });
  }

  public getAllStaff() {
    return Array.from(this.staff.values()).map(st => {
      const profile = this.profiles.get(st.user_id);
      const department = st.department_id ? this.departments.get(st.department_id) : null;
      return { ...st, profile, department };
    });
  }

  public getAllDepartments(): Department[] {
    return Array.from(this.departments.values());
  }

  public getAllProgrammes(): Programme[] {
    return Array.from(this.programmes.values());
  }

  public addAuditLog(actorId: string | null, action: string, resourceType: string, resourceId: string | null, metadata?: Record<string, any>) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      actor_id: actorId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    });
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }
}

// Global Singleton
const globalForDb = global as unknown as { __portalDb?: PortalDatabase };
export const portalDb = globalForDb.__portalDb || new PortalDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.__portalDb = portalDb;
