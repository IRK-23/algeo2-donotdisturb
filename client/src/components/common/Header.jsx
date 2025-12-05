// src/components/common/Header.jsx
import React, { useState, useEffect } from 'react';

const Header = () => {
  // State untuk dark/light mode
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Efek untuk menerapkan class 'dark' ke body/html saat mode berubah
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <header className="g-white/80 dark:bg-gray-900/80 
                      backdrop-blur-xl
                      border-b border-gray-200 dark:border-gray-700 
                      shadow-[0_4px_15px_rgba(0,0,0,0.08)] 
                      p-5 sticky top-0 z-30 
                      transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Judul Aplikasi */}
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          Book Library
        </h1>

        <div className="flex items-center space-x-4">
          
          {/* 1. DARK/LIGHT MODE TOGGLE INTERAKTIF (BARU) */}
          <label 
            htmlFor="dark-mode-toggle" 
            className="relative inline-flex items-center cursor-pointer"
          >
            {/* Input Checkbox yang Tersembunyi (Mekanisme Kontrol) */}
            <input 
              id="dark-mode-toggle" 
              type="checkbox" 
              className="sr-only peer" 
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)} 
            />
            
            {/* Track Switch dan Kenop yang Bergerak */}
            <div 
              className="w-14 h-7 
                         bg-gray-300 dark:bg-gray-700 
                         rounded-full peer 
                         peer-checked:bg-indigo-600 
                         peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 
                         after:absolute after:top-0.5 after:left-[4px] 
                         after:bg-white after:border after:border-gray-300 
                         after:rounded-full after:h-6 after:w-6 after:transition-all 
                         peer-checked:after:translate-x-full 
                         peer-checked:after:border-white"
            >
              <span className={`absolute top-1/2 -translate-y-1/2 text-lg transition-all duration-300 ${isDarkMode ? 'left-1 text-gray-800' : 'right-1 text-white'}`}>
              </span>
            </div>
            {/* Label */}
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;
