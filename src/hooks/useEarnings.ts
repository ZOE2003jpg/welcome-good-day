import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Earning {
  id: string
  writer_id: string
  story_id: string | null
  amount: number
  currency: string
  source: string | null
  created_at: string
  stories?: {
    title: string
  }
}

export function useEarnings(writerId?: string) {
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalEarnings, setTotalEarnings] = useState(0)

  const fetchEarnings = async () => {
    if (!writerId) {
      setEarnings([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('earnings')
        .select(`
          *,
          stories (
            title
          )
        `)
        .eq('writer_id', writerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const earningsData = data || []
      setEarnings(earningsData)
      
      // Calculate total earnings
      const total = earningsData.reduce((sum, earning) => sum + Number(earning.amount), 0)
      setTotalEarnings(total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch earnings')
    } finally {
      setLoading(false)
    }
  }

  const addEarning = async (earningData: {
    writer_id: string
    story_id?: string
    amount: number
    currency?: string
    source?: string
  }) => {
    try {
      const { error } = await supabase
        .from('earnings')
        .insert({
          ...earningData,
          currency: earningData.currency || 'USD'
        })

      if (error) throw error
      await fetchEarnings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add earning')
      throw err
    }
  }

  const getEarningsByMonth = () => {
    const monthlyEarnings: { [key: string]: number } = {}
    
    earnings.forEach(earning => {
      const date = new Date(earning.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyEarnings[monthKey] = (monthlyEarnings[monthKey] || 0) + Number(earning.amount)
    })

    return Object.entries(monthlyEarnings).map(([month, amount]) => ({
      month,
      amount
    }))
  }

  const getEarningsBySource = () => {
    const sourceEarnings: { [key: string]: number } = {}
    
    earnings.forEach(earning => {
      const source = earning.source || 'Other'
      sourceEarnings[source] = (sourceEarnings[source] || 0) + Number(earning.amount)
    })

    return Object.entries(sourceEarnings).map(([source, amount]) => ({
      source,
      amount
    }))
  }

  useEffect(() => {
    fetchEarnings()
  }, [writerId])

  return {
    earnings,
    loading,
    error,
    totalEarnings,
    fetchEarnings,
    addEarning,
    getEarningsByMonth,
    getEarningsBySource
  }
}