import React, { useState, useEffect } from 'react';

export const LoadingScreen: React.FC<{ onLoaded?: () => void }> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              setDone(true);
              if (onLoaded) onLoaded();
            }, 600);
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15 + 10);
      });
    }, 90);

    return () => clearInterval(timer);
  }, [onLoaded]);

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#12181F] text-white flex flex-col items-center justify-center transition-opacity duration-600 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute w-96 h-96 bg-[#006B35]/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
        
        {/* Animated Crest & Pulsing Gold Ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border-4 border-t-[#D4A62A] border-r-[#006B35] border-b-[#F58220] border-l-transparent animate-spin"></div>
          <img
            src="/ahcas-crest.jpg"
            alt="AHCAS Crest"
            className="w-16 h-16 object-contain rounded-full bg-white p-1 absolute shadow-xl animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* Branding Title */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold font-serif tracking-tight text-white">
            AL-HIDAYAH COLLEGE OF ADVANCED STUDIES
          </h1>
          <p className="text-xs text-[#D4A62A] font-medium tracking-wider uppercase font-sans">
            Abaji, Federal Capital Territory, Nigeria
          </p>
          <p className="text-[11px] text-gray-400 italic">
            “Developing the Best Minds for the Future”
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-64 max-w-xs space-y-2">
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-700">
            <div
              className="h-full bg-gradient-to-r from-[#006B35] via-[#D4A62A] to-[#F58220] rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
            <span>Loading Digital Campus...</span>
            <span className="text-amber-400 font-bold">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
