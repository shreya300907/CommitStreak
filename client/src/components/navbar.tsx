'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react'; 
import ThemeToggle from './themeToggle';

export default function Navbar() {

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full bg-background/70 backdrop-blur-md  transition-colors duration-200 shadow-md shadow-primary-text">
      <div className="max-w-[100vw] mx-auto px-2 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 sm:gap-3 group">
          <div className="bg-btn-bg text-btn-text p-1.5 rounded-md flex items-center justify-center transition-transform group-hover:scale-105">
            <Zap className="sm:w-5 sm:h-5 w-3 h-3" fill="currentColor" strokeWidth={0} />
          </div>
          <span className="font-sans font-[900] text-[16px] sm:text-xl text-foreground tracking-tight">
            CommitStreak
          </span>
        </Link>

        <div className="flex items-center gap-[2px] sm:gap-1">
          <ThemeToggle />

          <div className="flex items-center gap-1 sm:gap-4">
            {/* <Link 
              href="/login" 
              className="text-[10px] sm:text-sm px-2 sm:px-4 py-2 font-medium text-primary-text border-[0.5px] border-transparent hover:text-foreground hover:border-btn-bg rounded-md transition-all duration-300 ease-in-out"
            >
              Login
            </Link> */}
            <Link
              href="/register&login"
              className="bg-btn-bg text-btn-text text-[10px] sm:text-sm font-medium px-2 sm:px-4 py-2 rounded-md transition-all duration-200 hover:opacity-90 active:scale-95 shadow-xs"
            >
              Login / Register
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}