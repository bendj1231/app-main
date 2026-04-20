import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type PostType = 'question' | 'answer' | 'comment' | 'discussion';

export interface ForumParticipation {
  id: string;
  user_id: string;
  post_id: string | null;
  post_title: string;
  post_type: PostType;
  likes_received: number;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

export const useForumParticipation = (userId: string | null) => {
  const [posts, setPosts] = useState<ForumParticipation[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalHelpfulVotes, setTotalHelpfulVotes] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  const fetchPosts = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('forum_participation')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch forum posts:', error);
      } else {
        setPosts(data || []);
        const likes = (data || []).reduce((sum, p) => sum + (p.likes_received || 0), 0);
        const helpful = (data || []).reduce((sum, p) => sum + (p.helpful_votes || 0), 0);
        setTotalLikes(likes);
        setTotalHelpfulVotes(helpful);
      }
    } catch (error) {
      console.error('Error in fetchPosts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (
    postId: string | null,
    postTitle: string,
    postType: PostType
  ) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('forum_participation')
        .insert({
          user_id: userId,
          post_id: postId,
          post_title: postTitle,
          post_type: postType,
          likes_received: 0,
          helpful_votes: 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to add post:', error);
        return null;
      }

      await fetchPosts();
      return data;
    } catch (error) {
      console.error('Error in addPost:', error);
      return null;
    }
  };

  const updateEngagement = async (
    postId: string,
    likesReceived?: number,
    helpfulVotes?: number
  ) => {
    try {
      const { error } = await supabase
        .from('forum_participation')
        .update({
          likes_received: likesReceived,
          helpful_votes: helpfulVotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId);

      if (error) {
        console.error('Failed to update engagement:', error);
        return false;
      }

      if (userId) {
        await fetchPosts();
      }
      return true;
    } catch (error) {
      console.error('Error in updateEngagement:', error);
      return false;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('forum_participation')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Failed to delete post:', error);
        return false;
      }

      if (userId) {
        await fetchPosts();
      }
      return true;
    } catch (error) {
      console.error('Error in deletePost:', error);
      return false;
    }
  };

  const getPostsByType = (postType: PostType) => {
    return posts.filter(p => p.post_type === postType);
  };

  return {
    posts,
    totalLikes,
    totalHelpfulVotes,
    loading,
    fetchPosts,
    addPost,
    updateEngagement,
    deletePost,
    getPostsByType,
  };
};
