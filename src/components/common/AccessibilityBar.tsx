import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Sun, Moon, Eye, Search, Globe, Type } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    textScale,
    setTextScale,
    highContrast,
    toggleHighContrast,
    language,
    toggleLanguage,
    setIsSearchOpen
  } = useAccessibility();

  return (
    <div className="bg-[#1D2228] text-gray-200 text-xs py-1.5 px-4 border-b border-gray-700/50 flex flex-wrap justify-between items-center z-50">
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          AHCAS Abaji Campus Portal
        </span>
        <span className="text-gray-400 hidden md:inline">|</span>
        <span className="text-gray-300 italic hidden lg:inline">
          {language === 'ha' ? '“Bunkasa Amintattun Tunani Domin Gobe”' : '“Developing the Best Minds for the Future”'}
        </span>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Language Switch */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gold font-medium px-2 py-0.5 rounded border border-gray-700 transition-colors"
          title="Switch Language (English / Hausa)"
          aria-label="Language Toggle"
        >
          <Globe size={13} className="text-[#D4A62A]" />
          <span className="text-amber-300 font-bold">{language === 'en' ? 'ENG' : 'HAU'}</span>
        </button>

        {/* Text Scaling */}
        <div className="hidden sm:flex items-center gap-1 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700" title="Text Font Sizing">
          <Type size={12} className="text-gray-400 mr-1" />
          <button
            onClick={() => setTextScale('small')}
            className={`px-1 rounded text-[10px] font-bold ${textScale === 'small' ? 'bg-[#006B35] text-white' : 'text-gray-300 hover:text-white'}`}
          >
            S
          </button>
          <button
            onClick={() => setTextScale('normal')}
            className={`px-1 rounded text-[11px] font-bold ${textScale === 'normal' ? 'bg-[#006B35] text-white' : 'text-gray-300 hover:text-white'}`}
          >
            M
          </button>
          <button
            onClick={() => setTextScale('large')}
            className={`px-1 rounded text-[12px] font-bold ${textScale === 'large' ? 'bg-[#006B35] text-white' : 'text-gray-300 hover:text-white'}`}
          >
            L
          </button>
        </div>

        {/* High Contrast */}
        <button
          onClick={toggleHighContrast}
          className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] transition-colors ${
            highContrast ? 'bg-amber-500 text-black border-amber-400 font-bold' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
          }`}
          title="Toggle High Contrast Mode"
        >
          <Eye size={13} />
          <span className="hidden sm:inline">Contrast</span>
        </button>

        {/* Theme Dark/Light */}
        <button
          onClick={toggleTheme}
          className="p-1 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-300 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={13} className="text-amber-300" /> : <Sun size={13} className="text-amber-400" />}
        </button>

        {/* Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-1 bg-[#006B35] hover:bg-[#004D26] text-white px-2.5 py-0.5 rounded font-medium transition-colors"
          title="Search AHCAS Portal"
        >
          <Search size={13} />
          <span className="hidden md:inline text-[11px]">Search</span>
        </button>
      </div>
    </div>
  );
};
