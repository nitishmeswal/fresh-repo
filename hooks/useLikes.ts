import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/hooks/useUser';

export interface ModelLike {
  model_id: string;
  like_count: number;
  is_liked_by_user: boolean;
}

export const useLikes = (modelId: string) => {
  const [likeCount, setLikeCount] = useState<number>(7869);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { user } = useUser();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get like count
        const { data: likeData } = await supabase
          .from('model_like_counts')
          .select('like_count')
          .eq('model_id', modelId)
          .single();

        // Get user's like status
        const { data: userLike } = await supabase
          .from('model_likes')
          .select('id')
          .eq('model_id', modelId)
          .eq('user_id', user.id)
          .single();

        if (likeData) {
          setLikeCount(likeData.like_count);
        }
        setIsLiked(!!userLike);
      } catch (error) {
        console.error('Error fetching like status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikeStatus();

    // Subscribe to changes
    const channel = supabase
      .channel(`model_likes:${modelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'model_likes',
          filter: `model_id=eq.${modelId}`,
        },
        () => {
          fetchLikeStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [modelId, user, supabase]);

  const toggleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        await supabase
          .from('model_likes')
          .delete()
          .eq('model_id', modelId)
          .eq('user_id', user.id);
        
        setLikeCount(prev => Math.max(7869, prev - 1));
        setIsLiked(false);
      } else {
        await supabase
          .from('model_likes')
          .insert({
            model_id: modelId,
            user_id: user.id,
          });
        
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return {
    likeCount,
    isLiked,
    isLoading,
    toggleLike,
  };
};
