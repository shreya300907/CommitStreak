'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react'; 
import ThemeToggle from './themeToggle';
import { usePathname } from 'next/navigation';

export default function DashboardNav(){

  const pathname = usePathname();

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
    <header className="sticky top-0 left-0 right-0 z-50 w-full bg-background/70 backdrop-blur-md  transition-colors duration-200  shadow-md shadow-primary-text">
      <div className="max-w-[100vw] mx-auto px-2 sm:px-6 lg:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 sm:gap-3 group">
          <div className="bg-btn-bg text-btn-text p-1.5 rounded-md flex items-center justify-center transition-transform group-hover:scale-105">
            <Zap className="sm:w-5 sm:h-5 w-3 h-3" fill="currentColor" strokeWidth={0} />
          </div>
          <span className="font-sans font-[900] text-[16px] sm:text-xl text-foreground tracking-tight">
            CommitStreak
          </span>
        </Link>
        <div className="flex gap-12">
            {TABS.map((tab)=>(
                <Link 
                    key={tab.label}
                    href={tab.href}
                    className={` ${pathname === tab.href ? "font-bold pb-1 border-b-2 border-btn-bg" : "text-primary-text"} text-md `}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
        <div className="flex items-center gap-[2px] sm:gap-2">
          <ThemeToggle />

          <div className="flex items-center gap-1 sm:gap-4">
            <button
              onClick={handleLogOut}
                className="bg-red-600 cursor-pointer text-background text-[10px] sm:text-sm font-medium px-2 sm:px-4 py-2 rounded-md transition-all duration-200 hover:opacity-90 active:scale-95 shadow-xs"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}