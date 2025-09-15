import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Report {
  id: string
  reporter_id: string
  story_id?: string
  reason: string
  description?: string
  status: 'pending' | 'reviewed' | 'resolved'
  created_at: string
  reviewed_at?: string
  reviewed_by?: string
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

  const updateReportStatus = async (id: string, status: 'pending' | 'reviewed' | 'resolved', reviewedBy?: string) => {
    try {
      const updates: any = { 
        status,
        reviewed_at: new Date().toISOString()
      }
      
      if (reviewedBy) {
        updates.reviewed_by = reviewedBy
      }

      const { error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      await fetchReports()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report')
      throw err
    }
  }

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchReports()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete report')
      throw err
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return {
    reports,
    loading,
    error,
    fetchReports,
    updateReportStatus,
    deleteReport
  }
}