import { CBTQuestion } from '../types';

export interface CBTSubject {
  code: string;
  name: string;
  faculty: 'Sciences' | 'Arts & Humanities' | 'Social Sciences & Management';
  icon: string;
  questionCount: number;
  durationMinutes: number;
}

export const CBT_SUBJECTS: CBTSubject[] = [
  { code: 'IJMB-BIO', name: 'Biology (A-Level)', faculty: 'Sciences', icon: 'Dna', questionCount: 10, durationMinutes: 20 },
  { code: 'IJMB-CHEM', name: 'Chemistry (A-Level)', faculty: 'Sciences', icon: 'FlaskConical', questionCount: 10, durationMinutes: 20 },
  { code: 'IJMB-PHY', name: 'Physics (A-Level)', faculty: 'Sciences', icon: 'Atom', questionCount: 10, durationMinutes: 20 },
  { code: 'IJMB-MTH', name: 'Mathematics (A-Level)', faculty: 'Sciences', icon: 'Binary', questionCount: 10, durationMinutes: 25 },
  { code: 'IJMB-GOV', name: 'Government & Politics', faculty: 'Social Sciences & Management', icon: 'Landmark', questionCount: 10, durationMinutes: 20 },
  { code: 'IJMB-ECO', name: 'Economics (A-Level)', faculty: 'Social Sciences & Management', icon: 'TrendingUp', questionCount: 10, durationMinutes: 20 },
  { code: 'IJMB-ACC', name: 'Financial Accounting', faculty: 'Social Sciences & Management', icon: 'Calculator', questionCount: 8, durationMinutes: 20 },
  { code: 'IJMB-LIT', name: 'Literature in English', faculty: 'Arts & Humanities', icon: 'BookOpen', questionCount: 8, durationMinutes: 20 },
  { code: 'IJMB-IRS', name: 'Islamic Religious Studies', faculty: 'Arts & Humanities', icon: 'ScrollText', questionCount: 8, durationMinutes: 20 },
  { code: 'IJMB-CRS', name: 'Christian Religious Studies', faculty: 'Arts & Humanities', icon: 'Cross', questionCount: 8, durationMinutes: 20 },
];

export const EXPANDED_CBT_QUESTIONS: CBTQuestion[] = [
  // ==========================================
  // BIOLOGY (IJMB-BIO)
  // ==========================================
  {
    id: 'bio-01',
    course_code: 'IJMB-BIO',
    question: 'Which of the following cellular organelles is the primary site of aerobic ATP synthesis in eukaryotic cells?',
    options: ['Ribosome', 'Mitochondrion', 'Golgi apparatus', 'Endoplasmic reticulum'],
    correct_option: 1,
    explanation: 'The mitochondrion generates over 90% of cellular adenosine triphosphate (ATP) via the Krebs cycle and oxidative phosphorylation across its inner cristae membrane.'
  },
  {
    id: 'bio-02',
    course_code: 'IJMB-BIO',
    question: 'In Mendelian genetics, a dihybrid cross between two heterozygous individuals (AaBb x AaBb) produces a phenotypic ratio of:',
    options: ['3:1', '9:3:3:1', '1:2:1', '12:3:1'],
    correct_option: 1,
    explanation: 'Independent assortment of two unlinked gene pairs in heterozygous parents yields the classic 9:3:3:1 phenotypic distribution in the F2 generation.'
  },
  {
    id: 'bio-03',
    course_code: 'IJMB-BIO',
    question: 'During which phase of meiosis does crossing over (genetic recombination) occur?',
    options: ['Prophase I (Pachytene)', 'Metaphase II', 'Anaphase I', 'Telophase I'],
    correct_option: 0,
    explanation: 'Synapsis and non-sister chromatid exchange (chiasmata formation) occur during the pachytene substage of Prophase I in meiosis.'
  },
  {
    id: 'bio-04',
    course_code: 'IJMB-BIO',
    question: 'Which of the following blood vessels carries oxygen-rich blood from the lungs directly into the left atrium of the human heart?',
    options: ['Pulmonary artery', 'Pulmonary vein', 'Superior vena cava', 'Coronary artery'],
    correct_option: 1,
    explanation: 'Unlike most veins, pulmonary veins are unique in transporting freshly oxygenated blood from the pulmonary capillaries to the left atrium.'
  },
  {
    id: 'bio-05',
    course_code: 'IJMB-BIO',
    question: 'The hormone responsible for promoting apical dominance by suppressing lateral bud outgrowth in angiosperms is:',
    options: ['Gibberellin', 'Cytokinin', 'Auxin (Indole-3-acetic acid)', 'Abscisic acid'],
    correct_option: 2,
    explanation: 'Auxins synthesized in the apical shoot meristem diffuse downward (polar transport) and inhibit the proliferation of axillary buds.'
  },
  {
    id: 'bio-06',
    course_code: 'IJMB-BIO',
    question: 'In the human nephron, the process of ultrafiltration occurs specifically across the:',
    options: ['Loop of Henle', 'Glomerulus and Bowman capsule', 'Distal convoluted tubule', 'Collecting duct'],
    correct_option: 1,
    explanation: 'High hydrostatic blood pressure in the glomerular capillaries forces fluid through the podocyte fenestrations into the Bowman lumen.'
  },
  {
    id: 'bio-07',
    course_code: 'IJMB-BIO',
    question: 'Which of the following nitrogenous wastes requires the greatest volume of water for its physiological excretion?',
    options: ['Uric acid', 'Urea', 'Ammonia', 'Creatinine'],
    correct_option: 2,
    explanation: 'Ammonia is highly toxic and soluble, necessitating abundant water for safe excretion (ammonotelic organisms like freshwater fish).'
  },
  {
    id: 'bio-08',
    course_code: 'IJMB-BIO',
    question: 'The primary light-absorbing pigment complex located in photosystem II during the light-dependent reactions of photosynthesis is:',
    options: ['Carotenoid', 'Chlorophyll a (P680)', 'Chlorophyll b', 'Phycobilin'],
    correct_option: 1,
    explanation: 'Chlorophyll a P680 reaction center initiates photolysis of water upon photon absorption at 680 nm wavelength.'
  },
  {
    id: 'bio-09',
    course_code: 'IJMB-BIO',
    question: 'Which bacterial pathogen is the causative agent of bovine and human tuberculosis?',
    options: ['Streptococcus pneumoniae', 'Mycobacterium tuberculosis', 'Salmonella typhi', 'Clostridium tetani'],
    correct_option: 1,
    explanation: 'Mycobacterium tuberculosis is an acid-fast bacillus characterized by mycolic acid in its cell wall.'
  },
  {
    id: 'bio-10',
    course_code: 'IJMB-BIO',
    question: 'In ecological succession, the first group of organisms to colonize a previously bare rock substrate are designated as:',
    options: ['Climax community', 'Pioneer species (Lichens/Mosses)', 'Secondary consumers', 'Detritivores'],
    correct_option: 1,
    explanation: 'Crustose lichens secrete organic acids that break down parent rock minerals, initiating primary pedagogical succession.'
  },

  // ==========================================
  // CHEMISTRY (IJMB-CHEM)
  // ==========================================
  {
    id: 'chm-01',
    course_code: 'IJMB-CHEM',
    question: 'According to Le Chatelier’s principle, what happens to an exothermic reaction system when the temperature is increased?',
    options: ['Equilibrium shifts to the right', 'Equilibrium shifts to the left', 'No change occurs', 'Rate constant drops to zero'],
    correct_option: 1,
    explanation: 'Since heat is a product in exothermic reactions (ΔH < 0), adding thermal energy drives the equilibrium toward the endothermic reactant side.'
  },
  {
    id: 'chm-02',
    course_code: 'IJMB-CHEM',
    question: 'What is the hybridization state of the central carbon atom in benzene (C6H6)?',
    options: ['sp', 'sp2', 'sp3', 'sp3d'],
    correct_option: 1,
    explanation: 'Each aromatic carbon atom in benzene forms three planar σ bonds at 120° angles and participates in a delocalized π molecular orbital (sp2).'
  },
  {
    id: 'chm-03',
    course_code: 'IJMB-CHEM',
    question: 'Determine the oxidation number of manganese in the permanganate ion (MnO4^-):',
    options: ['+4', '+6', '+7', '+2'],
    correct_option: 2,
    explanation: 'Mn + 4(-2) = -1 => Mn - 8 = -1 => Mn = +7.'
  },
  {
    id: 'chm-04',
    course_code: 'IJMB-CHEM',
    question: 'Which quantum number determines the three-dimensional spatial orientation of an atomic orbital?',
    options: ['Principal (n)', 'Azimuthal (l)', 'Magnetic (ml)', 'Spin (ms)'],
    correct_option: 2,
    explanation: 'The magnetic quantum number (ml) ranges from -l to +l and specifies the spatial direction/orientation of the orbital.'
  },
  {
    id: 'chm-05',
    course_code: 'IJMB-CHEM',
    question: 'Calculate the pH of a 0.001 M solution of strong hydrochloric acid (HCl) at 25°C:',
    options: ['1.0', '2.0', '3.0', '4.0'],
    correct_option: 2,
    explanation: 'HCl fully dissociates so [H+] = 10^-3 M. pH = -log10(10^-3) = 3.0.'
  },
  {
    id: 'chm-06',
    course_code: 'IJMB-CHEM',
    question: 'Which of the following organic functional groups yields a silver mirror precipitate with Tollens reagent [Ag(NH3)2]+?',
    options: ['Ketone', 'Aldehyde', 'Tertiary alcohol', 'Carboxylic acid'],
    correct_option: 1,
    explanation: 'Aldehydes possess a readily oxidizable carbonyl hydrogen that reduces silver(I) ions to elemental metallic silver.'
  },
  {
    id: 'chm-07',
    course_code: 'IJMB-CHEM',
    question: 'In accordance with Hess’s Law, the total enthalpy change of a chemical reaction depends solely on:',
    options: ['The pathway taken', 'The presence of a catalyst', 'Initial and final states of the reactants and products', 'Activation energy'],
    correct_option: 2,
    explanation: 'Enthalpy is a state function; hence ΔH is independent of the mechanistic route or intermediate steps.'
  },
  {
    id: 'chm-08',
    course_code: 'IJMB-CHEM',
    question: 'How many Faraday of electric charge are required to deposit 1 mole of aluminum metal from molten Al2O3?',
    options: ['1 F', '2 F', '3 F', '6 F'],
    correct_option: 2,
    explanation: 'Reduction reaction: Al3+ + 3e- -> Al(s). One mole of aluminum requires 3 moles of electrons = 3 Faradays.'
  },
  {
    id: 'chm-09',
    course_code: 'IJMB-CHEM',
    question: 'Which of the following noble gases exhibits the highest normal boiling point?',
    options: ['Helium', 'Neon', 'Argon', 'Xenon'],
    correct_option: 3,
    explanation: 'Xenon has the largest electron cloud, resulting in greater polarizability and stronger London dispersion intermolecular forces.'
  },
  {
    id: 'chm-10',
    course_code: 'IJMB-CHEM',
    question: 'The product of the reaction between ethanoic acid and ethanol in the presence of concentrated H2SO4 catalyst is:',
    options: ['Ethyl ethanoate', 'Ethanal', 'Ethoxyethane', 'Sodium ethanoate'],
    correct_option: 0,
    explanation: 'Fischer esterification: CH3COOH + C2H5OH -> CH3COOC2H5 (ethyl ethanoate ester) + H2O.'
  },

  // ==========================================
  // PHYSICS (IJMB-PHY)
  // ==========================================
  {
    id: 'phy-01',
    course_code: 'IJMB-PHY',
    question: 'What is the SI unit of electric capacitance?',
    options: ['Ohm (Ω)', 'Farad (F)', 'Henry (H)', 'Tesla (T)'],
    correct_option: 1,
    explanation: 'One Farad equals one Coulomb of electric charge stored per Volt of potential difference (1 F = 1 C/V).'
  },
  {
    id: 'phy-02',
    course_code: 'IJMB-PHY',
    question: 'A projectile is launched from ground level with speed u at angle θ to the horizontal. The maximum horizontal range is attained when θ equals:',
    options: ['30°', '45°', '60°', '90°'],
    correct_option: 1,
    explanation: 'Range R = (u² sin 2θ)/g. The sine function attains its maximum value of 1 when 2θ = 90°, hence θ = 45°.'
  },
  {
    id: 'phy-03',
    course_code: 'IJMB-PHY',
    question: 'According to Faraday’s law of electromagnetic induction, the induced electromotive force (emf) is proportional to:',
    options: ['Magnetic field strength only', 'Rate of change of magnetic flux linkage', 'Electrical resistance of the coil', 'Speed of sound'],
    correct_option: 1,
    explanation: 'Faraday’s law states ε = -N (dΦB / dt), where the induced emf equals the negative time rate of change of magnetic flux.'
  },
  {
    id: 'phy-04',
    course_code: 'IJMB-PHY',
    question: 'A photon has a frequency of 5 x 10^14 Hz. Taking Planck’s constant as 6.63 x 10^-34 J·s, its energy is:',
    options: ['3.32 x 10^-19 J', '1.33 x 10^-48 J', '6.63 x 10^-20 J', '2.50 x 10^-19 J'],
    correct_option: 0,
    explanation: 'E = hf = (6.63 x 10^-34 J·s) * (5.0 x 10^14 s^-1) = 3.315 x 10^-19 Joules.'
  },
  {
    id: 'phy-05',
    course_code: 'IJMB-PHY',
    question: 'In Young’s double slit experiment, fringe width β is inversely proportional to:',
    options: ['Wavelength (λ)', 'Distance from slit to screen (D)', 'Distance between the two slits (d)', 'Light intensity'],
    correct_option: 2,
    explanation: 'Fringe spacing β = (λD)/d. Decreasing the slit separation d expands fringe width, confirming inverse proportionality.'
  },
  {
    id: 'phy-06',
    course_code: 'IJMB-PHY',
    question: 'Which thermodynamic process occurs without any heat transfer between the system and its surroundings (Q = 0)?',
    options: ['Isochoric', 'Isobaric', 'Adiabatic', 'Isothermal'],
    correct_option: 2,
    explanation: 'In an adiabatic transformation, ΔU = -W because thermal insulation or rapid expansion prevents thermal flux (Q = 0).'
  },
  {
    id: 'phy-07',
    course_code: 'IJMB-PHY',
    question: 'The escape velocity from the surface of a spherical planet of mass M and radius R is expressed as:',
    options: ['√(GM/R)', '√(2GM/R)', '2GM/R²', 'GM/2R'],
    correct_option: 1,
    explanation: 'Equating initial kinetic energy ½mv² to gravitational potential binding energy GMm/R yields v_esc = √(2GM/R).'
  },
  {
    id: 'phy-08',
    course_code: 'IJMB-PHY',
    question: 'A body undergoing simple harmonic motion has maximum acceleration at which position?',
    options: ['Mean equilibrium position', 'Extreme amplitude positions', 'Midway between mean and extreme', 'Acceleration is uniform throughout'],
    correct_option: 1,
    explanation: 'SHM acceleration a = -ω²x. Magnitude |a| is maximized at the extreme displacement positions where |x| = A.'
  },
  {
    id: 'phy-09',
    course_code: 'IJMB-PHY',
    question: 'What type of radioactive decay produces a daughter nucleus with identical mass number (A) but atomic number (Z) increased by 1?',
    options: ['Alpha decay (α)', 'Beta-minus decay (β-)', 'Gamma emission (γ)', 'Positron emission (β+)'],
    correct_option: 1,
    explanation: 'Beta-minus decay converts a neutron into a proton, emitting an electron and antineutrino: n -> p + e- + ν̅.'
  },
  {
    id: 'phy-10',
    course_code: 'IJMB-PHY',
    question: 'A current of 3 A flows through a resistor of 10 Ω for 20 seconds. The thermal energy dissipated in Joules is:',
    options: ['600 J', '1800 J', '300 J', '3600 J'],
    correct_option: 1,
    explanation: 'Joule’s heating: H = I²Rt = (3)² * 10 * 20 = 9 * 10 * 20 = 1,800 Joules.'
  },

  // ==========================================
  // MATHEMATICS (IJMB-MTH)
  // ==========================================
  {
    id: 'mth-01',
    course_code: 'IJMB-MTH',
    question: 'Evaluate the limit of (sin x)/x as x approaches 0 in radian measure.',
    options: ['0', '1', 'Infinity', 'Undefined'],
    correct_option: 1,
    explanation: 'By standard calculus limit theorems and L’Hôpital’s rule: lim(x->0) cos(x)/1 = 1.'
  },
  {
    id: 'mth-02',
    course_code: 'IJMB-MTH',
    question: 'Differentiate y = e^(3x) * sin(2x) with respect to x:',
    options: [
      'e^(3x) [3 sin(2x) + 2 cos(2x)]',
      '3e^(3x) cos(2x)',
      'e^(3x) [2 sin(2x) + 3 cos(2x)]',
      '6e^(3x) cos(2x)'
    ],
    correct_option: 0,
    explanation: 'Apply product rule: dy/dx = (d/dx e^3x) * sin(2x) + e^3x * (d/dx sin 2x) = 3e^(3x) sin(2x) + 2e^(3x) cos(2x).'
  },
  {
    id: 'mth-03',
    course_code: 'IJMB-MTH',
    question: 'Evaluate the definite integral ∫ from 0 to 2 of (3x² + 4x - 1) dx:',
    options: ['12', '14', '16', '18'],
    correct_option: 1,
    explanation: 'Antiderivative F(x) = x³ + 2x² - x. F(2) = (8) + 2(4) - 2 = 8 + 8 - 2 = 14. F(0) = 0. Value = 14.'
  },
  {
    id: 'mth-04',
    course_code: 'IJMB-MTH',
    question: 'Find the determinant of the 2x2 matrix [[4, 7], [2, 5]]:',
    options: ['6', '8', '14', '-6'],
    correct_option: 0,
    explanation: 'Det = ad - bc = (4)(5) - (7)(2) = 20 - 14 = 6.'
  },
  {
    id: 'mth-05',
    course_code: 'IJMB-MTH',
    question: 'In a geometric progression (G.P.), the first term a = 3 and the common ratio r = 2. Find the sum of the first 6 terms (S6):',
    options: ['93', '189', '192', '64'],
    correct_option: 1,
    explanation: 'Sn = a(r^n - 1)/(r - 1) => S6 = 3(2^6 - 1)/(2 - 1) = 3(64 - 1) = 3(63) = 189.'
  },
  {
    id: 'mth-06',
    course_code: 'IJMB-MTH',
    question: 'The roots of the quadratic equation 2x² - 5x + 3 = 0 are:',
    options: ['x = 1, 3/2', 'x = -1, -3/2', 'x = 2, 3', 'x = 1/2, 3'],
    correct_option: 0,
    explanation: 'Factorization: (2x - 3)(x - 1) = 0 => x = 3/2 or x = 1.'
  },
  {
    id: 'mth-07',
    course_code: 'IJMB-MTH',
    question: 'If two vectors A = 2i + 3j - k and B = 4i - j + 2k are perpendicular, their dot product A · B must equal:',
    options: ['0', '1', '7', '-1'],
    correct_option: 0,
    explanation: 'Orthogonal vectors satisfy A · B = |A||B| cos(90°) = 0.'
  },
  {
    id: 'mth-08',
    course_code: 'IJMB-MTH',
    question: 'What is the sum of the infinite convergent geometric series: 12 + 6 + 3 + 1.5 + ...?',
    options: ['24', '18', '36', '48'],
    correct_option: 0,
    explanation: 'S_infinity = a / (1 - r) = 12 / (1 - 0.5) = 12 / 0.5 = 24.'
  },
  {
    id: 'mth-09',
    course_code: 'IJMB-MTH',
    question: 'If sin θ = 3/5 in the first quadrant, what is the exact value of cos(2θ)?',
    options: ['7/25', '24/25', '16/25', '-7/25'],
    correct_option: 0,
    explanation: 'Double angle formula: cos(2θ) = 1 - 2 sin²θ = 1 - 2(3/5)² = 1 - 2(9/25) = 1 - 18/25 = 7/25.'
  },
  {
    id: 'mth-10',
    course_code: 'IJMB-MTH',
    question: 'The number of permutations of 5 distinct books arranged on a single shelf is:',
    options: ['25', '60', '120', '720'],
    correct_option: 2,
    explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120.'
  },

  // ==========================================
  // GOVERNMENT (IJMB-GOV)
  // ==========================================
  {
    id: 'gov-01',
    course_code: 'IJMB-GOV',
    question: 'The supreme law from which all government authority is derived in a constitutional democracy is the:',
    options: ['Party Manifesto', 'Constitution', 'Executive Decree', 'Official Gazette'],
    correct_option: 1,
    explanation: 'The constitution serves as the grundnorm and sovereign foundation of state power and legal authority.'
  },
  {
    id: 'gov-02',
    course_code: 'IJMB-GOV',
    question: 'The principle of Separation of Powers was prominently articulated by which political philosopher?',
    options: ['Thomas Hobbes', 'Baron de Montesquieu', 'John Locke', 'Jean-Jacques Rousseau'],
    correct_option: 1,
    explanation: 'Montesquieu popularized the tripartite division into executive, legislative, and judicial branches in De l’esprit des lois (1748).'
  },
  {
    id: 'gov-03',
    course_code: 'IJMB-GOV',
    question: 'Under Nigeria’s 1999 Constitution (as amended), residual legislative powers reside exclusively with:',
    options: ['Federal National Assembly', 'State Houses of Assembly', 'Local Government Councils', 'Supreme Court'],
    correct_option: 1,
    explanation: 'Matters not enumerated in either the Exclusive or Concurrent Legislative Lists fall automatically under state legislative competence.'
  },
  {
    id: 'gov-04',
    course_code: 'IJMB-GOV',
    question: 'Which constitutional development introduced the elective principle into Nigerian colonial governance?',
    options: ['Clifford Constitution (1922)', 'Richards Constitution (1946)', 'Macpherson Constitution (1951)', 'Lyttelton Constitution (1954)'],
    correct_option: 0,
    explanation: 'The 1922 Clifford Constitution allocated 4 elective seats (3 for Lagos, 1 for Calabar) to the Legislative Council.'
  },
  {
    id: 'gov-05',
    course_code: 'IJMB-GOV',
    question: 'A bicameral legislature is characterized by having:',
    options: ['Two distinct legislative houses or chambers', 'Two heads of government', 'Two political parties', 'Two supreme judges'],
    correct_option: 0,
    explanation: 'Bicameralism entails two chambers (e.g., Senate and House of Representatives in the National Assembly).'
  },
  {
    id: 'gov-06',
    course_code: 'IJMB-GOV',
    question: 'The primary statutory function of the civil service in any modern state is to:',
    options: ['Formulate party ideology', 'Execute and implement approved government policies', 'Adjudicate legal disputes', 'Conduct elections'],
    correct_option: 1,
    explanation: 'Civil servants are non-partisan permanent administrators executing executive decisions and laws.'
  },
  {
    id: 'gov-07',
    course_code: 'IJMB-GOV',
    question: 'Which international organization succeeded the League of Nations following the 1945 San Francisco Conference?',
    options: ['African Union', 'United Nations Organization (UNO)', 'Commonwealth of Nations', 'Non-Aligned Movement'],
    correct_option: 1,
    explanation: 'The UN was chartered in October 1945 by 51 founding states to maintain international peace and collective security.'
  },
  {
    id: 'gov-08',
    course_code: 'IJMB-GOV',
    question: 'A system of government where power is concentrated exclusively in one central authority without state devolution is termed:',
    options: ['Federal system', 'Unitary system', 'Confederal system', 'Oligarchy'],
    correct_option: 1,
    explanation: 'In a unitary constitution (e.g., United Kingdom, France), all sovereignty emanates from the central government.'
  },
  {
    id: 'gov-09',
    course_code: 'IJMB-GOV',
    question: 'The judicial prerogative writ used to compel a public official or administrative body to perform a mandatory statutory duty is:',
    options: ['Habeas corpus', 'Mandamus', 'Certiorari', 'Injunction'],
    correct_option: 1,
    explanation: 'Mandamus ("we command") is issued by a superior court ordering an inferior tribunal or public official to fulfill their legal obligation.'
  },
  {
    id: 'gov-10',
    course_code: 'IJMB-GOV',
    question: 'Which tier of the Nigerian judiciary exercises exclusive original jurisdiction in disputes between the Federation and a constituent State?',
    options: ['Federal High Court', 'Court of Appeal', 'Supreme Court of Nigeria', 'National Industrial Court'],
    correct_option: 2,
    explanation: 'Section 232(1) of the 1999 Constitution vests exclusive original jurisdiction in interstate/federal disputes in the Supreme Court.'
  },

  // ==========================================
  // ECONOMICS (IJMB-ECO)
  // ==========================================
  {
    id: 'eco-01',
    course_code: 'IJMB-ECO',
    question: 'When the percentage change in quantity demanded is strictly equal to the percentage change in price, elasticity is described as:',
    options: ['Perfectlynelastic', 'Unitary elastic (|Ed| = 1)', 'Perfectlynelastic', 'Cross-price elastic'],
    correct_option: 1,
    explanation: 'Unitary elasticity occurs when percentage change in quantity demanded equals percentage change in price (|Ed| = 1).'
  },
  {
    id: 'eco-02',
    course_code: 'IJMB-ECO',
    question: 'Which of the following conditions characterizes long-run competitive market equilibrium for a firm?',
    options: ['P = MC = Minimum ATC', 'P > MC', 'P < ATC', 'MR = AFC'],
    correct_option: 0,
    explanation: 'Free entry and exit drive economic profits to zero in the long run, enforcing P = MR = MC = min ATC (allocative and productive efficiency).'
  },
  {
    id: 'eco-03',
    course_code: 'IJMB-ECO',
    question: 'The economic concept defining the value of the next highest alternative foregone when a choice is made is termed:',
    options: ['Marginal cost', 'Opportunity cost', 'Sunk cost', 'Implicit cost'],
    correct_option: 1,
    explanation: 'Opportunity cost represents the forgone benefit of the next best alternative given scarce resources.'
  },
  {
    id: 'eco-04',
    course_code: 'IJMB-ECO',
    question: 'If the marginal propensity to consume (MPC) is 0.8, calculate the Keynesian investment multiplier (k):',
    options: ['1.25', '4', '5', '8'],
    correct_option: 2,
    explanation: 'Multiplier k = 1 / (1 - MPC) = 1 / (1 - 0.8) = 1 / 0.2 = 5.0.'
  },
  {
    id: 'eco-05',
    course_code: 'IJMB-ECO',
    question: 'A tax whose effective rate increases as the taxpayer’s income bracket rises is classified as:',
    options: ['Regressive tax', 'Proportional tax', 'Progressive tax', 'Ad valorem levy'],
    correct_option: 2,
    explanation: 'A progressive tax imposes higher marginal percentage rates on larger incomes, redistributing fiscal burden.'
  },
  {
    id: 'eco-06',
    course_code: 'IJMB-ECO',
    question: 'Which component is excluded from the calculation of Gross Domestic Product (GDP) via the expenditure approach?',
    options: ['Government expenditure (G)', 'Gross private domestic investment (I)', 'Transfer payments (e.g. pensions, unemployment stipends)', 'Net exports (X - M)'],
    correct_option: 2,
    explanation: 'Transfer payments involve no exchange of goods or productive services and are excluded from GDP to prevent double-counting.'
  },
  {
    id: 'eco-07',
    course_code: 'IJMB-ECO',
    question: 'Cost-push inflation is primarily initiated by:',
    options: ['Excessive aggregate demand expansion', 'Substantial increases in the cost of crucial inputs (e.g. energy/wages)', 'Excessive growth of monetary supply', 'Reduction in import tariffs'],
    correct_option: 1,
    explanation: 'Cost-push inflation shifts aggregate supply inward due to rising production input costs.'
  },
  {
    id: 'eco-08',
    course_code: 'IJMB-ECO',
    question: 'According to David Ricardo’s theory, international trade patterns should be determined by differences in:',
    options: ['Absolute advantage', 'Comparative advantage (relative opportunity cost)', 'Currency exchange rates', 'Trade protection quotas'],
    correct_option: 1,
    explanation: 'Nations maximize global output by specializing in goods wherein they hold the lowest relative opportunity cost.'
  },

  // ==========================================
  // FINANCIAL ACCOUNTING (IJMB-ACC)
  // ==========================================
  {
    id: 'acc-01',
    course_code: 'IJMB-ACC',
    question: 'The fundamental accounting equation is defined as:',
    options: ['Assets = Liabilities + Equity (Capital)', 'Assets + Liabilities = Capital', 'Capital = Assets + Revenue', 'Liabilities = Assets + Profit'],
    correct_option: 0,
    explanation: 'Every business balance sheet balances around: Assets = Total Liabilities + Owner’s Equity.'
  },
  {
    id: 'acc-02',
    course_code: 'IJMB-ACC',
    question: 'Under the double-entry system, an increase in an asset account is recorded as a:',
    options: ['Credit entry', 'Debit entry', 'Contra entry', 'Reversal entry'],
    correct_option: 1,
    explanation: 'Asset and expense accounts increase on the debit side and decrease on the credit side.'
  },
  {
    id: 'acc-03',
    course_code: 'IJMB-ACC',
    question: 'Which of the following errors is NOT detected by a balanced trial balance?',
    options: ['Single-sided posting', 'Arithmetical addition error in ledger', 'Error of complete omission', 'Discrepancy in opening balance extraction'],
    correct_option: 2,
    explanation: 'When a transaction is completely omitted from both books, debits still equal credits, leaving the trial balance deceptively in balance.'
  },
  {
    id: 'acc-04',
    course_code: 'IJMB-ACC',
    question: 'Goodwill arising on the acquisition of a partnership or business is categorized on the balance sheet as an:',
    options: ['Current asset', 'Intangible non-current asset', 'Fictitious liability', 'Contingent reserve'],
    correct_option: 1,
    explanation: 'Goodwill represents reputational and commercial brand value, classified as an intangible non-current asset.'
  },

  // ==========================================
  // ISLAMIC RELIGIOUS STUDIES (IJMB-IRS)
  // ==========================================
  {
    id: 'irs-01',
    course_code: 'IJMB-IRS',
    question: 'The primary and most authoritative source of Islamic jurisprudence (Shari’ah) is:',
    options: ['Sunnah / Hadith', 'The Holy Qur’an', 'Ijma (Consensus)', 'Qiyas (Analogical deduction)'],
    correct_option: 1,
    explanation: 'The Holy Qur’an constitutes the verbatim revelation of Allah and represents the supreme primary text in Islamic jurisprudence.'
  },
  {
    id: 'irs-02',
    course_code: 'IJMB-IRS',
    question: 'Which companion was appointed by Caliph Abu Bakr (RA) to oversee the initial textual compilation of the Holy Qur’an into a single codex?',
    options: ['Umar ibn al-Khattab', 'Zayd ibn Thabit (RA)', 'Ali ibn Abi Talib', 'Abdullah ibn Mas’ud'],
    correct_option: 1,
    explanation: 'Zayd ibn Thabit (RA), chief scribe to the Prophet (SAW), was commissioned by Abu Bakr following the battle of Yamamah.'
  },
  {
    id: 'irs-03',
    course_code: 'IJMB-IRS',
    question: 'The treaty concluded in the 6th year of Hijrah between the Prophet (SAW) and the Quraysh of Makkah is known as:',
    options: ['Treaty of Hudaybiyyah', 'Pledge of Aqabah', 'Charter of Madinah', 'Pledge of Ridwan'],
    correct_option: 0,
    explanation: 'The Sulh al-Hudaybiyyah established a ten-year non-aggression pact, recognized by Surah al-Fath as an open victory (Fathun Mubin).'
  },
  {
    id: 'irs-04',
    course_code: 'IJMB-IRS',
    question: 'In the science of Hadith, the chain of narrators transmitting a prophetic tradition is termed the:',
    options: ['Matn', 'Isnad (Sanad)', 'Takhrij', 'Dirayah'],
    correct_option: 1,
    explanation: 'Isnad refers to the chronological sequence of reliable reporters linking the compiler back to the Prophet (SAW).'
  },

  // ==========================================
  // LITERATURE IN ENGLISH (IJMB-LIT)
  // ==========================================
  {
    id: 'lit-01',
    course_code: 'IJMB-LIT',
    question: 'The tragic flaw or fatal error in judgment that causes the downfall of a tragic hero in Aristotelian drama is termed:',
    options: ['Catharsis', 'Hamartia', 'Hubris', 'Anagnorisis'],
    correct_option: 1,
    explanation: 'Hamartia denotes the internal fatal shortcoming or tragic mistake precipitating the protagonist’s ruin.'
  },
  {
    id: 'lit-02',
    course_code: 'IJMB-LIT',
    question: 'A 14-line poem written in iambic pentameter with a fixed rhyming scheme is classified as a:',
    options: ['Ballad', 'Sonnet', 'Elegy', 'Ode'],
    correct_option: 1,
    explanation: 'A sonnet contains 14 iambic lines, divided into either octave/sestet (Petrarchan) or three quatrains and a couplet (Shakespearean).'
  },
  {
    id: 'lit-03',
    course_code: 'IJMB-LIT',
    question: 'Which literary figure of speech attributes human feelings, motives, or characteristics to inanimate objects or abstractions?',
    options: ['Metonymy', 'Personification', 'Synecdoche', 'Hyperbole'],
    correct_option: 1,
    explanation: 'Personification endows non-human entities with human attributes (e.g. "the wind whispered through the trees").'
  },
  {
    id: 'lit-04',
    course_code: 'IJMB-LIT',
    question: 'In drama, an extended dramatic speech delivered by a character alone on stage revealing their innermost thoughts is called a:',
    options: ['Monologue', 'Soliloquy', 'Dialogue', 'Aside'],
    correct_option: 1,
    explanation: 'A soliloquy is spoken while solitary on stage, directly unveiling unspoken internal motives to the audience.'
  }
];
