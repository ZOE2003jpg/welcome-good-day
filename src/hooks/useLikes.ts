import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Like {
  id: string
  user_id: string
  story_id: string
  created_at: string
}

export function useLikes(userId?: string) {
  const [likes, setLikes] = useState<Like[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLikes = async () => {
    if (!userId) {
      setLikes([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      setLikes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch likes')
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async (storyId: string, currentUserId: string) => {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('story_id', storyId)
        .single()

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', currentUserId)
          .eq('story_id', storyId)

        if (error) throw error

        // Update story like count
        const { error: decrementError } = await supabase
          .from('stories')
          .update({ 
            like_count: ((await supabase.from('stories').select('like_count').eq('id', storyId).single()).data?.like_count || 1) - 1 
          })
          .eq('id', storyId)
        
        if (decrementError) throw decrementError
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: currentUserId,
            story_id: storyId
          })

        if (error) throw error

        // Update story like count
        const { error: incrementError } = await supabase
          .from('stories')
          .update({ 
            like_count: ((await supabase.from('stories').select('like_count').eq('id', storyId).single()).data?.like_count || 0) + 1 
          })
          .eq('id', storyId)
        
        if (incrementError) throw incrementError
      }

      await fetchLikes()
      return !existingLike // Return new like status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like')
      throw err
    }
  }

  const isLiked = (storyId: string) => {
    return likes.some(like => like.story_id === storyId)
  }

  useEffect(() => {
    fetchLikes()
  }, [userId])

  return {
    likes,
    loading,
    error,
    fetchLikes,
    toggleLike,
    isLiked
  }
}