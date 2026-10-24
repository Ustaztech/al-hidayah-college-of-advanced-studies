import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilitySettings } from '../types';

interface AccessibilityContextType extends AccessibilitySettings {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setTextScale: (scale: 'small' | 'normal' | 'large') => void;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  setLanguage: (lang: 'en' | 'ha') => void;
  toggleLanguage: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<'light' | 'dark'>('light');
  const [textScale, setTextScaleState] = useState<'small' | 'normal' | 'large'>('normal');
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [language, setLanguageState] = useState<'en' | 'ha'>('en');
  const [motionReduced, setMotionReducedState] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-text-scale', textScale);
  }, [textScale]);

  useEffect(() => {
    document.documentElement.setAttribute('data-high-contrast', String(highContrast));
  }, [highContrast]);

  const setTheme = (_t: 'light' | 'dark') => {};
  const toggleTheme = () => {};

  const setTextScale = (s: 'small' | 'normal' | 'large') => setTextScaleState(s);

  const setHighContrast = (hc: boolean) => setHighContrastState(hc);
  const toggleHighContrast = () => setHighContrastState(prev => !prev);

  const setLanguage = (lang: 'en' | 'ha') => setLanguageState(lang);
  const toggleLanguage = () => setLanguageState(prev => prev === 'en' ? 'ha' : 'en');

  return (
    <AccessibilityContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      textScale,
      setTextScale,
      highContrast,
      setHighContrast,
      toggleHighContrast,
      language,
      setLanguage,
      toggleLanguage,
      motionReduced,
      isSearchOpen,
      setIsSearchOpen
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
