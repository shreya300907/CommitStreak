'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        aria-label="Loading theme" 
        style={{ width: '40px', height: '40px', border: 'none', background: 'transparent' }} 
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={`${isDark ? 'text-[#d0bcff]' : 'text-[#6d3bd7]' } inline-flex justify-center items-center sm:w-10 sm:h-10 w-5 h-5 cursor-pointer bg-transparent transform ease-in-out duration-200 transition-all`}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {isDark ? (
        <Sun className="sm:h-6 sm:w-6 w-4 h-4" fill="#d0bcff" strokeWidth={2} />
      ) : (
        <Moon className="sm:h-6 sm:w-6 w-4 h-4" fill="#6d3bd7" strokeWidth={2} />
      )}
    </button>
  );
}