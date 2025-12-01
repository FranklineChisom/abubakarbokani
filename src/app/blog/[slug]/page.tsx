import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CommentSection from '@/components/CommentSection';
import { SITE_CONFIG } from '@/constants';
import LikeButton from '@/components/LikeButton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (data) {
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      date: data.date,
      readTime: data.read_time,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.cover_image,
      published: data.published,
      likes: data.likes || 0
    };
  }

  const { data: dataById } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', slug)
    .single();

  if (dataById) {
      return {
      id: dataById.id,
      slug: dataById.slug,
      title: dataById.title,
      date: dataById.date,
      readTime: dataById.read_time,
      excerpt: dataById.excerpt,
      content: dataById.content,
      coverImage: dataById.cover_image,
      published: dataById.published,
      likes: dataById.likes || 0
    };
  }

  return null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPost(params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      type: 'article',
      publishedTime: post.date,
      authors: [SITE_CONFIG.name],
      url: `https://abubakarbokani.com/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    }
  };
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <Link 
            href="/blog" 
            className="group inline-flex items-center text-sm font-medium text-gray-500 hover:text-accent mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Writings
          </Link>
          
          <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium mb-4 text-gray-500">
                  <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {post.readTime}
                  </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-3 py-4 border-t border-gray-200">
                  <div className="w-10 h-10 relative overflow-hidden rounded-full bg-gray-200 border border-gray-200">
                      <img 
                        src={SITE_CONFIG.aboutImage} 
                        alt={SITE_CONFIG.name}
                        className="object-cover w-full h-full"
                      />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-gray-900">{SITE_CONFIG.name}</p>
                      <p className="text-xs text-gray-500">{SITE_CONFIG.role}</p>
                  </div>
              </div>
          </header>

          {post.coverImage && (
            <div className="mb-10 relative w-full rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-video w-full relative bg-gray-50">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <article className="prose prose-slate w-full max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 
            prose-p:text-gray-700 prose-p:leading-7 
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline 
            prose-img:rounded-lg prose-img:shadow-sm prose-img:w-full
            prose-blockquote:border-l-accent prose-blockquote:bg-white prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:text-gray-600 prose-blockquote:not-italic
            break-words">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>
          
          <hr className="my-12 border-gray-200" />

          <div className="flex flex-col items-center space-y-8">
             <LikeButton id={post.id} initialLikes={post.likes || 0} />
             <div className="w-full">
                <CommentSection postId={post.id} />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}