import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { logAuditEvent } from '../../services/audit';
import { CBTQuestion } from '../../types';
import {
  BookOpen,
  Search,
  Filter,
  Play,
  Video,
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Award,
  ChevronRight,
  ChevronDown,
  Download,
  Upload,
  AlertCircle,
  HelpCircle,
  X,
  Sparkles,
  Users,
  Check,
  Send
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const ELearningPage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { addNotification } = useNotifications();

  const [filterTab, setFilterTab] = useState<'all' | 'progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ijmb-bio-001');

  // Interactive CBT Modal State
  const [cbtModalOpen, setCbtModalOpen] = useState(false);
  const [cbtCourseCode, setCbtCourseCode] = useState('IJMB-BIO');
  const [cbtQuestions, setCbtQuestions] = useState<CBTQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [cbtTimeLeft, setCbtTimeLeft] = useState(600); // 10 minutes in seconds
  const [cbtCompleted, setCbtCompleted] = useState(false);
  const [cbtScore, setCbtScore] = useState<{ score: number; total: number; percent: number } | null>(null);

  // Assignment Modal State
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('Assignment 1: Mitosis vs Meiosis Essay');
  const [assignmentText, setAssignmentText] = useState('');
  const [assignmentFileName, setAssignmentFileName] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  // Active Lesson Player State
  const [activeLesson, setActiveLesson] = useState<{
    id: string;
    title: string;
    module: string;
    duration: string;
    content: string;
    hasVideo?: boolean;
    hasNotes?: boolean;
  }>({
    id: 'bio-l1',
    title: 'Structure and Ultrastructure of Plant & Animal Cells',
    module: 'Module 1: Cell Biology & Genetics',
    duration: '45 mins',
    content: `### Cell Biology Overview & Organelle Functions\n\nIn eukaryotic cells, structural compartmentalization allows distinct biochemical processes to occur concurrently under specialized micro-environments.\n\n- **Plasma Membrane**: Fluid-mosaic bilayer composed of amphipathic phospholipids with embedded transport proteins.\n- **Mitochondria**: Double-membrane organelle responsible for aerobic cellular respiration, Krebs cycle, and oxidative phosphorylation.\n- **Endoplasmic Reticulum (ER)**: Rough ER synthesizes membrane-bound and secretory proteins; Smooth ER handles lipid synthesis and detoxification.\n- **Ribosomes**: 80S ribonucleoprotein complexes catalyzing translation.\n\n#### Laboratory Exercise Notice\nStudents enrolled in **IJMB Biology (Code 030/043)** are required to complete the microscopic staining practical on Wednesday at the Science Laboratory A.`,
    hasVideo: true,
    hasNotes: true
  });

  const courses = [
    {
      id: 'ijmb-bio-001',
      title: 'Advanced Level Biology (IJMB 030)',
      code: 'IJMB-BIO • 1st Semester',
      category: 'Science',
      progress: 68,
      lessons: 14,
      resources: 6,
      liveClasses: 2,
      lecturer: 'Dr. A. K. Mohammed (Senior Lecturer)',
      image: '/african-campus-hero.jpg',
      status: 'In progress',
      modules: [
        {
          title: 'Module 1: Cell Biology, Molecular Genetics & Microbiology',
          lessons: [
            { id: 'bio-l1', title: 'Structure and Ultrastructure of Plant & Animal Cells', duration: '45 mins' },
            { id: 'bio-l2', title: 'Mendelian Genetics, DNA Replication & Chromosomal Inheritance', duration: '50 mins' },
            { id: 'bio-l3', title: 'Microbial Physiology & Bacteria Culturing Techniques', duration: '40 mins' }
          ]
        },
        {
          title: 'Module 2: Physiology, Respiration & Transport Mechanisms',
          lessons: [
            { id: 'bio-l4', title: 'Aerobic & Anaerobic Glycolysis, Krebs Cycle and ATP Yield', duration: '55 mins' },
            { id: 'bio-l5', title: 'Circulatory, Osmoregulatory and Nervous Systems in Vertebrates', duration: '45 mins' }
          ]
        }
      ]
    },
    {
      id: 'ijmb-chm-001',
      title: 'Advanced Level Chemistry (IJMB 043)',
      code: 'IJMB-CHEM • 1st Semester',
      category: 'Science',
      progress: 52,
      lessons: 16,
      resources: 5,
      liveClasses: 2,
      lecturer: 'Mall. Ibrahim Idris Gambo (Centre Coordinator)',
      image: '/african-cbt-lab.jpg',
      status: 'In progress',
      modules: [
        {
          title: 'Module 1: Physical & Inorganic Chemistry',
          lessons: [
            { id: 'chm-l1', title: 'Atomic Orbitals, Quantum Numbers & Periodic Periodicity', duration: '50 mins' },
            { id: 'chm-l2', title: 'Thermodynamics, Enthalpy & Le Chatelier Equilibrium', duration: '60 mins' }
          ]
        },
        {
          title: 'Module 2: Organic Reaction Mechanisms & Stereochemistry',
          lessons: [
            { id: 'chm-l3', title: 'Electrophilic Addition, Nucleophilic Substitution (SN1/SN2)', duration: '55 mins' }
          ]
        }
      ]
    },
    {
      id: 'ijmb-phy-001',
      title: 'Advanced Level Physics (IJMB 030)',
      code: 'IJMB-PHY • 1st Semester',
      category: 'Science',
      progress: 40,
      lessons: 15,
      resources: 4,
      liveClasses: 1,
      lecturer: 'Engr. D. O. Alabi',
      image: '/campus-gate.jpg',
      status: 'In progress',
      modules: [
        {
          title: 'Module 1: Classical Mechanics, Circular Motion & Gravitation',
          lessons: [
            { id: 'phy-l1', title: 'Newtonian Dynamics, Projectile Motion & Momentum', duration: '45 mins' },
            { id: 'phy-l2', title: 'Simple Harmonic Motion, Wave Superposition & Optics', duration: '50 mins' }
          ]
        }
      ]
    },
    {
      id: 'gst-101',
      title: 'Use of English & Technical Communication',
      code: 'GST 101 • 1st Semester',
      category: 'General Studies',
      progress: 85,
      lessons: 10,
      resources: 3,
      liveClasses: 1,
      lecturer: 'Hajiya S. Ibrahim',
      image: '/provost-mbsuleiman.jpg',
      status: 'In progress',
      modules: [
        {
          title: 'Module 1: Applied Academic Communication',
          lessons: [
            { id: 'gst-l1', title: 'Syntactic Structures, Concord & Lexical Ambiguity', duration: '35 mins' },
            { id: 'gst-l2', title: 'Essay Architecture & Academic Citation Protocols', duration: '40 mins' }
          ]
        }
      ]
    }
  ];

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Filtered courses
  const filteredCourses = courses.filter(c => {
    const matchesFilter = filterTab === 'all' || (filterTab === 'progress' && c.progress < 100) || (filterTab === 'completed' && c.progress === 100);
    const matchesQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  // Start CBT Assessment
  const handleStartCBT = (courseCode: string) => {
    setCbtCourseCode(courseCode);
    const allQuestions = db.getCBTQuestions();
    const courseQ = allQuestions.filter(q => q.course_code.toUpperCase().includes(courseCode.toUpperCase()));
    const finalQ = courseQ.length > 0 ? courseQ : allQuestions;

    setCbtQuestions(finalQ);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setCbtTimeLeft(600);
    setCbtCompleted(false);
    setCbtScore(null);
    setCbtModalOpen(true);
  };

  // CBT Timer
  useEffect(() => {
    if (!cbtModalOpen || cbtCompleted) return;
    const timer = setInterval(() => {
      setCbtTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishCBT();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cbtModalOpen, cbtCompleted]);

  const handleFinishCBT = () => {
    let correct = 0;
    cbtQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_option) {
        correct++;
      }
    });

    const total = cbtQuestions.length || 1;
    const percent = Math.round((correct / total) * 100);

    setCbtScore({ score: correct, total, percent });
    setCbtCompleted(true);

    // Record Exam Attempt into local & audit logs
    const matric = currentUser?.matricNumber || 'AHCAS/2026/0142';
    db.saveExamAttempt({
      studentId: currentUser?.id || 'std-active',
      matricNumber: matric,
      courseCode: cbtCourseCode,
      scorePercent: percent,
      totalQuestions: total,
      correctCount: correct
    });

    logAuditEvent(
      currentUser?.name || 'Student',
      role,
      'CBT_ASSESSMENT_COMPLETED',
      `Completed CBT assessment for ${cbtCourseCode}: Scored ${percent}% (${correct}/${total})`
    );

    addNotification({
      target_role: 'STUDENT',
      title: 'CBT Assessment Graded',
      message: `Your CBT attempt for ${cbtCourseCode} has been graded: ${percent}% score recorded.`,
      category: 'Examinations',
      priority: 'normal',
      action_url: '/student/dashboard?tab=results'
    });
  };

  // Submit Assignment
  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    setAssignmentSubmitted(true);

    logAuditEvent(
      currentUser?.name || 'Student',
      role,
      'ASSIGNMENT_SUBMITTED',
      `Submitted coursework: ${assignmentTitle} for ${activeCourse.title}`
    );

    addNotification({
      target_role: 'LECTURER',
      title: 'New Student Coursework Submitted',
      message: `${currentUser?.name || 'Student'} submitted ${assignmentTitle} for ${activeCourse.code}.`,
      category: 'Academic',
      priority: 'normal',
      action_url: '/admin/dashboard?tab=grading'
    });

    setTimeout(() => {
      setAssignmentSubmitted(false);
      setAssignmentModalOpen(false);
      setAssignmentText('');
      setAssignmentFileName('');
    }, 2000);
  };

  return (
    <PortalLayout activeNav="E-Learning (LMS)" portalTitle="Learning Management System">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#196855] via-[#196855] to-[#196855] text-white p-6 sm:p-7 rounded-3xl border border-[#e69912]/40 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-black tracking-widest text-[#e69912] font-mono block">
              AHCAS Virtual Learning Environment (LMS)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Interactive Digital Classroom
            </h1>
            <p className="text-xs text-emerald-100 max-w-xl">
              Access lecture syllabus, video lessons, downloadable academic handouts, assignments, and continuous assessment CBT engines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStartCBT('IJMB-BIO')}
              className="px-4 py-2.5 bg-[#e69912] hover:bg-[#B88D1D] text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105"
            >
              <Award size={16} />
              <span>Take CBT Test</span>
            </button>
            <button
              onClick={() => setAssignmentModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-900/60 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-emerald-700/60 cursor-pointer"
            >
              <Upload size={15} />
              <span>Submit Coursework</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            {(['all', 'progress', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterTab === tab
                    ? 'bg-[#196855] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab === 'all' ? 'All Courses' : tab === 'progress' ? 'In Progress' : 'Completed'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter course titles..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:border-[#196855]"
            />
          </div>
        </div>

        {/* Main LMS Grid: Left Course Cards & Right Lesson Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Course Selector (5 Columns) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 font-mono">
              Enrolled Courses ({filteredCourses.length})
            </h2>

            <div className="space-y-3">
              {filteredCourses.map(course => {
                const isSelected = course.id === selectedCourseId;
                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-2 border-[#196855] shadow-lg ring-2 ring-[#196855]/10'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">
                        {course.progress}%
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Lecturer: {course.lecturer}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className="bg-[#196855] h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1">
                        <BookOpen size={13} /> {course.lessons} Lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText size={13} /> {course.resources} Handouts
                      </span>
                      <span className="flex items-center gap-1 text-[#196855] font-bold">
                        Open Modules <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Course Reader & Modules (7 Columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Active Course Banner */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#e69912] font-mono">
                  Active Syllabus Outline
                </span>
                <button
                  onClick={() => handleStartCBT(activeCourse.code.split(' ')[0])}
                  className="px-2.5 py-1 bg-emerald-50 text-[#196855] dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-lg text-[10px] flex items-center gap-1 hover:bg-emerald-100 cursor-pointer"
                >
                  <Award size={12} />
                  <span>Launch Assessment</span>
                </button>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {activeCourse.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeCourse.lecturer} • JSS Agyana Road Study Centre
              </p>
            </div>

            {/* Video Lesson / Audio Visualizer Box */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex flex-col items-center justify-center p-6 text-center text-white group shadow-inner">
              <img
                src={activeCourse.image}
                alt="Lesson Thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="relative z-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#196855] text-white flex items-center justify-center mx-auto shadow-xl cursor-pointer hover:bg-emerald-600 transition-colors">
                  <Play size={24} className="ml-1" />
                </div>
                <div>
                  <h4 className="text-sm font-black">{activeLesson.title}</h4>
                  <span className="text-xs text-emerald-200 font-mono">
                    Official Lecture Recording • {activeLesson.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Lesson Content & Reading Notes */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#196855] dark:text-emerald-400">
                  {activeLesson.module}
                </span>
                <a
                  href="#download-handout"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading official handout for "${activeLesson.title}" (PDF standard)`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                >
                  <Download size={13} />
                  <span>Download Handout (PDF)</span>
                </a>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                <div dangerouslySetInnerHTML={{ __html: activeLesson.content.replace(/\n/g, '<br />') }} />
              </div>
            </div>

            {/* Modules Hierarchy Accordion */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 font-mono">
                Course Modules & Lessons
              </h3>

              {activeCourse.modules.map((mod, modIdx) => (
                <div key={modIdx} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 font-bold text-xs text-slate-800 dark:text-slate-200 flex justify-between items-center">
                    <span>{mod.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{mod.lessons.length} topics</span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {mod.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLesson({
                          id: lesson.id,
                          title: lesson.title,
                          module: mod.title,
                          duration: lesson.duration,
                          content: `### ${lesson.title}\n\nComprehensive lecture notes and curriculum reading for this unit are verified according to the IJMB Syllabus guidelines.`,
                          hasVideo: true,
                          hasNotes: true
                        })}
                        className="p-3 text-xs flex justify-between items-center hover:bg-emerald-50/40 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 size={15} className="text-[#196855]" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE TIMED CBT ASSESSMENT MODAL */}
      {/* ========================================================================= */}
      {cbtModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-3xl w-full rounded-3xl p-6 sm:p-8 border-2 border-[#196855] shadow-2xl space-y-6">
            
            {/* CBT Top Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#196855] flex items-center justify-center">
                  <Laptop size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    AHCAS Computer-Based Assessment (CBT)
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Course Code: <strong>{cbtCourseCode}</strong> • Continuous Assessment
                  </span>
                </div>
              </div>

              {!cbtCompleted && (
                <div className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-xl font-mono text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                  <Clock size={15} className="animate-spin text-amber-600" />
                  <span>
                    {Math.floor(cbtTimeLeft / 60)}:{(cbtTimeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}

              <button
                onClick={() => setCbtModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* CBT Body */}
            {!cbtCompleted ? (
              <div className="space-y-6">
                
                {/* Question Navigator Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {cbtQuestions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`w-8 h-8 rounded-lg font-mono text-xs font-bold cursor-pointer transition-colors ${
                        currentQIndex === idx
                          ? 'bg-[#196855] text-white shadow-md'
                          : selectedAnswers[idx] !== undefined
                          ? 'bg-emerald-100 text-[#196855] dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Active Question Box */}
                {cbtQuestions[currentQIndex] && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <span className="text-[10px] font-mono uppercase font-black text-slate-400 block">
                      Question {currentQIndex + 1} of {cbtQuestions.length}
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {cbtQuestions[currentQIndex].question}
                    </p>

                    {/* Options Radio List */}
                    <div className="space-y-2 pt-2">
                      {cbtQuestions[currentQIndex].options.map((opt, optIdx) => {
                        const isChosen = selectedAnswers[currentQIndex] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQIndex]: optIdx })}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 cursor-pointer transition-all ${
                              isChosen
                                ? 'border-[#196855] bg-emerald-50 dark:bg-emerald-950/40 text-[#196855] dark:text-emerald-300 shadow-xs'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-[10px] font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Question Navigation Controls */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Previous Question
                  </button>

                  {currentQIndex < cbtQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQIndex(prev => prev + 1)}
                      className="px-5 py-2 bg-[#196855] hover:bg-[#196855] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishCBT}
                      className="px-6 py-2 bg-[#e69912] hover:bg-[#B88D1D] text-slate-950 font-black rounded-xl text-xs shadow-lg cursor-pointer"
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>

              </div>
            ) : (
              /* CBT Score Card Screen */
              <div className="text-center py-6 space-y-5">
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#196855] flex items-center justify-center mx-auto shadow-xl">
                  <Award size={40} />
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#e69912] font-bold">
                    Official Assessment Result
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                    {cbtScore?.percent}%
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    You answered <strong>{cbtScore?.score}</strong> out of <strong>{cbtScore?.total}</strong> questions correctly.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl max-w-sm mx-auto text-xs text-slate-600 dark:text-slate-300 font-mono space-y-1 border border-slate-200 dark:border-slate-700">
                  <p><strong>Candidate:</strong> {currentUser?.name || 'Candidate'}</p>
                  <p><strong>Course:</strong> {cbtCourseCode}</p>
                  <p><strong>Status:</strong> Recorded in Institutional Examination Database</p>
                </div>

                <button
                  onClick={() => setCbtModalOpen(false)}
                  className="px-6 py-2.5 bg-[#196855] text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Return to Learning Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COURSEWORK ASSIGNMENT SUBMISSION MODAL */}
      {/* ========================================================================= */}
      {assignmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Upload size={17} className="text-[#196855]" />
                Submit Academic Coursework
              </h3>
              <button onClick={() => setAssignmentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {assignmentSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 size={40} className="text-[#196855] mx-auto" />
                <h4 className="text-sm font-black">Coursework Successfully Uploaded</h4>
                <p className="text-xs text-slate-500">Your submission has been dispatched to the lecturer grading desk.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assignment Title</label>
                  <input
                    type="text"
                    required
                    value={assignmentTitle}
                    onChange={e => setAssignmentTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Student Notes / Explanation</label>
                  <textarea
                    rows={4}
                    value={assignmentText}
                    onChange={e => setAssignmentText(e.target.value)}
                    placeholder="Enter accompanying notes, methodology summary or references..."
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Attached Document (PDF or Word)</label>
                  <input
                    type="file"
                    onChange={e => setAssignmentFileName(e.target.files?.[0]?.name || '')}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-[#196855]"
                  />
                  {assignmentFileName && (
                    <span className="text-[10px] text-emerald-700 font-mono block mt-1">Ready: {assignmentFileName}</span>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignmentModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#196855] hover:bg-[#196855] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Confirm Submission</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </PortalLayout>
  );
};
