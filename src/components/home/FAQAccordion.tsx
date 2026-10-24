import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { FAQS_DATA } from '../../data/faqs';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQAccordion: React.FC = () => {
  const { language } = useAccessibility();
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-[#F3F6F3] dark:bg-[#12181F] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold mb-2">
            <HelpCircle size={14} />
            <span>{language === 'ha' ? 'Tambayoyi da Amsoshi' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif tracking-tight">
            {language === 'ha' ? 'Nemi Bayani game da AHCAS Abaji' : 'Everything You Need to Know About AHCAS'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {language === 'ha'
              ? 'Amsoshin tambayoyi da suka shafi neman shiga, kudin makaranta, da duba sakamako.'
              : 'Find answers regarding admissions, tuition payments, scratch cards, e-learning, and campus facilities.'}
          </p>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map(faq => {
            const isOpen = openId === faq.id;
            const questionText = language === 'ha' && faq.questionHa ? faq.questionHa : faq.question;
            const answerText = language === 'ha' && faq.answerHa ? faq.answerHa : faq.answer;

            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-[#1A222C] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-[#006B35] dark:text-emerald-300 text-[10px] font-bold shrink-0">
                      {faq.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white font-serif">
                      {questionText}
                    </h3>
                  </div>
                  {isOpen ? <ChevronUp size={18} className="text-[#006B35] shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-800/20">
                    <p>{answerText}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
