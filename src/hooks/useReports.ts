import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Report {
  id: string
  reporter_id: string
  story_id: string | null
  reason: string
  description: string | null
  status: 'pending' | 'reviewed' | 'resolved'
  created_at: string
  reviewed_at: string | null
  reviewed_by: string | null
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  const updateReportStatus = async (id: string, status: 'pending' | 'reviewed' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status,
          reviewed_at: status !== 'pending' ? new Date().toISOString() : null 
        })
        .eq('id', id)

      if (error) throw error
      await fetchReports()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report')
      throw err
    }
  }

  useEffect(() => {
    fetchReports()

    // Set up real-time subscription
    const channel = supabase
      .channel('reports-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        fetchReports()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    reports,
    loading,
    error,
    fetchReports,
    updateReportStatus
  }
}