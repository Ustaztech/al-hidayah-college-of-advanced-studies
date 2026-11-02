import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ListChecks, Laptop, CheckSquare, Edit3, ArrowRight, PhoneCall } from 'lucide-react';

export const RectorWelcome: React.FC = () => {
  return (
    <section className="py-12 bg-[#F4F6F5] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#196855] tracking-tight font-serif">
            Welcome
          </h2>
          <div className="w-16 h-1 bg-[#e69912] mx-auto mt-2 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Administrative Messages 1 & 2 (8 cols)                       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ADMINISTRATIVE MESSAGE 1: Administrator / Founder */}
            <div className="card-view p-6 sm:p-7 flex flex-col sm:flex-row gap-6 items-start">
              <div className="sm:w-52 shrink-0 mx-auto sm:mx-0">
                <img
                  src="/provost-mbsuleiman.jpg"
                  alt="Chief Dr. Muhammad Baba Suleiman, PhD"
                  className="w-44 h-52 sm:w-52 sm:h-60 object-cover object-top rounded border-4 border-[#e69912] shadow-md"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-[#e69912] text-white rounded">
                    Founder & Executive Chairman
                  </span>
                </div>
                <h3 className="p-title text-lg sm:text-xl font-bold font-serif text-[#196855]">
                  Message from our Founder & Administrator
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify">
                  It gives me great pleasure to present this Institutional Profile of Al-Hidayah College of Advanced Studies (AHCAS), established with a firm commitment to academic excellence, professional development, skills acquisition, innovation, and human capital development. The College was founded in Abaji Area Council to address critical educational needs by creating accessible, flexible, and high-impact academic pathways through the Interim Joint Matriculation Board (IJMB) programme that equip students with the qualifications required to secure Direct Entry (200 Level) university admissions across Nigeria...
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-bold rounded">
                    - Chief Dr. Muhammad Baba Suleiman, PhD (Magajin Ilimin Abaji)
                  </span>
                  <Link
                    to="/about/management"
                    className="btn-fill-primary px-4 py-1.5 text-xs rounded shadow-xs"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>

            {/* ADMINISTRATIVE MESSAGE 2: Centre Coordinator */}
            <div className="card-view p-6 sm:p-7 flex flex-col sm:flex-row gap-6 items-start">
              <div className="sm:w-52 shrink-0 mx-auto sm:mx-0">
                <img
                  src="/coordinator-ibrahim-gambo.jpg"
                  alt="Mall. Ibrahim Idris Gambo"
                  className="w-44 h-52 sm:w-52 sm:h-60 object-cover object-top rounded border-4 border-gray-200 shadow-md"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-[#196855] text-white rounded">
                    Centre Coordinator
                  </span>
                </div>
                <h3 className="p-title text-lg sm:text-xl font-bold font-serif text-[#196855]">
                  Message from the Centre Coordinator
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify">
                  Welcome to Al-Hidayah College of Advanced Studies (AHCAS), an institution dedicated to excellence in learning, professional development, innovation, and character formation. As Centre Coordinator, I am proud to lead an academic team committed to preparing students for the opportunities and challenges of university-level scholarship. Our goal is to nurture well-rounded, capable, and forward-thinking individuals who excel in the national IJMB examinations...
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-bold rounded">
                    - Mall. Ibrahim Idris Gambo (Director of Studies)
                  </span>
                  <Link
                    to="/about/management"
                    className="btn-fill-primary px-4 py-1.5 text-xs rounded shadow-xs"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Quick Links, Our Mission, Our Vision (4 cols)               */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Links Card */}
            <div className="card-view p-6 text-center space-y-3">
              <h3 className="text-base font-bold text-[#196855] uppercase tracking-wider border-b border-gray-100 pb-2">
                Quick Links
              </h3>
              <div className="space-y-2.5 pt-1">
                <Link
                  to="/signin"
                  className="btn-fill-primary w-full py-2.5 rounded text-xs font-bold gap-2 shadow-xs"
                >
                  <LogIn size={14} />
                  <span>Portal Login</span>
                </Link>
                <Link
                  to="/verify"
                  className="btn-fill-primary w-full py-2.5 rounded text-xs font-bold gap-2 shadow-xs"
                >
                  <ListChecks size={14} />
                  <span>Check Result</span>
                </Link>
                <Link
                  to="/lms"
                  className="btn-fill-primary w-full py-2.5 rounded text-xs font-bold gap-2 shadow-xs"
                >
                  <Laptop size={14} />
                  <span>E-Learning</span>
                </Link>
                <Link
                  to="/student/cbt"
                  className="btn-fill-primary w-full py-2.5 rounded text-xs font-bold gap-2 shadow-xs"
                >
                  <CheckSquare size={14} />
                  <span>CBT</span>
                </Link>
                <Link
                  to="/apply"
                  className="btn-fill-primary w-full py-2.5 rounded text-xs font-bold gap-2 shadow-xs"
                >
                  <Edit3 size={14} />
                  <span>Admission Application</span>
                </Link>
                <a
                  href="tel:08056350078"
                  className="w-full py-2.5 px-3 bg-emerald-50 border border-[#196855] text-[#196855] hover:bg-[#196855] hover:text-white rounded text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <PhoneCall size={15} />
                  <span>Direct Admissions Helpline</span>
                </a>
              </div>
            </div>

            {/* Our Mission Card */}
            <div className="card-view p-6 space-y-3">
              <h3 className="p-title text-base font-bold font-serif text-[#196855]">
                Our Mission
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed text-justify">
                The mission of Al-Hidayah College of Advanced Studies is to provide accessible, affordable, and high-quality education through innovative teaching, practical skills training, professional development programmes, and academic pathways that prepare learners for higher education, employment, and entrepreneurship.
              </p>
              <div className="flex justify-end pt-1">
                <Link
                  to="/about"
                  className="btn-fill-primary px-3.5 py-1 text-xs rounded shadow-xs"
                >
                  more
                </Link>
              </div>
            </div>

            {/* Our Vision Card */}
            <div className="card-view p-6 space-y-3">
              <h3 className="p-title text-base font-bold font-serif text-[#196855]">
                Our Vision
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed text-justify">
                To become a leading institution of advanced studies, professional development, digital innovation, and academic excellence, empowering individuals with the knowledge, skills, and values required to excel in a rapidly changing world.
              </p>
              <div className="flex justify-end pt-1">
                <Link
                  to="/about"
                  className="btn-fill-primary px-3.5 py-1 text-xs rounded shadow-xs"
                >
                  more
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default RectorWelcome;
