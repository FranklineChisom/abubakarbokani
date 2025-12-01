import React from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { Publication } from '@/types';

export const dynamic = 'force-dynamic';

export default async function WritingsPage() {
  const { data: publications } = await supabase
    .from('publications')
    .select('*')
    .eq('published', true)
    .order('year', { ascending: false });

  // Group publications by type
  const groupedPubs: Record<string, Publication[]> = {};
  
  if (publications) {
    publications.forEach((pub: any) => {
      const type = pub.type || 'Other';
      if (!groupedPubs[type]) {
        groupedPubs[type] = [];
      }
      groupedPubs[type].push(pub);
    });
  }

  // Define the order of categories as seen on the original site, plus any others
  const categoryOrder = [
    'Constitutional Law',
    'Land and Property Law',
    'Law of Trusts',
    'Gender and the Law',
    'International & Human Rights Law', 
    'Legal History & Education',
    'Conference Paper',
    'Journal Article',
    'Book Chapter', 
    'Policy Paper'
  ];

  // Get sorted keys, putting known categories first, then any others alphabetically
  const sortedCategories = Object.keys(groupedPubs).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Writings</h1>

            {/* Category Navigation */}
            <nav className="mb-12 hidden md:block">
                <ul className="space-y-3 text-lg">
                    {sortedCategories.map(category => (
                        <li key={category}>
                            <a href={`#${category.replace(/\s+/g, '-').toLowerCase()}`} className="text-red-700 hover:text-red-800 font-semibold">
                                {category}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <hr className="border-gray-300 my-12" />

            {sortedCategories.length > 0 ? (
                sortedCategories.map(category => (
                    <section key={category} id={category.replace(/\s+/g, '-').toLowerCase()} className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">{category}</h2>
                        
                        <div className="space-y-8">
                            {groupedPubs[category].map((pub) => (
                                <article key={pub.id} className="mb-6">
                                    <div className="text-gray-700 mb-2 leading-relaxed">
                                        <span className="italic font-medium">&quot;{pub.title}&quot;</span> 
                                        {pub.venue && <span> {pub.venue}</span>}
                                        {pub.coAuthors && pub.coAuthors.length > 0 && <span> (with {pub.coAuthors.join(', ')})</span>}
                                        {pub.year && <span> ({pub.year})</span>}.
                                    </div>
                                    
                                    {pub.abstract && (
                                        <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-3">{pub.abstract}</p>
                                    )}

                                    {pub.link && (
                                        <a 
                                            href={pub.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm text-red-600 hover:text-red-800 underline inline-block mt-1"
                                        >
                                            Read Publication
                                        </a>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <p className="text-gray-500 italic">No publications found.</p>
            )}
        </div>

        {/* Sidebar */}
        <Sidebar />
    </div>
  );
}