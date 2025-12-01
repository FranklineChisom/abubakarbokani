'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  
  // Admin pages have their own layout
  const isAdmin = pathname?.startsWith('/admin') || pathname === '/login';

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Hero />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 lg:py-16">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default ClientLayout;