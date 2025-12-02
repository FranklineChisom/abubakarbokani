'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { useData } from '@/contexts/DataContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function AdminDashboard() {
  usePageTitle('Dashboard - Admin');
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({
    courses: { total: 0, published: 0 },
    articles: { total: 0, published: 0 },
    publications: { total: 0, published: 0 },
    // messages: { total: 0, unread: 0 }, // Removed
    comments: { total: 0, pending: 0 }
  });
  
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Counts
      const [
        { count: totalCourses }, { count: pubCourses },
        { count: totalPosts }, { count: pubPosts },
        { count: totalPubs }, { count: pubPubs },
        // { count: totalMsgs }, { count: unreadMsgs }, // Removed
        { count: totalComments }, { count: pendingComments }
      ] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('publications').select('*', { count: 'exact', head: true }),
        supabase.from('publications').select('*', { count: 'exact', head: true }).eq('published', true),
        // supabase.from('messages').select('*', { count: 'exact', head: true }), // Removed
        // supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false), // Removed
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('approved', false),
      ]);

      setCounts({
        courses: { total: totalCourses || 0, published: pubCourses || 0 },
        articles: { total: totalPosts || 0, published: pubPosts || 0 },
        publications: { total: totalPubs || 0, published: pubPubs || 0 },
        // messages: { total: totalMsgs || 0, unread: unreadMsgs || 0 }, // Removed
        comments: { total: totalComments || 0, pending: pendingComments || 0 }
      });

      // 2. Prepare Chart Data (Content Distribution)
      setActivityData([
        { name: 'Courses', value: totalCourses || 0, color: '#0b74de' }, // Accent
        { name: 'Writings', value: totalPubs || 0, color: '#111827' },   // Primary
        { name: 'Blog', value: totalPosts || 0, color: '#6b7280' },      // Gray
      ]);

    } catch (error) {
      console.error("Error fetching stats:", error);
      showToast("Failed to load statistics", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
      return (
          <div className="h-[60vh] flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
      );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
            <h2 className="text-3xl font-sans text-primary">Overview</h2>
            <p className="text-slate-500 text-sm mt-1">Welcome back, Dr. Bokani.</p>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Courses */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:border-accent/30 transition-colors">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Teaching</div>
          <div className="text-4xl font-bold text-accent">{counts.courses.total}</div>
          <div className="text-xs text-slate-500 mt-2">
             {counts.courses.published} active courses
          </div>
        </div>

        {/* Writings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:border-accent/30 transition-colors">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Publications</div>
          <div className="text-4xl font-bold text-primary">{counts.publications.total}</div>
          <div className="text-xs text-slate-500 mt-2">
             {counts.publications.published} published works
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:border-accent/30 transition-colors">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Comments</div>
          <div className="flex items-baseline gap-2">
             <div className="text-4xl font-bold text-primary">{counts.comments.pending}</div>
             <span className="text-sm text-slate-400">pending</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
             {counts.comments.total} total comments
          </div>
        </div>
      </div>

      {/* Content Chart */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
        <h3 className="font-sans text-lg text-primary mb-6">Content Distribution</h3>
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{fontSize: 14, fill: '#64748b'}} axisLine={false} tickLine={false} width={100} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                        cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                        {activityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};