'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileText, BookOpen, Settings, LogOut, 
  Menu, X, MessageSquare, GraduationCap 
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';

// --- Login Component (Internal) ---
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useData();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.refresh(); 
      router.push('/admin'); 
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full border border-slate-100">
        <h1 className="text-2xl font-sans text-primary mb-6 text-center">Dr. Bokani Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded p-3 focus:border-accent focus:outline-none transition-colors"
              placeholder="admin@abu.edu.ng"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded p-3 focus:border-accent focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm font-medium">Invalid credentials.</p>}
          <button type="submit" className="w-full bg-accent text-white py-3 rounded hover:bg-blue-700 transition-colors font-bold">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Nav Helper ---
const AdminLink = ({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) => {
  const pathname = usePathname();
  const isActive = href === '/admin' 
    ? (pathname === '/admin' || pathname === '/admin/') 
    : pathname.startsWith(href);
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 border-l-4 transition-all duration-200 ${
        isActive 
          ? 'bg-slate-800 text-white border-accent' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent hover:border-slate-600'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

// --- Main Layout ---
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useData();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth Protection
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-primary text-white p-4 flex justify-between items-center z-50 shadow-md">
        <div className="font-bold tracking-wide">Admin Console</div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        w-64 bg-primary text-slate-300 flex flex-col fixed h-full z-40 transition-transform duration-300 shadow-xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        pt-16 md:pt-0
      `}>
        <div className="p-6 hidden md:block border-b border-slate-800">
          <Link href="/" className="text-white font-sans text-xl font-bold tracking-wide hover:text-accent transition-colors">
            Dr. Bokani
          </Link>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          <AdminLink href="/admin" icon={<LayoutDashboard size={18} />} label="Overview" onClick={() => setIsSidebarOpen(false)} />
          <AdminLink href="/admin/courses" icon={<GraduationCap size={18} />} label="Courses" onClick={() => setIsSidebarOpen(false)} />
          <AdminLink href="/admin/publications" icon={<BookOpen size={18} />} label="Writings" onClick={() => setIsSidebarOpen(false)} />
          <AdminLink href="/admin/blog" icon={<FileText size={18} />} label="Blog" onClick={() => setIsSidebarOpen(false)} />
          <AdminLink href="/admin/comments" icon={<MessageSquare size={18} />} label="Comments" onClick={() => setIsSidebarOpen(false)} />
          <AdminLink href="/admin/settings" icon={<Settings size={18} />} label="Settings" onClick={() => setIsSidebarOpen(false)} />
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors w-full text-sm font-medium">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 pt-24 md:pt-12 transition-all max-w-7xl">
        {children}
      </main>
    </div>
  );
}