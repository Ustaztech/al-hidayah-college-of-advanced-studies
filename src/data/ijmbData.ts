import { IJMBSubjectCombination, UniversityRequirement, StaffMember } from '../types';

export const INSTITUTION_INFO = {
  name: 'Al-Hidayah College of Advanced Studies',
  shortName: 'AHCAS',
  rcNumber: '8546926',
  documentCode: 'AHC/IJMB/OQAM/2026',
  effectiveDate: 'August 2025',
  reviewCycle: 'Biennial',
  status: 'Academic Board Approved',
  motto: 'Enlightening Minds, Building Futures',
  crestMotto: 'Developing the Best Minds for the Future',
  alternateTagline: 'Enlightening Minds, Building Nations',
  address: 'No. 3, Bungalow, MBS Close, Sabon Tasha Street Phase II, Abaji FCT-Abuja',
  studyCentre: 'JSS Agyana Road Study Centre, Abaji Abuja',
  phone: '08056350078',
  email: 'support@alhidayahcollege.com.ng',
  website: 'https://alhidayahcollege.com.ng',
  securityCodePrefix: 'AHCAS/IJMB/2026/2027',
  formFeeNgn: 10500,
  resultCollectionFeeNgn: 17000,
  collaborations: [
    'Sam Ale College of Advanced Studies',
    'FCT Mass Agency for Education',
    'Department of Higher Education',
    'Ahmadu Bello University (ABU) Coordination Framework'
  ],
  affiliations: [
    'Citi Polytechnic Abuja'
  ]
};

export const TUITION_SCHEDULE = {
  ijmb: {
    firstInstallment: 154000,
    secondInstallment: 105500,
    oneTimePayment: 258500,
    resultCollection: 17000,
    applicationForm: 10500
  },
  citiPolytechnic: [
    {
      programme: 'Business Administration and Management',
      mode: 'Part Time ND/HND',
      fee: 148500,
      notes: 'Registration Fees Included'
    },
    {
      programme: 'Business Administration and Management',
      mode: 'Full Time ND/HND',
      fee: 168500,
      notes: 'Registration Fees Included'
    },
    {
      programme: 'Mass Communication',
      mode: 'Part Time & Full Time ND',
      fee: 163000,
      notes: 'Registration Fees Included'
    },
    {
      programme: 'Mass Communication',
      mode: 'Part Time & Full Time HND',
      fee: 168500,
      notes: 'Registration Included'
    },
    {
      programme: 'Computer Science',
      mode: 'Part Time & Full Time ND',
      fee: 163000,
      notes: 'Registration Fees Included'
    },
    {
      programme: 'Computer Science',
      mode: 'Part Time & Full Time HND',
      fee: 168500,
      notes: 'Registration Fees Included'
    },
    {
      programme: 'Electrical/Electronics Engineering',
      mode: 'Part Time & Full Time ND',
      fee: 163000,
      notes: 'Same as Computer Science'
    },
    {
      programme: 'Electrical/Electronics Engineering',
      mode: 'Part Time & Full Time HND',
      fee: 168500,
      notes: 'Same as Computer Science'
    }
  ]
};

export const REAL_STAFF: StaffMember[] = [
  {
    id: 'staff-01',
    name: 'Dr. Muhammad Baba Suleiman, PhD (Magajin Ilimin Abaji)',
    position: 'Executive Chairman / Director & Founder',
    department: 'Executive Governing Directorate',
    qualification: 'Ph.D, M.Ed, B.Ed (Magajin Ilimin Abaji)',
    bio: 'Accomplished educationist with extensive experience across reputable academic programmes, including NTI Degree, University of Abuja Sandwich Programme, and Iconic Open University Proctor. Founder of AHCAS dedicated to expanding educational access for Abaji youths.',
    photoUrl: '/provost-mbsuleiman.jpg',
    duties: 'Provides strategic vision and overall leadership; ensures compliance with regulatory bodies; oversees finance, operations, partnerships; represents the centre at official engagements.',
    email: 'director@alhidayahcollege.com.ng'
  },
  {
    id: 'staff-02',
    name: 'Mall. Ibrahim Idris Gambo',
    position: 'Centre Coordinator (IJMB Programme)',
    department: 'IJMB Academic Coordination',
    qualification: 'M.Sc, B.Sc (Ed)',
    bio: 'Oversees day-to-day IJMB curriculum implementation, external examination coordination, lecture scheduling, and departmental liaison with affiliated bodies.',
    photoUrl: '/coordinator-ibrahim-gambo.jpg',
    duties: 'Oversees programs and curriculum; coordinates exams and records; supervises departments; liaises with external bodies.',
    email: 'coordinator@alhidayahcollege.com.ng'
  },
  {
    id: 'staff-03',
    name: 'Mall. Usman Saidu',
    position: 'Registrar & Examination Officer',
    department: 'Registry & Examination Records',
    qualification: 'B.Sc, MPA',
    bio: 'Heads candidate registration, verification of O’Level credentials, continuous assessment collation, and examination integrity protocols in accordance with JAMB and IJMB directives.',
    photoUrl: '/registrar-usman-saidu.jpg',
    duties: 'Organizes exams; ensures integrity of processes; maintains records; coordinates student admissions and verification.',
    email: 'registrar@alhidayahcollege.com.ng'
  },
  {
    id: 'staff-04',
    name: 'FCT Dept of Higher Education Liaison',
    position: 'Government Inspection & Regulatory Liaison Officer',
    department: 'FCT Department of Higher Education',
    qualification: 'Senior Higher Education Inspector',
    bio: 'Conducts regular compliance inspections, monitoring quality assurance, institutional readiness, and study centre standards at JSS Agyana Road Study Centre.',
    photoUrl: '/liaison-officer-study-centre.jpg',
    duties: 'Ensures operational compliance with FCT Mass Agency for Education and Department of Higher Education regulations.',
    email: 'liaison@alhidayahcollege.com.ng'
  }
];

export const ACADEMIC_GOVERNANCE_STRUCTURE = [
  {
    position: 'Executive Chairman/CEO',
    incumbent: 'Dr. Muhammad Baba Suleiman, PhD (Magajin Ilimin Abaji)',
    duties: 'Provides strategic vision and overall leadership; ensures compliance with regulatory bodies; oversees finance, operations, partnerships; represents the centre at official engagements.'
  },
  {
    position: 'Centre Administrator',
    incumbent: 'Centre Operations Head',
    duties: 'Manages daily operations; coordinates academic and non-academic units; supervises staff; prepares reports for Proprietor/CEO.'
  },
  {
    position: 'Centre Coordinator',
    incumbent: 'Mall. Ibrahim Idris Gambo',
    duties: 'Oversees programs and curriculum; coordinates exams and records; supervises departments; liaises with external bodies.'
  },
  {
    position: 'Admin Officer',
    incumbent: 'Institutional Secretary',
    duties: 'Handles records and documentation; manages correspondence; supports HR functions.'
  },
  {
    position: 'Bursar',
    incumbent: 'Chief Financial Officer',
    duties: 'Manages finances, budgets, accounting; oversees fee collection; prepares financial reports.'
  },
  {
    position: 'Exam Officer / Registrar',
    incumbent: 'Mall. Usman Saidu',
    duties: 'Organizes exams; ensures integrity of processes; maintains records.'
  },
  {
    position: 'Head of Departments (Science/Arts/Commercial)',
    incumbent: 'Academic Board Appointees',
    duties: 'Coordinates departmental activities; supervises lecturers; monitors students; updates curriculum.'
  },
  {
    position: 'Lecturers / Instructors',
    incumbent: 'Subject Specialists (A-Levels)',
    duties: 'Teach and assess students; prepare lessons; participate in meetings; minimum 6 lecture hours per week.'
  },
  {
    position: 'IT Officer',
    incumbent: 'ICT Infrastructure Lead',
    duties: 'Manages ICT facilities; supports e-learning; ensures data security and digital portal operations.'
  },
  {
    position: 'Library Staff',
    incumbent: 'E-Library Resource Manager',
    duties: 'Maintains library resources; assists users; manages cataloging and Open Educational Resources access.'
  },
  {
    position: 'Secretariat Staff',
    incumbent: 'Registry Clerical Team',
    duties: 'Provides clerical support; manages documents and physical filing systems.'
  },
  {
    position: 'Support Staff',
    incumbent: 'Campus Facility & Security Team',
    duties: 'Ensures cleanliness, hygiene, safety, and security of study facilities.'
  }
];

export const MANDATORY_STUDENT_DOCUMENTS = [
  'Application form',
  'Admission letter',
  'Acceptance letter',
  'O’Level result copy (WAEC/NECO/NABTEB)',
  'NIN Slip or NIN ID Card',
  'Biodata form',
  'Payment evidence (Tuition & Form fees)',
  'Undertaking form',
  'Medical declaration',
  'IJMB registration slip',
  'Passport photographs (4 copies)',
  'State/LGA Indigene Certificate'
];

export const IJMB_SUBJECT_COMBINATIONS: IJMBSubjectCombination[] = [
  { code: '001', subjects: 'O/L English only', possibleCourses: 'Remedial Studies / O-Level Deficiency Rectification' },
  { code: '002', subjects: 'O/L Maths only', possibleCourses: 'Remedial Science' },
  { code: '003', subjects: 'O/L English and Maths', possibleCourses: 'General Remedial Programme' },
  { code: '004', subjects: 'Accounting, Business Management, A/L Maths', possibleCourses: 'Accounting, Business Administration, Public Administration, Banking & Finance, Marketing' },
  { code: '005', subjects: 'Accounting, Business Management, Economics', possibleCourses: 'Accounting, Business Administration, Economics, Public Admin, Banking & Finance, Marketing' },
  { code: '006', subjects: 'Accounting, Business Management, Geography', possibleCourses: 'Accounting, Business Admin, Public Admin, Banking & Finance, Marketing' },
  { code: '007', subjects: 'Accounting, Business Management, Government', possibleCourses: 'Accounting, Business Admin, Public Admin, Business Education, Marketing' },
  { code: '008', subjects: 'Accounting, Business Management, Sociology', possibleCourses: 'Accounting, Business Admin, Sociology, Public Admin, Banking & Finance, Marketing' },
  { code: '009', subjects: 'Accounting, Economics, Geography', possibleCourses: 'Accounting, Business Admin, Economics, Public Admin, Banking & Finance, Marketing, Urban & Regional Planning' },
  { code: '011', subjects: 'Accounting, Economics, Government', possibleCourses: 'Accounting, Business Admin, Economics, Banking & Finance, Marketing, Mass Communication' },
  { code: '012', subjects: 'Accounting, Economics, Sociology', possibleCourses: 'Accounting, Business Admin, Economics, Sociology, Public Admin, Banking & Finance' },
  { code: '013', subjects: 'Accounting, Geography, A/L Maths', possibleCourses: 'Accounting, Business Admin, Geography, Public Admin, Banking & Finance, Marketing, Urban & Regional Planning' },
  { code: '014', subjects: 'Accounting, Geography, Government', possibleCourses: 'Accounting, Business Admin, Geography, Public Admin, Banking & Finance, Marketing' },
  { code: '015', subjects: 'Accounting, Geography, Sociology', possibleCourses: 'Accounting, Business Admin, Sociology, Mass Communication, Public Admin, Banking & Finance, Marketing' },
  { code: '016', subjects: 'Accounting, Government, A/L Maths', possibleCourses: 'Accounting, Business Admin, Public Admin, Banking & Finance, Marketing' },
  { code: '017', subjects: 'Accounting, Government, Sociology', possibleCourses: 'Accounting, Business Admin, Sociology, Political Science, International Studies, Public Admin, Mass Comm, Banking & Finance' },
  { code: '020', subjects: 'Arabic, Government, Hausa', possibleCourses: 'Political Science, International Studies, Mass Communication, Single Honours' },
  { code: '021', subjects: 'Arabic, Government, Islamic Studies', possibleCourses: 'Political Science, International Studies, Mass Communication, Single Honours' },
  { code: '022', subjects: 'Arabic, Hausa, History', possibleCourses: 'Archaeology (ABU), Mass Communication, Political Science, International Studies, Single Honours' },
  { code: '023', subjects: 'Arabic, Hausa, Islamic Studies', possibleCourses: 'Arabic / Islamic Studies Single Honours' },
  { code: '024', subjects: 'Arabic, Hausa, Literature', possibleCourses: 'Law, Single Honours' },
  { code: '025', subjects: 'Arabic, History, Islamic Studies', possibleCourses: 'Law, Political Science, International Studies, Archaeology, Single Honours' },
  { code: '026', subjects: 'Arabic, History, Literature', possibleCourses: 'Single Honours, Law, Mass Communication, Political Science, International Studies, Archaeology' },
  { code: '027', subjects: 'Biology, Chemistry, A/L Maths', possibleCourses: 'Medicine & Surgery, Veterinary Medicine, Pharmacy, Biochemistry, Microbiology, Agricultural Science, Textile Science, Single Honours' },
  { code: '028', subjects: 'Biology, Chemistry, Geography', possibleCourses: 'Agricultural Science, Archaeology, Biochemistry, Microbiology, Physiology' },
  { code: '029', subjects: 'Biology, Chemistry, Geology', possibleCourses: 'Single Honours, Biochemistry, Microbiology, Textile Science, Physiology, Agricultural Science, Archaeology' },
  { code: '030', subjects: 'Biology, Chemistry, Physics', possibleCourses: 'Medicine & Surgery (MBBS), Dentistry, Nursing Science, Veterinary Medicine, Pharmacy, Medical Laboratory Science, Agricultural Sciences, Engineering, Textile Science & Tech, Biochemistry, Geophysics' },
  { code: '031', subjects: 'Business Management, Economics, A/L Maths', possibleCourses: 'Business Administration, Economics, Accounting, Urban & Regional Planning, Banking & Finance, Marketing' },
  { code: '032', subjects: 'Business Management, Economics, Geography', possibleCourses: 'Business Administration, Economics, Accounting, Urban & Regional Planning, Banking & Finance, Marketing' },
  { code: '033', subjects: 'Business Management, Economics, Government', possibleCourses: 'Business Admin, Political Science, International Studies, Public Admin, Economics, Mass Comm, Accounting, Banking & Finance' },
  { code: '034', subjects: 'Business Management, Economics, Sociology', possibleCourses: 'Business Admin, Accounting, Public Admin, Banking & Finance' },
  { code: '035', subjects: 'Business Management, Geography, A/L Maths', possibleCourses: 'Business Admin, Environmental Science, Accounting, Public Admin, Banking & Finance, Marketing' },
  { code: '036', subjects: 'Business Management, Geography, Government', possibleCourses: 'Public Admin, Business Admin, Accounting, Banking & Finance, Marketing' },
  { code: '037', subjects: 'Business Management, Geography, Sociology', possibleCourses: 'Business Admin, Sociology, Marketing, Accounting, Banking & Finance, Public Admin' },
  { code: '038', subjects: 'Business Management, Government, Sociology', possibleCourses: 'Business Admin, Public Admin, Sociology, Political Science, International Studies, Marketing, Accounting' },
  { code: '039', subjects: 'Chemistry, Geography, A/L Maths', possibleCourses: 'Environmental Science, Engineering, Archaeology, Agricultural Science, Textile Science' },
  { code: '040', subjects: 'Chemistry, Geography, Physics', possibleCourses: 'Environmental Science, Engineering, Archaeology, Agricultural Science, Textile Science' },
  { code: '041', subjects: 'Chemistry, Geology, A/L Maths', possibleCourses: 'Environmental Science, Engineering, Agricultural Science, Archaeology, Textile Science' },
  { code: '042', subjects: 'Chemistry, Geology, Physics', possibleCourses: 'Environmental Science, Engineering, Archaeology, Agricultural Science, Textile Science, Single Honours' },
  { code: '043', subjects: 'Chemistry, Physics, A/L Maths', possibleCourses: 'Engineering, Computer Science, Computer Engineering, Textile Science, Environmental Science, Agricultural Science, Geophysics' },
  { code: '044', subjects: 'Christian Religious Studies, Government, Hausa', possibleCourses: 'Single Honours, Political Science, International Studies, Public Admin, Mass Communication' },
  { code: '045', subjects: 'Christian Religious Studies, Government, Literature', possibleCourses: 'Single Honours, Law (LL.B), Public Admin, Political Science, International Studies, Mass Comm' },
  { code: '046', subjects: 'Christian Religious Studies, Hausa, History', possibleCourses: 'Single Honours, Political Science, Public Admin, International Studies, Archaeology (ABU), Mass Comm' },
  { code: '047', subjects: 'Christian Religious Studies, Hausa, Literature', possibleCourses: 'Single Honours, Law (LL.B)' },
  { code: '048', subjects: 'Christian Religious Studies, History, Literature', possibleCourses: 'Single Honours, Law (LL.B), Mass Communication, Political Science, International Studies' },
  { code: '049', subjects: 'Economics, Geography, A/L Maths', possibleCourses: 'Environmental Science, Urban & Regional Planning, Single Honours, Accounting, Banking & Finance, Public Admin, Marketing' },
  { code: '050', subjects: 'Economics, Geography, Government', possibleCourses: 'Urban & Regional Planning, Accounting, Public Admin, Banking & Finance, Marketing, Mass Comm, Single Honours' },
  { code: '051', subjects: 'Economics, Geography, Sociology', possibleCourses: 'Urban & Regional Planning, Single Honours, Accounting, Public Admin, Banking & Finance' },
  { code: '052', subjects: 'Economics, Government, A/L Maths', possibleCourses: 'Public Admin, Political Science, International Studies, Economics, Mass Comm, Accounting, Banking & Finance, Single Honours' },
  { code: '053', subjects: 'Economics, Government, Sociology', possibleCourses: 'Economics, Political Science, International Studies, Public Admin, Sociology, Mass Comm, Accounting, Banking & Finance' },
  { code: '060', subjects: 'Geography, Government, A/L Maths', possibleCourses: 'Environmental Science, Political Science, International Studies, Geography, Public Admin' },
  { code: '061', subjects: 'Geography, Government, Sociology', possibleCourses: 'Urban & Regional Planning, Sociology, Public Admin, Political Science, Geography, International Studies' },
  { code: '062', subjects: 'Geography, History, Sociology', possibleCourses: 'Single Honours, Political Science, International Studies, Public Admin, Sociology' },
  { code: '063', subjects: 'Geography, Physics, A/L Maths', possibleCourses: 'Single Honours, Environmental Science, Engineering (Except Chemical), Computer Science, Quantity Surveying, Geophysics' },
  { code: '064', subjects: 'Geology, Physics, A/L Maths', possibleCourses: 'Single Honours, Environmental Science, Engineering, Archaeology (Ibadan), Computer Science, Geophysics' },
  { code: '065', subjects: 'Government, Hausa, Islamic Studies', possibleCourses: 'Single Honours, Public Admin, Political Science, International Studies' },
  { code: '066', subjects: 'Government, Islamic Studies, Literature', possibleCourses: 'Single Honours, Public Admin, Political Science, International Studies, Law (LL.B), Archaeology, Mass Comm' },
  { code: '067', subjects: 'Hausa, History, Literature', possibleCourses: 'Single Honours, Law (LL.B), Mass Comm, Linguistics' },
  { code: '068', subjects: 'Hausa, Islamic Studies, History', possibleCourses: 'Single Honours, Public Admin, Political Science, International Studies' },
  { code: '069', subjects: 'Hausa, Islamic Studies, Literature', possibleCourses: 'Single Honours, Law (LL.B), Arabic/Islamic Law' },
  { code: '070', subjects: 'History, Islamic Studies, Literature', possibleCourses: 'Single Honours, International Studies, Public Admin, Political Science, Mass Comm, Law, Archaeology' },
  { code: '071', subjects: 'Sociology, Arabic, Literature', possibleCourses: 'Single Honours, Law (LL.B), Mass Communication' },
  { code: '073', subjects: 'Sociology, Hausa, Literature', possibleCourses: 'Single Honours, Law (LL.B), Mass Communication' }
];

export const UNIVERSITY_CUTOFF_POINTS: UniversityRequirement[] = [
  // Medical & Health Sciences
  { faculty: 'Medical & Health Sciences', course: 'Medicine & Surgery (MBBS)', points: 15 },
  { faculty: 'Medical & Health Sciences', course: 'Dentistry', points: 15 },
  { faculty: 'Medical & Health Sciences', course: 'Nursing Science', points: 14 },
  { faculty: 'Medical & Health Sciences', course: 'Pharmacy', points: 14 },
  { faculty: 'Medical & Health Sciences', course: 'Medical Laboratory Science', points: 13 },
  { faculty: 'Medical & Health Sciences', course: 'Physiotherapy', points: 12 },
  { faculty: 'Medical & Health Sciences', course: 'Optometry', points: 12 },
  { faculty: 'Medical & Health Sciences', course: 'Anatomy', points: 11 },
  { faculty: 'Medical & Health Sciences', course: 'Physiology', points: 11 },
  { faculty: 'Medical & Health Sciences', course: 'Human Nutrition & Dietetics', points: 10 },
  { faculty: 'Medical & Health Sciences', course: 'Public Health', points: 9 },

  // Faculty of Science
  { faculty: 'Faculty of Science', course: 'Biochemistry', points: 8 },
  { faculty: 'Faculty of Science', course: 'Microbiology', points: 8 },
  { faculty: 'Faculty of Science', course: 'Biology', points: 8 },
  { faculty: 'Faculty of Science', course: 'Physics', points: 8 },
  { faculty: 'Faculty of Science', course: 'Mathematics', points: 8 },
  { faculty: 'Faculty of Science', course: 'Computer Science', points: 8 },
  { faculty: 'Faculty of Science', course: 'Geology', points: 8 },
  { faculty: 'Faculty of Science', course: 'Botany', points: 8 },
  { faculty: 'Faculty of Science', course: 'Zoology', points: 8 },
  { faculty: 'Faculty of Science', course: 'Chemistry', points: 8 },
  { faculty: 'Faculty of Science', course: 'Marine Biology', points: 8 },
  { faculty: 'Faculty of Science', course: 'Statistics', points: 8 },

  // Engineering & Technology
  { faculty: 'Engineering & Technology', course: 'Mechanical Engineering', points: 10 },
  { faculty: 'Engineering & Technology', course: 'Electrical & Electronics Engineering', points: 10 },
  { faculty: 'Engineering & Technology', course: 'Civil Engineering', points: 10 },
  { faculty: 'Engineering & Technology', course: 'Petroleum Engineering', points: 10 },
  { faculty: 'Engineering & Technology', course: 'Chemical Engineering', points: 10 },
  { faculty: 'Engineering & Technology', course: 'Computer Engineering', points: 10 },
  { faculty: 'Engineering & Technology', course: 'Mechatronics Engineering', points: 10 },
  { faculty: 'Engineering & Technology', course: 'Aerospace Engineering', points: 10 },
  { faculty: 'Engineering & Technology', course: 'Industrial Engineering', points: 10 },
  { faculty: 'Engineering & Technology', course: 'Metallurgical & Materials Engineering', points: 10 },

  // Faculty of Agriculture
  { faculty: 'Faculty of Agriculture', course: 'Agricultural Science', points: 7 },
  { faculty: 'Faculty of Agriculture', course: 'Agricultural Engineering', points: 7 },
  { faculty: 'Faculty of Agriculture', course: 'Crop Science', points: 7 },
  { faculty: 'Faculty of Agriculture', course: 'Animal Science', points: 7 },
  { faculty: 'Faculty of Agriculture', course: 'Fisheries & Aquaculture', points: 7 },
  { faculty: 'Faculty of Agriculture', course: 'Forestry & Wildlife', points: 7 },
  { faculty: 'Faculty of Agriculture', course: 'Soil Science', points: 7 },
  { faculty: 'Faculty of Agriculture', course: 'Agronomy', points: 7 },
  { faculty: 'Faculty of Agriculture', course: 'Food Science & Technology', points: 7 },
  { faculty: 'Faculty of Agriculture', course: 'Agricultural Economics', points: 7 },

  // Management & Administration
  { faculty: 'Management & Administration', course: 'Business Administration', points: 9 },
  { faculty: 'Management & Administration', course: 'Accounting', points: 9 },
  { faculty: 'Management & Administration', course: 'Banking & Finance', points: 9 },
  { faculty: 'Management & Administration', course: 'Economics', points: 9 },
  { faculty: 'Management & Administration', course: 'Marketing', points: 8 },
  { faculty: 'Management & Administration', course: 'Human Resource Management', points: 8 },
  { faculty: 'Management & Administration', course: 'Public Administration', points: 9 },
  { faculty: 'Management & Administration', course: 'Entrepreneurship', points: 7 },
  { faculty: 'Management & Administration', course: 'Procurement & Supply Chain Management', points: 7 },

  // Faculty of Law
  { faculty: 'Faculty of Law', course: 'Law (LL.B)', points: 14 },
  { faculty: 'Faculty of Law', course: 'Islamic Law / Sharia Law', points: 11 },
  { faculty: 'Faculty of Law', course: 'International Law', points: 12 },
  { faculty: 'Faculty of Law', course: 'Criminal Law', points: 12 },
  { faculty: 'Faculty of Law', course: 'Property Law', points: 12 },

  // Arts & Humanities
  { faculty: 'Arts & Humanities', course: 'English Language', points: 10 },
  { faculty: 'Arts & Humanities', course: 'Linguistics', points: 9 },
  { faculty: 'Arts & Humanities', course: 'History & International Studies', points: 9 },
  { faculty: 'Arts & Humanities', course: 'Theatre Arts', points: 8 },
  { faculty: 'Arts & Humanities', course: 'Fine & Applied Arts', points: 8 },
  { faculty: 'Arts & Humanities', course: 'Mass Communication', points: 9 },
  { faculty: 'Arts & Humanities', course: 'French', points: 7 },
  { faculty: 'Arts & Humanities', course: 'Philosophy', points: 7 },
  { faculty: 'Arts & Humanities', course: 'Religious Studies', points: 7 },
  { faculty: 'Arts & Humanities', course: 'Film & Media Studies', points: 8 },

  // Faculty of Education
  { faculty: 'Faculty of Education', course: 'Education & English', points: 6 },
  { faculty: 'Faculty of Education', course: 'Education & Mathematics', points: 6 },
  { faculty: 'Faculty of Education', course: 'Education & Biology', points: 6 },
  { faculty: 'Faculty of Education', course: 'Education & Physics', points: 6 },
  { faculty: 'Faculty of Education', course: 'Educational Psychology', points: 6 },
  { faculty: 'Faculty of Education', course: 'Early Childhood Education', points: 6 },
  { faculty: 'Faculty of Education', course: 'Guidance & Counselling', points: 6 },
  { faculty: 'Faculty of Education', course: 'Curriculum Studies', points: 6 },
  { faculty: 'Faculty of Education', course: 'Physical & Health Education', points: 6 },

  // Faculty of Social Sciences
  { faculty: 'Faculty of Social Sciences', course: 'Sociology', points: 8 },
  { faculty: 'Faculty of Social Sciences', course: 'Psychology', points: 8 },
  { faculty: 'Faculty of Social Sciences', course: 'Political Science', points: 9 },
  { faculty: 'Faculty of Social Sciences', course: 'International Relations', points: 8 },
  { faculty: 'Faculty of Social Sciences', course: 'Criminology & Security Studies', points: 8 },
  { faculty: 'Faculty of Social Sciences', course: 'Demography & Social Statistics', points: 8 },
  { faculty: 'Faculty of Social Sciences', course: 'Geography', points: 8 },
  { faculty: 'Faculty of Social Sciences', course: 'Social Work', points: 7 },

  // Environmental Sciences
  { faculty: 'Environmental Sciences', course: 'Architecture', points: 8 },
  { faculty: 'Environmental Sciences', course: 'Urban & Regional Planning', points: 8 },
  { faculty: 'Environmental Sciences', course: 'Building Technology', points: 8 },
  { faculty: 'Environmental Sciences', course: 'Quantity Surveying', points: 8 },
  { faculty: 'Environmental Sciences', course: 'Environmental Management', points: 8 },
  { faculty: 'Environmental Sciences', course: 'Industrial Design', points: 8 },
  { faculty: 'Environmental Sciences', course: 'Estate Management', points: 8 },

  // Information & Communication Technology (ICT)
  { faculty: 'ICT', course: 'Information Technology', points: 8 },
  { faculty: 'ICT', course: 'Software Engineering', points: 8 },
  { faculty: 'ICT', course: 'Cyber Security', points: 8 },
  { faculty: 'ICT', course: 'Information Systems', points: 8 },
  { faculty: 'ICT', course: 'Artificial Intelligence', points: 8 }
];

export const GRADING_SCALE = [
  { markRange: '70% and above', letterGrade: 'A', points: 5, interpretation: 'Excellent' },
  { markRange: '60% - 69%', letterGrade: 'B', points: 4, interpretation: 'Very Good' },
  { markRange: '50% - 59%', letterGrade: 'C', points: 3, interpretation: 'Good' },
  { markRange: '45% - 49%', letterGrade: 'D', points: 2, interpretation: 'Merit' },
  { markRange: '40% - 44%', letterGrade: 'E', points: 1, interpretation: 'Pass' },
  { markRange: '0% - 39%', letterGrade: 'F', points: 0, interpretation: 'Fail' }
];

export const ELIBRARY_RESOURCES = {
  oer: [
    { title: 'College Open Textbooks', url: 'https://collegeopentextbooks.org/', category: 'Open Textbooks', desc: 'Peer-reviewed open textbooks across sciences and humanities.' },
    { title: 'FreeTechBooks', url: 'https://www.freetechbooks.com/', category: 'Computer Science & Tech', desc: 'Free online computer science, engineering, and programming books.' },
    { title: 'OpenStax', url: 'https://openstax.org/', category: 'College Textbooks', desc: 'High-quality peer-reviewed textbooks for college physics, biology, chemistry.' },
    { title: 'Project Gutenberg', url: 'https://www.gutenberg.org/', category: 'Literature & Classic Works', desc: 'Over 70,000 free eBooks of classic world literature.' },
    { title: 'Khan Academy', url: 'https://www.khanacademy.org/', category: 'Interactive Learning', desc: 'World-class interactive video lessons in math, chemistry, biology, and economics.' },
    { title: 'Open Culture', url: 'https://www.openculture.com/', category: 'Audiobooks & Courses', desc: 'Free cultural & educational media from top global universities.' },
    { title: 'OER Commons', url: 'https://oercommons.org/', category: 'Open Educational Resources', desc: 'Public digital library of open educational curriculum modules.' },
    { title: 'Open Textbook Library (UMN)', url: 'https://open.umn.edu/opentextbooks/', category: 'Higher Education Textbooks', desc: 'Open textbooks used by leading higher educational institutions.' },
    { title: 'Open UMN Nursing Textbooks', url: 'https://open.umn.edu/opentextbooks/textbooks?q=Nursing&commit=Go', category: 'Department of Nursing', desc: 'Specialized nursing science, anatomy, pharmacology, and patient care textbooks.' },
    { title: 'Project Gutenberg Categories', url: 'https://www.gutenberg.org/ebooks/categories', category: 'All Collection Library', desc: 'Complete catalog of free electronic books by discipline and topic.' }
  ],
  researchDatabases: [
    { title: 'Open UMN Nutrition Database', url: 'https://open.umn.edu/opentextbooks/subjects/nutrition', desc: 'Human nutrition, dietetics, biochemistry, and clinical health.' },
    { title: 'JSTOR Journals & Books', url: 'https://www.jstor.org/action/showJournals?contentType=books&letter=0-9', desc: 'Premier digital library for academic journals and research books.' },
    { title: 'Scopus Sources Browser', url: 'https://www.scopus.com/sources.uri?zone=TopNavBar&origin=sbrowse', desc: 'Abstract and citation database of peer-reviewed literature.' },
    { title: 'EBSCO Course Resource Center', url: 'https://connect.ebsco.com/s/all-courses?language=en_US', desc: 'Curriculum-aligned higher education resource bank.' }
  ],
  eJournals: [
    { title: 'Research4Life Portal', url: 'https://login.research4life.org/tacgw/login.cshtml', desc: 'Health, agriculture, environment, law, and development journals.' },
    { title: 'Nigerian Virtual Library', url: 'https://www.nigerianvirtuallibrary.com/', desc: 'National Universities Commission institutional repository.' },
    { title: 'Khan Academy Resources', url: 'https://www.khanacademy.org/', desc: 'Structured self-paced academic explanations.' },
    { title: 'JSTOR Academic Library', url: 'https://www.jstor.org/', desc: 'Leading academic journal publication archive.' },
    { title: 'Directory of Open Access Journals (DOAJ)', url: 'https://doaj.org/', desc: 'High quality, peer-reviewed open access journals.' },
    { title: 'ScienceDirect', url: 'https://www.sciencedirect.com/', desc: 'Peer-reviewed physical sciences and engineering journals.' },
    { title: 'SAGE Publishing Africa', url: 'https://uk.sagepub.com/en-gb/afr/home', desc: 'Social science and humanities research papers.' },
    { title: 'EBSCOhost Research Platform', url: 'http://search.ebscohost.com/', desc: 'Comprehensive multidisciplinary journal database.' },
    { title: 'Law Pavilion Plus', url: 'http://www.lawpavilionplus.com/', desc: 'Comprehensive Nigerian legal jurisprudence, judgments, and law reports.' },
    { title: 'National Academies Press', url: 'https://www.nationalacademies.org/publications/all', desc: 'Authoritative reports on science, engineering, and medicine.' },
    { title: 'SpringerLink Journals', url: 'https://link.springer.com/brands/springer', desc: 'Scientific, technical, and medical publications.' },
    { title: 'Project MUSE', url: 'https://muse.jhu.edu/', desc: 'Digital humanities and social science literature.' }
  ],
  pastQuestions: [
    { title: 'IJMBE 1st Semester Past Questions', url: 'https://ijmbe.org/1semesterpq.php', desc: 'Official examination papers for semester one A-Level topics.' },
    { title: 'Donzico Exam Center IJMB Revision', url: 'https://donzicoexamcenter.wordpress.com/category/ijmb-runz/', desc: 'Structured past revision questions and marking guidelines.' },
    { title: 'IJMB National Past Questions Archive', url: 'https://ijmb.com.ng/ijmb-past-questions/', desc: 'Complete compendium of past exam papers from previous examination diets.' }
  ]
};

export const ELABORATORY_INFO = {
  title: 'JavaLab Interactive Virtual Laboratory',
  url: 'https://javalab.org/en/',
  description: 'Interactive STEM simulations for physics mechanics, chemical molecular interactions, biological cell dynamics, and electrical circuits. Designed to complement mandatory 3 hours/week physical laboratory work as detailed in the Operations Manual.',
  features: [
    'Virtual Physics: Mechanics, Optics, Electromagnetism, Thermodynamics',
    'Virtual Chemistry: Periodic Table, Chemical Bonding, Acid-Base Titration',
    'Virtual Biology: Genetics, Cell Division, Photosynthesis simulations',
    'Virtual Earth Science: Astronomy, Plate Tectonics, Weather Systems'
  ]
};
