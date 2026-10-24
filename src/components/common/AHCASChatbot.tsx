import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { FAQS_DATA } from '../../data/faqs';
import { PROGRAMMES_DATA } from '../../data/programmes';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const AHCASChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Assalamu Alaikum! Welcome to Al-Hidayah College of Advanced Studies (AHCAS), Abaji. I am your virtual assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Rule-based response logic
    setTimeout(() => {
      const botResponseText = generateResponse(query);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const generateResponse = (q: string): string => {
    const lower = q.toLowerCase();

    if (lower.includes('admission') || lower.includes('apply') || lower.includes('requirements')) {
      return 'Online applications for ND, HND, and IJMB 2026/2027 are currently open! You need 5 O’Level credits (WAEC/NECO/NABTEB) including English and Mathematics. You can register at /apply/register.';
    }
    if (lower.includes('scratch card') || lower.includes('pin') || lower.includes('serial')) {
      return 'AHCAS Scratch Cards for application, admission status, and result checking are available at the Bursary Department in Abaji or can be verified directly on our portal using card PINs.';
    }
    if (lower.includes('fee') || lower.includes('tuition') || lower.includes('cost') || lower.includes('payment')) {
      return 'ND programme session tuition starts from ₦78,000 to ₦95,000 depending on the department. IJMB tuition is approximately ₦115,000 - ₦120,000 including examination fees. Flexible 2-part installment options are available.';
    }
    if (lower.includes('location') || lower.includes('where') || lower.includes('address') || lower.includes('abaji')) {
      return 'AHCAS is located in Abaji, Federal Capital Territory (FCT), Abuja, Nigeria. Visit our Virtual Campus Tour at /virtual-tour to see campus facilities!';
    }
    if (lower.includes('computer science') || lower.includes('slt') || lower.includes('mass comm') || lower.includes('ijmb')) {
      const found = PROGRAMMES_DATA.find(p => lower.includes(p.slug) || p.title.toLowerCase().includes(lower));
      if (found) {
        return `${found.title} is a ${found.duration} program under ${found.department}. Requirements: ${found.entryRequirements[0]}`;
      }
      return 'AHCAS offers accredited ND programs in Computer Science, SLT (Biology, Chemistry, Environmental), Mass Comm, Accountancy, Business Admin, Engineering, plus IJMB Direct Entry A’Levels.';
    }

    // Default matching from FAQs
    const matchedFaq = FAQS_DATA.find(f => f.question.toLowerCase().includes(lower) || f.answer.toLowerCase().includes(lower));
    if (matchedFaq) return matchedFaq.answer;

    return 'Thank you for your question. For detailed or specific administrative inquiries, please call the Admissions Helpdesk at +234 803 000 0000 or email admissions@ahcas.edu.ng.';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#006B35] hover:bg-[#004D26] text-white px-4 py-3 rounded-full shadow-2xl transition-all border-2 border-[#D4A62A]"
          title="Open AHCAS AI Assistant"
        >
          <Bot size={22} className="text-amber-300" />
          <span className="font-bold text-sm hidden sm:inline">AHCAS Assistant</span>
          <Sparkles size={14} className="text-amber-300" />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 bg-white dark:bg-[#1A222C] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col h-[480px] animate-fade-in">
          
          {/* Header */}
          <div className="bg-[#006B35] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold">
                <Bot size={18} />
              </div>
              <div>
                <span className="font-bold text-sm block leading-none">AHCAS AI Assistant</span>
                <span className="text-[10px] text-amber-200">Abaji Campus Digital Helpdesk</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-amber-300 p-1">
              <X size={18} />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="p-2 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 flex gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend('How do I apply for ND courses?')}
              className="px-2.5 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full whitespace-nowrap text-gray-700 dark:text-gray-200 hover:border-[#006B35]"
            >
              Requirements
            </button>
            <button
              onClick={() => handleSend('Tell me about tuition fees')}
              className="px-2.5 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full whitespace-nowrap text-gray-700 dark:text-gray-200 hover:border-[#006B35]"
            >
              Tuition Fees
            </button>
            <button
              onClick={() => handleSend('Where is AHCAS located?')}
              className="px-2.5 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full whitespace-nowrap text-gray-700 dark:text-gray-200 hover:border-[#006B35]"
            >
              Location
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#006B35] text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#006B35] text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1">{m.timestamp}</span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#D4A62A] text-black flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask about admissions, fees, courses..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#006B35]"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-[#006B35] text-white rounded-lg hover:bg-[#004D26] transition-colors"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
