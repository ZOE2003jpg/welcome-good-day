import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Read {
  id: string
  reader_id: string
  novel_id: string
  chapter_id: string
  slide_number: number
  completed: boolean
  created_at: string
}

export function useReads(readerId?: string) {
  const [reads, setReads] = useState<Read[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReads = async () => {
    if (!readerId) {
      setReads([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reads')
        .select('*')
        .eq('reader_id', readerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReads(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reads')
    } finally {
      setLoading(false)
    }
  }

  const trackProgress = async (readerId: string, novelId: string, chapterId: string, slideNumber: number, completed = false) => {
    try {
      const { data, error } = await supabase.functions.invoke('track-progress', {
        body: {
          readerId,
          novelId,
          chapterId,
          slideNumber,
          completed
        }
      })
      
      if (error) throw error
      await fetchReads()
      return data
    } catch (err) {
      console.error('Failed to track progress:', err)
      throw err
    }
  }

  const getReadingProgress = (storyId: string, chapterId?: string) => {
    if (chapterId) {
      return reads.find(r => r.novel_id === storyId && r.chapter_id === chapterId)
    }
    return reads.filter(r => r.novel_id === storyId)
  }

  useEffect(() => {
    fetchReads()
  }, [readerId])

  // Realtime subscription for reads updates
  useEffect(() => {
    if (!readerId) return

    const channel = supabase
      .channel('reads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reads',
          filter: `reader_id=eq.${readerId}`
        },
        () => {
          fetchReads()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [readerId])

  return {
    reads,
    loading,
    error,
    fetchReads,
    trackProgress,
    getReadingProgress
  }
}