import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Ad {
  id: string
  video_url: string
  start_date: string
  end_date: string
  impressions: number
  clicks: number
  created_at: string
  status?: string
}

export function useAds() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAds = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAds(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ads')
    } finally {
      setLoading(false)
    }
  }

  const createAd = async (adData: {
    video_url: string
    start_date: string
    end_date: string
  }) => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .insert(adData)
        .select()
        .single()

      if (error) throw error
      await fetchAds()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ad')
      throw err
    }
  }

  const updateAd = async (id: string, updates: Partial<Ad>) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      await fetchAds()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ad')
      throw err
    }
  }

  const deleteAd = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchAds()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ad')
      throw err
    }
  }

  const incrementImpressions = async (id: string) => {
    try {
      const { error } = await supabase.rpc('increment_ad_impressions', { ad_id: id })
      if (error) throw error
    } catch (err) {
      console.error('Failed to increment impressions:', err)
    }
  }

  const incrementClicks = async (id: string) => {
    try {
      const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: id })
      if (error) throw error
    } catch (err) {
      console.error('Failed to increment clicks:', err)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [])

  return {
    ads,
    loading,
    error,
    fetchAds,
    createAd,
    updateAd,
    deleteAd,
    incrementImpressions,
    incrementClicks
  }
}