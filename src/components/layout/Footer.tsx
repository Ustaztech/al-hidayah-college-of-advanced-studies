import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/ijmbData';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <>
      <footer className="text-white relative" style={{ backgroundColor: '#196855' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: QUICK LINKS (4 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-base font-bold uppercase tracking-wider text-white border-b-2 border-[#e69912] pb-1.5 inline-block">
                QUICK LINKS
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-200">
                <li>
                  <Link to="/" className="hover:text-[#e69912] hover:pl-1.5 transition-all block py-0.5">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/admissions/procedure" className="hover:text-[#e69912] hover:pl-1.5 transition-all block py-0.5">
                    Admission
                  </Link>
                </li>
                <li>
                  <Link to="/signin" className="hover:text-[#e69912] hover:pl-1.5 transition-all block py-0.5">
                    Portal Login
                  </Link>
                </li>
                <li>
                  <Link to="/verify" className="hover:text-[#e69912] hover:pl-1.5 transition-all block py-0.5">
                    Check Result
                  </Link>
                </li>
                <li>
                  <Link to="/lms" className="hover:text-[#e69912] hover:pl-1.5 transition-all block py-0.5">
                    E-Learning
                  </Link>
                </li>
                <li>
                  <Link to="/student/cbt" className="hover:text-[#e69912] hover:pl-1.5 transition-all block py-0.5">
                    CBT Center
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="hover:text-[#e69912] hover:pl-1.5 transition-all block py-0.5">
                    News and Events
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#e69912] hover:pl-1.5 transition-all block py-0.5">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#e69912] hover:pl-1.5 transition-all block py-0.5">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 2: CONTACT & SOCIAL MEDIA (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-base font-bold uppercase tracking-wider text-white border-b-2 border-[#e69912] pb-1.5 inline-block">
                Contact
              </h4>
              
              <div className="space-y-3 text-xs sm:text-sm text-gray-200">
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-[#e69912] shrink-0" />
                  <a href="tel:+2348056350078" className="hover:text-[#e69912] transition-colors font-mono">
                    +2348056350078
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-[#e69912] shrink-0" />
                  <a href="mailto:support@alhidayahcollege.com.ng" className="hover:text-[#e69912] transition-colors font-mono">
                    support@alhidayahcollege.com.ng
                  </a>
                </div>

                <div className="flex items-start gap-2.5 leading-relaxed">
                  <MapPin size={16} className="text-[#e69912] shrink-0 mt-0.5" />
                  <span>
                    No. 3, Bungalow MBS Close Sabon Tasha Street Phase II Abaji FCT Abuja Nigeria
                  </span>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
                  Follow Us on Social Media
                </h5>
                <div className="flex items-center space-x-2.5">
                  <a
                    href="https://facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e69912] text-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e69912] text-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/company/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e69912] text-white flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/2348056350078/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* COLUMN 3: NEWSLETTER CARD (4 cols) */}
            <div className="lg:col-span-4">
              <div className="card-view p-6 text-center text-gray-800 shadow-xl bg-white rounded">
                <h4 className="text-base font-bold uppercase tracking-wider text-[#196855] mb-1 font-serif">
                  NEWSLETTER
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Be among the first to receive our important updates
                </p>

                {subscribed ? (
                  <div className="p-3 bg-emerald-50 text-[#196855] text-xs font-bold rounded flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Thank you for subscribing!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-[#196855] border border-gray-300 rounded focus:border-[#e69912] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full btn-fill-primary py-2.5 rounded text-xs font-bold uppercase tracking-wider shadow-xs"
                    >
                      SUBSCRIBE NOW
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Accreditation strip */}
          <div className="mt-12 pt-6 border-t border-emerald-800/80 text-center text-xs text-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              © 2026 <span className="font-bold">AL-HIDAYAH COLLEGE OF ADVANCED STUDIES</span>. All Rights Reserved.
            </div>
            <div className="text-[11px] text-emerald-200">
              IJMB Direct Entry Centre • Affiliated with Citi Polytechnic Abuja
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* FLOATING WHATSAPP WIDGET (EXACT MATCH TO ALHIDAYAHCOLLEGE.COM)             */}
      {/* ========================================================================= */}
      <div className="fixed bottom-5 left-5 z-50 flex items-center group select-none">
        {/* Tooltip */}
        <div className="absolute bottom-16 left-0 bg-white text-gray-800 text-xs px-3.5 py-2.5 rounded-lg shadow-xl border border-gray-100 w-48 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 leading-snug">
          <p className="font-medium">Hello! Chat with us on WhatsApp. We are here to help!</p>
          <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45"></div>
        </div>

        {/* Pulsing Button */}
        <a
          href="https://wa.me/2348056350078"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all relative"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"></span>
          <svg className="w-7 h-7 fill-current relative z-10" viewBox="0 0 448 512">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        </a>
      </div>
    </>
  );
};

export default Footer;
