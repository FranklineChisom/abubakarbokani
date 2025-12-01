import React from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
            <section id="forthcoming" className="mb-16">
                {(courses && courses.length > 0) ? (
                    courses.map((course: any) => (
                        <article key={course.id} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {course.title} 
                                {course.code && <span className="text-sm font-normal text-gray-500 ml-2">({course.code})</span>}
                            </h3>
                            <div className="text-gray-700 mb-2 prose prose-sm max-w-none">
                                <ReactMarkdown>{course.description}</ReactMarkdown>
                            </div>
                            {course.material_link && (
                                <a href={course.material_link} target="_blank" className="text-sm text-red-600 hover:text-red-800 underline">
                                    View Course Materials
                                </a>
                            )}
                        </article>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No active courses listed at the moment.</p>
                )}
            </section>
        </div>

        {/* Sidebar */}
        <Sidebar />
    </div>
  );
}