'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { BlogPost } from '@/types';

interface BlogListProps {
  initialPosts: BlogPost[];
}

const ITEMS_PER_PAGE = 5;

const BlogList: React.FC<BlogListProps> = ({ initialPosts }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Use initialPosts passed from server
  const publishedPosts = initialPosts.filter(post => post.published);

  const totalPages = Math.ceil(publishedPosts.length / ITEMS_PER_PAGE);
  const currentPosts = publishedPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-16 py-12">
      {/* Intro */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-sans text-4xl md:text-5xl text-gray-900 font-bold mb-6">Blog</h1>
        <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mb-10">
          Thoughts on law, policy, and contemporary legal issues in Nigeria and beyond.
        </p>
        
        <SearchBar 
          blogPosts={publishedPosts} 
          scope="blog"
          placeholder="Search articles..."
        />
      </div>

      {/* Posts List */}
      <div className="grid gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {currentPosts.length > 0 ? currentPosts.map((post) => (
          <article key={post.id} className="group border-b border-gray-100 pb-12 last:border-0">
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
                <div className="md:w-1/4 flex-shrink-0">
                    <div className="text-sm text-gray-400 font-mono mb-1 flex items-center gap-2">
                        <Calendar size={14} /> {post.date}
                    </div>
                    {post.readTime && (
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                            <Clock size={12} /> {post.readTime}
                        </div>
                    )}
                </div>
                
                <div className="md:w-3/4">
                    <Link href={`/blog/${post.slug || post.id}`}>
                        <h2 className="font-sans text-2xl text-gray-900 font-bold mb-3 group-hover:text-red-700 transition-colors cursor-pointer leading-tight">
                        {post.title}
                        </h2>
                    </Link>
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug || post.id}`} className="inline-flex items-center text-sm font-bold text-red-600 hover:text-red-800 uppercase tracking-wide transition-colors mt-2">
                        Read Article <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
          </article>
        )) : (
          <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-500 italic">No articles published yet.</p>
          </div>
        )}
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default BlogList;