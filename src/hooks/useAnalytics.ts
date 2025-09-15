import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface AnalyticsData {
  id: string
  story_id: string | null
  chapter_id: string | null
  user_id: string | null
  event_type: string
  metadata: any
  created_at: string
}

export function useAnalytics(authorId?: string) {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    if (!authorId) {
      setAnalytics([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('analytics')
        .select(`
          *,
          stories!inner (
            author_id
          )
        `)
        .eq('stories.author_id', authorId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAnalytics(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  const trackEvent = async (eventData: {
    story_id?: string
    chapter_id?: string
    user_id?: string
    event_type: string
    metadata?: any
  }) => {
    try {
      const { error } = await supabase
        .from('analytics')
        .insert(eventData)

      if (error) throw error
    } catch (err) {
      console.error('Failed to track event:', err)
    }
  }

  const getStoryStats = async (storyId: string) => {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('event_type')
        .eq('story_id', storyId)

      if (error) throw error

      const stats = {
        views: data?.filter(d => d.event_type === 'view').length || 0,
        likes: data?.filter(d => d.event_type === 'like').length || 0,
        comments: data?.filter(d => d.event_type === 'comment').length || 0,
        shares: data?.filter(d => d.event_type === 'share').length || 0,
      }

      return stats
    } catch (err) {
      console.error('Failed to get story stats:', err)
      return { views: 0, likes: 0, comments: 0, shares: 0 }
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [authorId])

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    trackEvent,
    getStoryStats
  }
}