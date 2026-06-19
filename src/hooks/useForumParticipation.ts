import { useState, useEffect } from 'react';
import { useWorkerAuth } from './useWorkerAuth';

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
  const { callApi } = useWorkerAuth();

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchPosts = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'forum_posts',
        operation: 'select',
        where: { user_id: userId },
        orderBy: 'created_at DESC',
        limit: 200,
      });

      setPosts((data || []) as unknown as ForumParticipation[]);
      const likes = (data || []).reduce((sum, p) => sum + ((p as Record<string, unknown>).likes_received as number || 0), 0);
      const helpful = (data || []).reduce((sum, p) => sum + ((p as Record<string, unknown>).helpful_votes as number || 0), 0);
      setTotalLikes(likes);
      setTotalHelpfulVotes(helpful);
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
      const data = await callApi<Record<string, unknown>>('queryTable', {
        table: 'forum_posts',
        operation: 'insert',
        data: {
          user_id: userId,
          post_id: postId,
          post_title: postTitle,
          post_type: postType,
          likes_received: 0,
          helpful_votes: 0,
        },
      });

      await fetchPosts();
      return data as unknown as ForumParticipation;
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
      await callApi('queryTable', {
        table: 'forum_posts',
        operation: 'update',
        id: postId,
        data: {
          likes_received: likesReceived,
          helpful_votes: helpfulVotes,
        },
      });

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
      await callApi('queryTable', {
        table: 'forum_posts',
        operation: 'delete',
        id: postId,
      });

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
