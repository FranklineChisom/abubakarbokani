'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

interface LikeButtonProps {
  id: string;
  initialLikes: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ id, initialLikes }) => {
  const { updateLikes } = useData();
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Check local storage on mount to see if user already liked this post
  useEffect(() => {
    const storageKey = `liked-blog-${id}`;
    if (localStorage.getItem(storageKey)) {
      setHasLiked(true);
    }
  }, [id]);

  // Sync with initialLikes prop if it updates from server
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleLike = async () => {
    setAnimating(true);
    const storageKey = `liked-blog-${id}`;
    
    let delta = 0;

    if (hasLiked) {
      // Remove like
      delta = -1;
      setLikes(prev => Math.max(0, prev - 1));
      setHasLiked(false);
      localStorage.removeItem(storageKey);
    } else {
      // Add like
      delta = 1;
      setLikes(prev => prev + 1);
      setHasLiked(true);
      localStorage.setItem(storageKey, 'true');
    }
    
    // Call DB update in background
    await updateLikes(id, delta);
    
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button 
        onClick={handleLike}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
          hasLiked 
            ? 'bg-blue-100 text-accent scale-110' 
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:scale-105'
        }`}
        aria-label={hasLiked ? "Unlike" : "Like"}
        title={hasLiked ? "You liked this!" : "Like this post"}
      >
        <ThumbsUp 
            size={24} 
            className={`transition-transform duration-300 ${animating && !hasLiked ? '-rotate-12' : ''} ${hasLiked ? 'fill-current' : ''}`} 
        />
      </button>
      <div className={`text-sm font-medium transition-colors ${hasLiked ? 'text-accent' : 'text-gray-400'}`}>
        {likes} {likes === 1 ? 'Like' : 'Likes'}
      </div>
    </div>
  );
};

export default LikeButton;