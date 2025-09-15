import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Comment {
  id: string
  content: string
  user_id: string
  story_id?: string
  chapter_id?: string
  created_at: string
  updated_at: string
}

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments')
    } finally {
      setLoading(false)
    }
  }

  const deleteComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
      throw err
    }
  }

  const updateComment = async (id: string, updates: Partial<Comment>) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      await fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment')
      throw err
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  return {
    comments,
    loading,
    error,
    fetchComments,
    deleteComment,
    updateComment
  }
}