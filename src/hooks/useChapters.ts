import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Chapter {
  id: string
  story_id: string
  title: string
  content: string
  chapter_number: number
  status: 'draft' | 'published'
  view_count: number
  created_at: string
  updated_at: string
}

export function useChapters(storyId?: string) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChapters = async () => {
    if (!storyId) {
      setChapters([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', storyId)
        .order('chapter_number', { ascending: true })

      if (error) throw error
      setChapters(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chapters')
    } finally {
      setLoading(false)
    }
  }

  const createChapter = async (chapterData: {
    story_id: string
    title: string
    content: string
    chapter_number: number
  }) => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .insert({
          ...chapterData,
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error
      await fetchChapters()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chapter')
      throw err
    }
  }

  const updateChapter = async (id: string, updates: Partial<Chapter>) => {
    try {
      const { error } = await supabase
        .from('chapters')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      await fetchChapters()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update chapter')
      throw err
    }
  }

  const deleteChapter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchChapters()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete chapter')
      throw err
    }
  }

  const publishChapter = async (id: string) => {
    await updateChapter(id, { status: 'published' })
  }

  useEffect(() => {
    fetchChapters()

    // Set up real-time subscription only if we have a storyId
    if (!storyId) return

    const chaptersChannel = supabase
      .channel(`chapters-${storyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chapters',
          filter: `story_id=eq.${storyId}`
        },
        () => {
          fetchChapters()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(chaptersChannel)
    }
  }, [storyId])

  return {
    chapters,
    loading,
    error,
    fetchChapters,
    createChapter,
    updateChapter,
    deleteChapter,
    publishChapter
  }
}