'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Comment } from '@/types';
import { Loader2, Send, MessageSquare, Reply, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

interface Feedback {
  parentId: string | null;
  type: 'success' | 'error';
  message: string;
}

// Extracted CommentNode to prevent re-creation on re-renders.
const CommentNode = ({ 
  comment, 
  depth = 0, 
  replyingTo, 
  setReplyingTo, 
  handleSubmit, 
  submitting,
  author,
  setAuthor,
  email,
  setEmail,
  content,
  setContent,
  feedback
}: { 
  comment: Comment; 
  depth?: number;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  handleSubmit: (e: React.FormEvent, parentId: string | null) => void;
  submitting: boolean;
  author: string;
  setAuthor: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  feedback: Feedback | null;
}) => (
  <div className={`mb-6 ${depth > 0 ? 'ml-6 md:ml-12 border-l-2 border-slate-100 pl-4' : ''}`}>
    <div className="bg-slate-50 p-6 rounded-sm border border-slate-100">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-primary text-sm">{comment.author_name}</span>
        <span className="text-xs text-slate-400 font-mono">
          {new Date(comment.created_at).toLocaleDateString(undefined, { 
            year: 'numeric', month: 'short', day: 'numeric' 
          })}
        </span>
      </div>
      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap mb-3">{comment.content}</p>
      
      {/* Reply Button */}
      <button 
        onClick={() => {
            if (replyingTo !== comment.id) {
                setReplyingTo(comment.id);
                // Reset form fields when switching reply target
                setAuthor('');
                setEmail('');
                setContent('');
            } else {
                setReplyingTo(null);
            }
        }}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition-colors font-medium"
      >
        <Reply size={12} /> Reply
      </button>
    </div>

    {/* Reply Form */}
    {replyingTo === comment.id && (
      <div className="mt-4 ml-4 md:ml-8 animate-in slide-in-from-top-2">
         <form onSubmit={(e) => handleSubmit(e, comment.id)} className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Reply to {comment.author_name}</h5>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                    type="text" 
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors rounded-none"
                    placeholder="Your name"
                    required
                />
                <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors rounded-none"
                    placeholder="Email (optional, private)"
                />
              </div>
              <textarea 
                rows={3}
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors rounded-none resize-y"
                placeholder="Write your reply..."
                required
              />
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                    <button 
                    type="button" 
                    onClick={() => setReplyingTo(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 px-3 py-2"
                    >
                    Cancel
                    </button>
                    <button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-primary text-white px-4 py-2 text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70 rounded-none"
                    >
                    {submitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                    Submit Reply
                    </button>
                </div>

                {/* Inline Feedback for Reply */}
                {feedback && feedback.parentId === comment.id && (
                    <div className={`text-xs flex items-center gap-1.5 mt-1 px-2 py-1 rounded ${feedback.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {feedback.message}
                    </div>
                )}
              </div>
            </div>
         </form>
      </div>
    )}

    {/* Nested Replies */}
    {comment.replies && comment.replies.length > 0 && (
      <div className="mt-4">
        {comment.replies.map(reply => (
          <CommentNode 
            key={reply.id} 
            comment={reply} 
            depth={depth + 1} 
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            handleSubmit={handleSubmit}
            submitting={submitting}
            author={author}
            setAuthor={setAuthor}
            email={email}
            setEmail={setEmail}
            content={content}
            setContent={setContent}
            feedback={feedback}
          />
        ))}
      </div>
    )}
  </div>
);

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Feedback State
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Form State
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState(''); 
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: true });
    
    if (data) setComments(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    setFeedback(null); // Clear previous feedback

    if (!author.trim() || !content.trim()) {
        setFeedback({
            parentId,
            type: 'error',
            message: 'Name and Comment are required.'
        });
        return;
    }

    setSubmitting(true);

    const newComment = {
      id: `comment_${Date.now()}`,
      post_id: postId,
      author_name: author,
      author_email: email.trim() || null, 
      content: content,
      approved: false, 
      created_at: new Date().toISOString(),
      parent_id: parentId
    };

    try {
        const { error } = await supabase.from('comments').insert(newComment);

        if (error) {
          throw error;
        }

        setSubmitting(false);
        setFeedback({
            parentId,
            type: 'success',
            message: 'Thank you! Your comment has been submitted and is pending approval.'
        });
        
        // Reset fields
        setAuthor('');
        setEmail('');
        setContent('');
        
        // If reply, close after short delay to allow reading message
        if (parentId) {
             setTimeout(() => {
                 if (replyingTo === parentId) {
                     setReplyingTo(null);
                     setFeedback(null);
                 }
             }, 3000);
        } else {
            // Clear root feedback after delay
            setTimeout(() => setFeedback(null), 5000);
        }
        
    } catch (err: any) {
        setSubmitting(false);
        setFeedback({
            parentId,
            type: 'error',
            message: err.message || 'Failed to submit. Please try again.'
        });
    }
  };

  // Helper to nest comments
  const buildCommentTree = (flatComments: Comment[]) => {
    const map = new Map<string, Comment>();
    const roots: Comment[] = [];

    flatComments.forEach(c => {
      map.set(c.id, { ...c, replies: [] });
    });

    flatComments.forEach(c => {
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id)!.replies!.push(map.get(c.id)!);
      } else {
        roots.push(map.get(c.id)!);
      }
    });

    return roots;
  };

  const commentTree = buildCommentTree(comments);

  return (
    <div className="pt-16 mt-16 border-t border-slate-100">
      <h3 className="font-sans text-2xl text-primary mb-8 flex items-center gap-2">
        <MessageSquare size={24} /> Discussion
      </h3>

      {/* Comment List */}
      <div className="mb-12">
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading comments...
          </div>
        ) : commentTree.length > 0 ? (
          commentTree.map((comment) => (
            <CommentNode 
                key={comment.id} 
                comment={comment} 
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                handleSubmit={handleSubmit}
                submitting={submitting}
                author={author}
                setAuthor={setAuthor}
                email={email}
                setEmail={setEmail}
                content={content}
                setContent={setContent}
                feedback={feedback}
            />
          ))
        ) : (
          <p className="text-slate-500 italic text-sm mb-8">No comments yet. Be the first to share your thoughts.</p>
        )}
      </div>

      {/* Root Comment Form */}
      {!replyingTo && (
        <div className="bg-white rounded-sm border border-slate-200 p-6 md:p-8 shadow-sm">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-6">Leave a Comment</h4>
          
          <form onSubmit={(e) => handleSubmit(e, null)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                    <input 
                        type="text" 
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 focus:outline-none focus:border-primary transition-colors rounded-none"
                        placeholder="Your name"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email <span className="text-slate-400 font-normal normal-case">(Optional, Private)</span></label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 focus:outline-none focus:border-primary transition-colors rounded-none"
                        placeholder="Your email address"
                    />
                </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Comment</label>
              <textarea 
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 focus:outline-none focus:border-primary transition-colors rounded-none resize-y"
                placeholder="Join the discussion..."
                required
              />
            </div>
            <div className="flex flex-col items-start gap-3">
                <button 
                type="submit" 
                disabled={submitting}
                className="bg-primary text-white px-6 py-3 font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70 rounded-none text-sm"
                >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Post Comment
                </button>
                
                {/* Inline Feedback for Root Form */}
                {feedback && feedback.parentId === null && (
                    <div className={`text-sm flex items-center gap-2 mt-2 px-3 py-2 rounded ${feedback.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {feedback.message}
                    </div>
                )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommentSection;