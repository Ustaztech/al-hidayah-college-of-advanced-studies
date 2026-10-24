import { Programme } from '../types';

export const PROGRAMMES_DATA: Programme[] = [
  // IJMB Direct Entry A'Level Programmes (Core Flagship)
  {
    id: 'ijmb-programme',
    title: 'IJMB Direct Entry Programme (A-Level)',
    slug: 'ijmb-direct-entry',
    category: 'IJMB',
    department: 'Interim Joint Matriculation Board Studies',
    duration: '1 Year (2 Semesters / 12 Months Minimum)',
    description: 'Federal government approved A-Level qualification conducted under statute 5 of Ahmadu Bello University (ABU) Law and moderated by JAMB. Provides direct entry (200 Level) admission into Nigerian and foreign universities without JAMB UTME. Operated in collaboration with Sam Ale College of Advanced Studies, FCT Mass Agency for Education, and Department of Higher Education.',
    entryRequirements: [
      'Minimum of five (5) credits at O-Levels (WAEC, NECO, or NABTEB) in not more than two (2) sittings.',
      'Deficiency allowed in either Mathematics for Arts candidates or English for Science candidates (Educationally Less Developed States policy), to be remedied before programme completion.',
      'Registration form fee: ₦10,500.'
    ],
    curriculumHighlights: [
      'Comprehensive 12-month syllabus aligned with university 100-level curriculum',
      'Minimum 6 lecture hours per week per subject',
      'Additional 3 hours of laboratory practical work per week for science subjects',
      'Continuous Assessment (20%) + External JAMB-moderated Examination (80%)',
      'Bonus 1-point awarded for passing all 3 subjects with at least Grade E'
    ],
    careerPathways: [
      'Direct Entry (200 Level) to Medicine & Surgery (MBBS), Dentistry, Nursing, Pharmacy',
      'Direct Entry to Engineering, Computer Science, Law (LL.B), Mass Communication',
      'Direct Entry to Accounting, Economics, Business Administration, Architecture'
    ],
    feeEstimate: '₦154,000 (1st Semester) / ₦105,500 (2nd Semester) — Total: ₦258,500',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'Sam Ale College of Advanced Studies / ABU / FCT Dept of Higher Education'
  },
  {
    id: 'ijmb-science',
    title: 'IJMB Science Subject Combinations',
    slug: 'ijmb-science-stream',
    category: 'IJMB',
    department: 'Interim Joint Matriculation Board Studies',
    duration: '1 Year (2 Semesters)',
    description: 'Intensive preparation for Medicine, Engineering, Computing, Pharmacy, and Applied Sciences. Combinations include Biology, Chemistry, Physics (Code 030), Chemistry, Physics, A/L Maths (Code 043), Biology, Chemistry, A/L Maths (Code 027), and Geography, Physics, A/L Maths (Code 063).',
    entryRequirements: [
      '5 O’Level credits including English Language, Mathematics, Physics, Chemistry, and Biology/Geography in WAEC/NECO/NABTEB.'
    ],
    curriculumHighlights: [
      'Advanced Level Physics, Chemistry, Biology, and A/L Mathematics',
      'Hands-on physical laboratory work (3 hours/week) + JavaLab virtual simulations',
      'C.A. tests, practical experiments, and mid-semester evaluations (20%)'
    ],
    careerPathways: ['Medicine & Surgery (15 pts)', 'Pharmacy (14 pts)', 'Engineering (10 pts)', 'Computer Science (8 pts)'],
    feeEstimate: '₦154,000 (1st Installment) + ₦105,500 (2nd Installment)',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'Sam Ale College of Advanced Studies / ABU Zaria'
  },
  {
    id: 'ijmb-arts-law',
    title: 'IJMB Arts, Law & Social Sciences Combinations',
    slug: 'ijmb-arts-law-stream',
    category: 'IJMB',
    department: 'Interim Joint Matriculation Board Studies',
    duration: '1 Year (2 Semesters)',
    description: 'Premier A-Level stream for Law (LL.B), Mass Communication, Political Science, International Studies, and Economics. Combinations include CRS/Islamic Studies, Government, Literature (Codes 045, 066, 070), Accounting, Economics, Government (Code 011), and Sociology, Literature, History.',
    entryRequirements: [
      '5 O’Level credits including English Language, Mathematics, Literature, Government, or Economics in WAEC/NECO/NABTEB.'
    ],
    curriculumHighlights: [
      'Rigorous essay drafting, legal analysis, political thought, and economic theory',
      'Continuous assessments (20%) and Mock Pre-IJMB examination',
      'Tutorial classes running concurrently with lectures'
    ],
    careerPathways: ['Law LL.B (14 pts)', 'Mass Communication (9 pts)', 'Economics (9 pts)', 'Political Science (9 pts)'],
    feeEstimate: '₦154,000 (1st Installment) + ₦105,500 (2nd Installment)',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'Sam Ale College of Advanced Studies / ABU Zaria'
  },

  // In Affiliation with Citi Polytechnic Abuja - National Diploma (ND)
  {
    id: 'nd-cs',
    title: 'ND Computer Science (Full-Time & Part-Time)',
    slug: 'nd-computer-science',
    category: 'ND',
    department: 'School of Applied Sciences & Information Technology',
    duration: '2 Years (4 Semesters)',
    description: 'Offered in affiliation with Citi Polytechnic Abuja. Comprehensive curriculum covering software engineering, database administration, networking, web development, and digital systems architecture.',
    entryRequirements: [
      '5 O’Level credits including English Language, Mathematics, Physics, and two other science subjects in WAEC/NECO/NABTEB at not more than 2 sittings.',
      'Acceptable JAMB UTME score or polytechnic screening.'
    ],
    curriculumHighlights: [
      'Programming in Python & C++',
      'Database Management Systems (SQL)',
      'Computer Hardware Maintenance & Networking',
      'Web Technologies & Mobile Application Development'
    ],
    careerPathways: ['Software Developer', 'Network Administrator', 'Database Analyst', 'IT Systems Specialist'],
    feeEstimate: 'Full Time: ₦168,500 / Part Time: ₦163,000 (Registration Included)',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'In Affiliation with Citi Polytechnic Abuja'
  },
  {
    id: 'nd-business-admin',
    title: 'ND Business Administration and Management',
    slug: 'nd-business-administration',
    category: 'ND',
    department: 'School of Management Studies',
    duration: '2 Years (4 Semesters)',
    description: 'Offered in affiliation with Citi Polytechnic Abuja. Equips students with foundational business leadership, marketing strategy, operations management, accounting, and entrepreneurship.',
    entryRequirements: [
      '5 O’Level credits including English Language, Mathematics, Economics/Commerce, and two commercial/social science subjects.'
    ],
    curriculumHighlights: [
      'Principles of Management & Business Law',
      'Financial Accounting & Business Statistics',
      'Marketing Management & Organizational Behavior',
      'Small Business Entrepreneurship'
    ],
    careerPathways: ['Business Operations Assistant', 'Administrative Officer', 'Marketing Associate', 'Entrepreneur'],
    feeEstimate: 'Full Time: ₦168,500 / Part Time: ₦148,500 (Registration Included)',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'In Affiliation with Citi Polytechnic Abuja'
  },
  {
    id: 'nd-mass-comm',
    title: 'ND Mass Communication (Full-Time & Part-Time)',
    slug: 'nd-mass-communication',
    category: 'ND',
    department: 'School of Media & Communication Studies',
    duration: '2 Years (4 Semesters)',
    description: 'Offered in affiliation with Citi Polytechnic Abuja. Practical training in broadcast journalism, radio & TV production, news writing, digital media marketing, and public relations.',
    entryRequirements: [
      '5 O’Level credits including English Language, Mathematics, Literature in English, and two Arts/Social Science subjects.'
    ],
    curriculumHighlights: [
      'Print Journalism & Investigative Reporting',
      'Radio & Television Studio Production',
      'Digital Media & Content Strategy',
      'Public Relations & Advertising Fundamentals'
    ],
    careerPathways: ['Broadcast Journalist', 'PR Associate', 'Digital Media Specialist', 'News Editor'],
    feeEstimate: 'Full Time & Part Time: ₦163,000 (Registration Fees Included)',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'In Affiliation with Citi Polytechnic Abuja'
  },
  {
    id: 'nd-electrical-eng',
    title: 'ND Electrical/Electronics Engineering (Elect/Elect)',
    slug: 'nd-electrical-engineering',
    category: 'ND',
    department: 'School of Engineering Technology',
    duration: '2 Years (4 Semesters)',
    description: 'Offered in affiliation with Citi Polytechnic Abuja. Hands-on laboratory training in electrical circuits, telecommunications, digital electronics, instrumentation, and renewable energy.',
    entryRequirements: [
      '5 O’Level credits including Mathematics, English Language, Physics, Chemistry, and any other technical/science subject.'
    ],
    curriculumHighlights: [
      'Electrical Power Systems & Circuit Theory',
      'Analog & Digital Electronic Systems',
      'Telecommunication Principles & Signal Processing',
      'Electrical Workshop Practice & CAD Drafting'
    ],
    careerPathways: ['Electrical Engineer Technician', 'Field Service Specialist', 'Solar/Power Installer', 'Telecoms Tech'],
    feeEstimate: 'Full Time & Part Time: ₦163,000 (Registration Fees Included)',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'In Affiliation with Citi Polytechnic Abuja'
  },

  // Higher National Diploma (HND)
  {
    id: 'hnd-cs',
    title: 'HND Computer Science (Full-Time & Part-Time)',
    slug: 'hnd-computer-science',
    category: 'HND',
    department: 'School of Applied Sciences & Information Technology',
    duration: '2 Years (4 Semesters)',
    description: 'Offered in affiliation with Citi Polytechnic Abuja. Advanced curriculum focusing on cloud architecture, enterprise cybersecurity, artificial intelligence, compiler design, and software engineering.',
    entryRequirements: [
      'National Diploma (ND) in Computer Science at minimum of Lower Credit level.',
      'Proof of mandatory 1-Year Industrial Training (IT) completion (or 2 years for Pass grade).'
    ],
    curriculumHighlights: [
      'Enterprise Software Architecture & Microservices',
      'Cybersecurity, Ethical Hacking & Cryptography',
      'Cloud Computing Infrastructure (AWS/Azure)',
      'Artificial Intelligence & Machine Learning Fundamentals'
    ],
    careerPathways: ['Senior Software Engineer', 'Cloud Systems Architect', 'Cybersecurity Analyst', 'DevOps Engineer'],
    feeEstimate: 'Full Time & Part Time: ₦168,500 (Registration Fees Included)',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'In Affiliation with Citi Polytechnic Abuja'
  },
  {
    id: 'hnd-business-admin',
    title: 'HND Business Administration and Management',
    slug: 'hnd-business-administration',
    category: 'HND',
    department: 'School of Management Studies',
    duration: '2 Years (4 Semesters)',
    description: 'Offered in affiliation with Citi Polytechnic Abuja. Advanced management leadership, corporate strategy, human resource governance, operations research, and financial decision-making.',
    entryRequirements: [
      'ND in Business Administration (minimum Lower Credit) + 1-Year Industrial Training completion.',
      '5 O’Level credits meeting initial ND requirements.'
    ],
    curriculumHighlights: [
      'Corporate Strategy & Policy Formulation',
      'Human Resource Management & Industrial Relations',
      'Quantitative Analysis for Business Decisions',
      'International Business & Trade Finance'
    ],
    careerPathways: ['Senior Business Manager', 'HR Executive', 'Corporate Strategy Consultant', 'Financial Controller'],
    feeEstimate: 'Full Time: ₦168,500 / Part Time: ₦148,500 (Registration Included)',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'In Affiliation with Citi Polytechnic Abuja'
  },
  {
    id: 'hnd-mass-comm',
    title: 'HND Mass Communication (Full-Time & Part-Time)',
    slug: 'hnd-mass-communication',
    category: 'HND',
    department: 'School of Media & Communication Studies',
    duration: '2 Years (4 Semesters)',
    description: 'Offered in affiliation with Citi Polytechnic Abuja. Advanced specializations in investigative journalism, strategic communications, broadcast station management, and digital multimedia production.',
    entryRequirements: [
      'ND in Mass Communication (minimum Lower Credit) + 1-Year IT completion.',
      '5 O’Level credits including English Language and Literature.'
    ],
    curriculumHighlights: [
      'Investigative Journalism & Documentary Film',
      'Strategic Corporate Communications & Crisis PR',
      'Broadcast Station Management & Media Law',
      'Data Journalism & Multimedia Publishing'
    ],
    careerPathways: ['Editor-in-Chief', 'Media Producer', 'Senior PR Consultant', 'Communications Director'],
    feeEstimate: 'Full Time & Part Time: ₦168,500 (Registration Included)',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'In Affiliation with Citi Polytechnic Abuja'
  },
  {
    id: 'hnd-electrical-eng',
    title: 'HND Electrical/Electronics Engineering (Elect/Elect)',
    slug: 'hnd-electrical-engineering',
    category: 'HND',
    department: 'School of Engineering Technology',
    duration: '2 Years (4 Semesters)',
    description: 'Offered in affiliation with Citi Polytechnic Abuja. Advanced power systems analysis, industrial automation, SCADA systems, wireless telecommunications, and high-voltage transmission.',
    entryRequirements: [
      'ND in Electrical/Electronic Engineering (minimum Lower Credit) + 1-Year IT completion.'
    ],
    curriculumHighlights: [
      'Power Systems Protection & High Voltage Engineering',
      'Microprocessor Systems & Industrial Automation',
      'Advanced Control Systems & PLC Programming',
      'Wireless & Satellite Communication Systems'
    ],
    careerPathways: ['Senior Electrical Engineer', 'Automation & Control Specialist', 'Power Systems Consultant'],
    feeEstimate: 'Full Time & Part Time: ₦168,500 (Registration Fees Included)',
    accreditationStatus: 'Fully Accredited',
    affiliation: 'In Affiliation with Citi Polytechnic Abuja'
  },

  // Professional Studies
  {
    id: 'prof-cert-ict',
    title: 'Professional Certification in Cybersecurity & Cloud Computing',
    slug: 'prof-cert-cybersecurity-cloud',
    category: 'Professional',
    department: 'Centre for Continuing Education & Professional Development',
    duration: '3 to 6 Months',
    description: 'Intensive weekend and evening hands-on training for graduates and tech enthusiasts in enterprise security auditing, ethical hacking, cloud migration, and network defense.',
    entryRequirements: ['Open to students, graduates, and working professionals seeking certified tech skills.'],
    curriculumHighlights: [
      'CompTIA Security+ and Cisco CCNA alignment',
      'AWS & Azure Cloud deployment and server management',
      'Penetration testing and incident response workshops'
    ],
    careerPathways: ['SOC Analyst', 'Cloud Support Specialist', 'Network Security Associate'],
    feeEstimate: '₦60,000 / Module',
    accreditationStatus: 'Fully Accredited'
  }
];
