'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '@/contexts/DataContext';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useData();
  const pathname = usePathname();

  // Helper to check active state if needed, though original site didn't seem to highlight active strongly
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center items-center">
                <div className="flex space-x-1 md:space-x-4 py-4 overflow-x-auto">
                    <a href="/resume/AbubakarBokaniCV.pdf" target="_blank" download="AbubakarBokaniCV.pdf" className="text-gray-400 hover:text-gray-300 px-2 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap">CV</a>
                    
                    <Link href="/research" className={`${isActive('/research') ? 'text-white' : 'text-gray-400'} hover:text-gray-300 px-2 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap`}>
                        WRITINGS
                    </Link>
                    
                    <Link href="/courses" className={`${isActive('/courses') ? 'text-white' : 'text-gray-400'} hover:text-gray-300 px-2 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap`}>
                        COURSES
                    </Link>
                    
                    <a href="https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=7493816" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-300 px-2 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap">
                        SSRN
                    </a>
                    
                    <Link href="/blog" className="text-gray-400 hover:text-gray-300 px-2 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap">
                        BLOG
                    </Link>
                    
                    <a href="https://www.linkedin.com/in/abubakar-bokani-mohammed-997380296/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-300 px-2 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap">
                        LINKEDIN
                    </a>

                    {isAuthenticated && (
                        <Link href="/admin" className="text-red-400 hover:text-red-300 px-2 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap">
                            ADMIN
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;