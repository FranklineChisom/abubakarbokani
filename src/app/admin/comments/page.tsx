'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Trash2, MessageSquare, Clock, ExternalLink, Reply, X, Loader2, CornerDownRight } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';
import { Comment } from '@/types';

export default function CommentsManager() {
  usePageTitle('Manage Comments - Admin');
  const { comments, approveComment, deleteComment, blogPosts, addAdminReply } = useData(); 
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState<{ id: string, msg: string, type: 'success' | 'error' } | null>(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const getPost = (postId: string) => {
    return blogPosts.find(p => p.id === postId);
  };

  const getParentComment = (parentId?: string | null) => {
    if (!parentId) return null;
    return comments.find(c => c.id === parentId);
  };

  const filteredComments = comments.filter(c => {
    if (filter === 'pending') return !c.approved;
    if (filter === 'approved') return c.approved;
    return true;
  });

  const handleApprove = async (id: string) => {
    const success = await approveComment(id);
    if (success) showToast('Comment approved and published', 'success');
    else showToast('Failed to approve comment', 'error');
  };

  // Open Modal
  const requestDelete = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  // Actual Delete Action
  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    
    setIsDeleting(true);
    const success = await deleteComment(deleteModal.id);
    
    setIsDeleting(false);
    setDeleteModal({ isOpen: false, id: null });

    if (success) showToast('Comment permanently deleted', 'success');
    else showToast('Failed to delete comment', 'error');
  };

  const handleReplySubmit = async (commentId: string, postId: string) => {
      if (!replyContent.trim()) return;
      setIsSendingReply(true);
      setReplyFeedback(null);

      const success = await addAdminReply(postId, replyContent, commentId); 
      
      setIsSendingReply(false);
      
      if (success) {
        setReplyFeedback({ id: commentId, msg: 'Reply posted successfully', type: 'success' });
        setReplyContent('');
        // Close the reply box after a short delay so user sees the success message
        setTimeout(() => {
            setReplyFeedback(null);
            setReplyingTo(null);
        }, 2000);
      } else {
        setReplyFeedback({ id: commentId, msg: 'Failed to post reply', type: 'error' });
      }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => !isDeleting && setDeleteModal({ isOpen: false, id: null })}
        title="Delete Comment?"
        type="danger"
        actions={
            <>
                <button 
                    onClick={() => setDeleteModal({ isOpen: false, id: null })} 
                    disabled={isDeleting}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button 
                    onClick={confirmDelete} 
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                >
                    {isDeleting && <Loader2 size={14} className="animate-spin" />}
                    {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
            </>
        }
      >
        <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
      </Modal>

      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-serif text-slate-800">Comments</h2>
            <p className="text-slate-500 text-sm mt-1">Moderate discussion on your articles</p>
        </div>
        <div className="flex bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden p-1 gap-1">
            <button 
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${filter === 'pending' ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Pending
            </button>
            <button 
                onClick={() => setFilter('approved')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${filter === 'approved' ? 'bg-green-100 text-green-800' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Approved
            </button>
            <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${filter === 'all' ? 'bg-slate-100 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                All
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-lg">
                <MessageSquare size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500">No {filter} comments found.</p>
            </div>
        ) : (
            filteredComments.map(comment => {
                const post = getPost(comment.post_id);
                const parentComment = getParentComment(comment.parent_id);

                return (
                <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                {comment.author_name}
                                {!comment.approved && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Pending</span>}
                                {comment.author_email && (
                                    <span className="text-xs font-normal text-slate-400 ml-1 border-l border-slate-200 pl-2">
                                        {comment.author_email}
                                    </span>
                                )}
                            </h4>
                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(comment.created_at).toLocaleString()}</span>
                                <span>on</span>
                                {post ? (
                                    <Link href={`/blog/${post.slug}`} target="_blank" className="text-primary font-medium hover:underline flex items-center gap-1">
                                        {post.title} <ExternalLink size={10} />
                                    </Link>
                                ) : (
                                    <span className="text-slate-500 italic">Unknown Post</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {!comment.approved && (
                                <button 
                                    onClick={() => handleApprove(comment.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors" 
                                    title="Approve"
                                >
                                    <Check size={18} />
                                </button>
                            )}
                            <button 
                                onClick={() => {
                                    setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                    setReplyFeedback(null);
                                }}
                                className={`p-2 rounded-full transition-colors ${replyingTo === comment.id ? 'bg-primary text-white' : 'text-slate-400 hover:text-primary hover:bg-slate-50'}`}
                                title="Reply as Admin"
                            >
                                <Reply size={18} />
                            </button>
                            <button 
                                onClick={() => requestDelete(comment.id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" 
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Context: Parent Comment Display */}
                    {parentComment && (
                        <div className="mb-3 ml-1 pl-3 border-l-2 border-slate-200/60">
                            <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                                <CornerDownRight size={10} />
                                <span>Replying to <strong>{parentComment.author_name}</strong>:</span>
                            </div>
                            <div className="text-xs text-slate-500 italic line-clamp-2 bg-slate-50 p-2 rounded-sm">
                                &quot;{parentComment.content}&quot;
                            </div>
                        </div>
                    )}
                    
                    <div className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-100">
                        {comment.content}
                    </div>

                    {/* Admin Reply Box */}
                    {replyingTo === comment.id && (
                        <div className="mt-4 pl-4 border-l-2 border-slate-200 animate-in slide-in-from-top-2">
                            {replyFeedback && replyFeedback.id === comment.id && (
                                <div className={`text-xs font-medium mb-2 ${replyFeedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {replyFeedback.msg}
                                </div>
                            )}
                            
                            <textarea 
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Reply to ${comment.author_name} as Admin...`}
                                className="w-full border border-slate-200 rounded-md p-3 text-sm focus:outline-none focus:border-primary mb-2"
                                rows={3}
                            />
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => setReplyingTo(null)}
                                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleReplySubmit(comment.id, comment.post_id)}
                                    disabled={isSendingReply || !replyContent.trim()}
                                    className="px-4 py-1.5 bg-primary text-white text-xs font-medium rounded-sm hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSendingReply ? <Loader2 size={12} className="animate-spin" /> : null}
                                    {isSendingReply ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                );
            })
        )}
      </div>
    </div>
  );
}