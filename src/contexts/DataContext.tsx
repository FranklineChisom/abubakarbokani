'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlogPost, Publication, SiteConfig, ContactMessage, Course, Comment } from '../types';
import { SITE_CONFIG as DEFAULT_CONFIG } from '../constants';
import { supabase } from '../lib/supabase';

interface DataContextType {
  siteConfig: SiteConfig;
  updateSiteConfig: (config: SiteConfig) => Promise<boolean>;
  
  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => Promise<boolean>;
  updateBlogPost: (post: BlogPost) => Promise<boolean>;
  deleteBlogPost: (id: string) => Promise<boolean>;
  
  publications: Publication[];
  addPublication: (pub: Publication) => Promise<boolean>;
  updatePublication: (pub: Publication) => Promise<boolean>;
  deletePublication: (id: string) => Promise<boolean>;
  
  courses: Course[];
  addCourse: (course: Course) => Promise<boolean>;
  updateCourse: (course: Course) => Promise<boolean>;
  deleteCourse: (id: string) => Promise<boolean>;

  messages: ContactMessage[];
  addMessage: (msg: ContactMessage) => Promise<boolean>;
  markMessageRead: (id: string) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  
  comments: Comment[];
  loadComments: () => Promise<void>;
  approveComment: (id: string) => Promise<boolean>;
  deleteComment: (id: string) => Promise<boolean>;
  addAdminReply: (postId: string, content: string, parentId?: string) => Promise<boolean>;

  updateLikes: (id: string, delta: number) => Promise<boolean>; // Changed from updateClaps
  
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const hasCookie = document.cookie.split(';').some((item) => item.trim().startsWith('admin_session='));
      if (storedAuth === 'true' || hasCookie) setIsAuthenticated(true);
    };
    checkAuth();
    loadPublicData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadPrivilegedData();
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, [isAuthenticated]);

  const loadPublicData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadSiteConfig(), loadBlogPosts(), loadPublications(), loadCourses()]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPrivilegedData = async () => {
    await Promise.all([loadMessages(), loadComments()]);
  };

  const loadSiteConfig = async () => {
    const { data } = await supabase.from('site_config').select('*').single();
    if (data) {
      setSiteConfig({
        name: data.name, role: data.role, tagline: data.tagline,
        focusText: data.focus_text, focusLink: data.focus_link, focusContent: data.focus_content,
        researchIntro: data.research_intro, researchInterests: data.research_interests,
        aboutImage: data.about_image, email: data.email, location: data.location,
        social: data.social, analyticsUrl: data.analytics_url
      });
    }
  };

  const loadBlogPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*');
    if (data) {
      setBlogPosts(data.map((p: any) => ({ 
          ...p, 
          readTime: p.read_time, 
          coverImage: p.cover_image,
          likes: p.likes || 0 // Map likes
      })));
    }
  };

  const loadPublications = async () => {
    const { data } = await supabase.from('publications').select('*');
    if (data) setPublications(data.map((p: any) => ({ ...p, coAuthors: p.co_authors })));
  };

  const loadCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (data) setCourses(data.map((c: any) => ({ ...c, materialLink: c.material_link })));
  };

  const loadMessages = async () => {
    const { data } = await supabase.from('messages').select('*').is('deleted_at', null).order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const loadComments = async () => {
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
    if (data) setComments(data);
  };

  const updateSiteConfig = async (config: SiteConfig) => {
    const { data: existing } = await supabase.from('site_config').select('id').single();
    const payload = {
        name: config.name, role: config.role, tagline: config.tagline,
        focus_text: config.focusText, focus_link: config.focusLink, focus_content: config.focusContent,
        research_intro: config.researchIntro, research_interests: config.researchInterests,
        about_image: config.aboutImage, email: config.email, location: config.location,
        social: config.social, analytics_url: config.analyticsUrl, updated_at: new Date().toISOString()
    };
    const { error } = existing 
      ? await supabase.from('site_config').update(payload).eq('id', existing.id)
      : await supabase.from('site_config').insert([payload]);
    if (!error) setSiteConfig(config);
    return !error;
  };

  // Blog
  const addBlogPost = async (post: BlogPost) => {
    const { error } = await supabase.from('blog_posts').insert({
      id: post.id, slug: post.slug, title: post.title, date: post.date, 
      read_time: post.readTime, excerpt: post.excerpt, content: post.content, cover_image: post.coverImage, published: post.published
    });
    if (!error) await loadBlogPosts();
    return !error;
  };
  const updateBlogPost = async (post: BlogPost) => {
    const { error } = await supabase.from('blog_posts').update({
      slug: post.slug, title: post.title, date: post.date, 
      read_time: post.readTime, excerpt: post.excerpt, content: post.content, cover_image: post.coverImage, published: post.published
    }).eq('id', post.id);
    if (!error) await loadBlogPosts();
    return !error;
  };
  const deleteBlogPost = async (id: string) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) await loadBlogPosts();
    return !error;
  };

  // Publications
  const addPublication = async (pub: Publication) => {
    const { error } = await supabase.from('publications').insert({
      id: pub.id, title: pub.title, year: pub.year, venue: pub.venue, type: pub.type, featured: pub.featured,
      abstract: pub.abstract, co_authors: pub.coAuthors, link: pub.link, published: pub.published
    });
    if (!error) await loadPublications();
    return !error;
  };
  const updatePublication = async (pub: Publication) => {
    const { error } = await supabase.from('publications').update({
      title: pub.title, year: pub.year, venue: pub.venue, type: pub.type, featured: pub.featured,
      abstract: pub.abstract, co_authors: pub.coAuthors, link: pub.link, published: pub.published
    }).eq('id', pub.id);
    if (!error) await loadPublications();
    return !error;
  };
  const deletePublication = async (id: string) => {
    const { error } = await supabase.from('publications').delete().eq('id', id);
    if (!error) await loadPublications();
    return !error;
  };

  // Courses
  const addCourse = async (course: Course) => {
    const { error } = await supabase.from('courses').insert({
      id: course.id, code: course.code, title: course.title, description: course.description,
      level: course.level, semester: course.semester, material_link: course.materialLink, published: course.published
    });
    if (!error) await loadCourses();
    return !error;
  };
  const updateCourse = async (course: Course) => {
    const { error } = await supabase.from('courses').update({
      code: course.code, title: course.title, description: course.description,
      level: course.level, semester: course.semester, material_link: course.materialLink, published: course.published
    }).eq('id', course.id);
    if (!error) await loadCourses();
    return !error;
  };
  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (!error) await loadCourses();
    return !error;
  };

  // Messages
  const addMessage = async (msg: ContactMessage) => {
    const { error } = await supabase.from('messages').insert(msg);
    if (!error) await loadMessages();
    return !error;
  };
  const markMessageRead = async (id: string) => {
    const { error } = await supabase.from('messages').update({ read: true }).eq('id', id);
    if (!error) await loadMessages();
    return !error;
  };
  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from('messages').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (!error) await loadMessages();
    return !error;
  };

  // Comments & Likes
  const approveComment = async (id: string) => {
    const { error } = await supabase.from('comments').update({ approved: true }).eq('id', id);
    if (!error) await loadComments();
    return !error;
  };
  const deleteComment = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) await loadComments();
    return !error;
  };
  const addAdminReply = async (postId: string, content: string, parentId?: string) => {
    const { error } = await supabase.from('comments').insert({
      id: `comment_${Date.now()}`, post_id: postId, author_name: "Dr. Abubakar Bokani",
      content: content, approved: true, created_at: new Date().toISOString(), parent_id: parentId
    });
    if (!error) await loadComments();
    return !error;
  };

  // UPDATED: Likes logic
  const updateLikes = async (id: string, delta: number) => {
    const { data: current } = await supabase.from('blog_posts').select('likes').eq('id', id).single();
    
    // If null, assume 0
    const currentLikes = current ? (current.likes || 0) : 0;
    
    const newCount = Math.max(0, currentLikes + delta);
    const { error } = await supabase.from('blog_posts').update({ likes: newCount }).eq('id', id);
    
    if (!error) {
        setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, likes: newCount } : p));
    }
    return !error;
  };

  const login = async (email: string, password: string) => {
    const { data } = await supabase.from('admin_auth').select('password_hash').eq('admin_email', email).single();
    if (data && data.password_hash === password) {
      setIsAuthenticated(true);
      document.cookie = `admin_session=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      return true;
    }
    return false;
  };
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    document.cookie = 'admin_session=; path=/; max-age=0;';
  };

  return (
    <DataContext.Provider value={{
      siteConfig, updateSiteConfig,
      blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
      publications, addPublication, updatePublication, deletePublication,
      courses, addCourse, updateCourse, deleteCourse,
      messages, addMessage, markMessageRead, deleteMessage,
      comments, loadComments, approveComment, deleteComment, addAdminReply,
      updateLikes, isAuthenticated, login, logout, isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};