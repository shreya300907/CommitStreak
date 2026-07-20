'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Menu, X } from 'lucide-react'; 
import ThemeToggle from './themeToggle';
import { usePathname } from 'next/navigation';

export default function DashboardNav(){
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogOut(){
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/register&login";
  }

  const TABS = [
    { href: "/dashboard/focus", label: "Focus" },
    { href: "/dashboard/codeforces", label: "Codeforces" },
    { href: "/dashboard/leetcode", label: "LeetCode" },
    { href: "/dashboard/github", label: "GitHub" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full bg-background border-b border-primary-text/10 h-16 flex items-center">
      <div className="w-full mx-auto pl-4 pr-2 sm:px-6 lg:px-6 flex items-center justify-between">
        
        <Link href="/dashboard/focus" className="flex items-center gap-2 group z-50">
          <div className="bg-btn-bg text-btn-text p-1.5 rounded-md flex items-center justify-center">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" strokeWidth={0} />
          </div>
          <span className="font-sans font-[900] text-lg sm:text-xl text-foreground tracking-tight">
            CommitStreak
          </span>
        </Link>

        <div className="hidden md:flex gap-8 lg:gap-12">
          {TABS.map((tab)=>(
            <Link 
              key={tab.label}
              href={tab.href}
              className={`${pathname === tab.href ? "font-bold pb-1 border-b-2 border-btn-bg text-foreground" : "text-primary-text"} text-md`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleLogOut}
            className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden z-50 text-foreground my-auto"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      <div className={`fixed top-16 left-0 right-0 bottom-0 z-40 bg-background w-full h-[calc(100vh-4rem)] flex flex-col justify-between px-6 py-8 md:hidden transition-all duration-200 ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible pointer-events-none'}`}>
        <div className="flex flex-col gap-6">
          {TABS.map((tab)=>(
            <Link 
              key={tab.label}
              href={tab.href}
              onClick={() => setIsOpen(false)}
              className={`${pathname === tab.href ? "font-bold text-btn-bg border-l-4 border-btn-bg pl-3" : "text-primary-text pl-3"} text-xl`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="border-t border-primary-text/10 pt-6 flex flex-col gap-6 bg-background">
          <div className="flex items-center justify-between px-3">
            <span className="text-primary-text font-medium text-base">Switch Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogOut}
            className="w-full bg-red-600 text-white text-center font-medium py-3 rounded-md text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}