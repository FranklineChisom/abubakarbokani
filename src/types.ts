export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readTime: string;
  coverImage?: string;
  published: boolean;
  likes?: number; // Changed from claps
}

export interface Publication {
  id: string;
  title: string;
  year: string;
  venue: string;
  type: 'Journal Article' | 'Book Chapter' | 'Policy Paper' | 'Conference Paper';
  link?: string;
  featured?: boolean;
  abstract?: string;
  coAuthors?: string[];
  published: boolean;
}

export interface Course {
  id: string;
  code?: string;
  title: string;
  description: string;
  level?: string;
  semester?: string;
  materialLink?: string;
  published: boolean;
}

export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
  focusText: string;
  focusLink: string;
  focusContent: string;
  researchIntro: string;
  researchInterests: string;
  aboutImage: string;
  email: string;
  location: string;
  social: SocialConfig;
  analyticsUrl?: string;
}

export interface SocialConfig {
  linkedin: string;
  twitter: string;
  scholar: string;
  ssrn?: string;
  facebook?: string;
  instagram?: string;
}

export interface ContactMessage {
  id: string;
  date: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied?: boolean;
  deleted_at?: string | null;
  created_at?: string; 
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email?: string; 
  content: string;
  approved: boolean;
  created_at: string;
  parent_id?: string | null;
  replies?: Comment[];
}